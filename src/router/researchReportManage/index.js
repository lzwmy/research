const researchReportManage = r => require.ensure([], () => r(require('packages/researchReportManage/researchReportManage')), 'researchReportManage');

const routes = [
  {
    path: '/researchReportManage',
    name: 'researchReportManage',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '报告列表',
      flag: 'researchReportManage',
      belongToGroup: 'researchReportManage',
      openMode: 2
    },
    component: researchReportManage
  }
];

export default routes;
