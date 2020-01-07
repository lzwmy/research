// import Vue from 'vue';

const vm  = new Vue();

/***
 * CRF 配置 2.0 接口
 *
 * **/
const url = {
  //查找所有的病种和病种关联的小节列表
  // CRFBakSearchAll:"/form/portion/search.do",
  //预览小节
  CRFPreviewPortion:'/form/portion/preview.do',
  //预览CRF 表单
  CRFReportPreview:'/form/crf/preview.do',
  // 新增小节
  CRFPortionBakSave:'/form/portion/add.do',
  //编辑小节
  CRFPortionBakModify:'/form/portion/edit.do',
  //查找所有的病种和病种关联的小节列表
  CRFPortionBakSearch:'/form/portion/search.do',
  //新增后编辑CRF 表单
  CRFBakSave:'/form/crf/save.do',
  //CRF表单首页列表, 根据病种获取所有的crf表单列表
  CRFAllList:'/form/crf/all/list.do',
  //删除小节
  CRFDeletePortion:"/form/portion/delete.do",
  //删除CRF 表单
  CRFDeleteForm:'/form/crf/delete.do',
  //获取小节ID
  CRFQueryPortionId:"/form/portion/generate/portionId.do",
  /***
   *  阅读模式
   * */
  // 审核报告 -- 是否添加批注
  readReportBakAudit:'/report/audit',
  // 获取报告所有批注
  getReportBakListNotation:"/report/list/notation",
  // 保存 备注
  reportBakNoteSave:"/report/note/save",
  // 获取报告 批注
  getReportBakNoteList:"/report/note/list",
  //删除备注
  reportBakNoteDelete:"/report/note/delete",
  //提交报告
  reportBakSubmit:"/report/submit",
  //获取 报告数据变化值
  getReportBakListDataChange:"/report/list/dataChange",
  // 召回报告
  reportBakCallback:"/report/callback",
  // 获取 回复列表
  getAnswerList:"/report/list/reply",
  //导出表单
  exportCrfForm: '/form/crf/export',
  //导入表单数据
  importCrfForm: '/form/crf/import',
  //获取报告最近一次 -批注
  getReportLastNotation:"/report/list/last/notation",
  // 获取报告最近一次 - 数据变化
  getReportLastDataChange:"/report/list/last/dataChange",
  // 获取报告最近一次 - 回复
  getReportLastReply:"/report/list/last/reply",
  /***
   *  crf启用禁用以及公共模板
   * */
  formCrfIsAvailable:"/form/crf/isAvailable",
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
  },
  /**
   *  阅读报告
   * */
  readReportBakAudit(params) {
    return vm.$post(url.readReportBakAudit,params,false);
  },
  getReportBakListNotation(params) {
    return vm.$get(url.getReportBakListNotation,params,false);
  },
  reportBakNoteSave(params) {
    return vm.$post(url.reportBakNoteSave,params,false);
  },
  getReportBakNoteList(params) {
    return vm.$get(url.getReportBakNoteList,params,true);
  },
  reportBakNoteDelete(params) {
    return vm.$get(url.reportBakNoteDelete,params,true);
  },
  reportBakSubmit(params) {
    return vm.$post(url.reportBakSubmit,params,false);
  },
  getReportBakListDataChange(params) {
    return vm.$get(url.getReportBakListDataChange,params,true);
  },
  reportBakCallback(params) {
    return vm.$get(url.reportBakCallback,params,true);
  },
  CRFExportCrfForm (params) {
    return vm.$postDown(url.exportCrfForm, params, true);
  },
  CRFImportCrfForm (params) {
    return vm.$fileUpload(url.importCrfForm, params);
  },
  getAnswerList(params) {
    return vm.$get(url.getAnswerList,params,true);
  },
  getReportLastNotation(params) {
    return vm.$get(url.getReportLastNotation,params,true);
  },
  getReportLastDataChange(params) {
    return vm.$get(url.getReportLastDataChange,params,true);
  },
  getReportLastReply(params) {
    return vm.$get(url.getReportLastReply,params,true);
  },
  /***
   *  crf启用禁用以及公共模板
   * */
  formCrfIsAvailable(params) {
    return vm.$post(url.formCrfIsAvailable,params,true);
  }
};

export default http;
