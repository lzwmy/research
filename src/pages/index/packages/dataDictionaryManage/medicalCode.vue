<template>
  <div class="cloud-component medicalCode">
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="显示代码：">
          <el-input v-model="ruleForm.code" placeholder="请输入显示代码" size="mini" @keyup.enter.native="search" :clearable="true"  class="search-input" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="显示名称：">
          <el-input v-model="ruleForm.name" placeholder="请输入显示名称" size="mini" @keyup.enter.native="search" :clearable="true"  class="search-input" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">清空</el-button>
          <el-button @click="onShowDialog()">新建代码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && JSON.stringify(dataList.content) != '[]')?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" fit stripe>
          <el-table-column type="index" label="序号" width="100px"></el-table-column>
          <el-table-column prop="termItemName" label="显示名"></el-table-column>
          <el-table-column prop="termItemCode" label="显示代码"></el-table-column>
          <el-table-column label="使用该显示名的代码集(OID>代码集名称)" min-width="100px" show-overflow-tooltip>
            <template slot-scope="scope" >
              <p v-for="(item, index) in scope.row.termGroupList">{{item.oid}} > {{item.termGroupName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" @click="onShowDialog(scope.row)"><i class="iconfont iconbianji"></i></el-button>
              <el-button type="text" @click="onDelete(scope.row)"><i class="iconfont iconshanchu del"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :data="dataList" @change="getDataList"></pagination>
        <!-- 分页 -->
      </echarts-contain>
    </div>

    <!--添加/编辑代码集弹框-->
    <el-dialog 
      :title="ruleFormDialog.title" 
      :visible.sync="ruleFormDialog.visible" 
      width="45%">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="ruleFormDialogRules" label-width="100px"
               class="ruleFormDialog" @submit.native.prevent v-loading="ruleFormDialog.loading" label-position="left">
        <el-form-item label="医学名称：" prop="termItemName">
          <el-input 
            v-model.trim="ruleFormDialog.termItemName" 
            placeholder="请输入医学名称"
            :maxlength="20"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="医学代码：">
          <el-input 
            v-model.trim="ruleFormDialog.termItemCode" 
            :maxlength="20"
            :clearable="true"
            disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="医学代码分类：" align="left">
          <el-select
            v-model="ruleFormDialog.formList"
            multiple
            filterable
            default-first-option
            class="select-class"
            placeholder="请选择代码分类">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：" align="left">
          <el-input type="textarea" :rows="8" v-model="ruleFormDialog.termItemDesc"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button type="primary" @click="onSaveDialog" size="mini" :disabled="ruleFormDialog.loading">保 存</el-button>
          <el-button @click="ruleFormDialog.visible = false;" size="mini">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import utils from 'components/utils/index';

import 'assets/css/common.less';

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
        termItemName: "",
        termItemCode: "",
        termItemDesc:"",
        formList: [],
        visible: false,
        loading: false,
        isOpen: false
      },
      selectList:[],  //医学代码分类下拉框
      ruleFormDialogRules:{
        termItemName: [
          {required: true, message: '请输入医学名称', trigger: 'blur'}
        ],
      }
    };
  },
  watch: {},
  computed: {},
  created () {
    this.initPage();
  },
  mounted () {

  },
  components: {
    pagination,
    echartsContain
  },
  methods: {
    initPage () {
      this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.search();
    },
    search () {
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      that.dataList.content = [];
      that.loading = true;
      let formData = {
        offset: pageNo - 1,
        limit: pageSize,
        termItemCode: that.ruleForm.code,
        termItemName: that.ruleForm.name
      };
      try {
        let data = await that.$http.dataDictionaryMedicalCodeList(formData);
        that.loading = false;
        if (data.code == '0') {
          let obj = {};
          obj.content = data.data.termItemList;
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.pageRsp.totalElements);
          obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
          that.dataList = obj;
        }
      } catch (error) {
        that.loading = false;
        this.$mes('error', "获取数据字典列表失败");
      }
    },
    reset () {
      this.ruleForm = {
        code:"",
        name:""
      }
    },
    onDelete (row) {
      let that = this;
      that.$confirm('确认删除该医学代码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          termItemId: row.id,
        };
        try {
          let data = await that.$http.dataDictionaryMedicalCodeDeleteOne(formData);
          if (data.code == '0') {
            this.$mes('success',  data.message || '删除成功');
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
          this.$mes('error',  '删除出错');
        }
      }).catch((error) => {});
    },
    onSaveDialog(row) {
      let that = this;
      that.$refs.ruleFormDialog.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        that.ruleFormDialog.loading = true;
        let formData,data;
        try {
          if(that.ruleFormDialog.title == "编辑医学代码"){
            formData = {
              id: that.ruleFormDialog.id,
              termItemName: that.ruleFormDialog.termItemName,
              termItemDesc: that.ruleFormDialog.termItemDesc,
              termCategoryNameList: that.ruleFormDialog.formList
            }
            data = await that.$http.dataDictionaryMedicalCodeEdit(formData);
          }else{
            formData = {
              termItemName: that.ruleFormDialog.termItemName,
              termItemDesc: that.ruleFormDialog.termItemDesc,
              termCategoryNameList: that.ruleFormDialog.formList
            }
            data = await that.$http.dataDictionaryMedicalCodeAdd(formData);
          }
          if (data.code == '0') {
            this.$mes('success',  data.msg);
            that.ruleFormDialog.visible = false;
          }
          that.ruleFormDialog.loading = false;
          that.getDataList(that.currentPageNo, that.currentPageSize);
        } catch (error) {
          this.$mes('error',  data.msg);
          that.ruleFormDialog.loading = false;
        }
      });
    },
    //显示新建或编辑弹框
    onShowDialog(row) {
      this.ruleFormDialog.visible = true;
      this.$nextTick(()=>{
       this.$refs.ruleFormDialog.clearValidate();   
      })
      if(row){
        this.ruleFormDialog.title = "编辑医学代码";
        this.ruleFormDialog.id = row.id;
        this.ruleFormDialog.termItemName = row.termItemName;
        this.ruleFormDialog.termItemCode = row.termItemCode;
        this.ruleFormDialog.termItemDesc = row.termItemDesc;
        this.ruleFormDialog.formList = [];
        this.getCodeList()
        .then(()=>{
          this.getCodeObject(this.ruleFormDialog.termItemCode);
        })
      }else{
        this.getNewCode();
        this.ruleFormDialog.title = "新建医学代码";
        this.ruleFormDialog.termItemName = "";
        this.ruleFormDialog.termItemDesc = "";
        this.ruleFormDialog.formList = [];
        this.getCodeList();
      }
    },
    //获取医学代码项描述、分类
    async getCodeList (){
      let that = this;
      try {
        let data = await that.$http.dataDictionaryMedicalCodeCategory();
        if (data.code == '0') {
          let list = [];
          if(data.data){
            for(let i in data.data){
              list.push({
                value: data.data[i],
                label: data.data[i]
              })
            }
          }
          this.selectList = utils.deepCopy(list);
        }else {
          this.$mes('error','获取医学代码分类失败');
        }
      } catch (error) {
        console.log(error)
      }
    },
    //获取新医学代码
    async getNewCode() {
      try {
        let data = await this.$http.dataDictionaryCreateCode();
        if (data.code == '0') {
          this.ruleFormDialog.termItemCode = data.data;
        }
      } catch (error) {
        this.$mes('error', "获取新医学代码失败");
      }
    },
    async getCodeObject (termItemCode){
      let that = this;
      this.ruleFormDialog.loading = true;
      try {
        let dataDesc = await that.$http.dataDictionaryMedicalCodeCategoryObject(termItemCode);
        if (dataDesc.code == '0') {
          this.ruleFormDialog.termItemDesc = dataDesc.data.termItemDesc;
          let termCategoryRspList = [];
          for(let item of dataDesc.data.termCategoryRspList){
            termCategoryRspList.push(item.categoryName);
          }
          this.ruleFormDialog.formList = termCategoryRspList;
        }else {
          this.$mes('error', "获取医学代码信息失败");
        }
      } catch (error) {
        console.log(error)
      }
      this.ruleFormDialog.loading = false;
    },
    //删除医学代码分类标签
    handleClose(tag) {
      this.ruleFormDialog.formList.splice(this.ruleFormDialog.formList.indexOf(tag),1);
    },
    //展开医学代码分类
    onOpen() {
      this.ruleFormDialog.isOpen = !this.ruleFormDialog.isOpen;
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


<style lang="less"  scoped>
  .iconfont {
    font-size: 18px;
    padding: 0 5px;
  }
  .ruleFormDialog .el-input {
    width: 100% !important;
  }
  .select-class {
    width:50%;
  }
</style>

<style>
  body.theme-blue .el-form .el-form-item .select-class .el-input,
  body.theme-green .el-form .el-form-item .select-class .el-input,
  body.theme-blue .el-form .el-form-item .select-class .el-input--suffix,
  body.theme-green .el-form .el-form-item .select-class .el-input--suffix {
    width: 100%;
  }
</style>