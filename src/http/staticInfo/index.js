// 专病科研 SDResearch
// import Vue from 'vue';

const vm = new Vue();
const url = {
  // 专病查询（带权限）
  statisticsFindDiseaseList: '/statistics/findDiseaseList.do',
  // 疾病查询课题（带权限）
  statisticsFindSubjectList: '/statistics/findSubjectList.do',
  // 课题查询实验组（带权限）
  statisticsFindExperimentList: '/statistics/findExperimentList.do',
  // 信息统计列表
  statisticsCountCasesCrf: '/statistics/countCasesCrf.do'
};

const http = {
  statisticsFindDiseaseList () {
    return vm.$post(url.statisticsFindDiseaseList, {}, false);
  },
  statisticsFindSubjectList (params) {
    return vm.$post(url.statisticsFindSubjectList, params, false);
  },
  statisticsFindExperimentList (params) {
    return vm.$post(url.statisticsFindExperimentList, params, false);
  },
  statisticsCountCasesCrf (params) {
    return vm.$post(url.statisticsCountCasesCrf, params, false);
  }
};

export default http;
