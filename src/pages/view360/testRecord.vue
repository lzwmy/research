<template>
  <div class="">
    <aside>
      <slot name="top"></slot>
      <p v-if="recordCheck.length == 0" style="text-align:center;padding: 20px;">暂无记录</p>
      <el-menu
        class="el-menu-vertical-demo"
        default-active="1-1"
        :default-openeds="defaultOpeneds"
        @open="menuOpen"
        v-else>
        <el-submenu :index="String(index+1)" v-for="(item,index) in recordCheck" :key="index">
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
              <p class="t">{{itemDetail.labSubjectName}}</p>
              <p class="time">报告时间:{{itemDetail.labDate}}</p>
            </el-menu-item>
          </el-menu-item-group>

        </el-submenu>
      </el-menu>
    </aside>

    <div class="main">
      <p><i class="icon iconfont iconxiechanggui"></i>血常规</p>
      <div class="box">
        <div class="row">
          <div class="t">
            <p>机构名称: <span></span></p>
            <p>病历号: <span></span></p>
            <p>姓名: <span>{{basicInfo.patientName}}</span></p>
          </div>
          <div class="t">
            <p>性别: <span>{{basicInfo.genderCode==1?'男':'女'}}</span></p>
            <p>年龄: <span>{{basicInfo.age}}</span></p>
            <p>标本名称: <span></span></p>
          </div> 
          <div class="t">
            <p>申请科室: <span></span></p>
            <p>申请医生: <span></span></p>
            <p>申请日期: <span></span></p>
          </div>
          <div class="t">
            <p>临床诊断: <span></span></p>
          </div>
        </div>
        <el-table
          :data="dataList" v-loading="loading" stripe max-height="800px">
          <el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
          <el-table-column prop="itemEnName" label="检验项目代码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemChName" label="检验项目代码名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemResultDesName" label="结果" show-overflow-tooltip></el-table-column>
          <el-table-column prop="resultReference" label="提示" show-overflow-tooltip></el-table-column>
          <el-table-column label="参考范围" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.resultReferenceLow}} - {{scope.row.resultReferenceHigh}}
            </template>
          </el-table-column>
          <el-table-column prop="itemResultUnit" label="单位" width="90" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import utils from 'components/utils/index';

export default {
  name: 'testRecord',
  props:['comData','basicInfo'],
  data () {
    return {
      loading: false,
      dataList: [],
      recordCheck:[],
      recordAll:[],
      defaultOpeneds:['1']
    };
  },
  watch: {
    'comData.examTestClass':function(newVal, oldVal){
      this.comData.examTestClass = newVal;
      this.recordCheck = this.filterExamTestClass(this.recordAll);
    }
  },
  computed: {},
  created () {
    this.comData.examTestClass = "全部";
    this.getBasicRecordTestList()
    .then(()=>{
      JSON.stringify(this.recordCheck) !='[]' && JSON.stringify(this.recordCheck[0].list) !='[]' && this.getBasicDetail(this.recordCheck[0].list[0]);
    })

  },
  mounted () {

  },
  components: {
  },
  methods: {
    // 查询患者检查记录列表
    async getBasicRecordTestList(row,index) {
      let formData = {
        orgCode: this.comData.orgCode,
        patientId: this.comData.patientId,
        type:0
      };
      try {
        let data = await this.$http.getBasicRecordTestList(formData);
        if (data.code == 0) {
          this.recordCheck = data.data;
          this.recordCheck.forEach((item)=>{
            item.recordDate = item.recordDate?item.recordDate.slice(0,10):"";
            item.admitDate = item.admitDate?item.admitDate.slice(0,10):"";
            item.dischargeDateTime = item.dischargeDateTime?item.dischargeDateTime.slice(0,10):"";
          })
          this.recordAll = utils.deepCopy(this.recordCheck);
        }else{
          this.$mes('error',data.msg);
        }
      } catch (error) {
        this.$mes('error', '获取患者检验详细列表失败');
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
          return listItme.labSubjectCode == this.comData.examTestClass;
        })
      })
      return newArr;
    },
    // 查询检验详细信息
    async getBasicDetail(row) {
      this.loading = true;
      this.dataList = [];
       let formData = {
        labSno: row.labSno,
        orgCode: this.comData.orgCode
      };
      try {
        let data = await this.$http.getCheckInfoDetail(formData);
        if (data.code == 0) {
          this.dataList = data.data;
        }else{
          this.$mes('error',data.msg);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$mes('error', '获取患者检验详细信息失败');
      }
    },
    menuOpen(index) {
      if(!this.defaultOpeneds.includes(index)) {
        this.defaultOpeneds.push(index);
      }
    }
  }
};
</script>


<style lang='less' scoped>
.box {
  width: 1000px;
  min-height: 600px;
  margin: 40px auto;
  box-shadow:1px 1px 6px rgba(0,0,0,0.16);
  padding:20px 40px;
  font-size: 14px;
  .row {
    padding: 10px;
    margin: 10px 0;
    .t {
      margin-bottom: 10px;
      p {
        color: #63666E;
        font-weight: bold;
        font-size: 14px;
        width: 33%;
        display: inline-block;
        span {
          font-weight: normal;
        }
      }
    }
  }
}

.el-menu-item {
  .t {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 230px;
  }
}
</style>
