<template>
  <!--单选下拉-->
  <div :class="item.controlType">
    <!--style="width:200px;display:inline-block;font-size: 14px;"-->
    <div v-if="item.displayIsVisible=='1'&&showLabel" :class="item.controlType+'_title'">
      <i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />
      <span>{{item.controlDisplayName}}</span>
      <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
    </div>
    <!--style="display:inline-block"-->
    <div :class="item.controlType+'_box'" v-if="item.baseProperty.controlIsExtend=='1'">

      <el-select
        filterable
        allow-create
        default-first-option
        :style="`width:${inputWidth}px`"
        size="small"
        v-model="report.value"
        @focus="onFocus"
        placeholder="请选择"
      >
        <el-option
          v-for="it in item.termSet.termItemList"
          :key="it.termItemName"
          :label="it.termItemName"
          :value="it.termItemName"
        ></el-option>
      </el-select>
    </div>
    <!--style="display:inline-block"-->
    <div :class="item.controlType+'_box'" v-if="item.baseProperty.controlIsExtend=='0'">
      <el-select
        filterable
        size="small"
        :style="`width:${inputWidth}px`"
        v-model="report.value"
        @focus="onFocus"
        placeholder="请选择"
      >
        <el-option
          v-for="it in item.termSet.termItemList"
          :key="it.termItemName"
          :label="it.termItemName"
          :value="it.termItemName"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "displayCombox",
  data() {
    return {
      inputWidth: 188,
      termList: [],
      rootBinding: null //父元素绑定信息
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
  methods: {
    //初始化术语代码集
    async initTermList() {
      try {
        let params = { termGroupId: this.item.termSet.termGroupOid };
        let result = await this.$http.reportSearchTermSet(this.$format(params));
        if (result && result.code == "0") {
          this.termList = result.data;
        }
      } catch (error) {
        this.$notice("获取" + this.item.controlDisplayName + "术语字典集失败");
        console.log(error);
      }
    },
    onFocus() {
      console.log("获取焦点");
      //如果上次获取焦点控件为当前控件则直接返回,this.crfCurrentControl.index用来判断表格行数的
      if (
        this.item == this.crfCurrentControl.item &&
        this.index == this.crfCurrentControl.index
      ) {
        return;
      }
      //先进行数据初始化操作
      this.$store.commit("CRF_CHANGE_CONTROL", null);
      this.$store.commit("CRF_SET_DATA", null);
      console.log("获取焦点更新");
      //将当前控件传递进去
      let ctrl = {
        item: this.item,
        index: this.index,
        rootBinding: this.rootBinding
      };
      this.$store.commit("CRF_CHANGE_CONTROL", ctrl);
    },
    //递归获取
    recureBindingInfo() {
      if (this.item.binding == 1) {
        if (this.item.baseProperty.bindingInfo.viewId == "INHERIT") {
          return this.$parent.recureBindingInfo();
        } else {
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
    }
  },
  created() {
    this.report.value =
      this.report.value || this.item.termSet.termDefaultValue[0];
    if (this.item.baseProperty.controlWidth > 0) {
      this.inputWidth = 47 * this.item.baseProperty.controlWidth;
    }
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    //this.$route.query.patientId判断是否是报告编辑模式下

    // if(this.item.binding&&this.$route.query.patientId){
    if(this.item.binding&&JSON.parse(sessionStorage.getItem('reportFill')).urlParameter.patientId){
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
    if(this.item.termSet.rangeText!==""){
      let arrayList = this.item.termSet.rangeText.split('\n').map(item=>{
        return {termItemName:item}
      });
      this.item.termSet.termItemList = arrayList;
    }

  },
  computed: {
    ...mapGetters([
      "crfCurrentControl",
      "crfBindingData",
      "crfIsNewReport",
      "crfPatientId"
    ])
  },
  watch: {
    crfBindingData: function(newer, older) {
      //如果传递null值过来则代表切换控件进行默认清空操作，方便交互处理，此处比较繁琐
      if (!newer) {
        return;
      }
      //判断参考信息触发的数据与当前控件名称是否相符合，如果符合则进行赋值
      if (
        this.crfCurrentControl.item == this.item &&
        this.index == this.crfCurrentControl.index
      ) {
        this.report.value = newer[this.item.bindingColumn];
      } else {
        //如果控件名称不符合，则判断数据绑定是否拥有继承关系，如果有则判断继承关系是否满足
        if (
          this.item.binding == 1 &&
          this.rootBinding == this.crfCurrentControl.rootBinding &&
          this.index == this.crfCurrentControl.index
        ) {
          //如果存在keyColumn则用keyColumn取值
           if(this.item.baseProperty.bindingInfo.keyColumn){
              this.report.value=newer[this.item.baseProperty.bindingInfo.keyColumn];
           }else{
              this.report.value=newer[this.item.bindingColumn];
           }
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.SINGLE_COMBOX {
}
.SINGLE_COMBOX .SINGLE_COMBOX_title {
  width: 188px;
  display: table-cell;
  /*padding-left: 1%;*/
  font-size: 14px;
}
.SINGLE_COMBOX .SINGLE_COMBOX_box {
  width: 188px;
  display: table-cell;
}
.SINGLE_COMBOX .SINGLE_COMBOX_box .el-input {
  width: 188px;
}
.SINGLE_COMBOX .SINGLE_COMBOX_box .el-input .el-input__inner {
  width: 188px;
}
</style>
