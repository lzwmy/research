<template>
    <div class="2D_charts_container" style="height: 350px">
      <div class="container"></div>
    </div>
</template>

<script>
  import Highcharts from 'highcharts/highstock';
  import HighchartsMore from 'highcharts/highcharts-more';
  import HighchartsDrilldown from 'highcharts/modules/drilldown';
  import Highcharts3D from 'highcharts/highcharts-3d';
  HighchartsMore(Highcharts);
  HighchartsDrilldown(Highcharts);
  Highcharts3D(Highcharts);
    export default {
      props:['option'],
      data() {
        return {
          chart:null,
          data:this.option
        }
      },
      watch:{
        "option":function (value) {
          this.data = value;
          this.initChart();
        }
      },
      methods:{
        initChart() {
          // console.log(this.$el);
          this.chart = new Highcharts.Chart(this.$el,this.data);
        }
      },
      mounted() {
        // console.log('2D散点图',this.option);
        this.initChart();
      }
    }
</script>

<style scoped>

</style>
