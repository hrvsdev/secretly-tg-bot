import { ParseMode } from "https://deno.land/x/grammy@v1.11.0/types.deno.ts";
import { encrypt } from "./utils/index.ts";

interface IMsgOptions {
  parse_mode: ParseMode;
  disable_web_page_preview: boolean;
}

export const msgOptions: IMsgOptions = {
  parse_mode: "Markdown",
  disable_web_page_preview: true,
};

export const getData = (secret: string, key: string, type = "text") => {
  const data = {
    type: type,
    secret: secret,
    isEncryptedWithPassword: false,
    readReceiptEmail: "",
  };
  return encrypt(data, key);
};

export const getReplyButtons = () => {
  const reply_markup = {
    inline_keyboard: [
      [
        { text: "Text", callback_data: "text" },
        { text: "Redirect", callback_data: "redirect" },
      ],
    ],
  };

  return { ...msgOptions, reply_markup };
};

export const getEditMsgOptions = (chatId: string, messageId: string) => {
  return {
    chat_id: chatId,
    message_id: messageId,
    ...msgOptions
  };
};

export const getWelcomeMsg = (name = "user") => {
  return `Hello ${name} 👋🏼,\n\nSend me a secret and I will return with a *one-time* secret link. \nThe secret can be anything which is confidential like *password, key token, card number* or *OTP*.\n\nYou can also send me *URL* and I will ask if you want to redirect to it. \n\nYour data will always be *end-to-end encrypted* with the *HASH* which is never saved. \n\nFor more info: [Open Secretly](https://st.hrvs.me)`;
};
