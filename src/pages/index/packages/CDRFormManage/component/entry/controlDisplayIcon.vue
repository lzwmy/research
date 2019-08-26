<template>
    <div class="display_control_box">
      <!--标签-->
      <div class="display_control_box" v-if="controlType=='LABEL'">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--单行文本框-->
      <div class="display_control_box" v-if="controlType==='SINGLE_INPUT'? true :false">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--多行文本域-->
      <div class="display_control_box" v-if="controlType === 'MULTI_INPUT'? true : false">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--日期-->
      <div class="display_control_box" v-if="controlType === 'DATE'? true : false">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--日期时间-->
      <div class="display_control_box" v-if="controlType === 'DATE_TIME'? true : false">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--数值-->
      <div class="display_control_box" v-if="controlType === 'NUMBER_INPUT'? true :false">
        <!--@change="changeUnitValue(unitValue)"-->
        <el-select v-if="termUnit.numberIsSwitch === 1?true:false"
                   v-model="termUnit.unitName"
                   size="mini"
                   placeholder="选择单位">
          <el-option v-for="item in unitList"
                     :key="item.id"
                     :label="item.unitName"
                     :value="item.unitName"></el-option>
        </el-select>
        <el-input v-if="termUnit.numberIsSwitch===0?true:false"  v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--设置代码集-->
        <i class="iconfont iconzidian" v-if="termUnit.numberIsSwitch===0?true:false"  @click="clickCodeSet(item,index)"></i>
        <!--切换-->
        <i class="iconfont iconzujian"  @click="clickSwitch(item,unitState)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--单选下拉-->
      <div class="display_control_box" v-if="controlType ==='SINGLE_COMBOX'?true:false">
        <el-input v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置代码集-->
        <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--多选下拉-->
      <div class="display_control_box" v-if="controlType ==='MULTI_COMBOX'?true:false">
          <el-input v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
          <!--设置代码集-->
          <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
          &lt;!&ndash;上移&ndash;&gt;
          <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
          &lt;!&ndash;下移&ndash;&gt;
          <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
        </div>
      <!--单选框-->
      <div class="display_control_box" v-if="controlType==='RADIO_BUTTON'?true:false">
        <el-input v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置代码集-->
        <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--多选框-->
      <div class="display_control_box" v-if="controlType==='CHECKBOX'?true:false">
        <el-input v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置代码集-->
        <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--集合-->
      <div class="display_control_box" v-if="controlType==='GATHER'? true : false">
        <el-select v-model="gatherRankSate"
                   size="mini"
                   placeholder="选择排列方式"
                   @change="changeGatherRankSate(gatherRankSate)">
          <el-option v-for="item in layoutList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
        <el-input-number v-if="gatherRankSate=='1'?true:false"
                         v-model="gatherColumnNumberValue"
                         controls-position="right"
                         size="mini"
                         :min="2"
                         :max="5"
                         @change="changeGatherColumnNumber(gatherColumnNumberValue)">
        </el-input-number>
        <el-select v-model="gatherKnowType"
                   size="mini"
                   placeholder="是否不详"
                   @change="changeGatherKnowType(gatherKnowType)">
          <el-option label="无" :value="0"></el-option>
          <el-option label="有无" :value="1"></el-option>
          <el-option label="是否不详" :value="2"></el-option>
        </el-select>
        <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <i class="iconfont iconfuhao1"  @click="addEntryData()"></i>
      </div>
      <!--表格-->
      <div class="display_control_box" v-if="controlType==='TABLE'? true : false">
        <el-select v-model="gatherRankSate"
                   size="mini"
                   placeholder="选择排列方式"
                   @change="changeGatherRankSate(gatherRankSate)">
          <el-option v-for="item in layoutList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
        <el-select v-model="gatherKnowType"
                   size="mini"
                   placeholder="是否不详"
                   @change="changeGatherKnowType(gatherKnowType)">
          <el-option label="无" :value="0"></el-option>
          <el-option label="有无" :value="1"></el-option>
          <el-option label="是否不详" :value="2"></el-option>
        </el-select>
        <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <i class="iconfont iconfuhao1"  @click="addEntryData()"></i>
      </div>
      <!--文件上传-->
      <div class="display_control_box" v-if="controlType ==='FILE_UPLOAD'?true:false">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--超链接-->
      <div class="display_control_box" v-if="controlType==='linkURL'?true:false">
        <!--是否显示-->
        <i class="iconfont iconfuhao2 gray" v-if="isVisible === 0 ? true : false"  @click="clickIsRequired(item,isVisible)"></i>
        <i class="iconfont iconfuhao2" v-if="isVisible === 1 ? true : false" @click="clickIsRequired(item,isVisible)"></i>
        <!--设置-->
        <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
        <!--删除-->
        <!--<i class="iconfont iconfuhao4 del" v-if="childrenList >= 0 ? true:false"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5" v-if="childrenList >= 0 ? true:false"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6" v-if="childrenList >= 0 ? true:false" @click="clickMoveDown"></i>-->
      </div>
      <!--<el-select v-model="gatherRank"
                 size="mini"
                 placeholder="选择排列方式">
        <el-option v-for="item in layoutList"
                   :key="item.index"
                   :label="item.name"
                   :value="item.index"></el-option>
      </el-select>
      <el-select v-model="gatherKnowType"
                 size="mini"
                 placeholder="是否不详">
        <el-option label="无" value="0"></el-option>
        <el-option label="是否不详" value="1"></el-option>
        <el-option label="有无" value="2"></el-option>
      </el-select>
      <el-select v-model="termUnit.unitName"
                 size="mini"
                 placeholder="选择单位">
        <el-option v-for="item in unitList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <el-input v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
      &lt;!&ndash;是否显示&ndash;&gt;
      <i class="iconfont iconfuhao2 gray"  @click="clickIsRequired(item)"></i>
      <i class="iconfont iconfuhao2"  @click="clickIsRequired(item)"></i>
      &lt;!&ndash;设置代码集&ndash;&gt;
      <i class="iconfont iconfuhao"  @click="clickCodeSet"></i>
      &lt;!&ndash;设置&ndash;&gt;
      <i class="iconfont iconfuhao7"  @click="clickSet()"></i>
      &lt;!&ndash;添加&ndash;&gt;
      <i class="iconfont iconfuhao1"  @click="addEntryData()"></i>
      &lt;!&ndash;删除&ndash;&gt;
      <i class="iconfont iconfuhao4 del"  @click="delEntryData"></i>
      &lt;!&ndash;上移&ndash;&gt;
      <i class="iconfont iconfuhao5"  @click="clickMoveUp"></i>
      &lt;!&ndash;下移&ndash;&gt;
      <i class="iconfont iconfuhao6"  @click="clickMoveDown"></i>
      &lt;!&ndash;切换按钮&ndash;&gt;
      <i class="iconfont iconzujian"  @click="clickSwitch()"></i>-->
    </div>
