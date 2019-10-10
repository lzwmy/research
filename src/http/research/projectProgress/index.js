//项目进度
import Vue from 'vue';

const vm = new Vue();

const url = {
  //随访情况明细
  subjectVisitDetail:"/subject/progress/visit/detail",
  //随访总体进度
  subjectVisitTotal:"/subject/progress/visit/total",
  //获取阶段下的随访情况
  subjectVisitStageDetail:"/subject/progress/visit/stage/detail",
};

const http = {
  subjectVisitDetail(params) {
    return vm.$get(url.subjectVisitDetail,params,true);
  },
  subjectVisitTotal(params) {
    return vm.$get(url.subjectVisitTotal,params,true);
  },
  subjectVisitStageDetail(params) {
    return vm.$get(url.subjectVisitStageDetail,params,true);
  }
};

export default http;
