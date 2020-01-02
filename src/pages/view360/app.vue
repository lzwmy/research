<template>
  <div class="view-360">
    <div class="head-fixed">
      <head v-loading="loading">
        <div class="title">
          <i class="icon iconfont iconzujian1"></i>
          <h1>患者360视图</h1>
        </div>
        <span>{{basicInfo.patientName}}</span>
        <span>{{basicInfo.genderCode==1?'男':'女'}} / {{basicInfo.age}}岁</span>
        <span>身份证号码：{{basicInfo.identitycardno}}</span>
      </head>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="时间轴" name="six"></el-tab-pane>
        <el-tab-pane label="就诊概览" name="first"></el-tab-pane>
        <el-tab-pane label="病历文书" name="second"></el-tab-pane>
        <el-tab-pane label="检查记录" name="third"></el-tab-pane>
        <el-tab-pane label="检验记录" name="fourth"></el-tab-pane>
        <el-tab-pane label="医嘱处方" name="fifth"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 动态组件 -->
    <section>
      <component 
        ref="componets" 
        :is="dynamicCom.comName"  
        :comData="dynamicCom.comData" 
        :record="record" 
        :basicInfo="basicInfo" 
        :outList="outList"
        :inList="inList"
        :fileData="fileData"
        @handleTabClick="handleTabClick">
        <div class="top" slot="top">
          <div class="top-btn" @click="onSelectType">
            <span>{{recordTypeName}}</span>
            <el-button type="text" size="mini"><i class="icon iconfont iconshaixuan"></i></el-button>
          </div>
          <div class="select" :class="activeSelect?'active' + ' row'+recordTypeRow:''">
            <el-button type="text" size="mini" @click="onSelect(item.code,item.name)" v-for="(item,index) in recordType" :key="index">{{item.name}}</el-button>
          </div>
        </div>
      </component>
    </section>
    
  </div>
</template>

