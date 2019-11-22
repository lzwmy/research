<template>
  <div class="print_page-container">
    <div class="header-box">
      <i class="iconfont iconkeyanlinggan"></i>
      <span>科研灵感</span>
    </div>
    <div class="body-container">
      <div class="content-show">
        <div class="content-title">{{title}}</div>
        <div class="content-option">
            <a :href="url" target="_blank">
              <button>
                <i class="iconfont iconchakanyuandaima"></i>
                查看源地址
              </button>
            </a>
<!--          <a :href="`http://192.168.1.100:8080/research/file/downloadFile/5dd685ae53bbd6162c1699cd`" target="_blank">-->
          <a :href="`${baseURL}subject/document/download/?fileId=5dd685ae53bbd6162c1699cd`" target="_blank">
            <button>
              <i class="iconfont iconzaixianyuedu"></i>
              在线阅读
            </button>
          </a>
          <button @click="downFile">
            <i class="iconfont iconxiazai"></i>
            下载
          </button>
        </div>
        <div class="separate-line"></div>
        <div class="content-summary">
          <span>摘要 ：</span>
          {{summary}}
        </div>
        <div class="content-list">
          <div class="list-box">
            <div class="title">doi</div>
            <div class="title-info">{{doi}}</div>
          </div>
          <div class="list-box">
            <div class="title">关键词</div>
            <div class="title-info">{{keyword}}</div>
          </div>
          <div class="list-box">
            <div class="title">作者</div>
            <div class="title-info">{{author}}</div>
          </div>
          <div class="list-box">
            <div class="title">作者单位</div>
            <div class="title-info">{{organ}}</div>
          </div>
          <div class="list-box">
            <div class="title">刊名</div>
            <div class="title-info">{{source}}</div>
          </div>
          <div class="list-box">
            <div class="title">所属期刊栏目</div>
            <div class="title-info">{{journalColumn || '暂无'}}</div>
          </div>
          <div class="list-box">
            <div class="title">年、卷（期）</div>
            <div class="title-info">{{year}}{{volume}}{{period}}</div>
          </div>
          <div class="list-box">
            <div class="title">分类号</div>
            <div class="title-info">{{clc || '暂无'}}</div>
          </div>
          <div class="list-box">
            <div class="title">基金项目</div>
            <div class="title-info">{{fund || '暂无'}}</div>
          </div>
          <div class="list-box">
            <div class="title">在线出版日期</div>
            <div class="title-info">{{pubTime || '暂无'}}</div>
          </div>
          <!--<div class="list-box">
            <div class="title">页数</div>
            <div class="title-info"></div>
          </div>-->
          <div class="list-box">
            <div class="title">页码</div>
            <div class="title-info">{{pageCount || '暂无'}}</div>
          </div>
        </div>
      </div>
      <div class="similar-article">
        <div class="article-title">相似文献</div>
        <div class="article-list" v-for="(item,index) in similarList" :key="index">
          <span @click="jumpPrint(item)">{{item.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        author:"",
        doi:"",
        firstDuty: "",
        fund: "",
        id:"",
        issn:"",
        clc:"",
        journalColumn:"",
        keyword:"",
        organ:"",
        year:"",
        volume:"",
        period:"",
        pageCount:"",
        pubTime:"",
        source:"",
        srcDataBase:"",
        summary:"",
        title: "",
        url:"",
        similarList:[],
      }
    },
    methods: {
      downFile() {
        // this.downFilePDF('5dd72ef053bbd61630a54455','测试PDF下载.pdf')
        this.downFilePDF('5dd685ae53bbd6162c1699cd','测试PDF下载.pdf')
      },
      jumpPrint(data) {
        sessionStorage.setItem('content',JSON.stringify(data));
        window.open("./printPage.html");
      },
      async downFilePDF(value,name) {
        let that = this;
        let fromData = {
          fileId:value
        };
        try {
          // let data = await that.$http.fileDownLoadFile(fromData)
          let data = await that.$http.subjectDownLoadPDF(fromData);
          let blob = new Blob([data.data], {type: 'application/octet-stream'});
          /*let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});*/
          // let fileNmae = data.headers['content-disposition'].split('filename=')[1];
          that.$download(name, blob);
        }catch (error) {
          console.log(error)
        }
      },
      //相似文献列表
      async subjectKeywordSimilar() {
        let that = this;
        let formData = {
          "categoryName": "",
          "criterias": [],
          "keyword": that.keyword
        };
        try {
          let data = await that.$http.subjectKeywordSimilar(formData);
          console.log(data);
          if(data.code === 0 && data.data) {
            that.similarList = data.data;
          }
        }catch (error) {
          console.log(error);
        }
      }
    },
    mounted() {
      let result =JSON.parse(sessionStorage.getItem('content'));
      if(result) {
        this.author=result.author;
        this.doi=result.doi;
        this.firstDuty=result.firstDuty;
        this.fund=result.fund;
        this.id=result.id;
        this.issn=result.issn;
        this.clc = result.clc;
        this.journalColumn = result.journalColumn;
        this.keyword=result.keyword;
        this.organ=result.organ;
        this.year=result.year;
        this.volume=result.volume;
        this.period=result.period;
        this.pageCount=result.pageCount;
        this.pubTime = result.pubTime;
        this.source=result.source;
        this.srcDataBase=result.srcDataBase;
        this.summary=result.summary;
        this.title = result.title;
        this.url =result.url;
      }
      this.subjectKeywordSimilar();
    }
  }
