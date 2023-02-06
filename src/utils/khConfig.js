import config from "@static/kh.config";
let khConfig = {
  host: {},
  api: {},
  msg: {},
  components: {},
  isLoad: false,
};
// 初始化配置文件
function load() {
  if (khConfig.isLoad) return khConfig;
  khConfig.isLoad = true;
  khConfig.host = config.host;
  khConfig.host.basePath =
    process.env.VUE_APP_BASE_URL || khConfig.host.basePath || "";
  khConfig.api = config.api;
  khConfig.msg = config.msg;
  khConfig.components = config.components;
  return khConfig;
}

export default {
  instance: load(),
  //注册插件
  install(Vue) {
    if (Vue.prototype.khConfig) return;
    load();
    Vue.prototype.khConfig = khConfig;

    Vue.filter("KHImg", (value) => {
      if (!value) return;
      return khConfig.host.rest + khConfig.api.imageDownload + "/" + value;
    });
  },
};
