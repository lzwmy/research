<template>
  <div  class="gather_column">
    <div style="margin:15px"  v-for="(it,index) in children" :key="index">
      <display-input v-if="it.controlType=='SINGLE_INPUT'" :item="it" :report="getData(it)"/>
      <display-multi-input v-else-if="it.controlType=='MULTI_INPUT'" :item="it" :report="getData(it)"/>
      <display-check-box v-else-if="it.controlType=='CHECKBOX'" :item="it" :report="getData(it)"/>
      <display-combox v-else-if="it.controlType=='SINGLE_COMBOX'" :item="it" :report="getData(it)"/>
      <display-date v-else-if="it.controlType=='DATE'" :item="it" :report="getData(it)"/>
      <display-date-time v-else-if="it.controlType=='DATE_TIME'" :item="it" :report="getData(it)"/>
      <display-label v-else-if="it.controlType=='LABEL'" :item="it" :report="getData(it)"/>
      <display-multi-combox v-else-if="it.controlType=='MULTI_COMBOX'" :item="it" :report="getData(it)"/>
      <display-radio v-else-if="it.controlType=='RADIO_BUTTON'" :item="it" :report="getData(it)"/>
      <display-number-input v-else-if="it.controlType=='NUMBER_INPUT'" :item="it" :report="getData(it)"/>
    </div>
  </div>
</template>

<script>
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
  name: "displayGatherColumn",
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.gather_column{
  display: table-cell;
}
</style>
