<template>
  <div class="cloud-component userManage">
    <!-- 搜索区域 -->
    <div class="cloud-search  el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="70px">
        <el-form-item label="账号：">
          <el-input v-model.trim="ruleForm.account" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model.trim="ruleForm.userName" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model.trim="ruleForm.status" placeholder="请选择" size="mini" clearable>
            <el-option v-for="item in userstatus" :key="item.code" :value="item.code"
                       :label="item.desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item class="zfr">
          <el-button type="primary" @click="add">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading" empty-text="暂无数据"
          :element-loading-text="elementLoadingText">
          <el-table-column prop="index" label="序号" min-width="5%"></el-table-column>
          <el-table-column prop="account" label="账号" min-width="8%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userName" label="用户名" min-width="8%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="role" label="角色" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="role,index in scope.row.roleList" :key="role.roleId">{{role.roleName}}<span
                v-if="index != scope.row.roleList.length-1">、</span></span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="用户状态" min-width="5%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">启用</span>
              <span class='zwarning' v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="6%" prop="createTime" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="更新时间" min-width="6%" prop="updateTime" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="220px">
            <template slot-scope="scope"
                      v-if="(scope.row.roleList[0] && scope.row.roleList[0].roleType &&  scope.row.roleList[0].roleType != '0') || scope.row.roleList.length ==0">
              <el-button type="text" size="small" @click="assignRole(scope.row)" style="margin-left: 8px">
                <i class="icon-bangding" title="分配角色"></i>
              </el-button>
              <el-button type="text" size="small" @click="assignGroup(scope.row)" style="margin-left: 8px">
                <i class="icon-fenpeiquanxian" title="分配实验组"></i>
              </el-button>
              <el-button type="text" size="small" @click="userResetPwd(scope.row.id)">
                <i class="icon-chongzhimima" title="重置密码"></i>
              </el-button>
              <el-button type="text" size="small" @click="edit(scope.row)" style="margin-left: 8px">
                <i class="icon-edit" title="编辑"></i>
              </el-button>
              <el-button @click="updateStatus(scope.row)" type="text" size="small">
                <i class="icon-unaccess" title="禁用" v-if="scope.row.status == '0'"></i>
                <i class="icon-openaccess" title="启用" v-if="scope.row.status == '1'"></i>
              </el-button>
              <el-button type="text" size="small" @click="deleteItem(scope.row)">
                <i class="icon-delete" title="删除"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>
    <!--新增/编辑用户弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="400px"
               @close="closeUserDialog" class="userManageDialog">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules" label-width="90px"
               class="el-dialog--center" @submit.native.prevent v-loading="ruleFormDialogLoading">
        <el-form-item label="账号：" prop="account">
          <el-input v-model.trim="ruleFormDialog.account" placeholder="请输入账号" :disabled="userOption=='edit'"
                    size="mini"
                    :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model.trim="ruleFormDialog.userName" placeholder="请输入用户名" :maxlength="20"
                    size="mini"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status" v-if="userOption=='edit'">
          <el-radio v-model="ruleFormDialog.status" label="0" disabled>启用</el-radio>
          <el-radio v-model="ruleFormDialog.status" label="1" disabled>禁用</el-radio>
        </el-form-item>
        <el-form-item label="身份证号：" prop="idNumber">
          <el-input v-model.trim="ruleFormDialog.idNumber" placeholder="请输入身份证号" :maxlength="20"
                    size="mini"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="电话号码：" prop="tel">
          <el-input v-model.trim="ruleFormDialog.tel" placeholder="请输入电话号码" :maxlength="20"
                    size="mini"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model.trim="ruleFormDialog.email" placeholder="请输入邮箱" :maxlength="20"
                    size="mini"
                    :clearable="true"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="closeUserDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveUserDialog" size="mini" :disabled="ruleFormDialogLoading">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--分配角色-->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible" :append-to-body="true" width="650px"
               @close="closeRoleDialog">
      <el-table
        :height="(roleList.content && roleList.content.length>0)?(routerViewHeight*1-170):(routerViewHeight*1-135)"
        :data="roleList.content" style="width: 100%" v-loading="roleLoading"
        :empty-text="emptyText" :element-loading-text="elementLoadingText" @selection-change="handleSelectionRoleChange"
        stripe highlight-current-row ref="roleListTable">
        <el-table-column type="selection" width="55" :selectable="selectableHandleRole"></el-table-column>
        <el-table-column prop="index" label="序号" min-width="5%"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" min-width="10%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" min-width="16%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="10%" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :data="roleList" @change="getRoleList"></pagination>
      <div class="el-dialog--center" slot="footer">
        <el-button @click="closeRoleDialog" size="mini">取消</el-button>
        <el-button type="primary" @click="saveRoleDialog" size="mini" :disabled="roleLoading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配实验组弹框 -->
    <el-dialog title="分配实验组权限" :visible.sync="groupsPermissionDialogVisible" :append-to-body="true" width="450px"
               @close="closeGroupsPermissionDialog" class="userManageTree">
      <el-tree v-if="treeRenderAgain" :data="groupsPermissionList" :props="groupsPermissionProps" node-key="id"
               show-checkbox
               class="branchTree" :indent="50"
               ref="groupsPermissionTree" v-loading="groupsLoading"></el-tree>
      <div class="el-dialog--center">
        <el-button @click="closeGroupsPermissionDialog" size="mini">取消</el-button>
        <el-button type="primary" @click="saveGroupsPermission" size="mini" :disabled="groupsLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import utils from 'components/utils';
