<template>
  <div>
    <div v-if="index==0" style="display:table-row;text-align:center;line-height:30px">
      <div class="table_label" v-for="(item,order) in children" :key="order">
        <i v-if="crfCurrentControl.item==item" class="el-icon-edit"  style="color:#3b81f0"/>
        <span v-if="item.displayIsVisible=='1'">{{item.controlDisplayName}}</span>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
      </div>
    </div>
    <!--表格左右排列-->
    <i v-if="crfCurrentControl.index==index&&children.find(e=>e==crfCurrentControl.item)" class="el-icon-edit "  style="float:left;margin-left:-15px;margin-top:15px;color:#67C23A"/>
    <div v-if="report" class="arrangement_lr" style="display:table-row">
      
      <div  class="table_label" v-for="(it,order) in children" :key="order">
        <display-input v-if="it.controlType=='SINGLE_INPUT'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-multi-input
          v-else-if="it.controlType=='MULTI_INPUT'"
          :item="it"
          :showLabel="false"
        />
        <display-check-box v-else-if="it.controlType=='CHECKBOX'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-combox v-else-if="it.controlType=='SINGLE_COMBOX'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-date v-else-if="it.controlType=='DATE'" :item="it" :index="index" :report="getData(it)"/>
        <display-date-time v-else-if="it.controlType=='DATE_TIME'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-gather v-else-if="it.controlType=='GATHER'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-label v-else-if="it.controlType=='LABEL'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-multi-combox
          v-else-if="it.controlType=='MULTI_COMBOX'"
          :item="it"
          :index="index"
          :report="getData(it)"
          :showLabel="false"
        />
        <display-radio v-else-if="it.controlType=='RADIO_BUTTON'" :item="it" :index="index" :report="getData(it)" :showLabel="false"/>
        <display-number-input
          v-else-if="it.controlType=='NUMBER_INPUT'"
          :item="it"
          :index="index"
          :report="getData(it)"
          :showLabel="false"
        />
        
      </div>
      <div class="icon" style="width:50px;position:relative;top: 7px">
        <i
          class="iconfont iconfuhao4 del" style="font-size:17px"
          v-if="showDelete"
          @click="deleteRow()"
        ></i>
        <i
          class="iconfont iconfuhao1" style="font-size:17px"
          v-if="showAdd"
          @click="addRow()"
        ></i>
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
export default {
  name: "displayTableRow",
  props: {
    children: {},
    report: {},
    index: Number
  },
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
    displayRadio
  },
  methods:{
     //表格上下排列添加事件
    addRow(){
      this.$parent.addRow();
    },
    // 表格上下 排列删除事件
    deleteRow() {
      this.$parent.report.children.splice(this.index, 1);
    },
    //过滤报告数据
    getData(item) {
      let arr = this.report.children.filter(
        o => o.name == item.controlDisplayName
      );
      return arr[0];
    },
     //递归获取
    recureBindingInfo(){
      return this.$parent.recureBindingInfo();
    }
  },
  computed:{
    showAdd(){
       return this.$parent.report.children.length==(this.index+1);
    },
    showDelete(){
       return this.$parent.report.children.length!=1;
    },
    ...mapGetters([
      'crfCurrentControl',
      'crfBindingData'

    ])
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.table_label {
  background-color: #f7f8fc;
  margin-bottom: 2px;
  min-height: 38px;
  border: 1px solid #dee2e5;
  display: table-cell;
  width: 190px;
}
  .arrangement_lr .table_label{
    border:none;
    padding: 1px 0;
  }
</style>
