const eventPlan = r => require.ensure([], () => r(require('packages/eventPlan/eventPlan')), 'eventPlan');

const routes = [
  {
    path: '/eventPlan',
    name: 'eventPlan',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '事件计划',
      flag: 'eventPlan',
      belongToGroup: 'eventPlan'
    },
    component: eventPlan
  }
];

export default routes;
