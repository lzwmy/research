<template>
  <!-- 病例管理 -->
  <div class="cloud-component allCases">
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item label="视图列表：">
          <multipleCheckBoxSelect ref="multipleCheckBoxSelect" @change="viewChangeHandle" placeholderText="选择视图"
                                  :dataList="viewsList"
                                  :isFilterable="true"></multipleCheckBoxSelect>
        </el-form-item>
        <el-form-item label="我的筛选：">
          <el-select v-model.trim="currentSelectMySaveConditionId" clearable filterable placeholder="选择我的筛选"
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
        <el-form-item class="fuzzyQuery">
          <el-input v-model.trim="fuzzyQuery" @change="fuzzyQueryHandle" @keyup.enter.native="fuzzyQueryHandle"
                    placeholder="请输入搜索内容"></el-input>
        </el-form-item>
        <el-form-item class="fuzzyQuery">
          <el-dropdown class="allCasesDropdown" style="margin-right: 6px;" @command="handleCommand" trigger="hover"
                       size="medium">
              <span class="el-dropdown-link">操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="enterGroupManager" v-if="selectRow.length==0 || selectRow.length ==1">入组管理
              </el-dropdown-item>
              <el-dropdown-item command="enterGroup">入库入组</el-dropdown-item>
              <!-- <el-dropdown-item>病人360视图</el-dropdown-item> -->
              <el-dropdown-item command="export">导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <br>
        <el-form-item label="添加条件：" prop>
          <el-select v-model.trim="conditionSet.column" clearable filterable placeholder="选择列名">
            <el-option
              v-for="item in conditionViewList"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop>
          <el-select v-model.trim="conditionSet.operator" clearable filterable placeholder="选择运算符"
                     @change="changeOperator">
            <el-option
              v-for="item in conditionOperatorList"
              :key="item.name"
              :label="item.label"
              :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop>
          <el-date-picker v-if="currentColumnsdataType === 'DATE'  || currentColumnsdataType.indexOf('TIMESTAMP')!=-1"
                          v-model="conditionSet.param"
                          :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :clearable="true"
                          placeholder="选择日期时间">
          </el-date-picker>
          <el-select v-else-if=" conditionSet.column === 'fill'"
                     v-model="conditionSet.param" clearable filterable placeholder="选择是否填写">
            <el-option label="已填写" value="1"></el-option>
            <el-option label="未填写" value="0"></el-option>
          </el-select>
          <el-input v-else v-model.trim="conditionSet.param"
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
          <el-select v-else-if=" conditionSet.column === 'fill'"
                     v-model="conditionSet.param2" clearable filterable placeholder="选择是否填写">
            <el-option label="已填写" value="1"></el-option>
            <el-option label="未填写" value="0"></el-option>
          </el-select>
          <el-input v-else v-model.trim="conditionSet.param2"
                    :disabled="conditionSet.operator =='Null' || conditionSet.operator =='NotNull'"
                    placeholder="填写参数"
                    :maxlength="40"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label prop>
          <el-button type="primary" @click="conditionAdd">添加</el-button>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
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
            v-for="(item, index) in currentSelectViewsList"
            :key="item.name"
            :label="item.label"
            :name="item.name">
            <el-table :ref="item.name" style="width:100%;"
              :height="(item.dataList && item.dataList.length>0)?(routerViewHeight*1-35-38-40):(routerViewHeight*1-38-40)"
              :data="item.dataList.content" @row-dblclick="dblclickHandle"
              v-loading="loading"
              :border="false"
              :empty-text="emptyText"
              :element-loading-text="elementLoadingText"
              stripe
              :default-sort="{prop: 'date', order: 'descending'}"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="病人姓名" width="150px">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="onLinkView360(scope.row)">{{scope.row.PATIENT_NAME}}</el-button>
                 </template>
              </el-table-column>
              <el-table-column 
                :prop="column.name" 
                :label="column.label" 
                sortable 
                v-for="column in conditionViewList"
                :key="column.name" 
                v-if="column.name != 'PATIENT_NAME'"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
           <pagination :data="item.dataList" @change="getDataList"></pagination>
          </el-tab-pane>
        </el-tabs>
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
    <!--保存筛选条件-->
    <el-dialog title="保存筛选条件" :visible.sync="MySaveConditionDialogVisible" :append-to-body="true"
               @close="closeMySaveConditionDialog" class="MySaveConditionDialog">
      <el-form :model="mySaveConditionRuleForm" label-width="120px" @submit.native.prevent :rules="mySaveConditionRules"
               ref="mySaveConditionRuleForm">
        <el-form-item label="筛选条件名称：" prop="name">
          <el-input v-model.trim="mySaveConditionRuleForm.name" placeholder="请输入新筛选条件名称"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="closeMySaveConditionDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveCondition" size="mini"
                     :disabled="checkDisable(mySaveConditionRuleForm)">确定
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import '../SDResearch/SDResearch.css';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import multipleCheckBoxSelect from 'components/packages/multipleCheckBoxSelect/multipleCheckBoxSelect';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import dictionary from 'components/utils/dictionary';
import mixins from 'components/mixins';
import utils from 'components/utils/index';
import validation from 'components/utils/validation';

