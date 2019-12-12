/*eslint-disable*/
// import Vue from 'vue';
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
import utils from 'components/utils';
import Global from 'components/utils/global';

let initApp = async () => {
  try {
    store.commit('saveDiseaseInfo',{
      diseaseId: utils.getQuery('id'), 
      isAdmin: false,
      roles: [],
      orgCode: '',      //组织机构
      doctor: ''      //医生
    });
    //同步获取全局配置：
    await Global.getConfigJson();
    // 同步验证缓存的token有没有在登录有效期 和 是否是在专病下登录
    if(store.state.user.token && localStorage.getItem('CURR_LOGIN_TYPE') == 'disease') {
      await utils.checkToken();
    }
    localStorage.setItem('CURR_LOGIN_TYPE', 'disease');
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
