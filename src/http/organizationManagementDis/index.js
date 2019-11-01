
import Vue from 'vue';

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
    }
};

export default http;