<template>
  <div class="reportFollowup">
    <div class="head-fixed">
      <header v-loading="loading">
        <div>
          <span>{{dataInfo.diseaseName}}<span style="font-size: 16px;" v-show="dataInfo.groupName"> / {{dataInfo.groupName}}</span></span>
          <span><span @click="sendPatientCode" class="icon iconfont iconweixin" :class="openId?'':'active'"></span>姓名：{{personalInfo.PATIENT_NAME}}</span>
          <span>性别：{{personalInfo.GENDER_NAME}}</span>
          <span>年龄：{{personalInfo.AGE}}</span>
          <span>病案号：{{personalInfo.PATIENT_ID}}</span>
          <span class="showTreatmentStatus"
                :class="[{TODO:treatmentStatus=='TODO',HEAL:treatmentStatus=='HEAL',IMPROVE:treatmentStatus=='IMPROVE',INVALID:treatmentStatus=='INVALID',WORSEN:treatmentStatus=='WORSEN'}]"
                @click="openTreatmentDrawer">
            {{treatmentStatus=='TODO'?'待访':treatmentStatus=='HEAL'?'治愈':treatmentStatus=='IMPROVE'?'好转':treatmentStatus=='INVALID'?'无效':treatmentStatus=='WORSEN'?'恶化':'无治疗结果'}}
          </span>
        </div>
        <el-button size="mini" @click="$emit('back')"><i class="el-icon-back">返回</i></el-button>
      </header>

      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="报告" name="first"></el-tab-pane>
        <el-tab-pane label="提醒" name="second"></el-tab-pane>
        <el-tab-pane label="RASI评分" name="three"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 动态组件 -->
      <section>
        <component 
          ref="componets" 
          :is="dynamicCom" 
          :dataInfo="dataInfo"
          :reportFillData="reportFillData"
          @handleTabClick="handleTabClick">
        </component>
      </section>
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
  </div>
</template>

<script>
import report from './report'
import remind from './remind'
import RASIScore from './RASIScore'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import 'assets/css/common.less';


export default {
  name: 'reportFollowup',
  props:['dataInfo','personalInfo','reportFillData'],
  data () {
    return {
      activeName: "first",
      activeSelect: false,
      loading: false,
      //动态组件
      dynamicCom: 'report',
      basicInfo:{},
      openId:"",
      dataList: {
        content: [{}]
      },
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
      }
    };
  },
  watch: {
    
  },
  computed: {
  },
  created () {
    this.getPatientSearch()
  },
  mounted () {
    console.log(this.dataInfo);
    this.drawerTitle =this.personalInfo.PATIENT_NAME+"-治疗结果";
    this.$nextTick(function () {
      $('.el-drawer__header>span').prepend('<i class="iconfont iconzhiliaoxiaoguo" style="margin-right: 9px;font-size: 18px;font-weight: normal"></i>')
    });
    this.queryTreatmentInfo()
  },
  components: {
    report,
    remind,
    RASIScore,
    quillEditor
  },
  methods: {
    resize() {
      let height = $('.el-drawer__body').height();
      $('.quill_style').height(height-330)
    },
    //选择类型下拉
    onSelectType(){ 

    },
    //动态组件
    handleTabClick(tab, event) {
      this.activeName = tab.paneName;
      switch(tab.paneName) {
        case "first" :
          this.dynamicCom = "report";
          break;
        case "second" :
          this.dynamicCom = "remind";
          break;
        case "three" :
          this.dynamicCom = "RASIScore";
          break;
        default:
          this.dynamicCom = "report";
          break;
      }
    },
    openTreatmentDrawer() {
      this.drawer = true;
      this.$nextTick(function () {
        this.resize();
      });
    },
    //保存功能
    saveDrawer() {
      console.log('保存',this.commentInfo);
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
          console.log(res)
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
          console.log(data.data)
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
    }
  }
};
</script>


<style lang='less'>
.reportFollowup {
  position: absolute;
  left: 0;
  bottom:0;
  top: 0;
  right: 0;
  padding: 10px 20px;
  .head-fixed {
    header {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div > span {
        display:inline-block;
        margin-right: 70px;
        font-size: 14px;
        color: #63666E;
        .icon {
          margin-right: 10px;
          font-size:24px;
          &.active {
            color: #2d8cf0;
          }
        }
        &:first-child {
          color: #444;
          font-size: 18px;
          border-left: 4px solid #2d8cf0;
          padding-left: 8px;
          line-height: 24px;
        }
      }
      .el-button {
        justify-self: flex-end;
        border: none;
        &:hover {
          background: none;
        }
      }
    }
    .el-tabs .el-tabs__header {
      margin: 0;
      background:#fff;
      .el-tabs__item {
        height: 35px;
        line-height: 35px;
        background: transparent !important;
        padding: 0 35px;
        font-size: 14px;
      }
    }
  }
  section {
    border: 1px solid #dfe4ed;
    border-top: none;
    position: absolute;
    left: 20px;
    top: 105px;
    padding-top: 10px;
    bottom: 20px;
    right: 20px;
  }
  .cloud-component,
  .cloud-search-list {
    height: 100%;
  }
  .cloud-search-list {
      position: relative;
      .el-table {
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        bottom: 55px;
        .el-table__header-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10; 
        }
        .el-table__body-wrapper {
          overflow-y: auto;
          overflow-x: hidden;
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
      .cloud-pagination {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
      }
  }
  
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
.showTreatmentStatus{
  padding: 5px 18px;
  font-size: 12px;
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
</style>
<style>
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
</style>
