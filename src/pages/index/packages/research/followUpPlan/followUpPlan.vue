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
                            <el-menu-item :index="li.stageId" class="flex-between-center menu_li" :class="li.stageId == activeGroup?'active':''" @click="selectGroup(li,item)">
                                <span>{{li.stageName}}</span>
                                <el-popover
                                    v-if="!li.crfId"
                                    placement="bottom"
                                    popper-class="more_popper"
                                    trigger="hover">
                                    <i  slot="reference" class="icon el-icon-more"></i>
                                    <ul class="stepThree_ul">
                                        <li  @click="showAddDialog('编辑阶段',item,li)">编辑</li>
                                        <li  @click="onDelete(li)">删除</li>
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
                <div v-if="isExistStage">
                    <p class="page_title">随访频次</p>
                    <div class="wrap">
                        <el-form label-position="left" label-width="100px" :model="form">
                            <el-form-item label="随访次数">
                                <el-slider v-model="form.amount" :disabled="configExists" :marks="marks" :min="1" :max="21" :step="1" :format-tooltip="formatTooltip" @change="sliderChange"></el-slider>
                            </el-form-item>
                            <el-form-item label="随访点名称" v-show="form.amount <= 20 ">
                                <el-input :disabled="configExists" v-for="(item, index) in form.pointNames" :key="index" v-model="item.name" style="width:150px;margin:0 10px 10px 0;"></el-input>
                            </el-form-item>
                            <el-form-item label="随访频次">
                                <el-radio-group :disabled="configExists" v-model="form.frequencyType">
                                    <el-radio label="1" :disabled="true">不限制频率</el-radio>
                                    <el-radio label="2">均匀随访</el-radio>
                                    <el-radio label="3">非均匀随访</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="">
                                <div class="frequency flex-start-center" v-show="form.frequencyType=='2'">
                                    <span class="right_6">每</span>
                                    <el-input :disabled="configExists" placeholder="请输入内容" v-model="form.frequency.frequencyParam" style="width:200px;"></el-input>
                                    <el-select :disabled="configExists" v-model="form.frequency.frequencyParam2" placeholder="请选择" class="special_select">
                                        <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <span class="left_6">随访一次</span>
                                </div>
                                <div class="frequency flex-start-center" v-show="form.frequencyType=='3'">
                                    <span class="right_6">间隔</span>
                                    <el-input :disabled="configExists" placeholder="以逗号分隔,如：1,2,3" v-model="form.frequency.frequencyParam" style="width:200px;"></el-input>
                                    <el-select :disabled="configExists" v-model="form.frequency.frequencyParam2" placeholder="请选择" class="special_select">
                                        <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <span class="left_6">随访一次</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="开始时间">
                                <el-radio-group :disabled="configExists" v-model="form.startType">
                                    <el-radio label="1">手动触发开始</el-radio>
                                    <el-radio label="2">入组后开始</el-radio>
                                    <el-radio label="3">入组阶段时间题目触发开始</el-radio>
                                    <el-radio label="4">某个阶段结束后触发开始</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="">
                                <div class="frequency flex-start-center" v-show="form.startType=='2'">
                                    <span class="right_6">入组后</span>
                                    <el-input placeholder="请输入内容" :disabled="configExists" v-model="form.startTimeParam.startParam" style="width:200px;"></el-input>
                                    <el-select :disabled="configExists" v-model="form.startTimeParam.startParam2" placeholder="请选择" class="special_select">
                                        <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <span class="left_6">开始</span>
                                </div>
                                <div class="frequency flex-start-center" v-show="form.startType=='3'">
                                    <el-select :disabled="configExists" @change="crfSelect" v-model="form.startTimeParam.startParam" placeholder="请选择CRF" style="width:120px;">
                                        <el-option v-for="(item,index) in crfList" :key="index" :label="item.crfName" :value="item.crfId"></el-option>
                                    </el-select>
                                    <span class="right_6 left_6">中填写的</span>
                                    <el-select :disabled="configExists" v-model="form.startTimeParam.startParam2" placeholder="请选择题目" style="width:120px;">
                                        <el-option v-for="(item,index) in crfDateList" :key="index" :label="item.formItemName" :value="item.path"></el-option>
                                    </el-select>
                                    <span class="right_6 left_6">后</span>
                                    <el-input :disabled="configExists" placeholder="多少" v-model="form.startTimeParam.startParam3" style="width:120px;"></el-input>
                                    <el-select :disabled="configExists" v-model="form.startTimeParam.startParam4" placeholder="请选择" class="special_select">
                                        <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <span class="left_6">开始第一次随访</span>
                                </div>
                                <div class="frequency flex-start-center" v-show="form.startType=='4'">
                                    <el-select :disabled="configExists" v-model="form.startTimeParam.startParam" placeholder="请选择阶段" style="width:120px;">
                                        <el-option v-for="(item, index) in releaseStage" :key="index" :label="item.stageName" :value="item.stageId"></el-option>
                                    </el-select>
                                    <span class="right_6 left_6">结束后</span>
                                    <el-input :disabled="configExists" placeholder="请输入内容" v-model="form.startTimeParam.startParam2" style="width:120px;"></el-input>
                                    <el-select :disabled="configExists" v-model="form.startTimeParam.startParam3" placeholder="请选择" class="special_select">
                                        <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <span class="left_6">开始第一次随访</span>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>

                    <p class="page_title">随访内容</p>
                    <div class="wrap flex-start-start">
                        <!-- <el-checkbox v-model="addCRFchecked">添加CFR</el-checkbox> -->
                        <div class="CRF_group" v-if="crfName">
                            <div class="crf_box crf_box1 flex-between-center" @click="showCrfDialog">
                                <i class="el-icon-edit">{{crfName}}</i><i class="icon iconfont iconfuhao3"></i>
                            </div>
                        </div>
                        <div class="CRF_group left_6" v-else>
                            <div class="crf_box flex-center-center" @click="showCrfDialog">
                                <i class="el-icon-edit"></i> 添加或编辑CRF
                            </div>
                        </div>
                    </div>
                    <div class="wrap">
                        <el-button type="primary" icon="icon iconfont iconzujian38" @click="saveConfig">保 存</el-button>
                    </div>
                </div>
                <div v-show="!isExistStage" class="guide flex-center-center">
                    <img src="../images/guide_followUpPlan.png" alt="引导图">
                </div>
            </div>
        </div>

        <el-dialog 
            :title="dialgoForm.title" 
            :append-to-body="true"
            @close="closeDialog"
            class="height_auto"
            :visible.sync="dialgoForm.visible" 
            width="45%">
            <el-form :model="dialgoForm" ref="dialgoForm" :rules="dialgoFormRules" label-width="110px"
                    class="ruleFormDialog" @submit.native.prevent v-loading="dialgoForm.loading" label-position="left">
                <el-form-item label="阶段名称：" prop="stageName">
                    <el-input 
                        v-model.trim="dialgoForm.stageName" 
                        placeholder="请输入阶段名称"
                        :maxlength="20"
                        @keyup.enter.native='saveAddStage'
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="saveAddStage">保 存</el-button>
                <el-button @click="closeDialog">关 闭</el-button>
            </div>
        </el-dialog>

        <refForm v-if="dialgoCrfForm.visible" ref="refForm" :dialogForm="dialgoCrfForm" @save="handleSave" :options="options"></refForm>
    </div>
