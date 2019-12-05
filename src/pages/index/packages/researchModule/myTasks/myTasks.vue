<template>
    <div class="cloud-component myTasks">
        <div class="box">
            <div class="aside">
                <p class="aside_title">随访任务</p>
                <ul v-loading="groupLoading" id="group">
                    <li v-for="(item, index) in groupList" :key="index" :class="item.value == activeGroup.value?'active':''" @click="selectGroup(item)">
                        <i class="icon iconfont" :class="item.icon" ></i>
                        <span>{{item.name}} - {{item.count}}</span>
                    </li>
                </ul>
            </div>
            <div class="content" v-loading="tableLoading">
                <h2>{{activeGroup.name}}<span>{{activeGroup.count}}个任务</span> </h2>
                <div class="form flex-start-center">
                    <el-select v-model="form.groupId" placeholder="请选择" class="right_6" style="width: 140px;" @clear="changeQueueListGroup" @change="changeQueueListGroup" clearable>
                        <el-option
                        v-for="(item,index) in queueListGroup"
                        :key="index"
                        :label="item.groupName"
                        :value="item.groupId">
                        </el-option>
                    </el-select>
                    <el-select 
                        v-show="form.groupId" 
                        v-model="form.stageId" 
                        placeholder="请选择" 
                        class="right_6" 
                        @clear="form.stageId='全部阶段'; queueListPoint = [];" 
                        style="width: 140px;" 
                        @change="changeQueueListStage" 
                        :clearable="form.stageId=='全部阶段'?false:true">
                            <el-option
                            v-for="(item,index) in queueListStage"
                            :key="index"
                            :label="item.stageName"
                            :value="item.stageId">
                            </el-option>
                    </el-select>
                    <el-select 
                        v-show="form.groupId" 
                        v-model="form.pointId" 
                        placeholder="请选择" 
                        class="right_6" 
                        @clear="form.pointId='全部随访点';" 
                        style="width: 140px;" 
                        :clearable="form.pointId=='全部随访点'?false:true">
                            <el-option
                            v-for="(item,index) in queueListPoint"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                    </el-select>
                    <!-- <el-input
                        style="width: 300px;"
                        placeholder="请输入本人姓名或者住院号搜索"
                        v-model="form.keywords"
                        @keydown.enter.native="getDataList">
                        <i slot="prefix" class="icon el-icon-search"></i>
                    </el-input> -->
                    <el-button type="primary" icon="el-icon-search" @click="getDataList()">查 询</el-button>
                </div>
                <el-collapse v-model="activeCollapse" @change="handleChangeCollapse" accordion>
                    <el-collapse-item :name="index+'aaaa'" v-for="(item,index) in collapseList" :key="index">
                        <template slot="title">
                            <span class="number">{{item.count}}个任务</span>
                            <p class="title">{{item.visitTime}}</p>
                        </template>
                        <el-table v-if="item.tableRsp"  :data="item.tableRsp.body">
                            <el-table-column 
                                v-for="(column,columnIndex) in item.tableRsp.header"
                                :prop="column.prop" 
                                :label="column.label" 
                                sortable 
                                :key="item.visitTime+column.prop+'-'+columnIndex" 
                                align="center"
                                :min-width="column.label.length * 15 + 50"
                                :width="handleWidth(column.label)"
                                v-if="column.type =='normal'"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作" width="86" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button @click="" type="text" icon="icon iconfont iconzujian22"></el-button>
                                    <el-tooltip  class="item" effect="dark" placement="top">
                                        <div slot="content">计划时间：{{item.visitTime}}</div>
                                        <el-button @click="toReportFill(scope.row, scope.row.detail, scope.row.detail.crfId)" type="text" icon="icon iconfont iconbianji"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination :data="item" @change="getDataList"></pagination>    
                    </el-collapse-item>

                    <div v-if="emtpyData" class="empty flex-center-center flex-wrap" style="margin-top: 180px;">
                        <svg class="icon" aria-hidden="true" style="font-size: 170px;width:100%; text-align:center;">
                            <use xlink:href="#iconzu11"></use>
                        </svg>
                        <p class="text-center" style="font-size: 14px; color:#666;padding-top: 15px;">暂无内容</p>
                    </div>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
