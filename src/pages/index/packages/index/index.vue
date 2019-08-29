<template>
  <div class="index">
    <ul class="card flex-between-center">
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <i class="iconfont iconzujian4"></i>
        </div>
        <p>病种数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <i class="iconfont iconzujian2"></i>
        </div>
        <p>课题数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <i class="iconfont iconzujian3"></i>
        </div>
        <p>人员数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <i class="iconfont iconzujian5"></i>
        </div>
        <p>病例数</p>
      </li>
    </ul>
    <div class="charts">
      <charts :domId="'id1'" :option="option"></charts>
      <charts :domId="'id2'" :option="pieOption"></charts>
      <charts :domId="'id3'" :option="option"></charts>
      <charts :domId="'id4'" :option="option"></charts>
    </div>
  </div>
</template>
<script>
import utils from 'components/utils';
import charts from './charts/charts'
export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      loading: true,
      //柱状图
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
      //折线图
      lineOption:{
        chart:{
          type: 'line',
          zoomType: 'x'
        },
        credits:{
          enabled:false
        },
      }
    };
  },
  components: {
    charts
  },
  created () {

  },
  mounted () {
    
  },
  methods: {
  },
};
</script>
<style lang="less" scoped>
  .index {
    height: 100%;
    background-color: #f0f2f7;
    .card {
      margin-bottom: 25px;
      height: 135px;
      box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);
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
            margin-bottom: 15px;
            font-size: 40px;
            font-weight: bolder;
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
            font-size: 16px;
          }
      }
    }
    .charts {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

</style>
