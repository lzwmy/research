// 专病科研 SDResearch
// import Vue from 'vue';

const vm = new Vue();
const url = {
  /** 专病科研 */
  // 获取病种课题实验组信息
  // findAllDiseaseSpecies: '/diseasespecies/findAllDiseaseSpecies.do',
  // 专病查询
  findDiseaseSpecies: '/diseasespecies/findDiseaseSpecies.do',
  // 通过专病ID查询专病详细信息
  findDiseaseSpeciesDetail: '/diseasespecies/findDiseaseSpeciesDetail.do',
  // 根据专病ID查找CRF表单列表
  findCrfFormsByDiseaseId: '/crf/findCrfFormsByDiseaseId.do',
  // 修改专病信息
  updateDiseaseSpecies: '/diseasespecies/updateDiseaseSpecies.do',

  /** 实验组 */
  // 实验组添加
  addExperimentGroup: '/experimentgroup/addExperimentGroup.do',
  // 实验组删除
  deleteExperimentGroup: '/experimentgroup/deleteExperimentGroup.do',
  // 实验组修改
  updateExperimentGroup: '/experimentgroup/updateExperimentGroup.do',

  /** 课题 */
  // 课题添加
  addSubjectStudy: '/subjectstudy/addSubjectStudy.do',
  // 课题删除
  deleteSubjectStudy: '/subjectstudy/deleteSubjectStudy.do',
  // 根据专病ID查询课题列表
  findSubjectStudies: '/subjectstudy/findSubjectStudies.do',
  // 课题修改
  updateSubjectStudy: '/subjectstudy/updateSubjectStudy.do',

  /** 病例管理 */
  // 查询列列名
  // casesFindColumns: '/cases/findColumns.do',
  // 查询运算符
  casesFindOperators: '/cases/findOperators.do',
  // 条件筛选病例
  casesFindCases: '/cases/findCases.do',
  // 病例出组
  casesOutGroup: '/cases/outGroup.do',
  // 病例入组
  casesEnterGroup: '/cases/enterGroup.do',
  // 病例迁组
  casesMoveGroup: '/cases/moveGroup.do',
  // 病例入库前一步--查找病例
  casesFindPatients: '/cases/findPatients.do',
  // 病例入库
  casesSavePatients: '/cases/savePatients.do',
  // 导出病例
  casesExportCases: '/cases/exportCases.do',
  // 导出病例填写的CRF表单
  crfdataExpCrfData: '/crfdata/expCrfData.do',
  // 模糊查询
  casesAsynFindCases: '/cases/asynFindCases.do',
  // 获取视图列表
  casesFindViews: '/cases/findViews.do',
  // 查询筛选条件列表
  casesFindCondition: '/cases/findCondition.do',
  // 保存筛选条件列表
  casesSaveCondition: '/cases/saveCondition.do',
  // 删除筛选条件列表
  casesDeleteCondition: '/cases/deleteCondition.do',
  // 判断筛选条件名称是否重复
  casesExistConditionName: '/cases/existConditionName.do',
  // 根据病人ID查找病例所在实验组病种表单信息
  casesFindGroupByPatientId: '/cases/findGroupByPatientId.do',


  //添加患者
  casesAddPatient: '/cases/save.do',
  //删除患者
  casesDeletePatient: '/cases/delete.do',
  //编辑患者
  casesEditPatient: '/cases/edit.do',
  //查询患者其它信息
  casesSearchPatient: '/cases/search.do',

  /**
   * 报告
   */
  //查询患者信息
  getPatientSearch: '/cases/search.do',
  //查询患者信息
  sendPatientInviteCode: '/mp/associate/send/invite/code',
  // 查询报告列表
  getReportDataList: '/report/list.do',
  //报告选择列表
  getSelectList: '/form/crf/allList.do',
  //删除报告
  deleteReport: '/report/delete.do',
  //添加报告
  addReport: '/report/add.do',
  //保存报告
  saveReport: '/report/save',

  /**
   *  报告2.0
   * */
  //获取报告列表
  getReportList:"/form/crf/bak/simple/list.do",
  //患者页 添加报告 保存接口
  patientReportAddSave:"/report/bak/add.do",
  //根据过滤条件 获取报告列表
  queryFilterReportList:"/report/bak/reportList.do",
  //获取患者报告记录
  queryReportListnew:"/report/patient",
  // 获取报告 回显信息
  queryReportDisplayInfo:"/report/bak/findReport",
  // 获取报告 回显信息(科研项目)
  querySubjectReportDisplayInfo:"/subject/report/preview.do",
  // 获取表单模版 回显信息(科研项目)
  querySubjectCrfDisplayInfo:"/subject/crf/preview.do",
  // 报告 保存 数据
  reportDataSave:"/report/bak/save.do",
  //保存报告（从随访进来）
  saveFollowUpReportData: '/report/remind/save/report',
  // 报告 保存 数据(科研项目)
  reportDataSaveSubject:"/subject/report/save.do",
  //报告删除
  reportDelete: '/report/bak/delete',

  /**
   * 提醒
   */
  // 查询提醒列表
  getRemindDataList: '/report/remind/list.do',
  //添加提醒
  addRemind: '/report/remind/save.do',
  //获取已添加提醒配置
  getRemindConfig: '/report/remind/info',
  //随访提醒计划信息
  remindDetail: '/report/remind/detail/info',
  //操作报告记录列表
  remindLogList: '/report/logList.do',
  //改变状态
  changeRemindState: '/report/remind/change.do',
  //删除提醒
  deleteRemind: '/report/remind/delete.do',
  //预览CRF表单数据
  previewCrfReportHttp:"/form/crf/bak/preview.do",
  //随访提醒终止或失访
  remindChangeStatus:"/report/remind/changeStatus",
  /**
   * 导入和导出
   */
  //获取报告下的表单
  patientListCrf: '/disease/excel/select/crf',
  //导出患者报告模版
  patientListExportTemplate: '/disease/excel/create/report',
  //导出患者报告模版
  patientListExportCheck: '/subject/excel/download',
  //批量导入患者信息
  patientListImportData: '/disease/excel/import/patientInfos',
   //批量导入患者报告信息
  patientListImportReportData: '/disease/excel/import/patientReports',

  //获取医生列表
  getDoctorList: '/report/bak/duty/doctor/list',
  //添加医生
  addDoctor: '/report/bak/duty/doctor/add',
  //删除医生
  deleteDoctor: '/report/bak/duty/doctor/delete'
};

