<template>
  <div class="cloud-component medicalCodeClass">
    <div class="component_head flex-between-center">
      <p>{{$route.meta.txt}}</p>
      <div class=" cur_pointer head_content flex-start-center">
        <el-button type="primary" @click="onShowDialog()" icon="el-icon-plus">添加医学分类</el-button>
      </div>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="医学分类名称：">
          <el-input v-model="ruleForm.name" @keyup.enter.native="getDataList()" size="mini" placeholder="请输入医学分类名称" class="search-input" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="代码分类ID：">
          <el-input v-model="ruleForm.code" @keyup.enter.native="getDataList()" size="mini" placeholder="请输入代码分类ID" class="search-input" :clearable="true"></el-input>
        </el-form-item>
            
        <el-form-item>
          <el-button type="primary" @click="getDataList()" icon="el-icon-search">查 询</el-button>
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
          <el-table-column type="index" label="序号" width="100px"></el-table-column>
          <el-table-column prop="categoryName" label="医学分类名称"></el-table-column>
          <el-table-column prop="categoryDesc" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="20%">
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

    <!--添加/编辑弹框-->
    <el-dialog 
      :title="ruleFormDialog.title" 
      :visible.sync="ruleFormDialog.visible" 
      :append-to-body="true"
      width="40%">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="ruleFormDialogRules" label-width="130px"
              class="ruleFormDialog" @submit.native.prevent v-loading="ruleFormDialog.loading">
        <el-form-item label="医学分类名称：" prop="termCategoryName" label-position="left">
          <el-input 
            v-model.trim="ruleFormDialog.termCategoryName" 
            placeholder="请输入医学分类名称"
            :maxlength="40"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input type="textarea" :rows="8" v-model="ruleFormDialog.termCategoryDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSaveDialog" size="mini" :disabled="ruleFormDialog.loading">保 存</el-button>
        <el-button @click="ruleFormDialog.visible = false;" size="mini">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
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
        termCategoryName: "",
        termCategoryDesc: "",
        visible: false,
        loading: false,
      },
      ruleFormDialogRules:{
        termCategoryName: [
          {required: true, message: '请输入医学分类名称', trigger: 'blur'}
        ]
      }
    };
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
      let that = this;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      that.loading = true;
      that.dataList.content = [];
      let formData = {
        offset: pageNo - 1,
        limit: pageSize,
        categoryName: that.ruleForm.name,
        id: that.ruleForm.code,
      };
      try {
        let data = await that.$http.medicalCodeClassifyList(formData);
        that.loading = false;
        if (data.code == '0') {
          let obj = {};
          obj.content = data.data.termCategoryList;
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.pageRsp.totalElements);
          obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
          that.dataList = obj;
        }
      } catch (error) {
        that.loading = false;
      }
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
      that.$confirm('确认删除该医学分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let formData = {
          id: row.id
        };
        try {
          let data = await that.$http.medicalCodeClassifyDelete(formData);
          if (data.code == '0') {
            this.$mes('success',data.message || '删除成功');
            that.getDataList(that.currentPageNo, that.currentPageSize);
          }
        } catch (error) {
        }
      }).catch((error) => {});
    },
    //保存新增/编辑 医学代码集
    onSaveDialog() {
      let that = this;
      that.$refs.ruleFormDialog.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        that.ruleFormDialog.loading = true;
        try {
          let data, formData;
          if(that.ruleFormDialog.title == "编辑医学分类"){
            formData = {
              id: that.ruleFormDialog.id,
              name: that.ruleFormDialog.termCategoryName,
              desc: that.ruleFormDialog.termCategoryDesc
            }
            data = await that.$http.medicalCodeClassifyEdit(formData);
          }else{
            formData = {
              termCategoryName: that.ruleFormDialog.termCategoryName,
              termCategoryDesc: that.ruleFormDialog.termCategoryDesc
            }
            data = await that.$http.medicalCodeClassifyAdd(formData);
          }
          if (data.code == '0') {
            this.$mes('success', data.msg);
            that.getDataList(that.currentPageNo, that.currentPageSize);
            that.ruleFormDialog.visible = false;
          }
          that.ruleFormDialog.loading = false;
        } catch (error) {
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
        this.ruleFormDialog.title = "编辑医学分类";
        this.ruleFormDialog.id = row.id;
        this.ruleFormDialog.termCategoryName = row.categoryName;
        this.ruleFormDialog.termCategoryDesc = row.categoryDesc;
      }else{
        this.ruleFormDialog.title = "新建医学分类";
        this.ruleFormDialog.termCategoryName = "";
        this.ruleFormDialog.termCategoryDesc = "";
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
  .dialog-footer {
    height: auto !important;
  }
</style>
