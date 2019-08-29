<template>
  <div class="index">
    <ul class="card flex-between-center">
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <img src="http://via.placeholder.com/40x40" alt="病种数">
        </div>
        <p>病种数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <img src="http://via.placeholder.com/40x40" alt="病种数">
        </div>
        <p>病种数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <img src="http://via.placeholder.com/40x40" alt="病种数">
        </div>
        <p>病种数</p>
      </li>
      <li>
        <div class="cart_text flex-between-center">
          <p>99</p>
          <img src="http://via.placeholder.com/40x40" alt="病种数">
        </div>
        <p>病种数</p>
      </li>
    </ul>
    <div class="charts">
      <charts :domId="'id1'" :option="option"></charts>
      <charts :domId="'id2'" :option="option"></charts>
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
              // formatter: function () {
              //     let desc = this.point.desCode=='H'?'偏高':(this.point.desCode=='L'?'偏低':'正常');
              //     let content =  `<b>${this.point.name}</b><br/>
              //                     日期:${utils.formateDate(this.point.x)}<br/>
              //                     值:${this.point.y} ${this.point.unit} (${desc})`;
              //     return content;
              // }
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
              gridLineWidth: 0,
              labels: {
                  reserveSpace: false
              } 
          },
          series: [{
            name:"aaa",
            data:[10,20,30,40,50,60,80,90]
          }],
          credits: {
              enabled:false
          }
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
