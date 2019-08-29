// CRF管理 crfManage

// CRF配置 crfConfig
const crfConfig = r => require.ensure([], () => r(require('packages/crfManage/crfConfig')), 'crfConfig');
// CRF表单填写 crfFill
const crfFill = r => require.ensure([], () => r(require('packages/crfManage/crfFill')), 'crfFill');

//CDF 表单 配置入口
const CDRFromConfig = r => require.ensure([], () => r(require('packages/CDRFormManage/index')), 'CDRFromConfig')
//CDF 预览页面
const CDFPreviewPage = r => require.ensure([], () => r(require('packages/CDRFormManage/preview')), 'CDFPreviewPage')
// 小节预览
const CDFSectionPreviewPage = r => require.ensure([], () => r(require('packages/CDRFormManage/sectionPreview')), 'CDFSectionPreviewPage')
//单页预览
const CDFSinglePagePreview = r => require.ensure([], () => r(require('packages/CDRFormManage/singlePagePreview')), 'CDFSinglePagePreview')
//报告预览
const CDFReportPagePreview = r => require.ensure([], () => r(require('packages/CDRFormManage/reportPreview')), 'CDFReportPagePreview')

const reportFill = r => require.ensure([], () => r(require('packages/CDRFormManage/reportFill')), 'reportFill')

const routes = [
  {
    path: '/crfConfig',
    name: 'crfConfig',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: 'CRF配置',
      flag: 'crfConfig',
      belongToGroup: 'crfManage',
      openMode: 2
    },
    component: CDRFromConfig
  },
  {
    path: '/crfFill',
    name: 'viewPage',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '预览',
      flag: 'crfFill',
      belongToGroup: 'crfManage',
      openMode: 2
    },
    component: CDFPreviewPage
  },
  {
    path: '/sectionPreview',
    name: 'sectionPreview',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '小节预览',
      flag: 'sectionPreview',
      belongToGroup: 'crfManage',
      openMode: 2
    },
    component: CDFSectionPreviewPage
  },
  {
    path: '/singlePreview',
    name: 'singlePreview',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '单页预览',
      flag: 'singlePreview',
      belongToGroup: 'crfManage',
      openMode: 2
    },
    component: CDFSinglePagePreview
  },
  {
    path: '/reportPreview',
    name: 'reportPreview',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '报告预览',
      flag: 'reportPreview',
      belongToGroup: 'crfManage',
      openMode: 2
    },
    component: CDFReportPagePreview
  },
  {
    path: '/reportFill',
    name: 'reportFill',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '报告编辑',
      flag: 'reportFill',
      belongToGroup: 'crfManage',
      openMode: 2
    },
    component: reportFill
  }
];

export default routes;
