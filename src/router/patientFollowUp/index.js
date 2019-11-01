const patientFollowUp = r => require.ensure([], () => r(require('packages/patientFollowUp/patientFollowUp')), 'patientFollowUp');
const diseasePatientFollowUp = r => require.ensure([], () => r(require('packages/diseaseModule/diseasePatientFollowUp/diseasePatientFollowUp')), 'diseasePatientFollowUp');

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
  },
  {
    path: '/diseasePatientFollowUp',
    name: 'diseasePatientFollowUp',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '患者随访',
      flag: 'diseasePatientFollowUp',
      belongToGroup: 'insideView',
      openMode: 2
    },
    component: diseasePatientFollowUp
  }
];

export default routes;
