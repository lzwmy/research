<template>
  <!--标签-->
  <div :class="item.controlType+'_view_box'" >
    <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
    <div :class="item.controlType" style="font-size: 14px;">
      <div  :class="item.controlType+'_title'">
         <span v-if="item.displayIsVisible=='1'">{{item.controlDisplayName}}</span>
      </div>
      <div v-if="item.baseProperty.labelType=='TEXT'" :class="item.controlType+'_box'">
        {{item.baseProperty.labelContent}}
      </div>
      <div v-if="item.baseProperty.labelType=='IMAGE'" :class="item.controlType+'_Image_box'">
        <img :src="`http://39.108.238.209:8805/research/file/downloadFile/${item.baseProperty.labelImage}`" :style="'width:'+item.baseProperty.controlWidth+'px;'" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "displayLabel",
  props: {
    item: {},
    report: {},
    index: Number
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .LABEL_view_box{
       min-height: 22px;
     }
  .LABEL{

  }
  .LABEL .LABEL_title{
    width: 200px;
    display:table-cell;
    /*padding-left: 1%;*/
    vertical-align: middle;
    font-size: 14px;
  }
  .LABEL .LABEL_box{
    width: 188px;
    display:table-cell;
  }
  .LABEL .LABEL_Image_box{
    display: table-cell;
    vertical-align: top;
  }
</style>