const http = {
  patientListGetDoctorList (params) {
    return vm.$get(url.getDoctorList, params);
  },
  patientListAddDoctor (params) {
    return vm.$post(url.addDoctor, params);
  },
  patientListDeleteDoctor (params) {
    return vm.$post(url.deleteDoctor, params);
  },
  patientListImportReportData (params) {
    return vm.$fileUpload(url.patientListImportReportData, params);
  },
  patientListImportData (params) {
    return vm.$fileUpload(url.patientListImportData, params);
  },
  patientListExportCheck (params) {
    return vm.$postDown(url.patientListExportCheck, params, true);
  },
  patientListExportTemplate (params) {
    return vm.$postDown(url.patientListExportTemplate, params, true);
  },
  patientListCrf (params) {
    return vm.$post(url.patientListCrf, params, false);
  },
  // findAllDiseaseSpecies () {
  //   return vm.$post(url.findAllDiseaseSpecies, {}, false);
  // },
  findDiseaseSpecies () {
    return vm.$post(url.findDiseaseSpecies, {}, false);
  },
  findDiseaseSpeciesDetail (params) {
    return vm.$post(url.findDiseaseSpeciesDetail, params, false);
  },

  findCrfFormsByDiseaseId (params) {
    return vm.$post(url.findCrfFormsByDiseaseId, params, false);
  },
  updateDiseaseSpecies (params) {
    return vm.$post(url.updateDiseaseSpecies, params, false);
  },
  addExperimentGroup (params) {
    return vm.$post(url.addExperimentGroup, params, false);
  },
  deleteExperimentGroup (params) {
    return vm.$post(url.deleteExperimentGroup, params);
  },
  updateExperimentGroup (params) {
    return vm.$post(url.updateExperimentGroup, params, false);
  },
  addSubjectStudy (params) {
    return vm.$post(url.addSubjectStudy, params, false);
  },
  deleteSubjectStudy (params) {
    return vm.$post(url.deleteSubjectStudy, params, false);
  },
  updateSubjectStudy (params) {
    return vm.$post(url.updateSubjectStudy, params, false);
  },
  findSubjectStudies (params) {
    return vm.$post(url.findSubjectStudies, params, false);
  },
  // casesFindColumns (params) {
  //   return vm.$post(url.casesFindColumns, params, false);
  // },
  casesFindOperators () {
    return vm.$post(url.casesFindOperators, {}, false);
  },
  casesFindCases (params) {
    return vm.$post(url.casesFindCases, params, false);
  },
  casesOutGroup (params) {
    return vm.$post(url.casesOutGroup, params, false);
  },
  casesEnterGroup (params) {
    return vm.$post(url.casesEnterGroup, params, false);
  },
  casesMoveGroup (params) {
    return vm.$post(url.casesMoveGroup, params, false);
  },
  casesFindPatients (params) {
    return vm.$post(url.casesFindPatients, params, false);
  },
  casesSavePatients (params) {
    return vm.$post(url.casesSavePatients, params, false);
  },
  casesExportCases (params) {
    return vm.$postDown(url.casesExportCases, params, false);
  },
  crfdataExpCrfData (params) {
    return vm.$postDown(url.crfdataExpCrfData, params, false);
  },
  casesAsynFindCases (params) {
    return vm.$post(url.casesAsynFindCases, params, false);
  },
  casesFindViews () {
    return vm.$post(url.casesFindViews, {}, false);
  },
  casesFindCondition () {
    return vm.$post(url.casesFindCondition, {}, false);
  },
  casesSaveCondition (params) {
    return vm.$post(url.casesSaveCondition, params, false);
  },
  casesDeleteCondition (params) {
    return vm.$post(url.casesDeleteCondition, params, false);
  },
  casesExistConditionName (params) {
    return vm.$post(url.casesExistConditionName, params, false);
  },
  casesFindGroupByPatientId (params) {
    return vm.$post(url.casesFindGroupByPatientId, params, false);
  },
  casesAddPatient (params) {
    return vm.$post(url.casesAddPatient, params, false);
  },
  casesDeletePatient (params) {
    return vm.$post(url.casesDeletePatient, params, true);
  },
  casesEditPatient (params) {
    return vm.$post(url.casesEditPatient, params, false);
  },
  casesSearchPatient (params) {
    return vm.$get(url.casesSearchPatient, params, false);
  },
  PFUGetReportDataList (data) {
    return vm.$post(url.getReportDataList, data, false);
  },

  PFUGetPatientSearch (params) {
    return vm.$get(url.getPatientSearch, params, true);
  },
  PFUsendPatientInviteCode (params) {
    return vm.$get(url.sendPatientInviteCode, params, true);
  },
  PFUdeleteReport(data) {
    return vm.$get(url.deleteReport, data, false);
  },
  PFUaddReport(data) {
    return vm.$post(url.addReport, data, false);
  },
  PFUGetList (data) {
    return vm.$get(url.getSelectList, data, false);
  },
  PFUGetRemindConfig (data) {
    return vm.$get(url.getRemindConfig, data, true);
  },
  PFUGetRemindDataList(data) {
    return vm.$post(url.getRemindDataList, data, false);
  },
  PFUAddRemind(data) {
    return vm.$post(url.addRemind, data, false);
  },
  PFUremindLogList(data) {
    return vm.$get(url.remindLogList, data, true);
  },
  PFUremindDetail(data) {
    return vm.$get(url.remindDetail, data, true);
  },
  PFUchangeRemindState(data) {
    return vm.$post(url.changeRemindState, data, false);
  },
  PFUdeleteRemind(data) {
    return vm.$get(url.deleteRemind, data, false);
  },
  /**
   * 报告 2.0
   *  新增 获取报告列表
   * */
  //获取 报告列表
  getReportList(params) {
    return vm.$get(url.getReportList,params,true);
  },
  reportDelete(params) {
    return vm.$get(url.reportDelete,params,true);
  },
  //患者页 添加报告 保存接口
  patientReportAddSave(params) {
    return vm.$post(url.patientReportAddSave,params,false);
  },
  queryFilterReportList(params) {
    return vm.$post(url.queryFilterReportList,params,false);
  },
  queryReportListnew(params) {
    return vm.$post(url.queryReportListnew,params,false);
  },
  previewCrfReportHttp(params) {
    return vm.$post(url.previewCrfReportHttp,params,true);
  },
  queryReportDisplayInfo(params) {
    return vm.$get(url.queryReportDisplayInfo,params,true);
  },
  querySubjectReportDisplayInfo(params) {
    return vm.$get(url.querySubjectReportDisplayInfo,params,true);
  },
  querySubjectCrfDisplayInfo(params) {
    return vm.$post(url.querySubjectCrfDisplayInfo,params,true);
  },
  reportDataSave(params) {
    return vm.$post(url.reportDataSave,params,false);
  },
  saveFollowUpReportData(params) {
    return vm.$post(url.saveFollowUpReportData,params,false);
  },
  reportDataSaveSubject(params) {
    return vm.$post(url.reportDataSaveSubject,params,false);
  },
  remindChangeStatus(params) {
    return vm.$post(url.remindChangeStatus,params,false);
  },
};

export default http;
