// 验证表单不能为空
const verificationData = function (data) {
  let flag = true;
  if (data.length === 0) {
    return;
  }
  data.forEach(item => {
    if (item.controlDisplayName !== "" && item.children.length !== 0) {
      verificationData.call(this, item.children)
    } else if (item.controlDisplayName !== "" && item.children.length !== 0) {
      flag = true;
    } else if (item.controlDisplayName == "") {
      flag = false;
    }
  });
  return flag;
};

//验证同级下 表单名称不能重复
let finds = false;
const repeatNameTest = function (data) {
  if (data.length === 0) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    if ((data[i].controlType == 'GATHER' || data[i].controlType == 'TABLE') && data[i].children.length != 0) {
      repeatNameTest.call(this, data[i].children)
    }
    if (data[i].controlType != 'GATHER' && data[i].children.length == 0) {
      finds = false;
      if(testRepeat(data)) {
        finds = testRepeat(data);
        break;
      }
    }
    if (finds) break;
  }
  return finds;
};

function testRepeat(data) {
  let find = false;
  if (data.length === 0) {
    return;
  }
  for (let k = 0; k < data.length; k++) {
    for (let j = k + 1; j < data.length; j++) {
      if (data[k].controlDisplayName == data[j].controlDisplayName) {
        find = true;
        break;
      }
    }
    if (find) break;
  }
  return find;
}

//建立一個可存取到该file的url
function getObjectURL(file) {
  var url = null ;
  if (window.createObjectURL!=undefined) { // basic
    url = window.createObjectURL(file) ;
  } else if (window.URL!=undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file) ;
  } else if (window.webkitURL!=undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file) ;
  }
  return url ;
}


export default {
  verificationData,
  repeatNameTest,
  getObjectURL
}
