<template>
    <div class="cloud-component dataMonitoring">
        <div class="box">
            <div class="aside">
                <div class="aside_top flex-center-center">
                    <el-select v-model="crfId" placeholder="请选择">
                        <el-option v-for="(item, index) in crfList" :key="index" :label="item.crfDisplayName" :value="item.crfId"></el-option>
                    </el-select>
                </div>
                <p class="lable">审核状态</p>
                <ul v-loading="groupLoading">
                    <li v-for="(item, index) in reportStatusList" :key="index" :class="form.status==item.status?'active':''" @click="selectReportStatus(item)">
                        <i class="icon iconfont" :class="item.icon" ></i>
                        <span>{{item.name}} - {{item.count}}</span>
                    </li>
                </ul>
            </div>
            <div class="content">
                <!-- 搜索区域 -->
                <div class="cloud-search el-form-item-small flex-end-center">
                    <!-- <el-input
                        placeholder="搜索"
                        prefix-icon="el-input__icon el-icon-search"
                        v-model="form.keyword"
                        clearable
                        @keyup.enter.native="getDataList()"
                        style="width:280px;">
                    </el-input> -->
                </div>
                <!--搜索结果-->
                <div class="cloud-search-list">
                    <echarts-contain containType="big" :parentHeight="routerViewHeight*1-15" :heightRatio="1">
                        <el-table
                            :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-70):(routerViewHeight*1)"
                            :data="dataList.content" v-loading="loading" ref="refTable"
                            :empty-text="emptyText" :element-loading-text="elementLoadingText" fit
                            @row-click="handleClick" @expand-change="expandChange">
                            <el-table-column type="expand" width="40"> 
                                <template slot-scope="scope"> 
                                    <el-timeline>
                                        <el-timeline-item
                                            v-for="(item, index) in scope.row.recordData"
                                            :key="index"
                                            :hide-timestamp="true"
                                            :class="'status_'+item.actionType">
                                            <div class="expand_content">
                                                <i class="icon iconfont" :class="matchingIcon(item.actionType)"></i>
                                                <p>
                                                    <span>{{item.createTime}}</span>
                                                    <span>{{item.creatorName}}</span>
                                                    <span>{{matchingStatus(item.actionType)}}</span>
                                                </p>
                                                <el-popover
                                                    v-if="(item.dataChangeList.length || item.notationList.length)"
                                                    placement="right"
                                                    width="350"
                                                    popper-class="expand_popover"
                                                    trigger="hover">
                                                    <div class="content" >
                                                        <!-- 修改记录 -->
                                                        <p v-for="(li,index) in item.dataChangeList" :key="index">
                                                            {{li.path}}:&nbsp;&nbsp;&nbsp;"{{li.oldData}}"&nbsp;修改为&nbsp;"{{li.newData }}"
                                                        </p>
                                                        <!-- 批注记录 -->
                                                        <p v-for="(li,index) in item.notationList" :key="index">
                                                            {{li.path}}:&nbsp;&nbsp;&nbsp;批注&nbsp;"{{li.content}}"
                                                        </p>
                                                    </div>
                                                    <i slot="reference" class="cur_pointer icon iconfont iconzu14"></i>
                                                </el-popover>
                                            </div>
                                        </el-timeline-item>
                                        <el-timeline-item v-if="scope.row.recordDataEmpty"><div style="color:#999;font-size;13px;">暂无记录</div></el-timeline-item>
                                    </el-timeline>
                                </template>
                            </el-table-column>
                            <el-table-column prop="visitDate" label="就诊时间" min-width="100"></el-table-column>
                            <el-table-column prop="reportName" label="报告名称" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="patientName" label="病人姓名"></el-table-column>
                            <el-table-column prop="genderName" label="性别"></el-table-column>
                            <el-table-column prop="author" label="创建人" v-if="form.status==0"></el-table-column>
                            <el-table-column prop="inputer" label="填写人" v-else-if="form.status==1"></el-table-column>
                            <el-table-column prop="submitter" label="提交人" v-else></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" width="180" v-if="form.status==0"></el-table-column>
                            <el-table-column prop="inputTime" label="填写时间" width="180" v-else-if="form.status==1"></el-table-column>
                            <el-table-column prop="submitTime" label="提交时间" width="180" v-else></el-table-column>
                            <el-table-column label="状态" width="120px" v-if="form.status == -1">
                                <template slot-scope="scope">
                                    {{matchingReportStatus(scope.row.status)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="auditor" label="审核人" v-if="[3,4,-1].includes(form.status)"></el-table-column>
                            <el-table-column prop="auditTime" label="审核时间" width="180" v-if="[3,4,-1].includes(form.status)"></el-table-column>
                            <el-table-column label="操作" width="90">
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
            crfList: [],
            crfId: '',
            form: {
                keyword: '',
                status: 2
            },
            reportStatusList: [
                {icon:'iconxinxitishi', name: '待审核', count:0, value: 'submitCount',status: 2},
                {icon:'iconbianjibeifen2', name: '不通过', count:0, value: 'noPassCount',status: 3},
                {icon:'iconbianjibeifen1', name: '已通过', count:0, value: 'passCount',status: 4},
                {icon:'iconquanbu', name: '全 部', count:0, value: 'total',status: -1}
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
            elementLoadingText: '' ,
        };
    },
    watch: {
        crfId: function(newVal) {
            this.getReportStatusList().then(()=>{
                this.getDataList()
            })
        },
        diseaseId: function(newVal) {
            this.getReportStatusList().then(()=>{
                this.getDataList()
            })
        },
        orgCode: function(newVal) {
            this.getReportStatusList().then(()=>{
                this.getDataList()
            })
        },
        doctor: function(newVal) {
            this.getReportStatusList().then(()=>{
                this.getDataList()
            })
        }
    },
    computed: {
        diseaseId: function() {
            return this.$store.state.user.diseaseInfo.diseaseId;
        },
        orgCode: function() {
            return this.$store.state.user.diseaseInfo.orgCode;
        },
        doctor: function() {
            return this.$store.state.user.diseaseInfo.doctor;
        }
    },
    created () {
        this.loading = true;
        Promise.all([this.getCrfList(),this.getReportStatusList()]).then(()=>{
            this.getDataList()
            .then(()=>{
                this.$emit('changeLoadding',false)
            })
        })
        
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    destroyed() {
        document.removeEventListener(this.visibilityChange,this.visibilityChangeHandle)
    },
    components: {
        pagination,
        echartsContain,
        diseaseSubjectgroup
    },
    methods: {
        visibilityChangeHandle() {
            if (!document[this.hidden]) {
                this.getReportStatusList().then(()=>{
                    this.getDataList()
                })
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
        selectReportStatus(row) {
            this.form.status = row.status;
            this.getDataList();
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
            that.loading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let formData = {
                offset: pageNo,
                limit: pageSize,
                args: {
                    "crfId": this.crfId,
                    "diseaseId": this.$store.state.user.diseaseInfo.diseaseId,
                    "userId": this.$store.state.user.diseaseInfo.doctor,
                    "orgCode": this.$store.state.user.diseaseInfo.orgCode,
                    "status": this.form.status == -1? [2,3,4]: [this.form.status]
                }
            };
            try {
                let res = await that.$http.RRMgetReportDataList(formData);
                if (res.code == '0') {
                    let obj = {};
                    obj.content = res.data.args;
                    obj.content.forEach(li=>{
                        li.recordData = null;
                        li.recordDataEmpty = false;
                    })
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
                    from: "dataMonitoring",
                    reportStatus: row.status,
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
        //获取CRF表单
        async getCrfList() {
            let formData = {
                diseaseId: this.$route.query.id
            }
            try {
                let res = await this.$http.RRMgetCrfList(formData);
                if (res.code == 0) {
                    this.crfList = res.data;
                    this.crfList.unshift({
                        crfDisplayName: '全部报告',
                        crfId: ''
                    })
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取报告状态列表
        async getReportStatusList() {
            let formData = {
                "crfId": this.crfId,
                "diseaseId": this.$route.query.id,
                "userId": this.$store.state.user.diseaseInfo.doctor,
                "orgCode": this.$store.state.user.diseaseInfo.orgCode,
                "status": [2,3,4]
            }
            try {
                let res = await this.$http.RRMgetReportStatusList(formData);
                if (res.code == 0) {
                    this.reportStatusList.forEach(li=>{
                        if(typeof(res.data[li.value]) == 'number') {
                            li.count = res.data[li.value];
                        }
                    })
                }
            } catch (err) {
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
        //表格内容点击
        handleClick(row, column, cell) {
            if(column.label=='操作') {
                return;
            }
            this.$refs.refTable.toggleRowExpansion(row)
        },
        //表格内容展开
        expandChange(row,expanded ) {
            if(expanded.length) {
                this.getReportRecord(row)
            }
        },
        //获取批注信息
        async getReportRecord(row) {
            let index = this.dataList.content.findIndex(li=>{
                return row.id == li.id;
            })
            let formData = {
                id: row.id
            }
            try {
                let res = await this.$http.RRMgetReportRecord(formData);
                if (res.code == 0) {
                    res.data.forEach(li=>{
                        li.dataChangeList = li.dataChangeList?li.dataChangeList:[];
                        li.notationList = li.notationList?li.notationList:[];
                    })
                    row.recordData = res.data;
                }
                row.recordDataEmpty = row.recordData.length?false:true;
            } catch (err) {
                console.log(err)
            }
        },
        //匹配iconfont
        matchingIcon(type) {
            switch (type) {
                case 0: return 'iconzujian52';
                case 1: return 'iconyibaocun';
                case 2: return 'iconzujian48';
                case 3: return 'iconzujian49';
                case 4: return 'iconzujian50';
                case 5: return 'iconzujian51';
                default: break;
            }
        },
        //匹配操作状态
        matchingStatus(type) {
            switch (type) {
                case 0: return '创建报告';
                case 1: return '保存报告';
                case 2: return '提交报告';
                case 3: return '审核不通过';
                case 4: return '审核通过';
                case 5: return '召回报告';
                default: break;
            }
        },
        //匹配报告状态
        matchingReportStatus(type) {
            switch (type) {
                case 0: return '未填写';
                case 1: return '已填写';
                case 2: return '待审核';
                case 3: return '不通过';
                case 4: return '已通过';
                case 5: return '已召回';
                default: break;
            }
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
    .dataMonitoring {
        .el-table {
            padding: 0 !important;
        }
        .el-table {
            padding: 0 !important;
            .cell {
                height: 24px;
            }
        }
        .el-table__expanded-cell {
            background-color: #F7FAFD;
            &:hover {
                background-color: #F7FAFD !important;
            }
            .el-timeline-item__timestamp {
                display: none;
            }
            .el-timeline .el-timeline-item {
                .icon.el-popover__reference,
                .icon.el-popover__reference:hover{
                    color: #232325 !important; 
                }
                .el-timeline-item__node {
                    transform: translateX(-5%);
                }
                &.status_0 {
                    .el-timeline-item__node {
                        border-color: #F79E00;
                    }
                    .el-timeline-item__content .icon {
                        color: #F79E00;
                    }
                }
                &.status_1 {
                    .el-timeline-item__node {
                        border-color: #0077B4;
                    }
                    .el-timeline-item__content .icon {
                        color: #0077B4;
                    }
                }
                &.status_2 {
                    .el-timeline-item__node {
                        border-color: #8AC75B;
                    }
                    .el-timeline-item__content .icon {
                        color: #8AC75B;
                    }
                }
                &.status_3 {
                    .el-timeline-item__node {
                        border-color: #DF4931;
                    }
                    .el-timeline-item__content .icon {
                        color: #DF4931;
                    }
                }
                &.status_4 {
                    .el-timeline-item__node {
                        border-color: #00BE90;
                    }
                    .el-timeline-item__content .icon {
                        color: #00BE90;
                    }
                }
                &.status_5 {
                    .el-timeline-item__node {
                        border-color: #232325;
                    }
                    .el-timeline-item__content .icon {
                        color: #232325;
                    }
                }
            }
            .el-timeline-item__node {
                background-color: #fff;
                border:1px solid #ccc;
                width: 8px;
                height: 8px;
                top: 5px;
            }
            .el-timeline-item__tail {
                border-left: 1px solid #ccc;
                left: 2px;
            }
            .el-timeline-item__wrapper {
                padding-left: 18px;
                top: 0;
            }
            .el-timeline-item:last-child {
                padding-bottom: 0;
            }
            .el-timeline-item__content {
                color: #999;
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
                    height: 65px;
                    border-bottom: 1px solid rgba(229,235,236,1);
                }
                .lable {
                    padding: 13px 18px;
                    font-size: 15px;
                    font-weight: bold;
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
                        span {
                            font-weight: bold;
                        }
                    }
                    &:hover {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                        span {
                            font-weight: bold;
                        }
                    }
                    &:nth-child(1) .icon{
                        color: #c6c5c3;
                    }
                    &:nth-child(2) .icon{
                        color: #F79E00;
                    }
                    &:nth-child(3) .icon{
                        color: #00bf8f;
                    }
                    &:nth-child(4) .icon{
                        color: #00B8DF;
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
                padding:15px 15px 0;
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
    .expand_popover {
        background-color: rgba(0,0,0,.6);
        padding: 8px 10px;
        padding: 8px 10px;
        min-width: 350px !important;
        width: auto !important;
        max-width: 450px !important;
        .content {
            max-height: 500px;
            overflow: auto;
            /*scrollbar滚动轴修改*/
            &::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(155, 155, 155, 0.3);
                border-radius: 10px;
                background-color: rgba(245, 245, 245, 0.151);
            }

            &::-webkit-scrollbar {
                background-color: rgba(245, 245, 245, 0.13);
            }

            &::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, .8);
            }
            p {
                color: #fff;
                font-size: 13px;
                &:hover {
                    color: #fff;
                }
            }
        } 
        .popper__arrow{
            border-right-color: rgba(0,0,0,.6) !important;
            &::after {
                border-right-color: rgba(10,10,10,0) !important;
            }
        }
    }
</style>


