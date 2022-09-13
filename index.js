const TelegramBot = require("node-telegram-bot-api");
const { saveSecret, getDocRef } = require("./firebase/db");
const { encrypt, genKey } = require("./utils");

const token = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const doc = getDocRef();
  const docId = doc.id;
  const key = genKey();

  const link = `st.hrvs.me/${docId}#${key}`;

  bot.sendMessage(chatId, link, { disable_web_page_preview: true });

  const data = getData(text, key);

  await saveSecret(data, doc);

  bot.sendMessage(chatId, "Saved !");
});

const getData = (secret, key) => {
  const data = {
    secret: secret,
    isEncryptedWithPassword: false,
    readReceiptEmail: "",
  };
  return encrypt(data, key);
};

const getHash = (url) => url.split("#")[1];
