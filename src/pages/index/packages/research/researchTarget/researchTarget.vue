<template>
  <div class="cloud-component researchTarget">
    <!-- 研究指标 -->
    <!--<img src="../images/researchTarget.png" alt="" width="100%">-->
    <el-tabs class="research_target-box" v-if="displayState" v-model="editableTabsValue" type="card"  :closable="false" addable  @tab-add="handleTabsEdit" @tab-remove="removeTab">
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
            <p class="info_tip">删除</p>
            <i slot="reference" class="iconfont iconbianjibeifen"></i>
          </el-popover>
        </div>
        <div class="research_form_box">
          <!--{{item.content}}-->
          <createForm :crfData="crfDataProcess(item)"></createForm>
        </div>
      </el-tab-pane>
    </el-tabs>
    
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
        tabIndex: 0
      }
    },
    watch: {},
    methods: {
      handleTabsEdit(targetName,action) {
        // if (action === 'add') {
        this.displayState = false;
          let newTabName = ++this.editableTabs.length + '';
          let obj = {
            "id": newTabName,
            "crfDisplayName": "CRF("+newTabName+")",
            "crfType": 1,
            "crfIsAvailable": 2,
            "crfImage": null,
            "subjectPortions": [],
            "diseaseId": null
          };
          this.editableTabs.push(obj);
          for(let i=0;i<this.editableTabs.length;i++) {
            if(this.editableTabs[i]=="undefined" || this.editableTabs[i] == undefined) {
              this.editableTabs.splice(i,1);
              i--;
            }
          }
        this.displayState = true;
        this.editableTabsValue = String(newTabName-1);
        // }
        /*if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }

          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }*/
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      crfDataProcess(data) {
        return data
      },
      researchFormModify(data) {
        console.log(data)
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
      height: 41px;
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




