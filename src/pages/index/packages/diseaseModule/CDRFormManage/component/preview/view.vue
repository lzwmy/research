<template>
    <div class="view_container" v-loading="loading">
      <div v-for="(item,index) in viewList">
        <!--单行文本框-->
        <div class="view_box"v-if="item.controlType=='SINGLE_INPUT'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_input" v-if="item.gatherIsVisible=='1'?true:false">
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type" :style="item.baseProperty.controlWidth=='1'?'width:50px':item.baseProperty.controlWidth=='2'?'width:100px':item.baseProperty.controlWidth=='3'?'width:150px':item.baseProperty.controlWidth=='4'?'width:170px':''">
              <el-input v-model="item.inputValue" size="mini" :placeholder="item.baseProperty.controlTip"></el-input>
            </div>
          </div>
        </div>
        <!--多行文本框-->
        <div class="view_box" v-if="item.controlType=='MULTI_INPUT'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_textarea" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type" :style="item.baseProperty.controlWidth=='1'?'width:124px':item.baseProperty.controlWidth=='2'?'width:229px':item.baseProperty.controlWidth=='3'?'width:334px':item.baseProperty.controlWidth=='4'?'width:439px':''">
              <el-input type="textarea" :rows="item.baseProperty.controlHeight||4" v-model="item.inputValue" :placeholder="item.baseProperty.controlTip"></el-input>
            </div>
          </div>
        </div>
        <!--标签-->
        <div class="view_box" v-if="item.controlType=='LABEL'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_label" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type" style="font-size: 14px;color: #cccccc">{{item.baseProperty.labelContent}}</div>
          </div>
        </div>
        <!--日期-->
        <div class="view_box" v-if="item.controlType=='DATE'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_date" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
              <el-date-picker
                v-model="item.inputValue"
                size="mini"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime =='0'?true:false">
              <el-date-picker
                v-model="item.inputValue"
                size="mini"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <!--日期时间-->
        <div class="view_box" v-if="item.controlType=='DATE_TIME'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_time" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
              <el-date-picker
                v-model="item.inputValue"
                size="mini"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
            <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='0'?true:false">
              <el-date-picker
                v-model="item.inputValue"
                size="mini"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </div>
        </div>
        <!--数值框-->
        <div class="view_box" v-if="item.controlType=='NUMBER_INPUT'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_number" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type_number">
              <el-input v-model="controlNumber" size="mini" placeholder="数字"></el-input>
            </div>
            <div class="view_unit" v-if="item.termUnit.numberIsSwitch=='1'?true:false">
              {{item.termUnit.unitName}}
            </div>
            <div class="view_select" v-if="item.termUnit.numberIsSwitch=='0'?true:false">
              <el-select v-model="item.termSet.termDefaultValue[0]" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in item.termSet.termItemList"
                  :key="item.termItemName"
                  :label="item.termItemName"
                  :value="item.termItemName">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!--单选下拉-->
        <div class="view_box" v-if="item.controlType=='SINGLE_COMBOX'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_radioSelect" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:25%':item.baseProperty.controlWidth=='2'?'width:50%':item.baseProperty.controlWidth=='3'?'width:75%':item.baseProperty.controlWidth=='4'?'width:170px':''">
              <el-select filterable
                         allow-create
                         default-first-option
                         size="mini"
                         v-model="item.termSet.termDefaultValue[0]"
                         @keyup.enter.native="addTermItemRspList(item,index,item.termSet.termDefaultValue[0])"
                         placeholder="请选择">
                <el-option
                  v-for="item in item.termSet.termItemList"
                  :key="item.termItemName"
                  :label="item.termItemName"
                  :value="item.termItemName">
                </el-option>
              </el-select>
              <!--<el-input style="width: 30%;" v-model="radioInputValue"></el-input>
              <el-button @click="addTermItemRspList(item,index,radioInputValue)">添加</el-button>-->
            </div>
            <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:25%':item.baseProperty.controlWidth=='2'?'width:50%':item.baseProperty.controlWidth=='3'?'width:75%':item.baseProperty.controlWidth=='4'?'width:80%':''">
              <el-select filterable
                         size="mini"
                         v-model="item.termSet.termDefaultValue[0]"
                         placeholder="请选择">
                <el-option
                  v-for="item in item.termSet.termItemList"
                  :key="item.termItemName"
                  :label="item.termItemName"
                  :value="item.termItemName">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!--多选下拉-->
        <div class="view_box" v-if="item.controlType=='MULTI_COMBOX'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_checkBox" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:25%':item.baseProperty.controlWidth=='2'?'width:50%':item.baseProperty.controlWidth=='3'?'width:75%':item.baseProperty.controlWidth=='4'?'width:80%':''">
              <el-select v-model="item.termSet.termDefaultValue"
                         allow-create
                         filterable
                         default-first-option
                         multiple
                         size="mini"
                         @keyup.enter.native="addTermItemRspListCheckBox(item,index,item.termSet.termDefaultValue)"
                         placeholder="请选择">
                <el-option
                  v-for="item in item.termSet.termItemList"
                  :key="item.termItemName"
                  :label="item.termItemName"
                  :value="item.termItemName">
                </el-option>
              </el-select>
              <!--<el-input style="width: 30%;" v-model="checkBoxInputValue"></el-input>
              <el-button @click="addTermItemRspList(item,index,checkBoxInputValue)">添加</el-button>-->
            </div>
            <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:25%':item.baseProperty.controlWidth=='2'?'width:50%':item.baseProperty.controlWidth=='3'?'width:75%':item.baseProperty.controlWidth=='4'?'width:80%':''">
              <el-select v-model="item.termSet.termDefaultValue" size="mini" multiple placeholder="请选择">
                <el-option
                  v-for="item in item.termSet.termItemList"
                  :key="item.termItemName"
                  :label="item.termItemName"
                  :value="item.termItemName">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!--单选框-->
        <div class="view_box" v-if="item.controlType=='RADIO_BUTTON'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_radio_btn" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div :class="['view_type_radio_btn',{'width_auto_type':item.controlType=='RADIO_BUTTON'}]">
              <el-radio-group v-model="item.termSet.termDefaultValue[0]" >
                <el-radio v-for="item in item.termSet.termItemList" :label="item.termItemName">{{item.termItemName}}</el-radio>
              </el-radio-group>
            </div>
            <div class="view_empty" @click="emptyList(item,index)">清空</div>
          </div>
        </div>
        <!--多选框-->
        <div class="view_box" v-if="item.controlType=='CHECKBOX'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label_checkBox_btn" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div :class="['view_type_checkBox_btn',{'width_auto_type':item.controlType=='CHECKBOX'}]">
              <el-checkbox-group v-model="item.termSet.termDefaultValue">
                <el-checkbox v-for="item in item.termSet.termItemList" :label="item.termItemName"></el-checkbox>
                <!--<el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>-->
              </el-checkbox-group>
            </div>
            <div class="view_empty" @click="emptyList(item,index)">清空</div>
          </div>
        </div>
        <!--上传-->
        <div class="view_box" v-if="item.controlType=='FILE_UPLOAD'?true:false">
          <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
          <div class="view_content">
            <div class="view_label" >
              <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
            </div>
            <div class="view_type">
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </div>
          </div>
        </div>
        <!--集合-->
        <div class="view_box" v-if="item.controlType=='GATHER'?true:false">
          <div class="view_title">
            <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
            <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
            {{item.controlName}}
          </div>
          <div class="view_knowType"  v-if="item.gatherKnowTypeIsVisible=='1'?true:false">
            <el-radio-group v-model="item.gatherKnowType" >
              <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">否</el-radio>
              <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">是</el-radio>
              <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
            </el-radio-group>
            <span class="empty" @click="emptyKnowType(item,index)">清除</span>
          </div>
          <div :class="['view_content',{'width_container':item.gatherRank=='1'}]" v-if="item.termSet.foldFlag===1?true:false">
            <!--<div class="view_label">条目显示名称</div>
            <div class="view_type">
              &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                <el-option
                  v-for="item in numberList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>&ndash;&gt;

            </div>-->
            <view-item :gatherColumnNumber="item.gatherColumnNumber" :pitem="item" :list="item.children"></view-item>
          </div>
        </div>
        <!--表格-->
        <div class="view_box" v-if="item.controlType=='TABLE'?true:false">
          <div class="view_title" v-if="item.gatherIsVisible=='1'?true:false">
            <i v-if="item.termSet.foldFlag=='1'?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
            <i v-if="item.termSet.foldFlag=='0'?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
            {{item.controlName}}
          </div>
          <div class="view_knowType" v-if="item.gatherKnowTypeIsVisible=='1'?true:false">
            <el-radio-group v-model="item.gatherKnowType" >
              <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">否</el-radio>
              <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">是</el-radio>
              <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">是否不详</el-radio>
            </el-radio-group>
            <span class="empty" @click="emptyKnowType(item,index)">清除</span>
          </div>
          <div :class="['view_content',{'tb_content':item.controlType=='TABLE'},{'bg_color':item.gatherRank=='0'}]" v-if="item.termSet.foldFlag=='1'?true:false">
            <!--<div class="view_label">条目显示名称</div>
            <div class="view_type">
              &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                <el-option
                  v-for="item in numberList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>&ndash;&gt;
            </div>-->
            <view-item :pitem="item" :list="item.children"></view-item>
            <div class="icon" style="display: table-cell">

              <i class="iconfont iconfuhao4 del" v-if="viewList.length>1?true:false" @click="clickTableDelete(item,index)"></i>
              <i class="iconfont iconfuhao1" v-if="viewList.length-1==index?true:false"  @click="clickTableAdd(item,index)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import mixins from 'components/mixins';
  import viewItem from './viewItem';
  import Vue from 'vue';
    export default {
      name: "viewPage",
      mixins: [mixins],
      components:{
        viewItem:viewItem
      },
      props:{
        addEditData:{
          type:Array,
          default:null
        }
      },
      data() {
        return {
          controlTypeValue:"",//预览值
          radio:"",//单选框,
          controlDate:"",//日期
          controlDateNew:new Date(),// 当前时间
          controlDateTimeNew:new Date(),//当前日期时间
          controlDateTime:"",//日期时间
          radioInputValue:"",//获取单选输入的值
          controlNumber:"",//数值框
          numberValue:"",// 数值框 代码集选择
          radioSelect:"",//单选下拉
          checkBoxInputValue:"",//获取多选下拉的值
          checkBoxSelect:"",//多选下拉
          radioKnowType:"",//代码集的判断
          CgatherKnowType:"",// 集合
          checkBox:[],//多选框
          // 数值框 选择内容
          numberList:[],
          viewList:[
            /*{
              "foldFlag": 1,
              "controlDisplayName": "控件显示12",
              "controlHeight": 2,
              "controlIsDefaultDateTime": 3,
              "controlIsExtend": 1,
              "labelContent": "标签",
              "controlName": "控件12",
              "controlTip": "提示",
              "controlType": "INPUT",
              "controlWidth": 2,
              "displayIsVisible": 0,
              "gatherKnowType": "2",
              "gatherRank": 1,
              "id": "402881056b4737ef016b4738cd9e0000",
              "numberIsSwitch": 0,
              "defaultValueFlag": null,
              "termDefaultValue": ["string"],
              "termGroupName": null,
              "termGroupOid": null,
              "termItemRspList": [],
              "unitName": "光年",
              "children": []
            }*/
            /*{
              "id": "",
              "controlName": "2",
              "controlDisplayName": "2",
              "controlType": "SINGLE_COMBOX",
              "displayIsVisible": 1,
              "baseProperty": {
                "controlWidth": "",
                "controlHeight": 0,
                "controlTip": "",
                "controlIsDefaultDateTime": 0,
                "controlIsExtend": "1",
                "controlLable": ""
              },
              "termSet": {
                "termGroupOid": "",
                "termGroupName": "",
                "termDefaultValue": [],
                "termItemList": []
              },
              "termUnit": {
                "numberIsSwitch": 1,
                "unitName": ""
              },
              "gatherKnowType": "",
              "gatherRank": 0,
              "children": []
            }*/
          ],
          addEditDataList:this.addEditData||[],
          loading:false,
        }
      },
      watch:{
        "controlTypeValue":val=>{
          console.log(val)
        },
        "$route":function(){
          this.viewList=[];
          if(this.$route.query.id===undefined){
            return ;
          }else{
            this.getPreviewData();
          }
        },
        "viewList":function(value){
          console.log("监听 渲染数据",value);
          if(value.length>0){
            if(value[0].controlType=='TABLE'){
              value[0].gatherIsVisible=1;
            }
            //处理 代码创建 下拉多选会传入空
            if(value[0].termSet.termDefaultValue[0]==""){
              value[0].termSet.termDefaultValue=[]
            }
          }
          // return this.viewList = value
        }
      },
      methods:{
        //单选添加
        addTermItemRspList(obj,index,radioInput){
          console.log(obj,index,radioInput)
          if(radioInput==undefined||radioInput==""){
            obj.termSet.termDefaultValue[0]="";
            return ;
          }else if(radioInput!==""){
            obj.termSet.termItemList.forEach((item,indx,array)=>{
              if(item.termItemName==radioInput){
                array.splice(indx,1)
                obj.termSet.termDefaultValue[0]="";
              }
            })
          }
          obj.termSet.termItemList.push({
            termItemName:radioInput
          })
          this.radioInputValue = "";
          this.checkBoxInputValue="";
        },
        //多选框事件
        addTermItemRspListCheckBox(obj,index,checkInput){
          console.log(obj,index,checkInput)
          if(checkInput.length<=0){
            obj.termSet.termDefaultValue=[];
            return ;
          }else if(checkInput.length>0){
            obj.termSet.termItemList.forEach((item,indx,array)=>{
              if(item.termItemName==checkInput[checkInput.length-1]){
                array.splice(indx,1)
                obj.termSet.termDefaultValue=[];
              }
            })
          }
          obj.termSet.termItemList.push({
            termItemName:checkInput[checkInput.length-1]
          })
        },
        //清空
        emptyList(obj,index){
          console.log(obj,index)
          obj.termSet.termDefaultValue = [];
        },
        //是否不详 事件
        changeRadioKnowType(obj,index,value){
          console.log(obj,index,value);
          if(value=='0'){
            obj.termSet.foldFlag = 0;
          }else if(value=='1'||value=='2'){
            obj.termSet.foldFlag = 1;
          }
        },
        //点击图标切换
        SwitchFolFlag(obj,value){
          console.log(obj,value)
          if(value===1){
            obj.termSet.foldFlag = 0;
          }else{
            obj.termSet.foldFlag = 1;
          }
        },
        //表格上下排列添加事件
        clickTableAdd(obj,index){
          console.log(obj,index);
          let copyData = Object.assign({},JSON.parse(JSON.stringify(obj)));
            copyData.gatherIsVisible = 0;
          this.viewList.push(copyData);
          console.log(this.viewList)
          // this.$set(this.viewList,index+1,copyData)

        },
        // 表格上下 排列删除事件
        clickTableDelete(obj,index){
          console.log(obj,index)
          if(index==0){
            this.viewList[index+1].gatherIsVisible = 1;
            this.viewList.splice(index,1)
          }else{
            this.viewList.splice(index,1)
          }
         /* if(index ===0){
            this.viewList[index].children = [];
            return ;
          }*/
          /*let ArrayList = []
          this.viewList.forEach(item=>{
            ArrayList.push(Object.assign({},JSON.parse(JSON.stringify(item))))
          })
          ArrayList.splice(index,1);
          this.$forceUpdate()
          this.$set(this.viewList,index,{})*/
        },
        //可扩展 下拉事件
        handleEnter(value){
          console.log("回车触发事件",value)
        },
        //表格 集合 清空操作
        emptyKnowType(obj,index) {
          console.log(obj,index)
          obj.gatherKnowType = "";
        },
        //获取预览参数
        async getPreviewData() {
          let that= this;
          let paramData = {
            id:that.$route.query.id
          }
          try{
            let data = await that.$http.crfPreviewForm(that.$format(paramData))
            console.log("预览参数",data.data);
            if(data.code ===0){
              that.viewList.push(data.data)
            }
          }catch (error) {
            this.$notify("预览数据获取失败");
            console.log(error)
          }
        }
      },
      created(){
      },
      mounted() {
        /*console.log(this.$route.query);
        this.getPreviewData();*/
        if(this.addEditDataList.length>0) {
            this.viewList.push(JSON.parse(JSON.stringify(this.addEditDataList[0])))
        }else{
          this.getPreviewData()
        }
      }
    }
