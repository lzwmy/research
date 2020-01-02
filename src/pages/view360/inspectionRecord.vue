<template>
  <div class="">
    <aside>
      <slot name="top"></slot>
      <p v-if="recordCheck.length == 0" style="text-align:center;padding: 20px;">暂无记录</p>
      <el-menu
        class="el-menu-vertical-demo"
        default-active="1-1"
        :default-openeds="defaultOpeneds"
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
              <p>
                <span class="title">{{itemDetail.examItemName}}</span>
                <span class="ico" :class="itemDetail.examClass">{{itemDetail.examClass}}</span>
              </p>
              <p class="time">报告时间:{{itemDetail.examTime}}</p>
            </el-menu-item>
          </el-menu-item-group>

        </el-submenu>
      </el-menu>
    </aside>

    <div class="main">
      <p><i class="icon iconfont iconzhuyuanjilu"></i>报告单</p>
      <div class="box" v-loading="loading">
        <h2>报告单</h2>
        <div class="row">
          <span class="f-left">深圳市龙华区中心医院</span>
          <span class="f-right">【门诊】</span>
        </div>
        <div class="row">
          <div class="t">
            <p>姓名: <span>{{basicInfo.patientName}}</span></p>
            <p>性别: <span>{{basicInfo.genderCode==1?'男':'女'}}</span></p>
            <p>年龄: <span>{{basicInfo.age}}</span></p>
          </div>
          <div class="t">
            <p>门(急)诊流水号: <span>{{infoData.examSno}}</span></p>
            <p>检查号: <span>暂无</span></p>
            <p>检查日期: <span>{{infoData.examDate}}</span></p>
          </div> 
          <div class="t">
            <p>申请科室: <span>{{infoData.reportDeptName}}</span></p>
            <p>诊断名称: <span>{{infoData.examDate}}</span></p>
          </div>
        </div>
        <div class="row noline">
          <span><b>检查所见：</b></span>
          <div class="text text-minH">{{infoData.examDesc}}</div>
        </div>
        <div class="row noline">
          <span><b>诊断意见：</b></span>
          <div class="text">
            {{infoData.examResult}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from 'components/utils/index';

export default {
  name: 'inspectionRecord',
  props:['comData','basicInfo'],
  data () {
    return {
      loading: false,
      infoData:{},
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
  computed: {

  },
  created () {
    this.comData.examTestClass = "全部";
    this.getBasicRecordCheckList()
    .then(()=>{
      JSON.stringify(this.recordCheck) !='[]' && JSON.stringify(this.recordCheck[0].list) !='[]' && this.getBasicDetail(this.recordCheck[0].list[0]);
    })
  },
  mounted () {

  },
  components: {
  },
  methods: {
    // 获取检查详细信息
    async getBasicDetail(row,index) {
      this.loading = true;
      let formData = {
        examId: row.examId,
        orgCode: this.comData.orgCode
      };
      try {
        let data = await this.$http.getExamInfoDetail(formData);
        if (data.code == 0) {
          this.infoData = data.data;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error)
      }
    },
    // 查询患者检查记录列表
    async getBasicRecordCheckList(row,index) {
      let formData = {
        orgCode: this.comData.orgCode,
        patientId: this.comData.patientId,
        type:0
      };
      try {
        let data = await this.$http.getBasicRecordCheckList(formData);
        if (data.code == 0) {
          this.recordCheck = data.data;
          this.recordCheck.forEach((item)=>{
            item.recordDate = item.recordDate?item.recordDate.slice(0,10):"";
            item.admitDate = item.admitDate?item.admitDate.slice(0,10):"";
            item.dischargeDateTime = item.dischargeDateTime?item.dischargeDateTime.slice(0,10):"";
          })
          this.recordAll = utils.deepCopy(this.recordCheck);
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
          return listItme.examSubClass == this.comData.examTestClass;
        })
      })
      return newArr;
    },
    menuOpen(index) {
      if(!this.defaultOpeneds.includes(index)) {
        this.defaultOpeneds.push(index);
      }
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
.box {
  width: 1000px;
  margin: 40px auto;
  box-shadow:1px 1px 6px rgba(0,0,0,0.16);
  padding: 40px;
  font-size: 14px;
  h2 {
    text-align: center;
    color: #444;
    font-size: 22px;
    font-weight: normal;
  }
  .row {
    padding: 10px;
    margin: 10px 0;
    border-bottom: 1px solid rgba(141,141,141,1);   
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    &.noline {
      border:none;
    }
    span {
      color: #63666E;
    }
    .f-left {
      float: left;
    }
    .f-right {
      float: right;
    }
    .t {
      margin-bottom: 10px;
      p {
        color: #63666E;
        font-weight: bold;
        font-size: 14px;
        width: 33%;
        display: inline-block;
        span {
          color: #666;
          font-weight: normal;
        }
      }
    }
    .text{
      padding-left: 58px;
      color: #63666E;
    }
    .text.text-minH{
      min-height: 50px;
    }
  }
}

.el-menu-item {
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    width: 180px;
  }
  .ico {
    display: inline-block;
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border:1px solid #ddd;
    border-radius: 1px;
    &.CT {
      border-color: #26C1BC;
      color: #26C1BC;
    }
    &.ECG {
      border-color: #FDB652;
      color: #FDB652;
    }
    &.US {
      border-color: #3C81F0;
      color: #3C81F0;
    }
    &.MR {
      border-color: #FA6784;
      color: #FA6784;
    }
    &.DX {
      border-color: #63c8fb;
      color: #63c8fb;
    }
  }
  
}
</style>
