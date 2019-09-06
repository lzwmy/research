<template>
  <div id="main_header" class="header" :class="{'onclick':isDislpayArrow}">
    <div class="header_box flex-between-center">
      <router-link :to="{ name: 'index'}" class="header-logo flex-start-center">
        <img :src="'../../../../static/img/logo/'+this.logo" alt="卫健智能">
        <span class="head-title">{{title}}</span>
      </router-link>

      <div class="header-info flex-end-center">
          <!-- <el-dropdown class="li set">
            <div class="setText">设置皮肤</div>
            <el-dropdown-menu slot="dropdown" class="setdropdown">
              <el-dropdown-item :class="{on:$parent.ccstyle=='theme-blue'}"><span @click="changeThemeColor('theme-blue')">蓝色</span>
              </el-dropdown-item>
              <el-dropdown-item :class="{on:$parent.ccstyle=='theme-green'}"><span
                @click="changeThemeColor('theme-green')">绿色</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <div class="li setText">
            <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
              <i class="icon iconfont iconzujian23"></i>
            </el-tooltip>
          </div>
          <div class="li setText">
            <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
              <i class="icon iconfont iconzujian22"></i>
            </el-tooltip></div>
          <el-dropdown class="li systemSet">
            <div class="welcomeText flex-between-center" title="系统设置">
              <div class="img_head">
                <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="头像">
              </div>
              <p>{{username.length > 15 ? username.substring(0, 15)+ '...' : username}}</p>
              <span class="el-icon-arrow-down"></span>
            </div>
            <el-dropdown-menu slot="dropdown" class="setdropdown">
              <el-dropdown-item><span @click="dialogFormVisible=true">修改密码</span></el-dropdown-item>
              <el-dropdown-item>
                <router-link :to="{name:'openEHRIntroduction'}">关于我们</router-link>
              </el-dropdown-item>
              <el-dropdown-item><p @click="logout">退出登录</p></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="ruleForm" :rules="rules" label-width="100px" style="padding-right:20px " ref="ruleForm"
                    class="el-dialog--center" v-loading="loading">
              <el-form-item label="旧密码：" prop="oldPassword">
                <el-input v-model.trim="ruleForm.oldPassword" placeholder="请输入旧密码" type="password" :maxlength="20"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码：" prop="newPassword">
                <el-input v-model.trim="ruleForm.newPassword" placeholder="请输入新密码" type="password" :maxlength="20"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码：" prop="confirmPassword">
                <el-input v-model.trim="ruleForm.confirmPassword" placeholder="请输入确认密码" type="password" :maxlength="20"
                          auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer el-dialog--center">
              <el-button type="primary" @click="submit" :disabled="loading">确定</el-button>
              <el-button @click="cancelSubmit">取消</el-button>
            </div>
          </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import utils from 'components/utils';

