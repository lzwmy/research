<template>
    <div >
      <div class="patient_container" v-for="(reportItem,reportIndex) in item" :index="reportIndex">
        <div class="patient_title" :class="[{TODO:reportItem.treatmentStatus=='TODO',HEAL:reportItem.treatmentStatus=='HEAL',IMPROVE:reportItem.treatmentStatus=='IMPROVE',INVALID:reportItem.treatmentStatus=='INVALID',WORSEN:reportItem.treatmentStatus=='WORSEN'}]">
          {{reportItem.patientName}}
          <span>{{reportItem.treatmentStatus=='TODO'?'待访':reportItem.treatmentStatus=='HEAL'?'治愈':reportItem.treatmentStatus=='IMPROVE'?'好转':reportItem.treatmentStatus=='INVALID'?'无效':reportItem.treatmentStatus=='WORSEN'?'恶化':'无'}}</span>
          <i class="close_card" :class="[{'close_TODO':reportItem.treatmentStatus=='TODO','close_HEAL':reportItem.treatmentStatus=='HEAL','close_IMPROVE':reportItem.treatmentStatus=='IMPROVE','close_INVALID':reportItem.treatmentStatus=='INVALID','close_WORSEN':reportItem.treatmentStatus=='WORSEN'}]">X</i>
        </div>
        <div class="treatment_comment" v-if="commentState">{{reportItem.treatmentTxtComment}}</div>
        <patient-report  :report="reportItem.report" :item="report"></patient-report>
      </div>
    </div>
</template>

<script>
  import patientReport from './patientReport';
    export default {
      components:{
        patientReport
      },
      props:{
        item:{
          type:Array,
          default:null
        },
        index:{
          type:Number,
          default:null
        },
        report:{
          type:Object,
          default:null
        },
        commentState:{
          type:Boolean
        }
      },
      data() {
        return {
          reportObj:this.report
        }
      },
      methods:{

      },
      created() {
      }
    }
</script>

<style lang="less" scoped>
.patient_container{
  float: left;
  width: 174px;
  text-align: center;
  border-radius:4px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(229,229,229,1);
  box-sizing: border-box;
  margin-left:14px;
  overflow: hidden;
  .patient_title{
    padding: 14px 0;
    background:rgba(15,63,137,1);
    font-size:16px;
    color: #ffffff;
    position: relative;
    span{
      font-size: 12px;
      border:1px solid rgba(255,255,255,1);
      display: inline-block;
      width: 34px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      margin-left: 4px;
    }
    .close_card{
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 12px;
      display: inline-block;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 17px;
      border:1px solid #ffffff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .treatment_comment{
    padding: 15px 0;
    height: 52px;
  }
  .TODO{
    background-color: #0190DE ;
  }
  .close_TODO:hover{
    background-color: #ffffff;
    color: #0190DE;
  }
  .HEAL{
    background-color: #0FBB93 ;
  }
  .close_HEAL:hover{
    background-color: #ffffff;
    color: #0FBB93;
  }
  .IMPROVE{
    background-color: #8EC466 ;
  }
  .close_IMPROVE:hover{
    background-color: #ffffff;
    color: #8EC466;
  }
  .INVALID{
    background-color: #04B8DD ;
  }
  .close_INVALID:hover{
    background-color: #ffffff;
    color: #04B8DD;
  }
  .WORSEN{
    background-color: #D95555 ;
  }
  .close_WORSEN:hover{
    background-color: #ffffff;
    color: #D95555;
  }
}
</style>
<style>
  .patient_container:hover{
    border:1px solid rgba(60,129,240,1);
    box-shadow:3px 5px 8px rgba(0,0,0,0.16);
    border-radius:4px;
  }
</style>
