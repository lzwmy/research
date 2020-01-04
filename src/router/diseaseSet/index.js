
// 病种设置 
const diseaseSet = r => require.ensure([], () => r(require('packages/systemManageMoudule/diseaseSet/diseaseSet')), 'diseaseSet');

const routes = [
    {
        path: '/diseaseSet',
        name: 'diseaseSet',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '病种设置',
            flag: 'diseaseSet',
            belongToGroup: 'systemManage',
            openMode: 2
        },
        component: diseaseSet
    }
];

export default routes;