export default {
  name: 'allCases',
  mixins: [mixins],
  data () {
    return {
      loading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
      conditionSet: {
        viewName: '',
        column: '',
        operator: '',
        param: '',
        param2: ''
      },
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
      viewName: 'BASIC_INFO', // tab页当前的视图，如果是基线信息视图，则传空字符串；
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
        disease: '',
        subject: '',
        labGroup: ''
      },
      diseaseDataList: [],
      subjectDataList: [],
      labGroupDatalist: [],
      moveGroupDialogVisible: false,
      moveGroupRuleForm: {
        subject: '',
        labGroup: ''
      },
      selectLabGroupId: '', // 选中实验组ID
      selectLabGroupFormId: '', // 选中实验组关联的crf表单ID
      selectLabGroupName: '', // 选中实验组名字
      selectLabSubjectId: '', // 选中的课题ID
      dropmenuHide: false,
      genderList: [],
      caseStorageRuleForm: {
        disease: ''
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
    };
  },
  components: {
    pagination,
    echartsContain,
    multipleCheckBoxSelect
  },
  watch: {
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
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.initPage();
  },
  methods: {
    async initPage () {
      this.$emit('handlePageHeight'); // 初始化的时候首先调用调整窗口
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
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
      this.getDiseaseList();
      this.getDataList();
      utils.defineArrayFind();
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
        let formData = {
          criterias: that.params_conditionList,
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
                }
              });
            });
          }
        } catch (error) {
          that.loading = false;
          that.$notice('获取全部病例列表失败');
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
      // console.log(index);
      this.conditionList.splice(index, 1);
    },
    handleCommand (command) {
      let that = this;
      console.log(that.selectRow)
      if (that.selectRow && that.selectRow.length === 1 && command == 'enterGroupManager') {
        that.$router.push({
          name: 'enterGroupManager',
          query: {
            cacheData: false,
            patientName: that.selectRow[0].PATIENT_NAME || '',
            patientId: that.selectRow[0].PATIENT_ID || '',
            identify: that.selectRow[0].IDENTIFY || ''
          }
        });
      } else if (that.selectRow && that.selectRow.length !== 0) {
        switch (command) {
          case 'enterGroup':
            that.openEnterGroupDialog();
            break;
          case 'export':
            this.$confirm('确定要将这' + that.selectRow.length + '条病例记录导出吗？', '提示',
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
                return;
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
    //跳转到306视图页面
    onLinkView360(row) {
      let obj = {
        orgCode: row.orgCode,
        patientId: row.PATIENT_ID
      };
      sessionStorage.setItem('VIEW360_QUERY', JSON.stringify(obj));
      window.open('./view360.html?patientId='+row.PATIENT_ID, '_blank');
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
      that.$confirm('已选择 ' + that.selectRow.length + ' 行数据，确定要将其入组到 ' + selectGroupName + ' 吗？', '提示',
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
            patientIds: that.selectRow.map((item) => {
              return item.PATIENT_ID;
            })
          };
          try {
            let data = await that.$http.casesEnterGroup(formData);
            if (data && data.code == '0') {
              that.closeEnterGroupDialog();
              // that.getDataList(that.view.pagination.page, that.view.pagination.size);
              // that.$notice(data.msg);
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
            patientIds: that.selectRow.map((item) => {
              return item.PATIENT_ID;
            })
          };
          try {
            let data = await that.$http.casesSavePatients(that.$format(formData));
            if (data && data.code == '0') {
              that.closeEnterGroupDialog();
              // that.getDataList(that.view.pagination.page, that.view.pagination.size);
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
    async fuzzyQueryHandle () {
      this.fuzzyQueryStatus = true;// 开启模糊搜索状态
      this.fuzzyQueryGetDataList();
    },
    async fuzzyQueryGetDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      let formData = {
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
    dblclickHandle (row, event) {
      this.selectRow = [row];
      // console.log(this.$refs[this.view.name]);
      this.$refs[this.view.name][0].toggleRowSelection(row, true);
      this.openEnterGroupDialog();
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
    async saveCondition () {
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
      // console.log(item);
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
    .sd {
      padding: 10px;
      background-color: #999;
    }

    .allCases .el-form-item__content {
      line-height: 0 !important;
    }
    .allCases .block-head {
      margin-bottom: 15px;
    }
    .enterGroupDialog .el-form .el-form-item .el-input, .moveGroupDialog .el-form .el-form-item .el-input, .caseStorageDialog .el-form .el-form-item .el-input, .caseStorageDialog .el-form .el-form-item .el-input.el-date-editor--date {
      width: 200px
    }
    .allCases .allCasesDropdown {
      border-radius: 4px;
      border: 1px solid #d8dce5;
      height: 28px;
      line-height: 28px;
      text-align: center;
    }
    .allCases .fuzzyQuery {
      float: right;
    }
    .allCases .fuzzyQuery .el-input {
      width: 240px !important;
    }
    .addPatientDialog{
      .el-dialog__body {
        padding: 30px;
      }
      .el-date-editor .el-input__inner{
        width: 210px;
      }
    } 
  }

  body.theme-green {
    .allCases .el-dropdown-link {
      cursor: pointer;
      color: #1ab497;
      display: inline-block;
      padding: 0 20px 0 20px;
    }
    .labGroup-btn {
      color: #1ab497;
      margin: 2px 18px 2px 0;
      cursor: pointer;
      text-align: left;
    }
  }

  body.theme-blue {
    .allCases .el-dropdown-link {
      cursor: pointer;
      color: #2d8cf0;
      display: inline-block;
      padding: 0 20px 0 20px;
    }
    .labGroup-btn {
      color: #2d8cf0;
      margin: 2px 15px 2px 0;
      cursor: pointer;
      text-align: left;
    }
  }

  .allCases .el-tabs__header {
    margin: 0 !important;
  }

  .allCases .el-button--small, .allCases .el-button--small.is-round {
    padding: 0px 0px !important;
  }

  .allCases .conditiaoContain {
    max-height: 160px;
    overflow: auto;
  }

  .allCases #tab-BASIC_INFO .el-icon-close {
    display: none;
  }

  .allCases .el-select.multiple-checkBox-select .el-select__tags .el-tag:first-child .el-tag__close.el-icon-close {
    display: none;
  }

  .MySaveConditionDialog .el-dialog {
    width: 450px !important;
  }

  .MySaveConditionDialog .el-dialog .el-input {
    width: 250px !important;
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
        width: 100% !important;
      }
    }
  }
</style>

