// import Vue from 'vue';
import store from '../../store/index';
import { MessageBox, Menu } from 'element-ui';
import Global from 'components/utils/global';
import CryptoJS from '../../../static/js/crypto-js'

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
          } 
        } else {
          ssoLogout();
        }
      }).catch((err) => {
        ssoLogout();
      });
  });
};


const getOrgData = () => {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem('ORGDATA') && localStorage.getItem('ORGDATA').length > 0) {
      resolve(JSON.parse(localStorage.getItem('ORGDATA')));
    } else {
      let CURR_USER = JSON.parse(localStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE'));
      let Global = JSON.parse(localStorage.getItem('Global'));
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
          localStorage.setItem('ORGDATA', JSON.stringify(itemCache));
          resolve(JSON.parse(localStorage.getItem('ORGDATA')));
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

const checkToken = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await vm.$http.ckeckTokenAPI();
      if (res.data.code == '0' && res.data.data) {
        // 跳转至主页
        let isResearch = localStorage.getItem('CURR_LOGIN_TYPE') == 'research';
        let isDisease = localStorage.getItem('CURR_LOGIN_TYPE') == 'disease';
        let subjectInfoId = store.state.user.researchInfo.subjectInfoId;
        let diseaseId = store.state.user.diseaseInfo.diseaseId;
        if (isDisease) {
          window.location.href = './#/diseaseChart?id=' + diseaseId;
        } else if (isResearch) {
          window.location.href = './#/projectProgress';
        } else {
          window.location.href = './#/index';
        }
        resolve();
      } else {
        ssoLogout();
        reject();
      }
    } catch (err) {
      ssoLogout();
      reject();
    }
  });
};

/**
 * Created by hh on 18/01/03.
 *退出
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const ssoLogout = async() => {
  //登录来源
  let  isResearch = localStorage.getItem('CURR_LOGIN_TYPE') == "research";
  let  isDisease = localStorage.getItem('CURR_LOGIN_TYPE') == "disease";
  let subjectInfoId =  store.state.user.researchInfo.subjectInfoId;
  let diseaseId = store.state.user.diseaseInfo.diseaseId
  try {
    store.commit('USER_SIGNOUT');
    vm.$get('/auth/logout.do?t=' + (+new Date()))
    then(function (response) {
      if(isDisease) {
        window.location.href = './loginDisease.html?id='+diseaseId;
      }else if(isResearch) {
        window.location.href = './loginResearch.html?id='+subjectInfoId;
      }else {
        window.location.href = './login.html';
      }
    })
    .catch(function (error) {
      console.log(error);
      if(isDisease) {
        window.location.href = './loginDisease.html?id='+diseaseId;
      }else if(isResearch) {
        window.location.href = './loginResearch.html?id='+subjectInfoId;
      }else {
        window.location.href = './login.html';
      }
    });
  } catch (err) {
    if(isDisease) {
      window.location.href = './loginDisease.html?id='+diseaseId;
    }else if(isResearch) {
      window.location.href = './loginResearch.html?id='+subjectInfoId;
    }else {
      window.location.href = './login.html';
    }
  }
};


const deleteFileId = function (id) {
  return new Promise(async (resolve, reject) => {
    let params = {
      file_id: id
    }
    try {
      let res = await vm.$http.deleteFileId(params);
      if (res && res.code == '0' && res.data) {
        resolve();
      }else {
        reject(res.msg);
      }
    } catch (err) {
      reject(res.msg);
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

const handleTableScorll = function() {
  if(!document.querySelector('.el-table')) {
    return;
  }
  let tableTop = $('.el-table').offset().top;
  let scrollTop = $(document).scrollTop();
  let mainEle = $('#main').offset();
  $('#pagination').css({'left': mainEle.left + 'px'})
  $('.el-table__header-wrapper').css({'left': mainEle.left + 'px'})
  if(tableTop < scrollTop + $("#navbar").outerHeight()) {
      $('.el-table__header-wrapper').addClass('fixed');
  }else {
      $('.el-table__header-wrapper').removeClass('fixed');
  }
}

const handlePagination = function() {
  let mainEle = $('#main').offset();
  let windowH = $(window).height();
  let otherViewHeight = $("#main_header").outerHeight(true) + $("#navbar").outerHeight(true)+ $(".cloud-component > .cloud-search").outerHeight(true) +
                        parseInt($("#main").css("marginTop")) + parseInt($("#main").css("marginBottom")) + ($("#main").outerHeight() - $("#main").height());
  let tableH = $('.el-table').height();
  if(tableH >= windowH - otherViewHeight) {
    $('#pagination').addClass('fixed').css({'left': mainEle.left + 'px'})
  }else {
    $('#pagination').removeClass('fixed');
  }
}


const isRepeat = function(arr) {
  let  hash = {};
  for(let i in arr) {
      if(hash[JSON.stringify(arr[i])]) {
          return true;
　　     }
      hash[JSON.stringify(arr[i])] = true;
  }
  return false;
}      

//判断两数组里是否包括相同元素key strict是否严格相等
const arrayExistAttr = function(arr1, arr2,key, strict=true) {
  let isExist = false;
  arr1.forEach(item=>{
    arr2.forEach(li=>{
      if(strict) {
        if(key) {
          if(item[key] === li[key]) {
            isExist = true;
          }
        }else {
          if(item === li) {
            isExist = true;
          }
        }
      }else {
        if(key) {
          if(item[key] == li[key]) {
            isExist = true;
          }
        }else {
          if(item == li) {
            isExist = true;
          }
        }
      }
    })
  })
  if(isExist) {
      return true;
  }
  return false;
}

//将有父子关系的数组转换成树形结构数据
const translateDataToTree = function(data = []) {
  let parents = data.filter(li=>{ return li.menuLevel == 1});
  let childrens = data.filter(li=>{ return li.menuLevel > 1});
  let translatorFun = (parents, childrens)=>{
      parents.forEach(p=>{
          p.children = [];
          childrens.forEach((c,cIndex)=>{
              if(p.menuCode === c.superiorMenu) {
                  let temp = JSON.parse(JSON.stringify(childrens));
                  temp.splice(cIndex, 1);
                  translatorFun([c],temp)
                  p.children.push(c);
              }
          })
      })
  }
  //调用转换方法
  translatorFun(parents, childrens)
    
  //返回最终的结果
  return parents
}



const key = CryptoJS.enc.Utf8.parse("FBI5384332412AOF");  //十六位十六进制数作为密钥
const iv  = CryptoJS.enc.Utf8.parse("QWERAAA56564HAHA");   //十六位十六进制数作为密钥偏移量
//解密方法
function decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

//加密方法
function encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}
const isEffectiveDate = function(date) {
  if(!date){
    return
  }
  return (new Date(date).getDate()==date.substring(date.length-2));
}


//数据去重
const arrRemoveRepeat = function(arr) {
  let result = []
  let obj = {}
  for (let i of arr) {
      if (!obj[i]) {
          result.push(i)
          obj[i] = 1
      }
  }
  return result
}

//全角转半角
const ToCDB = function (str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
      }
      else {
          tmp += String.fromCharCode(str.charCodeAt(i));
      }
  }
  return tmp
}

//半角转全角
const ToDBC = function (txtstring) {
  var tmp = "";
  for (var i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) == 32) {
      tmp = tmp + String.fromCharCode(12288);
    }
    if (txtstring.charCodeAt(i) < 127) {
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
    }
  }
  return tmp;
}

const arrRermoveEmpty = function(arr) {
  return arr.filter(li=>{
    return li
  })
};

// 去除重复对象
const deleteObject = function (arr,attribute) {
  var new_arr=[];
  var json_arr=[];
  for(var i=0; i<arr.length; i++){
    // console.log(new_arr.indexOf(arr[i][attribute]));
    if(new_arr.indexOf(arr[i][attribute]) ==-1){    //  -1代表没有找到
      new_arr.push(arr[i][attribute]);   //如果没有找到就把这个name放到arr里面，以便下次循环时用
      json_arr.push(arr[i]);
    } /*else{
    }*/
  }
  return json_arr;
};