import dictionary from 'components/utils/dictionary';
import mixins from 'components/mixins';
import validation from 'components/utils/validation';

export default {
  name: 'userManage',
  mixins: [mixins],
  components: {
    pagination,
    'echarts-contain': echartsContain
  },
  data () {
    return {
      ruleForm: {
        account: '',
        userName: '',
        status: ''
      },
      params_ruleForm: {
        account: '',
        userName: '',
        status: ''
      },
      userstatus: {},
      dataList: {}, // 列表数据
      loading: false,
      emptyText: '',
      pageNo: '',
      pageSize: '',
      rolePageNo: '',
      rolePageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      elementLoadingText: '',

      dialogTitle: '',
      dialogVisible: false,
      userOption: '',
      saveUrl: '',
      ruleFormDialog: {
        id: '',
        account: '',
        userName: '',
        email: '',
        status: '',
        idNumber: '',
        tel: ''
      },
      dialogRules: {
        account: [
          {required: true, validator: this.validateAccount, trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        idNumber: [
          {validator: this.validateIdNumber, trigger: 'blur'}
        ],
        tel: [
          {validator: this.validateTel, trigger: 'blur'}
        ],
        email: [
          {validator: this.validateEmail, trigger: 'blur'}
        ]
      },
      currUser: {},
      currUserId: '',
      ruleFormDialogLoading: false,
      dialogRoleVisible: false,
      roleLoading: false,
      roleList: {},
      selectionRoleList: [],
      groupsPermissionDialogVisible: false,
      groupsLoading: false,
      groupsPermissionProps: {
        children: 'children',
        label: 'name'
      },
      groupsPermissionList: [],
      treeRenderAgain: true
    };
  },
  created () {
    this.initPage();
  },
  activated () {
    this.getRoleList();
    this.getGroupsPermission();
  },
  methods: {
    initPage () {
      this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.rolePageNo = pageNo;
      this.rolePageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.userstatus = dictionary.options('USER_STATUS');
      this.search();
    },
    search () {
      this.params_ruleForm = utils.deepClone(this.ruleForm);
      this.getDataList();
    },
    async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      that.loading = true;
      let formData = {
        account: that.params_ruleForm.account,
        userName: that.params_ruleForm.userName,
        status: that.params_ruleForm.status,
        page: pageNo - 1,
        size: pageSize
      };
      try {
        let data = await that.$http.userFindAllUsers(that.$format(formData));
        that.loading = false;
        if (data.code == '0') {
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
        }
      } catch (error) {
        that.loading = false;
        that.$notice('获取用户列表失败');
        console.log(error);
      }
    },
    selectableHandleRole (row, index) {
      if (row && row.roleType === '0') {
        return false;
      } else {
        return true;
      }
    },
    userResetPwd (id) {
      let that = this;
      that.$confirm('确定要重置密码为 "123456" 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          userId: id
        };
        try {
          let data = await that.$http.userResetPwd(formData);
          if (data.code == '0') {
            that.$notice(data.msg || '重置成功');
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          console.log(error);
          that.$notice('重置出错');
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    updateStatus (row) {
      let that = this;
      let msg = row.status == 0 ? '禁用' : '启用';
      that.$confirm(`确认${msg}此用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          userId: row.id
        };
        try {
          let data = await that.$http.userChangeStatus(formData);
          if (data.code == '0') {
            that.$notice(data.msg || `${msg}成功`);
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          console.log(error);
          that.$notice(`${msg}出错`);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    add () {
      this.dialogTitle = '添加用户';
      this.userOption = 'add';
      Object.keys(this.ruleFormDialog).forEach((key) => {
        this.ruleFormDialog[key] = '';
      });
      this.ruleFormDialog.status = this.ruleFormDialog.status.toString();
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleFormDialog.clearValidate();
      });
    },
    edit (row) {
      this.dialogTitle = '编辑用户';
      this.dialogVisible = true;
      this.userOption = 'edit';
      this.currUserId = row.id;
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
      this.ruleFormDialog.status = this.ruleFormDialog.status.toString();
    },
    saveUserDialog () {
      let that = this;
      let formData = {};
      let msg = '';
      that.$refs.ruleFormDialog.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        if (that.userOption === 'add') {
          msg = '添加';
          formData = {
            account: that.ruleFormDialog.account,
            userName: that.ruleFormDialog.userName,
            email: that.ruleFormDialog.email,
            idNumber: that.ruleFormDialog.idNumber,
            tel: that.ruleFormDialog.tel
          };
          that.saveUrl = that.$http.userAddUser;
        } else {
          msg = '编辑';
          formData = {
            id: that.ruleFormDialog.id,
            account: that.ruleFormDialog.account,
            userName: that.ruleFormDialog.userName,
            email: that.ruleFormDialog.email,
            idNumber: that.ruleFormDialog.idNumber,
            tel: that.ruleFormDialog.tel
          };
          that.saveUrl = that.$http.userUpdateUser;
        }
        that.ruleFormDialogLoading = true;
        try {
          let data = await that.saveUrl(formData);
          if (data.code == '0') {
            that.closeUserDialog();
            that.$notice(data.msg);
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
          that.ruleFormDialogLoading = false;
        } catch (error) {
          that.$notice(`${msg}失败`);
          that.ruleFormDialogLoading = false;
          console.log(error);
        }
      });
    },
    closeUserDialog () {
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.$refs.ruleFormDialog.clearValidate();
      this.dialogVisible = false;
    },
    closeRoleDialog () {
      this.dialogRoleVisible = false;
      this.selectionRoleList = [];
      this.$refs.roleListTable.clearSelection();
      this.$refs.roleListTable.setCurrentRow();
    },
    async getRoleList (pageNo = this.rolePageNo, pageSize = this.rolePageSize) {
      let that = this;
      that.roleLoading = true;
      let formData = {
        page: pageNo - 1,
        size: pageSize,
        status: '0' // 获取状态为有效的角色
      };
      try {
        let data = await that.$http.roleFindAllRoles(formData);
        that.roleLoading = false;
        if (data.code == '0') {
          let obj = {};
          obj.content = data.data.list;
          obj.content.forEach((item, index) => {
            item.index = (pageNo - 1) * pageSize + index + 1;
          });
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.total);
          obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
          that.roleList = obj;
        }
      } catch (error) {
        that.roleLoading = false;
        that.$notice('获取角色列表失败');
        console.log(error);
      }
    },
    handleSelectionRoleChange (val) {
      this.selectionRoleList = val;
      // console.log(this.selectionRoleList);
    },
    async assignRole (row) {
      let that = this;
      that.currUser = row;
      this.dialogRoleVisible = true;
      this.$nextTick(() => {
        that.$refs.roleListTable.doLayout();
      });
      this.roleLoading = true;
      let formData = {
        userId: that.currUser.id
      };
      try {
        let data = await that.$http.userGetUser(formData);
        if (data.code == '0') {
          that.selectionRoleList = [];
          if (that.$refs.roleListTable) {
            that.$refs.roleListTable.clearSelection();
          }
          data.data.roleList.forEach((item1) => {
            that.roleList.content.forEach((item2) => {
              if (item1.roleId == item2.id) {
                that.selectionRoleList.push(item2);
              }
            });
          });
          // console.log(that.selectionRoleList);
          that.selectionRoleList.forEach(row => {
            that.$refs.roleListTable.toggleRowSelection(row, true);
          });
          this.roleLoading = false;
        }
      } catch (error) {
        that.$notice('获取用户角色失败');
        this.dialogRoleVisible = false;
        this.roleLoading = false;
        console.log(error);
      }
    },
    async saveRoleDialog () {
      let that = this;
      let roleIds = that.selectionRoleList.map(item => {
        return item.id;
      });
      let formData = {
        roleIds: roleIds,
        userId: that.currUser.id
      };
      that.roleLoading = true;
      try {
        let data = await that.$http.userAuthRoleToUser(formData);
        that.roleLoading = false;
        if (data.code == '0') {
          that.closeRoleDialog();
          that.$notice('角色保存成功');
          that.getDataList(that.currentPageNo, that.currentPageSize);
        }
      } catch (error) {
        that.$notice(`分配角色失败`);
        that.roleLoading = false;
        console.log(error);
      }
    },
    closeGroupsPermissionDialog () {
      this.groupsPermissionDialogVisible = false;
      this.groupsLoading = false;
      this.treeRenderAgain = false;
      this.$refs.groupsPermissionTree.setCheckedKeys([]);
    },
    async getGroupsPermission () {
      let that = this;
      that.groupsLoading = true;
      try {
        let data = await that.$http.diseasespeciesFindAllDiseaseSpecies();
        that.groupsLoading = false;
        if (data.code == '0' && data.data && data.data.diseaseSpecieses) {
          that.groupsPermissionList = data.data.diseaseSpecieses;
          that.groupsPermissionList.forEach(item1 => {
            item1.children = item1.subjectStudies;
            item1.children.forEach((item2) => {
              item2.children = item2.experimentGroups;
            });
          });
          // console.log(that.groupsPermissionList);
        }
      } catch (error) {
        that.$notice('获取实验组树失败');
        console.log(error);
      }
    },
    async assignGroup (row) {
      let that = this;
      that.currUser = row;
      that.treeRenderAgain = true;
      that.groupsPermissionDialogVisible = true;
      that.groupsLoading = true;
      let formData = {
        userId: that.currUser.id
      };
      try {
        let data = await that.$http.userGetUser(formData);
        if (data.code == '0') {
          let selectedKeys = [];
          data.data.diseaseSpecieses.forEach(item1 => {
            if (item1.subjectStudies.length == 0 && item1.hasAuth) {
              selectedKeys.push(item1.id);
            } else {
              item1.subjectStudies.forEach(item2 => {
                if (item2.experimentGroups.length == 0 && item2.hasAuth) {
                  selectedKeys.push(item2.id);
                } else {
                  item2.experimentGroups.forEach(item3 => {
                    if (item3.hasAuth) {
                      selectedKeys.push(item3.id);
                    }
                  });
                }
              });
            }
          });
          this.$refs.groupsPermissionTree.setCheckedKeys(selectedKeys);
          that.groupsLoading = false;
          // console.log(selectedKeys);
        }
      } catch (error) {
        that.$notice('获取用户实验组权限失败');
        that.groupsPermissionDialogVisible = false;
        that.groupsLoading = false;
        console.log(error);
      }
    },
    async saveGroupsPermission () {
      let that = this;
      let checkedIds = that.$refs.groupsPermissionTree.getCheckedKeys();
      // console.log(checkedIds);
      let formData = {
        diseaseId: [],
        subjectId: [],
        experimentId: [],
        userId: that.currUser.id
      };
      checkedIds.forEach(id => {
        that.groupsPermissionList.forEach(item1 => {
          if (item1.id == id) {
            formData.diseaseId.push(id);
          }
          item1.children.forEach(item2 => {
            if (item2.id == id) {
              formData.subjectId.push(id);
            }
            item2.children.forEach(item3 => {
              if (item3.id == id) {
                formData.experimentId.push(item3.id);
              }
            });
          });
        });
      });
      that.groupsPermissionList.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            formData.experimentId.forEach(id => {
              if (item3.id == id && formData.subjectId.indexOf(item2.id) == -1) {
                formData.subjectId.push(item2.id);
              }
            });
          });
        });
      });
      that.groupsPermissionList.forEach(item1 => {
        item1.children.forEach(item2 => {
          formData.subjectId.forEach(id => {
            if (item2.id == id && formData.diseaseId.indexOf(item1.id) == -1) {
              formData.diseaseId.push(item1.id);
            }
          });
        });
      });
      that.groupsLoading = true;
      try {
        let data = await that.$http.userAuthGroupToUser(formData);
        that.groupsLoading = false;
        if (data.code == '0') {
          that.$notice(data.msg);
          that.closeGroupsPermissionDialog();
        }
      } catch (error) {
        that.$notice('保存实验组权限失败');
        that.groupsLoading = false;
        console.log(error);
      }
    },
    deleteItem (row) {
      let that = this;
      that.$confirm('确认删除此用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          userId: row.id
        };
        try {
          let data = await that.$http.userDeleteUser(formData);
          if (data.code == '0') {
            that.$notice(data.message || '删除成功');
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          console.log(error);
          that.$notice('删除出错');
        }
      }).catch((error) => {
        console.log(error);
        that.$notice('删除出错');
      });
    },
    async validateAccount (rule, value, callback) {
      if (validation.checkNull(value)) {
        callback(new Error('账号不能为空'));
        return false;
      }
      if (this.userOption == 'add') {
        let data = await this.$http.userIsExistUser({account: this.ruleFormDialog.account});
        if (data.data) {
          callback(new Error('账号已经存在'));
          return false;
        }
      }
      callback();
    },
    validateIdNumber (rule, value, callback) {
      if (validation.checkNull(value)) {
        callback();
      }
      if (!validation.checkCardNumber(value)) {
        callback(new Error('请输入正确的身份证号'));
        return false;
      }
      callback();
    },
    validateTel (rule, value, callback) {
      if (validation.checkNull(value)) {
        callback();
      }
      if (validation.checkPhone(value)) {
        callback();
        return false;
      }
      if (validation.checkTel(value)) {
        callback();
        return false;
      }
      callback(new Error('请输入正确的电话号码或者座机'));
    },
    validateEmail (rule, value, callback) {
      if (validation.checkNull(value)) {
        callback();
      }
      if (!validation.checkEmail(value)) {
        callback(new Error('请输入正确的邮箱'));
        return false;
      }
      callback();
    },
    reset () {
      Object.assign(this.$data, this.$options.data());
      this.$data.dialogRules = {
        account: [
          {required: true, validator: this.validateAccount, trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        idNumber: [
          {validator: this.validateIdNumber, trigger: 'blur'}
        ],
        tel: [
          {validator: this.validateTel, trigger: 'blur'}
        ],
        email: [
          {validator: this.validateEmail, trigger: 'blur'}
        ]
      };
      this.initPage();
    }
  }
};
</script>
<style lang="less">
  body {
    .userManageDialog .el-dialog .el-form .el-form-item .el-input {
      width: 250px
    }

    .userManageTree .el-dialog .el-tree {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
    }
  }
</style>
