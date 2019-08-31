<template>
    <div class="cloud-component patientFollowUp">
        <el-button type="primary" @click="showDialog('添加提醒')">添加提醒</el-button>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <el-table :data="dataList.content" v-loading="loading" fit stripe @cell-dblclick="onToReportFill">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="remindName" label="提醒名称"></el-table-column>
                <el-table-column prop="crfName" label="关联报告"></el-table-column>
                <el-table-column prop="timing" label="定时模式"></el-table-column>
                <el-table-column prop="timingDesc" label="定时内容"></el-table-column>
                <el-table-column label="提醒范围" width="210">
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime}} <span v-show="scope.row.endTime">至</span> {{scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="diseaseName" label="病种"></el-table-column>
                <el-table-column prop="groupName" label="课题组"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ccc" @change="onChangeState(scope.row)"></el-switch>
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
            :title="dialog.title" 
            :visible.sync="dialog.visible" 
            :close-on-click-modal="false"
            width="700px"
            @close="onClose('dialogFrom')">
            <el-form 
                :model="dialogFrom" 
                ref="dialogFrom" 
                :rules="dialogRules" 
                label-width="80px" 
                @submit.native.prevent 
                v-loading="dialog.loading" 
                label-position="left">
                <el-form-item label="提醒名称:" class="inline" prop="remindDateName">
                    <el-input v-model="dialogFrom.remindDateName" maxLength="15"></el-input>
                </el-form-item>
                <el-form-item label="关联报告:" class="inline" prop="relevantReports">
                    <el-select v-model="dialogFrom.relevantReports">
                        <el-option v-for="(item, index) in selectList" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <div class="line">
                    <el-form-item label="定时模式:" label-width="64px" class="inline top">
                        <el-select v-model="dialogFrom.model" @change="selectChange">
                            <el-option v-for="(item, index) in modelTpye" :label="item.label" :value="item.value" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="dialogFrom.model=='TIME'">
                        <el-form-item label="提醒日期:" class="block" prop="appointData">
                            <el-date-picker
                                v-model="dialogFrom.appointData"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div v-else-if="dialogFrom.model=='DATA'">
                        <el-form-item label-width="40px" class="block" prop="value1">
                            每<el-input v-model="dialogFrom.value1" type="number" min='1'></el-input>天
                        </el-form-item>
                    </div>
                    <div v-else-if="dialogFrom.model=='WEEK'" >
                        <el-form-item label-width="20px" class="inline" prop="value1">
                            每<el-input v-model="dialogFrom.value1" type="number"  min='1'></el-input>周
                        </el-form-item>
                        <el-form-item label-width="10px" class="inline week" prop="value2">
                            <el-radio v-model="dialogFrom.value2" label="1">周一</el-radio>
                            <el-radio v-model="dialogFrom.value2" label="2">周二</el-radio>
                            <el-radio v-model="dialogFrom.value2" label="3">周三</el-radio>
                            <el-radio v-model="dialogFrom.value2" label="4">周四</el-radio>
                            <el-radio v-model="dialogFrom.value2" label="5">周五</el-radio>
                            <el-radio v-model="dialogFrom.value2" label="6">周六</el-radio>
                            <el-radio v-model="dialogFrom.value2" label="7">周日</el-radio>
                        </el-form-item>
                    </div>
                    <div v-else-if="dialogFrom.model=='MONTH'">
                        <el-form-item label-width="20px" class="inline" prop="value1">
                            每<el-input v-model="dialogFrom.value1" type="number"  min='1'></el-input>个月的
                        </el-form-item>
                        <el-form-item label-width="0" class="inline" prop="value2">
                            <el-select v-model="dialogFrom.value2" class="select">
                                <el-option v-for="(item, index) in 31" :label="item" :value="index+1" :key="index"></el-option>
                            </el-select>号
                        </el-form-item>
                    </div>
                    <div  v-else-if="dialogFrom.model=='YEAR'">
                        <el-form-item label-width="20px" class="inline year" prop="value1">
                            每年
                            <el-select v-model="dialogFrom.value1" class="select">
                                <el-option v-for="(item, index) in 12" :label="item" :value="index+1" :key="index"></el-option>
                            </el-select>月
                        </el-form-item>
                        <el-form-item label-width="0" class="inline" prop="value2">
                            <el-select v-model="dialogFrom.value2"  class="select">
                                <el-option v-for="(item, index) in selectDayArr" :label="item" :value="index+1" :key="index"></el-option>
                            </el-select>日
                        </el-form-item>
                    </div>
                </div>
                <div class="line" v-if="dialogFrom.model!= 'TIME'">
                    <el-form-item label="提醒范围:" label-width="64px"  class="inline top">
                    </el-form-item>
                    <el-form-item label-width="20px" class="block" prop="range">
                        <el-date-picker
                            v-model="dialogFrom.range"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
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
import 'assets/css/common.less';

export default {
    name: 'patientFollowUp',
    props: ['dataInfo','reportFillData'],
    data () {
        let validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入'));
            } else {
            if (value <= 0) {
                callback(new Error('请输入正整数'));
            }
                callback();
            }
        };
        return {
            form: {
                time:"",
                state:"全部"
            },
            dialog: {
                visible: false,
                title: ""
            },
            selectList:[],
            dialogFrom: {
                remindDateName:"",
                relevantReports:"",
                model: 'TIME',
                appointData:'',
                value1:'',
                value2:'',
                range:[]
            },
            selectDayArr: 31,
            monthBig:[1,3,5,7,8,10,12],
            modelTpye: [
                {
                    label: '指定日期',
                    value: 'TIME',
                },
                {
                    label: '按天',
                    value: 'DATA',
                },
                {
                    label: '按周',
                    value: 'WEEK',
                },
                {
                    label: '按月',
                    value: 'MONTH',
                },
                {
                    label: '按年',
                    value: 'YEAR',
                }
            ],
            switchBtn: true,
            dataList: {
                content:[]
            },
            loading: false,
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            },
            dialogRules: {
                remindDateName: [
                    { required: true, message: '请输入提醒名称', trigger: ['change','blur'] }
                ],
                relevantReports: [
                    { required: true, message: '请输入关联报告', trigger: ['change','blur'] }
                ],
                appointData: [
                    { required: true, message: '请输入', trigger: ['change','blur'] }
                ],
                value1: [
                    { validator: validatePass, trigger: ['change','blur'] }
                ],
                value2: [
                    { required: true, message: '请选择', trigger: ['change','blur'] }
                ],
                range: [
                    { required: true, message: '请选择日期', trigger:  ['change','blur'] }
                ],
            }
        };
    },
    watch: {
        'dialogFrom.value1': function(newVal) {
            if(this.dialogFrom.model == 4){
                if(this.dialogFrom.value1 == 2) {
                    this.selectDayArr = 29;
                }else if( this.monthBig.includes(this.dialogFrom.value1) ) {
                    this.selectDayArr = 31;
                }else {
                    this.selectDayArr = 30;
                }
            }
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
        document.removeEventListener(this.visibilityChange)
    },
    components: {
        pagination
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
            console.log(2)
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
                let res = await that.$http.PFUGetRemindDataList(formData);
                if (res.code == '0') {
                    let obj = {};
                    obj.content = res.data.args;
                    obj.content.forEach(item=>{
                        item.status = item.status?true:false;
                        this.modelTpye.forEach( type =>{
                            if(type.value == item.timing) {
                                item.timing = type.label;
                            }
                        })
                    })
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
        onDelete(row) {
            let that = this;
            that.$confirm('确认删除该提醒？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let formData = {
                    remindId: row.id
                }
                try {
                    let res = await this.$http.PFUdeleteRemind(formData);
                    if (res.code == 0) {
                        this.$mes('success', "删除提醒成功!");
                    }else {
                        this.$mes('error', "删除提醒失败!");
                    }
                    this.getDataList();
                } catch (err) {
                    console.log(err)
                }
            })
        },
        showDialog(title, row) {
            this.dialog.title = title;
            this.dialog.visible = true;
            this.dialogFrom = {
                remindDateName:"",
                relevantReports:"",
                model: 'TIME',
                appointData:'',
                value1:'',
                value2:'',
                range:[]
            }
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
            sessionStorage.setItem('reportFill',JSON.stringify({urlParameter: data}));
            window.open('./patientForm.html');
        },
        async onChangeState(row) {
            let formData = {
                remindId: row.id,
                status: row.status?'1':'0'
            }
            try {
                let res = await this.$http.PFUchangeRemindState(formData);
                if (res.code == 0) {
                    this.$mes('success', "更改提醒状态成功!");
                }else {
                    this.$mes('error', "更改提醒状态失败!");
                    this.getDataList();
                }
            } catch (err) {
                console.log(err)
            }
        },
        onClose(dialogFrom) {
            this.dialog.visible = false; 
            this.$refs[dialogFrom].resetFields();
        },
        onSave(dialogFrom) {
            this.$refs[dialogFrom].validate(async (valid) => {
                if (valid) {
                    let range;
                    if(!this.dialogFrom.range || JSON.stringify(this.dialogFrom.range) == '[]') {
                        range = "";
                    }else {
                        range = this.dialogFrom.range;
                    }
                    let formData = {
                        remindName: this.dialogFrom.remindDateName,
                        crfId: this.dialogFrom.relevantReports,
                        timing: this.dialogFrom.model,
                        param: this.dialogFrom.value1,
                        param2: this.dialogFrom.value2,
                        patientId: this.dataInfo.patientId,
                        diseaseId: this.dataInfo.diseaseId,
                        subjectId: this.dataInfo.subjectId,
                        groupId: this.dataInfo.groupId,
                        startTime: range?range[0]:this.dialogFrom.appointData,
                        endTime: range?range[1]:"",
                        diseaseName: this.dataInfo.diseaseName,
                        subjectName: this.dataInfo.subjectName,
                        groupName: this.dataInfo.groupName
                    }
                    try {
                        let res = await this.$http.PFUAddRemind(formData);
                        if (res.code == 0) {
                            this.$mes('success', "添加提醒成功!");
                            this.dialog.visible = false;
                            this.getDataList();
                        }else {
                            this.$mes('error', "添加提醒失败!");
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    return false;
                }
            });
        },
        async getSelectList() {
            let formData = {
                diseaseId: this.dataInfo.diseaseId
            }
            try {
                let res = await this.$http.PFUGetList(formData);
                if (res.code == 0) {
                    this.selectList = res.data;
                }else {
                    this.$mes('error', "获取关联报告列表失败!");
                }
            } catch (err) {
                console.log(err)
            }
        },
        selectChange() {
            this.dialogFrom.value1 = "";
            this.dialogFrom.value2 = "";
        }
    }
};
</script>


<style lang="less">
    body .patientFollowUp .el-form {
        .cell {
            .el-switch {
                height: 22px;
            }
        }
        .el-form-item .el-input{
            width: 190px;
        }
        .line {
            border: 1px solid #bbb;
            margin: 20px 0;
            padding: 0 25px;
            border-radius: 3px;
            .select .el-input {
                width: 90px;
                margin:0 10px;
            }
            .week {
                margin-left: 10px;
                margin-right: 0;
                .el-radio__label{
                    font-size: 12px;
                    padding-left: 5px;
                }
                .el-radio {
                    margin: 0 10px 0 0;
                }
            }
            .el-form-item__error{
                padding-left: 20px;
            }
            .year .el-form-item__error{
                padding-left: 40px;
            }
            .el-form-item.top{
                transform: translate(-20px,-15px);
                background: #fff;
                padding: 0 10px;
            }
            .el-form-item.block {
                transform: translateY(-10px);
            }
            .el-form-item {
                margin-right: 0;
                .el-input{
                    width: 80px;
                    margin: 0 10px;
                }
                .el-input--suffix{
                    width: 110px;
                }
            } 
            .el-date-editor.el-input　{
                width: 170px !important;
            }
        }
    } 
</style>

