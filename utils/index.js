import { AES, enc } from "crypto-js";
import { customAlphabet } from "nanoid";

const genKey = () => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 20);
  return nanoid();
};

const encrypt = (data, key) => {
  return AES.encrypt(JSON.stringify(data), key).toString();
};

const decrypt = (ciphertext, key) => {
  const bytes = AES.decrypt(ciphertext, key);
  const str = bytes.toString(enc.Utf8);
  return str ? JSON.parse(str) : null;
};

export { genKey, encrypt, decrypt};