<template>
  <div class="read_container-mode">
    <div class="crf-step-header">
      <i class="header_left"></i>
      <span style="font-size: 16px; margin-right:20px;">{{report.patientName}} <!--{{tipStatus}} {{isExamine}}--></span>
      <i class="el-icon-close close_icon" title="关闭" @click="closePage"></i>
      <!--<el-button type="danger" size="mini" style="float:right;margin-left: 5px" @click="closePage">关 闭</el-button>-->
    </div>
    <div class="content-body">
      <display-Report :item="item"  :report="report"></display-Report>
    </div>

    <!--批注弹框新增-->
    <el-dialog
      :title="title"
      :visible.sync="centerDialogVisible"
      class="annotate_dialog-box"
      width="40%"
      center>
      <div class="comment_content">
        <el-input type="textarea" :rows="11" resize="none" placeholder="请输入备注内容" v-model="annotate"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addComment">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="clear_data" @click="clearData">清空</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import "./../css/crfReady.css";
  import displayReport from "./display/displayReport";
  import eventBus from 'src/eventBus/bus.js';
  import utils from 'components/utils/index.js';
  export default {
    name: "readReport",
    props:{
      item: {},
      report: {},
      index: Number,
      tipStatus:Number,
      isExamine:Boolean,
    },
    components:{
      displayReport
    },
    data() {
      return {
        centerDialogVisible: false,
        title:"批注",
        annotate:"",
        currentComment:{
          createTime:"",
          content:"",
          path:""
        }
      }
    },
    watch:{
      '$store.state.annotateData.annotateList':function (data) {
          if(data.length!==0) {
            let copyData = JSON.parse(JSON.stringify(data));
            console.log(copyData);
            let sum = copyData.length;
            if(copyData.length) {
              let resultData  = copyData.filter(item => item.old == 0);
              sum = resultData.length;
            }
            this.$store.dispatch('annotateNumberFun',sum)
          }else  if(data.length == 0) {
            this.$store.dispatch('annotateNumberFun',0)
          }
      }
    },
    methods:{
      initPage() {
        this.$store.dispatch('annotateNumberFun',0);
        this.$store.dispatch('resetFun');
        this.$store.dispatch('addModifyDataFun',[]);
        this.$store.dispatch('resetAnswerFun',[]);
        this.$store.dispatch('setStatusFun',this.tipStatus);
        this.$store.dispatch('setIsExamineFun',this.isExamine);
        /*if(this.tipStatus == 3 || this.tipStatus == 4) {
          this.getReportBakListNotation().then(()=> this.getReportBakListDataChange());
          if(this.tipStatus == 3 && this.isExamine == false) {
            this.getAnswerList();
          }
          return ;
        }else if(this.tipStatus == 2){ //已提交
          this.getReportBakListDataChange()
        }*/
        this.showIconData();
      },
      showIconData() {
        let tipStatus = this.tipStatus;
        let isExamine = this.isExamine;
        if(tipStatus == 2 && isExamine == false) {
          console.log('报告列表 -- 已提交','用户可以查看所有的 批注、修改记录、回复');
          this.getReportBakListNotation()
            .then(()=> this.getReportBakListDataChange())
            .then(()=> this.getAnswerList());
        }else if(tipStatus == 3 && isExamine == false) {
          console.log('报告列表 -- 不通过','显示最近一次 批注、修改信息、回复');
          this.getReportLastNotation()
            .then(() => this.getReportLastDataChange())
            .then(() => this.getReportLastReply())
        }else if(tipStatus == 4 && isExamine == false) {
          console.log('报告列表 -- 通过','完整的阅读报告模式 ,显示全部修改记录');
          this.getReportBakListDataChange()
        }else if (tipStatus == 2 && isExamine == true) {
          console.log('数据监察 -- 待审核','显示最近一次 批注、修改信息、回复');
          this.getReportLastNotation()
            .then(() => this.getReportLastDataChange())
            .then(() => this.getReportLastReply())
        }else if(tipStatus == 3 && isExamine == true)  {
          console.log('数据监察 -- 不通过','显示最近一次 批注、修改信息、回复');
          this.getReportLastNotation()
            .then(() => this.getReportLastDataChange())
            .then(() => this.getReportLastReply())
        }else if(tipStatus == 4 && isExamine == true) {
          console.log('数据监察 -- 通过','完整的阅读报告模式，显示全部修改记录');
          this.getReportBakListDataChange()
        }
      },
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
      //添加评分
      addComment() {
        let timestamp=this.getMyDate(new Date().getTime());
        this.currentComment.createTime = timestamp;
        this.currentComment.content = this.annotate;
        console.log('获取时间戳',timestamp,this.currentComment.content,this.currentComment.path);
        if(this.tipStatus == 3 && this.isExamine == false) {
          let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.answerList));
          if(copyData.length ) {
            for(let i=0;i<copyData.length;i++) {
              if(copyData[i].path == this.currentComment.path && copyData[i].old == 0) {
                copyData.splice(i,1);
                i--;
              }
            }
            this.$store.dispatch('resetAnswerFun',copyData);
          }
          this.currentComment.creatorName = this.$store.state.user.userLogin.name;
          this.currentComment.old = 0;
          this.$store.dispatch('addAnswerFun',Object.assign({},JSON.parse(JSON.stringify(this.currentComment))));
        }else {
          let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
          if(copyData.length ) {
            for(let i=0;i<copyData.length;i++) {
              if(copyData[i].path == this.currentComment.path && copyData[i].old == 0) {
                copyData.splice(i,1);
                i--;
              }
            }
            this.$store.dispatch('resetFun',copyData);
          }
          this.currentComment.creatorName = this.$store.state.user.userLogin.name;
          this.currentComment.old = 0;
          this.$store.dispatch('addFun',Object.assign({},JSON.parse(JSON.stringify(this.currentComment))));
        }
        this.centerDialogVisible = false;
        /*console.log(this.$store.state.annotateData.answerList);*/
        //清空
        this.currentComment.createTime="";
        this.currentComment.content="";
        this.currentComment.path="";
        this.annotate = "";
      },
      clearData() {
        if(this.tipStatus == 3 && this.isExamine == false) {
          let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.answerList));
          if(copyData.length ) {
            for(let i=0;i<copyData.length;i++) {
              if(copyData[i].path == this.currentComment.path && copyData[i].old == 0) {
                copyData.splice(i,1);
                i--;
              }
            }
            this.$store.dispatch('resetAnswerFun',copyData);
          }
        }else {
          let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
          if(copyData.length ) {
            for(let i=0;i<copyData.length;i++) {
              if(copyData[i].path == this.currentComment.path && copyData[i].old == 0) {
                copyData.splice(i,1);
                i--;
              }
            }
            this.$store.dispatch('resetFun',copyData);
          }
        }
        this.annotate = "";
        this.centerDialogVisible = false;
      },
      getMyDate(str) {
        if (str == null || str == "") {
          return '';
        }
        let oDate = new Date(str),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间
        return oTime;
      },
      getzf(num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      },

      // 获取批注信息 -- 所有
      async getReportBakListNotation() {
        let that = this;
        let formData = {
          reportId:that.report.id,
        };
        try {
          let data = await that.$http.getReportBakListNotation(formData);
          console.log('获取批注信息',data);
          if(data.code === 0) {
            if(data.data.length !==0) {
              data.data.forEach(item => {
                item.old = 1; // 1 接口历史记录，不允许修改  0 新增加记录，允许修改
                that.$store.dispatch('addFun',item);
              })
            }
          }
        }catch (error) {
          console.log(error);
        }
      },
      // 获取报告数据变化的数值 -- 所有
      async getReportBakListDataChange() {
        let that = this;
        let formData = {
          reportId:that.report.id
        };
        try {
          let data = await that.$http.getReportBakListDataChange(formData);
          console.log('获取报告数据修改',data);
          if(data.code === 0) {
            this.$store.dispatch('addModifyDataFun',data.data);
          }
        }catch (error) {
          console.log(data)
        }
      },
      // 获取回复列表 -- 所有
      async getAnswerList() {
        let that = this;
        let formData = {
          reportId:that.report.id
        };
        try {
          let data = await that.$http.getAnswerList(formData);
          if(data.code === 0 && data.data) {
            data.data.forEach(item=>{
              return item.old = 1; // 1 代表后台获取数据，不可编辑 0自己手动改录入数据，可以允许编辑
            });
            this.$store.dispatch('resetAnswerFun',data.data);
          }
        }catch (error) {
          console.log(error);
        }
      },
      // 获取最近一次 批注 集合
      async getReportLastNotation() {
        let that = this;
        let formData = {
          reportId:that.report.id
        };
        try {
          let data = await that.$http.getReportLastNotation(formData);
          console.log('获取最近一次 批注回复信息',data);
          if(data.code === 0) {
            if(data.data.length !==0) {
              data.data.forEach(item => {
                item.old = 1; // 1 接口历史记录，不允许修改  0 新增加记录， 不允许修改
                that.$store.dispatch('addFun',item);
              })
            }
          }
        }catch (error) {
          console.log(error)
        }
      },
      // 获取 最近一次 数据变化 集合
      async getReportLastDataChange() {
        let that = this;
        let formData = {
          reportId:that.report.id
        };
        try{
          let data = await that.$http.getReportLastDataChange(formData);
          console.log('获取报告数据修改--最近一次',data);
          if(data.code === 0 ) {
            this.$store.dispatch('addModifyDataFun',data.data);
          }
        }catch (error) {
          console.log(error)
        }
      },
      // 获取 最近一次 回复 集合
      async getReportLastReply() {
        let that = this;
        let formData = {
          reportId:that.report.id
        };
        try{
          let data = await that.$http.getReportLastReply(formData);
          if(data.code === 0 && data.data) {
            data.data.forEach(item=>{
              return item.old = 1; // 1 代表后台获取数据，不可编辑 0自己手动改录入数据，可以允许编辑
            });
            this.$store.dispatch('resetAnswerFun',data.data);
          }
        }catch (error) {
          console.log(error);
        }
      }
    },
    mounted() {
      this.initPage();
      eventBus.$on('display-show',result => {
        console.log('批注点击事件',result);
        this.annotate = "";
        this.currentComment.path = result;
        if(this.tipStatus == 4 && this.isExamine == true && this.$store.state.annotateData.tipBtnText == '重新审核'){
          return false;
        }
        if(this.tipStatus == 4 && this.isExamine == false && this.$store.state.annotateData.tipBtnText == '召回'){
          return false;
        }
        this.centerDialogVisible = true;
        if(this.tipStatus == 3 && this.isExamine == false) {
          this.title = '回复';
          let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.answerList));
          if(copyData.length) {
            copyData.forEach(item => {
              if(item.path == result && item.old == 0) {
                this.annotate = item.content;
                return ;
              }
            })
          }
        }else {
          this.title = '批注';
          let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
          if(copyData.length) {
            copyData.forEach(item => {
              if(item.path == result && item.old == 0) {
                this.annotate = item.content;
                return ;
              }
            })
          }
        }

      })
    },
    beforeDestroy () {
      eventBus.$off('display-show')
    },
    activated() {
      this.initPage();
      this.$nextTick(()=>{
        setTimeout(()=>{
          let height = $(".crf-main").height();
          $('.remark_box').css('margin-top',height)
          clearTimeout()
        },900)
      })
    }
  }
</script>

<style lang="less" scoped>
.read_container-mode {
  position: relative;
  .content-body{
    // margin-top: 50px;
    background-color: #FCFCFC;
  }
  .close_icon {
    line-height: 46px;
    float: right;
  }
}
</style>
