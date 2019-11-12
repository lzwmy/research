<template>
  <div class="add_section_container">
    <div class="section_box">
      <div class="section_title">新建单页</div>
      <div class="section_header_box">
        <div class="section_header_content">
          <div class="section_termFilter">
            <div class="section_nameInput">
              <span>单页名称</span>
              <el-input placeholder="请输入名称" v-model="from.portionName" size="mini"></el-input>
            </div>
            <div class="section_displayNameInput">
              <span>显示名称</span>
              <el-input placeholder="请输入显示名称" v-model="from.displayName" size="mini"></el-input>
            </div>
            <div class="section_displayNameInput">
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
            </div>
          </div>
          <div class="section_containEntry">
            <div class="containEntry_name">包含的小节</div>
            <div class="entry_box">
              <draggable v-model="multipleSelection">
                <!--<div class="entry_box_item" v-for="(item,index) in multipleSelection" :key="index">
                  &lt;!&ndash;麻醉-术种&ndash;&gt;
                  {{item.portionName}}
                  <i class="del" @click="clickformDelete(item,index)">X</i>
                </div>-->
                <el-tag
                  v-for="(tag,index) in multipleSelection"
                  :key="tag.portionName"
                  closable
                  :disable-transitions="false"
                  @close="tagClose(tag,index)"
                  :type="tag.portionName">
                  {{tag.portionName}}
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
              <el-button @click="clickToJumpEntry">定义新小节</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="section_search">
        <span>选择小节</span>
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
            prop="portionName"
            label="名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="portionDisplayName"
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
          portionName:"",//小节名称
          formType:"",//显示名称
          isAvailable:"1",//是否可用
          available:"1",//可用
          isDisplayName:"1",//是否显示名称
          displayName:"", //显示名称
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
        this.$router.push({path:"/sectionPreview",query:{
            id:value.id,
            show:false
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
        console.log(this.objType)
        if(this.objType.obj.callback == 'reportList'){
          this.$emit("add-change",{type:'reportList',clickType:"reportList",obj:{callback:''}})
        }else{
          this.$emit("add-change",{type:'breakSinglePage',clickType:"return",obj:{callback:''}})
        }
      },
      //定义新小节
      clickToJumpEntry() {
        this.$emit("add-change",{type:'newPortion',clickType:'newPortion',obj:{callback:'breakSinglePage'}})
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
        this.multipleSelection = [];
        this.from.portionName = "";
        this.from.displayName = "";
        this.from.isDisplayName = "";
        this.from.isAvailable = "";
        this.from.available = "";
      },
      //最新 条目删除
      tagClose(tag) {
        this.multipleSelection.splice(this.multipleSelection.indexOf(tag), 1);
      },
      // 新增小节 保存
      clickSavePortion() {
        this.crfAddPortionSave()
        this.multipleSelection = [];
        this.from.portionName = "";
        this.from.displayName = "";
        this.from.isDisplayName = "";
        this.from.isAvailable = "";
        this.from.available = "";
      },
      //获取 小节列表
      async getFormItemList(pageNo = this.pageNo, pageSize = this.pageSize){
        this.loading =  true;
        let that = this;
        let formData = {
          "args": {
            "author": "",
            "portionName": that.searchName || "",
            "formType": 'formPage'
          },
          "limit": pageSize,
          "offset": pageNo-1
        };
        try{
          let data = await that.$http.crfGetPortionList(that.$format(formData));
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
          "displayIsVision": that.from.isDisplayName,
          "formPortionIds": that.multipleSelection.map(item=>{
            return item.id
          })||[],
          "id": "",
          "pageDisplayName": that.from.displayName,
          "pageIsAvailable": that.from.isAvailable,
          "pageName": that.from.portionName
        }
        try {
          let data = await that.$http.crfSingleSave(that.$format(formData))
          console.log("新建单页 保存" , data)
          if(data.code == 0) {
            that.$message({
              type:"success",
              message:data.msg
            })
            that.$emit("add-change",{type:'sectionList',clickType:"return",obj:{}})
          }
        }catch (error) {
          that.$notice("保存失败")
          console.log(error)
        }
      },
    },
    mounted() {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.getFormItemList();
    }
  }
</script>

<style lang="less" >
  .add_section_container{
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
            .section_displayNameInput{
              float: left;
              margin-left: 16px;
              .el-input{
                width: 70% !important;
                margin-left: 16px;
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
            .entry_box{
              float: left;
              width: 85%;
              margin-top: 1%;
              .entry_box_item{
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
