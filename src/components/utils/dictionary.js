/** dictionary utils */
// import axios from 'axios';

const dictionaryCache = new Map();

// 系统管理
// 用户管理--用户账号状态 USER_STATUS
dictionaryCache.set('USER_STATUS', [
  {'code': '', 'desc': '请选择'},
  {'code': '0', 'desc': '启用'},
  {'code': '1', 'desc': '禁用'}
]);

// 性别 GENDER
dictionaryCache.set('GENDER', [
  {'code': '', 'desc': '请选择'},
  {'code': '男', 'desc': '男'},
  {'code': '女', 'desc': '女'}
]);

// 异步获取的字典使用Promise

// 请求公用方法
const getOption = (datas, options, resolve, reject) => {
  let Global = JSON.parse(localStorage.getItem('Global'));
  let sendAxios = (datas, options, resolve, reject) => {
    axios({
      method: 'post',
      url: '/std/dict/getDictValue?t=' + (+new Date()),
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},//以表单格式传递表单对象
      data: datas
    }).then(function (response) {
      let data = response.data;
      if (data.SYS_HEAD.RET_STATUS == 'S') {
        let datas = data.BODY.data;
        if (options == 'DOSAGE' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'DOSAGE', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'DEFAULTUSAGE' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'DEFAULTUSAGE', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'STATISTICSCATEGORY' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'STATISTICSCATEGORY', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'STD_TYPE' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'STD_TYPE', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'STD_CATEGORY' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'STD_CATEGORY', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'DEPT_CATEGORY' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'DEPT_CATEGORY', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'GENERAL_CATEGORY' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'GENERAL_CATEGORY', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'MEDICAL_RESOURCE' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'MEDICAL_RESOURCE', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        if (options == 'STD_GROUP' && datas && datas.length > 0) {
          let itemCache = [];
          for (let i = 0, len = datas.length; i < len; i++) {
            itemCache.push({'code': datas[i].ITEM_CODE, 'desc': datas[i].ITEM_NAME});
          }
          localStorage.setItem(Global.iam_clientid + 'STD_GROUP', JSON.stringify(itemCache));
          resolve(itemCache);
        }
      }
    }).catch(function (error) {
      reject(error);
      console.log(error);
    });
  };
  if (options == 'DOSAGE') {
    let PRINCIPAL_TITLE_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'DOSAGE'));
    if (PRINCIPAL_TITLE_LIST && PRINCIPAL_TITLE_LIST.length > 0) {
      resolve(PRINCIPAL_TITLE_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'DEFAULTUSAGE') {
    let PRINCIPAL_TITLE_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'DEFAULTUSAGE'));
    if (PRINCIPAL_TITLE_LIST && PRINCIPAL_TITLE_LIST.length > 0) {
      resolve(PRINCIPAL_TITLE_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'STATISTICSCATEGORY') {
    let PRINCIPAL_TITLE_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'STATISTICSCATEGORY'));
    if (PRINCIPAL_TITLE_LIST && PRINCIPAL_TITLE_LIST.length > 0) {
      resolve(PRINCIPAL_TITLE_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'STD_TYPE') {
    let STD_TYPE_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'STD_TYPE'));
    if (STD_TYPE_LIST && STD_TYPE_LIST.length > 0) {
      resolve(STD_TYPE_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'STD_CATEGORY') {
    let STD_CATEGORY_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'STD_CATEGORY'));
    if (STD_CATEGORY_LIST && STD_CATEGORY_LIST.length > 0) {
      resolve(STD_CATEGORY_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'DEPT_CATEGORY') {
    let DEPT_CATEGORY_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'DEPT_CATEGORY'));
    if (DEPT_CATEGORY_LIST && DEPT_CATEGORY_LIST.length > 0) {
      resolve(DEPT_CATEGORY_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'GENERAL_CATEGORY') {
    let GENERAL_CATEGORY_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'GENERAL_CATEGORY'));
    if (GENERAL_CATEGORY_LIST && GENERAL_CATEGORY_LIST.length > 0) {
      resolve(GENERAL_CATEGORY_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'MEDICAL_RESOURCE') {
    let MEDICAL_RESOURCE_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'MEDICAL_RESOURCE'));
    if (MEDICAL_RESOURCE_LIST && MEDICAL_RESOURCE_LIST.length > 0) {
      resolve(MEDICAL_RESOURCE_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
  if (options == 'STD_GROUP') {
    let STD_GROUP_LIST = JSON.parse(localStorage.getItem(Global.iam_clientid + 'STD_GROUP'));
    if (STD_GROUP_LIST && STD_GROUP_LIST.length > 0) {
      resolve(STD_GROUP_LIST);
    } else {
      sendAxios(datas, options, resolve, reject);
    }
  }
};

// 药物剂型
const GET_DOSAGE = () => {
  return new Promise((resolve, reject) => {
    let Global = JSON.parse(localStorage.getItem('Global'));
    let CONSUMER_ID = localStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
    let data = {
      'BASEDATACLASS_CODE': 'CV08.50.002',
      'SERVICE_CODE': 'bull.MedBaseInterface.Base_Data_Detail_Info',
      'CONSUMER_ID': CONSUMER_ID,
      'esblover': false
    };
    getOption(data, 'DOSAGE', resolve, reject);
  });
};
// 默认用法
const GET_DEFAULTUSAGE = () => {
  return new Promise((resolve, reject) => {
    let Global = JSON.parse(localStorage.getItem('Global'));
    let CONSUMER_ID = localStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
    let data = {
      'BASEDATACLASS_CODE': 'CV06.00.102',
      'SERVICE_CODE': 'bull.MedBaseInterface.Base_Data_Detail_Info',
      'CONSUMER_ID': CONSUMER_ID,
      'esblover': false
    };
    getOption(data, 'DEFAULTUSAGE', resolve, reject);
  });
};
// 统计分类
const GET_STATISTICSCATEGORY = () => {
  return new Promise((resolve, reject) => {
    let Global = JSON.parse(localStorage.getItem('Global'));
    let CONSUMER_ID = localStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
    let data = {
      'BASEDATACLASS_CODE': 'ZDY_MEDICATION_CATEGORY',
      'SERVICE_CODE': 'bull.MedBaseInterface.Base_Data_Detail_Info',
      'CONSUMER_ID': CONSUMER_ID,
      'esblover': false
    };
    getOption(data, 'STATISTICSCATEGORY', resolve, reject);
  });
};

// 标准类型：STD_TYPE
const GET_STD_TYPE = () => {
  return new Promise((resolve, reject) => {
    let data = {
      'BASEDATACLASS_CODE': 'STD_TYPE'
    };
    getOption(data, 'STD_TYPE', resolve, reject);
  });
};

// 标准分组：STD_CATEGORY
const GET_STD_CATEGORY = () => {
  return new Promise((resolve, reject) => {
    let data = {
      'BASEDATACLASS_CODE': 'STD_CATEGORY'
    };
    getOption(data, 'STD_CATEGORY', resolve, reject);
  });
};

// 科室类别：DEPTYPE
const GET_DEPTYPE = () => {
  return new Promise((resolve, reject) => {
    let data = {
      'BASEDATACLASS_CODE': 'DEPT_CATEGORY'
    };
    getOption(data, 'DEPT_CATEGORY', resolve, reject);
  });
};

// 通用字典类别：GENERAL_CATEGORY
const GET_GENERAL_CATEGORY = () => {
  return new Promise((resolve, reject) => {
    let data = {
      'BASEDATACLASS_CODE': 'GENERAL_CATEGORY'
    };
    getOption(data, 'GENERAL_CATEGORY', resolve, reject);
  });
};

// 对照管理：医疗资源MEDICAL_RESOURCE
const GET_MEDICAL_RESOURCE = () => {
  return new Promise((resolve, reject) => {
    let data = {
      'BASEDATACLASS_CODE': 'MEDICAL_RESOURCE'
    };
    getOption(data, 'MEDICAL_RESOURCE', resolve, reject);
  });
};

// 版本管理中的标准所属 改成从接口获取
const GET_STD_GROUP = () => {
  return new Promise((resolve, reject) => {
    let data = {
      'BASEDATACLASS_CODE': 'STD_GROUP'
    };
    getOption(data, 'STD_GROUP', resolve, reject);
  });
};

export default {
  options: (categoryCode) => {
    return dictionaryCache.get(categoryCode);
  },
  GET_DOSAGE,
  GET_DEFAULTUSAGE,
  GET_STATISTICSCATEGORY,
  GET_STD_TYPE,
  GET_STD_CATEGORY,
  GET_DEPTYPE,
  GET_GENERAL_CATEGORY,
  GET_MEDICAL_RESOURCE,
  GET_STD_GROUP
};
