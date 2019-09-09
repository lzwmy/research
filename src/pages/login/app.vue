<template>
  <div id="app">
    <div class="loginlongbg">
      <header>
        <div class="logocon"><img style="width: 120px;height: 30px;" :src="'./static/img/logo/weijian-white.png'"><em></em><span
          class="logotitle">专病科研平台</span>
        </div>
      </header>
      <div class="loginmain">
        <div class="loginmaincon">
          <div class="loginmainbox">
            <div class="logintitle"><em></em>
              <h1>用户登录</h1></div>
            <div>
              <div class="logincon">
                <label class="loginname user"></label>
                <el-input class="logininput user" v-model.trim="userName" type="text" placeholder="请输入用户名" auto-complete="off"
                          clearable>
                </el-input>
              </div>
              <div class="logincon">
                <label class="loginname password"></label>
                <el-input class="logininput password" v-model.trim="password" placeholder="请输入密码"
                          @keyup.enter.native="login"
                          type="password" auto-complete="off" ref="password" clearable>
                </el-input>
              </div>

              <div class="logincon clearfix">
                <el-input class="logininput trueno" v-model.trim="validCode" type="text" @keyup.enter.native="login"
                          auto-complete="off" ref="verificationCode" placeholder="请输入验证码"
                          clearable>
                </el-input>
                <div class="imageCode" @click="changeValidCode">
                  <img :src="imageCodeUrl">
                </div>
              </div>
              <div class="lg_tip">
                {{errorTip}}
              </div>
              <div class="dashed"></div>
              <div class="lg_btns" @click="login">
                <a class="lg_btn lg_btn1" href="javascript:void(0)"><span>登录</span></a>
              </div>
            </div>
            <div class="clear"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from 'components/utils';
import 'assets/css/blue/base.less';
import 'assets/css/blue/reset.less';
import CryptoJS from '../../../static/js/crypto-js.js';
import JSEncrypt from '../../../static/js/jsencrypt.js';

export default {
  name: 'login',
  components: {},
  data () {
    return {
      userName: '',
      password: '',
      validCode: '',
      imageCodeUrl: '',
      errorTip: '',
      ie: false
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

  },
  mounted () {
    this.initPage();
  },
  methods: {
    initPage () {
      if (!('placeholder' in document.createElement('input'))) {
        this.ie = true;
      }
      this.imageCodeUrl = this.$axios.defaults.baseURL + '/auth/validCode.do?t=' + new Date().getTime();
    },
    changeValidCode () {
      this.imageCodeUrl = this.$axios.defaults.baseURL + '/auth/validCode.do?t=' + new Date().getTime();
    },
    login () {
      let that = this;
      // 用户名校验,暂时只做空校验
      if (!that.userName) {
        that.errorTip = '用户名为空,请输入用户名';
        document.querySelector('.loginlongbg .user .el-input__inner').focus();
        return false;
      }
      // 密码校验，暂时只做空校验
      if (!that.password) {
        that.errorTip = '密码为空,请输入密码';
        document.querySelector('.loginlongbg .password .el-input__inner').focus();
        return false;
      }
      // 验证码校验，暂时只做空校验
      if (!that.validCode) {
        that.errorTip = '验证码为空,请输入验证码';
        document.querySelector('.loginlongbg .trueno .el-input__inner').focus();
        return false;
      }

      let rand = (CryptoJS.MD5(Math.random() + '') + '').substring(0, 16);
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCD+2TvohQ2mE+Xmzj2OIhvHFaLlanIWdbZP+ysk9kNioY5vphI/Q1Etow5zbHCSy9m4MNpPi68NDJcY7zn8JPjEnjzxKUTP6U4+EjJj9TeP9HiYnaWMYZeDG7pqxs2FLo4Mxz5YdRkTWuLWztybXmmAENzk88srZlGjRcRGDqmkQIDAQAB');
      let consumerId = encrypt.encrypt(rand);
      let aesKey = CryptoJS.enc.Utf8.parse(rand);
      let aesMode = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      };
      let encLoginName = that.userName;
      let encPassword = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8
          .parse(that.password),
        aesKey, aesMode).toString();
      let params = {
        randomKey: consumerId,
        username: encLoginName,
        password: encPassword,
        validCode: that.validCode
      };
      that.errorTip = '';
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
          that.errorTip = data.msg;
          that.changeValidCode();
        }
      }).catch(function (error) {
        that.errorTip = '请求出错,请联系管理员！';
        that.changeValidCode();
        console.log(error);
      });
    }
  }
};
</script>
