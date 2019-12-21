<template>
    <div class="report_config_container">
      <div class="component_head flex-between-center">
        <p>{{$route.meta.txt}}</p>
        <div class=" cur_pointer head_content flex-start-center">
        <el-upload
          class="upload"
          action=""
          :on-change="successFile"
          :auto-upload="false"
          :show-file-list='false'
          accept=".json">
          <el-button icon="icon iconfont icondaochu" class="upload">导入表单</el-button>
        </el-upload>
        <el-button type="primary" icon="icon iconfont icontianjia" @click="createCRF">新建CRF</el-button>
        <!-- <div class="create_model_btn" @click="createCRF">
          <i class="iconfont icontianjia"></i>
          <span>新建CRF</span>
        </div> -->
        </div>
      </div>
      <div class="report_config_content" v-loading="downloading" :element-loading-text="downloadingText">
        <div class="report_config-card" v-for="(item,index) in dataList" :key="index" @click="jumpModifyReport(item)">
          <div :class="['mask_report',{gray:item.crfIsAvailable===0}]"></div>
          <div class="card_img">
            <img v-if="item.crfImage!==null && item.crfImage!=='null'" :src="item.crfImage" alt="">
            <img v-else src="./../img/report_image.png" alt="">
          </div>
          <div class="report_card-title">{{item.crfDisplayName}}</div>
          <div class="report_card_detail-info">
            <div class="report-state" :class="{'TODO':item.crfType === 1}">{{item.crfType==1?'普通' : '随访'}}</div>
            <div class="report-time">{{item.updateTime}}</div>
          </div>
          <div class="close-ben" @click.stop="deleteCrf(item)">
            <i class="iconfont iconshanchu1"></i>
          </div>
          <div class="download-btn" @click.stop="downloadExcelTemp(item)">
            <i class="iconfont iconxiazai"></i>
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
          downloading: false,
          downloadingText: ''
        }
      },
      methods:{
        initPage() {
          this.reportList().then(()=>{
            this.$emit('changeLoadding',false);
          })
        },
        //下载模版
        async downloadExcelTemp(row) {
          this.downloading = true;
          this.downloadingText = '导出中...';
          try{
              let res = await this.$http.CRFExportCrfForm({
                  crfId: row.crfId
              });
              let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
              this.$download(row.crfDisplayName+'.json', blob);
          }catch (error) {
            console.log(error)
              this.$notice('导出失败')
          }
          this.downloading = false;
        },
        //文件选中
        successFile(file,fileList) {
          this.downloading = true;
          this.importData(file);
        },
        //导入数据
        async importData(file) {
          this.downloadingText = '导入中...';
          try {
              let params = new FormData();
              params.append('file',file.raw);
              params.append('diseaseId',this.$route.query.id);
              params.append('crfId',this.currentCrfId);
              let res = await this.$http.CRFImportCrfForm(params);
              if(res.code==0) {
                  this.$router.push({
                    name:"createReport",
                    params:{
                      import: true,
                      reportData: JSON.parse(res.msg)
                    },
                    query:{
                      id:this.$route.query.id,
                      type:'add'
                    }
                  })
              }
          } catch (err) {
              console.log(err)
          }
            this.downloading  = false;
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
          let urlParameter={
            cacheData: false,
            formId: "",
            reportId: '',
            groupId: "",
            subjectId: "",
            diseaseId: "",
            patientName: "",
            patientId: "",
            identify: "",
            from: "caseManage",
            diseaseName: "",
            subjectName: "",
            groupName: "",
            title: "",
            isModify:"displayShow"
          }
          localStorage.setItem('reportFill',JSON.stringify({urlParameter}));
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

<style lang="less">
.report_config_container{
  display:flex;
  width: 100%;
  height: 100%;
  .create_model_btn{
    width: 120px;
    height: 32px;
    font-size:14px;
    color: #ffffff;
    background-color: #1BBAE1;
    line-height: 32px;
    text-align: center;
    border-radius:2px;
    i{
      font-size: 13px;
      position: relative;
      left: -10px;
    }
    span{
      position: relative;
      left: -5px;
    }
    &:hover{
      background-color: #14aed4;
    }
  }
  .el-upload {
    margin-right: 15px;
    .el-button {
      transform: translateY(-2px);
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
      height: 355px;
      padding: 15px;
      box-sizing: border-box;
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 29px;
      transition: all 300ms;
      position: relative;
      &:hover {
        .download-btn {
          display: block;
        }
      }
      .mask_report{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1;
        /*background-color: rgba(224,224,224,0.3);*/
        background-color: rgba(0,0,0,0.1);
      }
      .gray{
        display: inline-block;
      }
      .card_img{
        width: 100%;
        text-align: center;
        img{
          width: 268px;
          height: 260px;
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
        z-index: 2;
        .iconfont{
          font-size: 14px;
          color: #ffffff;
        }
      }
      .download-btn {
        position: absolute;
        top: 10px;
        right:56px;
        width:36px;
        height:24px;
        display: none;
        background: #1BBAE1;
        border-radius:2px;
        text-align: center;
        line-height: 24px;
        z-index: 2;
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
