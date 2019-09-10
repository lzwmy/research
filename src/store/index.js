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
      console.log(state.menuList)
    },
    saveSession_isDislpayArrow(state, payload) {
      state.session_isDislpayArrow = payload.isDislpayArrow;
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
      "itemTree":[]
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

export default store;
