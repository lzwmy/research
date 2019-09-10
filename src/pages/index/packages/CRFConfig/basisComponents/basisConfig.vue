<template>
    <div class="basis_config_container">
      <div class="basis_body-content">
        <!--内容配置-->
        <div class="basis_content_config">
          <div class="content-box">
            <div class="content-line">
              <el-input placeholder="条目名称" v-model="basisData.controlName" size="mini"></el-input>
              <span class="content_must-fill">*</span>
              <el-input placeholder="条目显示名称" v-model="basisData.controlDisplayName" size="mini"></el-input>
              <span class="content_must-fill">*</span>
              <!--控件类型-->
              <el-select v-model="basisData.controlType" size="mini" @change="changeControlType(basisData)">
                <el-option v-for="item in selectShowList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
              <span class="content_must-fill">*</span>
              <!--单位-->
              <el-select v-if="basisData.termUnit.numberIsSwitch=='1'&&basisData.controlType=='NUMBER_INPUT'" v-model="basisData.termUnit.unitName" filterable size="mini">
                <el-option v-for="item in unitList"
                           :key="item.id"
                           :label="item.unitName"
                           :value="item.unitName"></el-option>
              </el-select>
              <!--是否不详-->
              <el-select v-if="basisData.controlType=='GATHER'||basisData.controlType=='TABLE'" v-model="basisData.gatherKnowType" size="mini" placeholder="是否不详">
                <el-option label="无" :value="0"></el-option>
                <el-option label="有无" :value="1"></el-option>
                <el-option label="是否不详" :value="2"></el-option>
              </el-select>
              <!--是否必填-->
              <i class="iconfont iconfuhao2 gray" v-if="basisData.displayIsVisible=='0'" @click="isVisible(basisData)"></i>
              <i class="iconfont iconfuhao2" v-else @click="isVisible(basisData)"></i>
              <!--设置-->
              <i class="iconfont iconfuhao7" v-if="basisData.controlType!==''" @click="changeParameterConfig(basisData)"></i>
              <!--添加-->
              <i class="iconfont iconfuhao1"
                 v-if="basisData.controlType=='GATHER'||basisData.controlType=='TABLE'"
                @click="add(basisData)"></i>
              <!--删除-->
              <!--<i class="iconfont iconfuhao4 del"></i>-->
              <!--切换-->
              <i class="iconfont iconzujian" v-if="basisData.controlType=='NUMBER_INPUT'" @click="switchType(basisData)"></i>
              <!--上移-->
              <!--<i class="iconfont iconfuhao5"></i>-->
              <!--下移-->
              <!--<i class="iconfont iconfuhao6"></i>-->
            </div>
            <basis-component v-if="basisData.children.length!==0" :children="basisData.children"></basis-component>
          </div>
          <div>{{basisData}}</div>
        </div>
        <!--参数配置-->
        <div class="basis_parameter_config">
          <parameter-config v-if="JSON.stringify(basisDataInfo)!=='{}'" :basicDataInfo="basisDataInfo"></parameter-config>
        </div>
      </div>
    </div>
</template>

