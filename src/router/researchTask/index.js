
// 科研课题
const researchTask = r => require.ensure([], () => r(require('packages/researchTask/index')), 'researchTask');

//创建课题
const createProject = r => require.ensure([], () => r(require('packages/researchTask/createProject')), 'createProject');

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
    }
];

export default routes;
