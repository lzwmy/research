/*eslint-disable*/
import Vue from 'vue';
import App from './app';
import { Form,FormItem,Input, Button, MessageBox, Message } from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$mes = function (type, message) {
  this.$message({
    type: type,
    message: message,
    duration: message.length > 8 ? message.length * 200 : 1500
  })
}
import install from 'components/utils/install';
Vue.use(install);
import store from '../../store';
import Global from 'components/utils/global';

let initApp = async () => {
  try {
    store.commit('USER_SIGNOUT');
    sessionStorage.setItem('CURR_LOGIN_TYPE', 'disease');
    //同步获取全局配置：
    await Global.getConfigJson();

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
