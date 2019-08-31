import Vue from 'vue';

const vm = new Vue();

const url = {
  /**
   * 专病统计
   */
  //crf表单
  modelCRFFromList:"/report/model/find/crf.do",
  //统计指标
  statisticalIndicators:'/diseasespecies/formItem/list.do',
  //保存接口 -- 配置病种分析界面
  saveCustomChart:"/diseasespecies/customChart.do",
  //配置病种分析，左侧列表
  getChartListModel:"/diseasespecies/getChartList.do",
  //配置病种分析，右侧预览 -- 编辑
  simpleChartPreview:"/diseasespecies/simpleChart/preview.do",
  //饼状图
  getPieData:"/diseasespecies/getPie.do",
  //柱状图
  getBarData:"/diseasespecies/getBar.do",
  // 折线图
  getLineData:"/diseasespecies/getLine.do",
  //2D散点图
  get2DScatter:"/diseasespecies/get2DScatter.do",
  //3D散点图
  get3DScatter:"/diseasespecies/get3DScatter.do",
  //删除 --统计分析模板
  customChartDelete:"/diseasespecies/customChart/delete.do",
  // 专病统计图形列表
  chartListData:"/diseasespecies/simple/charts.do",
  //预览 -- 饼状图
  previewPie:"/diseasespecies/previewPie.do",
  //预览 -- 柱状图
  previewBar:"/diseasespecies/previewBar.do",
  //预览 -- 折线图
  previewLine:"/diseasespecies/previewLine.do",
  //预览 -- 2D散点图
  preview2DScatter:"/diseasespecies/preview2DScatter.do",
  //预览 -- 3D散点图
  preview3DScatter:"/diseasespecies/preview3DScatter.do"
};

const http = {
//专病统计
  modelCRFFromList(data) {
    return vm.$post(url.modelCRFFromList,data,false);
  },
  //统计指标
  statisticalIndicatorsQ(params) {
    return vm.$post(url.statisticalIndicators,params,true);
  },
  saveCustomChart(params) {
    return vm.$post(url.saveCustomChart,params,false);
  },
  getChartListModel(params) {
    return vm.$post(url.getChartListModel,params,true);
  },
  simpleChartPreview(params) {
    return vm.$post(url.simpleChartPreview,params,true);
  },
  getPieData(params) {
    return vm.$post(url.getPieData,params,true);
  },
  getBarData(params) {
    return vm.$post(url.getBarData,params,true);
  },
  getLineData(params) {
    return vm.$post(url.getLineData,params,true);
  },
  get2DScatter(params) {
    return vm.$post(url.get2DScatter,params,true);
  },
  get3DScatter(params) {
    return vm.$post(url.get3DScatter,params,true);
  },
  customChartDelete(params) {
    return vm.$get(url.customChartDelete,params,false)
  },
  chartListData(params) {
    return vm.$post(url.chartListData,params,true);
  },
  previewPie(params) {
    return vm.$post(url.previewPie,params,false);
  },
  previewBar(params) {
    return vm.$post(url.previewBar,params,false);
  },
  previewLine(params) {
    return vm.$post(url.previewLine,params,false);
  },
  preview2DScatter(params) {
    return vm.$post(url.preview2DScatter,params,false);
  },
  preview3DScatter(params) {
    return vm.$post(url.preview3DScatter,params,false);
  }
};

export default http;
