<template>
    <div class="portions_config_dialog_container">
      <el-dialog
        title="添加小节"
        :append-to-body="true"
        :visible.sync="dialogVisible"
        class="portions_config_dialog_box"
        @close="closeAddDialog"
        width="1200px">
        <div class="portion_config_content">
          <div class="search_term-box">
            <div class="search_term-left">
              <!--<el-select class="search_type-box" v-model="searchType">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="普通" :value="1"></el-option>
                <el-option label="随访" :value="2"></el-option>
              </el-select>-->
              <el-input class="search_item" v-model="searchName" maxlength="30" @keyup.enter.native="searchItem(searchName)" placeholder="请输入小节名称">
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
          <div class="portion_body_content-box">
            <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
              <el-tab-pane label="病种" name="first" class="subDisease_container">
                <div class="disease-content-box" v-loading="loading" v-if="diseaseList.length!==0">
                  <div class="report_box">
                    <div class="display_detail_info-item-box"  v-for="(item,index) in filterData(diseaseList)" :key="index" @click.stop="diseaseActive(item,index)">
                      <div class="detail_info" :class="{'active':index===diseaseIdIndex}" >
                        <i class="tab" :class="{'active':index===diseaseIdIndex}"></i>
                        <span>{{item.diseaseName}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="portion_box">
                    <div class="display_detail_info-item-box" v-if="item.diseaseId == diseaseId"  v-for="(item,index) in diseaseList" :key="index" @click.stop="dropActive(item)">
                      <div class="detail_info" :class="{'active':item.portionId==dropPortionId}" >
                        <i class="tab" :class="{'active':item.portionId==dropPortionId}"></i>
                        <span v-if="item.diseaseId == diseaseId">{{item.portionName}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="preview_box">
                    <div class="preview_header">
                      <div class="header-title">{{dropPortionName}}</div>
                      <div class="header-btn" v-if="dropPortionName!==''" @click="previewAdd">
                        <i class="iconfont iconquerentianjia"></i>
                        <span>确认添加</span>
                      </div>
                      <div class="header-btn gray" v-else>
                        <i class="iconfont iconquerentianjia"></i>
                        <span>确认添加</span>
                      </div>
                    </div>
                    <div class="preview_content" v-loading="portionLoading">
                      <preview-portion v-if="JSON.stringify(diseasePreview)!=='{}'" :item="diseasePreview"></preview-portion>
                    </div>
                  </div>
                </div>
                <div class="disease-content-box blank_page" v-loading="loading" v-else>
                  <img class="tipInfo" src="./../basisComponents/image/none_content.png" alt="">
                </div>
              </el-tab-pane>
              <el-tab-pane label="小节" class="portions_container" name="second">
                <div class="portion_tab-container" v-loading="loading" v-if="portionList.length!==0">
                  <div class="portion_display-item">
                    <div class="display_detail_info-item-box" v-if="portionList.length!==0" v-for="(item,index) in portionList" :key="index" @click.stop="portionActive(item,index)">
                      <div class="detail_info" :class="{'active':item.portionId==portionId}" >
                        <i class="tab" :class="{'active':item.portionId==portionId}"></i>
                        <span :title="item.portionName">{{item.portionName}}</span>
                      </div>
                    </div>
                    <img v-if="portionList.length==0" src="./../basisComponents/image/none_content.png" alt="">
                  </div>
                  <div class="portion_add-box">
                    <div class="portion_add-header">
                      <div class="title_box">{{portionName}}</div>
                      <!--<div class="header_btn" v-if="multipleSelection.length!==0" @click="selectionAdd">-->
                      <div class="header_btn" v-if="portionId!==''" @click="previewAdd">
                        <i class="iconfont iconquerentianjia"></i>
                        <span>确认添加</span>
                      </div>
                      <div class="header_btn gray" v-else>
                        <i class="iconfont iconquerentianjia"></i>
                        <span>确认添加</span>
                      </div>
                    </div>
                    <div class="portion_table-content" v-loading="portionLoading">
                      <!--<el-table v-show="tableList.length!==0"
                                ref="multipleTable"
                                :data="tableList.formItemList"
                                tooltip-effect="dark"
                                v-loading="tableLoading"
                                @selection-change="handleSelectionChange"
                                style="width: 900px;height: 386px;">
                        <el-table-column
                          type="selection"
                          width="55">
                        </el-table-column>
                        <el-table-column  label="字段名" min-width="5%" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <div :id="scope.row.id">{{scope.row.controlDisplayName}}</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="controlType" label="表单类型" min-width="5%" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span v-if="scope.row.controlType == 'SINGLE_INPUT'">单行输入框</span>
                            <span v-if="scope.row.controlType == 'MULTI_INPUT'">多行输入框</span>
                            <span v-if="scope.row.controlType == 'SINGLE_COMBOX'">下拉单选</span>
                            <span v-if="scope.row.controlType == 'MULTI_COMBOX'">下拉复选</span>
                            <span v-if="scope.row.controlType == 'RADIO_BUTTON'">单选框</span>
                            <span v-if="scope.row.controlType == 'CHECKBOX'">复选框</span>
                            <span v-if="scope.row.controlType == 'DATE'">日期</span>
                            <span v-if="scope.row.controlType == 'DATE_TIME'">时间</span>
                            <span v-if="scope.row.controlType == 'DATE_TIME'">日期时间</span>
                            <span v-if="scope.row.controlType == 'LABEL'">标签</span>
                            <span v-if="scope.row.controlType == 'NUMBER_INPUT'">数值</span>
                            <span v-if="scope.row.controlType == 'GATHER'">集合</span>
                            <span v-if="scope.row.controlType == 'TABLE'">表格</span>
                            <span v-if="scope.row.controlType == 'FILE_UPLOAD'">文件上传</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="rangeText" label="值域" min-width="5%" show-overflow-tooltip></el-table-column>
                      </el-table>-->
                      <preview-portion v-if="JSON.stringify(diseasePreview)!=='{}'" :item="diseasePreview"></preview-portion>
                      <img v-show="tableList.length==0" src="./../basisComponents/image/none_content.png" alt="">
                    </div>
                  </div>
                </div>
                <div class="portion_tab-container blank_page" v-loading="loading" v-else>
                  <img class="tipInfo" src="./../basisComponents/image/none_content.png" alt="">
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-dialog>
      <portion-dialog :showConfigPortion="showConfigPortion"
                      :portionConfigData="portionConfigData"
                      @portionCallback-add="portionCallbackAdd"
                      @close-dialog="closeDialog"></portion-dialog>
    </div>
</template>

<script>
  import previewPortion from './../preview/sectionPreview';
  import portionDialog from './portionDialog';
    export default {
      name: "portionConfigDialog",
      components:{
        previewPortion,
        portionDialog
      },
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
            this.init()
          }
        }
      },
      data() {
        return {
          dialogVisible:false,
          tableLoading:false,
          showConfigPortion:false,
          loading:false,
          portionLoading:false,
          searchType:0,// 搜索类型
          searchName:"",// 搜索名称
          tabName:"first",//切换名称
          diseaseList:[],
          portionList:[],
          portionId:"",//小节 切换ID
          tableList:[],
          multipleSelection:[],//表格多选
          diseaseId:"",//病种 id
          diseaseIdIndex:'',//病种 选中 根据下标
          dropPortionId:"",// 病种二级切换
          dropPortionName:"",// 病种二级名称
          portionName:"",//小节名称
          preview:{},
          diseasePreview:{},
          portionConfigData:{}
        }
      },
      methods:{
        //初始化
        init() {
          this.searchName = "";
          this.tabName = 'first';
          this.diseaseIdIndex = "";
          this.dropPortionId ="";
          this.dropPortionName = "";
          this.portionName = "";
          this.portionId = "";
          this.multipleSelection = [];
          this.tableList = [];
          this.diseaseList = [];
          this.portionList = [];
          this.preview = {};
          this.diseasePreview = {};
          /*this.$nextTick(()=>{
            this.$refs.multipleTable.clearSelection();
          })*/
          this.searchItem();
        },
        //关闭 弹框
        closeAddDialog() {
          this.dialogVisible = false;
          this.$emit('close-dialog',false)
        },
        //搜索
        searchItem(value) {
          this.loading = true;
          this.CRFSearchPortion().then(()=>{
            this.loading = false;
          });
        },
        handleClick() {
          this.diseasePreview = {};
          this.portionId= "";
          this.dropPortionId = "";
          this.portionName = "";
          this.dropPortionName = "";
        },
        //直接添加
        addDirect() {
          // this.$parent.directAddSave();
          /*let diseaseId = this.$route.query.id;
          this.$router.push({
            path:"/basisConfig",
            query:{
              id:diseaseId,
              type:'add',
              portionName:this.searchName || '0',
            }
          })*/
          // this.CRFQueryPortionId();
          this.portionConfigData = {
            diseaseId:this.$route.query.id,
            formItemList:[],
            id:"",
            portionName:this.searchName,
            type:"add",
            index:0
          };
          this.showConfigPortion = true;
        },
        // 预览 确定添加
        previewAdd() {
          this.dialogVisible = false;
          let copyPortionData = Object.assign({},JSON.parse(JSON.stringify(this.diseasePreview)));
          this.$emit('portion-selection-add',copyPortionData);
          this.init()
        },
        // 小节 -- 选择项事件
        portionActive(data) {
          this.portionId = data.portionId;
          this.portionName = data.portionName;
          // this.$refs.multipleTable.clearSelection();
          this.multipleSelection = [];
          this.diseasePreview = {};
          this.portionLoading = true;
          this.CRFPreviewTableInfo(data.portionId).then(()=>{
            this.portionLoading = false;
          })
        },
        // 小节添加
        selectionAdd() {
          this.dialogVisible = false;
          let copyPortionData = Object.assign({},JSON.parse(JSON.stringify(this.preview)));
          copyPortionData.formItemList = this.multipleSelection;
          this.$emit('portion-selection-add',copyPortionData);
          this.init();
        },
        //表格多选
        handleSelectionChange(value) {
          this.multipleSelection = value;
        },
        //病种 切换 id
        diseaseActive(data,value) {
          this.dropPortionId = "";
          this.diseaseId = data.diseaseId;
          this.diseaseIdIndex = value;
        },
        // 病种 二级 切换
        dropActive(data) {
          console.log(data);
          this.dropPortionId = data.portionId;
          this.dropPortionName = data.portionName;
          this.diseasePreview = {};
          this.portionLoading = true;
          this.CRFPreviewTableInfo(data.portionId).then(()=>{
            this.portionLoading = false;
          })
        },
        filterData(data) {
          var arr = [];
          for(var i = 0; i < data.length; i++){
            if(i == 0){
              arr.push(data[i]);
            }
            var b = false;
            if(arr.length > 0 && i > 0){
              for(var j = 0; j < arr.length; j++){
                if(arr[j].diseaseId == data[i].diseaseId){
                  b = true;
                  //break;
                }
              }
              if(!b){ arr.push(data[i]);}
            }
          }
          return arr;
        },
        //表单返回
        closeDialog(data) {
          this.dialogVisible = false;
          this.showConfigPortion = false;
          this.$emit('close-dialog',false)
        },
        //小节回调 添加
        portionCallbackAdd(data) {
          console.log('添加回调',data)
          this.$emit('update-add',data);
        },
        // 表格 数据
        async  CRFPreviewTableInfo(value) {
          let that = this;
          let formData = {
            formPortionId:value
          };
          try{
            let data = await that.$http.CRFPreviewPortion(formData);
            console.log(data)
            if(data.code == 0) {
              // that.tableList = data.data.formItemList;
              if(that.tabName=='second'){
                that.tableList = data.data;
              }
              that.preview = {
                id:data.data.id,
                portionName:data.data.portionName,
                diseaseId:data.data.diseaseId,
                formItemList:data.data.formItemList
              };
              that.diseasePreview={
                id:data.data.id,
                portionName:data.data.portionName,
                diseaseId:data.data.diseaseId,
                formItemList:data.data.formItemList
              }
            }
          }catch (error) {
            console.log(error)
          }
        },
        //关键字 查询
        async CRFSearchPortion() {
          let that = this;
          let formData = {
            "keyword": this.searchName
          };
          try{
            let data = await that.$http.CRFPortionBakSearch(formData);
            if(data.code == 0) {
              that.portionList = data.data;
              that.diseaseList = data.data;
              that.preview = {};
              that.diseasePreview = {};
            }
          }catch (error) {
            console.log(error)
          }
        },
        async CRFQueryPortionId() {
          let that = this;
          try{
            let data = await that.$http.CRFQueryPortionId();
            if(data.code == 0) {
              console.log(data);
              that.portionConfigData = {
                diseaseId:that.$route.query.id,
                formItemList:[],
                id:data.data,
                portionName:that.searchName,
                type:"add",
                index:0
              };
              this.showConfigPortion = true;
            }
          }catch (error) {
            console.log(error)
          }
        }
      },
      mounted() {
      }
    }
