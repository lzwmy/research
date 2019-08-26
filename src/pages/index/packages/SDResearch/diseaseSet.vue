<!-- 病种管理 -->
<template>
  <div class="cloud-component diseaseSet">
    <div class="cloud-search el-form-item-small">
      <div class="block-head clearfix">
        <span class="block-head-title">病种管理</span>
        <!--<div class="disease-title">{{diseaseDetail.name}}</div>-->
        <el-button
          @click="historyGoBack('/SDResearch')"
          type="text"
          style="float: right; margin-right: 20px">
          <i class="el-icon-back">返回</i>
        </el-button>
      </div>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <div class="diseaseSetContent">
          <div class="profile">
            <div class="profile-inner">
              <img v-if="diseaseDetail.logo" :src="'./static/img/disease-logo/' + diseaseDetail.logo + '.svg'"
                   :alt="'./static/img/disease-logo/' + diseaseDetail.name"
                   :class="'disease-logo ' + diseaseDetail.logo + '_bgColor'">
              <p class="disease-name">{{diseaseDetail.name}}</p>
              <div class="button-item">
                <div class="icon icon-edit" @click="openDiseaseDetailDialog()"></div>
              </div>
              <div class="button-item">
                <div class="icon icon-add" @click="openSubjectDetailDialog()"></div>
              </div>
            </div>
          </div>
          <div class="disease-detail">
            <div class="table-thead">
              <table class="common-table">
                <thead>
                <tr>
                  <th style="width:40%;">课题</th>
                  <th style="width:15%;">实验组</th>
                  <th style="width:15%;">绑定表单</th>
                  <th style="width:15%;">备注</th>
                  <th style="width:15%;">操作</th>
                </tr>
                </thead>
              </table>
            </div>
            <div class="table-tbody" :style="{height:routerViewHeight-55+'px'}">
              <table class="common-table">
                <tbody>
                <tr v-for="item in diseaseDetail.subjectStudies" :key="item.id">
                  <td style="width:40%;">
                    <div class="subjectTitle" :title="item.name">
                      <span class="readonly-icon" v-if="item.assignMode == 1">随机入组</span>
                      {{item.name && item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name}}
                    </div>
                    <div class="subjectButtonGroup">
                      <div class="icon icon-add" @click="openLabGroupDetailDialog(item,'add')"></div>
                      <div class="icon icon-edit" @click="openSubjectDetailDialog(item)"></div>
                      <div class="icon icon-delete" @click="subjectDelete(item)"></div>
                    </div>
                  </td>
                  <td colspan="4" style="width:60%;">
                    <div
                      class="lab-group-row clearfix"
                      v-for="innerItem in item.experimentGroups"
                      :key="innerItem.key">
                      <div style="width: 25%;" :title="innerItem.name">
                        {{innerItem.name && innerItem.name.length > 10 ? innerItem.name.substring(0, 10) + '...' : innerItem.name}}
                      </div>
                      <div style="width: 25%;" :title="innerItem.formName">
                        {{innerItem.formName && innerItem.formName.length > 10 ? innerItem.formName.substring(0, 10) + '...' : innerItem.formName}}
                      </div>
                      <div style="width: 25%;" :title="innerItem.remark">
                        {{innerItem.remark && innerItem.remark.length > 10 ? innerItem.remark.substring(0, 10) + '...' : innerItem.remark}}
                      </div>
                      <div style="float:right;width: 25%;padding-left: 15px;">
                        <div class="icon icon-edit" @click="openLabGroupDetailDialog(innerItem,'edit')"></div>
                        <div class="icon icon-delete" @click="labGroupDelete(innerItem)"></div>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </echarts-contain>
      <!--疾病弹框-->
      <el-dialog
        :title="diseaseDetailDialogTitle"
        :visible.sync="diseaseDetailDialogVisible"
        :append-to-body="true"
        width="500px"
        @close="closeDiseaseDetailDialog" class="diseaseSetDiseaseDialog">
        <el-form
          :inline="true"
          :model="diseaseDetailRuleForm"
          ref="diseaseDetailRuleForm"
          label-width="100px"
          class="el-dialog--center" :rules="rulesDiseaseDetail"
          @submit.native.prevent>
          <el-form-item label="单病种名称：" prop="name">
            <el-input
              v-model.trim="diseaseDetailRuleForm.name"
              placeholder="请输入单病种名称"
              size="mini"
              :maxlength="100"
              :clearable="true"></el-input>
          </el-form-item>
          <div class="logo-section">
            <div
              v-for="item in logoNameList"
              :key="item"
              @click="logoSelect(item)"
              :class="{'logo-option': true,'select' : item === diseaseDetailRuleForm.selectedLogoName}">
              <img v-if="item" :src="'./static/img/disease-logo/' + item + '.svg'" :alt="item" :class="item+'_bgColor'">
            </div>
          </div>
          <div class="el-dialog--center">
            <el-button @click="closeDiseaseDetailDialog" size="mini">取消</el-button>
            <el-button type="primary" @click="saveDiseaseDetailDialog" size="mini">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!--课题弹框-->
      <el-dialog
        :title="subjectDetailDialogTitle"
        :visible.sync="subjectDetailDialogVisible"
        :append-to-body="true"
        width="480px"
        @close="closeSubjectDetailDialog" class="diseaseSetSubjectDialog">
        <el-form
          :model="subjectDetailRuleForm"
          ref="subjectDetailRuleForm"
          label-width="95px" :rules="rulesSubjectDetail"
          @submit.native.prevent>
          <el-form-item label="课题名称：" prop="name">
            <el-input
              v-model.trim="subjectDetailRuleForm.name"
              placeholder="请输入课题名称"
              size="mini"
              :maxlength="100"
              :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="课题备注：">
            <el-input
              v-model.trim="subjectDetailRuleForm.remark"
              placeholder="请输入课题备注"
              :maxlength="500"
              size="mini"
              :clearable="true"
              type="textarea"
              resize="none"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 入组方式 0-手动入组 1-随机入组  -->
            <el-checkbox v-model.trim="subjectDetailRuleForm.assignMode">随机入组：病例将被随机分配到其下实验组，无法手动入组</el-checkbox>
          </el-form-item>
          <div class="el-dialog--center">
            <el-button @click="closeSubjectDetailDialog" size="mini">取消</el-button>
            <el-button type="primary" @click="saveSubjectDetaiDialog" size="mini">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!--实验组弹框-->
      <el-dialog :title="labGroupDetailDialogTitle" :visible.sync="labGroupDetailDialogVisible" :append-to-body="true"
                 width="420px" @close="closeLabGroupDetailDialog" class="diseaseSetGroupDialog">
        <el-form :model="labGroupDetailRuleForm" ref="labGroupDetailRuleForm" label-width="100px"
                 :rules="rulesLabGroupDetail"
                 @submit.native.prevent>
          <el-form-item label="实验组名称：" prop="name">
            <el-input
              v-model.trim="labGroupDetailRuleForm.name"
              placeholder="请输入实验组名称"
              size="mini"
              :maxlength="100"
              :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="实验组表单：" prop="formId">
            <el-select v-model.trim="labGroupDetailRuleForm.formId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in formDatalist"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验组备注：" prop="remark">
            <el-input type="textarea" :rows="4" resize="none"
                      v-model.trim="labGroupDetailRuleForm.remark"
                      size="mini"
                      placeholder="请输入实验组备注"
                      :maxlength="500"
                      :clearable="true"></el-input>
          </el-form-item>
          <div class="el-dialog--center">
            <el-button @click="closeLabGroupDetailDialog" size="mini">取消</el-button>
            <el-button type="primary" @click="saveLabGroupDetailDialog" size="mini">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
