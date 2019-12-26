const treeCustom = r => require.ensure([], () => r(require('packages/diseaseModule/knowledgeChart/treeCustom')), 'treeCustom');

const routes = [
    {
        path: '/treeCustom',
        name: 'treeCustom',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '知识图谱',
            flag: 'treeCustom',
            belongToGroup: 'insideView',
            openMode: 2
        },
        component: treeCustom
    },
];

export default routes;
