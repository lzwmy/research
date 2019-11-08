<template>
    <div class="basis_component_container">
        <div class="basis_component-content"  v-for="(basisDataItem,basisDataIndex) in basisData" :key="basisDataIndex">
          <div class="component-content">
            <el-form :model="basisDataItem" :rules="rules">
              <el-form-item prop="controlDisplayName" style="margin-bottom: 0;">
                <el-input v-focus placeholder="条目显示名称" v-model="basisDataItem.controlDisplayName" size="mini" @focus="activeConfig(basisDataItem,basisDataIndex,basisData)" ></el-input>
              </el-form-item>
            </el-form>
              <!--<el-input v-focus placeholder="条目显示名称" v-model="basisDataItem.controlDisplayName" size="mini" @focus="activeConfig(basisDataItem,basisDataIndex,basisData)" ></el-input>-->
              <span class="content_must-fill">*</span>
              <!--控件类型-->
              <el-select v-model="basisDataItem.controlType" size="mini" @change="changeControlType(basisDataItem,basisDataIndex,basisData)">
                <el-option v-for="item in selectShowList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
              <span class="content_must-fill">*</span>
              <!--单位-->
              <el-select v-if="basisDataItem.termUnit.numberIsSwitch=='1'&&basisDataItem.controlType=='NUMBER_INPUT'" filterable v-model="basisDataItem.termUnit.unitName" size="mini">
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
              <i class="iconfont iconfuhao2 gray" v-if="basisDataItem.displayIsVisible=='0'" @click="isVisible(basisDataItem)"></i>
              <i class="iconfont iconfuhao2" v-else @click="isVisible(basisDataItem)"></i>
              <!--设置-->
              <!--<i class="iconfont iconfuhao7" v-show="basisDataItem.controlType!==''" @click="changeParameterConfigChildren(basisDataItem)"></i>-->
              <!--添加-->
              <i class="iconfont iconfuhao1" v-if="basisDataItem.controlType=='GATHER'||basisDataItem.controlType=='TABLE'" @click="addLine(basisDataItem,basisDataIndex)"></i>
              <!--删除-->
              <i class="iconfont iconfuhao4 del" @click="deleteLine(basisDataIndex)"></i>
              <!--切换-->
              <i class="iconfont iconzujian" v-if="basisDataItem.controlType=='NUMBER_INPUT'" @click="switchType(basisDataItem)"></i>
              <!--上移-->
              <i class="iconfont iconfuhao5" @click="moveTop(basisDataItem,basisDataIndex,basisData)"></i>
              <!--下移-->
              <i class="iconfont iconfuhao6" @click="moveDown(basisDataItem,basisDataIndex,basisData)"></i>
          </div>
          <basis-component v-if="basisDataItem.children.length!==0 && refreshView" :children="basisDataItem.children" ></basis-component>
        </div>
    </div>
</template>

