<template>
  <!--单行文本框-->
  <div :class="item.controlType" style="position: relative">
    <!--style="width:200px;display:inline-block;font-size: 14px;" -->
    <div  v-show="item.displayIsVisible=='1'&&showLabel" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
      <span v-show="item.baseProperty.isRequired"
            style="color: red;">*</span>
      <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit"  style="color:#3b81f0"/>-->
      <span >{{item.controlDisplayName}}</span>
      <!--<i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>-->
    </div>
    <!--style="display:inline-block"-->
    <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired},{'addColor':report.value},{'grayColor':!report.value}]">
      <!--<el-input
        size="small"
        v-model="report.value"
        @focus="onFocus"
        :placeholder="item.baseProperty.controlTip"
      ></el-input>-->
      {{report.value || '(空)'}}
    </div>
    <div class="info_fixed" style="display: table-cell;position: relative;">
      <i class="iconfont iconbianjibeifen2" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
      <i class="iconfont iconzu13" v-else  :class="[{'active_annotate':annotateProcess()}]" @click="commentMethod" ></i>
      <div class="info_tip_box" v-if="modifyDataProcess()">
        <i></i>
        <div class="tip_content" >
          <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
            <span v-if="it.path == item.controlName">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
          </p>
        </div>
      </div>
        <div class="info_tip_box" v-else-if="annotateProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(it,index) in $store.state.annotateData.annotateList" :key="index" >
              <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.content}}</span>
            </p>
            <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
              <span v-if="it.path == item.controlName">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
            </p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import eventBus from 'src/eventBus/bus.js';
import utils from 'components/utils/index.js';
export default {
  name: "displayInput",
  data() {
    return {
      fontSize: 30,
      labelWidth: 200,
      inputWidth: 100,
      rootBinding:null,//父元素绑定信息
      annotateStatus:false
    };
  },
  props: {
    item: {},
    report: {},
    showLabel:{
      type:Boolean,
      default:true
    },
    index: Number
  },
  created() {
    if (this.item.baseProperty.controlWidth > 0) {
      this.inputWidth = 47 * this.item.baseProperty.controlWidth;
    }
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    //this.$route.query.patientId判断是否是报告编辑模式下
    // if(this.item.binding&&this.$route.query.patientId){
    if(this.item.binding&&JSON.parse(localStorage.getItem('reportFill')).urlParameter.patientId){
      this.rootBinding=this.recureBindingInfo();
      //判断是否自动获取数据
      if(this.crfIsNewReport){
        let target=Object.assign({},this.item.baseProperty.bindingInfo);
        target.viewId=this.rootBinding.baseProperty.bindingInfo.viewId;
        target.viewColumn=this.rootBinding.baseProperty.bindingInfo.viewColumn;
        target.list.push(...this.rootBinding.baseProperty.bindingInfo.list);
        target.patientId=this.crfPatientId;
        if(!this.index||this.index==0){
            this.setAutoData(target);
        }
        
      }
    }

  },
  mounted() {
  },
  methods:{
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
    commentMethod() {
      let path = this.item.controlName;
      eventBus.$emit('display-show',path)
    },
    annotateProcess() {
      let find = false;
      let copyArray = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
      let array = utils.deleteObject(copyArray,'path');
      array.forEach(item => {
        if(item.path == this.item.controlName) {
          find = true;
          return ;
        }
      });
      return find;
    },
    modifyDataProcess() {
      let find = false;
      let copyArray = JSON.parse(JSON.stringify(this.$store.state.annotateData.modifyData));
      let array = utils.deleteObject(copyArray,'path');
      array.forEach(item => {
        if(item.path == this.item.controlName) {
          find = true;
          return ;
        }
      });
      let flag = this.annotateProcess();
      if(flag) {
        find = false;
      }
      return  find;
    },
    //递归获取数据
    recureBindingInfo(){
      if(this.item.binding==1){
        if(this.item.baseProperty.bindingInfo.viewId=='INHERIT'){
           return this.$parent.recureBindingInfo();
        }else{
            return this.item;
        }
      }
    },
    //自动获取数据
    async setAutoData(params) {
      try {
        let result = await this.$http.searchBindingAutoData(
          this.$format(params)
        );
        if (result && result.code == "0") {
          this.report.value = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

  },
  computed:{
    ...mapGetters([
      'crfCurrentControl',
      'crfBindingData',
      'crfIsNewReport',
      'crfPatientId',
    ]),
  },
  watch:{
    'crfBindingData':function(newer,older){
      //如果传递null值过来则代表切换控件进行默认清空操作，方便交互处理，此处比较繁琐
      if(!newer){
        return;
      }
      //判断参考信息触发的数据与当前控件名称是否相符合，如果符合则进行赋值
      if(this.crfCurrentControl.item==this.item&&this.index==this.crfCurrentControl.index){
            this.report.value=newer[this.item.bindingColumn];
      }else{
        //如果控件名称不符合，则判断数据绑定是否拥有继承关系，如果有则判断继承关系是否满足
         if(this.item.binding==1&&this.rootBinding==this.crfCurrentControl.rootBinding&&this.index==this.crfCurrentControl.index){
           //如果存在keyColumn则用keyColumn取值
           if(this.item.baseProperty.bindingInfo.keyColumn){
              this.report.value=newer[this.item.baseProperty.bindingInfo.keyColumn];
           }else{
              this.report.value=newer[this.item.bindingColumn];
           }
            
         }
      }
    },
   /* '$store.state.annotateData.annotateList':function (array) {
      // this.annotateProcess();
    }*/
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.SINGLE_INPUT {
}
.SINGLE_INPUT .SINGLE_INPUT_title {
  width: 188px;
  /*width: 85px;
  max-width: 188px;*/
  display: table-cell;
  /*padding-left: 1%;*/
  font-size: 14px;
  /*vertical-align: middle;*/
}
.SINGLE_INPUT .singleColumn {
  width: auto;
  min-width: 188px;
  max-width: 500px;
  padding-right: 5px;
}
.SINGLE_INPUT .SINGLE_INPUT_box {
  /* width: 188px; */
  display: table-cell;
  /*vertical-align: middle;*/
}
.SINGLE_INPUT .SINGLE_INPUT_box .el-input {
   min-width: 188px;
}
.SINGLE_INPUT .SINGLE_INPUT_box .el-input .el-input__inner {
  /* width: 188px; */
}
</style>
