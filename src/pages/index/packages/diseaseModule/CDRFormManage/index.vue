<template>
  <div class="from_container_box">
    <div class="tab_box" v-show="show">
      <div
        :class="['tab-item',item.index ==tabIndex ? 'acitve': '' ]"
        v-for="item in tabItem"
        :key="item.index"
        @click="onTabClick(item.index)"
      >{{item.name}}</div>
      <!--<div class="tab-item">单元</div>
      <div class="tab-item">单元</div>
      <div class="tab-item">单元</div>-->
    </div>
    <div class="tab_content">
      <keep-alive :max=10 >
        <component
          :is="switchComponent"
          :comShow="showComponent"
          :objType="objType"
          @add-change="addChange"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import entry from "./component/entry/entry";
import addEntry from "./component/entry/addEntry";
import section from "./component/section/section";
import sectionList from "./component/section/sectionList";
import addSection from "./component/section/addSection";
import singleList from "./component/singlePage/singleList";
import addSinglePage from "./component/singlePage/addSinglePage"
import modifySinglePage from "./component/singlePage/modifySinglePage"
import reportList from "./component/report/reportList";
import addReport from "./component/report/addReport"
import modifyReport from "./component/report/modifyReport"
import mixins from "components/mixins";
export default {
  name: "CDRConfig",
  mixins: [mixins],
  component: {
    entry: entry,
    addEntry,
    section,
    sectionList,
    addSection,
    singleList,
    addSinglePage,
    modifySinglePage,
    reportList,
    addReport,
    modifyReport
  },
  data() {
    return {
      tabItem: [
        {
          name: "条目",
          index: 0
        },
        {
          name: "小节",
          index: 1
        },
        {
          name: "单页",
          index: 2
        },
        {
          name: "报告",
          index: 3
        }
      ],
      show: true,
      tabIndex: 0,
      switchComponent: entry, //切换组件
      showComponent: true, //组件 显示隐藏
      objType: {} // 类型数据
    };
  },
  watch: {
    $route:function(value) {
      if(value.name=='crfConfig') {
        this.show = true;
        this.tabIndex = 0;
        this.switchComponent = entry;
      }
    }
  },
  computed: {},
  methods: {
    //Tab 切换
    onTabClick(val) {
      console.log(val);
      this.tabIndex = val;
      switch (val.toString()) {
        case "0":
          this.switchComponent = entry;
          break;
        case "1":
          this.switchComponent = sectionList;
          break;
        case "2":
          this.switchComponent = singleList;
          break;
        case "3":
          this.switchComponent = reportList;
          break;
        default:
          break;
      }
    },
    //组件监听处理
    addChange(value) {
      console.log(value);
      switch (value.type) {
        case "newEntry": //编辑条目
          this.show = false;
          //新增条目
          this.objType = value;
          this.switchComponent = addEntry;
          break;
        case "entry": //条目列表
          this.show = true;
          this.tabIndex = 0;
          this.objType = value;
          this.switchComponent = entry;
          break;
        case "newPortion": //跳转到 新建小节 隐藏title
          this.show = false;
          this.objType = value;
          this.switchComponent = addSection;
          break;
        case "sectionList": //小节列表
          this.show = true;
          this.tabIndex = 1;
          this.objType = value;
          this.switchComponent = sectionList;
          break;
        case "modifySection": //编辑小节
          this.show = true;
          this.objType = value;
          this.switchComponent = section;
          break;
        case "addSinglePage" : //跳转到 新建 单页
          this.show = false;
          this.objType = value;
          this.switchComponent = addSinglePage;
          break;
        case "breakSinglePage" : //返回 单页 列表
          this.show = true;
          this.tabIndex = 2;
          this.objType = value;
          this.switchComponent = singleList;
          break;
        case "modifySinglePage" : // 单页编辑
          this.show = true;
          this.objType = value;
          this.switchComponent = modifySinglePage;
          break;
        case "addReport" : //跳转到 报告编辑
          this.show = false;
          this.objType = value;
          this.switchComponent = addReport;
          break;
        case "reportList" : //返回 报告列表
          this.show =  true;
          this.tabIndex = 3;
          this.objType = value;
          this.switchComponent = reportList;
          break;
        case "modifyReport" :
          this.show = false;
          this.objType = value;
          this.switchComponent = modifyReport;
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    //临时解决方案
    let urlParameter = {
      cacheData: false,
      formId: "",
      groupId: "",
      subjectId: "",
      diseaseId: "",
      patientName: '',
      patientId: '',
      identify: '',
      from: "",
      title:"",
      isModify:""
    };
    sessionStorage.setItem('reportFill',JSON.stringify({urlParameter}));
  }
};
</script>

<style lang="less">
.from_container_box {
  padding: 20px 15px 0px 15px;
  min-height: 840px;
  overflow: hidden;
  .tab_box {
    width: 100%;
    height: 36px;
    font-size: 12px;
    float: left;
    border-bottom: 2px solid #1bbae1;
    margin-bottom: 20px;
    overflow: hidden;
    .tab-item {
      width: 66px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      float: left;
      margin-right: 4px;
      border-left: 1px solid rgba(216, 220, 228, 1);
      border-top: 1px solid rgba(216, 220, 228, 1);
      border-right: 1px solid rgba(216, 220, 228, 1);
      cursor: pointer;
    }
    .acitve {
      color: #1bbae1;
    }
  }
  .tab_content {
    width: 100%;
    float: left;
    overflow: hidden;
  }
}
</style>
