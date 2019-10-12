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
  //患者总体进度
  subjectPatientTotal:"/subject/progress/patient/total",
  //获取项目下的分组和阶段列表(发布的)
  subjectStagePublicList:"/subject/visit/stage/public/list",
  //组别下的研究内容填写情况统计
  subjectStageGroupTotal:"/subject/progress/patient/group/total",
  //录入员任务完成情况
  subjectProgressTaskTotal:"/subject/progress/task/total",
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
  },
  subjectPatientTotal(params) {
    return vm.$get(url.subjectPatientTotal,params,true);
  },
  subjectStagePublicList(params) {
    return vm.$get(url.subjectStagePublicList,params,true);
  },
  subjectStageGroupTotal(params) {
    return vm.$get(url.subjectStageGroupTotal,params,true);
  },
  subjectProgressTaskTotal(params) {
    return vm.$get(url.subjectProgressTaskTotal,params,true);
  }
};

export default http;
