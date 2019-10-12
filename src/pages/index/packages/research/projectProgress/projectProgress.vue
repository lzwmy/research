<template>
  <div class="cloud-component projectProgress">
    <div class="step">
      <p class="label">科研全流程</p>
      <ul class="flex-between-center">
        <li v-for="(item,index) in step" :key="index" :class="item.finish?'finish':''">
          <div class="step_wrap">
            <router-link :to="item.to">
              <span class="icon iconfont" :class="item.icon" :style="'background-color:' + item.bgColor + ';'"></span>
            </router-link>
            <p>{{item.text}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="wrap">
      <h3 class="wrap_title">项目进度<span>共<span style="color:red;">1</span>位研究对象</span></h3>
      <el-row :gutter="30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="wrap_box">
            <p class="wrap_label">患者总进度</p>
            <charts v-if="!optionPatientLoad" :option="optionPatient" v-loading="optionPatientLoad"></charts>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="wrap_box">
            <p class="wrap_label">随访总进度</p>
            <charts v-if="!optionFollowUpLoad" :option="optionFollowUp" v-loading="optionFollowUpLoad"></charts>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="wrap_box wrap_box_3 flex-start-center">
            <div class="finish flex-center-center flex-wrap">
              <p>今日完成</p>
              <span>{{todayFinish}}</span>
            </div>
            <ul class="content flex-start-center flex-wrap">
              <li>
                <p>今日失访</p>
                <span>{{todayLost}}</span>
              </li>
              <li>
                <p>今日终止</p>
                <span>{{todayEnd}}</span>
              </li>
              <li>
                <p>本周失访</p>
                <span>{{weekLost}}</span>
              </li>
              <li>
                <p>本周终止</p>
                <span>{{weekEnd}}</span>
              </li>
              <li>
                <p>本周完成</p>
                <span>{{weekFinish}}</span>
              </li>
              <li>
                <p>本月失访</p>
                <span>{{monthLost}}</span>
              </li>
              <li>
                <p>本月终止</p>
                <span>{{monthEnd}}</span>
              </li>
              <li>
                <p>本月完成</p>
                <span>{{monthFinish}}</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="wrap wrap_group" v-for="(item,index) in stageList" :key="index">
      <h3 class="wrap_title">
        {{item.groupName}}
        <span>
          共
          <span style="color:red;">{{item.patients}}</span>
          位研究对象
        </span>
      </h3>
      <el-row :gutter="30">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="wrap_box" v-loading="item.groupLoad">
            <!--<p class="wrap_label">入组阶段</p>
            <p class="charts_y_title">患者数</p>-->
            <!--{{item.groupLoad}}-->
            <charts v-if="JSON.stringify(item.groupChart)!=='{}'" :option="item.groupChart"></charts>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <!--v-for="(stagesItem,stagesIndex) in item.stages" :key="stagesIndex"-->
          <div class="wrap_box">
            <p class="wrap_label" style="position: relative">
              {{item.stages[item.stagesIndex].stageName}}
              <el-popover  placement="bottom"
                          popper-class="more_popper"
                          v-if="item.stages.length>1"
                          trigger="hover">
                <i slot="reference" class="el-icon-caret-bottom"></i>
                <ul class="stepThree_ul">
                  <li v-for="(stagesItem,stagesIndex) in item.stages" :key="stagesIndex"
                      @click="switchStage(item,stagesIndex)">{{stagesItem.stageName}}
                  </li>
                </ul>
              </el-popover>
            </p>
            <!--<p class="charts_y_title">患者数</p>-->
            <div v-loading="item.stagesLoad">
              <charts v-if="JSON.stringify(item.stagesChart)!=='{}'" :option="item.stagesChart"></charts>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="wrap wrap_group">
      <h3 class="wrap_title">录入员任务完成情况<span>共<span style="color:red;">1</span>位研究对象</span></h3>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="wrap_box">
            <!--<p class="wrap_label">入组阶段</p>
            <p class="charts_y_title">患者数</p>
            <charts :option="optionGroup1"></charts>-->
            <table border="1" cellpadding="0" cellspacing="0" width="100%">
              <thead>
              <tr>
                <td rowspan="2" class="cell">成员</td>
                <td colspan="1" class="is-leaf">入组阶段表单</td>
                <td colspan="3" class="is-leaf">随访阶段表单</td>
              </tr>
              <tr>
                <td class="cell">最终完成</td>
                <td class="cell">已失访</td>
                <td class="cell">已终止</td>
                <td class="cell">最终完成</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in taskList" :key="index">
                <td class="cell">{{item.name}}</td>
                <td class="cell">{{item.groupFinish}}</td>
                <td class="cell">{{item.visitLost}}</td>
                <td class="cell">{{item.visitEnd}}</td>
                <td class="cell">{{item.visitFinish}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="wrap_box">
            <p class="wrap_label" style="position: relative">
              阶段1
              <el-popover  placement="bottom"
                          popper-class="more_popper"
                          trigger="hover">
                <i slot="reference" class="el-icon-caret-bottom"></i>
                <ul class="stepThree_ul">
                  <li>编辑</li>
                  <li>删除</li>
                </ul>
              </el-popover>
            </p>
            <p class="charts_y_title">患者数</p>
            <charts :option="optionGroup1"></charts>
          </div>
        </el-col>-->
      </el-row>
    </div>
  </div>
</template>

<script>
  import charts from './charts'

  export default {
    name: 'projectProgress',
    data() {
      return {
        step: [
          {icon: 'iconkeyanlingganbeifen', bgColor: 'rgba(245, 166, 35, 1)', text: '科研灵感', finish: true, to: ''},
          {icon: 'iconketiyanzhengbeifen', bgColor: 'rgba(67, 154, 255, 1)', text: '课题验证', finish: true, to: ''},
          {icon: 'iconbaogaoxinxibeifen', bgColor: 'rgba(142, 196, 102, 1)', text: '项目信息', finish: true, to: ''},
          {
            icon: 'iconyanjiufenzubeifen',
            bgColor: 'rgba(67, 154, 255, 1)',
            text: '项目分组',
            finish: true,
            to: '/projectGrouping'
          },
          {
            icon: 'iconyanjiuneirongbeifen',
            bgColor: 'rgba(177, 182, 205, 1)',
            text: '研究指标',
            finish: true,
            to: '/researchTarget'
          },
          {
            icon: 'iconshujulurubeifen',
            bgColor: 'rgba(161, 204, 255, 1)',
            text: '数据录入',
            finish: false,
            to: '/researchObject'
          },
          {
            icon: 'iconhuanzhesuifangbeifen',
            bgColor: 'rgba(128, 221, 200, 1)',
            text: '患者随访',
            finish: false,
            to: '/followUpManagement'
          },
          {icon: 'iconshujusuodingbeifen', bgColor: 'rgba(161, 204, 255, 1)', text: '数据锁定', finish: false, to: ''},
          {
            icon: 'iconkeyanfenxibeifen',
            bgColor: 'rgba(129, 219, 238, 1)',
            text: '统计分析',
            finish: false,
            to: '/statisticalAnalysis'
          },
          {
            icon: 'iconlunwenrunsebeifen',
            bgColor: 'rgba(161, 204, 255, 1)',
            text: '论文润色',
            finish: false,
            to: '/articlesEmbellish'
          }
        ],
        optionPatient: {
          chart: {
            margin: [15, 0, 40, 0]
          },
          title: {
            text: ''
          },
          plotOptions: {
            pie: {
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            innerSize: '50%',
            name: "进度",
            data: [
              {name: '录入中', y: 0, color: 'rgba(67, 154, 255, 1)'},
              {name: '已完成', y: 0, color: 'rgba(90, 216, 166, 1)'},
            ]
          }],
          credits: {
            enabled: false
          }
        },
        optionPatientLoad: false,
        optionFollowUp: {
          chart: {
            margin: [15, 0, 40, 0]
          },
          title: {
            text: ''
          },
          plotOptions: {
            pie: {
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            innerSize: '50%',
            // name:"aaa",
            data: [
              {name: '未开始', y: 0, color: 'rgba(177, 182, 205, 1)'},
              {name: '录入中', y: 0, color: 'rgba(67, 154, 255, 1)'},
              {name: '已完成', y: 0, color: 'rgba(90, 216, 166, 1)'},
              {name: '已终止', y: 0, color: 'rgba(242, 110, 108, 0.9)'},
            ]
          }],
          credits: {
            enabled: false
          }
        },
        optionFollowUpLoad: false,
        optionGroup1: {
          chart: {
            type: 'column',
            margin: [10, 40, 50, 30],
            spacingBottom: 0

          },
          title: {
            text: ''
          },
          tooltip: {
            borderColor: null,
          },
          legend: {
            enabled: true
          },
          xAxis: {
            categories: ['白癜风', '银屑病', '面部皮炎', '神经内科']
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            lineWidth: 1
          },
          series: [
            {
              name: "录入中",
              color: 'rgba(67, 154, 255, 1)',
              data: [10, 20, 30, 4]
            },
            {
              name: "已完成",
              color: 'rgba(90, 216, 166, 1)',
              data: [10, 20, 30, 4]
            }
          ],
          credits: {
            enabled: false
          }
        },
        todayFinish: 0,
        todayLost: 0,
        todayEnd: 0,
        weekFinish: 0,
        weekLost: 0,
        weekEnd: 0,
        monthFinish: 0,
        monthLost: 0,
        monthEnd: 0,
        stageList: [],
        taskList: [],
      }
    },
    watch: {},
    components: {
      charts
    },
    methods: {
      //切换阶段
      switchStage(item, index) {
        console.log(item, index);
        let chartOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column'
          },
          credits: {
            enabled: false
          },
          title: {
            text: '柱状图'
          },
          legend: {
            enabled: false
          },
          xAxis: {
            categories: ['苹果', '橘子', '梨', '葡萄', '香蕉'],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            lineWidth: 1,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickWidth: 0
          },
          tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0
            },
            series: {
              stacking: 'normal'
            }
          },
          series: [
            {
              name: '小张',
              data: [5, 3, 4, 7, 2]
            }, {
              name: '小彭',
              data: [2, 2, 3, 2, 1]
            }, {
              name: '小潘',
              data: [3, 4, 4, 2, 5]
            }
          ]
        };
        item.stagesIndex = index;
        item.stagesLoad = true;
        this.subjectVisitStageDetail(item.stages[index].stageId).then((res) => {
          if (res.code === 0) {
            item.stagesChart = {};
            chartOptions.title.text = res.data.chartName;
            chartOptions.xAxis.categories = res.data.xaxis;
            chartOptions.series = res.data.series;
            this.$nextTick(() => {
              item.stagesLoad = false;
              item.stagesChart = chartOptions;
            });
          }
        })
      },
      //随访情况明细
      async subjectVisitDetail() {
        let that = this;
        let formData = {
          subjectId: sessionStorage.getItem('CURR_RESEARCH_ID')
        };
        try {
          let data = await that.$http.subjectVisitDetail(formData);
          if (data.code === 0) {
            that.todayFinish = data.data.todayFinish;
            that.todayLost = data.data.todayLost;
            that.todayEnd = data.data.todayEnd;
            that.weekFinish = data.data.weekFinish;
            that.weekLost = data.data.weekLost;
            that.weekEnd = data.data.weekEnd;
            that.monthFinish = data.data.monthFinish;
            that.monthLost = data.data.monthLost;
            that.monthEnd = data.data.monthEnd;
          }
        } catch (error) {
          console.log(error)
        }
      },
      //随访总进度
      async subjectVisitTotal() {
        let that = this;
        let formData = {
          subjectId: sessionStorage.getItem('CURR_RESEARCH_ID')
        };
        try {
          let data = await that.$http.subjectVisitTotal(formData);
          if (data.code === 0) {
            if (data.data.length !== 0) {
              let copyData = Object.assign({}, JSON.parse(JSON.stringify(this.optionFollowUp)));
              for (let i = 0; i < data.data.length; i++) {
                for (let j = 0; j < copyData.series[0].data.length; j++) {
                  if (data.data[i].name === copyData.series[0].data[j].name) {
                    copyData.series[0].data[j].y = data.data[i].count
                  }
                }
              }
              that.optionFollowUp = copyData;
            }
          }
          that.optionFollowUpLoad = false;
        } catch (error) {
          console.log(error)
          that.optionFollowUpLoad = false;
        }
        that.optionFollowUpLoad = false;
      },
      //获取阶段下的随访情况明细
      async subjectVisitStageDetail(value) {
        let that = this;
        let formData = {
          stageId: value
        };
        try {
          let data = await that.$http.subjectVisitStageDetail(formData);
          return data;
        } catch (error) {
          console.log(error)
        }
      },
      //患者总体进度
      async subjectPatientTotal() {
        let that = this;
        let formData = {
          subjectId: sessionStorage.getItem('CURR_RESEARCH_ID')
        };
        try {
          let data = await that.$http.subjectPatientTotal(formData);
          if (data.code === 0) {
            if (data.data.length !== 0) {
              let copyData = Object.assign({}, JSON.parse(JSON.stringify(this.optionPatient)));
              for (let i = 0; i < data.data.length; i++) {
                for (let j = 0; j < copyData.series[0].data.length; j++) {
                  if (data.data[i].name === copyData.series[0].data[j].name) {
                    copyData.series[0].data[j].y = data.data[i].count
                  }
                }
              }
              that.optionPatient = copyData;
            }
          }
          that.optionPatientLoad = false;
        } catch (error) {
          console.log(error)
          that.optionPatientLoad = false;
        }
        that.optionPatientLoad = false;
      },
      //获取 项目分组
      async subjectStagePublicList() {
        let that = this;
        let chartOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column'
          },
          credits: {
            enabled: false
          },
          title: {
            text: '柱状图'
          },
          legend: {
            enabled: false
          },
          xAxis: {
            categories: ['苹果', '橘子', '梨', '葡萄', '香蕉'],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            lineWidth: 1,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickWidth: 0
          },
          tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0
            },
            series: {
              stacking: 'normal'
            }
          },
          series: [
            {
              name: '小张',
              data: [5, 3, 4, 7, 2]
            }, {
              name: '小彭',
              data: [2, 2, 3, 2, 1]
            }, {
              name: '小潘',
              data: [3, 4, 4, 2, 5]
            }
          ]
        };
        let formData = {
          id: sessionStorage.getItem('CURR_RESEARCH_ID')
        };
        try {
          let data = await that.$http.subjectStagePublicList(formData);
          if (data.code === 0) {
            if (data.data.length !== 0) {
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].groupLoad = true;
                data.data[i].groupChart = {};
                this.subjectStageGroupTotal(data.data[i].groupId).then((res) => {
                  if (res.code === 0) {
                    data.data[i].groupLoad = false;
                    chartOptions.title.text = res.data.chartName;
                    chartOptions.xAxis.categories = res.data.xaxis;
                    chartOptions.series = res.data.series;
                    data.data[i].groupChart = chartOptions;
                  }
                });
                if (data.data[i].stages.length !== 0) {
                  data.data[i].stagesIndex = 0;
                  data.data[i].stagesChart = {};
                  data.data[i].stagesLoad = true;
                  /*for(let j=0;j<data.data[i].stages[j].length;j++) {
                    data.data[i].stages[j].stagesLoad = true;
                    data.data[i].stages[j].stagesChart = {};
                  }*/
                  this.subjectVisitStageDetail(data.data[i].stages[data.data[i].stagesIndex].stageId).then((res) => {
                    if (res.code === 0) {
                      data.data[i].stagesLoad = false;
                      chartOptions.title.text = res.data.chartName;
                      chartOptions.xAxis.categories = res.data.xaxis;
                      chartOptions.series = res.data.series;
                      data.data[i].stagesChart = chartOptions;
                    }
                  })
                }
              }
              this.stageList = data.data;
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      // 获取 入组阶段的图表 数据
      async subjectStageGroupTotal(value) {
        let that = this;
        let formData = {
          groupId: value
        };
        try {
          let data = await that.$http.subjectStageGroupTotal(formData);
          return data
        } catch (error) {
          console.log(error)
        }
      },
      //录入员任务完成情况
      async subjectProgressTaskTotal() {
        let that = this;
        let formData = {
          subjectId: sessionStorage.getItem('CURR_RESEARCH_ID')
        };
        try {
          let data = await that.$http.subjectProgressTaskTotal(formData);
          console.log(data);
          if (data.code === 0) {
            this.taskList = data.data;
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    mounted() {
      this.optionFollowUpLoad = true;
      this.optionPatientLoad = true;
      this.subjectVisitDetail();
      this.subjectVisitTotal();
      this.subjectPatientTotal();
      this.subjectStagePublicList();
      this.subjectProgressTaskTotal();
    }
  };
</script>

<style lang='less'>
  @import url('../css/common.less');
</style>
<style lang="less">
  .projectProgress {
    .step {
      background-color: #fff;
      padding: 15px;

      .label {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        color: rgba(57, 66, 99, 1);
      }

      ul {
        li {
          flex: 1;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 30px;
            left: 70px;
            width: 100%;
            right: 0;
            height: 6px;
            background-color: rgba(229, 235, 236, 1);
          }

          &.finish::after {
            background-color: rgba(0, 188, 146, 1);
          }

          &:last-child {
            flex-grow: 0;

            &::after {
              display: none;
            }
          }

          .step_wrap {
            width: 70px;

            &:hover span {
              box-shadow: 0 0 5px #888;
            }

            span {
              height: 70px;
              display: block;
              border-radius: 50%;
              font-size: 60px;
              line-height: 70px;
              text-align: center;
              color: #fff;
              transition: all 300ms;
            }

            p {
              font-size: 14px;
              text-align: center;
              margin-top: 15px;
              color: rgba(57, 66, 99, 1);
            }
          }
        }
      }
    }

    .wrap {
      margin-top: 34px;

      &.wrap_group {
        .wrap_box {
          height: 330px;

          table {
            border-collapse: collapse;
            border: 1px solid #e5ebf1;

            thead {
              background-color: #f7f9fa;
            }
            tbody{
              tr{
                &:hover{
                  background-color: #f7f9fa;
                }
              }
            }
            td {
              height: 39px;
              color: #6a707e;
            }

            .is-leaf {
              text-align: center;
            }

            .cell {
              padding: 0 20px;
            }
          }
        }

        .chartContent {
          height: 260px;
        }
      }

      .wrap_title {
        font-size: 18px;
        margin-bottom: 20px;
        color: rgba(57, 66, 99, 1);

        & > span {
          font-size: 12px;
          padding-left: 20px;
          font-weight: normal;
        }
      }

      .charts_y_title {
        padding: 15px 0 4px;
      }

      .wrap_box {
        background-color: #fff;
        height: 244px;
        color: rgba(57, 66, 99, 1);
        padding: 15px;

        .wrap_label {
          font-size: 16px;
          font-weight: bold;
        }

        &.wrap_box_3 {
          padding: 0 2vw;

          .finish {
            background-color: rgba(90, 216, 166, 1);
            border-radius: 50%;
            width: 120px;
            flex-direction: column;
            height: 120px;
            color: #fff;
            font-size: 16px;

            p {
              margin-bottom: 8px;
            }

            span {
              font-size: 30px;
            }
          }

          ul {
            margin-left: 2vw;
            flex: 1;

            li {
              font-size: 14px;
              width: 33%;
              margin-bottom: 24px;

              &:nth-child(2) {
                width: 60%;
              }

              &:nth-child(n + 6) {
                margin-bottom: 0;
              }

              span {
                font-size: 18px;
                margin-top: 4px;
                display: block;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
</style>