<script>
import previewVisit from './previewVisit';
import medicalRecord from './medicalRecord';
import inspectionRecord from './inspectionRecord';
import testRecord from './testRecord';
import utils from 'components/utils/index';
import medicalPrescription from './medicalPrescription';
import timeAxis from './timeAxis/index';
export default {
  name: 'view360',
  data () {
    return {
      activeName: "six",
      activeSelect: false,
      loading: false,
      //动态组件
      dynamicCom: {
        comName: "timeAxis",
        comData:{}
      },
      basicInfo:{},
      fileData:null,  //病历文书入院记录信息
      //门诊处方类别 
      outList:{
        typeList: [],
        sortList:[]
      },  
      //住院医嘱类别
      inList:{
        sortList:[],
        statusList: [],
        typeList: []
      },
      //住院、门诊记录
      record:[],
      recordType:[],
      recordTypeRow:1,
      recordTypeName:"全部",
      //就诊概览记录类型
      recordType1:[
        {code:0,name:"全部"},
        {code:1,name:"门诊"},
        {code:2,name:"住院"}
      ],
      //病历文书记录类型
      recordType2:[],
      //检查记录类型
      recordType3:[],
      //检验记录类型
      recordType4:[]
    };
  },
  watch: {
    
  },
  computed: {},
  created () {
    let query = JSON.parse(localStorage.getItem('VIEW360_QUERY'));
    this.recordType = this.recordType1;
    this.dynamicCom.comData = {
      orgCode: query?query.orgCode:"",
      patientId: query?query.patientId:"",
      diseaseId: query?query.diseaseId:"",
      type: 0,
      examTestClass:"全部",
    }
    this.getBasicInfo()
    .then(()=>{
      document.title = this.basicInfo.patientName +"360视图";
    });
    this.getBasicRecord();
    Promise.all([this.getInTypeList(), this.getOutTypeList(), this.getBasicRecordFileListAll()])
    .then(()=>{
      this.getBasicRecordCheckListAll();
      this.getBasicRecordCheckoutListAll();
    })
  },
  beforeDestroy() {
    // localStorage.removeItem('VIEW360_QUERY');
  },
  mounted () {
  },
  components: {
    previewVisit,
    medicalRecord,
    inspectionRecord,
    testRecord,
    medicalPrescription,
    timeAxis
  },
  methods: {
    //选择类型下拉
    onSelectType(){ 
      this.activeSelect = !this.activeSelect;
      //计算记录类型行数
      this.recordTypeRow  = Math.ceil(this.recordType.length/3);
    },
    //点击选择类型
    onSelect(code,name) {
      if(this.dynamicCom.comName == "previewVisit") {
        this.dynamicCom.comData.type = code;
      }else {
        this.dynamicCom.comData.type = 0;
        this.dynamicCom.comData.examTestClass = code;
      }
      this.recordTypeName = name;
      this.activeSelect = false;
      this.getBasicRecord();
    },
    //动态组件
    handleTabClick(tab, event) {
      this.activeName = tab.paneName;
      this.recordTypeName = '全部',
      this.dynamicCom.comData.type = 0;
      if(tab.infoData) {
        this.fileData = tab.infoData;
      }else {
        this.fileData = null;
      }
      switch(tab.paneName) {
        case "first" :
          this.dynamicCom.comName = "previewVisit";
          this.recordType = this.recordType1;
          break;
        case "second" :
          this.dynamicCom.comName = "medicalRecord";
          this.recordType = this.recordType2;
          break;
        case "third" :
          this.dynamicCom.comName = "inspectionRecord";
          this.recordType = this.recordType3;
          break;
        case "fourth" :
          this.dynamicCom.comName = "testRecord";
          this.recordType = this.recordType4;
          break;
        case "fifth" :
          this.dynamicCom.comName = "medicalPrescription";
          this.recordType = [];
          break;
        case "six" :
          this.dynamicCom.comName = "timeAxis";
          this.recordType = [];
          break;
        default:
          this.dynamicCom.comName = "timeAxis";
          this.recordType = this.recordType1;
          break;
      }
      this.activeSelect = false;
    },
    //获取患者基本信息
    async getBasicInfo() {
      this.loading = true;
      let formData = {
        orgCode: this.dynamicCom.comData.orgCode,
        patientId: this.dynamicCom.comData.patientId 
      };
      try {
        let data = await this.$http.getBasicInfo(formData);
        if (data.code == '0') {
          this.basicInfo = data.data;
          this.basicInfo.age = utils.calculationAge(data.data.birthdate);
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    //获取患者住院、门诊记录
    async getBasicRecord() {
      this.record = [];
      let formData = {
        orgCode: this.dynamicCom.comData.orgCode,
        // patientId: this.dynamicCom.comData.patientId,
        patientId: "440311004901030",
        type: String(this.dynamicCom.comData.type)
      };
      try {
        let data = await this.$http.getBasicRecord(formData);
        if (data.code == 0) {
          this.record = data.data;
          this.record.forEach((item)=>{
            item.recordDate = item.recordDate?item.recordDate.slice(0,10):"";
            item.admitDate = item.admitDate?item.admitDate.slice(0,10):"";
            item.dischargeDateTime = item.dischargeDateTime?item.dischargeDateTime.slice(0,10):"";
          })
          //就诊概览默认选择第一项
          this.$refs.componets.onClickRecord(this.record[0], 0);
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取病历文书类别
    async getBasicRecordFileListAll() {
      try {
        let data = await this.$http.getBasicRecordFileListAll();
        if (data.code == 0) {
          this.recordType2 = data.data;
          this.recordType2.unshift({
            code: "全部",
            name: "全部"
          })
        }
      } catch (error) {
      }
    },
    //获取检查记录类别
    async getBasicRecordCheckListAll() {
      try {
        let data = await this.$http.getBasicRecordCheckListAll();
        if (data.code == 0) {
          this.recordType3 = data.data;
          this.recordType3.unshift({
            code: "全部",
            name: "全部"
          })
        }
      } catch (error) {
      }
    },
    //获取检验记录类别
    async getBasicRecordCheckoutListAll() {
      try {
        let data = await this.$http.getBasicRecordCheckoutListAll();
        if (data.code == 0) {
          this.recordType4 = data.data;
          this.recordType4.unshift({
            code: "全部",
            name: "全部"
          })
        }
      } catch (error) {
      }
    },
    // 获取门诊处方类别列表
    async getOutTypeList() {
      try {
        let data = await this.$http.getOutTypeList();
        if (data.code == 0) {
          this.outList = {
            sortList: data.data.sortList,
            typeList: data.data.typeList
          }
        }
      } catch (error) {
      }
    },
    // 获取住院医嘱类别列表
    async getInTypeList() {
      try {
        let data = await this.$http.getInTypeList();
        if (data.code == 0) {
          this.inList = {
            sortList: data.data.sortList,
            typeList: data.data.typeList,
            statusList: data.data.statusList
          }
        }
      } catch (error) {
      }
    }
  }
};

</script>


<style lang='less'>
@h: 42px;
.view-360 {
  .head-fixed {
    position:fixed;
    width: 100%;
    top:0;
    left: 0;
    z-index:10;
  }
  head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 68px;
    background: #3A5998;
    border-bottom: 1px solid #eee;
    .title {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #294376;
      height: 100%;
      padding:0 20px;
      h1 {
        font-size:20px;
        color:#fff;
        font-weight:bold;
      }
      i {
        font-size: 40px;
        color:#fff;
        padding-right: 12px;
      }
    }
    span {
      font-size: 18px;
      color: #fff;
      margin-left: 40px;
    }
  }
  .el-tabs .el-tabs__header {
    margin: 0;
    padding-left: 25px;
    background:#fff;
    &:before{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #dfe4ed;
      z-index: 1;
    }
    .el-tabs__item {
      height: 50px;
      line-height: 50px;
      background: transparent !important;
      padding: 0 35px;
      font-size: 14px;
    }
  }
  section {
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    aside {
      width: 290px;
      height: 100%;
      border-right: 1px solid #ddd;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      padding-bottom: 50px;
      overflow:hidden;
      .top{
        overflow-x: hidden;
        .top-btn {
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px #ddd solid;
          padding: 5px 25px;
          height: 42px;
          i {
            font-size: 25px;
            color: #999;
          }
          span {
            width: 189px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .select {
          height: 0;
          transition: all 500ms;
          overflow: hidden;
          width: 330px;
          font-size: 0;
          display: flex;
          justify-content: flex-start;
          align-items:center;
          flex-wrap: wrap;
          button{
            padding: 5px 5px;
            width:92px;
            height: 42px;
            margin:0 2px;
            overflow: hidden;
            border-radius: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:hover {
              background: #EFEFEF;
            }
          }
        }
        .select.active {
          height: auto;
          max-height: 500px;
          overflow: auto;
          box-shadow:0px 1px 2px rgba(0,0,0,0.16);
        }
        .select.row1{
          height:@h * 1;
        }
        .select.row2{
          height: @h * 2;
        }
        .select.row3{
          height: @h * 3;
        }
        .select.row4{
          height: @h * 4;
        }
      }
      .content {
        width:310px;
        overflow:auto;
      }
    }
    .main {
      position: absolute;
      left: 290px;
      top: 0;
      right: 0;
      bottom: 0;
      padding: 15px;
      padding-bottom: 100px;
      overflow:auto;
      p {
        font-size: 16px;
        color:#444;
        margin-bottom: 5px;
        i {
          color: #3C81F0;
          vertical-align: middle;
          font-size: 24px;
          padding-right: 5px;
        }
      }
      .el-table__empty-block {
        width: 100% !important;
      }
    }
    .el-menu-vertical-demo{
      width:310px;
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
      padding-bottom: 100px;
      .el-submenu {
        margin-bottom: 10px;
        i.el-icon-arrow-right {
          color: #666;
          font-size: 14px;
          line-height: 22px;
          width: 14px;
          transition: all 300ms;
          vertical-align: top;
        }
        &.is-opened {
          i.el-icon-arrow-right {
            color: #3C81F0;
            transform: rotate(90deg);
          }
        }
        .el-submenu__title {
          padding-left: 10px !important;
          padding-top: 10px;
          color: #63666E !important;
          background-color: transparent;
          border:none;
          height: auto;
          &:hover {
            background: #ecf5ff;
          }
          p {
            display: inline-block;
            vertical-align: top;
          }
          .el-submenu__icon-arrow {
            display: none;
          }
          span {
            display: block;
            line-height: 22px;
            font-weight: normal;
          }
        }
        .el-menu-item-group {
          /deep/ .el-menu-item-group__title {
            padding: 0 !important;
          }
          ul{
            background: transparent;
            .el-menu-item-group{
              color: #666;
            }
            .el-menu-item {
              padding:5px 0;
              &:hover {
                background: #ECF5FF;
              }
              &.is-active {
                background:#ECF5FF;
                border-left: 2px solid #3C81F0;
                padding-left: 38px !important;
                p {
                  color:#3C81F0;
                }
              }
              p {
                line-height: 22px;
                color: #63666E;;
              }
              p.time {
                line-height: 18px;
              }
            }
          }
        }
      }
    }
  }

  .time {
    color: #999;
    font-size: 12px;
    line-height: 18px;
  }
}

 .theme-green {
   .view-360 head .title {
      background-color:#1bd0a1;
    }
    .view-360 head span,
    .view-360 section .main p i {
      color:#1bd0a1;
    }
 }

</style>

