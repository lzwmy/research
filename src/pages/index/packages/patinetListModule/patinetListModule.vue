<template>
    <div class="patient_list_module SDResearch">
      <div class="component_head flex-between-center">
        <p>{{$route.meta.txt}}</p>
        <div class=" cur_pointer head_content flex-start-center">
          <el-button type="primary"  icon="el-icon-plus" @click="showaddPatientDialog('添加患者')">添加患者</el-button>
        </div>
      </div>

      <div class="list_module_content">
        <div v-if="!showPatientInfo">
          <!-- 病例管理 cloud-component-->
          <div class="cloud-component caseManage">
            <!-- 搜索区域 -->
            <div class="cloud-search el-form-item-small">
              <el-form :inline="true" @submit.native.prevent>
                <div class="flex-between-center flex-wrap">
                  <div>
                    <el-form-item label prop>
                      <div :class="{'labGroup-section': true,'dropmenuHide': dropmenuHide}" @mouseover="dropmenuHide = false">
                        <div class="selectLabSubjectGroupName" :title="selectLabSubjectGroupName">{{selectLabSubjectGroupName}}
                        </div>
                        <div class="labGroup-dropmenu" :style="{maxHeight:routerViewHeight+'px'}">
                      <span class="labGroup-btn all"
                            @click="labGroupSelect({name: diseaseDetail.name+'-全部病例',id: ''})">{{diseaseDetail.name}}-全部病例</span>
                          <table class="dropmenu-table">
                            <tr v-for="subject in subjectDataList" :key="subject.id" v-if="subject.experimentGroups.length !== 0">
                              <td width="150" :title="subject.name">
                                {{subject.name.length > 9 ? subject.name.substring(0, 9) + '...' : subject.name}}
                              </td>
                              <td>
                                <div v-for="labGroup in subject.experimentGroups" :key="labGroup.id"
                                    class="labGroup-btn" @click="labGroupSelect(labGroup,subject)" :title="labGroup.name">
                                  {{labGroup.name.length > 12 ? labGroup.name.substring(0, 12) + '...' : labGroup.name}} -- {{labGroup.formName.length > 12 ? labGroup.formName.substring(0, 12) + '...' : labGroup.formName}}
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="视图列表：" class="change_height">
                      <multipleCheckBoxSelect ref="multipleCheckBoxSelect" @change="viewChangeHandle" placeholderText="选择视图"
                                              :dataList="viewsList"
                                              :isFilterable="true"></multipleCheckBoxSelect>
                    </el-form-item>
                    <el-form-item label="我的筛选：" class="change_height">
                      <el-select v-model.trim="currentSelectMySaveConditionId" class="move_top" clearable filterable placeholder="选择我的筛选" size="mini"
                                @change="changeCurrentSelectMySaveCondition" @visible-change="getMySaveCondition">
                        <el-option
                          v-for="item in mySaveConditionViewList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                      <span style="float: left"
                            :title="item.name">{{ item.name.length > 7 ? item.name.substring(0, 7) + '...' : item.name }}</span>
                          <span style="float: right;font-size: 13px;padding-left:35px;">
                        <i class="el-icon-error el-button" style="border:none;background: transparent;padding:0;"
                          @click.stop="deleteMySaveCondition(item)" title="删除"></i>
                      </span>
                        </el-option>
                      </el-select>
                      <el-button type="text" size="small" @click="openSaveConditionDialog" style="margin-left: 5px;">
                        <i class="icon-save" title="保存筛选"></i>
                      </el-button>

                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item class="fuzzyQuery rf mt">
                      <el-input v-model.trim="fuzzyQuery" @change="fuzzyQueryHandle" @keyup.enter.native="fuzzyQueryHandle"
                                prefix-icon="el-icon-search"
                                placeholder="请输入搜索内容"></el-input>
                    </el-form-item>
                    <el-form-item class="fuzzyQuery rf mt">
                      <el-dropdown class="caseManageDropdown" style="margin-right: 6px;" @command="handleCommand" trigger="hover"
                                  size="medium">
                      <span class="el-dropdown-link">操作
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                          <!--<el-dropdown-item command="crfFill"
                                            v-if="selectLabGroupId && (selectRow.length==0 || selectRow.length ==1)">填写
                          </el-dropdown-item>-->
                          <el-dropdown-item command="enterGroup">入组</el-dropdown-item>
                          <el-dropdown-item command="enterGroupManager" v-if="selectRow.length==0 || selectRow.length ==1">入组管理
                          </el-dropdown-item>
                          <el-dropdown-item command="outGroup" v-if="selectLabGroupId">出组</el-dropdown-item>
                          <el-dropdown-item command="moveGroup" v-if="selectLabGroupId">迁组</el-dropdown-item>
                          <!-- <el-dropdown-item>病人360视图</el-dropdown-item> -->
                          <el-dropdown-item command="export">导出</el-dropdown-item>
                          <el-dropdown-item command="exportAll" v-if="selectLabGroupId">导出所有</el-dropdown-item>
                          <el-dropdown-item command="caseStorage">病例入库</el-dropdown-item>
                          <el-dropdown-item command="edit" :disabled="selectRow.length != 1">编辑患者</el-dropdown-item>
                          <el-dropdown-item command="delete" :disabled="selectRow.length == 0">删除患者</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-form-item>
                  </div>
                </div>
                <el-form-item label prop class="change_height">
                  <el-select v-model.trim="conditionSet.column" clearable filterable placeholder="选择列名" size="mini">
                    <el-option
                      v-for="item in conditionViewList"
                      :key="item.name"
                      :label="item.label"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label prop class="change_height">
                  <el-select v-model.trim="conditionSet.operator" clearable filterable placeholder="选择运算符" size="mini"
                            @change="changeOperator">
                    <el-option
                      v-for="item in conditionOperatorList"
                      :key="item.name"
                      :label="item.label"
                      :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label prop class="change_height">
                  <el-date-picker v-if="currentColumnsdataType === 'DATE'  || currentColumnsdataType.indexOf('TIMESTAMP')!=-1"
                                  v-model="conditionSet.param"
                                  :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'"
                                  type="datetime"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  :clearable="true"
                                  placeholder="选择日期时间">
                  </el-date-picker>
                  <el-select v-else-if=" conditionSet.column === 'fill'" size="mini"
                            v-model="conditionSet.param" clearable filterable placeholder="选择是否填写"
                            :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'">
                    <el-option label="已填写" value="1"></el-option>
                    <el-option label="未填写" value="0"></el-option>
                  </el-select>
                  <el-input v-else v-model.trim="conditionSet.param" size="mini"
                            :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'"
                            placeholder="填写参数"
                            :maxlength="40"
                            :clearable="true"></el-input>
                </el-form-item>
                <el-form-item label prop v-if="conditionSet.operator =='Between'">
                  <el-date-picker v-if="currentColumnsdataType === 'DATE' || currentColumnsdataType.indexOf('TIMESTAMP')!=-1"
                                  v-model="conditionSet.param2"
                                  :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'"
                                  type="datetime"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  :clearable="true"
                                  placeholder="选择日期时间">
                  </el-date-picker>
                  <el-select v-else-if=" conditionSet.column === 'fill'" size="mini"
                            v-model="conditionSet.param2" clearable filterable placeholder="选择是否填写"
                            :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'">
                    <el-option label="已填写" value="1"></el-option>
                    <el-option label="未填写" value="0"></el-option>
                  </el-select>
                  <el-input v-else v-model.trim="conditionSet.param2" size="mini"
                            :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'"
                            placeholder="填写参数"
                            :maxlength="40"
                            :clearable="true"></el-input>
                </el-form-item>
                <el-form-item label prop>
                  <el-button type="primary" @click="conditionAdd" icon="el-icon-plus">添加</el-button>
                  <el-button type="primary"  @click="search" icon="el-icon-search">查询</el-button>
                  <el-button @click="reset" icon="el-icon-refresh-left">重置</el-button>
                </el-form-item>
              </el-form>
              <div class="conditiaoContain">
                <el-tag v-for="(item,index) in conditionList" :key="index" closable @close="conditionDelete(item,index)">
              <span v-if="item.operator =='Between'">
                <span
                  style="font-weight:700;">{{item.viewLabel + ' | '}}</span>{{item.columnName + ' ' + '在' + item.param + '和' + item.param2 + '之间'}}
              </span>
                  <span v-else-if="item.operator =='Null' || item.operator =='NotNull'">
                <span style="font-weight:700;">{{item.viewLabel + ' | '}}</span>{{item.columnName + ' ' + item.operatorName}}
            </span>
                  <span v-else-if="item.column == 'fill'">
                <span
                  style="font-weight:700;">{{item.viewLabel + ' | '}}</span>{{item.columnName + ' ' + item.operatorName + ' ' + (item.param == 1 ? '已填写' : '未填写')}}
              </span>
                  <span v-else>
                <span
                  style="font-weight:700;">{{item.viewLabel + ' | '}}</span>{{item.columnName + ' ' + item.operatorName + ' ' + item.param}}
              </span>
                </el-tag>
              </div>
            </div>
            <div class="cloud-search-list">
              <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-tabs v-model="viewName" type="card" closable @tab-click="changeViewName" @tab-remove="removeViewName">
                  <el-tab-pane
                    v-for="(item) in currentSelectViewsList"
                    :key="item.name"
                    :label="item.label"
                    :name="item.name">
                    <el-table style="width:100%;" :ref="item.name"
                              :height="(item.dataList && item.dataList.length>0)?(routerViewHeight*1-35-38-55):(routerViewHeight*1-38-55)"
                              :data="item.dataList.content" @row-dblclick="dblclickHandle"
                              v-loading="loading"
                              :border="false"
                              :empty-text="emptyText"
                              :element-loading-text="elementLoadingText"
                              :default-sort="{prop: 'date', order: 'descending'}"
                              @selection-change="handleSelectionChange">
                      <el-table-column type="selection"></el-table-column>
                      <el-table-column 
                        :prop="column.name" 
                        :label="column.label" 
                        sortable 
                        v-for="column in conditionViewList" 
                        :width="column.name == 'GENDER_NAME'?'80px':'' || column.name == 'AGE'?'80px':'' "
                        :key="column.name" 
                        show-overflow-tooltip>
                      </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <pagination :data="item.dataList" @change="getDataList"  :key="item.name"></pagination>
                  </el-tab-pane>
                </el-tabs>
              </echarts-contain>
            </div>
            <!-- 入组弹窗 -->
            <el-dialog
              title="入组"
              :visible.sync="enterGroupDialogVisible"
              :append-to-body="true"
              width="400px"
              @close="closeEnterGroupDialog" class="enterGroupDialog">
              <el-form :model="enterGroupRuleForm" label-width="95px" @submit.native.prevent>
                <el-form-item label="课题：" prop="subject">
                  <el-select v-model.trim="enterGroupRuleForm.subject" clearable filterable placeholder="请选择" size="mini"
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
                  <el-select v-model.trim="enterGroupRuleForm.labGroup" clearable filterable placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in labGroupDatalist"
                      :key="item.id"
                      :title="item.name"
                      :label="item.name.length>15?item.name.substring(0,15)+'...':item.name"
                      :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="el-dialog--center">
                <el-button @click="closeEnterGroupDialog" size="mini">取消</el-button>
                <el-button
                  type="primary"
                  @click="saveEnterGroupDialog"
                  size="mini"
                  :disabled="checkDisable(enterGroupRuleForm)">确定
                </el-button>
              </div>
            </el-dialog>
            <!-- 迁组弹窗 -->
            <el-dialog
              title="迁组"
              :visible.sync="moveGroupDialogVisible"
              :append-to-body="true"
              width="400px"
              @close="closeMoveGroupDialog" class="moveGroupDialog">
              <el-form :inline="true" :model="moveGroupRuleForm" label-width="95px" @submit.native.prevent>

                <el-form-item label="课题：" prop="subject">
                  <el-select v-model.trim="moveGroupRuleForm.subject" clearable filterable placeholder="请选择" size="mini"
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
                  <el-select v-model.trim="moveGroupRuleForm.labGroup" clearable filterable placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in labGroupDatalist"
                      :key="item.id"
                      :title="item.name"
                      :label="item.name.length>15?item.name.substring(0,15)+'...':item.name"
                      :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="el-dialog--center">
                <el-button @click="closeMoveGroupDialog" size="mini">取消</el-button>
                <el-button
                  type="primary"
                  @click="saveMoveGroupDialog"
                  size="mini"
                  :disabled="checkDisable(moveGroupRuleForm)">确定
                </el-button>
              </div>
            </el-dialog>
            <!-- 病例入库-查找病例 -->
            <el-dialog title="病例入库" :visible.sync="caseStorageDialogVisible" :append-to-body="true"
                       @close="closeCaseStorageDialog" class="caseStorageDialog">
              <el-form :model="caseStorageRuleForm" label-width="140px" @submit.native.prevent :rules="caseStorageRules"
                       ref="caseStorageRuleForm">
                <el-form-item label="姓名（必填）：" prop="patientName">
                  <el-input v-model.trim="caseStorageRuleForm.patientName" size="mini" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证（必填）：" prop="identify">
                  <el-input v-model.trim="caseStorageRuleForm.identify" size="mini" placeholder="请输入身份证"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="gender">
                  <el-select v-model.trim="caseStorageRuleForm.gender" clearable size="mini" placeholder="请选择">
                    <el-option v-for="item in genderList" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出生日期：" prop="birthday">
                  <el-date-picker
                    v-model="caseStorageRuleForm.birthday"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="卡号：" prop="cardNo">
                  <el-input v-model.trim="caseStorageRuleForm.cardNo" size="mini" placeholder="请输入卡号"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remarks">
                  <el-input v-model.trim="caseStorageRuleForm.remarks" size="mini" placeholder="请输入备注" :maxlength="300"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="el-dialog--center">
                <el-button type="primary" @click="casesFindPatients('caseStorageRuleForm')" size="mini">查找</el-button>
                <el-button @click="clearCaseStorageDialog" size="mini">清空</el-button>
              </div>
            </el-dialog>
            <!--病例入库-查找到的病例列表-->
            <el-dialog title="查找到的病例" :visible.sync="caseListDialogVisible" :append-to-body="true"
                       @close="closeCaseListDialog" class="caseListDialog" fullscreen>
              <el-table :height="routerViewHeight"
                        :data="caseList" style="width: 100%" :empty-text="emptyText" :element-loading-text="elementLoadingText"
                        @selection-change="handleSelectionCaseList" highlight-current-row>
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号" width="80px"></el-table-column>
                <el-table-column prop="patientName" label="姓名" min-width="10%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="age" label="年龄" min-width="10%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="birthday" label="出生日期" min-width="20%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="gender" label="性别" min-width="10%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="identify" label="身份证号" min-width="20%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="20%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="height" label="身高" min-width="10%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="weight" label="体重" min-width="10%" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="tel" label="电话" min-width="10%" show-overflow-tooltip>
                </el-table-column>
              </el-table>
              <div slot="footer" class="el-dialog--center" style="margin-top: 30px;">
                <el-button type="primary" @click="saveCaseListDialog" size="mini" :disabled="selectCaseList.length == 0">入库
                </el-button>
                <el-button @click="closeCaseListDialog" size="mini">取消</el-button>
              </div>
            </el-dialog>
            <el-dialog title="保存筛选条件" :visible.sync="MySaveConditionDialogVisible" :append-to-body="true"
                       @close="closeMySaveConditionDialog" class="MySaveConditionDialog">
              <el-form :model="mySaveConditionRuleForm" label-width="120px" @submit.native.prevent :rules="mySaveConditionRules"
                       ref="mySaveConditionRuleForm">
                <el-form-item label="筛选条件名称：" prop="name">
                  <el-input v-model.trim="mySaveConditionRuleForm.name" size="mini" :maxlength="100" placeholder="请输入新筛选条件名称"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="el-dialog--center">
                <el-button @click="closeMySaveConditionDialog" size="mini">取消</el-button>
                <el-button type="primary" @click="saveCondition('mySaveConditionRuleForm')" size="mini"
                            :disabled="checkDisable(mySaveConditionRuleForm)">确定
                </el-button>
              </div>
            </el-dialog>
            <!-- 添加患者弹窗 -->
            <el-dialog
              :title="patientDialogTitle"
              :visible.sync="patientDialogVisible"
              :append-to-body="true"
              width="780px"
              class="addPatientDialog"
              @close="onClosePatient('patientRuleForm')">
              <el-form :model="patientRuleForm" ref="patientRuleForm" :rules="patientRuleFormRules" label-width="100px" @submit.native.prevent>
                <el-form-item label="姓名：" prop="name">
                  <el-input v-model.trim="patientRuleForm.name" maxlength='8'></el-input>
                </el-form-item>
                <!-- <el-form-item label="病案号：" prop="patientCode">
                  <el-input v-model.trim="patientRuleForm.patientCode"></el-input>
                </el-form-item> -->
                <el-form-item label="性别：">
                  <div style="width:210px;">
                    <el-radio v-model="patientRuleForm.sex" label="1">男</el-radio>
                    <el-radio v-model="patientRuleForm.sex" label="0">女</el-radio>
                  </div>
                </el-form-item>
                <el-form-item label="出生日期：" prop="birthday">
                  <el-date-picker
                    v-model="patientRuleForm.birthday"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号：" prop="tel">
                  <el-input v-model.trim="patientRuleForm.tel" maxlength='11'></el-input>
                </el-form-item>
                <el-form-item label="身份证号：">
                  <el-input v-model.trim="patientRuleForm.IDCard" maxlength='18'></el-input>
                </el-form-item>
                <el-form-item label="地址：" class="address">
                  <el-input v-model.trim="patientRuleForm.address" maxlength='60'></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="onSavePatient('patientRuleForm')" type="primary" size="mini">确 定</el-button>
                <el-button @click="onClosePatient('patientRuleForm')" size="mini">取 消</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <patientInfo v-else @back="hideReportFollowiUp" :dataInfo="reportFollowiUpData" :personalInfo="reportFollowiUpInfo" :reportFillData="reportFillData"></patientInfo>
      </div>
    </div>
