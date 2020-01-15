<template>
  <div>
    <aside>
        <slot name="top"></slot>
        <p v-if="JSON.stringify(record) == '[]'" style="text-align:center;padding: 20px;">暂无记录</p>
        <div class="content" v-else>
          <div id="line">
            <i class="icon iconfont" v-for="(item,index) in record" :key="index" :class="item.inSno?'iconzu4':'r iconzu3'" ></i>
          </div>
          <ul>
            <li class="itemInfo" :class="activeli==index?'active':''" v-for="(item,index) in record" :key="index" @click="onClickRecord(item,index)">
              <h3>{{item.recordDate}}</h3>
              <p>{{item.inSno?'住院':'门诊'}}：{{item.deptName}}</p>
              <p>诊断：{{item.diagName}}</p>
              <p>机构：{{item.orgName}}</p>
            </li>
          </ul>
        </div>
    </aside>

    <div class="main">
      <div>
        <p><i class="icon iconfont iconmenzhenchufang"></i>诊断记录</p>
        <el-table :data="dataListDiagnosis" v-loading="loading0" fit max-height="350" stripe>
          <el-table-column prop="diagTime" label="诊断时间" width="160px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="diagSno" label="诊断编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="diagName" label="诊断内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="diagType" label="诊断类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="diagDoctor" label="诊断医生" width="100px" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>

      <div v-if="isShow == '门诊'">
        <p><i class="icon iconfont iconmenzhenchufang"></i>门诊处方</p>
        <el-table
          :data="dataListClinic" v-loading="loading1" fit max-height="350" stripe>
          <el-table-column prop="invoiceTime" label="日期" width="160px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="diagNameInhos" label="疾病诊断" show-overflow-tooltip></el-table-column>
          <el-table-column prop="outRpSno" label="处方号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="rpType" label="处方类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="drugName" label="处方药品" show-overflow-tooltip></el-table-column>
          <el-table-column prop="rpDoctorName" label="开方医生" width="100px" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>

      <p><i class="icon iconfont iconjianchajilu"></i>检查记录</p>
      <el-table
        :data="dataListCheck" v-loading="loading2" fit max-height="350" stripe>
        <el-table-column prop="examDate" label="检查日期" width="160px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examClassName" label="检查类别" width="130px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examPart" label="检查部位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examItemName" label="检查项目" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examDesc" label="检查所见" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examResult" label="检查结论" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examReportDoctorName" label="报告医生" width="100px" show-overflow-tooltip></el-table-column>
      </el-table>

      <p><i class="icon iconfont iconjianyanjilu"></i>检验记录</p>
      <el-table
        :data="dataListTest" v-loading="loading3" fit max-height="350" stripe>
        <el-table-column prop="labDate" label="检查日期" width="160px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="labSubjectName" label="项目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemEnName" label="检验项目代码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemChName" label="检验项目代码名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemResultNum" label="结果量值" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemResultUnit" label="结果单位" show-overflow-tooltip></el-table-column>
          <el-table-column label="参考范围" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.resultReferenceLow}} - {{scope.row.resultReferenceHigh}}
            </template>
          </el-table-column>
        <el-table-column prop="" label="报告医生" width="100px" show-overflow-tooltip></el-table-column>
      </el-table>

      <div v-if="isShow == '住院'">
        <p><i class="icon iconfont iconzhuyuanyizhu"></i>住院医嘱</p>
        <el-table
          :data="dataListClinic" v-loading="loading4" fit max-height="350" stripe>
          <el-table-column prop="orderBeginDate" label="开始时间" width="160px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderSno" label="医嘱号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderTypeCode" label="医嘱类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderName" label="医嘱名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="drugFreqName" label="频次" show-overflow-tooltip></el-table-column>
          <el-table-column prop="" label="途径" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderStatusMemo" label="医嘱状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="doctorOrderName" label="申请医生" width="100px" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>

      <p><i class="icon iconfont iconbingliwenshu"></i>病历文书</p>
        <div v-if="JSON.stringify(dataListFile) != '[]'" v-for="(item,index) in dataListFile" :key="index">
          <p @click="onLinkRecord(item2)" v-for="(item2,li) in item.list" :key="li" class="medical"><i class="el-icon-arrow-right"></i>{{item2.createDate}} {{item2.fileName}}</p>
        </div>
        <p v-else class="medical">暂无病历文书</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'previewVisit',
  props:['comData','record','outList','inList'],
  data () {
    return {
      activeName: "first",
      loading0: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      dataListDiagnosis: [],  //诊断记录
      dataListClinic: [],  //门诊处方、住院医嘱
      dataListCheck: [],  //检查记录
      dataListTest: [],  //检验记录
      dataListFile: [],  //病历文书
      //住院、门诊记录
      activeli:null,
      isShow:'',  //是否门诊列表或住院列表     
    };
  },
  watch: {},
  computed: {},
  created () {
    this.comData.type = 0;
  },
  mounted () {
    if(this.record.length != 0) {
      this.onClickRecord(this.record[0],0);
    }
  },
  components: {
  },
  methods: {
    //获取各列表数据
    onClickRecord(data,index) {
      if(data.inSno){
        this.isShow = '住院';
      }else{
        this.isShow = '门诊';
      }
      for(let i in data){
        data[i] = data[i]?data[i]:"";
      }
      this.activeli = index;
      this.getResult(data);
      this.getRep(data);
      this.getBasicFileList(data);
      this.getBasicDiagnosisRecord(data);
    },
    // 获取诊断记录列表
    async getBasicDiagnosisRecord(data) {
      this.loading0 = true;
      let formData = {
        inSno: data.inSno,
        outSno: data.outSno,
        orgCode: this.comData.orgCode
      };
      try {
        let data = await this.$http.getBasicDiagnosisRecord(formData);
        if (data.code == 0) {
          this.dataListDiagnosis = data.data;
        }
        this.loading0 = false;
      } catch (error) {
        console.log(error)
        this.loading0 = false;
      }
    },
    // 获取处方、医嘱信息列表
    async getRep(data) {
      this.loading1 = true;
      let formData = {
        inSno: data.inSno,
        sort: [],
        status: [],
        outSno: data.outSno,
        orgCode: this.comData.orgCode,
        type:[]
      };
      try {
        let data = await this.$http.getBasicRepList(formData);
        if (data.code == 0) {
          data.data.forEach((list)=>{
            for(let i in list) {
              if(list[i] === 'null'){
                list[i] = "";
              }
            }
            this.outList.typeList.forEach((item)=>{
              if(item.code == list.rpType) {
                list.rpType = item.name;
              }
            })
            this.inList.typeList.forEach((item)=>{
              if(item.code == list.orderTypeCode) {
                list.orderTypeCode = item.name;
              }
            })
            this.inList.statusList.forEach((item)=>{
              if(item.code == list.orderStatusMemo) {
                list.orderStatusMemo = item.name;
              }
            })
          })
          this.dataListClinic = data.data;
        }
        this.loading1 = false;
      } catch (error) {
        console.log(error)
        this.loading1 = false;
      }
    },
    // 获取患者检验、检查详细信息列表
    async getResult(data) {
      this.loading2 = true;
      let formData = {
        inSno: data.inSno,
        orgCode: this.comData.orgCode,
        outSno: data.outSno,
      };
      try {
        let data = await this.$http.getBasicResultList(formData);
        if (data.code == 0) {
          this.dataListTest = data.data.labList;
          this.dataListCheck = data.data.examList;
          this.dataListTest.forEach( list=>{
            for(let i in list) {
              if(list[i] === 'null'){
                list[i] = "";
              }
            }
          })
        }
        this.loading2 = false;
      } catch (error) {
        this.loading2 = false;
      }
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
          this.dataListFile.forEach((item, index) => {
            item.list.forEach( (list, i) => {
              list.menuIndex = (index + 1) +"-"+ (i + 1);
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    //跳转到病历文书
    onLinkRecord(item){
      this.$emit('handleTabClick',{
        paneName:"second",
        infoData:item
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>


<style lang='less' scoped>
  .content {
    height: 100%;
    padding-bottom: 100px;
    position: relative;
    #line {
      position: absolute;
      top: 0;
      left: 15px;
      width: 32px;
      padding: 0;
      overflow:hidden;
      &::before {
        content: "";
        height: 100%;
        width: 1px;
        background: #D8D8D8;
        position:absolute;
        left: 40%;
        top: 0;
      }
      i {
        display: block;
        line-height: 30px;
        text-align: center;
        height: 93px;
        border-radius: 50%;
        position:relative;
        z-index: 1;
        font-size: 26px;
        padding: 10px 10px 10px 0;
        color:#1EBFBA;
      }
      i.r{
        color:#F95F7D;
      }
    }
    ul {
      li {
        padding: 10px 0 10px 60px;
        color: #63666E;
        cursor: pointer;
        h3{
          font-size: 16px;
        }
        p {
          font-size: 14px;
          line-height: 25px;
        }
      }
      li.active {
        background: #ECF5FF;
      }
    }
  }
  .main {
    .el-table{
      margin-bottom: 30px;
    }
    .medical {
      padding-left: 30px;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: red;
      }
      i{
        font-size:14px;
      }
    }
  }
</style>
