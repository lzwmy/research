import Vue from 'vue';
import store from '../../store';
import { MessageBox, Menu } from 'element-ui';

const vm = new Vue();

// 获取url参数
const getQuery = function (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
// 获取url参数
const getQueryString = function(name) {  
  if(window.location.href.indexOf(name) == -1) {
      return null;
  }
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
  var params = window.location.href.split('?')[1];
  var r = params.match(reg);  
  if (r != null) return unescape(r[2]);  
  return null;  
};

// 时间格式转化
// 2014-12-03T03:01:00.000Z => 2014-12-03 03:01:00   或时间戳=> 2014-12-03 03:01:00
const dateTimeConvert = function (dateTime) {
  if (dateTime == '' || dateTime == null || dateTime == undefined) {
    return dateTime;
  }
  let date = new Date(dateTime).toLocaleDateString().replace(/\//g, '-');
  const a = date.split('-');
  date = a[0] + '-' + (a[1].length === 2 ? a[1] : ('0' + a[1].toString())) + '-' + (a[2].length === 2 ? a[2] : ('0' + a[2].toString()));
  const time = dateTime.toString().match(new RegExp(/\d{2}:\d{2}:\d{2}/));
  const actural = (time && time[0]) || '';

  return date + ' ' + actural;
};

// 时间格式转化,type='date','month' 'year'
// 2014-12-03T03:01:00.000Z => 2014-12-03
const formateDate = function (date, type = 'date') {
  if (!date) {
    return '';
  }
  let year = new Date(date).getFullYear();
  let month = new Date(date).getMonth() + 1;
  let day = new Date(date).getDate();
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  if (type == 'date') {
    return year + '-' + month + '-' + day;
  }
  if (type == 'month') {
    return year + '-' + month;
  }
  if (type == 'year') {
    return year;
  }
};

/** 获取当前日期在当前年第几周函数封装，例如2013-08-15 是当前年的第32周**/
function getWeek (day) {
  var totalDays = 0;
  var now = day;
  var years = now.getYear();
  if (years < 1000) { years += 1900; }
  var days = new Array(12);
  days[0] = 31;
  days[2] = 31;
  days[3] = 30;
  days[4] = 31;
  days[5] = 30;
  days[6] = 31;
  days[7] = 31;
  days[8] = 30;
  days[9] = 31;
  days[10] = 30;
  days[11] = 31;

  // 判断是否为闰年，针对2月的天数进行计算
  if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
    days[1] = 29;
  } else {
    days[1] = 28;
  }

  if (now.getMonth() == 0) {
    totalDays = totalDays + now.getDate();
  } else {
    var curMonth = now.getMonth();
    for (var count = 1; count <= curMonth; count++) {
      totalDays = totalDays + days[count - 1];
    }
    totalDays = totalDays + now.getDate();
  }
  // 得到第几周
  var week = Math.round(totalDays / 7) + 1;
  return week;
}

// 获取cookie
const getCookie = function (name) {
  var arr;
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) {
    return (arr[2]);
  } else {
    return null;
  }
};

// 设置cookie,增加到vue实例方便全局调用
const setCookie = function (cName, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
};

// 删除cookie
const delCookie = function (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString(); }
};

// js触发事件
const trigger = function (eventName, ClassOrId) {
// IE
  if (document.all) {
    document.querySelector(ClassOrId).click();
  } else { // 其它浏览器
    var e = document.createEvent('MouseEvents');
    e.initEvent(eventName, true, true); // 这里的eventName可以换成你想触发的行为
    document.querySelector(ClassOrId).dispatchEvent(e); // 这里的ClassOrId可以换成你想触发行为的DOM结点class或ID
  }
};

/**
 * Created by hh on 17/11/29.
 *深度克隆对象,最完整的deepclone，考虑了循环引用
 *@param {object} [obj] [需要深度克隆的对象]
 *@return {object} [newobj] [返回克隆后的新对象]
 */
