<template>
    <div class="cloud-component caseManageExport">
        <el-button type="primary" @click="showDialog">添加报告</el-button>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <el-table :data="dataList.content" v-loading="loading" fit stripe :cell-style="cellStyle" @cell-dblclick="onToReportFill">
                <el-table-column label="就诊时间" width="180px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.remindId && !scope.row.status" class="el-icon-time" style="position:static; padding-right: 0px; font-size: 16px; color:#409eff;"></span>
                        <span v-else style="position:static;padding-right: 25px;"></span>
                        <span style="vertical-align: middle;">{{scope.row.visitDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reportName" label="报告名称"></el-table-column>
                <el-table-column prop="reportType" label="类型">
                    <template slot-scope="scope">
                        {{scope.row.reportType==1?'普通':'随访'}}
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="创建医生"></el-table-column>
                <el-table-column prop="diseaseName" label="病种"></el-table-column>
                <el-table-column prop="groupName" label="课题组"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180px"></el-table-column>
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        {{scope.row.status?'已填写':'未填写'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="onDelete(scope.row)"><i class="iconfont iconshanchu del"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination :data="dataList" @change="getDataList"></pagination>
        </div>
        <el-dialog 
            title="添加报告" 
            :visible.sync="dialog.visible" 
            width="450px"
            @close="onClose('dialogFrom')">
            <el-form 
                :model="dialogFrom" 
                ref="dialogFrom" 
                :rules="dialogRules" 
                label-width="90px" 
                @submit.native.prevent 
                v-loading="dialog.loading" 
                label-position="left">
                <el-form-item label="报告类型：" class="fill">
                    <el-radio v-model="dialogFrom.type" label="1">普通</el-radio>
                    <el-radio v-model="dialogFrom.type" label="2">随访</el-radio>
                </el-form-item>
                <el-form-item label="报告名称：" class="fill" prop="name">
                    <el-select v-model="dialogFrom.name">
                        <el-option v-for="(item, index) in selectList" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="就诊时间：" class="fill" prop="time">
                    <el-date-picker
                        v-model="dialogFrom.time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave('dialogFrom')" size="mini" :disabled="dialogFrom.loading">保 存</el-button>
                <el-button @click="onClose('dialogFrom')" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';

export default {
    name: 'patientFollowUp',
    props: ['dataInfo','reportFillData'],
    data () {
        return {
            dialog: {
                visible: false
            },
            dialogFrom: {
                type: "1",
                time: "",
                name: "",
            },
            dataList: {
                content:[]
            },
            selectList: [],
            loading: false,
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            },
            dialogRules: {
                name: [
                    { required: true, message: '请选择报告名称', trigger: 'change' }
                ],
                time: [
                    { required: true, message: '请选择就诊时间', trigger: 'change' }
                ],
            }
        };
    },
    watch: {
        'dialogFrom.type': function(newVal) {
            this.dialogFrom.name = "";
            this.getSelectList();
        }
    },
    computed: {},
    created () {
        this.getDataList();
        this.getSelectList();  
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    destoryed() {
        document.removeEventListener(this.visibilityChange,this.visibilityChangeHandle)
    },
    components: {
        pagination
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
            let that = this;
            that.loading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let formData = {
                offset: pageNo,
                limit: pageSize,
                args: this.dataInfo
            };
            try {
                let res = await that.$http.PFUGetReportDataList(formData);
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
        onDelete(row) {
            this.$confirm('确认删除该报告？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let formData = {
                    id: row.id
                }
                try {
                    let res = await this.$http.PFUdeleteReport(formData);
                    if (res.code == 0) {
                        this.$mes('success', "删除报告成功!");
                    }
                    this.getDataList();
                } catch (err) {
                    console.log(err)
                }
            })
        },
        onToReportFill(row) {
            let data = Object.assign({}, this.reportFillData, {
                diseaseName: this.dataInfo.diseaseName,
                subjectName: this.dataInfo.subjectName,
                groupName: this.dataInfo.groupName,
                formId: row.crfId || '',
                reportId: row.id || '',
                from: "caseManage",
                title: row.reportName,
                isModify:"displayShow"
            })
            localStorage.setItem('reportFill',JSON.stringify({urlParameter: data}));
            window.open('./patientForm.html');
        },
        showDialog() {
            this.dialog.visible = true;
            this.dialogFrom = {
                type: "1",
                time:"",
                name:""
            }
            this.dialogFrom.time = utils.formateDate(new Date().getTime());
        },
        async getSelectList() {
            let formData = {
                crfType: Number(this.dialogFrom.type),
                diseaseId: this.dataInfo.diseaseId
            }
            try {
                let res = await this.$http.PFUGetList(formData);
                if (res.code == 0) {
                    this.selectList = res.data;
                }
            } catch (err) {
                console.log(err)
            }
        },
        onSave(dialogFrom) {
            this.$refs[dialogFrom].validate(async (valid) => {
                if (valid) {
                    let reportName;
                    this.selectList.forEach( item =>{
                        if(item.id == this.dialogFrom.name) {
                            reportName =  item.name;
                        }
                    })
                    let formData = {
                        crfId: this.dialogFrom.name,
                        reportName: reportName,
                        reportType: this.dialogFrom.type,
                        visitDate: this.dialogFrom.time,
                        groupId: this.dataInfo.groupId,
                        patientId: this.dataInfo.patientId,
                        diseaseId: this.dataInfo.diseaseId,
                        subjectId: this.dataInfo.subjectId,
                        diseaseName: this.dataInfo.diseaseName,
                        subjectName: this.dataInfo.subjectName,
                        groupName: this.dataInfo.groupName
                    }
                    let res = await this.$http.PFUaddReport(formData);
                    try {
                        if (res.code == 0) {
                            this.$mes('success', "添加报告成功!");
                            this.dialog.visible = false;
                            this.getDataList();
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    return false;
                }
            });
        },
        onClose(dialogFrom) {
            this.dialog.visible = false; 
            this.$refs[dialogFrom].resetFields();
        },
        cellStyle({row,columnIndex}){
            if(columnIndex == 8 && row.status== 0) {
                return 'color: #f0433c;'
            }
        }
    }
};
</script>

<style lang="less">
    .caseManageExport .el-table__header-wrapper .has-gutter tr th:first-child {
        .cell {
            padding-left: 42px !important;
        }
    }
</style>

