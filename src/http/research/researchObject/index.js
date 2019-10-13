// 研究对象 researchObject
import Vue from 'vue';

const vm = new Vue();
const url = {
    //动态表格
    table: '/subject/patient/table.do',
    //关联的分组列表
    groupList: '/subject/patient/groupList.do',
    //关联的crf表单列表
    crfList: '/subject/patient/crfList.do',
    //crf表单列表和列表下的所有指标
    allFormItem: '/subject/info/allFormItem.do',
    //新建指标
    addFormItem: '/subject/info/add/formItem.do',
    //搜索栏编辑指标
    editFormItem: '/subject/info/edit/search.do',
    //回显搜索栏下的已选指标
    previewFormItem: '/subject/info/preview/search.do',
    //回显动态表格设置的已选指标
    tablePreviewFormItem: '/subject/info/preview/formItem.do',
    //表格设置编辑指标
    tableEditFormItem: '/subject/info/edit/formItem.do',
    //提交报告
    reportCommit: '/subject/report/commit.do',
    //添加研究对象
    addresearch: '/subject/patient/add/research.do',
};

const http = {
    researchObjectTable (params) {
        return vm.$post(url.table, params, false);
    },
    researchObjectCrfList (params) {
        return vm.$post(url.crfList, params, true);
    },
    researchObjectGroupList (params) {
        return vm.$post(url.groupList, params, true);
    },
    researchObjectAllFormItem (params) {
        return vm.$post(url.allFormItem, params, true);
    },
    researchObjectAddFormItem (params) {
        return vm.$post(url.addFormItem, params, false);
    },
    researchObjectEditFormItem (params) {
        return vm.$post(url.editFormItem, params, false);
    },
    researchObjectPreviewFormItem (params) {
        return vm.$get(url.previewFormItem, params, true);
    },
    researchObjectTablePreviewFormItem (params) {
        return vm.$post(url.tablePreviewFormItem, params, true);
    },
    researchObjectPreviewReportCommit (params) {
        return vm.$post(url.reportCommit, params, false);
    },
    researchObjectPreviewAddresearch (params) {
        return vm.$post(url.addresearch, params, false);
    },
    researchObjectPreviewTableEditFormItem (params) {
        return vm.$post(url.tableEditFormItem, params, false);
    }
};

export default http;
