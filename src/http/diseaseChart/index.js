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
  preview3DScatter:"/diseasespecies/preview3DScatter.do",
  /**
   *  病种概览 最新
   * **/
  //所有的统计指标下拉框
  chartFormItemList:"/chart/formItem/list.do",
  //配置病种分析界面
  chartCustomChartSave:"/chart/customChart.do",
  //配置病种分析界面，左侧的图表列表
  chartGetChartListNew:"/chart/getChartList.do",
  //删除自定义表格
  chartCustomChartDeleteNew:"/chart/customChart/delete.do",
  //配置病种分析界面，右侧的图表预览
  chartSimpleChartPreviewNew:"/chart/simpleChart/preview.do",
  //饼状图
  chartGetPieNew:"/chart/getPie.do",
  //柱状图
  chartGetBarNew:"/chart/getBar.do",
  //折线图
  chartGetLineNew:"/chart/getLine.do",
  //2D-散点图
  chartGet2DScatterNew:"/chart/get2DScatter.do",
  //3D- 散点图
  chartGet3DScatterNew:"/chart/get3DScatter.do",
  //预览- 饼状图
  chartPreviewPieNew:"/chart/previewPie.do",
  //预览- 柱状图
  chartPreviewBarNew:"/chart/previewBar.do",
  //预览- 折线图
  chartPreviewLineNew:"/chart/previewLine.do",
  //预览- 2D散点图
  chartPreview2DScatterNew:"/chart/preview2DScatter.do",
  //预览- 3D散点图
  chartPreview3DScatterNew:"/chart/preview3DScatter.do",
  //病种的患者治疗抢矿熟料统计和简略图表预览
  chartSimpleChartNew:"/chart/simple/charts.do",
  //自定义图表下拉框选择病种下的CRF表单
  chartDiseaseCrfListNew:"/chart/disease/crf.do",
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
  },
  //最新
  chartFormItemList(params) {
    return vm.$post(url.chartFormItemList,params,true);
  },
  chartCustomChartSave(params) {
    return vm.$post(url.chartCustomChartSave,params,false);
  },
  chartGetChartListNew(params) {
    return vm.$post(url.chartGetChartListNew,params,true);
  },
  chartCustomChartDeleteNew(params) {
    return vm.$get(url.chartCustomChartDeleteNew,params,true);
  },
  chartSimpleChartPreviewNew(params) {
    return  vm.$post(url.chartSimpleChartPreviewNew,params,true);
  },
  chartGetPieNew(params) {
    return vm.$post(url.chartGetPieNew,params,true);
  },
  chartGetBarNew(params) {
    return vm.$post(url.chartGetBarNew,params,true);
  },
  chartGetLineNew(params) {
    return vm.$post(url.chartGetLineNew,params,true);
  },
  chartGet2DScatterNew(params) {
    return vm.$post(url.chartGet2DScatterNew,params,true);
  },
  chartGet3DScatterNew(params) {
    return vm.$post(url.chartGet3DScatterNew,params,true);
  },
  chartPreviewPieNew(params) {
    return vm.$post(url.chartPreviewPieNew,params,false);
  },
  chartPreviewBarNew(params) {
    return vm.$post(url.chartPreviewBarNew,params,false);
  },
  chartPreviewLineNew(params) {
    return vm.$post(url.chartPreviewLineNew,params,false);
  },
  chartPreview2DScatterNew(params) {
    return vm.$post(url.chartPreview2DScatterNew,params,false);
  },
  chartPreview3DScatterNew(params) {
    return vm.$post(url.chartPreview3DScatterNew,params,false);
  },
  chartSimpleChartNew(params) {
    return vm.$post(url.chartSimpleChartNew,params,true);
  },
  chartDiseaseCrfListNew(params) {
    return vm.$get(url.chartDiseaseCrfListNew);
  }
};

export default http;
