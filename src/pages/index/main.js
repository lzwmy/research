/*eslint-disable*/
// import Vue from 'vue';
import App from './app';
import utils from 'components/utils';
import Global from 'components/utils/global';
import 'babel-polyfill'
// import ElementUI from 'element-ui';
import { Loading, MessageBox,Message } from 'element-ui';
// import VueRouter from 'vue-router';

import routes from '../../router';
import store from '../../store';


// 开始加载的loading
let loadingInstance = Loading.service({text: '系统正在初始化...', background: 'rgba(0, 0, 0, 0.15)'});

import VueQuillEditor from 'vue-quill-editor';
import install from 'components/utils/install';
import filters from 'components/filters/index';

import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/normalize.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'assets/css/crf.less';
// import 'assets/css/crfStyle.less';
import 'assets/fonticon/iconfont.css';
import 'assets/fonticon/iconfont.js';
import 'assets/css/common.less';

require('zrender/lib/vml/vml');
require('zrender/lib/svg/svg');

import 'assets/css/crfConfig.css';

import VueClipboard from 'vue-clipboard2'

// import '../../router/dynamicRouter'
// import router from '../../router/router'

Vue.use(VueClipboard)
Vue.use(VueQuillEditor)
Vue.use(install);
Vue.use(VueRouter);

window.eventBus = new Vue();
Vue.prototype.$message = Message;
Vue.prototype.$mes = function (type, message) {
  this.$message({
    type: type,
    message: message,
    duration: message.length > 8 ? message.length * 200 : 1500
  })
}

// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})


Object.keys(filters).forEach(i => Vue.filter(i, filters[i]));


Vue.prototype.$Highcharts = Highcharts;


// 引入underscore
let underscore = require('underscore');
Vue.prototype.underscore = underscore;

// 引入方法数组中查找是否拥有某个对象，返回索引index
utils.defineArrayFind();

let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
    // 获取公共的 baseURL
    Vue.prototype.baseURL = localStorage.getItem('Global') && JSON.parse(localStorage.getItem('Global')).baseURL;
    //是否为科研项目登录
    let  isResearch = localStorage.getItem('CURR_LOGIN_TYPE') == "research";
    let  isDisease = localStorage.getItem('CURR_LOGIN_TYPE') == "disease";
    
    //同步获取菜单；(非科研项目登录非专病登录)
    if(!isResearch && !isDisease && store.state.user.token) {
      await utils.loadMenuInfo();
    }
    // 初始化路由
    let router = new VueRouter({
      routes
    });
    loadingInstance.close();// 在获取权限后关闭loading
    // 跳转路由前进行登录校验
    router.beforeEach((to, from, next) => {
      // 校验路由元信息是否有权限要求
      if (to.meta.requireAuth === false) {
        next();
      } else {
        // 该路由需要登录权限，所以校验是否登录，如登录则模拟登录
        if (store.state.user.token) {
          //如果是从科研项目入口登录，则不能进入到其它模块
          if(isResearch && to.meta.belongToGroup != 'researchTask') {
            next('/projectProgress');
          //如果是从专病科研入口登录，则不能进入到其它模块
          }else if(localStorage.getItem('CURR_LOGIN_TYPE') == "disease" && to.meta.belongToGroup != 'insideView') {
            next('/diseaseChart?id='+store.state.user.diseaseInfo.diseaseId);
          }else {
            next();
          }
        } 
        else {
          utils.ssoLogout();
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
    console.log(err)
    //关闭loading;
    utils.ssoLogout();
    MessageBox.confirm('系统错误，请联系管理员！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showCancelButton: false
    }).then(() => {
      utils.ssoLogout();
    }).catch((errors) => {
      utils.ssoLogout();
    });
  }
};

initApp();
