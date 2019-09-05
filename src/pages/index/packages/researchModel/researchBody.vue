<template>
    <div class="research_body_container">
      <div class="tab_switch">
        <div class="search_tab " :class="{'active':active==1}" @click="searchTab">查询项</div>
        <div class="exprot_tab" :class="{'active':active==2}" @click="switchTab">展示项</div>
        <div class="show_tab" :class="{'active':active==3}" @click="exportTab">导出项</div>
      </div>
      <div class="show_search_tab" v-if="active==1">
        <div class="tree_style left">
          <!-- <el-tree ref="rootTree" node-key="id" :data="searchTreeList" :props="defaultProps" :expand-on-click-node="true" v-loading="loadingTree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @dblclick="searchTreeQuery(data)">{{node.label}}</span>
            </span>
          </el-tree> -->
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
          <!--v-for="(it,index) in item.query"-->
          <add-card :pItem="item.children" :Index="index" :item="item.query" :delShow="false"></add-card>
        </div>
      </div>
      <div class="show_tab_line" v-if="showItemComponent" v-show="active==2">
        <!-- <showItem ref="showItem" @treeData="handleTreeDataShow" :dataTreeEdit="treeDataShowEdit" :selectTreeData="showTreeListAdd" :type="modelData.type"></showItem> -->
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
            /*{
              "query":
                {
                  "children":[],
                  "matchType":0,
                  "nodeList":[
                    /!*{
                      "name":"报告",
                      "controlType":"RADIO_BUTTON",
                      "operator":"",
                      "value1":"",
                      "value2":"",
                      "item":{
                        "name":"单页",
                        "operator":"",
                        "value1":"",
                        "value2":"",
                        "item":{
                          "name":"小节",
                          "operator":"",
                          "value1":"",
                          "value2":"",
                          "item":{
                            "name":"就诊类型",
                            "operator":"",
                            "value1":"专家门诊",
                            "value2":"",
                            "item":{}
                          }
                        }
                      }
                    }*!/
                    /!*{
                      "controlType":"SINGLE_INPUT",
                      "matchType":"",
                      "operator":"",
                      "value1":"",
                      "value2":"",
                      "itemTree":[
                        // {
                        //     "name":"首页"
                        // },
                        // {
                        //     "name":"首页"
                        // }
                      ]
                    }*!/
                  ],
                },
              "reportName":""
            }*/
          ],
          searchMatchObj:{
            "children":[],
            "matchType":0,
            "nodeList":[
              /*{
                "name":"报告",
                "controlType":"NUMBER_INPUT",
                "operator":"",
                "value1":"",
                "value2":"",
                "item":{
                  "name":"单页",
                  "operator":"",
                  "value1":"",
                  "value2":"",
                  "item":{
                    "name":"小节",
                    "operator":"",
                    "value1":"",
                    "value2":"",
                    "item":{
                      "name":"就诊类型",
                      "operator":"",
                      "value1":"专家门诊",
                      "value2":"",
                      "item":{}
                    }
                  }
                }
              }*/
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
        }
      },
      created() {
        /*if(this.modelData.type == 'modify'){
          this.getDataList(this.modelData.obj.modelId);
        }*/
      },
      mounted() {
        this.$nextTick(()=>{
          setTimeout(()=>{
            this.resize()
          },300)
        })
      },
      methods: {
        handleResetLoading() {
          this.tabLoading = false;
        },
        resize() {
          let height = $('.crf-main-box').height();
          $('.research_box').height(height - 115);
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
    // position: absolute;
    top: 0;
    left: 0;
    .search_tab{
      float: left;
      padding: 8px 40px;
      background:linear-gradient(360deg,rgba(244,247,250,1) 0%,rgba(255,255,255,1) 100%);
      border-radius:4px;
      border:1px solid rgba(230,234,238,1);
      cursor: pointer;
    }
    .exprot_tab{
      float: left;
      padding: 8px 40px;
      margin: 0 4px;
      background:linear-gradient(360deg,rgba(244,247,250,1) 0%,rgba(255,255,255,1) 100%);
      border-radius:4px;
      border:1px solid rgba(230,234,238,1);
      cursor: pointer;
    }
    .show_tab{
      float: left;
      padding: 8px 40px;
      background:linear-gradient(360deg,rgba(244,247,250,1) 0%,rgba(255,255,255,1) 100%);
      border-radius:4px;
      border:1px solid rgba(230,234,238,1);
      cursor: pointer;
    }
  }
  .active{
    border-bottom: none !important;
    padding-bottom: 11px !important;
    position: relative;
    z-index: 1;
    height: 41px;
    background: #fff !important;
    border-left: 1px solid rgba(216,216,216,1) !important;
    border-top: 1px solid rgba(216,216,216,1) !important;
    border-right: 1px solid rgba(216,216,216,1) !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  .show_search_tab,.show_exprot_tab,.show_tab_line{
    // position: absolute;
    top: 38px;
    width: 100%;
    // min-height: 420px;
    padding: 30px 10px 10px;
    position: absolute;
    bottom: 50px;
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
      padding: 5px;
      box-sizing: border-box;
      /*display: inline-block;*/
      vertical-align: top;
      float: left;
      overflow: auto;
    }
    .search_tab_component{
      display: inline-block;
      width: 81%;
      /*height: 100%;*/
      margin-bottom: 1%;
      float: right;
      margin-left: 5px;
      .search_tab_name{
        display: inline-block;
        min-width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding: 0px 8px;
        background-color: #4D84FF;
        color: white;
        border: 1px solid rgba(0,0,0,0.06);
        border-radius: 8px 8px 0 0;
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
