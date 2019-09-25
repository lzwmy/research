<template>
    <div class="cloud-component projectProgress">
        <div class="step">
            <p class="label">科研全流程</p>
            <ul class="flex-between-center">
                <li v-for="(item,index) in step" :key="index" :class="item.finish?'finish':''">
                    <div class="step_wrap">
                        <span class="icon iconfont" :class="item.icon" :style="'background-color:' + item.bgColor + ';'"></span>
                        <p>{{item.text}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="wrap">
            <h3 class="wrap_title">项目进度<span>共<span style="color:red;">1</span>位研究对象</span></h3>
            <el-row :gutter="30">
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    <div class="wrap_box">
                        <p class="wrap_label">患者总进度</p>
                        <charts :option="optionPatient"></charts>
                    </div>
                </el-col>
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    <div class="wrap_box">
                        <p class="wrap_label">随访总进度</p>
                        <charts :option="optionFollowUp"></charts>
                    </div>
                </el-col>
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    <div class="wrap_box wrap_box_3 flex-start-center">
                        <div class="finish flex-center-center flex-wrap">
                            <p>今日完成</p>
                            <span>20</span>
                        </div>
                        <ul class="content flex-start-center flex-wrap">
                            <li v-for="item in 8">
                                <p>今日失访</p>
                                <span>10</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="wrap wrap_group">
            <h3 class="wrap_title">分组1<span>共<span style="color:red;">1</span>位研究对象</span></h3>
            <el-row :gutter="30">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <div class="wrap_box">
                        <p class="wrap_label">入组阶段</p>
                        <p class="charts_y_title">患者数</p>
                        <charts :option="optionGroup1"></charts>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <div class="wrap_box">
                        <p class="wrap_label">阶段1</p>
                        <p class="charts_y_title">患者数</p>
                        <charts :option="optionGroup1"></charts>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import charts from './charts'
export default {
    name: 'projectProgress',
    data () {
        return {
            step: [
                {icon: 'iconkeyanlingganbeifen', bgColor: 'rgba(245, 166, 35, 1)', text: '科研灵感',finish: true},
                {icon: 'iconketiyanzhengbeifen', bgColor: 'rgba(67, 154, 255, 1)', text: '课题验证',finish: true},
                {icon: 'iconbaogaoxinxibeifen', bgColor: 'rgba(142, 196, 102, 1)', text: '项目信息',finish: true},
                {icon: 'iconyanjiufenzubeifen', bgColor: 'rgba(67, 154, 255, 1)', text: '研究分组',finish: true},
                {icon: 'iconyanjiuneirongbeifen', bgColor: 'rgba(177, 182, 205, 1)', text: '研究内容',finish: true},
                {icon: 'iconshujulurubeifen', bgColor: 'rgba(161, 204, 255, 1)', text: '数据录入',finish: false},
                {icon: 'iconhuanzhesuifangbeifen', bgColor: 'rgba(128, 221, 200, 1)', text: '患者随访',finish: false},
                {icon: 'iconshujusuodingbeifen', bgColor: 'rgba(161, 204, 255, 1)', text: '数据锁定',finish: false},
                {icon: 'iconkeyanfenxibeifen', bgColor: 'rgba(129, 219, 238, 1)', text: '科研分析',finish: false},
                {icon: 'iconlunwenrunsebeifen', bgColor: 'rgba(161, 204, 255, 1)', text: '论文润色',finish: false},
            ],
            optionPatient: {
                chart: {
                    margin: [15, 0, 40, 0]
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '50%',
                    name:"aaa",
                    data:[
                        {name:'录入中', y: 60, color: 'rgba(67, 154, 255, 1)'},
                        {name:'已完成', y: 40, color: 'rgba(90, 216, 166, 1)'},
                    ]
                }],
                credits: {
                    enabled:false
                }
            },
            optionFollowUp: {
                chart: {
                    margin: [15, 0, 40, 0]
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '50%',
                    name:"aaa",
                    data:[
                        {name:'未开始', y: 60, color: 'rgba(177, 182, 205, 1)'},
                        {name:'录入中', y: 60, color: 'rgba(67, 154, 255, 1)'},
                        {name:'已完成', y: 40, color: 'rgba(90, 216, 166, 1)'},
                        {name:'已终止', y: 60, color: 'rgba(242, 110, 108, 0.9)'},
                    ]
                }],
                credits: {
                    enabled:false
                }
            },
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
                    enabled: true
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
                        data:[10,20,30,4]
                    },
                    {
                        name:"已完成",
                        color: 'rgba(90, 216, 166, 1)',
                        data: [10,20,30,4]
                    }
                ],
                credits: {
                    enabled:false
                }
            },
        }
    },
    watch: {
        
    },
    components: {
        charts
    },
    methods: {
        
    }
};
</script>

<style lang="less">
    .projectProgress {
        .step {
            background-color: #fff;
            padding: 15px;
            .label {
                font-size: 16px;
                font-weight:bold;
                margin-bottom: 15px;
                color:rgba(57,66,99,1);
            }
            ul {
                li {
                    flex: 1;
                    position: relative;
                    &::after {
                        content: '';
                        position: absolute;
                        top: 30px;
                        left: 70px;
                        width: 100%;
                        right: 0;
                        height: 6px;
                        background-color: rgba(229, 235, 236, 1);
                    }
                    &.finish::after {
                        background-color: rgba(0, 188, 146, 1); 
                    } 
                    &:last-child {
                        flex-grow: 0;
                        &::after {
                            display: none;
                        }
                    }
                    .step_wrap {
                        width: 70px;
                        span {
                            height: 70px;
                            display: block;
                            border-radius: 50%;
                            font-size: 60px;
                            line-height: 70px;
                            text-align: center;
                            color: #fff;
                        }
                        p {
                            font-size:14px;
                            text-align: center;
                            margin-top: 15px;
                            color:rgba(57,66,99,1);
                        }
                    }
                }
            }
        }
        .wrap {
            margin-top: 34px;
            &.wrap_group {
                .wrap_box {
                    height: 330px;
                }
                .chartContent {
                    height: 260px;
                }
            } 
            .wrap_title {
                font-size: 18px;
                margin-bottom: 20px;
                color: rgba(57, 66, 99, 1); 
                & > span {
                    font-size: 12px;
                    padding-left: 20px;
                    font-weight: normal;
                }
            }
            .charts_y_title {
                padding: 15px 0 4px;
            }
            .wrap_box {
                background-color: #fff;
                height: 244px;
                color: rgba(57, 66, 99, 1);
                padding: 15px;
                .wrap_label {
                    font-size: 16px;
                    font-weight: bold;
                }
                &.wrap_box_3 {
                    padding: 0 2vw;
                    .finish {
                        background-color: rgba(90, 216, 166, 1);
                        border-radius: 50%;
                        width: 120px;
                        flex-direction: column;
                        height: 120px;
                        color: #fff;
                        font-size: 16px;
                        p   {
                            margin-bottom: 8px;
                        }
                        span {
                            font-size: 30px;
                        }
                    }
                    ul {
                        margin-left: 2vw;
                        flex: 1;
                        li {
                            font-size: 14px;
                            width: 33%;
                            margin-bottom: 24px;
                            &:nth-child(2) {
                                width: 60%;
                            }
                            &:nth-child(n + 6) {
                                margin-bottom: 0;
                            }
                            span {
                                font-size: 18px;
                                margin-top: 4px;
                                display: block;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
        }
    }
</style>




