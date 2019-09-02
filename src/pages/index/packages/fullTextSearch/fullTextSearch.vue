<!-- 全文检索 -->
<template>
  <div class="cloud-component fullTextSearch">
    <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="1">
      <div class="search-init" v-if="step === 'init'">
        <div class="page-title">临床科研数据全文检索</div>
        <el-input placeholder="请输入您需要检索的关键字信息" v-model="keyword" @keyup.enter.native="search" class="input-with-btn">
          <el-button slot="append"  class="input-btn" @click="search">搜索</el-button>
        </el-input>
      </div>
      <div class="search-rs" v-else>
        <div class="search-box">
          <el-input v-model="keyword" placeholder="请输入内容" @keyup.enter.native="search" class="input-search"></el-input>
          <el-button type="primary" style="height: 38px;" size="medium" @click="search">全文检索</el-button>
          <!--<span icon="el-icon-search" class="search-btn" ></span>-->
        </div>
        <div style="padding-bottom:20px; border-bottom: 1px dashed #D8DCE4;width: 845px">
          <el-select v-model.trim="filterCondition.type" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.code" :value="item.code"
                       :label="item.desc"></el-option>
          </el-select>
          <el-select v-model.trim="filterCondition.template" placeholder="请选择">
            <el-option v-for="item in templateList" :key="item.code" :value="item.code"
                       :label="item.desc"></el-option>
          </el-select>
          <el-select v-model.trim="filterCondition.time" placeholder="请选择">
            <el-option v-for="item in timeList" :key="item.code" :value="item.code"
                       :label="item.desc"></el-option>
          </el-select>
          <el-select v-model.trim="filterCondition.result" placeholder="请选择">
            <el-option v-for="item in resultList" :key="item.code" :value="item.code"
                       :label="item.desc"></el-option>
          </el-select>
        </div>
        <div style="margin: 8px 0;color: #999;font-size: 12px;height: 28px;line-height: 28px;width: 861px">
          <span>
            检索结果
            <span class="rs-count">{{dataContent.length + '条'}}</span>
          </span>
          <span class="queryAllDom" @click="queryAll">全选</span>
          <span class="clearAllDom" @click="clearAll">清除</span>
          <div style="float: right;margin-right: 2%;">
            <!--<el-button type="primary"  @click="derive">导出</el-button>-->
            <el-button type="primary"  @click="openEnterGroupDialog">入库入组</el-button>
          </div>
        </div>
        <div class="tableHeight">
          <!-- style="width: 860px;"border-bottom: 1px solid #D8DCE4-->
          <el-table
            class="rs-table"
            ref="multipleTable"
            :data="dataContent"
            tooltip-effect="dark"
            :show-header="false"
            style="width: 861px;height:570px;overflow: auto;"
            @selection-change="handleSelectionChange"
            @row-dblclick="jumpReportRead">
            <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column
              prop=""
              label="">
              <template slot-scope="scope">
                <div class="patient-name">
                  <span>病人姓名：{{scope.row.patientName}}</span>
                  <span>性别：{{scope.row.sex}}</span>
                  <span>报告名称：{{scope.row.report.reportName}}</span>
                </div>
<!--                <div class="report-author">{{scope.row.author}}/{{scope.row.createTime}}</div>-->
                <div class="report-author">张医生/2019-07-30 13:25:50</div>
                <div class="search_match" v-for="(item,index) in scope.row.highlights" :key="index" v-html="item"></div>
