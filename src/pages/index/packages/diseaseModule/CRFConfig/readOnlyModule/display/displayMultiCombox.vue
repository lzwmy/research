<template>
  <!--多选下拉-->
  <div :class="item.controlType">
    <!--style="width:200px;display:inline-block;font-size: 14px;"-->
    <div v-if="item.displayIsVisible=='1'&&showLabel" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
      <span v-show="item.baseProperty.isRequired"
            style="color: red;">*</span>
      <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />-->
      <span >{{item.controlDisplayName}}</span>
      <!--<i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>-->
    </div>
    <!--style="display:inline-block"-->
    <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired},{'addColor':report.value},{'grayColor':!report.value}]"
         v-if="item.baseProperty.controlIsExtend=='1'"
         :data-IsExtend="item.baseProperty.controlIsExtend"
         :data-type="item.controlType"
         :data-value="report.value">
      <!--<el-select
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
          :label="precessData(item.termItemName)"
          :value="item.termItemName"
        ></el-option>
      </el-select>-->
      {{displayValue || '(空)'}}
    </div>
    <!--style="display:inline-block"-->
    <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired},{'addColor':report.value},{'grayColor':!report.value}]"
         v-if="item.baseProperty.controlIsExtend=='0'"
         :data-IsExtend="item.baseProperty.controlIsExtend"
         :data-type="item.controlType"
         :data-value="report.value">
      <!--<el-select
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
          :label="precessData(it.termItemName)"
          :value="it.termItemName"
        ></el-option>
      </el-select>-->
      {{displayValue || '(空)'}}
    </div>
    <div class="info_fixed" style="display: table-cell;position: relative;">
      <i class="iconfont iconbianjibeifen2" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
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
  name: "displayMultiCombox",
  data() {
    return {
      inputWidth: 188,
      checkList: [],
      termList: [],
      rootBinding: null, //父元素绑定信息
      displayValue:""
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
    /*if (this.item.baseProperty.controlWidth > 0) {
      this.inputWidth = 47 * this.item.baseProperty.controlWidth;
    }

    if (!this.report.value) {
      this.checkList = this.item.termSet.termDefaultValue;
      this.report.value = this.checkList.join("|");
    }else if(this.report.value !== "") {
      if(this.report.value.indexOf('|')!== '-1') {
        this.checkList = this.report.value.split('|');
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
        return {termItemName:item}
      });
      this.item.termSet.termItemList = arrayList;
    }*/
    if(this.report.value) {
      if(this.report.value.indexOf("|") != '-1') {
        let array = this.report.value.split('|').map(item => this.precessData(item)).join('、');
        this.displayValue = array;
      }else {
        this.displayValue = this.precessData(this.report.value);
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
<!--<style scoped>
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
</style>-->