<script>
  import parameter from './js/parameter';
  import basisComponent from './basisComponent';
  import parameterConfig from './parameterConfig';
    export default {
      components:{
        basisComponent,
        parameterConfig
      },
      data() {
        return {
          //下拉 数据 有集合
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
          controlType:'SINGLE_INPUT',
          //选择单位
          unitList:[
            {
              unitName:"hour",
              value:"hour"
            },
            {
              unitName:"ml",
              value:"ml"
            },
            {
              unitName:"L",
              value:"L"
            },
            {
              unitName:"mg",
              value:"mg"
            },
            {
              unitName:"ug",
              value:"ug"
            },
            {
              unitName:"g",
              value:"g"
            },
            {
              unitName:"min",
              value:"min"
            }
          ],
          unitName:"",
          gatherKnowType:'',// 是否不详
          basisData:{
            "id": "",
            "controlName": "",
            "diseaseId": "",
            "controlDisplayName": "",
            "controlType": "",
            "displayIsVisible": 1,
            "baseProperty": {
              "controlWidth": 0,
              "controlHeight": 0,
              "controlTip": "",
              "controlIsDefaultDateTime": 0,
              "controlIsExtend": 0,
              "labelType": "",
              "labelContent": "",
              "labelImage": "",
              "bindingInfo": {
                "id": "",
                "itemId": "",
                "viewId": "",
                "viewName": "",
                "viewColumn": "",
                "bindingType": "",
                "bindingColumn": "",
                "bindingColumnName": "",
                "list": [
                  {
                    "id": "",
                    "bindingId": "",
                    "operator": "",//Equals
                    "operatorName": "", //等于
                    "param": "",
                    "param2": "",
                    "columnEn": "",
                    "columnName": ""
                  }
                ],
                "groupColumn": "",
                "keyColumn": ""
              },
              "fileType": "",
              "itemFileRsp": [
                {
                  "fileId": "",
                  "fileName": ""
                }
              ]
            },
            "termSet": {
              "termDefaultValue": [],
              "termItemList": [ //值域
                {
                  "id": "",
                  "termItemName": ""
                }
              ]
            },
            "termUnit": {
              "numberIsSwitch": 1, //0: 代码集/值域, 1: 单位表
              "unitName": ""
            },
            "gatherKnowType": 0,
            "gatherFoldFlag": 0,//展开: 0, 折叠: 1
            "controlIsAvailable": 0,
            "gatherRank": 0,//上下排列: 1, 左右排列: 2
            "gatherColumnNumber": 0,
            "binding": 0,//0 没有绑定 1 绑定"
            "fileType": "",
            "children": []
          },
          basisDataInfo:{}
        }
      },
      methods:{
        //控件类型
        changeControlType(data) {
          if(data.controlType == 'GATHER'|| data.controlType == 'TABLE') {
            data.children = [];
          }
          //选择类型是 清除termUnit设置
          data.baseProperty={
            "controlWidth": 4, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
            "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
            "controlTip": "", //(控件输入提示)
            "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
            "controlIsExtend":0, //(下拉框是否可扩展)
            "labelType":null,
            "labelContent":null,
            "labelImage":null,
            "itemFileRsp":[],
            "fileType":"FILE",
            "binding":0,
            "bindingInfo":{
              "itemId":"",
              "viewId":"",
              "viewColumn":"",
              "bindingType":"",
              "bindingColumn":"",
              "bindingColumnName":"",
              "list":[]
            }
          };
          data.termSet= {
            "termGroupOid": "", //(代码集OID)
            "termGroupName":'', //(代码集名称)
            "termDefaultValue":[],// 是否有默认值
            "termItemList": [],
            "foldFlag":1,
          };
          data.termUnit={
            "numberIsSwitch":1, //单位是否显示
            "unitName":"",//单位值
          };
          data.gatherKnowType=0;
          data.inputValue="";
          data.gatherRank=0;
          data.gatherColumnNumber=2;
          data.gatherIsVisible=1;
          data.gatherFoldFlag=0;
        },
        //集合 or 表格添加
        add(data) {
          if(data.controlName!==""&&data.controlDisplayName!==""){
            //添加到children
            let copyData = Object.assign({},JSON.parse(JSON.stringify(parameter.initData)));
            data.children.push(copyData);
          }else{
            this.$notice('请完成当前信息')
          }
        },
        //是否可见
        isVisible(data) {
          if(data.displayIsVisible == 1) {
            data.displayIsVisible = 0;
          }else{
            data.displayIsVisible = 1;
          }
        },
        // 设置 参数配置
        changeParameterConfig(data) {
          this.basisDataInfo = {
            obj:data,
            selectType:data.controlType,
            index:0
          }
        },
        // 切换 类型
        switchType(data) {
          if(data.termUnit.numberIsSwitch == 1) {
            data.termUnit.numberIsSwitch = 0
          }else{
            data.termUnit.numberIsSwitch  = 1
          }
        },

      },
      mounted() {
      }
    }
</script>

<style lang="less" scoped>
.basis_config_container{
  .basis_body-content{
    display: flex;
    height: 100%;
    flex:1;
    flex-direction: row;
    box-sizing: border-box;
    padding: 0 30px;
    .basis_content_config{
      width: 1120px;
      background-color: #ffffff;
      margin-right: 20px;
      border: 1px solid #E5EBEC;
      box-sizing: border-box;
      padding: 15px 15px 0 15px;
      .content-box{
        .content-line{
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
            cursor: pointer;
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
    .basis_parameter_config{
      width:480px;
      background-color: #ffffff;
      border: 1px solid #E5EBEC;
      box-sizing: border-box;
      padding: 30px 20px 0 20px;
      overflow: auto;
    }
  }
}
</style>
