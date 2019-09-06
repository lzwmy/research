<template>
    <div class="config_model_container">
      <div class="component_head flex-between-center">
        <p>
          <span class="break_box" v-show="$route.query.type=='modify'" @click="breakDetailPage">
            <i class="iconfont iconfanhui"></i>
            <span>返回</span>
            <i class="partition_line"></i>
          </span>
          <span class="title">{{$route.query.modelName}}</span>
        </p>
        <div class=" cur_pointer head_content flex-start-center">
          <i class="iconfont iconguanbi" @click="closePage"></i>
        </div>
      </div>
      <div class="config_model_box">
        <div class="add_research_model_container" v-loading="loading">
          <!--<div class="research_model_header" @click="crfLeftToggle" :class="{'crf-left-btn': true,'onclick': crfLeftBtnStatus}">
            &lt;!&ndash;<i class="iconfont iconshousuo" id="modifyKeepAside" title="收缩"></i>
            <i class="iconfont iconzhankai" id="modifyShowAside" title="展开" style="display: none"></i>&ndash;&gt;
            {{$route.query.modelName}}
          </div>-->
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
                <el-select class="fromSearch" v-model="relationFrom" @change="changeRelationForm">
                  <el-option
                    v-for="item in relationFromList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-button class="color_change" type="primary" @click="modelSave">
                  <i class="iconfont iconbaocun"></i>
                  保存
                </el-button>
                <!--<el-button @click="breakModel">返回</el-button>-->
              </el-col>
            </el-row>
            <div class="segmentation_line"></div>
          </div>
          <div class="research_box" style="min-height: 500px;">
            <component ref="researchBox"
                       :treeData="treeData"
                       :modelData="modelData"
                       :is="switchComponent"
                       @status-modifyTableData="callbackModifyData">
            </component>
          </div>
        </div>
      </div>
    </div>
</template>


<script>
  import researchBody from './../researchBody';
  export default {
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
        crfLeftBtnStatus:false,
        modelData:{
          obj:{},
          type:"add"
        }
      }
    },
    methods:{
      resize () {
        let height = $('.config_model_container').height();
        $('.research_box').height(height - 177);

      },
      // 关闭 按钮
      closePage() {
        let diseaseId = this.$route.query.id;
        this.$router.push({
          path:"/modelManage",
          query:{
            id:diseaseId
          }
        })
      },
      //返回到 详细页
      breakDetailPage() {
        let diseaseId = this.$route.query.id;
        let name = this.$route.query.modelName;
        let modelId = this.$route.query.modelId;
        /*this.$router.push({
          path:"/modelManage/detailPage",
          query:{
            id:diseaseId,
            name:name,
            modelId:modelId
          }
        })*/
        window.history.go(-1);
      },
      breakModel() {
        this.$emit('backModel',{type:'break'})
      },
      modelSave() {
        if(this.$route.query.type == 'add'){
          this.modelResearchSave();
        }else if(this.$route.query.type=='modify') {
          this.modelModifySave();
        }
      },
      changeFromSearchTerm(value) {
        console.log(value)
        if(value.length!==0) {
          this.modelTreeList(value);
          this.$refs.researchBox.modelDisplaySum();
        }else{
          this.$refs.researchBox.searchList = [];
          this.$refs.researchBox.searchTreeList = [];
          this.$refs.researchBox.exportTreeListAdd = [];
          this.$refs.researchBox.showTreeListAdd = [];
        }
      },
      changeRelationForm(value) {
        this.relationFrom = value;
        this.$refs.researchBox.modelDisplaySum();
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
          "diseaseId": that.$route.query.id
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
        if(this.$refs.researchBox.$refs.exportItem) {
          this.$refs.researchBox.$refs.exportItem.loading = true;
        }
        if(this.$refs.researchBox.$refs.showItem) {
          this.$refs.researchBox.$refs.showItem.loading = true;
        }
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
        if(this.$refs.researchBox.$refs.exportItem) {
          this.$refs.researchBox.$refs.exportItem.loading = false;
        }
        if(this.$refs.researchBox.$refs.showItem) {
          this.$refs.researchBox.$refs.showItem.loading = false;
        }
      },
      //保存 --新增
      async modelResearchSave() {
        let exportItem, displayItem;
        if(this.$route.query.type == 'add'){
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
          "diseaseId": that.$route.query.id,
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
            });
            // that.$emit('backModel',{type:'add'});
            //返回 列表页
            that.$router.push({
              path:'/modelManage',
              query:{
                id:that.$route.query.id
              }
            })
          }
        }catch (error) {
          that.$notice("保存失败")
        }
      },
      // 保存 -- 编辑
      async modelModifySave() {
        let exportItem, displayItem;
        if(this.$route.query.type == 'add'){
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
          "modelId": that.$route.query.modelId || "",
          "modelName": that.modelName || "",
          "modelDesc": that.modelDesc || "",
          "modelType": that.shareType || "",
          "formRelation": that.relationFrom || "",
          "diseaseId": that.$route.query.id || "",
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
            that.$router.push({
              path:"/modelManage/detailPage",
              query:{
                id:that.$route.query.id,
                name:that.$route.query.modelName,
                modelId:that.$route.query.modelId
              }
            })
          }
        }catch (error) {
          that.$notice('保存失败')
        }
      }
    },
    mounted() {
      this.loading = true;
      this.$nextTick(()=>{
        this.resize ();
      });
      this.modelQuerySearchCrf();
      if(this.$route.query.type=='add') {
        this.init();
      }else if(this.$route.query.type == 'modify') {
        this.modelData.type = this.$route.query.type;
        this.$nextTick(function() {
          this.$refs.researchBox.getDataList(this.$route.query.modelId);
        })
      }
    },
    deactivated() {
      this.$destroy()
    },
  }
</script>

<style lang="less" scoped>
.config_model_container{
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
  .config_model_box{
    display: flex;
    height: 100%;
    width: 100%;
    /*background-color: #ffffff;*/
  }
  .color_change{
    margin-left: 2%;
    background-color: #1BBAE1;
    color: #ffffff;
    .iconfont{
      font-size: 14px;
    }
  }
}
</style>
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
      padding: 20px;
      background-color: #ffffff;
      border:1px solid #E5EBEC;
      box-sizing: border-box;
      .model_name{
        text-align: left;
        .el-input{
          width: 60%;
        }
        span{
          margin-right: 6.5%;
        }
      }
      .description_info{
        text-align:left;
        .el-input{
          width: 60%;
        }
        span{
          margin-right: 6.2%;
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
        /*border-bottom: 1px dashed #d8dce5;*/
        /*border-bottom: 1px dashed #d8dce5;*/
      }
      .fromSearch{
        width: 60%;
        box-sizing: border-box;
      }
    }
    .crf-left-btn{
      background-position: 1% 48%;
    }
    .research_box{
      background-color: #ffffff;
      padding: 20px;
      border:1px solid #E5EBEC;
      box-sizing: border-box;
    }
  }
</style>
<style lang="less">
  .research_content_box{
    .fromSearch{
      .el-input{
        height: auto;
      }
    }
  }
</style>
