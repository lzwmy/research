<template>
    <div class="chartContent"></div>
</template>

<script>
export default {
    name: 'charts',
    props: {
        //图表配置
        option: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
      "option":{
        deep:true,
        handler:function (value) {
          this.chartData = value;
        }
      }
    },
    data () {
        return {
          chartData:this.option
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initHighcharts();
        });
    },
    methods: {
        initHighcharts() {
            this.$Highcharts.chart(this.$el, this.chartData).reflow();
        }
    },
        
};
</script>


<style lang='less' scoped>
    .chartContent {
        width: 100%;
        height: 210px;
    }
</style>
