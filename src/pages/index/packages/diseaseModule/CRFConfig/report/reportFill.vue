<template>
  <!--数据连接管理-->
  <div class="cloud-component clearfix  content-container">
    <div class="crfConfig clearfix crffill">
      <div class="crf-main" v-loading="mainLoading" v-if="!showReadComponent">
        <div class="crf-main-content" >
          <div class="crf-step-header flex-between-center">
            <div>
              <i class="header_left"></i>
              <span style="font-size: 16px; margin-right:20px;">{{urlParameter.patientName}}</span>
            </div>
            <div>
              <span v-if="urlParameter.from == 'patientFollowUp'">
                <el-button v-if="urlParameter.fowwowUpstatus !=3 && urlParameter.fowwowUpstatus !=4" @click="followUpStop('终止')" type="warning" :disabled="mainLoading">终 止</el-button>
                <el-button v-if="urlParameter.fowwowUpstatus !=3 && urlParameter.fowwowUpstatus !=4" @click="followUpStop('失访')" type="info" :disabled="mainLoading">失 访</el-button>
                <el-button v-if="urlParameter.from == 'patientFollowUp' && urlParameter.fowwowUpstatus !=3 && urlParameter.fowwowUpstatus !=4" @click="saveFollowUpReportData" type="primary" :disabled="mainLoading">保 存</el-button>
              </span>

              <!--<el-button type="primary" @click="downPDF">下载pdf</el-button>-->
              <el-button v-if="urlParameter.from != 'patientFollowUp' && btnShow" @click="saveReportConfirm" type="primary" :disabled="mainLoading" >保 存</el-button>
              <el-button v-if='btnShow' size="medium" type="success" @click="submitReportConfirm">提 交</el-button>
              <i class="el-icon-close close_icon" title="关闭" @click="closePage"></i>
            </div>
          </div>
          <div  ref="top" class="crf-step-content" id="mainContent" :class="(urlParameter.fowwowUpstatus ==3 || urlParameter.fowwowUpstatus ==4)?'disabled':''">
            <display-report  id="pdfForm" v-if="crfForm!=null&&report!=null" :item="crfForm"  :report="report"></display-report>
          </div>
        </div>
      </div>
      <!--阅读模式-->
      <div v-else>
        <read-report-mode ref="reportRead" v-if="crfForm!=null&&report!=null" :item="crfForm"  :report="report" :tipStatus="tipStatus" :isExamine='isExamine'></read-report-mode>
      </div>
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
    <div  class="break_icon" @click="backTop" :class="scrollTop == '0'?'hide':''">
      <i class="el-icon-caret-top"></i>
    </div>
    <!--报告备注-->
    <div class="remark_box" v-if="urlParameter.from!='patientFollowUp'">
      <div class="remark_title">
        <i class="header_left"></i>
        <span>讨论</span>
        <i class="iconfont iconlujing3" v-if="isExamine" @click="openRemark"></i>
      </div>
      <div class="remark_body_box" v-if="remarkList.length">
        <div class="remark_content-item" v-for="(item,index) in remarkList" :key="index">
          <div class="content-item_title">{{index+1}}、{{item.createTime}} 由 <span>{{item.creatorName}}</span> 创建</div>
          <div class="content-item_info">
            <span v-html="item.content"></span>
            <div>
              <i class="iconfont iconlujing4" v-if="isExamine" @click="modifyRemark(item)"></i>
              <i class="iconfont iconshanchu1 del" v-if="isExamine" @click="deleteRemark(item)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="remark_body_box" style="align-items: center" v-else>
        <img src="./../basisComponents/image/none_content.png" width="180px" alt="">
      </div>
    </div>
    <!--备注图片预览-->
    <image-view v-if="dialogVisibles"
                ref="imageViewS"
                @on-close="closeViewer"
                :state="dialogVisibles"
                :url="images">
    </image-view>
    <!--消息提示-->
    <tip-info ref="tipInfo" v-if="urlParameter.from != 'patientFollowUp'" :tipStatus="tipStatus" :isExamine='isExamine' :tipContent="tipContent" @handleView='handleView'></tip-info>
    <!--添加备注弹框-->
    <el-dialog
      title="添加备注"
      :visible.sync="remarkVisible"
      class="annotate_dialog-box"
      width="40%"
      center>
      <editor :value="editorContent" :isClear="editorVisible" @content-synchronize="contentSynchronize"></editor>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRemark()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import "./../css/crfReady.css";
