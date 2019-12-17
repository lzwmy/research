<template>
    <div class="basis_config_container">
      <!--<div class="component_head flex-between-center">
        <p>{{$route.query.type=='add' ? '新建' :'编辑'}}小节</p>
        <div class="head_content cur_pointer">
          <i class="iconfont iconguanbi" @click="close"></i>
        </div>
      </div>-->
      <div class="basis_nav-box">
        <div class="nav_info-content">
          <div class="portion_input-left">
            <el-input  placeholder="请输入小节名称"  maxlength="30" v-model="portionName" size="mini"></el-input>
          </div>
          <div class="btn-right-box">
            <el-button type="primary" @click="previewBtn">
              <i class="iconfont iconfuhao2"></i>
              预览
            </el-button>
            <el-button type="primary" @click="saveBtn">
              <i class="iconfont iconbaocun"></i>
              确定添加
            </el-button>
            <el-button type="primary" @click="addItem">
              <i class="iconfont icontianjia"></i>
              添加条目
            </el-button>
          </div>
        </div>
      </div>
      <div class="basis_body-content">
        <!--内容配置-->
        <div class="basis_content_config" v-if="basisDataList.length!==0 && refreshView">
          <div class="content-box"  v-for="(basisItem,basisIndex) in basisDataList" :key="basisIndex">
            <div class="content-line">
              <span style="display: inline-block;min-width: 34px;">
                <i class="iconfont iconbianji" v-if="$store.state.CRFConfig.activeModifyState == basisItem"></i>
              </span>
              <el-form :model="basisItem" :rules="rules">
                <el-form-item prop="controlDisplayName" style="margin-bottom: 0;">
                  <el-input v-focus placeholder="条目显示名称" v-model="basisItem.controlDisplayName" size="mini" @focus="activeConfig(basisItem,basisIndex,basisDataList)" ></el-input>
                </el-form-item>
              </el-form>
              <span class="content_must-fill">*</span>
              <!--控件类型-->
              <el-select v-model="basisItem.controlType" size="mini" @change="changeControlType(basisItem,basisIndex,basisDataList)">
                <el-option v-for="item in selectShowList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
              <span class="content_must-fill">*</span>
              <!--单位-->
              <el-select v-if="basisItem.termUnit.numberIsSwitch=='1'&&basisItem.controlType=='NUMBER_INPUT'" v-model="basisItem.termUnit.unitName" filterable size="mini">
                <el-option v-for="item in unitList"
                           :key="item.id"
                           :label="item.unitName"
                           :value="item.unitName"></el-option>
              </el-select>
              <!--是否不详-->
              <el-select v-if="basisItem.controlType=='GATHER'||basisItem.controlType=='TABLE'" v-model="basisItem.gatherKnowType" size="mini" placeholder="是否不详">
                <el-option label="无" :value="0"></el-option>
                <el-option label="有无" :value="1"></el-option>
                <el-option label="是否不详" :value="2"></el-option>
              </el-select>
              <!--是否必填-->
              <i class="iconfont iconfuhao2 gray" v-if="basisItem.displayIsVisible=='0'" @click="isVisible(basisItem)"></i>
              <i class="iconfont iconfuhao2" v-else @click="isVisible(basisItem)"></i>
              <!--设置-->
              <!--<i class="iconfont iconfuhao7" v-if="basisItem.controlType!==''" @click="changeParameterConfig(basisItem)"></i>-->
              <!--添加-->
              <i class="iconfont iconfuhao1"
                 v-if="basisItem.controlType=='GATHER'||basisItem.controlType=='TABLE'"
                @click="add(basisItem)"></i>
              <!--切换-->
              <i class="iconfont iconzujian" v-if="basisItem.controlType=='NUMBER_INPUT'" @click="switchType(basisItem)"></i>
              <!--上移-->
              <i class="iconfont iconfuhao5" @click="moveTop(basisItem,basisIndex,basisDataList)"></i>
              <!--下移-->
              <i class="iconfont iconfuhao6" @click="moveDown(basisItem,basisIndex,basisDataList)"></i>
              <!--删除-->
              <i class="iconfont iconfuhao4 del" @click="deleteBlock(basisIndex)"></i>
            </div>
            <!--{{basisItem}}-->
            <basis-component v-if="basisItem.children.length!==0" :children="basisItem.children" ></basis-component>
          </div>
        </div>
        <div class="basis_content_config blank_page" v-else>
          <img src="./image/none_content.png" alt="">
        </div>
        <!--参数配置-->
        <div class="basis_parameter_config" v-if="JSON.stringify(basisDataInfo)!=='{}'">
          <parameter-config v-if="JSON.stringify(basisDataInfo)!=='{}'" :basicDataInfo="basisDataInfo" ></parameter-config>
        </div>
        <div class="basis_parameter_config blank_page" v-else>
          <img src="./image/none_content.png" alt="">
        </div>
      </div>
      <!--添加条目弹框-->
      <add-item-data :displayMask="displayMask"
                     @selection-add="selectionAdd"
                     @direct-add = 'addDirect'
                     @close-dialog="closeDialog">
      </add-item-data>
      <!--小节配置实时预览-->
      <config-portion-preview :portionMask="portionMask"
                              :configDataInfo="portionPreviewData"
                              @close-dialog="closeDialog">
      </config-portion-preview>
    </div>
