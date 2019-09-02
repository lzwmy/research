// 子路由
import SDResearch from './SDResearch';
import crfManage from './crfManage';
import dataDictionaryManage from './dataDictionaryManage';
import systemManage from './systemManage';
import fullTextSearch from './fullTextSearch';
import openEHRIntroduction from './openEHRIntroduction';
import staticInfo from './staticInfo';
import allCases from './allCases';
import patientFollowUp from './patientFollowUp';
import researchReportManage from './researchReportManage';
import eventPlan from './eventPlan';
import researchModel from './researchModel';
import researchTask from './researchTask';
//病人列表
import patientListModule from './patientListModule';
//病种概览
import diseaseChart from './diseaseChart';
// 首页
const index = r => require.ensure([], () => r(require('packages/index/index')), 'index');
// 404
const notFind = r => require.ensure([], () => r(require('packages/index/not-find')), 'notFind');

const insideView = r => require.ensure([], () => r(require('components/common/insideView/view')), 'insideView');

const routes = [
  {
    path: '/index',
    name: 'index',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '首页',
      flag: 'index',
      belongToGroup: ''
    },
    component: index
  },
  {
    path: '/insideView',
    name: 'insideView',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '专病科研',
      flag: 'insideView',
      belongToGroup: '',
    },
    component: insideView,
    children: []
  },
  {
    path: '/',
    name: '/',
    redirect: '/index',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '首页',
      flag: '/',
      belongToGroup: ''
    },
    component: index
  },
  {
    path: '*',
    name: 'notFind',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '找不到页面',
      flag: 'notFind',
      belongToGroup: ''
    },
    component: notFind
  }
];

const route = routes.concat(SDResearch, crfManage, dataDictionaryManage, systemManage, fullTextSearch, openEHRIntroduction, staticInfo, allCases, patientFollowUp, researchReportManage, eventPlan,researchModel,patientListModule,diseaseChart, researchTask);
route.forEach(item=>{
  if(item.name == 'insideView'){
    route.forEach(li=>{
      if(li.meta.openMode == 2 && li.name != 'insideView') {
        item.children.push(li)
      }
    })
  }
})
export default route;
