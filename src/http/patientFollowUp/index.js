
// import Vue from 'vue';

const vm = new Vue();
const url = {
  // 查询列表
  // getDataList: '/report/visitList.do',
  getDataList: '/report/remind/task/list.do',
  //推送微信消息
  associatePush: '/mp/associate/push',
  //推送短信消息
  smsPush: '/report/push',
};

const http = {
  PFUPgetDataList (params) {
    return vm.$post(url.getDataList, params, false);
  },
  PFUassociatePush (params) {
    return vm.$get(url.associatePush, params, false);
  },
  PFUsmsPush (params) {
    return vm.$get(url.smsPush, params, true);
  }
};

export default http;
