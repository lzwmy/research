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
    }
};

export default http;
