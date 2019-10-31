<template>
    <div class="add_item_data_container">
      <el-dialog
        title="添加条目"
        class="add_item_dialog"
        :append-to-body="true"
        :visible.sync="dialogVisible"
        @close="closeAddDialog"
        width="960px">
        <div class="add_item_content">
          <div class="search_term-box">
            <div class="search_term-left">
              <!--<el-select class="search_type-box" v-model="searchType">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="报告" :value="1"></el-option>
                <el-option label="随访" :value="2"></el-option>
              </el-select>-->
              <el-input class="search_item" v-model="searchName" @keyup.enter.native="searchItem(searchName)" placeholder="请输入条目名称">
                <i slot="suffix" class="el-input__icon el-icon-search" @click.stop="searchItem(searchName)"></i>
              </el-input>
            </div>
            <div class="search_term-right">
              <el-button type="primary" @click="addDirect">
                <i class="iconfont icontianjia"></i>
                直接添加
              </el-button>
            </div>
          </div>
          <div class="search_term-body">
            <div class="search_tree">
              <el-tree :data="nodeList" :props="defaultProps" v-loading="treeLoading">
                <div class="custom-tree-node" slot-scope="{ node, data }" @click="clickNodeListItem(node,data)">
                  <span >{{ node.label }}</span>
                </div>
              </el-tree>
            </div>
            <div class="search_table">
              <div class="search_add-nav">
                <div class="add-btn" v-if="multipleSelection.length!==0" @click="addTableData">
                  <!--<span>添加</span>-->
                  <el-button>
                    <i class="iconfont iconquerentianjia"></i>
                    添加
                  </el-button>
                </div>
                <div class="add-btn gray" v-else>
                  <!--<i class="iconfont iconquerentianjia"></i>
                  <span>添加</span>-->
                  <el-tooltip class="item" effect="dark" content="请勾选要添加的内容" placement="left">
                    <el-button>
                      <i class="iconfont iconquerentianjia"></i>
                      添加
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <div class="table_content">
                <el-table v-show="tableList.length!==0" ref="multipleTable"
                          :data="tableList"
                          tooltip-effect="dark"
                          v-loading="tableLoading"
                          @selection-change="handleSelectionChange"
                          style="width: 662px;height: 338px;">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column  label="字段名" min-width="5%" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div :id="scope.row.id">{{scope.row.elNameCN}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ctrlType" label="表单类型" min-width="5%" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span v-if="scope.row.ctrlType == 'SINGLE_INPUT'">单行输入框</span>
                      <span v-if="scope.row.ctrlType == 'MULTI_INPUT'">多行输入框</span>
                      <span v-if="scope.row.ctrlType == 'SINGLE_COMBOX'">下拉单选</span>
                      <span v-if="scope.row.ctrlType == 'MULTI_COMBOX'">下拉复选</span>
                      <span v-if="scope.row.ctrlType == 'RADIO_BUTTON'">单选框</span>
                      <span v-if="scope.row.ctrlType == 'CHECKBOX'">复选框</span>
                      <span v-if="scope.row.ctrlType == 'DATE'">日期</span>
                      <span v-if="scope.row.ctrlType == 'DATE_TIME'">时间</span>
                      <span v-if="scope.row.ctrlType == 'DATE_TIME'">日期时间</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dataType" label="字段类型" min-width="5%" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span v-if="scope.row.dataType == '1'">数字</span>
                      <span v-if="scope.row.dataType == '2'">文本</span>
                      <span v-if="scope.row.dataType == '3'">时间</span>
                      <span v-if="scope.row.dataType == '4'">日期</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="valueRange" label="值域" min-width="5%" show-overflow-tooltip></el-table-column>
                </el-table>
                <img v-show="tableList.length==0" src="./image/none_content.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "addItemData",
      props:{
        displayMask:{
          type:Boolean,
          default:null
        }
      },
      watch:{
        "displayMask":function (value) {
          this.dialogVisible = value;
          if(value) {
            this.init();
          }
        }
      },
      data() {
        return {
          dialogVisible:false,
          tableLoading:false,
          treeLoading:false,
          searchType:0,// 查询类型 0 all 1 随访 2报告
          nodeList:[], // 树形 数据
          defaultProps:{
            children: 'modules',
            label: 'name'
          },
          tableList:[], // 详细参数
          multipleSelection:[],//表格多选
          searchName:"",//查询名称
        }
      },
      methods:{
        //初始化
        init() {
          this.searchName = "";
          this.multipleSelection = [];
          this.tableList = [];
          this.$nextTick(()=>{
            this.$refs.multipleTable.clearSelection();
          });
          this.queryDataInfo();
        },
        //关闭弹框
        closeAddDialog() {
          this.dialogVisible = false;
          this.$emit('close-dialog',false)
        },
        //回车 搜索
        searchItem(value) {
          this.tableList = [];
          this.filterDataInfo(value)
        },
        // 直接添加
        addDirect() {
          this.dialogVisible = false;
          let data = {
            controlDisplayName:this.searchName,
            controlType:'SINGLE_INPUT'
          };
          this.$emit('direct-add',data);
          this.init();
        },
        //表格添加
        addTableData() {
          this.dialogVisible = false;
          this.$emit('selection-add',this.multipleSelection);
          this.init();
        },
        //单击 子集
        clickNodeListItem(node,data) {
          this.queryDetailInfo(data.id)
        },
        //表格多选
        handleSelectionChange(value) {
          this.multipleSelection = value;
        },
        // 获取所有的tree 数据
        async queryDataInfo() {
          let that = this;
          that.treeLoading = true;
          try {
            let data = await that.$http.crfFindAllModules();
            if(data.code == 0) {
              let array = data.data.categories;
              for(let i=0;i<array.length;i++) {
                if(array[i].modules.length!==0){
                  for(let j=0;j<array[i].modules.length;j++){
                    array[i].modules[j].name = array[i].modules[j].descriptionCN
                    array[i].modules[j].modules = []
                  }
                }
              }
              this.nodeList  = array;
            }
            that.treeLoading = false;
          }catch (error) {
            console.log(error)
            that.treeLoading = false;
          }
          that.treeLoading = false;
        },
        // 获取表格数据
        async queryDetailInfo(value) {
          let that = this;
          that.tableLoading = true;
          let formData = {
            id:value
          };
          try {
            let data = await that.$http.crfFindElements(formData);
            if(data.code == 0) {
              this.tableList = data.data.elements;
            }
            that.tableLoading = false;
          }catch(error) {
            console.log(error);
            that.tableLoading = false;
          }
          that.tableLoading = false;
        },
        //查询 tree
        async filterDataInfo(value) {
          let that = this;
          that.treeLoading = true;
          let formData = {
            search:value
          };
          try{
            let data = await that.$http.crfFindModules(formData);
            if(data.code == 0) {
              let array = data.data.categories;
              for(let i=0;i<array.length;i++) {
                if(array[i].modules.length!==0){
                  for(let j=0;j<array[i].modules.length;j++){
                    array[i].modules[j].name = array[i].modules[j].descriptionCN
                    array[i].modules[j].modules = []
                  }
                }
              }
              this.nodeList  = array;
            }
            that.treeLoading = false;
          }catch (error) {
            console.log(error)
            that.treeLoading = false;
          }
          that.treeLoading = false;
        }
      },
      mounted() {
      }
    }