// const deepClone = function (obj) {
//   var str, newobj = obj.constructor === Array ? [] : {};
//   if (typeof obj !== 'object') {
//     return;
//   } else if (window.JSON) {
//     str = JSON.stringify(obj); //序列化对象
//     newobj = JSON.parse(str); //还原
//   } else {
//     for (var i in obj) {
//       newobj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
//     }
//   }
//   return newobj;
// }

const deepClone = function (obj, parent = null) {
  if (typeof obj !== 'object') {
    return obj;
  } else {
    // 创建一个新对象
    let result = obj.constructor === Array ? [] : {};
    let keys = Object.keys(obj);
    let key = null;
    let temp = null;
    let _parent = parent;
    // 该字段有父级则需要追溯该字段的父级
    while (_parent) {
      // 如果该字段引用了它的父级则循环引用
      if (_parent.originalParent === obj) {
        // 循环引用直接返回同级的新对象
        return _parent.currentParent;
      }
      _parent = _parent.parent;
    }
    for (let i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      temp = obj[key];
      // 如果字段的值也是一个对象
      if (temp && typeof temp === 'object') {
        // 递归执行深拷贝 将同级别的待拷贝对象与新对象传递给parent方便追溯循环引用
        result[key] = deepClone(temp, {
          originalParent: obj,
          currentParent: result,
          parent: parent
        });
      } else {
        result[key] = temp;
      }
    }
    return result;
  }
};

/**
 * Created by hh on 17/11/29.
 *定义一个排序比较器,降序函数，从大到小
 *@param {String} [propertyName] [属性名]
 *@return {Number}
 */
const compareDescending = function (prop1, prop2) {
  return function (obj1, obj2) {
    var val1 = obj1[prop1][prop2];
    var val2 = obj2[prop1][prop2];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 > val2) {
      return -1;
    } else if (val1 < val2) {
      return 1;
    } else {
      return 0;
    }
  };
};

/**
 * Created by hh on 17/11/29.
 *定义一个排序比较器,升序,从小到大Ascending
 *@param {String} [propertyName] [属性名]
 *@return {Number}
 */
const compareAscending = function (propertyName) {
  return function (object1, object2) {
    var value1 = Number(object1[propertyName]);
    var value2 = Number(object2[propertyName]);
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return -1;
    } else {
      return 0;
    }
  };
};

/**
 * Created by hh on 17/11/29.
 *对过长文字进行换行
 *@param {String，number} [val] [需要的整判断的参数] [n] [第几个位置换行]
 *@return {String} [返回str]
 */
const formatLongStr = function (val, n) {
  var str = '';
  if (val) {
    str = val.split('', 1);
    for (var i = 1; i < val.length; i++) {
      str += val[i];
      if (!(i % n)) {
        str += '\n';
      }
    }
  }
  return str;
};

/**
 * Created by hh on 17/12/20.
 *判空 公用方法
 *@param {String、undefined、null} [str] [需要的整判断的参数]
 *@return {String} [返回判断的str，如果str非法，则返回字符串0]
 */
const strIsNaN = function (str) {
  if (str) {
    return str;
  }
  return '0';
};

