<template>
  <div class="literature-container">
    <div class="basis-search" v-show="switchSearch">
      <span class="search_title">文献搜索</span>
      <div class="search-condition">
        <el-input placeholder=""></el-input>
        <el-button type="primary">
          <i class="iconfont iconsousuo_fuzhi"></i>
          搜索
        </el-button>
      </div>
      <i class="high-search" @click="changeSearch(false)">高级搜索</i>
    </div>
    <div class="high-search_box" v-show="!switchSearch">
      <div class="search_info-box">
        <div class="info-title">检索信息</div>
        <div class="info_content-box">
          <div class="content-item">
            <div class="option-method">
              <span>+</span>
              <span>-</span>
            </div>
            <div class="filter-condition">
              <el-select v-model="themeCondition">
                <el-option
                  v-for="item in checkThemeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="entry-condition">
              <el-input></el-input>
            </div>
            <div class="filter-match">
              <el-select v-model="matchValue">
                <el-option
                  v-for="item in matchList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <!--<div class="option-method">
              <span>+</span>
              <span>-</span>
            </div>-->
            <div class="check_method">
              <el-select v-model="checkValue">
                <el-option
                  v-for="item in checkList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="filter-condition">
              <el-select v-model="themeCondition">
                <el-option
                  v-for="item in checkThemeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="entry-condition">
              <el-input></el-input>
            </div>
            <div class="filter-match">
              <el-select v-model="matchValue">
                <el-option
                  v-for="item in matchList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="search_btn">
        <el-button type="primary">
          <i class="iconfont iconsousuo_fuzhi"></i>
          搜索
        </el-button>
        <span class="basis-searchs" @click="changeSearch(true)">普通搜索</span>
      </div>
    </div>
    <div class="search-content">
      <div class="content_show-box">
        <div class="search-result">搜索结果</div>
        <el-tabs class="result-tab" v-model="activeName">
          <el-tab-pane label="全部文献（297768）" name="first">
            <div class="children-body">
              <div class="children-item">
                <div class="item-tag">
                  <span>万方</span>
                </div>
                <div class="item-info">
                  <div class="item_title" @click="jumpPrint">重度颅脑损伤术中应用阶梯式减压技术的疗效分析</div>
                  <div class="item_basic-info">发布时间: 2019-11-9   丨   作者: 符招泉、陈伟明、夏鹰   丨   作者单位: 海南省昌江县人民医院外三科海南省海口市人民医院神经外科</div>
                  <div class="Summary">摘要:目的探讨急性重度颅脑损伤患者术中应用阶梯式减压技术的疗效。方法2014年12月-2017年12月,我院行标准大骨瓣减压术的重型颅脑损伤患者356例,依据术中有无采用阶梯式减压技术,随机分成两组:阶梯式减压组(n=187),传统减压组(n=169),观察两组患者的围手术期并发症发生率及术后6个月时GOS评分并行统计分析。结果阶梯式减压组急性脑膨出以及迟发性血肿的发生率低于传统减压组(P<0.05);阶梯式减压组术后6个月时预后好于传统减压组(P<0.05)。结论重型颅脑损伤患者术中采用阶梯式减压技术能够降低围术期并发症的发生并能改善患者预后。</div>
                </div>
              </div>
              <div class="children-item">
                <div class="item-tag">
                  <span>万方</span>
                </div>
                <div class="item-info">
                  <div class="item_title">重度颅脑损伤术中应用阶梯式减压技术的疗效分析</div>
                  <div class="item_basic-info">发布时间: 2019-11-9   丨   作者: 符招泉、陈伟明、夏鹰   丨   作者单位: 海南省昌江县人民医院外三科海南省海口市人民医院神经外科</div>
                  <div class="Summary">摘要:目的探讨急性重度颅脑损伤患者术中应用阶梯式减压技术的疗效。方法2014年12月-2017年12月,我院行标准大骨瓣减压术的重型颅脑损伤患者356例,依据术中有无采用阶梯式减压技术,随机分成两组:阶梯式减压组(n=187),传统减压组(n=169),观察两组患者的围手术期并发症发生率及术后6个月时GOS评分并行统计分析。结果阶梯式减压组急性脑膨出以及迟发性血肿的发生率低于传统减压组(P<0.05);阶梯式减压组术后6个月时预后好于传统减压组(P<0.05)。结论重型颅脑损伤患者术中采用阶梯式减压技术能够降低围术期并发症的发生并能改善患者预后。</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="诊疗指南（1885）" name="second">诊疗指南（1885）</el-tab-pane>
          <el-tab-pane label="META分析（3252）" name="third">META分析（3252）</el-tab-pane>
          <el-tab-pane label="病例报告（24575）" name="fourth">病例报告（24575）</el-tab-pane>
        </el-tabs>
      </div>
      <div class="wordcloud-box">
        <div class="search-results">文献热点</div>
        <chart :option="option"></chart>
      </div>
    </div>
  </div>
