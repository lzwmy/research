<template>
    <div class="basis_component_container">
        <div class="basis_component-content" v-for="(basisDataItem,basisDataIndex) in basisData" :key="basisDataIndex">
          <div class="component-content">
              <el-input placeholder="条目名称" v-model="basisDataItem.controlName" size="mini"></el-input>
              <span class="content_must-fill">*</span>
              <el-input placeholder="条目显示名称" v-model="basisDataItem.controlDisplayName" size="mini"></el-input>
              <span class="content_must-fill">*</span>
              <!--控件类型-->
              <el-select v-model="basisDataItem.controlType" size="mini">
                <el-option v-for="item in selectShowList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
              <span class="content_must-fill">*</span>
              <!--单位-->
              <el-select v-if="basisDataItem.termUnit.numberIsSwitch=='1'&&basisDataItem.controlType=='NUMBER_INPUT'" v-model="unitName" size="mini">
                <el-option v-for="item in unitList"
                           :key="item.id"
                           :label="item.unitName"
                           :value="item.unitName"></el-option>
              </el-select>
              <!--是否不详-->
              <el-select v-if="basisDataItem.controlType=='GATHER'||basisDataItem.controlType=='TABLE'" v-model="basisDataItem.gatherKnowType" size="mini" placeholder="是否不详">
                <el-option label="无" :value="0"></el-option>
                <el-option label="有无" :value="1"></el-option>
                <el-option label="是否不详" :value="2"></el-option>
              </el-select>
              <!--是否必填-->
              <i class="iconfont iconfuhao2 gray" v-if="basisDataItem.controlIsAvailable=='0'"></i>
              <i class="iconfont iconfuhao2" v-else></i>
              <!--设置-->
              <i class="iconfont iconfuhao7" v-show="basisDataItem.controlType!==''"></i>
              <!--添加-->
              <i class="iconfont iconfuhao1" v-if="basisDataItem.controlType=='GATHER'||basisDataItem.controlType=='TABLE'"></i>
              <!--删除-->
              <i class="iconfont iconfuhao4 del"></i>
              <!--切换-->
              <i class="iconfont iconzujian" v-if="basisDataItem.controlType=='NUMBER_INPUT'"></i>
              <!--上移-->
              <i class="iconfont iconfuhao5"></i>
              <!--下移-->
              <i class="iconfont iconfuhao6"></i>
          </div>

        </div>
    </div>
</template>

<script>
    export default {
      name: "basisComponent",
      props:{
        children:{
          type:Array,
          default:null
        }
      },
      data() {
        return {
          basisData:this.children,
          selectShowList:[
            {
              name:"单行文本框",
              value:'SINGLE_INPUT'
            },
            {
              name:"多行文本框",
              value:"MULTI_INPUT"
            },
            {
              name:"标签",
              value:"LABEL"
            },
            {
              name:"日期",
              value:"DATE"
            },
            {
              name:"日期时间",
              value:"DATE_TIME"
            },
            {
              name:"数值",
              value:"NUMBER_INPUT"
            },
            {
              name:"单选下拉",
              value:"SINGLE_COMBOX"
            },
            {
              name:"多选下拉",
              value:"MULTI_COMBOX"
            },
            {
              name:"单选框",
              value:"RADIO_BUTTON"
            },
            {
              name:"多选框",
              value:"CHECKBOX"
            },
            {
              name:"集合",
              value:"GATHER"
            },
            {
              name:"表格",
              value:"TABLE"
            },
            {
              name:"文件上传",
              value:"FILE_UPLOAD"
            },
            /*{
              name:"超链接",
              value:"linkURL"
            }*/
          ],
        }
      },
      methods:{},
      mounted() {
      }
    }
</script>

<style lang="less" scoped>
  .basis_component_container{
    margin-left: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
    .basis_component-content{
      display: flex;
      flex-direction: column;
      .component-content{
        display: flex;
        flex-direction:row;
        align-items: center;
        .el-input,.el-select{
          width: 160px;
        }
        .content_must-fill{
          padding-left: 5px;
          padding-right: 10px;
          color: #DB5452;
        }
        .iconfont{
          font-size: 20px;
          color: #1BBAE1;
          padding: 0 7px;
        }
        .gray{
          color: #9CA0B1;
        }
        .del{
          color: #DB5452;
        }
      }
    }
  }
</style>
