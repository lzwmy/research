<template>
    <div class="report_config_container">
      <div class="component_head flex-between-center">
        <p>{{$route.meta.txt}}</p>
        <div class=" cur_pointer head_content flex-start-center">
          <div class="create_model_btn" >
            <i class="iconfont icontianjia"></i>
            <span>新建CRF</span>
          </div>
        </div>
      </div>
      <div class="report_config_content">
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state TODO">待访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <!--以下复制粘贴位置-->
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
        <div class="report_config-card">
          <div class="card_img">
            <img src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">初诊报告</div>
          <div class="report_card_detail-info">
            <div class="report-state">随访</div>
            <div class="report-time">2019-08-21 18:00:30</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {

        }
      },
      methods:{

      },
      mounted() {},
      deactivated() {
      }
    }
</script>

<style lang="less" scoped>
.report_config_container{
  display:flex;
  width: 100%;
  height: 100%;
  .create_model_btn{
    width: 120px;
    height: 36px;
    font-size:14px;
    color: #ffffff;
    background-color: #1BBAE1;
    line-height: 36px;
    text-align: center;
    border-radius:2px;
    i{
      font-size: 14px;
      position: relative;
      left: -10px;
    }
    span{
      position: relative;
      left: -5px;
    }
  }
  .report_config_content{
    display:flex;
    width:100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15px 15px 0 15px;
    justify-content: flex-start;
    flex-wrap: wrap;
    .report_config-card{
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border:1px solid #E5EBEC;
      width: 300px;
      height: 400px;
      /*justify-content: center;*/
      padding: 15px;
      box-sizing: border-box;
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 29px;
      transition: all 300ms;
      .card_img{
        width: 100%;
        text-align: center;
        img{
          width: 268px;
          height: 308px;
        }
      }
      .report_card-title{
        font-size:14px;
        color: #394263;
        font-family:MicrosoftYaHei;
        margin-top: 15px;
      }
      .report_card_detail-info{
        display: flex;
        flex-direction:row;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        .report-state{
          width: 60px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          color: #ffffff;
          background-color: #F79E00;
          border-radius: 2px;
          font-size: 12px;
        }
        .TODO{
          background-color: #1BBAE1;
        }
        .report-time{
          font-family:MicrosoftYaHei;
          color: #9CA0B1;
          font-size: 12px;
        }
      }
      &:hover{
        transform: translate(0,-2px);
        cursor: pointer;
      }
    }
  }
}
</style>
