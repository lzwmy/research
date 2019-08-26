
import Vue from 'vue';

const vm = new Vue();
const url = {
  // 查询列表
  getDataList: '',

};

const http = {
  EPGetDataList (params) {
    return vm.$post(url.getDataList, params, false);
  }
  
};

export default http;
