
//组织管理
const organizationManagementDis = r => require.ensure([], () => r(require('packages/diseaseModule/organizationManagementDis/organizationManagementDis')), 'organizationManagementDis');
//录入统计
const inputStatistics = r => require.ensure([], () => r(require('packages/diseaseModule/organizationManagementDis/inputStatistics')), 'inputStatistics');
//机构管理
const agencyManagement = r => require.ensure([], () => r(require('packages/diseaseModule/organizationManagementDis/agencyManagement')), 'agencyManagement');

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
    },
    {
        ico: 'inputStatistics',
        menuLevel: 4,
        menuName: '录入统计',
        menuOrder: 7,
        menuPath: '/organizationManagementDis',
        superiorMenu: '0107',
        menuCode: "010707",
        states: 0,
        children: [],
        path: '/inputStatistics',
        name: 'inputStatistics',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '多中心录入统计',
            flag: 'inputStatistics',
            belongToGroup: 'insideView',
            openMode: 2,
        },
        component: inputStatistics
    },
  {
    ico: 'inputStatistics',
    menuLevel: 4,
    menuName: '机构管理',
    menuOrder: 7,
    menuPath: '/organizationManagementDis',
    superiorMenu: '0107',
    menuCode: "010708",
    states: 0,
    children: [],
    path: '/agencyManagement',
    name: 'agencyManagement',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '机构管理',
      flag: 'inputStatistics',
      belongToGroup: 'insideView',
      openMode: 2,
    },
    component: agencyManagement
  }
];

export default routes;
