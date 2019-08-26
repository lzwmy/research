<template>
  <div class="add_report_container">
    <div class="section_box">
      <div class="section_title">新建报告</div>
      <div class="section_header_box">
        <div class="section_header_content">
          <div class="section_termFilter">
            <div class="section_nameInput">
              <span>报告名称</span>
              <el-input placeholder="请输入报告名称"  v-model="from.portionName" size="mini"></el-input>
            </div>
            <div class="section_nameInput">
              <span>显示名称</span>
              <el-input placeholder="请输入显示名称" v-model="from.displayName" size="mini"></el-input>
            </div>
            <div class="report_displayNameInput">
              <span>报告类型</span>
              <el-select size="mini" v-model="from.access">
                <el-option value="1" label="普通"></el-option>
                <el-option value="2" label="随访"></el-option>
              </el-select>
            </div>
            <div class="report_displayNameInput" v-if="false">
              <span>医学分类</span>
              <!--<el-select  multiple size="mini" v-model="from.MedicalClassification">
                <el-option
                  v-for="item in categoryNameList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-select v-model="from.MedicalClassification" collapse-tags multiple size="mini">
                <el-option
                  v-for="item in categoryNameList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="report_displayNameInput">
              <span>所属病种</span>
              <!--<el-select  multiple size="mini" v-model="from.MedicalClassification">
                <el-option
                  v-for="item in categoryNameList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-select v-model="from.diseases" collapse-tags multiple size="mini">
                <el-option
                  v-for="item in diseaseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <!--<div class="section_displayNameInput">
              <span>是否显示名称：</span>
              <el-radio-group v-model="from.isDisplayName">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>

            </div>
            <div class="section_displayNameInput">
              <span>是否可用：</span>
              <el-radio-group v-model="from.isAvailable">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </div>
            <div class="section_displayNameInput">
              <span>可用：</span>
              <el-radio-group v-model="from.available">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </div>-->
          </div>
          <div class="section_containEntry">
            <div class="containEntry_name_report">报告描述</div>
            <div class="report_box">
              <el-input size="mini" v-model="from.description" placeholder="请输入报告描述"  ></el-input>
            </div>
          </div>
          <div class="report_radio">
            <!--<div class="section_displayNameInput">
              <span>是否显示名称：</span>
              <el-radio-group v-model="from.isDisplayName">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </div>-->
            <!--<div class="section_displayNameInput">
              <span>是否可用：</span>
              <el-radio-group v-model="from.isAvailable">
                <el-radio label="1">已完成</el-radio>
                <el-radio label="0">未完成</el-radio>
              </el-radio-group>
            </div>-->
            <div class="section_displayNameInput_report">
              <span>是否可用：</span>
              <el-radio-group v-model="from.available">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="section_containEntry">
            <div class="containEntry_name">包含的单页</div>
            <div class="entry_box">
              <draggable v-model="multipleSelection">
                <!--<div class="entry_box_item_report" v-for="(item,index) in multipleSelection" :key="index">
                  &lt;!&ndash;麻醉-术种&ndash;&gt;
                  {{item.pageName}}
                  <i class="del" @click="clickformDelete(item,index)">X</i>
                </div>-->
                <el-tag
                  v-for="(tag,index) in multipleSelection"
                  :key="tag.pageName"
                  closable
                  :disable-transitions="false"
                  @close="tagClose(tag,index)"
                  :type="tag.pageName">
                  {{tag.pageName}}
                </el-tag>
              </draggable>
            </div>
          </div>
          <div class="section_selectBtn">
            <div class="section_header_btn">
              <el-button type="primary" @click="clickSavePortion">保存</el-button>
              <!--<el-button>保存为副本</el-button>-->
              <el-button @click="clickPortionDel">删除</el-button>
              <el-button @click="returnPortionList">返回</el-button>
              <el-button @click="clickToJumpEntry">定义新单页</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="section_search">
        <span>选择单页</span>
        <el-input v-model="searchName" size="mini" @keyup.enter.native="enterSearch" placeholder="支持回车搜索"></el-input>
        <el-button type="primary" @click="enterSearch">搜索</el-button>
      </div>
      <div class="section_body_box">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :row-key="checkBoxTable"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange">
          <!--<el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>-->
          <el-table-column
            prop="pageName"
            label="名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="pageDisplayName"
            label="显示名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="author"
            label="作者"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="reference"
            label="引用"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont iconfuhao2" @click="previewPage(scope.row)" title="预览"></i>
              <!-- <i class="iconfont iconbianji" @click="modifyData(scope.row)" title="编辑"></i>
               <i class="iconfont iconshanchu del" @click="singleDelData(scope.row.id)" title="删除"></i>-->
              <i class="iconfont iconfuhao1" title="添加" @click="clickAddEntry(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer_btn">
          <!--<el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="pageSize"
            layout="total,  prev, pager, next, jumper"
            :total="total">
          </el-pagination>-->
          <pagination :data="paginationData" @change="getFormItemList"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';
  export default {
    name: "addSection",
    props:{
      objType:{
        type:Object,
        default:null
      }
    },
    components:{
      draggable,
      pagination
    },
    data(){
      return {
        loading:false,//加载
        from:{
          portionName:"",//报告
          formType:"",//显示名称
          isAvailable:"1",//是否可用
          available:"1",//可用
          isDisplayName:"1",//是否显示名称
          displayName:"", //展示名称
          access:"",//显示名称,
          MedicalClassification:"",//医学分类
          diseases:[],//所属病种
          description:"",//报告描述
        },
        IsWhether:"",
        tableData:[],//表格数据
        multipleSelection: [],
        //分页参数
        /*currentPage:1,
        pageSize:10,
        total:20,*/
        delList:[],//批量删除数组
        pageSelectList:[],//分页存储临时条目数据
        categoryNameList:[],//医学分类
        diseaseList:[],//病种列表
        searchName:"",
        paginationData:{},
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        elementLoadingText: ''
      }
    },
    watch:{
      multipleSelection:function(value) {
        console.log("监控 条目数据",value)
      },
      tableData:function (value) {
        console.log("表格监控 数据",value);
        if(this.pageSelectList.length>0){
          for(var i=0;i<this.tableData.length;i++) {
            for(var j=0;j<this.multipleSelection.length;j++) {
              if(this.tableData[i].id==this.multipleSelection[j].id) {
                console.log("找到相同的id" ,this.multipleSelection[j])
                this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true)
              }
            }
          }
        }
      }
    },
    methods:{
      //表格多选事件
      handleSelectionChange(value){
        console.log("多选",value);
        if(value.length==0) {
          this.multipleSelection[0].controlName=="";
          this.multipleSelection.splice(0,1)
          this.$refs.multipleTable.clearSelection()
          return
        }
        if(this.pageSelectList.length==0){
          this.multipleSelection = value;
        }else{
          this.multipleSelection = value;
          this.multipleSelection.unshift(...this.pageSelectList);
        }
        //json 去重
        let onlyJsonData =  this.uniqueArray(this.multipleSelection,'id');
        this.multipleSelection = onlyJsonData
      },
      //json 数组去重
      uniqueArray(array,key) {
        var result = [array[0]];
        for(var i = 1; i < array.length; i++){
          var item = array[i];
          var repeat = false;
          for (var j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            result.push(item);
          }
        }
        return result;
      },
      checkBoxTable(value) {
        return value.id
      },
      //表格预览
      previewPage(value){
        console.log("表格预览",value);
        this.$router.push({path:"/singlePreview",query:{
            id:value.id,
            show:'section'
          }})
      },
      //分页事件
      handleSizeChange(value) {
        console.log("每页",value)
      },
      handleCurrentChange(value) {
        console.log("当前页",value)
        //分页 临时存储 条目数据
        this.multipleSelection.forEach(item=>{
          if(this.pageSelectList.length>=0) {
            this.pageSelectList.push(item)
          }
        })
        this.currentPage = value;
        this.getFormItemList();
      },
      //返回
      returnPortionList(){
        this.$emit("add-change",{type:'reportList',clickType:"return",obj:{callback:''}})
      },
      //定义新小节
      clickToJumpEntry() {
        this.$emit("add-change",{type:'addSinglePage',clickType:'addReport',obj:{callback:"reportList"}})
      },
      enterSearch() {
        this.getFormItemList();
      },
      //包含条目删除
      clickformDelete(obj,index) {
        this.multipleSelection.splice(index,1)
      },
      //表格添加
      clickAddEntry(value) {
        console.log(value)
        if(this.multipleSelection.length>=0){
          let Array = this.multipleSelection.map(item=>{
            return item.id
          })
          if(Array.indexOf(value.id)>=0){
            this.$message({
              type:"info",
              message:"不能添加重复的数据"
            })
          }else {
            this.multipleSelection.push(value)
          }
        }
      },
      //删除
      clickPortionDel() {
        this.from.MedicalClassification = "";
        this.from.diseases=[];
        this.multipleSelection = [];
        this.from.portionName = "";
        this.from.displayName = "";
        this.from.isDisplayName = "";
        this.from.isAvailable = "";
        this.from.available = "";
        this.from.description = "";
        this.from.access = "";
      },
      //最新 条目删除
      tagClose(tag) {
        this.multipleSelection.splice(this.multipleSelection.indexOf(tag), 1);
      },
      // 新增报告 保存
      clickSavePortion() {
        this.crfAddPortionSave();
        this.from.MedicalClassification = "";
        this.from.diseases=[];
        this.multipleSelection = [];
        this.from.portionName = "";
        this.from.displayName = "";
        this.from.isDisplayName = "";
        this.from.isAvailable = "";
        this.from.available = "";
        this.from.description = "";
        this.from.access = "";
      },
      //获取 单页列表
      async getFormItemList(pageNo = this.pageNo, pageSize = this.pageSize){
        this.loading =  true;
        let that = this;
        let formData = {
          "args": {
            "author": "",
            "pageName": that.searchName ||"",
            "formType": 'formCrf'
          },
          "limit": pageSize,
          "offset": pageNo-1
        };
        try{
          let data = await that.$http.crfSinglePageList(that.$format(formData));
          console.log("小节列表数据",data)
          if(data.code===0){
            let obj = {};
            that.tableData = data.data.args;
            that.total = data.data.totalElements;
            obj.content = data.data.args;
            obj.content.forEach((item, index) => {
              item.index = (pageNo - 1) * pageSize + index + 1;
            });
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.totalElements);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.paginationData = obj;
          }
        }catch (error) {
          that.$notice('获取小节列表失败');
          console.log(error);
          this.loading = false
        }
        this.loading = false
      },
      //新增小节 保存
      async crfAddPortionSave() {
        let that = this;
        let formData = {
          "crfDesc": that.from.description || "",
          "crfDisplayName": that.from.displayName || "",
          // "crfIsAvailable": parseInt(that.from.isAvailable),
          "crfIsAvailable": parseInt(that.from.available),
          "crfName": that.from.portionName || "",
          "crfType": parseInt(that.from.access),
          "formPageIds": that.multipleSelection.map(item=>{
            return item.id
          }) || [],
          "id": "",
          "termCategoryNames": that.from.MedicalClassification ||[],
          "diseaseIds":that.from.diseases
        }
        try {
          let data = await that.$http.crfReportSave(formData)
          console.log("新建单页 保存" , data)
          if(data.code == 0) {
            that.$message({
              type:"success",
              message:data.msg
            })
            that.$emit("add-change",{type:'reportList',clickType:"reportList",obj:{}})
          }
        }catch (error) {
          that.$notice("保存失败")
          console.log(error)
        }
      },
      //获取 医学分类
      async getCategory() {
        let that = this;
        try {
          let data = await that.$http.crfCategoryList()
          console.log("医学代码分类",data)
          if(data.code == 0){
            let array = [];
            for(var item in data.data){
              array.push({
                name:item,
                value:data.data[item]
              })
            }
            that.categoryNameList = array;
          }
        }catch (error) {
          that.$notice("医学分类获取失败")
          console.log(error)
        }
      },
      // 查所有单病种
    async findDisease () {
      let that = this;
      try {
        let data = await that.$http.statisticsFindDiseaseList();
        if (data.code == '0') {
          that.diseaseList = data.data.list;
        }
      } catch (error) {
        that.diseaseList = [];
        that.$notice('单病种查询失败');
        console.log(error);
      }
    }
    },
    mounted() {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.getFormItemList();
      this.getCategory();
      this.findDisease();
    }
  }
