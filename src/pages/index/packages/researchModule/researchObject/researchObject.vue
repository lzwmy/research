<template>
    <div class="cloud-component researchObject cloud_common_search" v-loading="importMask"  element-loading-text="数据正在导入中。。。。">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button v-if="$store.state.user.researchAuth.authImport" type="primary" icon="icon iconfont icondaochu" @click="showImportDataDialog">导入研究数据 </el-button>
                <el-button v-if="$store.state.user.researchAuth.authExport" type="primary" icon="icon iconfont iconxiazaimoban" @click="exportData">入组阶段数据导出</el-button>
                <el-button v-if="$store.state.user.researchAuth.authExport" type="primary" icon="icon iconfont icondaochujilu" @click="">导出记录</el-button>
                <el-button type="primary" icon="icon iconfont icontianjiayanjiuduixiang" @click="addSingleObject" style="padding: 0 15px 0 15px;border-radius:2px 0 0 2px;">
                    添加研究对象
                </el-button>
                <el-dropdown trigger="hover" @command="handleAddObject" class="addDropdown">
                    <span class="add"><i class="el-icon-caret-bottom el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown" class="addresearchObject">
                        <el-dropdown-item v-if="$store.state.user.researchAuth.authImport" command="1" icon="el-icon-plus">单个添加</el-dropdown-item>
                        <!-- <el-dropdown-item v-if="$store.state.user.researchAuth.authImport" command="2" icon="el-icon-plus">批量添加</el-dropdown-item> -->
                        <el-dropdown-item command="2" icon="el-icon-plus">
                            <el-upload
                                class="upload"
                                style="display:inline-block"
                                :on-change="successFile"
                                :auto-upload="false"
                                :show-file-list='false'
                                action=""
                                accept=".xls, .xlsx">
                                批量添加
                            </el-upload>
                        </el-dropdown-item>
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
                    @changeShowGuide='handleGuide'
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
                                <el-option label="全部表单" value=""></el-option>
                                <el-option v-for="(item,index) in crfList" :key="index" :label="item.crfName" :value="item.crfId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-select v-model="form.formState">
                                <el-option label="全部状态" value=""></el-option>
                                <el-option label="待录入" value="0"></el-option>
                                <el-option label="已完成" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="患者状态:" class="bold">
                            <el-select v-model="form.patientState">
                                <el-option label="全部状态" value=""></el-option>
                                <el-option label="录入中" value="0"></el-option>
                                <el-option label="已完成" value="1"></el-option>
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
                    @getDataList="getDataList()" 
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
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1" >
                <el-table 
                    ref="refTable" fit border
                    :data="dataList.content" v-loading="tableLoading"
                    @selection-change="handleSelectionChange"
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-58):(routerViewHeight*1)-58">
                    <el-table-column type="selection" fixed align="center" width="50"></el-table-column>
                    <el-table-column 
                        v-for="column in filterHeader"
                        :prop="column.prop" 
                        :label="column.label" 
                        sortable 
                        :key="column.prop" 
                        align="center"
                        :min-width="column.label.length * 15 + 50"
                        :width="handleWidth(column.label)"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="研究内容" align="center">
                        <el-table-column 
                            v-for="li in headerReportList" 
                            :key="li.prop"
                            :prop="li.prop" 
                            :label="li.label" 
                            :width="li.label.length * 15 + 20"
                            align="center">
                            <template slot-scope="scope">
                                <el-button @click="toReportFill(scope.row,li.prop,li.label,'add')" v-if="scope.row[li.prop] && JSON.parse(scope.row[li.prop]).status == 0" type="text" icon="icon iconfont iconbianji3"></el-button>
                                <el-button @click="toReportFill(scope.row,li.prop,li.label,'edit')" v-else-if="scope.row[li.prop] && JSON.parse(scope.row[li.prop]).status == 1" type="text" icon="icon iconfont iconwancheng" style="color:#00BD91;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="60" align="center" fixed="right">
                        <template slot="header" slot-scope="scope">
                            <el-button @click="showConfigDialog" type="text" icon="setting icon iconfont iconfuhao7" style="padding-left: 10px; font-size: 30px; color: #555;"></el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button @click="deleteObject(scope.row)" type="text" icon="iconfont iconshanchu del"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination :data="dataList" @change="getDataList"></pagination>    

                <!-- 引导图 -->
                <div v-show="showGuide" class="guide flex-center-center" style="height: 500px;">
                    <div class="guide_box flex-center-start flex-wrap">
                        <div class="guide_wrap">
                            <p class="text_center">#我的研究对象#</p>
                            <img src="../images/guide_researchObject.png" alt="">
                        </div>
                        <el-button type="primary"  @click="$router.push('/researchTarget')">创建研究指标</el-button>
                        <div class="guide_text">
                            <p>1、添加研究指标</p>
                            <p>2、添加研究对象</p>
                        </div>
                    </div>
                </div>
            </echarts-contain>
        </div>

        <!-- 导入数据弹窗 -->
        <import-dialog :dataInfo="importDataDialog" @changeDialog="handleDialog" @checkData='handleCheckData' @updata="handleSuccessAdd"></import-dialog>
        <!-- 动态列配置弹窗 -->
        <table-config ref="refTableConfig" @saveConfig="handleSaveConfig" :dataInfo="confingData"></table-config>
        
        <!-- 添加研究对象 -->
        <dynamicForm 
            ref="refDynamicForm" 
            v-if="dialogAddObject.visible" 
            :dialog="dialogAddObject" 
            :dataInfo="addObjectData" 
            :groupList="groupList" 
            @successAdd="handleSuccessAdd">
        </dynamicForm>

        <!-- 导入数据不通过 -->
        <el-dialog
            title="数据不通过"
            :visible.sync="notPassDialogVisible"
            width="400px"
            v-loading="notPassDialogLoading"
            :append-to-body="true">
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <p class="text-center">点击确定按钮下载检验后的数据文件</p>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="downloadCheckData(currentFileId)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import tableConfig from './dialog/tableConfig'
import dynamicForm from './dialog/dynamicForm'
import importDialog from './importcom/ImportDialog'
import searchCom from './components/search'
import formItemCom from './components/formItem'
import utils from 'components/utils/index';
export default {
    name: 'researchObject',
    mixins: [mixins],
    data () {
        return {
            showGuide: false,
            groupList: [],
            crfList: [],
            allCrfForm: [],
            currentGrounpId: null,
            dataList: {
                header: [],
                content: []
            },
            importDataDialog: false,
            importData: {
                title: "批量导入研究数据",
                visible: false
            },
            multipleSelection: [],
            confingData: {
                title: "设置表格固定列",
                visible: false,
                dataList: []
            },
            //文件导入loading蒙板
            importMask: false,
            //回显指标
            previewFormItem:[],
            //已选指标数组
            selectFormItem: [],
            popoverFomeItemVisible: false,
            popoverSearchVisible: false,
            form: {
                keyword: '',
                time:[],
                formName: '',
                formState: '',
                patientState: '',
                radio: '0'
            },
            activeCrf: null,
            tableLoading: false,
            formItemLoading: false,
            paging: {
                pageNo: 1,
                pageSize: 20,
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
            },
            hidden: '',
            notPassDialogVisible: false,
            notPassDialogLoading: false,
            currentFileId: '',  //当前选中文件
        }
    },
    computed: {
        headerReportList() {
            return this.dataList.header.filter(item=>{
                return item.type == 'report'
            })
        },
        filterHeader() {
            return this.dataList.header.filter(li=>{
                return li.type != 'report'
            })
        }
    },
    created() {
        
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    beforeDestroy(){
        document.removeEventListener(this.visibilityChange,this.visibilityChangeHandle)
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
        handleWidth(label) {
            let width = '';
            if(label.indexOf('时间') != -1 || label.indexOf('日期') != -1) {
                width = 160
            }
            return width
        },
        //改变引导图显隐
        handleGuide(val) {
            this.showGuide = val;
        },
        //切换页面刷新操作
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
        visibilityChangeHandle() {
            if(!document[this.hidden]) {
                this.getDataList(this.paging.pageNo, this.paging.pageSize);
            }
        },
        //导出
        async exportData() {
            
        },
        //当导入数据校验不成功时
        handleCheckData(data) {
            this.currentFileId = data;
            this.notPassDialogVisible = true;
        },
        //下载校验的文件
        async downloadCheckData(id) {
            this.notPassDialogLoading = true;
            let params = {
                fileId: id
            }
            try {
                let res = await this.$http.researchObjectCheckFile(params);
                let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                this.$download('检验后文件.xlsx', blob);
                this.notPassDialogLoading = false;
                this.notPassDialogVisible = false;
            } catch (err) {
                this.notPassDialogVisible = false;
                this.notPassDialogLoading = false;
                console.log(error)
                this.$mes('error','导出失败')
            }
        },
        //导入导出研究数据弹窗
        handleDialog(val) {
            this.importDataDialog = val
        },
        
        //下载添加研究对象模版
        async downloadTempObject() {
            try{
                let data = await this.$http.researchObjectExportObject({
                    subjectId: this.$store.state.user.researchInfo.subjectInfoId
                });
                let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                this.$download('添加研究对象模版.xlsx', blob);
            }catch (error) {
                console.log(error)
                this.$notice('导出失败')
            }
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
                formName: '',
                formState: '',
                patientState: '',
                radio: '0'
            }
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
            this.popoverSearchVisible = false;
            this.importDataDialog = false;
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
                subjectInfoId: this.$store.state.user.researchInfo.subjectInfoId,
                subjectGroupId: this.currentGrounpId,
                createTime: time[0],
                endTime: time[1],
                formCrfId: parseInt(this.form.formName),
                formCrfStatus: parseInt(this.form.formState),
                patientStatus: parseInt(this.form.patientState),
                searchType: parseInt(this.form.radio),
                keyword: this.form.keyword,
                enterType: localStorage.getItem('CURR_LOGIN_TYPE') == "research"?1:0     //0账号密码  1 验证码
            };
            try {
                let res = await that.$http.researchObjectTable(formData);
                if (res.code == '0') {
                    let obj = {
                        content: res.data.body,
                        header: res.data.header
                    };
                    obj.pageNo = pageNo;
                    obj.pageSize = pageSize;
                    obj.totalCount = parseInt(res.data.pageSize);
                    obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
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
            this.importDataDialog = true;
        },
        showConfigDialog() {
            this.confingData.visible = true;
            this.$refs.refTableConfig.initFomeItem();
        },
        handleSaveConfig(data) {
            this.getDataList(this.paging.pageNo, this.paging.pageSize);
        },
        //打开表单填写页面
        toReportFill(data,key,crfName,type) {
            if(!this.$store.state.user.researchAuth.authImport) {
                this.$mes('info','暂无操作权限!')
                return;
            }
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
            localStorage.setItem('reportFill',JSON.stringify({urlParameter}));
            window.open('./subjectForm.html');
        },
        //操作添加研究对象下拉项
        handleAddObject(command) {
            switch (command) {
                case '1':
                    this.addSingleObject();
                    break;
                case '3':
                    this.downloadTempObject();
                    break;
                default:
                    break;
            }
            
        },
        //单个添加研究对象
        addSingleObject(val) {
            //生成表单指标
            let newArr = [];
            console.log(this.confingData.dataList)
            this.confingData.dataList.forEach(item=>{
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
            //如果指标为空
            if(newArr.length == 0) {
                this.$mes('info','请先勾选研究指标项')
                return;
            }
            this.dialogAddObject = {
                title: '添加研究对象',
                from:'researchObject',
                visible: true,
                loading: false
            }
            this.addObjectData = {
                formTitle:'基本信息',
                content: newArr
            }
            this.$nextTick(()=>{
                this.$refs.refDynamicForm.visible = true;
            })
        },
        //批量添加研究对象
        async importBatchObject(file) {
            this.importMask = true;
            try {
                let params = new FormData();
                params.append('file',file.raw);
                params.append('subjectGroupId',this.currentGrounpId);
                params.append('subjectInfoId',this.$store.state.user.researchInfo.subjectInfoId);
                let res = await this.$http.researchObjectImportBatchObject(params);
                if(res.code==0) {
                    this.$mes('success','导入成功');
                    this.$refs.refSearch.getGroupList()
                    .then(()=>{
                        this.getDataList();
                    })
                }else if(res.data) {
                    this.handleCheckData(res.data)
                }
                this.importMask = false;
            } catch (err) {
                this.importMask = false;
                console.log(err)
                this.$mes('error','导入失败')
            }
        },
        //批量添加研究对象文件选中
        successFile(file,fileList) {
            this.importBatchObject(file);
        },
        //成功添加对象回调
        handleSuccessAdd(currentGrounpId) {
            this.$refs.refSearch.getGroupList()
            .then(()=>{
                this.$refs.refSearch.selectGroup(currentGrounpId);
                this.currentGrounpId = currentGrounpId;
                this.getDataList(this.paging.pageNo, this.paging.pageSize);
            })
        },
        //删除研究对象
        deleteObject(row) {
            this.$confirm('确定删除?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async() => {
                let params = {
                    "subjectId": this.$store.state.user.researchInfo.subjectInfoId,
                    "groupId": this.currentGrounpId,
                    "patientId": row.patientId
                }
                try {
                    let res = await this.$http.researchObjectPreviewTableDeleteObject(params);
                    if (res.code == '0') {
                        this.$mes('success','删除成功!')
                        this.$refs.refSearch.getGroupList().then(()=>{
                            this.getDataList(this.paging.pageNo, this.paging.pageSize);
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            }).catch(() => {});
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
        handleSelectGroup(currentGrounpId) {
            this.currentGrounpId = currentGrounpId;
            this.getDataList(this.paging.pageNo, this.paging.pageSize);
        },
        //获取全部crf表单列表和列表下的所有指标
        handleAllFormItem(data) {
            this.allCrfForm = data;
            this.confingData.dataList = utils.deepCopy(data);
            this.$refs.refTableConfig.initFomeItem();
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
        .echartsContain .bigContain{
            overflow: auto;
            // min-height: 600px;
        }
        .addDropdown.el-dropdown {
            margin-left: 0;
            height: 32px;
            width: 40px;
            .add {
                line-height: 32px;
                position: absolute !important;
                top: 0;
            }
        }
        .el-table {
            padding: 0 !important;
            .setting {
                font-size: 20px !important;
                color: #999;
                &:hover {
                    color: #1bbae1;
                }
            }
        }
        .guide {
            .guide_box {
                overflow: hidden;
                width: 400px;
                height: 400px;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 12px 0px;
                border-radius: 8px;
                background-color: #fff;
                .guide_wrap {
                    color: #fff;
                    height: 180px;
                    width: 100%;
                    background-color: #1bbae1;
                    padding: 15px;
                    img {
                        margin: 20px auto 0;
                        display: block;
                    }
                }
                .el-button {
                    margin: 30px auto;
                }
                .guide_text {
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgb(106, 112, 126);
                    width: 100%;
                    padding: 10px 40px;
                }
            }
        } 
    }
</style>