<!--                <div class="patient-desc">{{scope.row}}</div>-->
              </template>
            </el-table-column>
            <!--<el-table-column prop="sex" label="年龄"></el-table-column>
            <el-table-column prop="birthday" label="出生日期"></el-table-column>
            <el-table-column prop="report.reportName" label="报告名称"></el-table-column>
            <el-table-column prop="createTime" label="报告时间"></el-table-column>
            <el-table-column prop="author" label="报告医生"></el-table-column>-->
            <!--<el-table-column label="相关性">
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.highlights" :key="index" v-html="item"></div>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
      </div>
    </echarts-contain>
    <!-- 入组弹窗 -->
    <el-dialog title="入库入组" :visible.sync="enterGroupDialogVisible" :append-to-body="true" width="400px"
               @close="closeEnterGroupDialog" class="enterGroupDialog">
      <el-form :model="enterGroupRuleForm" label-width="95px" @submit.native.prevent>
        <el-form-item label="病种：" prop="disease">
          <el-select v-model.trim="enterGroupRuleForm.disease" clearable filterable placeholder="请选择"
                     @change="diseaseChange">
            <el-option
              v-for="item in diseaseDataList"
              :key="item.id"
              :title="item.name"
              :label="item.name.length>15?item.name.substring(0,15)+'...':item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课题：" prop="subject">
          <el-select v-model.trim="enterGroupRuleForm.subject" clearable filterable placeholder="请选择"
                     @change="subjectChange">
            <el-option
              v-for="item in subjectDataList"
              :key="item.id"
              :title="item.name"
              :label="item.name.length>15?item.name.substring(0,15)+'...':item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验组：" prop="labGroup">
          <el-select v-model.trim="enterGroupRuleForm.labGroup" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in labGroupDatalist"
              :key="item.id"
              :title="item.name"
              :label="item.name.length>15?item.name.substring(0,15)+'...':item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div class="zwarning" style="margin-bottom: 10px;">
          提示：<br>
          1、如果只选择了病种，未选择实验组的话，对病例进行入库操作；
          2、如果同时选择了病种、课题及实验组，则进行入库及入组操作。
        </div>
        <div class="el-dialog--center">
          <el-button @click="closeEnterGroupDialog" size="mini">取消</el-button>
          <el-button
            type="primary"
            @click="saveEnterGroupDialog"
            size="mini"
            :disabled="checkEnterGroupRuleFormDisable(enterGroupRuleForm)">确定
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import mixins from 'components/mixins';
import echartsContain from 'components/packages/echartsContain/echartsContain';