</script>

<style lang="less" scoped>
/*  .view_container{
      padding: 20px 15px 0px 15px;
      !*min-height: 840px;*!
      overflow: hidden;
      .view_box{
        font-size: 20px;
        .view_title{
          margin-bottom:1%;
          margin-right:1%;
          float: left;
          i{
            cursor: pointer;
          }
        }
        .view_knowType{
          float: left;
        }
        .view_content{
          float: left;
          margin-left: 2%;
          width: 100%;
          vertical-align: middle;
          div{
            !*float: left;*!
          }
          .view_label{
            margin-right: 1%;
            font-size: 16px;
            float: left;
          }
          .view_type{
            margin-right: 1%;
            !*width:20%;*!
            float: left;
          }
          .view_unit{
            font-size:16px;
            margin-right: 1%;
            float: left;
          }
          .view_empty{
            font-size:16px;
            cursor:pointer;
            color:#2d8cf0 ;
            float: left;
          }
        }
      }
    }*/
/*.view_container {
  padding: 20px 15px 0px 15px;
  !*min-height: 840px;*!
  .view_box {
    font-size: 20px;
    float: left;
    width: 100%;
    margin: 5px 0;
    .view_title {
      width: 100%;
      margin-bottom: 1%;
      font-size:14px;
      color:#63666E;
      float: left;
      margin-right: 10%;
    }
    .view_content {
      float: left;
      margin-left: 2% !important;
      width: 100%;
      line-height: 35px;
      background-color:#F7F8FC;
      .view_label {
        margin-right: 1%;
        font-size: 16px;
        float: left;
        !*line-height: 35px;*!
        width: 10%;
        overflow: hidden;
      }
      .view_type {
        margin-right: 1%;
        float: left;
      }
      .width_auto_type{
        width: auto !important;
        .el-radio-group{
          .el-radio{
            margin-left:0;
          }
        }
        .el-checkbox-group{
          .el-checkbox{
            margin-right: 0;
          }
        }
      }
      .view_unit {
        font-size: 16px;
        margin-right: 1%;
        float: left;
        !*line-height: 35px;*!
      }
      .view_empty {
        font-size: 14px;
        cursor: pointer;
        color: #2d8cf0;
        float: left;
        !*line-height: 30px;*!
      }
    }
    .tb_content{
      background-color: #ffffff;
    }
    .bg_color{
      background-color: #F7F8FC !important;
    }
    .width_container{
      width: auto !important;
      background-color: #ffffff;
      border:1px solid #DEE2E5;
    }
  }
}*/
  /*修订后css 样式*/
