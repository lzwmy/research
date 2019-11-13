// 系统管理 systemManage
// import Vue from 'vue';

const vm = new Vue();
const url = {
  /** 首页图表 */
  indexCasesByDisease: '/index/casesByDisease.do',
  //首页统计
  homepageStatistics:"/index/statistics.do",
  //病种病例数 分布
  homeDiseaseCasesBar:"/index/diseases/cases/bar.do",
  //病种病例增长趋势图
  homeDiseaseCasesLine:"/index/diseases/cases/line.do",
  //随访病例趋势图
  homeOutVisitLine:"/index/outVisit/line.do",
  //课程病例数分布
  homeSubjectsCasesBar:"/index/subjects/cases/bar.do",
  //医生病例录入趋势图
  homeContributionsReportsLine:"/index/contributions/reports/line.do",
};

const http = {
  indexCasesByDisease () {
    return vm.$post(url.indexCasesByDisease, {}, false);
  },
  homepageStatistics() {
    return vm.$post(url.homepageStatistics,{},false);
  },
  homeDiseaseCasesBar() {
    return vm.$post(url.homeDiseaseCasesBar,{},false);
  },
  homeDiseaseCasesLine() {
    return vm.$post(url.homeDiseaseCasesLine,{},false);
  },
  homeOutVisitLine() {
    return vm.$post(url.homeOutVisitLine,{},false);
  },
  homeSubjectsCasesBar() {
    return vm.$post(url.homeSubjectsCasesBar,{},false);
  },
  homeContributionsReportsLine() {
    return vm.$post(url.homeContributionsReportsLine,{},false);
  }
};

export default http;
