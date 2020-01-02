<template>
  <div class="">
    <aside>
      <slot name="top"></slot>
      <p v-if="JSON.stringify(dataListFile) == '[]'" style="text-align:center;padding: 20px;">暂无记录</p>
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        :default-openeds="defaultOpeneds"
        @open="menuOpen"
        v-else>
        <el-submenu :index="String(index+1)" v-for="(item,index) in dataListFile" :key="index">
          <template slot="title">
            <i class="el-icon-arrow-right"></i>
            <p>
              <span>{{item.inSno?'住院':'门诊'}}   {{item.deptName}}</span>
              <span class="time" v-if="item.inSno">{{item.admitDate}} 至 {{item.dischargeDateTime}}</span>
              <span class="time" v-else>{{item.recordDate}}</span>
            </p>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="(index+1)+'-'+(index2+1)" v-for="(itemDetail,index2) in item.list" :key="index2" @click="getBasicDetail(itemDetail)">
              <p>
                <span class="title">{{itemDetail.fileName}}</span>
              </p>
              <p class="time">报告时间:{{itemDetail.createDate}}</p>
            </el-menu-item>
          </el-menu-item-group>

        </el-submenu>
      </el-menu>
    </aside>
    <div class="main">
      <div class="main-top">
        <p><i class="icon iconfont iconzhuyuanjilu"></i>入院记录</p>
        <div>
          <a :href="pdfSrc" target="_blank" class="btn"><el-button  @click="getPdf">PDF</el-button></a>
          <el-button type="primary" class="btn">文本</el-button>
        </div>
      </div>
      <div class="box">
        <h2>深圳市龙华中心医院</h2>
        <p>入院记录</p>
        <table v-loading="loading">
          <thead>
            <tr>
              <th>姓名：{{basicInfo.patientName}}</th>
              <th>性别：{{basicInfo.genderCode==1?'男':'女'}}</th>
              <th>年龄：{{basicInfo.age}}</th>
              <th width="200px">科室：{{infoData.deptName}}</th>
              <th>床号：</th>
              <th>住院号：</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3">姓名：{{basicInfo.patientName}}</td>
              <td colspan="3">职业：</td>
            </tr>
            <tr>
              <td colspan="3">性别：{{basicInfo.genderCode==1?'男':'女'}}</td>
              <td colspan="3">工作单位：</td>
            </tr>
            <tr>
              <td colspan="3">年龄：{{basicInfo.age}}</td>
              <td colspan="3">住址：</td>
            </tr>
            <tr>
              <td colspan="3">婚姻：</td>
              <td colspan="3">供史者：</td>
            </tr>
            <tr>
              <td colspan="3">出生地：</td>
              <td colspan="3">入院日期：{{infoData.createDate}}</td>
            </tr>
            <tr>
              <td colspan="3">民族：</td>
              <td colspan="3">记录日期：</td>
            </tr>
            <tr>
              <td colspan="6">
                <p class="title">病史</p>
                <div v-for="(item, index) in textArray" :key="index">
                  <p class="t">{{item}}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import utils from 'components/utils/index';

