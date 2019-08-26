<template>
    <div>
      <!--{{item.portionDisplayName}}-->
      <patient-entry v-for="(entryItem,entryIndex) in item.formItems" :item="entryItem" :index="entryIndex" :report="getData(entryItem,entryIndex)"></patient-entry>
    </div>
</template>

<script>
  import patientEntry from './patientEntry';
    export default {
      components:{
        patientEntry
      },
      props:{
        item:{},
        report:{},
        index:Number
      },
      methods:{
        getData(data,index) {
         let arr = this.report.items.filter(
            o => o.name = data.controlDisplayName
          )
          // return arr[0]
          return arr[index]
        }
      },
    }
</script>

<style scoped>

</style>
