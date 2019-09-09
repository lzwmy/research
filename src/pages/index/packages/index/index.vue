<template>
  <div class="index">
    <ul class="card flex-between-center">
      <li>
        <div class="cart_text flex-between-center">
          <p>{{diseaseSpeciesSum }}</p>
          <i class="iconfont iconzujian4"></i>
        </div>
        <p>病种数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>{{subjectSum }}</p>
          <i class="iconfont iconzujian2"></i>
        </div>
        <p>课题数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>{{userSum }}</p>
          <i class="iconfont iconzujian3"></i>
        </div>
        <p>人员数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>{{caseSum }}</p>
          <i class="iconfont iconzujian5"></i>
        </div>
        <p>病例数</p>
      </li>
    </ul>
    <div class="charts">
      <charts :option="option"></charts>
      <charts :option="pieOption"></charts>
      <charts :option="lineOption"></charts>
      <charts :option="visitOption"></charts>
      <charts :option="subjectOption"></charts>
      <charts :option="doctorOption"></charts>
    </div>
  </div>
</template>
<script>
import utils from 'components/utils';
import charts from './charts/charts'
export default {
  name: 'index',
  data () {
    return {
      loading: true,
      diseaseSpeciesSum:0,//病种数
      subjectSum:0,//课题数
      userSum:0,//人员数
      caseSum:0,//病例数
      //柱状图 -- 病种病例数分布
      option: {
          chart: {
              type: 'column',
              plotBackgroundColor: '#fff',
          },
          title: {
              text: "病种病例数分布"
          },
          tooltip: {
              borderColor: null,
          },
          legend: {
              enabled: true
          },
          xAxis: {
              categories: ['白癜风','银屑病','面部皮炎','神经内科']
          },
          plotOptions: {
              column: {
                  series: {
                      color: '#9ed464',
                      lineWidth: 1,
                  },
              },
          },
          yAxis: {
              min: 0,
              title: {
                  text: ''
              },
              gridLineWidth: 1,
              labels: {
                  reserveSpace: true
              },
            lineWidth: 1,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickWidth: 0
          },
          series: [{
            name:"aaa",
            data:[10,20,30,40,50,60,80,90]
          }],
          credits: {
              enabled:false
          }
      },
      //课程病例数分布
      subjectOption:{
        chart: {
          type: 'column',
          plotBackgroundColor: '#fff',
        },
        title: {
          text: "病种病例数分布"
        },
        tooltip: {
          borderColor: null,
        },
        legend: {
          enabled: true
        },
        xAxis: {
          categories: ['白癜风','银屑病','面部皮炎','神经内科']
        },
        plotOptions: {
          column: {
            series: {
              color: '#9ed464',
              lineWidth: 1,
            },
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          gridLineWidth: 1,
          labels: {
            reserveSpace: true
          },
          lineWidth: 1,
          minorGridLineWidth: 0,
          minorTickInterval: 'auto',
          minorTickWidth: 0
        },
        series: [{
          name:"aaa",
          data:[10,20,30,40,50,60,80,90]
        }],
        credits: {
          enabled:false
        }
      },
      //饼状图
      pieOption:{
        chart:{
          type:'pie'
        },
        title:{
          text:'各种病占比'
        },
        credits:{
          enabled:false
        },
        legend:{
          enabled:true
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              /*style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }*/
            },
            showInLegend: true
          }
        },
        series: [{
          name: '各种病占比',
          data: [{
            name: '白癜风',
            y: 61.41,
          }, {
            name: '银屑病',
            y: 11.84
          }, {
            name: '面部皮炎',
            y: 10.85
          }, {
            name: '神经内科',
            y: 4.67
          }]
        }]
      },
      //折线图 --病种病例增长趋势图
      lineOption:{
        chart:{
          type: 'line',
          zoomType: 'x',
        },
        credits:{
          enabled:false
        },
        title:{
          text:'病种病例数分布'
        },
        subtitle: {
          text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        legend: {
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'middle'
        },
        xAxis: {
          categories: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
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
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
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
          name: '白癜风',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
          name: '银屑病',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
          name: '面部皮炎',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
          name: '神经内科',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
          name: '其他',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }]
      },
      // 随访 折线图
      visitOption:{
        chart:{
          type: 'line',
          zoomType: 'x',
        },
        credits:{
          enabled:false
        },
        title:{
          text:'病种病例数分布'
        },
        subtitle: {
          text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        legend: {
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'middle'
        },
        xAxis: {
          categories: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
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
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
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
          name: '白癜风',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
          name: '银屑病',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
          name: '面部皮炎',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
          name: '神经内科',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
          name: '其他',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }]
      },
      //医生病例录入趋势图
      doctorOption:{
        chart:{
          type: 'line',
          zoomType: 'x',
        },
        credits:{
          enabled:false
        },
        title:{
          text:'病种病例数分布'
        },
        subtitle: {
          text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        legend: {
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'middle'
        },
        xAxis: {
          categories: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
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
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
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
          name: '白癜风',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
          name: '银屑病',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
          name: '面部皮炎',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
          name: '神经内科',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
          name: '其他',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }]
      },
    };
  },
  components: {
    charts
  },
  created () {

  },
  mounted () {
    this.homepageStatistics();
    this.indexCasesByDisease();
    this.homeDiseaseCasesBar();
    this.homeDiseaseCasesLine();
    this.homeOutVisitLine();
    this.homeSubjectsCasesBar();
    this.homeContributionsReportsLine();
  },
  methods: {
    async homepageStatistics() {
      let that = this;
      try{
        let data = await that.$http.homepageStatistics();
        if(data.code == 0) {
          that.diseaseSpeciesSum=data.data.diseaseSpeciesSum//病种数
          that.subjectSum=data.data.subjectSum//课题数
          that.userSum=data.data.userSum//人员数
          that.caseSum=data.data.caseSum//病例数
        }
      }catch (error) {
        console.log(error)
      }
    },
    //病种病例数分布
    async homeDiseaseCasesBar() {
      let that = this;
      try{
        let data = await that.$http.homeDiseaseCasesBar();
        if(data.code == 0) {
          let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.option)));
          copyOption.title.text = data.data.chartName;
          copyOption.xAxis.categories = data.data.xaxis;
          copyOption.series[0].name = data.data.chartName;
          copyOption.series[0].data = data.data.data;
          that.option = copyOption;
        }
      }catch (error) {
        console.log(error)
      }
    },
    //病种病例增长趋势图
    async homeDiseaseCasesLine() {
      let that = this;
      try{
        let data = await that.$http.homeDiseaseCasesLine();
        if(data.code == 0) {
          let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.lineOption)));
          copyOption.title.text = data.data.chartName;
          copyOption.xAxis.categories = data.data.xaxis;
          copyOption.series = data.data.series;
          that.lineOption = copyOption;
        }
      }catch (error) {
        console.log(error)
      }
    },
    //随访 折线图
    async homeOutVisitLine() {
      let that = this;
      try {
        let data = await that.$http.homeOutVisitLine();
        if(data.code == 0) {
          let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.visitOption)));
          copyOption.title.text = data.data.chartName;
          copyOption.xAxis.categories = data.data.xaxis;
          copyOption.series = data.data.series;
          that.visitOption = copyOption;
        }
      }catch (error) {
        console.log(error)
      }
    },
    //课程病例数分布
    async homeSubjectsCasesBar() {
      let that = this;
      try {
        let data = await that.$http.homeSubjectsCasesBar();
        if(data.code == 0) {
          let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.subjectOption)));
          copyOption.title.text = data.data.chartName;
          copyOption.xAxis.categories = data.data.xaxis;
          copyOption.series[0].name = data.data.chartName;
          copyOption.series[0].data = data.data.data;
          that.subjectOption = copyOption;
        }
      }catch (error) {
        console.log(error);
      }
    },
    //个病种占比
    async indexCasesByDisease() {
      let that = this;
      try {
        let data = await that.$http.indexCasesByDisease();
        if(data.code == 0) {
          let copyOpton = Object.assign({},JSON.parse(JSON.stringify(that.pieOption)));
          let array = [];
          if(data.data.length!==0) {
            for(let i=0;i<data.data.length;i++) {
              array.push({
                name:data.data[i].DISEASE_NAME,
                y:data.data[i].COUNT,
              })
            }
          }
          copyOpton.series[0].data = array;
          that.pieOption = copyOpton;
        }
      }catch (error) {
        console.log(error);
      }
    },
    //医生病例录入趋势图
    async homeContributionsReportsLine() {
      let that = this;
      try {
        let data = await that.$http.homeContributionsReportsLine();
        if(data.code == 0) {
          let copyOption = Object.assign({},JSON.parse(JSON.stringify(that.doctorOption)));
          copyOption.title.text = data.data.chartName;
          copyOption.xAxis.categories = data.data.xaxis;
          copyOption.series = data.data.series;
          that.doctorOption = copyOption;
        }
      }catch (error) {
        console.log(error)
      }
    }
  },
};
</script>
<style lang="less" scoped>
  .index {
    height: 100%;
    background-color: #f0f2f7;
    .card {
      margin-bottom: 15px;
      height: 133px;
      box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);
      border-radius: 1px;
      li {
        height: 100%;
        border: none;
        background: #fff;
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-content: center;
        flex-wrap: wrap;
        padding: 0 40px;
        border-radius: 0px;
        &:nth-child(n+2) {
          border-left: 1px solid #f2f2f2; 
        }
        .cart_text {
          font-size: 18px;
          width: 100%;
          img {
            // width: 70px;
            // height: 70px;
            border-radius: 50%;
          }
          p{
            /*margin-bottom: 15px;*/
            margin-bottom: 5px;
            font-size: 40px;
            /*font-weight: bolder;*/
            font-weight: 600;
            color: #090E3E;
            font-family: "Open Sans", sans-serif;
          }
          i{
            font-size: 44px;
            color: #439AFF;
          }
        }
        p{
            color: #959595;
            font-weight: normal;
            font-family: "Open Sans", sans-serif;
            font-size: 14px;
          }
      }
    }
    .charts {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      div{
        margin-right: 0;
        &:nth-child(2n-1) {
          margin-right: 12px;
        }
      }
    }
  }

</style>
