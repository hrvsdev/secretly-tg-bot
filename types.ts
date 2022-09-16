import { Context, SessionFlavor } from "./deps.ts";

export interface IEditMessage {
  chatId: number | string;
  msgId: number;
}

export interface ISession {
  input: string;
}

// Flavor the context type to include sessions.
export type MyContext = Context & SessionFlavor<ISession>;