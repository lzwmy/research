// 知识图谱

const vm = new Vue();
const url = {
    //获取力导图配置数据 
    getChartOption: '/diseasespecies/preview/knowledge/graph',



    // 获取tree数据
    getTreeData: '/diseasespecies/knowledge/graph',
    //编辑node节点
    editTreeNode: '/diseasespecies/edit/knowledge/graph',
    //删除node节点
    deleteTreeNode: '/diseasespecies/delete/knowledge/graph',
};

const http = {
    KCgetChartOption (params) {
        return vm.$post(url.getChartOption, params, true);
    },
    KCgetTreeData (params) {
        return vm.$post(url.getTreeData, params, true);
    },
    KCeditTreeNode (params) {
        return vm.$post(url.editTreeNode, params, false);
    },
    KCdeleteTreeNode (params) {
        return vm.$get(url.deleteTreeNode, params, true);
    },
};

export default http;
