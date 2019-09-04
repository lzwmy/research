<template>
    <div class="right_menu_content">
      <div class="content_header" @click="crfLeftToggle" :class="{'crf-left-btn': true,'onclick': crfLeftBtnStatus}">
        <!--<i class="iconfont iconshousuo" id="keepAside" title="收缩"></i>
        <i class="iconfont iconzhankai" id="showAside" title="展开" style="display: none"></i>-->
        {{dynamicTableDataList.diseaseName }}-{{dynamicTableDataList.modelName}}
      </div>
      <div class="relevance_from">
        关联表单：
        <span>{{dynamicTableDataList.crfName}}</span>
      </div>
      <div class="show_info">
        <div class="info_inline">
          <span>
            <i class="iconfont iconbingren"></i>
              {{dynamicTableDataList.patientCount}}例
          </span>
          <span>
            <i class="iconfont iconbaogao"></i>
              {{dynamicTableDataList.crfSum}}例
          </span>
        </div>
        <div class="info_inline inline_right">
          <span class="privacy_box">隐私处理</span>
          <el-switch v-model="privacy"></el-switch>
          <el-button class="export_margin" type="primary" @click="modelExportExcel">导出Excel</el-button>
        </div>
      </div>
      <div class="menu_table_box">
        <el-table :data="tableData" @row-dblclick="researchReady" style="width: 100%;">
          <el-table-column v-for="(item, index) in tableLabel"
                           :key="index"
                           :prop="item.prop"
                           :label="item.label">
          </el-table-column>
          <!--<el-table-column fixed="right" label="操作">
            <template  slot-scope="scope">
              <i class="iconfont iconyuedu" style="cursor: pointer;" @click="researchReady(scope.row)"></i>
            </template>
          </el-table-column>-->
        </el-table>
      </div>
      <div class="menu_footer">
        <pagination :data="paginationData" @change="ModelQueryDynamicTable"></pagination>
      </div>
    </div>
</template>

<script>
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import utils from 'components/utils/index';
  import pagination from 'components/packages/pagination/pagination';
    export default {
      props:{
        dynamicTableData:{
          type:Object,
          default:null
        },
        modelData:{
          type:Object,
          default:null
        }
      },
      components:{
        pagination
      },
      watch:{
        "dynamicTableData":function (value) {
          this.tableLabel = value.header;
          this.tableData = value.body;
          this.paginationData = value.paginationData
          this.dynamicTableDataList= value
        },
      },
      data() {
        return {
          privacy:false,
          tableLabel:this.dynamicTableData.header||[],
          tableData:this.dynamicTableData.body||[],
          //分页参数
          paginationData:this.dynamicTableData.paginationData||{},
          pageNo: '',
          pageSize: '',
          currentPageNo: '',
          currentPageSize: '',
          emptyText: '',
          elementLoadingText: '',
          crfLeftBtnStatus:false,
          dynamicTableDataList:this.dynamicTableData
        }
      },
      methods:{
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
          window.open('./patientForm.html');
        },
        //导出excel
        modelExportExcel() {
          this.modelExportTable();
        },
        crfLeftToggle () {
          let $left = $('.crf-left-menu');
          let $main = $('.crf-main').eq(0);
          let $config = $('.crf-config-button');

          if (!this.crfLeftBtnStatus) {
            $left.animate({
              width: 0
            });

            $main.animate({
              left: 15
            });

            $config.animate({
              left: parseFloat($config.css('left')) - $left.prop('data-width')
            });
            $('.crf-main-box').animate({
              width:parseFloat($('.cloud-component').width())
            })
          } else {
            $left.animate({
              width: 279
            });

            $main.animate({
              left: 298
            });

            $config.animate({
              left: parseFloat($config.css('left')) + $left.prop('data-width')
            });
            let widthSet = $('.cloud-component').width()-297-6;
            $('.crf-main-box').animate({
              width:widthSet
            },100)
          }
          this.crfLeftBtnStatus = !this.crfLeftBtnStatus;
        },
        async ModelQueryDynamicTable(pageNo = this.pageNo, pageSize = this.pageSize) {
          let that = this;
          let formData = {
            modelId:that.modelData.obj.modelId,
            limit:pageSize,
            offset:pageNo
          };
          try{
            let data = await that.$http.ModelQueryDynamicTable(that.$format(formData));
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
        },
        async modelExportTable() {
          let that = this;
          let formData = {
            "modelId": that.modelData.obj.modelId,
            "privacy": this.privacy
          };
          try{
            let data = await that.$http.modelExportTable(formData);
            let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
            let dateTitle = utils.formateDate(new Date().getTime());
            console.log(dateTitle)
            // let fileNmae = data.headers['content-disposition'].split('filename=')[1];
            // that.$download(fileNmae, blob);
            that.$download(dateTitle+'.xlsx', blob);
          }catch (error) {
            console.log(error)
            that.$notice('导出失败')
          }
        }
      },
      mounted() {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        //收缩 展开
        $('#keepAside').on('click',function() {
          $('.crf-left-menu').hide();
          $(this).hide();
          $('#showAside').show();
          $('.crf-main-box').css({
            width:"100%"
          });
        });
        $('#showAside').on('click',function() {
          $('.crf-left-menu').fadeIn();
          $(this).hide();
          $('#keepAside').show();
          $('.crf-main-box').css({
            width:"80%"
          })
        })
      }
    }
