<template>
  <!--数据连接管理-->
  <div class="cloud-component clearfix  content-container" style="position:relative;">
    <div class="crfConfig clearfix crffill">
      <div class="crf-main" v-loading="mainLoading" v-if="!showReadComponent">
        <div class="crf-main-content" >
          <div class="crf-step-header">
            <i class="header_left"></i>
            <span style="font-size: 16px; margin-right:20px;">{{urlParameter.patientName}}</span>
            <el-button type="danger" size="mini" @click="closePage" style="float:right;margin-left: 5px">关 闭</el-button>
            <el-button v-if="urlParameter.from == 'patientFollowUp'" @click="saveFollowUpReportData" type="primary" style="float:right;margin-right: 5px" :disabled="mainLoading">保 存</el-button>
            <el-button v-else @click="saveReportData" type="primary" style="float:right;margin-right: 5px" :disabled="mainLoading">保 存</el-button>
            <!--<el-button type="primary" size="mini" @click="toReportRead" style="float:right;margin-right: 5px">阅读</el-button>-->
          </div>
          <div ref="top" class="crf-step-content" id="mainContent">
            <display-report v-if="crfForm!=null&&report!=null" :item="crfForm"  :report="report"></display-report>
          </div>
          <!--<div class="saveButton">
            <el-button @click="backingOut">返回</el-button>
            <el-button @click="saveReportData" type="primary" :disabled="mainLoading">保存</el-button>
          </div>-->
        </div>
      </div>

      <!--报告阅读-->
        <!--<report-read ref="reportRead" v-else :report="report" @hideReportRead="onHideReportRead" @onBackTop="getContentTop"></report-read>-->
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
  </div>
</template>
<script type="text/javascript">
import "./../css/crfReady.css";
import displayReport from "./../display/displayReport";
import reportRead from "./reportRead";
import mixins from "components/mixins";
import { mapGetters } from "vuex";
export default {
  name: "crfConfig",
  mixins: [mixins],
  components: {
    displayReport,
    reportRead
  },
  data() {
    return {
      patientId: "",
      formId: "",
      groupId: "",
      mainLoading: false,
      commitLoading: false,
      dataLoading: false,
      showDataBinding: false,
      dataList: null,
      crfForm: null,
      report: null,
      reportId: null,
      referView:null,//数据参考中文名选项
      showReadComponent: false,  //显示报告阅读组件
      scrollTop: 0,
      urlParameter:{}
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
  activated() {},
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
      this.patientId = "";
      this.groupId = "";
      this.formId = this.urlParameter.formId;
      this.reportId = this.urlParameter.reportId;
      if (!this.formId) {
        this.$notice("页面缺少表单id");
        return false;
      }
      if (!this.reportId && this.urlParameter.from != 'patientFollowUp') {
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
      this.getReportData();
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
        /*let result = await this.$http.crfReportDetailPreview({
          formCrfId: this.formId
        });*/
        let result = await this.$http.previewCrfReportHttp({
          formCrfId: this.formId
        });
        console.log(result)
        if (result && result.code == "0") {
          this.crfForm = result.data;
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
        // let params = { groupId: this.groupId, patientId: this.patientId };
        let params = { reportId: this.reportId };
        // let report = await this.$http.reportFindReport(this.$format(params));
        let report = await this.$http.queryReportDisplayInfo(this.$format(params));
        console.log('report data',report)
        if (report.data && report.code == "0") {
          this.report = report.data;
          console.log("====================================")
          console.log(this.report)
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
    //保存保存（随访进来）
    async saveFollowUpReportData() {
      try {
        this.mainLoading = true;
        
        this.report.groupId = this.groupId;
        this.report.crfId = this.formId;
        this.report.patientId = this.patientId;

        this.report.diseaseId = this.urlParameter.diseaseId || '';
        this.report.diseaseName = this.urlParameter.diseaseName || '';
        this.report.subjectId = this.urlParameter.subjectId || '';
        this.report.subjectName = this.urlParameter.subjectName || '';
        this.report.groupName = this.urlParameter.groupName || '';
        this.report.patientName = this.urlParameter.patientName || '';
        this.report.phoneNumber = this.urlParameter.phoneNumber || '';
        this.report.genderName = this.urlParameter.genderName || '';
        this.report.age = this.urlParameter.age || '';
        
        this.report.id = this.urlParameter.id;
        this.report.reportName = this.urlParameter.reportName;
        this.report.sourceType = 'pc';
        this.report.creatorName = JSON.parse(sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO')).name;
        this.report.creatorId = JSON.parse(sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO')).userId;
        let result = await this.$http.saveFollowUpReportData(this.report); 
        if (result && result.code == "0") {
          this.$message.success("保存成功");
          this.closePage();
        }
        this.mainLoading = false;
      } catch (error) {
        this.$message.info("保存表单数据失败");
        console.log(error);
        this.mainLoading = false;
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
        let result = await this.$http.reportDataSave(this.report);
        if (result && result.code == "0") {
          this.$message.success("保存成功");
          // 保存成功后，强制删除当前的crf填写页面的路由
          this.allRoute.forEach((item, index) => {
            if (item.route.name === this.$route.name) {
              this.$store.commit({
                type: "forceReduceRoute",
                paras: { index: index, vueParent: this }
              });
            }
          });
          /*this.$nextTick(() => {
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
          });*/
        }
        this.mainLoading = false;
      } catch (error) {
        this.$message.info("保存表单数据失败");
        console.log(error);
        this.mainLoading = false;
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
          // bindingId: item.baseProperty.bindingInfo.id,
          patientId: this.patientId,
          bindingInfo:item.baseProperty.bindingInfo
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
      console.log(this.report);
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
      console.log(newer,older)
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
    }
  }
};
</script>
<style scoped>
</style>
<style lang="less">
body.theme-blue {
  .crffill .crf-step .crf-section-title.active,
  .crffill .menu-panel .parent-node.active {
    background: #c6e2ff;
  }
}

body.theme-green {
  .crffill .crf-step .crf-section-title.active,
  .crffill .menu-panel .parent-node.active {
    background: #b2efe0;
  }
}
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
    background-color:rgb(247, 248, 252);
    /*margin-top: 10px;*/
    /*border-top: 2px solid #2d8cf0;*/
  }
  .crf-step-header {
    display: block !important;
    border-bottom: 1px dashed #e9eaec !important;
    padding: 11.5px;
    background-color: #ffffff;
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
