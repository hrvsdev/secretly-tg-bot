import { AES, customAlphabet } from "../deps.ts";

const genKey = () => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 20);
  return nanoid();
};

// deno-lint-ignore no-explicit-any
const encrypt = (data: any, key: string): string =>
  AES.encrypt(JSON.stringify(data), key).toString();

const addHttp = (url: string) =>
  !/^https?:\/\//i.test(url) ? `http://${url}` : url;

export { genKey, encrypt, addHttp };
