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



let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
  //获取URL
    Vue.prototype.baseURL = JSON.parse(sessionStorage.getItem('Global')).baseURL;
    // 初始化根vue
    new Vue({
      el: '#app',
      store,
      render: h => h(App)
    });
  } catch (err) {
    console.log(err)
    return err;
  }
};

initApp();
