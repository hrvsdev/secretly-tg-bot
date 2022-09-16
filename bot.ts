import { Bot, session } from "https://deno.land/x/grammy@v1.11.0/mod.ts";

import { getDocRef, saveSecret } from "./firebase/db.ts";
import { getData, getReplyButtons } from "./static.ts";
import { getWelcomeMsg, msgOptions } from "./static.ts";
import { addHttp, genKey } from "./utils/index.ts";

import { type IEditMessage, type MyContext } from "./types.ts";

// Initialializing new bot
const bot = new Bot<MyContext>("5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU");

// Installing session middleware, and defining the initial session value.
bot.use(session({ initial: () => ({ input: "" }) }));

// Welcome message on start and help command
bot.command(["start", "help"], (ctx) => {
  ctx.reply(getWelcomeMsg(ctx.from?.first_name), msgOptions);
});

// Handling when message is a URL
bot.on("msg::url", async (ctx) => {
  // Chat id and text sent by user
  ctx.session.input = ctx.message?.text as string;

  // Replying the user
  const replyText = "Choose a option:";
  await ctx.reply(replyText, getReplyButtons());
});

// Handling when message is a text
bot.on("msg:text", async (ctx) => {
  // Chat id and text sent by user
  const chatId = ctx.chat.id;
  const msg = ctx.msg.text;

  // Replying the user
  const replyText = "Sending you your secret ...";
  const reply = await ctx.reply(replyText);
  sendMessage(msg, "text", { chatId, msgId: reply.message_id });
});

// Listening for callback query for 'text'
bot.callbackQuery("text", async (ctx) => {
  const chatId = ctx.chat?.id as number;
  const msgId = ctx.msg?.message_id as number;

  await ctx.answerCallbackQuery();
  sendMessage(ctx.session.input, "text", { chatId, msgId });
});

// Listening for callback query for 'redirect'
bot.callbackQuery("redirect", async (ctx) => {
  const chatId = ctx.chat?.id as number;
  const msgId = ctx.msg?.message_id as number;

  await ctx.answerCallbackQuery();
  sendMessage(addHttp(ctx.session.input), "redirect", { chatId, msgId });
});

bot.start();

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