</script>

<style lang="less" scoped>
.right_menu_content{
  width: 100%;
  .content_header{
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #63666E;
    /*background-color: #EEEEEE;*/
    background-color: #E5EBEC;
    border: 1px solid #E5EBEC;
    padding-left: 3%;
    i{
      color: #3C81F0;
      padding: 0 5px;
      cursor: pointer;
    }
  }
  .relevance_from{
    font-size: 14px;
    color: #63666E;
    margin: 16px 0;
  }
  .show_info{
    width: 100%;
    margin-bottom: 10px;
    .info_inline{
      text-align: left;
      display: inline-block;
      width: 49%;
      font-size: 14px;
      i{
        color: #3C81F0;
        font-size: 16px;
        padding: 0 10px;
      }
    }
    .inline_right{
      text-align: right;
      display: inline-block;
      width: 50%;
      .privacy_box{
        font-size: 14px;
        color: #63666E;
        vertical-align: sub;
      }
      .export_margin{
        margin-left: 10px;
      }
    }
  }
  .menu_table_box{
    overflow: auto;
    i{
      color: #63666E;
      font-size: 14px;
    }
  }
  .crf-left-btn{
    background-position: 13px 16px;
  }
}
</style>
<style lang="less">
  .el-table__body tr.hover-row > td{
    background-color: #f5f5f5 !important;
    color: #5a5e66 !important;
  }
