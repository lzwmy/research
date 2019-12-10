
// 系统设置 
const systemSetup = r => require.ensure([], () => r(require('packages/systemManageMoudule/systemSetup/systemSetup')), 'systemSetup');

const routes = [
    {
        path: '/systemSetup',
        name: 'systemSetup',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '系统设置',
            flag: 'systemSetup',
            belongToGroup: 'systemManage',
            openMode: 2
        },
        component: systemSetup
    }
];

export default routes;
