<template>
    <div class="icon_code_set">
      <i class="iconfont iconzidian" @click="codeSetSHow"></i>
      <dialog-code-set :dialogShow="dialogShow"
                       :basicDataInfo="basicDataInfo"
                       @basic-click="basicClicks"
                       @dialog-close="dialogClose"></dialog-code-set>
    </div>
</template>

<script>
  import dialogCodeSet from "./../dialog/dialogCodeSet";
    export default {
      props:{
        item:{
          type:Object,
          default:null
        }
      },
      components:{
        dialogCodeSet
      },
      data () {
        return {
          dialogShow:false,
          basicDataInfo:{
            obj:this.item,
            selectType:this.item.controlType,
          }
        }
      },
      methods:{
        codeSetSHow() {
          this.dialogShow = true;
          console.log(this.item)
        },
        dialogClose(value) {
          this.dialogShow = value;
        },
        basicClicks(value) {
          console.log('设置代码集 数据回显',value)
        }
      },
      mounted() {
        console.log(this.item)
      }
    }
</script>

<style lang="less" scoped>
  .icon_code_set{
    display: inline-block;
    .iconfont{
      color:#3B81F0;
      font-size:21px;
      cursor:pointer;
    }
  }
</style>
