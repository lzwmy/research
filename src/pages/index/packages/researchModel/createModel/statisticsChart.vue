<template>
  <div class="mask_layer_container-subject">
    <!--<div class="component_head flex-between-center">
      <p>{{$route.meta.txt}}</p>
      <div class="head_content cur_pointer">
        <i class="iconfont iconguanbi" @click="close"></i>
      </div>
    </div>-->
    <div class="mask_layer_body-chart">
      <div class="mask_layer_left">
        <div class="statistical_analysis_model">图标类型</div>
        <div class="statistical_analysis_content">
          <div class="statistical_analysis_item"
               :class="{'add_bg':bgColor == item.chartId}"
               v-for="(item,index) in modelList"
               :key="index"
               @click="changeBGColor(item)">
            <div class="active_column" :class="{'display_show':bgColor == item.chartId}"></div>
            <div class="item_display">
              <span :title="item.chartName">{{item.chartName}}</span>
            </div>
            <!--<div class="item_modify" :class="{'display_show':bgColor == item.chartId}">
                <span @click.stop="deleteModel(item)">
                  <i class="iconfont iconshanchu"></i>
                </span>
            </div>-->
          </div>
          <div class="blank_img" v-show="modelList.length==0">
            <img src="./images/blank_page.png" alt="">
          </div>
        </div>
        <!--<div class="statistical_analysis_Add">
          <div class="add_content" @click="addModelFromChart">
            <i class="iconfont icontianjia"></i>
            新增
          </div>
        </div>-->
      </div>
      <div class="mask_layer_right">
        <div class="model_set">
          <span>指标设置</span>
          <span @click="close">
            <i class="iconfont iconguanbi2"></i>
          </span>
        </div>
        <div class="model_window_box" v-show="blankImg==true" v-loading="loading" element-loading-text="加载中">
          <div class="model_from_set" >
            <!--<div class="from_name">图表名称</div>
            <el-input v-model="chartName" size="small" placeholder="请输入模板名称"></el-input>
            <div class="from_name">图表类型</div>
            <div class="from_chart_type">
              <el-radio v-model="chartType" label="PIE" @change="changeChartType('PIE')">饼状图</el-radio>
              <el-radio v-model="chartType" label="BAR" @change="changeChartType('BAR')">柱状图</el-radio>
              <el-radio v-model="chartType" label="LINE" @change="changeChartType('LINE')">折线图</el-radio>
              <el-radio v-model="chartType" label="2D_SCATTER" @change="changeChartType('2D_SCATTER')">2D散点图</el-radio>
              <el-radio v-model="chartType" label="3D_SCATTER" @change="changeChartType('3D_SCATTER')">3D散点图</el-radio>
            </div>-->
            <!--<div class="from_name">CRF表单</div>
            <el-select v-model="crf" @change="changeCRFFrom">
              <el-option
                v-for="item in fromList"
                :key="item.id"
                :label="item.crfName"
                :value="item.id">
              </el-option>
            </el-select>-->
            <div class="from_name">病种选择</div>
            <el-cascader
              v-model="diseaseValue"
              :options="diseaseList"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChangeCrf">
            </el-cascader>
            <div class="from_name">统计指标</div>
            <el-select v-model="statistics" v-loading="checkLoading" @change="changeTarget(statistics)">
              <el-option
                v-for="item in statisticsList"
                :key="item.formItemId"
                :label="item.formItemName"
                :value="item.formItemId">
              </el-option>
            </el-select>
            <div class="from_name" v-show="chartType=='BAR'">对比指标</div>
            <el-select v-model="compareFormItemId"  v-show="chartType=='BAR'" v-loading="checkLoading" @change="changeCompareValuePath(compareFormItemId)">
              <el-option
                v-for="item in compareFormItemList"
                :key="item.formItemId"
                :label="item.formItemName"
                :value="item.formItemId">
              </el-option>
            </el-select>
            <div class="from_name" v-if="chartType!=='PIE'&&chartType!=='BAR'&&chartType!=='LINE'">X轴</div>
            <el-select v-model="xaxis" v-if="chartType!=='PIE'&&chartType!=='BAR'&&chartType!=='LINE'" v-loading="checkLoading">
              <el-option
                v-for="item in xaxisList"
                :key="item.formItemId"
                :label="item.formItemName"
                :value="item.formItemId">
              </el-option>
            </el-select>
            <div class="from_name" v-if="chartType!=='PIE'&&chartType!=='BAR'&&chartType!=='LINE'">Y轴</div>
            <el-select v-model="yaxis" v-if="chartType!=='PIE'&&chartType!=='BAR'&&chartType!=='LINE'" v-loading="checkLoading">
              <el-option
                v-for="item in yaxisList"
                :key="item.formItemId"
                :label="item.formItemName"
                :value="item.formItemId">
              </el-option>
            </el-select>
            <div class="from_name" v-if="chartType!=='PIE'&&chartType!=='BAR'&&chartType!=='LINE'&&chartType!=='2D_SCATTER'">Z轴</div>
            <el-select v-model="zaxis" v-if="chartType!=='PIE'&&chartType!=='BAR'&&chartType!=='LINE'&&chartType!=='2D_SCATTER'" v-loading="checkLoading">
              <el-option
                v-for="item in zaxisList"
                :key="item.formItemId"
                :label="item.formItemName"
                :value="item.formItemId">
              </el-option>
            </el-select>
            <!--<div class="submit_btn">
              <el-button type="primary" @click="saveFromChart">保存</el-button>
            </div>-->
          </div>
          <div class="model_view">
            <div class="chart_window" v-loading="chartLoading" element-loading-text="更新中">
              <pie-chart v-if="chartType=='PIE'" :option="pitOption" ></pie-chart>
              <histogram-chart v-if="chartType == 'BAR'" :option="histogramOption"></histogram-chart>
              <polygonal-chart v-if="chartType=='LINE'" :option="lineOption"></polygonal-chart>
              <plane-chart v-if="chartType== '2D_SCATTER'" :option="planeOption"></plane-chart>
              <three-dimensional v-if="chartType == '3D_SCATTER'" :option="threeDimensionalOption"></three-dimensional>
            </div>
            <div class="preview_chart">
              <el-button type="primary" @click="clickPreviewChart">预览</el-button>
            </div>
          </div>
        </div>
        <div class="blank_img" v-show="blankImg==false">
          <img src="./images/blank_page.png" alt="">
          <p>请选择图表类型...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pieChart from './chart/piechart';
  import histogramChart from './chart/histogram';
  import polygonalChart from './chart/polygonalChart';
  import planeChart from './chart/2D';
  import threeDimensional from './chart/3D';
  export default {
    props:{
      maskShow:{
        type:Boolean,
        default:null
      }
    },
    components:{
      pieChart,
      histogramChart,
      polygonalChart,
      planeChart,
      threeDimensional
    },
    data() {
      return {
        dialogVisible:false,
        loading:false,
        blankImg:false,
        chartLoading:false,
        checkLoading:false,
        bgColor:'',
        compareFormItemId:"",
        compareFormItemList:[],
        mutStatistics:[], // 柱状图 统计指标
        chartName:"",
        chartType:"PIE",
        fromList:[],
        crf:"",
        statisticsList:[],
        statistics:"",
        xaxisList:[],
        xaxis:"",
        yaxisList:[],
        yaxis:"",
        zaxisList:[],
        zaxis:"",
        modelList:[
          {
            chartName:"饼状分析",
            chartId:1,
            chartType:"PIE",
          },
          {
            chartName:"堆叠柱状分析",
            chartId:2,
            chartType:"BAR",
          },
          {
            chartName:"折线分析",
            chartId:3,
            chartType:"LINE",
          },
          {
            chartName:"2D散点分析",
            chartId:4,
            chartType:"2D_SCATTER",
          },
          {
            chartName:"3D散点分析",
            chartId:5,
            chartType:"3D_SCATTER",
          }
        ],
        diseaseList:[],//crf 表单 级联选择器
        diseaseValue:[],// crf 选择值
        valueText:"", //统计指标的值域 ,
        compareValuePath:"",//对比指标值域
        //图表配置
        chart:null,
        //饼状图
        pitOption:{
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          credits:{
            enabled:false
          },
          title: {
            text: '饼状图-样例',
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          legend: {
            enabled:true,
            align:'center',
            /*layout: 'vertical',
            floating: true,
            align: 'right',
            verticalAlign: 'top',
            x: 10,
            y: 0,*/
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              },
              showInLegend: true,
            }
          },
          series: [
            {
              name: 'Brands',
              colorByPoint: true,
              data: [
                {
                  name: '样例1',
                  y: 10.85
                }, {
                  name: '样例2',
                  y: 4.67
                }, {
                  name: '样例3',
                  y: 4.18
                }, {
                  name: '样例4',
                  y: 7.05
                }
              ]
            }
          ]
        },
        //柱状图
        histogramOption:{
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column'
          },
          credits:{
            enabled:false
          },
          title: {
            text: '柱状图-样例'
          },
          legend:{
            enabled:false
          },
          xAxis: {
            categories: ['样例1', '样例2', '样例3'],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            lineWidth: 1,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickWidth: 0
          },
          tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0
            },
            series: {
              stacking: 'normal'
            }
          },
          series: [
            {
              name: '样例1',
              data: [5, 3, 4]
            }, {
              name: '样例2',
              data: [2, 2, 3]
            }, {
              name: '样例3',
              data: [3, 4, 4]
            }
          ]
        },
        //折线图
        lineOption:{
          chart: {
            type: 'line'
          },
          credits:{
            enabled:false
          },
          title:{
            text:"折线图-样例"
          },
          xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
            title: {
              text: '',
            },
            lineWidth: 1,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickWidth: 0
          },
          plotOptions: {
            line: {
              dataLabels: {
                // 开启数据标签
                enabled: false
              },
              // 关闭鼠标跟踪，对应的提示框、点击事件会失效
              enableMouseTracking: true
            }
          },
          series: [{
            name: '样例',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          }]
        },
        //2D散点图
        planeOption:{
          chart: {
            type: 'scatter',
            zoomType: 'xy'
          },
          credits:{
            enabled:false
          },
          title:{
            text:"2D散点图-样例"
          },
          xAxis: {
            title: {
              enabled: true,
              text: ''
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
          },
          yAxis: {
            title: {
              text: ''
            },
            lineWidth: 1,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickWidth: 0
          },
          plotOptions:{
            tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x} cm, {point.y} kg'
            }
          },
          series: [{
            name: '样例1',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6]]
          }, {
            name: '样例2',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8]]
          }]
        },
        //3D散点图
        threeDimensionalOption:{
          chart: {
            renderTo: 'three_charts_container',
            margin: 100,
            type: 'scatter',
            options3d: {
              enabled: true,
              alpha: 10,
              beta: 30,
              depth: 250,
              viewDistance: 5,
              frame: {
                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
              }
            }
          },
          credits:{
            enabled:false
          },
          title: {
            text: '3D散点图-样例'
          },
          subtitle: {
            text: '单击并拖动鼠标可旋转绘图区'
          },
          plotOptions: {
            scatter: {
              width: 10,
              height: 10,
              depth: 10
            }
          },
          yAxis: {
            min: 0,
            title: null
          },
          xAxis: {
            min: 0,
            gridLineWidth: 1
          },
          zAxis: {
            min: 0,
          },
          legend: {
            enabled: false
          },
          series: [{
            name: '随机数据',
            colorByPoint: true,
            data: [
              [1, 6, 5], [8, 7, 9], [1, 3, 4], [4, 6, 8], [5, 7, 7], [6, 9, 6], [7, 0, 5], [2, 3, 3], [3, 9, 8], [3, 6, 5], [4, 9, 4], [2, 3, 3], [6, 9, 9], [0, 7, 0], [7, 7, 9], [7, 2, 9], [0, 6, 2], [4, 6, 7], [3, 7, 7], [0, 1, 7], [2, 8, 6], [2, 3, 7]
            ]
          }]
        }
      }
    },
    watch:{
      'dialogVisible':function (value) {
        if(value == false) {
          this.$emit('displayShow',value)
        }
      },
      'maskShow':function (value) {
        this.dialogVisible = value;
        if(value){
          this.initPage();
          this.getChartListModel();
          this.modelCRFFromList();
        }
      }
    },
    methods:{
      resize() {
        let height = $('.insideContainer').height();
        $(".mask_layer_container-subject").height(height-112);
      },
      //初始化
      initPage() {
        console.log('初始化');
        this.blankImg = false;
        this.chartName = "";
        this.crf = "";
        this.statistics = "";
        this.xaxis = "";
        this.yaxis = "";
        this.zaxis = "";
        this.bgColor = "";
        this.valueText = "";
        this.compareValuePath = "";
        this.mutStatistics = [];
        this.statisticsList = [] ;
        this.chartType = "PIE";
        this.compareFormItemId = "";
        this.compareFormItemList = [];
        this.$emit('changeLoadding',false);
        this.$nextTick(()=>{
          this.resize();
        });
      },
      close() {
        this.initPage();
        window.history.go(-1);
      },
      changeBGColor(data) {
        this.bgColor = data.chartId;
        this.chartType = data.chartType;
        this.blankImg = true;
        /*this.loading = true;
        this.simpleChartPreview(data.chartId);*/
      },
      //添加模板配置
      addModelFromChart() {
        this.initPage();
        this.blankImg = true;
      },
      //删除
      deleteModel(data) {
        this.customChartDelete(data.chartId);
        this.initPage();
      },
      //表类型切换
      changeChartType(value) {
        this.chartType = value;
        this.crf = "";
        this.statistics = "";
        this.mutStatistics = [];
        this.xaxis = "";
        this.yaxis = "";
        this.zaxis = "";
        this.compareFormItemId = "";
        this.compareFormItemList = [];
      },
      changeCRFFrom(value) {
        console.log(value);
        this.checkLoading = true;
        this.statisticalIndicators(value);
        this.xyz(value);
      },
      handleChangeCrf(value) {
        this.checkLoading = true;
        this.statisticalIndicators(value[1]);
        this.xyz(value[1]);
      },
      changeTarget(data) {
        let path = this.statisticsList.filter((item)=>{
          if(item.path == data) {
            return item
          }
        });
        this.valueText = path[0].valueRange || "" ;
      },
      changeCompareValuePath(data) {
        let path = this.compareFormItemList.filter(item => {
          if(item.path == data) {
            return item;
          }
        })
        this.compareValuePath = path[0].valueRange || "";
      },
      // 预览
      clickPreviewChart() {
        if(this.diseaseValue.length==0) {
          this.$message.info("请选择病种");
          return ;
        }
        this.chartLoading = true;
        switch (this.chartType) {
          case "PIE":
            this.previewPie();
            break;
          case "BAR":
            this.previewBar();
            break;
          case "LINE":
            this.previewLine();
            break;
          case "2D_SCATTER":
            this.preview2DScatter();
            break;
          case "3D_SCATTER":
            this.preview3DScatter();
            break;
          default:
            break;
        }
      },
      //保存
      saveFromChart() {
        console.log('保存 按钮');
        this.loading = true;
        if(this.bgColor==""){ //保存方法
          this.saveCustomChart();
        }else{ // 编辑保存
          this.modifyCustomChart();
        }
      },
      //病种 选择
      async subjectTestChart() {
        let that = this;
        try{
          // let data = await that.$http.subjectTestChart();
          let data = await that.$http.chartDiseaseCrfListNew();
          if(data.code == 0) {
            this.diseaseList = data.data;
          }
        }catch (error) {
          console.log(error)
        }
      },
      // CRF 表单
      async modelCRFFromList() {
        let that = this;
        let fromData = {
          "crfIsAvailable": 1,
          "diseaseId": that.$route.query.id
        };
        try{
          let data = await that.$http.modelCRFFromList(fromData);
          if(data.code == 0) {
            this.fromList = data.data
          }
        }catch (error) {
          console.log(error)
        }
      },
      //分析模板列表
      async getChartListModel() {
        let that = this;
        let fromData = {
          diseaseId: that.$route.query.id
        };
        try{
          let data = await that.$http.getChartListModel(fromData);
          if(data.code == 0) {
            this.modelList = data.data;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //统计分析
      async statisticalIndicators(value) {
        let that = this;
        /*let flag = false;
        if(this.chartType=='PIE'||this.chartType=='BAR'||this.chartType == 'LINE'){
          flag = false;
        }else{
          flag = true;
        };*/
        let fromData = {
          crfId:value,
          scatterFlag:false
        };
        try{
          // let data = await that.$http.statisticalIndicatorsQ(fromData);
          let data = await that.$http.chartFormItemList(fromData);
          if(data.code == 0) {
            that.statisticsList = data.data;
            that.compareFormItemList = data.data;
            /*that.xaxisList = data.data;
            that.yaxisList = data.data;
            that.zaxisList = data.data;*/
          }
          this.loading = false;
          that.checkLoading = false;
        }catch (error) {
          console.log(error);
          this.loading = false;
        }
      },
      //xyz 轴
      async xyz(value) {
        let that = this;
        let fromData = {
          crfId:value,
          scatterFlag:true
        };
        try{
          // let data = await that.$http.statisticalIndicatorsQ(fromData);
          let data = await that.$http.chartFormItemList(fromData);
          if(data.code == 0) {
            that.xaxisList = data.data;
            that.yaxisList = data.data;
            that.zaxisList = data.data;
          }
          this.loading = false;
          that.checkLoading = false;
        }catch (error) {
          console.log(error);
          this.loading = false;
        }
      },
      //保存
      async saveCustomChart() {
        let that = this;
        that.loading = true;
        let fromItemList = [];
        if(this.chartType == 'PIE'||this.chartType == 'LINE'||this.chartType == '2D_SCATTER'||this.chartType == '3D_SCATTER'){
          fromItemList.push(that.statistics)
        }else if(this.chartType=='BAR'){
          fromItemList.push(that.statistics)
        }
        let fromData = {
          "xaxis": that.xaxis || "",
          "yaxis": that.yaxis || "",
          "zaxis": that.zaxis || "",
          "chartId": "",
          "chartName": that.chartName || "",
          "chartType": that.chartType || "",
          "crfId": that.crf || "",
          "diseaseId": that.$route.query.id || "",
          "formItemIds":fromItemList || [],
          "charts": [],
          "compareFormItemId":that.compareFormItemId || ""
        };
        try {
          let data = await that.$http.saveCustomChart(fromData);
          console.log(data);
          if(data.code == 0) {
            this.dialogVisible  = false;
            that.$message({
              type:'success',
              message:data.msg
            });
            that.init();
            that.modelCRFFromList();
            this.loading = false;
            window.history.go(-1);
          }
        }catch (error) {
          console.log(error)
        }
        this.loading = false;
      },
      //编辑保存
      async modifyCustomChart() {
        let that = this;
        let fromItemList = [];
        if(this.chartType == 'PIE'||this.chartType == 'LINE'||this.chartType == '2D_SCATTER'||this.chartType == '3D_SCATTER'){
          fromItemList.push(that.statistics)
        }else if(this.chartType=='BAR'){
          fromItemList.push(that.statistics)
        }
        let fromData = {
          "xaxis": that.xaxis || "",
          "yaxis": that.yaxis || "",
          "zaxis": that.zaxis || "",
          "chartId": that.bgColor||"",
          "chartName": that.chartName || "",
          "chartType": that.chartType || "",
          "crfId": that.crf || "",
          "diseaseId": that.$route.query.id || "",
          "formItemIds":fromItemList || [],
          "charts": [],
          "compareFormItemId":that.compareFormItemId || ""
        };
        try {
          let data = await that.$http.saveCustomChart(fromData);
          console.log(data);
          if(data.code == 0) {
            this.dialogVisible  = false;
            that.$message({
              type:'success',
              message:data.msg
            })
            // that.$emit('refresh',{refresh:true})
            window.history.go(-1);
          }
        }catch (error) {
          console.log(error)
        }
      },
      //编辑 预览
      async simpleChartPreview(value) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try{
          let data = await that.$http.simpleChartPreview(fromData);
          console.log(data);
          if(data.code == 0) {
            that.chartName = data.data.chartName;
            that.chartType = data.data.chartType;
            //统计分析 列表
            that. xyz(data.data.crfId);
            that.statisticalIndicators(data.data.crfId);

            that.crf = data.data.crfId;

            //图形渲染数据
            switch (data.data.chartType) {
              case "PIE":
                that.getPieData(value);
                that.statistics = data.data.formItemIds[0];
                break;
              case "BAR":
                that.getBarData(value);
                that.statistics = data.data.formItemIds[0];
                that.compareFormItemId = data.data.compareFormItemId;
                break;
              case "LINE":
                that.getLineData(value);
                that.statistics = data.data.formItemIds[0];
                break;
              case "2D_SCATTER":
                that.get2DScatter(value);
                that.statistics = data.data.formItemIds[0];
                that.xaxis = data.data.xaxis;
                that.yaxis = data.data.yaxis;
                break;
              case "3D_SCATTER":
                that.get3DScatter(value);
                that.statistics = data.data.formItemIds[0];
                that.xaxis = data.data.xaxis;
                that.yaxis = data.data.yaxis;
                that.zaxis = data.data.zaxis;
                break;
              default:
                break;
            }
          }
        }catch (error) {
          console.log(error)
        }
      },
      //删除
      async customChartDelete(value) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try{
          let data = await that.$http.customChartDelete(fromData);
          if(data.code == 0) {
            that.$notice(data.msg)
          }
        }catch(error) {
          console.log(error);
        }
        that.getChartListModel();
      },
      //饼状图
      async getPieData(value) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try {
          let data = await that.$http.getPieData(fromData);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.pitOption)));
            let array = [];
            for(let i=0;i<data.data.data.length;i++) {
              array.push({
                name:data.data.data[i].key,
                y:data.data.data[i].value
              })
            }
            copyOption.title.text = data.data.chartName;
            // copyOption.series[0].data = data.data;
            let obj = {
              name: 'Brands',
              colorByPoint: true,
              data:array
            }
            copyOption.series[0].data = array;
            that.pitOption = copyOption;
          }
        }catch (error) {
          console.log(error);
        }

      },
      //柱状图
      async getBarData(value) {
        let that = this;
        let formData = {
          chartId:value
        };
        try{
          let data = await that.$http.getBarData(formData);
          console.log(data);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.histogramOption)));
            copyOption.title.text = data.data.chartName;
            copyOption.xAxis.categories = data.data.xaxis;
            copyOption.yAxis.title = "";
            /*let obj = {
              name: 'Brands',
              colorByPoint: true,
              data:data.data.data
            };*/
            copyOption.series = data.data.series;
            that.histogramOption = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //折线图
      async getLineData(value) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try {
          let data = await that.$http.getLineData(fromData);
          console.log(data);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.lineOption)));
            copyOption.title.text = data.data.chartName;
            copyOption.xAxis.categories = data.data.xaxis;
            copyOption.yAxis.title.text = "";
            copyOption.series = data.data.series;
            that.lineOption = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //2D散点图
      async get2DScatter(value) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try {
          let data = await that.$http.get2DScatter(fromData);
          console.log(data)
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.planeOption)));6
            copyOption.title.text = data.data.chartName;
            copyOption.xAxis.title.text = "";
            copyOption.yAxis.title.text = "";
            let array = [];
            if(data.data.data!=='null' &&data.data.data!==null){
              for(let i=0;i<data.data.data.length;i++) {
                array.push({
                  name:data.data.data[i].termItemName,
                  data:data.data.data[i].data
                })
              }
            }else{
              array.push({
                name:"",
                data:[]
              })
            }
            copyOption.series = array;
            that.planeOption = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //3D散点图
      async get3DScatter(value) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try {
          let data = await that.$http.get3DScatter(fromData);
          console.log(data);
          if(data.code ==0 ){
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.threeDimensionalOption)));
            copyOption.title.text = data.data.chartName;
            let array = [];
            if(data.data.data!=='null'&&data.data.data!==null){
              for(let i=0;i<data.data.data.length;i++) {
                array.push({
                  name:data.data.data[i].termItemName,
                  colorByPoint: true,
                  data:data.data.data[i].data
                })
              }
            }else{
              array.push({
                name:"",
                colorByPoint: true,
                data:[]
              })
            }
            copyOption.series = array;
            that.threeDimensionalOption = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //预览-- 饼状图
      async previewPie() {
        let that = this;
        let formItemIds = [];
        if(that.statistics!==""){
          formItemIds.push(that.statistics)
        }else{
          formItemIds = []
        }
        let fromData = {
          "chartName":"" ,
          "chartType": that.chartType || "",
          "crfId": that.diseaseValue[1]|| "",
          "formItemIds": formItemIds
        };
        let formData = {
          "chartName": that.chartName || "" ,
          "chartType": that.chartType || "",
          "crfId": that.diseaseValue[1] || "",
          "path": that.statistics || "",
          "valueText": that.valueText || ""
        };
        try {
          // let data = await that.$http.previewPie(fromData);
          let data = await that.$http.chartPreviewPieNew(formData);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.pitOption)));
            let array = [];
            for(let i=0;i<data.data.data.length;i++) {
              array.push({
                name:data.data.data[i].key,
                y:data.data.data[i].value
              })
            }
            copyOption.title.text = data.data.chartName;
            // copyOption.series[0].data = data.data;
            let obj = {
              name: 'Brands',
              colorByPoint: true,
              data:array
            }
            copyOption.series[0].data = array;
            that.pitOption = copyOption;
          }
          that.chartLoading = false;
        }catch(error) {
          console.log(error)
          that.chartLoading = false;
        }
        that.chartLoading = false;
      },
      // 预览 -- 柱状图
      async previewBar() {
        let that = this;
        let formItemIds = [];
        if(that.statistics!==""){
          formItemIds.push(that.statistics)
        }else{
          formItemIds = []
        }
        let fromData = {
          "chartName":that.chartName || "" ,
          "chartType": that.chartType || "",
          "crfId": that.diseaseValue[1] || "",
          "formItemIds": formItemIds,
          "compareFormItemId":that.compareFormItemId|| ""
        };
        let formData = {
          "chartName": that.chartName || "" ,
          "chartType": that.chartType || "",
          "crfId": that.diseaseValue[1] || "",
          "comparePath": that.compareFormItemId || "",
          "path": that.statistics || "",
          "valueText": that.valueText || "",
          "compareValueText": that.compareValuePath || ""
        };
        try {
          // let data = await that.$http.previewBar(fromData);
          let data = await that.$http.chartPreviewBarNew(formData);
          console.log(data);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.histogramOption)));
            copyOption.title.text = data.data.chartName;
            copyOption.xAxis.categories = data.data.xaxis;
            copyOption.yAxis.title = "";
            /*let obj = {
              name: 'Brands',
              colorByPoint: true,
              data:data.data.data
            };*/
            copyOption.series = data.data.series;
            that.histogramOption = copyOption;
          }
          that.chartLoading = false;
        }catch (error) {
          console.log(error)
          that.chartLoading = false;
        }
        that.chartLoading = false;
      },
      //预览 -- 折线图
      async previewLine() {
        let that = this;
        let formItemIds = [];
        if(that.statistics!==""){
          formItemIds.push(that.statistics)
        }else{
          formItemIds = []
        }
        let fromData = {
          "chartName":that.chartName || "" ,
          "chartType": that.chartType || "",
          "crfId": that.diseaseValue[1] || "",
          "formItemIds": formItemIds
        };
        let formData = {
          "chartName":that.chartName || "" ,
          "chartType": that.chartType || "",
          "crfId": that.diseaseValue[1] || "",
          "path": that.statistics || "",
          "valueText": that.valueText || ""
        };
        try {
          // let data = await that.$http.previewLine(fromData);
          let data = await that.$http.chartPreviewLineNew(formData);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.lineOption)));
            copyOption.title.text = data.data.chartName;
            copyOption.xAxis.categories = data.data.xaxis;
            copyOption.yAxis.title.text = "";
            copyOption.series = data.data.series;
            that.lineOption = copyOption;
          }
          that.chartLoading = false;
        }catch (error) {
          console.log(error)
          that.chartLoading = false;
        }
        that.chartLoading = false;
      },
      //预览 -- 2D散点图
      async preview2DScatter() {
        let that = this;
        let formItemIds = [];
        if(that.statistics!==""){
          formItemIds.push(that.statistics)
        }else{
          formItemIds = []
        }
        let fromData = {
          "xaxis": that.xaxis,
          "yaxis": that.yaxis,
          "zaxis": that.zaxis,
          "chartName": that.chartName || "",
          "chartType": that.chartType,
          "crfId": that.diseaseValue[1],
          "formItemIds": formItemIds,
          "diseaseId": that.diseaseValue[0]
        };
        let formData = {
          "xaxis": that.xaxis,
          "yaxis": that.yaxis,
          "zaxis": that.zaxis,
          "chartName": that.chartName,
          "chartType": that.chartType,
          "crfId": that.diseaseValue[1],
          "path": that.statistics || "",
          "valueText": that.valueText || "",
          "diseaseId": that.$route.query.id
        };
        try{
          // let data = await that.$http.preview2DScatter(fromData);
          let data = await that.$http.chartPreview2DScatterNew(formData);
          if(data.code == 0) {
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.planeOption)));6
            copyOption.title.text = data.data.chartName;
            copyOption.xAxis.title.text = "";
            copyOption.yAxis.title.text = "";
            let array = [];
            if(data.data.data!=='null' &&data.data.data!==null){
              for(let i=0;i<data.data.data.length;i++) {
                array.push({
                  name:data.data.data[i].termItemName,
                  data:data.data.data[i].data
                })
              }
            }else{
              array.push({
                name:"",
                data:[]
              })
            }
            copyOption.series = array;
            that.planeOption = copyOption;
          }
          that.chartLoading = false;
        }catch (error) {
          console.log(error)
          that.chartLoading = false;
        }
        that.chartLoading = false;
      },
      //预览 -- 3D散点图
      async preview3DScatter() {
        let that = this;
        let formItemIds = [];
        if(that.statistics!==""){
          formItemIds.push(that.statistics)
        }else{
          formItemIds = []
        }
        let fromData = {
          "xaxis": that.xaxis,
          "yaxis": that.yaxis,
          "zaxis": that.zaxis,
          "chartName": that.chartName,
          "chartType": that.chartType,
          "crfId": that.diseaseValue[1],
          "formItemIds": formItemIds,
          "diseaseId": that.diseaseValue[0]
        };
        let formData = {
          "xaxis": that.xaxis,
          "yaxis": that.yaxis,
          "zaxis": that.zaxis,
          "chartName": that.chartName,
          "chartType": that.chartType,
          "crfId": that.diseaseValue[1],
          "path": that.statistics || "",
          "valueText": that.valueText || "",
          "diseaseId": that.$route.query.id
        };
        try {
          // let data = await that.$http.preview3DScatter(fromData);
          let data = await that.$http.chartPreview3DScatterNew(formData);
          if(data.code ==0 ){
            let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.threeDimensionalOption)));
            copyOption.title.text = data.data.chartName;
            let array = [];
            if(data.data.data!=='null'&&data.data.data!==null){
              for(let i=0;i<data.data.data.length;i++) {
                array.push({
                  name:data.data.data[i].termItemName,
                  colorByPoint: true,
                  data:data.data.data[i].data
                })
              }
            }else{
              array.push({
                name:"",
                colorByPoint: true,
                data:[]
              })
            }
            copyOption.series = array;
            that.threeDimensionalOption = copyOption;
          }
          that.chartLoading = false;
        }catch (error) {
          console.log(error)
          that.chartLoading = false;
        }
        that.chartLoading = false;
      }
    },
    mounted() {
      /*this.initPage();
      this.getChartListModel();
      this.modelCRFFromList();*/
      this.subjectTestChart();
      this.$nextTick(()=>{
        this.initPage();
      })
    }
  }
