<template>
    <div class="cloud-component followUpManagement cloud_common_search">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button v-if="$store.state.user.researchAuth.authImport" type="primary" icon="icon iconfont icondaochu" @click="">批量导入随访数据</el-button>
                <el-button v-if="$store.state.user.researchAuth.authExport" type="primary" icon="icon iconfont iconxiazaimoban" @click="">导出随访阶段数据</el-button>
                <el-button v-if="$store.state.user.researchAuth.authExport" type="primary" icon="icon iconfont icondaochujilu" @click="">导出记录</el-button>
            </div>
        </div>
        <!-- 搜索区域 -->
        <div class="cloud-search flex-between-center" v-if="showGuide">
            <div class="search_group flex-start-center">
                <searchCom 
                    v-if="showGuide"
                    ref="refSearch"
                    @sendGroupList="getGroupList" 
                    @selectGroup="handleSelectGroup">
                </searchCom>
                <el-popover trigger="click" :popper-class="'popover_search ' + $store.state.common.openMenuView" v-model="popoverSearchVisible">
                    <div slot="reference"><i class="icon iconfont iconsousuo_fuzhi"></i> 搜索</div>
                    <el-form :inline="true" :model="form" label-width="110px" class="flex-start-center flex-wrap researchObject_search">
                        <el-form-item label="首次录入时间：" class="bold">
                            <el-date-picker
                                v-model="form.entryTime"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="随访点状态:" class="bold">
                            <el-select v-model="form.stageId" size='small' @change="changeStage">
                                <el-option label="全部阶段" value=""></el-option>
                                <el-option v-for="(item, index) in stageList" :key="index" :label="item.stageName" :value="item.stageId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-select :disabled="!form.stageId" size='small' v-model="form.pointId">
                                <el-option v-for="(item, index) in stagePointList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-select :disabled="!form.pointId" size='small' v-model="form.pointStatus" clearable>
                                <el-option label="未开始" value="0"></el-option>
                                <el-option label="录入中" value="1"></el-option>
                                <el-option label="已失访" value="2"></el-option>
                                <el-option label="已终止" value="3"></el-option>
                                <el-option label="已完成" value="4"></el-option>
                                <el-option label="失效" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="最近随访时间：" class="bold">
                            <el-date-picker
                                v-model="form.followUpTime"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="随访状态: " class="bold">
                            <el-select v-model="form.visitStatus">
                                <!-- <el-option label="全部状态" value=""></el-option> -->
                                <el-option label="未开始" value="0"></el-option>
                                <el-option label="录入中" value="1"></el-option>
                                <el-option label="已终止" value="3"></el-option>
                                <el-option label="已完成" value="4"></el-option>
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
                <el-button v-show="multipleSelection.length != 0" type="primary" icon="icon iconfont iconqueren" @click="">触发开始随访</el-button>
                <el-button v-show="multipleSelection.length != 0" type="danger" class="right_6" icon="icon iconfont iconzujian12" @click="">提交随访点</el-button>
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
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1"  v-loading="tableLoading">
                <el-table 
                    ref="refTable" fit border
                    v-if="dataList.content.length != 0"
                    :data="dataList.content"
                    @selection-change="handleSelectionChange"
                    :max-height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1):(routerViewHeight*1)">
                    <el-table-column type="selection" align="center" width="50" fixed></el-table-column>
                    <el-table-column 
                        v-for="(column,index) in filterHeader"
                        :prop="column.prop" 
                        :label="column.label" 
                        sortable 
                        :key="index" 
                        align="center"
                        :min-width="column.label.length * 15 + 50"
                        :widht="handleWidth(column.label)"
                        show-overflow-tooltip>
                        <template slot-scope="scope" v-show="column.prop=='visitStatus'">
                            <p><i  v-show="column.prop=='visitStatus'" class="status-icon" :style="'background:'+handleStatus(scope.row[column.prop])+';'"></i> {{scope.row[column.prop]}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column  :label="li.label" align="center" v-for="(li,liIndex) in headerReportList" :key="'1_'+liIndex">
                        <el-table-column 
                            v-for="(point,poindex) in li.prop" 
                            :key="'2_'+poindex"
                            :prop="point.prop" 
                            :label="point.label" 
                            :min-width="point.label.length * 15 + 20"
                            align="center">
                            <template slot-scope="scope">
                                <el-tooltip :disabled="handlePoint(scope.row[point.prop]).status == 0 || handlePoint(scope.row[point.prop]).status == 5" class="item" effect="dark" placement="top">
                                    <div slot="content">
                                        <p v-if="handlePoint(scope.row[point.prop]).status == 1 && handlePoint(scope.row[point.prop]).planDate">计划时间：{{handlePoint(scope.row[point.prop]).planDate}}</p>
                                        <p v-else-if="handlePoint(scope.row[point.prop]).status == 1 && !handlePoint(scope.row[point.prop]).planDate">计划时间：无</p>
                                        <div v-if="parseInt(handlePoint(scope.row[point.prop]).status) >= 2">
                                            <p>随访员：{{handlePoint(scope.row[point.prop]).updator}}</p>
                                            <p>计划时间：{{handlePoint(scope.row[point.prop]).planDate}}</p>
                                            <p>时间：{{handlePoint(scope.row[point.prop]).updateTime}}</p>
                                            <p v-if="handlePoint(scope.row[point.prop]).note">备注：{{handlePoint(scope.row[point.prop]).note}}</p>
                                        </div> 
                                    </div>
                                    <el-button @click="toReportFill(scope.row,handlePoint(scope.row[point.prop]),li.crfId)" v-if="handlePoint(scope.row[point.prop]).status == 0 && li.startType == 1 && point.prop == li.prop[0].prop"  type="primary" style="background:#00B8DF; height: 18px; line-height: 18px; font-size:12px;padding:0 2px;"> 开始随访 </el-button>
                                    <el-button @click="toReportFill(scope.row,handlePoint(scope.row[point.prop]),li.crfId)" v-else-if="handlePoint(scope.row[point.prop]).status == 0"  type="text" icon="icon iconfont iconiconfontgengduo" style="color: #e0e0e0;"></el-button>
                                    <el-button @click="toReportFill(scope.row,handlePoint(scope.row[point.prop]),li.crfId)" v-else-if="handlePoint(scope.row[point.prop]).status == 1"  type="text" icon="icon iconfont icondaifang" style="color: #00B8DF;"></el-button>
                                    <el-button @click="toReportFill(scope.row,handlePoint(scope.row[point.prop]),li.crfId)" v-else-if="handlePoint(scope.row[point.prop]).status == 2"  type="text" icon="icon iconfont iconshifang" style="color: #F79E00;"></el-button>
                                    <el-button @click="toReportFill(scope.row,handlePoint(scope.row[point.prop]),li.crfId)" v-else-if="handlePoint(scope.row[point.prop]).status == 3"  type="text" icon="icon iconfont iconzhongzhi" style="color: #DB5452;"></el-button>
                                    <el-button @click="toReportFill(scope.row,handlePoint(scope.row[point.prop]),li.crfId)" v-else-if="handlePoint(scope.row[point.prop]).status == 4"  type="text" icon="icon iconfont iconwancheng1" style="color: #00BE90;"></el-button>
                                    <el-button v-else-if="handlePoint(scope.row[point.prop]).status == 5"  type="text" icon="el-icon-minus" style="color: #333; cursor: default;"></el-button> 
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="操作" width="60" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="" type="text" icon="el-icon-message"></el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div v-show="dataList.content.length == 0 && showGuide" class="empty flex-center-center flex-wrap" style="margin-top: 180px;">
                    <svg class="icon" aria-hidden="true" style="font-size: 170px;width:100%; text-align:center;">
                        <use xlink:href="#iconzu11"></use>
                    </svg>
                    <p class="text-center" style="font-size: 14px; color:#666;padding-top: 15px;">暂无内容</p>
                </div>
                <!-- 分页 -->
                <!-- <pagination :data="dataList" @change="getDataList"></pagination>     -->


                <!-- 引导图 -->
                <div v-show="!showGuide"  class="guide flex-center-center" style="height: 500px;">
                    <div class="guide_box flex-center-start flex-wrap">
                        <div class="guide_wrap">
                            <p class="text_center">#我的随访计划#</p>
                            <img src="../images/guide_followUpManagement.png" alt="">
                        </div>
                        <el-button type="primary"  @click="$router.push('/followUpPlan')">创建随访计划</el-button>
                        <div class="guide_text">
                            <p>1、支持每个队列设置不同的随访方案</p>
                            <p>2、随访方案包括：随访频率、随访内容</p>
                        </div>
                    </div>
                </div>
            </echarts-contain>
        </div>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import searchCom from '../researchObject/components/search'
import formItemCom from '../researchObject/components/formItem'
export default {
    name: 'followUpManagement',
    mixins: [mixins],
    data () {
        return {
            showGuide: false,
            groupList: [],
            activeCrf:'',
            popoverSearchVisible: false,
            currentGrounpId: null,
            allCrfForm: [],
            confingData: {
                title: "设置表格固定列",
                visible: false,
                defaultChecked: ['入组序号','首次录入时间','所在中心'],
                dataList: []
            },
            stageList:[],
            stagePointList:[],
            dataList: {
                content: []
            },
            form: {
                entryTime:[],
                followUpTime:[],
                patientState: '',
                radio: '0',
                stageId: '',
                pointId: '',
                pointStatus: '',
                visitStatus: '',
                keyword:''
            },
            multipleSelection: [],
            tableLoading: false,
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            },
            //编辑随访表单
            editFollowUpData: {
                formTitle:'',
                content: []
            },
            hidden:'',
        }
    },
    computed: {
        headerReportList() {
            return this.dataList.header.filter(item=>{
                return item.type == 'report'
            })
        },
        filterHeader() {
            return this.dataList.header.filter(item=>{
                return item.type !='report' && item.type != 'disable'
            })
        }
    },
    created() {
        this.getFGroupList();
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
        //操作随访状态样式
        handleStatus(status) {
            switch (status) {
                case '未开始':  return '#e0e0e0'; break;
                case '录入中':  return '#00B8DF'; break;
                case '已失访':  return '#F79E00'; break;
                case '已终止':  return '#DB5452'; break;
                case '已完成':  return '#00BE90'; break;
                case '失效':  return '#333'; break;
                default:
                    break;
            }
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
                this.getDataList(0,15);
            }
        },
         //表格多选项
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            if (!this.showGuide) {
                return;
            }
            let that = this;
            this.popoverSearchVisible = false;
            that.tableLoading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let entryTime = ['',''];
            if(this.form.entryTime && this.form.entryTime.length != 0) {
                entryTime = this.form.entryTime;
            }
            let followUpTime = ['',''];
            if(this.form.followUpTime && this.form.followUpTime.length != 0) {
                followUpTime = this.form.followUpTime;
            }
            let formData = {
                offset: pageNo,
                limit: pageSize,
                subjectId: this.$store.state.user.researchInfo.subjectInfoId,
                groupId: this.currentGrounpId,
                enterStartDate: entryTime[0],
                enterEndDate: entryTime[1],
                visitStartDate: followUpTime[0],
                visitEndDate: followUpTime[1],
                stageId: this.form.stageId==''?undefined:this.form.stageId,
                pointId: this.form.pointId==''?undefined:this.form.pointId,
                pointStatus: this.form.pointStatus==''?undefined:this.form.pointStatus,
                visitStatus: this.form.visitStatus==''?undefined:this.form.visitStatus,
                searchType: parseInt(this.form.radio),
                content: this.form.keyword,
                enterType: localStorage.getItem('CURR_LOGIN_TYPE') == "research"?1:0     //0账号密码  1 验证码
            };
            try {
                let res = await that.$http.followUpManagementTable(formData);
                if (res.code == '0' && res.data.body.length != 0) {
                    let obj = {
                        content: res.data.body,
                        header: res.data.header
                    };
                    that.dataList = obj;
                    console.log(this.dataList)
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
        //获取随访列表
        async getFGroupList() {
            let params = {
                id: this.$store.state.user.researchInfo.subjectInfoId,
            }
            try {
                let res = await this.$http.followUpPlanStageList(params);
                if (res.code == '0') {
                    //判断是否存在随访点
                    this.showGuide = res.data.some((li)=>{
                        return li.stages.length != 0;
                    })
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取阶段
        async getStageList() {
            let params = {
                id: this.$store.state.user.researchInfo.subjectInfoId,
            }
            try {
                let res = await this.$http.followUpPlanStageList(params);
                if (res.code == '0') {
                    res.data.forEach(item=>{
                        if(item.groupId == this.currentGrounpId) {
                            this.stageList = item.stages;
                        }
                    })
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取阶段下的随访点
        async getStagePointList(stageId) {
            let params = {
                stageId: stageId
            }
            try {
                let res = await this.$http.followUpPlanPlanPoints(params);
                if (res.code == '0') {
                    this.stagePointList = res.data;
                }else {
                    this.stagePointList = [];
                }
            } catch (err) {
                console.log(err)
            }
        },
        //改变阶段下拉列表
        changeStage(val) {
            if(!val) {
                this.form.pointId = '';
                return;
            }
            this.getStagePointList(val)
        },
        //获取分组列表
        getGroupList(data) {
            this.groupList = data?data.groupList:[];
            this.currentGrounpId = data?data.currentGrounpId:'';
            this.getStageList()
        },
        //点击分组
        handleSelectGroup(data) {
            this.currentGrounpId = data;
            //查询两遍，解决table提示框不显示问题
            this.getDataList(0,15)
            // .then(()=>{
                // this.getDataList(0,15);
            // })
        },
        //获取全部crf表单列表和列表下的所有指标
        handleAllFormItem(data) {
            this.allCrfForm = data;
            this.confingData.dataList = data;
        },
        //修改默认crf
        changeActiveCrf(data) {
            this.activeCrf = data;
        },
        onReset() {
            this.form = {
                entryTime:[],
                followUpTime:[],
                patientState: '',
                radio: '0',
                stageId: '',
                pointId: '',
                pointStatus: '',
                visitStatus: '',
                keyword:''
            }
        },
        //打开表单填写页面
        toReportFill(row,point,crfId) {
            if(!this.$store.state.user.researchAuth.authImport) {
                this.$mes('info','暂无操作权限!')
                return;
            }
            let group = this.groupList.find(item=>{
                return item.subjectGroupId == this.currentGrounpId;
            })
            let urlParameter={
                cacheData: false,
                note: point.note,
                formId: crfId || "",
                reportId: point.reportId || '',
                groupId: this.currentGrounpId || '',
                groupName: group.subjectGroupName || '',
                diseaseId: row.diseaseId || "",
                patientName: row.createTime +' ---  ',
                patientId: row.patientId || "",
                identify: row.identify || "",
                from: "followUpManagement",
                diseaseName: row.diseaseName || "",
                subjectName: row.subjectName || "",
                title: point.name,
                isModify:"displayShow",
                status: point.status,  
                pointPatientId: point.pointPatientId,
                subjectId: this.$store.state.user.researchInfo.subjectInfoId,
                updateTime: point.updateTime || '',
                updator: point.updator || '',
            }
            localStorage.setItem('reportFill',JSON.stringify({urlParameter}));
            window.open('./subjectForm.html');
        },
        //表单编辑成功回调
        successAdd() {
            this.getDataList(0,15);
        },
        handlePoint(data) {
            if(typeof(data) != 'object') {
                return {};
            }
            return data;
        }
    }
};
</script>

<style lang="less" scoped>
    .followUpManagement {
        .cloud-search-list .bigContain {
            background-color: #fff;
        }
        .echartsContain {
            min-height: 600px;
        }
        .el-table {
            padding: 0;
            .status-icon {
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-right: 6px;
                border-radius: 50%;
            }
            p {
                text-align: center;
            }
        }
        .guide {
            .guide_box {
                overflow: hidden;
                margin-top: 80px;
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

<style lang="less">
    @import url('../researchObject/popover.less');
</style>




