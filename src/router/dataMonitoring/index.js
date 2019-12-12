const dataMonitoring = r => require.ensure([], () => r(require('packages/diseaseModule/dataMonitoring/dataMonitoring')), 'dataMonitoring');

const routes = [
    {
        path: '/dataMonitoring',
        name: 'dataMonitoring',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '数据监察',
            flag: 'dataMonitoring',
            belongToGroup: 'insideView',
            openMode: 2
        },
        component: dataMonitoring
    },
];

export default routes;
