<template>
    <div class="report_config-container">
      <div class="component_head flex-between-center">
        <p>
          <span class="break_box" @click="breakGo" v-show="formOptions.backStatus !== '3'">
            <i class="iconfont iconfanhui"></i>
            <span>返回</span>
            <i class="partition_line"></i>
          </span>
          <span class="title">{{formOptions.title}}</span>
        </p>
        <div class=" cur_pointer head_content flex-start-center">
          <el-button type="primary" @click="previewCRF">
            <i class="iconfont iconfuhao3"></i>
            预览
          </el-button>
          <el-button type="primary" @click="saveCRF">
            <i class="iconfont iconbaocun"></i>
            保存
          </el-button>
          <!--<el-button type="primary">
            <i class="iconfont icontijiao"></i>
            发布
          </el-button>-->
        </div>
      </div>
      <!--主体内容-->
      <div class="create_report-content" v-loading="loading">
        <div class="report-content-nav">
          <div class="report-title">
            <input type="text"  v-model="crfName" placeholder="请输入报告名称" @change="FormTitleFill(crfName)">
          </div>
          <div class="report-config_nav">
            <div class="config-nav_left">
              <div class="is-enable">
                <span>是否启用:</span>
                <el-switch
                  v-model="enable"
                  active-color="#1BBAE1">
                </el-switch>
              </div>
              <div class="report-type">
                <span>报告类型</span>
                <el-select v-model="crfType">
                  <el-option label="普通" :value="1"></el-option>
                  <el-option label="随访" :value="2"></el-option>
                </el-select>
              </div>
            </div>
            <div class="config-nav_right">
              <el-button type="primary" @click="add">
                <i class="iconfont icontianjia"></i>
                添加小节
              </el-button>
            </div>
          </div>
        </div>
        <div class="report_body-box">
          <div style="width: 100%" v-if="isReset&&dataList.length!==0">
            <draggable v-model="dataList" :options="options" @start="drag" @end="drop" :move="checkMove">
              <div class="report_body-item" v-for="(item,index) in dataList" :key="index">
                <div class="report_header-content">
                  <div class="display_line"></div>
                  <div class="header-title">{{item.portionName}}</div>
                  <div class="header-btn">
                    <span>
                      <i class="iconfont iconzujian14" @click="portionModify(item,index)"></i>
                    </span>
                    <span>
                      <i class="iconfont iconzujian26" @click="portionDeleteItem(item,index)"></i>
                    </span>
                  </div>
                </div>
                <div class="report_body-content" >
                  <!--{{item}}-->
                  <!--<div>暂时无法预览</div>-->
                  <preview-portion :item="item" ></preview-portion>
                </div>
              </div>
            </draggable>

          </div>
          <img v-else="dataList.length==0" src="./../basisComponents/image/none_content.png" alt="">
        </div>
      </div>
      <!--配置小节弹框-->
      <portion-config-dialog :displayMask="displayMask"
                             @portion-selection-add="portionSelectionAdd"
                             @update-add="updateAdd"
                             @close-dialog="closeDialog" >
      </portion-config-dialog>
      <!--预览报告表单-->
      <preview-crf-report :formMask="formMask"
                          :crfPreview="crfPreview"
                          @close-dialog="closeDialog">
      </preview-crf-report>
      <!--新增或者编辑小节弹框-->
      <portion-dialog :showConfigPortion="showConfigPortion"
                      :portionConfigData="portionConfigData"
                      @update-data="updateData"
                      @close-dialog="closeDialog">
      </portion-dialog>
    </div>
</template>

