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
                    <div class="flex-between-center cur_pointer" @click="toReportFill(item)">
                        <p>{{item.author}}  {{item.createTime}}</p>
                        <span class="state">已审核</span>
                    </div>
                    <h4 class="cur_pointer" @click="toReportFill(item)">{{item.reportType==1?'初诊':'随访'}}</h4>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>

export default {
    name: 'patientInfoDetail',
    props:['dataInfo','reportFillData'],
    data () {
        return {
            reportDataList:[],
            loading: false,
            identify: ""
        };
    },
    watch: {
        
    },
    computed: {},
    created () {
        this.getDataList();
    },
    mounted () {
        this.getIdentify(this.reportFillData.patientId);
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
        //获取身份证号
        async getIdentify(patientId) {
            let formData = {
                patientId: patientId
            }
            try {
                let res = await this.$http.casesSearchPatient(formData);
                if (res.code == 0) {
                    this.identify = res.data.identitycardno || "";
                }else {
                    this.$mes('error', "获取基本信息失败!");
                }
            } catch (err) {
                console.log(err)
            }
        },
        toReportFill(row) {
            this.getIdentify(this.identify)
            .then( ()=>{
                let that = this;
                let urlParameter={
                    cacheData: false,
                    formId: row.crfId || "",
                    reportId: row.id || '',
                    groupId: row.groupId || "",
                    subjectId: row.subjectId || "",
                    diseaseId: row.diseaseId || "",
                    patientName: row.patientName || "",
                    patientId: row.patientId || "",
                    identify: this.identify || "",
                    from: "caseManage",
                    diseaseName: row.diseaseName || "",
                    subjectName: row.subjectName || "",
                    groupName: row.groupName || "",
                    title: row.reportName,
                    isModify:"displayShow"
                }
                sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
                window.open('./patientForm.html');
            })
        }
    },
};
</script>

<style lang="less">
    .patientInfo {
        .content {
            position: relative;
            .timeline {
                position: absolute;
                top: 66px;
                left: 20px;
                bottom: 10px;
                right: 0px;
                margin-top: 33px;
                overflow-y: auto;
                .el-timeline {
                    width: 60%;
                }
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