import './SDResearch.css';
import mixins from 'components/mixins';
import echartsContain from 'components/packages/echartsContain/echartsContain';

export default {
  name: 'diseaseSet',
  mixins: [mixins],
  data () {
    return {
      diseaseId: '',
      diseaseDetail: {
        id: '',
        name: '',
        logo: '',
        subjectStudies: []
      },
      logoNameList: [
        'bladder',
        'ear',
        'eye',
        'female',
        'gallbladder',
        'heart',
        'kidneys',
        'large_intestine',
        'liver',
        'lungs',
        'male',
        'nose',
        'pancreas',
        'stomach',
        'stomatology',
        'uterus',
        'small_intestine',
        'spleen',
        'cerebrum'
      ],

      // 疾病详情表单
      diseaseDetailRuleForm: {
        name: '',
        selectedLogoName: '' // 选中的Logo名称
      },
      rulesDiseaseDetail: {
        name: [
          {required: true, message: '单病种名称不能为空', trigger: 'blur'}
        ]
      },
      diseaseDetailDialogTitle: '',
      diseaseDetailDialogVisible: false,

      // 课题详情表单
      subjectDetailRuleForm: {
        assignMode: false, // 入组方式 0-手动入组 1-随机入组
        diseaseId: '', // 专病ID
        name: '', // 课题名称
        remark: '', // 备注
        id: '' // 课题ID
      },
      rulesSubjectDetail: {
        name: [
          {required: true, message: '课题名称不能为空', trigger: 'blur'}
        ]
      },
      subjectDetailDialogTitle: '',
      subjectDetailDialogVisible: false,
      subjectDetailType: '',

      // 实验组详情表单
      labGroupDetailRuleForm: {
        id: '', // 实验组ID
        formId: '', // 关联CRF表单主键ID  ,
        name: '', // 实验组名称 ,
        remark: '', // 备注 ,
        subjectId: '' // 课题ID
      },
      rulesLabGroupDetail: {
        formId: [
          {required: true, message: '实验组表单不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '实验组名称不能为空', trigger: 'blur'}
        ]
      },
      labGroupDetailDialogTitle: '',
      labGroupDetailDialogVisible: false,
      labGroupDetailType: '',
      formDatalist: []
    };
  },
  components: {echartsContain},
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.diseaseId = this.$route.query.id;
      this.getSubjectDataList();
      this.getFormDataList();
      this.getDataList();
    },
    async getDataList () {
      let that = this;
      try {
        let data = await that.$http.findDiseaseSpeciesDetail(
          that.removeNullKey({
            diseaseId: that.diseaseId
          })
        );
        if (data && data.code == '0') {
          that.diseaseDetail.id = data.data.diseaseSpecies.id;
          that.diseaseDetail.name = data.data.diseaseSpecies.name;
          that.diseaseDetail.logo = data.data.diseaseSpecies.logo;
          // console.log('that.diseaseDetail.name', that.diseaseDetail.name);
          // console.log('data.data.diseaseSpecies.name', data.data.diseaseSpecies.name);
        }
      } catch (error) {
        that.$notice('获取病种详情失败');
        console.log(error);
      }
    },
    async getSubjectDataList () {
      let that = this;
      try {
        let data = await that.$http.findSubjectStudies(
          that.removeNullKey({
            diseaseId: that.diseaseId
          })
        );
        if (data && data.code == '0') {
          that.diseaseDetail.subjectStudies = data.data.subjectStudies;
        }
      } catch (error) {
        that.$notice('获取课题详情失败');
        console.log(error);
      }
    },
    async getFormDataList () {
      let that = this;
      try {
        let data = await that.$http.findCrfFormsByDiseaseId(
          that.removeNullKey({
            crfIsAvailable: 1,
            // crfType: 0,
            diseaseId: that.diseaseId
          })
        );
        if (data && data.code == '0') {
          that.formDatalist = data.data.crfForms;
        }
      } catch (error) {
        that.$notice('获取crf表单列表失败');
        console.log(error);
      }
    },
    logoSelect (imgName) {
      this.diseaseDetailRuleForm.selectedLogoName = imgName;
    },
    openDiseaseDetailDialog () {
      this.diseaseDetailDialogTitle = '编辑疾病详情';
      this.diseaseDetailRuleForm.id = this.diseaseDetail.id;
      this.diseaseDetailRuleForm.name = this.diseaseDetail.name;
      this.diseaseDetailRuleForm.selectedLogoName = this.diseaseDetail.logo;
      this.diseaseDetailDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.diseaseDetailRuleForm.clearValidate();
      });
    },
    closeDiseaseDetailDialog () {
      this.diseaseDetailDialogVisible = false;
      for (let key in this.diseaseDetailRuleForm) {
        this.diseaseDetailRuleForm[key] = '';
      }
      this.$refs.diseaseDetailRuleForm.clearValidate();
    },
    saveDiseaseDetailDialog () {
      let that = this;
      that.$refs.diseaseDetailRuleForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        let params = {
          name: this.diseaseDetailRuleForm.name,
          logo: this.diseaseDetailRuleForm.selectedLogoName,
          id: this.diseaseDetailRuleForm.id
        };
        // console.log('params', params);
        try {
          let data = await that.$http.updateDiseaseSpecies(params);
          if (data && data.code == '0') {
            that.closeDiseaseDetailDialog();
            that.getDataList();
            that.$notice(data.msg);
          }
        } catch (error) {
          that.$notice('保存失败');
          console.log(error);
        }
      });
    },
    openSubjectDetailDialog (subject) {
      this.subjectDetailDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.subjectDetailRuleForm.clearValidate();
      });
      if (subject) {
        this.subjectDetailType = 'edit';
        this.subjectDetailDialogTitle = '编辑课题';
        this.subjectDetailRuleForm.name = subject.name;
        this.subjectDetailRuleForm.remark = subject.remark;
        this.subjectDetailRuleForm.assignMode = subject.assignMode === 1;
        this.subjectDetailRuleForm.id = subject.id;
      } else {
        this.subjectDetailType = 'add';
        this.subjectDetailDialogTitle = '新增课题';
        this.subjectDetailRuleForm.id = '';
      }
    },
    closeSubjectDetailDialog () {
      let that = this;
      that.subjectDetailDialogVisible = false;
      that.subjectDetailRuleForm.name = '';
      that.subjectDetailRuleForm.remark = '';
      that.subjectDetailRuleForm.assignMode = false;
      that.$refs.subjectDetailRuleForm.clearValidate();
    },
    saveSubjectDetaiDialog () {
      let that = this;
      that.$refs.subjectDetailRuleForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        let api = '';
        let params = {
          name: that.subjectDetailRuleForm.name,
          remark: that.subjectDetailRuleForm.remark,
          assignMode: that.subjectDetailRuleForm.assignMode ? 1 : 0,
          diseaseId: that.diseaseId,
          id: that.subjectDetailRuleForm.id
        };
        switch (that.subjectDetailType) {
          case 'edit':
            params.diseaseId = that.diseaseId;
            api = 'updateSubjectStudy';
            break;
          case 'add':
            api = 'addSubjectStudy';
            break;
          default:
            console.warn('课题详情类型失去匹配');
            break;
        }
        try {
          let data = await that.$http[api](that.removeNullKey(params));
          if (data && data.code == '0') {
            that.closeSubjectDetailDialog();
            that.getSubjectDataList();
            that.$notice(data.msg);
          }
        } catch (error) {
          let txt = that.subjectDetailType === 'edit' ? '编辑' : '添加';
          that.$notice(`${txt}失败`);
          console.log(error);
        }
      });
    },
    subjectDelete (subject) {
      let that = this;
      that
        .$confirm('此操作将删除课题 ' + subject.name + ' , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          try {
            let data = await that.$http.deleteSubjectStudy({
              id: subject.id
            });
            if (data && data.code == '0') {
              that.getSubjectDataList();
              that.$notice(data.msg);
            }
          } catch (error) {
            that.$notice('删除失败');
            console.log(error);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openLabGroupDetailDialog (ob, type) {
      console.log(ob)
      this.labGroupDetailDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.labGroupDetailRuleForm.clearValidate();
      });
      // console.log('ob', ob);
      if (type === 'edit') {
        this.labGroupDetailType = 'edit';
        this.labGroupDetailDialogTitle = '编辑实验组';

        this.labGroupDetailRuleForm.name = ob.name;
        this.labGroupDetailRuleForm.remark = ob.remark;
        this.labGroupDetailRuleForm.formId = ob.formId;
        this.labGroupDetailRuleForm.id = ob.id;
        this.labGroupDetailRuleForm.subjectId = ob.subjectId;
      } else {
        this.labGroupDetailType = 'add';
        this.labGroupDetailDialogTitle = '新增实验组';
        this.labGroupDetailRuleForm.subjectId = ob.id;
        this.labGroupDetailRuleForm.id = '';
      }
    },
    closeLabGroupDetailDialog () {
      this.labGroupDetailDialogVisible = false;
      for (let key in this.labGroupDetailRuleForm) {
        this.labGroupDetailRuleForm[key] = '';
      }
      this.$refs.labGroupDetailRuleForm.clearValidate();
    },
    saveLabGroupDetailDialog () {
      let that = this;
      that.$refs.labGroupDetailRuleForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        let api = '';
        let params = {
          name: that.labGroupDetailRuleForm.name,
          remark: that.labGroupDetailRuleForm.remark,
          formId: that.labGroupDetailRuleForm.formId,
          subjectId: that.labGroupDetailRuleForm.subjectId
        };

        switch (that.labGroupDetailType) {
          case 'edit':
            params.id = that.labGroupDetailRuleForm.id;
            api = 'updateExperimentGroup';
            break;
          case 'add':
            params.id = '';
            api = 'addExperimentGroup';
            break;
          default:
            console.warn('课题详情类型失去匹配');
            break;
        }
        // console.log('params', params);

        try {
          let data = await that.$http[api](that.removeNullKey(params));
          if (data && data.code == '0') {
            that.closeLabGroupDetailDialog();
            that.getSubjectDataList();
            that.$notice(data.msg);
          }
        } catch (error) {
          let txt = that.labGroupDetailType === 'edit' ? '编辑' : '添加';
          that.$notice(`${txt}失败`);
          console.log(error);
        }
      });
    },
    labGroupDelete (labGroup) {
      let that = this;
      that
        .$confirm('此操作将删除实验组 ' + labGroup.name + ' , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          try {
            let data = await that.$http.deleteExperimentGroup({
              groupId: labGroup.id
            });
            if (data && data.code == '0') {
              that.getSubjectDataList();
              that.$notice(data.msg);
            }
          } catch (error) {
            that.$notice('删除失败');
            console.log(error);
          }
        })
        .catch(error => {
          console.log(error);
        });
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

