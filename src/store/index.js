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
    taskMenuList: [], // 科研项目菜单列表
    researchID: sessionStorage.getItem('CURR_RESEARCH_ID') || '',  //科研项目ID
    session_isDislpayArrow: false
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
    saveTaskMenuList(state, list) {
      sessionStorage.setItem('CURR_USER_TASK_MENULIST', JSON.stringify(list));
      state.taskMenuList = list;
    },
    saveSession_isDislpayArrow(state, payload) {
      state.session_isDislpayArrow = payload.isDislpayArrow;
    },
    saveresearchID(state, id) {
      sessionStorage.setItem('CURR_RESEARCH_ID', id);
      state.researchID = id;
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
const CRFConfig = {
  state:{
    basisDataInfo:{},
    layouts:"",
    basisDataList:[],
    basisIndex:0,
  },
  mutations:{
    'CRF_SET_OBJECT':function (state,obj) {
      state.basisDataInfo = {};
      state.basisDataInfo = obj;
    },
    'LAYOUT_SET_OBJECT':function (state,obj) {
      state.layouts = obj;
    },
    'SET_ARRAY':function (state,obj) {
      state.basisDataList = obj;
    },
    'SET_INDEX':function (state,obj) {
      state.basisIndex = obj;
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

const common = {
  state:{
    openMenuView: true  //内页菜单是否展开
  },
  mutations:{
    changeMenuView:function(state,val) {
      state.openMenuView = val
    }
  }
}

var store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
  modules: {
    user,
    crf,
    researchModel,
    common,
    CRFConfig
  },
  getters
});

export default store;
