<template>
    <div class="portion_container-dialog">
      <el-dialog
        title="小节配置"
        :append-to-body="true"
        :visible.sync="dialogVisible"
        :fullscreen="true"
        class="portion_container-dialog-box"
        @close="closeAddDialog">
        <div v-if="dialogVisible">
          <basis-config :configData="portionConfigData" @portion-callback-add="portionCallbackAdd" @portion-callback-data="portionCallbackData"></basis-config>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import basisConfig from './../basisComponents/basisConfig';
    export default {
      name: "portionDialog",
      components:{
        basisConfig
      },
      props:{
        showConfigPortion:{
          type:Boolean,
          default:null
        },
        portionConfigData:{
          type:Object,
          default:null
        }
      },
      data() {
        return {
          dialogVisible:false,
        }
      },
      watch:{
        "showConfigPortion":function (value) {
          this.dialogVisible = value;
          if(value) {
            this.init();
          }
        }
      },
      methods:{
        resize() {
          let height = $(".portion_container-dialog-box").height();
          $(".basis_body-content").height(height-203)
        },
        init() {
          this.$nextTick(()=>{
            this.resize();
          })
          // console.log(this.portionConfigData)
        },
        closeAddDialog() {
          this.dialogVisible = false;
          this.$emit('close-dialog',false)
        },
        portionCallbackData(data) {
          console.log('数据回调',data);
          this.$emit('update-data',data);
          this.dialogVisible = false;
        },
        portionCallbackAdd(data) {
          console.log('添加数据回调',data);
          this.$emit('portionCallback-add',data);
          this.dialogVisible = false;
        }
      },
      mounted() {

      }
    }
</script>

<style lang="less">
  .portion_container-dialog-box{
    .el-dialog{
      .el-dialog__header{
        .el-dialog__title{
          font-size: 16px;
          color: #394263;
          font-weight: bold;
        }
      }
      .el-dialog__body{
        padding:  0 !important;
        .basis_config_container{
          /*box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);*/
        }
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
        }
        .basis_nav-box{
          padding: 0;
          height: 100px;
          background:rgba(245,247,250,0.6);
          border-top: 1px solid #E9E9EA;
          border-bottom: 1px solid #E9E9EA;
          .nav_info-content{
            background-color: transparent;
            border: none;
            height: 100px;
            /*box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);*/
          }
        }
        .basis_body-content{
          .basis_content_config {
            border-color: transparent;
            border-right: 1px solid  #E5EBEC;
            .blank_page{
              border-color: transparent;
              border-right: 1px solid  #E5EBEC;
            }
          }
          .basis_parameter_config{
            border-color: transparent;
            .blank_page{
              border-color: transparent;
            }
          }
        }
      }
    }
  }
</style>
