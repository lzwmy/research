<template>
    <div class="cloud-component crfConfig clearfix">
        <div class="crf-left-menu">
          <div class="menu-panel">
            <h2 class="menu-panel-head active">
              <span>个人表单 </span>
              <!-- <span class="toggle-slide">展开</span> -->
            </h2>
            <div class="menu-panel-content">
              <div class="menu-panel-item"  v-for="item in myForms" :key="item.diseaseId">
                <h3 class="parent-node" :class="{'active':JSON.stringify(item.modelList) != '[]'}" :title="item.diseaseName">
                  <label>
                    <i class="el-collapse-item__arrow el-icon-arrow-right"></i>
                    {{item.diseaseName}}
                  </label>
                  <i class="el-icon-plus" @click="addMyForm(item)"></i>
                </h3>
                <ul v-if="JSON.stringify(item.modelList) != '[]'">
                  <li class="child-node" :id="form.modelId" v-for="form in item.modelList" :key="form.modelId"
                      :class="{'active':selectFormId === form.modelId}" :title="form.modelName"
                      style="flex-wrap:wrap; padding: 0 5px 0 30px; "
                      @click.stop="getFormDetailCall(form)">
                      <div style="display:flex; width: 100%;padding-top:5px;">
                        <span style="" ></span>
                        <span class="menu-node-name"  style="line-height: 22px;">{{form.modelName}}</span>
                        <i class="el-icon-edit" :class="{'mouseHover':form.editable}" v-if="form.editable" title="编辑" @click.stop="formRename(form)" style="line-height: 22px;display: none"></i>
                        <i class="el-icon-delete" :class="{'mouseHover':form.editable}" v-if="form.editable" title="删除" @click.stop="formDel(form)"  style="line-height: 22px;display: none"></i>
                      </div>
                      <div style="line-height: 20px; color:#999; font-size: 12px;">{{form.updateTime}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="menu-panel ">
            <h2 class="menu-panel-head">
              <span>通用表单</span>
              <!-- <span class="toggle-slide">展开</span> -->
            </h2>

            <div class="menu-panel-content" style="display:none">
              <el-input v-model.trim="allSearchName" placeholder="请输入名称" @keyup.enter.native="allFormsSearch"
                        prefix-icon="el-icon-search"
                        type="text" clearable class="input-search" :maxlength="100"></el-input>

              <div class="menu-panel-item" v-for="item in allForms" :key="item.diseaseId">
                <h3 class="parent-node" :class="{'active':JSON.stringify(item.modelList) != '[]'}">
                  <label>
                    <i class="el-collapse-item__arrow el-icon-arrow-down"></i>
                    {{item.diseaseName}}
                  </label>
                </h3>
                <ul v-if="JSON.stringify(item.modelList) != '[]'">
                  <li class="child-node"
                      v-for="form in item.modelList"
                      :key="form.modelId"
                      :class="{'active':selectFormId === form.modelId}" :title="form.name"
                      style="padding: 5px 5px 0 30px; flex-wrap: wrap; "
                      @click="getFormDetailCall(form,'allForms')">
                    <span class="menu-node-name"  style="width:100%; overflow: visible; line-height: 22px;">{{form.modelName}}</span>
                    <div style="width:100%; line-height: 20px; color:#999; font-size: 12px;">{{form.updateTime}}</div>
                  </li>
                </ul>
              </div>
              <div class="search-void" v-if="JSON.stringify(allForms) == '[]'">暂无数据</div>
            </div>
          </div>
        </div>
        <div class="crf-main-box" v-loading="loading">
          <component ref="resetClear" :is="componentName" :dynamicTableData="dynamicTableData" :title="title" :modelData="modelData" @backModel="backModel"></component>
          <div v-if="componentName==''" style="text-align: center;padding-top: 10%">
            <img src="./../../images/display_model_none.png" >
            <p style="font-size: 16px;color: #ccc;padding-top: 1%">请选择模板</p>
          </div>
        </div>
      <!--新建表单-->
      <el-dialog
        :title="'新建表单 (分类：' + temMyForm.name + ')'"
        :visible.sync="myFormVisible" width="40%" @close="cancelMyForm" :close-on-click-modal="false">
        <el-form :model="temMyForm" ref="temMyForm" label-width="100px" class="demo-dynamic" @submit.native.prevent>
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="temMyForm.newName" type="text" placeholder="请输入表单名称" :maxlength="100"
                      clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="saveMyForm" type="primary">确 定</el-button>
          <el-button @click="cancelMyForm">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import mixins from 'components/mixins';
  import researchTable from "./researchTable";
  import addResearchModel from "./addResearchModel";
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import './../crfManage/crf.css';
    export default {
      name: "modelAside",
      mixins:[mixins],
      components:{
        researchTable,
        addResearchModel
      },
      data() {
        return {
          componentName: "",
          loading:false,
          myForms: [],
          allForms: [],
          allSearchName:"",
          selectFormId:'',
          myFormVisible:false,//新建表单显示隐藏
          temMyForm: {
            newName: '',
            name:'',
          }, //新建表单title
          title:'',
          modelData:{},
          dynamicTableData:{},
          paginationData:{},
          pageNo: '',
          pageSize: '',
          currentPageNo: '',
          currentPageSize: '',
          emptyText: '',
          elementLoadingText: ''
        }
      },
      created() {
        this.getFormDataList();
      },
      methods:{
        resize () {
          let height = $('#main').height();
          let width = $('.cloud-component').width()-$('.crf-left-menu').width()-1;
          $('.crf-left-menu .menu-panel-content').height(height - 149);
          $('.crf-right-menu').height(height - 55);
          // $('.crf-main').eq(0).height(height - 115);
          $('.crf-main-box').eq(0).height(height-55);
          // $('.menu_table_box .el-table').eq(0).height(height - 230);
          $('.menu_table_box .el-table .el-table__body-wrapper').eq(0).height(height-350);
          // $('.menu_table_box .el-table .el-table__body-wrapper').eq(0).height(395);
          /*this.$nextTick(() => {
            $('.crf-main').eq(0).find('.colwidth-1').width(($('.crf-main').width() - 150) / 2);
          });*/
          $('.crf-main-box').css({
            width:width
          })
        },
        getFormDetailCall(item) {
          this.selectFormId = item.modelId;
          this.modelData = {
            obj:item,
            type:'table'
          }
          this.ModelQueryDynamicTable()
        },
        //表单 编辑 按钮
        formRename(item) {
          console.log('表单编辑' ,item);
          this.title = item.modelName;
          this.modelData = {
            obj:item,
            type:'modify'
          };
          this.componentName = addResearchModel;
          this.$nextTick(function() {
            this.$refs.resetClear.$refs.researchBox.getDataList(item.modelId);
          })
        },
        //表单 删除 按钮
        formDel(item) {
          console.log('个人表单删除',item);
          this.$confirm('是否确定删除','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            console.log('确定删除')
            this.modelManageDelete(item.modelId)
          }).catch(()=>{
            this.$notice("已取消删除");
          })
        },
        //添加表单 按钮
        addMyForm(item) {
          console.log('添加',item);
          this.title = item.diseaseName;
          this.modelData = {
            obj:item,
            type:'add'
          };
          this.componentName = addResearchModel;
          this.$nextTick(function(){
            this.$refs.resetClear.init();
          })
        },
        //新建表单 弹框关闭
        cancelMyForm () {
          this.temMyForm.newName = '';
          this.myFormVisible = false;
        },
        //新建表单 保存功能
        saveMyForm() {
          if (!this.temMyForm.newName) {
            this.$notice('表单名称不能为空');
            return false;
          }
        },
        //组件事件 回调
        backModel(value) {
          console.log('触发成功',value);
          // this.componentName = researchTable;
          if(value.type=='add' || value.type=='modify') {
            this.getFormDataList();
            this.componentName = "";
          }else{
            if(JSON.stringify(this.dynamicTableData)=="{}") {
              this.componentName = "";
            }else{
              this.componentName = researchTable;
            }
          }
        },
        async getFormDataList() {
          try {
            let res = await this.$http.modelManageGetDataList();
            if (res.code == 0) {
              console.log(res)
              this.myForms = res.data.personal.diseaseList; 
              this.allForms = res.data.common.diseaseList;
            }else {
              this.$mes('error', res.msg);
            }
          } catch (error) {
            console.log(error);
          }
        },
        //删除模板
        async modelManageDelete(value) {
          let that = this;
          let formData = {
            modelId:value
          };
          try {
            let data = await that.$http.modelManageDelete(that.$format(formData));
            if(data.code==0) {
              this.$mes('success', data.msg);
            }
          }catch (error) {
            this.$notice("删除失败")
            console.log(error)
          }
          that.getFormDataList();
        },
        //获取动态表格
        async ModelQueryDynamicTable(pageNo = this.pageNo, pageSize = this.pageSize) {
          let that = this;
          let formData = {
            modelId:that.selectFormId,
            limit:pageSize,
            offset:pageNo
          };
          try{
            let data = await that.$http.ModelQueryDynamicTable(that.$format(formData));
            if(data.code == 0) {
              let obj = {};
              this.componentName = researchTable;
              this.dynamicTableData = data.data;
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
              that.dynamicTableData.paginationData = obj;
            }
          }catch (error) {
            that.$notice('表格信息获取失败')
          }
        }
      },
      mounted() {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        $('.crfConfig').on('click', '.parent-node label', function () {
          let parentNode = $(this).parent();
          let width = $('.cloud-component').width()-$('.crf-left-menu').width()-10;
          if (!parentNode.hasClass('active')) {
            parentNode.addClass('active').siblings('ul').show();
          } else {
            parentNode.removeClass('active').siblings('ul').hide();
          }
          $('.crf-main-box').css({
            width:width
          })
        }).on('click', '.menu-panel-head', function () {
          let head = $(this);
          let width = $('.cloud-component').width()-$('.crf-left-menu').width()-10;
          if (head.hasClass('active')) {
            return false;
          }
          $('.crf-main-box').css({
            width:width
          })
          head.parent().siblings().find('.menu-panel-head').removeClass('active').siblings().slideUp(200);
          if (!head.hasClass('active')) {
            head.addClass('active').siblings().slideToggle(200);
          }

        });
        //收缩 展开
        $('#keepAside').on('click',function() {
          $('.crf-main-box').css({
            width:"100%"
          });
          $(this).hide();
          $('#showAside').show();
          $('.crf-left-menu').fadeOut();
        });
        $('#showAside').on('click',function() {
          $('.crf-left-menu').fadeIn();
          $(this).hide();
          $('#keepAside').show();
          $('.crf-main-box').css({
            width:"83%"
          })
        })
      }
    }
