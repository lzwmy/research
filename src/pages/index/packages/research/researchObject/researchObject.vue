<template>
    <div class="cloud-component researchObject cloud_common_search">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button type="primary" icon="icon iconfont icondaochu" @click="showImportDataDialog">研究导入数据</el-button>
                <el-button type="primary" icon="icon iconfont iconxiazaimoban" @click="">入组阶段数据导出</el-button>
                <el-button type="primary" icon="icon iconfont icondaochujilu" @click="">导出记录</el-button>
                <el-dropdown trigger="hover" @command="handleAddObject">
                    <el-button type="primary" icon="icon iconfont icontianjiayanjiuduixiang">
                        添加研究对象
                        <span class="add"><i class="el-icon-caret-bottom el-icon--right"></i></span>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="addresearchObject">
                        <el-dropdown-item command="1" icon="el-icon-plus">单个添加</el-dropdown-item>
                        <el-dropdown-item command="2" icon="el-icon-plus">批量添加</el-dropdown-item>
                        <el-dropdown-item command="3" icon="icon iconfont iconxiazaimoban">下载模版</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
        </div>
        <!-- 搜索区域 -->
        <div class="cloud-search flex-between-center">
            <div class="search_group flex-start-center">
                <searchCom 
                    ref="refSearch"
                    @sendGroupList="getGroupList" 
                    @sendCrfList="getCrfList"
                    @selectGroup="handleSelectGroup">
                </searchCom>
                <el-popover trigger="click" :popper-class="'popover_search ' + $store.state.common.openMenuView" v-model="popoverSearchVisible">
                    <div slot="reference"><i class="icon iconfont iconsousuo_fuzhi"></i>搜索</div>
                    <el-form :inline="true" :model="form" label-width="110px" class="flex-start-center flex-wrap researchObject_search">
                        <el-form-item label="首次录入时间：" class="bold">
                            <el-date-picker
                                v-model="form.time"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="入组阶段状态:" class="bold">
                            <el-select v-model="form.formName">
                                <el-option label="全部表单" value="0"></el-option>
                                <el-option v-for="(item,index) in crfList" :key="index" :label="item.crfName" :value="item.crfId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-select v-model="form.formState">
                                <el-option label="全部状态" value="0"></el-option>
                                <el-option label="待录入" value="1"></el-option>
                                <el-option label="已完成" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="患者状态:">
                            <el-select v-model="form.patientState">
                                <el-option label="全部状态" value="0"></el-option>
                                <el-option label="录入中" value="1"></el-option>
                                <el-option label="已完成" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="btnGroup_search">
                        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查 询</el-button>
                        <el-button icon="el-icon-refresh" @click="onReset">重 置</el-button>
                    </div>
                </el-popover>
            </div>
            <div class="search_condition flex-start-center">
                <p v-show="multipleSelection.length != 0" style="min-width: 136px; color: #666;" class="font_14">已选中 {{multipleSelection.length}} 位研究对象</p>
                <el-button v-show="multipleSelection.length != 0" type="primary" icon="icon iconfont iconzujian12" @click="">提交CRF</el-button>
                <el-button v-show="multipleSelection.length != 0" type="danger" class="right_6" icon="icon iconfont iconzujian41" @click="">删除</el-button>

                <formItemCom 
                    ref="refFormItemCom"
                    @sendAllCrfForm="handleAllFormItem" 
                    @getDataList="getDataList(0,15)" 
                    :allCrfForm="allCrfForm" 
                    :confingData="confingData"
                    :form='form'
                    :activeCrf="activeCrf"
                    @changeActiveCrf="changeActiveCrf">
                </formItemCom>

                <el-input v-model="form.keyword" class="search_input" placeholder="先选条件,再搜索" @keyup.enter.native="getDataList()" clearable></el-input>
            </div>
        </div>


        <!--搜索结果-->
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table 
                    ref="refTable" fit
                    :data="dataList.content"
                    v-loading="tableLoading"
                    @selection-change="handleSelectionChange"
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1):(routerViewHeight*1)">
                    <el-table-column type="selection" align="center" width="40"></el-table-column>
                    <el-table-column 
                        v-for="column in dataList.header"
                        :prop="column.prop" 
                        :label="column.label" 
                        sortable 
                        :key="column.prop" 
                        align="center"
                        :min-width="column.label.length * 15 + 100"
                        v-if="column.type !='report'"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="研究内容" align="center">
                        <span v-for="li in dataList.header" :key="li.prop">
                            <el-table-column 
                                v-if="li.type=='report'"
                                :prop="li.prop" 
                                :label="li.label" 
                                :width="li.label.length * 15 + 20"
                                align="center"
                                :key="li.prop">
                                <template slot-scope="scope">
                                    <el-button @click="toReportFill(scope.row,li.prop,li.label,'add')" v-if="scope.row[li.prop] && JSON.parse(scope.row[li.prop]).status == 0" type="text" icon="icon iconfont iconbianji3"></el-button>
                                    <el-button @click="toReportFill(scope.row,li.prop,li.label,'edit')" v-if="scope.row[li.prop] && JSON.parse(scope.row[li.prop]).status == 1" type="text" icon="icon iconfont iconwancheng" style="color:#00BD91;"></el-button>
                                </template>
                            </el-table-column>
                        </span>
                    </el-table-column>
                    <el-table-column width="60" align="center">
                        <template slot="header" slot-scope="scope">
                            <el-button @click="showConfigDialog" type="text" icon="icon iconfont iconfuhao7"></el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button @click="" type="text" icon="iconfont iconshanchu del"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <!-- <pagination :data="dataList" @change="getDataList"></pagination>     -->
            </echarts-contain>
        </div>

        <!-- 导入数据弹窗 -->
        <import-dialog :dataInfo="importData"></import-dialog>
        <!-- 动态列配置弹窗 -->
        <table-config @saveConfig="handleSaveConfig" :dataInfo="confingData"></table-config>

        <!-- 添加研究对象 -->
        <dynamicForm ref="refDynamicForm" :dialog="dialogAddObject" :dataInfo="addObjectData" :groupList="groupList" @successAdd="successAdd"></dynamicForm>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import importDialog from './dialog/ImportDialog'
