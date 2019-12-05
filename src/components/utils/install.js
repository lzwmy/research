// import axios from 'axios';
import utils from 'components/utils';
import qs from 'qs';
import { MessageBox, Message } from 'element-ui';
import http from 'src/http';
import store from '../../store/index'

axios.defaults.timeout = 0;
// `withCredentials` 表示跨域请求时是否需要使用凭证
// axios.defaults.withCredentials = true;

// 默认情况下，axios将JavaScript对象序列化为JSON。 要以应用程序/ x-www-form-urlencoded格式发送数据，您可以使用以下选项之一。
// 可以使用qs库对数据进行编码

// http请求拦截器
axios.interceptors.request.use(config => {
  //请求头带上token 凭证
  if (store.state.user.token) {
    config.headers.common['token'] = utils.decrypt(store.state.user.token);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.resolve(error.response);
});

function checkStatus (response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response;
  } 
  if(response && String(response.status).charAt(0) == '5'){
    //服务端异常
    utils.ssoLogout();
    return response;
  }
  // 异常状态下，把错误信息返回去
  Message({
    type: 'error',
    message: '网络异常 '+response.status,
    duration: 2000
  });
  return {
    status: -404,
    msg: '网络异常'
  };
}

/**
 * SUCCESS(0, "Success"),
  ERROR(1, "System error"),
  AUTHZ_ERR(10, "Authz err"),
  AUTHC_ERR(11, "Authc err"),
  NO_TOKEN(12, "缺少凭证"),
  TOKEN_INVALID(13, "凭证非法"),
  NO_RIGHT(14, "权限不足"),
  TOKEN_NOT_EXIST(15, "凭证无效"),
  NO_AUTH(16, "未授权"),
  ILLEGAL_REQ(19, "非法请求"),
  ILLEGAL_PARAM(20, "Illegal param"),
  UN_AUTHEN(30, "未经认证"),
  BUSINESS_ERR(40, "业务异常");
 */
function checkCode (res) {
  switch(String(res.data.code)){
    case '0': 
      return res.data;
    case '1': 
      Message({message: '系统开小差了',duration: 2000});
      return res.data;
    case '20': 
      Message({message: res.data.msg || '接口参数异常',duration: 2000});
      return res.data;
    case '40': 
      Message({message: res.data.msg || '业务异常',duration: 2000});
      return res.data;
    default:  
      utils.ssoLogout();
      break ;
  }
}

