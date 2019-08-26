// 每页显示条
export const pageSize = 10;
// 默认当前页
export const pageNo = 1;
// 暂无数据
export const emptyText = '暂无数据';
// 加载中
export const elementLoadingText = '拼命加载中';

// IAM_SSO_REDIRECT_URI 单点登录重定向的地址指向系统地址
export const IAM_SSO_REDIRECT_URI = window.location.protocol + '//' + window.location.host + window.location.pathname;

// 基础数据版本号
export const version = 'basedata_ws2011';
// 机构所有制代码
export const ORG_OWNERSHIP = 'ZDY_ORG_OWNERSHIP';
// 隶属关系
export const SUBJECTION_RELATION = 'ZDY_ORG_RELATION';
// 机构组织类别编码
export const CATEGORY = 'CF08.10.996';
// 经营性质编码
export const RENTABILITY = 'CF08.10.999';
// 服务对象
export const SERVICE_OBJECT = 'ZDY_ORG_OBJECT';
// 服务方式
export const SERVICE_MODE = 'CF09.01.992';
// 诊疗科室
export const DEPARTMENTS_CODE = 'ZDY_DEPARTMENTS';
// 医院级别
export const ORG_LEVEL = 'CCV2299.04';
// 医院等级
export const ORG_RANK = 'CCV2299.03';
// 药物剂型
export const DOSAGE_FORM_CODE = 'CV08.50.002';
// 资产分类
export const FIXEDASSETS_CATEGORY = 'GB/T 14885-2010';
// 材料分类
export const MATERIAL_CATEGORY = 'ZDY01.00.002';
// 性别
export const SEX = 'CF02.01.991';
// 证件类型
export const ID_TYPE = 'CV02.01.101';
// 民族
export const NATION = 'CF02.01.988';
// 政治面貌
export const POLITICS_STATUS = 'ZDY_POLITICS_STATUS';
// 婚姻状况
export const MARITAL_STATUS = 'CF02.01.990';
// 专业
export const SPECIALTY = 'ZDY_SPECIALTY';
// 文化程度/学历
export const EDUCATION_DEGREE = 'GB/T 4658-2006';
// 学位
export const DEGREE = 'CF02.01.984';
// 人员类别
export const STAFF_CATEGORY = 'ZDY_STAFF_CATEGORY';
// 专业技术职务
export const PROFESSIONAL_DUTY = 'ZDY_PROFESSIONAL';
// 医师执业类别
export const PHYSICIAN_LICENSE_CATEGORY = 'ZDY_PHYSICIAN_LICENSE_CATEGORY';
// 第2执业单位类别  第3执业单位类别
export const SECOND_PRACTICE_TYPE = 'CF08.10.996';
// 负责人职称
export const PRINCIPAL_TITLE = 'ZDY_PROFESSIONAL';
// 用药途径
export const MEDICATION_USAGE = 'CV06.00.102';
// 药品统计分类
export const MEDICATION_CATEGORY = 'ZDY_MEDICATION_CATEGORY';
// 国籍编码
export const NATIONALITY = 'GB/T2659-2000';
// 联系人关系
export const CONTACTS_RELATION = 'GBT4761-2008';
// 身份证件类型
export const credentials = 'CV02.01.101';
// 就诊卡
export const visits = 'ZDY00.01.001';

export default {
  pageSize,
  pageNo,
  emptyText,
  elementLoadingText,
  version,
  ORG_OWNERSHIP,
  SUBJECTION_RELATION,
  CATEGORY,
  RENTABILITY,
  SERVICE_OBJECT,
  SERVICE_MODE,
  DEPARTMENTS_CODE,
  ORG_LEVEL,
  ORG_RANK,
  DOSAGE_FORM_CODE,
  FIXEDASSETS_CATEGORY,
  MATERIAL_CATEGORY,
  SEX,
  ID_TYPE,
  NATION,
  POLITICS_STATUS,
  MARITAL_STATUS,
  SPECIALTY,
  EDUCATION_DEGREE,
  DEGREE,
  STAFF_CATEGORY,
  PROFESSIONAL_DUTY,
  PHYSICIAN_LICENSE_CATEGORY,
  SECOND_PRACTICE_TYPE,
  PRINCIPAL_TITLE,
  MEDICATION_USAGE,
  MEDICATION_CATEGORY,
  NATIONALITY,
  CONTACTS_RELATION,
  credentials,
  visits,
  IAM_SSO_REDIRECT_URI
};
