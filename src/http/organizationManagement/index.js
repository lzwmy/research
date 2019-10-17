
import Vue from 'vue';

const vm = new Vue();
const url = {
    // 查询机构列表
    getOrgList: '/subject/org/list',
    // 查询机构下的人员列表
    getUserList: '/subject/user/list',
    // 删除人员列表项
    deleteUserList: '/subject/user/delete',
    // 查询所有角色列表
    getRoleListAll: '/subject/role/list',
    // 新建用户
    createUser: '/subject/user/create',
    // 编辑用户
    editUser: '/subject/user/edit',
    // 添加分中心
    addOrg: '/subject/org/add'
};

const http = {
    ORGgetOrgList (params) {
        return vm.$get(url.getOrgList, params, true);
    },
    ORGgetUserList (params) {
        return vm.$post(url.getUserList, params, false);
    },
    ORGdeleteUserList (params) {
        return vm.$get(url.deleteUserList, params, false);
    },
    ORGgetRoleListAll (params) {
        return vm.$get(url.getRoleListAll, params, false);
    },
    ORGcreateUser (params) {
        return vm.$post(url.createUser, params, false);
    },
    ORGeditUser (params) {
        return vm.$post(url.editUser, params, false);
    },
    ORGaddOrg (params) {
        return vm.$post(url.addOrg, params, false);
    }
};

export default http;
