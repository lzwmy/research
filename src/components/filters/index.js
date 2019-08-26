// 时间格式转化
// 2014-12-03T03:01:00.000Z => 2014-12-03 03:01:00
const dateTimeConvert = function (date) {
  if (!date) {
    return '';
  }
  let year = new Date(date).getFullYear();
  let month = new Date(date).getMonth() + 1;
  let day = new Date(date).getDate();
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  return year + '-' + month + '-' + day;
};

export default {
  dateTimeConvert
};
