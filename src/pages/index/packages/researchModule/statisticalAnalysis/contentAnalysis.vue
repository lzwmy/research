<template>
    <div class="statisticalAnalysis_content">
        <p v-if="statisticsData.list.length != 0" class="page_title text_center">{{targetElemnt.itemName+'的'+ activeTag==0?'描述性统计':'单因素分析'}}</p>
        <el-table 
            v-if="activeTag==0 && statisticsData.list.length != 0"
            ref="refTable" fit
            :data="statisticsData.list"
            v-loading="tableLoading">
            <!-- <el-table-column prop="dynamicName" :label="targetElemnt"></el-table-column> -->
            <el-table-column prop="totalFrequency" label="总频数"></el-table-column>
            <el-table-column prop="validCount" label="有效频数"></el-table-column>
            <el-table-column prop="missingCount" label="缺失数"></el-table-column>
            <el-table-column prop="percentage" label="占比(%)"></el-table-column>
        </el-table>
        <el-table 
            v-if="activeTag==1 && statisticsData.list.length != 0"
            ref="refTable" fit
            :data="statisticsData.list"
            v-loading="tableLoading">
            <el-table-column prop="e" label="总频数"></el-table-column>
            <el-table-column prop="e" label="有效频数"></el-table-column>
            <el-table-column prop="e" label="缺失数"></el-table-column>
            <el-table-column prop="e" label="标准差"></el-table-column>
            <el-table-column prop="e" label="最小值"></el-table-column>
            <el-table-column prop="e" label="Q1"></el-table-column>
            <el-table-column prop="e" label="中位数"></el-table-column>
            <el-table-column prop="e" label="Q3"></el-table-column>
            <el-table-column prop="e" label="最大值"></el-table-column>
            <el-table-column prop="e" label="正态值检验p值"></el-table-column>
        </el-table>
        <div v-if="statisticsData.list.length == 0" class="empty flex-center-center flex-wrap" style="margin: 50px 0;">
            <svg class="icon" aria-hidden="true" style="font-size: 30px;width:100%; text-align:center;">
                <use xlink:href="#iconzu11"></use>
            </svg>
            <p class="text-center" style="font-size: 14px; color:#666;padding-top: 15px;">暂无内容</p>
        </div>
        <br/>
        <p class="page_title bottom_10">统计结果解读</p>
        <el-input
            type="textarea"
            :rows="3"
            v-model="statisticsData.textList"
            disabled>
        </el-input>
        <br/>
        <br/>
        <br/>
        <div class="charts_btn flex-start-start">
            <el-button :class="activeChart == 0?'active':''" @click="selectBtn(0)">直方图</el-button>
            <el-button :class="activeChart == 1?'active':''" @click="selectBtn(1)">箱线图</el-button>
        </div>
        <br/>
        <div class="charts flex-between-center">
            <charts :option="optionGroup1"></charts>
            <charts :option="optionGroup1"></charts>
        </div>
    </div>
</template>

<script>
import charts from './charts'
export default {
    props: ['statisticsData','targetElemnt','activeTag'],
    name: 'contentAnalysis',
    data () {
        return {
            tableLoading: false,
            textarea:'',
            activeChart: 0,
            dataList: [{a:1},{a:1}],
            optionGroup1: {
                chart: {
                    type: 'column',
                    margin: [10, 40, 50, 30],
                    spacingBottom: 0

                },
                title: {
                    text: ''
                },
                tooltip: {
                    borderColor: null,
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: ['白癜风','银屑病','面部皮炎','神经内科']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    lineWidth: 1
                },
                series: [
                    {
                        name:"录入中",
                        color: 'rgba(67, 154, 255, 1)',
                        data:[10,20,30,4,40,21,54]
                    }
                ],
                credits: {
                    enabled:false
                }
            },
        }
    },
    components: {
        charts
    },
    methods: {
        selectBtn(val) {
            this.activeChart = val;
        }
    }
};
</script>

<style lang="less">
    .statisticalAnalysis_content {
        margin-top: 35px;
        .el-table {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding: 0 !important;
            min-height: 50px;
            .el-table__body-wrapper {
                min-height: 50px !important;
            }
        }
        .charts_btn {
            .el-button {
                border-radius: 0;
                height: 32px;
                margin: 0;
                border: 1px solid #1bbae1;
                background-color: #fff;
                color: #1bbae1;
                &.active {
                    background-color: #1bbae1;
                    color: #fff;
                }
                &:last-child {
                }
            }
        }
    }
</style>




