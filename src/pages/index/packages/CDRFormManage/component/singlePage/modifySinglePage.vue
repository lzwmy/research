<template>
  <div class="section_container">
    <div class="section_box">
      <div class="section_title">编辑单页</div>
      <div class="section_header_box">
        <div class="section_header_content">
          <div class="section_termFilter">
            <div class="section_nameInput">
              <span>单页名称</span>
              <el-input placeholder="请输入名称" v-model="from.portionName" :disabled="true" size="mini"></el-input>
            </div>
            <div class="section_displayNameInput">
              <span>显示名称</span>
              <el-input placeholder="请输入显示名称" v-model="from.displayPortionName" size="mini"></el-input>
            </div>
            <div class="section_displayNameInput">
              <span>是否显示名称</span>
              <el-radio-group v-model="from.formType">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="section_containEntry">
            <div class="containEntry_name">包含的小节</div>

            <div class="entry_box" >
              <!--可以拖拽-->
              <draggable v-model="multipleSelection" >
                <!--<div class="entry_box_item" v-for="(item,index) in multipleSelection" :key="index">
                  &lt;!&ndash;麻醉-术种&ndash;&gt;
                  {{item.formPortionName}}
                  <i class="del" @click="clickformDelete(item,index)">X</i>
                </div>-->
                <el-tag
                  v-for="(tag,index) in multipleSelection"
                  :key="tag.formPortionName"
                  closable
                  :disable-transitions="false"
                  @close="tagClose(tag,index)"
                  :type="tag.formPortionName">
                  {{tag.formPortionName}}
                </el-tag>
              </draggable>
            </div>
          </div>
          <div class="section_selectBtn">
            <div class="section_radioInput">
              <span>是否可用：</span>
              <el-radio-group v-model="IsWhether">
                <el-radio label="1" >是</el-radio>
                <el-radio label="0" >否</el-radio>
              </el-radio-group>
            </div>
            <div class="section_header_btn">
              <el-button type="primary" @click="clickEditSave">保存</el-button>
              <el-button @click="clickSaveDuplicate">保存为副本</el-button>
              <el-button @click="clickProtion">删除</el-button>
              <el-button @click="returnPortion">返回</el-button>
              <el-button @click="toJumpNewEntry">定义新小节</el-button>
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
              <!--<i class="iconfont iconbianji" @click="modifyData(scope.row)" title="编辑"></i>
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
    data() {
      return {
        loading:false,//表格加载
        IsWhether:"",//是否可用
        tableData:[],//表格数据
        from:{
          portionName:"",
          formType:"",
          author:"",
          displayPortionName:"",
        },
        formItemSimpleRspList:[],//包含条目参数 临时存放
        //分页参数
        /*currentPage:1,
        pageSize:10,
        total:20,*/
        delList:[],//批量删除数组
        multipleSelection:[],//表格多选存放数据
        multipleSelectionS:[],//表格临时数据存放
        pageSelectList:[],//分页临时存放数据
        id:"",
        searchName:"",
        paginationData:{},
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        elementLoadingText: '',

      }
    },
    watch:{
      /*multipleSelection:function(value){
        console.log("监听 表格多选单选",value)
        for(var i=0;i<this.tableData.length;i++){
          for(var j=0;j<value.length;j++){
            if(this.tableData[i].id==value[j].id) {
              this.$refs.multipleTable.toggleRowSelection(value[j],true)
              this.onlyJson();
            }
          }
        }
        /!*if(value.length>0){
         let data = value.map(item=>{
            return {
              id:item.id,
              formItemName:item.controlName
            }
         })
          console.log(data)
          this.formItemSimpleRspList.push(...data)
        }*!/
      },*/
      tableData:function(value) {
        console.log("表格监控" ,value)
        console.log("监控 包含条目数据",this.multipleSelection)
        /*if(this.multipleSelection.length>0){
          for(var i=0;i<this.tableData.length;i++){
            for(var j=0;j<this.multipleSelection.length;j++){
              if(this.tableData[i].id==this.multipleSelection[j].id) {
                this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[j],true)
              }
            }
          }
        }*//*else{
            this.formItemSimpleRspList.forEach(item=>{
              this.$refs.multipleTable.toggleRowSelection(item)
            })
          }*/
      },
      objType:function(value) {
        this.crfPortionModifyPreview(value.obj.id)
      },
    },
    methods:{
      //表格多选
      handleSelectionChange(value,bool,index) {
        console.log("多选",value);
        /*if(value.length==0) {
          this.multipleSelection[0].controlName=="";
          // this.multipleSelection.splice(0,1)
          // this.$refs.multipleTable.clearSelection()
          if(this.multipleSelection.length>0){
            let onlyJsonData =  this.uniqueArray(this.multipleSelection,'id')
            console.log(onlyJsonData)
            this.multipleSelection = onlyJsonData
          }
          return
        }*/
        if(this.pageSelectList.length==0){
          this.multipleSelectionS = value;
          this.multipleSelection = value;
          this.multipleSelection.unshift(...this.formItemSimpleRspList);
        }else{
          console.log("多选 进入渲染",value,index);
          this.multipleSelectionS = value;
          this.multipleSelection = value;
          if(bool){
            let m_index = index;
            if(m_index == 0) {
              m_index = 0
            }else{
              m_index = index-1
            }
          }else{
            this.multipleSelection.unshift(...this.pageSelectList);
          }
          //json 去重
          let onlyJsonData =  this.uniqueArray(this.multipleSelection,'id')
          this.multipleSelection = onlyJsonData
        }
      },
      checkBoxTable(value) {
        return value.id
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
      //表格 预览
      previewPage(value) {
        console.log("预览",value)
        this.$router.push({path:"/sectionPreview",query:{
            id:value.id,
            show:false
          }})
      },
      //表格 编辑
      modifyData(value) {
        console.log("表格编辑",value)
      },
      //表格删除
      singleDelData(value) {
        console.log("表格删除",value)
      },
      //表格 添加
      clickAddEntry(value) {
        if(this.multipleSelection.length>=0){
          let Array = this.multipleSelection.map(item=>{
            return item.formPortionId
          })
          if(Array.indexOf(value.id)>=0){
            this.$message({
              type:"info",
              message:"不能添加重复的数据"
            })
          }else {
            this.multipleSelection.push({
              formPortionId:value.id,
              formPortionName:value.portionName
            })
          }
        }

      },
      //分页事件
      handleSizeChange(value){
        console.log(`每页 ${value} 条`);
      },
      handleCurrentChange(value){
        console.log(`当前${value}页`);
        this.multipleSelection.forEach(item=>{
          if(this.pageSelectList.length>=0){
            this.pageSelectList.push(item)
          }
        });
        this.currentPage = value;
        this.getFormItemList()
      },
      //返回 按钮
      returnPortion() {
        this.$emit("add-change",{type:'breakSinglePage',clickType:"return",obj:{}})
      },
      //包含 条目 删除
      clickformDelete(obj,index) {
        console.log(obj,index)
        this.formItemSimpleRspList.forEach((item,indx,array)=>{
          if(item.id==obj.id){
            array.splice(indx,1)
            this.multipleSelectionS.splice(indx,1)
          }
        });
        if(this.pageSelectList.length>0){
          this.pageSelectList.forEach((item,indx,array)=>{
            if(item.id == obj.id) {
              array.splice(indx,1);
              this.multipleSelection.splice(indx,1)
            }
          })
        }
        this.multipleSelectionS.forEach((item,indx,array)=>{
          if(item.id == obj.id){
            array.splice(indx,1)
            this.multipleSelection.splice(indx,1)
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })

      },
      //最新 条目删除
      tagClose(tag) {
        this.multipleSelection.splice(this.multipleSelection.indexOf(tag), 1);
      },
      //保存
      clickEditSave() {
        this.crfEditPortionSave()
      },
      //保存为副本
      clickSaveDuplicate() {
        console.log('单页保存 副本')
        // this.crfDuplicateSave(this.id)
        this.crfAddPortionSave();
      },
      //跳转 定义新小节
      toJumpNewEntry() {
        // this.$emit("add-change",{type:'newPortion',clickType:'newPortion',obj:{}})
        this.$emit("add-change",{type:'newPortion',clickType:'newPortion',obj:{callback:'breakSinglePage'}})
      },
      enterSearch() {
        this.getFormItemList();
      },
      //删除
      clickProtion() {
        this.crfPortionDelete()
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
          "offset":pageNo-1
        };
        try{
          let data = await that.$http.crfGetPortionList(that.$format(formData));
          console.log("小节列表数据",data)
          if(data.code===0){
            let obj ={};
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
      //小节编辑 回显 数据
      async crfPortionModifyPreview(value) {
        let that = this;
        that.loading = true;
        let formData= {
          formPageId:value
        }
        try{
          let data = await that.$http.crfSingleEditPreview(that.$format(formData))
          console.log("小节编辑回显",data)
          if(data.code == '0') {
            that.from.portionName = data.data.pageName;
            that.from.displayPortionName = data.data.pageDisplayName;
            that.from.formType = data.data.displayIsVision.toString();
            that.IsWhether = data.data.pageIsAvailable.toString();
            that.id = data.data.id;
            that.formItemSimpleRspList = data.data.formPortions;
            that.multipleSelection = data.data.formPortions;
          }
          this.loading = false
        }catch (error) {
          that.$notice("小节编辑数据获取失败")
          console.log(error)
          this.loading = false
        }
      },
      //保存 编辑接口
      async crfEditPortionSave() {
        let that = this;
        let formData = {
          "displayIsVision":parseInt(that.from.formType),
          "formPortionIds": this.multipleSelection.map(item=>{
            return item.formPortionId
          }) || [],
          "id": that.id,
          "pageDisplayName": that.from.displayPortionName,
          "pageIsAvailable":parseInt(that.IsWhether),
          "pageName": that.from.portionName
        };
        try {
          let data = await that.$http.crfSingleEdit(that.$format(formData))
          console.log("编辑小节 保存",data);
          if(data.code == 0) {
            that.$message({
              type:"success",
              message:data.msg
            })
            this.$emit("add-change",{type:'breakSinglePage',clickType:"breakSinglePage",obj:{}})
          }else{
            that.$notice(data.msg)
          }
        }catch (error) {
          that.$notice("保存失败");
          console.log(error)
        }
      },
      //保存 副本接口
      async crfDuplicateSave(value) {
        let that = this;
        let formData = {
          formPageId:value
        }
        try{
          let data = await that.$http.crfPageDuplicate(that.$format(formData))
          console.log("保存副本",data)
          if(data.code == 0) {
            that.$message({
              type:"success",
              message:data.msg
            })
            that.$emit("add-change",{type:'breakSinglePage',clickType:"breakSinglePage",obj:{}})
          }else{
            that.$notice(data.msg)
          }
        }catch (error) {
          that.$notice("保存副本失败");
          console.log(error)
        }
      },
      // 删除
      async crfPortionDelete() {
        let that = this;
        let formData ={
          list:that.multipleSelection.map(item=>{
            return item.formPortionId
          })||[]
        }
        try {
          let data = await that.$http.crfSinglePageDel(this.$format(formData));
          if(data.code==0) {
            that.$message({
              type:"success",
              message:data.msg
            })
            that.$emit("add-change",{type:'breakSinglePage',clickType:"breakSinglePage",obj:{}})
          }else{
            that.$notice(data.msg)
          }
        }catch (error) {
          that.$notice("删除失败");
          console.log(error)
        }
      },
      //单页 新保存副本
      async crfAddPortionSave() {
        let that = this;
        let formData = {
          "displayIsVision": parseInt(that.from.formType),
          "formPortionIds": this.multipleSelection.map(item=>{
            return item.formPortionId
          }) || [],
          "id": that.id,
          "pageDisplayName":that.from.displayPortionName,
          "pageIsAvailable": parseInt(that.IsWhether),
          "pageName": that.from.portionName
        };
        try {
          let data = await that.$http.crfPageDuplicate(that.$format(formData));
          console.log("单页 新副本保存" , data)
          if(data.code == 0) {
            that.id = data.data;
            that.$message({
              type:"success",
              message:data.msg
            })
          }
        }catch (error) {
          that.$notice("保存失败")
          console.log(error)
        }
      },
    },
    mounted() {
      console.log("单页");
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      console.log(this.objType);
      this.getFormItemList();
      this.crfPortionModifyPreview(this.objType.obj.id);
    }
  }
</script>

<style lang="less">
  .section_container{
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
              }
            }
            .section_displayNameInput{
              float: left;
              margin-left: 16px;
              .el-input{
                width: 70% !important;
                margin-left: 16px;
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
                  margin-right: 2px;
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
        .iconfont,i{
          color: #3B81F0;
          font-size: 18px;
          margin: 0 5px;
          cursor: pointer;
        }
        .del{
          color: #F0433C;
        }
      }
    }
  }
</style>
