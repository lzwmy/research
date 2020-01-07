// 病种设置

const vm = new Vue();
const url = {
    getDataList: '/manage/diseaseSpecies/setup/list.do',
    edit: '/manage/diseaseSpecies/setup/edit.do',
    create: '/manage/diseaseSpecies/setup/create.do',
    delete: '/manage/diseaseSpecies/setup/delete.do',
};

const http = {
    diseaseSetGetDataList (params) {
        return vm.$post(url.getDataList, params, false);
    },
    diseaseSetEdit (params) {
        return vm.$post(url.edit, params, false);
    },
    diseaseSetCreate (params) {
        return vm.$post(url.create, params, false);
    },
    diseaseSetDelete (params) {
        return vm.$post(url.delete, params, true);
    },
};

export default http;