/**
 * Created by hh on 18/1/20.
 *获取之前N个月的第一天,为了兼容IE所以用/连接时间
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const getPreMonthStartDate = function (N) {
  var now = new Date(); // 当前日期
  var nowMonth = now.getMonth(); // 当前月
  var nowYear = now.getFullYear(); // 当前年
  var monthStartDate = new Date(nowYear, nowMonth - N, 1);
  return monthStartDate;
};

/**
 * Created by hh on 17/12/20.
 *获取当前月的第一天和最后一天,为了兼容IE所以用/连接时间
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const getFirstAndLastDate = function () {
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let day = new Date(year, month, 0);
  let firstdate = year + '/' + month + '/01' + ' 00:00:01';
  let lastdate = year + '/' + month + '/' + day.getDate() + ' 00:00:00';
  let firstAndLastDate = {
    firstdate: firstdate,
    lastdate: lastdate
  };
  return firstAndLastDate;
};

// 菜单排序
const handleMenuList = (menuList) => {
  let handleAfrerMenuList = [];
  menuList.forEach((menuItem1) => {
    menuItem1.children = [];
    if (menuItem1.menuLevel == 2) {
      menuList.forEach((menuItem2) => {
        if (menuItem1.menuCode === menuItem2.superiorMenu) {
          menuItem1.children.push(menuItem2);
        }
      });
      menuItem1.children.sort(compareAscending('menuOrder'));
      handleAfrerMenuList.push(menuItem1);
    }
  });
  menuLevel3(menuList,handleAfrerMenuList);
  handleAfrerMenuList.sort(compareAscending('menuOrder'));
  return handleAfrerMenuList;
};

const menuLevel3 = function(menuList,arr) {
  arr.forEach(leve1=>{
    leve1.children.forEach(leve2=>{
      leve2.children = [];
      menuList.forEach(item=>{
        if(item.menuLevel == 4 && leve2.menuCode == item.superiorMenu){
          leve2.children.push(item)
        }
      })
    })
  })

};

// 获取菜单列表
const loadMenuInfo = () => {
  return new Promise((resolve, reject) => {
    vm.$post('/auth/menus.do').then((response) => {
      let data = response;
      if (data.code == 0) {
        let menuList = data.data.menus;
        if (menuList.length > 0) {
          let handleAfrerMenuList = handleMenuList(menuList);
          store.commit({
            type: 'saveMenuList',
            params: handleAfrerMenuList
          });
          resolve(handleAfrerMenuList);
        } else {
          handleSsoLogout();
        }
      } else {
        handleSsoLogout();
      }
    }).catch(() => {
      handleSsoLogout();
    });
  });
};

const handleSsoLogout = () =>{
  MessageBox.confirm('系统错误，请联系系统管理员！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showCancelButton: false
  }).then(() => {
    ssoLogout();
  }).catch((errors) => {
    ssoLogout();
  });
}

/**
 * Created by hh on 18/01/03.
 *退出
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const ssoLogout = () => {
  try {
    vm.$get('/auth/logout.do?t=' + (+new Date()))
    then(function (response) {
      store.commit('USER_SIGNOUT');
      window.location.href = './login.html';
    })
    .catch(function (error) {
      console.log(error);
      store.commit('USER_SIGNOUT');
      window.location.href = './login.html';
    });
  } catch (err) {
    store.commit('USER_SIGNOUT');
    window.location.href = './login.html';
  }
};

const getOrgData = () => {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('ORGDATA') && sessionStorage.getItem('ORGDATA').length > 0) {
      resolve(JSON.parse(sessionStorage.getItem('ORGDATA')));
    } else {
      let CURR_USER = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE'));
      let Global = JSON.parse(sessionStorage.getItem('Global'));
      let params = {
        'ORG_CODE': 'ZTEICT_ROOT_ORG',
        'esblover': false,
        'STATES': '0',
        'SERVICE_CODE': 'bull.MedCoreInterface.Core_Organization_Info',
        'CONSUMER_ID': CURR_USER.CONSUMER_ID
      };
      vm.$axios({
        method: 'post',
        url: Global.thirdServiceBaseURL + '/serviceProxy/servlet/?t=' + (+new Date()),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // 以表单格式传递表单对象
        data: params
      }).then(function (response) {
        let data = response.data;
        if (data.SYS_HEAD.RET_STATUS == 'S') {
          let itemCache = [];
          let isHasAll = false;
          for (let i = 0, len = data.BODY.data.length; i < len; i++) {
            if (data.BODY.data[i].ORG_NAME === '全部') {
              isHasAll = true;
              itemCache.unshift({'code': data.BODY.data[i].ORG_CODE, 'desc': data.BODY.data[i].ORG_NAME});
            } else {
              itemCache.push({'code': data.BODY.data[i].ORG_CODE, 'desc': data.BODY.data[i].ORG_NAME});
            }
          }
          if (!isHasAll) {
            itemCache.unshift({'code': '', 'desc': '全部'});
          }
          sessionStorage.setItem('ORGDATA', JSON.stringify(itemCache));
          resolve(JSON.parse(sessionStorage.getItem('ORGDATA')));
          // console.log(itemCache)
        } else {
          reject(new Error());
        }
      });
    }
  }).catch((errors) => {
    reject();
    console.log(errors);
  });
};

// 列表中删除某一条数据后，重新获取列表的第几页的数据
const getDelPageNumber = function (pageNo, pageSize, totalCount) {
  if (pageNo * pageSize >= totalCount) {
    if (pageSize == 1) {
      pageNo = pageNo - 1;
    } else {
      var lastRow = totalCount % pageSize;
      if (lastRow == 1) {
        pageNo = pageNo - 1;
      }
    }
  }
  if (pageNo <= 0) {
    pageNo = 1;
  }
  return pageNo;
};

// 获取当前年费
const getCurrentYear = function () {
  var now = new Date();
  return now.getFullYear();
};

// 业务时间处理为季度
const formatBusinessSeason = function (seasonCode) {
  if (seasonCode) {
    var year = seasonCode.substring(0, 4);
    var code = seasonCode.substring(4);
    if (code == '01') {
      return year + '年第一季度';
    } else if (code == '02') {
      return year + '年第二季度';
    } else if (code == '03') {
      return year + '年第三季度';
    } else if (code == '04') {
      return year + '年第四季度';
    }
  }
  return seasonCode;
};

// 季度处理为业务时间
const formatBusinessDate = function (season) {
  if (season) {
    var year = season.substring(0, 4);
    var seasonCode = season.substring(4);
    if (seasonCode == '年第一季度') {
      return year + '01';
    } else if (seasonCode == '年第二季度') {
      return year + '02';
    } else if (seasonCode == '年第三季度') {
      return year + '03';
    } else if (seasonCode == '年第四季度') {
      return year + '04';
    }
  }
  return season;
};

// 业务时间处理为上下半年
const formatBusinessYear = function (yearCode) {
  if (yearCode) {
    var year = yearCode.substring(0, 4);
    var code = yearCode.substring(4);
    if (code == '01') {
      return year + '年上半年';
    } else if (code == '02') {
      return year + '年下半年';
    }
  }
  return yearCode;
};

const containInArray = function (str, array, key) {
  for (let i = 0, len = array.length; i < len; i++) {
    if (array[i][key] === str) {
      return true;
    }
  }
  return false;
};

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
const isInArray = function (arr, value) {
  for (var i = 0; i < arr.length; i++) {
    console.log(arr[i])
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
};

/**
 * 使用循环的方式判断一个属性是否存在于一个数组对象中
 * @param {Object} arr 数组
 * @param {Object} key 属性
 * @param {Object} value 属性值
 */
