<template>
    <div class="icon_display">
      <i v-if="P_item.displayIsVisible==1" class="iconfont iconfuhao2" @click="clickIsRequiredShow(P_item.displayIsVisible)"></i>
      <i v-if="P_item.displayIsVisible==0" class="iconfont iconfuhao2 gray" @click="clickIsRequiredShow(P_item.displayIsVisible)"></i>
    </div>
</template>

<script>
    export default {
      props:{
        item:{
          type:Object,
          default:null
        }
      },
      data() {
        return {
          P_item:this.item
        }
      },
      methods:{
        clickIsRequiredShow(value) {
          if(value==1){
            this.P_item.displayIsVisible = 0;
          }else{
            this.P_item.displayIsVisible = 1;
          }
          this.$emit('IsRequiredShow',this.P_item)
        }
      }
    }
</script>

<style lang="less" scoped>
.icon_display{
  display:inline-block;
  .iconfont{
    color:#3B81F0;
    font-size:21px;
    cursor: pointer;
  }
  .gray{
    color: #DEE2E5;
  }
}
</style>
