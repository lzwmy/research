<template>
  <div id="app">
    <div class="container flex-between-center">
      <div class="left flex-between-start flex-wrap">
        <div class="logo">
          <img :src="'./static/img/logo/'+ this.logo" alt="卫健智能">
        </div>
        <div class="bottom">
          <h1>{{title}}</h1>
          <p>Special disease research platform</p>
        </div>
      </div>
      <div class="right flex-center-center">
        <div class="login_content">
          <p class="login_title text_center">欢迎登录</p>
          <el-form :model="form" ref="refForm" label-width="0" :rules="rules">
            <el-form-item prop="phoneNumber">
              <el-input id="phoneNumber" class="login_input" @keyup.enter.native="login" v-model.trim="form.phoneNumber" autocomplete="off"  maxlength="30" type="text" :class="form.userName?'active':''" placeholder="请输入手机号码" clearable>
                <i slot="prefix" class="icon el-icon-mobile-phone"></i>
                </el-input>
              </el-form-item>
            <el-form-item prop="validCode">
              <el-input id='validCode' @keyup.enter.native="login" class="login_input" v-model.trim="form.validCode" maxlength="4" type="text" :class="form.validCode?'active':''"  placeholder="请输入短信验证码">
                <i slot="prefix" class="icon iconfont iconzujian29"></i>
                <el-button @click="getValidCode" class="validCode" slot='suffix'>获取手机验证码</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <el-button @click="login" class="login_button" type="primary">登 录</el-button>
        </div>
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
      form: {
        phoneNumber: '18870724953',
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
    this.logo = JSON.parse(sessionStorage.getItem('Global')).logo;
    this.title = JSON.parse(sessionStorage.getItem('Global')).title;
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
      let params = {
        code: this.form.validCode,
        phoneNumber: this.form.phoneNumber
      };
      this.$post('/auth/subject/login.do', this.$format(params), false).then((res) => {
        if (res && res.code == 0 && res.data) {
          let userLogin = {
            name: res.data.name,
            permissionCodes: res.data.permissionCodes,
            roleCodes: res.data.roleCodes,
            sessionId: res.data.sessionId,
            userId: res.data.userId
          };
          this.$store.commit('USER_SIGNIN', JSON.stringify(userLogin));
          this.$store.commit('saveLoginType', 'research');
          let url = utils.getQuery('url');
          if (url) {
            window.location.href = url;
          } else {
            window.location.href = './index.html#/index';
          }
        } else {
          if(res.code == 40) {
            document.querySelector('#validCode').focus();
          }
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    getValidCode() {
      let params = {
        phoneNumber: this.form.phoneNumber
      }
      this.$get('/auth/subject/send/code.do', this.$format(params), false).then((res) => {
        if (res && res.code == 0 && res.data) {
          this.$mes('success','验证码已发送，请注意查收');
        } else {
          if(data.code == 40) {
            document.querySelector('#validCode').focus();
          }
          this.$mes('error','验证码发送失败');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
};
</script>

<style lang="less">
  html, body, #app {
    height: 100%;
  }  
  .container {
    height: 100%;
    .left {
      flex: 1;
      height: 100%;
      background: #82b7f3;
      background-size: cover;
      background-position: center;
      padding: 60px 80px 100px 60px;
      .logo img {
          height: 56px;
      }
      .bottom {
        align-self: flex-end;
        width: 100%;
        color: #fff;
        h1 {
          margin: 16px 0;
          font-size: 32px;
          text-align: right;
          font-weight: bold;
        }
        p {
          font-size: 40px;
          width: 100%;
          text-align: right;
          color: rgba(255, 255, 255, 0.74);
          text-transform: uppercase;
        }
      }
    }
    .right {
      width: 574px;
      height: 100%;
      .login_content {
        width: 100%;
        height: 550px;
        padding: 0 52px;
        .login_title {
          font-size:30px;
          font-weight:400;
          height: 50px;
          line-height:40px;
          color:rgba(9,14,64,1);
          position: relative;
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width:120px;
            height:4px;
            background:rgba(67,154,255,1);
          }
        }    
        .el-form {
          margin: 80px 0;
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
            border-bottom:1px solid rgba(229,229,229,1);
            height: 60px;
            font-size: 16px;
            padding-left: 46px;
            line-height: 60px;
            color: rgba(99, 102, 110, 0.965);
            background-color: transparent;
            
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
            border-color: rgba(67, 154, 255, 1);
            background-color: transparent;
            & + .el-input__prefix .icon {
              color: rgba(67, 154, 255, 1);
            }
          }
          input:-moz-autofill {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
            border-color: rgba(67, 154, 255, 1);
            background-color: transparent;
            & + .el-input__prefix .icon {
              color: rgba(67, 154, 255, 1);
            }
          }
          .el-form-item__error {
            left: 46px;
          }
          .icon {
            line-height: 60px;
            font-size: 22px;
            color: rgba(107, 107, 108, 1);
            
          }
        } 
        .login_button {
          width: 100%;
          height: 58px;
          font-size: 24px;
          border-radius:4px;
          background-color: #439aff;
          &:hover {
            background-color: #1d85ff;;
          }
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
