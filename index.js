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

  const reply = "*Recived your text* \n\nChoose one of the options:"

  const link = `st.hrvs.me/${docId}#${key}`;

  bot.sendMessage(chatId, reply, {
    disable_web_page_preview: true,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Text", callback_data: "text" },
          { text: "Redirect", callback_data: "redirect" },
        ],
        [{ text: "Decrypt it", url: "decrypt" }],
      ],
    },
  });

  bot.on("callback_query", (query)=>{
    const q = query.data
    
    const data = getData(text, key, "text");
    
    // await saveSecret(data, doc);
    
    // bot.sendMessage(chatId, "Saved !");
  })
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
