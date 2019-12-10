const eventPlan = r => require.ensure([], () => r(require('packages/systemManageMoudule/eventPlan/eventPlan')), 'eventPlan');

const routes = [
  {
    path: '/eventPlan',
    name: 'eventPlan',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '事件计划',
      flag: 'eventPlan',
      belongToGroup: 'systemManage',
      openMode: 2
    },
    component: eventPlan
  }
];

export default routes;
