import Taro from "@tarojs/taro";

class Storage {
  static set(key, data) {
    return Taro.setStorage({ key, data: JSON.stringify(data) });
  }
  static get(key) {
    return new Promise((resolve, reject) => {
      Taro.getStorage({
        key,
        success: val => resolve(val),
        fail: err => reject(err)
      });
    });
  }
}

export default Storage;
