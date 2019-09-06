// 数据字典管理 dataDictionaryManage

// 数据字典 dataDictionary
const dataDictionary = r => require.ensure([], () => r(require('packages/dataDictionaryManage/dataDictionary')), 'dataDictionary');
//医学代码 medicalCode
const medicalCode = r => require.ensure([], () => r(require('packages/dataDictionaryManage/medicalCode')), 'medicalCode');
//医学代码分类 medicalCodeClass
const medicalCodeClass = r => require.ensure([], () => r(require('packages/dataDictionaryManage/medicalCodeClass')), 'medicalCodeClass');
//
const dataDictionaryTest = r => require.ensure([], () => r(require('packages/dataDictionaryManage/dataDictionaryTest')), 'dataDictionaryTest');

const routes = [
  {
    path: '/dataDictionary',
    name: 'dataDictionary',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '医学代码集',
      flag: 'dataDictionary',
      belongToGroup: 'dataDictionaryManage',
      openMode: 2
    },
    component: dataDictionary
  },
  {
    path: '/medicalCode',
    name: 'medicalCode',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '医学代码',
      flag: 'medicalCode',
      belongToGroup: 'dataDictionaryManage',
      openMode: 2
    },
    component: medicalCode
  },
  {
    path: '/medicalCodeClass',
    name: 'medicalCodeClass',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '医学代码分类',
      flag: 'medicalCodeClass',
      belongToGroup: 'dataDictionaryManage',
      openMode: 2
    },
    component: medicalCodeClass
  },
  {
    path: '/dataDictionaryTest',
    name: 'dataDictionaryTest',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '数据字典',
      flag: 'dataDictionaryTest',
      belongToGroup: 'dataDictionaryManage',
      openMode: 2
    },
    component: dataDictionaryTest
  }
];

export default routes;
