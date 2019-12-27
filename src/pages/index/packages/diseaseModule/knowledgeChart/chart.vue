<template>
    <div class="chartContent"></div>
</template>

<script>
import './networkgraph'
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
    },
    data () {       
        return {
            chart: {}
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initHighcharts();
        });
    },
    methods: {
        initHighcharts() {
            this.chart = this.$Highcharts.chart(this.$el, this.option);
        },
        updated() {
            this.chart.series[0].setData(this.option.series[0].data)
        },
    },
        
};
</script>


<style lang='less' scoped>
    .chartContent {
        width: 100%;
        height: 100%;
    }
</style>
