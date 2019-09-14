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
          <el-form :model="form" ref="form" label-width="0" :rules="rules">
            <el-form-item prop="userName">
              <el-input id="user" class="login_input" @keyup.enter.native="login('form')" v-model.trim="form.userName" autocomplete="off"  maxlength="30" type="text" :class="form.userName?'active':''" placeholder="请输入用户名" clearable>
                <i slot="prefix" class="icon iconfont iconzujian27"></i>
                </el-input>
              </el-form-item>
            <el-form-item prop="password">
              <el-input id="password" class="login_input" v-model.trim="form.password" maxlength="30" :class="form.password?'active':''" placeholder="请输入密码" 
                      @keyup.enter.native="login('form')" type="password" ref="password" autocomplete="on" clearable>
                <i slot="prefix" class="icon iconfont iconzujian28"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="validCode">
              <el-input id='validCode' @keyup.enter.native="login('form')" class="login_input" v-model.trim="form.validCode" maxlength="4" type="text" :class="form.validCode?'active':''"  placeholder="请输入验证码">
                <i slot="prefix" class="icon iconfont iconzujian29"></i>
                <img class="validCode" slot='suffix' @click="changeValidCode" :src="imageCodeUrl">
              </el-input>
            </el-form-item>
          </el-form>
          <el-button @click="login('form')" class="login_button" type="primary">登 录</el-button>
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
import CryptoJS from '../../../static/js/crypto-js.js';
import JSEncrypt from '../../../static/js/jsencrypt.js';

export default {
  name: 'login',
  data () {
    return {
      form: {
        userName: '',
        password: '',
        validCode: '',
      },
      imageCodeUrl: '',
      logo:'',
      title: '',
      rules: {
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          validCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      }
    };
  },
  beforeCreate () {
    if (JSON.parse(window.sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO'))) {
      if (JSON.parse(window.sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO')).sessionId) {
        let url = utils.getQuery('url');
        if (url) {
          window.location.href = url;
        } else {
          window.location.href = './index.html#/index';
        }
      }
    }
  },
  created () {
    if(utils.detectZoom() != 100){
      this.$alert('当前网页缩放比例不等于100%，请按键盘ctrl+0恢复100%显示标准，以防页面显示错乱！', '警告', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {}
      });
    }
    this.logo = JSON.parse(sessionStorage.getItem('Global')).logo;
    this.title = JSON.parse(sessionStorage.getItem('Global')).title;
  },
  mounted () {
    this.changeValidCode();
  },
  methods: {
    changeValidCode () {
      this.imageCodeUrl = this.$axios.defaults.baseURL + '/auth/validCode.do?t=' + new Date().getTime();
    },
    login (form) {
      this.$refs[form].validate((valid,validCode) => {
        if (valid) {
          this.handleLogin();
        } else {
          switch(Object.keys(validCode)[0]){
            case "userName": document.querySelector('#user').focus(); break; 
            case "password": document.querySelector('#password').focus(); break; 
            case "validCode": document.querySelector('#validCode').focus(); break; 
            default : break;
          }
          return false;
        }
      });
    },
    handleLogin() {
      let that = this;
      let rand = (CryptoJS.MD5(Math.random() + '') + '').substring(0, 16);
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCD+2TvohQ2mE+Xmzj2OIhvHFaLlanIWdbZP+ysk9kNioY5vphI/Q1Etow5zbHCSy9m4MNpPi68NDJcY7zn8JPjEnjzxKUTP6U4+EjJj9TeP9HiYnaWMYZeDG7pqxs2FLo4Mxz5YdRkTWuLWztybXmmAENzk88srZlGjRcRGDqmkQIDAQAB');
      let consumerId = encrypt.encrypt(rand);
      let aesKey = CryptoJS.enc.Utf8.parse(rand);
      let aesMode = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      };
      let encLoginName = that.form.userName;
      let encPassword = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(that.form.password),
        aesKey, aesMode).toString();
      let params = {
        randomKey: consumerId,
        username: encLoginName,
        password: encPassword,
        validCode: that.form.validCode
      };
      that.$post('/auth/login.do', that.$format(params), false).then((response) => {
        let data = response;
        if (data && data.code == 0 && data.data) {
          let userLogin = {
            name: data.data.name,
            permissionCodes: data.data.permissionCodes,
            roleCodes: data.data.roleCodes,
            sessionId: data.data.sessionId,
            userId: data.data.userId
          };
          that.$store.commit('USER_SIGNIN', JSON.stringify(userLogin));
          let url = utils.getQuery('url');
          if (url) {
            window.location.href = url;
          } else {
            window.location.href = './index.html#/index';
          }
        } else {
          if(data.code == 40) {
            document.querySelector('#validCode').focus();
          }
          that.changeValidCode();
        }
      }).catch(function (error) {
        that.changeValidCode();
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
      background: url('./images/login_bg.jpg') no-repeat;
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
          font-size: 1.7vw;
          text-align: right;
          font-weight: bold;
        }
        p {
          font-size: 1.7vw;
          width: 100%;
          text-align: right;
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
          .validCode {
            width: 80px;
            height: 38px;
            cursor: pointer;
            transform: translateY(10px);
          }
        } 
        .login_button {
          width: 100%;
          height: 58px;
          font-size: 24px;
          border-radius:4px;
          background-color: rgba(67, 154, 255, 1);
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