</script>

<style lang="less">
  .add_item_dialog{
    .el-dialog{
      min-height: 570px;
      .el-dialog__header{
        border-bottom: 1px solid transparent;
        padding: 20px 30px 35px 30px;
        height: auto;
        .el-dialog__title{
          font-size: 16px;
          color: #394263;
          font-weight: bold;
          font-family:MicrosoftYaHei;
        }
      }
      .el-dialog__body{
        .add_item_content{
          display: flex;
          flex-direction: column;
          width: 100%;
          box-sizing: border-box;
          .search_term-box{
            display:flex;
            flex-direction: row;
            justify-content: space-between;
            .search_term-left{
              display: flex;
              flex-direction: row;
              .search_type-box{
                width: 120px;
                .el-input__inner{
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                }
              }
              .search_item{
                width: 782px;
                .el-input__inner{
                  border-top-left-radius: 2px;
                  border-bottom-left-radius: 2px;
                }
                .el-input__suffix{
                  cursor: pointer;
                  .el-input__icon{
                    font-size: 18px;
                    line-height: 38px;
                  }
                }
              }
              .el-input__inner{
                height: 36px;
              }
            }
            .search_term-right{
              .el-button{
                height: 36px;
                .iconfont{
                  font-size: 14px;
                }
                span{
                  font-size: 14px;
                }
              }
            }
          }
          .search_term-body{
            width: 100%;
            height: 378px;
            display: flex;
            flex-direction: row;
            border:1px solid #E5EBEC;
            margin-top: 30px;
            box-sizing: border-box;
            .search_tree{
              width: 240px;
              height: 100%;
              border-right: 1px solid #E5EBEC;
              overflow: auto;
              .custom-tree-node{
                display: flex;
                width: 100%;
                height: 100%;
                align-items: center;
              }
            }
            .search_table{
              flex: 1;
              width: 100%;
              display: flex;
              flex-direction: column;
              .search_add-nav{
                display: flex;
                height: 40px;
                align-items: center;
                justify-content: flex-end;
                padding: 0 10px;
                box-sizing: border-box;
                border-bottom: 1px solid #E5E8EB;
                .add-btn{
                  cursor: pointer;
                  .iconfont{
                    color: #1BBAE1;
                    font-size: 14px;
                    padding-right: 2px;
                  }
                  span{
                    font-size: 14px;
                    color: #1BBAE1;
                  }
                  .el-button.el-button--default{
                    border-color: transparent;
                  }
                }
                .gray{
                  cursor: default;
                  .iconfont{
                    color: #394263;
                    font-size: 14px;
                    padding-right: 2px;
                  }
                  span{
                    font-size: 14px;
                    color: #394263;
                  }
                }
              }
              .table_content{
                width: 100%;
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: center;
                .el-table{
                  padding: 0;
                  .el-table__body-wrapper{
                    height: 291px;
                    overflow-y: auto;
                    min-height:auto;
                  }
                }
              }
            }
          }
        }
        &:last-child{
          padding: 0 30px;
        }
      }
    }

  }

</style>
