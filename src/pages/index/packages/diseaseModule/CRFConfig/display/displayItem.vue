<template>
  <div v-loading="loading">
    <!--class="view_container" style="display: block"-->
      <el-row v-if="item.baseProperty.layout.wrap == '1'"  align="top">
        <el-col  :span="formatSpan(item.baseProperty.layout)" :offset="item.baseProperty.layout.offset">
          <display-input v-if="item.controlType=='SINGLE_INPUT'" :item="item" :report="report"/>
          <display-multi-input v-else-if="item.controlType=='MULTI_INPUT'" :item="item" :report="report"/>
          <display-check-box v-else-if="item.controlType=='CHECKBOX'" :item="item" :report="report"/>
          <display-combox v-else-if="item.controlType=='SINGLE_COMBOX'" :item="item" :report="report"/>
          <display-date v-else-if="item.controlType=='DATE'" :item="item" :report="report"/>
          <display-date-time v-else-if="item.controlType=='DATE_TIME'" :item="item" :report="report"/>
          <display-gather v-else-if="item.controlType=='GATHER'" :item="item" :report="report"/>
          <display-label v-else-if="item.controlType=='LABEL'" :item="item" :report="report"/>
          <display-multi-combox v-else-if="item.controlType=='MULTI_COMBOX'" :item="item" :report="report"/>
          <display-radio v-else-if="item.controlType=='RADIO_BUTTON'" :item="item" :report="report"/>
          <display-table v-else-if="item.controlType=='TABLE'" :item="item" :report="report"/>
          <display-number-input v-else-if="item.controlType=='NUMBER_INPUT'" :item="item" :report="report"/>
          <display-file-upload v-else-if="item.controlType == 'FILE_UPLOAD'" :item="item" :report="report"></display-file-upload>
          <display-score v-else-if="item.controlType == 'SCORE'" :item="item" :report="report"></display-score>
          <display-cascader v-else-if="item.controlType == 'CASCADE'" :item="item" :report="report"></display-cascader>
          <display-slider v-else-if="item.controlType == 'SLIDER'" :item="item" :report="report"></display-slider>
        </el-col>
      </el-row>
    <el-col  v-if="item.baseProperty.layout.wrap == '0'" :span="formatSpan(item.baseProperty.layout)" :offset="item.baseProperty.layout.offset">
      <display-input v-if="item.controlType=='SINGLE_INPUT'" :item="item" :report="report"/>
      <display-multi-input v-else-if="item.controlType=='MULTI_INPUT'" :item="item" :report="report"/>
      <display-check-box v-else-if="item.controlType=='CHECKBOX'" :item="item" :report="report"/>
      <display-combox v-else-if="item.controlType=='SINGLE_COMBOX'" :item="item" :report="report"/>
      <display-date v-else-if="item.controlType=='DATE'" :item="item" :report="report"/>
      <display-date-time v-else-if="item.controlType=='DATE_TIME'" :item="item" :report="report"/>
      <display-gather v-else-if="item.controlType=='GATHER'" :item="item" :report="report"/>
      <display-label v-else-if="item.controlType=='LABEL'" :item="item" :report="report"/>
      <display-multi-combox v-else-if="item.controlType=='MULTI_COMBOX'" :item="item" :report="report"/>
      <display-radio v-else-if="item.controlType=='RADIO_BUTTON'" :item="item" :report="report"/>
      <display-table v-else-if="item.controlType=='TABLE'" :item="item" :report="report"/>
      <display-number-input v-else-if="item.controlType=='NUMBER_INPUT'" :item="item" :report="report"/>
      <display-file-upload v-else-if="item.controlType == 'FILE_UPLOAD'" :item="item" :report="report"></display-file-upload>
      <display-score v-else-if="item.controlType == 'SCORE'" :item="item" :report="report"></display-score>
      <display-cascader v-else-if="item.controlType == 'CASCADE'" :item="item" :report="report"></display-cascader>
      <display-slider v-else-if="item.controlType == 'SLIDER'" :item="item" :report="report"></display-slider>
    </el-col>
    <el-col v-if="item.baseProperty.layout.wrap == '0' && item.baseProperty.layout.supplement"
            :span="formatSupplement(item.baseProperty.layout)" style="min-height: 32px"></el-col>
  </div>
