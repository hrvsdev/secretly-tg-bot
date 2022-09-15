import { encrypt } from "./utils/index.ts";

export const getData = (secret: string, key: string, type = "text") => {
  const data = {
    type: type,
    secret: secret,
    isEncryptedWithPassword: false,
    readReceiptEmail: "",
  };
  return encrypt(data, key);
};

export const getReplyButtons = (isTextURL: boolean) => {
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

export const getEditMsgOptions = (chatId: string, messageId: string) => {
  return {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
  disable_web_page_preview: true,
  };
};

export const getWelcomeMsg = (name = "user") => {
  return `Hello ${name} 👋🏼,\n\nSend me a secret and I will return with a *one-time* secret link. \nThe secret can be anything which is confidential like *password, key token, card number* or *OTP*.\n\nYou can also send me *URL* and I will ask if you want to redirect to it. \n\nYour data will always be *end-to-end encrypted* with the *HASH* which is never saved. \n\nFor more info: [Open Secretly](https://st.hrvs.me)`;
};