export default {
  install: function (Vue, options) {
    Vue.prototype.$notice = function (msg, duration) {
      var messages = document.querySelectorAll('.el-message');
      if (messages) {
        Array.prototype.forEach.call(messages, function (message) {
          document.body.removeChild(message);
        });
      }

      this.$message({
        message: msg,
        duration: duration || msg.length * 60000 / 500
      });
    };
    Vue.prototype.$axios = axios;
    Vue.prototype.$qs = qs;
    Vue.prototype.$http = http;
    // 经过checkStatus、checkCode处理
    Vue.prototype.$post = function (url, params = {}, IsFormData = true, config = {}) {
      return axios(Object.assign({
        method: 'post',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        data: IsFormData !== true ? params : qs.stringify(params)
      }, config)).then(
        (response) => {
          return checkStatus(response);
          // return checkCode(response);
        }
      ).then(
        (res) => {
          return checkCode(res);
        }
      );
    };
    Vue.prototype.$fileUpload = function (url, params) {
      return axios.post(url,params,
        {
          headers: {
            "content-type": "multipart/form-data"
          }
      }).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return checkCode(res);
        }
      );
    };
    // 只需要经过checkStatus处理
    Vue.prototype.$postDown = function (url, params = {}, IsFormData = true, config = {}) {
      return axios(Object.assign({
        method: 'post',
        responseType: 'blob',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        data: IsFormData !== true ? params : qs.stringify(params)
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return res;
        }
      );
    };
    // 只需要经过checkStatus处理
    Vue.prototype.$getDown = function (url, params = {}, IsFormData = true, config = {}) {
      return axios(Object.assign({
        method: 'get',
        responseType: 'blob',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        params: IsFormData !== true ? params : qs.stringify(params)
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return res;
        }
      );
    };
    // 经过checkStatus、checkCode处理
    Vue.prototype.$get = function (url, params = {}, config = {}) {
      return axios(Object.assign({
        method: 'get',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        params: params
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return checkCode(res);
        }
      );
    };
    // 经过checkStatus处理，不需要超时code = 10 的提示，所以不需要checkCode处理处理
    Vue.prototype.$getValidAuthenticated = function (url, params = {}, config = {}) {
      return axios(Object.assign({
        method: 'get',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        params: params
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      );
    };
    // 经过checkStatus、checkCode处理
    Vue.prototype.$put = function (url, params = {}, config = {}) {
      return axios(Object.assign({
        method: 'put',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        params: params
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return checkCode(res);
        }
      );
    };
    // 经过checkStatus、checkCode处理
    Vue.prototype.$patch = function (url, params = {}, config = {}) {
      return axios(Object.assign({
        method: 'patch',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        params: params
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return checkCode(res);
        }
      );
    };
    // 经过checkStatus、checkCode处理
    Vue.prototype.$delete = function (url, params = {}, config = {}) {
      return axios(Object.assign({
        method: 'delete',
        url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()),
        params: params
      }, config)).then(
        (response) => {
          return checkStatus(response);
        }
      ).then(
        (res) => {
          return checkCode(res);
        }
      );
    };
    Vue.prototype.$warning = function () {
      this.$alert('登录超时，系统已自动退出，请重新登录', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning',
        callback: action => {
          utils.ssoLogout();
        }
      });
    };
    Vue.prototype.historyGoBack = function (path) {
      if (typeof path === 'number') {
        path = 'index';
      }

      this.$router.push({
        path: path
      });
    };
    Vue.prototype.removeNullKey = function (obj, returnVal = 'obj') {
      let param = {};
      for (let key in obj) {
        if (obj[key] || obj[key] === false || obj[key] === 0) {
          if (returnVal == 'obj') {
            param[key] = obj[key];
          } else if (returnVal == 'str') {
            param += key + ':' + obj[key] + ',';
          }
        }
      }
      return param;
    };
    Vue.prototype.$format = function (obj) {
      const trim = function (string) {
        if (typeof string === 'string' && !string.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')) {
          return '';
        }
        if (typeof string === 'undefined') {
          return '';
        }
        return string;
      };
      let flag = false;
      if (typeof obj === 'string') {
        flag = true;
        obj = JSON.parse(obj);
      }
      for (let p in obj) {
        if (!trim(obj[p]) && obj[p] !== false && obj[p] !== 0) {
          delete obj[p];
        }
      }

      return flag ? JSON.stringify(obj) : obj;
    };
    Vue.prototype.toCustomString = function (date, option = 'time') {
      if (!date) {
        return '';
      }
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      // 日期时间分隔符
      const DIVIDER = ' ';

      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      hour = hour > 9 ? hour : '0' + hour;
      min = min > 9 ? min : '0' + min;
      sec = sec > 9 ? sec : '0' + sec;
      if (option === 'date') {
        return year + '-' + month + '-' + day;
      } else if (option === 'time') {
        return hour + ':' + min + ':' + sec;
      } else {
        return year + '-' + month + '-' + day + DIVIDER + hour + ':' + min + ':' + sec;
      }
    };
    // 下载文件，不兼容ie9
    Vue.prototype.$download = function (fileName, blob) {
      if (fileName) {
        let name = fileName.split('.');
        fileName = name[0] + '(' + this.toCustomString(new Date(), 'time', ' ') + ').' + name[1];
      }
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    };
    // 获取今日和三个月前的date对象
    Vue.prototype.getDefaultTime = function () {
      let endTime = new Date();
      let startTime = new Date();
      startTime.setMonth(startTime.getMonth() - 3);
      endTime.setDate(endTime.getDate() + 1);
      return {
        startTime,
        endTime
      };
    };
  }
};
