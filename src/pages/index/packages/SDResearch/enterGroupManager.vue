<template>
  <div class="cloud-component enterGroupManager">
    <!-- 搜索区域 -->
    <div class="cloud-search bottom_15 flex-between-center">
      <div class="block-head flex-start-center">
        <p class="page_title">入组管理</p>
        <div class="disease-title">{{ruleForm.patientName}} | {{ruleForm.identify}}</div>
      </div>
      <div class="flex-end-center">
        <el-button type="primary" @click="openEnterGroupDialog">入库入组</el-button>
        <!--<el-button type="default" @click="$router.push('/allCases')">返 回</el-button>-->
        <el-button type="default" @click="backPage">返 回</el-button>
      </div>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" ref="roleTable">
          <el-table-column prop="index" label="序号" min-width="5%"></el-table-column>
          <el-table-column prop="diseaseName" label="单病种库" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="subjectName" label="课题" min-width="20%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="groupName" label="实验组" min-width="20%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="formName" label="CRF表单名称" min-width="20%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="fill" label="状态" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.fill">已填写</span>
              <span v-else>未填写</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="outGroup(scope.row)" style="margin-left: 8px">
                <i class="el-icon-edit-outline" title="出组"></i>
              </el-button>
              <el-button type="text" size="small" @click="fillCRF(scope.row)" style="margin-left: 8px">
                <i class="icon iconfont iconbianji" title="填写CRF"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>
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

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';

export default {
  name: 'enterGroupManager',
  mixins: [mixins],
  data () {
    return {
      ruleForm: {
        patientName: '',
        patientId: '',
        identify: ''
      },
      dataList: {},
      loading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
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
  watch: {},
  computed: {},
  created () {
    this.initPage();
  },
  mounted () {},
  components: {
    pagination,
    echartsContain
  },
  methods: {
    initPage () {
      this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.ruleForm = {
        patientName: this.$route.query.patientName,
        patientId: this.$route.query.patientId,
        identify: this.$route.query.identify
      };
      this.search();
      this.getDiseaseList();
    },
    search () {
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      that.loading = true;
      let formData = {
        page: pageNo - 1,
        size: pageSize,
        patientId: that.ruleForm.patientId
      };
      try {
        let data = await that.$http.casesFindGroupByPatientId(that.$format(formData));
        that.loading = false;
        if (data && data.code == '0') {
          let obj = {};
          obj.content = data.data.list;
          obj.content.forEach((item, index) => {
            item.index = (pageNo - 1) * pageSize + index + 1;
          });
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.total);
          obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
          that.dataList = obj;
          setTimeout(() => {
            that.$refs['roleTable'].doLayout();
          }, 200);
        }
      } catch (error) {
        that.loading = false;
        that.$notice('获取病例所在实验组列表失败');
        console.log(error);
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
    openEnterGroupDialog () {
      this.enterGroupDialogVisible = true;
    },
    backPage() {
      window.history.go(-1);
    },
    closeEnterGroupDialog () {
      this.enterGroupDialogVisible = false;
      for (let key in this.enterGroupRuleForm) {
        this.enterGroupRuleForm[key] = '';
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
          let formData = {
            diseaseId: that.enterGroupRuleForm.disease,
            experimentId: that.enterGroupRuleForm.labGroup,
            subjectId: that.enterGroupRuleForm.subject,
            patientIds: [that.ruleForm.patientId]
          };
          try {
            let data = await that.$http.casesEnterGroup(formData);
            if (data && data.code == '0') {
              that.closeEnterGroupDialog();
              that.getDataList(that.currentPage, that.currentPageSize);
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
    async saveCaseStorage () {
      let that = this;
      let selectDiseaseName = that.diseaseDataList[that.diseaseDataList.findIndex(ele => {
        return (
          ele.id === that.enterGroupRuleForm.disease
        );
      })].name;
      that.$confirm('确定要将此病例入库到 ' + selectDiseaseName + ' 吗？', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          let formData = {
            diseaseId: that.enterGroupRuleForm.disease,
            patientIds: [that.ruleForm.patientId]
          };
          try {
            let data = await that.$http.casesSavePatients(that.$format(formData));
            if (data && data.code == '0') {
              that.closeEnterGroupDialog();
              that.getDataList(that.currentPage, that.currentPageSize);
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
    outGroup (row) {
      let that = this;
      that.$confirm('您确定要将此病例移除 ' + row.groupName + ' 吗？', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          try {
            let formData = {
              experimentId: row.groupId,
              patientIds: [that.ruleForm.patientId]
            };
            let data = await this.$http.casesOutGroup(formData);
            if (data && data.code == '0') {
              that.getDataList(that.currentPageNo, that.currentPageSize);
              that.$notice(data.msg);
            }
          } catch (error) {
            this.$notice('出组操作失败');
            console.log(error);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    fillCRF (row) {
      let that = this;
      console.log(row)
      /*that.$router.push({
        name: 'reportFill',
        query: {
          cacheData: false,
          formId: row.formId,
          groupId: row.groupId,
          subjectId: row.subjectId,
          diseaseId: row.diseaseId,
          patientName: that.ruleForm.patientName || '',
          patientId: that.ruleForm.patientId || '',
          identify: that.ruleForm.identify || '',
          from: that.$route.name
        }
      });*/
      let urlParameter = {
        cacheData:false,
        formId:row.formId,
        reportId: row.id || '',
        groupId:row.groupId,
        subjectId:row.subjectId,
        diseaseId:row.diseaseId,
        patientName:that.ruleForm.patientName,
        patientId:that.ruleForm.patientId,
        identify:that.ruleForm.identify,
        from:"caseManage",
        title:row.formName,
        isModify:'displayShow'
      };
      localStorage.setItem('reportFill',JSON.stringify({urlParameter}));
      let urlParameters = "cacheData="+false+"&formId="+row.formId+"&groupId="+row.groupId+"&subjectId="+row.subjectId+"&diseaseId="+row.diseaseId+"&patientName="+that.ruleForm.patientName+"&patientId="+that.ruleForm.patientId+"&identify="+that.ruleForm.identify+"&from="+'caseManage'+"&title="+row.formName+"&isModify="+"displayShow";
      // window.open('./patientForm.html?'+urlParameters);
      window.open('./patientForm.html');
    },
    // 通用：通过检查表单是否完成，已决定按钮是否可用
    checkDisable (form) {
      let flag = true;
      for (let key in form) {
        if (form[key] === '') {
          flag = false;
        }
      }
      return !flag;
    },
    reset () {
      // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.ruleForm.resetFields();
      Object.assign(this.$data, this.$options.data());
      // 初始化data默认值及页面
      this.initPage();
    }
  },
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>


<style lang="less">
  body {
    // .enterGroupManager .block-head-title {
    //   font-size: 16px;
    //   color: 
    // }
    .enterGroupManager .disease-title {
      font-size: 16px;
      font-weight: bold;
      margin-left: 20px;
      display: inline-block;
      vertical-align: middle;
    }
    .enterGroupDialog .el-form .el-form-item .el-input {
      width: 200px
    }
  }
</style>
