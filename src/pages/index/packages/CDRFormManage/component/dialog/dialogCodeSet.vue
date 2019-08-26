<template>
  <div v-if="dialogShow">
    <el-dialog title="设置值集" class="dialogHeightSet" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-tabs v-model="activeName" @tab-click="handClick">
        <el-tab-pane label="选择" name="first">
          <el-row>
            <el-col :span="24">
              <el-input v-model="codeSetValue" @keyup.enter.native="CodeSetSearch" placeholder="输入代码集名称或ID" style="width: 20%;"></el-input>
              <i class="el-icon-search" @click="CodeSetSearch"></i>
            </el-col>
            <el-col :span="24" class="borderMargin">
              <div class="codeSet_container">
                <div class="codeSet_box" v-for="(item,index) in callbackDataList">
                  <div :class="['codeSet_content_header',{actives: index===selectLineIndex}]" @click="clickSelectLine(item,index)">
                    <div class="header_content_title" @click="clickControlName(item,index)">
                      <i v-if="item.foldFlag===0?true:false" class="el-icon-caret-right"></i>
                      <i v-if="item.foldFlag===1?true:false" class="el-icon-caret-bottom"></i>
                      <span>{{item.termGroupName}}</span>
                    </div>
                    <div class="header_content_select">
                      <!--<el-radio v-for="terItem in processData(item.termItemRspList)" :key="terItem.termItemCode" v-model="defaultRadio" :label="terItem.termItemName">{{terItem.termItemName}}</el-radio>-->
                      <el-radio v-for="terItem in item.termItemRspList"
                                :key="terItem.termItemCode"
                                v-model="terItem.bindData"
                                @change="changeRadioValue"
                                :label="terItem.termItemName">
                        {{terItem.termItemName}}
                      </el-radio>
                      <!--<el-radio v-model="defaultRadio" label="2">头孢甲肟1</el-radio>
                      <el-radio v-model="defaultRadio" label="3">头孢甲肟2</el-radio>-->
                    </div>
                    <div class="header_content_del" @click="emptyDefault">清空</div>
                  </div>
                  <div v-if="item.foldFlag===1?true:false" class="codeSet_content_body">
                    <div class="content_body_title">
                        <div class="content_body_title_item">显示代码名称</div>
                        <div class="content_body_title_item">显示名</div>
                        <div class="content_body_title_item">操作</div>
                      </div>
                    <div class="content_body_boxItem" v-for="(terItems,cindex) in item.termItemRspList">
                      <div class="content_body_item">{{terItems.termItemCode}}</div>
                      <div class="content_body_item">{{terItems.termItemName}}</div>
                      <div class="content_body_item">
                        <i class="iconfont iconfuhao5" @click="CodeSetMoveUp(item,cindex,index)"></i>
                        <i class="iconfont iconfuhao6" @click="CodeSetMoveDown(item,cindex,index)"></i>
                        <i class="el-icon-close" @click="CodeSetDel(terItems,cindex,index)"></i>
                      </div>
                    </div>
                    <div v-if="add_status" class="codeSet_content_add" @click="addDisplayEntry">
                      <div class="content_add_btn">
                        <i class="el-icon-circle-plus"></i>
                        <span>添加</span>
                      </div>
                    </div>
                    <div v-if="!add_status" class="content_body_boxItem">
                      <div class="content_body_item">
                        自动生成
                      </div>
                      <div class="content_body_item">
                        <el-input v-model="addDisplayName" placeholder="请输入显示名"></el-input>
                      </div>
                      <div class="content_body_item">
                        <i class="iconfont" @click="addDisplayEntrySave(item)">保存</i>
                        <i class="iconfont" @click="addDisplayCancel">取消</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="创建" name="second">
          <el-form :inline="false" label-width="90px" class="wrap_line" @submit.native.prevent>
            <el-form-item label="代码集名称" class="line_blockCode">
              <el-input v-model="termGroupName"></el-input>
            </el-form-item>
            <el-form-item label="包含显示名称" class="line_blockCode">
              <el-input type="textarea" :rows="5" v-model="termItemlist"></el-input>
            </el-form-item>
            <div class="tip_info">每行代表一个选项，可以添加多个选项，名称和代表分值用“^”隔开，分值不是必填项。例：胸痛^10</div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickSaveBtn" type="primary">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "dialogCodeSet",
      props:{
        dialogShow:{
          type:Boolean,
          default:null
        },
        basicDataInfo:{
          type:Object,
          default: null
        }
      },
      data() {
        return {
          dialogFormVisible:true,
          activeName:"first",
          codeSetValue:"",// 获取代码集值
          defaultRadio:"", //单选默认值
          addDisplayName:"",//显示名输入
          add_status:true, //是否 添加
          body_state:true,//是否展开子集
          termItemlist:"",//包含显示名
          termGroupName:'', //(代码集名称)
          selectLineIndex:"",//选择行下标
          callbackDataList:[], //查询数据存放
          selectSaveDataList:[],//选择或者保存数据
          controlShow:""
        }
      },
      watch:{
        dialogShow:function(){
          console.log(this.dialogShow);
          //清楚已经加载的数据 -- 后期用fn 封装
          this.codeSetValue="";
          this.callbackDataList=[];
          this.defaultRadio = "";
          this.termGroupName = "";
          this.termItemlist ="";
          this.dialogFormVisible = true;
        },
        dialogFormVisible:function (value){
          console.log("触发dialogFormVisible",value)
          if(value==false) {
            this.$emit("dialog-close",false);
          }
        },
      },
      methods:{
        //保存
        clickSaveBtn() {
          console.log("保存按钮")
          if(this.activeName==='first'){
            if(this.selectSaveDataList.length<=0){
              this.$message({
                type:"error",
                message:"请选择一行数据"
              })
              return ;
            }else{
              let termDefaultValue=[];
              if(this.defaultRadio!=""){
                termDefaultValue[0] =this.defaultRadio
              }else{
                termDefaultValue =[];
              }
              let newData = this.basicDataInfo;
              newData.obj.termSet.termItemList = this.selectSaveDataList[0].termItemRspList;
              newData.obj.termSet.termDefaultValue = termDefaultValue;
              newData.obj.termSet.foldFlag = 1;
              newData.obj.termSet.termGroupOid = this.selectSaveDataList[0].termGroupOid;
              newData.obj.termSet.termGroupName = this.termGroupName || this.selectSaveDataList[0].termGroupName;
              this.dialogFormVisible = false;
              this.$emit('basis-click',newData)
            }
          }else if(this.activeName==='second'){
            if(this.termItemlist===""||this.termGroupName===""){
              this.$message({
                type:"error",
                message:"请按照要求添加数据"
              })
              return ;
            }else{
              this.createCodeSet();
                /*let termDefaultValue=[];
                termDefaultValue[0] =this.defaultRadio||[];
                let newData = this.basicDataInfo;
                newData.obj.termSet.termItemlist = this.selectSaveDataList;
                newData.obj.termSet.termDefaultValue = termDefaultValue;
                newData.obj.termSet.ermGroupOid = this.selectSaveDataList[0].termGroupOid;
                newData.obj.termSet.termGroupName = this.termGroupName || this.selectSaveDataList[0].termGroupName;
                this.dialogFormVisible = false;
                this.$emit('basis-click',newData)*/
            }
          }
            /*let termDefaultValue=[];
            termDefaultValue[0] =this.defaultRadio||[];
            let newData = this.basicDataInfo;
            newData.obj.termSet.termItemlist = this.selectSaveDataList;
            newData.obj.termSet.termDefaultValue = termDefaultValue;
            newData.obj.termSet.ermGroupOid = this.selectSaveDataList[0].termGroupOid;
            newData.obj.termSet.termGroupName = this.termGroupName || this.selectSaveDataList[0].termGroupName;
            this.$emit('basis-click',newData)*/
        },
        //添加
        addDisplayEntry() {
          console.log("添加")
          this.add_status = false;
        },
        //添加--保存
        addDisplayEntrySave(value) {
          console.log("添加--保存",value)
          this.add_status = true;
          this.AddTermItem(value)
        },
        //添加--取消
        addDisplayCancel() {
          console.log("添加--取消")
          this.add_status = true;
        },
        //条目名称切换
        clickControlName(obj,index) {
          console.log("条目名称切换",obj,index);
          if(obj.foldFlag===0){
           this.callbackDataList[index].foldFlag = 1;
          }else{
            this.callbackDataList[index].foldFlag = 0;
          }
        },
        //tab 标签页
        handClick(tab,event) {
          console.log(tab,event)
        },
        //选择行 数据
        clickSelectLine(obj,index){
          console.log(obj,index);
          this.selectSaveDataList[0] = obj;
          this.selectLineIndex = index;
          let processData = this.callbackDataList;
          for(let i=0;i<processData.length;i++) {
            for(let j=0;j<processData[i].termItemRspList.length;j++) {
              processData[i].termItemRspList[j].bindData = ""
            }
          }
        },
        //上移
        CodeSetMoveUp(obj,c_index,p_index){
          console.log(obj,c_index,p_index)
          if(c_index === 0){
            this.$message({
              type:'error',
              message: "无法上移"
            })
          }else{
            let copyData =obj.termItemRspList[c_index]
            this.callbackDataList[p_index].termItemRspList.unshift(copyData);
            this.callbackDataList[p_index].termItemRspList.splice(c_index+1,1);
          }
        },
        //下移
        CodeSetMoveDown(obj,c_index,p_index){
          console.log(obj,c_index,p_index)
          if(obj.termItemRspList.length===c_index+1){
            this.$message({
              type:'error',
              message:"无法下移"
            })
          }else{
            let copyData = obj.termItemRspList[c_index];
            this.callbackDataList[p_index].termItemRspList.push(copyData);
            this.callbackDataList[p_index].termItemRspList.splice(c_index,1)
          }
        },
        //删除
        CodeSetDel(obj,c_index,p_index){
          console.log(obj,c_index,p_index);
          this.callbackDataList[p_index].termItemRspList.splice(c_index,1);
          let objId = {
            termItemId:obj.id,
            termGroupId:this.callbackDataList[p_index].id
          }
          this.deleteCodeSetLine(objId)
        },
        //清空
        emptyDefault(){
          console.log("清空",this.defaultRadio)
          this.defaultRadio = ""
        },
        //单选框处理值
        changeRadioValue(value) {
          console.log(value);

          this.defaultRadio = value;
        },
        //查询
        CodeSetSearch(){
          console.log("查询",this.codeSetValue)
          if(this.codeSetValue!==""){
            this.searchCodeSet()
          }else {
            this.$notice('请输入查询条件');
          }
        },
        processData(value) {
          console.log(value)
          /*let Array = [];
          Array =*/
          return value.forEach(item=>{
            return item.selected = false
          })
        },
        // 新增 代码集
        async createCodeSet() {
          let that = this;
          let termItemlists = []
          if(this.termItemlist.length==0){
            termItemlists = []
          }else{
            termItemlists = this.termItemlist.split('\n')
          }
          let paramData = {
            termGroupName:this.termGroupName,
            termItemList:termItemlists
          }
          try{
            let data = await that.$http.crfCodeSet(that.$format(paramData))
            console.log(data)
            if(data.code===0){
              that.callbackDataList.push(data.data);
              that.selectSaveDataList.push(data.data);
              let termDefaultValue=[];
              termDefaultValue[0] =this.defaultRadio||"";
              let newData = this.basicDataInfo;
              newData.obj.termSet.termItemList = this.selectSaveDataList[this.selectSaveDataList.length-1].termItemRspList;
              newData.obj.termSet.termDefaultValue = termDefaultValue;
              newData.obj.termSet.termGroupOid = this.selectSaveDataList[this.selectSaveDataList.length-1].termGroupOid;
              newData.obj.termSet.termGroupName = this.termGroupName || this.selectSaveDataList[this.selectSaveDataList.length-1].termGroupName;
              this.dialogFormVisible = false;
              this.$emit('basis-click',newData)
            }else{
              that.$message({
                type:"error",
                message:data.msg
              })
            }
          }catch (error) {
            that.$notice('创建设置值集失败');
            console.log(error)
          }
        },
        // 查询 代码集
        async searchCodeSet(){
          let  that = this;
          let paramData = {
            keyword:this.codeSetValue
          }
          try{
            let data = await that.$http.crfSearchCodeSet(that.$format(paramData))
            console.log(data)
            if(data.code === 0){
               data.data.forEach(item=>{
                return item.foldFlag = 0;
              });
               let newData = data.data
              for(let i=0;i<newData.length;i++) {
                for(let j=0;j<newData[i].termItemRspList.length;j++) {
                  newData[i].termItemRspList[j].bindData = ""
                }
              }
              console.log(newData)
              that.callbackDataList  =newData;
            }
          }catch (error) {
            that.$notice('查询设置值集失败');
            console.log(error)
          }
        },
        //删除 地址位置代码集
        async deleteCodeSetLine(value) {
          let that = this;
          let paramData = {
            termItemId:value.termItemId,
            termGroupId:value.termGroupId
          }
          try{
            let data = await that.$http.crfCodeSetDel(that.$format(paramData))
            console.log(data)
            if(data.code===0){
              that.$message({
                type:"error",
                message:data.msg
              })
            }
          }catch (error) {
            that.$notice('删除失败');
            console.log(error)
          }
          that.searchCodeSet()
        },
        //添加子集行数据
        async AddTermItem(value){
          let that = this;
          let paramData = {
            termGroupId:value.id,
            termItemName:this.addDisplayName
          }
          try{
            let data = await that.$http.crfADDTermItem(that.$format(paramData))
            console.log(data)
            if(data.code ===0){
              that.$message({
                type:"success",
                message:data.msg
              })
            }
          }catch (error) {
            that.$notice('保存失败');
            console.log(error)
          }
          that.searchCodeSet()
        }
      }
    }
