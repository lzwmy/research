import Vue from 'vue';
import Vuex from 'vuex';
import utils from 'components/utils';

Vue.use(Vuex);

const USER_SIGNIN = 'USER_SIGNIN'; // 登录成功
const USER_SIGNOUT = 'USER_SIGNOUT'; // 退出登录

//科研项目信息
let CURR_RESEARCH_INFO =  JSON.parse(sessionStorage.getItem('CURR_RESEARCH_INFO'));

//权限验证 参数1： 用户角色  参数2：有权限的角色
const judgeAuth = function(arr1, arr2) {
  if(!arr1 || !arr2){
    return false;
  }
  let isExist = false;
  arr1.forEach(item=>{
    arr2.forEach(li=>{
        if(item === li) {
            isExist = true;
        }
    })
  })
  if(isExist) {
      return true;
  }
  return false;
}

const user = {
  state: {
    userLogin: {}, // 登录信息
    account: '', // 登录账号
    routeArr: [], // 每个页面路由元
    menuList: [], // 菜单列表
    taskMenuList: JSON.parse(sessionStorage.getItem('CURR_USER_TASK_MENULIST'))?JSON.parse(sessionStorage.getItem('CURR_USER_TASK_MENULIST')):[], // 科研项目菜单列表
    //科研项目数据 
    researchInfo: {
      subjectInfoId: CURR_RESEARCH_INFO.subjectInfoId?CURR_RESEARCH_INFO.subjectInfoId:'',
      centerModel: CURR_RESEARCH_INFO.centerModel?CURR_RESEARCH_INFO.centerModel:'',  //1单中心，2多中心
      roles: CURR_RESEARCH_INFO.roles?CURR_RESEARCH_INFO.roles:[],    //1、管理员(所有权限)  2、分中心管理员（无权添加中心） 3、数据录入员 4、数据管理员（导出数据）
    },
    //科研项目权限
    researchAuth: {
      authImport: judgeAuth(CURR_RESEARCH_INFO.roles?CURR_RESEARCH_INFO.roles:[],['1','2','3']),  //导入授权
      authExport: judgeAuth(CURR_RESEARCH_INFO.roles?CURR_RESEARCH_INFO.roles:[],['1','2','4']),  //导出授权
      authAddCenter:judgeAuth(CURR_RESEARCH_INFO.roles?CURR_RESEARCH_INFO.roles:[],['1']),  //添加中心授权
    },
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
      sessionStorage.setItem('CURR_USER_TASK_MENULIST', JSON.stringify(list.params));
      state.taskMenuList = list.params;
    },
    saveSession_isDislpayArrow(state, payload) {
      state.session_isDislpayArrow = payload.isDislpayArrow;
    },
    saveresearchInfo(state, data) {
      sessionStorage.setItem('CURR_RESEARCH_INFO', JSON.stringify(data));
      state.researchInfo = data;
      state.authImport = judgeAuth(data.roles,['1','2','3']);  //导入授权
      state.authExport = judgeAuth(data.roles,['1','2','4']);  //导出授权
      state.authAddCenter = judgeAuth(data.roles,['1']);  //添加中心授权
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
