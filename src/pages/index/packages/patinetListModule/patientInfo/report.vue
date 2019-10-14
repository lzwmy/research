<template>
  <div class="report" v-loading='loading'>
    <el-table
      :data="dataList.content" v-loading="loading" ref="refTable"
      @row-click="handleClick">
      <el-table-column type="expand" width="20">
        <template slot-scope="props">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in 5"
              :key="index"
              :hide-timestamp="true">
              <div class="content">
                <i class="el-icon-edit"></i>
                <p><span>2019-8-20 16:10:20</span><span> {{$store.state.user.account}}填写报告</span></p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>
      <el-table-column prop="visitDate" label="就诊时间"></el-table-column>
      <el-table-column prop="reportName" label="报告名称"></el-table-column>
      <el-table-column prop="author" label="创建者"></el-table-column>
      <el-table-column prop="diseaseName" label="病种"></el-table-column>
      <el-table-column prop="groupName" label="课题组"></el-table-column>
      <el-table-column label="报告状态" width="100px">
        <template slot-scope="scope">
          {{scope.row.status==0?'未填写':'已填写'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click.stop="toReportFill(scope.row)"><i class="icon iconfont iconbianji"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :data="dataList" @change="getDataList"></pagination>
  </div>
</template>

<script>
  import pagination from 'components/packages/pagination/pagination';

  export default {
    name: 'report',
    props: ['reportFillData'],
    data() {
      return {
        dataList: {
          content: []
        },
        identify: "",
        paging: {
          pageNo: 1,
          pageSize: 10,
          currentPageNo: '',
          currentPageSize: '',
        },
        loading: false,
        hidden:'',
      };
    },
    watch: {},
    computed: {},
    created() {
      this.getIdentify(this.reportFillData.patientId);
      this.getDataList();
    },
    mounted() {
      this.addEventListenervisibilityChange();
    },
    components: {
      pagination
    },
    methods: {
      //获取身份证号
      async getIdentify(patientId) {
        let formData = {
          patientId: patientId
        }
        try {
          let res = await this.$http.casesSearchPatient(formData);
          if (res.code == 0) {
            this.identify = res.data.identitycardno || "";
          } else {
            this.$mes('error', "获取基本信息失败!");
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getDataList(pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
        let that = this;
        that.loading = true;
        that.paging.currentPageNo = pageNo;
        that.paging.currentPageSize = pageSize;
        that.dataList.content = [];
        let formData = {
          offset: pageNo,
          limit: pageSize,
          args: {
            diseaseId: this.reportFillData.diseaseId || '',
            subjectId: this.reportFillData.subjectId || '',
            groupId: this.reportFillData.groupId || '',
            crfId: '',
            patientName: this.reportFillData.patientName || '',
            startTime: null,
            endTime: null,
            status: ""
          }
        };
        try {
          // let res = await that.$http.RRMgetDataList(formData);
          // 新 2.0 查询报告记录
          let res = await that.$http.queryFilterReportList(formData);
          if (res.code == '0') {
            let obj = {};
            obj.content = res.data.args;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(res.data.totalElements);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.dataList = obj;
          } else {
            this.$mes('error', res.msg);
          }
          that.loading = false;
        } catch (err) {
          that.loading = false;
          console.log(err)
        }
      },
      toReportFill(row) {
        this.getIdentify(row.patientId)
          .then(() => {
            let that = this;
            let urlParameter = {
              cacheData: false,
              formId: row.crfId || "",
              reportId: row.id || '',
              groupId: row.groupId || "",
              subjectId: row.subjectId || "",
              diseaseId: row.diseaseId || "",
              patientName: row.patientName || "",
              patientId: row.patientId || "",
              identify: this.identify || "",
              from: "caseManage",
              diseaseName: row.diseaseName || "",
              subjectName: row.subjectName || "",
              groupName: row.groupName || "",
              title: row.reportName,
              isModify: "displayShow"
            };
            sessionStorage.setItem('reportFill', JSON.stringify({urlParameter}));
            let urlParameters = "cacheData=" + false + "&formId=" + row.crfId + "&reportId=" + row.id + "&groupId=" + row.groupId + "&subjectId=" + row.subjectId + "&diseaseId=" + row.diseaseId + "&patientName=" + row.patientName + "&patientId=" + row.patientId + "&identify=" + this.identify + "&from=" + 'caseManage' + "&diseaseName=" + row.diseaseName + "&subjectName=" + row.subjectName + "&groupName=" + row.groupName + "&title=" + row.reportName + "&isModify=" + "displayShow";
            window.open('./patientForm.html?' + urlParameters);
          })
      },
      //表格内容展开
      handleClick(row) {
        this.$refs.refTable.toggleRowExpansion(row)
      },
      //切换页面刷新操作
      addEventListenervisibilityChange() {
        this.hidden = "";
        this.visibilityChange = "";
        if (typeof document.hidden !== "undefined") {
          this.hidden = "hidden";
          this.visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
          this.hidden = "mozHidden";
          this.visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          this.hidden = "msHidden";
          this.visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          this.hidden = "webkitHidden";
          this.visibilityChange = "webkitvisibilitychange";
        }
        document.addEventListener(this.visibilityChange, this.visibilityChangeHandle);
      },
      visibilityChangeHandle() {
        if (!document[this.hidden]) {
          this.getDataList();
        }
      },
    },
    beforeDestroy(){
      document.removeEventListener(this.visibilityChange,this.visibilityChangeHandle)
    },
  };
</script>

<style lang="less">
  .report {
    .el-table {
      position: absolute;
      bottom: 50px;
      top: 0;
      left: 0;
      right: 0;
    }

    .cloud-pagination　 {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .el-table__expanded-cell {
      background-color: #F9F9FB;

      &:hover {
        background-color: #F9F9FB !important;
      }

      .el-timeline-item__node {
        background-color: #fff;
        border: 1px solid #ccc;
        width: 8px;
        height: 8px;
      }

      .el-timeline-item__tail {
        border-left: 1px solid #ccc;
        left: 2px;
      }

      .el-timeline-item__wrapper {
        padding-left: 18px;
      }

      .el-timeline-item:last-child {
        padding-bottom: 0;
      }

      .el-timeline-item__content {
        &:hover p {
          color: #333;
        }

        p {
          display: inline-block;
          margin-left: 8px;
          font-size: 13px;
          color: #999;

          span {
            padding-right: 10px;
          }
        }
      }
    }
  }
</style>