<style scoped>

</style>

<style lang="less">
  body {
    .diseaseSetDiseaseDialog .el-form .el-form-item .el-input, .diseaseSetGroupDialog .el-form .el-form-item .el-input, .diseaseSetSubjectDialog .el-form .el-form-item .el-input {
      width: 280px
    }
    .diseaseSetGroupDialog .el-form .el-form-item .el-textarea, .diseaseSetSubjectDialog .el-form .el-form-item .el-textarea {
      width: 280px
    }
    .diseaseSet .table-tbody {
      border-bottom: 2px solid #e9eaec;
    }
    .diseaseSet .table-thead {
      overflow-y: hidden !important;
      overflow-x: hidden !important;
    }

    .diseaseSet .readonly-icon {
      background: #f8cd47;
      color: #fff;
      display: inline-block;
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 12px;
      line-height: 27px;
      height: 27px;
      vertical-align: middle;
    }
  }

  body.theme-blue {
    .profile .profile-inner {
      border: 1px solid #e9eaec;
      border-top: 2px solid #2d8cf0;
      padding-top: 15px;
      overflow: hidden;
    }
  }

  body.theme-green {
    .profile .profile-inner {
      border: 1px solid #e9eaec;
      border-top: 2px solid #00d1a0;
      padding-top: 15px;
      overflow: hidden;
    }
  }
</style>
