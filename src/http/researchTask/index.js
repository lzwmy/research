
import Vue from 'vue';

const vm = new Vue();
const url = {
    // 创建项目
    create: '/subject/info/create.do',
    // 查询项目列表
    getDataList: '/subject/info/list.do',
    // 删除项目
    delete: '/subject/info/delete.do',
    // 回显项目
    previewInfo: '/subject/info/preview.do',
    // 编辑项目
    edit: '/subject/info/modify.do',
    // 单文件上传
    uploadFile: '/subject/info/uploadFile.do',
    // 单文件删除
    deleteFile: '/subject/info/deleteFile.do',
};

const http = {
    RTASKcreate (params) {
        return vm.$post(url.create, params, false);
    },
    RTASKgetDataList (params) {
        return vm.$post(url.getDataList, params, true);
    },
    RTASKdelete (params) {
        return vm.$post(url.delete, params, true);
    },
    RTASKpreviewInfo (params) {
        return vm.$post(url.previewInfo, params, true);
    },
    RTASKedit (params) {
        return vm.$post(url.edit, params, false);
    },
    RTASKuploadFile (params) {
        return vm.$post(url.uploadFile, params, false);
    },
    RTASKdeleteFile (params) {
        return vm.$post(url.deleteFile, params, true);
    }
};

export default http;
