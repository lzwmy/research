<template>
    <div class="patient_form_container">
      <report-fill></report-fill>
    </div>
</template>


<script>
  import utils from 'components/utils';
  import reportFill from './../index/packages/diseaseModule/CRFConfig/report/reportFill';
    export default {
      name:"patientForm",
      components:{
        reportFill
      },
      data() {
        return {
          title:""
        }
      },
      methods:{
        resize() {
          $(".crffill").height($(window).height()-10);
          $(".crf-main").height($(window).height()-10);
          // $(".binding-box").max-height($(window).height()-160);
        }
      },
      mounted() {
        let titleName = JSON.parse(localStorage.getItem('reportFill')).urlParameter;
        document.getElementsByTagName('title')[0].innerHTML=titleName.patientName+titleName.title;
        this.$nextTick(function () {
          // this.resize();
        })
      }
    }
</script>

<style lang="less" scoped>
  .patient_form_container{
    /*padding: 5px;*/
    box-sizing: border-box;
  }

</style>
