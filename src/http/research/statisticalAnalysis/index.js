// 统计分析 statisticalAnalysis
import Vue from 'vue';

const vm = new Vue();
const url = {
    //获取分组
    getGroup: '/subject/analysis/group/list',
};

const http = {
    statisticalAnalysisGroup (params) {
        return vm.$post(url.getGroup, params, true);
    },
};

export default http;
