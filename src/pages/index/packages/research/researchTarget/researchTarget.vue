<template>
  <div class="cloud-component researchTarget">
    <!-- 研究指标 -->
    <!--<img src="../images/researchTarget.png" alt="" width="100%">-->
    <el-tabs ref="elTabs" class="research_target-box" v-if="displayState" v-model="editableTabsValue" type="card"  :closable="false" addable  @tab-add="handleTabsEdit" @tab-click="handleClick">
      <el-tab-pane
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
          <createForm ref="createForm" :crfData="item" :formOptions="options" @callback-data="callbackData" @callback-save="callbackSave"></createForm>
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
  export default {
    name: 'researchTarget',
    components: {
      createForm
    },
    data() {
      return {
        displayState:false,
        dialogFormVisible:false,
        editableTabsValue: 0,
        editableTabs: [
          /*{
            "id": 0,
            "crfDisplayName": "癌栓专病信息",
            "crfType": 1,
            "crfIsAvailable": 2,
            "crfImage": null,
            "subjectPortions": [],
            "diseaseId": null
          },
          {
            "id": 1,
            "crfDisplayName": "癌栓专病信息1",
            "crfType": 1,
            "crfIsAvailable": 2,
            "crfImage": null,
            "subjectPortions": [],
            "diseaseId": null
          }*/
        ],
        tabIndex: 0,
        crfNames:"",
        options:{
          researchType:"researchTarget",
          backStatus:"3",// 1 window.history.go(-1)  2 this.$emit() 3 隐藏返回按钮
          title:"编辑CRF表单"
        }
      }
    },
    watch: {},
    methods: {
      handleTabsEdit(targetName,action) {
        this.displayState = false;
        let newTabName = ++this.editableTabs.length + '';
        this.queryFormId().then((data)=>{
          // console.log(data)
          let obj = {
            "id": data.data,
            "crfDisplayName": "CRF("+newTabName+")",
            "crfType": 1,
            "crfIsAvailable": 2,
            "crfImage": null,
            "subjectPortions": [],
            "diseaseId": null
          };
          this.editableTabs.push(obj);
        });
          for(let i=0;i<this.editableTabs.length;i++) {
            if(this.editableTabs[i]=="undefined" || this.editableTabs[i] == undefined) {
              this.editableTabs.splice(i,1);
              i--;
            }
          }
        this.displayState = true;
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
          subjectInfoId:sessionStorage.getItem('CURR_RESEARCH_ID')
        };
        try {
          let data = await that.$http.queryResearchForm(formData);
          console.log(data)
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
          subjectInfoId:sessionStorage.getItem('CURR_RESEARCH_ID')
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
      this.queryDataList();
    }
  };
</script>

<style lang="less">
.research_target-box{
  .el-tabs__header{
    height: 41px;
    /*height: 41px;
    .el-tabs__nav-wrap{
      float: left;
    }*/
    .el-tabs__new-tab{
      /*float: none;*/
      border-color: transparent;
      /*position: relative;*/
      /*top: 8px;*/
      .el-icon-plus{
        font-size: 18px;
      }
    }
    .el-tabs__nav-scroll{
      /*height: 41px;*/
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
</style>




