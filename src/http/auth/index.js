// 专病科研 SDResearch
// import Vue from 'vue';

const vm = new Vue();
const url = {
  // 校验浏览器自带session是否已经登录和过期
  checkToken: '/auth/validation.do'
};

const http = {
  ckeckTokenAPI () {
    return vm.$getValidAuthenticated(url.checkToken);
  }
};

export default http;