import pagination from 'components/packages/pagination/pagination';
export default {
    name: 'myTasks',
    data () {
        return {
            groupList: [
                {icon:'icondaifang', name: '待访问', count:null, value: 'entryingCount'},
                {icon:'iconshifang', name: '已失访', count:null, value: 'lostCount'},
                {icon:'iconzhongzhi', name: '已终止', count:null, value: 'endCount'},
                {icon:'iconwancheng1', name: '已完成', count:null, value: 'finishCount'},
                {icon:'iconquanbu', name: '全 部', count:null, value: 'allCount'}
            ],
            activeGroup: {},
            groupLoading: false,
            tableLoading: false,
            queueListGroup: [],
            queueListStage: [],
            queueListPoint: [],
            form: {
                groupId:'',
                stageId:'全部阶段',
                pointId:'全部随访点',
                keywords: ''
            },
            activeCollapse: 1,
            //折叠表格数据
            collapseList: [],
            emtpyData: false
        }
    },
    created() {
        this.getfollowUpList()
        this.getStatusList().then(()=>{
            this.getDataList();
        })
    },
    components: {
        pagination
    },
    methods: {
        handleWidth(label) {
            let width = '';
            if(label.indexOf('时间') != -1 || label.indexOf('日期') != -1) {
                width = 160
            }
            return width
        },
        selectGroup(item) {
            this.activeGroup = item;
            this.getDataList();
        },
        handleChangeCollapse(val) {
            console.log(val)
        },
        async getDataList() {
            this.tableLoading = true;
            let status = null;
            switch (this.activeGroup.value) {
                case 'entryingCount':   status = 1;break;
                case 'lostCount':   status = 2;break;
                case 'endCount':   status = 3;break;
                case 'finishCount':   status = 4;break;
                case 'allCount':   status = undefined;break;
                default: break;
            }
            try {
                let res = await this.$http.myTasksGetTableList({
                    "subjectId": this.$store.state.user.researchInfo.subjectInfoId,
                    "status": status,
                    "groupId": this.form.groupId,
                    "patientName": this.form.keywords,
                    "stageId": this.form.stageId=='全部阶段'?'':this.form.stageId,
                    "pointId": this.form.pointId=='全部随访点'?'':this.form.pointId,
                });
                if (res.code == '0') {
                    this.collapseList = res.data;
                    this.emtpyData = this.collapseList.length == 0;
                }
            } catch (err) {
                console.log(err)
            }
            this.tableLoading = false;
        },
        changeQueueListGroup(id) {
            this.form.stageId = '全部阶段';
            this.form.pointId = '全部随访点';
            
            if(!id) {
                return;
            }
            let data = this.queueListGroup.find(li=>{
                return li.groupId == id;
            })
            this.queueListStage = data.stages;
        },
        changeQueueListStage(id) {
            if(!id) {
                return;
            }
            let data = this.queueListStage.find(li=>{
                return li.stageId == id;
            })
            this.queueListPoint = data.pointList || [];
        },    
        //获取任务状态列表
        async getStatusList() {
            this.groupLoading = true;
            try {
                let res = await this.$http.myTasksGetStatusList({
                    subjectId: this.$store.state.user.researchInfo.subjectInfoId
                });
                if (res.code == '0') {
                    this.groupList.forEach(ele => {
                        if(typeof(res.data[ele.value]) == 'number') {
                            ele.count = res.data[ele.value];
                        }
                    });
                    this.activeGroup = this.groupList[0];
                }
            } catch (err) {
                console.log(err)
            }
            this.groupLoading = false;
        },
        //获取随访点列表
        async getfollowUpList() {
            try {
                let res = await this.$http.myTasksGetPointList({
                    subjectId: this.$store.state.user.researchInfo.subjectInfoId
                });
                if (res.code == '0') {
                    this.queueListGroup = res.data;
                }
            } catch (err) {
                console.log(err)
            }
        },
        //打开表单填写页面
        toReportFill(row,point,crfId) {
            if(!this.$store.state.user.researchAuth.authImport) {
                this.$mes('info','暂无操作权限!')
                return;
            }
            let group = this.queueListGroup.find(item=>{
                return item.stages.find(li=>{
                    return li.stageId == point.stageId
                })
            })
            let urlParameter={
                cacheData: false,
                note: point.note,
                formId: crfId || "",
                reportId: point.reportId || '',
                groupId: group && group.groupId,
                groupName: group && group.groupName,
                diseaseId: row.diseaseId || "",
                patientName: row.createTime +' ---  ',
                patientId: row.patientId || "",
                identify: row.identify || "",
                from: "followUpManagement",
                diseaseName: row.diseaseName || "",
                subjectName: row.subjectName || "",
                title: point.pointName,
                isModify:"displayShow",
                status: point.status,  
                pointPatientId: point.id,
                subjectId: this.$store.state.user.researchInfo.subjectInfoId,
                updateTime: point.updateTime || '',
                updator: point.updator || '',
            }
            console.log(urlParameter)
            localStorage.setItem('reportFill',JSON.stringify({urlParameter}));
            window.open('./subjectForm.html');
        },
    }
};
</script>

