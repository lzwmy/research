<template>
    <div class="cloud-component researchObject cloud_common_search">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button type="primary" icon="icon iconfont icondaochu" @click="showImportDataDialog">研究导入数据</el-button>
                <el-button type="primary" icon="icon iconfont iconxiazaimoban" @click="">入组阶段数据导出</el-button>
                <el-button type="primary" icon="icon iconfont icondaochujilu" @click="">导出记录</el-button>
                <el-dropdown trigger="hover">
                    <el-button type="primary" icon="icon iconfont icontianjiayanjiuduixiang">
                        添加研究对象
                        <span class="add"><i class="el-icon-caret-bottom el-icon--right"></i></span>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="addresearchObject">
                        <el-dropdown-item icon="el-icon-plus">单个添加</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-plus">批量添加</el-dropdown-item>
                        <el-dropdown-item icon="icon iconfont iconxiazaimoban">下载模版</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
        </div>
        <!-- 搜索区域 -->
        <div class="cloud-search flex-between-center">
            <div class="search_group flex-start-center">
                <div v-for="(item, index) in groupList" :key="index" class="group_item" :class="currentGrounpId==item.id?'active':''" @click="selectGroup(item.id)">{{item.groupName}} <span class="badge">12</span> </div>
                <el-popover trigger="click" :popper-class="'popover_search ' + $store.state.common.openMenuView">
                    <div slot="reference"><i class="icon iconfont iconsousuo_fuzhi"></i> 搜索</div> 
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
                <el-popover trigger="click" popper-class="popover_condition" v-model="popoverVisible">
                    <el-button slot="reference">已选3项 <span class="el-icon-caret-bottom"></span></el-button>
                    <div class="box">
                        <div class="head flex-between-center">
                            <p>选择搜索</p><span class="el-icon-close cur_pointer" @click="popoverVisible = false"></span>
                        </div>
                        <div class="radio_group">
                            <el-radio v-model="form.radio" label="0">精准搜索</el-radio>
                            <el-radio v-model="form.radio" label="1">模糊搜索</el-radio>
                        </div>
                        <div class="content flex-start-start">
                            <div class="left">
                                <p class="label">请选择</p>
                                <ul>
                                    <li v-for="(item,index) in allCrfForm" :key="index" class="flex-between-center" :class="activeCrf == item.crfId?'active':''" @click="selectCrf(item.crfId,item)">
                                        <p>{{item.crfName}}</p>
                                        <div class="icon">
                                            <span>3</span>
                                            <i class="el-icon-arrow-right"></i>   
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="right">
                                <p class="label">选择搜索字段，至少选择1项，最多5项</p>
                                <el-checkbox-group 
                                    v-model="form.checked"
                                    :min="0"
                                    :max="5">
                                    <el-checkbox v-for="(item,index) in formItemRspList" :label="item.formItemName" :key="index">{{item.formItemName}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div class="footer flex-end-center">
                            <p>最多展示500个指标</p>
                            <el-button type="primary"  @click="">保 存</el-button>
                            <el-button @click="popoverVisible = false">取 消</el-button>
                        </div>
                    </div>
                </el-popover>
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
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column 
                        v-for="column in dataList.header"
                        :prop="column.prop" 
                        :label="column.label" 
                        sortable 
                        :key="column.prop" 
                        :width="column.prop == 'patientId'?'110px':''"
                        v-if="column.type !='report'"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="研究内容">
                        <span v-for="li in dataList.header" :key="li.prop" >
                            <el-table-column 
                                v-if="li.type=='report'"
                                :prop="li.prop" 
                                :label="li.label" 
                                :key="li.prop">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row[li.prop] && JSON.parse(scope.row[li.prop]).status == 1" type="text" icon="icon iconfont iconbianji3"></el-button>
                                    <el-button v-else type="text" icon="icon iconfont iconwancheng"></el-button>
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
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import importDialog from './dialog/ImportDialog'
import tableConfig from './dialog/tableConfig'
export default {
    name: 'researchObject',
    mixins: [mixins],
    data () {
        return {
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
                defaultChecked: ['入组序号','首次入组时间','所在中心'],
                dataList: []
            },
            popoverVisible: false,
            formItemRspList: [],
            form: {
                keyword: '',
                time:[],
                formName: '0',
                formState: '0',
                patientState: '0',
                radio: '0',
                checked: []
            },
            activeCrf: null,
            tableLoading: false,
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            }
        }
    },
    created() {
        this.getGroupList()
        .then(()=>{
            this.getDataList(0,15);
        })
        this.getCrfList();
        this.getAllFormItem();
    },
    components: {
        echartsContain,
        pagination,
        importDialog,
        tableConfig
    },
    methods: {
        //表格多选项
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //选择分组
        selectGroup(id) {
            this.currentGrounpId = id;
            this.getDataList(0,15);
        },
        //搜索表格配置选中表单
        selectCrf(id,item) {
            this.activeCrf = id;
            this.formItemRspList = item.formItemRspList;
        },
        onReset() {
            this.form = {
                keyword: '',
                time:[],
                formName: '0',
                formState: '0',
                patientState: '0',
                radio: '0',
                checked: []
            }
        },
        //获取分组列表
        async getGroupList() {
            this.groupLoading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.projectGroupingGroup(params);
                if (res.code == '0') {
                    this.groupList = res.data;
                    if(this.groupList.length) {
                        this.currentGrounpId = this.groupList[0].id;
                    }
                }
                this.groupLoading = false;
            } catch (err) {
                this.groupLoading = false;
                console.log(err)
            }
        },
        //crf表单列表和列表下的所有指标
        async getAllFormItem() {
            this.groupLoading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.researchObjectAllFormItem(params);
                if (res.code == '0') {
                    res.data.forEach(item=>{
                        item.checkedList = [];
                    })
                    this.allCrfForm = res.data;
                    this.confingData.dataList = this.allCrfForm;
                }
            } catch (err) {
                console.log(err)
            }
        },
        //回显crf表单列表下的已选指标
        // async getAllFormItem() {
        //     this.groupLoading = true;
        //     let params = {
        //         subjectInfoId: this.$store.state.user.researchID
        //     }
        //     try {
        //         let res = await this.$http.researchObjectAllFormItem(params);
        //         if (res.code == '0') {
        //             this.allCrfForm = res.data;
        //         }
        //     } catch (err) {
        //         console.log(err)
        //     }
        // },
        //获取crf表单列表
        async getCrfList() {
            this.groupLoading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.researchObjectCrfList(params);
                if (res.code == '0') {
                    this.crfList = res.data;
                    if(this.crfList.length) {
                        this.activeCrf = this.crfList[0].crfId;
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
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
            // let formData = {
            //     offset: 1,
            //     limit: pageSize,
            //     subjectInfoId: this.$store.state.user.researchID,
            //     subjectGroupId: this.currentGrounpId,
            //     createTime: '',
            //     endTime: '',
            //     formCrfId: 0,
            //     formCrfStatus: 0,
            //     patientStatus: 0,
            //     searchType: 0,
            //     keyword: ''
            // };
            try {
                let res = await that.$http.researchObjectTable(formData);
                if (res.code == '0') {
                    let obj = {
                        content: res.data.body,
                        header: res.data.header
                    };
                    // console.log(res.data.body)
                    res.data.body.forEach((item)=>{
                        console.log(item)
                        console.log(JSON.parse(item.report_1))
                    })
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
            console.log(data)
            this.confingData.visible = false;
        }
    }
};
</script>

<style lang="less" scoped>

</style>

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




