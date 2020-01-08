
//组织管理
const organizationManagementDis = r => require.ensure([], () => r(require('packages/diseaseModule/organizationManagementDis/organizationManagementDis')), 'organizationManagementDis');
//录入统计
const inputStatistics = r => require.ensure([], () => r(require('packages/diseaseModule/organizationManagementDis/inputStatistics')), 'inputStatistics');
//质控管理
const qualityManage = r => require.ensure([], () => r(require('packages/diseaseModule/qualityManage/qualityManage')), 'qualityManage');


const routes = [
    {
        ico: 'organizationManagement',
        menuLevel: 3,
        menuName: '机构管理',
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
            txt: '机构管理',
            flag: 'organizationManagementDis',
            belongToGroup: 'insideView',
            openMode: 2,
        },
        component: organizationManagementDis
    },
    {
        ico: 'inputStatistics',
        menuLevel: 4,
        menuName: '录入统计',
        menuOrder: 7,
        menuPath: '/inputStatistics',
        superiorMenu: '0107',
        menuCode: "010707",
        states: 0,
        children: [],
        path: '/inputStatistics',
        name: 'inputStatistics',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '录入统计',
            flag: 'inputStatistics',
            belongToGroup: 'insideView',
            openMode: 2,
        },
        component: inputStatistics
    },
    {
        ico: 'qualityManage',
        menuLevel: 4,
        menuName: '质控管理',
        menuOrder: 8,
        menuPath: '/qualityManage',
        superiorMenu: '0107',
        menuCode: "010708",
        states: 0,
        children: [],
        path: '/qualityManage',
        name: 'qualityManage',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '质控管理',
            flag: 'qualityManage',
            belongToGroup: 'insideView',
            openMode: 2,
        },
        component: qualityManage
    }
];

export default routes;
