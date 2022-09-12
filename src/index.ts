import { Message } from "../telegram";

interface IPayload {
  message?: Message;
}

export default {
  async fetch(req: Request) {
    if (req.method === "POST") {
      const payload: IPayload = await req.json();

      if (payload.message) {
        const bot = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";
        const chatId = payload.message.chat.id;
        const name = payload.message.chat.first_name;
        const text = payload.message.text;

        const msg = `${text} \n\nPeace out!`;

        const data = {
          chat_id: chatId,
          text: msg,
          reply_markup: {
            inline_keyboard: [[{ text: "Hello", callback_data: "Hello" }]],
          },
        };

        await send(bot, data);
      }
    }
    return new Response("OK");
  },
};

const send = async (botKey: string, data: any) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };

  const url = `https://api.telegram.org/bot${botKey}/sendMessage`;
  await fetch(url, options);
};
