y
<template>
    <div class="add_container_box" v-loading="loading">
      <div class="add_content_title">
        {{title}}条目
        <i class="iconfont iconfuhao2" title="预览" @click="clickPreview"></i>
      </div>
      <div class="add_content_info" style="text-align: left">
        <el-form :inline="true" >
          <el-form-item>
              <el-input v-model="entryData.controlName" placeholder="条目名称" size="mini" @change="changeEntryName(entryData,entryData.controlName)"></el-input>
          </el-form-item>
          <span class="extent del">*</span>
          <el-form-item>
              <el-input v-model="entryData.controlDisplayName" placeholder="条目显示名称" size="mini" @change="changeShowEntryName(entryData,entryData.controlDisplayName)"></el-input>
          </el-form-item>
          <span class="extent del">*</span>
          <el-form-item>
              <el-select v-model="entryData.controlType"
                         size="mini"
                         placeholder="选择显示类型"
                         @change="changeType(entryData,entryData.controlType)">
                  <el-option v-for="item in selectShowList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <icon :controlType="entryData.controlType"
                :gatherKnowType="entryData.gatherKnowType"
                :termUnit="entryData.termUnit"
                :termSet="entryData.termSet"
                :displayIsVisible="entryData.displayIsVisible"
                :gatherColumnNumber="entryData.gatherColumnNumber"
                :item="entryData"
                :children="entryData.children"
                :gatherRank="entryData.gatherRank"
                @status-IsVisible="statusIsVisible"
                @status-addList="statusAddList"
                @status-set="statusSet"
                @status-CodeSet="statusCodeSet"
                @status-gatherKnowType="statusGatherKnowType"
                @status-gatherRank="statusGatherRank"
                @status-gatherColumnNumber="statusGatherColumnNumber"></icon>
          <entryitem :countData="entryData" :list="entryData.children" ></entryitem>
        </el-form>
      </div>
      <!--<div>
        <p>新控件封装</p>
        <add-line :item="entryData"></add-line>
      </div>-->
      <div class="add_content_footer">
        <el-row>
          <el-col :span="10">
            <span >是否可用：</span>
            <el-radio-group v-model="entryData.controlIsAvailable">
              <el-radio :label="1">可用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>使用该条目的原型：</span>
            <span class="section" v-for="(item,index) in sectionList" :key="index">{{item.portionName}}</span>
            <!--<span class="section">麻醉-术种</span>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>使用该条目的其他属性：</span>
            <span v-for="item in referList" class="section" @click="lickCheckEntry(item.id)">{{item.controlName}}</span>
            <!--<span class="section">麻醉-术种</span>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-button type="primary" @click="saveEntryData">保存</el-button>
            <el-button @click="returnEntry">返回</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="dialog-box">
        <!--//配置化弹框位置-->
       <!-- <keep-alive>-->
          <component  :is="currentTabComponent"
                      :dialogShow="dialogShow"
                      :allData="allData"
                      :basicDataInfo="basicDataInfo"
                      @add-data-callback="addDataCallback"
                      @basic-click="basicClick"
                      @dialog-close="dialogClose"></component>
        <!--</keep-alive>-->
      </div>
    </div>
</template>

