// 科研项目认证
import Vue from 'vue';

const vm = new Vue();
const url = {
    //是否有权限进入科研项目
    permission: '/subject/permission',
    //获取角色信息 (系统登录)
    getRoles: '/subject/getRoles',
    //获取角色信息（分享登录）
    sharegetRoles: '/subject/share/getRoles',
    

};

const http = {
    researchAuth () {
        return vm.$post(url.permission, null, false);
    },
    researchGetRoles (params) {
        return vm.$get(url.getRoles, params, true);
    },
    researchSharegetRoles () {
        return vm.$get(url.sharegetRoles, null, false);
    },
};

export default http;
