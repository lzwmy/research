// 治疗分析

// import Vue from 'vue';

const vm = new Vue();

const url = {
  //查找病人的治疗结果和治疗评语
  queryTreatmentInfo:"/disease/treatment/get",
  //新增或编辑病人的治疗结果和治疗评语
  addTreatmentInfo:"/disease/treatment/save",
  //获取 对比数据报告患者
  queryReportList:"/report/treatment/dynamic/get.do",
};

const http = {
  queryTreatmentInfo(params) {
    return vm.$post(url.queryTreatmentInfo,params,true)
  },
  addTreatmentInfo(params) {
    return vm.$post(url.addTreatmentInfo,params,false)
  },
  queryReportList(params) {
    return vm.$post(url.queryReportList,params,false)
  }
};

export default http;
