// 系统管理 systemManage

// 角色管理 roleManage
const roleManage = r => require.ensure([], () => r(require('packages/systemManage/roleManage')), 'roleManage');
// 用户管理 userManage
const userManage = r => require.ensure([], () => r(require('packages/systemManage/userManage')), 'userManage');

const routes = [
  {
    path: '/roleManage',
    name: 'roleManage',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '角色管理',
      flag: 'roleManage',
      belongToGroup: 'systemManage'
    },
    component: roleManage
  },
  {
    path: '/userManage',
    name: 'userManage',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '用户管理',
      flag: 'userManage',
      belongToGroup: 'systemManage'
    },
    component: userManage
  }

];

export default routes;
