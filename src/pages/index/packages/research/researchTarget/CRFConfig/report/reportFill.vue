<template>
  <!--数据连接管理-->
  <div class="cloud-component clearfix  content-container" style="position:relative;">
    <div class="crfConfig clearfix crffill">
      <div class="crf-main" v-loading="mainLoading" v-if="!showReadComponent">
        <div class="crf-main-content" >
          <div class="crf-step-header">
            <i class="header_left"></i>
            <span style="font-size: 16px; margin-right:20px;">{{urlParameter.patientName}}</span>
            <el-button type="danger" size="mini" @click="closePage" style="float:right;">关闭</el-button>
            <el-button v-if="urlParameter.from=='researchObject'" @click="saveReportData" type="primary" style="float:right;margin-right: 15px" :disabled="mainLoading">保 存</el-button>
            <el-button v-if="urlParameter.from=='followUpManagement'" @click="saveFollowUpReportData(1)" type="primary" style="float:right;margin-right: 15px" :disabled="mainLoading">保 存</el-button>
            <el-button v-if="urlParameter.from=='researchObject'" @click="commitReportData" type="warning" style="float:right;margin-right: 5px" :disabled="commitLoading">提 交</el-button>
            <el-button v-if="urlParameter.from=='followUpManagement'" @click="saveFollowUpReportData(2)" type="warning" style="float:right;margin-right: 5px" :disabled="commitLoading">提 交</el-button>
            <el-button v-if="urlParameter.from=='followUpManagement'" @click="showStopDialog" type="danger" style="float:right;margin-right: 5px">终止随访或失访</el-button>
            <!--<el-button type="primary" size="mini" @click="toReportRead" style="float:right;margin-right: 5px">阅读</el-button>-->
          </div>
          <div class="flex-start-start" style="height:100%; margin-top: 8px;">
            <!-- 随访列表 -->
            <stageListCom v-if="urlParameter.from=='followUpManagement'" :groupId='urlParameter.groupId' :patientId="urlParameter.patientId" :pointPatientId='pointPatientId' @sendPoint="getPoint"></stageListCom>
            <div ref="top" class="crf-step-content" id="mainContent">
              <br/>
              <div class="formTip flex-start-center" v-if="urlParameter.from=='followUpManagement'" >
                <p class="formTip_title flex-center-center" :class="handleType(urlParameter.status)">
                  <i class="icon" :class="handleType(urlParameter.status)"></i>
                  {{handleStatus(urlParameter.status)}}
                </p>
                <div class="formTip_content">
                  <p><span class="label">随访员: </span> {{urlParameter.updator}}</p>
                  <p><span class="label">完成时间: </span> {{urlParameter.updateTime}}</p>
                  <p v-if="handleStatus(urlParameter.status) == 2 "><span class="label">失访原因: </span> {{urlParameter.note}}</p>
                </div>
              </div>
              <display-report v-if="crfForm!=null&&report!=null && update" :item="crfForm"  :report="report"></display-report>
            </div>

            <ul v-if="urlParameter.from=='followUpManagement'" class="recordList" v-loading="recordLoading">
              <h3>提交记录</h3>
              <li v-for="(item,index) in recordList" :key="index">
                <p>{{index+1}}、{{item.createTime}} {{item.content}}</p>
              </li>
            </ul>
          </div>
          <!--<div class="saveButton">
            <el-button @click="backingOut">返回</el-button>
            <el-button @click="saveReportData" type="primary" :disabled="mainLoading">保存</el-button>
          </div>-->
        </div>
      </div>

      <!--报告阅读-->
        <!--<report-read ref="reportRead" v-else  :report="report" @hideReportRead="onHideReportRead" @onBackTop="getContentTop"></report-read>-->
    </div>
    <!--数据绑定提醒-->
    <transition name="fade">
      <div v-show="showDataBinding" class="binding-box">
        <div class="binding-title">
          
          <span v-if="referView">
            <i class="el-icon-connection"></i>
            {{referView.label}}
          </span>
          <span v-else>
            <i class="el-icon-connection"></i>
            参考信息
          </span>
          <i
            class="el-icon-circle-close clearfix"
            style="float:right;font-size:18px;line-height:30px;color:white;margin-right:10px;cursor:pointer"
            @click="close"
          />
        </div>
        <div
          v-loading="dataLoading"
          class="binding-content"
          style="padding:5px;background:white;cursor:pointer;"
        >
          <ul>
            <li v-for="(it,index) in dataList"  class="hove_line" :key="index" @dblclick="SendMessage(it)">
              <!-- <i class="el-icon-location-outline clearfix" style="float:left;"/> -->
                <div style="display:table;word-break: break-all;font-size:14px;">
                  <div
                    v-for="(title,order) in Object.keys(it)"
                    :key="order"
                    style="display:table-row;border:1px solid black"
                  >
                    <!--background:#F9F9F9;-->
                    <div style="display:table-cell;width:120px;border:1px solid #DCDFE6;padding:5px">{{getTitle(title)}}</div>
                    <div v-if="typeof it[title]  ==  'object'"  style="display:table-cell;width:270px;border:1px solid #EBEEF5;padding:5px">
                      <span v-for="child in Object.keys(it[title]) "  :title="getTitle(child)"  :key="child">{{it[title][child]}}&nbsp;&nbsp;</span>
                    </div>
                    <div v-else style="display:table-cell;width:270px;border:1px solid #EBEEF5;padding:5px">{{it[title]}}</div>
                  </div>
                </div>
                <hr  v-if="index!=dataList.length-1">
            </li>
          </ul>
          <div class="display_none" v-if="dataList==0">
            <i class="iconfont iconzu5"></i>
            <p>暂无绑定数据</p>
          </div>
        </div>
      </div>
    </transition>
    <!--返回顶层icon-->
    <div  class="break_icon" @click="backTop" :class="scrollTop == 0?'hide':''">
      <i class="el-icon-caret-top"></i>
    </div>

    <!-- 终止随访或失访 -->
    <el-dialog title="" :append-to-body="true" :fullscreen="true" class="stop_dialog" :visible.sync="dialogStop.visible" :close-on-click-modal="false" :close-on-press-escape	="false">
      <h1 class="text_center">终止随访或失访</h1>
      <div class="warp flex-center-center" v-loading="dialogStop.loading">
        <div class="card zhongzhi" :class="dialogStop.type==1?'active':''" @click="selectStopType(1)">
          <div class="lable flex-center-center"><i class="icon iconfont iconzhongzhi"></i>终 止</div>
          <div class="content" v-if="dialogStop.type==1">
            <el-radio-group v-model="dialogStop.radio">
              <el-radio label="1">只终止当前随访阶段</el-radio>
              <el-radio label="2">终止该患者全部随访阶段</el-radio>
            </el-radio-group>
            <el-input type="textarea" :rows="5" placeholder="请填写原因" v-model.trim="dialogStop.reason"></el-input>
          </div>
          <p class="flex-center-center" v-else>确认不再随访该研究对象</p>
        </div>
        <div class="card shifang" :class="dialogStop.type==2?'active':''" @click="selectStopType(2)">
          <div class="lable flex-center-center"><i class="icon iconfont iconshifang"></i> 已失访</div>
          <div class="content" v-if="dialogStop.type==2">
            <el-input type="textarea" :rows="7" placeholder="请填写原因" v-model.trim="dialogStop.reason"></el-input>
          </div>
          <p class="flex-center-center" v-else>确认无法获得该随访点的随访数据</p>
        </div>
      </div>
      <div class="groupBtn text_center">
        <el-button @click="submitStop" type="primary">确 定</el-button>
        <el-button @click="dialogStop.visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import "./../css/crfReady.css";
