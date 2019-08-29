<template>
    <div class="echartContent flex-around-center" v-show="visible">
        <p class="title">{{title}}</p>
        <div :id="domId" :ref="domId" class="echartContent"></div>
        <el-button type="text" class="delete" @click="onDelete(title)"><span class="el-icon-delete"></span></el-button>
    </div>
</template>

<script>
import utils from 'components/utils/index';
export default {
    name: 'chartsLine',
    props: {
        id: {
            type: String,
            default: ""
        },
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
        },
        startTime: {
            type: String,
            default: ""
        },
        endTime: {
            type: String,
            default: ""
        }
    },
    watch: {
        list: function(newVal) {
            this.setChartsSeries();
        }
    },
    data () {       
        return {
            visible: true,
            chart: null
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initHighcharts();
        });
    },
    methods: {
        onDelete(title) {
            this.$confirm('确认删除该模版吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                if(!this.id) {
                    this.visible = false;
                    return;
                }
                let formData = {
                    id: this.id
                };
                try {
                    let data = await this.$http.getIndicatorTemplateDelete(formData);
                    if (data.code == '0') {
                        this.$mes('success', data.message || '删除成功');
                        this.$emit('getIndicatorData')
                    }
                } catch (error) {
                    this.$mes('error', '删除出错');
                }
            }).catch((error) => {});
        },
        initHighcharts() {
            this.chart = this.$Highcharts.chart(this.domId, this.option);
            this.setChartsSeries();
        },
        setChartsSeries() {
            this.chart.xAxis[0].setExtremes(new Date(this.startTime).getTime(), new Date(this.endTime).getTime())
            this.chart.series[0].update({
                data: this.list
            });
        }
    },
        
};
</script>


<style lang='less' scoped>
    .echartContent {
        flex: 1;
        min-height: 150px;
        .title {
            font-size: 14px; 
            color: #555;
            margin-left: 30px;
            min-width: 65px; 
        }
        
        .delete {
            margin-left: 20px;
            font-size: 24px;
            color: #666;
        }
    }
</style>

<style lang='less'>

</style>
