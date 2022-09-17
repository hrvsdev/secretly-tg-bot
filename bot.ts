import { Bot, isUrl, session } from "./deps.ts";

import { getDocId, saveSecret } from "./firebase/db.ts";
import { getData, getReplyButtons } from "./static.ts";
import { getWelcomeMsg, msgOptions } from "./static.ts";
import { addHttp, genKey } from "./utils/utils.ts";

import { type IEditMessage, type MyContext } from "./types.ts";

// Initialializing new bot
export const bot = new Bot<MyContext>(Deno.env.get("TOKEN") || "");

// Installing session middleware, and defining the initial session value.
bot.use(session({ initial: () => ({ input: "", q: 0 }) }));

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
    const q = await ctx.reply(replyText, getReplyButtons());

    // Storing data in session if options are shown
    ctx.session.input = msg;
    ctx.session.q = q.message_id;
  } else {
    const replyText = "Sending you secret link...";
    const reply = await ctx.reply(replyText);
    sendSecret(msg, "text", { chatId, msgId: reply.message_id });
  }
});

// Listening for callback query for 'text'
bot.callbackQuery("text", async (ctx) => {
  const chatId = ctx.chat?.id as number;
  const msgId = ctx.msg?.message_id as number;

  await ctx.answerCallbackQuery();
  if (msgId !== ctx.session.q) sendSessionExpired(chatId, msgId);
  else sendSecret(ctx.session.input, "text", { chatId, msgId });
});

// Listening for callback query for 'redirect'
bot.callbackQuery("redirect", async (ctx) => {
  const chatId = ctx.chat?.id as number;
  const msgId = ctx.msg?.message_id as number;

  await ctx.answerCallbackQuery();
  if (msgId !== ctx.session.q) sendSessionExpired(chatId, msgId);
  else sendSecret(addHttp(ctx.session.input), "redirect", { chatId, msgId });
});

// Handling inline query
bot.on("inline_query", async (ctx) => {
  if (!ctx.inlineQuery.query) return;

  // Generating document data and link
  const { docId, key, link, msg } = genDocAndLink();

  // Generating result id
  const resultId = `${docId}#${key}`;

  // Answering inline query
  await ctx.answerInlineQuery([
    {
      type: "article",
      id: resultId,
      title: "Click to send secret",
      description: link,
      input_message_content: {
        message_text: msg,
        ...msgOptions,
      },
    },
  ]);
});

// Saving database after user choose the result
bot.on("chosen_inline_result", (ctx) => {
  // Getting result data
  const query = ctx.chosenInlineResult.query;
  const resultIdArray = ctx.chosenInlineResult.result_id.split("#");

  // Getting doc id and key from result id
  const docId = resultIdArray[0];
  const key = resultIdArray[1];

  // Saving the secret to database
  saveSecret(getData(query, key), docId);
});

// Send message method
const sendSecret = (text: string, type: string, ids: IEditMessage) => {
  // Generating document data and link
  const { docId, key, msg } = genDocAndLink();

  // Editing the original message to avoid clutter and duplicate clicking
  bot.api.editMessageText(ids.chatId, ids.msgId, msg, msgOptions);

  // Saving the secret to database
  saveSecret(getData(text, key, type), docId);
};

// Generating random link for saving data
const genDocAndLink = () => {
  // Getting doc id to save data
  const docId = getDocId();

  // Generating a random key to encrypt
  const key = genKey();

  // Link of the secret
  const link = `https://st.hrvs.me/${docId}#${key}`;

  // Message for the secret
  const msg = `Your one-time secret link: \n\n${link}`;

  return { docId, key, link, msg };
};

// Session expired message
const sendSessionExpired = (chatId: number, msgId: number) => {
  const text = `The session has expired. \n*Please resend.*`;
  bot.api.editMessageText(chatId, msgId, text, msgOptions);
};
