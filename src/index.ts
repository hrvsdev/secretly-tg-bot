import { Message, SendMessageOption } from "../telegram";

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

        const msg = `Hello ${name}, \nMessage: ${text} \n\nHave a great day 😎`;
        const data = { chat_id: chatId, text: msg };

        await send(bot, data);
      }
    }
    return new Response("OK");
  },
};

const send = async (botKey: string, data: any) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  };

  const url = `https://api.telegram.org/bot${botKey}/sendMessage`;
  await fetch(url, options);
};