<script>
  import entryItem from './entryItem';
  import parameter from "./../parameter";
  import icon from './controlDisplayIcon';
  import addLine from "./../basis/addLine"
    export default {
      name: "addEntry",
      props:{
        objType:{
          type:Object,
          default:null
        }
      },
      components:{
        entryitem:entryItem,
        icon:icon,
        addLine,
        dialoginput:function(resolve){ //单行文本弹框
          require((['../dialog/dialoginput']),resolve);
        },
        dialogaddchildEntry:function(resolve) {//添加弹框
          require((['../dialog/addChildEntry']),resolve)
        },
        dialogtextarea:function (resolve) { //多行文本弹框
          require((['../dialog/dialogtextarea']),resolve)
        },
        dialogdate:function(resolve) { //日期
          require((['../dialog/dialogdate']),resolve)
        },
        dialogdateTime:function(resolve) { //日期时间
          require((['../dialog/dialogdateTime']),resolve)
        },
        dialogradioSelect:function(resolve) { //下拉单选
          require((['../dialog/dialogradioSelect']),resolve)
        },
        dialogcheckBoxSelect:function(resolve) { //下拉多选
          require((['../dialog/dialogcheckBoxSelect']),resolve)
        },
        dialoglabel:function (resolve) { //标签
          require((['../dialog/dialoglabel']),resolve)
        },
        dialogCodeSet:function(resovle) { //设置代码集
          require((['../dialog/dialogCodeSet']),resovle)
        },
        dialogdataBind:function(resolve) { //数据绑定设置
          require((['../dialog/dialogdataBind']),resolve)
        },
        dialogpreview:function(resolve) { //预览弹框
          require((['../dialog/dialogpreview']),resolve)
        }
      },
      data() {
          return {
            loading:false,
            //下拉 数据 有集合
            selectShowList:[
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
            //排列方式
            layoutList:[
              {
                name:"上下排列",
                value:0
              },
              {
                name:"左右排列",
                value:1
              }
            ],
            //选择单位
            unitList:[
              {
                name:"hour",
                value:"hour"
              },
              {
                name:"ml",
                value:"ml"
              },
              {
                name:"L",
                value:"L"
              },
              {
                name:"mg",
                value:"mg"
              },
              {
                name:"ug",
                value:"ug"
              },
              {
                name:"g",
                value:"g"
              },
              {
                name:"min",
                value:"min"
              }
            ],
            //新增条目数据
            entryData:
              {
                "id": "",
                "controlName": "",//(控件名称)
                "controlDisplayName":"",//(控件显示名称)
                "controlIsAvailable": 1,//（控件是否可用）
                "controlType": "", //(控件显示类型)
                "displayIsVisible": 1, //(显示名称是否可见)
                "baseProperty": {
                  "controlWidth": 0, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
                  "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
                  "controlTip": "", //(控件输入提示)
                  "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
                  "controlIsExtend":0, //(下拉框是否可扩展)
                  "itemFileRsp":[],
                  "fileType":"FILE",
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
                  "termItemList": [],
                  "foldFlag":1,
                },
                "termUnit":{
                  "numberIsSwitch":1, //单位是否显示
                  "unitName":"",//单位值
                },
                "gatherKnowType":0, // (集合或表格： 无、 有无、 是否不详)
                "gatherRank": 0, //(集合或表格的显示形式)
                "gatherColumnNumber":2,//集合列 最小2 最大值5
                "inputValue":"",//用于预览
                "gatherIsVisible":1,//只用于集合或者表格的单元格的显示隐藏 0 1
                "gatherFoldFlag":0,//是否不详参数隐藏
                "children": [],//(此条目的子条目)
                "binding":0
              }
            ,
            typeName:"", //下拉值
            layout:"",// 排列方式值 0 上下 1 左右
            linkage:"",// 是否不详 （联动）
            codeSet:"", //类型代码集
            completeState:"",//完成状态
            unitListValue:"",//选择单位
            currentTabComponent:"",//弹框组件区分
            dialogShow:false,//弹框显示隐藏
            basicDataInfo:{},//弹框 基础信息
            title:"新增",
            allData:[],//预览 传参数据
            referList:[],//引用该条目
            sectionList:[],//引用该小节
          }
      },
      computed:{

      },
      methods:{
        //新 显示隐藏
        onIsRequired(value) {
          console.log(value)
        },
        //保存
        saveEntryData(){
          console.log("新增 条目保存");
          if(this.objType.clickType==='add'){
            this.loading = true;
            this.addOrEdit();
          }else if(this.objType.clickType==='edit'){
            this.loading = true;
            this.editOrList()
          }
        },
        //返回
        returnEntry() {
          if(this.objType.obj.callback=='sectionList') {
            this.$emit("add-change",{type:'sectionList',clickType:"return",obj:{callback:''}})
          }else{
            this.$emit("add-change",{type:'entry',clickType:"return",obj:{callback:''}})
            this.$destroy();
          }
        },
        // title 预览
        clickPreview(){
          console.log("预览点击事件");

          if(this.entryData.controlType===""){
            this.$message({
              type:"warning",
              message:"请选择控件类型"
            })
            return ;
          }
          this.dialogShow = true;
          console.log(this.entryData)
          this.allData=[this.entryData];
          this.currentTabComponent = 'dialogpreview';
          let preview = {
            preview:'dialogPreview'
          }
          localStorage.setItem('dialogPreview',JSON.stringify(preview))
        },
        //条目名称
        changeEntryName(obj,value,index){
        console.log(obj,value,index)
          obj.controlDisplayName = value
        },
        //条目显示名称
        changeShowEntryName(obj,value,index){
          console.log(obj,value,index)
        },
        //显示类型
        changeType(obj,value,index) {
          if(obj.children.length>0){
            this.$confirm("是否确定重新选择类型","提示",{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type:"error"
            }).then(()=>{
              this.$message({
                type:"success",
                message:"选择成功"
              });
              obj.children=[];
            })
          }
          //选择类型是 清除termUnit设置
          this.entryData.baseProperty={
            "controlWidth": 4, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
            "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
            "controlTip": "", //(控件输入提示)
            "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
            "controlIsExtend":0, //(下拉框是否可扩展)
            "labelType":null,
            "labelContent":null,
            "labelImage":null,
            "itemFileRsp":[],
            "fileType":"FILE",
            "bindingInfo":{
              "itemId":"",
              "viewId":"",
              "viewColumn":"",
              "bindingType":"",
              "bindingColumn":"",
              "bindingColumnName":"",
              "list":[]
            }
          };
          this.entryData.termSet= {
            "termGroupOid": "", //(代码集OID)
            "termGroupName":'', //(代码集名称)
            "termDefaultValue":[],// 是否有默认值
            "termItemList": [],
            "foldFlag":1,
          };
          this.entryData.termUnit={
            "numberIsSwitch":1, //单位是否显示
            "unitName":"",//单位值
          };
          this.entryData.gatherKnowType=0;
          this.entryData.inputValue="";
          this.entryData.gatherRank=0;
          this.entryData.gatherColumnNumber=2;
          this.entryData.gatherIsVisible=1;
          this.entryData.gatherFoldFlag=0;
          this.typeSwitch(obj,value)
        },
        //条目显示名称 是否必填
        clickIsRequired(obj,index){
          console.log("条目显示名称是否必填");
          console.log(obj.showEntryName)
          /*if(obj.showEntryName){
            obj.showEntryName = false;
          }else{
            obj.showEntryName = true;
          }*/
        },
        //代码集
        clickCodeSet() {
          console.log("代码集")
        },
        //设置
        clickSet(obj,index){
          console.log('设置');
          this.dialogShow = true;
          // this.typeSwitch(obj,index)17688972964
        },
        //添加
        addEntryData(obj,index){
          console.log("添加一行数据");
          this.dialogShow = true;
          this.basicDataInfo = {
            obj:obj,
            selectType:obj.controlType,
            index:index
          }
          this.currentTabComponent = "dialogaddchildEntry";
        },
        //删除
        delEntryData() {
          console.log("删除")
        },
        //上移
        clickMoveUp() {
          console.log("上移")
        },
        //下移
        clickMoveDown() {
          console.log("下移")
        },
        //切换
        clickSwitch(obj,index) {
          console.log("切换")
          console.log(obj)
          //选择 数值时,代码集和单位选择进行切换
          /*if(!obj.unitShow){
            obj.unitShow = true;
            obj.codeSet.show = false;
          }else{
            obj.unitShow = false;
            obj.codeSet.show = true;
          }*/
        },
        //弹框关闭事件
        dialogClose(value){
          console.log("关闭弹框回调数据",value);
          this.dialogShow = value;
        },
        //组件 基础数据事件 回调
        basicClick(value) {
          console.log("设置 基础数据 回调",value);
        },
        //组件 添加弹框数据 回调
        addDataCallback(value) {
          console.log("设置 添加数据 回调1",value);
          if(value.selectType!=='GATHER'||value.selectType!=='TABLE'){
            this.entryData.children.push(value.obj)
          }
        },
        // 图标 组件 参数回调
        //是否禁用
        statusIsVisible(value) {
          console.log("显示 隐藏 数据回调",value);
          this.entryData.displayIsVisible = value.obj.displayIsVisible;
        },
        //添加
        statusAddList(value) {
          console.log("点击添加状态回调",value);
          this.dialogShow = true;
          this.basicDataInfo = {
            obj:value.obj,
            selectType:value.obj.controlType,
            index:value.index
          }
          this.currentTabComponent = "dialogaddchildEntry";
        },
        //设置
        statusSet(value){
          console.log("图标 设置 状态回调",value)
          this.dialogShow=true;
          this.typeSwitch(value.obj,value.index)
        },
        //有无不详
        statusGatherKnowType(value) {
          console.log("图标 是否不详 状态回调",value);
          this.entryData = value.obj;
        },
        //排列方式
        statusGatherRank(value){
          console.log("排列方式 状态回调",value)
          this.entryData = value.obj;
        },
        // 集合左右排列 列数据
        statusGatherColumnNumber(value){
          console.log("集合左右排列 列数据 状态回调",value)
          this.entryData = value.obj;
        },
        //设置代码集
        statusCodeSet(value){
          console.log("图标 设置代码集 状态回调",value)
          this.dialogShow=true;
          this.basicDataInfo = {
            obj:value.obj,
            selectType:value.obj.controlType,
            index:value.index
          }
          this.currentTabComponent = "dialogCodeSet";
        },
        // 查看是否 应用其它该条目
        lickCheckEntry(value){
          console.log(value)
        },
        //选择显示类型处理
        typeSwitch(obj,value) {
          this.currentTabComponent="";
          switch (obj.controlType) {
            case "LABEL" :
              this.basicDataInfo = {obj:obj,index:value};
              this.currentTabComponent = 'dialoglabel';
              break;
            default:
              this.basicDataInfo = {obj:obj,index:value};
              this.currentTabComponent = 'dialoginput';
              break;
          }
        },
        //新增 保存
        async addOrEdit(){
          let that = this;
          that.loading = true;
          try {
            let data = await that.$http.crfAddList(that.$format(that.entryData))
            if(data.code === 0 ){
              that.$message({
                type:"success",
                message:data.msg
              })
              this.$emit("add-change",{type:'entry',clickType:'save',obj:{}});
              this.$destroy();
            }
            that.loading = false;
          }catch(error){
            that.$notice('新增条目失败');
            console.log(error);
            that.loading = false;
          }
          
        },
        //修改 保存
        async editOrList(){
          let that = this;
          that.loading = true;
          try {
            let data = await that.$http.crfEditList(that.$format(that.entryData))
            if(data.code === 0 ){
              that.$message({
                type:"success",
                message:data.msg
              })
              this.$emit("add-change",{type:'entry',clickType:'save',obj:{}});
              this.$destroy();
            }
            that.loading = false;
          }catch(error){
            that.$notice('修改条目保存失败');
            console.log(error);
            that.loading = false;
          }
          
        },
        //获取编辑数据
        async editDataList(value) {
          let that = this;
          let paramData = {
            id:value
          }
          try {
            let data = await that.$http.crfIDPreview(that.$format(paramData))
            console.log(data)
            if(data.code == 0) {
              that.entryData=data.data;
            }
            that.loading  = false;
          }catch (error) {
            that.$notice('编辑条目列表失败');
            console.log(error);
            that.loading  = false;
          }
        },
        //获取该条目的其它条目
        async getReferList(value) {
          let that = this;
          let paramData = {
            formItemId:value
          }
          try{
            let data = await that.$http.crfGetReferList(that.$format(paramData));
            console.log(data)
            if(data.code===0){
              that.referList = data.data;
            }
          }catch (error) {
            that.$notice("获取引用条目失败")
            console.log(error)
          }
        },
        //获取该条目 其它小节
        async crfGetSectionList(value) {
          let that = this;
          let paramData = {
            formItemId:value
          }
          try{
            let data = await that.$http.crfGetSectionList(that.$format(paramData));
            console.log('小节',data)
            if(data.code===0){
              that.sectionList = data.data;
            }
          }catch (error) {
            that.$notice("获取引用小节失败")
            console.log(error)
          }
        }
      },
      mounted() {
        console.log(this.objType);
        this.loading = true;
        if(this.objType.clickType==='add'){
          this.title = "新增";
          this.loading = false;
        }else if(this.objType.clickType==='edit'){
          this.title = "编辑";
          // this.addEntryList = [];
          this.editDataList(this.objType.obj.id)
          this.getReferList(this.objType.obj.id)
          this.crfGetSectionList(this.objType.obj.id)
        }
      }
    }
</script>

<style lang="less" scoped>
  .add_container_box{
    width: 100%;
    color: #444;
    .add_content_title{
      width: 100%;
      height: 44px;
      line-height: 44px;
      font-size:16px;
      padding-left:20px;
      background-color:rgba(238,238,238,1);
      border-top:2px solid rgba(45,140,240,1);
      i{
        color:#3B81F0;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .add_content_info{
      max-height: 600px;
      /*height: 600px;*/
      overflow: auto;
      padding-top:20px;
      padding-left: 20px;
      border-left:1px solid #DEE2E5;
      border-right: 1px solid #DEE2E5;
      border-bottom: 1px solid #DEE2E5;
      margin-bottom: 20px;
      .extent{
        font-size: 20px;
        padding-right: 10px;
      }
      .iconfont{
        color:#3B81F0;
        font-size:21px;
        padding-right: 10px;
      }
      .gray{
        color: #DEE2E5;
      }
      .del{
        color: #F0433C;
      }
      .modify_position{
        position:relative;
        top:4px;
      }
      i{
        cursor:pointer;
      }
    }
    .add_content_footer{
      /*width: 85%;
      position: fixed;
      bottom: 32px;
      left: 228px;*/
      font-size: 14px;
      color:#63666e;
      padding-left: 18px;
      .el-row{
        margin-bottom: 17px;
        .section{
          display: inline-block;
          min-width: 82px;
          /*height: 24px;*/
          text-align: center;
          /*line-height: 24px;*/
          font-size:12px;
          color:rgba(50,129,240,1);
          border:1px solid rgba(165,200,255,1);
          background-color:rgba(236,245,255,1);
          border-radius:2px;
          margin-right: 20px;
          padding:5px;
          cursor:pointer;
        }
      }
    }
  }
</style>
