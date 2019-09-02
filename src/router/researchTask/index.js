
// 科研课题
const researchTask = r => require.ensure([], () => r(require('packages/researchTask/index')), 'researchTask');


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
        },
        component: researchTask
    }
];

export default routes;
