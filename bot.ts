import { Bot } from "https://deno.land/x/grammy@v1.11.0/mod.ts";

import { getDocRef } from "./firebase/db.ts";
import { getReplyButtons, getWelcomeMsg, msgOptions } from "./static.ts";
import { addHttp, genKey } from "./utils/index.ts";

const bot = new Bot("5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU");

bot.command(["start", "help"], (ctx) => {
  ctx.reply(getWelcomeMsg(ctx.from?.first_name), msgOptions);
});

bot.on("msg::url", (ctx) => {
  // Chat id and text sent by user
  const chatId = ctx.chat.id;
  const msg = addHttp(ctx.message?.text as string);

  const reply = "*Recived your text:* \nChoose one of the options :";
  ctx.reply(reply, getReplyButtons());
});

bot.start();


const sendMessage = (text: string, type:string) => {
  
  // Getting document and its id to save data
  const doc = getDocRef();
  const docId = doc.id;

  // Generating a random key to encrypt
  const key = genKey();

  // Link of the secret
  const link = `Your one-time secret link: \n\n*https://st.hrvs.me/${docId}#${key}*`;

  // Editing the original message to avoid clutter and duplicate clicking
  bot.(link, getEditMsgOptions(chatId, msgId));

  // Saving the secret to database
  await saveSecret(getData(text, key, type), doc);
};