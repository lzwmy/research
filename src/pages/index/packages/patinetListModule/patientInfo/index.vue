<template>
    <div class="cloud-component patientInfo">
        <div class="component_head flex-between-center">
            <div class="left flex-start-center">
                <el-button @click="$emit('back')" icon='el-icon-back' type="text">返回</el-button>
                <i class="line"></i>
                <span class="name">{{personalInfo.PATIENT_NAME}}
                    <span class="showTreatmentStatus"
                        :class="[{TODO:treatmentStatus=='TODO',HEAL:treatmentStatus=='HEAL',IMPROVE:treatmentStatus=='IMPROVE',INVALID:treatmentStatus=='INVALID',WORSEN:treatmentStatus=='WORSEN'}]"
                        @click="openTreatmentDrawer">
                        {{treatmentStatus=='TODO'?'待访':treatmentStatus=='HEAL'?'治愈':treatmentStatus=='IMPROVE'?'好转':treatmentStatus=='INVALID'?'无效':treatmentStatus=='WORSEN'?'恶化':'无治疗结果'}}
                    </span>
                </span>
                <span>性别: {{personalInfo.GENDER_NAME}}</span>
                <span>就诊年龄: {{personalInfo.AGE}}</span>
                <span>手机号: </span>
            </div>
            <div class="right flex-end-center">
                <el-button :type="openId?'primary':'default'" icon="icon iconfont iconweixin1" class="weChat" @click="sendPatientCode">微信相关</el-button>
                <el-button type="primary" icon="icon iconfont iconquanjingshitu" class="view" @click="onLinkView360">全景视图</el-button>
                <el-button type="primary" icon="icon iconfont icontianjia" class="report" @click="showDialogReport">添加报告</el-button>
            </div>
        </div>

        <div class="container flex-between-center">
            <div class="content">
                <patientInfoDetail ref="refPatientInfoDetail"  v-if="!showReportComponent" class="timeline" :reportFillData="reportFillData" :dataInfo="dataInfo"></patientInfoDetail>
                <report-list ref="patientDetail" v-if="showReportComponent" class="reportList" :reportFillData="reportFillData"></report-list>
                <div class="group_btn">
                    <el-button type="primary" icon="icon iconfont iconzujian19" :class="!showReportComponent?'active':''" @click="handleComponent(false)"></el-button>
                    <el-button type="primary" icon="icon iconfont iconzujian18" :class="showReportComponent?'active':''" @click="handleComponent(true)"></el-button>
                </div>
            </div>
            <div class="aside">
                <div class="top">
                    <h3 class="flex-between-center">
                        <span>随访提醒</span>
                        <i class="icon iconfont iconzujian14 cur_pointer" @click="showDialog"></i>
                    </h3>
                    <div class="li flex-start-start">
                        <p><i class="icon iconfont iconshezhi"></i>设置</p>
                        <div class="cont">
                            <p>{{remindDetail.remindRsp && remindDetail.remindRsp.timingDesc}}</p>
                            <p>{{remindDetail.remindRsp && remindDetail.remindRsp.startTime}} 
                                {{remindDetail.remindRsp && remindDetail.remindRsp.endTime?'至 '+remindDetail.remindRsp.endTime:''}}</p>
                        </div>
                    </div>
                    <div class="li flex-start-start">
                        <p><i class="icon iconfont iconxitongguanlibeifen"></i>下次时间</p>
                        <div class="cont">
                            <p class="cur_pointer" @click="toReportFill(remindDetail.remindDataRsp)" v-if="remindDetail.remindDataRsp && remindDetail.remindDataRsp.planVisitDate">{{ remindDetail.remindDataRsp && remindDetail.remindDataRsp.planVisitDate}}</p>
                            <em v-else>(空)</em>
                        </div>
                    </div>
                </div>
                <div class="record">
                    <h3 class="flex-between-center">
                        <span>操作记录</span>
                    </h3>
                    <el-timeline>
                        <el-timeline-item 
                            v-for="(item, index) in record" 
                            :key="index" 
                            :timestamp="item.createTime" 
                            placement="top">
                            <p>{{item.content}}</p>
                        </el-timeline-item>
                    </el-timeline>
                    <img v-show="record.length == 0" src="./../images/option_info.png" alt="">
                </div>
            </div>
        </div>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            :wrapperClosable="false"
            :show-close="false"
            custom-class="demo-drawer"
            direction="rtl"
            ref="drawer"
            size="32%">
            <div class="demo-drawer__content">
                <div style="flex: 1">
                <div class="patient_state">病人状态:</div>
                <div class="state_sort">
                    <span style="background-color: #0190DE;" @click="checkStatus('TODO')">
                    <i class="iconfont iconxuanzhong" v-show="treatmentStatus=='TODO'"></i>
                    待访
                    </span>
                    <span style="background-color: #0FBB93" @click="checkStatus('HEAL')">
                    <i class="iconfont iconxuanzhong" v-show="treatmentStatus=='HEAL'"></i>
                    治愈
                    </span>
                    <span style="background-color: #8EC466" @click="checkStatus('IMPROVE')">
                    <i class="iconfont iconxuanzhong" v-show="treatmentStatus=='IMPROVE'"></i>
                    好转
                    </span>
                    <span style="background-color: #04B8DD" @click="checkStatus('INVALID')">
                    <i class="iconfont iconxuanzhong" v-show="treatmentStatus=='INVALID'"></i>
                    无效
                    </span>
                    <span style="background-color: #D95555" @click="checkStatus('WORSEN')">
                    <i class="iconfont iconxuanzhong" v-show="treatmentStatus=='WORSEN'"></i>
                    恶化
                    </span>
                </div>
                <div class="treatment_comment">治疗评语:</div>
                    <quillEditor
                    :options="editorOption"
                    class="quill_style"
                    v-model="commentInfo"
                    ref="myQuillEditor"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                    </quillEditor>
                </div>
                <div class="demo-drawer__footer">
                <el-button @click="drawer = false">关闭</el-button>
                <el-button type="primary" @click="saveDrawer()">保存</el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 添加报告 -->
        <el-dialog 
            title="添加报告" 
            :close-on-click-modal='false'
            :visible.sync="dialogReportForm.visible" 
            width="450px"
            :append-to-body="true"
            @close="onClose('dialogReportForm')">
            <el-form 
                :model="dialogReportForm" 
                ref="dialogReportForm" 
                :rules="dialogReportRules" 
                label-width="100px" 
                @submit.native.prevent 
                v-loading="dialogReportForm.loading" 
                label-position="left">
                <el-form-item label="报告类型：" class="fill">
                    <el-radio v-model="dialogReportForm.type" label="1">普通</el-radio>
                    <el-radio v-model="dialogReportForm.type" label="2">随访</el-radio>
                </el-form-item>
                <el-form-item label="报告名称：" class="fill" prop="name">
                    <el-select v-model="dialogReportForm.name">
                        <el-option v-for="(item, index) in reportSelectList" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="就诊时间：" class="fill" prop="time">
                    <el-date-picker
                        v-model="dialogReportForm.time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="onSave('dialogReportForm')" size="mini" :disabled="dialogReportForm.loading">保 存</el-button>
                <el-button @click="onClose('dialogReportForm')" size="mini">关 闭</el-button>
            </span>
        </el-dialog>


        <!-- 添加提醒 -->
        <el-dialog 
            :title="dialogFrom.title" 
            :close-on-click-modal='false'
            :visible.sync="dialogFrom.visible" 
            :append-to-body="true"
            class="patientInfo"
            width="750px"
            @close="onClose('dialogFrom')">
            <el-form 
                :model="dialogFrom" 
                ref="dialogFrom" 
                :rules="dialogRules" 
                label-width="96px" 
                @submit.native.prevent 
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
                    <el-form-item label="定时模式:" label-width="72px" class="inline top">
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
                        <el-form-item label-width="48px" class="block" prop="value1">
                            每<el-input v-model="dialogFrom.value1" type="number" min='1'></el-input>天
                        </el-form-item>
                    </div>
                    <div v-else-if="dialogFrom.model=='WEEK'" >
                        <el-form-item label-width="30px" class="inline" prop="value1">
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
                        <el-form-item label-width="30px" class="inline" prop="value1">
                            每<el-input v-model="dialogFrom.value1" type="number"  min='1'></el-input>个月的
                        </el-form-item>
                        <el-form-item label-width="0" class="inline" prop="value2">
                            <el-select v-model="dialogFrom.value2" class="select">
                                <el-option v-for="(item, index) in selectDayArr" :label="item" :value="index+1" :key="index"></el-option>
                            </el-select>号
                        </el-form-item>
                    </div>
                    <div  v-else-if="dialogFrom.model=='YEAR'">
                        <el-form-item label-width="30px" class="inline year" prop="value1">
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
                    <el-form-item label="提醒范围:" label-width="72px"  class="inline top">
                    </el-form-item>
                    <el-form-item label-width="76px" class="block" prop="range">
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
                <el-button type="primary" @click="onSaveRemind('dialogFrom')" size="mini" :disabled="dialogFrom.loading">保 存</el-button>
                <el-button @click="onClose('dialogFrom')" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import patientInfoDetail from './patientInfo'
