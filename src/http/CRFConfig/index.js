// import Vue from 'vue';

const vm  = new Vue();

/***
 * CRF 配置 2.0 接口
 *
 * **/
const url = {
  //查找所有的病种和病种关联的小节列表
  // CRFBakSearchAll:"/form/portion/bak/search.do",
  //预览小节
  CRFPreviewPortion:'/form/portion/bak/preview.do',
  //预览CRF 表单
  CRFReportPreview:'/form/crf/bak/preview.do',
  // 新增小节
  CRFPortionBakSave:'/form/portion/bak/add.do',
  //编辑小节
  CRFPortionBakModify:'/form/portion/bak/edit.do',
  //查找所有的病种和病种关联的小节列表
  CRFPortionBakSearch:'/form/portion/bak/search.do',
  //新增后编辑CRF 表单
  CRFBakSave:'/form/crf/bak/save.do',
  //CRF表单首页列表, 根据病种获取所有的crf表单列表
  CRFAllList:'/form/crf/bak/all/list.do',
  //删除小节
  CRFDeletePortion:"/form/portion/bak/delete.do",
  //删除CRF 表单
  CRFDeleteForm:'/form/crf/bak/delete.do',
  //获取小节ID
  CRFQueryPortionId:"/form/portion/bak/generate/portionId.do",
};

const http = {
  // CRFBakSearchAll(params) {
  //   return vm.$post(url.CRFBakSearchAll,params,false);
  // },
  CRFPreviewPortion(params) {
    return vm.$post(url.CRFPreviewPortion,params,true);
  },
  CRFReportPreview(params) {
    return vm.$post(url.CRFReportPreview,params,true)
  },
  CRFPortionBakSave(params) {
    return vm.$post(url.CRFPortionBakSave,params,false)
  },
  CRFPortionBakModify(params) {
    return vm.$post(url.CRFPortionBakModify,params,false)
  },
  CRFPortionBakSearch(params) {
    return vm.$post(url.CRFPortionBakSearch,params,true)
  },
  CRFBakSave(params) {
    return vm.$post(url.CRFBakSave,params,false)
  },
  CRFReportList(params) {
    return vm.$post(url.CRFAllList,params,true)
  },
  CRFDeletePortion(params) {
    return vm.$post(url.CRFDeletePortion,params,false)
  },
  CRFDeleteForm(params) {
    return vm.$post(url.CRFDeleteForm,params,true)
  },
  CRFQueryPortionId(params) {
    return vm.$post(url.CRFQueryPortionId,{},true);
  }
};

export default http;
