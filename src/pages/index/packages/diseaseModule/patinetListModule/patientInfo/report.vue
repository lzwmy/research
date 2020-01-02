<template>
  <div class="report" v-loading='loading'>
    <el-table
      :data="dataList.content" v-loading="loading" ref="refTable"
      @row-click="handleClick">
      <!-- <el-table-column  width="20"> -->
        <!--<template slot-scope="props"> type="expand"
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
        </template>-->
      <!-- </el-table-column> -->
      <el-table-column prop="visitDate" label="就诊时间"></el-table-column>
      <el-table-column prop="reportName" label="报告名称"></el-table-column>
      <el-table-column prop="author" label="创建者"></el-table-column>
      <el-table-column prop="diseaseName" label="病种"></el-table-column>
      <el-table-column prop="groupName" label="课题组"></el-table-column>
      <el-table-column label="报告状态" width="120px">
        <template slot-scope="scope">
          {{matchingReportStatus(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click.stop="toReportFill(scope.row)"><i class="icon iconfont iconbianji"></i></el-button>
          <el-button class="danger" size="mini" @click.stop="onDeleteReport(scope.row)"><i class="icon iconfont iconshanchu1"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--<pagination :data="dataList" @change="getDataList"></pagination>-->
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
    // mounted () {
    //     this.addEventListenervisibilityChange();
    // },
    components: {
      pagination
    },
    methods: {
      //匹配报告状态
      matchingReportStatus(row) {
        //报告状态
        if(row.reportType == 1) {
            switch (row.status) {
                case 0: return '未填写';
                case 1: return '已填写';
                case 2: return '已提交';
                case 3: return '审核不通过';
                case 4: return '审核通过';
                case 5: return '召回报告';
                default: break;
            }
        }else {
            switch (row.status) {
                case 0: return '未填写';
                case 1: return '已填写';
                case 2: return '失访';
                case 3: return '终止';
                default: break;
            }
        }
      },
      visibilityChangeHandle() {
        if (!document[this.hidden]) {
          this.getDataList();
        }
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
        document.addEventListener(this.visibilityChange,this.visibilityChangeHandle);
      },
      //获取身份证号
      async getIdentify(patientId) {
        let formData = {
          patientId: patientId
        }
        try {
          let res = await this.$http.casesSearchPatient(formData);
          if (res.code == 0) {
            this.identify = res.data.identitycardno || "";
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getDataList () {
        let that = this;
        that.loading = true;
        let formData = {
          // offset: 1,
          // limit: 99,
          // args: this.dataInfo
          "patientId": this.reportFillData.patientId,
          "diseaseId": this.reportFillData.diseaseId,
          "subjectId": this.reportFillData.subjectId,
          "groupId": this.reportFillData.groupId,
        };
        console.log(formData)
        try {
          // let res = await that.$http.PFUGetReportDataList(formData);
          let res = await that.$http.queryReportListnew(formData);
          if (res.code == '0') {
            console.log(res);
            let obj = {};
            obj.content = res.data;
            this.dataList = obj;
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
              from: row.reportType==1?"caseManage":'patientFollowUp',
              diseaseName: row.diseaseName || "",
              subjectName: row.subjectName || "",
              groupName: row.groupName || "",
              title: row.reportName,
              isModify: "displayShow"
            };
            localStorage.setItem('reportFill', JSON.stringify({urlParameter}));
            let urlParameters = "cacheData=" + false + "&formId=" + row.crfId + "&reportId=" + row.id + "&groupId=" + row.groupId + "&subjectId=" + row.subjectId + "&diseaseId=" + row.diseaseId + "&patientName=" + row.patientName + "&patientId=" + row.patientId + "&identify=" + this.identify + "&from=" + 'caseManage' + "&diseaseName=" + row.diseaseName + "&subjectName=" + row.subjectName + "&groupName=" + row.groupName + "&title=" + row.reportName + "&isModify=" + "displayShow";
            window.open('./patientForm.html?' + urlParameters);
          })
      },
      //表格内容展开
      handleClick(row) {
        this.$refs.refTable.toggleRowExpansion(row)
      },
      //删除报告
      onDeleteReport(row){
        console.log(row)
        this.$confirm('确定删除这条报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(async() => {
            let formData = {
                reportId: row.id,
                crfId: row.crfId,
            };
            try {
                let res = await this.$http.reportDelete(formData);
                if (res.code == 0) {
                    this.$mes('success', "删除成功");
                    this.getDataList();
                } 
            } catch (err) {
                console.log(err)
            }
        }).catch(() => {});
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
      top: 6px;
      left: 0;
      right: 0;
      padding: 0 !important;
      .el-table__body-wrapper {
        position: absolute;
        bottom: 0;
        top: 48px;
        left: 0;
        right: 0;
        overflow: auto;
      }
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

