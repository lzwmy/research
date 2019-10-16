/*eslint-disable*/
import Vue from 'vue';
import App from './app';
import utils from 'components/utils';
import { Form,FormItem,Input, Button, MessageBox } from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.prototype.$alert = MessageBox.alert;
import install from 'components/utils/install';
Vue.use(install);
import store from '../../store';
import Global from 'components/utils/global';

let initApp = async () => {
  try {
    //同步获取全局配置：
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
