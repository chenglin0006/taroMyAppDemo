import { init } from "@rematch/core";
import createLoadingPlugin from "@rematch/loading";

const modulesFiles = require.context("./models", true, /\.js$/);

// 不需要"从 './modules/app'`
// 它将自动要求模块文件中的所有js模块
const models = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

const loading = createLoadingPlugin({ name: "loadingApi" });

const store = init({
  models,
  plugins: [loading]
});

export default store;
