
//组织管理
const organizationManagementDis = r => require.ensure([], () => r(require('packages/diseaseModule/organizationManagementDis/organizationManagementDis')), 'organizationManagementDis');

const routes = [
    {
        ico: 'organizationManagement',
        menuLevel: 3,
        menuName: '组织管理',
        menuOrder: 7,
        menuPath: '/organizationManagementDis',
        superiorMenu: '0107',
        menuCode: "010707",
        states: 0,
        children: [],
        path: '/organizationManagementDis',
        name: 'organizationManagementDis',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '组织管理',
            flag: 'organizationManagementDis',
            belongToGroup: 'insideView',
            openMode: 2,
        },
        component: organizationManagementDis
    }
];

export default routes;
