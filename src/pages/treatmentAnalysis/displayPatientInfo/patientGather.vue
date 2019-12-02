<template>
    <div>
      <div class="gather_item" v-if="item.controlType!=='GATHER'">{{item.controlDisplayName}} -- {{report.value}}</div>
      <patient-gather v-if="item.controlType=='GATHER'" v-for="(gatherItem,gatherIndex) in item.children" :key="gatherIndex" :item="gatherItem" :index="gatherIndex" :report="getData(gatherItem)"></patient-gather>
    </div>
</template>

<script>
    export default {
      name:"patientGather",
      props:{
        item:{},
        report:{},
        index:Number
      },
      methods:{
        getData(data) {
          // console.log(data)
          let arr = this.report.children.filter(
            o => o.name == data.controlDisplayName
          )
          return arr[0]
        }
      },
      created() {
        // console.log(this.report)
      }
    }
</script>

<style scoped>
.gather_item{
  padding: 15px 0;
  height: 52px;
}
</style>
