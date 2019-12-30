<template>
    <div :class="item.controlType">
        <div v-if="item.displayIsVisible=='1'" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
          <span v-show="item.baseProperty.isRequired"
                style="color: red;">*</span>
          <span >{{item.controlDisplayName}}</span>
        </div>
      <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired},{'addColor':report.value}]"
           :data-type="item.controlType"
           :data-value="report.value">
        <!--<el-select v-model="optionValue" @change="oneSelect(optionValue)">
          <el-option
            v-for="(item,index) in options"
            :key="item.id"
            :label="item.value"
            :value="item.value"></el-option>
        </el-select>
        <el-select v-model="groupValue" v-if="group.length!==0" @change="groupSelect(groupValue)">
          <el-option
            v-for="(item,index) in group"
            :key="item.id"
            :label="item.value"
            :value="item.value"></el-option>
        </el-select>
        <el-select v-model="columnsValue" v-if="columns.length!==0" @change="columnsSelect(columnsValue)">
          <el-option
            v-for="(item,index) in columns"
            :key="item.id"
            :label="item.value"
            :value="item.value"></el-option>
        </el-select>-->
        {{displayValue || "(空)"}}
      </div>
      <div class="info_fixed" style="display: table-cell;position: relative;">
        <i class="iconfont iconzu14" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
        <i class="iconfont iconzu13" v-else-if="showStatus()"  :class="[{'active_annotate':annotateProcess()}]" @click="commentMethod" ></i>
        <div class="info_tip_box" v-if="modifyDataProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
              <span v-if="it.path == item.controlName">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
            </p>
            <p v-for="(it,index) in $store.state.annotateData.answerList" :key="index" >
              <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.creatorName}} 回复： {{it.content}}</span>
            </p>
          </div>
        </div>
        <div class="info_tip_box" v-else-if="annotateProcess()">
          <i></i>
          <div class="tip_content" >
            <p v-for="(it,index) in $store.state.annotateData.annotateList" :key="index" >
              <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.creatorName}} 批注： {{it.content}}</span>
            </p>
            <p v-for="(it,index) in $store.state.annotateData.answerList" :key="index" >
              <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.creatorName}} 回复： {{it.content}}</span>
            </p>
            <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
              <span v-if="it.path == item.controlName" :class="{'ml_7':index>0}">{{it.createTime}} {{it.creatorName}} 修改 : {{it.oldData}} 为 {{it.newData}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import eventBus from 'src/eventBus/bus.js';
  import utils from 'components/utils/index.js';
    export default {
      props:{
        item: {},
        report: {},
        index: Number
      },
      data () {
        return {
          optionValue:"",
          options:[],
          groupValue:"",//
          group:[],//二级 联动
          columnsValue:"",//
          columns:[], // 三级联动
          displayValue:"",
        }
      },
      methods:{
        oneSelect() {
          let array = [this.optionValue];
          this.report.value = JSON.stringify(array);
          let data = this.options.map(item=>{
            if(item.value == this.optionValue) {
              //判断item 是否包含 children 字段
              if(item.hasOwnProperty("children")){
                this.groupValue = "";
                this.group = item.children;
                this.columnsValue = "";
                this.columns = [];
              }else {
                this.group = [];
                this.groupValue = "";
                this.columnsValue = "";
                this.columns = [];
              }
            }
          })
        },
        groupSelect() {
          let array = JSON.parse(this.report.value);
          array[1] = this.groupValue
          this.report.value = JSON.stringify(array);
          let data = this.group.map(item => {
            if(item.value == this.groupValue) {
              if(item.hasOwnProperty('children')) {
                this.columnsValue = "";
                this.columns = item.children;
              }else {
                this.columnsValue = "";
                this.columns = [];
              }
            }
          })
        },
        columnsSelect() {
          let array = JSON.parse(this.report.value);
          array[2] = this.columnsValue;
          this.report.value = JSON.stringify(array);
        },
        singleLayerData(array) {
          this.optionValue = array[0];
        },
        doubleLayerData(array) {
          //设置 单程初始值
          this.singleLayerData(array);
          let data = this.options.filter(item => {
            if(item.value == array[0]) {
              return item.children;
            }
          })[0];
          this.group = data.children;
          this.groupValue = array[1];
        },
        threeLayerData(array) {
          this.doubleLayerData(array);
          let data = this.group.filter(item => {
            if(item.value == array[1]) {
              return item.children;
            }
          })[0];
          this.columns = data.children;
          this.columnsValue = array[2];
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
          }
          return show;
        },
        commentMethod() {
          let flag = this.modifyDataProcess();
          if(flag) {
            if(this.$store.state.annotateData.tipStatus  == 3 && this.$store.state.annotateData.isExamine == false) {
              return ;
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
      },
      mounted() {
        /*this.options = JSON.parse(this.item.termSet.rangeText || '[]') ;
        if(this.report.value !== "") {
          let array = JSON.parse(this.report.value);
          switch (array.length) {
            case 1 :
              this.singleLayerData(array);
              break;
            case 2 :
              this.doubleLayerData(array);
              break;
            case 3 :
              this.threeLayerData(array);
              break;
            default:
              break;
          }
        }*/
        if(this.report.value) {
          if(this.report.value.indexOf('|') != '-1') {
            let array = this.report.value.split('|').join("/");
            this.displayValue = array;
          }else {
            let array = JSON.parse(this.report.value).join("/");
            this.displayValue = array;
          }
        }
      }
    }
</script>

<style scoped>
  .CASCADE{

  }
  .CASCADE .CASCADE_title{
    width: 188px;
    display: table-cell;
    font-size: 14px;
  }
  .CASCADE .CASCADE_box{
    display: table-cell;
  }
  .CASCADE .singleColumn{
    width: auto;
    min-width: 188px;
    max-width: 500px;
    padding-right: 5px;
  }
  .CASCADE .CASCADE_box .el-select{
    width: 188px;
  }
</style>
