//病人列表模块
const patientListModule = r => require.ensure([], () => r(require('packages/diseaseModule/patinetListModule/patinetListModule')), 'patientListModule');

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
  }
];
export default routes;
