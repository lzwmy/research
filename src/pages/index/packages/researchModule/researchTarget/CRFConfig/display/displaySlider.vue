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
        :max="item.baseProperty.sliderInfo.max">
      </el-slider>
      <el-slider
        v-else-if="item.baseProperty.sliderInfo.step > 0"
        v-model="sliderValue"
        :max="item.baseProperty.sliderInfo.max"
        :step="item.baseProperty.sliderInfo.step"
        :marks="marks"
        show-stops>
      </el-slider>
    </div>
  </div>
</template>

<script>
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
    methods:{},
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
