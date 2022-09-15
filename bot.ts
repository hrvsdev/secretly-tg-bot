import { Bot } from "https://deno.land/x/grammy@v1.11.0/mod.ts";

const bot = new Bot("5681432295:AAFlKNc0IpI4JfTPumIpUL5tgk2GSpr6rDU");

bot.command("start", (ctx) => ctx.reply("Welcome User Up and running."));

bot.on("message", (ctx) => ctx.reply("Got a url!"));

bot.start();