</script>

<style scoped lang="less">
  body {
    .crfConfig .crf-main {
      width: auto !important;
    }
    .crfConfig .crf-right-menu {
      width: 279px;
      border: 1px solid #e9eaec;
      float: right;
      border-top: 2px solid #2d8cf0 !important;
    }

    .menu-panel .menu-panel-head.active {
      border-top: 2px solid #2d8cf0 !important;
    }

    .crf-left-menu .menu-panel .el-collapse-item__arrow:before {
      // content: "\e6df";
      color: #2d8cf0;
    }

    .menu-panel ul .child-node:hover {
      border-left: 5px solid #2d8cf0;
      background-color: #c6e2ff;
    }
    .menu-panel ul .child-node:hover .mouseHover{
      display: inline-block !important;
      transform: translate(0,8px);
    }
    #crfVisual-segment-list .global-category-title {
      padding-top: 5px;
      color: #2d8cf0;
      border-bottom: 1px solid #edf1f2;
    }

    .colwidth-2.ui-sortable-placeholder {
      width: 100%;
    }

    .colwidth-1.ui-sortable-placeholder {
      width: calc(35%);
      margin-left: 30px;
      display: inline-block;
      margin-bottom: 20px;
      height: 28px;
      vertical-align: top;
    }

    .menu-panel ul .child-node.active {
      background: #c6e2ff;
    }
  }

  body.theme-green {
    .crfConfig .crf-main {
      width: auto !important;
    }
    .crfConfig .crf-right-menu {
      width: 279px;
      border: 1px solid #e9eaec;
      float: right;
      border-top: 2px solid #00d1a0 !important;
    }

    .menu-panel .menu-panel-head.active {
      border-top: 2px solid #00d1a0 !important;
    }

    .crf-left-menu .menu-panel .el-collapse-item__arrow:before {
      content: "\e604";
      color: #03d2a2;
    }

    .menu-panel ul .child-node:hover {
      border-left: 5px solid #00d19a;
      background-color: #d0f6e7;
    }

    #crfVisual-segment-list .global-category-title {
      padding-top: 5px;
      color: #1ab497;
      border-bottom: 1px solid #edf1f2;
    }

    .colwidth-2.ui-sortable-placeholder {
      width: 100%;
    }

    .colwidth-1.ui-sortable-placeholder {
      width: calc(35%);
      margin-left: 30px;
      display: inline-block;
      margin-bottom: 20px;
      height: 28px;
      vertical-align: top;
    }

    .menu-panel ul .child-node.active {
      background: #d0f6e7;
    }
  }
</style>
<style scoped lang="less">
.crf-main-box{
  float: left;
  width: 80%;
}
  .crf-left-menu{
    /*width: 20% !important;*/
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
    height: auto;
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
    cursor: pointer;
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
    content: "\e6df" !important;
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