const isInArrayObject = function (arr, key,value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i][key]) {
      return true;
    }
  }
  return false;
  // this.arr.some((item)=>{
  //   return item.value === value
  // })
};

/**
 * 函数节流，有些执行的函数会执行很多次，比如window.resize,scroll等，但是实际并不需要这么多的次数，所以需要节流执行；
 * @param {fn} fn 需要节流的函数
 * @param {number} interval 需要延迟的时间
 */
const throttle = function (fn, interval) {
  let __self = fn;
  let timer;
  let firstTime = true;
  return function () {
    let args = arguments;
    let __me = this;
    if (firstTime) {
      __self.apply(__me, args);
      return (firstTime = false);
    }
    if (timer) {
      return false;
    }
    timer = setTimeout(function () {
      clearTimeout(timer);
      timer = null;
      __self.apply(__me, args);
    }, interval || 1000);
  };
};

/**
 * 为旧浏览器提供它没有原生支持的数组查找方法；
 */
const defineArrayFind = function () {
  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return k;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return -1.
        return -1;
      },
      configurable: true,
      writable: true
    });
  }
};

const validLoginAuthenticated = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await vm.$http.authLoginValidAuthenticated();
      data = data.data;
      if (data && data.code == '0' && data.data) {
        let userLogin = {
          name: data.data.name,
          permissionCodes: data.data.permissionCodes,
          roleCodes: data.data.roleCodes,
          sessionId: data.data.sessionId,
          userId: data.data.userId
        };
        store.commit('USER_SIGNIN', JSON.stringify(userLogin));
        let url = getQuery('url');
        if (url) {
          window.location.href = url;
        } else {
          window.location.href = './index.html#/index';
        }
      } else {
        resolve();
      }
    } catch (err) {
      store.commit('USER_SIGNOUT');
      reject(err);
    }
  });
};

