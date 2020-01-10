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
                    <div class="flex-between-center cur_pointer">
                        <p @click="toReportFill(item)">{{item.reportType==1?'报告':'随访'}}名称：{{item.reportName}}</p>
                        <div>
                            <el-button type="danger" class="delete_btn" icon="icon iconfont iconshanchu1" v-if="item.status == 0" @click="onDeleteReport(item)"></el-button>
                            <span class="state" :class="'status_'+item.reportType+'_'+item.status">{{matchingReportStatus(item)}}</span>
                        </div>
                    </div>
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
    created () {
        this.getDataList();
    },
    mounted () {
        this.getIdentify(this.reportFillData.patientId);
    },
    methods: {
        //匹配报告状态
        matchingReportStatus(row) {
            //报告状态
            if(row.reportType == 1) {
                switch (row.status) {
                    case 0: return '未填写';
                    case 1: return '已填写';
                    case 2: return '已提交';
                    case 3: return '不通过';
                    case 4: return '已通过';
                    case 5: return '已召回';
                    default: break;
                }
            }else {
                switch (row.status) {
                    case 0: return '未填写';
                    case 1: return '已填写';
                    case 2: return '失访';
                    case 3: return '终止';
                    default: break;
                }
            }
            
        },
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
            try {
                // let res = await that.$http.PFUGetReportDataList(formData);
                let res = await that.$http.queryReportListnew(formData);
                if (res.code == '0') {
                    this.reportDataList = res.data;
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
                    from: row.reportType==1?"caseManage":'patientFollowUp',
                    diseaseName: row.diseaseName || "",
                    subjectName: row.subjectName || "",
                    groupName: row.groupName || "",
                    title: row.reportName,
                    isModify:"displayShow"
                }
                localStorage.setItem('reportFill',JSON.stringify({urlParameter}));
                let urlParameters = "cacheData="+false+"&formId="+row.crfId+"&reportId="+row.id+"&groupId="+row.groupId+"&subjectId="+row.subjectId+"&diseaseId="+row.diseaseId+"&patientName="+row.patientName+"&patientId="+row.patientId+"&identify="+this.identify+"&from="+'caseManage'+"&diseaseName="+row.diseaseName+"&subjectName="+row.subjectName+"&groupName="+row.groupName+"&title="+row.reportName+"&isModify="+"displayShow";
                window.open('./patientForm.html?'+urlParameters);
            })
        },
        //删除报告
        onDeleteReport(row){
            this.$confirm('确定删除这条报告?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                let formData = {
                    reportId: row.id,
                    crfId: row.crfId,
                };
                try {
                    let res = await this.$http.reportDelete(formData);
                    if (res.code == 0) {
                        this.$mes('success', "删除成功");
                        this.getDataList();
                    } 
                } catch (err) {
                    console.log(err)
                }
            }).catch(() => {});
        },
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
                        flex: 1;
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
                        width: 62px;
                        line-height: 22px;
                        text-align: center;
                        border-radius:2px;
                        &.status_1_0 {
                            color: #999;
                            border:1px solid rgba(153, 153, 153, 0.753);
                            background:rgba(153, 153, 153, 0.1);
                        }
                        &.status_1_1 {
                            color: rgb(0, 119, 180);
                            border:1px solid rgb(0, 119, 180);
                            background: rgba(0, 119, 180, 0.1);
                        }
                        &.status_1_2 {
                            color: #8aca56;
                            border:1px solid rgb(138, 202, 86);
                            background:rgba(138, 202, 86,0.1);
                        }
                        &.status_1_3 {
                            color: rgb(247, 158, 1);
                            border:1px solid rgb(247, 158,1);
                            background:rgba(247, 158,1, 0.1);
                        }
                        &.status_1_4 {
                            color: rgb(0, 191, 143);
                            border:1px solid #00bf8f;
                            background:rgba(0, 191, 143,0.1);
                        }
                        &.status_2_0 {
                            color: #999;
                            border:1px solid rgba(153, 153, 153, 0.753);
                            background:rgba(153, 153, 153, 0.1);
                        }
                        &.status_2_1 {
                            color: rgb(0, 119, 180);
                            border:1px solid rgb(0, 119, 180);
                            background: rgba(0, 119, 180, 0.1);
                        }
                        &.status_2_2 {
                            color: rgb(247, 158, 1);
                            border:1px solid rgb(247, 158,1);
                            background:rgba(247, 158,1, 0.1);
                        }
                        &.status_2_3 {
                            color: rgb(226, 72, 40);
                            border:1px solid #e24828;
                            background:rgba(226, 72, 40,0.1);
                        }
                    }
                    .delete_btn {
                        display: none;
                    }
                    &:hover .delete_btn {
                        display: inline-block;
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
