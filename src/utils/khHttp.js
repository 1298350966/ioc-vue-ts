import axios from "axios";
import khConfig from "../utils/khConfig";
import qs from "qs";
import { Notification, MessageBox, Message } from "element-ui";
const Config = khConfig.instance;
// host 路径
const Rest = Config.host.rest;
const service = axios.create({
  baseURL: Rest,
  withCredentials: false,
  timeout: 10000,
});

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  function (response) {
    let status = response.status;
    let data;
    if (status === 200) {
      data = response.data;
    }
    // 未登录
    if (data.errorcode === "no login") {
      location.href = data.redirect;
      return Promise.reject("no login");
    } else {
      return response;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);


//配置
export function fetch(url, method = "get", data = {}, timeout = 120000) {
  let config = {};
  // Ajax异步请求判断头部信息
  let header = { "X-Requested-With": "XMLHttpRequest" };
  method = method.toLowerCase();
  if (method === "post" || method === "put" || method === "patch") {
    config = {
      method: method,
      url: url,
      headers: header,
      data: data,
      timeout: timeout,
    };
  } else {
    config = {
      method: method,
      url: url,
      headers: header,
      params: data,
      timeout: timeout,
    };
  }
  return new Promise((resolve, reject) => {
    service(config)
      .then((response) => {
        let status = response.status;
        if (status === 200) {
          let errCode = response.data.errCode;
          if (
            errCode === undefined ||
            errCode === "" ||
            errCode === null ||
            errCode === 0
          ) {
            resolve(response.data);
          } else {
            Notification({
              title: "错误",
              message: response.data.errMsg,
              type: "error",
            });
            resolve("error");
          }
        } else {
          resolve("error");
          reject("data is undefined.");
        }
      })
      .catch((error) => {
        // 如果状态码为401,未授权状态则也跳转处理
        let status = error.response.status;
        if (status === 401) {
          if (error.response.data.errorcode === "no login") {
            location.href = error.response.data.redirect;
            return Promise.reject("no login");
          }
        } else {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          Notification({
            title: "错误",
            message: error.response.data.errMsg
              ? error.response.data.errMsg
              : error,
            type: "error",
          });
          resolve("error");
        }
      });
  });
}

export const PostJson = function (url, param) {
  // Ajax异步请求判断头部信息
  let header = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  let config = {
    method: "post",
    url: url,
    headers: header,
    data: JSON.stringify(param),
    timeout: 120000,
  };
  return new Promise((resolve, reject) => {
    service(config)
      .then((response) => {
        let status = response.status;
        if (status === 200) {
          let errCode = response.data.errCode;
          if (
            errCode === undefined ||
            errCode === "" ||
            errCode === null ||
            errCode === 0
          ) {
            resolve(response.data);
          } else {
            Notification({
              title: "错误",
              message: response.data.errMsg,
              type: "error",
            });
            resolve("error");
          }
        } else {
          resolve("error");
          reject("data is undefined.");
        }
      })
      .catch((error) => {
        // 如果状态码为401,未授权状态则也跳转处理
        let status = error.response.status;
        if (status === 401) {
          if (error.response.data.errorcode === "no login") {
            location.href = error.response.data.redirect;
            return Promise.reject("no login");
          }
        } else {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          Notification({
            title: "错误",
            message: error.response.data.errMsg
              ? error.response.data.errMsg
              : error,
            type: "error",
          });
          resolve("error");
        }
      });
  });
};
/**
 * get请求
 * @param url
 * @constructor
 */
export const Get = function (url, data) {
  return fetch(url, "get", data);
};

/**
 * Post请求
 * @param url
 * @param data
 * @constructor
 */
export const Post = function (url, data) {
  return fetch(url, "post", data);
};

export const PostFromData = function (url, data) {
  return new Promise((resolve, reject) => { 
    service
      .post(url, qs.stringify(data))
      .then((response) => {
        let status = response.status;
        if (status === 200) {
          let errCode = response.data.errCode;
          if (
            errCode === undefined ||
            errCode === "" ||
            errCode === null ||
            errCode === 0
          ) {
            resolve(response.data);
          } else {
            Notification({
              title: "错误",
              message: response.data.errMsg,
              type: "error",
            });
            resolve("error");
          }
        } else {
          resolve("error");
          reject("data is undefined.");
        }
      })
      .catch((error) => {
        // 如果状态码为401,未授权状态则也跳转处理
        let status = error.response.status;
        if (status === 401) {
          if (error.response.data.errorcode === "no login") {
            location.href = error.response.data.redirect;
            return Promise.reject("no login");
          }
        } else {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          Notification({
            title: "错误",
            message: error.response.data.errMsg
              ? error.response.data.errMsg
              : error,
            type: "error",
          });
          resolve("error");
        }
      });
  })  
};
/**
 * 新建标签打开链接
 * @param url
 * @constructor
 */
export const OpenUrl = function (url) {
  let wo = window.open(url);
  if (wo == null) {
    window.location.href = url;
  }
};

export default {
  Get,
  Post,
  PostFromData,
  PostJson,
  OpenUrl,
  /**
   * 注册插件
   * @param Vue
   */
  install(Vue) {
    Vue.prototype.$PostJson = PostJson;
    Vue.prototype.$Get = Get;
    Vue.prototype.$Post = Post;
    Vue.prototype.$OpenUrl = OpenUrl;
    Vue.prototype.$PostFromData = PostFromData;
  },
};
