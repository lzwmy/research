//科研建模

// const modelAside = r => require.ensure([], () => r(require('packages/researchModel/modelAside')), 'modelAside');

//科研建模 2.0
const createModel = r => require.ensure([], () => r(require('packages/researchModel/createModel/createModel')), 'createModel');
//详细页面
const detailPage = r => require.ensure([], () => r(require('packages/researchModel/createModel/detailPage')), 'detailPage');
//新建 or 编辑
const configModel = r => require.ensure([], () => r(require('packages/researchModel/createModel/configModel')), 'configModel');

const routes = [
  {
    path: '/modelManage',
    name: 'modelManage',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '科研建模',
      flag: 'modelManage',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: createModel
  },
  {
    path: '/modelManage/detailPage',
    name: 'detailPage',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '科研建模',
      flag: 'modelManage',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: detailPage
  },
  {
    path: '/modelManage/configModel',
    name: 'configModel',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '科研建模',
      flag: 'modelManage',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: configModel
  }
];
export default routes;
