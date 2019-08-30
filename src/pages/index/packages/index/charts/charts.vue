<template>
    <div class="chartContent" >
        <!--<div :id="domId" class="chart"></div>-->
    </div>
</template>

<script>
import utils from 'components/utils/index';
export default {
    name: 'charts',
    props: {
        title: {
            type: String,
            default: ""
        },
        domId: {
            type: String,
            default: ""
        },
        //图表配置
        option: {
            type: Object,
            default: () => ({})
        },
        //数据点列表
        list: {
            type: Array,
            default: () => []
        }
    },
    watch: {
      "option":function (value) {
        this.data = value;
        this.initHighcharts();
      }
    },
    data () {       
        return {
          chart: null,
          data:this.option
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initHighcharts();
        });
    },
    methods: {
        initHighcharts() {
          // console.log(this.$el)
            this.chart = this.$Highcharts.chart(this.$el, this.data);
            // this.setChartsSeries();
        },
        setChartsSeries() {
            this.chart.series[0].update({
                data: this.list
            });
        }
    },
        
};
</script>


<style lang='less' scoped>
    .chartContent {
        /*width: 48.8%;*/
        width: 49.4%;
        margin-bottom: 12px;
        box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);
        border-radius: 1px;
        .chart {
            width: 100%;
            min-height: 350px;
        }
    }
</style>
