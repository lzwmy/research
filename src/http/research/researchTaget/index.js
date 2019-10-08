//研究 指标

import Vue from 'vue';
const vm = new Vue();

const url = {
  //获取 科研下的 CRF 表单
  queryResearchForm:"/subject/crf/preview/crfs.do",
  //删除CRF 表单
  deleteFormData:"/subject/crf/delete.do",
};

const http = {
  queryResearchForm(params) {
    return vm.$get(url.queryResearchForm,params,true);
  },
  deleteFormData(params) {
    return vm.$post(url.deleteFormData,params,true);
  }
};

export default http;
