const TelegramBot = require("node-telegram-bot-api");
const isUrl = require("is-url");
const prependHttp = require("prepend-http");

const { saveSecret, getDocRef } = require("./firebase/db");
const { encrypt, genKey } = require("./utils");

const token = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";

const bot = new TelegramBot(token, { polling: true });

let text;

bot.on("message", async (msg) => {
  // Chat id and text sent by user
  const chatId = msg.chat.id;
  text = msg.text;

  // Checking if text is a URL
  const prependedText = prependHttp(text);
  const isTextURL = isUrl(prependHttp);

  // Reply to user after receiving text
  let reply;

  // Showing options only if text is URL
  if (isTextURL) {
    reply = "*Recived your text 📥:* \nChoose one of the options :"
  }
  else {
    reply = "Sending you your secret 📩"
  }

  // Sending reply with inline options for what to do
  bot.sendMessage(chatId, reply, getReplyOptions(isTextURL));
});

// Listening for user callback of option he clicked
bot.on("callback_query", async (query) => {
  // Query data
  const chatId = query.from.id;
  const type = query.data;
  const msgId = query.message.message_id;

  // Answering the query according to query option he chose
  await bot.answerCallbackQuery(query.id);
});

const sendMessage = async (text, type, bot, chatId, msgId) => {
  // Getting document and its id to save data
  const doc = getDocRef();
  const docId = doc.id;

  // Generating a random key to encrypt
  const key = genKey();

  // Link of the secret
  const link = `Your one-time secret link:\nhttps://st.hrvs.me/${docId}#${key}`;

  // Editing the original message to avoid clutter and duplicate clicking
  bot.editMessageText(link, getEditMsgOptions(chatId, msgId));

  // Saving the secret to database
  await saveSecret(getData(text, key, type), doc);
  bot.sendMessage(chatId, "Saved! 👍🏼");
};

const getEditMsgOptions = (chatId, messageId) => {
  return {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  };
};

const getData = (secret, key, type = "text") => {
  const data = {
    type: type,
    secret: secret,
    isEncryptedWithPassword: false,
    readReceiptEmail: "",
  };
  return encrypt(data, key);
};

const getReplyOptions = (isTextURL) => {
  const parse_mode = "Markdown"
  // const reply_markup = {
  //   inline_keyboard: [
  //     [
  //       { text: "Text", callback_data: "text" },
  //       { text: "Redirect", callback_data: "redirect" },
  //     ],
  //   ],
  // },

};
