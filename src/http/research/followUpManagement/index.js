// 随访管理
import Vue from 'vue';

const vm = new Vue();
const url = {
    //动态表格
    table: '/subject/visit/list',
    //阶段下随访点列表
    pointList: '/subject/visit/point/detail/list',
    //阶段下随访点列表
    reportPreview: '/subject/report/visit/preview.do',
    //终止随访或失访
    pointChangeStatus: '/subject/visit/point/changeStatus',

};

const http = {
    followUpManagementTable (params) {
        return vm.$post(url.table, params, false);
    },
    followUpManagementPointList (params) {
        return vm.$post(url.pointList, params, false);
    },
    followUpManagementReportPreview (params) {
        return vm.$get(url.reportPreview, params, true);
    },
    followUpManagementPointChangeStatus (params) {
        return vm.$post(url.pointChangeStatus, params, false);
    }
};

export default http;