</template>

<script>
    export default {
      name: "controlDisplayIcon",
      props:{
        controlType:{
          type:String,
          default:null
        },
        gatherKnowType:{
          type:Number,
        },
        gatherRank:{
          type:Number
        },
        termUnit:{
          type:Object
        },
        termSet:{
          type:Object
        },
        displayIsVisible:{
          type:Number
        },
        gatherColumnNumber:{
          type:Number
        },
        countData:{
          type:Array
        },
        index:{
          type:Number
        },
        children:{
          type:Array
        },
        item:{
          type:Object
        }
      },
      data() {
        return {
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
          isVisible:this.displayIsVisible, //显示隐藏
          dataList:this.countData,
          // gatherKnowTypeValue:this.gatherKnowType,//有无不详
          unitValue:this.termUnit.unitName,//单位选择
          unitState:this.termUnit.numberIsSwitch,// 单位状态 0 隐藏 1 显示
          gatherRankSate:this.gatherRank,//排列方式
          gatherColumnNumberValue:this.gatherColumnNumber
        }
      },
      computed:{
        "childrenList":function () {
          console.log(this.children)
          return this.children.length;
        },
      },
      watch:{
        "controlType":function (value) {
          console.log("监听 controlType",value)
          if(value=="GATHER"||value=="TABLE"){
              this.gatherColumnNumberValue = 2;
              // this.gatherKnowTypeValue = 0;
            return this.gatherRankSate = 0;
          }
        }
      },
      methods:{
        //条目显示名称 是否必填
        clickIsRequired(obj,value){
          console.log("条目显示名称是否必填",obj,value)
          if(value === 0){
            this.isVisible = 1;
          }else{
            this.isVisible = 0;
          }
          obj.displayIsVisible =this.isVisible;
          let callbackData={
            obj:obj,
            index:value
          }
         this.$emit('status-IsVisible',callbackData)
        },
        changeGatherKnowType(value){
          console.log("是否不详",value);
          let gatherKnowType = value;
          this.item.gatherKnowType = gatherKnowType;
          if(value=='0'){
            this.item.gatherKnowTypeIsVisible = 0;
          }else{
            this.item.gatherKnowTypeIsVisible = 1;
          }
          let callbackData={
            obj:this.item,
            index:this.index
          }
          console.log(callbackData)
          this.$emit("status-gatherKnowType",callbackData)
        },
        changeGatherColumnNumber(value){
          console.log("集合列 事件",value)
          let gatherColumnNumberValue = value
          this.item.gatherColumnNumber = gatherColumnNumberValue
          let callbackData = {
            obj:this.item,
            index:this.index
          }
          this.$emit("status-gatherColumnNumber",callbackData)
        },
        changeGatherRankSate(value){
          console.log("排列方式",value);
          let gatherRankValue = value;
          this.item.gatherRank = gatherRankValue;
          let callbackData = {
            obj:this.item,
            index:this.index
          }
          this.$emit("status-gatherRank",callbackData)
        },
        //代码集
        clickCodeSet(obj,index) {
          console.log("代码集",obj,index)
          let callbackData = {
            obj:obj,
            type:this.controlType,
            index:index
          }
          this.$emit("status-CodeSet",callbackData)
        },
        //设置
        clickSet(obj,index){
          console.log('设置');
          console.log('设置',obj,index);
          // this.typeSwitch(obj,index)
          let callbackData = {
            obj:obj,
            type:this.controlType,
            index:index
          }
          this.$emit('status-set',callbackData)
        },
        //添加
        addEntryData(){
          console.log("图标内外传 显示弹框");
          let callbackData={
            obj:this.item,
            selectType:this.controlType,
            index:this.index
          }
          this.$emit("status-addList",callbackData)
        },
        //切换
        clickSwitch(obj,value) {
          console.log('切换',obj,value);
          if(value === 0 ){
            this.unitState = 1;
          }else{
            this.unitState = 0;
          }
          obj.termUnit.numberIsSwitch =this.unitState;
          let callbackData = {
            obj:obj,
            index:value
          }
          // this.$emit("status-switch",callbackData)
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
        //获取单位列表
        async UnitListOrg() {
          let that = this;
          try{
            let data = await that.$http.crfUnitList()
            console.log(data)
            if(data.code ===0){
              that.unitList = data.data
            }
          }catch (error) {
            that.$notice("获取单位列表数据失败");
            console.log(error);
          }
        }
      },
      created() {
        this. UnitListOrg();
      },
      mounted(){
        console.log(this.item,this.gatherRankSate)
      }
    }
</script>

<style lang="less" scoped>
.display_control_box{
  display:inline-block;
  position:relative;
  top:-3px;
  .modify_width{
    width:200px;
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
  i{
    cursor:pointer;
  }
}
</style>
