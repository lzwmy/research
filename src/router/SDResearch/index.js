// 专病科研 SDResearch

// 专病科研 SDResearch
const SDResearch = r => require.ensure([], () => r(require('packages/SDResearch/SDResearch')), 'SDResearch');
// 病例管理 caseManage
const caseManage = r => require.ensure([], () => r(require('packages/SDResearch/caseManage')), 'caseManage');
// 病种设置 diseaseSet
const diseaseSet = r => require.ensure([], () => r(require('packages/SDResearch/diseaseSet')), 'diseaseSet');
// 入组管理 enterGroupManager
const enterGroupManager = r => require.ensure([], () => r(require('packages/SDResearch/enterGroupManager')), 'enterGroupManager');

const routes = [
  {
    path: '/SDResearch',
    name: 'SDResearch',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '专病科研',
      flag: 'SDResearch',
      belongToGroup: 'SDResearch',
      openMode: 1
    },
    component: SDResearch
  },
  {
    path: '/caseManage',
    name: 'caseManage',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '病例管理',
      flag: 'caseManage',
      belongToGroup: 'SDResearch',
      openMode: 2
    },
    component: caseManage
  },
  {
    path: '/diseaseSet',
    name: 'diseaseSet',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '专病科研',
      flag: 'SDResearch',
      belongToGroup: 'SDResearch',
      openMode: 2
    },
    component: diseaseSet
  },
  {
    path: '/enterGroupManager',
    name: 'enterGroupManager',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '入组管理',
      flag: 'enterGroupManager',
      belongToGroup: 'enterGroupManager',
      openMode: 2
    },
    component: enterGroupManager
  }
];

export default routes;
