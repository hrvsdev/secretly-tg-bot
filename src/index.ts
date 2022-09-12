interface IPayload {
  message?: { chat: { id: string }; text: string };
}

export default {
  async fetch(req: Request) {
    if (req.method === "POST") {
      
      const payload: IPayload = await req.json();
      if (payload.message) {
        const bot = "5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU";
        const chatId = payload.message.chat.id;
        const text = payload.message.text + " over";
        const url = `https://api.telegram.org/bot${bot}/sendMessage?chat_id=${chatId}&text=${text}`;

        await fetch(url).then((resp) => resp.json());
      }
    }
    return new Response("OK");
  },
};