import utils from 'components/utils/domToPDF';
import displayReport from "./../display/displayReport";
import mixins from "components/mixins";
import { mapGetters } from "vuex";
import { getDom } from './js/verificationForm';
import readReportMode from '../readOnlyModule/readReportmode';
import editor from 'components/packages/wangEnduit/editor';
import tipInfo from './tipInfo';
import imageView from 'components/packages/ImagePreview/imageView';
export default {
  name: "crfConfig",
  mixins: [mixins],
  components: {
    displayReport,
    readReportMode,
    editor,
    tipInfo,
    imageView
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
      urlParameter:{},
      remarkVisible:false,
      editorContent:"",
      editorVisible:false,
      editorInfo:"",
      remarkList:[],
      remarkId:"",
      competence:{
        from:"",  // 患者列表、报告列表、患者随访、数据监察
        status:"",  //报告状态0 未填写 1已填写 2 已提交 3 审核不通过 4 审核通过
        roles:this.$store.state.user.diseaseInfo.roles //1、管理员(所有权限)  2、分中心管理员（无权添加中心,可查看组织管理） 3、数据录入员 4、数据管理员（可审核数据）
      },
      tipStatus:-1,  //报告状态
      isExamine: false, //是否审核
      tipContent:"",
      btnShow: false,
      dialogVisibles:false,
      images:[]
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

    // this.mainContent = document.querySelector("#mainContent");
    // this.mainContent.addEventListener('scroll', this.handleScroll, true)
    window.addEventListener('scroll', this.handleScroll, true);
    /*this.$nextTick(function (){
      let remarkImg = $('.content-item_info img');
      $('.content-item_info img').each(function () {
        $(this).click(function () {
          $(this).attr('src');
          console.log($(this).attr('src').split('/'))
        })
      })
    });*/
  },
  destroyed() {
    // this.mainContent.removeEventListener('scroll',this.handleScroll);
    let that = this;
    window.removeEventListener('scroll',this.handleScroll);
    let imgReview = document.querySelectorAll('.content-item_info img');
    imgReview.forEach(item => {
      item.removeEventListener('click',function () {
        let url = this.getAttribute('src');
        that.showImgPreview(url,false)
      })
    })
  },
  activated() {},
  methods: {
    //终止随访/失访随访
    followUpStop(val) {
      this.$confirm('确认随访'+val+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let that = this;
            that.mainLoading = true;
            try {
              let result = await this.$http.remindChangeStatus({
                  "id": this.urlParameter.id,
                  "status": val == '终止'?3:2,
                  "userId": this.$store.state.user.userLogin.userId,
                  "userName": this.$store.state.user.userLogin.name
              });
              if (result && result.code == "0") {
                this.$message.success(val+"成功!");
                this.closePage();
              }
              that.mainLoading = false;
            } catch (error) {
              that.mainLoading = false;
              that.$notice("操作失败");
              console.log(error);
            }
        }).catch(() => {});
    },
    handleScroll() {
      // this.getContentTop(document.documentElement.scrollTop);
      this.getContentTop($('.cloud-component').scrollTop());
    },
    resize() {
      /*$(".crffill").height($(window).height() - 160);
      $(".crf-main").height($(window).height() - 160);*/
      // $(".binding-box").max-height($(window).height()-160);
    },
    initPage() {
      this.urlParameter = JSON.parse(localStorage.getItem('reportFill')).urlParameter;
      this.patientId = "";
      this.groupId = "";
      this.formId = this.urlParameter.formId;
      this.reportId = this.urlParameter.reportId;
      this.isExamine = this.urlParameter.from=='dataMonitoring'?true:false;

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
      this.getForms().then(()=> {
        this.$nextTick(()=>{
          setTimeout(()=>{
            let height = $(".crf-main").height();
            $('.remark_box').css('margin-top',height)
            clearTimeout()
          },900)
        })
      });
      this.getReportData();
      this.getReportBakNoteList(this.reportId).then(()=> {
        let that = this;
        that.$nextTick(()=> {
          /*$('.content-item_info img').each(function () {
            /!*$(this).click(function () {
              $(this).attr('src');
              console.log($(this).attr('src').split('/'));
              that.showImgPreview($(this).attr('src'),true)
            })*!/
          })*/
          let imgReview = document.querySelectorAll('.content-item_info img');
          imgReview.forEach(item => {
            item.addEventListener('click',function () {
              let url = this.getAttribute('src');
              that.showImgPreview(url,true)
            })
          })
        });
      });
    },
    showImgPreview(url,status) {
      let urlList  = url.split('/');
      this.dialogVisibles = status;
      this.images[0] = this.baseURL+"/file/downloadFile/"+urlList[urlList.length-1];
      this.$nextTick(()=>{
        this.$refs.imageViewS.show();
      });
    },
    //返回上一级
    backingOut() {
      let backInfo = JSON.parse(localStorage.getItem('caseManage'));
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
    contentSynchronize(data) {
      console.log('富文本 编辑回显',data)
      this.editorInfo = data;
    },
    addRemark() {
      const {txtContent="",content=""} = this.editorInfo;
      let remarkId = "";
      if(this.remarkId) {
        remarkId =  this.remarkId;
      }
      let formData = {
        "content": content,
        "id": remarkId,
        "reportId": this.report.id,
        "txtContent": txtContent
      };
      this.reportBakNoteSave(formData).then(()=>{
        this.remarkVisible = false;
        this.remarkId = "";
        this.editorContent="";
        this.editorVisible=false;
        this.getReportBakNoteList(this.report.id);
      })
    },
    openRemark() {
      this.remarkVisible = true;
      // this.editorContent="";
      this.editorVisible = true;
    },
    // 修改备注
    modifyRemark(item) {
      this.editorContent="";
      this.editorVisible=false;
      this.remarkId = item.id;
      this.remarkVisible = true;
      this.editorVisible = true;
      this.editorContent = item.content;
    },
    deleteRemark(item) {
      this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reportBakNoteDelete(item.id).then(()=>this.getReportBakNoteList(this.report.id))
      }).catch(() => {

      });
    },
    closeViewer() {
      this.dialogVisibles = false;
    },
    submitReportConfirm() {
      this.$confirm('是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitReportData();
      }).catch(() => {
      });
    },
    saveReportConfirm() {
      this.$confirm('是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveReportData()
      }).catch(() => {
      });
    },
    downPDF() {
      $(".crfConfig").addClass("heightAuto");
      $("#pdfForm").addClass("pdf")
      this.pdfLoading = true;
      let that = this;
      setTimeout(function(){
        utils.domToPDF("#pdfForm", that.report.reportName);
        that.pdfLoading = false;
        $(".crfConfig").removeClass("heightAuto");
        $("#pdfForm").removeClass("pdf")
      },600)
    },
    //添加备注
    async reportBakNoteSave(value) {
      let that = this;
      let formData = value;
      try{
        let data = await that.$http.reportBakNoteSave(formData);
        console.log(data);
        /*if(data.code ===0 && data.data) {

        }*/
      }catch (error) {
        console.log(error);
      }
    },
    // 获取报告集合
    async getReportBakNoteList(value) {
      let that = this;
      let formData = {
        reportId:value || ""
      };
      try {
        let data = await that.$http.getReportBakNoteList(formData);
        console.log(data)
        if(data.code ===0 && data.data) {
          that.remarkList = data.data;
        }else {
          that.$message.info(data.msg);
        }
      }catch (error) {
        console.log(error);
      }
    },
    async reportBakNoteDelete(value) {
      let that= this;
      let formData = {
        id:value || "",
      };
      try {
        let data = await that.$http.reportBakNoteDelete(formData);
        if(data.code === 0 ) {
          that.$message.success('删除成功');
        }else {
          that.$message.info(data.msg);
        }
      }catch (error) {
        console.log(error)
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
      this.mainLoading = true;
      try {
        // let params = { groupId: this.groupId, patientId: this.patientId };
        let params = { reportId: this.reportId };
        // let report = await this.$http.reportFindReport(this.$format(params));
        let report = await this.$http.queryReportDisplayInfo(this.$format(params));
        console.log('report data',report)
        if (report.data && report.code == "0") {
          this.report = report.data;
          this.tipStatus = report.data.status || 0;
          console.log("====================================")
          console.log(this.report)
          if(report.data && report.data.portions&&report.data.portions.length==0){
              this.$store.commit("CRF_SET_REPORT_STATUS", true);
          }else{
            // this.showReadComponent=true;
            // this.showReadComponent=false;
          }
        }
      } catch (error) {
        this.$notice("获取查找表单关联的模块失败");
        console.log(error);
      }
      this.mainLoading = false;
    },
    //保存保存（随访进来）
    async saveFollowUpReportData() {
      let flag = getDom();
      if(flag) {
        this.$message.info('有必填项未填写');
        return ;
      }
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
        this.report.creatorName = this.$store.state.user.userLogin.name;
        this.report.creatorId = this.$store.state.user.userLogin.userId;
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
    // 保存报告
    async saveReportData() {
      let flag = getDom();
      if(flag) {
        this.$message.info('有必填项未填写');
        return ;
      }
      try {
        this.mainLoading = true;
        this.report.reportName = this.urlParameter.reportName || '';
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
    //提交报告
    async submitReportData() {
      let that = this;
      let flag = getDom();
      if(flag) {
        this.$message.info('有必填项未填写');
        return ;
      };
      let copyData = JSON.parse(JSON.stringify(that.$store.state.annotateData.answerList));
      let resultData = [];
      if(copyData.length) {
        resultData= copyData.filter(item => item.old == 0 )
      }
      let formData = {
        'replyList':resultData || [],
        'reportDto':{
          ...that.report
        }
      };
      try {
        let data = await that.$http.reportBakSubmit(formData);
        console.log(data);
        if(data.code ===0) {
          that.$message.success('提交成功');
          window.location.reload();
        }else {
          that.$message.info(data.msg)
        }
        this.$store.dispatch('resetFun');
        this.$store.dispatch('addModifyDataFun',[]);
        this.$store.dispatch('resetAnswerFun',[]);
      }catch (error) {
        console.log(error);
      }
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
      /*if(!this.showReadComponent) {
        console.log(this.$refs.top)
        this.$refs.top.scrollTop = 0;
      }else {
        this.$refs.reportRead.toTop();
      }*/
      // document.documentElement.scrollTop = 0;
      $('.cloud-component').scrollTop(0);
    },
    getContentTop(top) {
      this.scrollTop = top;
      // let scrollTop = document.documentElement.scrollTop;
    },
    //操作视图
    handleView(data) {
        this.showReadComponent = data.mode === 1 ? true : false;
        this.btnShow = data.showBtn;
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
<style lang="less" scoped>
  .remark_box{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 10px;
    border-top: 1px solid rgba(235,237,242,1);
    padding-top: 10px;
    margin-top: 46px;
    .remark_title{
      margin-bottom: 10px;
      span{
        font-size: 14px;
        color: #333333;
        font-weight: bold;
      }
      i{
        font-size: 16px;
        color: #0076B7;
        padding-left: 14px;
        cursor:pointer;
      }
    }
    .remark_body_box{
      display: flex;
      flex-direction: column;
      width: 100%;
      .remark_content-item{

        .content-item_title{
          font-size:14px;
          line-height:19px;
          color:rgba(51,51,51,1);
          margin: 10px 0;
          span{
            font-weight: bold;
          }
        }
        .content-item_info{
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 46px;
          background:rgba(252,253,252,1);
          border:1px solid rgba(235,237,242,1);
          color:#666666 ;
          line-height: 21px;
          font-size: 13px;
          padding-left: 18px;
          padding-right: 18px;
          margin-left: 20px;
          .iconfont{
            cursor: pointer;
          }
          .del{
            padding-left: 10px;
            &:hover{
              color: #D95555;
            }
          }
        }
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
#mainContent.disabled {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
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
    /*border-left: 4px solid #1BBAE1;*/
    padding-left: 16px;
    height: 25px;
    line-height: 30px;
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
    box-shadow: inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 10px rgba(0,0,0,0.1);
    height: 46px;
    line-height: 46px;
    background-color: #fafafa;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    /*padding: 0 10px !important;*/
    z-index: 2;
  }
  .break_icon{
    position: fixed;
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

.crfConfig.heightAuto {
  height: auto !important;
  #pdfDom.pdf {
    height: auto;
    .head_fixed,
    .content {
      position: sticky;
      overflow: visible;
      left:0;
    }
    .content {
      top: 11px;
    }
  }
}

.cloud-component {
  position: absolute;
  top: 55px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
</style>
