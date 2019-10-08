<template>
    <div class="research_body_container">
      <div class="tab_switch">
        <div class="search_tab " :class="{'active':active==1}" @click="searchTab">查询项</div>
        <div class="exprot_tab" :class="{'active':active==2}" @click="switchTab">展示项</div>
        <div class="show_tab" :class="{'active':active==3}" @click="exportTab">导出项</div>
        <div class="display_text">
          <span>报告个数：{{crfSum}}</span>
          <span> ，患者数量 {{patientCount}}</span>
          <span>, 查询时间 {{consumeTime}}s</span>
        </div>
      </div>
      <div class="show_search_tab" v-if="active==1">
        <div class="tree_style left" v-loading="loadingTree">
          <Tree 
              :dataTree="searchTreeList"
              :showCheckbox="false"
              :defaultExpandAll="true"
              :props="defaultProps"
              :filter="{key:'controlType', val:['LABLE']}"
              @dblclickNode="handleDblclickNode">
          </Tree>
        </div>
        <div class="search_tab_component" v-for="(item,index) in searchList" :key="index">
          <div class="search_tab_name">{{item.reportName}}</div>
          <add-card :pItem="item.children" :Index="index" :item="item.query" :delShow="false" @state-refresh="stateRefresh"></add-card>
        </div>
      </div>
      <div class="show_tab_line" v-if="showItemComponent" v-show="active==2">
        <showItem ref="showItem" @treeData="handleTreeDataShow" :dataTreeAdd="showTreeListAdd" :dataTreeEdit="treeDataShowEdit"  :type="modelData.type"></showItem>
      </div>
      <div class="show_exprot_tab" v-if="editItemComponent" v-show="active==3">
        <exportItem ref="exportItem" @treeData="handleTreeDataExport" :dataTreeAdd="exportTreeListAdd" :dataTreeEdit="treeDataExportEdit" :type="modelData.type"></exportItem>
      </div>
    </div>
</template>

