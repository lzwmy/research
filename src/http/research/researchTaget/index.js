//研究 指标

import Vue from 'vue';
const vm = new Vue();

const url = {
  //获取 科研下的 CRF 表单
  queryResearchForm:"/subject/crf/preview/crfs.do",
};

const http = {
  queryResearchForm(params) {
    return vm.$get(url.queryResearchForm,params,true);
  }
};

export default http;
