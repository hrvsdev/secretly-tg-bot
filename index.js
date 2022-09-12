const TelegramBot = require("node-telegram-bot-api");
const { saveSecret, getDocRef } = require("./firebase/db");

const token = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const secret = getDocRef();

  bot.sendMessage(chatId, secret.id);
  
  await saveSecret({ text }, secret);

  bot.sendMessage(chatId, "Saved !");
});
