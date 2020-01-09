<template>
    <div class="config_portion-preview-container">
      <el-dialog
        title="小节预览"
        :append-to-body="true"
        :visible.sync="dialogVisible"
        :fullscreen="true"
        class="config_portion-preview-dialog"
        @close="closeAddDialog">
        <div class="preview_content-body" >
          <!--{{previewData}}-->
          <preview-portion v-if="dialogVisible" :item="previewData"></preview-portion>
        </div>
      </el-dialog>
    </div>
</template>

<script>

  import previewPortion from './../preview/sectionPreview';
    export default {
      name: "configPortionPreview",
      components:{
        previewPortion
      },
      props:{
        portionMask:{
          type:Boolean,
          default:null
        },
        configDataInfo:{
          type:Object,
          default: null
        }
      },
      watch:{
        "portionMask":function (value) {
          this.dialogVisible = value;
          if(value) {
            this.init();
          }
        },
       /* "configDataInfo":{
          deep:true,
          handler(value) {
            console.length('监听',value)
            /!*this.previewData = value;*!/
          }
        }*/
      },
      data() {
        return {
          dialogVisible:false,
          previewData:this.configDataInfo
        }
      },
      methods:{
        //初始化
        init() {
          // console.log('初始化');
          // this.previewData = {};
          // let array = [];
          // this.$parent.basisDataList.forEach(item=>{
          //   array.push(
          //     Object.assign({},JSON.parse(JSON.stringify(item)))
          //   )
          // });
          // this.previewData.portionName = this.$parent.portionName;
          // this.previewData.formItemList= array;
          // console.log('弹框',array);
        },
        //关闭弹框
        closeAddDialog() {
          this.dialogVisible = false;
          this.$emit('close-dialog',false);
        }
      },
      mounted() {
      }
    }
</script>

<style lang="less">
  .config_portion-preview-dialog{
    .el-dialog {
      .el-dialog__header{
        .el-dialog__title{
          font-size: 16px;
          color: #394263;
          font-weight: bold;
        }
      }
      .el-dialog__body{
        .preview_content-body {
          .section_preview_container {
            .displayPortion_container {
              .displayPortion_title {
                width: 100%;
                height: 50px;
                background-color: #E5EBEC;
                border: 1px solid #e5ebec;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-direction: row;
                flex-direction: row;
                position: relative;
                box-sizing: border-box;
                -ms-flex-pack: justify;
                justify-content: space-between;
                -ms-flex-align: center;
                align-items: center;
                font-size: 14px;
                font-family: 'MicrosoftYaHei';
                font-weight: bold;
                color: #394263;
                padding-left: 20px;
                position:relative;
                .left-line{
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 4px;
                  height: 49px;
                  background-color: #1BBAE1;
                  //background-color: #1bbae1;
                  //background-color: #2d8cf0;
                }
              }
              .displayPortion_box {
                padding-left: 21px;
                border: 1px solid #E5EBEC;
              }
            }
          }
        }
      }
    }
  }
</style>
