/*eslint-disable*/
import Vue from 'vue';
import App from './app';
import ElementUI from 'element-ui';
import { Loading, MessageBox,Message } from 'element-ui';


import 'element-ui/lib/theme-chalk/index.css';
import 'assets/fonticon/iconfont.css';
import 'assets/css/green/base.less';
import 'assets/css/green/reset.less';
import 'assets/css/blue/base.less';
import 'assets/css/blue/reset.less';
import 'assets/css/common.less';



// 按需引入echarts，引入 ECharts 主模块
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/axisPointer');
require('echarts/lib/component/title');
require('echarts/lib/component/dataZoom');
require('echarts/lib/component/markPoint');
require('echarts/lib/component/toolbox');
Vue.prototype.$echarts = echarts;

let Highcharts = require('highcharts');
// import Highcharts from 'highcharts/highstock';
Vue.prototype.$Highcharts = Highcharts;

Vue.prototype.$mes = function (type, message) {
  Message({
    type: type,
    duration: 1500,
    message: message
  })
}


Vue.use(ElementUI);
import install from 'components/utils/install';

Vue.use(install);
import store from '../../store';
import Global from 'components/utils/global';

let initApp = async () => {
  try {
    //同步获取全局配置；
    await Global.getConfigJson();
    // 引入主题颜色的class样式
    let ccstyle = store.state.user.ccstyle || localStorage.getItem('research_ccstyle') || 'theme-blue';
    // console.warn(ccstyle)
    if (ccstyle == 'theme-green' || ccstyle == 'theme-blue') {
      document.querySelector('body').className = ccstyle;
      store.commit({
        type: 'changeTheme',
        ccstyle: ccstyle
      });
    } else {
      document.querySelector('body').className = 'theme-blue';
      store.commit({
        type: 'changeTheme',
        ccstyle: 'theme-blue'
      });
    }
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
