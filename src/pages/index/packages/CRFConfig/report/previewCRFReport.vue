<template>
    <div class="preview_crf_report-container">
      <el-dialog
        title="CRF报告预览"
        :append-to-body="true"
        :visible.sync="dialogVisible"
        :fullscreen="true"
        class="crf_form-preview-dialog"
        @close="closeAddDialog">
        <div class="crf_report-title">{{preview.crfDisplayName}}</div>
        <div class="crf-report_content" v-if="JSON.stringify(preview)!=='{}'">
          <reportPreview  v-for="(portion,index) in preview.formPortions" :item='portion' :key="index"></reportPreview>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import reportPreview from './../preview/reportPreview';
    export default {
      name: "previewCRFReport",
      components:{
        reportPreview
      },
      props:{
        formMask:{
          type:Boolean,
          default:null
        },
        crfPreview:{
          type:Object,
          default: null
        }
      },
      watch:{
        "formMask":function (value) {
          this.dialogVisible = value;
          if(value) {
            this.init();
          }
        }
      },
      data() {
        return {
          dialogVisible:false,
          preview:{},
        }
      },
      methods:{
        //初始化
        init() {
          console.log('初始化');
          /*this.previewCRFList();*/
          this.preview = this.crfPreview
        },
        //关闭 弹框
        closeAddDialog() {
          this.dialogVisible = false;
          this.$emit('close-dialog',false)
        },
        // 预览CRF 详细信息
        async previewCRFList() {
          let that = this;
          let formData = {
            formCrfId:that.$route.query.crfId
          };
          try {
            let data = await that.$http.CRFReportPreview(formData);
            if(data.code == 0) {
              that.preview = data.data;
            }
          }catch (error) {
            console.log(data);
          }
        },
      },
      mounted() {
      }
    }
</script>

<style lang="less">
.crf_form-preview-dialog{
  .el-dialog{
    background-color: #f7f8fc;
    .el-dialog__header{
      .el-dialog__title{
        font-size: 16px;
        color: #394263;
        font-weight: bold;
      }
    }
    .el-dialog__body{

      .crf_report-title{
        font-size: 16px;
        color: #394263;
        font-weight: bold;
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .crf-report_content{
        .report_view_container{
          background-color: transparent;
        }
        .displayPortion_title{
          margin-bottom: 5px;
        }
        .displayPortion_box{
          /*width: 1200px;
          min-width: 1200px;*/
          margin-left: 15px;
        }
      }
    }
  }

}
</style>
