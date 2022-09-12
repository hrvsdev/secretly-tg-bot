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
        const name = payload.message.chat.first_name
        const text = payload.message.text

        const msg = `Hello ${name}, \nMessage: ${text} \n\nHave a great day 😎`;

        const url = `https://api.telegram.org/bot${bot}/sendMessage?chat_id=${chatId}&text=${msg}`;

        await fetch(url).then((resp) => resp.json());
      }
    }
    return new Response("OK");
  },
};
