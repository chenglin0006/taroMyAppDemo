import request from "@/utils/request";

const POST = "POST";

// 发起支付（APP可用）
export const doPayApi = (data, options) =>
  request({
    url: "/pay/cashier/doPay",
    method: POST,
    data,
    ...options
  });

// 查询支付结果（APP可用）
export const queryPayResultApi = (data, options) =>
  request({
    url: "/pay/cashier/queryPayResult",
    method: POST,
    data,
    ...options
  });
