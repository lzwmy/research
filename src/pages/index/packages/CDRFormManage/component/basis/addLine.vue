<template>
  <div class="add_line_container">
    <el-form :inline="true">
      <el-form-item>
        <el-input placeholder="条目名称"></el-input>
      </el-form-item>
      <span class="extent del">*</span>
      <el-form-item>
        <el-input placeholder="条目显示名称"></el-input>
      </el-form-item>
      <span class="extent del">*</span>
      <el-form-item>
        <el-select v-model="entryData.controlType"
                   size="mini"
                   placeholder="选择显示类型">
          <el-option v-for="item in selectShowList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input  v-model="entryData.termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
      </el-form-item>
      <el-form-item>
        <i v-if="entryData.displayIsVisible==1" class="iconfont iconfuhao2"></i>
        <i v-if="entryData.displayIsVisible==0" class="iconfont iconfuhao2 gray" ></i>
      </el-form-item>
      <el-form-item>
        <i class="iconfont iconfuhao7"></i>
      </el-form-item>
      <el-form-item>
        <i class="iconfont iconzidian"></i>
      </el-form-item>
      <!--<icon-display :item="entryData" @IsRequiredShow="onIsRequired"></icon-display>
      <icon-code-set :item="entryData" ></icon-code-set>
      <icon-set :item="entryData"></icon-set>
      <icon-add></icon-add>
      <move-up></move-up>
      <move-down></move-down>
      <icon-delte></icon-delte>-->
    </el-form>
  </div>
</template>

<script>
  import parameter from "./../parameter";
  import iconDelte from './iconDelete';
  import moveUp from './moveUp';
  import moveDown from './moveDown';
  import iconSet from './iconSet';
  import iconDisplay from './iconDisplay';
  import iconCodeSet from './iconCodeSet';
  import iconAdd from "./iconAdd";

  export default {
    name: "addLine",
    props:{
      item:{
        type:Object,
        default:null
      }
    },
    components: {
      iconDelte,
      moveUp,
      moveDown,
      iconSet,
      iconDisplay,
      iconCodeSet,
      iconAdd,
    },
    data() {
      return {
        selectShowList: parameter.typeData,//选择类型数据
        entryData: this.item || {
          "id": "",
          "controlName": "",//(控件名称)
          "controlDisplayName": "",//(控件显示名称)
          "controlIsAvailable": 1,//（控件是否可用）
          "controlType": "", //(控件显示类型)
          "displayIsVisible": 1, //(显示名称是否可见)
          "baseProperty": {
            "controlWidth": 0, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
            "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
            "controlTip": "", //(控件输入提示)
            "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
            "controlIsExtend": 0, //(下拉框是否可扩展)
            "labelType": null,
            "labelContent": null,
            "labelImage": null,
            "bindingInfo": {
              "itemId": "",
              "viewId": "",
              "viewColumn": "",
              "bindingType": "",
              "bindingColumn": "",
              "bindingColumnName": "",
              "list": []
            }
          },
          "termSet": {
            "termGroupOid": "", //(代码集OID)
            "termGroupName": '', //(代码集名称)
            "termDefaultValue": [],// 是否有默认值
            "termItemList": [],
            "foldFlag": 1,
          },
          "termUnit": {
            "numberIsSwitch": 1, //单位是否显示
            "unitName": "",//单位值
          },
          "gatherKnowType": 0, // (集合或表格： 无、 有无、 是否不详)
          "gatherRank": 0, //(集合或表格的显示形式)
          "gatherColumnNumber": 2,//集合列 最小2 最大值5
          "inputValue": "",//用于预览
          "gatherIsVisible": 1,//只用于集合或者表格的单元格的显示隐藏 0 1
          "gatherFoldFlag": 0,//是否不详参数隐藏
          "children": [],//(此条目的子条目)
          "binding": 0
        },
      }
    },
    methods:{
      //显示 隐藏
      onIsRequired(value) {
        console.log(value)
        this.entryData = value;
      }
    },
    mounted() {
      console.log(this.item)
    }
  }
</script>

<style scoped>

</style>
