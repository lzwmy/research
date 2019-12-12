<template>
    <div class="cloud-component disReportList">
        <div class="box">
            <div class="aside">
                <div class="aside_top flex-center-center">
                    <el-select v-model="identify" placeholder="请选择" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="123" value="123"></el-option>
                    </el-select>
                </div>
                <p class="lable">报告状态</p>
                <ul v-loading="groupLoading">
                    <li v-for="(item, index) in groupList" :key="index">
                        <i class="icon iconfont" :class="item.icon" ></i>
                        <span>{{item.name}} - {{item.count}}</span>
                    </li>
                </ul>
            </div>
            <div class="content">
                <!-- 搜索区域 -->
                <div class="cloud-search el-form-item-small">
                    <el-form :inline="true" :model="form" class="flex-start-center">
                        <!-- <el-form-item label="时间范围：">
                            <el-date-picker
                                v-model="form.time"
                                type="daterange"
                                size="mini"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item> -->
                        <el-form-item label="状态:">
                            <el-select v-model="form.state" size="mini">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未填写" value="0"></el-option>
                                <el-option label="已填写" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" label-width='' class="flex-right">
                            <el-input
                                placeholder="搜索"
                                prefix-icon="el-input__icon el-icon-search"
                                v-model="form.report"
                                clearable
                                @keyup.enter.native="getDataList()"
                                style="width:280px;">
                            </el-input>
                            <!-- <el-button type="primary" icon="el-icon-search" @click="getDataList()">查 询</el-button> -->
                        </el-form-item>
                    </el-form>
                </div>
                <!--搜索结果-->
                <div class="cloud-search-list">
                    <echarts-contain containType="big" :parentHeight="routerViewHeight*1-15" :heightRatio="1">
                        <el-table
                            :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-70):(routerViewHeight*1)"
                            :data="dataList.content" v-loading="loading" ref="refTable" size="small"
                            :empty-text="emptyText" :element-loading-text="elementLoadingText" fit
                            @row-click="handleClick">
                            <el-table-column type="expand" width="40"> 
                                <template slot-scope="props"> 
                                    <el-timeline>
                                        <el-timeline-item
                                            v-for="(item, index) in 5"
                                            :key="index"
                                            :hide-timestamp="true"
                                            class="aaaaaaaaaaaa">
                                            <div class="expand_content">
                                                <i class="icon iconfont iconzujian51"></i>
                                                <p><span>2019-8-20 16:10:20</span><span>张医生填写报告</span></p>
                                                <i class="icon iconfont iconzujian51"></i>
                                            </div>
                                        </el-timeline-item>
                                    </el-timeline>
                                </template>
                            </el-table-column>
                            <el-table-column prop="visitDate" label="就诊时间"></el-table-column>
                            <el-table-column prop="reportName" label="报告名称"></el-table-column>
                            <el-table-column prop="patientName" label="姓名"></el-table-column>
                            <el-table-column prop="genderName" label="性别"></el-table-column>
                            <el-table-column prop="author" label="创建者"></el-table-column>
                            <el-table-column prop="groupName" label="课题组"></el-table-column>
                            <el-table-column label="报告状态" width="120px">
                                <template slot-scope="scope">
                                    {{scope.row.status==0?'未填写':'已填写'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="toReportFill(scope.row)"><i class="icon iconfont iconbianji"></i></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <pagination :data="dataList" @change="getDataList"></pagination>
                    </echarts-contain>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import utils from 'components/utils/index';
import diseaseSubjectgroup from 'components/packages/linkage/diseaseSubjectgroup';


export default {
    name: 'dataMonitoring',
    mixins: [mixins],
    data () {
        return {
            form: {
                diseaseSubjectGroup: {},
                time:[],
                state:"",
                report: ""
            },
            groupList: [
                {icon:'iconbianjibeifen3', name: '已提交', count:0, value: 'endCount'},
                {icon:'iconbianji4', name: '不通过', count:0, value: 'finishCount'},
                {icon:'iconbianjibeifen1', name: '通过', count:0, value: 'finishCount'},
                {icon:'iconquanbu', name: '全 部', count:0, value: 'allCount'}
            ],
            dataList: {
                content: []
            },
            loading: false,
            groupLoading: false,
            identify:"",
            paging: {
                pageNo: 1,
                pageSize: 20,
                currentPageNo: '',
                currentPageSize: '',
            },
            emptyText: '',
            elementLoadingText: ''  
        };
    },
    watch: {},
    computed: {},
    created () {
        let date = new Date();
        this.form.time[0] = utils.formateDate(date).substring(0,7) + '-01';
        let lastDay = '';
        if ((date.getMonth() + 1) == 2) {
            let yearType = date.getFullYear();
            if (yearType % 4 == 0 && (yearType % 100 != 0 || yearType % 400 == 0)) {
                lastDay = 29;
            } else {
                lastDay = 28;
            }
        } else if ([1,3,5,7,8,10,12].indexOf((date.getMonth() + 1)) != -1) {
            lastDay = 31;
        } else {
            lastDay = 30;
        }
        this.form.time[1] = utils.formateDate(date).substring(0,7) + '-' + lastDay;
        this.getDataList()
        .then(()=>{
            this.$emit('changeLoadding',false)
        })
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    destoryed() {
        document.removeEventListener(this.visibilityChange)
    },
    components: {
        pagination,
        echartsContain,
        diseaseSubjectgroup
    },
    methods: {
        addEventListenervisibilityChange() {
            let hidden = "";
            this.visibilityChange = "";
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                this.visibilityChange = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                this.visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                this.visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                this.visibilityChange = "webkitvisibilitychange";
            }
            document.addEventListener(this.visibilityChange,()=>{
                if(!document[hidden]) {
                    this.getDataList();
                }
            }, false);
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
            that.loading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let startTime, endTime;
            if(!this.form.time || this.form.time && this.form.time.length == 0) {
                startTime = null
                endTime = null
            }else {
                startTime = this.form.time[0].split("-").join('');
                endTime = this.form.time[1].split("-").join('');
            }
            let formData = {
                offset: pageNo,
                limit: pageSize,
                args: {
                    // diseaseId: this.form.diseaseSubjectGroup.disease || '',
                    diseaseId: this.$route.query.id || '',
                    subjectId: this.form.diseaseSubjectGroup.subject || '',
                    groupId: this.form.diseaseSubjectGroup.group || '',
                    crfId: "",
                    patientName: "",
                    startTime: startTime,
                    endTime: endTime,
                    status: this.form.state
                }
            };
            try {
                let res = await that.$http.RRMgetDataList(formData);
                if (res.code == '0') {
                    let obj = {};
                    obj.content = res.data.args;
                    obj.pageNo = pageNo;
                    obj.pageSize = pageSize;
                    obj.totalCount = parseInt(res.data.totalElements);
                    obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
                    that.dataList = obj;
                }else {
                    this.$mes('error', res.msg);
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
        changeDiseaseSubjectGroup (data) {
            this.form.diseaseSubjectGroup = data;
        },
        reset () {
            this.form = {
                diseaseSubjectGroup: {},
                time:[],
                state:""
            }
            let date = new Date().getTime();
            this.form.time[0] = utils.formateDate(date - ( 1000 * 60 * 60 * 24 * 30));
            this.form.time[1] = utils.formateDate(date + ( 1000 * 60 * 60 * 24));
            this.$refs.diseaseSubjectGroup.ruleForm.disease = '';
        },
        toReportFill(row) {
          // console.log(row)
            this.getIdentify(row.patientId)
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
                localStorage.setItem('reportFill',JSON.stringify({urlParameter}));

              let urlParameters = "cacheData="+false+"&formId="+row.crfId+"&reportId="+row.id+"&groupId="+row.groupId+"&subjectId="+row.subjectId+"&diseaseId="+row.diseaseId+"&patientName="+row.patientName+"&patientId="+row.patientId+"&identify="+this.identify+"&from="+'caseManage'+"&diseaseName="+row.diseaseName+"&subjectName="+row.subjectName+"&groupName="+row.groupName+"&title="+row.reportName+"&isModify="+"displayShow";
              window.open('./patientForm.html?'+urlParameters);
            })
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
        //表格内容展开
        handleClick(row) {
            // this.$refs.refTable.toggleRowExpansion(row)
        }
    },
    beforeRouteEnter (to, from, next) {
        next();
    },
    beforeRouteLeave (to, from, next) {
        next();
    }
};
</script>

<style lang="less">
    .disReportList {
        .el-table {
            padding: 0 !important;
        }
        .el-table__expanded-cell {
            background-color: #F7FAFD;
            &:hover {
                background-color: #F7FAFD !important;
            }
            .el-timeline .el-timeline-item:last-child{
                color: #232325;
                .el-timeline-item__node {
                    border-color: #232325;
                }
                .el-timeline-item__content {
                    color: #232325;
                }
            }
            .el-timeline-item__node {
                background-color: #fff;
                border:1px solid #ccc;
                width: 8px;
                height: 8px;
            }
            .el-timeline-item__tail {
                border-left: 1px solid #ccc;
                left: 2px;
            }
            .el-timeline-item__wrapper {
                padding-left: 18px;
            }
            .el-timeline-item:last-child {
                padding-bottom: 0;
            }
            .el-timeline-item__content {
                color: #999;
                // &:hover p {
                //     color: #333;
                // }
                p {
                    display: inline-block;
                    margin-left: 8px;
                    font-size: 13px;
                    span {
                        padding-right: 10px;
                    }
                }
            }
        }
        .box {
            position: relative;
            height: 100%;
            color: #394263;
            .aside {                
                width: 220px;
                height: 100%;
                background-color: #fff;
                .aside_top {
                    padding:0 15px;
                    height: 80px;
                    border-bottom: 1px solid rgba(229,235,236,1);
                }
                .lable {
                    padding: 15px;
                }
                li {
                    height: 40px;
                    line-height: 40px;
                    padding-left: 20px;
                    font-size: 14px;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                    &.active {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    &:hover {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    &:nth-child(1):hover .icon,
                    &:nth-child(1).active .icon {
                        color: #8aca56;
                    }
                    &:nth-child(2):hover .icon,
                    &:nth-child(2).active .icon {
                        color: #e24828;
                    }
                    &:nth-child(3):hover .icon,
                    &:nth-child(3).active .icon {
                        color: #00bf8f;
                    }
                    &:nth-child(4):hover .icon,
                    &:nth-child(4).active .icon {
                        color: #00bf8f;
                    }
                    .icon {
                        padding-right: 8px;
                        color: #999;
                    }
                }
            }
            .content {
                position: absolute;
                left: 235px;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: #fff;
                padding: 15px;
                h2 {
                    font-size: 16px;
                    margin-bottom: 15px;
                    span {
                        margin-left: 10px;
                        background:rgba(57,65,100,0.2);
                        color: #394263;
                        font-size: 12px;
                        font-weight: normal;
                        padding: 0 4px;
                        border-radius: 10px;
                    }
                }
            }
        }
    }
</style>


