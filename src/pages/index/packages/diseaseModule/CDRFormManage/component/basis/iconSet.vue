<template>
    <div class="icon_set" v-if="item.controlType!==''">
      <i class="iconfont iconfuhao7" @click="clickSet"></i>
      <dialog-input :dialogShow="dialogShow"
                    :basicDataInfo="basicDataInfo"
                    @dialog-close="dialogClose"></dialog-input>
    </div>
</template>

<script>
  import dialogInput from "./../dialog/dialoginput"
    export default {
      props:{
        item:{
          type:Object,
          default:null
        }
      },
      components:{
        dialogInput
      },
      data() {
        return {
          dialogShow:false,
          basicDataInfo:{
            obj:this.item,
            selectType:this.item.controlType,
          }
        }
      },
      methods:{
        clickSet() {
          this.dialogShow = true;
        },
        dialogClose(value) {
          this.dialogShow = value;
        }
      },
      mounted() {
        console.log(this.item)
      }
    }
</script>

<style lang="less" scoped>
  .icon_set{
    display:inline-block;
    .iconfont{
      color:#3B81F0;
      font-size:21px;
      cursor: pointer;
    }
  }
</style>