.view_container{
  padding: 20px 15px 0 15px;
  .view_box{
    display: table;
    /*width: 100%;*/
    height: 100%;
    .view_title{
      display: table-cell;
      float: left;
      cursor: pointer;
      .iconfont{
        font-size: 16px;
        color: #356CBC;
      }
    }
    .view_knowType{
      display: table-cell;
      float: left;
      position: relative;
      z-index: 10;
      .el-radio-group{
        transform: translateY(3px);
        font-size: 12px;
        .el-radio{
          margin-left: 10px;
          margin-right: 0px;
        }
      }
      .empty{
        position: relative;
        top: 2px;
        left: 5px;
        color: #3C81F0;
        cursor: pointer;
      }
    }
    .view_content{
      display: table-row;
      .icon{
        font-size:14px;
        cursor:pointer;
        color: #3C81F0;
        .del{
          color: #F0433C;
        }
      }
      //输入框
      .view_label_input{
         display: table-cell;
         span{
           display: inline-block;
           padding-right: 80px;
           padding-left: 40px;
         }
       }
      //多行
      .view_label_textarea{
        display: table-cell;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left: 40px;
        }
      }
      //标签
      .view_label_label{
        display: table-cell;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      //日期
        .view_label_date{
          display: table-cell;
          span{
            display: inline-block;
            padding-right: 80px;
            padding-left:40px;
          }
        }
      //日期时间
      .view_label_time{
        display: table-cell;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      //数值框
      .view_label_number{
        display:table-cell;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      .view_unit{
        display: table-cell;
        padding-left: 5px;
      }
      .view_select{
        display: table-cell;
        width: 90px;
      }
      .view_type_number{
        display: table-cell;
        width: 90px;
      }
      //单选下拉
      .view_label_radioSelect{
        display:table-cell;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      .view_type_radioSelect{
        display: table-cell;
        width:170px
      }
      //多选下拉
      .view_label_checkBox{
        display:table-cell;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_checkBox{
        display:table-cell;
        width: 170px;
      }
      //单选按钮
      .view_label_radio_btn{
        display: table-cell;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_radio_btn{
        display: table-cell;
        max-width: 484px;
        .el-radio-group{
          .el-radio{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //多选按钮
      .view_label_checkBox_btn{
        display: table-cell;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_checkBox_btn{
        display:table-cell;
        max-width: 484px;
        .el-checkbox-group{
          .el-checkbox{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //全局样式
      .view_type{
        display: table-cell;
        padding-left: 10px;
      }
      //全局样式 清空
      .view_empty{
        display: table-cell;
        color:#3C81F0;
        font-size: 12px;
        padding-left: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
