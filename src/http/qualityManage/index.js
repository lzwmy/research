
// import Vue from 'vue';

const vm = new Vue();
const url = {
    // 查询列表
    getDataList: '/disease/qc/list.do',
    // 查询表单
    getCRFList: '/disease/qc/crfList'
};

const http = {
    qualityManageGetDataList (params) {
        return vm.$get(url.getDataList, params, false);
    },
    qualityManageGetCrfList (params) {
        return vm.$get(url.getCRFList, params, false);
    }
};

export default http;
