<template>
  <div :class="item.controlType">
    <div v-if="item.displayIsVisible=='1'" :class="[item.controlType+'_title']">
          <span v-show="item.baseProperty.isRequired"
                style="color: red;">*</span>
      <span>{{item.controlDisplayName}}</span>
    </div>
    <div :class="[item.controlType+'_box']">
      <el-slider
        v-if="item.baseProperty.sliderInfo.step == 0"
        v-model="sliderValue"
        :disabled="true"
        :max="item.baseProperty.sliderInfo.max">
      </el-slider>
      <el-slider
        v-else-if="item.baseProperty.sliderInfo.step > 0"
        v-model="sliderValue"
        :max="item.baseProperty.sliderInfo.max"
        :step="item.baseProperty.sliderInfo.step"
        :marks="marks"
        :disabled="true"
        show-stops>
      </el-slider>
    </div>
    <div class="info_fixed" style="display: table-cell;position: relative;">
      <i class="iconfont iconzu14" v-if="modifyDataProcess()" :class="[{'active_modifyInfo':modifyDataProcess()}]" @click="commentMethod"></i>
      <i class="iconfont iconzu13" v-else-if="showStatus()"  :class="[{'active_annotate':annotateProcess()}]" @click="commentMethod" ></i>
      <div class="info_tip_box" v-if="modifyDataProcess()">
        <i></i>
        <div class="tip_content" >
          <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
            <span v-if="it.path == item.controlName">{{it.createTime}} {{it.creatorName}} 修改 "{{it.oldData}}" 为 "{{it.newData}}"</span>
          </p>
          <p v-for="(it,index) in $store.state.annotateData.answerList" :key="index" >
            <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.creatorName}} 回复 "{{it.content}}"</span>
          </p>
        </div>
      </div>
      <div class="info_tip_box" v-else-if="annotateProcess()">
        <i></i>
        <div class="tip_content" >
          <p v-for="(it,index) in $store.state.annotateData.annotateList" :key="index" >
            <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.creatorName}} 批注 "{{it.content}}"</span>
          </p>
          <p v-for="(it,index) in $store.state.annotateData.answerList" :key="index" >
            <span v-if="it.path == item.controlName" >{{it.createTime}} {{it.creatorName}} 回复  "{{it.content}}"</span>
          </p>
          <p v-for="(it,index) in $store.state.annotateData.modifyData" :key="index">
            <span v-if="it.path == item.controlName" :class="{'ml_7':index>0}">{{it.createTime}} {{it.creatorName}} 修改  "{{it.oldData}}" 为 "{{it.newData}}"</span>
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
    data() {
      return {
        marks:{},
        sliderValue:parseInt(this.report.value) || 0
      }
    },
    watch:{
      "sliderValue":function (data) {
        this.report.value = data.toString();
      }
    },
    methods:{
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
      let optionContent = JSON.parse(this.item.termSet.rangeText || '[]') ;
      if(JSON.stringify(optionContent) != '[]') {
        let obj = {};
        for(let k in optionContent){
          obj[k]=optionContent[k]['text']
        }
        this.marks = obj;
      }
      this.sliderValue = parseInt(this.report.value) || 0;
    }
  }
</script>

<style scoped>

</style>
