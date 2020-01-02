<template>
  <!--表格-->
  <div class="view_box" v-if="item.controlType=='TABLE'">
    <div :class="['view_title',{'view_table-title':item.controlType=='TABLE'}]" style="min-width:185px;display:inline-block;">
        <!--加号-->
        <i v-if="isFold" class="iconfont iconzu" :class="{iconGray:iconActive}" ></i>
        <!--减号-->
        <i v-if="!isFold" class="iconfont iconzu2" ></i>
        <!-- <span style="font-weight:font-size:14px;bold;color:#333333;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">{{item.controlDisplayName}}</span> -->
        <strong v-if="item.displayIsVisible=='1'">{{item.controlDisplayName}}</strong>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>

      </div>

    <div :class="['view_knowType',{'table_knowType':item.gatherKnowType>0}]" v-if="item.gatherKnowType>0" style="display: inline-block;padding: 10px 0">
     <!--<el-radio-group v-model="report.value">
          <el-radio v-if="item.gatherKnowType==2" label="是"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="否"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="不详"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="有"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="无" @change="changeRadioKnowType(1)"></el-radio>
        </el-radio-group>
        <span class="empty" @click="()=>{report.value=null;isFold=false}">清空</span>-->
      <i :class="['is_knowType',{'addColor':report.value}]" v-if="item.gatherKnowType==1">{{report.value || '无'}}</i>
      <i :class="['is_knowType',{'addColor':report.value}]" class="is_knowType" v-if="item.gatherKnowType==2">{{report.value || '无'}}</i>
      <div class="info_fixed" style="display: inline-block;position: relative;">
        <i class="iconfont iconzu14" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
        <i class="iconfont iconzu13" v-else-if="showStatus()"  :class="[{'active_annotate':annotateProcess()}]" @click="commentMethod" ></i>
        <div class="info_tip_box" v-if="modifyDataProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(ita,indexa) in $store.state.annotateData.modifyData" :key1="indexa">
              <span v-if="ita.path == item.controlName">{{ita.createTime}} {{ita.creatorName}} 修改 "{{ita.oldData}}" 为 "{{ita.newData}}"</span>
            </p>
            <p v-for="(its,indexs) in $store.state.annotateData.answerList" :key2="indexs" >
              <span v-if="its.path == item.controlName" >{{its.createTime}} {{its.creatorName}} 回复 "{{its.content}}"</span>
            </p>
          </div>
        </div>
        <div class="info_tip_box" v-else-if="annotateProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(itd,indexd) in $store.state.annotateData.annotateList" :key3="indexd" >
              <span v-if="itd.path == item.controlName" >{{itd.createTime}} {{itd.creatorName}} 批注 "{{itd.content}}"</span>
            </p>
            <p v-for="(itf,indexf) in $store.state.annotateData.answerList" :key4="indexf" >
              <span v-if="itf.path == item.controlName" >{{itf.createTime}} {{itf.creatorName}} 回复  "{{itf.content}}"</span>
            </p>
            <p v-for="(itg,indexg) in $store.state.annotateData.modifyData" :key5="indexg">
              <span v-if="itg.path == item.controlName" :class="{'ml_7':indexg>0}">{{itg.createTime}} {{itg.creatorName}} 修改  "{{itg.oldData}}" 为 "{{itg.newData}}"</span>
            </p>
          </div>
        </div>
      </div>
    </div>
<!--    (report.value!='无' && report.value != '') || item.gatherKnowType == 0-->
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
    showStatus () {
      let show = true;
      let annotateStatus = false;
      let modifyStatus = false;
      let anwerStatus = false;
      let annotateList = this.$store.state.annotateData.annotateList;
      let modifyData = this.$store.state.annotateData.modifyData;
      let answerList = this.$store.state.annotateData.answerList;
      if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
        if(annotateList.length || modifyData.length || answerList.length) {
          if(annotateList.length) {
            annotateList.forEach(item => {
              if(item.path == this.item.controlName) {
                annotateStatus = true;
                return ;
              }
            })
          }
          if(modifyData.length) {
            modifyData.forEach(item => {
              if(item.path == this.item.controlName) {
                modifyStatus = true;
                return ;
              }
            })
          }
          if(answerList.length) {
            answerList.forEach(item => {
              if(item.path == this.item.controlName) {
                anwerStatus = true;
                return ;
              }
            })
          }
          if(annotateStatus || modifyStatus || anwerStatus) {
            show = true;
          }else {
            show = false;
          }
        }else {
          show = false;
        }
      }else if(this.$store.state.annotateData.tipStatus  == 4 && this.$store.state.annotateData.isExamine == false) {
        if(annotateList.length || modifyData.length || answerList.length) {
          if(annotateList.length) {
            annotateList.forEach(item => {
              if(item.path == this.item.controlName) {
                annotateStatus = true;
                return ;
              }
            })
          }
          if(modifyData.length) {
            modifyData.forEach(item => {
              if(item.path == this.item.controlName) {
                modifyStatus = true;
                return ;
              }
            })
          }
          if(answerList.length) {
            answerList.forEach(item => {
              if(item.path == this.item.controlName) {
                anwerStatus = true;
                return ;
              }
            })
          }
          if(annotateStatus || modifyStatus || anwerStatus) {
            show = true;
          }else {
            show = false;
          }
        }else {
          show = false;
        }
      }else if(this.$store.state.annotateData.tipStatus  == 2 && this.$store.state.annotateData.isExamine == false) {
        if(annotateList.length || modifyData.length || answerList.length) {
          if(annotateList.length) {
            annotateList.forEach(item => {
              if(item.path == this.item.controlName) {
                annotateStatus = true;
                return ;
              }
            })
          }
          if(modifyData.length) {
            modifyData.forEach(item => {
              if(item.path == this.item.controlName) {
                modifyStatus = true;
                return ;
              }
            })
          }
          if(answerList.length) {
            answerList.forEach(item => {
              if(item.path == this.item.controlName) {
                anwerStatus = true;
                return ;
              }
            })
          }
          if(annotateStatus || modifyStatus || anwerStatus) {
            show = true;
          }else {
            show = false;
          }
        }else {
          show = false;
        }
      }else if(this.$store.state.annotateData.tipStatus  == 4 && this.$store.state.annotateData.isExamine == true ) {
        if(this.$store.state.annotateData.tipBtnText == '重新审核'&& this.$store.state.annotateData.tipBtnText != '') {
          show = false;
        }
      }
      return show;
    },
    commentMethod() {
      let flag = this.modifyDataProcess();
      if(flag) {
        if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
          return ;
        }else {
          let path = this.item.controlName;
          eventBus.$emit('display-show',path)
        }
      }else {
        let path = this.item.controlName;
        eventBus.$emit('display-show',path)
      }
      /*let path = this.item.controlName;
      eventBus.$emit('display-show',path)*/
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
      if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
        let answerList = this.$store.state.annotateData.answerList;
        if(answerList.length) {
          answerList.forEach(item => {
            if(item.path == this.item.controlName) {
              find = true;
              return ;
            }
          })
        }
      }
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
    if(this.report.value&&(this.report.value=="有"||this.report.value=="是")){
      this.isFold = false;
    }
    else if (this.item.gatherFoldFlag == 1||this.item.gatherKnowType > 0) {
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
