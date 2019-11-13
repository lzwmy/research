// CRF管理 crfManage
// import Vue from 'vue';

const vm = new Vue();
const url = {
  // 获取树节点
  crfFindAllModules: './crf/findAllModules.do',
  // 按模块查找元素
  crfFindElements: './crf/findElements.do',
  // 模糊查找查找模块或元素
  crfFindModules: './crf/findModules.do',
  // 查找我的表单
  crfFindMyForms: './crf/findMyForms.do',
  // 查找全部表单
  crfFindAllForms: './crf/findAllForms.do',
  // 保存CRF表单
  crfSaveCrfForm: './crf/saveCrfForm.do',
  // 更新CRF表单
  crfUpdateCrfForm: './crf/updateCrfForm.do',
  // 保存并发布CRF表
  crfSaveAndPublishCrfForm: './crf/saveAndPublishCrfForm.do',
  // 删除CRF表单
  crfDeleteCrfForm: './crf/deleteCrfForm.do',
  // 发布CRF表单
  crfRenameCrfForm: './crf/renameCrfForm.do',

  // 专病查询
  diseasespeciesFindDiseaseSpecies: './diseasespecies/findDiseaseSpecies.do',
  // 根据CRF表单主键ID查找表单详细内容
  crfFindCrfFormById: './crf/findCrfFormById.do',
  // 根据表单名查找所有表单
  crfFindFormByName: './crf/findFormByName.do',

  // 根据ID查找CRF数据
  crfdataFindCrfDataByPGId: './crfdata/findCrfDataByPGId.do',
  // 查找表单关联的模块
  crfdataFindFormRefModules: './crfdata/findFormRefModules.do',
  // 查找病人病例数据
  crfdataFindPatientData: './crfdata/findPatientData.do',
  // 保存CRF数据
  crfdataSaveOrUpdateCrfData: './crfdata/saveOrUpdateCrfData.do'

};

const http = {
  crfFindAllModules () {
    return vm.$post(url.crfFindAllModules);
  },
  crfFindModules (params) {
    return vm.$post(url.crfFindModules, params, false);
  },
  crfFindMyForms () {
    return vm.$post(url.crfFindMyForms);
  },
  crfFindAllForms () {
    return vm.$post(url.crfFindAllForms);
  },
  crfSaveCrfForm (params) {
    return vm.$post(url.crfSaveCrfForm, params, false);
  },
  crfUpdateCrfForm (params) {
    return vm.$post(url.crfUpdateCrfForm, params, false);
  },
  crfSaveAndPublishCrfForm (params) {
    return vm.$post(url.crfSaveAndPublishCrfForm, params, false);
  },
  crfFindCrfFormById (params) {
    return vm.$post(url.crfFindCrfFormById, params, false);
  },
  crfDeleteCrfForm (params) {
    return vm.$post(url.crfDeleteCrfForm, params, false);
  },
  crfRenameCrfForm (params) {
    return vm.$post(url.crfRenameCrfForm, params, false);
  },
  crfFindFormByName (params) {
    return vm.$post(url.crfFindFormByName, params, false);
  },
  diseasespeciesFindDiseaseSpecies () {
    return vm.$post(url.diseasespeciesFindDiseaseSpecies);
  },
  crfdataFindCrfDataByPGId (params) {
    return vm.$post(url.crfdataFindCrfDataByPGId, params, false);
  },
  crfdataFindFormRefModules (params) {
    return vm.$post(url.crfdataFindFormRefModules, params, false);
  },
  crfdataFindPatientData (params) {
    return vm.$post(url.crfdataFindPatientData, params, false);
  },
  crfdataSaveOrUpdateCrfData (params) {
    return vm.$post(url.crfdataSaveOrUpdateCrfData, params, false);
  }

};

export default http;
