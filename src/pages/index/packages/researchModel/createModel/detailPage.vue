<template>
    <div class="detail_page_container">
      <div class="component_head flex-between-center">
        <p>
          <span class="break_box" @click="breakGo">
            <i class="iconfont iconfanhui"></i>
            <span>返回</span>
            <i class="partition_line"></i>
          </span>
          <span class="title">{{$route.query.name}}</span>
        </p>
        <div class=" cur_pointer head_content flex-start-center">
          <div class="create_model_btn" @click="modifyModel">
            <!--<i class="iconfont iconbianji1"></i>
            <span>编辑</span>-->
            <img src="./images/disease_set_chart.png" alt="">
            <!--<i class="iconfont iconbianji1" title="编辑"></i>-->
          </div>
        </div>
      </div>
      <div class="tab_switch">
        <div class="btn" :class="{'active':tabSwitchId==0}" @click="changeTab(0)">关联报告</div>
        <div class="btn" :class="{'active':tabSwitchId==1}" @click="changeTab(1)">统计分析</div>
      </div>
      <div class="detail_page_body" v-show="tabSwitchId==0" v-loading="loading" element-loading-text="加载中">
        <div class="relation_form_title">
          <span>关联表单：</span>
          <span>{{dynamicTableDataList.crfName}}</span>
        </div>
        <div class="export_nav_box">
          <div class="personal_box">
            <span>
              <i class="iconfont iconbingren1"></i>
              {{dynamicTableDataList.patientCount}}例
            </span>
            <span>
              <i class="iconfont iconbingli"></i>
              {{dynamicTableDataList.crfSum}}例
            </span>
          </div>
          <div class="export_box">
            <div class="privacy_box">
              <span>隐私处理:</span>
              <el-switch v-model="privacy" active-color="#50D1F1"></el-switch>
            </div>
            <div class="export_btn">
              <el-button class="cr_style" type="primary"  @click="modelExportExcel">
                <i class="iconfont icondaochu"></i>
                导出Excel
              </el-button>
            </div>
          </div>
        </div>
        <!--动态表格-->
        <div class="menu_table_box">
          <el-table :data="tableData" stripe @row-dblclick="researchReady"  style="width: 100%;overflow: auto;">
            <el-table-column v-for="(item, index) in tableLabel"
                             :key="index"
                             :prop="item.prop"
                             :label="item.label">
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div class="menu_footer">
          <pagination :data="paginationData" @change="ModelQueryDynamicTable"></pagination>
        </div>
      </div>
      <statistics-chart v-show="tabSwitchId==1"></statistics-chart>
    </div>
</template>

<script>
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import utils from 'components/utils/index';
  import pagination from 'components/packages/pagination/pagination';
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import mixins from 'components/mixins';
  import statisticsChart from './statisticsChart';
    export default {
      name: "detailPage",
      mixins: [mixins],
      components:{
        pagination,
        echartsContain,
        statisticsChart
      },
      data() {
        return {
          privacy:false,
          dataList:{},
          tableData:[],
          tableLabel:[],
          loading:false,
          dynamicTableDataList:{},
          tabSwitchId:0,
          //分页参数
          paginationData:{},
          pageNo: '',
          pageSize: '',
          currentPageNo: '',
          currentPageSize: '',
          emptyText: '',
          elementLoadingText: '',
        }
      },
      methods:{
        resize() {

        },
        changeTab(value) {
          this.tabSwitchId = value;
        },
        //返回上一页
        breakGo() {
          // window.history.go(-1);
          let diseaseId = this.$route.query.id;
          this.$router.push({
            path:'/modelManage',
            query:{
              id:diseaseId
            }
          })
        },
        modifyModel() {
          let diseaseId = this.$route.query.id;
          let modelName = this.$route.query.name;
          let modelId = this.$route.query.modelId
          this.$router.push({
            path:'/modelManage/configModel',
            query:{
              id:diseaseId,
              type:"modify",
              modelId:modelId,
              modelName:modelName,
            }
          })
        },
        //导出excel
        modelExportExcel() {
          this.modelExportTable();
        },
        researchReady(row) {
          console.log(row)
          let urlParameter = {
            cacheData: false,
            formId: row.crfId,
            groupId: "",
            subjectId: "",
            diseaseId: "",
            patientName: row.patientName,
            patientId: "",
            identify: "",
            reportId: row.reportId || "",
            from: "caseManage",
            title:row.reportName,
            isModify:"displayShow"
          };
          sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
          let urlParameters = "cacheData="+false+"&formId="+row.crfId+"&groupId="+null+"&subjectId="+null+"&diseaseId="+this.$route.query.id+"&patientName="+row.patientName+"&patientId="+row.reportId+"&identify="+null+"&reportId="+row.reportId+"&from="+'caseManage'+"&title="+row.reportName+"&isModify="+"displayShow";
          window.open('./patientForm.html?'+urlParameters);
        },
        //动态表格
        async ModelQueryDynamicTable(pageNo = this.pageNo, pageSize = this.pageSize) {
          let that = this;
          let formData = {
            modelId:that.$route.query.modelId,
            limit:pageSize,
            offset:pageNo
          };
          try{
            // let data = await that.$http.ModelQueryDynamicTable(that.$format(formData));
            let data = await that.$http.modelDynamicTableListNew(that.$format(formData));
            if(data.code == 0) {
              let obj = {};
              that.dynamicTableDataList = data.data;
              that.tableLabel = data.data.header;
              that.tableData = data.data.body;
              obj.content = data.data.body;
              if(data.data.body == null || data.data.body== 'null') {
                obj.content = []
              }else{
                obj.content.forEach((item, index) => {
                  item.index = (pageNo - 1) * pageSize + index + 1;
                });
              }
              obj.pageNo = pageNo;
              obj.pageSize = pageSize;
              obj.totalCount = parseInt(data.data.reportSum);
              obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
              that.paginationData = obj;
            }
          }catch (error) {
            that.$notice('表格信息获取失败')
          }
          that.loading = false;
        },
        //导出Excel
        async modelExportTable() {
          let that = this;
          let formData = {
            "modelId": that.$route.query.modelId,
            "privacy": that.privacy
          };
          try{
            // let data = await that.$http.modelExportTable(formData);
            let data = await that.$http.modelExportExcelNew(formData);
            let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
            let dateTitle = utils.formateDate(new Date().getTime());
            // console.log(dateTitle)
            // let fileNmae = data.headers['content-disposition'].split('filename=')[1];
            // that.$download(fileNmae, blob);
            console.log(blob);
            that.$download(dateTitle+'.xlsx', blob);
          }catch (error) {
            console.log(error)
            that.$notice('导出失败')
          }
        }
      },
      deactivated() {
        this.$destroy()
      },
      mounted(){
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.loading = true;
        this.ModelQueryDynamicTable();
      }
    }
