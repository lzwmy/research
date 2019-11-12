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
    },
    data () {       
        return {
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initHighcharts();
        });
    },
    methods: {
        initHighcharts() {
            this.$Highcharts.chart(this.$el, this.option);
        }
    },
        
};
</script>


<style lang='less' scoped>
    .chartContent {
        width: 100%;
        height: 290px;
    }
</style>