<script>
  import parameter from './js/parameter';
    export default {
      name: "basisComponent",
      props:{
        children:{
          type:Array,
          default:null
        }
      },
      /*directives: {
        focus: {
          // 指令的定义
          inserted: function (el) {
            // 聚焦元素
            el.querySelector('input').focus()
          }
        }
      },*/
      data() {
        return {
          refreshView:true,//刷新子组件视图
          basisData:this.children,
          //控件选择类型
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
            {
              name:"评分",
              value:"SCORE"
            },
            {
              name:"级联控件",
              value:"CASCADE"
            }
            /*{
              name:"超链接",
              value:"linkURL"
            }*/
          ],
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
          basisDataInfo:{},
          // 条目显示名称验证
          rules:{
            controlDisplayName:[
              {required: true, message: '请输入条目名称', trigger: 'blur'}
            ]
          }
        }
      },
      methods:{
        activeConfig(data,index,array) {
          this.basisDataInfo = {
            obj:data,
            selectType:data.controlType,
            index:index
          };
          this.$store.commit('CRF_SET_OBJECT',this.basisDataInfo);
          this.$store.commit('SET_ARRAY',array);
          this.$store.commit('SET_INDEX',index);
        },
        //控件类型
        changeControlType(data,index,array) {
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
            "labelType":'TEXT',
            "labelContent":"",
            "labelImage":"",
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
            },
            "layout":{
              "columns":1,
              "selection":[],
              "wrap":1,
              "displayChecked":[]
            },
            "scoreInfo":{
              "scoreName":"",
              "scoreStatus":false,
            },
          };
          data.termSet= {
            "termGroupOid": "", //(代码集OID)
            "termGroupName":'', //(代码集名称)
            "termDefaultValue":[],// 是否有默认值
            "termItemList": [],
            "rangeText":"",
            "foldFlag":1,
          };
          data.termUnit={
            "numberIsSwitch":1, //单位是否显示
            "unitName":"",//单位值
          };
          data.gatherKnowType=0;
          data.inputValue="";

          data.gatherRank=data.controlType=='TABLE'? 1 : 0;
          data.gatherColumnNumber=2;
          data.gatherIsVisible=1;
          data.gatherFoldFlag=0;
          // 触发 数据设置
          this.basisDataInfo ={
            obj:data,
            selectType:data.controlType,
            index:index
          };
          this.$store.commit('CRF_SET_OBJECT',this.basisDataInfo);
          this.$store.commit('SET_ARRAY',array);
          this.$store.commit('SET_INDEX',index);
        },
        //是否可见
        isVisible(data) {
          if(data.displayIsVisible == 1) {
            data.displayIsVisible = 0;
          }else{
            data.displayIsVisible = 1;
          }
        },
        //添加行
        addLine(data,index) {
          if(data.controlType=='GATHER'||data.controlType == 'TABLE') {
            let copyData = Object.assign({},JSON.parse(JSON.stringify(parameter.initData)));
            data.children.push(copyData)
          }
        },
        // 设置
        changeParameterConfigChildren(data) {
          this.basisDataInfo = {
            obj:data,
            selectType:data.controlType,
            index:0
          };
          this.$store.commit('CRF_SET_OBJECT',this.basisDataInfo);
        },
        //删除行
        deleteLine(index) {
          this.basisData.splice(index,1);
        },
        // 数值 切换
        switchType(data) {
          if(data.termUnit.numberIsSwitch == 1) {
            data.termUnit.numberIsSwitch = 0
          }else{
            data.termUnit.numberIsSwitch  = 1
          }
        },
        //上移
        moveTop(data,index,array) {
          if(index === 0 ) {
            this.$notice('已经置顶了，请往下移！');
            return ;
          }
          let copyLine = Object.assign({},data);
          array.splice(index-1,0,copyLine);
          array.splice(index+1,1);
          // 清除 当前一下 所有 layOut 布局数据
          for(let i=index;i<array.length;i++) {
            array[i].baseProperty.layout = {
              "columns":1,
              "selection":[],
              "wrap":1,
              "displayChecked":[]
            }
          }
          this.refreshView = false;
          this.$nextTick(()=>{
            this.refreshView = true;
          });
        },
        //下移
        moveDown(data,index,array) {
          if(array.length-1 === index) {
            this.$notice('已经置底了，请往上移！');
            return ;
          }
          let copyLine = Object.assign({},data);
          array.splice(index+2,0,copyLine);
          array.splice(index,1)
          //清空向下移所有 layout 布局信息
          for(let i=index+1;i<array.length;i++) {
            array[i].baseProperty.layout = {
              "columns":1,
              "selection":[],
              "wrap":1,
              "displayChecked":[]
            }
          }
          this.refreshView = false;
          this.$nextTick(()=>{
            this.refreshView = true;
          });
        },
        //获取单位列表
        async UnitListOrg() {
          let that = this;
          try{
            let data = await that.$http.crfUnitList()
            console.log(data)
            if(data.code ===0){
              that.unitList = data.data
            }
          }catch (error) {
            that.$notice("获取单位列表数据失败");
            console.log(error);
          }
        },
      },
      mounted() {
        this.UnitListOrg()
        // console.log(parameter.initData);
      }
    }
</script>

<style lang="less" scoped>
  .basis_component_container{
    margin-left: 50px;
    .basis_component-content{
      display: flex;
      flex-direction: column;
      margin-top: 5px;
      margin-bottom: 5px;
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
    .basis_parameter_config{
      width: 490px;
      background-color: #ffffff;
      border: 1px solid transparent;
      box-sizing: border-box;
      padding: 30px 20px 0 20px;
      overflow: auto;
      position: absolute;
      top: 166px;
      right:45px;
      z-index: 10;
    }
  }
</style>
