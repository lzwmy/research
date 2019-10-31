<template>
    <div class="cloud-component patientFollowUp">
        <div class="component_head flex-between-center">
        <p>{{$route.meta.txt}}</p>
        <div class=" cur_pointer head_content flex-start-center">
            <el-button type="primary" @click="showDialog('添加计划')" icon="el-icon-plus">添加计划</el-button>
        </div>
    </div>
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small">
            <el-form :inline="true" :model="form">
                <el-form-item label="时间范围：">
                    <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="form.state">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="未填写" value="1"></el-option>
                        <el-option label="已填写" value="2"></el-option>
                    </el-select>
                </el-form-item>
                    
                <el-form-item>
                    <el-button type="primary" @click="" icon="el-icon-search">查 询</el-button>
                    <el-button @click="reset" icon="el-icon-refresh-left">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table
                :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)"
                :data="dataList.content" style="width: 100%" v-loading="loading"
                :empty-text="emptyText" :element-loading-text="elementLoadingText" fit>
                <el-table-column type="index" label="序号" width="90px"></el-table-column>
                <el-table-column prop="a" label="事件名称"></el-table-column>
                <el-table-column prop="b" label="关联表单"></el-table-column>
                <el-table-column prop="c" label="定时类型"></el-table-column>
                <el-table-column prop="d" label="定时内容"></el-table-column>
                <el-table-column prop="e" label="定时范围"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.f" active-color="#13ce66" inactive-color="#ccc" style="height: 22px;"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="g" label="创建人"></el-table-column>
                <el-table-column prop="h" label="创建时间" width="160"></el-table-column>
                <el-table-column label="操作" width="90px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showDialog('编辑计划',scope.row)"><i class="iconfont iconbianji"></i></el-button>
                    </template>
                </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination :data="dataList" @change="getDataList"></pagination>
            </echarts-contain>
        </div>

        <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.visible" 
            :append-to-body="true"
            class="patientFollowUp"
            width="650px">
            <el-form 
                :model="dialogFrom" 
                ref="dialogFrom" 
                :rules="dialogRules" 
                label-width="100px" 
                @submit.native.prevent 
                v-loading="dialog.loading" 
                label-position="left">
                <el-form-item label="事件类型:" class="fill">
                    <el-radio v-model="dialogFrom.eventType" label="1">诊疗事件</el-radio>
                    <el-radio v-model="dialogFrom.eventType" label="2">新培报告事件</el-radio>
                </el-form-item>
                <el-form-item label="诊疗事件:" class="fill">
                    <el-select v-model="dialogFrom.diagnosisEvent">
                        <el-option label="就诊" value="0"></el-option>
                        <el-option label="入院" value="1"></el-option>
                        <el-option label="出院" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="延后天数:" class="inline">
                    <el-input type="number" min="1" max="10000" v-model="dialogFrom.delayDay"></el-input>
                </el-form-item>
                <el-form-item label="新增报告事件:" class="fill">
                    <el-select v-model="dialogFrom.addReportEvent">
                        <el-option label="白癜风报告" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联报告:" class="fill">
                    <el-select v-model="dialogFrom.relationReport">
                        <el-option label="白癜风报告" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定时类型:">
                    <el-select v-model="dialogFrom.timingType" @change="selectChange">
                        <el-option label="无" value="0"></el-option>
                        <el-option label="按天" value="1"></el-option>
                        <el-option label="按周" value="2"></el-option>
                        <el-option label="按月" value="3"></el-option>
                        <el-option label="按年" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <div class="timingType" style="margin-left: 90px;">
                    <el-form-item label="提醒日期:" label-width="80px" class="block" v-if="dialogFrom.timingType==0">
                        <el-date-picker
                            v-model="dialogFrom.modelData.value1"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="0px" class="block select" v-if="dialogFrom.timingType==1">
                        每<el-input class="width_auto" v-model="dialogFrom.modelData.value1" type="number" min='1'></el-input>天
                    </el-form-item>
                    <el-form-item label-width="0px" class="block select" v-if="dialogFrom.timingType==2">
                        每<el-input v-model="dialogFrom.modelData.value1" type="number"  min='1'></el-input>周
                        <div class="block week">
                            <el-radio v-model="dialogFrom.modelData.value2" label="1">周一</el-radio>
                            <el-radio v-model="dialogFrom.modelData.value2" label="2">周二</el-radio>
                            <el-radio v-model="dialogFrom.modelData.value2" label="3">周三</el-radio>
                            <el-radio v-model="dialogFrom.modelData.value2" label="4">周四</el-radio>
                            <el-radio v-model="dialogFrom.modelData.value2" label="5">周五</el-radio>
                            <el-radio v-model="dialogFrom.modelData.value2" label="6">周六</el-radio>
                            <el-radio v-model="dialogFrom.modelData.value2" label="7">周日</el-radio>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="0px" class="block select" v-if="dialogFrom.timingType==3">
                        每<el-input v-model="dialogFrom.modelData.value1" type="number"  min='1'></el-input>个月的
                        <el-select v-model="dialogFrom.modelData.value2">
                            <el-option v-for="(item, index) in 31" :label="item" :value="index+1"></el-option>
                        </el-select>号
                    </el-form-item>
                    <el-form-item label-width="0px" class="block select" v-if="dialogFrom.timingType==4">
                        每年
                        <el-select v-model="dialogFrom.modelData.value1">
                            <el-option v-for="(item, index) in 12" :label="item" :value="index+1"></el-option>
                        </el-select>月
                        <el-select v-model="dialogFrom.modelData.value2">
                            <el-option v-for="(item, index) in selectDayArr" :label="item" :value="index+1"></el-option>
                        </el-select>日
                    </el-form-item>
                </div>
                <el-form-item label="持续时间:" class="block">
                    <el-input class="width_auto" type="number" min="1" max="10000" v-model="dialogFrom.time"></el-input>
                    <el-select v-model="dialogFrom.timeUnit">
                        <el-option label="天" value="1"></el-option>
                        <el-option label="周" value="2"></el-option>
                        <el-option label="月" value="3"></el-option>
                        <el-option label="年" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave('dialogFrom')" size="mini" :disabled="dialogFrom.loading">保 存</el-button>
                <el-button @click="dialog.visible = false;" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';