</template>

<script>
  import chart from './wordcloud';

  export default {
    components: {
      chart
    },
    data() {
      return {
        switchSearch: true,
        themeCondition: "",
        matchValue: "",
        checkValue: "",
        checkThemeList: [
          {
            value: '主题',
            label: '主题'
          },
          {
            value: '作者',
            label: '作者'
          }
        ],
        matchList: [
          {
            value: '0',
            label: '模糊'
          },
          {
            value: '1',
            label: '精确'
          }
        ],
        checkList: [
          {
            value: '0',
            label: '与'
          },
          {
            value: '1',
            label: '或'
          }
        ],
        //文献热点 配置
        option: {
          series: [
            {
              type: 'wordcloud',
              rotation: {
                orientations: 0
              },
              data: [{
                name: "creativity",
                weight: 31
              }, {
                name: "creative",
                weight: 22
              }, {
                name: "intelligence",
                weight: 15
              }, {
                name: "more",
                weight: 12
              }, {
                name: "people",
                weight: 12
              }, {
                name: "theory",
                weight: 11
              }, {
                name: "problem",
                weight: 11
              }, {
                name: "thinking",
                weight: 11
              }, {
                name: "been",
                weight: 11
              }, {
                name: "can",
                weight: 11
              }, {
                name: "process",
                weight: 11
              }, {
                name: "new",
                weight: 10
              }, {
                name: "individual",
                weight: 10
              }, {
                name: "model",
                weight: 10
              }, {
                name: "ideas",
                weight: 9
              }, {
                name: "levels",
                weight: 9
              }, {
                name: "processes",
                weight: 9
              }, {
                name: "different",
                weight: 9
              }, {
                name: "high",
                weight: 9
              }, {
                name: "motivation",
                weight: 9
              }, {
                name: "research",
                weight: 9
              }, {
                name: "work",
                weight: 8
              }, {
                name: "cognitive",
                weight: 8
              }, {
                name: "team",
                weight: 8
              }, {
                name: "divergent",
                weight: 8
              }, {
                name: "tests",
                weight: 8
              }, {
                name: "study",
                weight: 8
              }, {
                name: "measures",
                weight: 8
              }, {
                name: "theories",
                weight: 8
              }, {
                name: "found",
                weight: 8
              }, {
                name: "solving",
                weight: 7
              }, {
                name: "knowledge",
                weight: 7
              }, {
                name: "iq",
                weight: 7
              }, {
                name: "working",
                weight: 7
              }, {
                name: "positive",
                weight: 7
              }, {
                name: "idea",
                weight: 7
              }, {
                name: "studies",
                weight: 7
              }, {
                name: "number",
                weight: 7
              }, {
                name: "person",
                weight: 7
              }, {
                name: "researchers",
                weight: 7
              }, {
                name: "task",
                weight: 7
              }, {
                name: "affect",
                weight: 7
              }, {
                name: "group",
                weight: 7
              }, {
                name: "memory",
                weight: 7
              }, {
                name: "creation",
                weight: 7
              }, {
                name: "individuals",
                weight: 7
              }, {
                name: "concept",
                weight: 7
              }, {
                name: "learning",
                weight: 7
              }, {
                name: "given",
                weight: 7
              }, {
                name: "ability",
                weight: 7
              }, {
                name: "approach",
                weight: 7
              }, {
                name: "innovation",
                weight: 7
              }, {
                name: "malevolent",
                weight: 7
              }, {
                name: "most",
                weight: 7
              }, {
                name: "frontal",
                weight: 6
              }, {
                name: "related",
                weight: 6
              }, {
                name: "data",
                weight: 6
              }, {
                name: "reported",
                weight: 6
              }, {
                name: "incubation",
                weight: 6
              }, {
                name: "thought",
                weight: 6
              }, {
                name: "intrinsic",
                weight: 6
              }, {
                name: "used",
                weight: 6
              }, {
                name: "implicit",
                weight: 6
              }, {
                name: "increase",
                weight: 6
              }, {
                name: "general",
                weight: 6
              }, {
                name: "mental",
                weight: 6
              }, {
                name: "early",
                weight: 6
              }, {
                name: "economic",
                weight: 6
              }, {
                name: "level",
                weight: 6
              }, {
                name: "students",
                weight: 6
              }, {
                name: "human",
                weight: 6
              }, {
                name: "constructs",
                weight: 6
              }, {
                name: "problems",
                weight: 6
              }, {
                name: "elements",
                weight: 6
              }, {
                name: "proposed",
                weight: 6
              }, {
                name: "lobe",
                weight: 6
              }, {
                name: "participants",
                weight: 6
              }, {
                name: "according",
                weight: 6
              }, {
                name: "key",
                weight: 6
              }, {
                name: "century",
                weight: 6
              }, {
                name: "type",
                weight: 6
              }, {
                name: "skills",
                weight: 6
              }, {
                name: "relationship",
                weight: 6
              }, {
                name: "will",
                weight: 6
              }, {
                name: "environment",
                weight: 6
              }, {
                name: "time",
                weight: 6
              }, {
                name: "view",
                weight: 6
              }, {
                name: "create",
                weight: 6
              }, {
                name: "worldview",
                weight: 6
              }, {
                name: "processing",
                weight: 6
              }, {
                name: "seen",
                weight: 6
              }, {
                name: "aggression",
                weight: 6
              }, {
                name: "result",
                weight: 6
              }, {
                name: "correlation",
                weight: 6
              }
              ]
            }],
          title: {
            text: ''
          },
          // legend:{
          // 	enabled:false
          // },
          credits: {
            enabled: false
          },
        },
        activeName: "first",
      }
    },
    methods: {
      changeSearch(value) {
        console.log(value)
        this.switchSearch = value;
      },
      jumpPrint() {
        window.open("./printPage.html");
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less">
  .literature-container {
    .basis-search {
      width: 100%;
      height: 110px;
      background-color: #ffffff;
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding-left: 30px;
      box-shadow: 5px 5px 10px rgba(78, 91, 105, 0.2);

      .search_title {
        font-size: 18px;
        font-weight: bold;
        color: #424767;
        margin-right: 24px;
      }

      .search-condition {
        width: 1126px;
        height: 48px;

        .el-input {
          width: 90%;
          height: 48px;
          line-height: 48px;

          .el-input__inner {
            height: 48px;
            line-height: 48px;
            border-radius: 2px;
          }
        }

        .el-button {
          width: 107px;
          height: 48px;
          line-height: 48px;
          position: relative;
          top: 1px;
          left: -5px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;

          i {
            font-size: 20px;
            padding-right: 10px;
            vertical-align: middle;
          }

          span {
            font-size: 16px;
          }
        }
      }

      .high-search {
        color: #3D98FF;
        font-weight: 400;
        font-size: 14px;
        font-style: normal;
        padding: 4px 6px;

        &:hover {
          background-color: #DCDFE6;
          color: #3D98FF;
          cursor: pointer;
        }
      }
    }

    .high-search_box {
      display: flex;
      width: 100%;
      flex-direction: column;
      background-color: #ffffff;
      box-shadow: 5px 5px 10px rgba(78, 91, 105, 0.2);

      .search_info-box {
        display: flex;
        flex-direction: row;
        min-height: 168px;
        justify-content: flex-start;
        padding: 37px 30px 0 30px;

        .info-title {
          color: #424767;
          font-weight: bold;
          font-size: 18px;
          margin-right: 29px;
        }

        .info_content-box {
          display: flex;
          flex-direction: column;

          .content-item {
            display: flex;
            margin-bottom: 22px;

            .option-method {
              width: 74px;
              height: 36px;
              padding: 6px 5px 8px 5px;
              display: flex;
              justify-content: space-between;
              margin-right: 20px;

              span {
                display: inline-block;
                width: 22px;
                height: 22px;
                background: rgba(242, 242, 242, 1);
                border: 1px solid rgba(197, 200, 203, 1);
                opacity: 1;
                text-align: center;
                line-height: 18px;
                color: #999999;
                font-size: 25px;
              }
            }

            .check_method {
              width: 74px;
              height: 36px;
              margin-right: 20px;

              .el-input__inner {
                height: 36px;
                border-radius: 2px;
              }
            }

            .filter-condition {
              width: 160px;
              height: 36px;
              margin-right: 20px;

              .el-input__inner {
                height: 36px;
                border-radius: 2px;
              }
            }

            .entry-condition {
              width: 621px;
              height: 36px;
              margin-right: 20px;

              .el-input__inner {
                height: 36px;
                border-radius: 2px;
              }
            }

            .filter-match {
              width: 130px;
              height: 36px;

              .el-input__inner {
                height: 36px;
                border-radius: 2px;
              }
            }
          }
        }
      }

      .search_btn {
        width: 100%;
        height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #E2E6F0;

        .el-button {
          width: 90px;
          height: 36px;
          margin-right: 20px;

          .iconfont {
            font-size: 15px;
            vertical-align: middle;
          }

          span {
            font-size: 15px;
          }
        }

        .basis-searchs {
          font-size: 14px;
          font-weight: 400;
          color: #3D98FF;
          padding: 4px 6px;
          cursor: pointer;

          &:hover {
            background-color: #DCDFE6;
          }
        }
      }
    }

    .search-content {
      width: 100%;
      height: 702px;
      display: flex;
      margin-top: 20px;

      .content_show-box {
        height: 100%;
        flex: 1;
        background-color: #ffffff;
        border-radius: 4px;
        padding: 30px;
        box-shadow: 5px 5px 10px rgba(78, 91, 105, 0.2);

        .search-result {
          font-size: 18px;
          font-weight: bold;
          color: rgba(66, 71, 103, 1);
          margin-bottom: 20px;
        }
        .result-tab {
          .el-tabs__header {
            .el-tabs__nav-wrap {
              .el-tabs__nav-scroll {
                .el-tabs__nav {
                  .el-tabs__active-bar {
                    height: 2px;
                    background-color: #3D98FF;
                  }
                  .el-tabs__item {
                    height: 36px ;
                    line-height: 36px ;
                    font-weight: normal;
                    font-size:14px;
                  }
                }
              }
              &::after{
                background-color: transparent;
              }
            }
          }
          .children-body{
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            .children-item{
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              margin-bottom: 30px;
              .item-tag{
                width: 10%;
                justify-content: center;
                text-align: center;
                margin-right: 14px;
                span{
                  display: inline-block;
                  width:42px;
                  height:22px;
                  background:rgba(0,190,144,1);
                  border:1px solid rgba(0,191,143,1);
                  opacity:1;
                  border-radius:4px;
                  color: #ffffff;
                  line-height: 19px;
                }
              }
              .item-info{
                display: flex;
                flex-direction: column;
                .item_title{
                  font-size:14px;
                  font-weight:bold;
                  color: #3A579D;
                  cursor: pointer;
                  &:hover{
                    text-decoration:underline;
                  }
                }
                .item_basic-info{
                  font-size: 12px;
                  color:#B1B1B1;
                  margin-top: 8px;
                  margin-bottom: 10px;
                }
                .Summary{
                  color:rgba(99,102,110,1);
                  font-size:14px;
                  line-height:22px;
                }
              }
            }
          }
        }
      }

      .wordcloud-box {
        width: 574px;
        height: 407px;
        background-color: #ffffff;
        margin-left: 20px;
        border-radius: 4px;
        box-shadow: 5px 5px 10px rgba(78, 91, 105, 0.2);

        .search-results {
          font-size: 18px;
          font-weight: bold;
          color: rgba(66, 71, 103, 1);
          padding: 30px 30px 0 30px;
        }
      }
    }
  }
</style>