import displayReport from "./../display/displayReport";
import stageListCom from '../stageList/stageList'
// import reportRead from "./../report/reportRead";
import mixins from "components/mixins";
import { mapGetters } from "vuex";
export default {
  name: "crfConfig",
  mixins: [mixins],
  components: {
    displayReport,
    stageListCom
    // reportRead
  },
  data() {
    return {
      recordList: [],
      update: true,
      patientId: "",
      formId: "",
      groupId: "",
      commitLoading: false,
      mainLoading: false,
      dataLoading: false,
      showDataBinding: false,
      dataList: null,
      crfForm: null,
      report: null,
      reportId: null,
      referView:null,//数据参考中文名选项
      showReadComponent: false,  //显示报告阅读组件
      scrollTop: 0,
      urlParameter:{},
      pointPatientId:'',  //当前随访点
      dialogStop: {
        type: 1,
        visible: false,
        loading: false,
        radio: '1',
        reason: '',
      }
    };
  },
  created() {
    this.initPage();
    if(!this.crfViewList){
        this.searchViewList();
    }
  },
  mounted() {
    let that = this;
    $(function() {
      that.resize();
      $(window).resize(function() {
        that.resize();
      });
    });
    this.mainContent = document.querySelector("#mainContent");
    this.mainContent.addEventListener('scroll', this.handleScroll, true) 
  },
  destroyed() {
    this.mainContent.removeEventListener('scroll',this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.getContentTop(document.querySelector("#mainContent").scrollTop);
    },
    resize() {
      /*$(".crffill").height($(window).height() - 160);
      $(".crf-main").height($(window).height() - 160);*/
      // $(".binding-box").max-height($(window).height()-160);
    },
    initPage() {
      this.urlParameter = JSON.parse(sessionStorage.getItem('reportFill')).urlParameter;
      console.log(this.urlParameter.stageList)
      this.pointPatientId = this.urlParameter.pointPatientId;
      this.patientId = "";
      this.groupId = "";
      this.formId = this.urlParameter.formId;
      this.reportId = this.urlParameter.reportId;
      if (!this.formId) {
        this.$notice("页面缺少表单id");
        return false;
      }
      if (!this.reportId) {
        this.$notice("页面缺少reportId");
        return false;
      }
      this.patientId = this.urlParameter.patientId;
      this.groupId = this.urlParameter.groupId;
      //初始化Vuex状态
      this.$store.commit("CRF_SET_PATIENTID", this.patientId);
      this.$store.commit("CRF_SET_REPORT_STATUS", false);
      this.$store.commit("CRF_CHANGE_CONTROL", {});
      this.getForms();
      this.getReportData()
      .then(()=>{
        this.update = true;
      })
      if(this.urlParameter.from=='followUpManagement') {
        this.getRecordLlist();
      }
    },
    //返回上一级
    backingOut() {
      let backInfo = JSON.parse(sessionStorage.getItem('caseManage'));
      this.$router.push({
        name:'caseManage',
        query:{
          id:backInfo.id,
          cacheData:backInfo.cacheData
        }
      })
    },
    //关闭
    closePage() {
      let userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Presto") != -1) {
        window.location.replace("about:blank");
      } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
    },
    async getForms(item) {
      let that = this;
      that.mainLoading = true;
      try {
        let  result = await this.$http.querySubjectCrfDisplayInfo({
          crfId: this.formId
        });
        console.log(result)
        if (result && result.code == "0") {
          this.crfForm = result.data;
          this.crfForm.formPortions = result.data.subjectPortions;
        }
        that.mainLoading = false;
      } catch (error) {
        that.mainLoading = false;
        that.$notice("获取表单失败");
        console.log(error);
      }
    },
    async getReportData() {
      try {
        let params = { reportId: this.reportId };
        let report;
        if(this.urlParameter.from=='followUpManagement') {
          report = await this.$http.followUpManagementReportPreview(this.$format(params));
        }else {
          report = await this.$http.querySubjectReportDisplayInfo(this.$format(params));
        }
        if (report.data && report.code == "0") {
          this.report = report.data;
          //从随访管理页面进来且为报告空模版
        if(this.urlParameter.from=='followUpManagement' && this.report.portions.length == 0 ) {
          // this.report = {
          //   // author: this.urlParameter.author || '',
          //   // createTime: this.urlParameter.createTime || '',
          //   crfId: this.urlParameter.formId || '',
          //   // deleteFlag: this.urlParameter.deleteFlag || '',
          //   // groupId: this.urlParameter.groupId || '',
          //   // groupName: this.urlParameter.groupName || '',
          //   // id: this.urlParameter.reportId || '',
          //   // patientId: this.urlParameter.patientId || '',
          //   portions: [],
          //   reportName: this.urlParameter.reportName || '',
          //   // reportType: this.urlParameter.reportType || '',
          //   // status: this.urlParameter.status,
          //   // subjectId: this.urlParameter.subjectId || '',
          //   // subjectName: this.urlParameter.subjectName || '',
          //   // updateTime: this.urlParameter.updateTime || '',
          //   // updator: this.urlParameter.updator || '',
          //   // visitDate: this.urlParameter.visitDate || ''
          // }
          console.log(this.report)
        }
          if(report.data && report.data.portions&&report.data.portions.length==0){
              this.$store.commit("CRF_SET_REPORT_STATUS", true);
          }else{
            // this.showReadComponent=true;
            this.showReadComponent=false;
          }
        }
      } catch (error) {
        this.$notice("获取查找表单关联的模块失败");
        console.log(error);
      }
    },
    async saveReportData() {
      try {
        this.mainLoading = true;
        if (!this.report.id) {
          this.report.groupId = this.groupId;
          this.report.crfId = this.formId;
          this.report.patientId = this.patientId;

          this.report.diseaseId = this.urlParameter.diseaseId || '';
          this.report.diseaseName = this.urlParameter.diseaseName || '';
          this.report.subjectId = this.urlParameter.subjectId || '';
          this.report.subjectName = this.urlParameter.subjectName || '';
          this.report.groupName = this.urlParameter.groupName || '';
        }
        // let result = await this.$http.reportSaveReport(this.report);
        let result = await this.$http.reportDataSaveSubject(this.report);
        if (result && result.code == "0") {
          this.$notice("保存成功");
          // 保存成功后，强制删除当前的crf填写页面的路由
          this.allRoute.forEach((item, index) => {
            if (item.route.name === this.$route.name) {
              this.$store.commit({
                type: "forceReduceRoute",
                paras: { index: index, vueParent: this }
              });
            }
          });
          this.$nextTick(() => {
            // if (this.$route.query.from === "caseManage") {
            if (this.urlParameter.from === "caseManage") {
              this.$router.push({
                path: this.urlParameter.from,
                query: {
                  id: this.urlParameter.diseaseId,
                  cacheData: false
                }
              });
            } else if (this.urlParameter.from === "enterGroupManager") {
              this.$router.push({
                path: this.urlParameter.from,
                query: {
                  cacheData: false,
                  patientName: this.urlParameter.patientName || "",
                  patientId: this.urlParameter.patientId || "",
                  identify: this.urlParameter.identify || ""
                }
              });
            }
          });
        }
        this.mainLoading = false;
      } catch (error) {
        this.$notice("保存表单数据失败");
        console.log(error);
        this.mainLoading = false;
      }
    },
    //保存或提交随访管理报告
    async saveFollowUpReportData(type) {
      try {
        this.mainLoading = true;
        let params = {
          "id": this.report.id,
          "reportName": this.urlParameter.reportName,
          "patientId": this.urlParameter.patientId,
          "portions": this.report.portions,
          "subjectName": this.report.subjectName,
          "subjectId": this.urlParameter.subjectId,
          "pointPatientId": this.pointPatientId,
          "type": type,
          "crfId": this.report.crfId,
        }
        let result = await this.$http.followUpPlanCrfSave(params);
        if (result && result.code == "0") {
          this.$notice("保存成功");
          this.closePage();
          // this.$nextTick(() => {
          //   // if (this.$route.query.from === "caseManage") {
          //   if (this.urlParameter.from === "caseManage") {
          //     this.$router.push({
          //       path: this.urlParameter.from,
          //       query: {
          //         id: this.urlParameter.diseaseId,
          //         cacheData: false
          //       }
          //     });
          //   } else if (this.urlParameter.from === "enterGroupManager") {
          //     this.$router.push({
          //       path: this.urlParameter.from,
          //       query: {
          //         cacheData: false,
          //         patientName: this.urlParameter.patientName || "",
          //         patientId: this.urlParameter.patientId || "",
          //         identify: this.urlParameter.identify || ""
          //       }
          //     });
          //   }
          // });
        }
        this.mainLoading = false;
      } catch (error) {
        console.log(error);
        this.$notice("保存表单数据失败");
        this.mainLoading = false;
      }
    },
    async commitReportData() {
      try {
        this.commitLoading = true;
        if (!this.report.id) {
          this.report.groupId = this.groupId || '';
          this.report.crfId = this.formId;
          this.report.patientId = this.patientId || '';

          this.report.diseaseId = this.urlParameter.diseaseId || '';
          this.report.diseaseName = this.urlParameter.diseaseName || '';
          this.report.subjectId = this.urlParameter.subjectId || '';
          this.report.subjectName = this.urlParameter.subjectName || '';
          this.report.groupName = this.urlParameter.groupName || '';
        }
        let result = await this.$http.researchObjectPreviewReportCommit(this.report);
        if (result && result.code == "0") {
          this.$notice("提交成功");
          this.closePage();
          this.$nextTick(() => {
            if (this.urlParameter.from === "researchObject") {
              this.$router.push({path: this.urlParameter.from});
            }
          });
        }
        this.commitLoading = false;
      } catch (error) {
        console.log(error);
        this.commitLoading = false;
      }
    },
    //根据英文名获取中文名
    getTitle(title){
      let option=this.referView.subOptions.find(e=>e.name==title);
      if(option){
          return option.label;
      }
      return title;
    },
    //获取数据绑定域及字段
    async searchViewList() {
      try {
        let result = await this.$http.searchBindingViewList();
        if (result && result.code == "0") {
          this.$store.commit("CRF_SET_VIEWLIST", result.data);
        }
      } catch (error) {
        this.$notice("获取数据绑定域列表事变");
        console.log(error);
      }
    },
    async searchDataList(item) {
      try {
        let params = {
          bindingId: item.baseProperty.bindingInfo.id,
          patientId: this.patientId
        };
        this.dataList=null;
        let result = await this.$http.searchBindingDataList(
          this.$format(params)
        );
        if (result && result.code == "0") {
          this.dataList = result.data;
        }
        this.dataLoading = false;
      } catch (error) {
        this.dataLoading = false;
        this.$notice("获取绑定数据失败");
        console.log(error);
      }
    },
    //点击后发送数据
    SendMessage(data) {
      this.$store.commit("CRF_SET_DATA", data);
      // this.$store.commit("CRF_SET_DATA", { PATIENT_NAME: "LQQ" });
    },
    close() {
      this.showDataBinding = false;
    },
    //消毁报告阅读页面
    onHideReportRead() {
      this.showReadComponent = false;
    },
    //切换到报告阅读页面
    toReportRead() {
      this.showReadComponent = true;
    },
    //返回顶层
    backTop() {
      if(!this.showReadComponent) {
        this.$refs.top.scrollTop = 0;
      }else {
        this.$refs.reportRead.toTop();
      }
    },
    getContentTop(top) {
      this.scrollTop = top;
    },
    //获取随访点
    getPoint(data) {
      this.update = false;
      let urlParameter = Object.assign(JSON.parse(sessionStorage.getItem('reportFill')).urlParameter,{
        formId: data.crfId,
        reportId: data.reportId,
        status: data.status,
        pointPatientId: data.pointPatientId,
        updateTime: data.updateTime,
        creator: data.creator
      })
      sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
      this.initPage();
    },
    //显示终止随访弹框
    showStopDialog() {
      this.dialogStop = {
        type: 1,
        visible: true,
        loading: false,
        radio: '2',
        reason: ''
      }
    },
    //选择随访或失访
    selectStopType(type) {
      this.dialogStop.type = type;
    },
    //提交随访或失访
    submitStop() {
      let title = '';
      if(!this.dialogStop.reason) {
        if(this.dialogStop.type==1) {
          if(this.dialogStop.radio == 1) {
            title = '请填写终止当前随访阶段原因'
          }else {
            title = '请填写终止该患者全部随访阶段原因'
          }
        }else {
          title = '请填写失访原因'
        }
      } else {
        if(this.dialogStop.type==1) {
          if(this.dialogStop.radio == 1) {
            title = '确认终止当前随访阶段？'
          }else {
            title = '确认终止该患者全部随访阶段？'
          }
        }else {
          title = '确认失访？'
        }
      }
      this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          if(this.dialogStop.reason) {
            try {
              if (this.dialogStop.type == 2) {
                this.dialogStop.radio = 3;
              }
              let params = {
                "note": this.dialogStop.reason,
                "pointPatientId": this.pointPatientId,
                "status": parseInt(this.dialogStop.radio)
              };
              console.log(params)
              this.dialogStop.loading = true;
              let result = await this.$http.followUpManagementPointChangeStatus(params);
              if (result.code == "0") {
                this.$emit('success','操作成功!')
                this.dialogStop.visible = false;
                this.closePage();
              }
              this.dialogStop.loading = false;
            } catch (error) {
              this.dialogStop.loading = false;
              this.$notice("操作失败");
              console.log(error);
            }
          }
        }).catch(() => {});
    },
    //操作记录
    async getRecordLlist() {
      let that = this;
      that.recordLoading = true;
      try {
        let result = await this.$http.followUpManagementRecordLlist({
          id: this.pointPatientId
        });
        if (result && result.code == "0") {
          this.recordList = result.data;
        }
      that.recordLoading = false;
      } catch (error) {
        that.recordLoading = false;
        console.log(error);
      }
    },
    handleStatus(status) {
      switch (status) {
        case 0: return '随访未开始';
        case 1: return '随访录入中';
        case 2: return '随访已失访';
        case 3: return '随访已终止';
        case 4: return '随访已完成';
        case 5: return '随访已失效';
        default: return '';
      }
    },
    //匹配alert主题
    handleType(status) {
      switch (status) {
        case 0: return 'el-icon-more icon0';
        case 1: return 'iconfont icondaifang icon1';
        case 2: return 'iconfont iconshifang icon2';
        case 3: return 'iconfont iconzhongzhi icon3';
        case 4: return 'iconfont iconwancheng1 icon4';
        case 5: return 'el-icon-minus icon5';
        default: return '';
      }
    }
  },
  computed: {
    allRoute() {
      return this.$store.state.user.routeArr;
    },
    ...mapGetters(["crfBindingData", "crfCurrentControl","crfViewList","crfPatientId","crfIsNewReport"])
  },
  watch: {
    crfCurrentControl(newer, older) {
      //当点击不拥有数据绑定的控件时关闭数据参考
      if (!newer.rootBinding) {
        this.showDataBinding = false;
        return;
      }
      //新的控件的绑定数据如果不为空则获取绑定数据，显示参考信息弹窗
      if (
        older.rootBinding == null ||
        newer.rootBinding.controlName != older.rootBinding.controlName
      ) {
        this.dataLoading = true;
        this.showDataBinding = true;
        this.referView=this.crfViewList.find(e=>e.name==newer.rootBinding.baseProperty.bindingInfo.viewId);
        this.searchDataList(newer.rootBinding);
      }
    },
    'dialogStop.type': function(newVal) {
      this.dialogStop.reason = '',
      this.dialogStop.radio = '2'
    }
  }
};
</script>
<style lang="less">
  .stop_dialog {
    .warp {
      margin: 80px auto;
      .card {
        cursor: pointer;
        width: 330px;
        height: 350px;
        box-shadow: 0 0 20px 0 rgba(0,0,0,.1);
        border-radius: 10px;
        margin: 0 10px;
        transition: all 50ms;
        overflow: hidden;
        &.active {
          height: 400px;
          .lable , .lable .icon {
            color: #fff !important;
          }
          &.zhongzhi .lable{
            background-color: #ff7e7e;
          }
          &.shifang .lable{
            background-color: #f8a461;
          }
        }
        &.zhongzhi .lable .icon {
          color: #ff7e7e;
        }
        &.shifang .lable .icon {
          color: #f8a461;
        }
        & > p {
          height: 110px;
        }
        .lable {
          height: 200px;
          font-weight: 500;
          font-size: 36px;
          background-color: #FAFAFA;
          .icon {
            font-size: 40px;
            padding-right: 10px;
          }
        }
        .content {
          padding: 15px;
          .el-radio-group {
            margin: 5px 10px;
            .el-radio {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
  .recordList {
    width: 300px;
    background-color: #fff;
    height: 100%;
    padding: 10px;
    h3 {
      line-height: 30px;
      border-bottom: 1px solid #999;
      margin-bottom: 15px;
    }
    li {
      margin-bottom: 15px;
    }
  }
  .formTip {
    height: 100px;
    margin: 10px 30px;
    border-radius: 8px;
    border: 1px solid #eee;
    overflow: hidden;
    .formTip_title {
      width: 240px;
      height: 100%;
      font-size: 24px;
      color: #fff;
      &::before {
        display: none;
      }
      &.icon0 { background-color: #333; }
      &.icon1 { background-color: #00B8DF; }
      &.icon2 { background-color: #F79E00; }
      &.icon3 { background-color: #DB5452; }
      &.icon4 { background-color: #00BE90; }
      &.icon5 { background-color: #333; }
      .icon {
        font-size: 40px;
        margin-right: 10px;
      }
    }
    .formTip_content {
      padding: 15px;
      background-color: #fff;
      flex: 1;
      height: 100%;
      & > p {
        line-height: 22px;
        font-size: 14px;
      }
      .label {
        color: #999;
        margin-right: 10px;
      }
    }
  }
</style>
<style lang="less">
.binding-box {
  position: absolute;
  width: 400px;
  top: -10px;
  right: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  
  .binding-title {
    height: 30px;
    /*background: #67c23a;*/
    background: #2d8cf0;
    span {
      line-height: 30px;
      vertical-align: middle;
      color: white;
      padding-left: 10px;
    }
  }
  .binding-content {
    min-height: 100px;
    max-height: 600px;
    overflow: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
  .header_left{
    width:2px;
    border-left: 4px solid #2d8cf0;
    padding-left: 10px;
    height: 25px;
    line-height: 25px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .hove_line:hover{
    background-color:rgb(247, 248, 252) ;
  }
  .display_none{
    text-align: center;
    margin-bottom: 32px;
    margin-top: 41px;
    i{
      display: inline-block;
      font-size: 50px;
      color: #E0E0E0;
    }
    p{
      color: #BDBDBD;
    }
  }
  .crf-step-content{
    flex: 1;
    background-color:rgb(247, 248, 252);
    /*margin-top: 10px;*/
    /*border-top: 2px solid #2d8cf0;*/
  }
  .crf-step-header {
    display: block !important;
    border-bottom: 1px dashed #e9eaec !important;
    padding: 11.5px;
  }
  .break_icon{
    position: absolute;
    bottom: 10%;
    right: 2%;
    cursor: pointer;
    background-color: #409eff;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    transition: .3s;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
    opacity: .5;
    z-index: 100;
    .el-icon-caret-top{
      color: #fff;
      display: block;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      position: absolute;
      top: 0%;
      left: 27%;
    }
    &.hide {
      opacity: 0;
    }
    &:hover{
      opacity: 1;
    }
  }
</style>
