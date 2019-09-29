// 项目分组 projectGrouping
import Vue from 'vue';

const vm = new Vue();
const url = {
    //分组回显
    group: '/subject/Group/preview.do',
    //分组添加
    create: '/subject/Group/create.do',
    //编辑组名
    edit: '/subject/Group/edit.do',
    //删除分组
    delete: '/subject/Group/delete.do',
    //批量保存分组
    saveAll: '/subject/Group/saveAll.do',
    
};

const http = {
    projectGroupingGroup (params) {
        return vm.$post(url.group, params, true);
    },
    projectGroupingEdit (params) {
        return vm.$post(url.edit, params, false);
    },
    projectGroupingcreate (params) {
        return vm.$post(url.create, params, false);
    },
    projectGroupingdelete (params) {
        return vm.$post(url.delete, params, true);
    },
    projectGroupingsaveAll (data) {
        return vm.$post(url.saveAll, data, false);
    }
};

export default http;
