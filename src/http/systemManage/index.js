// 系统管理 systemManage
// import Vue from 'vue';

const vm = new Vue();
const url = {
  /** 角色管理 */
  // 添加角色
  roleAddRole: '/role/addRole.do',
  // 给角色分配菜单权限
  roleBindMenuToRole: '/role/bindMenuToRole.do',
  // 角色状态修改
  roleChangeStatus: '/role/changeStatus.do',
  // 删除角色
  roleDeleteRole: '/role/deleteRole.do',
  // 查询角色列表
  roleFindAllRoles: '/role/findAllRoles.do',
  // 通过ID获取角色详情
  roleGetRole: '/role/getRole.do',
  // 更新角色
  roleUpdateRole: '/role/updateRole.do',
  // 获取所有菜单树
  menuFindAllMenus: '/menu/findAllMenus.do',
  // 查询角色名/角色是否已存在
  roleIsExistRole: '/role/isExistRole.do',
  /** 用户管理 */
  // 添加用户
  userAddUser: '/user/addUser.do',
  // 给指定用户绑定角色信息
  userAuthRoleToUser: '/user/authRoleToUser.do',
  // 启用/停用用户
  userChangeStatus: '/user/changeStatus.do',
  // 删除用户
  userDeleteUser: '/user/deleteUser.do',
  // 根据查询条件获取用户列表
  userFindAllUsers: '/user/findAllUsers.do',
  // 通过ID获取用户详情
  userGetUser: '/user/getUser.do',
  // 查询用户名/账号是否已存在
  userIsExistUser: '/user/isExistUser.do',
  // 重置用户密码
  userResetPwd: '/user/resetPwd.do',
  // 修改密码
  userUpdatePassword: '/user/updatePassword.do',
  // 更新用户
  userUpdateUser: '/user/updateUser.do',
  // 专病、课题组、实验组整棵树查询
  diseasespeciesFindAllDiseaseSpecies: '/diseasespecies/findAllDiseaseSpecies.do',
  // 给用户绑定病种课题实验组权限
  userAuthGroupToUser: '/user/authGroupToUser.do'
};

const http = {
  roleAddRole (params) {
    return vm.$post(url.roleAddRole, params, false);
  },
  roleBindMenuToRole (params) {
    return vm.$post(url.roleBindMenuToRole, params, false);
  },
  roleChangeStatus (params) {
    return vm.$post(url.roleChangeStatus, params);
  },
  roleDeleteRole (params) {
    return vm.$delete(url.roleDeleteRole, params);
  },
  roleFindAllRoles (params) {
    return vm.$post(url.roleFindAllRoles, params, false);
  },
  roleGetRole (params) {
    return vm.$get(url.roleGetRole, params);
  },
  roleUpdateRole (params) {
    return vm.$post(url.roleUpdateRole, params, false);
  },
  roleIsExistRole (params) {
    return vm.$get(url.roleIsExistRole, params);
  },
  menuFindAllMenus () {
    return vm.$post(url.menuFindAllMenus, {}, false);
  },
  userAddUser (params) {
    return vm.$post(url.userAddUser, params, false);
  },
  userAuthRoleToUser (params) {
    return vm.$post(url.userAuthRoleToUser, params, false);
  },
  userChangeStatus (params) {
    return vm.$post(url.userChangeStatus, params);
  },
  userDeleteUser (params) {
    return vm.$delete(url.userDeleteUser, params);
  },
  userFindAllUsers (params) {
    return vm.$post(url.userFindAllUsers, params, false);
  },
  userGetUser (params) {
    return vm.$get(url.userGetUser, params);
  },
  userIsExistUser (params) {
    return vm.$get(url.userIsExistUser, params);
  },
  userResetPwd (params) {
    return vm.$post(url.userResetPwd, params);
  },
  userUpdatePassword (params) {
    return vm.$post(url.userUpdatePassword, params, false);
  },
  userUpdateUser (params) {
    return vm.$post(url.userUpdateUser, params, false);
  },
  diseasespeciesFindAllDiseaseSpecies () {
    return vm.$post(url.diseasespeciesFindAllDiseaseSpecies, {}, false);
  },
  userAuthGroupToUser (params) {
    return vm.$post(url.userAuthGroupToUser, params, false);
  }
};

export default http;