<style lang="less">
    .myTasks {
        .box {
            position: relative;
            height: 100%;
            color: #394263;
            .aside {                
                width: 220px;
                .aside_title {
                    font-size: 14px;
                    background-color: #fff;
                    line-height: 36px;
                    font-weight: bold;
                    text-indent: 20px;
                    border-bottom: 1px solid rgba(229, 235, 236, .7);
                }
                ul {
                    background-color: #fff;
                }
                li {
                    height: 40px;
                    line-height: 40px;
                    padding-left: 18px;
                    font-size: 14px;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                    &.active {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    &:hover {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    &:nth-child(1):hover .icon,
                    &:nth-child(1).active .icon {
                        color: #00B8DF;
                    }
                    &:nth-child(2):hover .icon,
                    &:nth-child(2).active .icon {
                        color: #F79E00;
                    }
                    &:nth-child(3):hover .icon,
                    &:nth-child(3).active .icon {
                        color: #394263;
                    }
                    &:nth-child(4):hover .icon,
                    &:nth-child(4).active .icon {
                        color: #DB5452;
                    }
                    &:nth-child(5):hover .icon,
                    &:nth-child(5).active .icon {
                        color: #00BE90;
                    }&:nth-child(6):hover .icon,
                    &:nth-child(6).active .icon {
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
                padding: 15px;
                overflow-y: auto;
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
                .form {
                    margin-bottom: 20px;
                    .el-input__prefix .icon {
                        font-size: 18px;
                        line-height: 32px;
                    }
                }
                .el-collapse {
                    border: none;
                    .el-collapse-item__header {
                        flex-direction: row-reverse;
                        justify-content: flex-end;
                        border: none;
                        .title {
                            font-size: 14px;
                            color: #394263;
                            margin-right: 10px;
                        }
                        .number {
                            color: #9CA0B1;
                        }
                        .el-collapse-item__arrow {
                            margin: 0 10px 0 0;
                            font-size: 16px;
                            color: #888;
                            &::before {
                                content: "\e791";
                            }
                        }
                    }
                    .el-collapse-item__content {
                        padding-bottom: 0;
                    }
                    .el-collapse-item__wrap {
                        border-top: 1px solid #EBEEF5;
                        .el-table {
                            padding: 0;
                            .el-table__body-wrapper {
                                min-height: 50px;
                            }
                        }
                    }

                }
            }
        }
    }
</style>




