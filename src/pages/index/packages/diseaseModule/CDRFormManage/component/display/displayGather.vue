<template>
  <!--集合-->
  <div class="view_box" >
      <div class="view_title" style="width:250px;display:inline-block;">
        <!--加号-->
        <i v-if="isFold" class="iconfont iconzu" :class="{iconGray:iconActive}" @click="changeExpend(0)"></i>
        <!--减号-->
        <i v-if="!isFold" class="iconfont iconzu2" @click="changeExpend(1)"></i>
        <strong>{{item.controlDisplayName}}</strong>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
      </div>
      <div class="view_knowType" v-if="item.gatherKnowType>0">
        <el-radio-group v-model="report.value">
          <el-radio v-if="item.gatherKnowType==2" label="是"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="否"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="不详"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="有"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="无" @change="changeRadioKnowType(1)"></el-radio>
        </el-radio-group>
        <span class="empty" @click="()=>{report.value=null;isFold=true}">清空</span>
      </div>
    <div v-if="!isFold"  :class="['view_content',{'width_container':item.gatherRank=='1'}]">
      <!--集合上下排列-->
      <div :class="item.controlType+'_bg_color'" style="padding-left:55px;" v-if="item.gatherRank=='0'"  @click="popMehtod">
        <div  style="margin-top:15px" v-for="(it,index) in item.children" :key="index">
          <display-input v-if="it.controlType=='SINGLE_INPUT'" :item="it" :report="getData(it)"/>
          <display-multi-input v-else-if="it.controlType=='MULTI_INPUT'" :item="it" :report="getData(it)"/>
          <display-check-box v-else-if="it.controlType=='CHECKBOX'" :item="it" :report="getData(it)"/>
          <display-combox v-else-if="it.controlType=='SINGLE_COMBOX'" :item="it" :report="getData(it)"/>
          <display-date v-else-if="it.controlType=='DATE'" :item="it" :report="getData(it)"/>
          <display-date-time v-else-if="it.controlType=='DATE_TIME'" :item="it" :report="getData(it)"/>
          <display-gather v-else-if="it.controlType=='GATHER'" :item="it" :report="getData(it)"/>
          <display-label v-else-if="it.controlType=='LABEL'" :item="it"/>
          <display-multi-combox v-else-if="it.controlType=='MULTI_COMBOX'" :item="it" :report="getData(it)"/>
          <display-radio v-else-if="it.controlType=='RADIO_BUTTON'" :item="it" :report="getData(it)"/>
          <display-table v-else-if="it.controlType=='TABLE'" :item="it" :report="getData(it)"/>
          <display-number-input v-else-if="it.controlType=='NUMBER_INPUT'" :item="it" :report="getData(it)"/>
        </div>
      </div>

      <!--集合左右排列-->
      <div :style="`width:${inputWidth}px`" style="padding:10px 5px 15px 20px;" v-if="item.gatherRank=='1'">
        <!--padding:0 10px 0 10px;-->
        <display-gather-column
          style="background:#F7F8FC;margin-right:10px"
          v-for="colNum in item.gatherColumnNumber "
          :key="colNum"
          :children="getColumnItems(colNum)"
          :report="report"
        ></display-gather-column>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import displayInput from "./displayInput";
import displayMultiInput from "./displayMultiInput";
import displayCheckBox from "./displayCheckBox";
import displayCombox from "./displayCombox";
import displayDate from "./displayDate";
import displayDateTime from "./displayDateTime";
import displayLabel from "./displayLabel";
import displayMultiCombox from "./displayMultiCombox";
import displayNumberInput from "./displayNumberInput";
import displayRadio from "./displayRadio";
import displayTable from "./displayTable";
import displayGather from "./displayGather";
import displayGatherColumn from "./displayGatherColumn";
export default {
  name: "displayGather",
  components: {
    displayInput,
    displayMultiInput,
    displayCheckBox,
    displayCombox,
    displayDate,
    displayDateTime,
    displayLabel,
    displayMultiCombox,
    displayNumberInput,
    displayRadio,
    displayTable,
    displayGather,
    displayGatherColumn
  },
  data() {
    return {
      isFold: false,
      gatherTermValue: null,
      inputWidth:443*this.item.gatherColumnNumber,
      rootBinding:null//父元素绑定信息
    };
  },
  props: {
    item: {},
    report: {},
    index: Number
  },
  computed: {
    iconActive:function(){
      return this.item.gatherKnowType>0&&!this.gatherTermValue>0
    },
    ...mapGetters([
      'crfCurrentControl',
      'crfBindingData'

    ])
  },
  methods: {
    getColumnItems: function(number) {
      let newArr = [];
      for (let i = 0; i < this.item.children.length; i++) {
        if (number == (i % this.item.gatherColumnNumber) + 1) {
          newArr.push(this.item.children[i]);
        }
      }
      return newArr;
    },
    //是否不详 事件
    changeRadioKnowType(value) {
      this.isFold = value;
    },
    //点击图标切换
    changeExpend(value) {
      //如果gatherKnowType>0则由gatherTermValue来控制是否收缩
      
      if (this.item.gatherKnowType > 0 && this.gatherTermValue > 0) {
        this.isFold = value;
      } else if (this.item.gatherKnowType == 0) {
        this.isFold = value;
      }
    },
     //过滤报告数据
    getData(item) {
      let arr = this.report.children.filter(
        o => o.name == item.controlDisplayName
      );
      return arr[0];
    },
    //
    setWidth() {
      return 'width:'+this.item.gatherColumnNumber*this.inputWidth+'px'
    },
    popMehtod(){
      // alert("pop");
    },
    onFocus(){
           //如果上次获取焦点控件为当前控件则直接返回,this.crfCurrentControl.index用来判断表格行数的
           if(this.item==this.crfCurrentControl.item&&this.index==this.crfCurrentControl.index){
             return;
           }
           //先进行数据初始化操作
           this.$store.commit('CRF_CHANGE_CONTROL',null);
           this.$store.commit('CRF_SET_DATA',null);
           //将当前控件传递进去
           let ctrl={item:this.item,index:this.index,rootBinding:this.rootBinding}
           this.$store.commit('CRF_CHANGE_CONTROL',ctrl);
      
    },
    //递归获取
    recureBindingInfo(){
      if(this.item.binding==1){
        if(this.item.baseProperty.bindingInfo.viewId=='INHERIT'){
           return this.$parent.recureBindingInfo();
        }else{
            return this.item;
        }
      }
    }
  },
  created() {
    if(this.item.gatherKnowType==null){
      this.item.gatherKnowType=0;
    }
    //初始化默认集合是否展开
    if(this.report.value&&(this.report.value=="有"||this.report.value=="是")){
        this.isFold = false;
    }
    else if (this.item.gatherFoldFlag == 1||this.item.gatherKnowType > 0) {
      this.isFold = true;
    }
    
    //初始化报告数据
    this.item.children.forEach(element => {
      let arr = this.report.children.filter(
        o => o.name == element.controlDisplayName
      );
      if (arr.length == 0) {
        let newObj = {
          name: element.controlDisplayName,
          value: "",
          children: []
        };
        this.report.children.push(newObj);
      }
    });
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if(this.item.binding){
      this.rootBinding=this.recureBindingInfo();
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconGray{
  color:gray
}
  .GATHER_bg_color{
    background-color: rgb(247, 248, 252);
  }
</style>
