
// import Vue from 'vue';

const vm = new Vue();
const url = {
  //查询列表
  queryReportList:"/report/reportList.do",
  //查询报告列表 new 
  queryReportListNew:"/report/get/list",
  //获取报告操作记录
  getReportRecord:"/report/logList.do",
  //查询Crf表单
  getListCrf:"/form/crf/enable/list.do",
  //获取报告状态列表
  getReportStatusList:"/report/status/list/count",
  //删除报告
  queryReportListDelete:""
};

const http = {
  RRMgetDataList (params) {
    return vm.$post(url.queryReportList, params, false);
  },
  RRMgetReportDataList (params) {
    return vm.$post(url.queryReportListNew, params, false);
  },
  RRMgetCrfList (params) {
    return vm.$post(url.getListCrf, params, true);
  },
  RRMgetReportStatusList (params) {
    return vm.$post(url.getReportStatusList, params, false);
  },
  RRMDeleteReport (params) {
    return vm.$post(url.queryReportListDelete, params, false);
  },
  RRMgetReportRecord (params) {
    return vm.$post(url.getReportRecord, params, true);
  }
};

export default http;
