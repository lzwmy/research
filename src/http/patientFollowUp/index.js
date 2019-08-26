
import Vue from 'vue';

const vm = new Vue();
const url = {
  // 查询列表
  getDataList: '/report/visitList.do',
  //推送消息
  associatePush: '/mp/associate/push',
};

const http = {
  PFUPgetDataList (params) {
    return vm.$post(url.getDataList, params, false);
  },
  PFUassociatePush (params) {
    return vm.$get(url.associatePush, params, false);
  }
};

export default http;
