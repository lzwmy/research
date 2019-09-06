const diseaseChart = r => require.ensure([], () => r(require('packages/diseaseChart/diseaseChart')), 'diseaseChart');
const chartConfig = r => require.ensure([],()=> r(require('packages/diseaseChart/chartConfig')), 'chartConfig');

const routes = [
  {
    path: '/diseaseChart',
    name: 'diseaseChart',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '病种概览',
      flag: 'diseaseChart',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: diseaseChart
  },
  {
    path:'/diseaseChart/chartConfig',
    name:'chartConfig',
    meta:{
      requireAuth: true,
      isKeepAlive: false,
      txt: '病种概览',
      flag: 'diseaseChart',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component:chartConfig
  }
];

export default routes;