</script>


<style lang="less">
  .el-icon-search {
    font-size: 20px;
    color: #3C81F0;
    position: relative;
    top: 5px;
    left: 5px;
    cursor: pointer;
  }
  .codeSet_container{
    width: 100%;
    height: auto;
    overflow: hidden;
    .codeSet_box{
      width: 100%;
      float: left;
      border-left: 1px solid #D8DCE4;
      border-right: 1px solid #D8DCE4;
      border-bottom: 1px solid #D8DCE4;
      border-radius:2px 2px 0 0;
      padding-bottom: 2%;
      .codeSet_content_header{
        width: 100%;
        height: 36px;
        font-size:14px;
        background: #EBF2FE;
        padding: 0 5px;
        cursor:pointer;
        overflow: hidden;
        display: table;
        /*border-bottom:1px solid #D8DCE4;*/
        .header_content_title{
          float: left;
          width: 15%;
          text-align: center;
          cursor:pointer;
          /*border-right:1px solid #D8DCE4;*/
          /*margin-right: 1%;*/
          /*position: relative;
          top: 50%;
          transform: translateY(50%);*/
          min-height: 36px;
          line-height: 36px;
          border-right: 1px solid #D8DCE4;
        }
        .header_content_select{
          float: left;
          cursor:pointer;
          width: 75%;
          padding-left: 1%;
          min-height: 36px;
          line-height: 36px;
          .el-radio{
            margin-left: 0 !important;
          }
        }
        .header_content_del{
          float: right;
          padding-right: 5px;
          cursor:pointer;
          color:#3C81F0;
        }
        &:hover{
          background-color:#a5c8ff;
        }
      }
      .actives{
        background-color:#a5c8ff;
      }
      .codeSet_content_body{
        width:100%;
        /*border-bottom:1px solid #D8DCE4;*/
        float: left;
        .content_body_title{
          float: left;
          width: 100%;
          font-size:12px;
          color:rgba(51,51,51,1);
          .content_body_title_item{
            float: left;
            width:33.3%;
            height: 36px;
            line-height: 36px;
            text-align:center;
          }
        }
        .content_body_boxItem{
          width: 100%;
          float:left;
          .content_body_item{
            width:33%;
            height:36px;
            line-height:36px;
            float: left;
            text-align: center;
            i{
              margin:0 5px;
              color:#3C81F0;
              font-size:18px;
              cursor:pointer;
            }
          }
        }
      }
      .codeSet_content_add{
        width: 100%;
        float:left;
        color:#3C81F0;
        font-size:14px;
        margin: 5px 0;
        cursor:pointer;
        .content_add_btn{
          width: 75%;
          height:36px;
          line-height:36px;
          margin:0 auto;
          text-align:center;
          border:1px dashed #3C81F0;
        }
      }
    }
  }
  .tip_info{
    margin-left:100px;
  }
 /* .wrap_line{
    .el-form-item{
      width: 100%!important;
      .el-form-item__content{
        width:80% !important;
      }
    }
  }*/
  .borderMargin{
    margin-top: 20px;
  }
  .line_blockCode{
    width: 100% !important;
    .el-form-item__content{
      width: 80% !important;
      margin-left:0px !important;
      .el-textarea{
        width: 80% !important;
      }
    }
  }
</style>
