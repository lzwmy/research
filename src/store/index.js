import Vue from 'vue';
import Vuex from 'vuex';
import utils from 'components/utils';

Vue.use(Vuex);

const USER_SIGNIN = 'USER_SIGNIN'; // 登录成功
const USER_SIGNOUT = 'USER_SIGNOUT'; // 退出登录


const user = {
  state: {
    userLogin: {}, // 登录信息
    account: '', // 登录账号
    routeArr: [], // 每个页面路由元
    menuList: [], // 菜单列表
    session_isDislpayArrow: false,
    ccstyle: '' // 主题颜色
  },
  mutations: {
    [USER_SIGNIN](state, userLogin) {
      sessionStorage.setItem('CURR_USER_RESEARCH_USERINFO', userLogin);
      state.userLogin = JSON.parse(userLogin);
      state.account = JSON.parse(userLogin).name; // 登录账号
    },
    [USER_SIGNOUT](state) {
      sessionStorage.removeItem('CURR_USER_RESEARCH_USERINFO');
      sessionStorage.removeItem('CURR_USER_RESEARCH_MENULIST');
      utils.delCookie('sessionId');
      window.sessionStorage.removeItem('Global');
      state.userLogin = {};
      state.account = '';
      state.routeArr = [];
    },
    saveMenuList(state, payload) {
      sessionStorage.setItem('CURR_USER_RESEARCH_MENULIST', JSON.stringify(payload.params));
      state.menuList = payload.params;
    },
    addRoute(state, routeObj) {
      // if (routeObj.route.name === 'residentInfoDetail') {
      //   state.routeArr.forEach((item, index) => {
      //     if (item.route.name === 'residentInfoDetail') {
      //       item.route = routeObj.route
      //     }
      //   })
      // }

      for (var i = 0; i < state.routeArr.length; i++) {
        if (state.routeArr[i].route.meta.txt === routeObj.route.meta.txt) {
          break;
        }
      }
      // 记录新增路由
      if (i === state.routeArr.length || state.routeArr.length === 0) {
        // debugger
        let myroute = {};
        myroute.historyPath = [routeObj.route];
        myroute.route = routeObj.route;
        state.routeArr.push(myroute);
        // console.log(state.routeArr)
      } else {
        // 新增historyPath
        state.routeArr[i].historyPath.unshift(routeObj.route);
      }
    },
    reduceRoute(state, payload) {
      if (state.routeArr.length === 1 && (state.routeArr[0].route.fullPath === '/index' || state.routeArr[0].route.fullPath === '/')) {
        return false;
      }
      let deleteRoute = state.routeArr.splice(payload.paras.index, 1);// 删除路由并返回被删除路由
      // console.log(deleteRoute)
      if (state.routeArr.length > 0) {
        if (deleteRoute[0].route.meta.txt === payload.paras.vueParent.$route.meta.txt) { // 删除的是当前路由的话，跳转最右边路由
          payload.paras.vueParent.$router.push({ path: state.routeArr[state.routeArr.length - 1].route.fullPath });
        } else { // 删除的不是当前路由的话，保持当前路由,不做任何处理
          // payload.paras.vueParent.$router.push({path: payload.paras.vueParent.$route.fullPath})
        }
      } else {
        payload.paras.vueParent.$router.push({ name: 'index' });
      }
      // console.log(state.routeArr)
    },
    forceReduceRoute(state, payload) {
      state.routeArr.splice(payload.paras.index, 1);// 删除路由并返回被删除路由
    },
    closeAllRoute(state, payload) {
      if (state.routeArr.length === 1) {
        return false;
      } else {
        state.routeArr = [];
      }
      payload.paras.vueParent.$router.push({ name: 'index' });
      if (payload.paras.vueParent.$route.name == 'index' || payload.paras.vueParent.$route.name == '/') {
        payload.paras.vueParent.$store.commit({// 当关闭所有时，当前路由是index，由于routeArr清空了，所以需要把当前路由加进去
          type: 'addRoute',
          route: payload.paras.vueParent.$route
        });
      }
    },
    saveSession_isDislpayArrow(state, payload) {
      state.session_isDislpayArrow = payload.isDislpayArrow;
    },
    changeTheme(state, payload) {
      state.ccstyle = payload.ccstyle;
      localStorage.setItem('research_ccstyle', payload.ccstyle);
    }
  },
  actions: {}
};

const crf = {
  state: {
    crfCurrentControl: {},
    crfBindingData: { item: null, index: null, rootBinding: null },
    crfViewList: null,
    crfPatientId: null, // 用户记录当前报告的病人ID，在自动获取数据时使用
    crfIsNewReport: true // 判断是否是新建的报告如果是则加载时默认开启自动获取数据功能
  },
  mutations: {
    'CRF_SET_DATA': function (state, obj) {
      state.crfBindingData = obj;
    },
    'CRF_CHANGE_CONTROL': function (state, obj) {
      state.crfCurrentControl = obj;
    },
    'CRF_SET_VIEWLIST': function (state, obj) {
      state.crfViewList = obj;
    },
    'CRF_SET_REPORT_STATUS': function (state, obj) {
      state.crfIsNewReport = obj;
    },
    'CRF_SET_PATIENTID': function (state, obj) {
      state.crfPatientId = obj;
    }
  },
  actions: {}
}
const researchModel = {
  state:{
    researchData:{},
    filterItem:{
      "controlType":"",
      "displayName":"",
      "operator":"", //操作
      "value1":"",
      "value2":"",
      "itemTree":[
        // {
        //     "name":"首页"
        // },
        // {
        //     "name":"首页"
        // }
      ]
    },
  },
  mutations:{
    'STATE_GRAY':function(state,obj) {
      state.researchData = obj
    },
    'ADD_CONDITION':function (state,obj) {
      state.researchData.nodeList.push(obj)
    },
    "OUTER_PUSH":function(state,obj) {
      state.researchData = obj;
    },
    "SET_FILTER":function (state,obj) {
      state.filterItem = obj;
    }
  },
  actions: {}
}

const getters = {
  crfBindingData: state => {
    return state.crf.crfBindingData;
  },
  crfCurrentControl: state => {
    return state.crf.crfCurrentControl;
  },
  crfViewList: state => {
    return state.crf.crfViewList;
  },
  crfIsNewReport: state => {
    return state.crf.crfIsNewReport;
  },
  crfPatientId: state => {
    return state.crf.crfPatientId;
  }
};

var store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
  modules: {
    user,
    crf,
    researchModel
  },
  getters
});

// 读取./src/子路由配置
// import config  from '../../../../src/config/config'

// if (config.childStore) {
//      var child = require('../../../../src/config/store');
//     if (Array.isArray(child)) {
//         for (let i = 0; i < child.length; i++) {
//             store.registerModule(child[i].name, child[i].value)
//         }
//     }
// }

export default store;