</template>

<script type="text/javascript">
  import './patientListModule.css';
  import '../SDResearch/SDResearch.less';
  import '../SDResearch/card_bgColor.less'
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import multipleCheckBoxSelect from 'components/packages/multipleCheckBoxSelect/multipleCheckBoxSelect';
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';
  import dictionary from 'components/utils/dictionary';
  import mixins from 'components/mixins';
  import utils from 'components/utils/index';
  import validation from 'components/utils/validation';
  import patientInfo from "./patientInfo/index";
  export default {
    name:'patinetListModule',
    mixins: [mixins],
    data () {
      return {
        loading: false,
        pageNo: '',
        pageSize: '',
        emptyText: '',
        elementLoadingText: '',
        conditionSet: {
          viewName: '',
          column: '',
          operator: '',
          param: '',
          param2: ''
        },
        showPatientInfo: false,  //报告随访组件
        reportFollowiUpData: {},  //报告随访组件数据
        reportFollowiUpInfo: {},  //报告随访组件个人信息
        reportFillData:{},   //报告随访参数
        conditionList: [],
        params_conditionList: [], // 过度的筛选条件列表，只有点击了search才会把筛选条件赋值给它
        mySaveConditionViewList: [], // 历史保存过的筛选
        currentSelectMySaveCondition: {}, // 当前我选择的常用筛选条件；
        currentSelectMySaveConditionId: '', // 当前我选择的筛选条件的Id
        MySaveConditionDialogVisible: false,
        mySaveConditionRuleForm: {name: ''},
        mySaveConditionRules: {
          name: [{required: true, validator: this.validateConditionName, trigger: 'blur'}]
        },
        currentColumnsdataType: '', // 当前选择列的dataType
        viewName: 'BASIC_INFO', // tab页当前的视图的名称，如果是基线信息视图，则传空字符串；
        view: '', // tab页当前视图对象
        viewsList: [], // 所有视图列表
        currentSelectViewsNameList: ['BASIC_INFO'], // 当前勾选的视图的id列表
        currentSelectViewsList: [], // 当前勾选的视图列表
        conditionOperatorList: [],
        conditionViewList: [], // 当前的视图拥有的列
        conditionViewTemp: [], // 创建人和修改人两个列
        currentDiseaseId: '',
        fuzzyQuery: '',
        fuzzyQueryStatus: false,
        selectRow: [],
        enterGroupDialogVisible: false,
        enterGroupRuleForm: {
          subject: '',
          labGroup: ''
        },
        diseaseDetail: {},
        subjectDataList: [],
        labGroupDatalist: [],
        moveGroupDialogVisible: false,
        moveGroupRuleForm: {
          subject: '',
          labGroup: ''
        },
        selectLabSubjectGroupName: '', // 选中课题+实验组名称(默认值为 全部病例)
        selectLabGroupId: '', // 选中实验组ID
        selectLabGroupFormId: '', // 选中实验组关联的crf表单ID
        selectLabGroupName: '', // 选中实验组名字
        selectLabSubjectId: '', // 选中的课题ID
        dropmenuHide: false,
        genderList: [],
        caseStorageRuleForm: {
          patientName: '',
          identify: '',
          gender: '',
          birthday: '',
          cardNo: '',
          remarks: ''
        },
        caseStorageRules: {
          patientName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          identify: [
            {required: true, message: '身份证不能为空', trigger: 'blur'}
          ]
        },
        caseStorageDialogVisible: false,
        caseList: [],
        caseListDialogVisible: false,
        selectCaseList: [],
        patientDialogVisible: false,
        patientDialogTitle: '',
        patientRuleForm: {
          name:'',
          patientCode:'',
          sex:'0',
          birthday:'',
          IDCard:'',
          tel:'',
          address:'',
        },
        patientRuleFormRules : {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          patientCode: [
            {required: true, message: '病案号不能为空', trigger: 'blur'}
          ],
          birthday: [
            {required: true, message: '出生日期不能为空', trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
        }
      };
    },
    components: {
      pagination,
      echartsContain,
      multipleCheckBoxSelect,
      patientInfo
    },
    watch: {
      selectLabGroupId (val) {
        if (val) {
          this.conditionViewList = this.conditionViewList.filter(item => {
            return item.name !== 'creator' && item.name !== 'updator' && item.name !== 'fill';
          });
          this.conditionViewList = this.conditionViewList.concat(this.conditionViewTemp);
        } else {
          this.conditionViewList = this.conditionViewList.filter(item => {
            return item.name !== 'creator' && item.name !== 'updator' && item.name !== 'fill';
          });
        }
      },
      'conditionSet.column' () {
        this.getCurrentColumnsdataType();
        this.conditionSet.operator = '';
        this.conditionSet.param = '';
        this.conditionSet.param2 = '';
      },
      async viewName (val) {
        // 给上一个当前视图添加选择行
        this.$set(this.view, 'selectRow', utils.deepClone(this.selectRow));
        // 处理当前的视图
        this.selectRow = [];
        this.conditionSet.viewName = val;
        this.viewsList.forEach(item => {
          if (item.name === val) {
            this.view = item;
            this.loading = true;
            this.view.dataList = {content: []};
            this.conditionViewList = item.subOptions;
            // 拉取当前视图下的对应页数的列表
            this.getDataList(this.view.pagination.page, this.view.pagination.size);
          }
        });
        this.conditionSet.column = '';
        this.conditionSet.operator = '';
        this.conditionSet.param = '';
        this.conditionSet.param2 = '';
        // 当前列的处理
        if (this.selectLabGroupId) {
          this.conditionViewList = this.conditionViewList.filter(item => {
            return item.name !== 'creator' && item.name !== 'updator' && item.name !== 'fill';
          });
          this.conditionViewList = this.conditionViewList.concat(this.conditionViewTemp);
        } else {
          this.conditionViewList = this.conditionViewList.filter(item => {
            return item.name !== 'creator' && item.name !== 'updator' && item.name !== 'fill';
          });
        }
      }
    },
    computed: {},
    created () {
      this.initPage();
    },
    mounted () {
    },
    methods: {
      async initPage () {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.currentDiseaseId = this.$route.query.id;
        this.genderList = dictionary.options('GENDER');
        this.getMySaveCondition();
        await this.getFindViews();
        // 初始化的时候勾选的视图应该是基线病例
        this.currentSelectViewsList = this.viewsList.filter(item => {
          return item.name === 'BASIC_INFO';
        });
        // 初始化的时候列应该是基线病例的列
        this.conditionViewList = this.currentSelectViewsList[0].subOptions;
        this.viewName = 'BASIC_INFO';
        this.view = this.currentSelectViewsList[0];
        this.conditionSet.viewName = this.viewName;
        this.getOperators();
        this.getDiseaseDetail();
        this.getSubjectDataList();
        this.getDataList()
        .then(()=>{
          this.$emit('changeLoadding',false);
        })
      },
      async getFindViews () {
        let that = this;
        try {
          let data = await that.$http.casesFindViews();
          if (data && data.code == '0') {
            that.viewsList = data.data;
            // 处理基线信息视图下列的创建人、修改人、填写人的显示问题
            // 增加视图上dataList的key
            that.viewsList.forEach(view => {
              if (view.name === 'BASIC_INFO') {
                that.conditionViewTemp = view.subOptions.filter(item => {
                  return item.name === 'creator' || item.name === 'updator' || item.name === 'fill';
                });
              }
              view.subOptions = view.subOptions.filter(item => {
                return item.name !== 'creator' && item.name !== 'updator' && item.name !== 'fill';
              });
              that.$set(view, 'dataList', {content: []});
              that.$set(view, 'pagination', {page: that.pageNo, size: that.pageSize});
            });
          }
        } catch (error) {
          that.$notice('获取视图列表失败');
          console.log(error);
        }
      },
      viewChangeHandle (value) {
        // console.log(value);
        this.currentSelectViewsNameList = value;
        this.currentSelectViewsList = [];
        this.viewsList.forEach(item1 => {
          value.forEach(item2 => {
            if (item1.name === item2) {
              this.currentSelectViewsList.push(item1);
            }
          });
        });
      },
      changeViewName (tab, event) {
        // console.log(tab, event);
        this.viewName = tab.name;
      },
      removeViewName (name) {
        // console.log(name);
        if (name === 'BASIC_INFO') return false;
        this.currentSelectViewsList.forEach((item, index) => {
          if (item.name === name) {
            this.viewName = this.currentSelectViewsNameList[index - 1];
          }
        });
        this.currentSelectViewsList = this.currentSelectViewsList.filter((item, index) => {
          return item.name !== name;
        });
        this.currentSelectViewsNameList = [];
        this.currentSelectViewsList.forEach(item => {
          this.currentSelectViewsNameList.push(item.name);
        });
        this.$refs.multipleCheckBoxSelect.checkList = this.currentSelectViewsNameList;
      },
      async getOperators () {
        let that = this;
        try {
          let data = await that.$http.casesFindOperators();
          if (data && data.code == '0') {
            that.conditionOperatorList = data.data;
          }
        } catch (error) {
          that.$notice('获取运算符失败');
          console.log(error);
        }
      },
      async getDiseaseDetail () {
        let that = this;
        try {
          let data = await that.$http.findDiseaseSpeciesDetail(
            that.removeNullKey({
              diseaseId: that.currentDiseaseId
            })
          );
          if (data && data.code == '0') {
            that.diseaseDetail = data.data.diseaseSpecies;
            that.selectLabSubjectGroupName = that.diseaseDetail.name + '-全部病例';
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
              diseaseId: that.currentDiseaseId
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
      search () {
        this.params_conditionList = utils.deepClone(this.conditionList);
        this.fuzzyQueryStatus = false;// 将模糊搜索的状态取消
        this.getDataList();
      },
      async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        // 存储当前视图的页码page及每页多少条size
        if (this.view) {
          this.view.pagination = {
            page: pageNo,
            size: pageSize
          };
        }
        that.loading = true;
        if (that.fuzzyQueryStatus) { // 模糊搜索状态
          that.fuzzyQueryGetDataList(pageNo, pageSize);
        } else {
          // 保存的筛选条件被使用后，可能勾选的视图少于这个筛选条件的视图，所以要打开新的视图，
          that.addViewTabAndSelect();
          let isFillFlag = false;
          that.conditionList.forEach(item => {
            if (item.column === 'fill' && that.selectLabGroupId == '') {
              that.$notice('筛选条件中添加了状态是否填写，请先选择实验组，再进行查询');
              isFillFlag = true;
              return false;
            }
          });
          if (isFillFlag) {
            that.loading = false;
            return false;
          }
          let formData = {
            criterias: that.params_conditionList,
            diseaseId: that.currentDiseaseId,
            experimentId: that.selectLabGroupId,
            subjectId: that.selectLabSubjectId,
            // viewName: that.currentSelectViewsNameList,
            viewName: [that.viewName],
            page: pageNo - 1,
            size: pageSize
          };
          try {
            let data = await that.$http.casesFindCases(that.$format(formData));
            that.loading = false;
            if (data && data.code == '0') {
              let result = data.data;
              result.forEach(item => {
                let obj = {};
                obj.content = item.list;
                obj.content.forEach((item, index) => {
                  item.index = (pageNo - 1) * pageSize + index + 1;
                });
                obj.pageNo = pageNo;
                obj.pageSize = pageSize;
                obj.totalCount = parseInt(item.total);
                obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
                that.viewsList.forEach(item2 => {
                  if (item2.name === item.viewName) {
                    item2.dataList = obj;
                    // console.log(item2.dataList);
                    that.$nextTick(() => {
                      // console.warn(that.view.selectRow);
                      // 通过undersc的isEqual判断两各行相等，然后勾选上
                      that.view.selectRow && that.view.selectRow.forEach(row => {
                        item.list.forEach(itemRow => {
                          if (that.underscore.isEqual(itemRow, row)) {
                            this.$refs[this.view.name][0].toggleRowSelection(itemRow, true);
                          }
                        });
                      });
                    });
                    setTimeout(() => {
                      // console.log(that.$refs[that.viewName][0])
                      that.$refs[that.viewName][0].doLayout();
                    }, 500);
                  }
                });
              });
            }
          } catch (error) {
            that.loading = false;
            that.$notice('获取病例列表失败');
            console.log(error);
          }
        }
      },
      handleSelectionChange (val) {
        // console.log('val:', val);
        this.selectRow = val;
      },
      changeOperator (val) {
        if (val == 'Null' || val == 'NotNull') {
          this.conditionSet.param = '';
          this.conditionSet.param2 = '';
        }
      },
      conditionAdd () {
        if (this.conditionSet.operator != 'Null' && this.conditionSet.operator != 'NotNull') {
          for (let key in this.conditionSet) {
            if (!this.conditionSet[key] && key != 'param2') {
              this.$notice('请输入完整的筛选条件');
              return false;
            }
          }
        }
        // console.log(this.conditionList);
        // console.log(this.conditionSet);
        let isHased = this.conditionList.findIndex(ele => {
          return (
            ele.viewName === this.viewName &&
            ele.column === this.conditionSet.column &&
            ele.operator === this.conditionSet.operator &&
            ele.param === this.conditionSet.param &&
            (ele.param2 ? ele.param2 : '') === this.conditionSet.param2
          );
        });
        if (isHased !== -1) {
          this.$notice('此筛选条件已经存在');
          return false;
        }
        this.conditionList.push({
          viewName: this.viewName,
          viewLabel: this.viewsList[this.viewsList.findIndex(view => {
            return (
              view.name === this.viewName
            );
          })].label,
          column: this.conditionSet.column,
          columnName: this.conditionViewList[this.conditionViewList.findIndex(ele => {
            return (
              ele.name === this.conditionSet.column
            );
          })].label,
          operator: this.conditionSet.operator,
          operatorName: this.conditionOperatorList[this.conditionOperatorList.findIndex(ele => {
            return (
              ele.name === this.conditionSet.operator
            );
          })].label,
          param: this.conditionSet.param,
          param2: this.conditionSet.param2
        });
      },
      conditionDelete (condition, index) {
        // console.log(condition);
        //  console.log(index);
        this.conditionList.splice(index, 1);
      },
      handleCommand (command) {
        let that = this;
        if (that.selectRow && that.selectRow.length == 1 && command == 'crfFill') {
          /*that.$router.push({
            name: 'reportFill',
            query: {
              cacheData: false,
              formId: that.selectLabGroupFormId,
              groupId: that.selectLabGroupId,
              subjectId: that.selectLabSubjectId,
              diseaseId: that.currentDiseaseId,
              patientName: that.selectRow[0].PATIENT_NAME || '',
              patientId: that.selectRow[0].PATIENT_ID || '',
              identify: that.selectRow[0].IDENTIFY || ''
            }
          });*/
          let formData = "cacheData="+false+"&formId="+that.selectLabGroupFormId+"&groupId="+that.selectLabGroupId+"&subjectId="+that.currentDiseaseId+"&diseaseId="+that.currentDiseaseId+"&patientName="+escape(that.selectRow[0].PATIENT_NAME) || ''+"&patientId="+that.selectRow[0].PATIENT_ID || ''+"&identify="+that.selectRow[0].IDENTIFY || ''
          window.open('./patientForm.html?'+formData)
        } else if (that.selectRow && that.selectRow.length != 1 && command == 'crfFill') {
          this.$notice('请勾选一行进行CRF表单填写');
        } else if (that.selectRow && that.selectRow.length === 1 && command == 'enterGroupManager') {
          /*that.$router.push({
            name: 'enterGroupManager',
            query: {
              cacheData: false,
              patientName: that.selectRow[0].PATIENT_NAME || '',
              patientId: that.selectRow[0].PATIENT_ID || '',
              identify: that.selectRow[0].IDENTIFY || ''
            }
          });*/
          that.$router.push({
            path:"/patientListModule/enterGroupManager",
            query: {
              cacheData: false,
              patientName: that.selectRow[0].PATIENT_NAME || '',
              patientId: that.selectRow[0].PATIENT_ID || '',
              identify: that.selectRow[0].IDENTIFY || ''
            }
          })
        } else if (that.selectRow.length !== 0 || command == 'caseStorage' || command == 'exportAll') {
          switch (command) {
            case 'enterGroup':
              that.openEnterGroupDialog();
              break;
            case 'outGroup':
              that.$confirm('已选择 ' + this.selectRow.length + ' 行数据，确定要将此 ' + that.selectRow.length + ' 行数据退出 ' + that.selectLabGroupName + ' 吗？', '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .then(async () => {
                  try {
                    let formData = {
                      experimentId: that.selectLabGroupId,
                      patientIds: that.selectRow.map((item) => {
                        return item.PATIENT_ID;
                      })
                    };
                    let data = await this.$http.casesOutGroup(formData);
                    if (data && data.code == '0') {
                      that.getDataList(that.view.pagination.page, that.view.pagination.size);
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
              break;
            case 'moveGroup':
              this.openMoveGroupDialog();
              break;
            case 'caseStorage':
              this.openCaseStorageDialog();
              break;
            case 'export':
              if (!that.selectLabSubjectId && !that.selectLabGroupId) { // 全部病例情况下
                this.$confirm('确定要将这' + this.selectRow.length + '条病例记录导出吗？', '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                  .then(async () => {
                    try {
                      let formData = {
                        patientId: that.selectRow.map((item) => {
                          return item.PATIENT_ID;
                        }),
                        viewName: that.viewName
                      };
                      let data = await this.$http.casesExportCases(formData);
                      let blob = new Blob([data.data], {type: 'application/ms-excel;charset=UTF-8'});
                      let fileNmae = data.headers['content-disposition'].split('filename=')[1];
                      that.$download(fileNmae, blob);
                      this.$notice('导出成功');
                    } catch (error) {
                      that.$notice('导出失败');
                      console.log(error);
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              } else { // 选择了实验组的情况下
                this.$confirm('确定要将这' + this.selectRow.length + '条病例的CRF表单导出吗？', '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                  .then(async () => {
                    try {
                      let formData = {
                        groupId: that.selectLabGroupId,
                        patientIds: that.selectRow.map((item) => {
                          return item.PATIENT_ID;
                        })
                      };
                      let data = await this.$http.crfdataExpCrfData(formData);
                      let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                      let fileNmae = data.headers['content-disposition'].split('filename=')[1];
                      that.$download(fileNmae, blob);
                      this.$notice('导出成功');
                    } catch (error) {
                      that.$notice('导出失败');
                      console.log(error);
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
              break;
            case 'exportAll':
              this.$confirm('确定要将该实验组下所有病例的CRF表单导出吗？', '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .then(async () => {
                  try {
                    let formData = {
                      groupId: that.selectLabGroupId
                    };
                    let data = await this.$http.crfdataExpCrfData(formData);
                    let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                    let fileNmae = data.headers['content-disposition'].split('filename=')[1];
                    that.$download(fileNmae, blob);
                    this.$notice('导出成功');
                  } catch (error) {
                    that.$notice('导出失败');
                    console.log(error);
                  }
                })
                .catch(error => {
                  console.log(error);
                });
              break;
            case 'edit':
              that.searchPatientInfo(that.selectRow[0])
                .then((res)=>{
                  if(res.sysExport == 0) {
                    this.$notice('导入数据不可编辑');
                  }else {
                    that.showaddPatientDialog('编辑患者', Object.assign({},that.selectRow[0], {phoneNumber:res.phoneNumber,address:res.address}));
                  }
                })
              break;
            case 'delete':
              this.$confirm('确定要将这' + that.selectRow.length + '条病例记录删除吗？', '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .then( () => {
                  this.casesDeletePatient(that.selectRow[0]);
                })
                .catch(error => {
                  console.log(error);
                });
              break;
            default:
              console.warn('操作类型失去匹配');
              break;
          }
        } else {
          this.$notice('请至少勾选一行');
        }
      },
      openEnterGroupDialog () {
        this.enterGroupDialogVisible = true;
      },
      closeEnterGroupDialog () {
        this.enterGroupDialogVisible = false;
        for (let key in this.enterGroupRuleForm) {
          this.enterGroupRuleForm[key] = '';
        }
      },
      async saveEnterGroupDialog () {
        let that = this;
        let selectGroupName = that.labGroupDatalist[that.labGroupDatalist.findIndex(ele => {
          return (
            ele.id === this.enterGroupRuleForm.labGroup
          );
        })].name;
        that.$confirm('已选择 ' + this.selectRow.length + ' 行数据，确定要将其入组到 ' + selectGroupName + ' 吗？', '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(async () => {
            let formData = {
              experimentId: this.enterGroupRuleForm.labGroup,
              subjectId: this.enterGroupRuleForm.subject,
              patientIds: that.selectRow.map((item) => {
                return item.PATIENT_ID;
              })
            };
            try {
              let data = await that.$http.casesEnterGroup(formData);
              if (data && data.code == '0') {
                that.closeEnterGroupDialog();
                that.getDataList(that.view.pagination.page, that.view.pagination.size);
                that.$notice(data.msg);
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
      subjectChange (val) {
        this.enterGroupRuleForm.labGroup = '';
        this.subjectDataList.map(subject => {
          if (subject.id === val) {
            this.labGroupDatalist = subject.experimentGroups;
          }
        });
      },
      // 通过检查表单是否完成，已决定按钮是否可用
      checkDisable (form) {
        let flag = true;
        for (let key in form) {
          if (form[key] === '') {
            flag = false;
          }
        }
        return !flag;
      },
      openMoveGroupDialog () {
        this.moveGroupDialogVisible = true;
      },
      closeMoveGroupDialog () {
        this.moveGroupDialogVisible = false;
        for (let key in this.moveGroupRuleForm) {
          this.moveGroupRuleForm[key] = '';
        }
      },
      async saveMoveGroupDialog () {
        let that = this;
        let formData = {
          subjectId: that.moveGroupRuleForm.subject,
          experimentId: that.moveGroupRuleForm.labGroup,
          oldGroupId: that.selectLabGroupId,
          patientIds: that.selectRow.map((item) => {
            return item.PATIENT_ID;
          })
        };

        try {
          let data = await that.$http.casesMoveGroup(formData);
          if (data && data.code == '0') {
            that.closeMoveGroupDialog();
            that.getDataList(that.view.pagination.page, that.view.pagination.size);
            that.$notice(data.msg);
          }
        } catch (error) {
          that.$notice('迁组操作失败');
          console.log(error);
        }
      },
      openCaseStorageDialog () {
        if (this.$refs.caseStorageRuleForm) {
          this.$refs.caseStorageRuleForm.clearValidate();
        }
        this.caseStorageDialogVisible = true;
      },
      closeCaseStorageDialog () {
        this.$refs.caseStorageRuleForm.clearValidate();
        this.caseStorageDialogVisible = false;
        this.clearCaseStorageDialog();
      },
      clearCaseStorageDialog () {
        for (let key in this.caseStorageRuleForm) {
          this.caseStorageRuleForm[key] = '';
        }
      },
      openCaseListDialog () {
        this.caseListDialogVisible = true;
      },
      closeCaseListDialog () {
        // this.closeCaseStorageDialog();
        this.caseListDialogVisible = false;
        this.selectCaseList = [];
      },
      handleSelectionCaseList (val) {
        this.selectCaseList = val;
      },
      async casesFindPatients (caseStorageRuleForm) {
        let that = this;
        that.$refs.caseStorageRuleForm.validate(async (valid) => {
          if (!valid) {
            return false;
          }
          let formData = {
            patientName: that.caseStorageRuleForm.patientName,
            identify: that.caseStorageRuleForm.identify,
            gender: that.caseStorageRuleForm.gender,
            birthday: utils.formateDate(that.caseStorageRuleForm.birthday),
            cardNo: that.caseStorageRuleForm.cardNo,
            remarks: that.caseStorageRuleForm.remarks
          };
          try {
            let data = await that.$http.casesFindPatients(that.$format(formData));
            if (data && data.code == '0') {
              that.caseList = data.data;
              that.openCaseListDialog();
            }
          } catch (error) {
            that.$notice('病例查找失败');
            console.log(error);
          }
        });
      },
      async saveCaseListDialog () {
        let that = this;
        let formData = {
          diseaseId: that.currentDiseaseId,
          patientIds: that.selectCaseList.map((item) => {
            return item.patientId;
          })
        };
        try {
          let data = await that.$http.casesSavePatients(that.$format(formData));
          if (data && data.code == '0') {
            that.closeCaseListDialog();
            that.$notice(data.msg);
            if (!that.selectLabSubjectId && !that.selectLabGroupId) {
              that.getDataList();
            }
          }
        } catch (error) {
          that.$notice('病例入库失败');
          console.log(error);
        }
      },
      labGroupSelect (labGroup, subject) {
        this.dropmenuHide = true;
        this.selectLabSubjectId = labGroup.subjectId ? labGroup.subjectId : '';
        this.selectLabGroupFormId = labGroup.formId;
        this.selectLabSubjectGroupName = (subject ? subject.name + ' / ' : '') + labGroup.name;
        this.selectLabGroupId = labGroup.id;
        this.selectLabGroupName = labGroup.name;
        // 触发查询当前病例
        this.conditionSet = {
          viewName: this.viewName,
          column: '',
          operator: '',
          param: '',
          param2: ''
        };
        // this.conditionList = [];
        this.selectRow = [];
        this.getDataList();
      },
      async fuzzyQueryHandle () {
        this.fuzzyQueryStatus = true;// 开启模糊搜索状态
        this.fuzzyQueryGetDataList();
      },
      async fuzzyQueryGetDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        let formData = {
          diseaseId: that.currentDiseaseId,
          experimentId: that.selectLabGroupId,
          subjectId: that.selectLabSubjectId,
          param: that.fuzzyQuery,
          // viewName: that.currentSelectViewsNameList,
          viewName: [that.viewName],
          page: pageNo - 1,
          size: pageSize
        };
        try {
          let data = await that.$http.casesAsynFindCases(that.$format(formData));
          that.loading = false;
          if (data && data.code == '0') {
            let result = data.data;
            result.forEach(item => {
              let obj = {};
              obj.content = item.list;
              obj.content.forEach((item, index) => {
                item.index = (pageNo - 1) * pageSize + index + 1;
              });
              obj.pageNo = pageNo;
              obj.pageSize = pageSize;
              obj.totalCount = parseInt(item.total);
              obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
              that.viewsList.forEach(item2 => {
                if (item2.name === item.viewName) {
                  item2.dataList = obj;
                }
              });
            });
          }
        } catch (error) {
          that.loading = false;
          that.$notice('获取病例列表失败');
          console.log(error);
        }
      },
      //销毁报告组件
      hideReportFollowiUp(){
        this.showPatientInfo = false;
      },
      dblclickHandle (row, event) {
        let subjectName = this.subjectDataList.map( item =>{
          if(item.id== this.selectLabSubjectId) {
            return item.name;
          }
        })
        console.log(row)
        let that = this;
        that.reportFollowiUpData = {
          patientId: row.PATIENT_ID || '',
          orgCode: row.orgCode || '',
          diseaseId: that.currentDiseaseId,
          subjectId: that.selectLabSubjectId,
          groupId: that.selectLabGroupId,
          diseaseName: this.diseaseDetail.name,
          subjectName: subjectName.join(),
          groupName: this.selectLabGroupName,

        }
        that.reportFollowiUpInfo = row;
        sessionStorage.setItem('caseManage',JSON.stringify(this.$route.query));
        that.reportFillData = {
          cacheData: false,
          formId: that.selectLabGroupFormId,
          groupId: that.selectLabGroupId,
          subjectId: that.selectLabSubjectId,
          diseaseId: that.currentDiseaseId,
          patientName: row.PATIENT_NAME || '',
          patientId: row.PATIENT_ID || '',
          identify: row.IDENTIFY || '',
          from: that.$route.name,
          isModify:"displayShow"
        }
        that.showPatientInfo = true;
        return;
        if (that.selectLabGroupId) {
          sessionStorage.setItem('reportFill',JSON.stringify({urlParameter:this.reportFillData}));
          window.open('./patientForm.html');
        }
      },
      getCurrentColumnsdataType () {
        this.conditionViewList.forEach(item => {
          if (item.name === this.conditionSet.column) {
            this.currentColumnsdataType = item.dataType;
          }
        });
      },
      changeCurrentSelectMySaveCondition (val) {
        // console.log(val);
        this.currentSelectMySaveCondition = this.mySaveConditionViewList.filter(item => {
          return item.id === val;
        })[0];
        // console.log(this.currentSelectMySaveCondition.criterias);
        // console.log(this.currentSelectViewsList);
        this.conditionList = utils.deepClone(this.currentSelectMySaveCondition.criterias);
      },
      addViewTabAndSelect () {
        // 保存的筛选条件被使用后，可能勾选的视图少于这个筛选条件的视图，所以要打开新的视图，
        this.conditionList.forEach(item => {
          let result = this.currentSelectViewsList.findIndex(ele => {
            return (
              ele.name === item.viewName
            );
          });
          if (result === -1) {
            this.viewsList.forEach(view => {
              if (view.name === item.viewName) {
                // 给表格加视图tab页
                this.currentSelectViewsList.push(view);
                // 给下拉多选矿加勾选
                this.$refs.multipleCheckBoxSelect.checkList.push(item.viewName);
              }
            });
          }
        });
      },
      async getMySaveCondition () {
        let that = this;
        try {
          let data = await that.$http.casesFindCondition();
          if (data && data.code == '0') {
            that.mySaveConditionViewList = data.data;
          }
        } catch (error) {
          that.$notice('获取筛选条件列表失败');
          console.log(error);
        }
      },
      openSaveConditionDialog () {
        if (this.conditionList.length === 0) {
          this.$notice('请添加筛查条件再进行保存');
          return false;
        }
        this.MySaveConditionDialogVisible = true;
        if (this.$refs.mySaveConditionRuleForm) {
          this.$refs.mySaveConditionRuleForm.clearValidate();
        }
      },
      closeMySaveConditionDialog () {
        this.MySaveConditionDialogVisible = false;
        this.mySaveConditionRuleForm = {name: ''};
        this.$refs.mySaveConditionRuleForm.clearValidate();
      },
      async saveCondition (mySaveConditionRuleForm) {
        let that = this;
        that.$refs.mySaveConditionRuleForm.validate(async (valid) => {
          if (!valid) return false;
          try {
            let formData = {
              name: that.mySaveConditionRuleForm.name.trim(),
              criterias: that.conditionList
            };
            let data = await that.$http.casesSaveCondition(formData);
            if (data && data.code == '0') {
              that.getMySaveCondition();
              that.closeMySaveConditionDialog();
              that.$notice(data.msg);
            }
          } catch (error) {
            that.$notice('保存筛选条件失败');
            console.log(error);
          }
        });
      },
      deleteMySaveCondition (item) {
        console.log(item);
        let that = this;
        this.$confirm('是否要删除' + item.name + '此筛选条件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            let data = await that.$http.casesDeleteCondition({id: item.id});
            if (data && data.code == '0') {
              that.getMySaveCondition();
              this.currentSelectMySaveConditionId = '';
              that.$notice(data.msg);
            }
          } catch (error) {
            that.$notice('删除筛选条件失败');
            console.log(error);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      async validateConditionName (rule, value, callback) {
        let that = this;
        if (validation.checkNull(value)) {
          callback(new Error('筛选条件名称不能为空'));
          return false;
        }
        let data = await that.$http.casesExistConditionName({name: value});
        if (data.code == 0 && data.data) {
          callback(new Error('筛选条件名称已经存在'));
          return false;
        }
        callback();
      },
      reset () {
        Object.assign(this.$data, this.$options.data());
        this.$data.mySaveConditionRules = {
          name: [{required: true, validator: this.validateConditionName, trigger: 'blur'}]
        };
        this.$refs.multipleCheckBoxSelect.checkList = ['BASIC_INFO'];
        this.initPage();
      },
      //显示添加患者弹框
      showaddPatientDialog(title, data) {
        this.patientDialogTitle = title;
        this.patientDialogVisible = true;
        if(data) {
          this.patientRuleForm = {
            name: data.PATIENT_NAME,
            patientCode: data.PATIENT_ID,
            sex: data.GENDER_NAME=='男'?'1':'0',
            birthday: data.BIRTHDATE,
            IDCard: data.IDENTIFY,
            tel: data.phoneNumber,
            address: data.address,
          }
        }else {
          this.patientRuleForm = {
            name:'',
            patientCode:'',
            sex:'1',
            birthday:'',
            IDCard:'',
            tel:'',
            address:'',
          }
        }
      },
      //关闭患者弹框
      onClosePatient(patientRuleForm) {
        this.patientDialogVisible = false;
        this.$refs[patientRuleForm].resetFields();
      },
      //保存患者信息按钮
      onSavePatient(dialogFrom) {
        this.$refs[dialogFrom].validate(async (valid) => {
          if (valid) {
            let subjectName = this.subjectDataList.map( item =>{
              if(item.id== this.selectLabSubjectId) {
                return item.name;
              }
            })
            let res,
              formData = {
                patientName: this.patientRuleForm.name,
                birthdate: this.patientRuleForm.birthday,
                phoneNumber: this.patientRuleForm.tel,
                genderCode: this.patientRuleForm.sex,
                idCardNo: this.patientRuleForm.IDCard,
                address: this.patientRuleForm.address,
                groupId: this.selectLabGroupId,
                patientId: this.patientRuleForm.patientCode || "",
                diseaseId: this.currentDiseaseId,
                subjectId: this.selectLabSubjectId,
                diseaseName: this.diseaseDetail.name || '',
                subjectName: subjectName.join() || '',
                groupName: this.selectLabGroupName || '',
              }

            if(this.patientDialogTitle == '添加患者') {
              res = await this.$http.casesAddPatient(formData);
            }else {
              res = await this.$http.casesEditPatient(formData);
            }
            try {
              if (res.code == 0) {
                this.$mes('success', this.patientDialogTitle+"成功!");
                this.patientDialogVisible = false;
                this.getDataList();
              }else {
                this.$mes('error', this.patientDialogTitle+"失败!");
              }
            } catch (err) {
              console.log(err)
            }
          } else {
            return false;
          }
        });
      },
      //删除患者
      async casesDeletePatient (row) {
        let formData = {
          patientId: row.PATIENT_ID
        }
        let res = await this.$http.casesDeletePatient(formData);
        if (res.code == 0) {
          this.$mes('success', "删除患者成功!");
          this.getDataList();
        }else {
          this.$mes('error', res.msg);
        }
      },
      //查询患者信息
      async searchPatientInfo (row) {
        let formData = {
          patientId: row.PATIENT_ID
        }
        let res = await this.$http.casesSearchPatient(formData);
        return new Promise((resolve, reject)=>{
          if (res.code == 0) {
            resolve(res.data);
          }else {
            reject();
            this.$mes('error', "查询患者信息失败!");
          }
        })

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

<style lang="less" scoped>
.patient_list_module{
  display: flex;
  height: 100%;
  flex: 1;
  padding: 30px 30px 0 30px;
  box-sizing: border-box;
  overflow: hidden;
  .list_module_content{
    width: 100%;
    box-sizing: border-box;
  }
}

</style>
<style lang="less">
  body {
    .sd {
      padding: 10px;
      background-color: #999;
    }

    .caseManage .el-form-item__content {
      line-height: 0 !important;
    }
    .caseManage .block-head {
      margin-bottom: 15px;
    }
    .enterGroupDialog .el-form .el-form-item .el-input, .moveGroupDialog .el-form .el-form-item .el-input, .caseStorageDialog .el-form .el-form-item .el-input, .caseStorageDialog .el-form .el-form-item .el-input.el-date-editor--date {
      width: 200px
    }
    .caseManage .caseManageDropdown {
      border-radius: 4px;
      border: 1px solid #d8dce5;
      text-align: center;
      height: 32px;
      line-height: 32px;
    }
    .caseManage .fuzzyQuery {
      /*float: right;*/
      cursor: pointer;
      color: #666666;
    }
    .caseManage .rf {
      float: right;
      /*.el-input{
        .el-input__inner{
          height: 36px;
          border-radius: 1px;
        }
        .el-input__prefix{
          height: 36px;
        }
      }*/
    }
    .caseManage .fuzzyQuery .el-input {
      width: 240px !important;
    }
    .addPatientDialog{
      .el-date-editor .el-input__inner{
        width: 210px;
      }
    }
  }

  body {
    .caseManage .el-dropdown-link {
      cursor: pointer;
      color: #1bbae1;
      display: inline-block;
      padding: 0 20px 0 20px;
    }
    .labGroup-btn {
      color: #1bbae1;
      margin: 2px 15px 2px 0;
      cursor: pointer;
      text-align: left;
    }
  }

  .caseManage .el-tabs__header {
    margin: 0 !important;
  }

  .caseManage .el-button--small, .caseManage .el-button--small.is-round {
    padding: 0px 0px !important;
  }

  .caseManage .conditiaoContain {
    max-height: 160px;
    overflow: auto;
  }

  .caseManage #tab-BASIC_INFO .el-icon-close {
    display: none;
  }

  .caseManage .el-select.multiple-checkBox-select .el-select__tags .el-tag:first-child .el-tag__close.el-icon-close {
    display: none;
  }

  .MySaveConditionDialog .el-dialog {
    width: 450px !important;
  }

  .MySaveConditionDialog .el-dialog .el-input {
    width: 250px !important;
  }
  .caseManage .cloud-search {
    padding-left: 0;
    padding-right: 0;
    padding-top: 10px;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    background-color: #ffffff;
  }
</style>

<style lang="less" scoped>
  .addPatientDialog{
    .el-form-item {
      display: inline-block;
      margin-right: 33px;
      .el-input{
        width: 210px !important;
      }
      .el-radio {
        margin: 0 10px;
      }
    }
    .el-form-item.address {
      display: block;
      .el-input{
        width: 96.5% !important;
      }
    }
  }
</style>
