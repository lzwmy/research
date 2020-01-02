// 系统设置

const vm = new Vue();
const url = {
    getDataList: '/manage/system/setup/list.do',
    save: '/manage/system/setup/edit.do',
};

const http = {
    systemSetupGetDataList (params) {
        return vm.$post(url.getDataList, params, false);
    },
    systemSetupSave (params) {
        return vm.$post(url.save, params, false);
    },
};

export default http;
