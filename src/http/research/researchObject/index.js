// 研究对象 researchObject
import Vue from 'vue';

const vm = new Vue();
const url = {
    //动态表格
    table: '/subject/patient/table.do',
    //关联的crf表单列表
    crfList: '/subject/patient/crfList.do',
    //crf表单列表和列表下的所有指标
    allFormItem: '/subject/info/allFormItem.do',
    //回显crf表单列表下的已选指标
    condition: '/subject/patient/research/condition.do',
};

const http = {
    researchObjectTable (params) {
        return vm.$post(url.table, params, false);
    },
    researchObjectCrfList (params) {
        return vm.$post(url.crfList, params, true);
    },
    researchObjectAllFormItem (params) {
        return vm.$post(url.allFormItem, params, true);
    },
    researchObjectCondition (params) {
        return vm.$get(url.condition, params, true);
    }
};

export default http;
