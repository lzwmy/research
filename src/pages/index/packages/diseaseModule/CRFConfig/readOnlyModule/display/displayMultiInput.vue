<template>
  <!--多行文本框-->
  <div :class="item.controlType">
    <!--style="width:200px;display:inline-block;font-size: 14px;"-->
    <div v-if="item.displayIsVisible=='1'&&showLabel" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
      <span v-show="item.baseProperty.isRequired"
            style="color: red;">*</span>
      <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />-->
      <span>{{item.controlDisplayName}}</span>
      <!--<i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>-->
    </div>
    <!--style="display:inline-block;vertical-align:middle"-->
    <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired},{'addColor':report.value},{'grayColor':!report.value}]"
         :data-type="item.controlType"
         :data-value="report.value">
      <!--<el-input
        :style="`width:${inputWidth}px`"
        type="textarea"
        :rows="item.baseProperty.controlHeight||1"
        v-model="report.value"
        @focus="onFocus"
        :placeholder="item.baseProperty.controlTip"
      ></el-input>-->
      {{report.value || '(空)'}}
    </div>
    <div class="info_fixed" style="display: table-cell;position: relative;">
      <i class="iconfont iconzu14" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
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
            <span v-if="it.path == item.controlName" :class="{'ml_7':index>0}">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
          </p>
        </div>
      </div>
    </div>
    <i class="remove_annotate" v-show="annotateProcess()" @click="emptyAnnotate">清空</i>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import eventBus from 'src/eventBus/bus.js';
import utils from 'components/utils/index.js';
export default {
  name: "displayMultiInput",
  data() {
    return {
      inputWidth: 188,
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

    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if (this.item.binding) {
      this.rootBinding = this.recureBindingInfo();
    }
  },
  methods: {
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
        rootBinding: this.rootBinding
      };
      this.$store.commit("CRF_CHANGE_CONTROL", ctrl);
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
    recureBindingInfo() {
      if (this.item.binding == 1) {
        if (this.item.baseProperty.bindingInfo.viewId == "INHERIT") {
          return this.$parent.recureBindingInfo();
        } else {
          return this.item;
        }
      }
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
.MULTI_INPUT {
}
.MULTI_INPUT .MULTI_INPUT_title {
  width: 188px;
  display: table-cell;
  vertical-align: middle;
  /*padding-left: 1%;*/
  font-size: 14px;
}
.MULTI_INPUT .singleColumn {
  width: auto;
  min-width: 188px;
  max-width: 500px;
  padding-right: 5px;
}
.MULTI_INPUT .MULTI_INPUT_box {
  display: table-cell;
}
</style>
