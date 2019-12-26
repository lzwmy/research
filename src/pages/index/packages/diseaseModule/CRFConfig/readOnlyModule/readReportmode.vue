<template>
  <div class="read_container-mode">
    <div class="crf-step-header">
      <i class="header_left"></i>
      <span style="font-size: 16px; margin-right:20px;">{{report.patientName}}</span>
      <i class="el-icon-close close_icon" title="关闭" @click="closePage"></i>
      <!--<el-button type="danger" size="mini" style="float:right;margin-left: 5px" @click="closePage">关 闭</el-button>-->
    </div>
    <div class="content-body">
      <display-Report :item="item"  :report="report"></display-Report>
    </div>

    <!--批注弹框新增-->
    <el-dialog
      title="批注"
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
    },
    components:{
      displayReport
    },
    data() {
      return {
        centerDialogVisible: false,
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
            let sum = copyData.length;
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
        console.log(this.tipStatus)
        if(this.tipStatus == 3 || this.tipStatus == 4) {
          this.getReportBakListNotation().then(()=> this.getReportBakListDataChange());
          return ;
        }else if(this.tipStatus == 2){ //已提交
          this.getReportBakListDataChange()
          // this.getReportBakListNotation().then(()=> this.getReportBakListDataChange());
        }
        /*this.getReportBakListNotation().then(()=> this.getReportBakListDataChange());*/
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
        let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
        if(copyData.length ) {
          for(let i=0;i<copyData.length;i++) {
            if(copyData[i].path == this.currentComment.path) {
              copyData.splice(i,1);
              i--;
            }
          }
          this.$store.dispatch('resetFun',copyData);
        }
        this.$store.dispatch('addFun',Object.assign({},JSON.parse(JSON.stringify(this.currentComment))));
        this.centerDialogVisible = false;
        console.log(this.$store.state.annotateData.annotateList);
        //清空
        this.currentComment.createTime="";
        this.currentComment.content="";
        this.currentComment.path="";
        this.annotate = "";
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

      // 获取批注信息
      async getReportBakListNotation() {
        let that = this;
        let formData = {
          reportId:that.report.id,
        };
        try {
          let data = await that.$http.getReportBakListNotation(formData);
          console.log('获取批注信息',data)
          if(data.code === 0) {
            if(data.data.length !==0) {
              data.data.forEach(item => {
                that.$store.dispatch('addFun',item);
              })
            }
          }
        }catch (error) {
          console.log(error);
        }
      },
      // 获取报告数据变化的数值
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
      }
    },
    mounted() {
      this.initPage();
      eventBus.$on('display-show',result => {
        console.log('批注点击事件',result);
        this.currentComment.path = result;
        this.centerDialogVisible = true;
        let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
        if(copyData.length) {
          copyData.forEach(item => {
            if(item.path == result) {
              this.annotate = item.content;
              return ;
            }
          })
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
