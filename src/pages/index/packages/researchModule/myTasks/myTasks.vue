<template>
    <div class="cloud-component myTasks">
        <div class="box">
            <div class="aside">
                <p class="aside_title">随访任务</p>
                <ul v-loading="groupLoading" id="group">
                    <li v-for="(item, index) in groupList" :key="index" :class="index == activeGroup?'active':''" @click="selectGroup(item,index)">
                        <i class="icon iconfont" :class="item.icon" ></i>
                        <span v-if="!item.edit">{{item.name}}</span>
                        <el-input class="addOrg" v-else v-model="item.name"></el-input>
                    </li>
                </ul>
            </div>
            <div class="content">
                <h2>全部<span>3个任务</span> </h2>
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
                        @clear="form.stageId='全部阶段'; queueListPoint = []" 
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
                        @clear="form.pointId='全部随访点'" 
                        style="width: 140px;" 
                        :clearable="form.pointId=='全部随访点'?false:true">
                            <el-option
                            v-for="(item,index) in queueListPoint"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                    </el-select>
                    <el-input
                        style="width: 300px;"
                        placeholder="请输入本人姓名或者住院号搜索"
                        v-model="form.keywords"
                        @keydown.enter.native="getDataList">
                        <i slot="prefix" class="icon el-icon-search"></i>
                    </el-input>
                </div>
                <el-collapse v-model="activeCollapse" @change="handleChangeCollapse" accordion>
                    <el-collapse-item :name="index+'aaaa'" v-for="(item,index) in collapseList" :key="index">
                        <template slot="title">
                            <span class="number">{{item.patientCount}}个任务</span>
                            <p class="title">{{item.planDate}}</p>
                        </template>
                        <el-table-column 
                            v-for="(column,index) in item.header"
                            :prop="column.prop" 
                            :label="column.label" 
                            sortable 
                            :key="item.planDate+column.prop+'-'+index" 
                            align="center"
                            :min-width="column.label.length * 15 + 50"
                            :width="handleWidth(column.label)"
                            v-if="column.type =='normal'"
                            show-overflow-tooltip>
                        </el-table-column>
                        <!-- <el-table 
                            ref="refTable" fit
                            :data="item.content"
                            :v-loading="'tableLoading'+(index+1)">
                            <el-table-column prop="a" label="随访状态"></el-table-column>
                            <el-table-column prop="a" label="首次录入时间"></el-table-column>
                            <el-table-column prop="b" label="所在中心"></el-table-column>
                            <el-table-column prop="c" label="是否血液净化治疗"></el-table-column>
                            <el-table-column prop="d" label="阶段-随访点"></el-table-column>
                            <el-table-column label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button @click=";" type="text" icon="iconfont iconshanchu iconzujian41 info"></el-button>
                                    <el-button @click=";" type="text" icon="icon iconfont iconduanxin info"></el-button>
                                    <el-button @click=";" type="text" icon="icon iconfont iconzanting danger"></el-button>
                                </template>
                            </el-table-column>
                        </el-table> -->
                        <!-- 分页 -->
                        <pagination :data="item" @change="getDataList"></pagination>    
                    </el-collapse-item>
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
                {icon:'icondaifang', name: '待访问-0'},
                {icon:'iconshifang', name: '已失访-10'},
                {icon:'iconbuliangshijian', name: '不良事件-30'},
                {icon:'iconzhongzhi', name: '已终止-0'},
                {icon:'iconwancheng1', name: '已完成-10'},
                {icon:'iconquanbu', name: '全部-50'}
            ],
            activeGroup: 0,
            groupLoading: false,
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
            collapseList: [
                {
                    date: '2019-09-05',
                    content:[
                        {
                            a: ''
                        }
                    ]
                },
                {
                    date: '2019-09-01',
                    content:[
                        {
                            a: ''
                        }
                    ]
                }
            ]
        }
    },
    created() {
        // this.getStatusList();
        // this.getQuereList()
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
        selectGroup(item,index) {
            this.activeGroup = index;
        },
        handleChangeCollapse(val) {
            console.log(val)
        },
        async getDataList() {
            try {
                let res = await this.$http.myTasksGetTableList({
                    "subjectId": this.$store.state.user.researchInfo.subjectInfoId,
                    "status": 1,
                    "groupId": this.form.groupId,
                    "stageId": this.form.stageId=='全部阶段'?'':this.form.stageId,
                    "pointId": this.form.pointId=='全部随访点'?'':this.form.pointId,
                    "enterType": localStorage.getItem('CURR_LOGIN_TYPE') == "research"?0:1
                });
                if (res.code == '0') {
                    this.collapseList = res.data;
                }
            } catch (err) {
                console.log(err)
            }
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
            this.queueListPoint = data.pointList;
        },    
        //获取状态列表
        async getStatusList() {
            try {
                let res = await this.$http.myTasksGetStatusList({
                    subjectId: this.$store.state.user.researchInfo.subjectInfoId
                });
                if (res.code == '0') {
                    // this.groupList = res.data;
                    // this.groupList.forEach(ele => {
                    //     this.groupList[ele.visitStatus] = ele.statusCount;
                    // });
                    console.log(this.groupList)
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取查询列表
        async getQuereList() {
            try {
                let res = await this.$http.myTasksGetQuereList({
                    subjectId: this.$store.state.user.researchInfo.subjectInfoId
                });
                if (res.code == '0') {
                    this.queueListGroup = res.data;
                }
            } catch (err) {
                console.log(err)
            }
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