</style>
<style scoped>

  .cloud-component.crfConfig {
    height: 94.5%;
    position: relative;
  }

  .crfConfig .crf-left-menu {
    float: left;
    width: 279px;
    height: 100%;
    overflow: hidden;
  }

  .crf-main {
    overflow: hidden;
    border: 1px solid #e9eaec;
    position: absolute;
    left: 298px;
    right: 305px;
  }

  .crf-main .nodata {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
  }

  .el-dialog__wrapper .crf-main {
    height: calc(100% - 80px);
    width: calc(100% - 300px);
    left: 20px;
  }

  .el-dialog__wrapper .crf-main-nav {
    width: 290px;
    height: 100%;
    overflow: auto;
    float: right;
    padding-left: 10px;
  }

  #jqContextMenu > ul, #jqContextMenu {
    width: auto !important;
  }

  #jqContextMenu > ul > li {
    padding: 5px;
  }

  .crfConfig .crf-main .crf-step-content {
    overflow: auto;
    height: calc(100% - 30px)
  }

  .crfConfig .menu-panel .el-collapse-item__arrow {
    font-size: 13px;
    float: none;
    line-height: normal
  }

  .parent-node label {
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-panel .parent-node.active .el-collapse-item__arrow:before {
    content: "\e603" !important;
  }

  .menu-panel .menu-panel-head {
    height: 48px;
    line-height: 48px;
    border: 1px solid #e9eaec;
    position: relative;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    cursor: pointer;
    color: #585858;
    background-color: #eeeeee;
    padding-left: 9px;
  }

  .menu-panel {
    padding: 0 5px;
    font-size: 15px;
    height: 100%;
  }

  .el-dialog__body .menu-panel {
    height: 100%
  }

  .el-dialog__body .menu-panel .menu-panel-content {
    height: calc(100% - 48px)
  }

  .menu-panel + .menu-panel .menu-panel-head {
    border-top-color: transparent;
  }

  .menu-panel .el-icon-plus {
    font-weight: bold;
    position: absolute;
    right: 5px;
    top: 30%;
  }

  .menu-panel .parent-node label {
    display: block
  }

  .menu-panel .parent-node {
    position: relative;
    padding: 5px 5px 5px 9px;
    font-size: 14px;
    font-weight: bold;
    margin-top: 5px;
    cursor: pointer;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }

  .menu-panel .parent-node .fa {
    margin: 0 5px;
  }

  .menu-panel .parent-node .add-icon {
    position: absolute;
    right: 5px;
    top: 30%;
  }

  .menu-panel ul {
    margin-bottom: 5px;
  }

  .menu-panel ul .child-node {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-direction: row;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    padding: 0 15px;
    border-left: 5px solid transparent;
    cursor: pointer;
    vertical-align: middle;
    font-size: 14px;
    line-height: 40px
  }

  .menu-panel ul .child-node .readonly-icon {
    background: #f8cd47;
    color: #fff;
    display: inline-block;
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 12px;
    margin-right: 5px;
    line-height: 27px;
    height: 27px;
    margin-top: 6px;
    vertical-align: middle;
  }

  .menu-panel ul .child-node .menu-node-name {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 100%;
    height: 100%;
    line-height: 40px
  }

  .menu-panel ul .child-node .el-icon-delete, .menu-panel ul .child-node .el-icon-edit {
    line-height: 40px
  }

  .menu-panel ul .child-node .el-icon-edit {
    margin-right: 8px
  }

  .menu-panel ul .child-node .edit-icon, .menu-panel ul .child-node .remove-icon {
    margin: 3px 5px;
  }

  .menu-panel .menu-panel-content {
    position: relative;
    overflow-y: auto;
    border: 1px solid #e9eaec;
    border-top: none;
    font-size: 14px;
  }

  .crf-section .el-form-item {
    display: inline-block;
    margin-left: 25px;
    width: calc(50% - 30px);
    vertical-align: top;
  }

  .crf-section .colwidth-2 {
    display: block;
    width: calc(50% - 45px);
  }

  .crfConfigPreiview .crf-section .colwidth-2 {
    display: block;
    width: calc(50% - 30px);
  }

  body .crf-main .el-form .crf-section .colwidth-2 .el-form-item__content .el-input {
    width: calc(200% + 125px) !important
  }

  body .crf-main .el-form .crf-section .colwidth-2 .el-form-item__content .el-textarea {
    width: calc(200% + 125px) !important
  }

  .crf-section .colwidth-22 .el-form-item .el-input {
    width: 30% !important
  }

  .crf-main .crf-step-content {
    padding: 0 10px 10px;
  }

  .crf-main .crf-step-header {
    border-bottom: 1px solid #e9eaec;
    padding: 11.5px;
  }

  .crf-step .crf-section-title {
    background: #eeeeee;
    border: 1px solid #e9eaec;
    position: relative;
  }

  .crf-step-h3 {
    font-size: 14px;
    margin: 20px 0 0;
    display: inline-block;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .crfConfig .crf-main .el-form .el-form-item .el-input {
    width: 100% !important;
  }

  .crf-config-button {
    position: absolute;
    height: 50px;
    bottom: 10px;
    left: 298px;
    right: 305px;
    text-align: right;
    border: 1px solid #e9eaec;
    padding: 10px 15px 0 0;
    background: #fff;
    z-index: 100
  }

  .crf-step .crf-section-title .module-close {
    position: absolute;
    right: 5px;
    display: block;
    top: 0;
    width: 20px;
    line-height: 39px;
  }

  .crf-step .module-close:hover {
    color: #ff0000;
  }

  .crf-main-content {
    height: 95%;
  }

  .ztree .tree-no-data {
    padding: 20px 0;
    text-align: center
  }

  .crf-main .ui-sortable-placeholder {
    border: 1px solid #fcefa1;
    background: #fbf9ee;
    height: 36px;
  }

  .contextMenu {
    display: none
  }

  #jqContextMenu, #jqContextMenu ul {
  }

  #jqContextMenu .el-input-number--mini {
    width: 90px;
  }

  .crf-main .el-form-item__label {
    word-wrap: break-word
  }

  .crfConfig.crffill {
    overflow: hidden;
  }

  .crffill .crf-main {
    left: 10px;
    width: calc(100% - 20px);
    height: 100%;
  }

  .crffill .crf-section-name {
    line-height: 40px;
    width: calc(100% - 60px);
    display: inline-block;
  }

  .menu-panel .el-table__body-wrapper {
    overflow-x: auto !important;;
  }

  .crffill .nodata {
    padding: 15px 0;
    text-align: center;
    font-size: 12px
  }

  .crffill .refmodule-name {
    display: inline-block;
    width: calc(100% - 60px);
  }

  .crffill .crf-main .crf-step-content {
    height: calc(100% - 45px)
  }

  .crffill .crf-main-content {
    height: calc(100% - 40px)
  }

  .crffill .menu-panel .parent-node {
    padding: 0;
  }

  .crffill .menu-panel .el-collapse-item__arrow {
    line-height: 28px;
    padding-left: 10px
  }

  .crffill .menu-panel .ii {
    display: inline-block;
  }

  .crffill .menu-panel .ii .el-icon-arrow-right:before {
    content: "\E604" !important
  }

  .crffill .menu-panel .ii.active .el-icon-arrow-right:before {
    content: "\E603" !important
  }

  .crffill .menu-panel .menu-panel-content {
    height: calc(100% - 48px)
  }

  .el-dialog__wrapper .crf-main
  .crffill .menu-panel {
    height: 100%;
  }

  body .crfConfig .crf-right-menu .el-input.input-search {
    width: 255px;
    margin: 10px;
  }

  body .crfConfig .crf-left-menu .el-input.input-search {
    width: 240px;
    margin: 10px;
  }

  .toggle-slide {
    position: absolute;
    right: 9px;
    color: #8f8f8f;
    cursor: pointer;
  }

  .menu-panel-head.active .toggle-slide {
    display: none;
  }

  .crffill .crf-right-menu {
    float: right !important;
    width: 480px
  }

  .crf-step-header {
    font-size: 16px;
  }

  .crf-step-header .el-select {
    margin: 0 10px;
  }

  .crf-section-box .crf-section-title .el-icon-arrow-right {
    float: none;
    line-height: normal;
    padding: 12px 5px 12px 15px;
    cursor: pointer;
  }

  .crf-section-box .crf-section-title .el-icon-arrow-right.active:before {
    content: "\e603";
  }

  .crf-section-box .crf-section {
    background: #fff;
    margin-top: 10px
  }

  .crf-section-box .crf-section .crf-section-content {
    border: 1px solid #e9eaec;
    border-top: none;
    padding: 20px 30px 0 0;
  }

  .crf-section-box .crf-section .el-form-item__label {
    line-height: 19px;
  }

  .crf-section-box .crf-section .el-form-item__label i {
    margin-left: 4px
  }

  .crf-step-header .el-input--suffix .el-input__inner {
    max-width: 100px
  }

  .crf-step-header .el-select {
    margin-left: 50px
  }

  .crfConfig .el-dialog .el-form .el-form-item .el-input {
    width: 80%
  }

  .crfConfig .is-fullscreen .el-dialog__body {
    height: calc(100% - 150px) !important;
    overflow: hidden;
  }

  .crf-left-btn {
    -moz-transition: all 0.3s ease 0s;
    -webkit-transition: all 0.3s ease 0s;
    -ms-transition: all 0.3s ease 0s;
    -o-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
    width: 20px;
    height: 18px;
    z-index: 1004;
    cursor: pointer;
    outline: none;
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
    background: url('./../crfManage/images/icon_arrow.png') no-repeat -1px 0;
  }

  .saveButton {
    border-top: 1px solid #e9eaec;
    text-align: right;
    padding-right: 30px;
    padding-top: 5px;
  }

  body.theme-green .crf-left-btn.onclick {
    background-image: url('./../crfManage/images/icon_arrow2_green.png');
  }

  body.theme-blue .crf-left-btn.onclick {
    background-image: url('./../crfManage/images/icon_arrow2_blue.png');
  }

  .search-void {
    text-align: center;
    font-size: 12px;
    margin-top: 25px;
  }

  .crfConfig .new-name {
    max-width: 180px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    top: 5px;
    line-height: 16px;
  }

  .crfConfig .dynamicStepDialog .el-dialog__body {
    max-height: 600px;
    overflow: auto;
  }

