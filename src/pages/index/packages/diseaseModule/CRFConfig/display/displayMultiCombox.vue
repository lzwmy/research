<template>
  <!--多选下拉-->
  <div :class="item.controlType">
    <!--style="width:200px;display:inline-block;font-size: 14px;"-->
    <div v-if="item.displayIsVisible=='1'&&showLabel" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
      <span v-show="item.baseProperty.isRequired"
            style="color: red;">*</span>
      <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />-->
      <span >{{item.controlDisplayName}}</span>
      <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
    </div>
    <!--style="display:inline-block"-->
    <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired}]"
         v-if="item.baseProperty.controlIsExtend=='1'"
         :data-IsExtend="item.baseProperty.controlIsExtend"
         :data-type="item.controlType"
         :data-value="report.value">
      <el-select
        :style="`width:${inputWidth}px`"
        v-model="checkList"
        allow-create
        filterable
        default-first-option
        multiple
        size="small"
        placeholder="请选择"
        @change="change"
      >
        <el-option
          v-for="item in item.termSet.termItemList"
          :key="item.termItemName"
          :label="item.termItemName"
          :value="item.termItemName"
        ></el-option>
      </el-select>
    </div>
    <!--style="display:inline-block"-->
    <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired}]"
         v-if="item.baseProperty.controlIsExtend=='0'"
         :data-IsExtend="item.baseProperty.controlIsExtend"
         :data-type="item.controlType"
         :data-value="report.value">
      <el-select
        :style="`width:${inputWidth}px`"
        v-model="checkList"
        size="small"
        multiple
        placeholder="请选择"
        @change="change"
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
  name: "displayMultiCombox",
  data() {
    return {
      inputWidth: 188,
      checkList: [],
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
    change() {
      this.report.value = this.checkList.join("|");
    },
    //处理 ^
    precessData(data) {
      if(data != undefined && data != 'undefined'){
        if(data.indexOf('^')!='-1') {
          return data.split('^')[0]
        }else {
          return data
        }
      }else {
        return  data
      }
    },
    //加载术语集
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
    }
  },
  created() {
    if (this.item.baseProperty.controlWidth > 0) {
      this.inputWidth = 47 * this.item.baseProperty.controlWidth;
    }

    if (!this.report.value) {
      this.checkList = this.item.termSet.termDefaultValue;
      this.report.value = this.checkList.join("|");
    }else if(this.report.value !== "") {
      if(this.report.value.indexOf('|')!== '-1') {
        this.checkList = this.report.value.split('|').map(item => this.precessData(item));
      }
    }

    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if (this.item.binding) {
      this.rootBinding = this.recureBindingInfo();
    }
    //加载术语集
    //  if(this.item.termSet.termGroupOid){
    //   this.initTermList();
    // }
    //判断 值域是否等于空
    if(this.item.termSet.rangeText!==""){
      let arrayList = this.item.termSet.rangeText.split('\n').filter(item => {
        return item !== ""
      }).map(item=>{
        return {termItemName:this.precessData(item)}
      });
      this.item.termSet.termItemList = arrayList;
    }
  },
  computed: {
    ...mapGetters(["crfCurrentControl", "crfBindingData"])
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
        this.checkList = newer[this.item.bindingColumn].split("|");
      } else {
        //如果控件名称不符合，则判断数据绑定是否拥有继承关系，如果有则判断继承关系是否满足
        if (
          this.item.binding == 1 &&
          this.rootBinding == this.crfCurrentControl.rootBinding &&
          this.index == this.crfCurrentControl.index
        ) {
          this.report.value = newer[this.item.bindingColumn];
          this.checkList = newer[this.item.bindingColumn].split("|");
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.MULTI_COMBOX {
}
.MULTI_COMBOX .MULTI_COMBOX_title {
  width: 188px;
  display: table-cell;
  /*padding-left: 1%;*/
  font-size: 14px;
}
.MULTI_COMBOX .singleColumn {
  width: auto;
  min-width: 188px;
  max-width: 500px;
  padding-right: 5px;
}
.MULTI_COMBOX .MULTI_COMBOX_box {
  width: 188px;
  display: table-cell;
}
.MULTI_COMBOX .MULTI_COMBOX_box .el-input .el-input__inner {
  width: 188px;
}
</style>
