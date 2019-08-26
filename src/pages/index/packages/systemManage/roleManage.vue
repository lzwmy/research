<template>
  <div class="cloud-component roleManage">
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model.trim="ruleForm.roleName" size="mini"
                    placeholder="请输入角色名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model.trim="ruleForm.status" size="mini" placeholder="请选择" clearable>
            <el-option v-for="item in userstatus" :key="item.code" :value="item.code"
                       :label="item.desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" :loading="loading">查询</el-button>
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
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row ref="roleTable">
          <el-table-column prop="index" label="序号" min-width="5%"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="description" label="角色描述" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="角色状态" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status ==0">启用</span>
              <span class='zwarning' v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope" v-if="scope.row.roleType!=='0'">
              <el-button type="text" size="small" @click="assign(scope.row)" style="margin-left: 8px">
                <i class="icon-bangding" title="分配菜单权限"></i>
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
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>
    <!--新增/编辑角色弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="400px"
               @close="closeRoleDialog" class="roleManageDialog">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules" label-width="90px"
               class="el-dialog--center" @submit.native.prevent>
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model.trim="ruleFormDialog.roleName" placeholder="请输入角色名称" :maxlength="100"
                    size="mini"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="有效性：" prop="status" v-if="roleOption=='edit'">
          <el-radio v-model="ruleFormDialog.status" label="0" disabled>启用</el-radio>
          <el-radio v-model="ruleFormDialog.status" label="1" disabled>禁用</el-radio>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model.trim="ruleFormDialog.description" placeholder="请输入角色描述(不超过500个字)" :rows="4" :maxlength="500" size="mini"
                    :clearable="true" type="textarea" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model.trim="ruleFormDialog.remarks" placeholder="请输入备注(不超过500个字)" :rows="4" :maxlength="500" size="mini"
                    :clearable="true" type="textarea" resize="none"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="closeRoleDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveRoleDialog" size="mini">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 分配权限弹框 -->
    <el-dialog title="设置角色权限" :visible.sync="permissionDialogVisible" :append-to-body="true" width="350px"
               height="400px"
               @close="closePermissionDialog" class="roleManageTree">
      <el-tree v-if="treeRenderAgain" :data="permissionList" :props="permissionProps" node-key="id" show-checkbox
               class="branchTree" :indent="50"
               ref="permissionTree" default-expand-all v-loading="menusLoading"></el-tree>
      <div class="el-dialog--center">
        <el-button @click="closePermissionDialog" size="mini">取消</el-button>
        <el-button type="primary" @click="savePermission" size="mini" :disabled="menusLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from 'components/utils';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import dictionary from 'components/utils/dictionary';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import validation from 'components/utils/validation';

