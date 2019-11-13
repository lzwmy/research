
// import Vue from 'vue';

const vm = new Vue();
const url = {
    // 查询机构列表
    getOrgList: '/disease/org/list',
    //用户是否为管理员
    getUserRoles: '/disease/user/isAdmin',
    // 查询机构下的人员列表
    getUserList: '/disease/user/list',
    // 删除人员列表项
    deleteUser: '/disease/user/delete',
    // 新建用户
    createUser: '/disease/user/create',
    // 添加分中心
    addOrg: '/disease/org/add',
    // 角色列表
    roleList: '/disease/role/list',
    // 获取分享进来角色信息
    shareUserRole: '/disease/user/role',

    // 获取录入统计数据
    getStatisticsData: '/disease/org/input/statistics',
};

const http = {
    ORGDisGetOrgList (params) {
        return vm.$get(url.getOrgList, params, true);
    },
    ORGDisGetUserRoles (params) {
        return vm.$post(url.getUserRoles, params, true);
    },
    ORGDisGetUserList (params) {
        return vm.$post(url.getUserList, params, false);
    },
    ORGDisDeleteUser (params) {
        return vm.$get(url.deleteUser, params, true);
    },
    ORGDisCreateUser (params) {
        return vm.$post(url.createUser, params, false);
    },
    ORGDisAddOrg (params) {
        return vm.$post(url.addOrg, params, false);
    },
    ORGDisRoleList (params) {
        return vm.$post(url.roleList, params, false);
    },
    ORGDisShareUserRole (params) {
        return vm.$post(url.shareUserRole, params, false);
    },
    ORGDisGetStatisticsData (params) {
        return vm.$post(url.getStatisticsData, params, true);
    }
};

export default http;
