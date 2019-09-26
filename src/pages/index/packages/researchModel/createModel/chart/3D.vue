<template>
    <div class="three_charts_container" style="height: 350px">
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
        // this.chart = new Highcharts.Chart(this.$el,this.option);
        let chart = new Highcharts.Chart(this.$el,this.data);
        $(chart.container).bind('mousedown.hc touchstart.hc', function (e) {
          e = chart.pointer.normalize(e);
          var posX = e.pageX,
            posY = e.pageY,
            alpha = chart.options.chart.options3d.alpha,
            beta = chart.options.chart.options3d.beta,
            newAlpha,
            newBeta,
            sensitivity = 5; // lower is more sensitive
          $(document).bind({
            'mousemove.hc touchdrag.hc': function (e) {
              // Run beta
              newBeta = beta + (posX - e.pageX) / sensitivity;
              newBeta = Math.min(100, Math.max(-100, newBeta));
              chart.options.chart.options3d.beta = newBeta;
              // Run alpha
              newAlpha = alpha + (e.pageY - posY) / sensitivity;
              newAlpha = Math.min(100, Math.max(-100, newAlpha));
              chart.options.chart.options3d.alpha = newAlpha;
              chart.redraw(false);
            },
            'mouseup touchend': function () {
              $(document).unbind('.hc');
            }
          });
        });
      }
    },
    mounted() {
      // console.log('3D散点图',this.option);
      this.initChart();
    }
  }
</script>

<style scoped>

</style>
