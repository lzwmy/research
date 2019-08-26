<template>
  <div>
    <div class="view_container_tud">
      <div v-for="(it,index) in children" :key="index" style="padding: 5px 0">
        <display-input v-if="it.controlType=='SINGLE_INPUT'" :item="it" :index="index" :report="getData(it)" />
        <display-multi-input
          v-else-if="it.controlType=='MULTI_INPUT'"
          :item="it"
          :index="index"
          :report="getData(it)"
        />
        <display-check-box v-else-if="it.controlType=='CHECKBOX'" :item="it" :index="index" :report="getData(it)" />
        <display-combox
          v-else-if="it.controlType=='SINGLE_COMBOX'"
          :item="it"
          :index="index"
          :report="getData(it)"
        />
        <display-date v-else-if="it.controlType=='DATE'" :item="it" :index="index" :report="getData(it)" />
        <display-date-time
          v-else-if="it.controlType=='DATE_TIME'"
          :item="it"
          :index="index"
          :report="getData(it)"
        />
        <display-label v-else-if="it.controlType=='LABEL'" :item="it" :index="index" :report="getData(it)" />
        <display-multi-combox
          v-else-if="it.controlType=='MULTI_COMBOX'"
          :item="it"
          :index="index"
          :report="getData(it)"
        />
        <display-radio v-else-if="it.controlType=='RADIO_BUTTON'" :item="it" :index="index" :report="getData(it)" />
        <display-number-input
          v-else-if="it.controlType=='NUMBER_INPUT'"
          :item="it"
          :index="index"
          :report="getData(it)"
        />
      </div>
    </div>
    <span class="icon" style="width:50px">
      <i
        class="iconfont iconfuhao4 del"
        style="font-size:17px"
        v-if="showDelete"
        @click="deleteRow()"
      ></i>
      <i class="iconfont iconfuhao1" style="font-size:17px" v-if="showAdd" @click="addRow()"></i>
    </span>
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
  name: "displayTableRow2",
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
  computed: {
    showAdd() {
      return this.$parent.report.children.length == this.index + 1;
    },
    showDelete() {
      return this.$parent.report.children.length != 1;
    }
  },
  methods: {
    //表格上下排列添加事件
    addRow() {
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
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table_label {
  background-color: #f7f8fc;
  margin-bottom: 2px;
  min-height: 38px;
  border: 1px solid #dee2e5;
  display: table-cell;
  width: 190px;
}
</style>
