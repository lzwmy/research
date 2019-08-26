// openEHR说明 openEHRIntroduction

// openEHR说明 openEHRIntroduction
const openEHRIntroduction = r => require.ensure([], () => r(require('packages/openEHRIntroduction/openEHRIntroduction')), 'openEHRIntroduction');

const routes = [
  {
    path: '/openEHRIntroduction',
    name: 'openEHRIntroduction',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: 'openEHR说明',
      flag: 'openEHRIntroduction',
      belongToGroup: 'openEHRIntroduction'
    },
    component: openEHRIntroduction
  }
];

export default routes;
