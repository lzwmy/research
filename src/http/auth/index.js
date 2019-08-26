// 专病科研 SDResearch
import Vue from 'vue';

const vm = new Vue();
const url = {
  // 校验浏览器自带session是否已经登录和过期
  authValidAuthenticated: '/auth/validAuthenticated.do'
};

const http = {
  authLoginValidAuthenticated () {
    return vm.$getValidLoginAuthenticated(url.authValidAuthenticated, {});
  },
  authIndexValidAuthenticated () {
    return vm.$get(url.authValidAuthenticated, {});
  }
};

export default http;
