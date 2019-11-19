//病人列表模块
const patientListModule = r => require.ensure([], () => r(require('packages/diseaseModule/patinetListModule/patinetListModule')), 'patientListModule');
const patientInfo = r => require.ensure([], () => r(require('packages/diseaseModule/patinetListModule/patientInfo/index')), 'patientInfo');

const routes = [
  {
    path: '/patientListModule',
    name: 'patientListModule',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '病人列表',
      flag: 'patientListModule',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: patientListModule
  },
  {
    path: '/patientListModule/patientInfo',
    name: 'patientInfo',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '',
      flag: 'patientListModule',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: patientInfo
  }
];
export default routes;
