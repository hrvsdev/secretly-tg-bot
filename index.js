const TelegramBot = require("node-telegram-bot-api");
const isUrl = require("is-url");

const { saveSecret, getDocRef } = require("./firebase/db");
const { encrypt, genKey, addHttp } = require("./utils");

const token = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";

const bot = new TelegramBot(token, { polling: true });

let text;

bot.on("message", async (msg) => {
  // Chat id and text sent by user
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  text = msg.text;

  // Sending welcome and help message on specific command
  if (text === "/start" || text === "/help") {
    await bot.sendMessage(chatId, getWelcomeMsg(name), {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
    return;
  }

  // Checking if text is a URL
  const httpText = addHttp(text);
  const isTextURL = isUrl(httpText);

  // Changing text if it is a URL
  text = isTextURL ? httpText : text;

  // Showing options only if text is URL
  if (isTextURL) {
    const reply = "*Recived your text:* \nChoose one of the options :";
    bot.sendMessage(chatId, reply, getReplyOptions(isTextURL));
  } else {
    const reply = "Sending you your secret";
    const m = await bot.sendMessage(chatId, reply, getReplyOptions(isTextURL));
    sendMessage(text, chatId, m.message_id);
  }
});

// Listening for user callback of option he clicked
bot.on("callback_query", async (query) => {
  // Query data
  const chatId = query.from.id;
  const type = query.data;
  const msgId = query.message.message_id;

  // Answering the query according to query option he chose
  await bot.answerCallbackQuery(query.id);

  // Sending message
  sendMessage(text, chatId, msgId, type);
});

const sendMessage = async (text, chatId, msgId, type = "text") => {
  // Getting document and its id to save data
  const doc = getDocRef();
  const docId = doc.id;

  // Generating a random key to encrypt
  const key = genKey();

  // Link of the secret
  const link = `Your one-time secret link: \n\n*https://st.hrvs.me/${docId}#${key}*`;

  // Editing the original message to avoid clutter and duplicate clicking
  bot.editMessageText(link, getEditMsgOptions(chatId, msgId));

  // Saving the secret to database
  // await saveSecret(getData(text, key, type), doc);
};

bot.on("inline_query", (query) => {
  if (!query.query) {
    const pl = {
      type: "article",
      id: 1,
      title: `Enter a secret please!`,
      input_message_content: { message_text: "It is 1" },
    };
    bot.answerInlineQuery(query.id, [pl], { cache_time: 10 });
    return;
  }

  const text1 = {
    type: "article",
    id: 1,
    title: `${query.query} - 1`,
    input_message_content: { message_text: "It is 1" },
  };

  const text2 = {
    type: "article",
    id: 2,
    title: `${query.query} - 2`,
    input_message_content: { message_text: "It is 2" },
  };

  const text3 = {
    type: "article",
    id: 3,
    title: `${query.query} - 3`,
    input_message_content: { message_text: "It is 3" },
  };

  bot.answerInlineQuery(query.id, [text1, text2, text3], { cache_time: 10 });
});

const getData = (secret, key, type = "text") => {
  const data = {
    type: type,
    secret: secret,
    isEncryptedWithPassword: false,
    readReceiptEmail: "",
  };
  return encrypt(data, key);
};

const getEditMsgOptions = (chatId, messageId) => {
  return {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  };
};

const getReplyOptions = (isTextURL) => {
  const parse_mode = "Markdown";
  const reply_markup = {
    inline_keyboard: [
      [
        { text: "Text", callback_data: "text" },
        { text: "Redirect", callback_data: "redirect" },
      ],
    ],
  };

  return isTextURL ? { parse_mode, reply_markup } : { parse_mode };
};

const getWelcomeMsg = (name = "user") => {
  return `Hello ${name} 👋🏼,\n\nSend me a secret and I will return with a *one-time* secret link. \nThe secret can be anything which is confidential like *password, key token, card number* or *OTP*.\n\nYou can also send me *URL* and I will ask if you want to redirect to it. \n\nYour data will always be *end-to-end encrypted* with the *HASH* which is never saved. \n\nFor more info: [Open Secretly](https://st.hrvs.me)`;
};
