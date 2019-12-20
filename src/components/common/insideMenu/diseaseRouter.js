const router = [
    {
        ico: 'diseaseChartIcon',
        menuName: '病种概览',
        menuCode: "011001",
        menuOrder: 1,
        menuPath: '/diseaseChart',
        children: [],
        name: 'diseaseChart',
    },
    {
        ico: 'bingrenliebiaobeifen1',
        menuName: '病人列表',
        menuCode: "011002",
        menuOrder: 2,
        menuPath: '/patientListModule',
        children: [],
        name: 'patientListModule',
    },
    {
        ico: 'diseasePatientFollowUp',
        menuName: '患者随访',
        menuCode: "0110033",
        menuOrder: 3,
        menuPath: '/diseasePatientFollowUp',
        children: [],
        name: 'diseasePatientFollowUp',
    },
    {
        ico: 'reportList',
        menuName: '报告列表',
        menuCode: "011003",
        menuOrder: 4,
        menuPath: '/reportList',
        children: [],
        name: 'reportList',
    },
    {
        ico: 'modelManage',
        menuName: '科研建模',
        menuCode: "011004",
        menuOrder: 5,
        menuPath: '/modelManage',
        children: [],
        name: 'modelManage',
    }
]
export default router;