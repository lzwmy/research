export default [
    {
        menuCode: "001",
        menuLevel: 1,
        menuName: "科研概述",
        menuOrder: 1,
        menuPath: "/index",
        superiorMenu: "01",
        meta: {
            requireAuth: true,
            isKeepAlive: true,
            txt: '首页',
            flag: 'index',
            belongToGroup: '',
            openMode: 1
        },
        componentPath: '/index/index'
    },
    {
        menuCode: "002",
        menuLevel: 1,
        menuName: "随访任务",
        menuOrder: 2,
        menuPath: "/patientFollowUp",
        superiorMenu: "02",
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '随访任务',
            flag: 'patientFollowUp',
            belongToGroup: 'patientFollowUp',
            openMode: 1
        },
        componentPath: '/patientFollowUp/patientFollowUp'
    },
    {
        menuCode: "003",
        menuLevel: 1,
        menuName: "系统管理",
        menuOrder: 3,
        menuPath: "/systemManage",
        superiorMenu: "03",
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '系统管理',
            flag: 'systemManage',
            belongToGroup: 'systemManage',
            openMode: 1
        },
        componentPath: null
    },
    {
        menuCode: "0031",
        menuLevel: 2,
        menuName: "医学代码集",
        menuOrder: 1,
        menuPath: "/dataDictionary",
        superiorMenu: "003",
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '医学代码集',
            flag: 'dataDictionary',
            belongToGroup: 'dataDictionary',
            openMode: 2
        },
        componentPath: '/dataDictionaryManage/dataDictionary'
    },
]