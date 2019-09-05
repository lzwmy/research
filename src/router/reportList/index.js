const reportList = r => require.ensure([], () => r(require('packages/reportList/reportList')), 'reportList');

const routes = [
    {
        path: '/reportList',
        name: 'reportList',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '报告列表',
            flag: 'reportList',
            belongToGroup: 'insideView',
            openMode: 2
        },
        component: reportList
    },
];

export default routes;