</template>

<script>
  import parameter from './js/parameter';
  import basisComponent from './basisComponent';
  import parameterConfig from './parameterConfig';
  import addItemData from './addItemData';
  import configPortionPreview from './configPortionPreview';
  import test from  './js/verificationData';
    export default {
      props:{
        configData:{
          type:Object,
          default:null
        }
      },
      components:{
        basisComponent,
        parameterConfig,
        addItemData,
        configPortionPreview
      },
      watch:{
        "$store.state.CRFConfig.basisDataInfo":{
          deep:true,
          handler:function (data) {
            this.basisDataInfo = data;
          }
        }
      },
      data() {
        return {
          displayMask:false,//添加条目弹框
          portionMask:false,
          refreshView:true,// 是否刷新当前视图
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
          basisDataList:[],
          basisDataInfo:{},
          portionName:"",//小节名称
          portionPreviewData:{},
          activeId:"",
          // 条目显示名称验证
          rules:{
            controlDisplayName:[
              {required: true, message: '请输入条目名称', trigger: 'blur'}
            ]
          }
        }
      },
      methods:{
        resize() {
          let height = $(".basis_config_container").height();
          $('.basis_body-content').height(height-91)
        },
        //关闭
        close() {
          window.history.go(-1);
        },
        activeConfig(data,index,array) {
          // console.log(data,this.configData);
          this.basisDataInfo = {
            obj:data,
            selectType:data.controlType,
            index:index
          };
          this.$store.commit('CRF_SET_OBJECT',this.basisDataInfo);
          this.$store.commit('SET_ARRAY',array);
          this.$store.commit('SET_INDEX',index);
          this.$store.commit('SET_MODIFY_STATE',data);
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
            "isRequired":false, ////表单是否必填项
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
            }
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
          this.basisDataInfo = {
            obj:data,
            selectType:data.controlType,
            index:index
          };
          this.$store.commit('CRF_SET_OBJECT',this.basisDataInfo);
          this.$store.commit('SET_ARRAY',array);
          this.$store.commit('SET_INDEX',index);
          this.$store.commit('SET_MODIFY_STATE',data);
        },
        //集合 or 表格添加
        add(data) {
          if(data.controlDisplayName!==""){
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
          this.$store.commit('SET_MODIFY_STATE',data);
        },
        // 设置 参数配置
        changeParameterConfig(data) {
          this.basisDataInfo = {
            obj:data,
            selectType:data.controlType,
            index:0
          };
          this.$store.commit('CRF_SET_OBJECT',this.basisDataInfo);
        },
        // 数值 切换
        switchType(data) {
          if(data.termUnit.numberIsSwitch == 1) {
            data.termUnit.numberIsSwitch = 0
          }else{
            data.termUnit.numberIsSwitch  = 1
          }
          this.$store.commit('SET_MODIFY_STATE',data);
        },
        //删除行
        deleteBlock(index) {
          this.basisDataInfo = {};
          let copyData = JSON.parse(JSON.stringify(this.basisDataList));
          copyData.splice(index,1);
          this.basisDataList = [];
          this.$nextTick(() => {
            this.basisDataList = copyData;
          });
          this.$store.commit('SET_MODIFY_STATE',{});
        },
        //上移
        moveTop(data,index,array) {
          if(index === 0 ) {
            this.$notice('已经置顶了，请往下移！');
            return ;
          }
          let copyLine = Object.assign({},data);
          copyLine.baseProperty.layout = {
            "columns":1,
            "selection":[],
            "wrap":1,
            "displayChecked":[]
          };
          array.splice(index-1,0,copyLine);
          array.splice(index+1,1);
          this.basisDataInfo = {};
          // 清除 当前一下 所有 layOut 布局数据
          for(let i=index;i<array.length;i++) {
            array[i].baseProperty.layout = {
              "columns":1,
              "selection":[],
              "wrap":1,
              "displayChecked":[]
            }
          }
          //更新视图，避免子组件不刷新
          this.refreshView = false;
          this.$nextTick(()=>{
            this.refreshView = true;
            this.$store.commit('SET_MODIFY_STATE',copyLine);
          })
        },
        //下移
        moveDown(data,index,array) {
          if(array.length-1 === index) {
            this.$notice('已经置底了，请往上移！');
            return ;
          }

          let copyLine = Object.assign({},data);
          copyLine.baseProperty.layout = {
            "columns":1,
            "selection":[],
            "wrap":1,
            "displayChecked":[]
          };
          array.splice(index+2,0,copyLine);
          array.splice(index,1);
          this.basisDataInfo = {};
          // console.log(array[index]);
          //清空向下移所有 layout 布局信息
          for(let i=index+1;i<array.length;i++) {
            array[i].baseProperty.layout = {
              "columns":1,
              "selection":[],
              "wrap":1,
              "displayChecked":[]
            }
          }
          //更新视图，避免子组件不刷新
          this.refreshView = false;
          this.$nextTick(()=>{
            this.refreshView = true;
            this.$store.commit('SET_MODIFY_STATE',copyLine);
          })
        },
        //添加条目 -- 显示弹框
        addItem() {
          this.displayMask = true;
        },
        //关闭弹框
        closeDialog(data) {
          this.displayMask = data;
          this.portionMask = data;
        },
        // 弹框 选中添加
        selectionAdd(data) {
          data.forEach(item=>{
            let copyData = Object.assign({},JSON.parse(JSON.stringify(parameter.initData)));
            copyData.controlDisplayName = item.elNameCN;
            copyData.controlType = item.ctrlType;
            copyData.baseProperty.layout = {
              "columns":1,
              "selection":[], //当前选中
              "wrap":1,
              "displayChecked":[], //展示
            };
            this.basisDataList.push(copyData)
          })
        },
        //弹框 直接添加
        addDirect(data) {
          let copyData = Object.assign({},JSON.parse(JSON.stringify(parameter.initData)));
          copyData.controlDisplayName = data.controlDisplayName;
          copyData.controlType = data.controlType;
          copyData.baseProperty.layout = {
            "columns":1,
            "selection":[],
            "wrap":1,
            "displayChecked":[],
          };
          this.basisDataList.push(copyData)
        },
        //保存
        saveBtn() {
          // let temporarySave = JSON.parse(localStorage.getItem('temporarySave'));
          // 验证表单名称是否填写完成
          if(test.verificationData(this.basisDataList) == false || this.portionName == "") {
            this.$message.info('表单名称不能为空');
            return ;
          }
          if(this.basisDataList.length === 0) {
            this.$message.info('请添加条目');
            return ;
          }
          if(test.repeatNameTest(this.basisDataList)) {
            this.$message.info('同级下条目名称存在重复');
            return ;
          }
          if(this.configData.type == 'add') {
            console.log('触发')
            /*this.portionSave()*//*.then(()=>{
              let formData = {
                "formCrfId": "",
                "formPortionId": "",
                "portionName": this.portionName,
                "diseaseId":this.$route.query.id,
                "formItemList": this.basisDataList||[]
              };
            });*/
            let formData = {
              "id": this.configData.id,
              "portionName": this.portionName,
              "diseaseId": this.$route.query.id,
              "formItemList": this.basisDataList||[],
              "index":this.configData.index,
              "type":this.configData.type
            };
            console.log(formData);
            this.$emit('portion-callback-add',formData);
          }else if(this.configData.type == 'modify') {
            /*this.portionModifySave().then(()=>{
              let formData = {
                "id": this.configData.id,
                "portionName": this.portionName,
                "diseaseId": this.$route.query.id,
                "formItemList": this.basisDataList||[],
                "index":this.configData.index,
                "type":this.configData.type
              };
              this.$emit('portion-callback-data',formData);
            })*/
            let formData = {
              "id": this.configData.id,
              "portionName": this.portionName,
              "diseaseId": this.$route.query.id,
              "formItemList": this.basisDataList||[],
              "index":this.configData.index,
              "type":this.configData.type
            };
            this.$emit('portion-callback-data',formData);
          }
        },
        //预览
        previewBtn() {
          if(this.portionName==""){
            this.$message.info('请输入小节名称');
            return ;
          }
          this.portionMask = true;
          let array = [];
          this.basisDataList.forEach(item=>{
            array.push(
              Object.assign({},JSON.parse(JSON.stringify(item)))
            )
          });
          this.portionPreviewData.portionName = JSON.parse(JSON.stringify(this.portionName)) || "";
          this.portionPreviewData.formItemList = array;
        },
        // 配置小节 新增保存
        async portionSave() {
          let that = this;
          let formData = {
            "formCrfId": that.$route.query.crfId,
            "formPortionId": that.configData.id,
            "portionName": that.portionName,
            "diseaseId":that.$route.query.id,
            "formItemList": that.basisDataList||[]
          };
          try {
            let data = await that.$http.CRFPortionBakSave(formData);
            // console.log(data);
            if(data.code == 0) {
              // this.$message.success(data.data);
              this.$message.success("保存成功");
              //保存成功跳转到 CRF表单
              // window.history.go(-1);
              let formData = {
                "id": that.configData.id,
                "portionName": that.portionName,
                "diseaseId": that.$route.query.id,
                "formItemList": that.basisDataList||[],
                "index":that.configData.index,
                "type":that.configData.type
              };
              console.log(formData);
              this.$emit('portion-callback-add',formData);
            }
          }catch (error) {
            console.log(error)
          }
        },
        //配置小节 编辑保存
        async portionModifySave() {
          let that = this;
          let formData = {
            "formCrfId": that.$route.query.crfId,
            "formPortionId": that.configData.id,
            "portionName": that.portionName,
            "diseaseId": that.$route.query.id,
            "formItemList": that.basisDataList||[]
          };
          try {
            let data = await that.$http.CRFPortionBakModify(formData);
            // console.log(data);
            if(data.code == 0) {
              // this.$message.success(data.data);
              this.$message.success("保存成功");
              //保存成功跳转到 CRF表单
              // window.history.go(-1);
            }
          }catch (error) {
            console.log(error)
          }
        },
        //预览小节
        async previewPortionData() {
          let that = this;
          let formData = {
            formPortionId:that.$route.query.portionId
          };
          try {
            let data = await that.$http.CRFPreviewPortion(formData);
            console.log(data)
            if(data.code == 0) {
              that.portionName = data.data.portionName;
              that.basisDataList = data.data.formItemList;
            }
          }catch (error) {
            console.log(error)
          }
        },
        //获取单位列表
        async UnitListOrg() {
          let that = this;
          try{
            let data = await that.$http.crfUnitList()
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
        this.$store.commit('CRF_SET_OBJECT',{});
        this.UnitListOrg();
        this.$nextTick(()=>{
          this.resize();
        });
        // console.log('portion page',this.configData);
        if(this.configData.type=='add'){
          this.portionName = this.configData.portionName || "";
          this.basisDataList = [];
        }else if(this.configData.type=='modify'){
          this.portionName = this.configData.portionName;
          this.basisDataList = this.configData.formItemList;
        }

        /*if(this.$route.query.type =='modify') {
          if(this.$route.query.portionId!=='0') {
            this.previewPortionData();
          }else{
            let temporarySave = JSON.parse(localStorage.getItem('temporarySave'));
            let i = this.$route.query.i;
            let portionObj = temporarySave.dataList[i];
            console.log(portionObj)
            this.portionName = portionObj.portionName;
            this.basisDataList = portionObj.formItemList;
          }
        }
        if(this.$route.query.portionName !== '0') {
          this.portionName = this.$route.query.portionName;
        }*/
      },
      destroyed() {
        this.$destroy();
      }
    }
</script>

<style lang="less" scoped>
.basis_config_container{
  .component_head{
    p{
      font-size: 18px;
      color: #394263;
      font-weight:bold;
      cursor: pointer;

    }
  }
  .basis_body-content{
    display: flex;
    /*height: 100%;*/
    /*flex:1;*/
    /*min-height: 809px;*/
    flex-direction: row;
    box-sizing: border-box;
    padding: 0 30px;
    .basis_content_config{
      /*width: 1120px;*/
      flex: 1;
      background-color: #ffffff;
      margin-right: 20px;
      border: 1px solid #E5EBEC;
      box-sizing: border-box;
      padding: 15px 15px 0 15px;
      overflow: auto;
      .content-box{
        .content-line{
          display: flex;
          flex-direction:row;
          align-items: center;
          margin-bottom: 10px;
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
    .blank_page{
      /*width: 100%;*/
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        height: 150px;
      }
    }
    .basis_parameter_config{
      /*width:490px;*/
      width:692px;
      background-color: #ffffff;
      border: 1px solid #E5EBEC;
      box-sizing: border-box;
      padding: 30px 20px 0 20px;
      overflow: auto;
      /*flex: 1;*/
    }
  }
  .basis_nav-box{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 30px;
    margin-bottom: 15px;
    box-sizing: border-box;
    .nav_info-content{
      width: 100%;
      height: 76px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: #ffffff;
      border:1px solid #E5EBEC;
      padding: 0 30px;
      box-sizing: border-box;
      .btn-right-box{
        .el-button--primary{
          background-color: #1BBAE1;
          &:hover{
            background-color: #14aed4;
          }
        }
        .iconfont{
          font-size: 14px;
          padding-right: 9px;
        }
      }
    }
  }
}
</style>
<style lang="less">
  .basis_config_container{
    .el-input__inner{
      border-radius: 2px;
    }
  }
</style>
