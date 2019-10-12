<template>
  <!--多选框-->
  <div class="view_box">
    <div :class="item.controlType">
      <!--style="width:200px;font-size: 14px;"-->
      <div v-if="item.displayIsVisible=='1'&&showLabel" :class="item.controlType+'_title'">
        <i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />
        <span>{{item.controlDisplayName}}</span>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
      </div>
      <!--['view_type_checkBox_btn',{'width_auto_type':item.controlType=='CHECKBOX'}]-->
      <div :class="item.controlType+'_box'" @click="onFocus">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(it,index) in item.termSet.termItemList"
            :label="it.termItemName"
            :key="index"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <div :class="item.controlType+'_empty'" @click="()=>{checkList=[];report.value='';}">清空</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "displayCheckBox",
  data() {
    return {
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
      //将当前控件传递进去
      let ctrl = {
        item: this.item,
        index: this.index,
        bindingInfo: this.rootBinding
      };
      this.$store.commit("CRF_CHANGE_CONTROL", ctrl);
    },
    //递归获取
    recureBindingInfo() {
      if (this.item.binding == 1) {
        if (this.item.baseProperty.bindingInfo.bindingType == "INHERIT") {
          return this.$parent.recureBindingInfo();
        } else {
          return this.item;
        }
      }
    }
  },
  created() {
    // this.termValue=this.item.termSet.termDefaultValue;
    this.checkList = this.item.termSet.termDefaultValue;
    if (this.report.value) {
      
      this.checkList = this.report.value.split("|");
    }
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if (this.item.binding) {
      this.rootBinding = this.recureBindingInfo();
    }
    //初始化术语代码集
    // if(this.item.termSet.termGroupOid){
    //   this.initTermList();
    // }
    //判断 值域是否等于空
    if(this.item.termSet.rangeText!==""){
      let arrayList = this.item.termSet.rangeText.split('\n').map(item=>{
        return {termItemName:item}
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
    },
    checkList: "change"
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.CHECKBOX {
  /*line-height: 32px;*/
}
.CHECKBOX .CHECKBOX_title {
  width: 188px;
  display: table-cell;
  vertical-align: middle;
  /*padding-left: 1%;*/
  font-size: 14px;
}
.CHECKBOX .CHECKBOX_box {
  min-width: 164px;
  max-width: 800px;
  display: table-cell;
}
.CHECKBOX .CHECKBOX_box .el-checkbox-group {
  min-width: 164px;
  max-width: 800px;
}
.CHECKBOX .CHECKBOX_box .el-checkbox-group .el-checkbox {
  margin-right: 10px;
  margin-left: 0;
}
.CHECKBOX .CHECKBOX_empty {
  min-width: 24px;
  display: table-cell;
  color: #3c81f0;
  cursor: pointer;
  vertical-align: middle;
}
</style>
