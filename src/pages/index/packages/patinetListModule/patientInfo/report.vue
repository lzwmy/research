<template>
    <div class="report" v-loading='loading'>
        <el-table
            :data="dataList.content" v-loading="loading" ref="refTable"
            @row-dblclick='toReportFill'
            @row-click="handleClick">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-timeline>
                        <el-timeline-item
                            v-for="(item, index) in 5"
                            :key="index"
                            :hide-timestamp="true">
                            <div class="content">
                                <i class="el-icon-edit"></i>
                                <p><span>2019-8-20 16:10:20</span><span>张医生填写报告</span></p>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="60px"></el-table-column>
            <el-table-column prop="visitDate" label="就诊时间" width="110"></el-table-column>
            <el-table-column prop="reportName" label="报告名称"></el-table-column>
            <el-table-column prop="patientName" label="姓名"></el-table-column>
            <el-table-column prop="genderName" label="性别"></el-table-column>
            <el-table-column prop="author" label="创建者"></el-table-column>
            <el-table-column prop="updator" label="更新者"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            <el-table-column prop="diseaseName" label="病种"></el-table-column>
            <el-table-column prop="groupName" label="课题组"></el-table-column>
            <el-table-column label="报告状态" width="120px">
                <template slot-scope="scope">
                    {{scope.row.status==0?'未填写':'已填写'}}
                </template>
            </el-table-column> 
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
    </div>
</template>

<script>
import pagination from 'components/packages/pagination/pagination';
export default {
    name: 'report',
    props: ['reportFillData'],
    data () {
        return {
            dataList: {
                content: []
            },
            identify:"",
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            },
            loading: false
        };
    },
    watch: {
        
    },
    computed: {},
    created () {
        this.getIdentify(this.reportFillData.patientId);
        this.getDataList();
    },
    mounted () {

    },
    components: {
        pagination
    },
    methods: {
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
                    diseaseId: this.reportFillData.diseaseId || '',
                    subjectId: this.reportFillData.subjectId || '',
                    groupId: this.reportFillData.groupId || '',
                    crfId: '',
                    patientName: this.reportFillData.patientName || '',
                    startTime: null,
                    endTime: null,
                    status: ""
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
                sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
                window.open('./patientForm.html');
            })
        },
        //表格内容展开
        handleClick(row) {
            this.$refs.refTable.toggleRowExpansion(row)
        }
    },
};
</script>

<style lang="less">
    .report {
        .el-table {
            position: absolute;
            bottom: 50px;
            top: 0;
            left: 0;
            right:0;
        }
        .cloud-pagination　{
            position: absolute;
            bottom: 0;
            left: 0;
            right:0;
        }
    }
</style>

