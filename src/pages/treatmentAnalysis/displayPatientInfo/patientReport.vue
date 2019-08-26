<template>
    <div>
      <patient-page v-for="(formPageItem,formPageIndex) in item.formPages" :item="formPageItem" :index="formPageIndex" :report="getData(formPageItem)"></patient-page>
    </div>
</template>

<script>
  import patientPage from './patientPage';
    export default {
      components:{
        patientPage
      },
      props:{
        item:{
          type:Object,
          default:null
        },
        report:{
          type:Object,
          default:null
        }
      },
      data() {
        return {
        }
      },
      methods:{
        getData(data) {
            let arr = this.report.pages.filter(
              o => o.pageName == data.pageDisplayName
            );
          return arr[0];
        }
      },
      created() {
        // console.log(this.report)
      }
    }
</script>

<style scoped>

</style>
