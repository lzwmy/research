// 研究对象 researchObject
import Vue from 'vue';

const vm = new Vue();
const url = {
    //动态表格
    table: '/subject/patient/table.do',
    
};

const http = {
    researchObjectTable (params) {
        return vm.$post(url.table, params, false);
    }
};

export default http;
