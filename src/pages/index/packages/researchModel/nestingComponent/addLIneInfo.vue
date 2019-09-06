<template>
    <div class="add_line_info">
      <div class="line_data_info" v-if="item.controlType!==''">
        <el-input class="config_parameter" v-model="item.displayName" placeholder="参数路径" @change="stateTransmit"></el-input>
        <el-select v-model="item.operator" v-if="item.controlType=='SINGLE_COMBOX'||item.controlType=='MULTI_COMBOX'||item.controlType=='RADIO_BUTTON'||item.controlType=='CHECKBOX'" @change="stateTransmit">
          <el-option
            v-for="item in matchConditionList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="item.operator" v-if="item.controlType=='SINGLE_INPUT'||item.controlType=='MULTI_INPUT'" @change="stateTransmit">
          <el-option
            v-for="item in matchConditionList3"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="item.operator" v-if="item.controlType=='NUMBER_INPUT'||item.controlType=='DATE_TIME'||item.controlType=='DATE'" @change="stateTransmit">
          <el-option
            v-for="item in matchConditionList2"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-if="item.controlType=='SINGLE_INPUT'||item.controlType=='MULTI_INPUT'||item.controlType=='NUMBER_INPUT'||item.controlType=='SINGLE_COMBOX'||item.controlType=='MULTI_COMBOX'||item.controlType=='RADIO_BUTTON'||item.controlType=='CHECKBOX'" class="config_parameter input_textareaWith"  v-model="item.value1" @change="stateTransmit"></el-input>
        <!--<el-select v-if="item.controlType=='SINGLE_COMBOX'||item.controlType=='MULTI_COMBOX'||item.controlType=='RADIO_BUTTON'||item.controlType=='CHECKBOX'"  v-model="item.value2">
          <el-option
            v-for="item in codeSetList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
        <el-date-picker
          v-if="item.controlType=='DATE'"
          v-model="item.value2"
          value-format="yyyy-MM-dd"
          type="date"
          @change="stateTransmit"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-if="item.controlType=='DATE_TIME'"
          v-model="item.value2"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          @change="stateTransmit"
          placeholder="选择日期">
        </el-date-picker>
<!--        <i class="el-icon-remove-outline" title="删除" @click="delCondition(PItem,Index)"></i>-->
        <i class="iconfont iconfuhao4" title="删除" @click="delCondition(PItem,Index)"></i>
      </div>
    </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex';
    export default {
      name: "addLIneInfo",
      props:{
        item:{
          type:Object,
          default:null
        },
        Index:{
          type:Number,
          default:null
        },
        PItem:{
          type:Array,
          default:null
        }
      },
      data() {
        return {
          matchCondition:"",//匹配条件
          //用于 单选、多选、下拉单选、下拉多选
          matchConditionList:[
            {
              name:"不等于",
              value:"!="
            },
            {
              name:"等于",
              value:"=="
            }
          ],
          //用于数值框、日期、日期时间
          matchConditionList2:[
            {
              name:"不等于",
              value:"!="
            },
            {
              name:"等于",
              value:"=="
            },
            {
              name:"大于",
              value:">"
            },
            {
              name:"大于等于",
              value:">="
            },
            {
              name:"小于",
              value:"<"
            },
            {
              name:"小于等于",
              value:"<="
            },
            {
              name:"范围",
              value:"<>"
            }
          ],
          //只用于 单行文本 和 多行文本
          matchConditionList3:[
            {
              name:"开始于",
              value:"^"
            },
            {
              name:"结束于",
              value:"$"
            },
            {
              name:"包含",
              value:"[]"
            },
            {
              name:"只包含",
              value:"()"
            }
          ],
          codeSet:"",//代码集
          codeSetList:[
            {
              value: 0,
              label: '全部'
            }, {
              value: 1,
              label: '任一'
            }
          ],//代码集处理
          dataPicker:"",//日期
        }
      },
      methods:{
        delCondition(PItem,index) {
          this.$store.commit("STATE_GRAY",null);
          PItem.splice(index,1)
        },
        stateTransmit() {
          this.$emit('state-refresh',{refresh:true})
        }
      },
      mounted() {
        console.log(this.item)
      }
    }
</script>

<style lang="less" scoped>
.add_line_info{
  width: 100%;
  .line_data_info{
    width: 100%;
    margin-top: 10px;
    .config_parameter{
      display: inline-block;
      width: 20%;
    }
    .input_textareaWith{
      display: inline-block;
      width: 15%;
    }
    .el-select{
      width: 10%;
    }
    i{
      color: #F0433C;
      vertical-align: middle;
      cursor: pointer;
     /* background-color: #F0433C;
      border-radius: 50%;
      font-size: 16px;
      vertical-align: middle;
      margin-left: 1%;*/
    }
  }
}
</style>
