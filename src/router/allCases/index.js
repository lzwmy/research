// 全部病例 allCases

// 全部病例 allCases
const allCases = r => require.ensure([], () => r(require('packages/allCases/allCases')), 'allCases');

const routes = [
  {
    path: '/allCases',
    name: 'allCases',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '全部病例',
      flag: 'allCases',
      belongToGroup: 'allCases',
      openMode: 1
    },
    component: allCases
  }
];

export default routes;
