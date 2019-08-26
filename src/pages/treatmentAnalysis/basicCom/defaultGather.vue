<template>
    <div>
      <div class="gather-item" v-if="item.controlType!=='GATHER'">{{item.controlDisplayName}}</div>
      <!--&#45;&#45;{{item.controlType}}-->
      <default-gather v-if="item.controlType=='GATHER'" v-for="(gatherItem,gatherIndex) in item.children" :item="gatherItem" :index="gatherIndex"></default-gather>
    </div>
</template>

<script>
    export default {
      name:"defaultGather",
      props:{
        item:{
          type:Object,
          default:null
        },
        index:{
          type:Number,
          default:null
        }
      },
    }
</script>

<style scoped>
.gather-item{
  padding:15px 0;
  height: 52px;
  position:relative;
}
</style>
