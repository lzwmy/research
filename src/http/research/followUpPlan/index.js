// 随访计划 followUpPlan
import Vue from 'vue';

const vm = new Vue();
const url = {
    //分组阶段列表
    stageList: '/subject/visit/stage/list',
    //添加阶段
    stageAdd: '/subject/visit/stage/add',
    //编辑阶段
    edit: '/subject/visit/stage/edit',
    //删除阶段
    stageDelete: '/subject/visit/stage/delete',

    //获取阶段配置信息
    planInfo: '/subject/visit/plan/info',
    //新建阶段配置信息
    planAdd: '/subject/visit/plan/add',
    //编辑阶段配置信息
    planEdit: '/subject/visit/plan/edit',
    //获取阶段配置信息的随访点集合
    planPoints: '/subject/visit/plan/points',

    //获取随访阶段中日期的下拉框 
    dateList: '/subject/visit/date/list',
    //填写随访报告
    crfSave: '/subject/visit/crf/save',
    //预览crf表单
    simplePreview: '/subject/crf/visit/simplePreview.do',
};

const http = {
    followUpPlanStageList (params) {
        return vm.$get(url.stageList, params, true);
    },
    followUpPlanStageAdd (params) {
        return vm.$post(url.stageAdd, params, false);
    },
    followUpPlanStageEdit (params) {
        return vm.$post(url.edit, params, false);
    },
    followUpPlanstageDelete (params) {
        return vm.$get(url.stageDelete, params, true);
    },
    followUpPlanPlanInfo (params) {
        return vm.$get(url.planInfo, params, true);
    },
    followUpPlanPlanAdd (params) {
        return vm.$post(url.planAdd, params, false);
    },
    followUpPlanPlanEdit (params) {
        return vm.$post(url.planEdit, params, false);
    },
    followUpPlanPlanPoints (params) {
        return vm.$get(url.planPoints, params, true);
    },
    followUpPlanDateList (params) {
        return vm.$get(url.dateList, params, true);
    },
    followUpPlanCrfSave (params) {
        return vm.$post(url.crfSave, params, false);
    },
    followUpPlanCrfSimplePreview (params) {
        return vm.$get(url.simplePreview, params, true);
    }
};

export default http;
