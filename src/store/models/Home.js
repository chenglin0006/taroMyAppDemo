// * 一次性付款页面

import { doPayApi, queryPayResultApi } from "@/service/Home";

const Home = {
  state: {},
  reducers: {
    saveData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async doPay(data) {
      const res = await doPayApi(data);
      return res;
    },
    async queryPayResult(data) {
      const res = await queryPayResultApi(data);
      return res;
    }
  }
};
export default Home;
