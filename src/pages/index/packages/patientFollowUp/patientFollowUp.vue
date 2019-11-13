<template>
    <div class="cloud-component patientFollowUp">
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small">
            <el-form :inline="true" :model="form" class="flex-start-center">
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
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未填写" value="0"></el-option>
                        <el-option label="已填写" value="1"></el-option>
                        <el-option label="失访" value="2"></el-option>
                        <el-option label="终止" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="flex-right">
                    <el-button type="primary" icon="icon iconfont iconzujian46" @click="getDataList">刷 新</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <ul class="card" v-loading="loading" v-if="dataList.length != 0">
                <el-row :gutter="21">
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-for="(item,index) in dataList" :key="index">
                        <li class="box flex-start-center">
                            <div class="box_left" @click="toReportFill(item)">
                                <h3>{{item.patientName}}</h3>
                                <p>{{item.genderName}}/{{item.age}}</p>
                            </div>
                            <div class="box_right flex-center-end">
                                <div @click="toReportFill(item)" class="box_tag"><span v-html="handleStatus(item.status)"></span></div>
                                <p @click="toReportFill(item)" class="box_tel"><i class="icon iconfont iconzujian10"></i>{{item.phoneNumber | emptyString}}</p>
                                <div class="box_btn_group flex-start-center">
                                    <el-button class="flex-center-center" @click.stop="pushNote(item)" :disabled="item.smsVisit!=0"><i class="icon iconfont iconzujian9"></i>
                                        {{item.smsVisit==0?'短信随访':'已发送'}}
                                    </el-button>
                                    <el-button class="flex-center-center" @click.stop="pushAssociate(item)" :disabled="item.mpVisit!=0"><i class="icon iconfont iconzujian11"></i>
                                    {{item.mpVisit==0?'微信随访':'已发送'}}
                                    </el-button>
                                </div>
                            </div>
                        </li>
                    </el-col>
                </el-row>
            </ul>
            <div v-else class="empty flex-center-center flex-wrap" style="margin-top: 180px;">
                <svg class="icon" aria-hidden="true" style="font-size: 170px;width:100%; text-align:center;">
                    <use xlink:href="#iconzu11"></use>
                </svg>
                <p class="text-center" style="font-size: 14px; color:#666;padding-top: 15px;">暂无内容</p>
            </div>
        </div>
    </div>
</template>

<script>
import mixins from 'components/mixins';
import utils from 'components/utils/index';

