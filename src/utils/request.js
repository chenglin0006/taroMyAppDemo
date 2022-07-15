import Taro from "@tarojs/taro";
import qs from "qs";
import { removeStaticSourceHTTPSchema } from "@/utils/tools";
// import store from '@/store';
import CONSTANTS from "@/constants/index";

const getReqData = options => {
  let { data, method } = options;

  return method === "GET" ? data : JSON.stringify(data);
};

export const isDev = process.env.NODE_ENV !== "production";

const getReqUrl = options => {
  const { url } = options;

  const domain = isDev ? CONSTANTS.DEV_DOMAIN : CONSTANTS.DOMAIN;

  if (/^https?/.test(url)) {
    return url;
  }

  return domain + url;
};

const getReqHeader = () => {
  const header = {
    "Content-Type": "application/json"
  };
  return header;
};

const requestErr = response => {
  // console.log(response);
  // const { global } = store.getState();
  // const { dispatchSetGlobalInfo } = store.dispatch.global;
  const { code } = response;
  if (code === CONSTANTS.API_CODE_NEED_LOGIN) {
    // 中断请求
    return new Promise(() => {}).catch(err => {
      console.log(err);
    });
  } else {
    throw response;
  }
};
const requestSuccess = (response, options) => {
  if (response.code !== 200) {
    return requestErr(response);
  }
  response.data = removeStaticSourceHTTPSchema(response.result);

  if (options.proxy) {
    return response.data;
  } else {
    return {
      success: true,
      code: response.code,
      data: response.data,
      msg: response.message
    };
  }
};

const errorHandler = (err, options) => {
  Taro.hideLoading();
  // 当请求status不为200时，出错信息的数据会存在两个地方，一个是data里，一个是data同级的字段里
  if (err.data && err.data.errorMessage) {
    err = err.data;
  }
  const error = { success: false };
  if (err.errorMessage && err.errorMessage === "JSON parse data error") {
    err.errorMessage = "服务无法访问";
  }
  if (err.errMsg && err.errMsg.indexOf("request:fail") > -1) {
    err.errorMessage = "网络不可用";
  }
  error.msg = err.message || err.errorMessage || err.errMsg || "服务端开小差了";
  error.code = err.code || err.status || err.error || -1;
  if (options.pageError) {
    throw error;
  } else if (options.proxy) {
    error.proxy = true;
    throw error;
  } else {
    return {
      success: false,
      code: error.code,
      msg: error.msg
    };
  }
};

const codeHandler = err => {
  /**
   *  TODO code码解释
   *  2 跳回小程序
   *  3 订单已支付成功 跳转成功页面
   *  5 订单失效  跳转首页
   *  500 错误
   **/
  const showModal = (title, msg, success) => {
    return Taro.showModal({
      showCancel: false,
      title,
      content: msg,
      success(res) {
        if (res.confirm) success();
      }
    });
  };

  const codeMap = new Map([
    [
      1,
      () => {
        Taro.showToast({
          title: err.message,
          icon: "error",
          duration: 3000
        });
      }
    ],
    [2, () => {}],
    [
      3,
      () =>
        showModal("提示", err.message, () =>
          Taro.reLaunch({ url: "/pages/payOff/index" })
        )
    ],
    [
      5,
      () =>
        showModal("提示", err.message, () =>
          Taro.reLaunch({ url: "/pages/staging/index" })
        )
    ],
    [
      500,
      () =>
        Taro.showToast({
          title: err.message,
          icon: "error",
          duration: 3000
        })
    ]
  ]);
  return codeMap.get(err.code)(err);
};

/**
 * options 参数说明
 * proxy: 错误信息是否自动以toast处理。默认为true
 */

export default async (options = {}) => {
  options.method = (options.method || "GET").toUpperCase();
  options.timestamp = +new Date();
  options.proxy = options.proxy !== false;
  // operatePlatform : 4 => 告诉后端为小程序调用
  options.data = { ...options.data, operatePlatform: 4 };
  try {
    let response;
    if (options.url) {
      if (options.type == "formData") {
        response = await Taro.request({
          url: getReqUrl(options),
          data: qs.stringify(options.data),
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: options.method
        });
      } else {
        response = await Taro.request({
          url: getReqUrl(options),
          data: getReqData(options),
          header: getReqHeader(options),
          method: options.method
        });
      }
    } else {
      options.url = "/xxx";
      response = await Taro.uploadFile({
        url: getReqUrl(options),
        filePath: options.data,
        fileType: "image",
        name: "file"
        // header: getReqHeader('upload'),
      });
      if (response.data) {
        response.data = JSON.parse(response.data);
      }
    }

    if (response.statusCode === 404) throw new Error("错误");
    return requestSuccess(response.data, options);
  } catch (err) {
    if ([1, 2, 3, 5, 500].includes(err.code)) {
      codeHandler(err);
      // return err;
    }
    return errorHandler(err, options);
  }
};