</style>
<style>

  .cloud-component.crfConfig {
    height: 94.5%;
    position: relative;
  }

  .crfConfig .crf-left-menu {
    float: left;
    width: 279px;
    height: 100%;
    overflow: hidden;
  }

  .crf-main {
    overflow: hidden;
    border: 1px solid #e9eaec;
    position: absolute;
    left: 298px;
    right: 305px;
  }

  .crf-main .nodata {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
  }

  .el-dialog__wrapper .crf-main {
    height: calc(100% - 80px);
    width: calc(100% - 300px);
    left: 20px;
  }

  .el-dialog__wrapper .crf-main-nav {
    width: 290px;
    height: 100%;
    overflow: auto;
    float: right;
    padding-left: 10px;
  }

  #jqContextMenu > ul, #jqContextMenu {
    width: auto !important;
  }

  #jqContextMenu > ul > li {
    padding: 5px;
  }

  .crfConfig .crf-main .crf-step-content {
    overflow: auto;
    height: calc(100% - 30px)
  }

  .crfConfig .menu-panel .el-collapse-item__arrow {
    font-size: 13px;
    float: none;
    line-height: normal
  }

  .parent-node label {
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-panel .parent-node.active .el-collapse-item__arrow:before {
    content: "\e603" !important;
  }

  .menu-panel .menu-panel-head {
    height: 48px;
    line-height: 48px;
    border: 1px solid #e9eaec;
    position: relative;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    cursor: pointer;
    color: #585858;
    background-color: #eeeeee;
    padding-left: 9px;
  }

  .menu-panel {
    padding: 0 5px;
    font-size: 15px;
    height: 100%;
  }

  .el-dialog__body .menu-panel {
    height: 100%
  }

  .el-dialog__body .menu-panel .menu-panel-content {
    height: calc(100% - 48px)
  }

  .menu-panel + .menu-panel .menu-panel-head {
    border-top-color: transparent;
  }

  .menu-panel .el-icon-plus {
    font-weight: bold;
    position: absolute;
    right: 5px;
    top: 30%;
  }

  .menu-panel .parent-node label {
    display: block
  }

  .menu-panel .parent-node {
    position: relative;
    padding: 5px 5px 5px 9px;
    font-size: 14px;
    font-weight: bold;
    margin-top: 5px;
    cursor: pointer;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }

  .menu-panel .parent-node .fa {
    margin: 0 5px;
  }

  .menu-panel .parent-node .add-icon {
    position: absolute;
    right: 5px;
    top: 30%;
  }

  .menu-panel ul {
    margin-bottom: 5px;
  }

  .menu-panel ul .child-node {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-direction: row;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    padding: 0 15px;
    border-left: 5px solid transparent;
    cursor: pointer;
    vertical-align: middle;
    font-size: 14px;
    line-height: 40px
  }

  .menu-panel ul .child-node .readonly-icon {
    background: #f8cd47;
    color: #fff;
    display: inline-block;
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 12px;
    margin-right: 5px;
    line-height: 27px;
    height: 27px;
    margin-top: 6px;
    vertical-align: middle;
  }

  .menu-panel ul .child-node .menu-node-name {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 100%;
    height: 100%;
    line-height: 40px
  }

  .menu-panel ul .child-node .el-icon-delete, .menu-panel ul .child-node .el-icon-edit {
    line-height: 40px;
  }

  .menu-panel ul .child-node .el-icon-edit {
    margin-right: 8px
  }

  .menu-panel ul .child-node .edit-icon, .menu-panel ul .child-node .remove-icon {
    margin: 3px 5px;
  }

  .menu-panel .menu-panel-content {
    position: relative;
    overflow-y: auto;
    border: 1px solid #e9eaec;
    border-top: none;
    font-size: 14px;
  }

  .crf-section .el-form-item {
    display: inline-block;
    margin-left: 25px;
    width: calc(50% - 30px);
    vertical-align: top;
  }

  .crf-section .colwidth-2 {
    display: block;
    width: calc(50% - 45px);
  }

  .crfConfigPreiview .crf-section .colwidth-2 {
    display: block;
    width: calc(50% - 30px);
  }

  body .crf-main .el-form .crf-section .colwidth-2 .el-form-item__content .el-input {
    width: calc(200% + 125px) !important
  }

  body .crf-main .el-form .crf-section .colwidth-2 .el-form-item__content .el-textarea {
    width: calc(200% + 125px) !important
  }

  .crf-section .colwidth-22 .el-form-item .el-input {
    width: 30% !important
  }

  .crf-main .crf-step-content {
    padding: 0 10px 10px;
  }

  .crf-main .crf-step-header {
    border-bottom: 1px solid #e9eaec;
    padding: 11.5px;
  }

  .crf-step .crf-section-title {
    background: #eeeeee;
    border: 1px solid #e9eaec;
    position: relative;
  }

  .crf-step-h3 {
    font-size: 14px;
    margin: 20px 0 0;
    display: inline-block;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .crfConfig .crf-main .el-form .el-form-item .el-input {
    width: 100% !important;
  }

  .crf-config-button {
    position: absolute;
    height: 50px;
    bottom: 10px;
    left: 298px;
    right: 305px;
    text-align: right;
    border: 1px solid #e9eaec;
    padding: 10px 15px 0 0;
    background: #fff;
    z-index: 100
  }

  .crf-step .crf-section-title .module-close {
    position: absolute;
    right: 5px;
    display: block;
    top: 0;
    width: 20px;
    line-height: 39px;
  }

  .crf-step .module-close:hover {
    color: #ff0000;
  }

  .crf-main-content {
    height: 95%;
  }

  .ztree .tree-no-data {
    padding: 20px 0;
    text-align: center
  }

  .crf-main .ui-sortable-placeholder {
    border: 1px solid #fcefa1;
    background: #fbf9ee;
    height: 36px;
  }

  .contextMenu {
    display: none
  }

  #jqContextMenu, #jqContextMenu ul {
  }

  #jqContextMenu .el-input-number--mini {
    width: 90px;
  }

  .crf-main .el-form-item__label {
    word-wrap: break-word
  }

  .crfConfig.crffill {
    overflow: hidden;
  }

  .crffill .crf-main {
    left: 10px;
    width: calc(100% - 20px);
    height: 100%;
  }

  .crffill .crf-section-name {
    line-height: 40px;
    width: calc(100% - 60px);
    display: inline-block;
  }

  .menu-panel .el-table__body-wrapper {
    overflow-x: auto !important;;
  }

  .crffill .nodata {
    padding: 15px 0;
    text-align: center;
    font-size: 12px
  }

  .crffill .refmodule-name {
    display: inline-block;
    width: calc(100% - 60px);
  }

  .crffill .crf-main .crf-step-content {
    height: calc(100% - 45px)
  }

  .crffill .crf-main-content {
    height: calc(100% - 40px)
  }

  .crffill .menu-panel .parent-node {
    padding: 0;
  }

  .crffill .menu-panel .el-collapse-item__arrow {
    line-height: 28px;
    padding-left: 10px
  }

  .crffill .menu-panel .ii {
    display: inline-block;
  }

  .crffill .menu-panel .ii .el-icon-arrow-right:before {
    content: "\E604" !important
  }

  .crffill .menu-panel .ii.active .el-icon-arrow-right:before {
    content: "\E603" !important
  }

  .crffill .menu-panel .menu-panel-content {
    height: calc(100% - 48px)
  }

  .el-dialog__wrapper .crf-main
  .crffill .menu-panel {
    height: 100%;
  }

  body .crfConfig .crf-right-menu .el-input.input-search {
    width: 255px;
    margin: 10px;
  }

  body .crfConfig .crf-left-menu .el-input.input-search {
    width: 240px;
    margin: 10px;
  }

  .toggle-slide {
    position: absolute;
    right: 9px;
    color: #8f8f8f;
    cursor: pointer;
  }

  .menu-panel-head.active .toggle-slide {
    display: none;
  }

  .crffill .crf-right-menu {
    float: right !important;
    width: 480px
  }

  .crf-step-header {
    font-size: 16px;
  }

  .crf-step-header .el-select {
    margin: 0 10px;
  }

  .crf-section-box .crf-section-title .el-icon-arrow-right {
    float: none;
    line-height: normal;
    padding: 12px 5px 12px 15px;
    cursor: pointer;
  }

  .crf-section-box .crf-section-title .el-icon-arrow-right.active:before {
    content: "\e603";
  }

  .crf-section-box .crf-section {
    background: #fff;
    margin-top: 10px
  }

  .crf-section-box .crf-section .crf-section-content {
    border: 1px solid #e9eaec;
    border-top: none;
    padding: 20px 30px 0 0;
  }

  .crf-section-box .crf-section .el-form-item__label {
    line-height: 19px;
  }

  .crf-section-box .crf-section .el-form-item__label i {
    margin-left: 4px
  }

  .crf-step-header .el-input--suffix .el-input__inner {
    max-width: 100px
  }

  .crf-step-header .el-select {
    margin-left: 50px
  }

  .crfConfig .el-dialog .el-form .el-form-item .el-input {
    width: 80%
  }

  .crfConfig .is-fullscreen .el-dialog__body {
    height: calc(100% - 150px) !important;
    overflow: hidden;
  }

  .crf-left-btn {
    -moz-transition: all 0.3s ease 0s;
    -webkit-transition: all 0.3s ease 0s;
    -ms-transition: all 0.3s ease 0s;
    -o-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
    width: 20px;
    height: 18px;
    z-index: 1004;
    cursor: pointer;
    outline: none;
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
    background: url('./../crfManage/images/icon_arrow.png') no-repeat -1px 0;
  }

  .saveButton {
    border-top: 1px solid #e9eaec;
    text-align: right;
    padding-right: 30px;
    padding-top: 5px;
  }

  body.theme-green .crf-left-btn.onclick {
    background-image: url('./../crfManage/images/icon_arrow2_green.png');
  }

  body.theme-blue .crf-left-btn.onclick {
    background-image: url('./../crfManage/images/icon_arrow2_blue.png');
  }

  .search-void {
    text-align: center;
    font-size: 12px;
    margin-top: 25px;
  }

  .crfConfig .new-name {
    max-width: 180px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    top: 5px;
    line-height: 16px;
  }

  .crfConfig .dynamicStepDialog .el-dialog__body {
    max-height: 600px;
    overflow: auto;
  }

</style>
