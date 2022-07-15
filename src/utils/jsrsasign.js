// yarn add jsrsasign
import { KEYUTIL, KJUR } from "jsrsasign";
// 公钥
let pk =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMF4B4aDnV6j+yXiiXBYJjHM8sEgRicQ\n" +
  "TsRndPKocf4PyNTcd9D1046wRMdtV5cijT3oVzBXQYupN+VXmMiM7MMCAwEAAQ==\n" +
  "-----END PUBLIC KEY-----";

// 私钥
let priK =
  "-----BEGIN PRIVATE KEY-----\n" +
  "MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAwXgHhoOdXqP7JeKJ\n" +
  "cFgmMczywSBGJxBOxGd08qhx/g/I1Nx30PXTjrBEx21XlyKNPehXMFdBi6k35VeY\n" +
  "yIzswwIDAQABAkA+Zcj/kFlkGb05pcuwCS4gZ7pvoUoe9TqCS9/DF6LUTpFgsDlj\n" +
  "6AiXRng6BzlWqdn7//E/+BIInuh7Wn0q/j0hAiEA4xrWytU7EFCfilvy63oXzem2\n" +
  "um9fSqa4fksezyXtERECIQDaFZ0nIDdcACabh5JD7dEseqw85IMKUyfFNtLKaqog\n" +
  "kwIgKvg5C8eslTmr9hHPtJ41QtClskDAVu+UmNC905PpdwECIQCv4u60N49ua9C3\n" +
  "b0fP8WXacbWoBsSI9zgEHoszJYPAcQIhAIdENiYBXqHxVQByKZoRS4uG0UrRskxI\n" +
  "zMnAPlDWNOap\n" +
  "-----END PRIVATE KEY-----\n";

const setCode = str => {
  //此处操作与后端约定参数

  // 创建RSAKey对象
  //因为后端提供的是pck#8的密钥对，所以这里使用 KEYUTIL.getKey来解析密钥

  // 加密
  let pub = KEYUTIL.getKey(pk);
  let enc = KJUR.crypto.Cipher.encrypt(str, pub);

  return enc;
};

const getCode = enc => {
  // 解密
  let prv = KEYUTIL.getKey(priK);
  let dec = KJUR.crypto.Cipher.decrypt(enc, prv);

  return dec;
};

export default { setCode, getCode };
