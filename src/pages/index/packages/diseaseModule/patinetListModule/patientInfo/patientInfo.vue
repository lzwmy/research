<template>
    <div class="patientInfoDetail noneImg" v-loading='loading'>
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
                        <!-- <p>{{item.author}}  {{item.createTime}}</p> -->
                        <p>{{item.reportType==1?'报告':'随访'}}名称：{{item.reportName}}</p>
                        <div>
                            <!-- <el-button type="danger" icon="icon iconfont iconshanchu1"></el-button> -->
                            <span class="state" v-if="item.status==0">未完成</span>
                            <span class="state" v-else style="color: rgba(245, 157, 0, 1); border: 1px solid rgba(245, 157, 0, 1); background:rgba(245, 157, 0, 0.1);">已完成</span>
                        </div>
                    </div>
                    <!-- <h4 class="cur_pointer" @click="toReportFill(item)">{{item.reportType==1?'初诊':'随访'}}</h4> -->
                    <h4 class="cur_pointer" @click="toReportFill(item)">{{item.reportType==1?'报告':'随访'}}医生：{{item.author}} <span style="padding-left: 20px;">创建时间： {{item.createTime}}</span> </h4>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <img v-if="reportDataList.length==0" src="./../images/data_time.png" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 130px" alt="">
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
            let formData = {
                // offset: 1,
                // limit: 99,
                // args: this.dataInfo
                "patientId": this.dataInfo.patientId,
                "diseaseId": this.dataInfo.diseaseId,
                "subjectId": this.dataInfo.subjectId,
                "groupId": this.dataInfo.groupId,
            };
            console.log(formData)
            try {
                // let res = await that.$http.PFUGetReportDataList(formData);
                let res = await that.$http.queryReportListnew(formData);
                if (res.code == '0') {
                    this.reportDataList = res.data;
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
              let urlParameters = "cacheData="+false+"&formId="+row.crfId+"&reportId="+row.id+"&groupId="+row.groupId+"&subjectId="+row.subjectId+"&diseaseId="+row.diseaseId+"&patientName="+row.patientName+"&patientId="+row.patientId+"&identify="+this.identify+"&from="+'caseManage'+"&diseaseName="+row.diseaseName+"&subjectName="+row.subjectName+"&groupName="+row.groupName+"&title="+row.reportName+"&isModify="+"displayShow";
              window.open('./patientForm.html?'+urlParameters);
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
                        height: 24px;
                        line-height: 24px;
                        padding: 0 10px;
                        margin-right: 15px;
                        background:rgba(239,63,73,0.1);
                        .icon {
                            margin: 0;
                            color: #DB5452;
                        }
                    }
                    h4 {
                        line-height: 30px;
                        color: rgba(57, 66, 99, 1);
                        font-weight: normal;
                    }
                    .state {
                        display: inline-block;
                        width:66px;
                        line-height: 22px;
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
