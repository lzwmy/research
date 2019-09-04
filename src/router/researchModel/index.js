//科研建模

const modelAside = r => require.ensure([], () => r(require('packages/researchModel/modelAside')), 'modelAside');

//科研建模 2.0
const createModel = r => require.ensure([], () => r(require('packages/researchModel/createModel/createModel')), 'createModel');

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
    component: createModel
  }
];
export default routes;
