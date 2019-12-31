<template>
  <!--数值框-->
  <div :class="item.controlType">
    <!--style="width:200px;display:inline-block;font-size: 14px;"-->
    <div v-if="item.displayIsVisible=='1'&&showLabel" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]" >
      <span v-show="item.baseProperty.isRequired"
            style="color: red;">*</span>
      <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit"  style="color:#3b81f0"/>-->
      <span >{{item.controlDisplayName}}</span>
      <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
    </div>
    <!--style="display:inline-block" :style="`width:${inputWidth}px`"-->
    <div :class="item.controlType+'_box'"  >
      <!--style="display:inline-block;width:50%"-->
      <div :class="[item.controlType+'_box_number',{isRequired:item.baseProperty.isRequired},{'addColor':report.value},{'grayColor':!report.value}]"
           :data-switch="item.termUnit.numberIsSwitch"
           :data-type="item.controlType"
           :data-value="report.value">
        <!--<el-input @change="changed" @focus="onFocus" size="small" placeholder="请输入" v-model.trim="inputValue"></el-input>-->
        {{report.value || "(空)"}}
      </div>
      <!--style="display:inline-block;width:48%"-->
      <div :class="[item.controlType+'_box_unitName',{'addColor':inputUnit},{'grayColor':!inputUnit}]"  v-if="item.termUnit.numberIsSwitch=='1'">
        {{inputUnit}}
      </div>
      <!--style="display:inline-block"-->
      <div :class="[item.controlType+'_box_select',{isRequired:item.baseProperty.isRequired},{'addColor':report.value2 },{'grayColor':!report.value2}]"  v-if="item.termUnit.numberIsSwitch=='0'"
           :data-switch="item.termUnit.numberIsSwitch"
           :data-type="item.controlType"
           :data-value2="report.value2">
        <!--<el-select @change="changed" v-model="inputUnit" size="small" @focus="onFocus" placeholder="请选择">
          <el-option
            v-for="it in item.termSet.termItemList"
            :key="it.termItemName"
            :label="it.termItemName"
            :value="it.termItemName"
          ></el-option>
        </el-select>-->
        {{report.value2 || "(空)"}}
      </div>
      <div class="info_fixed" style="display: table-cell;position: relative;">
        <i class="iconfont iconzu14" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
        <i class="iconfont iconzu13" v-else-if="showStatus()"  :class="[{'active_annotate':annotateProcess()}]" @click="commentMethod" ></i>
        <div class="info_tip_box" v-if="modifyDataProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(ita,indexa) in $store.state.annotateData.modifyData" :key1="indexa">
              <span v-if="ita.path == item.controlName">{{ita.createTime}} {{ita.creatorName}} 修改 "{{ita.oldData}}" 为 "{{ita.newData}}"</span>
            </p>
            <p v-for="(its,indexs) in $store.state.annotateData.answerList" :key2="indexs" >
              <span v-if="its.path == item.controlName" >{{its.createTime}} {{its.creatorName}} 回复 "{{its.content}}"</span>
            </p>
          </div>
        </div>
        <div class="info_tip_box" v-else-if="annotateProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(itd,indexd) in $store.state.annotateData.annotateList" :key3="indexd" >
              <span v-if="itd.path == item.controlName" >{{itd.createTime}} {{itd.creatorName}} 批注 "{{itd.content}}"</span>
            </p>
            <p v-for="(itf,indexf) in $store.state.annotateData.answerList" :key4="indexf" >
              <span v-if="itf.path == item.controlName" >{{itf.createTime}} {{itf.creatorName}} 回复  "{{itf.content}}"</span>
            </p>
            <p v-for="(itg,indexg) in $store.state.annotateData.modifyData" :key5="indexg">
              <span v-if="itg.path == item.controlName" :class="{'ml_7':indexg>0}">{{itg.createTime}} {{itg.creatorName}} 修改  "{{itg.oldData}}" 为 "{{itg.newData}}"</span>
            </p>
          </div>
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
  name: "displayNumberInput",
  data() {
    return {
      inputWidth: 168,
      inputValue:'',
      inputUnit:'',
      termList:[],
      rootBinding:null//父元素绑定信息
    };
  },
  props: {
    item: {},
    report: {},
    showLabel: {
      type: Boolean,
      default: true
    },
    index: Number
  },
  methods:{
    changed(){
      this.report.value=this.inputValue;
      this.report.value2=this.inputUnit;
    },
    //加载术语集
      async initTermList () {
      try {
        let params={termGroupId:this.item.termSet.termGroupOid};
        let result = await this.$http.reportSearchTermSet(this.$format(params));
        if (result && result.code == '0') {
          this.termList = result.data;
        }
      } catch (error) {
        this.$notice('获取'+this.item.controlDisplayName+'术语字典集失败');
        console.log(error);
      }
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
    showStatus () {
      let show = true;
      let annotateStatus = false;
      let modifyStatus = false;
      let anwerStatus = false;
      let annotateList = this.$store.state.annotateData.annotateList;
      let modifyData = this.$store.state.annotateData.modifyData;
      let answerList = this.$store.state.annotateData.answerList;
      if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
        if(annotateList.length || modifyData.length || answerList.length) {
          if(annotateList.length) {
            annotateList.forEach(item => {
              if(item.path == this.item.controlName) {
                annotateStatus = true;
                return ;
              }
            })
          }
          if(modifyData.length) {
            modifyData.forEach(item => {
              if(item.path == this.item.controlName) {
                modifyStatus = true;
                return ;
              }
            })
          }
          if(answerList.length) {
            answerList.forEach(item => {
              if(item.path == this.item.controlName) {
                anwerStatus = true;
                return ;
              }
            })
          }
          if(annotateStatus || modifyStatus || anwerStatus) {
            show = true;
          }else {
            show = false;
          }
        }else {
          show = false;
        }
      }else if(this.$store.state.annotateData.tipStatus  == 4 && this.$store.state.annotateData.isExamine == false) {
        if(annotateList.length || modifyData.length || answerList.length) {
          if(annotateList.length) {
            annotateList.forEach(item => {
              if(item.path == this.item.controlName) {
                annotateStatus = true;
                return ;
              }
            })
          }
          if(modifyData.length) {
            modifyData.forEach(item => {
              if(item.path == this.item.controlName) {
                modifyStatus = true;
                return ;
              }
            })
          }
          if(answerList.length) {
            answerList.forEach(item => {
              if(item.path == this.item.controlName) {
                anwerStatus = true;
                return ;
              }
            })
          }
          if(annotateStatus || modifyStatus || anwerStatus) {
            show = true;
          }else {
            show = false;
          }
        }else {
          show = false;
        }
      }else if(this.$store.state.annotateData.tipStatus  == 2 && this.$store.state.annotateData.isExamine == false) {
        if(annotateList.length || modifyData.length || answerList.length) {
          if(annotateList.length) {
            annotateList.forEach(item => {
              if(item.path == this.item.controlName) {
                annotateStatus = true;
                return ;
              }
            })
          }
          if(modifyData.length) {
            modifyData.forEach(item => {
              if(item.path == this.item.controlName) {
                modifyStatus = true;
                return ;
              }
            })
          }
          if(answerList.length) {
            answerList.forEach(item => {
              if(item.path == this.item.controlName) {
                anwerStatus = true;
                return ;
              }
            })
          }
          if(annotateStatus || modifyStatus || anwerStatus) {
            show = true;
          }else {
            show = false;
          }
        }else {
          show = false;
        }
      }else if(this.$store.state.annotateData.tipStatus  == 4 && this.$store.state.annotateData.isExamine == true ) {
        if(this.$store.state.annotateData.tipBtnText == '重新审核'&& this.$store.state.annotateData.tipBtnText != '') {
          show = false;
        }
      }
      return show;
    },
    commentMethod() {
      let flag = this.modifyDataProcess();
      if(flag) {
        if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
          return ;
        }else {
          let path = this.item.controlName;
          eventBus.$emit('display-show',path)
        }
      }else {
        let path = this.item.controlName;
        eventBus.$emit('display-show',path)
      }
      /*let path = this.item.controlName;
      eventBus.$emit('display-show',path)*/
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
      if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
        let answerList = this.$store.state.annotateData.answerList;
        if(answerList.length) {
          answerList.forEach(item => {
            if(item.path == this.item.controlName) {
              find = true;
              return ;
            }
          })
        }
      }
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
    emptyAnnotate() {
      let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
      if(copyData.length !== 0) {
        for(let i=0;i<copyData.length;i++) {
          if(copyData[i].path == this.item.controlName) {
            copyData.splice(i,1);
            i--;
          }
        }
        this.$store.dispatch('resetFun',copyData)
      }
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
    },
    //自动获取数据
    async setAutoData(params) {
      try {
        let result = await this.$http.searchBindingAutoData(
          this.$format(params)
        );
        if (result && result.code == "0") {
           this.inputValue=result.data;
            this.report.value=this.inputValue+"|"+this.inputUnit;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
   created() {
    if (this.item.baseProperty.controlWidth > 0) {
      this.inputWidth = 47 * this.item.baseProperty.controlWidth;
    }
     /*if(this.report.value&&this.report.value.indexOf('|')>0){
      /!*if(this.report.value&&this.report.value.indexOf('|')>0){
        this.inputValue=this.report.value.split('|')[0];
        this.inputUnit=this.report.value.split('|')[1];*!/

      }else{
       console.log('jindu')
        if(this.item.termUnit.numberIsSwitch==1){
          this.inputUnit=this.inputUnit||this.item.termUnit.unitName;
        }else{
          this.inputUnit=this.inputUnit||this.item.termSet.termDefaultValue[0];
        }
      }*/
     if(this.item.termSet.rangeText!==""){
       let arrayList = this.item.termSet.rangeText.split('\n').filter(item => {
         return item !== ""
       }).map(item=>{
         return {termItemName:item}
       });
       this.item.termSet.termItemList = arrayList;
     }

     if(this.item.termUnit.numberIsSwitch == 1) {
       this.inputValue = this.report.value || "";
       this.inputUnit=this.report.value2||this.item.termUnit.unitName;
     }else if(this.item.termUnit.numberIsSwitch == 0) {
       this.inputValue = this.report.value || "";
       this.inputUnit = this.report.value2 || this.item.termSet.termDefaultValue[0];
       // this.inputUnit=this.inputUnit||this.item.termSet.termDefaultValue[0];
     }
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    //this.$route.query.patientId判断是否是报告编辑模式下
    if(this.item.binding&&JSON.parse(localStorage.getItem('reportFill')).urlParameter.patientId){
    // if(this.item.binding&&this.$route.query.patientId){
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
     //判断 值域是否等于空

  },
  computed:{
    ...mapGetters([
      'crfCurrentControl',
      'crfBindingData',
      'crfIsNewReport',
      'crfPatientId'

    ])
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
             console.log(this.item.baseProperty.bindingInfo.keyColumn)
              let temp=newer[this.item.baseProperty.bindingInfo.keyColumn];
              this.inputValue=temp[this.item.bindingColumn]
              this.report.value=this.inputValue+"|"+this.inputUnit;
           }else{
             this.inputValue=newer[this.item.bindingColumn]||this.inputValue;
              this.report.value=this.inputValue+"|"+this.inputUnit;
           }
         }
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style scoped>
  .NUMBER_INPUT{

  }
  .NUMBER_INPUT .NUMBER_INPUT_title{
    width: 188px;
    /*width: 85px;
    max-width: 188px;*/
    display: table-cell;
    /*padding-left: 1%;*/
    font-size: 14px;
  }
  .NUMBER_INPUT .NUMBER_INPUT_box{
    min-width: 188px;
    display: table-cell;
  }
  .NUMBER_INPUT .singleColumn {
    width: auto;
    min-width: 188px;
    max-width: 500px;
    padding-right: 5px;
  }
  .NUMBER_INPUT .NUMBER_INPUT_box .NUMBER_INPUT_box_number{
    width: 84px;
    display: table-cell;
  }
  .NUMBER_INPUT .NUMBER_INPUT_box .NUMBER_INPUT_box_unitName{
    display: table-cell;
    padding-left: 1%;
    min-width: 104px;
  }
  .NUMBER_INPUT .NUMBER_INPUT_box .NUMBER_INPUT_box_select{
    width: 104px;
    display: table-cell;
    padding-left: 1%;
  }
</style>-->