import reportList from './report'
import utils from 'components/utils/index';
export default {
    name: 'patientInfo',
    props:['dataInfo','personalInfo','reportFillData'],
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
            record: [],  //操作记录
            activeName: "first",
            showReportComponent: false,
            activeSelect: false,
            openId:"",
            treatmentStatus:"",//治疗状态
            //抽屉 参数
            drawer:false,
            drawerTitle:"治疗结果",
            commentInfo:"",//评论内容 -- 保留所有样式
            treatmentTxtComment:"",// 缩略版 格式
            //富文本框参数
            editorOption: {
                modules:{
                toolbar:[
                    ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                    ['blockquote', 'code-block'],  //引用，代码块
                    [{ 'header': 1 }, { 'header': 2 }],  // 标题，键值对的形式；1、2表示字体大小
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],  //列表
                    [{ 'script': 'sub'}, { 'script': 'super' }], // 上下标
                    [{ 'indent': '-1'}, { 'indent': '+1' }],  // 缩进
                    [{ 'direction': 'rtl' }],    // 文本方向
                    [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  //几级标题
                    [{ 'color': [] }, { 'background': [] }],  // 字体颜色，字体背景颜色
                    [{ 'font': [] }],  //字体
                    [{ 'align': [] }], //对齐方式
                    ['clean'], //清除字体样式
                    //['image','video'] //上传图片、上传视频
                ]
                },
                readOnly:true,
                theme:'snow',
                placeholder:"请输入评语内容..."
            },
            dialogReportForm: {
                loading: false,
                visible: false,
                type: "1",
                time: "",
                name: "",
            },


            selectList:[],
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
            remindDetail: {},
            dialogFrom: {
                title:'',
                id:'',
                loading: false,
                visible: false,
                remindDateName:"",
                relevantReports:"",
                model: 'TIME',
                appointData:'',
                value1:'',
                value2:'',
                range:[]
            },
            reportSelectList: [],
            dialogReportRules: {
                name: [
                    { required: true, message: '请选择报告名称', trigger: 'change' }
                ],
                time: [
                    { required: true, message: '请选择就诊时间', trigger: 'change' }
                ],
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
        'dialogReportForm.type': function(newVal) {
            this.dialogReportForm.name = "";
            // this.getReportSelectList();
            this.getReportList();
        },
        'dialogFrom.value1': function(newVal) {
            if(this.dialogFrom.model == 'MONTH' || this.dialogFrom.model == 'YEAR'){
                this.dialogFrom.value2 = ''
                if(this.dialogFrom.value1 == 2) {
                    let yearType = new Date().getFullYear();
                    if(yearType % 4 == 0 && (yearType % 100 != 0 || yearType % 400 == 0)) {
                        this.selectDayArr = 29;
                    } else {
                        this.selectDayArr = 28;
                    }
                }else if( this.monthBig.includes(this.dialogFrom.value1) ) {
                    this.selectDayArr = 31;
                }else {
                    this.selectDayArr = 30;
                }
            }
        }
    },
    created () {
        // this.getReportSelectList();
        this.getReportList();
        this.getPatientSearch();
        this.getRemindDetail();
        this.getLogList();
        this.getSelectList();
    },
    mounted () {
        this.drawerTitle = this.personalInfo.PATIENT_NAME+"-治疗结果";
        this.$nextTick(function () {
            $('.el-drawer__header>span').prepend('<i class="iconfont iconzhiliaoxiaoguo" style="margin-right: 9px;font-size: 18px;font-weight: normal"></i>')
        });
        this.queryTreatmentInfo()
    },
    components: {
        quillEditor,
        patientInfoDetail,
        reportList
    },
    methods: {
        resize() {
            let height = $('.el-drawer__body').height();
            $('.quill_style').height(height-330)
        },
        //添加提醒弹框
        showDialog() {
            this.getRemindConfig()
            .then((res)=>{
                console.log(res)
                //已存在配置
                if(res.exsit) {
                    this.dialogFrom = {
                        id:res.data.id,
                        title: '修改提醒',
                        visible: true,
                        loading: false,
                        remindDateName: res.data.remindName,
                        relevantReports: res.data.crfId,
                        model: res.data.timing,
                        appointData: res.data.startTime,
                        value1: String(res.data.param),
                        value2: String(res.data.param2),
                        range:[res.data.startTime?res.data.startTime:'', res.data.endTime?res.data.endTime:'']
                    }
                }else {
                    this.dialogFrom = {
                        id:'',
                        title: '添加提醒',
                        visible: true,
                        loading: false,
                        remindDateName:"",
                        relevantReports:"",
                        model: 'TIME',
                        appointData:'',
                        value1:'',
                        value2:'',
                        range:[]
                    }
                }
            })
        },
        //获取添加提醒报告列表
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
        // 查询随访提醒详细信息
        async getRemindDetail() {
            let that = this;
            let fromData = {
                patientId: that.dataInfo.patientId||"",
                diseaseId: that.dataInfo.diseaseId||"",
            };
            try {
                let res = await that.$http.PFUremindDetail(fromData)
                if(res.code == 0) {
                    this.remindDetail = res.data;
                }
            }catch (error) {
                console.log(error)
            }
        },
        // 查询操作记录
        async getLogList() {
            let that = this;
            let fromData = {
                patientId: that.dataInfo.patientId||"",
                diseaseId: that.dataInfo.diseaseId||"",
            };
            try {
                let res = await that.$http.PFUremindLogList(fromData)
                if(res.code == 0) {
                    this.record = res.data;
                }
            }catch (error) {
                console.log(error)
            }
        },
        //添加提醒弹框选择定时模式
        selectChange() {
            this.dialogFrom.value1 = "";
            this.dialogFrom.value2 = "";
        },
        // 查询已配置提醒信息
        async getRemindConfig() {
            this.dialogFrom.visible = true;
            this.dialogFrom.loading = true;
            let that = this;
            let fromData = {
                patientId:that.dataInfo.patientId||"",
                diseaseId: that.dataInfo.diseaseId||""
            };
            try {
                let res = await that.$http.PFUGetRemindConfig(fromData)
                if(res.code == 0) {
                    return Promise.resolve({data:res.data,exsit:res.data.id?true:false})
                }
            }catch (error) {
                console.log(error)
            }
        },
        //保存添加提醒
        onSaveRemind(dialogFrom) {
            this.$refs[dialogFrom].validate(async (valid) => {
                if (valid) {
                    let range;
                    if(!this.dialogFrom.range || JSON.stringify(this.dialogFrom.range) == '[]') {
                        range = "";
                    }else {
                        range = this.dialogFrom.range;
                    }
                    let formData = {
                        id: this.dialogFrom.id?this.dialogFrom.id:undefined,
                        remindName: this.dialogFrom.remindDateName,
                        crfId: this.dialogFrom.relevantReports,
                        timing: this.dialogFrom.model,
                        param: parseInt(this.dialogFrom.value1),
                        param2: parseInt(this.dialogFrom.value2),
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
                            this.dialogFrom.visible = false;
                            this.getRemindDetail();
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
        toReportFill(row) {
            console.log(row)
            let urlParameter={
                cacheData: false,
                formId: row.crfId || "",
                reportId: row.reportId || '',
                groupId: row.groupId || "",
                subjectId: row.subjectId || "",
                diseaseId: row.diseaseId || "",
                patientName: row.patientName || "",
                patientId: row.patientId || "",
                identify: "",
                from: "patientFollowUp",
                diseaseName: row.diseaseName || "",
                subjectName: row.subjectName || "",
                groupName: row.groupName || "",
                title: row.reportName,
                id: row.id,
                reportName: row.reportName,
                phoneNumber: row.phoneNumber,
                genderName: row.genderName,
                age: row.age,
                isModify:"displayShow"
            }
            sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
            let urlParameters = "cacheData="+false+"&formId="+row.crfId+"&reportId="+row.id+"&groupId="+row.groupId+"&subjectId="+row.subjectId+"&diseaseId="+row.diseaseId+"&patientName="+row.patientName+"&patientId="+row.patientId+"&identify="+this.identify+"&from="+'caseManage'+"&diseaseName="+row.diseaseName+"&subjectName="+row.subjectName+"&groupName="+row.groupName+"&title="+row.reportName+"&isModify="+"displayShow";
            window.open('./patientForm.html?'+urlParameters);
        },
        openTreatmentDrawer() {
            this.drawer = true;
            this.$nextTick(function () {
                this.resize();
            });
        },
        //跳转到306视图页面
        onLinkView360() {
            let obj = {
                orgCode: this.dataInfo.orgCode,
                patientId: this.dataInfo.patientId,
                diseaseId: this.dataInfo.diseaseId,
            };
            sessionStorage.setItem('VIEW360_QUERY', JSON.stringify(obj));
            window.open('./view360.html?patientId='+ this.dataInfo.patientId, '_blank');
        },
        //保存功能
        saveDrawer() {
            this.addTreatmentInfo();
            this.drawer = false;
        },
        // 病人选中 状态
        checkStatus(value) {
            this.treatmentStatus = value;
        },
        //富文本富文本编辑事件
        onEditorBlur(quill){// 失去焦点事件
            console.log('失去焦点--',quill)
        },
        onEditorFocus(quill){ // 获得焦点事件
            console.log('获得焦点--',quill)
        },
        onEditorChange(quill){// 内容改变事件
            console.log('内容改变--',quill)
            this.treatmentTxtComment = quill.text
        },
        // 查询患者信息
        async getPatientSearch() {
            let that = this;
            let fromData = {
                patientId:that.dataInfo.patientId||"",
            };
            try {
                let res = await that.$http.PFUGetPatientSearch(fromData)
                if(res.code == 0) {
                this.openId = res.data.openId;
                }
            }catch (error) {
                console.log(error)
            }
        },
        // 向患者发送邀请码
        async sendPatientCode() {
            if(this.openId) {
                return;
            }
            let that = this;
            let fromData = {
                patientId:that.dataInfo.patientId||"",
            };
            try {
                let res = await that.$http.PFUsendPatientInviteCode(fromData)
                if(res.code == 0) {
                    this.$mes('success', "已发送邀请码");
                }else {
                    this.$mes('error', "发送邀请码失败");
                }
            }catch (error) {
                this.$mes('error', error);
                console.log(error)
            }
        },
        // 查询评语
        async queryTreatmentInfo() {
            let that = this;
            let fromData = {
                patientId:that.dataInfo.patientId||"",
                diseaseId:that.dataInfo.diseaseId||""
            };
            try {
                let data = await that.$http.queryTreatmentInfo(fromData)
                if(data.code == 0) {
                    that.treatmentStatus = data.data.treatmentStatus;
                    that.commentInfo = data.data.treatmentComment;
                }
            }catch (error) {
                console.log(error)
            }
        },
        // 保存评语
        async addTreatmentInfo() {
            let that = this;
            let fromData = {
                "patientId": that.dataInfo.patientId,
                "diseaseId": that.dataInfo.diseaseId,
                "treatmentStatus": that.treatmentStatus, //待访(TODO)、治愈(HEAL)、好转(IMPROVE)、无效(INVALID)、恶化(WORSEN)
                "treatmentComment": that.commentInfo,
                "treatmentTxtComment": that.treatmentTxtComment
            };
            try {
                let data = await that.$http.addTreatmentInfo(fromData);
                if(data.code==0) {
                    that.$message({
                        type:"success",
                        message:data.msg
                    })
                }
            }catch (error) {
                console.log(error)
            }
        },
        showDialogReport() {
            this.dialogReportForm = {
                loading: false,
                visible: true,
                type: "1",
                time:"",
                name:""
            }
            this.dialogReportForm.time = utils.formateDate(new Date().getTime());
        },
        //保存报告
        onSave(dialogReportForm) {
            this.$refs[dialogReportForm].validate(async (valid) => {
                if (valid) {
                    let reportName;
                    this.reportSelectList.forEach( item =>{
                        if(item.id == this.dialogReportForm.name) {
                            reportName =  item.name;
                        }
                    })
                    let formData = {
                        crfId: this.dialogReportForm.name,
                        reportName: reportName,
                        reportType: this.dialogReportForm.type,
                        visitDate: this.dialogReportForm.time,
                        groupId: this.dataInfo.groupId,
                        patientId: this.dataInfo.patientId,
                        diseaseId: this.dataInfo.diseaseId,
                        subjectId: this.dataInfo.subjectId,
                        diseaseName: this.dataInfo.diseaseName,
                        subjectName: this.dataInfo.subjectName,
                        groupName: this.dataInfo.groupName
                    }
                    // let res = await this.$http.PFUaddReport(formData);
                    // 新2.0 保存接口
                    let res = await this.$http.patientReportAddSave(formData);
                    try {
                        if (res.code == 0) {
                            this.$mes('success', "添加报告成功!");
                            if(this.$refs.patientDetail) {
                                this.$refs.patientDetail.getDataList()
                            }else if(this.$refs.refPatientInfoDetail) {
                                this.$refs.refPatientInfoDetail.getDataList()
                            }
                            this.dialogReportForm.visible = false;
                        }else {
                            this.$mes('error', "添加报告失败!");
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    return false;
                }
            });
        },
        //关闭报告弹框
        onClose(dialogReportForm) {
            this[dialogReportForm].visible = false; 
            this.$refs[dialogReportForm].resetFields();
        },
        //报告列表选项
        async getReportSelectList() {
            let formData = {
                crfType: Number(this.dialogReportForm.type),
                diseaseId: this.dataInfo.diseaseId
            }
            try {
                let res = await this.$http.PFUGetList(formData);
                if (res.code == 0) {
                    this.reportSelectList = res.data;
                }else {
                    this.$mes('error', "获取关联报告列表失败!");
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取报告列表
        async getReportList() {
          let that = this;
          let formData = {
            crfType:that.dialogReportForm.type,
            diseaseId:that.$route.query.id
          };
          try {
            let data = await that.$http.getReportList(formData);
            if(data.code == 0) {
              that.reportSelectList = data.data;
            }else {
              that.$mes('error', "获取关联报告列表失败!");
            }
          }catch (error) {
            console.log(error)
          }
        },
        handleComponent(val) {
            this.showReportComponent = val;
        }
    }
};
</script>


<style lang="less" scoped>
    .patientInfo {
        height: 100%;
        .left {
            .el-button {
                color:#979BAA;
                &:hover {
                    color:#409EFF;
                }
            }
            .line {
                height: 16px;
                width: 1px;
                background-color: #979BAA;
            }
            span {
                margin-right: 20px;
                color: #394263;
                font-size: 14px;
                &.name {
                    font-size: 18px;
                    color: #394263;
                    font-weight: bold;
                    margin-left: 20px;
                }
            }
            .showTreatmentStatus{
                padding: 0 1px;
                font-size: 12px;
                border-radius: 5px;
                cursor: pointer;
                border: 1px solid #63666E;
            }
            .TODO{
                color: #0190DE !important;
                border: 1px solid #0190DE !important;
            }
            .HEAL{
                color: #0FBB93 !important;
                border: 1px solid #0FBB93 !important;
            }
            .IMPROVE{
                color: #8EC466 !important;
                border: 1px solid #8EC466 !important;
            }
            .INVALID{
                color: #04B8DD !important;
                border: 1px solid #04B8DD !important;
            }
            .WORSEN{
                color: #D95555 !important;
                border: 1px solid #D95555 !important;
            }
            .patient_state,.treatment_comment{
                padding: 20px 0 16px 0;
                font-size: 14px;
            }
        }
        .right {
            .el-button--primary.weChat {
                background-color: rgba(6, 206, 100, 1);
                &:hover {
                    background-color: #03b557;
                }
            }
            .weChat.el-button--default:hover {
                color: rgba(6, 206, 100, 1);
                border-color: rgba(6, 206, 100, 1);
                background-color: transparent;
            }
            .view {
                background-color: rgba(245, 157, 0, 1);
                &:hover {
                    background-color: #de8f01;
                }
            }
            .report {
                background-color: rgba(27, 186, 225, 1);
                &:hover {
                    background-color: #03a4cc;
                }
            }
        }
        .container {
            background-color: #f6f9fc;
            height: 100%;
            // padding-right: 10px;
            .content {
                background-color: #fff;
                height: 100%;
                flex-grow: 1;
                padding: 20px;
            }
            .aside {
                background-color: #f6f9fc;
                width: 420px;
                margin-left: 17px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                h3 {
                    height: 50px;
                    border-bottom: 1px solid rgba(229,235,236,1);
                    font-size: 16px;
                    i {
                        color: rgba(151, 155, 170, 1)
                    }
                }
                .top {
                    background-color: #fff;
                    padding: 0 22px 15px;
                    min-height: 200px;
                    margin-bottom: 30px;
                    color: rgba(57, 66, 99, 1);
                    .li {
                        margin-top: 25px;
                        padding-left: 10px;
                        font-size: 14px;
                        i{
                            margin-right: 6px;
                            color: rgba(151, 155, 170, 1);
                        }
                        & > p {
                            width: 130px;
                        }
                        .cont {
                            flex-grow: 1;
                            line-height: 18px;
                            p:first-child{
                                margin-bottom: 10px;
                            }
                            p:last-child {
                                &:hover {
                                    color: #333;
                                    font-weight: bold;
                                }
                            }
                        }
                    }
                }
                .record {
                    flex-grow: 1;
                    background-color: #fff;
                    padding: 14px 22px;
                    color: rgba(57, 66, 99, 1);
                    position: relative;
                    .el-timeline {
                        padding: 20px 10px;
                    }
                  img{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                  }
                }
            }
        }
    }
</style>


<style lang="less">
    .el-dialog__wrapper {
        .el-drawer__body {
            padding: 20px;
            border-top: 1px solid #EEEEEE;
        }
        .el-drawer__header{
            margin-bottom: 18px;
            font-size: 16px;
            font-weight: bold;
        }
        .demo-drawer__content {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .patient_state,.treatment_comment{
            padding: 20px 0 16px 0;
            font-size: 14px;
        }
        .state_sort{
            text-align: center;
            display: flex;
            justify-content: space-around;
            span{
                cursor: pointer;
                font-size: 14px;
                display: inline-block;
                width: 100px;
                height: 36px;
                line-height: 36px;
                color: #ffffff;
                i{
                    font-size: 14px;
                }
            }
        }
    }
    .patientInfo {
        .group_btn {
            .el-button {
                border-width: 0;
            }
            .icon {
                font-size: 22px;
                margin: 0;
            }
        }
        .el-form {
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
    }
    
</style>