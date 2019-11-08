//我的任务
import Vue from 'vue';

const vm = new Vue();
const url = {
    //查询列表
    myTasksGetQuereList: '/subject/visit/task/subject/quereList',

};

const http = {
    myTasksGetQuereList (params) {
        return vm.$post(url.myTasksGetQuereList, params, true);
    }
};

export default http;
