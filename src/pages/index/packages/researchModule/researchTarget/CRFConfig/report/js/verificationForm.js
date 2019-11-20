
import $ from 'jquery';


// 表单 验证 方法

// 获取Dom 并指对 单选框、多选框、下拉框 校验
export const getDom = function() {
  var elList = $('.isRequired'); //list
  var flag = false;
  elList.each(function (index,element) {
    let type = $(element).attr('data-type');
    switch (type) {
      case 'SINGLE_INPUT' : //输入框
        var value = $(element).attr('data-value');
        if(value) {
          $(element).find('.el-input__inner').css({
            'border-color':"#DCDFE6"
          });
        }else {
          $(element).find('.el-input__inner').css({
            'border-color':"#f56c6c"
          });
          flag = true;
          break;
        }
        break;
      case 'MULTI_INPUT' :
        var value = $(element).attr('data-value');
        if(value) {
          $(element).find('.el-textarea__inner').css({
            'border-color':"#DCDFE6"
          });
        }else {
          $(element).find('.el-textarea__inner').css({
            'border-color':"#f56c6c"
          });
          flag = true;
          break;
        }
        break;
      case "DATE" :
        var value = $(element).attr('data-value');
        if(value) {
          $(element).find('.el-input__inner').css({
            'border-color':"#DCDFE6"
          });
        }else {
          $(element).find('.el-input__inner').css({
            'border-color':"#f56c6c"
          });
          flag = true;
          break;
        }
        break;
      case "DATE_TIME" :
        var value = $(element).attr('data-value');
        if(value) {
          $(element).find('.el-input__inner').css({
            'border-color':"#DCDFE6"
          });
        }else {
          $(element).find('.el-input__inner').css({
            'border-color':"#f56c6c"
          });
          flag = true;
          break;
        }
        break;
      case "NUMBER_INPUT" :
        var numberSwitch = $(element).attr('data-switch')
        var value1 = $(element).attr('data-value');
        var value2 = $(element).attr('data-value2');
        if(numberSwitch == 1) {
          if(value1) {
            $(element).find('.el-input__inner').css({
              'border-color':"#DCDFE6"
            });
          }else {
            $(element).find('.el-input__inner').css({
              'border-color':"#f56c6c"
            });
            flag = true;
            break;
          }
        }else if(numberSwitch == 0) {
          if(value1 || value2) {
            $(element).find('.el-input__inner').css({
              'border-color':"#DCDFE6"
            });
          }else {
            $(element).find('.el-input__inner').css({
              'border-color':"#f56c6c"
            });
            flag = true;
            break;
          }
        }
        break;
      case "SINGLE_COMBOX" :
        var IsExtend = $(element).attr('data-IsExtend');
        var value = $(element).attr('data-value');
        if(IsExtend == 0) {
          if(value) {
            $(element).find('.el-input__inner').css({
              'border-color':"#DCDFE6"
            });
          }else {
            $(element).find('.el-input__inner').css({
              'border-color':"#f56c6c"
            });
            flag = true;
            break;
          }
        }else if(IsExtend == 1) {
          if(value) {
            $(element).find('.el-input__inner').css({
              'border-color':"#DCDFE6"
            });
          }else {
            $(element).find('.el-input__inner').css({
              'border-color':"#f56c6c"
            });
            flag = true;
            break;
          }
        }
        break;
      case "MULTI_COMBOX" :
        var IsExtend = $(element).attr('data-IsExtend');
        var value = $(element).attr('data-value');
        if(IsExtend == 0) {
          if(value) {
            $(element).find('.el-input__inner').css({
              'border-color':"#DCDFE6"
            });
          }else {
            $(element).find('.el-input__inner').css({
              'border-color':"#f56c6c"
            });
            flag = true;
            break;
          }
        }else if(IsExtend == 1) {
          if(value) {
            $(element).find('.el-input__inner').css({
              'border-color':"#DCDFE6"
            });
          }else {
            $(element).find('.el-input__inner').css({
              'border-color':"#f56c6c"
            });
            flag = true;
            break;
          }
        }
        break;
      case "CASCADE" :
        var value = $(element).attr('data-value');
        if(value) {
          $(element).find('.el-input__inner').css({
            'border-color':"#DCDFE6"
          });
        }else {
          $(element).find('.el-input__inner').css({
            'border-color':"#f56c6c"
          });
          flag = true;
          break;
        }
        break;
      default:
        break;
    }
    /*if(flag) {
      return false;
    }*/
  });
  return flag
};





