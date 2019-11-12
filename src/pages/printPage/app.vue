<template>
    <div class="print_page-container">
        <div class="header-box">
          <i class="iconfont iconkeyanlinggan"></i>
          <span>科研灵感</span>
        </div>
        <div class="body-container">
          <div class="content-show">
            <div class="content-title">重度颅脑损伤术中应用阶梯式减压技术的疗效分析</div>
            <div class="content-option">
              <button>
                <i class="iconfont iconchakanyuandaima"></i>
                查看源地址
              </button>
              <button>
                <i class="iconfont iconzaixianyuedu"></i>
                在线阅读
              </button>
              <button>
                <i class="iconfont iconxiazai"></i>
                下载
              </button>
            </div>
            <div class="separate-line"></div>
            <div class="content-summary">
              <span>摘要 ：</span>
              目的探讨急性重度颅脑损伤患者术中应用阶梯式减压技术的疗效。方法 2014年12月-2017年12月,我院行标准大骨瓣减压术的重型颅脑损伤患者356例,依据术中有无采用阶梯式减压技术,随机分成两组:阶梯式减压组(n=187),传统减压组(n=169),观察两组患者的围手术期并发症发生率及术后6个月时GOS评分并行统计分析。结果阶梯式减压组急性脑膨出以及迟发性血肿的发生率低于传统减压组(P 0.05);阶梯式减压组术后6个月时预后好于传统减压组(P 0.05)。结论重型颅脑损伤患者术中采用阶梯式减压技术能够降低围术期并发症的发生,并能改善患者预后。
            </div>
            <div class="content-list">
              <div class="list-box">
                <div class="title">dio</div>
                <div class="title-info">#10.11765/j.issn.0253</div>
              </div>
              <div class="list-box">
                <div class="title">关键词</div>
                <div class="title-info">阿司匹林</div>
              </div>
            </div>
          </div>
          <div class="similar-article">
            <div class="article-title">相似文献</div>
            <div class="article-list">
              <span>风湿病与关节炎</span>
            </div>
            <div class="article-list">
              <span>风湿病与关节炎</span>
            </div>
            <div class="article-list">
              <span>风湿病与关节炎</span>
            </div>
            <div class="article-list">
              <span>风湿病与关节炎</span>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {

        }
      },
      methods:{

      },
      mounted() {
      }
    }
</script>

<style lang="less" scoped>
  body{
    background-color: #F0F2F7;
  }
.print_page-container{
  width: 100%;
  height: 100%;
  position: relative;
  .header-box{
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
    i{
      font-size:22px ;
    }
    span{
      font-size:18px;
      padding-left: 14px;
      font-weight: bold;
    }
  }
  .body-container{
    width: 100%;
    height: 100%;
    margin-top: 60px;
    padding: 20px 30px 30px 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #F0F2F7;
    .content-show{
      flex: 1;
      background-color: #ffffff;
      border:1px solid rgba(229,235,236,1);
      padding: 23px 100px 0 100px;
      .content-title{
        font-weight:bold;
        color:rgba(99,102,110,1);
        font-size: 24px;
      }
      .content-option{
        padding-top: 30px;
        padding-bottom: 16px;
        button{
          width:134px;
          height:36px;
          border-radius:2px;
          border:1px solid #3d98ff;
          background-color: #ffffff;
          color: #3d98ff;
          font-size:14px;
          margin-right: 17px;
          line-height: 29px;
          cursor: pointer;
          .iconfont{
            vertical-align: middle;
            font-size: 15px;
            padding-right: 9px;
          }
          &:hover{
            background-color: #3d98ff;
            color: #ffffff;
          }
        }
      }
      .separate-line{
        width: 100%;
        height: 1px;
        background-color:#E5EBEC;
        margin-bottom: 16px;
      }
    }
    .similar-article{
      width: 460px;
      height: 970px;
      background-color: #ffffff;
      margin-left: 20px;
      border:1px solid rgba(229,235,236,1);
      padding: 20px 20px 0 20px;
      .article-title{
        font-size:20px;
        font-weight:bold;
        color:rgba(99,102,110,1);
        margin-bottom: 20px;
      }
      .article-list{
        padding-left: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(229,235,236,1);
        margin-bottom: 20px;
        span{
          color:rgba(99,102,110,1);
          font-size:16px;
        }
      }
    }
    .content-summary{
      color:rgba(99,102,110,1);
      line-height:25px;
      font-size:16px;
      margin-bottom: 20px;
      span{
        color: #63666E;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .content-list{
      display: flex;
      flex-direction: column;
      .list-box{
        display: flex;
        justify-content: flex-start;
        .title{
          width: 156px;
          height: 30px;
          display: flex;
          align-items: center;
          font-weight:bold;
          color:rgba(99,102,110,1);
          font-size:16px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .title-info{
          font-size:16px;
          color:rgba(99,102,110,1);
          line-height: 30px;
        }
      }
    }
  }
}
</style>