</template>

<script>
import refForm from '../crfForm/crfForm'
import utils from 'components/utils/index';
export default {
    name: 'followUpPlan',
    data () {
        return {
            activeGroup: '',
            isExistStage: true,
            defaultOpeneds: [],
            menuList: [],
            crfList: [],
            crfDateList: [],
            groupLoading: false,
            infoLoading: false,
            configExists: false,    //是否可编辑表单
            form: {
                stageId:'',
                amount: 5,
                pointNames: [],
                frequency:{
                    frequencyParam:'',
                    frequencyParam2:'day',
                },
                frequencyType: '2',
                startType: '1',
                startTimeParam: {
                    startParam:'',
                    startParam2:'',
                    startParam3:'',
                    startParam4:'',
                },
                crfId:''
            },
            crfName:'',
            releaseStage:[],  //当前分组下已发布的阶段
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
                5:'5',
                10:'10',
                15:'15',
                20:'20',
                21:'无限',
            },
            dateSelectList: [
                {label: '天', value: 'day'},
                {label: '月', value: 'month'},
                {label: '年', value: 'year'},
            ],
            addCRFchecked: false,
            dialgoFormRules: {
                stageName: [
                    {required: true, message: '请输入阶段名称', trigger: 'change'}
                ]
            },
            dialgoCrfForm: {
                visible: false,
                title: '',
                loading: false,
            },
            options:{
                researchType:"followUpPlan",
                backStatus:"2",
                saveStatus: '2',
                title:"新增CRF表单"
            }
        }
    },
    components: {
        refForm
    },
    created() {
        this.getGroupList()
        .then(()=>{
            if(this.menuList.length != 0) {
                this.menuList.forEach(item => {
                    this.defaultOpeneds.push(item.groupId)
                });
                let currentStage = this.menuList.find(li=>{
                    return li.stages.length != 0;
                })
                if(currentStage && currentStage.length != 0) {
                    this.selectGroup(currentStage.stages[0]);
                }
            }
        })
        this.getCrfList();
    },
    watch: {
        'form.frequencyType': function(newVal) {
            if(this.configExists) {
                return;
            }
            switch (newVal) {
                case '2': 
                    this.form.frequency = {
                        frequencyParam:'',
                        frequencyParam2:'day',
                    };break;
                case '3': 
                    this.form.frequency = {
                        frequencyParam:'',
                        frequencyParam2:'day',
                    };break;
            }
        },
        'form.startType': function(newVal) {
            if(this.configExists) {
                return;
            }
            switch (newVal) {
                case '2': 
                    this.form.startTimeParam = {
                        startParam:'',
                        startParam2:'day',
                        startParam3:'',
                        startParam4:'',
                    };break;
                case '3': 
                    this.form.startTimeParam = {
                        startParam:'',
                        startParam2:'',
                        startParam3:'',
                        startParam4:'day',
                    };break;
                case '4': 
                    this.form.startTimeParam = {
                        startParam:'',
                        startParam2:'',
                        startParam3:'day',
                        startParam4:'',
                    };break;
                default:
                    this.form.startTimeParam = {
                        startParam:'',
                        startParam2:'',
                        startParam3:'',
                        startParam4:'',
                    };break;
            }
        }
    },
    methods: {
        selectGroup(li,item) {
            this.initFrom();
            this.activeGroup = li.stageId;
            this.form.stageId = li.stageId;
            if(item) {
                //处理当前分组下已发布的阶段
                this.releaseStage =  item.stages.filter(n=>{
                    return n.crfId && n.stageId != li.stageId;
                })
            }
            //发布阶段
            if(li.crfId) {
                this.getConfigInfo(li.stageId);
            }
        },
        //获取阶段配置信息
        async getConfigInfo(stageId) {
            this.infoLoading = true;
            let params = {
                id: stageId
            }
            try {
                let res = await this.$http.followUpPlanPlanInfo(params);
                if (res.code == '0') {
                    if(res.data.points.length) {
                        this.configExists = true;
                    }
                    if(res.data.crfId) {
                        this.addCRFchecked = true;
                        this.getCrfInfo(res.data.crfId)
                    }
                    if(res.data.startType == 3) {
                        this.crfList.forEach(item=>{
                            if(item.crfId == res.data.startParam) {
                                res.data.startParam = item.crfName;
                            }
                        })
                    }
                    this.form = {
                        stageId: stageId,
                        amount: res.data.amount,
                        pointNames: res.data.points,
                        frequency: {
                            frequencyParam:  res.data.frequencyParam,
                            frequencyParam2: res.data.frequencyParam2,
                        },
                        frequencyType: String(res.data.frequencyType),
                        startType: String(res.data.startType),
                        startTimeParam: {
                            startParam: res.data.startParam,
                            startParam2: res.data.startParam2,
                            startParam3: res.data.startParam3,
                            startParam4: res.data.startParam4,
                        },
                        crfId: res.data.crfId || ''
                    }
                }
                this.infoLoading = false;
            } catch (err) {
                this.infoLoading = false;
                console.log(err)
            }
        },
        //保存
        async saveConfig() {
            let pointNamesNull = this.form.pointNames.every(item=>{
                return item.name
            })
            if(!pointNamesNull) {
                this.$mes('info','随访点名称不能为空!')
                return
            }
            if(utils.isRepeat(this.form.pointNames)) {
                this.$mes('info','随访点名称不能相同!')
                return
            }
            switch (parseInt(this.form.frequencyType)) {
                case 2:
                    if(!this.form.frequency.frequencyParam) {
                        this.$mes('info','请输入均匀随访内容'); 
                        return
                    }
                    break;
                case 3:
                    if(!this.form.frequency.frequencyParam) {
                        this.$mes('info','请输入非均匀随访内容') ;
                        return
                    }
                    break;
                default: 
                    break;
            }
            switch (parseInt(this.form.startType)) {
                case 2:
                    if(!this.form.startTimeParam.startParam) {
                        this.$mes('info','请输入入组后开始内容');
                        return
                    }
                    break;
                case 3:
                    if(!this.form.startTimeParam.startParam || !this.form.startTimeParam.startParam2 || !this.form.startTimeParam.startParam3) {
                        this.$mes('info','请输入入组阶段时间题目触发开始内容');
                        return
                    }
                    break;
                case 4:
                    if(!this.form.startTimeParam.startParam || !this.form.startTimeParam.startParam2) {
                        this.$mes('info','请输入某个阶段结束后触发开始内容');
                        return
                    }
                    break;
                default: 
                    break;
            }
            //随访点次数校验
            let frequency = this.form.frequency.frequencyParam.split(',');
            //输入整数校验
            let isRight = frequency.every(item=>{
                return item && Number(item);
            })
            if(this.form.frequencyType == '3') {
                if(frequency.length != this.form.amount - 1) {
                    this.$mes('info','随访频次个数应为随访次数减1!')
                    return;
                }
                if(!isRight) {
                    this.$mes('info','非均匀随访间隔格式错误!')
                    return;
                }
            }
            if(!this.form.crfId) {
                this.$mes('info','请添加随访内容信息!')
                return
            }
            this.infoLoading = true;
            let params = {
                stageId: this.form.stageId,
                amount: this.form.amount,
                frequencyType: parseInt(this.form.frequencyType),
                frequencyParam: this.form.frequency.frequencyParam,
                frequencyParam2: this.form.frequency.frequencyParam2,
                startType: parseInt(this.form.startType),
                startParam: this.form.startTimeParam.startParam,
                startParam2: this.form.startTimeParam.startParam2,
                startParam3: this.form.startTimeParam.startParam3,
                startParam4: this.form.startTimeParam.startParam4,
                crfId: this.form.crfId,
                pointNames: this.form.pointNames
            }
            if(this.form.amount > 20) {
                this.$mes('info','无限次数待完善中...')
                return;
            }
            try {
                let res;
                if(this.configExists) {
                    res = await this.$http.followUpPlanPlanEdit(params);
                }else {
                    res = await this.$http.followUpPlanPlanAdd(params);
                }
                if (res.code == '0') {
                    this.$mes('success', '保存成功!');
                }else {
                    this.$mes('error', res.msg);
                }
                this.getConfigInfo(this.form.stageId);
                this.getGroupList();
                this.infoLoading = false;
            } catch (err) {
                this.infoLoading = false;
                console.log(err)
            }
        },
        //获取crf表单列表
        async getCrfList() {
            let params = {
                subjectInfoId: this.$store.state.user.researchInfo.subjectInfoId,
            }
            try {
                let res = await this.$http.researchObjectCrfList(params);
                if (res.code == '0') {
                    this.crfList = res.data;
                }
            } catch (err) {
                console.log(err)
            }
        },
        //表单下拉改变事件
        crfSelect(id) {
            this.getCrfDateList(id)
        },
        //获取crf表单列表的日期下拉列表
        async getCrfDateList(id) {
            this.crfDateList = [];
            this.form.startTimeParam.startParam2 = '';
            let params = {
                crfId: id
            }
            try {
                let res = await this.$http.followUpPlanDateList(params);
                if (res.code == '0') {
                    this.crfDateList = res.data;
                }
            } catch (err) {
                console.log(err)
            }
        },
        initFrom() {
            this.configExists = false;
            this.addCRFchecked = false;
            this.crfName = '';
            this.form = {
                stageId:'',
                amount: 1,
                pointNames: [{id:'',name:'随访点1'}],
                frequency:{
                    frequencyParam:'',
                    frequencyParam2:'day'
                },
                frequencyType: '2',
                startType: '1',
                startTimeParam: {
                    startParam:'',
                    startParam2:'',
                    startParam3:'',
                    startParam4:''
                },
                crfId:''
            }
        },
        async getGroupList() {
            this.groupLoading = true;
            let params = {
                id: this.$store.state.user.researchInfo.subjectInfoId,
            }
            try {
                let res = await this.$http.followUpPlanStageList(params);
                if (res.code == '0') {
                    this.menuList = res.data;
                    this.isExistStage = this.menuList.some(item=>{
                        return item.stages.length != 0;
                    })
                }else {
                    this.menuList = []
                    this.isExistStage = false;
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
                let currentGroup = this.menuList.find(li=>{
                    return li.groupId == item.groupId 
                })
                this.dialgoForm = {
                    groupId: item.groupId,
                    stageId: '',
                    visible: true,
                    title: title,
                    loading: false,
                    stageName: '阶段'+(currentGroup.stages.length+1),
                }
            }
        },
        //保存新建||编辑阶段
        saveAddStage() {
            let that = this;
            that.$refs.dialgoForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                for (let i = 0; i < this.menuList.length; i++) {
                    if(this.menuList[i].groupId== this.dialgoForm.groupId) {
                        for (let j = 0; j < this.menuList[i].stages.length; j++) {
                            if(this.menuList[i].stages[j].stageName == this.dialgoForm.stageName) {
                                this.$mes('info', '阶段名称不能相同');
                                return;
                            }
                            
                        }
                    }
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
                        res = await that.$http.followUpPlanStageEdit(params);
                    }else{
                        params = {
                            groupId: this.dialgoForm.groupId,
                            stageName: this.dialgoForm.stageName,
                            subjectId: this.$store.state.user.researchInfo.subjectInfoId,
                        }
                        res = await that.$http.followUpPlanStageAdd(params);
                    }
                    if (res.code == '0') {
                        this.initFrom();
                        this.activeGroup = res.data;
                        this.form.stageId = res.data;
                        this.dialgoForm.visible = false;
                    }else {
                        this.$mes('success',  res.msg || this.dialgoForm.title+'失败');
                    }
                    this.dialgoForm.loading = false;
                    this.getGroupList();
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
                        this.getGroupList();
                    }else {
                        this.$mes('error', '删除出错');
                    }
                } catch (error) {
                    console.log(error)
                }
            }).catch((error) => {});
        },
        formatTooltip(val) {
            if(val > 20) {
                return '无限';
            }
            return val;
        },
        sliderChange(val) {
            this.form.amount = val;
            this.form.pointNames = [];
            if(val > 20) {
                return;
            }
            for (let i = 1; i <= val; i++) {
                this.form.pointNames.push({
                    id: '',
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
        },
        //查看表单
        showCrfDialog() {
            this.dialgoCrfForm.visible = true;
            if(this.form.crfId) {
                this.$nextTick(()=>{
                    this.$refs.refForm.$refs.createForm.previewCRFList(this.form.crfId)
                    this.$refs.refForm.$refs.createForm.formId = this.form.crfId;
                })
            }
        },
        //保存表单回调
        handleSave(data) {
            if(data.code == 0) {
                this.form.crfId = data.data.id;
                this.getCrfInfo(this.form.crfId)
                this.dialgoCrfForm.visible = false;
                this.$mes('success','添加成功!')
            }else {
                this.$mes('error','添加失败!')
            }
        },
        //获取crf表单列信息
        async getCrfInfo(id) {
            let params = {
                crfId: id
            }
            try {
                let res = await this.$http.followUpPlanCrfSimplePreview(params);
                if (res.code == '0') {
                    this.crfName = res.data.crfName
                }
            } catch (err) {
                console.log(err)
            }
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
                        font-weight: bold;
                    }
                }
                .el-menu-item-group {
                    .menu_li {
                        line-height: 36x;
                        height: 36px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 100%;
                        overflow: hidden;
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
                                height: 32px !important;
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
                    .el-slider__runway:not(.disabled) .el-slider__bar {
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
                .crf_box {
                    line-height: 68px;
                    padding: 0 20px;
                    width: 260px;
                    color: #1BBAE1;
                    cursor: pointer;
                    border: 1px dashed #1BBAE1;
                    &.crf_box1 {
                        color: #394263;
                        border: 1px solid #999;
                        &:hover {
                            border-color: #1BBAE1;
                        }
                    }
                }
            }
        }
        .guide {
            height: 100%;
        }
        .el-select .el-input .el-input__inner {
            height: 32px !important;
        }
    }
</style>