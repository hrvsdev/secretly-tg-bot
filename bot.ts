import { Bot } from "https://deno.land/x/grammy@v1.11.0/mod.ts";

const bot = new Bot("");

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();