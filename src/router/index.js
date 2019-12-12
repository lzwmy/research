import store from '../store/index';

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
import reportList from './reportList';
import dataMonitoring from './dataMonitoring';
import eventPlan from './eventPlan';
import researchModel from './researchModel';
import researchTask from './researchTask';
import research from './research';
import systemSetup from './systemSetup';

import diseaseModule from './diseaseModule'
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
      belongToGroup: '',
      openMode: 1
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
      openMode: 1
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
      belongToGroup: '',
      openMode: 1
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
      belongToGroup: '',
      openMode: 1
    },
    component: notFind
  }
];

const route = routes.concat(SDResearch, crfManage, dataDictionaryManage, systemManage, fullTextSearch, openEHRIntroduction, staticInfo, allCases, patientFollowUp, 
  researchReportManage, reportList, eventPlan,researchModel,patientListModule,diseaseChart, researchTask, research,diseaseModule, systemSetup , dataMonitoring);
//处理内页打开页面
route.forEach( item =>{
  if(item.name == 'insideView'){
    route.forEach(li=>{
      if(li.meta.openMode === 2 && li.name != 'insideView') {
        item.children.push(li)
      }
    })
  }
})
for(let i = 0; i < route.length; i++) {
  if(route[i].meta.openMode === 2 ) {
    route.splice(i,1)
    i--;
  }
}

//科研项目菜单列表
store.commit({
  type: 'saveTaskMenuList',
  params: research
});

export default route;
