//科研建模
import Vue from 'vue';

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
  formSearchList:"",
  //
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
  }
};

export default http;