export default {
  name: 'appHeader',
  data () {
    let oldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else if (/[·【】；”“‘’，。、！￥……（）——{}：“《》？]/g.test(value) || /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
        callback(new Error('旧密码不能包含中文符号'));
      } else if (/\s/g.test(value)) {
        callback(new Error('旧密码不能包含空格'));
      } else {
        callback();
      }
    };
    let newPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (/[·【】；”“‘’，。、！￥……（）——{}：“《》？]/g.test(value) || /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
        callback(new Error('新密码不能包含中文符号'));
      } else if (/\s/g.test(value)) {
        callback(new Error('新密码不能包含空格'));
      } else if (value === this.ruleForm.userName) {
        callback(new Error('新密码与用户账号不能相同'));
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error('新密码与旧密码不能相同'));
      } else if (value.length > 20) {
        callback(new Error('新密码长度不能超过20个字符'));
      } else if (value.length < this.passwordStrategy.atLeastLen) {
        callback(new Error('新密码长度不能少于' + this.passwordStrategy.atLeastLen + '个字符'));
      } else if (this.passwordStrategy.capitalLetter === 'Y' && !/[A-Z]/g.test(value)) {
        callback(new Error('新密码格式必须包含大写字母'));
      } else if (this.passwordStrategy.lowercaseLetter === 'Y' && !/[a-z]/g.test(value)) {
        callback(new Error('新密码格式必须包含小写字母'));
      } else if (this.passwordStrategy.numberLetter === 'Y' && !/\d/g.test(value)) {
        callback(new Error('新密码格式必须包含数字'));
      } else if (this.passwordStrategy.specialLetter === 'Y' && !/[\`\!\@\#\$\%\^\&\*\(\)\-\=\_\+\[\]\\\|\;\'\"\:\,\.\/\<\>\?\~\{\}]/g.test(value)) {
        callback(new Error('新密码格式必须包含特殊字符'));
      } else {
        callback();
      }
    };
    let confirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('新密码和确认密码不一致'));
      } else if (/[·【】；”“‘’，。、！￥%……（）——{}：“《》？]/g.test(value) || /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
        callback(new Error('确认密码不能包含中文符号'));
      } else if (/\s/g.test(value)) {
        callback(new Error('确认密码不能包含空格'));
      } else if (value.length > 20) {
        callback(new Error('确认密码长度不能超过20个字符'));
      } else if (value.length < this.passwordStrategy.atLeastLen) {
        callback(new Error('确认密码长度不能少于' + this.passwordStrategy.atLeastLen + '个字符'));
      } else if (this.passwordStrategy.capitalLetter === 'Y' && !/[A-Z]/g.test(value)) {
        callback(new Error('确认密码格式必须包含大写字母'));
      } else if (this.passwordStrategy.lowercaseLetter === 'Y' && !/[a-z]/g.test(value)) {
        callback(new Error('确认密码格式必须包含小写字母'));
      } else if (this.passwordStrategy.numberLetter === 'Y' && !/\d/g.test(value)) {
        callback(new Error('确认密码格式必须包含数字'));
      } else if (this.passwordStrategy.specialLetter === 'Y' && !/[\`\!\@\#\$\%\^\&\*\(\)\-\=\_\+\[\]\\\|\;\'\"\:\,\.\/\<\>\?\~\{\}]/g.test(value)) {
        callback(new Error('确认密码格式必须包含特殊字符'));
      } else {
        callback();
      }
    };
    return {
      logo: '',
      title: '',
      dialogFormVisible: false,
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          {required: true, validator: oldPassword, trigger: 'blur'}
        ],
        newPassword: [
          {required: true, validator: newPassword, trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, validator: confirmPassword, trigger: 'blur'}
        ]
      },
      passwordStrategy: {
        atLeastLen: 6,
        capitalLetter: 'N',
        lowercaseLetter: 'N',
        numberLetter: 'N',
        specialLetter: 'N'
      },
      loading: false
    };
  },
  computed: {
    username () {
      return this.$store.state.user.account;
    },
    isDislpayArrow () {
      return this.$store.state.user.session_isDislpayArrow;
    }
  },
  watch: {},
  created () {
    this.logo = JSON.parse(sessionStorage.getItem('Global')).logo;
    this.title = JSON.parse(sessionStorage.getItem('Global')).title;
  },
  methods: {
    changeThemeColor (ccstyle = 'theme-blue') {
      if (ccstyle == 'theme-green') {
        this.$store.commit({
          type: 'changeTheme',
          ccstyle: 'theme-green'
        });
      } else if (ccstyle == 'theme-blue') {
        this.$store.commit({
          type: 'changeTheme',
          ccstyle: 'theme-blue'
        });
      }
    },
    submit () {
      let that = this;
      let CURR_USER = JSON.parse(sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO'));
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        try {
          let formData = {
            newPwd: that.ruleForm.newPassword,
            oldPwd: that.ruleForm.oldPassword,
            repeatPwd: that.ruleForm.confirmPassword,
            userId: CURR_USER.userId
          };
          that.loading = true;
          let data = await that.$http.userUpdatePassword(that.$format(formData));
          that.loading = false;
          if (data.code == '0') {
            that.cancelSubmit();
            that.$notice(data.msg);
          }
        } catch (error) {
          that.loading = false;
          that.$notice('修改密码失败');
          console.log(error);
        }
      });
    },
    cancelSubmit () {
      for (let key in this.ruleForm) {
        this.ruleForm[key] = '';
      }
      this.$refs.ruleForm.resetFields();
      this.dialogFormVisible = false;
    },
    logout () {
      var that = this;
      that.$confirm('您确定退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        utils.ssoLogout();
      }).catch((errors) => {
        console.log(errors);
      });
    }
  }
};
</script>

<style lang="less" scoped>
    .header {
        background-color: #090e40;
        height: 60px;
        .header_box {
          margin: 0 auto;
          height: 100%;
          width: 1200px;
          overflow: auto;
        }
        .header-logo {
          color: #fff;
          font-size: 18px;
          img {
            height: 36px;
          }
          .head-title {
            border-left: 1px solid #fff;
            line-height: 24px;
            margin-left: 15px;
            font-size: 20px;
            font-weight: bold;
            padding-left: 15px;
          }
        }
        .header-info {
          .li {
            color: #fff;
            font-size: 16px;
            margin-left: 30px;
            .icon {
              font-size: 26px;
              cursor: pointer;
            }
            .img_head {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              overflow: hidden;
              img {
                height: 100%;
                border-radius: 50%;
              }
            }
            p {
              margin:0 5px 0 10px;
            }
            span {
              font-size: 20px;
            }
          }
        }
    }
</style>