import tableConfig from './dialog/tableConfig'
import dynamicForm from './dialog/dynamicForm'
import searchCom from './components/search'
import formItemCom from './components/formItem'
export default {
    name: 'researchObject',
    mixins: [mixins],
    data () {
        return {
            maxItem: 10,
            groupList: [],
            crfList: [],
            allCrfForm: [],
            currentGrounpId: null,
            dataList: {
                content: []
            },
            importData: {
                title: "批量导入研究数据",
                visible: false
            },
            multipleSelection: [],
            confingData: {
                title: "设置表格固定列",
                visible: false,
                defaultChecked: ['入组序号','首次录入时间','所在中心'],
                dataList: []
            },
            //回显指标
            previewFormItem:[],
            //已选指标数组
            selectFormItem: [],
            popoverFomeItemVisible: false,
            popoverSearchVisible: false,
            form: {
                keyword: '',
                time:[],
                formName: '0',
                formState: '0',
                patientState: '0',
                radio: '0'
            },
            activeCrf: null,
            tableLoading: false,
            formItemLoading: false,
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            },
            //添加研究对象弹框
            dialogAddObject: {
                title:'',
                visible: false,
                loading: false,
                from:'researchObject'
            },
            //添加研究对象数据
            addObjectData: {
                formTitle:'基本信息',
                content: []
            }
        }
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    destoryed() {
        document.removeEventListener(this.visibilityChange)
    },
    components: {
        echartsContain,
        pagination,
        importDialog,
        tableConfig,
        dynamicForm,
        searchCom,
        formItemCom
    },
    methods: {
        //切换页面刷新操作
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
                    this.getDataList(0,15);
                }
            }, false);
        },
        //表格多选项
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //搜索表格配置选中表单
        selectCrf(id) {
            this.activeCrf = id;
        },
        onReset() {
            this.form = {
                keyword: '',
                time:[],
                formName: '0',
                formState: '0',
                patientState: '0',
                radio: '0'
            }
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
            this.popoverSearchVisible = false;
            that.tableLoading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let time = ['',''];
            if(this.form.time && this.form.time.length != 0) {
                time = this.form.time;
            }
            let formData = {
                offset: pageNo,
                limit: pageSize,
                subjectInfoId: this.$store.state.user.researchID,
                subjectGroupId: this.currentGrounpId,
                createTime: time[0],
                endTime: time[1],
                formCrfId: parseInt(this.form.formName),
                formCrfStatus: parseInt(this.form.formState),
                patientStatus: parseInt(this.form.patientState),
                searchType: parseInt(this.form.radio),
                keyword: this.form.keyword
            };
            try {
                let res = await that.$http.researchObjectTable(formData);
                if (res.code == '0') {
                    let obj = {
                        content: res.data.body,
                        header: res.data.header
                    };
                    // obj.content = res.data.args;
                    // obj.pageNo = pageNo;
                    // obj.pageSize = pageSize;
                    // obj.totalCount = parseInt(res.data.totalElements);
                    // obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
                    that.dataList = obj;
                }else {
                    that.dataList = {
                        content: [],
                        header: []
                    }
                }
                that.tableLoading = false;
            } catch (err) {
                that.tableLoading = false;
                console.log(err)
            }
        },
        showImportDataDialog() {
            this.importData.visible = true;
        },
        showConfigDialog() {
            this.confingData.visible = true;
        },
        handleSaveConfig(data) {
            this.$refs.refFormItemCom.handleFormItem();
            this.$refs.refFormItemCom.checkboxChange();
            this.confingData.visible = false;
        },
        //打开表单填写页面
        toReportFill(data,key,crfName,type) {
            let crfForm = {};
            if(key) {
                crfForm = JSON.parse(data[key]);
            }
            let urlParameter={
                cacheData: false,
                formId: crfForm.crfId || "",
                reportId: crfForm.reportId || '',
                groupId: data.groupId || "",
                subjectId: data.subjectId || "",
                diseaseId: data.diseaseId || "",
                patientName: data.createTime +' ---  '+ crfName,
                patientId: data.patientId || "",
                identify: this.identify || "",
                from: "researchObject",
                diseaseName: data.diseaseName || "",
                subjectName: data.subjectName || "",
                groupName: data.groupName || "",
                title: crfName,
                isModify:"displayShow"
            }
            sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
            window.open('./subjectForm.html');
        },
        handleAddObject(command) {
            switch (command) {
                case '1':
                    this.dialogAddObject = {
                        title: '添加研究对象',
                        from:'researchObject',
                        visible: true,
                        loading: false
                    }
                    let newArr = [];
                    this.allCrfForm.forEach(item=>{
                        item.formItemRspList.forEach(li=>{
                            if(li.checked){
                                let obj = {
                                    value: JSON.parse(li.jsonData).controlType=='CHECKBOX'?[]:'',
                                    controlName: li.formItemName,
                                    path: li.controlName,
                                    crfId: item.crfId,
                                    jsonData: JSON.parse(li.jsonData)
                                }
                                newArr = newArr.concat(obj)
                            }
                        })
                    })
                    this.addObjectData = {
                        formTitle:'基本信息',
                        content: newArr
                    }
                    this.$refs.refDynamicForm.visible = true;
                    break;
                default:
                    break;
            }
            
        },
        //成功添加对象
        successAdd() {
            this.getDataList(0,15);
            this.$refs.refSearch.getGroupList();
        },
        //获取分组列表
        getGroupList(data) {
            this.groupList = data.groupList;
            this.currentGrounpId = data.currentGrounpId;
        },
        //获取表单列表
        getCrfList(data) {
            this.crfList = data.crfList;
            this.activeCrf = data.activeCrf;
        },
        //点击分组
        handleSelectGroup(data) {
            this.currentGrounpId = data;
            this.getDataList(0,15);
        },
        //获取全部crf表单列表和列表下的所有指标
        handleAllFormItem(data) {
            this.allCrfForm = data;
            this.confingData.dataList = data;
        },
        //修改默认crf
        changeActiveCrf(data) {
            this.activeCrf = data;
        }
    }
};
</script>


<style lang="less">
    @import url('./popover.less');
    .addresearchObject.el-popper {
        margin-top: 0 !important;
        padding: 0;
        .el-dropdown-menu__item {
            border-bottom: 1px solid #eee;
        }
    }
    .researchObject {
        .el-table {
            padding: 0 !important;
        }
        .el-table__header-wrapper .el-button {
            padding: 0;
            .icon {
                font-size: 20px;
                color: #999;
                &:hover {
                    color: #1bbae1;
                }
            }
        } 
    }
</style>




