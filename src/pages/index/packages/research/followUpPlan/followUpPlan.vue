<template>
    <div class="cloud-component followUpPlan">
        <div class="followUpPlan_content flex-start-start">
            <div class="left">
                <el-menu
                    default-active="1"
                    ref="refMenu"
                    :default-openeds="defaultOpeneds"
                    v-loading="groupLoading"
                    class="el-menu-vertical-demo">
                    <el-submenu v-for="(item, index) in menuList" :key="index" :index="item.groupId || '1'">
                        <template slot="title">
                            <span class="title">{{item.groupName}}</span>
                        </template>
                        <el-menu-item-group v-for="(li, liIndex) in item.stages" :key="liIndex"> 
                            <el-menu-item :index="li.stageId" class="flex-between-center menu_li" :class="li.stageId == activeGroup?'active':''" @click="selectGroup(li,li.stageId)">
                                <span v-if="!li.edit">{{li.stageName}}</span>
                                <el-popover
                                    placement="bottom"
                                    popper-class="more_popper"
                                    trigger="hover">
                                    <i  slot="reference" class="icon el-icon-more"></i>
                                    <ul class="stepThree_ul">
                                        <li @click="showAddDialog('编辑阶段',item,li)">编辑</li>
                                        <li @click="onDelete(li)">删除</li>
                                    </ul>
                                </el-popover>
                            </el-menu-item> 
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <el-menu-item :index="index+'_add'" class="flex-start-center addPlus">
                                <i class="icon el-icon-plus"></i>
                                <el-button type="text" @click="showAddDialog('添加阶段',item)">添加阶段</el-button>
                            </el-menu-item> 
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </div>
            <div class="right" v-loading="infoLoading">
                <p class="page_title">随访频次</p>
                <div class="wrap">
                    <el-form label-position="left" label-width="100px" :model="form">
                        <el-form-item label="随访次数">
                            <el-slider v-model="form.amount" :marks="marks" :min="4.7" :step="4.7" :format-tooltip="formatTooltip" @change="sliderChange"></el-slider>
                        </el-form-item>
                        <el-form-item label="随访名称" v-show="form.amount <= 96 ">
                            <el-input v-for="(item, index) in form.nameArr" :key="index" v-model="item.name" style="width:150px;margin:0 10px 10px 0;"></el-input>
                        </el-form-item>
                        <el-form-item label="随访频次">
                            <el-radio-group v-model="form.frequencyType">
                                <el-radio label="1">不限制频率</el-radio>
                                <el-radio label="2">均匀随访</el-radio>
                                <el-radio label="3">非均匀随访</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <div class="frequency flex-start-center" v-show="form.frequencyType=='2'">
                                <span class="right_6">每</span>
                                <el-input placeholder="请输入内容" v-model="form.frequency.frequencyParam" style="width:200px;"></el-input>
                                <el-select v-model="form.frequency.frequencyParam2" placeholder="请选择" class="special_select">
                                    <el-option label="天" value="day"></el-option>
                                    <el-option label="月" value="month"></el-option>
                                    <el-option label="年" value="year"></el-option>
                                </el-select>
                                <span class="left_6">随访一次</span>
                            </div>
                            <div class="frequency flex-start-center" v-show="form.frequencyType=='3'">
                                <span class="right_6">间隔</span>
                                <el-input placeholder="以逗号分隔,如：1,2,3" v-model="form.frequency.frequencyParam" style="width:200px;"></el-input>
                                <el-select v-model="form.frequency.frequencyParam2" placeholder="请选择" class="special_select">
                                    <el-option label="天" value="day"></el-option>
                                    <el-option label="月" value="month"></el-option>
                                    <el-option label="年" value="year"></el-option>
                                </el-select>
                                <span class="left_6">随访一次</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="开始时间">
                            <el-radio-group v-model="form.startType">
                                <el-radio label="1">手动触发开始</el-radio>
                                <el-radio label="2">入组后开始</el-radio>
                                <el-radio label="3">入组阶段时间题目触发开始</el-radio>
                                <el-radio label="4">某个阶段结束后触发开始</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <div class="frequency flex-start-center" v-show="form.startType=='2'">
                                <span class="right_6">入组后</span>
                                <el-input placeholder="请输入内容" v-model="form.startTimeParam.startParam" style="width:200px;"></el-input>
                                <el-select v-model="form.startTimeParam.startParam2" placeholder="请选择" class="special_select">
                                    <el-option label="天" value="天"></el-option>
                                    <el-option label="月" value="月"></el-option>
                                    <el-option label="年" value="年"></el-option>
                                </el-select>
                                <span class="left_6">开始</span>
                            </div>
                            <div class="frequency flex-start-center" v-show="form.startType=='3'">
                                <el-select v-model="form.startTimeParam.startParam" placeholder="请选择CRF" style="width:100px;">
                                    <el-option label="CRF(1)" value="CRF"></el-option>
                                    <el-option label="CRF(1)" value="CRF"></el-option>
                                </el-select>
                                <span class="right_6 left_6">中填写的</span>
                                <el-select v-model="form.startTimeParam.startParam2" placeholder="请选择题目" style="width:100px;">
                                    <el-option label="天" value="天"></el-option>
                                    <el-option label="月" value="月"></el-option>
                                    <el-option label="年" value="年"></el-option>
                                </el-select>
                                <span class="right_6 left_6">后</span>
                                <el-input placeholder="多少" v-model="form.startTimeParam.startParam3" style="width:100px;"></el-input>
                                <el-select v-model="form.startTimeParam.startParam4" placeholder="请选择" class="special_select">
                                    <el-option label="天" value="天"></el-option>
                                    <el-option label="月" value="月"></el-option>
                                    <el-option label="年" value="年"></el-option>
                                </el-select>
                                <span class="left_6">开始第一次随访</span>
                            </div>
                            <div class="frequency flex-start-center" v-show="form.startType=='4'">
                                <el-select v-model="form.startTimeParam.startParam" placeholder="请选择阶段" style="width:100px;">
                                    <el-option label="天" value="天"></el-option>
                                    <el-option label="月" value="月"></el-option>
                                    <el-option label="年" value="年"></el-option>
                                </el-select>
                                <span class="right_6 left_6">结束后</span>
                                <el-input placeholder="请输入内容" v-model="form.startTimeParam.startParam2" style="width:100px;"></el-input>
                                <el-select v-model="form.startTimeParam.startParam3" placeholder="请选择" class="special_select">
                                    <el-option label="天" value="天"></el-option>
                                    <el-option label="月" value="月"></el-option>
                                    <el-option label="年" value="年"></el-option>
                                </el-select>
                                <span class="left_6">开始第一次随访</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>

                <p class="page_title">随访内容</p>
                <div class="wrap">
                    <el-checkbox v-model="addCRFchecked">添加CFR</el-checkbox>
                    <div class="CRF_group" v-show="addCRFchecked">
                        <el-button><i class="el-icon-edit"></i> 添加或编辑CRF</el-button>
                    </div>
                </div>
                <div class="wrap">
                    <el-button type="primary" icon="icon iconfont iconzujian38" @click="">保 存</el-button>
                </div>
                
            </div>
        </div>

        <el-dialog 
            :title="dialgoForm.title" 
            :append-to-body="true"
            @close="closeDialog"
            :visible.sync="dialgoForm.visible" 
            width="45%">
            <el-form :model="dialgoForm" ref="dialgoForm" :rules="dialgoFormRules" label-width="110px"
                    class="ruleFormDialog" @submit.native.prevent v-loading="dialgoForm.loading" label-position="left">
                <el-form-item label="阶段名称：" prop="stageName">
                    <el-input 
                        v-model.trim="dialgoForm.stageName" 
                        placeholder="请输入阶段名称"
                        :maxlength="20"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="saveAddStage">保 存</el-button>
                <el-button @click="closeDialog">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'followUpPlan',
    data () {
        return {
            activeGroup: '',
            defaultOpeneds: [],
            menuList: [],
            groupLoading: false,
            infoLoading: false,
            form: {
                amount: 1,
                nameArr: [{name:'随访点1'}],
                frequency:{
                    frequencyParam:'',
                    frequencyParam2:'',
                },
                frequencyType: '',
                startType: '',
                startTimeParam: {
                    startParam:'',
                    startParam2:'',
                    startParam3:'',
                    startParam4:'',
                },
                startType: ''
            },
            dialgoForm: {
                groupId: '',
                stageId: '',
                visible: false,
                title: '',
                loading: false,
                stageName: ''
            },
            marks: {
                1:'1',
                24:'5',
                46:'10',
                74:'15',
                94:'20',
                100:'无限',
            },
            addCRFchecked: false,
            dialgoFormRules: {
                stageName: [
                    {required: true, message: '请输入阶段名称', trigger: 'change'}
                ]
            }
        }
    },
    created() {
        this.getGroupList()
        .then(()=>{
            if(this.menuList.length != 0) {
                this.menuList.forEach(item => {
                    this.defaultOpeneds.push(item.groupId)
                });
                // this.selectGroup(this.menuList[0].stages[0],0);
            }
        })
    },
    methods: {
        selectGroup(li,index) {
            this.activeGroup = index;
            this.getInfo(li.stageId)
        },
        async getInfo(stageId) {
            this.infoLoading = true;
            let params = {
                id: stageId
            }
            try {
                let res = await this.$http.followUpPlanPlanInfo(params);
                if (res.code == '0') {

                }else {
                    this.$mes('error', res.msg);
                }
                this.infoLoading = false;
            } catch (err) {
                this.infoLoading = false;
                console.log(err)
            }
        },
        async createInfo(stageId) {
            this.infoLoading = true;
            let params = {
                "stageId": "string",
                "amount": 0,
                "frequencyType": 0,
                "frequencyParam": "string",
                "frequencyParam2": "string",
                "startType": 0,
                "startParam": "string",
                "startParam2": "string",
                "startParam3": "string",
                "startParam4": "string",
                "crfId": "string",
                "pointNames": [
                    {
                    "id": "string",
                    "name": "string"
                    }
                ]
            }
            try {
                let res = await this.$http.followUpPlanPlanInfo(params);
                if (res.code == '0') {

                }else {
                    this.$mes('error', res.msg);
                }
                this.infoLoading = false;
            } catch (err) {
                this.infoLoading = false;
                console.log(err)
            }
        },
        async getGroupList() {
            this.groupLoading = true;
            let params = {
                id: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.followUpPlanStageList(params);
                if (res.code == '0') {
                    this.menuList = res.data;
                }else {
                    this.menuList = []
                    this.$mes('error', res.msg);
                }
                this.groupLoading = false;
            } catch (err) {
                this.groupLoading = false;
                console.log(err)
            }
        },
        showAddDialog(title,item,li) {
            if(title=='编辑阶段') {
                this.dialgoForm = {
                    groupId: item.groupId,
                    stageId: li.stageId,
                    visible: true,
                    title: title,
                    loading: false,
                    stageName: li.stageName
                }
            }else {
                this.dialgoForm = {
                    groupId: item.groupId,
                    stageId: '',
                    visible: true,
                    title: title,
                    loading: false,
                    stageName: '',
                }
            }
        },
        //保存新建||编辑
        saveAddStage() {
            let that = this;
            that.$refs.dialgoForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                this.dialgoForm.visible = true;
                this.dialgoForm.loading = true;
                let params,res;
                try {
                    if(that.dialgoForm.title == "编辑阶段"){
                        params = {
                            stageId: this.dialgoForm.stageId,
                            stageName: this.dialgoForm.stageName
                        }
                        console.log(params)
                        res = await that.$http.followUpPlanStageEdit(params);
                    }else{
                        params = {
                            groupId: this.dialgoForm.groupId,
                            stageName: this.dialgoForm.stageName,
                            subjectId: this.$store.state.user.researchID
                        }
                        res = await that.$http.followUpPlanStageAdd(params);
                    }
                    if (res.code == '0') {
                        this.$mes('success',  res.msg || this.dialgoForm.title+'成功!');
                        this.dialgoForm.visible = false;
                    }else {
                        this.$mes('success',  res.msg || this.dialgoForm.title+'失败');
                    }
                    this.dialgoForm.loading = false;
                    that.getGroupList();
                } catch (error) {
                    this.$mes('error',  data.msg);
                    this.dialgoForm.visible = false;
                    this.dialgoForm.loading = false;
                }
            });
        },
        onDelete (row) {
            this.$confirm('确认删除'+row.stageName+'？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let formData = {
                    id: row.stageId
                };
                try {
                    let data = await this.$http.followUpPlanstageDelete(formData);
                    if (data.code == '0') {
                        this.$mes('success',data.message || '删除成功');
                    }else {
                        this.$mes('error', '删除出错');
                    }
                    that.getGroupList();
                } catch (error) {
                    console.log(error)
                }
            }).catch((error) => {});
        },
        formatTooltip(val) {
            let n = Math.floor(val / 4.7);
            if(n > 20) {
                return '无限';
            }
            return n;
        },
        sliderChange(val) {
            this.form.amount = val;
            let n = Math.floor(val / 4.7);
            this.form.nameArr = [];
            if(n > 20) {
                return;
            }
            for (let i = 1; i <= n; i++) {
                this.form.nameArr.push({
                    name: '随访点'+ i
                })
            }
        },
        closeDialog() {
            this.dialgoForm = {
                groupId: '',
                stageId: '',
                visible: false,
                title: '',
                loading: false,
                stageName: ''
            }
            this.$refs.dialgoForm.resetFields();
        }
    }
};
</script>

