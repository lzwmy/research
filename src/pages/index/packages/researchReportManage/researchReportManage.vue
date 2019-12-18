<template>
    <div class="cloud-component researchReportManage">
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small">
            <el-form :inline="true" :model="form" class="flex-start-center">
                <!-- <disease-subjectgroup style="display: inline-block;" @select="changeDiseaseSubjectGroup" width="70px" ref="diseaseSubjectGroup"></disease-subjectgroup>
                <el-form-item label="状态:">
                    <el-select v-model="form.state" size="mini">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未填写" value="0"></el-option>
                        <el-option label="已填写" value="1"></el-option>
                    </el-select>
                </el-form-item>
                    
                <el-form-item>
                <el-button type="primary" size="mini" @click="getDataList()">查 询</el-button>
                <el-button @click="reset" size="mini">清 空</el-button>
                </el-form-item> -->
                <!-- <el-form-item label="" label-width=''>
                    <el-input
                        placeholder="专病报告"
                        suffix-icon="el-input__icon el-icon-search"
                        v-model="form.report"
                        clearable
                        style="width:280px;">
                    </el-input>
                </el-form-item> -->
                <el-form-item label="时间范围：">
                    <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="form.state" size="mini">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未填写" value="0"></el-option>
                        <el-option label="已填写" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width='' class="flex-right">
                    <el-button type="primary" icon="icon iconfont iconzujian43" @click="getDataList()">查 询</el-button>
                    <!-- <el-button icon="icon iconfont iconzujian12" type="primary">提交</el-button>
                    <el-button icon="icon iconfont iconzujian16" type="primary">核查</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <!-- <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1"> -->
                    <!-- :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)" -->
                <el-table
                    :data="dataList.content" v-loading="loading" ref="refTable"
                    :empty-text="emptyText" :element-loading-text="elementLoadingText" fit
                    @row-click="handleClick">
                    <el-table-column  width="20">
                        <!--<template slot-scope="props"> type="expand"
                            <el-timeline>
                                <el-timeline-item
                                    v-for="(item, index) in 5"
                                    :key="index"
                                    :hide-timestamp="true">
                                    <div class="content">
                                        <i class="el-icon-edit"></i>
                                        <p><span>2019-8-20 16:10:20</span><span>{{$store.state.user.account}}填写报告</span></p>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </template>-->
                    </el-table-column>
                    <el-table-column sortable prop="visitDate" label="就诊时间"></el-table-column>
                    <el-table-column sortable prop="reportName" label="报告名称"></el-table-column>
                    <el-table-column sortable prop="patientName" label="姓名"></el-table-column>
                    <el-table-column sortable prop="genderName" label="性别" width="110"></el-table-column>
                    <el-table-column sortable prop="author" label="创建者"></el-table-column>
                    <el-table-column sortable prop="diseaseName" label="病种"></el-table-column>
                    <el-table-column sortable prop="groupName" label="课题组"></el-table-column>
                    <el-table-column sortable label="报告状态" width="110px">
                        <template slot-scope="scope">
                            {{scope.row.status==0?'未填写':'已填写'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button size="mini" @click.stop="toReportFill(scope.row)"><i class="icon iconfont iconbianji"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination :data="dataList" @change="getDataList"></pagination>
            <!-- </echarts-contain> -->
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
    name: 'researchReportManage',
    mixins: [mixins],
    data () {
        return {
            form: {
                diseaseSubjectGroup: {},
                time:[],
                state:"",
                report: ""
            },
            dataList: {
                content: []
            },
            loading: false,
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
        let date = new Date().getTime();
        this.form.time[0] = utils.formateDate(date - ( 1000 * 60 * 60 * 24 * 30));
        // this.form.time[0] = utils.formateDate(date - ( 1000 * 60 * 60 * 24 * 360));
        this.form.time[1] = utils.formateDate(date + ( 1000 * 60 * 60 * 24));
        this.getDataList();
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    beforeDestroy() {
        document.removeEventListener(this.visibilityChange,this.visibilityChangeHandle)
    },
    destoryed() {
    },
    components: {
        pagination,
        echartsContain,
        diseaseSubjectgroup
    },
    methods: {
        visibilityChangeHandle() {
            if (!document[this.hidden]) {
                this.getDataList()
            }
        },
        addEventListenervisibilityChange() {
            if (typeof document.hidden !== "undefined") {
                this.hidden = "hidden";
                this.visibilityChange = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                this.hidden = "mozHidden";
                this.visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                this.hidden = "msHidden";
                this.visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                this.hidden = "webkitHidden";
                this.visibilityChange = "webkitvisibilitychange";
            }
            document.addEventListener(this.visibilityChange,this.visibilityChangeHandle);
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let startTime, endTime;
            if(!this.form.time || this.form.time && this.form.time.length == 0) {
                startTime = null
                endTime = null
            }else {
                startTime = this.form.time[0].split("-").join('');
                endTime = this.form.time[1].split("-").join('');
            }
            let that = this;
            that.loading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let formData = {
                offset: pageNo,
                limit: pageSize,
                args: {
                    diseaseId: this.form.diseaseSubjectGroup.disease || '',
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
                let urlParameters = "cacheData="+false+"&formId="+row.crfId+"&reportId="+row.id+"&groupId="+row.groupId+"&subjectId="+row.subjectId+"&diseaseId="+row.diseaseId+"&patientName="+escape(row.patientName)+"&patientId="+row.patientId+"&identify="+this.identify||null+"&from="+'caseManage'+"&diseaseName="+row.diseaseName+"&subjectName="+escape(row.subjectName)|| null+"&groupName="+escape(row.groupName)+"&title="+escape(row.reportName)+"&isModify=displayShow";
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
                }
            } catch (err) {
                console.log(err)
            }
        },
        //表格内容展开
        handleClick(row) {
            this.$refs.refTable.toggleRowExpansion(row)
        }
    }
};
</script>

<style lang="less">
    .researchReportManage {
        .el-table__expanded-cell {
            background-color: #F9F9FB;
            &:hover {
                background-color: #F9F9FB !important;
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
                &:hover p {
                    color: #333;
                }
                p {
                    display: inline-block;
                    margin-left: 8px;
                    font-size: 13px;
                    color: #999;
                    span {
                        padding-right: 10px;
                    }
                }
            }
        }
        .bigContain {
            box-shadow:0px 5px 10px rgba(78,91,105,0.2);
        }
    }
</style>


