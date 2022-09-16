import { Context, SessionFlavor } from "https://deno.land/x/grammy@v1.11.0/mod.ts";

export interface IEditMessage {
  chatId: number | string;
  msgId: number;
}

export interface ISession {
  input: string;
}

// Flavor the context type to include sessions.
export type MyContext = Context & SessionFlavor<ISession>;