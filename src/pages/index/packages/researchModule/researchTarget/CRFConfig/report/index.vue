<template>
    <div class="report_config_container">
      <div class="component_head flex-between-center">
        <p>{{$route.meta.txt}}</p>
        <div class=" cur_pointer head_content flex-start-center">
          <div class="create_model_btn" @click="createCRF">
            <i class="iconfont icontianjia"></i>
            <span>新建CRF</span>
          </div>
        </div>
      </div>
      <div class="report_config_content">
        <div class="report_config-card" v-for="(item,index) in dataList" :key="index" @click="jumpModifyReport(item)">
          <div class="card_img">
            <img v-if="item.crfImage!==null && item.crfImage!=='null'" :src="item.crfImage" alt="">
            <img v-else src="./../img/z_w_t.png" alt="">
          </div>
          <div class="report_card-title">{{item.crfDisplayName}}</div>
          <div class="report_card_detail-info">
            <div class="report-state" :class="{'TODO':item.crfType === 1}">{{item.crfType==1?'普通' : '随访'}}</div>
            <div class="report-time">{{item.updateTime}}</div>
          </div>
          <div class="close-ben" @click.stop="deleteCrf(item)">
            <i class="iconfont iconshanchu1"></i>
          </div>
        </div>
        <div class="img_none" v-if="dataList.length==0">
          <img  src="./../basisComponents/image/none_content.png" alt="">
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          dataList:[],
        }
      },
      methods:{
        initPage() {
          this.reportList().then(()=>{
            this.$emit('changeLoadding',false);
          })
        },
        createCRF() {
          let diseaseId = this.$route.query.id;
          this.$router.push({
            path:"/createReport",
            query:{
              id:diseaseId,
              type:'add'
            }
          })
        },
        //跳转 到 编辑报告
        jumpModifyReport(data) {
          let diseaseId = this.$route.query.id;
          this.$router.push({
            path:"/createReport",
            query:{
              id:diseaseId,
              type:'modify',
              crfId:data.crfId
            }
          })
        },
        //删除表单
        deleteCrf(data) {
          // console.log(data.crfId);
          this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.CRFDeleteForm(data.crfId).then(()=>{
              this.reportList();
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        },
        // 查询所有 报告列表
        async reportList() {
          let that = this;
          let formData = {
            diseaseId:this.$route.query.id
          };
          try {
            let data = await that.$http.CRFReportList(formData);
            if(data.code == 0) {
              that.dataList = data.data;
            }
          }catch (error) {
            console.log(error)
          }
        },
        //删除 报告
        async CRFDeleteForm(value) {
          let that = this;
          let formData = {
            formCrfId:value
          };
          try{
            let data = await that.$http.CRFDeleteForm(formData);
            if(data.code == 0) {
              that.$message.success(data.data);
            }
          }catch (error) {
            console.log(error)
          }
        }
      },
      mounted() {
        this.reportList();
      },
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
      padding: 15px;
      box-sizing: border-box;
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 29px;
      transition: all 300ms;
      position: relative;
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
      .close-ben{
        position: absolute;
        top: 10px;
        right:10px;
        display: none;
        width:36px;
        height:24px;
        background:rgba(239,63,73,1);
        border-radius:2px;
        text-align: center;
        line-height: 24px;
        .iconfont{
          font-size: 14px;
          color: #ffffff;
        }
      }
      &:hover{
        transform: translate(0,-2px);
        cursor: pointer;
        .close-ben{
          display: inline-block;
        }
      }
    }
    .img_none{
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      img{
        width: 200px;
      }
    }
  }
}
</style>
