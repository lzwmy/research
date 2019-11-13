/*eslint-disable*/
// import Vue from 'vue';
import App from './app';
import utils from 'components/utils';
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/fonticon/iconfont.css';
import 'assets/css/crf.less';
import 'assets/css/crfStyle.less';

/*import VueRouter from 'vue-router';

Vue.use(VueRouter)*/

// Vue.use(ElementUI);
import install from 'components/utils/install';

Vue.use(install);
import store from '../../store';
import Global from 'components/utils/global';

let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
    //同步验证浏览器自带的session有没有在登录有效期；
    // await utils.validLoginAuthenticated();

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
