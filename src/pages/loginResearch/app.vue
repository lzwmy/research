<template>
  <div id="app" class="flex-center-center">
    <div class="container flex-between-center">
      <div class="left flex-center-center flex-wrap">
          <h1><img :src="'./static/img/logo/'+ this.logo" alt="卫健智能"><br/>专病科研平台</h1>
      </div>
      <div class="login_content">
          <p class="login_title text_center">用户登录</p>
          <el-form :model="form" ref="refForm" label-width="0" :rules="rules">
            <el-form-item prop="phoneNumber">
              <el-input id="phoneNumber" class="login_input" @keyup.enter.native="login" v-model.trim="form.phoneNumber" autocomplete="off"  maxlength="30" type="text" :class="form.userName?'active':''" placeholder="请输入手机号码" clearable>
                <i slot="prefix" class="icon el-icon-mobile-phone"></i>
                </el-input>
              </el-form-item>
            <el-form-item prop="validCode">
              <div class="flex-between-center">
                <el-input id='validCode' @keyup.enter.native="login" class="login_input" v-model.trim="form.validCode" maxlength="4" type="text" :class="form.validCode?'active':''"  placeholder="请输入短信验证码">
                  <i slot="prefix" class="icon iconfont iconzujian29"></i>
                  <!-- <el-button @click="getValidCode" class="validCode" slot='suffix'>获取手机验证码</el-button> -->
                </el-input>
                <el-button type='text' v-if="count==0"  @click="getValidCode" class="validCode" :loading="btnLoading">获取验证码</el-button>
                <el-button type='text' v-else class="validCode">{{count}} s</el-button>
              </div>
            </el-form-item>
          </el-form>
          <el-button @click="login" class="login_button" type="primary">登 录</el-button>
        </div>
    </div>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/fonticon/iconfont.css';
import 'assets/css/normalize.less';
import 'assets/css/common.less';

import utils from 'components/utils';

