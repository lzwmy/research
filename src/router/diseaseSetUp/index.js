
// 病种设置 
const diseaseSetUp = r => require.ensure([], () => r(require('packages/systemManageMoudule/diseaseSetUp/diseaseSetUp')), 'diseaseSetUp');

const routes = [
    {
        path: '/diseaseSetUp',
        name: 'diseaseSetUp',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '病种设置',
            flag: 'diseaseSetUp',
            belongToGroup: 'systemManage',
            openMode: 2
        },
        component: diseaseSetUp
    }
];

export default routes;
