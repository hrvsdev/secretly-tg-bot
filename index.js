const TelegramBot = require("node-telegram-bot-api");
const { saveSecret, getDocRef } = require("./firebase/db");
const { encrypt, genKey } = require("./utils");

const token = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  // Chat id and text sent by user
  const chatId = msg.chat.id;
  const text = msg.text;

  // Reply text to user to choose one option
  const reply = "*Recived your text* \n\nChoose one of the options:";

  // Sending reply with inline options for what to do
  bot.sendMessage(chatId, reply, getReplyOptions());

  // Listening for user callback of option he clicked
  bot.on("callback_query", async (query) => {
    // Query data type (which is the option he chose) and message id of query
    const type = query.data;
    const messageId = query.message.message_id;

    // Answering the query according to query option he chose
    bot.answerCallbackQuery(query.id);

    // If the option is 'text'
    if (type === "text") {
      // Getting document and its id to save data
      const doc = getDocRef();
      const docId = doc.id;

      // Generating a random key to encrypt
      const key = genKey();

      // Link of the secret
      const link = `Your secret link:\nhttps://st.hrvs.me/${docId}#${key}`;

      // Editing the original message to avoid clutter and duplicate clicking
      bot.editMessageText(link, { chat_id: chatId, message_id: messageId });

      // Saving the secret to database
      await saveSecret(getData(text, key, q), doc);
    } else {
      bot.editMessageText("It is under construction", {
        chat_id: chatId,
        message_id: messageId,
      });
    }
  });
});

const getData = (secret, key, type) => {
  const data = {
    type: type,
    secret: secret,
    isEncryptedWithPassword: false,
    readReceiptEmail: "",
  };
  return encrypt(data, key);
};

const getHash = (url) => url.split("#")[1];

const getReplyOptions = (arr) => {
  return {
    disable_web_page_preview: true,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Text", callback_data: "text" },
          { text: "Redirect", callback_data: "redirect" },
        ],
        [{ text: "Decrypt it", callback_data: "decrypt" }],
      ],
    },
  };
};
