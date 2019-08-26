<template>
    <div  class="add_child_entry_container" v-if="dialogShow">
      <el-dialog title="添加子条目" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form class="alignment" :inline="true"  label-width="80px" @submit.native.prevent>
          <el-form-item label="条目名称">
            <el-input v-model="entryName" @keyup.enter.native="changeSearchName" size="mini" placeholder="请输入条目名称" ></el-input>
            <el-button @click="changeSearchName">搜索</el-button>
          </el-form-item>
          <div class="hr" ></div>
        </el-form>
        <div class="search_box" >
          <span>你要添加的条目可能已经存在:按 &nbsp;&nbsp;</span>
          <el-select v-model="controlTypeName"  @change="changeSearchCheck">
            <el-option v-for="item in selectShowList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
          <span>&nbsp;&nbsp;检索</span>
        </div>
        <div class="table_checked" >
          <el-table ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    height="300"
                    @selection-change="handleCurrentChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="controlName" label="名称"></el-table-column>
            <el-table-column prop="controlDisplayName" label="显示名称"></el-table-column>
            <el-table-column prop="controlType" label="类型" :formatter="formatType"></el-table-column>
            <!--<el-table-column prop="author" label="作者"></el-table-column>-->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <i class="iconfont iconfuhao2" @click="previewPageTable(scope.row)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="clickSaveBtn">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import parameter from './../parameter';
    export default {
      name: "addChildEntry",
      props:{
        dialogShow:{
          type:Boolean,
          default:null
        },
        basicDataInfo:{
          type:Object,
          default: null
        }
      },
      data() {
        return {
          dialogFormVisible:true,
          entryName:"",//条目名称
          controlTypeName:"",//控件类型名称
          radio:"",//单选
          // isSHowSearch:false,// 检查隐藏
          currentRow:null,//点击行数据
          multipleSelection:[],//多选数据
          //下拉 数据
          selectShowList:[
            {
                name:"全部",
                value:''
            },
            {
              name:"单行文本框",
              value:'SINGLE_INPUT'
            },
            {
              name:"多行文本框",
              value:"MULTI_INPUT"
            },
            {
              name:"标签",
              value:"LABEL"
            },
            {
              name:"日期",
              value:"DATE"
            },
            {
              name:"日期时间",
              value:"DATE_TIME"
            },
            {
              name:"数值",
              value:"NUMBER_INPUT"
            },
            {
              name:"单选下拉",
              value:"SINGLE_COMBOX"
            },
            {
              name:"多选下拉",
              value:"MULTI_COMBOX"
            },
            {
              name:"单选框",
              value:"RADIO_BUTTON"
            },
            {
              name:"多选框",
              value:"CHECKBOX"
            },
            {
              name:"集合",
              value:"GATHER"
            },
            {
              name:"表格",
              value:"TABLE"
            },
            {
              name:"文件上传",
              value:"FILE_UPLOAD"
            },
            /*{
              name:"超链接",
              value:"linkURL"
            }*/
          ],
          //表格数据
          tableData:[],
          //添加行数据模拟
          addData:{
            "id":"",
            "controlName": "",//(控件名称)
            "controlDisplayName":"",//(控件显示名称)
            "controlType": "", //(控件显示类型)
            "displayIsVisible": 1, //(显示名称是否可见)
            "baseProperty": {
              "controlWidth": 0, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
              "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
              "controlTip": "", //(控件输入提示)
              "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
              "controlIsExtend":0, //(下拉框是否可扩展)
              "labelType":null,
                  "labelContent":null,
                  "labelImage":null,
                  "bindingInfo":{
                  "itemId":"",
                  "viewId":"",
                  "viewColumn":"",
                  "bindingType":"",
                  "bindingColumn":"",
                  "bindingColumnName":"",
                  "list":[]
                  }
            },
            "termSet": {
              "termGroupOid": "", //(代码集OID)
              "termGroupName":'', //(代码集名称)
              "termDefaultValue":[],// 是否有默认值
              "termItemList": []
            },
            "termUnit":{
              "numberIsSwitch":0, //单位是否显示
              "unitName":"",//单位值
            },
            "gatherKnowType":0, // (集合或表格： 无、 有无、 是否不详)
            "gatherRank": 0, //(集合或表格的显示形式)
            "gatherColumnNumber":2,////集合列 最小2 最大值5
            "inputValue":"",//用于预览
            "gatherIsVisible":1,
            "gatherFoldFlag":0,
            "children": []//(此条目的子条目)
          }
        }
      },
      watch:{
        dialogShow:function(val){
          console.log(this.dialogShow);
          this.dialogFormVisible = true;
          this.init();
        },
        dialogFormVisible:function (value){
          console.log("触发dialogFormVisible",value)
          if(value==false) {
            this.$emit("dialog-close",false);
          }
        },
        entryName:function (value) {
          console.log("条件触发",value)
          if(value!=="" || value == undefined){
            this.addData.controlName = value;
            this.addData.controlDisplayName = value;
          }
        }
      },
      methods:{
        //弹框保存
        clickSaveBtn() {
          console.log(this.multipleSelection)
          console.log(this.basicDataInfo)
          let newData = this.basicDataInfo;
          if(this.multipleSelection.length>0 && this.entryName!=""){ //两个条件都存在时，已勾选条件为准
            this.dialogFormVisible = false;
            if(newData.selectType==='GATHER' || newData.selectType==='TABLE'){
              this.multipleSelection.forEach(item=>{
                newData.obj.children.push(item)
              })
            }
          }
          if(this.entryName == "" && this.multipleSelection.length==0){
            this.$message({
              message:"请输入条目名称",
              type:'info'
            });
            return;
          }else if(this.entryName!=""&&this.multipleSelection.length==0){ //输入条目名称 但没有选择值
            console.log("只输入 条目名称");
            this.dialogFormVisible = false;
            if(newData.selectType==='GATHER' || newData.selectType==='TABLE'){
              newData.obj.children.push(Object.assign({},JSON.parse(JSON.stringify(this.addData))))
            }
          }else if(this.entryName==="" && this.multipleSelection.length>0){ //未输入条目名称 已选择表格数据
            this.dialogFormVisible = false;
            // let newData = this.basicDataInfo;
            if(newData.selectType==='GATHER' || newData.selectType==='TABLE'){
              this.multipleSelection.forEach(item=>{
                newData.obj.children.push(item)
              })
            }
          }
          /*this.dialogFormVisible = false;
          let newData = this.basicDataInfo;
          if(newData.selectType==='GATHER' || newData.selectType==='TABLE'){
            newData.obj.children.push(this.addData)
          }*/
          /*else{
            /!*console.log(newData.obj)
            this.$emit("add-data-callback",newData)*!/
          }*/
        },
        //输入框 事件
        changeSearchName(){
          console.log(this.entryName);
          // this.isSHowSearch = true;
          this.SearchList();
        },
        // 选择 检索事件
        changeSearchCheck(){
          console.log(this.controlTypeName)
          this.SearchList();
          // this.drugName ="";
        },
        //表格单选
        handleCurrentChange(value) {
          this.multipleSelection=value;
          console.log(this.multipleSelection.length)
        },
        //表格 预览 事件
        previewPageTable(value){
          console.log('预览',value)
          this.dialogFormVisible = false;
          this.$router.push({path:"/crfFill",query:{
              id:value.id,
              show:false
            }})
        },
        //表格 数据过滤
        formatType:function(row,column,value) {
          switch (row.controlType) {
            case "SINGLE_INPUT" :
              return "单行文本框";
            case "MULTI_INPUT" :
              return "多行文本框";
            case "LABEL" :
              return "标签";
            case "DATE" :
              return "日期";
            case "DATE_TIME" :
              return "日期时间";
            case "NUMBER_INPUT" :
              return "数值";
            case "SINGLE_COMBOX" :
              return "单选下拉";
            case "MULTI_COMBOX" :
              return "多选下拉";
            case "RADIO_BUTTON" :
              return "单选框";
            case "CHECKBOX" :
              return "多选框";
            case "GATHER" :
              return "集合";
            case "TABLE" :
              return "表格";
            case "FILE_UPLOAD" :
              return "文件上传";
            default:
              break;
          }
        },
        //初始化 数据
        init(){
          console.log("进入后数据初始化");
          this.entryName = "";
          this.multipleSelection = [];
          // this.isSHowSearch=false
          this.addData={
            "id":"",
            "controlName":"",//(控件名称)
            "controlDisplayName":"",//(控件显示名称)
            "controlType": "", //(控件显示类型)
            "displayIsVisible": 1, //(显示名称是否可见)
            "baseProperty": {
              "controlWidth": 0, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
              "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
              "controlTip": "", //(控件输入提示)
              "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
              "controlIsExtend":0, //(下拉框是否可扩展)
              "labelType":null,
                  "labelContent":null,
                  "labelImage":null,
                  "bindingInfo":{
                  "itemId":"",
                  "viewId":"",
                  "viewColumn":"",
                  "bindingType":"",
                  "bindingColumn":"",
                  "bindingColumnName":"",
                  "list":[]
                  }
            },
            "termSet": {
              "termGroupOid": "", //(代码集OID)
              "termGroupName":'', //(代码集名称)
              "termDefaultValue":[],// 是否有默认值
              "termItemList": [
                /*{
                  "termName": "",//(显示名名称)
                  "Point":"", //(分值)
                  "termID":"" //(显示名代码)
                }*/
              ]
            },
            "termUnit":{
              "numberIsSwitch":0, //单位是否显示
              "unitName":"",//单位值
            },
            "gatherKnowType":0, // (集合或表格： 无、 有无、 是否不详)
            "gatherRank": 0, //(集合或表格的显示形式)
            "gatherColumnNumber":2,
            "gatherIsVisible":1,
            "children": []//(此条目的子条目)
          }
        },
        //获取列表
        async SearchList() {
          let that = this;
          let paramData = {
            controlName:this.entryName||"",
            controlType:this.controlTypeName ||""
          }
          try{
            let data = await that.$http.crfSearchList(paramData)
            console.log(data)
            if(data.code === 0){
              that.tableData = data.data
            }
          }catch (error) {
            that.$notify("查询列表失败")
            console.log(error)
          }
        }
      },
      mounted() {
        // this.SearchList()
      }
    }
</script>

<style lang="less" scoped>

.add_container_box{
  .alignment{
    text-align: left;
    .hr{
      height: 1px;
      background-color: #D8D8D8;
      margin-bottom:15px;
    }
    .el-input{
      width: 200px !important;
    }
    .el-button{
      /*margin-left: 1%;*/
    }
    .el-form-item{
      .el-form-item__content{
        width: 60%;
        display: inline-block;
        position: relative;
        .el-button{
          /*position: absolute;
          top: 1px;
          right: -65%;*/
        }
      }
    }
  }
  .search_box{
    text-align: left;
    margin-bottom: 20px;
    span{
      font-size:14px;
      color:#63666e;
    }
  }
  .table_checked{
    .iconfont{
      color: #3B81F0;
      cursor: pointer;
    }
  }
}

thead {
  .el-table-column--selection {
    .cell {
      display: none !important;
    }
  }
}
</style>
