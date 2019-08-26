// 系统管理 systemManage
import Vue from 'vue';

const vm = new Vue();
const url = {
  /** 首页图表 */
  // 各课题病例数
  indexCasesBySubject: '/index/casesBySubject.do',
  // 各单病种库病例数
  indexCasesByDisease: '/index/casesByDisease.do',
  // 病例数——课题
  indexCountByCasesAndSubject: '/index/countByCasesAndSubject.do'
};

const http = {
  indexCasesBySubject () {
    return vm.$post(url.indexCasesBySubject, {}, false);
  },
  indexCasesByDisease () {
    return vm.$post(url.indexCasesByDisease, {}, false);
  },
  indexCountByCasesAndSubject () {
    return vm.$post(url.indexCountByCasesAndSubject, {}, false);
  }
};

export default http;