</script>

<style lang="less">
  .mask_layer_container-subject {
    /*height: 800px;
    overflow: auto;*/
    .mask_layer_title{
      display: flex;
      margin-top: 60px;
      margin-bottom: 30px;
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      cursor: pointer;
      height: 64px;
      background-color: #ffffff;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #E5EBEC;
      span{
        font-size:18px;
        font-family:PingFang-SC;
        font-weight:bold;
        color:rgba(102,102,102,1);
      }
      i{
        color:rgba(102,102,102,1);
      }
    }
  }
  .mask_layer_body-chart{
    display: flex;
    flex-direction: row;
    height: 100%;
    /*padding: 0 30px;*/
    box-sizing: border-box;
    /*margin-top: 30px;*/
    .mask_layer_left{
      width: 15%;
      /*border:1px solid #D8DCE4;*/
      .statistical_analysis_model{
        line-height: 40px;
        font-size: 14px;
        color:#666666 ;
        text-align: center;
        /*border-bottom: 1px solid #D8DCE4;*/
        border:1px solid rgba(229,235,236,1);
        background-color: #ffffff;
      }
      .statistical_analysis_content{
        display: flex;
        flex-direction: column;
        min-height: 120px;
        background-color: #ffffff;
        border-left: 1px solid #e5ebec;
        border-right: 1px solid #e5ebec;
        border-bottom: 1px solid #e5ebec;
        position: relative;
        .statistical_analysis_item{
          display: flex;
          justify-content: flex-start;
          width: 100%;
          /*padding: 5px 10px;*/
          height: 40px;
          box-sizing: border-box;
          cursor: pointer;
          align-items: center;
          position: relative;
          .item_display{
            display: flex;
            cursor: pointer;
            span{
              padding-left: 15px;
              display: inline-block;
              width: 168px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
          .item_modify{
            display: none;
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translate(0,-50%);
            span{
              color: #979BAA;
              padding: 0 5px;
            }
          }
          .active_column{
            display: none;
            width: 3px;
            height: 100%;
            background-color: #04B8DD;
            position: absolute;
            top: 0;
            left: 0;
          }
          .display_show{
            display:flex;
          }
        }
        .add_bg{
          background-color: #F5F7FA;
        }
        .blank_img{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          img{
            height: 40px;
          }
          p{
            color: #666666;
            font-size: 14px;
          }
        }
      }
      .statistical_analysis_Add{
        display: flex;
        width: 100%;
        cursor:pointer;
        margin-top: 20px;
        .add_content{
          width: 100%;
          text-align: center;
          line-height: 40px;
          /*border: 1px dashed #D8DCE4;*/
          margin: 0 auto;
          background:rgba(4,184,221,1);
          border-radius:2px;
          box-shadow:0 2px 2px 0 rgba(4,184,221,0.55);
          font-size: 14px;
          color: #ffffff;
          i{
            font-size: 14px;
            padding-right: 10px;
          }
        }
        :hover{
          /*background-color: #F3F3F3;*/

        }
      }
    }
    .mask_layer_right{
      flex: 1;
      margin-left: 30px;
      border:1px solid #E5EBEC;
      /*height: 100%;*/
      background-color: #ffffff;
      padding: 0 5px;
      box-sizing: border-box;
      overflow: auto;
      position: relative;
      .model_set{
        line-height: 40px;
        font-size: 14px;
        color:#666666 ;
        text-align: left;
        border-bottom: 1px solid #E5EBEC;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: space-between;
        .iconfont{
          cursor: pointer;
          font-size: 14px;
        }
      }
      .model_window_box{
        display: flex;
        width: 100%;
        flex-direction: row;
        box-sizing: border-box;
        padding: 20px 15px;
        /*height: 100%;*/
        .model_from_set{
          width: 50%;
          box-sizing: border-box;
          display:flex;
          flex-direction: column;
          padding: 0 15px 0 15px;
          height: 90%;
          justify-content: flex-start;
          color: #666666;
          .from_name{
            font-size: 14px;
            padding: 15px 0;
            font-family:MicrosoftYaHei;
          }
          .from_chart_type{
            display: flex;
            justify-content: space-between;
          }
          .submit_btn{
            margin-top: 30px;
            .el-button{
              border-radius:2px;
              font-size: 14px;
              height: 30px;
            }
            .el-button--primary{
              color: #ffffff;
              background-color: #1BBAE1;
              border: none;
            }
          }
        }
        .model_view{
          width: 50%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          .chart_window{
            width: 90%;
            min-height: 300px;
            border: 1px solid #D8DCE4;
          }
          .preview_chart{
            width: 90%;
            margin-top: 10px;
            text-align: right;
            .el-button{
              border-radius:2px;
              font-size: 14px;
              height: 30px;
            }
            .el-button--primary{
              color: #ffffff;
              background-color: #1BBAE1;
              border: none;
            }
          }
        }
      }
      .blank_img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(0,-50%);
        img{
          height: 100px;

        }
        p{
          font-size: 14px;
          color: #666666;
          padding-top: 10px;
        }
      }

    }
  }
  .mask_layer_body-chart .mask_layer_left .statistical_analysis_content .statistical_analysis_item:hover .item_modify{
    display: flex ;
  }
  .mask_layer_body-chart .mask_layer_left .statistical_analysis_content .statistical_analysis_item:hover .active_column{
    display: inline-block ;
  }
  .mask_layer_body-chart .mask_layer_left .statistical_analysis_content .statistical_analysis_item:hover {
    background-color: #F5F7FA;
  }
</style>
<style>
  .from_chart_type .el-radio + .el-radio{
    margin-left: 0 !important;
  }
  @media screen and (min-width:1300px) and (max-width: 1366px) {
    .mask_layer_body .mask_layer_right .model_window_box .model_from_set .from_chart_type{
      display: inline-block;
    }
    .mask_layer_container .el-dialog__body{
      height: 560px;
    }
  }
  .from_chart_type .el-radio__input.is-checked .el-radio__inner{
    border-color: #04B8DD;
    background: #04B8DD;
  }
  .from_chart_type .el-radio__input.is-checked+.el-radio__label{
    color: #666666;
  }
</style>
