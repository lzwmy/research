// CRF 请求管理
// import Vue from 'vue';

const vm = new Vue();
const url = {
  //条目
  //获取条目 数据
  crfEntryList: "/form/item/list.do",
  //删除 条目 --可以批量删除
  crfDelList: "/form/item/delete.do",
  //新增 条目
  crfAddList: "/form/item/add.do",
  //编辑保存
  crfEditList: "/form/item/edit.do",
  //编辑条目
  crfIDPreview: "/form/item/edit/preview.do",
  //按照一定规则设置值集
  crfCodeSet: "/term/group/create/term.do",
  //根据代码集名称或者oid查询代码集
  crfSearchCodeSet: "/term/group/oid/name/list.do",

  //删除医学显示名
  crfCodeSetDel: "/term/item/delete.do",
  //在代码集添加显示名
  crfADDTermItem: "/term/group/add/termItem.do",
  //获取全部单位
  crfUnitList: "/form/item/unit.do",
  //预览条目
  crfPreviewForm: "/form/item/edit/preview.do",
  // 弹框内列表
  crfSearchList: "/form/item/search/list.do",
  //获取所有的作者
  crfGetAuthor: "/form/author.do",
  //使用该条目的其他条目
  crfGetReferList: "/form/item/refer.do",
  //使用该条目得其它小节
  crfGetSectionList: "/form/item/portion/refer.do",
  /*
  *   小节接口
  */
  crfGetPortionList: "/form/portion/list.do",
  //删除小节
  ctfPortionDelete: "/form/portion/delete.do",
  // 小节 编辑 回显
  crfPortionModifyPreview: "/form/portion/edit/preview.do",
  //编辑小节 -- 保存
  crfEditPortion: "/form/portion/edit.do",
  //编辑 小节 --保存副本
  crfDuplicateSave: "/form/portion/duplicate.do",
  //新增小节
  crfAddPortionSave: "/form/portion/add.do",
  //删除
  crfPortionDelete: "/form/portion/delete.do",
  //小节预览
  crfSectionPreview: "/form/portion/edit/detail/preview.do",
  /*
   * 单页
   * */
  crfSinglePageList: "/form/page/list.do",
  //删除
  crfSinglePageDel: "/form/page/delete.do",
  //保存 --新增单页
  crfSingleSave: "/form/page/add.do",
  // 编辑 回显
  crfSingleEditPreview: "/form/page/edit/preview.do",
  //保存 -- 修改单页
  crfSingleEdit: "/form/page/edit.do",
  //保存副本
  crfPageDuplicate: "/form/page/duplicate.do",
  //单页预览 --编辑详情回显
  crfDetailPagePreview: "/form/page/edit/detail/preview.do",
  /*
  * 报告
  * */
  crfReportList: "/form/crf/list.do",
  //医学代码分类
  crfCategoryList: "/term/category/categoryName/list.do",
  //删除
  crfReportDelete: "/form/crf/delete.do",
  //保存CRF
  crfReportSave: "/form/crf/addOrEdit.do",
  //编辑回显
  crfReportEditPreview: "/form/crf/edit/preview.do",
  //报告预览 --编辑详情回显
  crfReportDetailPreview: "/form/crf/edit/detail/preview.do",

  //报告 -- 保存副本
  crfReportDuplicate: "/form/crf/duplicate.do",


  /**
   * 报告数据
   */
  //获取报告数据
  reportFindReport: "/report/findReport",
  //保存报告数据
  reportSaveReport: "/report/save",
  //根据oid获取代码集
  reportSearchTermSet: "term/group/id/list.do",

  /**
   * 数据绑定
   */
  //获取绑定类型
  searchBindingTypeList: '/form/binding/typeList.do',
  //获取绑定数据域及字段
  searchBindingViewList: '/form/binding/viewList.do',
  //获取绑定数据
  searchBindingDataList: '/form/binding/dataList.do',
  //自动获取绑定数据
  searchBindingAutoData: '/form/binding/auto/dataList.do'


};

