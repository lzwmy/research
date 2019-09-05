<template>
  <div class="disease_chart_container">
    <div class="component_head flex-between-center">
      <p>{{$route.meta.txt}}</p>
      <div class=" cur_pointer head_content flex-start-center">
        <img src="./images/disease_set_chart.png" alt="" @click="displayMaskLayer">
      </div>
    </div>
    <div class="disease_header">
      <div class="disease_all">
        <div class="all_img">
          <img src="./images/all_a.png" alt="">
        </div>
        <div class="all_text">
          <p>全部</p>
          <p>{{total}}</p>
        </div>
      </div>
      <div class="disease_HEAL">
        <div class="all_img">
          <img src="./images/heal_a.png" alt="">
        </div>
        <div class="all_text">
          <p>治愈</p>
          <p>{{todoSum}}</p>
        </div>
      </div>
      <div class="disease_IMPROVE">
        <div class="all_img">
          <img src="./images/improve_a.png" alt="">
        </div>
        <div class="all_text">
          <p>好转</p>
          <p>{{healSum}}</p>
        </div>
      </div>
      <div class="disease_WORSEN">
        <div class="all_img">
          <img src="./images/worsen_a.png" alt="">
        </div>
        <div class="all_text">
          <p>恶化</p>
          <p>{{improveSum}}</p>
        </div>
      </div>
      <div class="disease_TODO">
        <div class="all_img">
          <img src="./images/todo_a.png" alt="">
        </div>
        <div class="all_text">
          <p>待访</p>
          <p>{{invalidSum}}</p>
        </div>
      </div>
      <div class="disease_INVALID">
        <div class="all_img">
          <img src="./images/invalId_a.png" alt="">
        </div>
        <div class="all_text">
          <p>无效</p>
          <p>{{worsenSum}}</p>
        </div>
      </div>
    </div>
    <div class="disease_body">
      <div class="disease_chart_box"  v-loading="item.loading" v-for="(item,index) in chartList" :key="index">
        <pie-chart v-if="item.chartType=='PIE'" :option="item.option"></pie-chart>
        <histogram-chart v-if="item.chartType=='BAR'" :option="item.option"></histogram-chart>
        <polygonal-chart v-if="item.chartType=='LINE'" :option="item.option"></polygonal-chart>
        <plane-chart v-if="item.chartType=='2D_SCATTER'" :option="item.option"></plane-chart>
        <three-dimensional v-if="item.chartType=='3D_SCATTER'" :option="item.option"></three-dimensional>
      </div>
      <!--<div class="disease_chart_box" v-loading="false"></div>
      <div class="disease_chart_box" v-loading="false"></div>-->
    </div>
<!--    <mask-layer :maskShow="maskShow" @displayShow="displayShow" @refresh="refresh"></mask-layer>-->
  </div>
</template>

