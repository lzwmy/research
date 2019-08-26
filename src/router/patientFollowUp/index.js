const patientFollowUp = r => require.ensure([], () => r(require('packages/patientFollowUp/patientFollowUp')), 'patientFollowUp');

const routes = [
  {
    path: '/patientFollowUp',
    name: 'patientFollowUp',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '患者随访',
      flag: 'patientFollowUp',
      belongToGroup: 'patientFollowUp'
    },
    component: patientFollowUp
  }
];

export default routes;
