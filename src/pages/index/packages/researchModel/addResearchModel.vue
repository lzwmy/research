<template>
    <div class="add_research_model_container" v-loading="loading">
      <div class="research_model_header" @click="crfLeftToggle" :class="{'crf-left-btn': true,'onclick': crfLeftBtnStatus}">
        <!--<i class="iconfont iconshousuo" id="modifyKeepAside" title="收缩"></i>
        <i class="iconfont iconzhankai" id="modifyShowAside" title="展开" style="display: none"></i>-->
        {{title}}
      </div>
      <div class="research_content_box">
        <el-row>
          <el-col :span="8" class="model_name">
            <span>模型名称</span>
            <el-input size="mini" v-model="modelName"></el-input>
          </el-col>
          <el-col :span="8" class="description_info">
            <span>描述</span>
            <el-input size="mini" v-model="modelDesc"></el-input>
          </el-col>
          <el-col :span="8" class="share_type">
            <span>共享类型</span>
            <el-select v-model="shareType">
              <el-option
                v-for="item in shareTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="8">
            <span>表单查询条件</span>
            <el-select class="fromSearch"  multiple v-model="searchTerm" @change="changeFromSearchTerm">
              <el-option
                v-for="item in searchTermList"
                :key="item.id"
                :label="item.crfName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span>表单关系</span>
            <el-select class="fromSearch" v-model="relationFrom">
              <el-option
                v-for="item in relationFromList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="modelSave">保存</el-button>
            <el-button @click="breakModel">返回</el-button>
          </el-col>
        </el-row>
        <div class="segmentation_line"></div>
      </div>
      <div class="research_box" style="min-height: 500px;">
        <component ref="researchBox" :treeData="treeData" :modelData="modelData" :is="switchComponent" @status-modifyTableData="callbackModifyData"></component>
      </div>
    </div>
</template>

