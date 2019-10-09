//研究 指标
import Vue from 'vue';
const vm = new Vue();

const url = {
  //获取 科研下的 CRF 表单
  queryResearchForm:"/subject/crf/preview/crfs.do",
  //删除CRF 表单
  deleteFormData:"/subject/crf/delete.do",
  //生成CRF 表单 id
  queryFormId:"/subject/crf/create.do",
  // 表单 保存
  researchFormSave:"/subject/crf/save.do",
  //研究 指标 表单关联关系 保存
  researchRelationSave:"/subject/info/edit/crf.do",
};

const http = {
  queryResearchForm(params) {
    return vm.$get(url.queryResearchForm,params,true);
  },
  deleteFormData(params) {
    return vm.$post(url.deleteFormData,params,true);
  },
  queryFormId(params) {
    return vm.$get(url.queryFormId);
  },
  researchFormSave(params) {
    return vm.$post(url.researchFormSave,params,false);
  },
  researchRelationSave(params) {
    return vm.$post(url.researchRelationSave,params,false);
  }
};

export default http;
