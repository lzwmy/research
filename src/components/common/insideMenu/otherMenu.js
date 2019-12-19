const otherMenu = [
    {
        ico: 'dataMonitoring',
        menuName: '数据监察',
        menuCode: "0129012",
        menuPath: '/dataMonitoring',
        name: 'dataMonitoring',
        children: [],
        roles:[1,2,4]
    },
    {
        ico: 'crfConfig',
        menuName: 'CRF配置',
        menuCode: "011005",
        menuPath: '/crfConfig',
        children: [],
        name: 'crfConfig',
        roles:[1]
    },
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

export default otherMenu;