const publicKey = "a3930a2b969fe13b825283d8f5d7fb15";
const privatekey = "2c4cd3822e4a84d1a273407f1bb7c133055f6bc8";
const ts = new Date().getTime();
const hashMD5 = CryptoJS.MD5(ts + privatekey + publicKey).toString();
