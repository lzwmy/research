<template>
  <!--集合-->
  <div class="view_box" >
      <div class="view_title" style="width:250px;display:inline-block;">
        <!--加号-->
        <i v-if="isFold" class="iconfont iconzu" :class="{iconGray:iconActive}" @click="changeExpend(0)"></i>
        <!--减号-->
        <i v-if="!isFold" class="iconfont iconzu2" @click="changeExpend(1)"></i>
        <strong>{{item.controlDisplayName}}</strong>
        <i v-if="item.binding==1" class="el-icon-connection" style="color:#3b81f0"></i>
      </div>
      <div class="view_knowType" v-if="item.gatherKnowType>0">
        <el-radio-group v-model="report.value">
          <el-radio v-if="item.gatherKnowType==2" label="是"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="否"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==2" label="不详"  @change="changeRadioKnowType(1)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="有"  @change="changeRadioKnowType(0)"></el-radio>
          <el-radio v-if="item.gatherKnowType==1" label="无" @change="changeRadioKnowType(1)"></el-radio>
        </el-radio-group>
        <span class="empty" @click="()=>{report.value=null;isFold=true}">清空</span>
      </div>
    <div v-if="!isFold"  :class="['view_content',{'width_container':item.gatherRank=='1'}]">
      <!--集合上下排列-->
      <div :class="item.controlType+'_bg_color'" style="padding-left:55px;" v-if="item.gatherRank=='0'"  @click="popMehtod">
        <div  style="margin-top:15px" v-for="(it,index) in item.children" :key="index" :layoutData="layoutInfo(it,index,item.children)">
          <el-row v-if="item.baseProperty.layout.wrap == '1'">
            <el-col :span="formatSpan(it.baseProperty.layout)" :offset="it.baseProperty.layout.offset">
              <display-input v-if="it.controlType=='SINGLE_INPUT'" :item="it" :report="getData(it)"/>
              <display-multi-input v-else-if="it.controlType=='MULTI_INPUT'" :item="it" :report="getData(it)"/>
              <display-check-box v-else-if="it.controlType=='CHECKBOX'" :item="it" :report="getData(it)"/>
              <display-combox v-else-if="it.controlType=='SINGLE_COMBOX'" :item="it" :report="getData(it)"/>
              <display-date v-else-if="it.controlType=='DATE'" :item="it" :report="getData(it)"/>
              <display-date-time v-else-if="it.controlType=='DATE_TIME'" :item="it" :report="getData(it)"/>
              <display-gather v-else-if="it.controlType=='GATHER'" :item="it" :report="getData(it)"/>
              <display-label v-else-if="it.controlType=='LABEL'" :item="it"/>
              <display-multi-combox v-else-if="it.controlType=='MULTI_COMBOX'" :item="it" :report="getData(it)"/>
              <display-radio v-else-if="it.controlType=='RADIO_BUTTON'" :item="it" :report="getData(it)"/>
              <display-table v-else-if="it.controlType=='TABLE'" :item="it" :report="getData(it)"/>
              <display-number-input v-else-if="it.controlType=='NUMBER_INPUT'" :item="it" :report="getData(it)"/>
            </el-col>
          </el-row>
          <el-col v-if="item.baseProperty.layout.wrap == '0'" :span="formatSpan(it.baseProperty.layout)" :offset="it.baseProperty.layout.offset">
            <display-input v-if="it.controlType=='SINGLE_INPUT'" :item="it" :report="getData(it)"/>
            <display-multi-input v-else-if="it.controlType=='MULTI_INPUT'" :item="it" :report="getData(it)"/>
            <display-check-box v-else-if="it.controlType=='CHECKBOX'" :item="it" :report="getData(it)"/>
            <display-combox v-else-if="it.controlType=='SINGLE_COMBOX'" :item="it" :report="getData(it)"/>
            <display-date v-else-if="it.controlType=='DATE'" :item="it" :report="getData(it)"/>
            <display-date-time v-else-if="it.controlType=='DATE_TIME'" :item="it" :report="getData(it)"/>
            <display-gather v-else-if="it.controlType=='GATHER'" :item="it" :report="getData(it)"/>
            <display-label v-else-if="it.controlType=='LABEL'" :item="it"/>
            <display-multi-combox v-else-if="it.controlType=='MULTI_COMBOX'" :item="it" :report="getData(it)"/>
            <display-radio v-else-if="it.controlType=='RADIO_BUTTON'" :item="it" :report="getData(it)"/>
            <display-table v-else-if="it.controlType=='TABLE'" :item="it" :report="getData(it)"/>
            <display-number-input v-else-if="it.controlType=='NUMBER_INPUT'" :item="it" :report="getData(it)"/>
          </el-col>
        </div>
      </div>

      <!--集合左右排列-->
      <div :style="`width:${inputWidth}px`" style="padding:10px 5px 15px 20px;" v-if="item.gatherRank=='1'">
        <!--padding:0 10px 0 10px;-->
        <display-gather-column
          style="background:#F7F8FC;margin-right:10px"
          v-for="colNum in item.gatherColumnNumber "
          :key="colNum"
          :children="getColumnItems(colNum)"
          :report="report"
        ></display-gather-column>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
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
import displayGather from "./displayGather";
import displayGatherColumn from "./displayGatherColumn";
export default {
  name: "displayGather",
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
    displayTable,
    displayGather,
    displayGatherColumn
  },
  data() {
    return {
      isFold: false,
      gatherTermValue: null,
      inputWidth:443*this.item.gatherColumnNumber,
      rootBinding:null//父元素绑定信息
    };
  },
  props: {
    item: {},
    report: {},
    index: Number
  },
  computed: {
    iconActive:function(){
      return this.item.gatherKnowType>0&&!this.gatherTermValue>0
    },
    ...mapGetters([
      'crfCurrentControl',
      'crfBindingData'

    ])
  },
  methods: {
    getColumnItems: function(number) {
      let newArr = [];
      for (let i = 0; i < this.item.children.length; i++) {
        if (number == (i % this.item.gatherColumnNumber) + 1) {
          newArr.push(this.item.children[i]);
        }
      }
      return newArr;
    },
    //是否不详 事件
    changeRadioKnowType(value) {
      this.isFold = value;
    },
    //点击图标切换
    changeExpend(value) {
      //如果gatherKnowType>0则由gatherTermValue来控制是否收缩
      
      if (this.item.gatherKnowType > 0 && this.gatherTermValue > 0) {
        this.isFold = value;
      } else if (this.item.gatherKnowType == 0) {
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
    //
    setWidth() {
      return 'width:'+this.item.gatherColumnNumber*this.inputWidth+'px'
    },
    popMehtod(){
      // alert("pop");
    },
    onFocus(){
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
    recureBindingInfo(){
      if(this.item.binding==1){
        if(this.item.baseProperty.bindingInfo.viewId=='INHERIT'){
           return this.$parent.recureBindingInfo();
        }else{
            return this.item;
        }
      }
    },
    // 布局处理
    layoutInfo(item,index,array) {
      // console.log(item,index);
      // 给每个 item  添加默认偏移量为0
      item.baseProperty.layout.offset = 0;
      let currentColumns = item.baseProperty.layout.columns;
      let currentSelection = item.baseProperty.layout.selection;
      if(index!==0){
        let preData = array[index-1].baseProperty.layout;
        //单列
        if(currentColumns==1){
          //默认换行
        }
        // 双列
        if(currentColumns==2) {
          //判断上一个 与 当前 columns  是否 相同， 如果不相同就换行 相同就判断是否存在交集
          if(currentColumns==preData.columns && item.baseProperty.layout.wrap=='0'){
            //判断选中的个数等于1 并且position 不等于2 偏移量 offset 0
            if(currentSelection.length==1){
              // console.log(JSON.stringify(currentSelection)+'\n'+JSON.stringify(preData.selection))
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    /*item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0'*/
                    return ;
                  }
                }
              }
              /*let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b;
              });
              if(positionList.length==1) {
                if(positionList[0]==2) {
                  item.baseProperty.layout.offset = '12';
                }
              }*/
            }else if(currentSelection.length==2) {
              //默认换行
              // item.baseProperty.layout.wrap = '1';
            }
            //判断selection position 位置是否 相等， 如果不相等，不换行， 如果相等就换行
          }else{
            // 不相同 默认换行
            // item.baseProperty.layout.wrap = 1
            // console.log(item.baseProperty.layout.selection);
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b;
            });
            if(positionList.length==1) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '12';
              }
            }
          }
        }
        //三列
        if(currentColumns==3) {
          //判断上一个 与 当前 columns  是否 相同， 如果不相同就换行 相同就判断是否存在交集
          if(currentColumns==preData.columns && item.baseProperty.layout.wrap=='0'){
            //如果当前选中数量等于1
            if(currentSelection.length==1 && item.baseProperty.layout.wrap=='0'){
              let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b
              });
              //判断当前与上一个是否存在交集，如果不存在交集 就 不换行
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if((preData.selection[i].position!==currentSelection[j].position)&&(item.baseProperty.layout.wrap==preData.wrap)){
                    // let sum = Math.abs(currentSelection[j].position-preData.selection[i].position)
                    // let sum = currentSelection[j].position-preData.selection[i].position;
                    // console.log(positionList.length,preData.selection.length,sum);
                    let currentItemList = currentSelection.map(item=>{
                      return item.position;
                    }).sort((a,b)=>{
                      return a-b;
                    });
                    let prevItemList = preData.selection.map(item=>{
                      return item.position;
                    }).sort((a,b)=>{
                      return b-a;
                    });
                    console.log(currentItemList,prevItemList);
                    let sum = currentItemList[0]-prevItemList[0];
                    if(sum ==1) {
                      item.baseProperty.layout.offset = 0;
                    }else if(sum == 2) {
                      item.baseProperty.layout.offset = 8;
                    }
                    /*item.baseProperty.layout.wrap = '0'
                    preData.wrap = '0';*/
                    /*if(positionList.length==1&&preData.selection.length==2){
                      if(sum>0&&sum=='2'){
                        item.baseProperty.layout.offset =sum*8
                      }
                    }else if(preData.selection.length==2) {

                    }else if(positionList.length==1&&preData.selection.length==1){
                      console.log('触发')
                      if(sum>0&&sum=='2'){
                        item.baseProperty.layout.offset =8
                      }
                    }*/
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position || item.baseProperty.layout.wrap!==preData.wrap){
                    // item.baseProperty.layout.wrap = '0';
                    if(positionList[0]==2){
                      item.baseProperty.layout.offset = '8'
                    }else if(positionList[0]==3) {
                      item.baseProperty.layout.offset = '16'
                    }
                  }
                }
              }
            }
            if(currentSelection.length==2 && item.baseProperty.layout.wrap=='0') {
              let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b
              });
              //如果当前 与 上一个不存在 position 相同，不换行，如果存在交集，换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    // item.baseProperty.layout.wrap = '0';
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    // item.baseProperty.layout.wrap = '1';
                    if(positionList[0]==2){
                      item.baseProperty.layout.offset = '8'
                    }
                  }
                }
              }
            }
            if(currentSelection.length == 3) {
              // item.baseProperty.layout.wrap = '1'
            }
          }else {
            // 不相同 默认换行
            // item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1){
              if(positionList[0]==2){
                item.baseProperty.layout.offset = '8';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '16';
              }
            }else if(positionList.length==2) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '8';
              }
            }
          }
        }
        //四列
        if(currentColumns == 4) {
          //判断上一列 与 当前列 是否相同， 如果不相同 就换行， 相同就判断是否存在交集
          if(currentColumns==preData.columns && item.baseProperty.layout.wrap=='0') {
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            let prePositionList = preData.selection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return b-a;
            });
            if(currentSelection.length == 1 && item.baseProperty.layout.wrap=='0') {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  let sum = positionList[0]-prePositionList[0];
                  if(preData.selection[i].position!==currentSelection[j].position) {
                    /*item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';*/
                    if(sum>0&&sum == 1) {
                      item.baseProperty.layout.offset = '0';
                    }else if(sum>0&&sum == 2) {
                      item.baseProperty.layout.offset = '6';
                    }else if(sum>0&&sum == 3) {
                      item.baseProperty.layout.offset = '12';
                    }else if(sum<0){
                      item.baseProperty.layout.offset = (currentSelection[j].position-1)*6
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    // item.baseProperty.layout.wrap = '1';
                    if(currentSelection[j].position == 1) {
                      item.baseProperty.layout.offset = '0';
                    }else if(currentSelection[j].position == 2) {
                      item.baseProperty.layout.offset = '6';
                    }else if(currentSelection[j].position == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }
                }
              }
            }
            if(currentSelection.length == 2 && item.baseProperty.layout.wrap=='0') {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position) {
                    let sum = Math.abs(positionList[0]-prePositionList[0]);
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum==1){
                      item.baseProperty.layout.offset = '0';
                    }else if(sum == 2){
                      item.baseProperty.layout.offset = '6';
                    }else if(sum == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    if(currentSelection[j].position==1){
                      item.baseProperty.layout.offset = '0';
                    }else if(currentSelection[j].position == 2){
                      item.baseProperty.layout.offset = '6';
                    }else if(currentSelection[j].position == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }
                }
              }
            }
            if(currentSelection.length == 3 && item.baseProperty.layout.wrap=='0') {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              /*for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    let sum = Math.abs(positionList[0]-prePositionList[0]);
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum == 0) {
                      item.baseProperty.layout.offset = '0';
                    }else if(sum == 1) {
                      item.baseProperty.layout.offset = '0';
                    }
                  }else if(preData.selection[i].position==currentSelection[j].position) {
                    console.log('触发')
                    item.baseProperty.layout.wrap = '1';
                  }
                }
              }*/
              if(prePositionList[0]==1&&positionList[0]==1){
                // item.baseProperty.layout.wrap = '1';
                item.baseProperty.layout.offset = '0';
              }else if(positionList[0]==2) {
                // item.baseProperty.layout.wrap = '1';
                item.baseProperty.layout.offset = '6';
              }
            }
            if(currentSelection.length == 4) {
              // item.baseProperty.layout.wrap = 1
            }
          }else {
            // 不相同 默认换行
            // item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '12';
              }else if(positionList[0]==4) {
                item.baseProperty.layout.offset = '18';
              }
            }else if(positionList.length==2) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '12';
              }
            }else if(positionList.length==3) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }
            }
          }
        }
      }else if(index == 0&&currentColumns>1) {
        // 双列
        if(currentColumns==2){
          if(currentSelection.length==1&&currentSelection[0].position==2){
            item.baseProperty.layout.offset = '12'
          }else if(currentSelection.length==2) {
            // item.baseProperty.layout.wrap = '1';
          }
        }
        if(currentColumns == 3) {
          let positionList = currentSelection.map(item=>{
            return item.position;
          }).sort((a,b)=>{
            return a-b
          });
          if(positionList[0] == 2) {
            item.baseProperty.layout.offset = '8'
          }else if(positionList[0] == 3) {
            item.baseProperty.layout.offset = '16'
          }
        }
        if(currentColumns == 4) {
          let positionList = currentSelection.map(item=>{
            return item.position;
          }).sort((a,b)=>{
            return a-b
          });
          if(positionList[0]==2) {
            item.baseProperty.layout.offset = '6'
          }else if(positionList[0] == 3) {
            item.baseProperty.layout.offset = '12'
          }else if(positionList[0] == 4) {
            item.baseProperty.layout.offset = '18'
          }
        }
      }
      // item.baseProperty.layout.wrap = 0
      return item
    },
    formatSpan(item) {
      let span = 24;
      if(item.columns == 1) {
        span = 24;
      }else if(item.columns == 2) {
        span = 12*item.selection.length;
      }else if(item.columns == 3) {
        span = 8 * item.selection.length;
      }else if(item.columns == 4) {
        span = 6 * item.selection.length;
      }
      return span;
    }
  },
  created() {
    if(this.item.gatherKnowType==null){
      this.item.gatherKnowType=0;
    }
    //初始化默认集合是否展开
    if(this.report.value&&(this.report.value=="有"||this.report.value=="是")){
        this.isFold = false;
    }
    else if (this.item.gatherFoldFlag == 1||this.item.gatherKnowType > 0) {
      this.isFold = true;
    }
    
    //初始化报告数据
    this.item.children.forEach(element => {
      let arr = this.report.children.filter(
        o => o.name == element.controlDisplayName
      );
      if (arr.length == 0) {
        let newObj = {
          name: element.controlDisplayName,
          value: "",
          children: []
        };
        this.report.children.push(newObj);
      }
    });
    //判断控件是否绑定数据如果绑定则获取绑定数据，如果是继承绑定则进行递归获取父绑定
    if(this.item.binding){
      this.rootBinding=this.recureBindingInfo();
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconGray{
  color:gray
}
  .GATHER_bg_color{
    background-color: rgb(247, 248, 252);
  }
</style>
