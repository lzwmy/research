<template>
    <div class="patientInfoDetail" v-loading='loading'>
        <el-timeline>
            <el-timeline-item 
                v-for="(item, index) in reportDataList" 
                :key="index" 
                :timestamp="item.visitDate" 
                placement="top" 
                :icon="item.reportType==1?'icon iconfont iconshijianzhoubeifen diagnosis':'icon iconfont iconzujian20 followUp'"
                size="18">
                <el-card>
                    <div class="flex-between-center">
                        <p>{{item.author}}  {{item.createTime}}</p>
                        <span class="state">已审核</span>
                    </div>
                    <h4>{{item.reportType==1?'初诊':'随访'}}</h4>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>

export default {
    name: 'patientInfoDetail',
    props:['dataInfo'],
    data () {
        return {
            reportDataList:[],
            loading: false
        };
    },
    watch: {
        
    },
    computed: {},
    created () {
        this.getDataList();
    },
    mounted () {

    },
    components: {
    },
    methods: {
        async getDataList () {
            let that = this;
            that.loading = true;
            console.log(this.dataInfo)
            let formData = {
                offset: 1,
                limit: 99,
                args: this.dataInfo
            };
            try {
                let res = await that.$http.PFUGetReportDataList(formData);
                if (res.code == '0') {
                    this.reportDataList = res.data.args;
                }else {
                    this.$mes('error', res.msg);
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
    },
};
</script>

<style lang="less">
    .patientInfo {
        .content {
            position: relative;
            .timeline {
                width: 60%;
                margin-top: 33px;
                .el-timeline-item__node {
                    background-color: #fff;
                    .diagnosis {
                        color: rgba(27, 186, 225, 1);
                        font-size: 18px;
                    }
                    .followUp {
                        color: rgba(0, 189, 145, 1);
                        font-size: 18px;
                    }
                }
                .el-timeline-item__tail {
                    left: 7px;
                    border-left: 2px solid rgba(27, 186, 225, 0.1);
                }
                .el-timeline-item__timestamp {
                    color: rgba(57, 66, 99, 1);
                    font-weight: bold;
                    font-size: 16px;
                }
                .el-card__body {
                    padding: 15px;
                    p {
                        color: rgba(89, 101, 144, 1);
                        line-height: 30px;
                    }
                    .el-button {
                        height: 26px;
                        line-height: 26px;
                    }
                    h4 {
                        line-height: 30px;
                        color: rgba(57, 66, 99, 1);
                    }
                    .state {
                        display: inline-block;
                        width:66px;
                        height:24px;
                        line-height: 24px;
                        text-align: center;
                        background:rgba(27,186,225,0.1);
                        border-radius:2px;
                        border:1px solid rgba(27,186,225,1);
                        color: rgba(27, 186, 225, 1);
                    }   
                }
            }
            .reportList {
                position: absolute;
                top: 55px;
                right: 20px;
                bottom: 0;
                left: 20px;
            }
            .group_btn {
                font-size: 0;
                width: 130px;
                position: absolute;
                top: 20px;
                right: 20px;
                .el-button {
                    width:64px;
                    height:35px;
                    background:rgba(101, 210, 237, 1);
                    border-radius:1px;
                    margin: 0;
                    .icon {
                        font-size: 22px;
                        line-height: 35px;
                    }
                    &.active {
                        background:rgba(0,186,227,1);
                    }
                }
            }
        }
        .record {
            .el-timeline-item__node--normal {
                width: 8px;
                height: 8px;
            }
            .el-timeline-item__tail {
                left: 2px;
            }
        }
    }
</style>