</script>

<style lang="less" scoped>
.detail_page_container{
  padding: 13px 15px 0 15px !important;
  .create_model_btn{
    height: 36px;
    .iconfont{
      font-size:18px;
      color: #666666;
    }
  }
  .component_head{
    p{
      .break_box{
        font-size: 14px;
        color: #394263;
        font-weight: 400;
        cursor: pointer;
        .iconfont{
          font-size: 13px;
          color: #979BAA;
          padding-right: 5px;
        }
        .partition_line{
          width: 1px;
          height: 16px;
          background-color: #979BAA;
          display: inline-block;
          margin: 0 20px;
          position: relative;
          top: 2px;
        }
      }
      .title{
        font-size:18px;
        font-weight:bold;
        color: #394263;
      }
    }
  }
  .detail_page_body{
    display: flex;
    flex-direction: column;
    width: 100%;
    /*height: 100%;*/
    flex: 1;
    background-color: #ffffff;
    border: 1px solid #E5EBEC;
    box-sizing: border-box;
    padding: 30px;
    .relation_form_title{
      font-size: 16px;
      font-family:PingFang-SC;
      color: #394263;
      font-weight:bold;
    }
    .export_nav_box{
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      margin-top: 10px;
      .personal_box{
        span{
          i{
            color: #04B8DD;
            font-size: 19px;
            padding-right: 8px;
          }
          &:last-child{
            font-size: 14px;
            color: #394263;
            font-weight:400;
            padding-left: 23px;
          }
        }
        &:first-child{
          font-size: 14px;
          color: #394263;
          font-weight:400;
          line-height: 32px;
        }
      }
      .export_box{
        display: flex;
        flex-direction: row;
        align-items: center;
        .export_btn{
          margin-left: 20px;
          .el-button--primary{
            color: #FFF;
            background-color: #1BBAE1;
            border-color: #1BBAE1;
            &:hover{
              background-color: #14aed4;
            }
          }
          .icondaochu{
            padding-right:3px;
          }
        }
        .privacy_box{
          span{
            font-size:14px;
            font-weight: 400;
            color: #666666;
            font-family: "PingFangSC";
            position: relative;
            top: 2px;
            padding-right: 8px;
          }
        }
      }
    }
    .menu_table_box{
      margin-top: 20px;
      .el-table{
        border-top: 1px solid #E5E8EB;
      }
    }
  }
  .tab_switch{
    width: 100%;
    height: 40px;
    display: flex;
    margin-bottom: 10px;
    .btn{
      width: auto;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      color: #3c4353;
      border-radius: 2px;
      padding: 2px 8px;
      line-height: 40px;
      margin-right: 4px;
      &:hover{
        background: rgba(0,0,0,.075);
        color: #222;
      }
    }
    .active{
      background: rgba(0,0,0,.075);
      color: #222;
    }
  }
}
</style>
<style lang="less">
  .menu_table_box .el-table--striped .el-table__body tr.el-table__row--striped td{
    background-color: #F7FAFC;
  }
</style>