export default {
  name: 'fullTextSearch',
  mixins: [mixins],
  data () {
    return {
      step: 'init',
      keyword: '',
      dataContent:  [],
      // 筛选条件
      filterCondition: {
        type: 0,
        time: 0,
        result: 0,
        template: 0
      },
      typeList: [
        {
          desc: '所有类型',
          code: 0
        }
      ],
      timeList: [
        {
          desc: '时间不限',
          code: 0
        }
      ],
      resultList: [
        {
          desc: '所有结果',
          code: 0
        }
      ],
      templateList: [
        {
          desc: '所有报告',
          code: 0
        }
      ],
      multipleSelection: [],
      //入库入组参数
      enterGroupDialogVisible: false,
      enterGroupRuleForm: {
        disease: '',
        subject: '',
        labGroup: ''
      },
      diseaseDataList: [],
      subjectDataList: [],
      labGroupDatalist: []
    };
  },
  components: {echartsContain},
  watch: {},
  computed: {},
  created () {

  },
  mounted () {
    this.initPage();
  },
  methods: {
    // resize() {
    //   let height = $('.bigContain').height();
    //   $('.tableHeight .el-table__body').eq(0).height(height - 230);
    //   $('.bigContain').css({
    //     marginBottom:0
    //   })
    // },
    initPage () {
      this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
    },
    search () {
      if(this.keyword!=="" ){
        this.step = 'result';
        this.reportSearchMatch();

      }else{
        this.step = "init";
      }
    },
    derive () {

    },
    openEnterGroupDialog () {
      this.enterGroupDialogVisible = true;
    },
    //全选
    queryAll() {
      this.multipleSelection.push(...this.dataContent);
      this.multipleSelection.forEach(item=>{
        this.$refs.multipleTable.toggleRowSelection(item)
      })
      this.getDiseaseList()
    },
    //清除
    clearAll() {
      this.$refs.multipleTable.clearSelection()
      this.diseaseDataList = [];
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      if(this.multipleSelection.length!==0) {
        this.getDiseaseList()
      }else{
        this.diseaseDataList = [];
      }
    },
    jumpReportRead (val) {
      let urlParameter = {
        cacheData: false,
        formId: val.report.crfId || "",
        groupId: val.report.groupId || "",
        subjectId: "",
        diseaseId: "",
        patientName: val.patientName,
        patientId: val.report.patientId || "",
        identify: "",
        reportId:val.report.id||"",
        from: "caseManage",
        title:val.reportName,
        isModify:'displayNone'
      };
      sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
      console.log(urlParameter);
      window.open('./patientForm.html');
    },
    //弹框事件
    diseaseChange (val) {
      this.enterGroupRuleForm.subject = '';
      this.enterGroupRuleForm.labGroup = '';
      this.getSubjectDataList();
    },
    subjectChange (val) {
      this.enterGroupRuleForm.labGroup = '';
      this.subjectDataList.map(subject => {
        if (subject.id === val) {
          this.labGroupDatalist = subject.experimentGroups;
        }
      });
    },
    checkEnterGroupRuleFormDisable (enterGroupRuleForm) {
      if (enterGroupRuleForm.disease == '') {
        return true;
      }
      if (enterGroupRuleForm.disease && enterGroupRuleForm.subject == '' && enterGroupRuleForm.labGroup == '') {
        return false;
      }
      if (enterGroupRuleForm.disease && enterGroupRuleForm.subject && enterGroupRuleForm.labGroup == '') {
        return true;
      }
      if (enterGroupRuleForm.disease && enterGroupRuleForm.subject && enterGroupRuleForm.labGroup) {
        return false;
      }
    },
    closeEnterGroupDialog() {
      this.enterGroupDialogVisible = false;
      for (let key in this.enterGroupRuleForm) {
        this.enterGroupRuleForm[key] = '';
      }
    },
    async reportSearchMatch() {
      let that = this;
      let formData = {
        match:that.keyword
      };
      try{
        let data = await that.$http.reportSearchMatch(formData);
        if(data.code == 0) {
          that.dataContent = data.data
        }
      }catch (error) {
        that.$notice('未检索到数据')
      }
    },
    async getSubjectDataList () {
      let that = this;
      try {
        let data = await that.$http.findSubjectStudies(
          that.removeNullKey({
            diseaseId: that.enterGroupRuleForm.disease
          })
        );
        if (data && data.code == '0') {
          that.subjectDataList = data.data.subjectStudies;
        }
      } catch (error) {
        that.$notice('获取课题及实验组失败');
        console.log(error);
      }
    },
    async saveEnterGroupDialog () {
      let that = this;
      if (that.enterGroupRuleForm.disease && that.enterGroupRuleForm.subject == '' && that.enterGroupRuleForm.labGroup == '') {
        that.saveCaseStorage();
      } else {
        that.saveEnterGroup();
      }
    },
    async getDiseaseList () {
      let that = this;
      try {
        let data = await that.$http.findDiseaseSpecies();
        if (data && data.code == '0') {
          that.diseaseDataList = data.data.diseaseSpecieses;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveCaseStorage () {
      let that = this;
      let selectDiseaseName = that.diseaseDataList[that.diseaseDataList.findIndex(ele => {
        return (
          ele.id === that.enterGroupRuleForm.disease
        );
      })].name;
      let patientIdList = this.multipleSelection.map(item=>{
        return item.report.patientId
      })
      that.$confirm('确定要将此病例入库到 ' + selectDiseaseName + ' 吗？', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          let formData = {
            diseaseId: that.enterGroupRuleForm.disease,
            patientIds: patientIdList|| []
          };
          try {
            let data = await that.$http.casesSavePatients(that.$format(formData));
            if (data && data.code == '0') {
              that.closeEnterGroupDialog();
              // that.getDataList(that.currentPage, that.currentPageSize);
              that.$notice(data.msg);
            }
          } catch (error) {
            that.$notice('病例入库失败');
            console.log(error);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    async saveEnterGroup () {
      let that = this;
      let selectGroupName = that.labGroupDatalist[that.labGroupDatalist.findIndex(ele => {
        return (
          ele.id === that.enterGroupRuleForm.labGroup
        );
      })].name;
      that.$confirm('确定要将此病例入组到 ' + selectGroupName + ' 吗？', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          let patientIdList = this.multipleSelection.map(item=>{
            return item.report.patientId
          })
          let formData = {
            diseaseId: that.enterGroupRuleForm.disease,
            experimentId: that.enterGroupRuleForm.labGroup,
            subjectId: that.enterGroupRuleForm.subject,
            patientIds: patientIdList|| []
          };
          try {
            let data = await that.$http.casesEnterGroup(formData);
            if (data && data.code == '0') {
              that.closeEnterGroupDialog();
              // that.getDataList(that.currentPage, that.currentPageSize);
              that
                .$confirm(`${data.msg}`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  showCancelButton: false,
                  type: 'warning'
                })
                .then(() => {})
                .catch(error => {
                  console.log(error);
                });
            }
          } catch (error) {
            that.$notice('入组操作失败');
            console.log(error);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>

<style scoped>
</style>
<style lang="less">
  body {
    .fullTextSearch .input-with-btn .el-input-group__append {
      background-color: #2d8cf0;
      font-size: 18px;
      color: #fff;
      border-radius: 8px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      width: 110px;
      text-align: center;
    }

    .fullTextSearch .rs-count {
      color: #2d8cf0;
      margin-right: 30px;
    }
    .fullTextSearch .queryAllDom,.clearAllDom {
      color: #2d8cf0;
      cursor: pointer;
      padding-right: 2%;
    }
    .fullTextSearch .search-init {
      height: 100%;
      padding-top: 35px;
      background: url("./images/fulltext_blue.png") no-repeat 99% 98%;
      background-size: 300px auto;
    }
  }

  body.theme-green {
    .fullTextSearch .input-with-btn .el-input-group__append {
      background-color: #00d1a0;
      font-size: 18px;
      color: #fff;
      border-radius: 8px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      width: 110px;
      text-align: center;
    }

    .fullTextSearch .rs-count {
      color: #00d1a0;
      margin-right: 30px;
    }

    .fullTextSearch .search-init {
      height: 100%;
      padding-top: 35px;
      background: url("./images/fulltext_green.png") no-repeat 99% 98%;
      background-size: 300px auto;
    }
    .fullTextSearch .search-rs {
      text-align: left;
      height: 100%;
      padding-top: 35px;
      background: url("./images/fulltext_green.png") no-repeat 99% 98%;
      background-size: 300px auto;
    }
  }
  body .cloud-component {
    padding: 0 15px ;
  }
  .fullTextSearch {
    text-align: center;
  }

  .fullTextSearch .page-title {
    font-size: 22px;
    color: #666;
    text-align: center;
    margin: 6vh 0;
  }

  .fullTextSearch .input-with-btn.el-input {
    width: 700px;
    margin: 0 auto;
  }

  .fullTextSearch .input-with-btn .el-input__inner {
    height: 50px !important;
    line-height: 48px;
    font-size: 14px;
    border-radius: 8px;
    padding-left: 20px;
  }

  .fullTextSearch .search-rs {
    text-align: left;
    height: 100%;
    padding-top: 35px;
    background: url("./images/fulltext_blue.png") no-repeat 99% 98%;
    background-size: 300px auto;
  }

  .fullTextSearch .patient-name {
    /*color: #128aeb;*/
    display: inline-block;
    width: 69%;
    font-size: 14px;
    /*color: #35B1D5;*/
    color: #2d8cf0;
    /*margin-bottom: 15px;*/
  }
  .fullTextSearch .patient-name span{
    padding-right: 10px;
  }
  .fullTextSearch .patient-desc {
    color: #666666;
    line-height: 16px;
    margin-bottom: 20px;
  }
  .fullTextSearch .report-author {
    width: 30%;
    display: inline-block;
    text-align: right;
    color: #B6BECD;
    font-size: 12px;
    /*margin-bottom: 15px;*/
  }
  .fullTextSearch .search_match {
    /*border:1px dashed #D8DCE4;*/
    padding: 5px;
    display: inline-block;
    /*margin-right: 5px;*/
    /*margin-bottom: 5px;*/
  }
  .fullTextSearch .el-table.rs-table {
    /*width: 860px;*/
    border: none;
  }

  .fullTextSearch .rs-table thead {
    display: none;
  }

  .fullTextSearch .rs-table .el-table__header-wrapper {
    border: none;
  }

  .fullTextSearch .el-table.rs-table td {
    border: none;
    cursor: pointer;
    /*border-top: 1px solid #D8DCE4;*/
    padding: 8px 0;
  }
  .fullTextSearch .el-table.rs-table td .bg_highlight{
    /*background-color: #8AB4F7;*/
    background-color: #2d8cf0;
    color: #ffffff;
    padding: 1px;
    /*border-right: 2px solid #2d8cf0;*/
  }

  .fullTextSearch .el-table.rs-table::before {
    display: none;
  }

  .fullTextSearch .search-rs {
    padding: 10px;
  }

  .fullTextSearch .input-search.el-input {
    width: 81%;
    /*width: 100%;*/
    /*height: 50px;*/
    /*line-height: 48px;*/
  }

  .fullTextSearch .input-search.el-input .el-input__inner {
    height: 40px !important;
    line-height: 38px;
    font-size: 14px;
    color: #63666E;
  }

  .fullTextSearch .el-table_1_column_5 el-table-column--selection {
    vertical-align: top;
  }

  .fullTextSearch .search-rs > div {
    margin: 8px 0;
    font-size: 14px;
  }

  .fullTextSearch .el-select {
    width: 126px;
    margin-right: 10px;
  }

  .fullTextSearch .el-table.rs-table .cell {
    padding-left: 0 !important;
  }

  .fullTextSearch .search-box {
    position: relative;
    /*width: 450px;*/
    width: 556px;
    /*border-bottom: 1px dashed #D8DCE4;*/
    padding-bottom: 10px;
  }

  .fullTextSearch .search-box .search-btn {
    display: block;
    width: 25px;
    height: 25px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  .fullTextSearch .search-box .search-btn:before {
    content: "\E619";
    font-family: 'element-icons';
    font-size: 24px;
    line-height: 24px;
    cursor: pointer;
  }
</style>