<script>
  import researchBody from './researchBody';
    export default {
      props:{
        title:{
          type:String,
          default:null
        },
        modelData:{
          type:Object,
          default:null
        }
      },
      data() {
        return {
          switchComponent:researchBody,
          shareType:"",//共享类型
          shareTypeList:[
            {
              value: 0,
              label: '公共'
            }, {
              value: 1,
              label: '个人'
            }
          ],
          searchTerm:[],//表单查询条件
          searchTermList:[],
          relationFrom:"",//表单关系
          relationFromList:[
            {
              value: 2,
              label: '并且'
            }, {
              value: 1,
              label: '或者'
            }
          ],
          loading:false,
          treeData:[],
          modelName:"",
          modelDesc:"",
          ModifyData:{},
          crfLeftBtnStatus:false
        }
      },
      methods:{
        resize () {
          let height = $('#main').height();
          let width = $('.cloud-component').width()-$('.crf-left-menu').width();
          //暂时取消
          /*$('.crf-main-box').css({
            width:width
          })*/
          $('.crf-left-menu .menu-panel-content').height(height - 149);
          $('.crf-right-menu').height(height - 55);
          // $('.crf-main').eq(0).height(height - 115);
          $('.crf-main-box').eq(0).height(height-55);
          $('.menu_table_box .el-table').eq(0).height(height - 230)
          /*this.$nextTick(() => {
            $('.crf-main').eq(0).find('.colwidth-1').width(($('.crf-main').width() - 150) / 2);
          });*/

        },
        breakModel() {
          this.$emit('backModel',{type:'break'})
        },
        modelSave() {
          if(this.modelData.type == 'add'){
            this.modelResearchSave();
          }else if(this.modelData.type=='modify') {
            this.modelModifySave();
          }
        },
        changeFromSearchTerm(value) {
          console.log(value)
          if(value.length!==0) {
            this.modelTreeList(value)
          }else{
            this.$refs.researchBox.searchList = [];
            this.$refs.researchBox.searchTreeList = [];
            this.$refs.researchBox.exportTreeListAdd = [];
            this.$refs.researchBox.showTreeListAdd = [];
          }

        },
        callbackModifyData(data) {
          if(data!==null && data !== 'null'){
            this.ModifyData = data;
            this.searchTerm = data.crfList;
            this.modelName = data.modelName;
            this.modelDesc = data.modelDesc;
            this.shareType = data.modelType;
            this.relationFrom = data.formRelation;
          }
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
        //初始化，清空所有的信息
        init() {
          console.log("初始化开始");
          this.modelName= "";
          this.modelDesc = "";
          this.shareType = 1;
          this.relationFrom = "";
          this.searchTerm = [];
          this.treeData = [];
          this.$refs.researchBox.searchTreeList = [];
          this.modelQuerySearchCrf();
        },
        //获取 表单查询条件
        async modelQuerySearchCrf() {
          let that = this;
          let formData = {
            "crfIsAvailable": 1,
            "diseaseId": that.modelData.obj.diseaseId
          };
          try{
            let data = await that.$http.modelQuerySearchCrf(formData);
            if(data.code==0) {
              this.searchTermList = data.data
            }
          }catch (error) {
            that.$notice("表单查询条件获取失败");
          }
          that.loading = false;
        },
        //根据 表单查询条件 返回对应的树结构
        async modelTreeList(value) {
          let that = this;
          this.$refs.researchBox.loadingTree = true;
            this.$refs.researchBox.$refs.showItem.loading = true;
            this.$refs.researchBox.$refs.exportItem.loading = true;
          let formData = {
            "crfIds": value
          };
          try{
            let data = await that.$http.modelTreeList(that.$format(formData))
            console.log(data);
            if(data.code==0) {
              that.treeData = data.data
            }
            this.$refs.researchBox.loadingTree = false;
          }catch (error) {
            that.$notice('结构树获取失败')
          }
          this.$refs.researchBox.loadingTree = false;
          this.$refs.researchBox.$refs.exportItem.loading = false;
          this.$refs.researchBox.$refs.showItem.loading = false;
        },
        //保存 --新增
        async modelResearchSave() {
          let exportItem, displayItem;
          if(this.modelData.type == 'add'){
            exportItem = this.$refs.researchBox.exportTreeListAdd || [];
            displayItem = this.$refs.researchBox.showTreeListAdd || [];
          }else {
            exportItem = this.$refs.researchBox.treeDataExportEdit || [];
            displayItem = this.$refs.researchBox.treeDataShowEdit || [];
          }
          let that = this;
          let fromData ={
            "modelId": "",
            "modelName": that.modelName || "",
            "modelDesc": that.modelDesc || "",
            "modelType": that.shareType || "",
            "formRelation": that.relationFrom || "",
            "diseaseId": that.modelData.obj.diseaseId,
            "crfList": that.searchTerm||[],
            "queryItem":that.treeData||[],
            "filter":that.$refs.researchBox.searchList||[],
            exportItem: exportItem,
            displayItem: displayItem,
          };
          try{
            let data = await that.$http.modelResearchSave(fromData);
            if(data.code === 0 ){
              that.$message({
                type:"success",
                message:data.msg
              })
              that.$emit('backModel',{type:'add'});
            }
          }catch (error) {
            that.$notice("保存失败")
          }
        },
        // 保存 -- 编辑
        async modelModifySave() {
          let exportItem, displayItem;
          if(this.modelData.type == 'add'){
            exportItem = this.$refs.researchBox.exportTreeListAdd || [];
            displayItem = this.$refs.researchBox.showTreeListAdd || [];
          }else {
            exportItem = this.$refs.researchBox.treeDataExportEdit || [];
            displayItem = this.$refs.researchBox.treeDataShowEdit || [];
          }
          // console.log(displayItem)
          // console.log(exportItem)
          // return;
          let that = this;
          let fromData ={
            "modelId": that.ModifyData.modelId || "",
            "modelName": that.modelName || "",
            "modelDesc": that.modelDesc || "",
            "modelType": that.shareType || "",
            "formRelation": that.relationFrom || "",
            "diseaseId": that.ModifyData.diseaseId || "",
            "crfList": that.searchTerm||[],
            "queryItem":that.$refs.researchBox.searchTreeList||[],
            "filter":that.$refs.researchBox.searchList||[],
            exportItem: exportItem,
            displayItem: displayItem,
          };
          try{
            let data = await that.$http.modelModifySave(fromData);
              console.log(data)
            if(data.code == 0) {
              that.$message({
                type:"success",
                message: data.msg
              })
              that.$emit('backModel',{type:'modify'});
            }
          }catch (error) {
            that.$notice('保存失败')
          }
        }
      },
      mounted() {

        this.loading = true;
        this.resize ();
        this.modelQuerySearchCrf();
        if(this.modelData.type=='add') {
          this.init();

        }
        $('#modifyKeepAside').on('click',function() {
          $('.crf-left-menu').hide();
          $(this).hide();
          $('#modifyShowAside').show();
          $('.crf-main-box').css({
            width:"100%"
          });
        });
        $('#modifyShowAside').on('click',function() {
          $('.crf-left-menu').fadeIn();
          $(this).hide();
          $('#modifyKeepAside').show();
          $('.crf-main-box').css({
            width:"80%"
          })
        })
      }
    }
</script>

<style lang="less" scoped>
.add_research_model_container{
  width:100%;
  height: 100%;
  .research_model_header{
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #63666E;
    background-color: #EEEEEE;
    padding-left: 3%;
    i{
      color: #3C81F0;
      padding: 0 5px;
      cursor: pointer;
    }
  }
  .research_content_box{
    margin: 20px 0;
    .model_name{
      text-align: left;
      .el-input{
        width: 60%;
      }
      span{
        margin-right: 7%;
      }
    }
    .description_info{
      text-align:left;
      .el-input{
        width: 60%;
      }
      span{
        margin-right: 7%;
      }
    }
    .share_type{
      text-align: left;
    }
    span{
      font-size:12px;
      color: #63666E;
      margin: 0 10px;
    }
    .segmentation_line{
      width: 100%;
      height: 1px;
      /*background-color: #999999;*/
      border-bottom: 1px dashed #d8dce5;
    }
    .fromSearch{
      width: 60%;
      box-sizing: border-box;
    }
  }
  .crf-left-btn{
    background-position: 1% 48%;
  }
}
</style>
