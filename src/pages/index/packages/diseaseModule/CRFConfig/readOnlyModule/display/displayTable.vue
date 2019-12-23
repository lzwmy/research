<template>
  <!--表格-->
  <div class="view_box" v-if="item.controlType=='TABLE'">
    <div :class="['view_title',{'view_table-title':item.controlType=='TABLE'}]" style="width:250px;display:inline-block;">
        <!--加号-->
        <i v-if="isFold" class="iconfont iconzu" :class="{iconGray:iconActive}" ></i>
        <!--减号-->
        <i v-if="!isFold" class="iconfont iconzu2" ></i>
        <!-- <span style="font-weight:font-size:14px;bold;color:#333333;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">{{item.controlDisplayName}}</span> -->
        <strong v-if="item.displayIsVisible=='1'">{{item.controlDisplayName}}</strong>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>

      </div>

    <div :class="['view_knowType',{'table_knowType':item.gatherKnowType>0}]" v-if="item.gatherKnowType>0">
     <!--<el-radio-group v-model="report.value">
          <el-radio v-if="item.gatherKnowType==2" label="是"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="否"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="不详"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="有"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="无" @change="changeRadioKnowType(1)"></el-radio>
        </el-radio-group>
        <span class="empty" @click="()=>{report.value=null;isFold=false}">清空</span>-->
      <i class="is_knowType" v-if="item.gatherKnowType==1">{{report.value || '无'}}</i>
      <i class="is_knowType" v-if="item.gatherKnowType==2">{{report.value || '无'}}</i>
      <div class="info_fixed" style="display: inline-block;position: relative;">
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
    <div v-if="!isFold"
      :class="['view_content',{'tb_content':item.controlType=='TABLE'},{'bg_color':item.gatherRank=='0'}]"
     
    > 
      <!--表格上下排列-->
      <div  v-if="item.gatherRank=='0'">
        {{item.gatherRank}}
       <div v-for="(it,index) in report.children" :key="index">
          <display-table-row2 :children="item.children" :index="index" :report="it"></display-table-row2>
        </div>
      </div>
      <!--表格左右排列-->
      <div class="view_container_tlr" v-if="item.gatherRank=='1'">
        <div v-for="(it,index) in report.children" :key="index">
          <display-table-row :children="item.children" :index="index" :report="it"></display-table-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import eventBus from 'src/eventBus/bus.js';
import utils from 'components/utils/index.js';
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
import displayTable from "./displayTable";
import displayGatherColumn from "./displayGatherColumn";
import displayTableRow from "./displayTableRow";
import displayTableRow2 from "./displayTableRow2";
export default {
  name: "displayTable",
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
    displayRadio,
    displayGatherColumn,
    displayTableRow,
    displayTableRow2
  },
  props: {
    item: {},
    report: {},
    index: Number
  },
  data() {
    return {
      isFold: false,
      gatherTermValue: null,
      tableData: [],
      rootBinding:null//父元素绑定信息
    };
  },
  computed: {
    ...mapGetters([
      'crfCurrentControl',
      'crfBindingData'

    ]),
    iconActive:function(){
      return this.item.gatherKnowType>0&&!this.gatherTermValue>0
    }
  },
  methods: {
    //是否不详 事件
    changeRadioKnowType(value) {
      this.isFold = value;
    },
    //点击图标切换
    changeExpend(value) {
      //如果gatherKnowType>0则由gatherTermValue来控制是否收缩
      if (this.item.gatherKnowType > 0 && this.gatherTermValue > 0) {
        this.isFold = value;
      } else if (this.item.gatherKnowType <= 0) {
        this.isFold = value;
      }
    },
    //过滤报告数据
    getData(item) {
      let arr = this.report.children.filter(
        o => o.name == item.controlDisplayName
      );
      return arr[0];
    },
    addRow(){
        let newRow={name:"row",value:"",children:[]};
        //初始化报告数据
        this.item.children.forEach(element => {
            let newObj = {
              name: element.controlDisplayName,
              value: "",
              children: []
            };
            newRow.children.push(newObj);
        });
        this.report.children.push(newRow);
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
    recureBindingInfo(){
      if(this.item.binding==1){
        if(this.item.baseProperty.bindingInfo.viewId=='INHERIT'){
           return this.$parent.recureBindingInfo();
        }else{
            return this.item;
        }
      }
    }
  },
  created() {
    if (this.report.children.length == 0) {
      this.addRow();
    }
    //初始化默认集合是否展开
    if (this.item.gatherFoldFlag == 1||this.item.gatherKnowType > 0) {
          this.isFold = true;
    }

    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if(this.item.binding){
      this.rootBinding=this.recureBindingInfo();
    }
   
  },
  mounted() {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