</script>


<style lang="less">
  .add_report_container{
    width: 100%;
    .section_box{
      width:100%;
      border-top:2px solid #2D8CF0 ;
      border-left: 1px solid #DEE2E5;
      border-right: 1px solid #DEE2E5;
      border-bottom: 1px solid #DEE2E5;
      .section_title{
        height:44px;
        font-size:16px;
        line-height:44px;
        color:#444444;
        font-family: Microsoft YaHei;
        background-color: #EEEEEE;
        padding:0 20px;
      }
      .section_header_box{
        width: 100%;
        padding:20px;
        .section_header_content{
          width: 100%;
          min-height:188px;
          border: 1px solid #DEE2E5;
          float: left;
          .section_termFilter{
            width: 100%;
            height:62px;
            line-height:62px;
            float: left;
            .section_nameInput{
              float: left;
              padding-left: 20px;
              .el-input{
                width: 70% !important;
                margin-left: 3%;
              }
            }
            .report_displayNameInput{
              float: left;
              margin-left: 16px;
              .el-select{
                margin-left: 16px;
              }
              .el-input{
                .el-input__inner{
                  height: 30px !important;
                }
              }
              .el-radio{
                margin-right: 0 !important;
              }
            }
          }
          .section_containEntry{
            width: 100%;
            min-height:62px;
            line-height:62px;
            float: left;
            margin-left: 20px;
            .containEntry_name{
              min-width: 5%;
              float: left;
            }
            .containEntry_name_report{
              min-width: 3.6%;
              float: left;
            }
            .report_box{
              float: left;
              width: 24%;
            }
            .entry_box{
              float: left;
              width: 85%;
              margin-top: 1%;
              .entry_box_item_report{
                float: left;
                min-width: 7%;
                height: 28px;
                line-height:28px;
                background-color: #ECF5FF;
                border:1px solid #A5C8FF;
                font-size: 12px;
                color:#3C81F0;
                cursor:pointer;
                padding-left: 1%;
                margin-right:5px;
                margin-bottom: 5px;
                .del{
                  float: right;
                  margin-right: 5%;
                  display:inline-block;
                  width: 14px;
                  height: 14px;
                  line-height: 14px;
                  text-align: center;
                  border-radius: 7px;
                  position:relative;
                  top: 20%;
                  &:hover{
                    background-color:#3C81F0;
                    color:#ffffff;
                  }
                }

              }

            }
          }
          .section_selectBtn{
            width: 100%;
            height:62px;
            line-height:62px;
            float: left;
            .section_radioInput{
              float: left;
              padding-left: 20px;
            }
            .section_header_btn{
              float: right;
              padding-right: 13px;
              padding-bottom: 13px;
            }
          }
        }
      }
      .report_radio{
        width: 100%;
        float: left;
        height: 62px;
        line-height: 62px;
        .section_displayNameInput{
          float: left;
          margin-left: 18px;
          .el-radio{
            margin-right: 0 !important;
          }
        }
        .section_displayNameInput_report{
          float: left;
          margin-left: 1.4%;
          .el-radio{
            margin-right: 0 !important;
          }
        }
      }
      .section_header_box:after{
        content: "";
        display: block;
        clear: both;
      }
      .section_body_box{
        width: 100%;
        padding:20px;
        .el-table__header-wrapper{
          border-top: 1px solid #DEE2E5;
        }
        .footer_btn{
          margin-top: 12px;
          text-align:right;
        }
        .iconfont{
          color: #3B81F0;
          font-size: 18px;
          margin: 0 5px;
          cursor: pointer;
        }
      }
    }
  }
</style>
