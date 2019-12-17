<template>
  <!--消息提示窗口-->
  <div class="tip_box">
    <!--不通过-->
    <div class="fail_status" v-if="status===0">
      <div class="comment_info">
        <i class="iconfont iconjianqu3"></i>
        <span>已批注2处数据</span>
      </div>
      <div class="fail_btn" @click="clickVerify(3)">不通过</div>
    </div>
    <!--召回 未审核 -->
    <div class="unreviewed_status" v-else-if="status">
      <div class="comment_info">
        <i class="iconfont iconjianqu1"></i>
        <span>已批注2处数据</span>
      </div>
      <div class="unreviewed_btn">召回</div>
    </div>
    <!--通过 无数据批注-->
    <div class="pass_status" v-else-if="status">
      <div class="comment_info">
        <i class="iconfont iconjianqu2"></i>
        <span>尚无数据批注</span>
      </div>
      <div class="pass_btn" @click="clickVerify(4)">通过</div>
    </div>
    <!--召回 已审核 -->
    <div class="audited_status" v-else-if="status">
      <div class="comment_info">
        <i class="iconfont iconjianqu1"></i>
        <span>数据已通过审核</span>
      </div>
      <div class="audited_btn">召回</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tipInfo",
    props:{
      tipStatus:{
        type:Number,
        default:null
      },
      tipContent:{
        type:String,
        default:null
      }
    },
    data() {
      return {
        status:this.tipStatus,
        content:this.tipContent
        /***
         * status 0 (未填写) => 无弹窗  显示提交保存按钮 （填写模式）
         status 1 (已填写) => 无弹窗  显示提交保存按钮  （填写模式）

         非数据监察进入
         status 2 (已提交) => 弹窗:数据尚未审核 召回  （阅读模式）   召回=>填写模式
         status 3 (不通过) => 弹窗:数据审核不通过 召回  （阅读模式） 召回=>填写模式
         status 4 (通过) => 弹窗:数据审核通过 召回  （阅读模式）     召回=>填写模式

         数据监察进
         status 2 (已提交) => 弹窗:审核 通过/不通过  （阅读模式）
         status 3 (不通过) => 弹窗:数据审核不通过 重新审核  （阅读模式）
         status 4 (通过) => 弹窗:数据审核通过 重新审核  （阅读模式）
         * **/
      }
    },
    methods:{
      clickVerify(status) {
        this.readReportBakAudit(status).then(data => this.$emit('',data));
      },
      // 审核报告 3 通过 4 不通过
      async readReportBakAudit(status) {
        let that = this;
        let formData = {
          'notationList':this.$store.state.annotateData.annotateList || [],
          "reportId":that.report.id,
          "status":status,
        };
        try {
          let data = await that.$http.readReportBakAudit(formData);
          return data;
        }catch (error) {
          console.log(error);
        }
      },
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .tip_box {
    position: fixed;
    top: 22px;
    left: 50%;
    z-index: 3;
    transform: translate(-50%,-16px);
    .fail_status{
      display: flex;
      width: 556px;
      height: 42px;
      background:rgba(232,70,1,0.08);
      border:1px solid rgba(235,69,0,1);
      opacity:1;
      border-radius:4px;
      padding: 5px 10px;
      align-items: center;
      justify-content: space-between;
      .comment_info {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 24px;
          color: #E24828;
        }
        span{
          font-size: 16px;
          color: #E5471B;
          font-weight: bold;
          line-height: 21px;
          padding-left: 10px;
        }
      }
      .fail_btn {
        width:70px;
        height:32px;
        background:rgba(229,71,27,1);
        opacity:1;
        border-radius:2px;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        &:hover{
          opacity: 0.8;
        }
      }
    }
    .unreviewed_status{
      display: flex;
      width: 556px;
      height: 42px;
      background:rgba(151,155,171,0.08);
      border:1px solid rgba(151,155,171,1);
      opacity:1;
      border-radius:4px;
      padding: 5px 10px;
      align-items: center;
      justify-content: space-between;
      .comment_info {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 24px;
          color: #979BAB;
        }
        span{
          font-size: 16px;
          color: #979BAB;
          font-weight: bold;
          line-height: 21px;
          padding-left: 10px;
        }
      }
      .unreviewed_btn {
        width:70px;
        height:32px;
        background:#979BAB;
        opacity:1;
        border-radius:2px;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        &:hover{
          opacity: 0.8;
        }
      }
    }
    .pass_status{
      display: flex;
      width: 556px;
      height: 42px;
      background:rgba(0,192,142,0.08);
      border:1px solid rgba(0,193,141,1);
      opacity:1;
      border-radius:4px;
      padding: 5px 10px;
      align-items: center;
      justify-content: space-between;
      .comment_info {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 24px;
          color: #00BF8F;
        }
        span{
          font-size: 16px;
          color: #00BF8F;
          font-weight: bold;
          line-height: 21px;
          padding-left: 10px;
        }
      }
      .pass_btn {
        width:70px;
        height:32px;
        background:#00C08E;
        opacity:1;
        border-radius:2px;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        &:hover{
          opacity: 0.8;
        }
      }
    }
    .audited_status{
      display: flex;
      width: 556px;
      height: 42px;
      background:rgba(126,131,180,0.08);
      border:1px solid rgba(126,130,182,1);
      opacity:1;
      border-radius:4px;
      padding: 5px 10px;
      align-items: center;
      justify-content: space-between;
      .comment_info {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 24px;
          color: #7E84B2;
        }
        span{
          font-size: 16px;
          color: #7E84B2;
          font-weight: bold;
          line-height: 21px;
          padding-left: 10px;
        }
      }
      .audited_btn {
        width:70px;
        height:32px;
        background:#7E84B2;
        opacity:1;
        border-radius:2px;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        &:hover{
          opacity: 0.8;
        }
      }
    }
  }
</style>
