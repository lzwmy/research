<template>
  <div class="literature-container">
    <div class="basis-search" v-show="switchSearch">
      <span class="search_title">文献搜索</span>
      <div class="search-condition">
        <el-input v-model="keyword" @keyup.enter.native="literatureKeywordSearchList"></el-input>
        <el-button type="primary" @click="literatureKeywordSearchList">
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
          <div class="content-item" v-for="(item,index) in criterias" :key="index">
            <div class="option-method" v-if="index == 0">
              <span @click="addLine">+</span>
              <span @click="deleteLine">-</span>
            </div>
            <div class="check_method" v-else>
              <el-select v-model="item.operator" @change="changeMethod(item)">
                <el-option
                  v-for="item in checkList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="filter-condition">
              <el-select v-model="item.column" @change="changeCondition(item)">
                <el-option
                  v-for="item in checkThemeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="entry-condition">
              <el-input v-model="item.param"></el-input>
            </div>
            <div class="filter-match" >
              <el-select v-model="item.type" @change="changeMatch(item)">
                <el-option
                  v-for="item in matchList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <!--<div class="content-item">
            &lt;!&ndash;<div class="option-method">
              <span>+</span>
              <span>-</span>
            </div>&ndash;&gt;
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
          </div>-->
        </div>
      </div>
      <div class="search_btn">
        <el-button type="primary" @click="literatureHighSearchList">
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
          <el-tab-pane :label="`全部文献（${allTotal}）`" name="first">
            <div class="children-body">
              <div class="children-item" v-loading="AllLoading" v-for="(item,index) in allList" :key="index">
                <div class="item-tag">
                  <span>{{item.srcDataBase}}</span>
                </div>
                <div class="item-info">
                  <div class="item_title" @click="jumpPrint(item)">{{item.title}}</div>
                  <div class="item_basic-info">发布时间: {{item.pubTime || '暂无'}}   丨   作者: {{item.author || '暂无'}}   丨   作者单位: {{item.organ || '暂无'}}</div>
                  <div class="Summary">摘要:{{item.summary || '暂无'}}</div>
                </div>
              </div>
              <!--分页-->
              <el-pagination
                style="text-align: right"
                v-if="allTotal!=0"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="allTotal">
              </el-pagination>
            </div>
            <div class="blank_page" v-show="allList.length === 0">
              <div class="page">
                <img src="./../image/blank_page.png" >
                <p>暂无内容</p>
              </div>
            </div>
          </el-tab-pane>
          <!--<el-tab-pane label="诊疗指南（1885）" name="second">诊疗指南（1885）</el-tab-pane>
          <el-tab-pane label="META分析（3252）" name="third">META分析（3252）</el-tab-pane>
          <el-tab-pane label="病例报告（24575）" name="fourth">病例报告（24575）</el-tab-pane>-->
        </el-tabs>
      </div>
      <div class="wordcloud-box">
        <div class="search-results">文献热点</div>
        <div v-loading="wordcloudLoading">
          <chart v-if="option.series[0].data.length!==0" :on-keyWord="onKeyword" :option="option"></chart>
        </div>
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
        AllLoading:false,
        wordcloudLoading:false,
        themeCondition: "",
        matchValue: "",
        checkValue: "",
        keyword:"",
        allTotal:0,
        pageNo:1,
        allList:[],
        criterias:[
          {
            "column": "",
            "columnName": "",
            "operator": "and",
            "operatorName": "与",
            "param": "",
            "type": "",
            "typeName": ""
          }
        ],//
        checkThemeList: [
          {
            value: 'title',
            label: '主题'
          },
          {
            value: 'author',
            label: '作者'
          },
          {
            value: 'organ',
            label: '作者单位'
          }
        ],
        matchList: [
          {
            value: 'like',
            label: '模糊'
          },
          {
            value: 'equal',
            label: '精确'
          }
        ],
        checkList: [
          {
            value: 'and',
            label: '与'
          },
          {
            value: 'or',
            label: '或'
          },
          {
            value:"not",
            label:"非"
          }
        ],
        //文献热点 配置
        option: {
          plotOptions: {
            series: {
              cursor: 'pointer',
              events: {
                click: function(e) {
                  document.getElementsByClassName('chartContent')[0].setAttribute('data-keyWord',e.point.name);
                }
              }
            }
          },
          series: [
            {
              type: 'wordcloud',
              rotation: {
                orientations: 0
              },
              data: []
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
        this.switchSearch = value;
        this.pageNo = 1;
        if(value == false) {
          this.criterias = [
            {
              "column": "",
              "columnName": "",
              "operator": "and",
              "operatorName": "与",
              "param": "",
              "type": "",
              "typeName": ""
            }
          ]
        }else if(value == true) {
          this.keyword = ""
        }
      },
      jumpPrint(data) {
        localStorage.setItem('content',JSON.stringify(data));
        window.open("./printPage.html");
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.AllLoading = true;
        if(this.switchSearch) {
          this.literatureKeywordSearchList()
        }else {
          this.literatureHighSearchList()
        }
      },
      changeCondition(data) {
        let columnName = this.checkThemeList.filter(item => {
          if(item.value == data.column) {
            return item;
          }
        });
        data.columnName = columnName[0].label;
      },
      changeMatch(data) {
        let columnName = this.matchList.filter(item => {
          if(item.value == data.type) {
            return item;
          }
        });
        data.typeName = columnName[0].label;
      },
      changeMethod(data) {
        let columnName = this.checkList.filter(item => {
          if(item.value == data.operator) {
            return item;
          }
        });
        data.operatorName = columnName[0].label;
      },
      addLine() {
        this.criterias .push({
          "column": "",
          "columnName": "",
          "operator": "",
          "operatorName": "",
          "param": "",
          "type": "",
          "typeName": ""
        })
      },
      deleteLine() {
        if(this.criterias.length>1) {
          this.criterias.splice(this.criterias.length-1,1)
        }
      },
      onKeyword(data) {
        console.log(data)
      },
      // 普通搜索
      async literatureKeywordSearchList() {
        let that = this;
        that.AllLoading = true;
        let formData = {
          "offset": that.pageNo,
          "limit": 10,
          "args" :{
            "categoryName":"",//分类名称
            "criterias":[],
            "keyword":that.keyword || "",
          }
        };
        try {
          let data = await that.$http.literatureKeywordSearchList(formData);
          if(data.code === 0 && data.data) {
            this.allTotal = data.data.totalElements;
            this.allList = data.data.args;
          }else if(data.code === 1) {
            that.$message.info('查询失败')
          }
          that.AllLoading = false;
        }catch (error) {
          console.log(error);
          that.AllLoading = false;
        }
        that.AllLoading = false;
      },
      //高级查询
      async literatureHighSearchList() {
        let that = this;
        that.AllLoading = true;
        let formData = {
          "offset": that.pageNo,
          "limit": 10,
          "args" :{
            "categoryName":"",//分类名称
            "criterias":that.criterias,
            "keyword":"",
          }
        };
        try{
          let data = await that.$http.literatureHighSearchList(formData);
          if(data.code === 0 && data.data) {
            this.allTotal = data.data.totalElements;
            this.allList = data.data.args;
          }else if(data.code === 1) {
            that.$message.info('查询失败')
          }
          that.AllLoading = false;
        }catch (error) {
          console.log(error)
          that.AllLoading = false;
        }
        that.AllLoading = false;
      },
      //文献热点
      async subjectDocumentList() {
        let that = this;
        that.wordcloudLoading = true;
        try {
          let data = await that.$http.subjectDocumentList();
          if(data.code === 0 && data.data) {
            let array = [];
            data.data.forEach(item=>{
              array.push({
                name: item.name,
                weight: item.count
              })
            });
            that.option.series[0].data = array;
          }else if(data.code === 1) {
            that.$message.info('文献热点查询失败')
          }
          that.wordcloudLoading = false;
        }catch (error) {
          console.log(error)
          that.wordcloudLoading = false;
        }
        that.wordcloudLoading = false;
      }
    },
    mounted() {
      this.subjectDocumentList()
      window.addEventListener('click',(e)=>{
        let wordcloudData = $('.chartContent').attr('data-keyWord') || "";
        if(wordcloudData) {
          this.switchSearch = true;
          this.keyword = wordcloudData ;
          this.literatureKeywordSearchList();
        }

      })
    },
    destroyed() {
      window.removeEventListener('click');
    }
  }
</script>

<style lang="less">
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
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
                cursor: pointer;
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
        overflow: auto;
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
                width: 42px;
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
          .blank_page{
            min-height: 300px;
            display: flex;
            justify-content: center;
            align-content: center;
            .page{
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              img {
                width: 170px;
              }
              p{
                color: #666666;
                padding-top: 10px;
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
