// 评分 接口
// import Vue from 'vue';

const vm = new Vue();

const url= {
  //保存报告中的评分
  scoreReportSave:"/report/save/reportScore.do",
  // 获取 报告的评分表数据
  getScoreReportPreview:"/report/get/reportScore.do",
};

const http = {
  scoreReportSave(params) {
    return vm.$post(url.scoreReportSave,params,false);
  },
  getScoreReportPreview(params) {
    return vm.$post(url.getScoreReportPreview,params,false);
  }
};

export default http;
