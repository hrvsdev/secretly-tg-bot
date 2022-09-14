const { AES, enc } = require("crypto-js");
const { customAlphabet } = require("nanoid");

const genKey = () => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 20);
  return nanoid();
};

const encrypt = (data, key) => {
  return AES.encrypt(JSON.stringify(data), key).toString();
};

const addHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;

module.exports = { genKey, encrypt, addHttp};