export default {
    name: 'patientFollowUp',
    mixins: [mixins],
    data () {
        return {
        form: {
            time:[],
            state:""
        },
        dataList: [],
        loading: false,
        identify: "",
        };
    },
    watch: {},
    computed: {},
    created () {
        let date = new Date().getTime();
        this.form.time[0] = utils.formateDate(date - ( 1000 * 60 * 60 * 24 * 30));
        this.form.time[1] = utils.formateDate(date + ( 1000 * 60 * 60 * 24));
        this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
        this.getDataList();
    },
    mounted () {
        this.addEventListenervisibilityChange();
    },
    destoryed() {
        document.removeEventListener(this.visibilityChange)
    },
    methods: {
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
                    this.getDataList();
                }
            }, false);
        },
        async getDataList() {
            let that = this;
            let startTime, endTime;
            console.log(this.form.time)
            if(!this.form.time || this.form.time && this.form.time.length == 0) {
                startTime = null
                endTime = null
            }else {
                startTime = this.form.time[0].split("-").join('');
                endTime = this.form.time[1].split("-").join('');
                // startTime = this.form.time[0];
                // endTime = this.form.time[1];
            }
            console.log(this.form.time)
            that.loading = true;
            let formData = {
                offset: 1,
                limit: 999,
                args: {
                    // subjectId: '',
                    // groupId: '',
                    // crfId: "",
                    // patientName: "",
                    startTime: startTime,
                    endTime: endTime,
                    status: this.form.state
                }
            };
            try {
                let res = await that.$http.PFUPgetDataList(formData);
                if (res.code == '0') {
                    this.dataList = res.data.args;
                }else {
                    this.$mes('error', res.msg);
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
        reset () {
            this.form.state = '';
            let date = new Date().getTime();
            this.form.time[0] = utils.formateDate(date - ( 1000 * 60 * 60 * 24 * 30)).split("-").join('');
            this.form.time[1] = utils.formateDate(date + ( 1000 * 60 * 60 * 24)).split("-").join('');
        },
        handleStatus(status) {
            switch (status) {
                case 0: return '<span style="padding:3px 10px;height:24px;line-height:24px;text-align:center; color:rgba(102, 102, 102, 1); background:rgba(102, 102, 102, .1);">未填写</span>';
                case 1: return '<span style="padding:3px 10px;height:24px;line-height:24px;text-align:center;color:rgba(67, 154, 255, 1); background:rgba(67, 154, 255, .1);">已填写</span>';
                case 2: return '<span style="padding:3px 10px;height:24px;line-height:24px;text-align:center;color:rgba(247, 158, 0, 1); background:rgba(247, 158, 0, .1);">失访</span>';
                case 3: return '<span style="padding:3px 10px;height:24px;line-height:24px;text-align:center;color:rgba(219, 84, 82, 1); background:rgba(219, 84, 82, .1);">终止</span>';
                case 4: return '<span style="padding:3px 10px;height:24px;line-height:24px;text-align:center;color:rgba(102, 102, 102, 1); background:rgba(102, 102, 102, .1);">失效</span>';
                default: return;
            }
        },
        toReportFill(row) {
            this.getIdentify(row.patientId)
            .then( ()=>{
                let that = this;
                let urlParameter={
                    cacheData: false,
                    formId: parseInt(row.crfId) || null,
                    reportId: row.reportId || '',
                    groupId: row.groupId || "",
                    subjectId: row.subjectId || "",
                    diseaseId: row.diseaseId || "",
                    patientName: row.patientName || "",
                    patientId: row.patientId || "",
                    identify: this.identify || "",
                    from: "patientFollowUp",
                    diseaseName: row.diseaseName || "",
                    subjectName: row.subjectName || "",
                    groupName: row.groupName || "",
                    title: row.reportName,
                    fowwowUpstatus: row.status,
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
            })
        },
        //获取身份证号
        async getIdentify(patientId) {
            let formData = {
                patientId: patientId
            }
            try {
                let res = await this.$http.casesSearchPatient(formData);
                if (res.code == 0) {
                    this.identify = res.data.identitycardno || "";
                }else {
                    this.$mes('error', "获取基本信息失败!");
                }
            } catch (err) {
                console.log(err)
            }
        },
        //推送微信消息
        async pushAssociate(row) {
            let formData = {
                remindId: row.id
            }
            try {
                let res = await this.$http.PFUassociatePush(formData);
                if (res.code == 0) {
                    this.$mes('success', "已向"+row.patientName+"推送微信随访消息!");
                    this.getDataList();
                }else {
                    this.$mes('error', "推送消息失败!");
                }
            } catch (err) {
                console.log(err)
            }
        },
        //推送短信消息
        async pushNote(row) {
            let formData = {
                remindId: row.id
            }
            try {
                let res = await this.$http.PFUsmsPush(formData);
                if (res.code == 0) {
                    this.$mes('success', "已向"+row.patientName+"推送短信随访消息!");
                    this.getDataList();
                }else {
                    this.$mes('error', "推送消息失败!");
                }
            } catch (err) {
                console.log(err)
            }
        },
    },
    beforeRouteEnter (to, from, next) {
        next();
    },
    beforeRouteLeave (to, from, next) {
        next();
    }
};
</script>


<style lang="less" scoped>
    .patientFollowUp .card {
        flex-wrap: wrap;
        position: relative;
        min-height: 600px;
        li {
            height: 110px;
            border-radius: 0px;
            padding: 10px;
            background:rgba(255,255,255,1);
            margin-bottom: 21px;
            transition: all 300ms;
            cursor: pointer;
            &:hover {
                box-shadow:0px 4px 10px rgba(0,0,0,0.16); 
            }
            .box_left {
                width: 85px;
                height: 100%;
                padding: 15px 0 0 5px;
                border-right: 1px solid #eee;
                h3 {
                    font-size: 20px;
                    font-weight: normal;
                    line-height: 38px;
                    color: #090E3E;
                }
                p {
                    color: #9BABB8;
                    line-height: 30px;
                }
            }
            .box_right {
                flex: 1;
                flex-wrap: wrap;
                flex-direction: column;
                height: 100%;
                padding-left: 16px;
                .box_tag {
                    display: flex;
                    justify-content: flex-end;
                }
                .box_tel {
                    width: 100%;
                    color: rgba(127, 139, 159, 1);
                    font-size: 14px;
                    margin-bottom: 16px;
                    i {
                        padding-right: 4px;
                        font-size: 16px;
                    }
                }
                .box_btn_group {
                    .el-button {
                        border: none;
                        background:rgba(242, 242, 242, 1);
                        width: 90px;
                        margin-left: 10px;
                        height: 32px;
                        color: rgba(127, 139, 159, 1);
                        transition: all 300ms;
                        &:first-child {
                            margin-left: 0;
                        }
                        .icon {
                            font-size: 18px;
                            vertical-align: middle;
                            padding-right: 0;
                            margin-right: 2px;
                        }
                        &:hover {
                            background:rgba(229, 229, 229, 1);
                            color: rgba(93, 113, 145, 1);
                        }
                        &.is-disabled{
                            color: #c9cdd4;
                        }
                    }
                }
            }
        }
    }
</style>