const validIndexAuthenticated = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await vm.$http.authIndexValidAuthenticated();
      if (data && data.code == '0' && data.data) {
        let userLogin = {
          name: data.data.name,
          permissionCodes: data.data.permissionCodes,
          roleCodes: data.data.roleCodes,
          sessionId: data.data.sessionId,
          userId: data.data.userId
        };
        store.commit('USER_SIGNIN', JSON.stringify(userLogin));
        resolve(userLogin);
      }
    } catch (err) {
      store.commit('USER_SIGNOUT');
      window.location.href = './login.html';
    }
  });
};

const calculationAge = function(strBirthday) {
  var strBirthdayArr = strBirthday.split('-');
  var dateNow = new Date();
  var yearDiff = dateNow.getFullYear() - strBirthdayArr[0];
  var monthDiff = (dateNow.getMonth() + 1) - strBirthdayArr[1];
  var dayDiff = dateNow.getDate() - strBirthdayArr[2];
  var age = monthDiff <= 0 || (monthDiff==0 && dayDiff<=0)?yearDiff-1:yearDiff; //判断有没有到生日,没到就减1
  return age = age<0?0:age;
}

const deepCopy = function(o) {
  if (o instanceof Array) {
    var n = [];
    for (var i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]); 
    } 
    return n; 
  }else if  (o instanceof Object) {
    var n = {}; 
    for (var i in o) {
      n[i] = deepCopy(o[i]); 
    } 
    return n; 
  } else { 
    return o; 
  } 
}




export default {
  getQuery,
  getQueryString,
  dateTimeConvert,
  formateDate,
  getCookie,
  setCookie,
  delCookie,
  trigger,
  deepClone,
  compareAscending, // 升序
  compareDescending, // 降序
  formatLongStr,
  strIsNaN,
  getFirstAndLastDate,
  ssoLogout, // 退出
  loadMenuInfo, // 获取菜单
  getOrgData, // 获取登陆账号的组织机构信息
  getPreMonthStartDate, // 获取之前N个月的第一天
  getDelPageNumber, // 删除某条数据后，需要获取哪一页的数据
  getCurrentYear, // 获得当前年费
  formatBusinessSeason, // 业务时间处理为季度
  formatBusinessDate, // 季度处理为业务时间
  formatBusinessYear, // 业务时间处理为上下半年
  handleMenuList, // 菜单排序
  containInArray, // 字符串是否包含在数组中
  isInArray, // 判断一个元素是否存在于一个数组中
  isInArrayObject, //判断一个属性是否存在于一个数组对象中
  getWeek, // 获取某一天属于一年的第几周
  throttle, // 函数节流，有些执行的函数会执行很多次
  defineArrayFind, // 为旧浏览器提供它没有原生支持的数组查找某个对象的方法findIndex，返回索引；
  validIndexAuthenticated, // 验证首页浏览器自带的session有没有在登录有效期
  validLoginAuthenticated, // 验证登录页浏览器自带的session有没有在登录有效期
  calculationAge,    //根据出生年月日计算周岁
  deepCopy,   //深克隆
};