</template>

<script>
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
import displayFileUpload from './displayFileUpload';
import displayScore from './displayScore';
import displayCascader from './displayCascader';
import displaySlider from './displaySlider';
import "assets/css/crf.less";
export default {
  name: "displayItem",
  data() {
    return {
      loading: false //加载
    };
  },
  props: {
    item: {},
    report: {},
    index: Number
  },
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
    displayFileUpload,
    displayScore,
    displayCascader,
    displaySlider
  },
  methods:{
    formatSpan(item) {
      let span = 24;
      if(item.columns == 1) {
        span = 24;
      }else if(item.columns == 2) {
        // span = 12 * (item.selection.length || 1);
        span = 6 * (item.selection.length || 1);
      }else if(item.columns == 3) {
        // span = 8 * (item.selection.length || 1);
        span = 6 * (item.selection.length || 1);
      }else if(item.columns == 4) {
        span = 6 * (item.selection.length || 1);
      }
      return span;
    },
    formatSupplement(item) {
      let span = 24;
      if(item.columns == 1) {
        span = 24;
      }
      else if(item.columns == 2) {
        /*span = (item.displayChecked.length - (item.selection.length || 1) )*6 + 6 ;*/
        if(item.selection.length == 1 && item.offset == 0 ) {
          if(item.selection[0].position == 2) {
            span = 12;
          }else if(item.selection[0].position == 1) {
            span = 18;
          }
        }
        else if(item.selection.length == 1 && item.offset != 0) {
          if(item.offset == 6 ) {
            span = 12;
          }
        }
        else if(item.selection.length == 2) {
          span = 12;
        }
      }
      else if(item.columns == 3) {
        span = 6;
        if(item.selection.length == 1 && item.offset == 0) {
          if(item.selection[0].position == 2) {
            span = 12;
          }else if(item.selection[0].position == 3) {
            span = 6;
          }else if(item.selection[0].position == 1) {
            span = 18;
          }
        }
        else if(item.selection.length == 1 && item.offset != 0) {
            if(item.offset == 0 ) {
              span = 18;
            }else if(item.offset == 6) {
              span = 12;
            }else if(item.offset == 12) {
              span  = 6;
            }
        }
        else if(item.selection.length == 2) {
          if(item.offset == 0 ) {
            span = 12;
          }else if(item.offset == 6) {
            span = 6;
          }
        }
        else if(item.selection.length == 3) {
          span = 24;
        }
      }
      else if(item.columns == 4) {
        if(item.selection.length == 1 && item.offset ==0) {
          if(item.selection[0].position == 2) {
            span = 12;
          }else if(item.selection[0].position == 3) {
            span = 6;
          }else if(item.selection[0].position == 1) {
            span = 18;
          }else if(item.selection[0].position == 4) {
            span = 0;
          }
        }
        else if(item.selection.length == 1 && item.offset != 0) {
          if(item.offset == 0 ) {
            span = 18;
          }else if(item.offset == 6) {
            span = 12;
          }else if(item.offset == 12) {
            span  = 6;
          }
        }
        else if(item.selection.length == 2) {
          if(item.offset == 0 ) {
            span = 12;
          }else if(item.offset == 6) {
            span = 6;
          }else if(item.offset == 12 ) {
            span = 0;
          }
        }
        else if(item.selection.length == 3) {
          if(item.offset == 0 ) {
            span = 12;
          }else if(item.offset == 6) {
            span = 0;
          }
        }
        else if(item.selection.length == 4) {
          span = 24;
        }
      }
      return span;
    },
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
