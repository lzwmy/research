//科研建模

const modelAside = r => require.ensure([], () => r(require('packages/researchModel/modelAside')), 'modelAside');

const routes = [
  {
    path: '/modelManage',
    name: 'modelManage',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '科研建模',
      flag: 'modelManage',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: modelAside
  }
];
export default routes;