</script>

<style lang="less">
.portions_config_dialog_box{
  .el-dialog{
    min-height: 554px;
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
      &:last-child{
        padding: 15px 35px 40px 35px;
      }
      .portion_config_content{
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
              width: 1008px;
              .el-input__inner{
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
              }
              .el-input__suffix{
                cursor: pointer;
                .el-input__icon{
                  font-size: 18px;
                  line-height: 40px;
                }
              }
            }
            .el-input__inner{
              height: 42px;
            }
          }
          .search_term-right{
            .el-button{
              height: 40px;
              .iconfont{
                font-size: 14px;
              }
              span{
                font-size: 14px;
              }
              &:hover{
                background-color: #14aed4;
              }
            }
          }
        }
        .portion_body_content-box{
          margin-top: 30px;
          .el-tabs--card>.el-tabs__header{
            border-bottom: 1px solid transparent;
          }
          .el-tabs__header{
             margin: 0;
          }
          .el-tabs__nav{
            background-color: #E5EBEC;
          }
          .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
            border-bottom-color: transparent;
            /*background-color: #E5EBEC;*/
            /*color: #394263;*/
            background-color: #ffffff;
          }
          .portions_container{
            display: flex;
            width: 100%;
            box-sizing: border-box;
            .portion_tab-container{
              display: flex;
              flex-direction: row;
              width: 100%;
              height: 426px;
              box-sizing: border-box;
              overflow: auto;
              border:1px solid #E5EBEC;
              .portion_display-item{
                width: 240px;
                height: 100%;
                border-right:1px solid #E5EBEC;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: auto;
                img{
                  width: 100px;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%,-50%);
                }
                .display_detail_info-item-box{
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                
                  min-height: 40px;
                  .detail_info{
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    .tab{
                      width: 3px;
                      height: 100%;
                    }
                    .active{
                      background-color: #04B8DD;
                    }
                    span{
                      font-size: 14px;
                      font-family:MicrosoftYaHei;
                      color: #394263;
                      padding: 0 15px;
                      display: inline-block;
                      width: 100%;
                      align-items: center;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                  }
                  .active{
                    background-color: #F5F7FA;
                  }
                  :hover{
                    background-color: #F5F7FA;
                    .tab{
                      background-color: #04B8DD;
                    }
                  }
                }
              }
              .portion_add-box{
                flex: 1;
                display: flex;
                flex-direction: column;
                width: 900px;
                /*overflow: auto;*/
                .portion_add-header{
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  height: 40px;
                  align-items:center;
                  justify-content: space-between;
                  box-sizing: border-box;
                  border-bottom: 1px solid #E5E8EB;
                  padding: 0 20px;
                  .title_box{
                    color: #394263;
                    font-size: 14px;
                    font-family:'MicrosoftYaHei';
                    font-weight: bold;
                  }
                  .header_btn{
                    /*font-size: 14px;*/
                    color: #1BBAE1;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 2px;
                    .iconfont{
                      font-size:14px;
                      padding-right: 2px;
                    }
                    &:hover{
                      padding: 5px;
                      background-color: #F5F7FA;
                    }
                  }
                  .gray{
                    color: #394263;
                    cursor: default;
                  }
                }
                .portion_table-content{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  /*justify-content: center;*/
                  /*align-items: center;*/
                  overflow: auto;
                  position: relative;
                  .displayPortion_title{
                    display: none;
                  }
                  .el-table{
                    padding: 0;
                    .el-table__body-wrapper{
                      height: 338px;
                      overflow-y: auto;
                      min-height:auto;
                    }
                  }
                  img{
                    height: 120px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                  }
                }
              }
            }
            .blank_page{
              width: 100%;
              height: 426px;
              display: flex;
              justify-content: center;
              align-items: center;
              .tipInfo{
                height: 150px;
              }
            }
          }
          .subDisease_container{
            display: flex;
            width: 100%;
            box-sizing: border-box;
            .disease-content-box{
              width: 100%;
              height: 426px;
              display: flex;
              flex-direction: row;
              box-sizing: border-box;
              border: 1px solid #E5EBEC;
              .report_box{
                width: 138px;
                height: 100%;
                border-right: 1px solid #E5EBEC;
                box-sizing: border-box;
                overflow: auto;
                .display_detail_info-item-box{
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  min-height: 40px;
                  align-items: center;
                  .detail_info{
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    min-height: 40px;
                    .tab{
                      width: 3px;
                      height: 100%;
                    }
                    .active{
                      background-color: #04B8DD;
                    }
                    span{
                      font-size: 14px;
                      font-family:MicrosoftYaHei;
                      color: #394263;
                      padding-left: 15px;
                    }
                  }
                  .active{
                    background-color: #F5F7FA;
                  }
                  :hover{
                    background-color: #F5F7FA;
                    .tab{
                      background-color: #04B8DD;
                    }
                  }
                }
              }
              .portion_box{
                width: 140px;
                height: 100%;
                border-right: 1px solid #E5EBEC;
                box-sizing: border-box;
                overflow: auto;
                .display_detail_info-item-box{
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  min-height: 40px;
                  align-items: center;
                  .detail_info{
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    min-height: 40px;
                    .tab{
                      width: 3px;
                      height: 100%;
                    }
                    .active{
                      background-color: #04B8DD;
                    }
                    span{
                      font-size: 14px;
                      font-family:MicrosoftYaHei;
                      color: #394263;
                      padding-left: 15px;
                    }
                  }
                  .active{
                    background-color: #F5F7FA;
                  }
                  :hover{
                    background-color: #F5F7FA;
                    .tab{
                      background-color: #04B8DD;
                    }
                  }
                }
              }
              .preview_box{
                flex: 1;
                display: flex;
                flex-direction: column;
                .preview_header{
                  display: flex;
                  width: 100%;
                  height: 40px;
                  align-items: center;
                  justify-content: space-between;
                  padding: 0 20px;
                  border-bottom:1px solid #E5EBEC;
                  box-sizing: border-box;
                  font-size: 14px;
                  .header-title{
                    font-family:MicrosoftYaHei;
                    font-weight:bold;
                    color:rgba(57,66,99,1);
                  }
                  .header-btn{
                    color: #1BBAE1;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 2px;
                    span{
                      padding-left: 2px;
                    }
                    &:hover{
                      padding: 5px;
                      background-color: #F5F7FA;
                    }
                  }
                  .gray{
                    color: #394263;
                    cursor: default;
                  }
                }
                .preview_content{
                  min-width: 850px;
                  width: 850px;
                  height: 384px;
                  overflow: auto;
                  .displayPortion_title{
                    display: none;
                  }
                }
              }
            }
            .blank_page{
              width: 100%;
              height: 426px;
              display: flex;
              justify-content: center;
              align-items: center;
              .tipInfo{
                height: 150px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
