<template>
  <div class="cloud-component researchTarget">
    <!-- 研究指标 -->
    <!--<img src="../images/researchTarget.png" alt="" width="100%">-->
      <el-tabs ref="elTabs" class="research_target-box" v-loading="loading"  v-model="editableTabsValue" type="card"  :closable="false" :addable="addStatus"  @tab-add="handleTabsEdit" @tab-click="handleClick">
        <el-tab-pane
            v-if="displayState"
            :key="index"
            v-for="(item, index) in editableTabs"
            :name="String(index)"
          >
            <!--标题名称  :label="item.crfDisplayName"-->
            <div slot="label">
              {{item.crfDisplayName}}
              <el-popover
                v-show="index == editableTabsValue"
                placement="bottom"
                trigger="click">
                <p class="info_tip">另存为我的模板</p>
                <p class="info_tip" @click="researchFormModify(item)">编辑</p>
                <p class="info_tip" @click="researchDelete(item,index)">删除</p>
                <i slot="reference" class="iconfont iconbianjibeifen"></i>
              </el-popover>
            </div>
            <div class="research_form_box">
              <!--{{item.content}}-->
              <createForm ref="createForm"  :crfData="item" :formOptions="options" @callback-data="callbackData" @callback-save="callbackSave"></createForm>
            </div>
          </el-tab-pane>
      </el-tabs>
    <!--编辑弹框-->
    <el-dialog title="编辑CRF" :visible.sync="dialogFormVisible" append-to-body>
      <el-form>
        <el-form-item label="CRF 名称" label-width="100px">
          <el-input v-model="crfNames" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogModifyCrfName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import createForm from './CRFConfig/report/createReport';
  import Sortable from 'sortablejs';
  export default {
    name: 'researchTarget',
    props:{
      tabAddStatus:{
        type:Boolean,
        default:null
      }
    },
    components: {
      createForm,
    },
    data() {
      return {
        loading:false,
        displayState:false,
        dialogFormVisible:false,
        addStatus:this.tabAddStatus || true,
        editableTabsValue: 0,
        editableTabs: [],
        tabIndex: 0,
        crfNames:"",
        options:{
          researchType:"researchTarget",
          backStatus:"3",// 1 window.history.go(-1)  2 this.$emit() 3 隐藏返回按钮
          saveStatus:"2", // 1 调用自己的保存并回调(无tab 切换) 2 直接回调
          title:"编辑CRF表单"
        }
      }
    },
    watch: {
      "tabIndex":function (data) {
          // this.sortTab();
      }
    },
    methods: {
      handleTabsEdit(targetName,action) {
        if(this.editableTabs.length!==0){
          this.researchFormSave(this.editableTabs[this.tabIndex]).then((data)=>{
            if(data.code === 0) {
              this.researchRelationSave()
            }
          });
        }
        this.displayState = false;
        let newTabName = ++this.editableTabs.length + '';
        let obj = {
          "id": "",
          "crfDisplayName": "CRF("+newTabName+")",
          "crfType": 1,
          "crfIsAvailable": 2,
          "crfImage": null,
          "subjectPortions": [],
          "diseaseId": null,
          "subjectId":this.$store.state.user.researchInfo.subjectInfoId
        };
        /*this.queryFormId().then((data)=>{
          // console.log(data)
          let obj = {
            "id": data.data,
            "crfDisplayName": "CRF("+newTabName+")",
            "crfType": 1,
            "crfIsAvailable": 2,
            "crfImage": null,
            "subjectPortions": [],
            "diseaseId": null,
            "subjectId":this.$store.state.user.researchInfo.subjectInfoId
          };
          this.editableTabs.push(obj);
        });*/
        this.researchFormSave(obj).then((data)=>{
          if(data.code === 0) {
            this.editableTabs.push(data.data);
          }
        });
          for(let i=0;i<this.editableTabs.length;i++) {
            if(this.editableTabs[i]=="undefined" || this.editableTabs[i] == undefined) {
              this.editableTabs.splice(i,1);
              i--;
            }
          }
        this.$nextTick(()=>{
          this.displayState = true;
        });
        this.editableTabsValue = String(newTabName-1);

        this.tabIndex = String(newTabName-1);
      },
      handleClick(tab, event) {
        //获取 上一个 CRF表单 信息 进行 保存
        // console.log(this.editableTabs[this.tabIndex]);
        this.researchFormSave(this.editableTabs[this.tabIndex]).then((data)=>{
          if(data.code === 0) {
            this.researchRelationSave()
          }
        });
        this.tabIndex = tab.index
      },
      researchFormModify(data) {
        this.crfNames = data.crfDisplayName;
        this.dialogFormVisible = true;
      },
      researchDelete(data,index) {
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.displayState = false;
          // console.log(data)
          /*if(data.id !=="") {*/
            this.deleteFormData(data.id).then(()=>{
              this.editableTabs.splice(index,1);
            });
          /*}else {
            this.editableTabs.splice(index,1);
          }*/
          this.$nextTick(()=>{
            this.displayState = true;
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      dialogModifyCrfName() {
        this.dialogFormVisible = false;
        //强制刷新 组件视图
        this.displayState = false;
        this.editableTabs[this.tabIndex].crfDisplayName = this.crfNames;
        this.$nextTick(()=>{
          this.displayState = true;
        });
      },
      callbackData(data) {
        this.displayState = false;
        this.editableTabs[this.tabIndex].crfDisplayName = data;
        this.$nextTick(()=>{
          this.displayState = true;
        });
      },
      callbackSave() {
        //保存回调
        console.log('保存回调')
        this.researchFormSave(this.editableTabs[this.tabIndex]).then((data)=>{
          if(data.code === 0) {
            this.researchRelationSave().then((data)=>{
              if(data.code === 0) {
                this.$message.success(data.data);
              }
            })
          }
        })
      },
      sortTab(){
        this.$nextTick(()=>{
          let el = document.querySelectorAll('.el-tabs__nav')[1];
          let sortable = Sortable.create(el,{
            onEnd:(evt) => {
              // console.log(evt);
              // console.log('之前的数据',this.editableTabs[evt.oldIndex]);
              let prevCopyData = Object.assign({},JSON.parse(JSON.stringify(this.editableTabs[evt.oldIndex])));
              this.displayState = false;
              this.editableTabs.splice(evt.oldIndex,1);
              this.editableTabs.splice(evt.newIndex,0,prevCopyData);
              this.$nextTick(()=>{
                this.displayState = true;
                this.editableTabsValue = String(evt.newIndex+1);
              });
            }
          })
        });
      },
      // 获取表单id
      async queryFormId() {
        let that = this;
        try{
          let data = await that.$http.queryFormId();
          return data
        }catch (error) {
          console.log(error)
        }
      },
      //获取 数据列表
      async queryDataList() {
        let that = this;
        let formData = {
          subjectInfoId:this.$store.state.user.researchInfo.subjectInfoId
        };
        try {
          let data = await that.$http.queryResearchForm(formData);
          if(data.code === 0) {
            that.editableTabs = data.data;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //删除 表单
      async deleteFormData(value) {
        let that = this;
        let formData = {
          crfId:value
        };
        try{
          let data = await that.$http.deleteFormData(formData);
          console.log(data)
          if(data.code == 0) {
            that.$message.success(data.data);
          }
        }catch (error) {
          console.log(error)
        }
      },
      //表单 保存
      async researchFormSave(value) {
        let that = this;
        let formData = value;
        try {
          let data = await that.$http.researchFormSave(formData);
          return data;
        }catch (error) {
          console.log(error)
        }
      },
      // 表单关联关系保存
      async researchRelationSave() {
        let that = this;
        let formIdList = that.editableTabs.map((item)=>{return item.id});
        let formData = {
          formCrfIdList:formIdList || [],
          subjectInfoId:this.$store.state.user.researchInfo.subjectInfoId
        };
        try {
          let data = await that.$http.researchRelationSave(formData);
          return data
        }catch (error) {
          console.log(error)
        }
      }
    },
    mounted() {
      this.displayState = true;
      this.loading = true;
      this.queryDataList().then(()=>{
        this.loading = false;
        // let el = document.querySelectorAll('.el-tabs__nav')[1];
        /*let sortable = Sortable.create(el,{
          onEnd:(evt) => {
            // console.log(evt);
            // console.log('之前的数据',this.editableTabs[evt.oldIndex]);
            let prevCopyData = Object.assign({},JSON.parse(JSON.stringify(this.editableTabs[evt.oldIndex])));
            this.displayState = false;
            this.editableTabs.splice(evt.oldIndex,1);
            this.editableTabs.splice(evt.newIndex,0,prevCopyData);
            this.$nextTick(()=>{
              this.displayState = true;
              this.editableTabsValue = String(evt.newIndex);
            });
          }
        })*/
      });
      this.$nextTick(()=>{
        let el = document.querySelectorAll('.el-tabs__nav')[1];
        let sortable = Sortable.create(el,{
          onEnd:(evt) => {
            console.log(evt);
            // console.log('之前的数据',this.editableTabs[evt.oldIndex]);
            let copyList = JSON.parse(JSON.stringify(this.editableTabs));

            let prevCopyData = Object.assign({},JSON.parse(JSON.stringify(copyList[evt.oldIndex])));

            copyList.splice(evt.oldIndex,1);
            copyList.splice(evt.newIndex,0,prevCopyData);
            console.log(copyList);
            this.editableTabs = [];
            this.editableTabs = copyList ;
            this.displayState = false;
            this.$nextTick(()=>{
              // console.log(this.editableTabs);
              this.displayState = true;
              this.editableTabsValue = String(evt.newIndex);
              this.tabIndex = evt.newIndex;
            });
          }
        })
      });
    }
  };
</script>

<style lang="less">
.research_target-box{
  .el-tabs__header{
    height: 41px;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    flex-flow: row-reverse;
    .el-tabs__new-tab{
      border-color: transparent;
      width: auto;
      height: auto;
      display: flex;
      align-items: center;
      margin: 4px 0 4px 10px;
      .el-icon-plus{
        font-size: 24px;
        color: #1BBAE1;
      }
      &:hover{
        background-color: #E5EBEC;
      }
    }
    .el-tabs__nav-scroll{
      .is-active{
        background-color: #ffffff;
      }
    }
  }
}
.el-popover{
  .info_tip{
    cursor: pointer;
    padding: 2px 0;
    &:hover{
      background:rgba(245,247,250,0.6);
      color: #04B8DD;
    }
  }
}
.researchTarget .el-tabs__header{
  margin: 0;
}
  .research_form_box{
    background-color: #ffffff;
    .create_report-content{
      padding: 0;
      .report-content-nav{
        border-top-color: transparent;
      }
    }
  }
</style>