<script>
  import addCard from './nestingComponent/addCard';
  import showItem from './nestingComponent/showItem';
  import exportItem from './nestingComponent/exportItem';
  import {familyTree,getNamesId,objectJoin} from './util.js';
  import Tree from './nestingComponent/tree'
    export default {
      props:{
        modelData:{
          type:Object,
          default:null
        },
        treeData:{
          type:Array,
          default: null
        },
        loadingES:{
          type: Boolean,
          default: true
        }
      },
      components: {
        addCard,
        exportItem,
        showItem,
        Tree
      },
      data() {
        return {
          active: 1,
          loadingTree:false,
          searchTreeList: [],
          exportTreeListAdd: [],
          showTreeListAdd: [],
          dataExport: [],
          dataShow: [],
          treeDataExportEdit: [],
          treeDataShowEdit: [],
          showItemComponent: true,
          editItemComponent: true,
          treeId: 0,
          tabLoading: false,
          defaultProps: {
            children: 'children',
            label: 'labelName'
          },
          // 查询条件匹配
          searchList: [
          ],
          searchMatchObj:{
            "children":[],
            "matchType":0,
            "nodeList":[
            ],
          },
          searchMathQuery: {
            "query":
              {
                "children": [],
                "matchType": 0,
                "nodeList": [],
              }
            ,
            "reportName": ""
          },
          //实时查询字段
          patientCount:0, //患者数量
          crfSum:0,//报告总个数
          consumeTime:0,//查询时间
        }
      },
      watch:{
        "treeData":function (value) {
          this.treeId = 0;
          this.searchTreeList = this.addTreeId(value);
          this.treeId = 0;
          this.exportTreeListAdd = this.addTreeId(value);
          this.treeId = 0;
          this.showTreeListAdd = this.addTreeId(value);
        },
        'modelData.type' :function (newVal) {
          if(this.modelData.type == 'add'){
            this.exportTreeListAdd = [];
            this.showTreeListAdd = [];
            this.searchTreeList = [];
            this.searchList = [];
          }
        },
      },
      created() {
        /*if(this.modelData.type == 'modify'){
          this.getDataList(this.modelData.obj.modelId);
        }*/
      },
      mounted() {
        this.$nextTick(()=>{
          setTimeout(()=>{
            this.resize();
            this.modelDisplaySum();
          },300)
        })
      },
      methods: {
        handleResetLoading() {
          this.tabLoading = false;
        },
        resize() {
          let height = $('.config_model_container').height();
          $('.research_box').height(height - 165);
          $('.research_body_container').height(height-160);
        },
        //查询项
        searchTab() {
          this.active = 1;
        },
        exportTab() {
          this.active = 3;
        },
        switchTab() {
          this.active = 2;
        },
        processTree(array,data) {
          if(this.searchList.length!==0) {
            // for(let i=0;i<this.searchList.length;i++) {
            let arrayIndexOf = this.searchList.map(item=>{
              return item.reportName
            })
            console.log(this.searchList,array,arrayIndexOf.indexOf(array[0].labelName));
                if(arrayIndexOf.indexOf(array[0].labelName)!='-1'){
                  // console.log(this.searchList[i].reportName);
                  let ItemTree = objectJoin(array);
                  this.$store.commit('ADD_CONDITION',ItemTree);
                  // break;
                }else{
                  console.log("新开一个匹配card");
                  this.$store.commit('STATE_GRAY',null);
                  let copyData = Object.assign({},JSON.parse(JSON.stringify(this.searchMathQuery)));
                  let ItemTree = objectJoin(array);
                  copyData.reportName = array[0].labelName;
                  copyData.query.nodeList.push(ItemTree);
                  this.$store.commit('STATE_GRAY',copyData.query);
                  this.searchList.push(copyData);
                  // break;
                }
            // }
          }
        },
        multipleProcessTree(array,data) {
          let arrayIndexOf = this.searchList.map(item=>{
            return item.reportName
          })
          if(arrayIndexOf.indexOf(array[0].labelName)!='-1') {
            //匹配状态 选中状态是否 一致 如果是一致就添加 否则就提示信息
            this.matchReportName(this.searchList[arrayIndexOf.indexOf(array[0].labelName)],array)
          }else{
            this.$message.info('请选择指定的报告添加查询条件')
          }
        },
        async getDataList(value) {
          this.showItemComponent = false;
          this.editItemComponent = false;
          let that = this;
          let formData = {
              modelId: value
          };
          try {
              let res = await this.$http.modelManageGetPreviewDataList(formData);
              if (res.data && res.code == 0) {
                  this.$emit('status-modifyTableData',res.data);
                  let arr = res.data;
                  that.treeId = 0;
                  that.searchTreeList = that.addTreeId(res.data.queryItem);
                  that.searchList = res.data.filter;
                  if(that.searchList.length!==0) {
                    that.$store.commit('STATE_GRAY',that.searchList[0].query);
                  }
                  that.treeId = 0;
                  that.treeDataExportEdit = this.addTreeId(arr.exportItem);
                  that.treeId = 0;
                  that.treeDataShowEdit = this.addTreeId(arr.displayItem);
                  this.showItemComponent = true;
                  this.editItemComponent = true;
              }else {
                that.$mes('error', res.msg);
              }
          } catch (error) {
              console.log(error);
          }
        },
        //节点动态添加treeId（唯一值）
        addTreeId(obj) {
          if(obj instanceof Array) {
              let n = [];
              for(let i = 0; i < obj.length; i++) {
                  n[i] = this.addTreeId(obj[i]);
              }
              return n;
          }else if  (obj instanceof Object) {
            let n = {}; 
              obj.treeId = this.treeId;
              this.treeId++;
              for (let i in obj) {
                  n[i] = this.addTreeId(obj[i]); 
              } 
              return n; 
          }else {
              return obj;
          }
        },
        handleTreeDataExport(data) {
          if(this.modelData.type == 'add') {
            this.exportTreeListAdd = data;
          }else {
            this.treeDataExportEdit = data;
          }
        },
        handleTreeDataShow(data){
          if(this.modelData.type == 'add') {
            this.showTreeListAdd = data;
          }else {
            this.treeDataShowEdit = data;
            console.log(data)
          }
        },
        matchReportName(data,value) {
          //匹配状态 选中状态是否 一致 如果是一致就添加 否则就提示信息
          if(data.query == this.$store.state.researchModel.researchData){
            let ItemTree = objectJoin(value);
            this.$store.commit('ADD_CONDITION',ItemTree);
          }else{
            this.dataCompared(data.query.children,value)
          }
        },
        dataCompared(array,value) {
          if(array.length!==0) {
            for(let i=0;i<array.length;i++) {
              if(array[i]==this.$store.state.researchModel.researchData) {
                let ItemTree = objectJoin(value);
                this.$store.commit('ADD_CONDITION',ItemTree);
              }else{
                this.dataCompared(array[i].children,value);
              }
            }
          }else{
            this.$message.info('请点击对应的报告添加查询条件')
          }
        },
        //接收参数
        stateRefresh() {
            this.modelDisplaySum();
        },
        //双击查询项返回node节点
        handleDblclickNode({leafNode}) {
          if(leafNode){
              //新建进去 点击子集 添加右侧信息
              if(this.searchList.length==0){
                let copyData = Object.assign({},JSON.parse(JSON.stringify(this.searchMathQuery)));
                let result = getNamesId(this.searchTreeList,[],leafNode.treeId);
                console.log(result)
                // let ItemTree = objectJoin(result);
                let ItemTree =Object.assign({},JSON.parse(JSON.stringify(objectJoin(result)))) ;
                copyData.query.nodeList.push(ItemTree)
                /*for(let i=0;i<copyData.query.length;i++) {
                  copyData.query.nodeList.push(ItemTree)
                }*/
                copyData.reportName = result[0].labelName;
                this.$store.commit('STATE_GRAY',copyData.query);
                this.searchList.push(copyData)
              }else{
                let copyData = Object.assign({},JSON.parse(JSON.stringify(this.searchMatchObj)));
                copyData.controlType=leafNode.controlType;
                let result = getNamesId(this.searchTreeList,[],leafNode.treeId);
                console.log(this.$refs.rootTree)
                  /*this.searchList.forEach(item=>{
                    if(item.reportName == result[0].labelName){
                      this.$store.commit('STATE_GRAY',item.query);
                    }
                  });*/
                  if(this.searchList.length>1){
                    this.multipleProcessTree(result,copyData)
                  }else{
                    //点击树形结构添加对应的 数据
                    this.processTree(result,copyData);
                  }
            }
          }
        },
        //实时更新 患者人数和报告数
        async modelDisplaySum() {
          let that = this;
          let formData = {
            formRelation:that.$parent.relationFrom,
            filter:that.searchList,
            crfList:that.$parent.searchTerm || [],
          };
          // console.log(formData);
          try {
            let data  = await this.$http.modelDisplaySum(formData);
            if(data.code == 0) {
              that.patientCount = data.data.patientCount;
              that.crfSum = data.data.crfSum;
              that.consumeTime = data.data.consumeTime;
            }
          }catch (error) {
            console.log(error)
          }
        }
      }
    }