<style lang="less">
    @import url('../css/common.less');
    .followUpPlan_content {
        height: 100%;
        .left {
            width: 240px;
            height: 100%;
            margin-right: 20px;
            padding: 6px 0;
            .el-menu {
                border: none;
                overflow-y: hidden;
                overflow-x: hidden;
                background-color: #fff;
                .el-menu--inline {
                    overflow: hidden;
                }
                .el-menu-item.is-active {
                    color: #333;
                }
                
                .el-submenu__title {
                    line-height: 40px;
                    height:  40px;
                    padding: 0 15px;
                    border-bottom: 1px solid #eee;
                    .title {
                        color: #384163;
                    }
                }
                .el-menu-item-group {
                    .menu_li {
                        line-height: 36x;
                        height: 36px;
                        padding: 0 15px 0 30px !important;
                        border-left: 3px solid transparent;
                        &.active {
                            background-color: rgba(245, 247, 250, .7);
                            border-color: #1bbae1;
                            color: #1bbae1;
                        }
                        &:hover {
                            background-color: rgba(245, 247, 250, .7);
                            border-color: #1bbae1;
                            color: #1bbae1;
                        }
                        .icon {
                            color: #999;
                            margin-left: 6px;
                            &:hover {
                                color: #1bbae1;
                            }
                        }
                    }
                    .addPlus {
                        color: #1bbae1;
                        line-height: 36px;
                        height: 36px;
                        padding: 0 15px 0 30px !important;
                        &:hover {
                            background-color: #fff;
                        }
                        .icon {
                            color: #1bbae1;
                        }
                        .el-button {
                            padding-left: 5px;
                        }
                    }
                }
                .el-menu-item-group__title {
                    display: none;
                }
                .el-submenu__icon-arrow::before{
                    content: '\e790'
                }
            }
        }
        .right {
            flex: 1;
            overflow-y: auto;
            height: 100%;
            padding: 18px;
            background-color: #fff;
            .el-form {
                .el-form-item {
                    .frequency {
                        color: #394263;
                        .el-input__inner {
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                        }
                        .special_select {
                            width: 60px;
                            .el-input__inner {
                                border-radius: 0;
                                border-left: none;
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                                &:focus {
                                    border-color: #DCDFE6 !important;
                                }
                                .el-input__icon {
                                    width: 16px;
                                }
                            }
                        }
                    }
                }
                .el-slider {
                    width: 600px;
                    .el-slider__button {
                        border-color: #1BBAE1;
                    }
                    .el-slider__bar {
                        background-color: #1BBAE1;
                    }
                    .el-slider__marks-text:last-child {
                        padding-left: 28px;
                        width: 60px;
                    }
                }
            }
            .wrap {
                margin: 30px 0 35px 50px;
            }
            .CRF_group {
                margin-top: 15px;
                .el-button {
                    line-height: 68px;
                    width: 260px;
                    color: #1BBAE1;
                    border: 1px dashed #1BBAE1;
                }
            }
        }
    }
</style>