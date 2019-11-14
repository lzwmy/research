<template>
  <div class="cloud-component organizationManagement">
    <div class="component_head flex-between-center">
      <p>{{$route.meta.txt}}</p>
      <div class="head_content cur_pointer">
        <el-button :disabled="orgList.length == 0" type="primary" icon="el-icon-plus" @click="showDialog('添加用户')">新建用户</el-button>

      </div>
    </div>
    <div class="box">
      <div class="aside">
        <ul v-loading="orgLoading" id="orgUl">
          <li v-for="(item, index) in orgList" :key="index" :class="item.orgCode == orgCode?'active':''" @click="selectGroup(item)">
            <span v-if="!item.edit">{{item.orgName}}</span>
            <el-input @keyup.enter.native="addOrg" @blur="addOrg" class="addOrg" v-else v-model="item.orgName"></el-input>
          </li>
        </ul>
        <el-button v-if="loginType=='local'" class="plus flex-center-center" type="primary" icon="el-icon-plus" @click="addOrgInput">添加分中心</el-button>
      </div>
      <div class="content">
        <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
          <el-table
            :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)"
            :data="dataList.content"  v-loading="tableLoading" fit>
            <el-table-column type="index" label="序号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userName" label="用户名" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orgName" label="机构" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="科室" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="duty" label="职称" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column label="角色" min-width="160">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.roles" :key="index">{{item}}<span v-show="index!=scope.row.roles.length-1">、</span></span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="showDialog('编辑用户',scope.row)"><i class="iconfont iconbianji"></i></el-button>
                  <el-button type="text" @click="onDelete(scope.row)"><i class="iconfont iconshanchu del"></i></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination :data="dataList" @change="getDataList"></pagination>
        </echarts-contain>
      </div>
    </div>
    <!-- 多中心添加用户 -->
    <el-dialog
      :title="dialogForm.title"
      :visible.sync="dialogForm.visible"
      :append-to-body="true"
      class="height_auto"
      @close="closeDialog"
      width="550px">
      <el-form
        :model="dialogForm" ref="dialogForm" :rules="ruleDialogForm" label-width="80px" class="organizationManagement"
        @submit.native.prevent v-loading="dialogForm.loading" label-position="left">
        <el-form-item label="用户名:" prop="userName">
          <el-input v-model.trim="dialogForm.userName" placeholder="请输入用户名" :maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="tel">
          <el-input v-model.trim="dialogForm.tel" placeholder="请输入手机号" :maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="机构:" prop="organization">
          <el-select v-model="dialogForm.organization" class="block">
            <el-option v-for="(item, index) in orgList" :key="index" :label="item.orgName" :value="item.orgName" :disabled="dialogForm.title=='编辑用户'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-select v-model="dialogForm.role" multiple class="block">
            <!-- <el-option :disabled="item.name=='管理员'" v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id"></el-option> -->
            <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室:" prop="department">
          <el-input v-model.trim="dialogForm.department" placeholder="请输入科室" :maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称:" prop="position">
          <el-input v-model.trim="dialogForm.position" placeholder="请输入职称" :maxlength="30" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onConfirm" :disabled="dialogForm.loading">确 认</el-button>
        <el-button @click="closeDialog" >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import pagination from 'components/packages/pagination/pagination';
  import mixins from 'components/mixins';

  export default {
    name: 'organizationManagement',
    mixins: [mixins],
    data () {
      var checkPhone = (rule, value, callback) =>{
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      return {
        dialogForm: {
          title:'',
          userName:'',
          userId: '',
          tel: '',
          role:[],
          organization: '',
          department: '',
          position: '',
          visible: false,
          loading: false,
        },
        dataList: {},
        orgList: [],
        orgLoading: false,
        orgCode: '',
        tableLoading: false,
        roleList: [],
        paging: {
          pageNo: 1,
          pageSize: 10,
          currentPageNo: '',
          currentPageSize: '',
        },
        ruleDialogForm: {
          userName: [{required: true, message: '请输入用户名', trigger: 'change'}],
          tel: [{required: true, validator:checkPhone, trigger: 'blur'}],
          role: [{required: true, message: '请选择角色', trigger: 'change'}],
          organization: [{required: true, message: '请选择机构', trigger: 'change'}],
          department: [{required: true, message: '请输入科室', trigger: 'change'}],
          position: [{required: true, message: '请输入职称', trigger: 'change'}]
        },
        loginType: sessionStorage.getItem('CURR_LOGIN_TYPE') == 'disease'?'share':'local'
      }
    },
    components: {
      pagination,
      echartsContain
    },
    created() {
      this.initPage();
    },
    methods: {
      initPage () {
        this.getOrgList()
          .then(()=>{
            if(this.orgList.length == 0) {
              this.dataList.content = [];
              this.$emit('changeLoadding',false);
              return;
            }
            this.orgList.length != 0 && this.selectGroup(this.orgList[0]);
            this.$emit('changeLoadding',false);
            this.getAllRoles();
          })

      },
      selectGroup(item,index) {
        this.orgCode = item.orgCode;
        this.getDataList();
      },
      async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
        let that = this;
        that.tableLoading = true;
        that.paging.currentPageNo = pageNo;
        that.paging.currentPageSize = pageSize;
        that.dataList.content = [];
        let formData = {
          offset: pageNo - 1,
          limit: pageSize,
          args: this.orgCode
        };
        try {
          let res = await that.$http.ORGDisGetUserList(formData);
          if (res.code == '0') {
            let obj = {};
            obj.content = res.data.args;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(res.data.totalElements);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.dataList = obj;
          }else {
            this.$mes('error', res.msg);
          }
          that.tableLoading = false;
        } catch (err) {
          that.tableLoading = false;
          console.log(err)
        }
      },
      //获取角色列表
      async getAllRoles() {
        try {
          let res = await this.$http.ORGDisRoleList();
          if (res.code == '0') {
            if(this.loginType=='share') {
              this.roleList = res.data.filter(li=>{
                return li.id != 1 || li.id != 2;
              })
            }else {
              this.roleList = res.data.filter(li=>{
                return li.id != 1;
              })
            }
          }else {
            this.$mes('error', res.msg);
          }
        } catch (err) {
          console.log(err)
        }
      },
      //获取机构列表
      async getOrgList() {
        this.orgLoading = true;
        try {
          let res = await this.$http.ORGDisGetOrgList({
            diseaseId: this.$store.state.user.diseaseInfo.diseaseId,
            source: this.loginType
          });
          if (res.code == '0') {
            this.orgList = res.data;
            if(this.orgList.length) {
              this.orgCode = this.orgList[0].orgCode;
            }
          }else {
            this.$mes('error', res.msg);
          }
          this.orgLoading = false;
        } catch (err) {
          this.orgLoading = false;
          console.log(err)
        }
      },
      showDialog(title,row) {
        if(row) {
          this.dialogForm = {
            title: title,
            userName: row.userName,
            userId: row.id,
            tel: row.phoneNumber,
            role: row.roles,
            organization: row.orgName,
            department: row.deptName,
            position: row.duty,
            visible: true,
            loading: false,
          }
        }
        this.dialogForm.title = title;
        this.dialogForm.visible = true;
      },
      closeDialog() {
        this.$refs.dialogForm.resetFields();
        this.dialogForm = {
          title:'',
          userId: '',
          userName:'',
          tel: '',
          organization: '',
          department: '',
          position: '',
          visible: false,
          loading: false,
        }
      },
      onConfirm() {
        this.$refs.dialogForm.validate(async (valid) => {
          let that = this;
          if (!valid) {
            return false;
          }
          that.dialogForm.loading = true;
          try {
            let res, formData;
            let organization = that.orgList.filter(item=>{
              return that.dialogForm.organization == item.orgName;
            })
            if(that.dialogForm.title == "添加用户"){
              formData = {
                diseaseId: this.$store.state.user.diseaseInfo.diseaseId,
                userName: this.dialogForm.userName,
                phoneNumber: this.dialogForm.tel,
                orgName: this.dialogForm.organization,
                orgCode: organization[0].orgCode,
                deptName: this.dialogForm.department,
                duty: this.dialogForm.position,
                roles: this.dialogForm.role
              }
              res = await that.$http.ORGDisCreateUser(formData);
            }else {
              formData = {
                diseaseId: this.$store.state.user.diseaseInfo.diseaseId,
                userName: this.dialogForm.userName,
                phoneNumber: this.dialogForm.tel,
                orgName: this.dialogForm.organization,
                orgCode: organization[0].orgCode,
                deptName: this.dialogForm.department,
                duty: this.dialogForm.position,
                roles: this.dialogForm.role,
                id: this.dialogForm.userId
              }
              res = await that.$http.ORGDisupdateUserList(formData);
            }
            if (res.code == '0') {
              that.$mes('success', that.dialogForm.title +'成功');
              that.dialogForm.visible = false;
              that.getDataList(that.paging.currentPageNo, that.paging.currentPageSize);
            }
            that.dialogForm.loading = false;
          } catch (error) {
            console.log(error)
            that.dialogForm.visible = false;
          }
        });
      },
      addOrgInput() {
        this.orgList.push({
          edit: true,
          orgName: ''
        })
        this.$nextTick(()=>{
          $("#orgUl li:last-child input").focus();
        })
      },
      async addOrg() {
        let org = this.orgList.filter(item=>{
          return item.edit;
        })
        if(org.length == 0) {
          return;
        }
        for (let i = 0; i < this.orgList.length; i++) {
          if(this.orgList[i].edit) {
            this.orgList.splice(i,1)
            i--;
          }
        }
        if(!org[0].orgName) {
          return;
        }
        let formData = {
          orgName: org[0].orgName,
          diseaseId: this.$store.state.user.diseaseInfo.diseaseId
        }
        try {
          let res = await this.$http.ORGDisAddOrg(formData);
          if (res.code == '0') {
            this.$mes('success', '添加成功!');
            this.getOrgList();
          }else {
            this.$mes('error', res.msg);
          }
        } catch (err) {
          console.log(err)
        }
      },
      onDelete (row) {
        let that = this;
        that.$confirm('确认删除该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let formData = {
            id: row.id
          };
          try {
            let data = await that.$http.ORGDisDeleteUser(formData);
            if (data.code == '0') {
              this.$mes('success',data.message || '删除成功');
              that.getDataList(that.paging.currentPageNo, that.paging.currentPageSize)
                .then(()=>{
                  if(this.dataList.content.length == 0 && that.paging.currentPageNo > 1) {
                    that.getDataList(that.paging.currentPageNo -1 , that.paging.currentPageSize);
                  }
                })
            }
          } catch (error) {
            console.log(error)
          }
        }).catch((error) => {});
      },
    }
  };
</script>

<style lang="less" scoped>
  .organizationManagement {
    .box {
      position: relative;
      width: 100%;
      height: 100%;
      color: #394263;
      .aside {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 220px;
        overflow: auto;
        #orgUl {
          background-color: #fff;
          border: 1px solid rgba(229, 235, 236, .7);
        }
        li {
          height: 40px;
          line-height: 40px;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          padding: 0 20px;
          border-left: 3px solid transparent;
          cursor: pointer;
          &.active {
            background-color: rgba(245, 247, 250, .7);
            border-left: 3px solid #1bbae1;
            color: #1bbae1;
          }
          &:hover {
            background-color: rgba(245, 247, 250, .7);
            border-left: 3px solid #1bbae1;
            color: #1bbae1;
          }
        }
        .plus {
          margin: 20px auto;
          width: 100%;
          line-height: 38px;
        }
      }
      .content {
        position: absolute;
        left: 235px;
        top: 0;
        right: 0;
        bottom: 0;
        // padding: 15px;
      }
    }
  }
</style>




