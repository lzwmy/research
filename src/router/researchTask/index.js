
// 科研课题
const researchTask = r => require.ensure([], () => r(require('packages/researchTask/index')), 'researchTask');

//创建课题
const createProject = r => require.ensure([], () => r(require('packages/researchTask/createProject')), 'createProject');

//课题验证
const subjectVerification = r => require.ensure([], () => r(require('packages/researchTask/subjectVerification')), 'subjectVerification');

const routes = [
    {
        path: '/researchTask',
        name: 'researchTask',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '科研课题',
            flag: 'researchTask',
            belongToGroup: 'researchTask',
            openMode: 1
        },
        component: researchTask
    },{
        path: '/createProject',
        name: 'createProject',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '创建课题',
            flag: 'researchTask',
            belongToGroup: 'createProject',
            openMode: 1
        },
        component: createProject
    },
  {
    path: '/subjectVerification',
    name: 'subjectVerification',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '课题验证',
      flag: 'researchTask',
      belongToGroup: 'createProject',
      openMode: 1
    },
    component: subjectVerification
  }
];

export default routes;