export default {
  name: 'login',
  data () {
    return {
      btnLoading: false,
      count: 0,
      timer: null,
      form: {
        phoneNumber: '',
        validCode: '',
      },
      logo:'',
      title: '',
      rules: {
          phoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
          validCode: [{ required: true, message: '请输入短信验证码', trigger: 'change' }]
      }
    };
  },
  created () {
    this.logo = JSON.parse(localStorage.getItem('Global')).logo;
    this.title = JSON.parse(localStorage.getItem('Global')).title;
    localStorage.setItem('CURR_DISEASE_INFO', JSON.stringify({ diseaseId: utils.getQuery('id')}));
  },
  mounted () {
  },
  methods: {
    login () {
      this.$refs.refForm.validate((valid,validCode) => {
        if (valid) {
          this.handleLogin();
        } else {
          switch(Object.keys(validCode)[0]){
            case "phoneNumber": document.querySelector('#phoneNumber').focus(); break; 
            case "validCode": document.querySelector('#validCode').focus(); break; 
            default : break;
          }
          return false;
        }
      });
    },
    handleLogin() {
      let that = this;
      let params = {
        code: this.form.validCode,
        phoneNumber: this.form.phoneNumber,
        id: utils.getQuery('id'),
        enterType: 1
      };

      this.$axios({
        method: 'post',
        url: '/auth/subject/login.do',
        data: that.$format(params)
      }).then((res)=>{
        if(res.data && res.data.code == 0) {
          let userLogin = {
            name: res.data.data.name,
            permissionCodes:  res.data.data.permissionCodes,
            roleCodes:  res.data.data.roleCodes,
            sessionId:  res.data.data.sessionId,
            userId:  res.data.data.userId,
          };
          that.$store.commit('saveToken',res.data.data.token) 
          that.$store.commit('USER_SIGNIN', JSON.stringify(userLogin));
          window.location.href = './index.html#/projectProgress';
          return
        }else {
          //验证码错误
          if(res.data.code == 40) {
            document.querySelector('#validCode').focus();
          }
          this.$message({
            message: res.data.msg || '登录失败',
            type: 'warning'
          });
          that.changeValidCode();
        }
      }).catch(function (error) {
        that.changeValidCode();
        console.log(error);
      });
    },
    getValidCode() {
      if(this.count != 0) {
        return;
      }
      if(!this.form.phoneNumber) {
        this.$mes('info','请输入手机号!')
        return
      }
      this.btnLoading = true;
      let params = {
        phoneNumber: this.form.phoneNumber,
        id: utils.getQuery('id'),
        enterType: 1
      }
      this.$post('/auth/subject/send/code.do', this.$format(params), false).then((res) => {
        this.btnLoading = false;
        if (res.code == 0) {
          this.$mes('success','验证码已发送，请注意查收');
          this.count = 59;
          this.timer = setInterval(() => {
            if(this.count > 0) {
              this.count--;
            }else {
              clearInterval(this.timer);
            }
          }, 1000);
        } else {
          if(res.code == 40) {
            document.querySelector('#validCode').focus();
          }
          this.$mes('error','验证码发送失败');
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
  }
};
</script>

<style lang="less">
  html, body, #app {
    height: 100%;
  }  
  #app {
    height: 100%;
    background-image: url('./images/bg1.png');
    background-position: center bottom;
    background-size: 100%;
    background-repeat: no-repeat;
    background-color: #eaf3fd;
  }
  .container {
    width: 634px;
    height: 418px;
    .left {
      width: 314px;
      height: 100%;
      background-image: url('./images/bg2.jpg');
      border-top-left-radius: 4px; 
      border-bottom-left-radius: 4px; 
      h1 {
        color: #fff;
        text-align: center;
        font-size: 30px;
      }
      img {
          height: 48px;
      }
    }
    .login_content {
        flex: 1;
        height: 100%;
        background-color: #fff;
        border-top-right-radius: 4px; 
        border-bottom-right-radius: 4px; 
        padding: 64px 20px;
        .login_title {
          font-size:22px;
          font-weight: bold;
          color: #797979;
        }    
        .el-form {
          margin: 36px 0;
          .login_input {
            height: auto;
          }
          .el-input.active {
            .el-input__inner {
              border-color: rgba(67, 154, 255, 1);
            }
            .icon {
              color: rgba(67, 154, 255, 1);
            }
          }
          .el-input__inner {
            border:none;
            height: 40px;
            font-size: 14px;
            padding-left: 30px;
            line-height: 40px;
            color: rgba(99, 102, 110, 0.965);
            background-color: #F1F6FD;
            &::-webkit-input-placeholder {
                color:#BEC9DB;
            }
            &::-moz-placeholder {   /* Mozilla Firefox 19+ */
                color:#BEC9DB;
            }
            &:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
                color:#BEC9DB;
            }
            &:-ms-input-placeholder {  /* Internet Explorer 10-11 */ 
                color:#BEC9DB;
            }
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
            border-color: transparent;
            background-color: #F1F6FD;
            & + .el-input__prefix .icon {
              color: rgba(67, 154, 255, 1);
            }
          }
          input:-moz-autofill {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
            border-color: transparent;
            background-color: #F1F6FD;
            & + .el-input__prefix .icon {
              color: rgba(67, 154, 255, 1);
            }
          }
          .el-form-item__error {
            left: 30px;
          }
          .icon {
            line-height: 40px;
            font-size: 20px;
            color: rgba(107, 107, 108, .7);
            
          }
          .validCode {
            width: 100px;
            line-height: 40px;
            margin-left: 5px;
          }
        } 
        .login_button {
          width: 100%;
          height: 40px;
          font-size: 16px;
          border-radius:4px;
          background-color: #439aff;
          &:hover {
            background-color: #1d85ff;;
          }
        }
      }
  }
  @media screen and (min-width: 350px) and (max-width: 1200px) {
    #app {
      width: 1300px !important;
    }
  }

</style>
