import Time from "@/utils/time";

export const isString = function(str) {
  return toString.call(str) === "[object String]";
};
export const isArray = function(arr) {
  return toString.call(arr) === "[object Array]";
};
export const isBoolean = function(bool) {
  return toString.call(bool) === "[object Boolean]";
};
export const isUndefined = function(bool) {
  return toString.call(bool) === "[object Undefined]";
};
export const isNull = function(bool) {
  return toString.call(bool) === "[object Null]";
};
export const isNumber = function(num) {
  return toString.call(num) === "[object Number]";
};
export const isObject = function(obj) {
  return toString.call(obj) === "[object Object]";
};
export const isEmptyObject = function(obj) {
  if (!isObject(obj)) {
    return false;
  }
  for (const n in obj) {
    if (!isUndefined(obj[n])) {
      return false;
    }
  }
  return true;
};
export const isFunction = function(arg) {
  return toString.call(arg) === "[object Function]";
};
export const isSymbol = function(sym) {
  return toString.call(sym) === "[object Symbol]";
};
export const compareVersion = function(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
};

export const parse = function(str, decode = true) {
  if (str[0] === "?") {
    str = str.substr(1);
  }
  const params = {};
  str = str.split("&");
  for (let i = 0; i < str.length; i++) {
    const item = str[i].split("=");
    if (decode) {
      params[item[0]] = decodeURIComponent(item[1]);
    } else {
      params[item[0]] = item[1];
    }
  }
  return params;
};

export const stringify = function(obj, encode = true) {
  const str = [];
  for (const k in obj) {
    if (typeof obj[k] !== "undefined") {
      if (encode) {
        str.push(k + "=" + encodeURIComponent(obj[k]));
      } else {
        str.push(k + "=" + obj[k]);
      }
    }
  }
  return str.join("&");
};

export const dealUrl = url => {
  const params = {};
  const urlArr = url.split("?")[1].split("&");
  for (let i = 0; i < urlArr.length; i++) {
    const item = urlArr[i].split("=");
    params[item[0]] = item[1];
  }
  return params;
};

export const arrayCopy = function(params) {
  if (params) {
    return JSON.parse(JSON.stringify(params));
  }
};

export const limitFontSize = function(text, limit, needEllipsis) {
  if (text.length > limit) {
    return needEllipsis ? text.substr(0, limit) + "..." : text.substr(0, limit);
  } else {
    return text;
  }
};

export const dealParams = function(params = {}) {
  if (process.env.TARO_ENV === "alipay") {
    return params || {};
  } else {
    const newParams = {};
    for (const key in params) {
      newParams[key] = decodeURIComponent(params[key]);
    }
    return newParams;
  }
};

export const isPhoneNumber = function(phone) {
  const out = parseInt(phone);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(out)) return false;
  return /^1[3456789]\d{9}$/.test(out);
};

export const debounce = (fn, wait) => {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, wait);
  };
};

export const formatNumber = data => {
  const { value, startNum = 3, endNum = 4, replaceText = "****" } = data;

  const reg = new RegExp(`^(\\d{${startNum}})\\d*(\\d{${endNum}})$`);
  if (isPhoneNumber(value)) {
    return value.replace(reg, ($0, $1, $2) => `${$1 + replaceText + $2}`);
  } else {
    return value.replace(reg, ($0, $1, $2) => `${$1 + replaceText + $2}`);
  }
  // return value
};

export const removeStaticSourceHTTPSchema = function(data) {
  if (typeof data === "string") {
    if (/^http:/.test(data)) {
      return data.replace(/^http:/, "https:");
    }
    if (data.substr(0, 2) === "//") {
      return "https:" + data;
    }
  } else if (isArray(data)) {
    data.forEach((item, i) => {
      data[i] = removeStaticSourceHTTPSchema(item);
    });
  } else if (isObject(data)) {
    for (var k in data) {
      data[k] = removeStaticSourceHTTPSchema(data[k]);
    }
  }

  return data;
};

/**
 * 格式化输入的数字, 保留两位小数的正数
 *
 * @export
 * @param {string} num
 * @returns {string}
 */
export const foramtNumber = num => {
  let value = num.toString(); //先转换成字符串类型
  if (["", "0.0", "0"].includes(value)) return 0.01;
  if (value.indexOf(".") == 0) {
    //第一位就是 .
    console.log("first str is .");
    value = "0" + value;
  }
  // // 得到第一个字符是否为负号
  // const t = value.charAt(0);
  // 先把非数字的都替换掉，除了数字和.
  let temp = value.replace(/[^\d.]/g, "");
  // 必须保证第一个为数字而不是.
  temp = temp.replace(/^\./g, "");
  // 保证只有出现一个.而没有多个.
  temp = temp.replace(/\.{2,}/g, ".");
  // 保证.只出现一次，而不能出现两次以上
  temp = temp
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  // 只能输入两个小数
  temp = temp.replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
  //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
  if (temp.indexOf(".") < 0 && temp != "") {
    temp = parseFloat(temp);
  }
  return Number(temp);
};

export { Time };

export default {
  Time,
  stringify,
  foramtNumber
};
