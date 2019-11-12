<template>
  <div v-if="dialogShow">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <!-- <pre-view :addEditData="allData"></pre-view> -->
      <!-- {{allData[0]}} -->
      <display-item style="margin-top:-30px" :item="allData[0]" :report="report" /> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePreviewBtn">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import preView from './../preview/view';
  import displayItem from './../display/displayItem';
  export default {
    name: "dialogperview",
    components:{
      preView,
      displayItem
    },
    props:{
      dialogShow:{
        type:Boolean,
        default:null
      },
      basicDataInfo:{
        type:Object,
        default: null
      },
      allData:{
        type:Array,
        default:null
      }
    },
    data() {
      return {
        dialogFormVisible:true,
        title:"预览",
        report:{
          children:[],
          value:null
        }
      }
    },
    watch:{
      dialogShow:function(val){
        console.log(this.dialogShow);
        this.title ='预览-'+ this.allData[0].controlDisplayName;
        this.dialogFormVisible = true;
      },
      dialogFormVisible:function (value){
        console.log("触发dialogFormVisible",value)
        if(value==false) {
          this.$emit("dialog-close",false);
        }
      },
    },
    methods:{
      clickSaveBtn() {
        this.dialogFormVisible = false;
        let preview = {
          preview:''
        }
        sessionStorage.setItem('dialogPreview',JSON.stringify(preview))
      },
      closePreviewBtn() {
        let preview = {
          preview:''
        }
        sessionStorage.setItem('dialogPreview',JSON.stringify(preview))
        this.dialogFormVisible = false;
      }
    },
    mounted() {
      console.log("预览 获取基础数据",this.allData)
       console.log("预览数据json",JSON.stringify(this.allData))
      if(this.allData.length>0){
        this.title ='预览-'+ this.allData[0].controlDisplayName
      }
    }
  }
</script>

<style lang="less">
  .line_blockDate{
    width:100% !important;
    .el-form-item__content{
      margin-left:0 !important;
    }
  }

</style>
