<template>
    <div class="chartContent"></div>
</template>

<script>
  // import Highcharts from 'highcharts/highstock';
  import  Wordcloud    from  'highcharts/modules/wordcloud';
  Wordcloud(Highcharts)
    export default {
      props:{
        option: {
          type: Object,
          default: () => ({})
        },
      },
      watch:{
        "option":function (value) {
          this.data = value;
          this.initHighCharts();
        }
      },
      data() {
        return {
          chart:null,
          data:this.option,
        }
      },
      methods:{
        initHighCharts() {
          this.chart = new Highcharts.Chart(this.$el, this.data).reflow();
          // this.keyword = $('.chartContent').attr('data-keyWord') || "";
        },
      },
      mounted() {
        this.$nextTick(() => {
          this.initHighCharts();
        });
      }
    }
</script>

<style scoped>
.chartContent{
  min-width: 310px;
  max-width: 800px;
  margin: 0 auto;
  height:353px;
}
</style>
