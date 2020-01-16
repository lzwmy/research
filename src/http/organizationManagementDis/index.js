
// import Vue from 'vue';

const vm = new Vue();
const url = {
    // 查询机构列表
    getOrgList: '/disease/org/list',
    // 查询自已能看的机构列表(头部)
    getUserOrgList: '/disease/user/org/list',
    //用户是否为管理员
    getUserRoles: '/disease/user/isAdmin',
    // 查询机构下的人员列表
    getUserList: '/disease/user/list',
    // 查询机构下的人员列表（包括所有人员）
    getUserListAll: '/disease/org/user/list',
    // 删除人员列表项
    deleteUser: '/disease/user/delete',
    // 新建用户
    createUser: '/disease/user/create',
    // 添加用户
    addUser: '/disease/user/add',
    // 编辑人员列表项
    updateUserList: '/disease/user/update',
    // 添加分中心
    addOrg: '/disease/org/add',
    // 编辑分中心
    editOrg: '/disease/org/edit',
    // 删除分中心
    deleteOrg: '/disease/org/delete',
    // 角色列表
    roleList: '/disease/role/list',
    // 获取分享进来角色信息
    shareUserRole: '/disease/user/role',

    // 获取录入统计数据
    getStatisticsData: '/disease/org/input/statistics',
    // 获取录入统计数据(展开行)
    getSingleStatisticsData: '/disease/org/single/statistics'
};

const http = {
    ORGDisGetOrgList (params) {
        return vm.$get(url.getOrgList, params, true);
    },
    ORGDisGetUserOrgList (params) {
        return vm.$get(url.getUserOrgList, params, true);
    },
    ORGDisGetUserRoles (params) {
        return vm.$post(url.getUserRoles, params, true);
    },
    ORGDisGetUserList (params) {
        return vm.$post(url.getUserList, params, false);
    },
    ORGDisGetUserListAll (params) {
        return vm.$get(url.getUserListAll, params, true);
    },
    ORGDisDeleteUser (params) {
        return vm.$get(url.deleteUser, params, true);
    },
    ORGDisCreateUser (params) {
        return vm.$post(url.createUser, params, false);
    },
    ORGDisAddUser (params) {
        return vm.$post(url.addUser, params, false);
    },
    ORGDisupdateUserList (params) {
        return vm.$post(url.updateUserList, params, false);
    },
    ORGDisAddOrg (params) {
        return vm.$post(url.addOrg, params, false);
    },
    ORGDisEditOrg (params) {
        return vm.$post(url.editOrg, params, false);
    },
    ORGDisDeleteOrg (params) {
        return vm.$post(url.deleteOrg, params, true);
    },
    ORGDisRoleList (params) {
        return vm.$post(url.roleList, params, false);
    },
    ORGDisShareUserRole (params) {
        return vm.$post(url.shareUserRole, params, true);
    },
    ORGDisGetStatisticsData (params) {
        return vm.$post(url.getStatisticsData, params, true);
    },
    ORGDisGetSingleStatisticsData (params) {
        return vm.$post(url.getSingleStatisticsData, params, true);
    }
};

export default http;
