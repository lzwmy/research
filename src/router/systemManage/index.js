// 系统管理 systemManage

// 角色管理 roleManage
const roleManage = r => require.ensure([], () => r(require('packages/systemManageMoudule/userRoleManage/roleManage')), 'roleManage');
// 用户管理 userManage
const userManage = r => require.ensure([], () => r(require('packages/systemManageMoudule/userRoleManage/userManage')), 'userManage');

const routes = [
  {
    path: '/roleManage',
    name: 'roleManage',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '角色管理',
      flag: 'roleManage',
      belongToGroup: 'systemManage',
      openMode: 2
    },
    component: roleManage
  },
  {
    path: '/userManage',
    name: 'userManage',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '用户管理',
      flag: 'userManage',
      belongToGroup: 'systemManage',
      openMode: 2
    },
    component: userManage
  }

];

export default routes;
