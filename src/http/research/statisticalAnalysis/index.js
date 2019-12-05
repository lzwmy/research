// 统计分析 statisticalAnalysis
import Vue from 'vue';

const vm = new Vue();
const url = {
    //获取分组
    getGroup: '/subject/analysis/group/list',
    //获取指标列表
    getTargetList: '/subject/analysis/variable/list',
    //获取统计数据
    getTanalysisData: '/subject/analysis/item/statistic',
    //获取图表数据
    getTanalysisPieOrBar: '/subject/analysis/pieOrBar',
};

const http = {
    statisticalAnalysisGroup (params) {
        return vm.$post(url.getGroup, params, true);
    },
    statisticalAnalysisTargetList (params) {
        return vm.$post(url.getTargetList, params, true);
    },
    statisticalAnalysisTanalysisData (params) {
        return vm.$post(url.getTanalysisData, params, false);
    },
    statisticalAnalysisPieOrBar (params) {
        return vm.$post(url.getTanalysisPieOrBar, params, false);
    },
};

export default http;
