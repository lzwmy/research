export default {
  'normal': {
    'type': '', // 空间类型
    'label': '', // 条目名称
    'showLabel': true, // 条目显示控制 label 是否显示
    'disabled': false,
    'placeholder': '请输入',
    'entryName': '', // 条目名称
    'showEntryName': '', // 条目显示名称
    'selectValue': '', // 下拉选项值
    'linkage': false, // 联动
    'layout': '', // 排列方式
    'showLayout': false, // 排列方式显示
    'unitShow': false, // 单位选择显示
    'codeSet': {
      'show': false,
      'value': ''
    }, // 类型代码集
    'children': [], // 集合
    'dialogConfig': {
      'width': '',
      'placeholder': '请输入要填写的提示'
    }
  },
  'newData': {
    'id': 'string',
    'controlName': 'string', // (控件名称)
    'controlDisplayName': 'string', // (控件显示名称)
    'controlType': 'string', // (控件显示类型)
    'displayIsVisible': 0, // (显示名称是否可见)
    'baseProperty': {
      'controlWidth': 0, // (控件宽度)1 / 2 / 3 / 4 0(代表未设置)
      'controlHeight': 0, // (控件高度)1 / 2 / 3 / 4 0(代表未设置)
      'controlTip': 'string', // (控件输入提示)
      'controlIsDefaultDateTime': 0, // (是否使用默认时间或日期) 0否 1 默认
      'controlIsExtend': 0, // (下拉框是否可扩展)
      'controlLable': '' // (标签 是否 存在值)
    },
    'termSet': {
      'termGroupOid': '', // (代码集OID)
      'termGroupName': '', // (代码集名称)
      'termDefaultValue': '', // 是否有默认值
      'termItemlist': [
      /* {
        "termName": "",//(显示名名称)
        "Point":"", //(分值)
        "termID":"" //(显示名代码)
      } */
      ]
    },
    'termUnit': {
      'numberIsSwitch': 0, // 单位是否显示
      'unitName': '' // 单位值
    },
    'gatherKnowType': 0, // (集合或表格： 无、 有无、 是否不详)
    'gatherRank': 0, // (集合或表格的显示形式)
    'children': []// (此条目的子条目)
  },
  "typeData" : [
    {
      name:"单行文本框",
      value:'SINGLE_INPUT'
    },
    {
      name:"多行文本框",
      value:"MULTI_INPUT"
    },
    {
      name:"标签",
      value:"LABEL"
    },
    {
      name:"日期",
      value:"DATE"
    },
    {
      name:"日期时间",
      value:"DATE_TIME"
    },
    {
      name:"数值",
      value:"NUMBER_INPUT"
    },
    {
      name:"单选下拉",
      value:"SINGLE_COMBOX"
    },
    {
      name:"多选下拉",
      value:"MULTI_COMBOX"
    },
    {
      name:"单选框",
      value:"RADIO_BUTTON"
    },
    {
      name:"多选框",
      value:"CHECKBOX"
    },
    {
      name:"集合",
      value:"GATHER"
    },
    {
      name:"表格",
      value:"TABLE"
    },
    {
      name:"文件上传",
      value:"FILE_UPLOAD"
    },
    /*{
      name:"超链接",
      value:"linkURL"
    }*/
  ],
}

