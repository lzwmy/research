<template>
  <!--单选框-->
  <div class="view_box">
    <div :class="item.controlType">
      <!--style="width:200px;font-size: 14px;"-->
      <div v-if="item.displayIsVisible=='1'&&showLabel" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'},{'single_row':item.baseProperty.layout.wrap == 1}]">
        <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />-->
        <span>{{item.controlDisplayName}}</span>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
      </div>
      <!--:class="['view_type_radio_btn',{'width_auto_type':item.controlType=='RADIO_BUTTON'}]"-->
      <!--{{item.baseProperty.layout}}-->
      <div :class="[item.controlType+'_box',{'RADIO_BUTTON_single_line':item.baseProperty.layout.columns==1},{'single_row':item.baseProperty.layout.wrap == 1}]" @click="onFocus">
        <el-radio-group v-model="report.value">
          <el-radio
            v-for="(it,index) in item.termSet.termItemList"
            :label="it.termItemName"
            :key="index"
          >
            <div v-if="it.termItemName == '其他'" style="display: contents">{{it.termItemName}}</div>
            <el-input  v-if="it.termItemName == '其他'&&item.baseProperty.controlIsExtend && report.value == '其他'"  v-model="report.value2" ></el-input>
          </el-radio>
          <!--<el-radio label="其他" v-if="item.baseProperty.controlIsExtend ">其他</el-radio>-->
        </el-radio-group>
      </div>

      <div :class="[item.controlType+'_empty',{'empty_single-box':item.baseProperty.layout.columns==1},{'single_row_empty':item.baseProperty.layout.wrap == 1}]" @click="resetData">清空</div>
    </div>
    <!--{{item.baseProperty.controlIsExtend}}-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "displayRadio",
  data() {
    return {
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
    resetData() {
      this.report.value = "";
      this.report.value2 = "";
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
    },
    //处理 ^
    precessData(data) {
      if(data.indexOf('^')!='-1') {
        return data.split('^')[0]
      }else {
        return data
      }
    }
  },
  created() {
    this.report.value =
      this.report.value || this.item.termSet.termDefaultValue[0];

    //加载术语集
    //  if(this.item.termSet.termGroupOid){
    //   this.initTermList();
    // }

    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if (this.item.binding) {
      this.rootBinding = this.recureBindingInfo();
    }
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
<style scoped>
.RADIO_BUTTON {
  /*line-height: 32px;*/
}
.RADIO_BUTTON .RADIO_BUTTON_title {
  width: 188px;
  display: table-cell;
  font-size: 14px;
  vertical-align: middle;
  /*padding-left: 1%;*/
}
/*情况为单列时文字过长*/
.RADIO_BUTTON .singleColumn {
  width: auto;
  min-width: 188px;
  /*max-width: 500px;*/
  padding-right: 5px;
  vertical-align: top;
}
.RADIO_BUTTON .RADIO_BUTTON_box {
  min-width: 164px;
  /*max-width: 800px;*/
  display: table-cell;

}
.RADIO_BUTTON .RADIO_BUTTON_box .el-radio-group {
  min-width: 164px;
  /*max-width: 800px;*/
}
.RADIO_BUTTON .RADIO_BUTTON_box .el-radio-group .el-radio {
  margin-right: 10px;
  margin-left: 0;
}
.RADIO_BUTTON .RADIO_BUTTON_empty {
  min-width: 24px;
  display: table-cell;
  color: #3c81f0;
  cursor: pointer;
  /*vertical-align: middle;*/
  vertical-align: top;
}
</style>
