const adminMenu = [
    {
        ico: 'qualityManage',
        menuName: '质控管理',
        menuCode: "0129011",
        menuPath: '/qualityManage',
        name: 'qualityManage',
        children: [],
        roles:[1]
    },
    {
        ico: 'organizationManagement',
        menuName: '组织管理',
        menuCode: "012907",
        menuPath: '/organizationManagementDis',
        roles:[1,2],
        children: [
            {
                ico: '',
                menuName: '机构管理',
                menuCode: "012906",
                menuPath: '/organizationManagementDis',
                name: 'organizationManagementDis',
                children: [],
                roles:[1,2]
            },
            {
                ico: '',
                menuName: '录入统计',
                menuCode: "012905",
                menuPath: '/inputStatistics',
                name: 'inputStatistics',
                children: [],
                roles:[1]
            }
        ],
        name: 'organizationManagementDis',
    }
]

const centerAdminMenu = [
    {
        ico: 'organizationManagement',
        menuName: '组织管理',
        menuCode: "012907",
        menuPath: '/organizationManagementDis',
        children: [
            {
                ico: '',
                menuName: '机构管理',
                menuCode: "012906",
                menuPath: '/organizationManagementDis',
                name: 'organizationManagementDis',
                children: []
            }
        ],
        name: 'organizationManagementDis',
    }
]

export default {
    adminMenu,
    centerAdminMenu
};