</script>

<style lang="less" scoped>
  body {
    background-color: #F0F2F7;
  }

  .print_page-container {
    width: 100%;
    height: 100%;
    position: relative;

    .header-box {
      display: flex;
      width: 100%;
      height: 60px;
      background: #090e40;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      color: #ffffff;
      -ms-flex-align: center;
      align-items: center;
      padding: 0 30px;
      position: fixed;
      top: 0;

      i {
        font-size: 22px;
      }

      span {
        font-size: 18px;
        padding-left: 14px;
        font-weight: bold;
      }
    }

    .body-container {
      width: 100%;
      height: 100%;
      margin-top: 60px;
      padding: 20px 30px 30px 30px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      background-color: #F0F2F7;

      .content-show {
        flex: 1;
        background-color: #ffffff;
        border: 1px solid rgba(229, 235, 236, 1);
        padding: 23px 100px 0 100px;

        .content-title {
          font-weight: bold;
          color: rgba(99, 102, 110, 1);
          font-size: 24px;
        }

        .content-option {
          padding-top: 30px;
          padding-bottom: 16px;

          button {
            width: 134px;
            height: 36px;
            border-radius: 2px;
            border: 1px solid #3d98ff;
            background-color: #ffffff;
            color: #3d98ff;
            font-size: 14px;
            margin-right: 17px;
            line-height: 29px;
            cursor: pointer;

            .iconfont {
              vertical-align: middle;
              font-size: 15px;
              padding-right: 9px;
            }
            a{
              color: #3d98ff;

            }
            &:hover {
              background-color: #3d98ff;
              color: #ffffff;
            }
            &:hover a{
              background-color: #3d98ff;
              color: #ffffff;
            }
          }
        }

        .separate-line {
          width: 100%;
          height: 1px;
          background-color: #E5EBEC;
          margin-bottom: 16px;
        }
      }

      .similar-article {
        width: 460px;
        height: 970px;
        background-color: #ffffff;
        margin-left: 20px;
        border: 1px solid rgba(229, 235, 236, 1);
        padding: 20px 20px 0 20px;

        .article-title {
          font-size: 20px;
          font-weight: bold;
          color: rgba(99, 102, 110, 1);
          margin-bottom: 20px;
        }

        .article-list {
          padding-left: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(229, 235, 236, 1);
          margin-bottom: 20px;
          span {
            color: rgba(99, 102, 110, 1);
            font-size: 16px;
          }
          &:hover span{
            color: #3d98ff;
            text-decoration:underline;
            cursor: pointer;
          }
        }
      }

      .content-summary {
        color: rgba(99, 102, 110, 1);
        line-height: 25px;
        font-size: 16px;
        margin-bottom: 20px;

        span {
          color: #63666E;
          font-size: 16px;
          font-weight: bold;
        }
      }

      .content-list {
        display: flex;
        flex-direction: column;

        .list-box {
          display: flex;
          justify-content: flex-start;

          .title {
            width: 156px;
            height: 30px;
            display: flex;
            align-items: center;
            font-weight: bold;
            color: rgba(99, 102, 110, 1);
            font-size: 16px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .title-info {
            font-size: 16px;
            color: rgba(99, 102, 110, 1);
            line-height: 30px;
          }
        }
      }
    }
  }
</style>
