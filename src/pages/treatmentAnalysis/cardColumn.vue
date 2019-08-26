<template>
    <div class="card_cloumn">
      <div v-if="displayName=='value'">{{item.patientName}}</div>
      <div v-if="displayName=='name'">{{item.report.reportName}}</div>
      <div v-if="displayName=='name'">治疗评语</div>
      <div class="treatment_comment" v-if="displayName=='value'">{{item.treatmentTxtComment}}</div>
      <card-report v-if="displayName=='value'" v-for="(reportItem,reportIndex) in item.report.pages"  :item="reportItem" :index="reportIndex" :key="index" :displayName="displayName"></card-report>
      <card-report v-if="displayName=='name'" v-for="(reportItem,reportIndex) in item.report.pages"  :item="reportItem" :index="reportIndex" :key="index" :displayName="displayName"></card-report>
    </div>
</template>

<script>
    import cardReport from './cardReport';
    export default {
      components:{
        cardReport
      },
      props:{
        item:{
          type:Object,
          default:null
        },
        index:{
          type:Number,
          default:null
        },
        displayName:{
          type:String,
          default:null
        }
      },
      data() {
        return {

        }
      },
      created() {
      },
      methods:{
      },
      mounted() {
      }
    }
</script>

<style scoped>
.card_cloumn{
  float: left;
}
</style>
