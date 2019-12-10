// 系统设置

const vm = new Vue();
const url = {
    getDataList: '/',
    save: '/',
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
