/*eslint-disable*/
import Vue from 'vue';
import App from './app';
import utils from 'components/utils';
import Global from 'components/utils/global';
import ElementUI from 'element-ui';
import { Loading, MessageBox,Message } from 'element-ui';
import 'assets/fonticon/iconfont.css';
Vue.use(ElementUI);
import 'assets/css/crf.less';
import 'assets/css/crfStyle.less';

// 开始加载的loading
let loadingInstance = Loading.service({text: '拼命加载中...', background: 'rgba(0, 0, 0, 0.15)'});
import VueRouter from 'vue-router';

Vue.use(VueRouter);
import install from 'components/utils/install';

import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'assets/css/common.less';
Vue.use(VueQuillEditor)

Vue.use(install);
import routes from '../../router';
import store from '../../store';

window.eventBus = new Vue();
Vue.prototype.$message = Message;
Vue.prototype.$mes = function (type, message) {
  this.$message({
    type: type,
    duration: 1500,
    message: message
  })
}

// 不做全局引入mixins，只做页面级别的
// import mixins from 'components/mixins';
//
// Vue.mixin(mixins);

// kindeditor引入
// import '../../../static/kindeditor/themes/default/default.css';
// import '../../../static/kindeditor/kindeditor-min.js';
// import '../../../static/kindeditor/lang/zh-CN.js';

// filters
import filters from 'components/filters/index';

Object.keys(filters).forEach(i => Vue.filter(i, filters[i]));

// 在项目的main.js入口引入vue-svg-icon,

// import Icon from 'vue-svg-icon/Icon.vue';
// Vue.component('icon', Icon);

// import echarts from 'echarts/dist/echarts.min.js'  //全部引入echarts
// 按需引入echarts，引入 ECharts 主模块
let echarts = require('echarts/lib/echarts');

require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/chart/gauge');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
require('echarts/lib/component/legendScroll');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/axisPointer');
require('echarts/lib/component/title');
require('echarts/lib/component/dataZoom');
require('echarts/lib/component/markPoint');
require('echarts/lib/component/toolbox');
require('zrender/lib/vml/vml');
require('zrender/lib/svg/svg');


Vue.prototype.$echarts = echarts;

// 引入underscore
let underscore = require('underscore');
Vue.prototype.underscore = underscore;

// 引入方法数组中查找是否拥有某个对象，返回索引index
utils.defineArrayFind();

let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
    // 引入主题颜色的class样式
    let ccstyle = store.state.user.ccstyle || localStorage.getItem('research_ccstyle') || 'theme-blue';
    // console.warn(ccstyle)
    // if (ccstyle == 'theme-green' || ccstyle == 'theme-blue') {
    //   document.querySelector('body').className = ccstyle;
    //   store.commit({
    //     type: 'changeTheme',
    //     ccstyle: ccstyle
    //   });
    // } else {
    //   document.querySelector('body').className = 'theme-blue';
    //   store.commit({
    //     type: 'changeTheme',
    //     ccstyle: 'theme-blue'
    //   });
    // }
    //同步验证浏览器自带的session有没有在登录有效期；
    await utils.validIndexAuthenticated();

    //同步获取菜单；
    await utils.loadMenuInfo();
    loadingInstance.close();// 在获取权限后关闭loading
    // 初始化路由
    let router = new VueRouter({
      routes
    });
    // 跳转路由前进行登录校验
    router.beforeEach((to, from, next) => {
      // 校验路由元信息是否有权限要求
      if (to.meta.requireAuth === false) {
        next();
      } else {
        // 该路由需要登录权限，所以校验是否登录，如登录则模拟登录
        if (JSON.parse(window.sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO'))) {
          store.commit('USER_SIGNIN', window.sessionStorage.getItem('CURR_USER_RESEARCH_USERINFO'));
          next();
        } else {
          utils.ssoLogout();
          window.location.href = './login.html';
        }
      }
    });
    // 初始化根vue
    new Vue({
      el: '#app',
      store,
      router,
      render: h => h(App)
    });
  } catch (err) {
    // 关闭loading;
    loadingInstance.close();
    MessageBox.confirm('系统错误，请联系管理员！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showCancelButton: false
    }).then(() => {
      utils.ssoLogout();
    }).catch((errors) => {
      console.log(errors);
      utils.ssoLogout();
    });
  }
};

initApp();
