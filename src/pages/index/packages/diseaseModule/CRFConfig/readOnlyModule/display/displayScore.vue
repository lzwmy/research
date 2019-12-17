<template>
  <div :class="item.controlType">
    <!--{{item.baseProperty}}-->
    <div v-if="item.displayIsVisible=='1'" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
      <span>{{item.controlDisplayName}}</span>
    </div>
    <div :class="item.controlType+'_box'">
      <span :class="[item.controlType+'_rangeValue',{'addColor':report.value}]">{{report.value || '0.00'}}</span>
      <el-button type="primary" v-show="report.value" @click="item.baseProperty.scoreInfo.scoreStatus = true" style="width: 120px;">查看评分</el-button>
    </div>
    <i class="iconfont iconzu13"></i>
    <el-dialog :visible.sync="item.baseProperty.scoreInfo.scoreStatus"
               class="dialog_score"
               :append-to-body="true"
               :title="item.controlDisplayName+'评分'">
      <score-pasi ref="pasi" v-if="item.baseProperty.scoreInfo.scoreName == 'PASI'&&item.baseProperty.scoreInfo.scoreStatus" :item="item" :report="report" :index="index"></score-pasi>
      <score-pga ref="pasi" v-if="item.baseProperty.scoreInfo.scoreName == 'PGA'&&item.baseProperty.scoreInfo.scoreStatus" :item="item" :report="report" :index="index"></score-pga>
      <!--<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="scoreSave">确 定</el-button>
        <el-button @click="item.baseProperty.scoreInfo.scoreStatus = false">取 消</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
  import scorePasi from './scoreComponent/scorePasi';
  import scorePga from './scoreComponent/scorePga';
  export default {
    name: "displayScore",
    components:{
      scorePasi,
      scorePga
    },
    props: {
      item: {},
      report: {},
      index: Number
    },
    data() {
      return {

      }
    },
    methods: {
      scoreSave() {
        console.log('评分弹框保存');
        switch (this.item.baseProperty.scoreInfo.scoreName) {
          case "PASI":
            this.report.value = this.$refs.pasi.total;
            // console.log(this.$refs.pasi.total);
            this.item.baseProperty.scoreInfo.scoreStatus = false;
            this.scoreReportSave();
            break;
            case "PGA":
              this.report.value = this.$refs.pasi.pgaValue.toFixed(2);
              this.item.baseProperty.scoreInfo.scoreStatus = false;
              this.scorePGASave();
              break;
          default:
            break;
        }
      },
      //PSAI 评分
      async scoreReportSave() {
        let that = this;
        let jsonData = {
          head:this.$refs.pasi.head,
          torso:this.$refs.pasi.torso,
          upperLimb:this.$refs.pasi.upperLimb,
          lowerLimb:this.$refs.pasi.lowerLimb
        };
        let formData = {
          reportId:JSON.parse(localStorage.getItem('reportFill')).urlParameter.reportId,
          jsonData:JSON.stringify(jsonData),
          scoreName:this.item.baseProperty.scoreInfo.scoreName,
          score:this.$refs.pasi.total
        };
        try{
          let data = await that.$http.scoreReportSave(formData);
          if(data.code === 0 && data.data) {
            this.report.value2 = data.data;
          }else {
            this.$message.info(data.msg);
          }
        }catch (error) {
          console.log(error)
        }
      },
      //PGA 评分
      async scorePGASave() {
        let that = this;
        let formData = {
          reportId:JSON.parse(localStorage.getItem('reportFill')).urlParameter.reportId,
          jsonData:JSON.stringify(this.$refs.pasi.pgaValue),
          scoreName:that.item.baseProperty.scoreInfo.scoreName,
          score:that.$refs.pasi.pgaValue
        };
        try{
          let data = await that.$http.scoreReportSave(formData);
          if(data.code === 0 && data.data) {
            this.report.value2 = data.data;
          }else {
            this.$message.info(data.msg);
          }
        }catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>

<style scoped>
  .SCORE {

  }

  .SCORE .SCORE_title {
    width: 188px;
    display: table-cell;
    font-size: 14px;
  }

  .SCORE .SCORE_box {
    display: table-cell;
  }
  .SCORE .singleColumn {
    width: auto;
    min-width: 188px;
    max-width: 500px;
    padding-right: 5px;
  }
  .SCORE .SCORE_box .SCORE_rangeValue {
    /*padding-right: 20px;*/
    padding-right: 35px;
    font-size: 14px;
  }

</style>
<style>
  .dialog_score .el-dialog__body{
    padding-top: 15px !important;
    padding-bottom: 70px !important;
  }
</style>

