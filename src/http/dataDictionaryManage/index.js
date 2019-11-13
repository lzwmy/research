// 数据字典  dataDictionaryManage
// import Vue from 'vue';

const vm = new Vue();
const url = {
  // 按模块查找元素
  crfFindElements: './crf/findElements.do',

  //医学代码集列表查询
  dataDictionaryFindList: '/term/group/list.do',
  //医代码集生成新的oid
  dataDictionaryCreateOid: '/term/group/create/oid.do',
  //删除医学代码集
  dataDictionaryDelete: '/term/group/delete.do',
  //根据id查找医学代码集
  dataDictionaryIDFindList: '/term/group/id/list.do',
  //保存编辑医学代码集
  dataDictionaryEdit: '/term/group/edit.do',
  //新增医学代码集
  dataDictionaryAdd: '/term/group/add.do',
  //根据医学代码名或者oid查询
  dataDictionaryfind: '/term/item/find.do',
  //手动添加代码集名
  dataDictionaryHandAdd:'/term/group/add/termItem.do',


  //获取医学显示名列表
  dataDictionaryMedicalCodeList: '/term/item/list.do',
  //生成新医学代码
  dataDictionaryCreateCode: '/term/item/create/code.do',
  //删除医学显示名
  dataDictionaryMedicalCodeDelete: '/term/item/delete.do',
  //编辑医学显示名
  dataDictionaryMedicalCodeEdit: '/term/item/edit.do',
  //添加医学显示名
  dataDictionaryMedicalCodeAdd: '/term/item/add.do',
  //删除医学代码项
  dataDictionaryMedicalCodeDeleteOne: '/term/item/deleteOne.do',
  //获取医学代码分类
  dataDictionaryMedicalCodeCategory: '/term/category/categoryName/list.do',
  //获取医学代码描述
  dataDictionaryMedicalCodeCategoryObject: '/term/item/{termItemCode}/termItem.do',


  //获取医学代码分类
  medicalCodeClassifyList: '/term/category/list.do',
  //添加医学代码分类名
  medicalCodeClassifyAdd: '/term/category/add.do',
  //删除医学代码分类项
  medicalCodeClassifyDelete: '/term/category/delete.do',
  //编辑医学代码分类项
  medicalCodeClassifyEdit: '/term/category/edit.do',
};

const http = {
  crfFindElements (params) {
    return vm.$post(url.crfFindElements, params, false);
  },
  dataDictionaryFindList(params) {
    return vm.$get(url.dataDictionaryFindList, params, true);
  },
  dataDictionaryCreateOid() {
    return vm.$get(url.dataDictionaryCreateOid);
  },
  dataDictionaryCreateCode() {
    return vm.$get(url.dataDictionaryCreateCode);
  },
  dataDictionaryDelete(params) {
    return vm.$post(url.dataDictionaryDelete, params, true);
  },
  dataDictionaryIDFindList(params) {
    return vm.$get(url.dataDictionaryIDFindList, params, false);
  },
  dataDictionaryAdd(params) {
    return vm.$post(url.dataDictionaryAdd, params, false);
  },
  dataDictionaryEdit(params) {
    return vm.$post(url.dataDictionaryEdit, params, false);
  },
  dataDictionaryfind(params) {
    return vm.$get(url.dataDictionaryfind, params, false);
  },
  dataDictionaryHandAdd(params) {
    return vm.$post(url.dataDictionaryHandAdd, params, false);
  },
  dataDictionaryMedicalCodeList(params) {
    return vm.$get(url.dataDictionaryMedicalCodeList, params, false);
  },
  dataDictionaryMedicalCodeDelete(params) {
    return vm.$post(url.dataDictionaryMedicalCodeDelete, params, true);
  },
  dataDictionaryMedicalCodeCategory(params) {
    return vm.$get(url.dataDictionaryMedicalCodeCategory, params, true);
  },
  dataDictionaryMedicalCodeCategoryObject(termItemCode) {
    return vm.$get("/term/item/"+termItemCode+"/termItem.do", null, true);
  },
  dataDictionaryMedicalCodeDeleteOne(params) {
    return vm.$post(url.dataDictionaryMedicalCodeDeleteOne, params, true);
  },
  dataDictionaryMedicalCodeEdit(params) {
    return vm.$post(url.dataDictionaryMedicalCodeEdit, params, false);
  },
  dataDictionaryMedicalCodeAdd(params) {
    return vm.$post(url.dataDictionaryMedicalCodeAdd, params, false);
  },
  medicalCodeClassifyList(params) {
    return vm.$get(url.medicalCodeClassifyList, params, true);
  },
  medicalCodeClassifyAdd(params) {
    return vm.$post(url.medicalCodeClassifyAdd, params, true);
  },
  medicalCodeClassifyDelete(params) {
    return vm.$post(url.medicalCodeClassifyDelete, params, true);
  },
  medicalCodeClassifyEdit(params) {
    return vm.$post(url.medicalCodeClassifyEdit, params, true);
  },
  
};

export default http;
