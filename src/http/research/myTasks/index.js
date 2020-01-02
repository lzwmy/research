//我的任务
import Vue from 'vue';

const vm = new Vue();
const url = {
    // 查询状态任务数
    getStatusList: '/subject/visit/task/count',
    //查询随访点列表
    getPointList : '/subject/visit/info',
    // 查询状态任务
    getTableList: '/subject/visit/task/info',
};

const http = {
    myTasksGetStatusList (params) {
        return vm.$get(url.getStatusList, params, true);
    },
    myTasksGetTableList (params) {
        return vm.$post(url.getTableList, params, false);
    },
    myTasksGetPointList (params) {
        return vm.$get(url.getPointList, params, false);
    }
};

export default http;
