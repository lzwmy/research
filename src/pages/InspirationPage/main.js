/*eslint-disable*/
// import Vue from 'vue';
import App from './app';
import utils from 'components/utils';
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/normalize.less';
import 'assets/fonticon/iconfont.css';
import 'assets/css/crf.less';
import 'assets/css/crfStyle.less';
import 'assets/css/common.less';
/*import VueRouter from 'vue-router';

Vue.use(VueRouter)*/

// Vue.use(ElementUI);
import install from 'components/utils/install';

Vue.use(install);
import store from '../../store';
import Global from 'components/utils/global';
import 'assets/fonticon/iconfont.css';
import 'assets/fonticon/iconfont.js';
import 'assets/css/common.less';

require('zrender/lib/vml/vml');
require('zrender/lib/svg/svg');
// 如果报prototype无法被识别的错误，可以把原型方法挂在到__proto__
Vue.prototype.$addStorageEvent = function (type, key, data) {
  if (type === 1) {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  } else {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  }
}

let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
    //获取URL
    Vue.prototype.baseURL = JSON.parse(localStorage.getItem('Global')).baseURL;
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
