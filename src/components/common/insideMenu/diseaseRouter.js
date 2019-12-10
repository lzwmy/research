const router = [
    {
        ico: 'diseaseChartIcon',
        menuName: '病种概览',
        menuCode: "011001",
        menuPath: '/diseaseChart',
        children: [],
        name: 'diseaseChart',
        role:[1,2,3,4]
    },
    {
        ico: 'bingrenliebiaobeifen1',
        menuName: '病人列表',
        menuCode: "011002",
        menuPath: '/patientListModule',
        children: [],
        name: 'patientListModule',
        role:[1,2,3,4]
    },
    {
        ico: 'diseasePatientFollowUp',
        menuName: '患者随访',
        menuCode: "0110033",
        menuPath: '/diseasePatientFollowUp',
        children: [],
        name: 'diseasePatientFollowUp',
        role:[1,2,3,4]
    },
    {
        ico: 'reportList',
        menuName: '报告列表',
        menuCode: "011003",
        menuPath: '/reportList',
        children: [],
        name: 'reportList',
        role:[1,2,3,4]
    },
    {
        ico: 'modelManage',
        menuName: '科研建模',
        menuCode: "011004",
        menuPath: '/modelManage',
        children: [],
        name: 'modelManage',
        role:[1,2,3,4]
    }
    // {
    //     ico: 'crfConfig',
    //     menuName: 'CRF配置',
    //     menuCode: "011005",
    //     menuPath: '/crfConfig',
    //     children: [],
    //     name: 'crfConfig',
        // role:[1]
    // }
]
export default router;