const patientFollowUp = r => require.ensure([], () => r(require('packages/patientFollowUp/patientFollowUp')), 'patientFollowUp');

const routes = [
  {
    path: '/patientFollowUp',
    name: 'patientFollowUp',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '患者随访',
      flag: 'patientFollowUp',
      belongToGroup: 'patientFollowUp',
      openMode: 1
    },
    component: patientFollowUp
  }
];

export default routes;
