<template>
  <!--日期时间-->
  <div :class="item.controlType">
    <!--style="width:200px;display:inline-block;font-size: 14px;"-->
    <div v-if="item.displayIsVisible=='1'&&showLabel" :class="item.controlType+'_title'">
      <i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />
      <span>{{item.controlDisplayName}}</span>
      <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
    </div>
    <!--style="display:inline-block"-->
    <div :class="item.controlType+'_box'">
      <el-date-picker
        v-model="report.value"
        size="mini"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        @focus="onFocus"
        placeholder="选择日期时间"
      ></el-date-picker>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "displayDateTime",
  data() {
    return {
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
  created() {
    if (this.item.baseProperty.controlWidth > 0) {
      this.inputWidth = 47 * this.item.baseProperty.controlWidth;
    }
    if (this.item.baseProperty.controlIsDefaultDateTime == "1") {
      this.report.value = this.report.value || new Date();
    }
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    //this.$route.query.patientId判断是否是报告编辑模式下
    if (this.item.binding && JSON.parse(sessionStorage.getItem('reportFill')).urlParameter.patientId) {
    // if (this.item.binding && this.$route.query.patientId) {
      this.rootBinding = this.recureBindingInfo();
      //判断是否自动获取数据
      if (this.crfIsNewReport) {
        let target = Object.assign({}, this.item.baseProperty.bindingInfo);
        target.viewId = this.rootBinding.baseProperty.bindingInfo.viewId;
        target.viewColumn = this.rootBinding.baseProperty.bindingInfo.viewColumn;
        target.list.push(...this.rootBinding.baseProperty.bindingInfo.list);
        target.patientId = this.crfPatientId;
        if (!this.index || this.index == 0) {
          this.setAutoData(target);
        }
      }
    }
  },
  methods: {
    onFocus() {
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
    },
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
          this.report.value = newer[this.item.bindingColumn];
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.DATE_TIME {
}
.DATE_TIME .DATE_TIME_title {
  display: table-cell;
  width: 188px;
  font-size: 14px;
  /*padding-left: 1%;*/
}
.DATE_TIME .DATE_TIME_box {
  width: 188px;
  display: table-cell;
}
.DATE_TIME .DATE_TIME_box .el-input .el-input__inner {
  width: 188px;
}
  .DATE_TIME .el-date-editor.el-input{
    width: 188px;
  }
</style>