const http = {
  /*
  *  条目
   */
  crfEntryList(params) {
    return vm.$post(url.crfEntryList, params, false)
  },
  crfDelList(params) {
    return vm.$post(url.crfDelList, params, false)
  },
  crfAddList(params) {
    return vm.$post(url.crfAddList, params, false)
  },
  crfEditList(params) {
    return vm.$post(url.crfEditList, params, false)
  },
  crfIDPreview(params) {
    return vm.$post(url.crfIDPreview, params, true)
  },
  crfCodeSet(params) {
    return vm.$post(url.crfCodeSet, params, false)
  },
  crfSearchCodeSet(params) {
    return vm.$get(url.crfSearchCodeSet, params)
  },
  crfCodeSetDel(params) {
    return vm.$post(url.crfCodeSetDel, params, true)
  },
  crfADDTermItem(params) {
    return vm.$post(url.crfADDTermItem, params, false)
  },
  crfUnitList() {
    return vm.$get(url.crfUnitList)
  },
  crfPreviewForm(params) {
    return vm.$post(url.crfPreviewForm, params, true)
  },
  crfSearchList(params) {
    return vm.$post(url.crfSearchList, params, false)
  },
  crfGetAuthor() {
    return vm.$get(url.crfGetAuthor)
  },
  crfGetReferList(params) {
    return vm.$get(url.crfGetReferList, params)
  },
  crfGetSectionList(params) {
    return vm.$get(url.crfGetSectionList, params)
  },
  /*
   * 小节
   * */
  crfGetPortionList(params) {
    return vm.$post(url.crfGetPortionList, params, false)
  },
  ctfPortionDelete(params) {
    return vm.$post(url.ctfPortionDelete, params, false)
  },
  crfPortionModifyPreview(params) {
    return vm.$post(url.crfPortionModifyPreview, params, true)
  },
  crfEditPortion(params) {
    return vm.$post(url.crfEditPortion, params, false)
  },
  crfDuplicateSave(params) {
    return vm.$post(url.crfDuplicateSave, params, false)
  },
  crfAddPortionSave(params) {
    return vm.$post(url.crfAddPortionSave, params, false)
  },
  crfPortionDelete(params) {
    return vm.$post(url.crfPortionDelete, params, false)
  },
  crfSectionPreview(params) {
    return vm.$post(url.crfSectionPreview, params, true)
  },
  /*
  * 单页
  * */
  crfSinglePageList(params) {
    return vm.$post(url.crfSinglePageList, params, false)
  },
  crfSinglePageDel(params) {
    return vm.$post(url.crfSinglePageDel, params, false)
  },
  crfSingleSave(params) {
    return vm.$post(url.crfSingleSave, params, false)
  },
  crfSingleEditPreview(params) {
    return vm.$post(url.crfSingleEditPreview, params, true)
  },
  crfSingleEdit(params) {
    return vm.$post(url.crfSingleEdit, params, false)
  },
  crfPageDuplicate(params) {
    return vm.$post(url.crfPageDuplicate, params, false)
  },
  crfDetailPagePreview(params) {
    return vm.$post(url.crfDetailPagePreview, params, true)
  },
  /*
  * 报告
  * */
  crfReportList(params) {
    return vm.$post(url.crfReportList, params, false)
  },
  crfCategoryList() {
    return vm.$get(url.crfCategoryList)
  },
  crfReportDelete(params) {
    return vm.$post(url.crfReportDelete, params, false)
  },
  crfReportSave(params) {
    return vm.$post(url.crfReportSave, params, false)
  },
  crfReportEditPreview(params) {
    return vm.$post(url.crfReportEditPreview, params, true)
  },
  crfReportDetailPreview(params) {
    return vm.$post(url.crfReportDetailPreview, params, true)
  },
  crfReportDuplicate(params) {
    return vm.$post(url.crfReportDuplicate, params, false)
  },
  /**
   * 报告数据
   */
  reportFindReport(params) {
    return vm.$get(url.reportFindReport, params)
  },
  reportSaveReport(params) {
    return vm.$post(url.reportSaveReport, params, false)
  },
  reportSearchTermSet(params) {
    return vm.$get(url.reportSearchTermSet, params)
  },
  searchBindingTypeList(params) {
    return vm.$post(url.searchBindingTypeList, params, false)
  },
  searchBindingViewList(params) {
    return vm.$get(url.searchBindingViewList, params)
  },
  searchBindingDataList(params) {
    return vm.$post(url.searchBindingDataList, params, false)
  },
  searchBindingAutoData(params) {
    return vm.$post(url.searchBindingAutoData, params, false)
  },
};
export default http;
