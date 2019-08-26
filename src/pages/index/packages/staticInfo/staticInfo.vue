<template>
  <div class="cloud-component roleManage">
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <disease-subjectgroup style="display: inline-block;" @select="changeDiseaseSubjectGroup" width="70px"
                              ref="diseaseSubjectGroup"></disease-subjectgroup>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="index" label="序号" min-width="5%"></el-table-column>
          <el-table-column prop="diseaseName" label="单病种" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="subjectName" label="课题" min-width="15%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="experimentName" label="实验组" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="crfFormName" label="CRF表单" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="casesNum" label="病例数" min-width="5%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unfillFormNum" label="CRF数量（未填写）" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="fillFormNum" label="CRF数量（已完成）" min-width="10%" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>
  </div>
</template>

<script>
import utils from 'components/utils';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import diseaseSubjectgroup from 'components/packages/linkage/diseaseSubjectgroup';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';

export default {
  name: 'staticInfo',
  mixins: [mixins],
  data () {
    return {
      ruleForm: {
        diseaseSubjectGroup: {}
      },
      params_ruleForm: {
        diseaseSubjectGroup: {}
      },
      dataList: {},
      loading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: ''
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
    echartsContain,
    diseaseSubjectgroup
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
      this.params_ruleForm = utils.deepClone(this.ruleForm);
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    changeDiseaseSubjectGroup (data) {
      this.ruleForm.diseaseSubjectGroup = data;
    },
    async getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      that.loading = true;
      let formData = {
        page: pageNo - 1,
        size: pageSize,
        diseaseId: that.params_ruleForm.diseaseSubjectGroup.disease,
        subjectId: that.params_ruleForm.diseaseSubjectGroup.subject,
        experimentId: that.params_ruleForm.diseaseSubjectGroup.group
      };
      try {
        let data = await that.$http.statisticsCountCasesCrf(that.$format(formData));
        that.loading = false;
        if (data.code == '0') {
          let obj = {};
          obj.content = data.data.list;
          obj.content.forEach((item, index) => {
            item.index = (pageNo - 1) * pageSize + index + 1;
          });
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.total);
          obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
          that.dataList = obj;
        }
      } catch (error) {
        that.loading = false;
        that.$notice('获取统计信息列表失败');
        console.log(error);
      }
    },
    reset () {
      // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.ruleForm.resetFields();
      this.$refs.diseaseSubjectGroup.ruleForm.disease = '';
      // 初始化注册data
      Object.assign(this.$data, this.$options.data());
      // 初始化data默认值及页面
      this.initPage();
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


<style lang="less">

</style>
