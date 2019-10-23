const router = [
    {
        ico: 'diseaseChartIcon',
        menuName: '病种概览',
        menuCode: "011001",
        menuPath: '/diseaseChart',
        children: [],
        name: 'diseaseChart',
    },
    {
        ico: 'bingrenliebiaobeifen1',
        menuName: '病人列表',
        menuCode: "011002",
        menuPath: '/patientListModule',
        children: [],
        name: 'patientListModule',
    },
    {
        ico: 'reportList',
        menuName: '报告列表',
        menuCode: "011003",
        menuPath: '/reportList',
        children: [],
        name: 'reportList',
    },
    {
        ico: 'modelManage',
        menuName: '科研建模',
        menuCode: "011004",
        menuPath: '/modelManage',
        children: [],
        name: 'modelManage',
    },
    {
        ico: 'crfConfig',
        menuName: 'CRF配置',
        menuCode: "011005",
        menuPath: '/crfConfig',
        children: [],
        name: 'crfConfig',
    }
]
export default router;