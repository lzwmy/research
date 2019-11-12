<template>
    <div class="report_view_container">
      <!--<div class="report_title">{{reportObj.crfName}}</div>-->
      <!--<div class="single_box" v-for="(page,index) in reportObj.formPages" :key="index">
        <div class="title">{{page.pageName}}</div>
        <div class="section_box" v-for="(sections,it) in page.formPortions" :key="it">
          &lt;!&ndash;{{sections.portionName}}&ndash;&gt;
          <display-item v-for="(child,index) in sections.formItems" :item="child" :key="index"/>
        </div>
        <div class="hr"></div>-->
        
        <display-report v-if="reportObj.crfName" :item="reportObj" :report="report" ></display-report>
      <!--</div>-->
    </div>
</template>

<script>
  import mixins from 'components/mixins';
  // import displayItem from "./component/display/displayItem";
  import displayReport from  "./component/display/displayReport";
  import 'assets/css/crfStyle.less';
    export default {
      name: "reportPreview",
      mixins: [mixins],
      components:{
        // displayItem,
        displayReport
      },
      data() {
        return {
          report:{
              pages:[]
          },
          reportObj:{}
        }
      },
      methods:{
        async crfReportDetailPreview(value) {
          let that = this;
          let fromData = {
            formCrfId:value
          }
          try{
            let data = await that.$http.crfReportDetailPreview(that.$format(fromData));
            console.log("报告预览参数", data)
            if(data.code ==0) {
              that.reportObj = data.data
            }
          }catch (error) {
            that.$notice("预览信息获取失败");
            console.log(error)
          }
        }
      },
      created() {
        console.log(this.$route.query.id)
        this.crfReportDetailPreview(this.$route.query.id)
      }
    }
</script>

<style lang="less" scoped>
.report_view_container{
  padding:15px;
  margin: 15px;
  .report_title{
    font-size: 22px;
    font-weight: bold;
    color:#63666E;
    text-align:center;
  }
  .single_box{
    padding-left: 15px;
    .title{
      font-size: 15px;
      font-weight: bold;
    }
  }
  .hr{
    width: 100%;
    height: 1px;
    background-color:#D8D8D8;
    margin: 5px 0;
  }
}
</style>
