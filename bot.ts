import { Bot } from "https://deno.land/x/grammy@v1.11.0/mod.ts";
// import { getDocRef } from "./firebase/db.ts";
import { getWelcomeMsg } from "./static.ts";

const bot = new Bot("5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU");

bot.command(["start", "help"], (ctx) => {
  ctx.reply(getWelcomeMsg(ctx.from?.first_name), {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  });
});

// bot.on("message", (ctx) => ctx.reply(`Doc ref: ${getDocRef().id}`));

bot.start();
