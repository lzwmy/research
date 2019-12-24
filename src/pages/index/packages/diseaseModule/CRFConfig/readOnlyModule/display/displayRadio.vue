<template>
  <!--单选框-->
  <div class="view_box">
    <div :class="item.controlType">
      <!--style="width:200px;font-size: 14px;"-->
      <div v-if="item.displayIsVisible=='1'&&showLabel"
           :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
        <!--<i v-if="crfCurrentControl.item==item" class="el-icon-edit" style="color:#3b81f0" />-->
        <span>{{item.controlDisplayName}}</span>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
      </div>
      <!--:class="['view_type_radio_btn',{'width_auto_type':item.controlType=='RADIO_BUTTON'}]"-->
      <!--{{item.baseProperty.layout}}-->
      <div :class="[item.controlType+'_box',{'addColor':report.value},{'grayColor':!report.value}]" @click="onFocus">
        <!--<el-radio-group v-model="report.value">
          <el-radio
            v-for="(it,index) in item.termSet.termItemList"
            :label="precessData(it.termItemName)"
            :key="index"
          >{{precessData(it.termItemName)}}</el-radio>
        </el-radio-group>-->
        {{report.value || '(空)'}}
      </div>
      <!--<div :class="item.controlType+'_empty'" @click="()=>report.value=null">清空</div>-->
      <div class="info_fixed" style="display: table-cell;position: relative;">
        <i class="iconfont iconzu14" v-if="modifyDataProcess()"
           :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
        <i class="iconfont iconzu13" v-else :class="[{'active_annotate':annotateProcess()}]" @click="commentMethod"></i>
        <div class="info_tip_box" v-if="modifyDataProcess()">
          <i></i>
          <div class="tip_content">
            <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
              <span v-if="it.path == item.controlName">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
            </p>
          </div>
        </div>
        <div class="info_tip_box" v-else-if="annotateProcess()">
          <i></i>
          <div class="tip_content">
            <p v-for="(it,index) in $store.state.annotateData.annotateList" :key="index">
              <span v-if="it.path == item.controlName">{{it.createTime}} {{it.content}}</span>
            </p>
            <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
              <span v-if="it.path == item.controlName" :class="{'ml_7':index>0}">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
            </p>
          </div>
        </div>
      </div>
      <i class="remove_annotate" v-show="annotateProcess()" @click="emptyAnnotate">清空</i>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import eventBus from 'src/eventBus/bus.js';
  import utils from 'components/utils/index.js';

  export default {
    name: "displayRadio",
    data() {
      return {
        termList: [],
        rootBinding: null, //父元素绑定信息
        displayValue: "",
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
          let params = {termGroupId: this.item.termSet.termGroupOid};
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
      commentMethod() {
        let path = this.item.controlName;
        eventBus.$emit('display-show', path)
      },
      annotateProcess() {
        let find = false;
        let copyArray = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
        let array = utils.deleteObject(copyArray, 'path');
        array.forEach(item => {
          if (item.path == this.item.controlName) {
            find = true;
            return;
          }
        });
        return find;
      },
      modifyDataProcess() {
        let find = false;
        let copyArray = JSON.parse(JSON.stringify(this.$store.state.annotateData.modifyData));
        let array = utils.deleteObject(copyArray, 'path');
        array.forEach(item => {
          if (item.path == this.item.controlName) {
            find = true;
            return;
          }
        });
        let flag = this.annotateProcess();
        if (flag) {
          find = false;
        }
        return find;
      },
      emptyAnnotate() {
        let copyData = JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
        if (copyData.length !== 0) {
          for (let i = 0; i < copyData.length; i++) {
            if (copyData[i].path == this.item.controlName) {
              copyData.splice(i, 1);
              i--;
            }
          }
          this.$store.dispatch('resetFun', copyData)
        }
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
        if (data != undefined && data != 'undefined') {
          if (data.indexOf('^') != '-1') {
            return data.split('^')[0]
          } else {
            return data
          }
        } else {
          return data
        }
      }
    },
    created() {
      /*this.report.value =
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
          return {termItemName:item}
        });
        this.item.termSet.termItemList = arrayList;
      }*/
      if (this.report.value) {
        if (this.report.value.indexOf("^") != '-1') {
          let str = this.precessData(this.report.value);
          this.displayValue = str;
        } else {
          this.displayValue = this.report.value;
        }
      }
    },
    computed: {
      ...mapGetters(["crfCurrentControl", "crfBindingData"])
    },
    watch: {
      crfBindingData: function (newer, older) {
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
<!--<style scoped>
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
  max-width: 500px;
  padding-right: 5px;
  vertical-align: top;
}
.RADIO_BUTTON .RADIO_BUTTON_box {
  min-width: 164px;
  max-width: 800px;
  display: table-cell;

}
.RADIO_BUTTON .RADIO_BUTTON_box .el-radio-group {
  min-width: 164px;
  max-width: 800px;
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
</style>-->
