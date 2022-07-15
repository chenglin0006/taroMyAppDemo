import Taro from "@tarojs/taro";
// 获取用户code
export const useLogin = () => {
  return new Promise((resolve, reject) => {
    Taro.login({
      success(res) {
        if (res.code) {
          resolve(res);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
      fail(err) {
        reject(err);
        console.log("useLogin:", err);
      }
    });
  });
};

export default {
  useLogin
};
