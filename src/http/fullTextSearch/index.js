// import Vue from 'vue';

const vm = new Vue();

const url = {
//报告全文检索
  reportSearchMatch:"/report/match"
};

const http = {
  reportSearchMatch(params) {
    return vm.$get(url.reportSearchMatch,params,true)
  }
};

export default http;