const testingVersion = async()=> {
  if(process.env.NODE_ENV == 'production') {
      // 在 js 中请求首页地址不会更新页面
      const response = await axios.get(`${window.location.protocol}//${window.location.host}${window.location.pathname}?t=${new Date().getTime()}`);
      // 返回的是字符串，需要转换为 html 
      let el = document.createElement('html')
      el.innerHTML = response.data;
      
      // 拿到 当前hash 
      let new_scriptArr = el.getElementsByTagName('body')[0].getElementsByTagName('script');
      let new_indexSrc = el.getElementsByTagName('body')[0].getElementsByTagName('script')[new_scriptArr.length - 1].src.split('/');
      let new_hash = new_indexSrc[new_indexSrc.length - 1].split('.')[1];
      console.log(new_hash)
      let cur_scriptArr = document.getElementsByTagName('body')[0].getElementsByTagName('script');
      let cur_indexSrc = document.getElementsByTagName('body')[0].getElementsByTagName('script')[cur_scriptArr.length - 1].src.split('/');
      let cur_hash = cur_indexSrc[cur_indexSrc.length - 1].split('.')[1];
      console.log(cur_hash)
      if(cur_hash != new_hash) {
        MessageBox.alert('系统版本已更新,请点击确定按钮刷新页面!', '系统通知', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false,
          center: true,
          closeOnClickModal: false,
          callback: action => {
            window.location.reload();
          }
        });
      }
  }
}

const initForm = function (form) {
  for (const key in form) {
    switch (typeof (form[key])) {
      case 'string': form[key] = ''; break;
      case 'number': form[key] = null; break;
      case 'boolean': form[key] = false; break;
      default: break;
    }
  }
  return form;
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
  checkToken, // 验证登录页浏览器缓存的token有没有在登录有效期
  calculationAge,    //根据出生年月日计算周岁
  deepCopy,   //深克隆
  handleTableScorll,   //操作表格滚动
  handlePagination,   //操作分页表现表形
  deleteFileId,     //单文件删除
  isRepeat,     //数组里值是否重复
  arrayExistAttr,    //判断两数组里是否包括相同元素key
  decrypt,  //解密
  encrypt,   //加密
  translateDataToTree,  //将有父子关系的数组转换成树形结构数据
  isEffectiveDate,    //判断日期是否有效
  arrRemoveRepeat,    //数组去重
  ToCDB,  //全角转半角
  ToDBC,   //半角转全角
  arrRermoveEmpty,  //数组去除空值
  deleteObject, // 去除 重复对象
  testingVersion,   //检测版本更新
  initForm,   // 出初化表单
};