export default {
  name: 'roleManage',
  mixins: [mixins],
  data () {
    return {
      ruleForm: {
        roleName: '',
        status: ''
      },
      params_ruleForm: {
        roleName: '',
        status: ''
      },
      userstatus: {},
      dataList: {},
      loading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',

      dialogTitle: '',
      dialogVisible: false,
      roleOption: '',
      saveUrl: '',
      ruleFormDialog: {
        roleName: '',
        status: '',
        description: '',
        remarks: ''
      },
      dialogRules: {
        roleName: [
          {required: true, validator: this.validateRoleName, trigger: 'blur'}
        ],
        status: [
          {required: true, message: '有效性不能为空！', trigger: 'blur'}
        ]
      },
      permissionDialogVisible: false,
      permissionList: [],
      menusList: [],
      defaultCheckedMenuIdList: [],
      permissionProps: {
        children: 'children',
        label: 'menuName'
      },
      currRole: {},
      currRoleId: '',
      menusLoading: false,
      treeRenderAgain: true
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initPage();
  },
  mounted () {

  },
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
      this.userstatus = dictionary.options('USER_STATUS');
      this.search();
      this.getPermissionTree();
    },
    search () {
      this.params_ruleForm = utils.deepClone(this.ruleForm);
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
        roleName: that.params_ruleForm.roleName,
        status: that.params_ruleForm.status
      };
      try {
        let data = await that.$http.roleFindAllRoles(that.$format(formData));
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
        that.$notice('获取角色列表失败');
        console.log(error);
      }
    },
    add () {
      this.dialogTitle = '添加角色';
      Object.keys(this.ruleFormDialog).forEach((key) => {
        this.ruleFormDialog[key] = '';
      });
      this.ruleFormDialog.status = 0;
      this.roleOption = 'add';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleFormDialog.clearValidate();
      });
    },
    edit (row) {
      this.dialogTitle = '编辑角色';
      this.dialogVisible = true;
      this.roleOption = 'edit';
      this.currRoleId = row.id;
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
    },
    saveRoleDialog () {
      let that = this;
      let formData = {};
      let msg = '';
      that.$refs.ruleFormDialog.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        if (that.roleOption === 'add') {
          msg = '添加';
          formData = {
            roleName: that.ruleFormDialog.roleName,
            // status: that.ruleFormDialog.status,
            description: that.ruleFormDialog.description,
            remarks: that.ruleFormDialog.remarks
          };
          that.saveUrl = that.$http.roleAddRole;
        } else {
          msg = '编辑';
          formData = {
            id: that.currRoleId,
            roleName: that.ruleFormDialog.roleName,
            // status: that.ruleFormDialog.status,
            description: that.ruleFormDialog.description,
            remarks: that.ruleFormDialog.remarks
          };
          that.saveUrl = that.$http.roleUpdateRole;
        }
        try {
          let data = await that.saveUrl(formData);
          if (data && data.code == '0') {
            that.closeRoleDialog();
            that.$notice(data.msg);
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          that.$notice(`${msg}失败`);
          console.log(error);
        }
      });
    },
    closeRoleDialog () {
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.$refs.ruleFormDialog.clearValidate();
      this.dialogVisible = false;
    },
    closePermissionDialog () {
      this.permissionDialogVisible = false;
      this.menusLoading = false;
      this.treeRenderAgain = false;
      this.$refs.permissionTree.setCheckedKeys([]);
    },
    async assign (row) {
      let that = this;
      that.currRole = row;
      that.treeRenderAgain = true;
      that.permissionDialogVisible = true;
      that.menusLoading = true;
      let formData = {
        roleId: that.currRole.id
      };
      try {
        let data = await that.$http.roleGetRole(formData);
        if (data && data.code == '0') {
          let selectedKeys = [];
          data.data.menuList.forEach(item1 => {
            if (item1.menuLevel == 3) {
              selectedKeys.push(item1.id);
            }
            that.permissionList.forEach(item2 => {
              if (item1.menuLevel == 2 && item1.id == item2.id && item2.children.length == 0) {
                selectedKeys.push(item1.id);
              }
            });
          });
          selectedKeys.push(that.defaultCheckedMenuIdList);
          that.$refs.permissionTree.setCheckedKeys(selectedKeys);
          that.menusLoading = false;
        }
      } catch (error) {
        that.$notice('获取角色菜单权限失败');
        that.permissionDialogVisible = false;
        that.menusLoading = false;
        console.log(error);
      }
    },
    async getPermissionTree () {
      let that = this;
      that.menusLoading = true;
      try {
        let data = await that.$http.menuFindAllMenus();
        that.menusLoading = false;
        if (data && data.code == '0' && data.data) {
          let tempList = [];
          that.menusList = utils.deepClone(data.data);
          data.data.forEach(item => {
            if (item.menuLevel == 2) {
              if (item.menuPath === '/index') {
                item.disabled = true;
                that.defaultCheckedMenuIdList = [item.id];
              }
              item.children = [];
              that.permissionList.push(item);
            } else {
              tempList.push(item);
            }
          });

          tempList.forEach(child => {
            that.permissionList.forEach(parent => {
              if (child.menuLevel == 3) {
                if (child.superiorMenu === parent.menuCode) {
                  parent.children.push(child);
                }
              }
            });
          });
          // console.log(that.permissionList);
        }
      } catch (error) {
        that.$notice('获取菜单树失败');
        console.log(error);
      }
    },
    async savePermission () {
      let that = this;
      let menuIds = that.$refs.permissionTree.getCheckedKeys();
      // 由于这样获取的节点，如果一个1级菜单下面只选择了部分二级菜单，则这个1级菜单的id并没有获取到，而后台接收需要这个父级id，所以需要处理menuIds；
      let needParentMenus = [];
      let allParentMenus = [];
      menuIds.forEach(id => {
        that.menusList.forEach(item => {
          if (id == item.id && item.menuLevel == 3) {
            needParentMenus.push(item);
          }
        });
      });
      needParentMenus.forEach(item1 => {
        that.menusList.forEach(item2 => {
          if (item1.superiorMenu == item2.menuCode && item2.menuLevel == 2) {
            allParentMenus.push(item2);
          }
        });
      });
      allParentMenus.forEach(item1 => {
        let haveFlag = false;
        menuIds.forEach(id => {
          if (id == item1.id) {
            haveFlag = true;
            return false;
          }
        });
        if (!haveFlag) {
          menuIds.push(item1.id);
        }
      });
      let formData = {
        menuIds: menuIds,
        roleId: that.currRole.id
      };
      that.menusLoading = true;
      try {
        let data = await that.$http.roleBindMenuToRole(formData);
        if (data && data.code == '0') {
          that.$notice(data.msg);
          that.closePermissionDialog();
        }
      } catch (error) {
        that.$notice('绑定菜单权限失败');
        console.log(error);
      }
    },
    updateStatus (row) {
      let that = this;
      let msg = row.status == 0 ? '禁用' : '启用';
      that.$confirm(`确认${msg}此角色吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          roleId: row.id
        };
        try {
          let data = await that.$http.roleChangeStatus(formData);
          if (data && data.code == '0') {
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
    deleteItem (row) {
      let that = this;
      that.$confirm('确认删除此角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          roleId: row.id
        };
        try {
          let data = await that.$http.roleDeleteRole(formData);
          if (data && data.code == '0') {
            that.$notice(data.msg || '删除成功');
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          console.log(error);
          that.$notice('删除出错');
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    async validateRoleName (rule, value, callback) {
      let that = this;
      if (validation.checkNull(value)) {
        callback(new Error('角色名不能为空'));
        return false;
      }
      if (that.roleOption == 'add') {
        let data = await that.$http.roleIsExistRole({roleName: that.ruleFormDialog.roleName});
        if (data && data.data) {
          callback(new Error('角色名已经存在'));
          return false;
        }
      }
      callback();
    },
    reset () {
      // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.ruleForm.resetFields();
      Object.assign(this.$data, this.$options.data());
      this.$data.dialogRules = {
        roleName: [
          {required: true, validator: this.validateRoleName, trigger: 'blur'}
        ],
        status: [
          {required: true, message: '有效性不能为空！', trigger: 'blur'}
        ]
      };
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
    .roleManage .el-form .el-form-item .el-input {
      width: 220px
    }
    .roleManageDialog .el-dialog .el-form .el-form-item .el-input {
      width: 270px
    }
    .roleManageTree .el-dialog .el-tree {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
    }
  }
</style>
