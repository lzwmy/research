//我的任务
import Vue from 'vue';

const vm = new Vue();
const url = {
    //查询列表
    myTasksGetQuereList: '/subject/visit/task/subject/quereList',
    // 查询状态任务数
    getStatusList: '/subject/visit/task/subject/statusList',
};

const http = {
    myTasksGetQuereList (params) {
        return vm.$post(url.myTasksGetQuereList, params, true);
    },
    myTasksGetStatusList (params) {
        return vm.$post(url.getStatusList, params, true);
    }
};

export default http;
