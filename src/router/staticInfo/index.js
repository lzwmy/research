// 统计信息 staticInfo

// 统计信息 staticInfo
const staticInfo = r => require.ensure([], () => r(require('packages/staticInfo/staticInfo')), 'staticInfo');

const routes = [
  {
    path: '/staticInfo',
    name: 'staticInfo',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '统计信息',
      flag: 'staticInfo',
      belongToGroup: 'staticInfo'
    },
    component: staticInfo
  }
];

export default routes;
