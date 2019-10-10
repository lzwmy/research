
import Vue from 'vue';

const vm = new Vue();
const url = {
  // 查询列表
  getDataList: '/report/reprotList.do',
  //查询列表 new
  queryReportListNew:"/report/bak/reportList.do"
};

const http = {
  RRMgetDataList (params) {
    // return vm.$post(url.getDataList, params, false);
    return vm.$post(url.queryReportListNew, params, false);
  }
};

export default http;
