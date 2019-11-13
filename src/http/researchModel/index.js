//科研建模
// import Vue from 'vue';

const vm = new Vue();
const url = {
  // 查询个人模型和通用模型的列表
  modelManageGetDataList: '/report/model/list.do',
  // 模板回显
  modelManageGetPreviewDataList: '/report/model/preview.do',
  //删除 模板
  modelManageDelete:"/report/model/delete.do",
  //获取动态表格
  queryDynamicTable:"/report/model/table.do",
  //表单查询
  searchCrf:"/report/model/find/crf.do",
  //查询树报告列表
  modelTreeList:"/report/model/find/crfList.do",
  //保存
  modelResearchSave:"/report/model/add.do",
  //编辑保存
  modelModifySave:"/report/model/edit.do",
  //导出动态表的Excel
  modelExportTable:"/report/model/export/table.do",
  //单文件下载
  fileDownLoadFile:"/file/download.do",
  //文件删除
  deleteFileId:'/file/deleteFile',
  //即时科研建模生成的患者数量和报告数
  modelDisplaySum:"/report/model/display/sum.do",
  //表单查询 new
  formSearchList:"/report/bak/model/find/crf.do",
  //树状报告列表 new
  formTreeReportList:"/report/bak/model/find/crfList.do",
  //新建模型保存 new
  createModelSave:"/report/bak/model/add.do",
  //个人模型和公共模型列表
  modelListNew:"/report/bak/model/list.do",
  //模型回显
  modelBakPreviewNew:"/report/bak/model/preview.do",
  //生成动态表
  modelDynamicTableListNew:"/report/bak/model/table.do",
  //编辑模型保存 new
  modelModifySaveNew:"/report/bak/model/edit.do",
  //删除模型
  modelDeleteRequest:"/report/bak/model/delete.do",
  //导出动态表Excel
  modelExportExcelNew:"/report/bak/model/export/table.do",
  //即时显示科研建模生成的患者人数和报告数
  modelRealTimeSearchNew:"/report/bak/model/display/sum.do",
  // 获取当前项病种信息
  getDiseaseInfo:"/diseasespecies/findDiseaseDetail.do",
};

const http = {
    modelManageGetDataList (params) {
        return vm.$post(url.modelManageGetDataList, params, true);
    },
    modelManageGetPreviewDataList (params) {
        return vm.$get(url.modelManageGetPreviewDataList, params, false);
    },
    modelManageDelete(params) {
        return vm.$post(url.modelManageDelete,params,true);
    },
    ModelQueryDynamicTable(params) {
        return vm.$get(url.queryDynamicTable,params,true)
    },
    modelQuerySearchCrf(params) {
      return vm.$post(url.searchCrf,params,false)
    },
  modelTreeList(params) {
      return vm.$post(url.modelTreeList,params,false)
  },
  modelResearchSave(params) {
      return vm.$post(url.modelResearchSave,params,false)
  },
  modelModifySave(params) {
      return vm.$post(url.modelModifySave,params,false)
  },
  modelExportTable(params) {
      return vm.$postDown(url.modelExportTable,params,false)
  },
  fileDownLoadFile(params) {
      return vm.$postDown(url.fileDownLoadFile,params,true)
  },
  deleteFileId(params) {
      return vm.$post(url.deleteFileId,params,true)
  },
  modelDisplaySum(params) {
      return vm.$post(url.modelDisplaySum,params,false);
  },
  formSearchList(params) {
      return vm.$post(url.formSearchList,params,false);
  },
  formTreeReportList(params) {
      return vm.$post(url.formTreeReportList,params,false);
  },
  createModuleSave(params) {
      return vm.$post(url.createModelSave,params,false);
  },
  modelListNew(params) {
      return vm.$post(url.modelListNew,params,true);
  },
  modelBakPreviewNew(params) {
      return vm.$get(url.modelBakPreviewNew,params,true);
  },
  modelDynamicTableListNew(params) {
      return vm.$get(url.modelDynamicTableListNew,params,true);
  },
  modelModifySaveNew(params) {
      return vm.$post(url.modelModifySaveNew,params,false);
  },
  modelDeleteRequest(params) {
      return vm.$post(url.modelDeleteRequest,params,true);
  },
  modelExportExcelNew(params) {
      return vm.$postDown(url.modelExportExcelNew,params,false);
  },
  modelRealTimeSearchNew(params) {
      return vm.$post(url.modelRealTimeSearchNew,params,false);
  },
  getDiseaseInfo(params) {
      return vm.$get(url.getDiseaseInfo,params,true);
  }
};

export default http;
