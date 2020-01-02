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
        console.log('mounted')
        this.$nextTick(() => {
            this.initHighcharts();
            this.addEvent();
        });
    },
    beforeDestroy() {
        this.chart.destroy();
    },
    methods: {
        initHighcharts() {
            this.chart = this.$Highcharts.chart(this.$el, this.option);
        },
        addEvent() {
            console.log('addEvent')
            let that = this;
            this.$Highcharts.addEvent(
                Highcharts.seriesTypes.networkgraph,
                'afterSetOptions',
                function (e) {
                    var colors = Highcharts.getOptions().colors,
                        i = 0,
                        nodes = {};
                    let dataFirstName = e.options.data.length && e.options.data[0][0];
                    e.options.data.forEach(function (link,index) {
                        if (link[0] === dataFirstName) {
                            nodes[dataFirstName] = {
                                id: dataFirstName,
                                marker: {
                                    radius: 16
                                },
                                color: "#1bbae1"
                            };
                            nodes[link[1]] = {
                                id: link[1],
                                marker: {
                                    radius: 10
                                },
                                color: colors[i++]
                            };
                        } else if (nodes[link[0]] && nodes[link[0]].color) {
                            nodes[link[1]] = {
                                id: link[1],
                                color: nodes[link[0]].color
                            };
                        }
                    });
                    that.$emit('sendColorArr',Object.values(nodes))
                    e.options.nodes = Object.keys(nodes).map(function (id) {
                        return nodes[id];
                    });
                }
            );
            this.chart.series[0].update();
        },
        updated() {
            this.chart.series[0].setData(this.option.series[0].data);
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