</script>

<style lang="less" scoped>
.research_body_container{
  width: 100%;
  height: 100%;
  position: relative;
  .tab_switch{
    width: auto;
    top: 0;
    left: 0;
    font-size: 14px;
    .search_tab{
      float: left;
      padding: 11px 40px;
      border:1px solid #F3F3F9;
      border-bottom-color: transparent;
      cursor: pointer;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background-color: #E5EBEC;
    }
    .exprot_tab{
      float: left;
      padding: 11px 40px;
      /*margin: 0 4px;*/
      border:1px solid #F3F3F9;
      border-bottom-color: transparent;
      cursor: pointer;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background-color: #E5EBEC;
    }
    .show_tab{
      float: left;
      padding: 11px 40px;
      border:1px solid #F3F3F9;
      border-bottom-color: transparent;
      cursor: pointer;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background-color: #E5EBEC;
    }
    .display_text{
      color: rgb(217, 85, 85);
      display: inline-block;
      float: right;
      margin-left: 10px;
      line-height: 36px;
      padding:  0 10px;
      border-radius: 4px;
      background: rgba(217, 85, 85,0.3);

    }
  }
  .active{
    border-bottom: none !important;
    padding-bottom: 11px !important;
    position: relative;
    z-index: 1;
    height: 41px;
    background: #ffffff !important;
    color: #394263;
    border-left: 1px solid #d8d8d8 !important;
    border-top: 1px solid #d8d8d8 !important;
    border-right: 1px solid #d8d8d8 !important;
    border-top-left-radius: 2px !important;
    border-top-right-radius: 2px !important;
  }
  .show_search_tab,.show_exprot_tab,.show_tab_line{
    top: 38px;
    width: 100%;
    padding: 10px 10px 0px 0px;
    position: absolute;
    bottom: 8px;
    left: 0;
    float: left;
    margin-top: 2px;
    border: 1px solid rgba(216,216,216,1);
    overflow: auto;
    .tree_style{
      width: 16%;
      height: 100%;
      background:rgba(255,255,255,1);
      border:1px solid rgba(216,216,216,1);
      border-left: none;
      border-bottom: none;
      padding: 5px;
      box-sizing: border-box;
      vertical-align: top;
      float: left;
      overflow: auto;
    }
    .search_tab_component{
      display: inline-block;
      width: 81%;
      margin-bottom: 1%;
      float: right;
      margin-left: 5px;
      .search_tab_name{
        display: inline-block;
        min-width: 118px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        padding: 0 8px;
        background-color: #1bbae1;
        color: white;
        border: 1px solid #1bbae1;
        border-radius: 2px 2px 0 0;
        font-size: 14px;
      }
    }
  }
}
</style>
<style>
  body.theme-blue .el-tree .el-tree-node{
    margin-bottom: 0;
  }
</style>
