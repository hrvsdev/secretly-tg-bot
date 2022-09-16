import { Bot, isUrl, session } from "./deps.ts";

import { getDocRef, saveSecret } from "./firebase/db.ts";
import { getData, getReplyButtons } from "./static.ts";
import { getWelcomeMsg, msgOptions } from "./static.ts";
import { addHttp, genKey } from "./utils/utils.ts";

import { type IEditMessage, type MyContext } from "./types.ts";

// Initialializing new bot
export const bot = new Bot<MyContext>(Deno.env.get("TOKEN") || "");

// Installing session middleware, and defining the initial session value.
bot.use(session({ initial: () => ({ input: "", id: 0, q: 0 }) }));

// Welcome message on start and help command
bot.command(["start", "help", "env"], (ctx) =>
  ctx.reply(getWelcomeMsg(ctx.from?.first_name), msgOptions)
);

// Handling new messages
bot.on("msg:text", async (ctx) => {
  // Context data
  const msg = ctx.msg.text;
  const chatId = ctx.chat.id;

  // Checking if text is a URL
  const isTextUrl = isUrl(addHttp(msg));

  // Handling reply based on text
  if (isTextUrl) {
    const replyText = "Recived your secret:\n\n*Choose a option:*";
    const q = ctx.reply(replyText, getReplyButtons());

    // Storing data in session if options are shown
    ctx.session.input = msg;
    ctx.session.id = ctx.msg.message_id;
    ctx.session.q = (await q).message_id;
  } else {
    const replyText = "Sending you your secret ...";
    const reply = await ctx.reply(replyText);
    sendMessage(msg, "text", { chatId, msgId: reply.message_id });
  }
});

// Listening for callback query for 'text'
bot.callbackQuery("text", async (ctx) => {
  const chatId = ctx.chat?.id as number;
  const msgId = ctx.msg?.message_id as number;

  await ctx.answerCallbackQuery();
  if (msgId !== ctx.session.q) return;
  else sendMessage(ctx.session.input, "text", { chatId, msgId });
});

// Listening for callback query for 'redirect'
bot.callbackQuery("redirect", async (ctx) => {
  const chatId = ctx.chat?.id as number;
  const msgId = ctx.msg?.message_id as number;
  
  await ctx.answerCallbackQuery();
  if (msgId !== ctx.session.q) return;
  else sendMessage(addHttp(ctx.session.input), "redirect", { chatId, msgId });
});

// Send message method
const sendMessage = (text: string, type: string, ids: IEditMessage) => {
  // Getting document and its id to save data
  const doc = getDocRef();
  const docId = doc.id;

  // Generating a random key to encrypt
  const key = genKey();

  // Link of the secret
  const link = `Your one-time secret link: \n\n*https://st.hrvs.me/${docId}#${key}*`;

  // Editing the original message to avoid clutter and duplicate clicking
  bot.api.editMessageText(ids.chatId, ids.msgId, link, msgOptions);

  // Saving the secret to database
  saveSecret(getData(text, key, type), doc);
};