export default {
  name: 'medicalRecord',
  props:['comData','record','basicInfo','fileData'],
  data () {
    return {
      loading: false,
      pdfSrc:"../../../static/123.pdf",
      recordHospital: [],  //住院记录
      recordClinic: [],  //门诊记录
      recordHospitalTime:{},  //住院记录入院出院
      recordClinicTime:{},  //住院记录入院出院
      infoData:{},
      dataListFile:[],
      dataListFileAll:[],
      defaultOpeneds:['1'],
      defaultActive:'1-1',
      textArray:[]
    };
  },
  watch: {
    'comData.examTestClass':function(newVal, oldVal) {
      this.comData.examTestClass = newVal;
      this.dataListFile = this.filterExamTestClass(this.dataListFileAll);
    }
  },
  computed: {},
  created () {
    this.getBasicFileList()
    .then(()=>{
      if(this.fileData){
        this.defaultActive = this.fileData.menuIndex;
        this.getBasicDetail(this.fileData);
      }else {
        JSON.stringify(this.dataListFile) !='[]' && JSON.stringify(this.dataListFile[0].list) !='[]' && this.getBasicDetail(this.dataListFile[0].list[0]);
      }
    })
    
  },
  mounted () {

  },
  components: {
  },
  methods: {
    // 获取入院记录信息
    async getBasicDetail(row) {
      this.loading = true;
      this.infoData = row;
      let txtArr = row.fileTxt.split("\n");
      this.textArray = txtArr;
      setTimeout(()=>{
        this.loading = false
      },300)
    },
    // 获取患者病历文件列表
    async getBasicFileList() {
      let formData = {
        orgCode: this.comData.orgCode,
        patientId: this.comData.patientId,
        type:0
      };
      try {
        let data = await this.$http.getBasicFileList(formData);
        if (data.code == 0) {
          this.dataListFile = data.data;
          this.dataListFile.forEach((item)=>{
            item.recordDate = item.recordDate?item.recordDate.slice(0,10):"";
            item.admitDate = item.admitDate?item.admitDate.slice(0,10):"";
            item.dischargeDateTime = item.dischargeDateTime?item.dischargeDateTime.slice(0,10):"";
          })
          this.dataListFileAll = utils.deepCopy(this.dataListFile);
        }
      } catch (error) {
        console.log(error)
      }
    },
    //过滤类别
    filterExamTestClass(data){
      let copyData = utils.deepCopy(data);
      if(this.comData.examTestClass == '全部'){
        return copyData;
      }
      let newArr = copyData.filter( item => {
        return item.list = item.list.filter( listItme => {
          return listItme.deptCode  == this.comData.examTestClass;
        })
      })
      return newArr;
    },
    menuOpen(index) {
      if(!this.defaultOpeneds.includes(index)) {
        this.defaultOpeneds.push(index);
      }
    },
    getPdf() {

    }
  }
};
</script>


<style lang='less' scoped>
  .main {
    .main-top { 
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size:0;
      .el-button {
        padding: 2px 20px;
        &.el-button--primary {
          border: 1px solid #439aff;
        }
      }
      .btn:last-child {
        margin-left:0;
        border-top-left-radius:0;
        border-bottom-left-radius:0;
      }
      a.btn{
        display: inline-block;
        .el-button {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }
    .box {
      width: 1000px;
      margin: 40px auto;
      box-shadow:1px 1px 6px rgba(0,0,0,0.16);
      padding: 40px 0;
      background-color: #fff;
      font-size: 14px;
      h2{
        font-size: 22px;
        color:#444;
        font-weight: 400;
        text-align: center;
      }
      p{
        font-size: 16px;
        font-weight: bold;
        line-height: 40px;
        text-align: center;
      }
      table {
        width: 840px;
        margin: 0 auto;
        border:1px solid #707070;
        border-bottom:none;
        border-right:none;
        text-align: left;
        td {
          border-right:1px solid #707070;
          border-bottom:1px solid #707070;
          padding: 5px 20px;
          div{
            display: flex;
            align-items: baseline;
            justify-content: flex-start;
            margin-bottom: 10px;
            .t{
              text-align:left;
              font-weight: normal;
              font-size: 14px;  
              line-height: 22px;
            }
            span{
              font-weight: bold;
              min-width: 48px;
              color: #63666E;
            }
          }
        }
        th {
          border-right:1px solid #707070;
          border-bottom:1px solid #707070;
          padding: 10px 20px;
          font-weight: normal;
        }
        .title{
          text-align:center;
          font-weight: bold;
          text-indent:0;
        }
      }
    }
  }
  .el-dialog__body {
    & > span {
      display: block !important;
      margin: 20px auto;
    }
  }
</style>