<script>
  import './../css/crfLayoutStyle.less';
  import portionConfigDialog from './portionConfigDialog';
  import previewPortion from './../preview/sectionPreview';
  import previewCrfReport from './previewCRFReport';
  import portionDialog from './portionDialog';
  import draggable from 'vuedraggable';
    export default {
      props:{
        crfData:{
          type:Object,
          default:null
        },
        formOptions:{
          type:Object,
          default: null
        }
      },
      components:{
        portionConfigDialog,
        previewPortion,
        previewCrfReport,
        portionDialog,
        draggable
      },
      data() {
        return {
          loading:false,
          enable:false,//是否启用
          crfType:1,// 1 报告 2 随访
          crfName:"",
          displayMask:false,
          formMask:false,
          showConfigPortion:false,
          isReset:false,
          dataList:[],
          crfPreview:{},
          portionConfigData:{},//配置小节数据
          formId:"",
          //拖动参数配置
          options:{
            scroll:true,
            group:'people'
          }
        }
      },
      watch:{
        "dataList":{
          deep:true,
          handler:function (value) {
            // this.dataList = value;
          }
        }
      },
      methods: {
        init() {
          // console.log('初始化1',this.crfData);
          this.crfName = this.crfData.crfDisplayName;
          this.enable = this.crfData.crfIsAvailable == '1' ? true : false;
          this.crfType = this.crfData.crfType;
          this.dataList = this.crfData.subjectPortions;
          // console.log(this.dataList);
          this.$nextTick(()=>{
            this.isReset = true;
          });
        },
        FormTitleFill(data) {
          if(this.formOptions.researchType == 'researchTarget') {
            this.$emit("callback-data",data)
          }
        },
        breakGo() {
          if(this.formOptions.backStatus == '1') {
            window.history.go(-1);
          }else if(this.formOptions.backStatus == '2') {
            this.$emit('back-status')
          }
        },
        add() {
          this.displayMask = true;
        },
        //开始
        drag(evt){
          // console.log('开始',evt);
        },
        //结束
        drop(evt) {
          this.isReset = false;
          let oldIndex = evt.oldIndex;
          let newIndex = evt.newIndex;
          this.$nextTick(()=>{
            this.isReset = true;
          });
        },
        // 移除
        checkMove(evt) {
          let startIndex = evt.draggedContext.index;
          let endIndex = evt.draggedContext.futureIndex;
        },
        //关闭弹框
        closeDialog(data) {
          this.displayMask = data;
          this.formMask = data;
          this.showConfigPortion = data;
        },
        //弹框 选中小节添加
        portionSelectionAdd(data) {
          console.log(data);
          this.isReset = true;
          this.dataList.push(data)
        },
        //编辑或 新增小节 数据更新
        updateData(data) {
          console.log("更新数据",data);
          this.isReset = false;
          if(data.type == 'modify') {
            let formData = {
              diseaseId:data.diseaseId,
              formItemList: data.formItemList,
              id:data.id,
              portionName:data.portionName
            };
            this.$nextTick(()=>{
              this.dataList.splice(data.index+1,0,formData);
              this.dataList.splice(data.index,1);
              this.isReset = true;
            });
          }
        },
        //新增 添加 小节
        updateAdd(data) {
          console.log('添加 小节',data)
          this.isReset = true;
          let formData = {
            diseaseId:data.diseaseId,
            formItemList: data.formItemList,
            id:data.id,
            portionName:data.portionName
          };
          this.dataList.push(formData);
        },
        // CRF 保存
        saveCRF() {
          /*if(this.$route.query.type == 'add') {
            this.CRFReportSave();
          }else if(this.$route.query.type == 'modify') {
            this.CRFReportModifySave()
          }*/
          if(this.formOptions.saveStatus == '1') {
            this.researchFormSave().then((data)=>{
              this.$emit("callback-save",data)
            })
          }else if(this.formOptions.saveStatus == '2'){
            this.$emit("callback-save")
          }
        },
        //CRF 预览
        previewCRF() {
          this.formMask = true;
          let crfName = JSON.parse(JSON.stringify(this.crfName));
          let dataList = JSON.parse(JSON.stringify(this.dataList));
          this.crfPreview = {
            crfDisplayName:crfName || "",
            formPortions:dataList|| []
          }
        },
        //编辑小节
        portionModify(data,index) {
          console.log('编辑 小节',data);
          this.portionConfigData= {
            diseaseId:data.diseaseId,
            formItemList:data.formItemList || [],
            id:data.id,
            portionName:data.portionName,
            type:"modify",
            index:index
          };
          console.log(this.portionConfigData);
          this.showConfigPortion = true;
          /*this.directAddSave();
          let diseaseId = this.$route.query.id;
          let crfId = this.$route.query.crfId;
          let temporarySave = {
            dataList:this.dataList||[],
            crfName:this.crfName || "",
          };
          sessionStorage.setItem('temporarySave',JSON.stringify(temporarySave));
          this.$router.push({
            path:'/basisConfig',
            query:{
              id:diseaseId,
              type:'modify',
              portionId:data.id || '0' ,
              crfId:crfId,
              i:index,
            }
          });*/
        },
        // 获取表单id
        async queryFormId() {
          let that = this;
          try{
            let data = await that.$http.queryFormId();
            if(data.code === 0) {
              this.formId = data.data;
            }
          }catch (error) {
            console.log(error)
          }
        },
        //表单 保存
        async researchFormSave() {
          let that = this;
          let formData = {
            "id": that.formId,
            "crfDisplayName": that.crfName,
            "crfType": that.crfType,
            "crfIsAvailable": that.enable ? 1 : 2,
            "crfImage": "",
            "subjectPortions":that.dataList
          };
          try {
            let data = await that.$http.researchFormSave(formData);
            return data;
          }catch (error) {
            console.log(error)
          }
        },
        //删除小节
        portionDeleteItem(data,index) {
          this.isReset = false;
          this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.CRFDeletePortion(data,index);
            this.dataList.splice(index,1);
            this.isReset = true;
            this.$message.success('删除成功');
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        //CRF 报告 保存
        async CRFReportSave() {
          let that = this;
          let formData = {
            // "id": "",
            "crfDisplayName": that.crfName,
            "crfType": that.crfType,
            "crfIsAvailable": that.enable ? 1 : 2,
            "crfImage": "",
            "diseaseId":that.$route.query.id,
            "formPortions": that.dataList
          };
          try {
            let data = await that.$http.CRFBakSave(formData);
            if(data.code == 0) {
              this.$message.success('保存成功');
              /*let temporarySave = {
                dataList:[],
                crfName:"",
              };
              sessionStorage.setItem('temporarySave',JSON.stringify(temporarySave));*/
              //保存成功返回 报告页
              window.history.go(-1);
            }
          }catch (error) {
            console.log(error)
          }
        },
        //CRF 报告编辑 保存
        async CRFReportModifySave() {
          let that = this;
          let formData = {
            "id": that.$route.query.crfId,
            "crfDisplayName": that.crfName,
            "crfType": that.crfType,
            "crfIsAvailable": that.enable ? 1 : 2,
            "crfImage": "",
            "diseaseId":that.$route.query.id,
            "formPortions": that.dataList
          };
          try {
            let data = await that.$http.CRFBakSave(formData);
            if(data.code == 0) {
              this.$message.success('保存成功');
              /*let temporarySave = {
                dataList:[],
                crfName:"",
              };
              sessionStorage.setItem('temporarySave',JSON.stringify(temporarySave));*/
              //保存成功返回 报告页
              window.history.go(-1);
            }
          }catch (error) {
            console.log(error)
          }
        },
        // 预览CRF 详细信息
        async previewCRFList(value) {
          let that = this;
          let formData = {
            // formCrfId:that.$route.query.crfId || ""
            crfId:value || ""
          };
          try {
            // let data = await that.$http.CRFReportPreview(formData);
            let data = await that.$http.researchFormPreview(formData);
            if(data.code == 0) {
              that.crfName = data.data.crfDisplayName;
              that.enable =  data.data.crfIsAvailable==1 ? true :false;
              that.crfType = data.data.crfType;
              that.dataList = data.data.formPortions;
            }
            this.loading = false;
          }catch (error) {
            console.log(data);
            this.loading = false;
          }
          this.loading = false;
        },
        // CRF 报告 删除小节
        async CRFDeletePortion(data,index) {
          let that = this;
          let formData = {
            formPortionId:data.id,
            formCrfId:that.$route.query.crfId || ""
          };
          try {
            let data = await that.$http.CRFDeletePortion(formData);
            if(data.code == 0) {
              that.dataList.splice(index,1);
              that.$message.success(data.data);
            }
          }catch (error) {
            console.log(error)
          }
        },
        //配置弹框 直接添加 先保存
        async directAddSave() {
          let that = this;
          let id = that.$route.query.type == 'add' ? "" : that.$route.query.crfId;
          let formData = {}
          if(that.$route.query.type == 'add') {
            formData = {
              // "id": id,
              "crfDisplayName": that.crfName,
              "crfType": that.crfType,
              "crfIsAvailable": that.enable ? 1 : 2,
              "crfImage": "",
              "diseaseId":that.$route.query.id,
              "formPortions": that.dataList
            };
          }else {
            formData = {
              "id": id,
              "crfDisplayName": that.crfName,
              "crfType": that.crfType,
              "crfIsAvailable": that.enable ? 1 : 2,
              "crfImage": "",
              "diseaseId":that.$route.query.id,
              "formPortions": that.dataList
            };
          }
          try {
            let data = await that.$http.CRFBakSave(formData);
            if(data.code == 0) {
              console.log(data.data)
            }
          }catch (error) {
            console.log(error)
          }
        }
      },
      mounted() {
        this.queryFormId();
        if(this.formOptions.researchType === 'researchTarget') {
          this.init();
        }
        /*if(this.$route.query.type=='modify') {
          this.loading = true;
          this.isReset = false;
          this.previewCRFList().then(()=>{
            this.isReset = true;
          })
        }*/
      },
      destroyed() {
        this.$destroy();
      }
    }
</script>

<style lang="less" scoped>
.report_config-container{
  .component_head{
    p{
      .break_box{
        font-size: 14px;
        color: #394263;
        font-weight: 400;
        cursor: pointer;
        .iconfont{
          font-size: 13px;
          color: #979BAA;
          padding-right: 5px;
        }
        .partition_line{
          width: 1px;
          height: 16px;
          background-color: #979BAA;
          display: inline-block;
          margin: 0 20px;
          position: relative;
          top: 2px;
        }
      }
      .title{
        font-size:18px;
        font-weight:bold;
        color: #394263;
      }
    }
    .head_content{
      .el-button{
        height: 34px;
        font-size: 14px;
      }
      .iconfont{
        padding-right: 9px;
        font-size: 14px;
      }
    }
  }
  .create_report-content{
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    padding: 15px;
    .report-content-nav{
      display:flex;
      flex-direction:column;
      /*height: 112px;*/
      background-color: #ffffff;
      /*padding-top:30px;*/
      /*padding-left: 20px;*/
      /*padding-right: 20px;*/
      padding: 30px 20px 10px 20px;
      border: 1px solid #E5EBEC;
      box-sizing: border-box;
      .report-title{
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding-bottom: 20px;
        input[type=text]{
          border:1px solid transparent;
          border-bottom-color: #E5EBEC;
          text-align: center;
          font-size: 16px;
          color: #394263;
          font-family:MicrosoftYaHei;
          font-weight: bold;
          padding: 5px;
        }
        /*兼容*/
        input[type=text]::-webkit-input-placeholder { /* WebKit browsers */
          color: #394263;
          font-weight: normal;
        }
        input[type=text]:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #394263;
          font-weight: normal;
        }
        input[type=text]::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #394263;
          font-weight: normal;
        }
        input[type=text]:-ms-input-placeholder { /* Internet Explorer 10+ */
          color: #394263;
          font-weight: normal;
        }
      }
      .report-config_nav{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .config-nav_left{
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 14px;
          color: #394263;
          .is-enable{
            span{
              padding-right: 10px;
            }
          }
          .report-type{
            margin-left: 20px;
            span{
              padding-right: 10px;
            }
          }
        }
        .config-nav_right{
          font-size: 14px;
          .el-button{
            height: 34px;
          }
          .iconfont{
            font-size: 14px;
            padding-right: 5px;
          }
        }
      }
    }
    .report_body-box{
      width: 100%;
      min-height: 400px;
      border:1px solid #E5EBEC;
      border-top-color: transparent;
      padding: 20px 20px 0 20px;
      box-sizing: border-box;
      /*background-color: #ffffff;*/
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        width: 150px;
      }
      .report_body-item{
        display: flex;
        flex-direction: column;
        min-height: 298px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 20px;
        .report_header-content{
          width: 100%;
          height: 50px;
          background-color: #E5EBEC;
          border:1px solid rgba(229,235,236,1);
          display: flex;
          flex-direction: row;
          position: relative;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;
          .display_line{
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 50px;
            background-color: #1BBAE1;
          }
          .header-title{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:bold;
            color:rgba(57,66,99,1);
            margin-left: 20px;
          }
          .header-btn{
            span{
              padding: 5px;
              display: inline-block;
              .iconfont{
                font-size: 16px;
                color: #979BAA;
                cursor: pointer;
              }
              &:last-child{
                margin-right: 32px;
                margin-left:13px;
              }
              &:hover{
                background-color: #ccc;
                color:#666666;
              }
            }

          }
        }
        .report_body-content{
          width: 100%;
          min-height: 238px;
          background-color: #ffffff;
          /*background-color: #f7f8fc;*/
          border:1px solid #E5EBEC;
          .displayPortion_title{
            display: none;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
  .report_config-container{
    .report_body-content{
      .displayPortion_container{
        /*width: 1200px;
        min-width: 1200px;*/
      }
      .displayPortion_title{
        display: none;
      }
      .section_preview_container{
        padding-top: 5px;
      }
      .GATHER_bg_color{
        background-color: #ffffff;
      }
    }
  }
</style>
