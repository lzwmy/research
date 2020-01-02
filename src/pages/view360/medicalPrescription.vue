

<template>
  <div class="">
    <aside>
      <slot name="none"></slot>
      <p v-if="record.length == 0" style="text-align:center;padding: 20px;">暂无记录</p>
      <ul v-else>
        <li :class="activeli==index?'active':''" v-for="(item,index) in record" :key="index" @click="onClickRecord(item,index,item.inSno?'住院':'门诊')">
          <p>{{item.inSno?'住院':'门诊'}}  <span>{{item.deptName}}</span></p>
          <span class="time">{{item.recordDate}}</span>
        </li>
      </ul>
    </aside>

    <div class="main">
      <el-form :model="form" label-width="70px">
        <div v-if="recordType=='门诊'">
          <p><i class="icon iconfont iconmenzhenchufang"></i>门诊处方</p>
          <div>
            <el-form-item label="处方类型">
              <el-checkbox-group v-model="form.outCategory" @change="onChange">
                <el-checkbox :label="item.name" v-for="(item,index) in outList.typeList" :key="index" style="margin-left: 0 ;"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="处方类别">
              <el-checkbox-group v-model="form.outType" @change="onChange">
                <el-checkbox :label="item.name" v-for="(item,index) in outList.sortList" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        
          <el-table
            :data="dataList" v-loading="loading"
            max-height="550" stripe fit highlight-current-row>
            <el-table-column prop="invoiceTime" label="日期" width="160px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="diagNameInhos" label="疾病诊断" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rpNumber" label="处方号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rpType" label="处方类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drugName" label="处方药品" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rpDoctorName" label="开方医生" width="100px" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>


        <div v-if="recordType=='住院'">
          <p><i class="icon iconfont iconzhuyuanyizhu"></i>住院医嘱</p>
          <div>
            <el-form-item label="医嘱类别">
              <el-checkbox-group v-model="form.inCategory" @change="onChange">
                <el-checkbox :label="item.name" v-for="(item,index) in inList.sortList" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="医嘱类型">
              <el-checkbox-group v-model="form.inType" @change="onChange">
                <el-checkbox :label="item.name" v-for="(item,index) in inList.typeList" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="医嘱状态">
              <el-checkbox-group v-model="form.inStatus"  @change="onChange">
                <el-checkbox :label="item.name" v-for="(item,index) in inList.statusList " :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <el-table
            :data="dataList" v-loading="loading"
            max-height="550" stripe fit highlight-current-row>
            <el-table-column prop="orderBeginDate" label="开始时间" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderSno" label="医嘱号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="医嘱类别" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderTypeCode" label="医嘱类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderName" label="医嘱名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drugFreqName" label="频次" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="途径" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderStatusMemo" label="医嘱状态" show-overflow-tooltip></el-table-column>
            <el-table-column prop="doctorOrderName" label="申请医生"  width="100px" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
       </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'inspectionRecord',
  props:['comData','record','inList','outList'],
  data () {
    return {
      activeli: 0,
      loading: false,
      form: {
        outCategory:[],
        outType:[],
        inCategory:[],
        inType:[],
        inStatus:[],
      },
      dataList: [],
      //当前记录
      currentRecord:{},
      recordType:"",    //门诊/住院记录
    };
  },
  watch: {},
  computed: {},
  created () {
    this.selectAll();
    console.log(this.inList)
    this.record[0] && this.onClickRecord(this.record[0],0,this.record[0].inSno?'住院':'门诊');
  },
  mounted () {

  },
  components: {
  },
  methods: {
    // 获取处信息列表
    async onClickRecord(data,index,str) {
      this.dataList = [];
      this.activeli = index;
      this.currentRecord = data;
      this.recordType = str;
      this.loading = true;
      let formData = {
        inSno: this.currentRecord.inSno?this.currentRecord.inSno:"",
        sort: this.currentRecord.sort?this.currentRecord.sort:[],
        status: this.currentRecord.status?this.currentRecord.status:[],
        outSno: this.currentRecord.outSno?this.currentRecord.outSno:"",
        type: this.currentRecord.type?this.currentRecord.type:[],
        orgCode: this.comData.orgCode
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
            this.dataList = data.data;
          })
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    //门诊处方多选框改变,找出对应的code码
    onChange() {
      let outCategoryCode = [],
          outTypeCode = [],
          inCategoryCode = [],
          inTypeCode = [],
          inStatusCode = [];
      
      if(this.recordType=='门诊'){
        this.form.outCategory.forEach((item)=>{
          this.outList.typeList.forEach((typeList)=>{
            if(item == typeList.name){
              outTypeCode.push(typeList.code);
            }
          })
        })
        this.form.outType.forEach((item)=>{
          this.outList.sortList.forEach((sortList)=>{
            if(item == sortList.name){
              outCategoryCode.push(sortList.code);
            }
          })
        })
        
        if(outCategoryCode.length == 0 || outTypeCode.length == 0 ) {
          this.dataList = [];
          return;
        }
        this.currentRecord.sort = outCategoryCode;
        this.currentRecord.type = outTypeCode;
        this.currentRecord.status = [];
      }

      if(this.recordType=='住院'){
        this.form.inCategory.forEach((item)=>{
          this.inList.sortList.forEach((sortList)=>{
            if(item == sortList.name){
              inCategoryCode.push(sortList.code);
            }
          })
        })
        this.form.inType.forEach((item)=>{
          this.inList.typeList.forEach((typeList)=>{
            if(item == typeList.name){
              inTypeCode.push(typeList.code);
            }
          })
        })
        this.form.inStatus.forEach((item)=>{
          this.inList.statusList.forEach((statusList)=>{
            if(item == statusList.name){
              inStatusCode.push(statusList.code);
            }
          })
        })
        if(inCategoryCode.length == 0 || inTypeCode.length == 0 || inStatusCode.length == 0) {
          this.dataList = [];
          return;
        }
        this.currentRecord.sort = inCategoryCode;
        this.currentRecord.type = inTypeCode;
        this.currentRecord.status = inStatusCode;
      }
      this.onClickRecord(this.currentRecord,this.activeli,this.recordType);
    },
    //默认选中全部多选框
    selectAll() {
      this.outList.typeList.forEach( item =>{
        this.form.outCategory.push(item.name)
      })
      this.outList.sortList.forEach( item =>{
        this.form.outType.push(item.name)
      })

      this.inList.sortList.forEach( item =>{
        this.form.inCategory.push(item.name)
      })
      this.inList.typeList.forEach( item =>{
        this.form.inType.push(item.name)
      })
      this.inList.statusList.forEach( item =>{
        this.form.inStatus.push(item.name)
      })
    }
  }
};
</script>


<style lang='less' scoped>
 ul {
   height: 100%;
   width: 310px;
   overflow: auto;
   padding-bottom: 50px;
   li {
    padding-left: 20px;
    color: #63666E;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    padding: 5px 0 5px 20px;
    &:hover {
      background: #ECF5FF;
    }
    &.active {
      background: #ECF5FF;
      border-left: 2px solid #3C81F0;
      padding-left: 18px !important;
      p {
        color:#3C81F0;
      }
      .time {
        color: #3C81F0;
      }
    }
    p {
      font-size: 14px;
      line-height: 22px;
     }
   }
 }
 .el-form-item {
   margin-bottom: 0 !important;
   .el-form-item__label {
     font-size: 14px;
   }
 }
 .el-table {
   margin:10px 0 30px 0;
 }
 .el-checkbox-group {
  .el-checkbox {
    margin-left: 0 !important;
  }
 }
</style>
