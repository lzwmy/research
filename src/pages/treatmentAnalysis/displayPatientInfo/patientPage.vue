<template>
    <div>
      <patient-portion v-for="(portionItem,portionIndex) in item.formPortions" :key="portionIndex" :item="portionItem" :index="portionIndex" :report="getData(portionItem,portionIndex)"></patient-portion>
    </div>
</template>

<script>
  import patientPortion from './patientPortion';
    export default {
      components:{
        patientPortion
      },
      props:{
        item:{},
        report:{},
        index:Number
      },
      methods:{
        getData(data,index) {
          let arr = this.report.portions.filter(
            o => o.portionDisplayName == data.pageDisplayName
          )
          // return arr[0]
          return arr[index]
        }
      },
      created() {
        // console.log(this.report)
      }
    }
</script>

<style scoped>

</style>
