<template>
    <div class="default_report_container">
      <div class="default_report_title">
        {{reportName.crfDisplayName}}
      </div>
      <div class="treatment_comment" v-if="commentState">治疗评论</div>
      <default-page v-for="(pageItem,pageIndex) in reportName.formPages" :item="pageItem" :index="pageIndex"></default-page>
    </div>
</template>

<script>
  import defaultPage from './defaultPage';
    export default {
      components:{
        defaultPage
      },
     props:{
       reportName:{
         type:Object,
         default:null
       },
       commentState:{
         type:Boolean
       }
     },
      data() {
       return {

       }
      },
      methods:{

      },
      mounted() {
      }
    }
</script>

<style lang="less" scoped>
.default_report_container{
  display:inline-block;
  float: left;
  width: 174px;
  text-align: center;
  background:rgba(247,247,247,1);
  border:1px solid rgba(229,229,229,1);
  border-radius:4px;
  box-sizing: border-box;
  overflow: hidden;
  .default_report_title{
    /*height: 52px;
    line-height: 52px;*/
    padding: 14px 0;
    background:rgba(172,172,172,1);
    font-size:16px;
    color: #ffffff;
  }
  .treatment_comment{
    padding: 15px 0;
    height: 52px;
    position: relative;
  }
}
</style>
