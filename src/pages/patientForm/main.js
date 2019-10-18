/*eslint-disable*/
import Vue from 'vue';
import App from './app';
import utils from 'components/utils';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/normalize.less';
import 'assets/fonticon/iconfont.css';
import 'assets/css/crf.less';
import 'assets/css/crfStyle.less';
import 'assets/css/common.less';

/*import VueRouter from 'vue-router';

Vue.use(VueRouter)*/

Vue.use(ElementUI);
import install from 'components/utils/install';

Vue.use(install);
import store from '../../store';
import Global from 'components/utils/global';

import 'assets/css/crfConfig.css';



Vue.prototype.GetRequest = function () {
  var url = location.search;   //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1)
  {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++)
    {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
};

let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
    //同步验证浏览器自带的session有没有在登录有效期；
    // await utils.validLoginAuthenticated();
    // 获取公共的 baseURL
    Vue.prototype.baseURL = JSON.parse(sessionStorage.getItem('Global')).baseURL;
    // 初始化根vue
    new Vue({
      el: '#app',
      store,
      render: h => h(App)
    });
  } catch (err) {
    return err;
  }
};

initApp();
