/**
 * 360视图 view360
 */
import Vue from 'vue';

const vm = new Vue();
const url = {
  // 查询患者基本信息
  getBasicInfo: '/patientInfo/info.do',
    // 查询患者诊断记录
    getBasicDiagnosisRecord: '/patientInfo/out/diagnosis/list.do',
  // 查询患者住院、门诊记录
  getBasicRecord: '/patientInfo/record.do',
  // 查询患者检查信息列表
  getBasicRecordCheckList: '/patientInfo/exam/list.do',
  // 查询患者检验信息列表
  getBasicRecordTestList: '/patientInfo/lab/list.do',
  // 病历文书类别列表
    getBasicRecordFileListAll: '/patientInfo/out/emr/list',
  // 查询检查类别列表
  getBasicRecordCheckListAll: '/patientInfo/out/exam/list.do',
  // 查询检验类别列表
  getBasicRecordCheckoutListAll: '/patientInfo/out/lab/list.do',
  // 查询患者门诊处方列表
  getBasicRepList: '/patientInfo/rep/list.do',
  // 查询患者检验、检查详细信息列表
  getBasicResultList: '/patientInfo/result/list.do',
  // 查询患者病历文件列表
  getBasicFileList: '/patientInfo/emr/file.do',
  // 查询门诊处方类别信息
  getOutTypeList: '/patientInfo/out/rp/list.do',
  // 查询住院医嘱类别信息
  getInTypeList: '/patientInfo/in/rp/list.do',
  // 查询患者检验信息详细
  getCheckInfoDetail: '/patientInfo/lab/detail.do',
  // 查询患者检查信息详细
  getExamInfoDetail: '/patientInfo/exam/detail.do',


  /**
   * 时间轴
   */
  
  // 获取患者住院登记列表
  getIndicatorInList: '/indicator/in/list',
  // 获取患者指标检测数据
  getIndicatorData: '/indicator/data',
  // 查询已选指标
  getIndicatorTemplate: '/indicator/template',
  // 按条件查询检验小项字典
  getIndicatorLabList: '/indicator/lab/list',
  // 编辑监测指标模板
  getIndicatorTemplateEdit: '/indicator/template/edit',
  // 删除监测指标模板
  getIndicatorTemplateDelete: '/indicator/template/item/delete',
};

const http = {
  getBasicInfo(params) {
      return vm.$post(url.getBasicInfo, params, false);
  },
  getBasicRecord(params) {
    return vm.$post(url.getBasicRecord, params, false);
  },
  getBasicDiagnosisRecord(params) {
    return vm.$post(url.getBasicDiagnosisRecord, params, false);
  },
  getBasicRecordCheckList(params) {
    return vm.$post(url.getBasicRecordCheckList, params, false);
  },
  getBasicRecordFileListAll(params) {
    return vm.$post(url.getBasicRecordFileListAll, params, false);
  },
  getBasicRecordTestList(params) {
    return vm.$post(url.getBasicRecordTestList, params, false);
  },
  getBasicRecordCheckListAll() {
    return vm.$post(url.getBasicRecordCheckListAll);
  },
  getBasicRecordCheckoutListAll() {
    return vm.$post(url.getBasicRecordCheckoutListAll);
  },
  getBasicRepList(params) {
    return vm.$post(url.getBasicRepList, params, false);
  },
  getBasicResultList(params) {
    return vm.$post(url.getBasicResultList, params, false);
  },
  getBasicFileList(params) {
    return vm.$post(url.getBasicFileList, params, false);
  },
  getOutTypeList(params) {
    return vm.$post(url.getOutTypeList, params, false);
  },
  getInTypeList(params) {
    return vm.$post(url.getInTypeList, params, false);
  },
  getCheckInfoDetail(params) {
    return vm.$post(url.getCheckInfoDetail, params, false);
  },
  getExamInfoDetail(params) {
    return vm.$post(url.getExamInfoDetail, params, false);
  },

  getIndicatorInList(params) {
    return vm.$get(url.getIndicatorInList, params, false);
  },
  getIndicatorData(params) {
    return vm.$get(url.getIndicatorData, params, false);
  },
  getIndicatorTemplate(params) {
    return vm.$get(url.getIndicatorTemplate, params, false);
  },
  getIndicatorLabList(params) {
    return vm.$get(url.getIndicatorLabList, params, false);
  },
  getIndicatorTemplateEdit(data) {
    return vm.$post(url.getIndicatorTemplateEdit, data, false);
  },
  getIndicatorTemplateDelete(params) {
    return vm.$get(url.getIndicatorTemplateDelete, params, false);
  },
};

export default http;