<script>
  // import maskLayer from './chart/maskLayer';
  import pieChart from './chart/piechart';
  import histogramChart from './chart/histogram';
  import polygonalChart from './chart/polygonalChart';
  import planeChart from './chart/2D';
  import threeDimensional from './chart/3D';
  export default {
    components:{
      pieChart,
      histogramChart,
      polygonalChart,
      planeChart,
      threeDimensional,
    },
    data() {
      return {
        maskShow:false,
        total:0,//总数
        todoSum:0,//治愈
        healSum:0,//好转
        improveSum:0,//恶化
        invalidSum:0,//待访
        worsenSum:0,//无效
        chartList:[],//图表列表
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
            text: '饼状图',
            align: 'left',
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
              showInLegend: true
            }
          },
          series: [
            {
              name: 'Brands',
              colorByPoint: true,
              data: [
                {
                  name: 'Chrome',
                  y: 61.41,
                }, {
                  name: 'Internet Explorer',
                  y: 11.84
                }, {
                  name: 'Firefox',
                  y: 10.85
                }, {
                  name: 'Edge',
                  y: 4.67
                }, {
                  name: 'Safari',
                  y: 4.18
                }, {
                  name: 'Other',
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
            text: '饼状图',
            align: 'left',
          },
          legend:{
            enabled:false
          },
          xAxis: {
            categories: [
              '一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'
            ],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: '降雨量 (mm)'
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
            }
          },
          series: [{
            name: '中国',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
          }]
        },
        //折线图
        lineOption:{
          chart: {
            type: 'line',
            zoomType: 'x'
          },
          credits:{
            enabled:false
          },
          title:{
            text:"折线图",
            align: 'left',
          },
          subtitle: {
            text: document.ontouchstart === undefined ?
              '鼠标拖动可以进行缩放' : '手势操作进行缩放',
            align: 'left',
          },
          xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
            title: {
              text: '气温 (°C)',
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
            },
            area: {
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                }
              },
              marker: {
                radius: 2
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            }
          },
          series: [{
            name: '中国',
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
            text:"2D散点图",
            align: 'left',
          },
          xAxis: {
            title: {
              enabled: true,
              text: '身高 (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
          },
          yAxis: {
            title: {
              text: '体重 (kg)'
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
            name: '女',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6]]
          }, {
            name: '男',
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
            text: '3D散点图',
            align: 'left',
          },
          subtitle: {
            text: '单击并拖动鼠标可旋转绘图区',
            align: 'left',
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
              [1, 6, 5], [8, 7, 9], [1, 3, 4], [4, 6, 8], [5, 7, 7], [6, 9, 6], [7, 0, 5], [2, 3, 3], [3, 9, 8], [3, 6, 5], [4, 9, 4], [2, 3, 3], [6, 9, 9], [0, 7, 0], [7, 7, 9], [7, 2, 9], [0, 6, 2], [4, 6, 7], [3, 7, 7], [0, 1, 7], [2, 8, 6], [2, 3, 7], [6, 4, 8], [3, 5, 9], [7, 9, 5], [3, 1, 7], [4, 4, 2], [3, 6, 2], [3, 1, 6], [6, 8, 5], [6, 6, 7], [4, 1, 1], [7, 2, 7], [7, 7, 0], [8, 8, 9], [9, 4, 1], [8, 3, 4], [9, 8, 9], [3, 5, 3], [0, 2, 4], [6, 0, 2], [2, 1, 3], [5, 8, 9], [2, 1, 1], [9, 7, 6], [3, 0, 2], [9, 9, 0], [3, 4, 8], [2, 6, 1], [8, 9, 2], [7, 6, 5], [6, 3, 1], [9, 3, 1], [8, 9, 3], [9, 1, 0], [3, 8, 7], [8, 0, 0], [4, 9, 7], [8, 6, 2], [4, 3, 0], [2, 3, 5], [9, 1, 4], [1, 1, 4], [6, 0, 2], [6, 1, 6], [3, 8, 8], [8, 8, 7], [5, 5, 0], [3, 9, 6], [5, 4, 3], [6, 8, 3], [0, 1, 5], [6, 7, 3], [8, 3, 2], [3, 8, 3], [2, 1, 6], [4, 6, 7], [8, 9, 9], [5, 4, 2], [6, 1, 3], [6, 9, 5], [4, 8, 2], [9, 7, 4], [5, 4, 2], [9, 6, 1], [2, 7, 3], [4, 5, 4], [6, 8, 1], [3, 4, 0], [2, 2, 6], [5, 1, 2], [9, 9, 7], [6, 9, 9], [8, 4, 3], [4, 1, 7], [6, 2, 5], [0, 4, 9], [3, 5, 9], [6, 9, 1], [1, 9, 2]
            ]
          }]
        }
      }
    },
    created() {
      this.chartListData()
    },
    methods:{
      resize() {
        let height = $('.el-router-view').height();
        $('.disease_body').css({
          minHeight:height-244
        })
      },
      displayMaskLayer() {
        // this.maskShow = true;
        let id = this.$route.query.id;
        this.$router.push({
          path: '/diseaseChart/chartConfig',
          query:{
            id:id,
            cacheData:false
          }
        })
      },
      displayShow(value) {
        this.maskShow = value;
      },
      refresh(data) {
        if(data.refresh) {
          this.chartListData()
        }
      },
      initPage() {
        this.chartListData()
        .then(()=>{
          this.$emit('changeLoadding',false);
        })
      },
      //图表 数据
      async chartListData() {
        let that = this;
        let fromData = {
          diseaseId:that.$route.query.id
        };
        try{
          let data = await that.$http.chartListData(fromData);
          console.log(data);
          if(data.code == 0) {
            that.total=data.data.total;
            that.todoSum=data.data.todoSum;
            that.healSum=data.data.healSum;
            that.improveSum=data.data.improveSum;
            that.invalidSum=data.data.invalidSum;
            that.worsenSum=data.data.worsenSum;
            let array = data.data.chartList;
            for(let i=0;i<array.length;i++) {
              array[i].loading = true;
              array[i].option = {};
              switch (array[i].chartType) {
                case "PIE" :
                  that.getPieData(array[i].chartId,array[i],i);
                  break;
                case "BAR" :
                  that.getBarData(array[i].chartId,array[i],i);
                  break;
                case "LINE" :
                  that.getLineData(array[i].chartId,array[i],i);
                  break;
                case "2D_SCATTER" :
                  that.get2DScatter(array[i].chartId,array[i],i);
                  break;
                case "3D_SCATTER" :
                  that.get3DScatter(array[i].chartId,array[i],i);
                  break;
              }
            }
            console.log(array)
            that.chartList=array;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //饼状图
      async getPieData(value,option,index) {
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
            // that.pitOption = copyOption;
            // console.log(option)
            that.chartList[index].loading = false;
            that.chartList[index].option = copyOption;

          }
        }catch (error) {
          console.log(error);
        }
      },
      //柱状图
      async getBarData(value,option,index) {
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
            let obj = {
              name: 'Brands',
              colorByPoint: true,
              data:data.data.data
            };
            copyOption.series = data.data.series;
            /*that.histogramOption = copyOption;*/
            that.chartList[index].loading = false;
            that.chartList[index].option = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //折线图
      async getLineData(value,option,index) {
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
            /*that.lineOption = copyOption;*/
            that.chartList[index].loading = false;
            that.chartList[index].option = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //2D散点图
      async get2DScatter(value,option,index) {
        let that = this;
        let fromData = {
          chartId:value
        };
        try {
          let data = await that.$http.get2DScatter(fromData);
          console.log(data)
          if(data.code == 0&& (data.data!==null&&data.data!=='null')) {
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
            /*that.planeOption = copyOption;*/
            that.chartList[index].loading = false;
            that.chartList[index].option = copyOption;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //3D散点图
      async get3DScatter(value,option,index) {
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
            /*that.threeDimensionalOption = copyOption;*/
            that.chartList[index].loading = false;
            that.chartList[index].option = copyOption;
            console.log(copyOption)
          }
        }catch (error) {
          console.log(error)
        }
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .disease_chart_container {
    width: 100%;
    box-sizing: border-box;
    /*padding: 10px;*/
    background-color: #f0f2f7;
    /*background-color: #f3f3f3;*/
    padding-top: 60px;
    .disease_header{
      display: flex;
      color: #ffffff;
      /*justify-content: space-between;*/
      box-sizing: border-box;
      margin: 0 20px 10px 20px;
      .disease_TODO{
        /*background-color: rgb(1, 144, 222);*/
        background-color: #ffffff;
        padding: 0 10px;
        border-radius: 4px;
        margin-left: 1%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border:1px solid rgba(229,235,236,1);
        .all_img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-color: #0190DE;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .all_text{
          display: flex;
          height: 100%;
          flex-direction: column-reverse;
          justify-content: center;
          p{
            color: #0190DE;
          }
          :last-child{
            font-size: 40px;
            color: #0190DE;
            font-weight:bold;
            display: flex;
            width: 100%;
          }
          :first-child{
            font-size: 14px;
            white-space: nowrap;
          }
        }
      }
      .disease_HEAL{
        /*background-color: rgb(15, 187, 147);*/
        background-color: #ffffff;
        padding: 0 10px;
        border-radius: 4px;
        margin-left: 0;
        margin-right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border:1px solid rgba(229,235,236,1);
        .all_img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-color: #00BC92;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .all_text{
          display: flex;
          height: 100%;
          flex-direction: column-reverse;
          justify-content: center;
          p{
            color: #00BC92;
          }
          :last-child{
            font-size: 40px;
            color: #00BC92;
            font-weight:bold;
            display: flex;
            width: 100%;
          }
          :first-child{
            font-size: 14px;
            white-space: nowrap;
          }
        }
      }
      .disease_IMPROVE{
        /*background-color: rgb(142, 196, 102);*/
        background-color: #ffffff;
        padding: 0 10px;
        border-radius: 4px;
        /*margin-left: 0.6%;*/
        display: flex;
        justify-content: space-around;
        align-items: center;
        border:1px solid rgba(229,235,236,1);
        .all_img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-color: #8EC466;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .all_text{
          display: flex;
          height: 100%;
          flex-direction: column-reverse;
          justify-content: center;
          p{
            color: #8EC466;
          }
          :last-child{
            font-size: 40px;
            color: #8EC466;
            font-weight:bold;
            display: flex;
            width: 100%;
          }
          :first-child{
            font-size: 14px;
            white-space: nowrap;
          }
        }
      }
      .disease_INVALID{
        /*background-color: rgb(4, 184, 221);*/
        background-color: #ffffff;
        padding: 0 10px;
        border-radius: 4px;
        margin-left: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border:1px solid rgba(229,235,236,1);
        .all_img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-color: #04B8DD;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .all_text{
          display: flex;
          height: 100%;
          flex-direction: column-reverse;
          justify-content: center;
          p{
            color: #04B8DD;
          }
          :last-child{
            font-size: 40px;
            color: #04B8DD;
            font-weight:bold;
            display: flex;
            width: 100%;
          }
          :first-child{
            font-size: 14px;
            white-space: nowrap;
          }
        }
      }
      .disease_WORSEN {
        /*background-color: rgb(217, 85, 85);*/
        background-color: #ffffff;
        padding: 0 10px;
        border-radius: 4px;
        margin-left: 0;
        margin-right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border:1px solid rgba(229,235,236,1);
        .all_img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-color: #D95555;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .all_text{
          display: flex;
          height: 100%;
          flex-direction: column-reverse;
          justify-content: center;
          p{
            color: #D95555;
          }
          :last-child{
            font-size: 40px;
            color: #D95555;
            font-weight:bold;
            display: flex;
            width: 100%;
          }
          :first-child{
            font-size: 14px;
            white-space: nowrap;
          }
        }
      }
      .disease_all{
        /*background-color: #3F51B5;*/
        background-color: #ffffff;
        padding: 0 10px;
        border-radius: 4px;
        margin-left: 0 ;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border:1px solid rgba(229,235,236,1);
        .all_img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-color: #636E9B;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .all_text{
          display: flex;
          height: 100%;
          flex-direction: column-reverse;
          justify-content: center;
          p{
            color: #636E9B;
          }
          :last-child{
            font-size: 40px;
            color: #636E9B;
            font-weight:bold;
            display: flex;
            width: 100%;
          }
          :first-child{
            font-size: 14px;
            white-space: nowrap;
          }
        }
      }
      div{
        width: 16%;
        height: 130px;
        /*display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: space-around;
        box-sizing: border-box;*/
        margin: 0 1%;
        /*:first-child{
          font-size: 16px;
          white-space: nowrap;
        }
        :last-child{
          font-size: 40px;
        }*/
      }
    }
    .disease_set_icon{
      display: flex;
      /*flex-direction: row-reverse;*/
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
      .disease_title{
        font-size:18px;
        font-family:PingFang-SC;
        font-weight:bold;
        color:rgba(102,102,102,1);
      }
      img{
        height: 24px;
      }
    }
    .disease_body{
      display: flex;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      flex-flow:row wrap;
      justify-content: flex-start;
      .disease_chart_box{
        width: 32%;
        height: 360px;
        border: 1px solid #F2F2F2;
        margin: 0.5% ;
        overflow: hidden;
        background-color: #fff;
        box-shadow:0 2px 16px -11px rgba(0,0,0, 0.5);
        /*border-radius: 1px;*/
        padding: 10px;
        border:1px solid rgba(229,235,236,1);
        border-radius: 4px;
      }
    }
  }
  .disease_header>div:hover{
    /*box-shadow:2px 2px 6px 2px rgba(153,153,153,0.5);*/
    box-shadow:0 2px 16px -11px rgba(0,0,0, 0.5);
  }
</style>