export default {
    name: 'eventPlan',
    mixins: [mixins],
    data () {
        return {
            form: {
                time:"",
                state:"全部"
            },
            dataList: {
                content: [
                    {
                        a:"入院",
                        b:"白癜风随访",
                        c:"指定日期",
                        d:"无",
                        e:"无",
                        f:true,
                        g:"张院士",
                        h:"2019-7-15 17:38:02",
                    },
                    {
                        a:"就诊",
                        b:"白癜风随访",
                        c:"按周",
                        d:"每1周：周一、周二",
                        e:"2019-7-15至2019-7-25",
                        f:true,
                        g:"张护士",
                        h:"2019-7-15 17:38:02",
                    }
                ]
            },
            dialog: {
                visible: false,
                title: ""
            },
            dialogFrom: {
                eventType: "",
                diagnosisEvent:"0",
                delayDay:"",
                addReportEvent: "0",
                relationReport: "0",
                timingType: '0',
                modelData: {
                    value1:'',
                    value2:''
                },
                time:'',
                timeUnit:'1'
            },
            selectDayArr: 31,
            monthBig:[1,3,5,7,8,10,12],
            loading: false,
            pageNo: '',
            pageSize: '',
            currentPageNo: '',
            currentPageSize: '',
            emptyText: '',
            elementLoadingText: '',
            dialogRules: {} 
        };
    },
    watch: {
        'dialogFrom.modelData.value1': function(newVal) {
            if(this.dialogFrom.timingType == 4){
                if(this.dialogFrom.modelData.value1 == 2) {
                    this.selectDayArr = 29;
                }else if( this.monthBig.includes(this.dialogFrom.modelData.value1) ) {
                    this.selectDayArr = 31;
                }else {
                    this.selectDayArr = 30;
                }
            }
        }
    },
    components: {
        pagination,
        echartsContain
    },
    methods: {
        initPage () {
            this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
            this.pageNo = pageNo;
            this.pageSize = pageSize;
            this.emptyText = emptyText;
            this.elementLoadingText = elementLoadingText;
            //     this.getDataList();
        },
        async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
            let that = this;
            that.currentPageNo = pageNo;
            that.currentPageSize = pageSize;
            that.loading = true;
            that.dataList.content = [];
            let formData = {
                offset: pageNo - 1,
                limit: pageSize,
                categoryName: that.ruleForm.name,
                id: that.ruleForm.code,
            };
            try {
                let data = await that.$http.PFUGetDataList(formData);
                that.loading = false;
                if (data.code == '0') {
                let obj = {};
                obj.content = data.data.termCategoryList;
                obj.pageNo = pageNo;
                obj.pageSize = pageSize;
                obj.totalCount = parseInt(data.data.pageRsp.totalElements);
                obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
                that.dataList = obj;
                }else {
                    that.loading = false;
                    this.$mes('error','获取医学分类列表失败');
                }
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
        reset () {
            this.form = {
                time:"",
                type:""
            }
        },
        selectChange() {

        },
        onSave(dialogFrom) {
            this.dialog.visible = false;
        },
        showDialog(title, row) {
            this.dialog.title = title;
            this.dialog.visible = true;
            // this.dialogFrom = {
            //     remindDateName:"",
            //     relevantReports:"",
            //     model: '0',
            //     range:''
            // }
        },
        selectChange() {
            this.dialogFrom.modelData = {
                value1:'',
                value2:''
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        alert(11)
        next();
    },
    beforeRouteLeave (to, from, next) {
        next();
    }
};
</script>

<style lang="less">
    .patientFollowUp {
        .timingType {
            .el-input {
                margin: 0 10px;
            }
            .select {
                .el-input {
                    width: 100px !important;
                }
            }
            .el-date-editor.el-input　{
                width: 170px !important;
            }
            .week {
                .el-radio{
                    margin: 5px 4px 10px 0px !important;
                }
                .el-radio__label{
                    font-size: 12px;
                    padding:0 5px;
                }
            }
        }
        .width_auto {
            width: auto;
        }
        .el-radio__label {
            font-size: 12px !important;
        }
    }
</style>




