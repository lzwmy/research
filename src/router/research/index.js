//项目进度
const projectProgress = r => require.ensure([], () => r(require('packages/research/projectProgress/projectProgress')), 'projectProgress');
//研究对象
const researchObject = r => require.ensure([], () => r(require('packages/research/researchObject/researchObject')), 'researchObject');
//随访管理
const followUpManagement = r => require.ensure([], () => r(require('packages/research/followUpManagement/followUpManagement')), 'followUpManagement');
//我的任务
const myTasks = r => require.ensure([], () => r(require('packages/research/myTasks/myTasks')), 'myTasks');
//统计分析
const statisticalAnalysis = r => require.ensure([], () => r(require('packages/research/statisticalAnalysis/statisticalAnalysis')), 'statisticalAnalysis');
//文章润色
const articlesEmbellish = r => require.ensure([], () => r(require('packages/research/articlesEmbellish/articlesEmbellish')), 'articlesEmbellish');
//组织管理
const organizationManagement = r => require.ensure([], () => r(require('packages/research/organizationManagement/organizationManagement')), 'organizationManagement');
//项目分组
const projectGrouping = r => require.ensure([], () => r(require('packages/research/projectGrouping/projectGrouping')), 'projectGrouping');
//研究指标
const researchTarget = r => require.ensure([], () => r(require('packages/research/researchTarget/researchTarget')), 'researchTarget');
//随访计划
const followUpPlan = r => require.ensure([], () => r(require('packages/research/followUpPlan/followUpPlan')), 'followUpPlan');
//操作记录
const operationRecord = r => require.ensure([], () => r(require('packages/research/operationRecord/operationRecord')), 'operationRecord');

const routes = [
    {
        ico: 'projectProgress',
        menuLevel: 3,
        menuName: '项目进度',
        menuOrder: 1,
        menuPath: '/projectProgress',
        superiorMenu: '0107',
        menuCode: "010701",
        states: 0,
        children: [],
        path: '/projectProgress',
        name: 'projectProgress',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '项目进度',
            flag: 'projectProgress',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: projectProgress
    },
    {   
        ico: 'researchObject',
        menuLevel: 3,
        menuName: '研究对象',
        menuOrder: 2,
        menuPath: '/researchObject',
        superiorMenu: '0107',
        menuCode: "010702",
        states: 0,
        children: [],
        path: '/researchObject',
        name: 'researchObject',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '研究对象',
            flag: 'researchObject',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: researchObject
    },{
        ico: 'followUpManagement',
        menuLevel: 3,
        menuName: '随访管理',
        menuOrder: 3,
        menuPath: '/followUpManagement',
        superiorMenu: '0107',
        menuCode: "010703",
        states: 0,
        children: [],
        path: '/followUpManagement',
        name: 'followUpManagement',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '随访管理',
            flag: 'followUpManagement',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: followUpManagement
    },{
        ico: 'myTasks',
        menuLevel: 3,
        menuName: '我的任务',
        menuOrder: 4,
        menuPath: '/myTasks',
        superiorMenu: '0107',
        menuCode: "010704",
        states: 0,
        children: [],
        path: '/myTasks',
        name: 'myTasks',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '我的任务',
            flag: 'myTasks',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: myTasks
    },{
        ico: 'statisticalAnalysis',
        menuLevel: 3,
        menuName: '统计分析',
        menuOrder: 5,
        menuPath: '/statisticalAnalysis',
        superiorMenu: '0107',
        menuCode: "010705",
        states: 0,
        children: [],
        path: '/statisticalAnalysis',
        name: 'statisticalAnalysis',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '统计分析',
            flag: 'statisticalAnalysis',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: statisticalAnalysis
    },{
        ico: 'articlesEmbellish',
        menuLevel: 3,
        menuName: '论文润色',
        menuOrder: 6,
        menuPath: '/articlesEmbellish',
        superiorMenu: '0107',
        menuCode: "010706",
        states: 0,
        children: [],
        path: '/articlesEmbellish',
        name: 'articlesEmbellish',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '论文润色',
            flag: 'articlesEmbellish',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: articlesEmbellish
    },{
        ico: 'organizationManagement',
        menuLevel: 3,
        menuName: '组织管理',
        menuOrder: 7,
        menuPath: '/organizationManagement',
        superiorMenu: '0107',
        menuCode: "010707",
        states: 0,
        children: [],
        path: '/organizationManagement',
        name: 'organizationManagement',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '组织管理',
            flag: 'organizationManagement',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: organizationManagement
    },{
        ico: 'researchTarget',
        menuLevel: 3,
        menuName: '研究指标',
        menuOrder: 8,
        menuPath: '/researchTarget',
        superiorMenu: '0107',
        menuCode: "010708",
        states: 0,
        children: [],
        path: '/researchTarget',
        name: 'researchTarget',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '研究指标',
            flag: 'researchTarget',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: researchTarget
    },{
        ico: 'projectGrouping',
        menuLevel: 3,
        menuName: '项目分组',
        menuOrder: 9,
        menuPath: '/projectGrouping',
        superiorMenu: '0107',
        menuCode: "010709",
        states: 0,
        children: [],
        path: '/projectGrouping',
        name: 'projectGrouping',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '项目分组',
            flag: 'projectGrouping',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: projectGrouping
    },{
        ico: 'followUpPlan',
        menuLevel: 3,
        menuName: '随访计划',
        menuOrder: 10,
        menuPath: '/followUpPlan',
        superiorMenu: '0107',
        menuCode: "010710",
        states: 0,
        children: [],
        path: '/followUpPlan',
        name: 'followUpPlan',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '随访计划',
            flag: 'followUpPlan',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: followUpPlan
    },{
        ico: 'operationRecord',
        menuLevel: 3,
        menuName: '操作记录',
        menuOrder: 11,
        menuPath: '/operationRecord',
        superiorMenu: '0107',
        menuCode: "010711",
        states: 0,
        children: [],
        path: '/operationRecord',
        name: 'operationRecord',
        meta: {
            requireAuth: true,
            isKeepAlive: false,
            txt: '操作记录',
            flag: 'operationRecord',
            belongToGroup: 'researchTask',
            openMode: 2
        },
        component: operationRecord
    }
];

export default routes;
