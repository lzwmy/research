<template>
  <div class="cloud-component dataDictionary">
    <div class="component_head flex-between-center">
      <p>{{$route.meta.txt}}</p>
      <div class=" cur_pointer head_content flex-start-center">
        <el-button type="primary" @click="onShowDialog()" icon="el-icon-plus">添加代码集</el-button>
      </div>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="代码集名称：">
          <el-input v-model="ruleForm.code" @keyup.enter.native="getDataList()" size="mini" placeholder="请输入显示代码" class="search-input" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="包含的显示名：">
          <el-input v-model="ruleForm.name" v-focus @keyup.enter.native="getDataList()" size="mini" placeholder="请输入显示名称" class="search-input" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()" icon="el-icon-search">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" fit>
          <el-table-column prop="termGroupName" label="代码集名称" width="210px"></el-table-column>
          <el-table-column prop="termGroupOid" label="代码集OID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column  label="代码集包含的显示名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <p v-for="(item,index) in scope.row.termItemRspList" :key="index">
                {{item.termItemName}} : {{item.termItemCode}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="使用此代码集的条目(条目名称>条目显示名)" min-width="100px" show-overflow-tooltip>
            <template slot-scope="scope" >
              <p v-for="(item, index) in scope.row.formItemRspList" :key="index">{{item.controlName}} > {{item.controlDisplayName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="onShowDialog(scope.row)"><i class="iconfont iconbianji"></i></el-button>
              <el-button type="text" @click="onDelete(scope.row)"><i class="iconfont iconshanchu del"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>

    <!--添加/编辑代码集弹框-->
    <el-dialog 
      :title="ruleFormDialog.title" 
      :visible.sync="ruleFormDialog.visible" 
      :append-to-body="true" 
      width="45%"
      @close="closeDialog">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="ruleFormDialogRules" label-width="140px" label-position="left"
              class="ruleFormDialog" @submit.native.prevent v-loading="ruleFormDialog.loading">
        <el-form-item label="代码集名称：" prop="termGroupName">
          <el-input 
            v-model.trim="ruleFormDialog.termGroupName" 
            placeholder="请输入代码集名称"
            :maxlength="40"
            size="mini"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="代码集OID：" prop="termGroupOid">
          <el-input 
            v-model.trim="ruleFormDialog.termGroupOid" 
            placeholder="请输入代码集OID" 
            :maxlength="40"
            disabled
            size="mini"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="代码集包含的显示名：" label-width="160px">
          <i @click="onHandAdd" class="icon iconfont iconfuhao1" style="font-size:26px;"></i>
          <i @click="showAddCodeLoading" class="el-icon-search" style="font-size:24px;"></i>
        </el-form-item>
        <el-form-item label-width="0">
          <el-table
            :data="ruleFormDialog.formList" ref="fromTableDialog" style="width: 100%" v-loading="loading"  max-height="450"
            :empty-text="emptyText" :element-loading-text="elementLoadingText" fit stripe size="mini">
            <el-table-column prop="termItemCode" label="显示代码" show-overflow-tooltip align="left"></el-table-column>
            <el-table-column label="显示名称" show-overflow-tooltip align="left">
              <template slot-scope="scope">
                <el-input type="text" id="autoFocus" v-model="scope.row.termItemName" v-if="scope.row.edit" @blur="getItem(scope.row, scope.$index)"></el-input>
                <p v-else>{{scope.row.termItemName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" label-width="140">
              <template slot-scope="scope">
                <i @click="onChangeOrder(scope.row,'up',scope.$index)" class="icon iconfont iconfuhao5"></i>
                <i @click="onChangeOrder(scope.row,'down',scope.$index)" class="icon iconfont iconfuhao6"></i>
                <i @click="onChangeOrder(scope.row,'delete',scope.$index)" class="icon iconfont iconfuhao4"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSaveDialog('ruleFormDialog')" size="mini" :disabled="ruleFormDialog.loading">保 存</el-button>
        <el-button @click="ruleFormDialog.visible = false;" size="mini">关 闭</el-button>
      </div>
    </el-dialog>

    <!--添加医学代码弹框-->
    <el-dialog 
      title="查询医学代码" 
      :visible.sync="addCodeDialog.visible" 
      :append-to-body="true" 
      width="600px"
      class="searchDialog">
      <el-form :model="addCodeDialog" label-width="0" label-position="left"
          class="el-dialog--center" @submit.native.prevent>
        <el-form-item  prop="termGroupName" align="left">
          <el-input 
            v-model.trim="addCodeDialog.termGroupName" 
            placeholder="按代码医学代码名称或oid搜索"
            :maxlength="30"
            :clearable="true"
            size="mini"
            style="width:300px;"
            @keyup.enter.native="addCodeSearch">
          </el-input>
          <el-button size="mini" type="primary" @click="addCodeSearch">搜 索</el-button>
        </el-form-item>
        <el-form-item label="医学代码查询结果：" label-width="160px" align="left"></el-form-item>
        <el-form-item>
          <el-table
            :data="addCodeDialog.formList" style="width: 100%" v-loading="addCodeDialog.loading"  height="450"
            :empty-text="emptyText" :element-loading-text="elementLoadingText" fit stripe size="mini">
            <el-table-column prop="termItemCode" label="显示代码" show-overflow-tooltip align="left"></el-table-column>
            <el-table-column prop="termItemName" label="显示名称" show-overflow-tooltip align="left"></el-table-column>
            <el-table-column label="操作" align="center" label-width="90">
              <template slot-scope="scope">
                <el-button type="text" @click="onAddtoFormList(scope.row)" size="mini" style="color:#1bbae1;">添 加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';

export default {
  name: 'staticInfo',
  mixins: [mixins],
  data () {
    return {
      ruleForm: {
        code:"",
        name:""
      },
      dataList: {},
      loading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
      ruleFormDialog: {
        title:"",
        id:"",
        termGroupName: "",
        termGroupOid: "",
        formList: [],
        visible: false,
        loading: false,
      },
      addCodeDialog: {
        termGroupName: "",
        termGroupOid: "",
        formList: [],
        visible: false,
        loading: false,
      },
      addTempFormList:[],   //保存临时添加的代码集
      ruleFormDialogRules:{
        termGroupName: [
          {required: true, message: '请输入代码集名称', trigger: 'blur'}
        ],
        termGroupOid: [
          {required: true, message: '请输入代码集OID', trigger: 'blur'}
        ],
      }
    };
  },
  created() {
    console.log(pageNo)
  },
  components: {
    pagination,
    echartsContain
  },
  methods: {
    initPage () {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.getDataList();
    },
    async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      console.log(pageNo)
      let that = this;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      that.dataList.content = [];
      that.loading = true;
      let formData = {
        offset: pageNo - 1,
        limit: pageSize,
        termGroupName: that.ruleForm.code?that.ruleForm.code:null,
        termItemName: that.ruleForm.name?that.ruleForm.name:null
      };
      try {
        let data = await that.$http.dataDictionaryFindList(formData);
        if (data.code == '0') {
          let obj = {};
          obj.content = data.data.termGroupList;
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.pageRsp.totalElements);
          obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
          that.dataList = obj;
        }
      } catch (error) {
        this.$mes('error', "获取数据字典列表失败");
      }
      that.loading = false;
    },
    reset () {
      this.ruleForm = {
        code:"",
        name:""
      }
    },
    //删除代码集
    onDelete (row) {
      let that = this;
      that.$confirm('确认删除该代码集？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          termGroupId: row.id
        };
        try {
          let data = await that.$http.dataDictionaryDelete(formData);
          if (data.code == '0') {
            this.$mes('success', data.message || '删除成功');
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          this.$mes('error', '删除出错');
        }
      }).catch((error) => {});
    },
    //保存新增/编辑 医学代码集
    onSaveDialog(ruleFormDialog) {
      let that = this;
      that.$refs.ruleFormDialog.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        that.ruleFormDialog.loading = true;
        let newArr = that.ruleFormDialog.formList.map((item,index)=>{
          return item.termItemCode;
        })
        let data, formData;
        try {
          if(that.ruleFormDialog.title == "编辑代码集"){
            formData = {
              id: that.ruleFormDialog.id,
              termGroupName: that.ruleFormDialog.termGroupName,
              termItemCodeList: newArr
            }
            data = await that.$http.dataDictionaryEdit(formData);
          }else{
            formData = {
              termGroupName: that.ruleFormDialog.termGroupName,
              oid: that.ruleFormDialog.termGroupOid,
              termItemCodeList: newArr
            }
            data = await that.$http.dataDictionaryAdd(formData);
          }
          if (data.code == '0') {
            this.$mes('success', data.msg);
            that.getDataList(that.currentPageNo, that.currentPageSize);
            that.ruleFormDialog.visible = false;
          }
          that.ruleFormDialog.loading = false;
        } catch (error) {
          this.$mes('error', data.msg);
          that.ruleFormDialog.loading = false;
        }
      });
    },
    //显示添加/编辑代码集
    onShowDialog(row) {
      this.ruleFormDialog.visible = true;
      this.$nextTick(()=>{
      this.$refs.ruleFormDialog.clearValidate();   
      })
      if(row){
        this.ruleFormDialog.title = "编辑代码集";
        this.ruleFormDialog.id = row.id;
        this.ruleFormDialog.termGroupName = row.termGroupName;
        this.ruleFormDialog.termGroupOid = row.termGroupOid;
        //获取代码集
        this.getCodeSet(row.id);
      }else{
        this.getCodeOid();
        this.ruleFormDialog.title = "新建代码集";
        this.ruleFormDialog.termGroupName = "";
        this.ruleFormDialog.termGroupOid = "";
        this.ruleFormDialog.formList = [];
      }
    },
    showAddCodeLoading() {
      this.addCodeDialog.visible = true;
      this.addCodeDialog.termGroupName = "";
      this.addCodeDialog.formList = [];
      this.addCodeSearch();
    },
    //获取代码集
    async getCodeSet(id) {
      let that = this;
      that.ruleFormDialog.loading = true;
      let formData = {
        termGroupId: id
      };
      try {
        let data = await that.$http.dataDictionaryIDFindList(formData);
        if (data.code == '0') {
          this.ruleFormDialog.formList = data.data.termItemRspList?data.data.termItemRspList:[];
          this.addTempFormList.forEach((item)=>{
            this.ruleFormDialog.formList.splice(this.ruleFormDialog.formList.length-1,0,item);
          })
          this.ruleFormDialog.loading = false;
        }
      } catch (error) {
        this.ruleFormDialog.loading = false;
        this.$mes('error', "获取医学代码集失败");
      }
    },
    //获取代码集oid
    async getCodeOid() {
      try {
        let data = await this.$http.dataDictionaryCreateOid();
        if (data.code == '0') {
          this.ruleFormDialog.termGroupOid = data.data;
        }
      } catch (error) {
        this.$mes('error', "获取代码集oid失败");
      }
    },
    //关闭窗口的回调
    closeDialog(){
      this.addTempFormList = [];
    },
    //代码集顺序改变
    onChangeOrder(row,order,index) {
      if(order == "up"){
        if(index == 0){
          this.$mes('info', "已经为第一条，无法上移");
          return;
        }
        this.ruleFormDialog.formList.splice(index, 1);
        this.ruleFormDialog.formList.splice(index-1, 0, row);
      }else if(order == "down"){
        if(index == (this.ruleFormDialog.formList.length - 1)){
          this.$mes('info', "已经为最后一条，无法下移");
          return;
        }
        this.ruleFormDialog.formList.splice(index, 1);
        this.ruleFormDialog.formList.splice(index+1, 0, row);
      }else{
        this.ruleFormDialog.formList.splice(index, 1);
      }
    },
    //添加代码集搜索
    async addCodeSearch() {
      let that = this;
      that.addCodeDialog.loading = true;
      let formData = {
        termItemName: that.addCodeDialog.termGroupName
      };
      try {
        let data = await that.$http.dataDictionaryfind(formData);
        if (data.code == '0') {
          that.addCodeDialog.formList = data.data;
          that.addCodeDialog.loading = false;
        }
      } catch (error) {
        that.addCodeDialog.loading = false;
        this.$mes('error', "获取医学代码集失败");
      }
    },
    //添加到医学代码集
    onAddtoFormList(row) {
      if(!this.ruleFormDialog.formList){
        return;
      }
      let exist = this.ruleFormDialog.formList.some((item,index)=>{
        return item.id == row.id;
      })
      if(exist){
        this.$mes('info', "该医学代码已存在");
        return;
      }
      this.addTempFormList.push(row);
      this.ruleFormDialog.formList.push(row);
      this.$nextTick(() => {
        let scrollHeight = this.$refs.fromTableDialog.bodyWrapper.scrollHeight;
        this.$refs.fromTableDialog.bodyWrapper.scrollTop = this.$refs.fromTableDialog.bodyWrapper.scrollHeight;
      })
    },
    //手动添加代码集项
    onHandAdd() {
      //如果不为数组
      if(!Array.isArray(this.ruleFormDialog.formList)){
        this.ruleFormDialog.formList = [];
      }
      this.ruleFormDialog.formList.push({
        edit:true
      })
      this.$nextTick(() => {
        let scrollHeight = this.$refs.fromTableDialog.bodyWrapper.scrollHeight;
        this.$refs.fromTableDialog.bodyWrapper.scrollTop = this.$refs.fromTableDialog.bodyWrapper.scrollHeight;
      })
      this.$nextTick(()=>{
        console.log(document.querySelector("#autoFocus"))
        document.querySelector("#autoFocus").focus();
      })
    },
    //手动添加代码名后获取数据
    async getItem(row, index) {
      let that = this;
      let formData = {
        termGroupId: that.ruleFormDialog.id,
        termItemName: that.ruleFormDialog.formList[index].termItemName
      };
      that.ruleFormDialog.formList.pop();
      if(!row['termItemName']){
        return;
      }
      try {
        let data = await that.$http.dataDictionaryHandAdd(formData);
        if (data.code == '0') {
          this.$mes('success', data.msg);
          that.getCodeSet(that.ruleFormDialog.id);
        }
      } catch (error) {
          this.$mes('error', "添加医学代码集失败");
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


<style scoped>
  .iconfont {
    font-size: 18px;
    padding:0 5px;
  }
  .ruleFormDialog .el-input {
    width: 100% !important;
  }
  .el-icon-search {
    font-size: 25px;
    font-weight: 800;
    line-height: 36px !important;
    padding-left: 10px;
  }
  .iconfuhao5,
  .iconfuhao6,
  .iconfuhao1,
  .el-icon-search {
    color:#1bbae1;
  }
  
  .iconfuhao4 {
    color:#f56c6c;
  }
  i {
    cursor: pointer;
  }
  
</style>
<style>

  body .searchDialog .el-dialog {
    top: 3% !important;
    left: 3% !important;
    transform: translate(0, 0) !important;
  }
</style>
