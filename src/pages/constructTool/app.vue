<template>
    <div class="construct_tool">
      <div class="header">
        <div class="header-box flex-between-center">
          <a href="./constructTool.html" class="header-logo flex-start-center cur_pointer router-link-exact-active router-link-active">
            <img :src="'./static/img/logo/'+this.logo" alt="卫健智能">
            <span class="header-title">{{title}}</span>
          </a>
        </div>
      </div>
      <div class="content-body">
        <div class="content-box">
          <div class="content-item" @click="jumpURL('http://47.112.114.173:17212/HMC/#/archetype')">
            <div class="content_aligned">
              <img src="./images/create_model.png" alt="">
              <p>openEHR信息建模</p>
            </div>
          </div>
          <div class="content-item" @click="jumpURL('http://111.230.90.48:8097/hitszmed/')">
            <div class="content_aligned">
              <img src="./images/natural_language.png" alt="">
              <p>NLP自然语言处理</p>
            </div>
          </div>
          <div class="content-item" @click="jumpURL('http://research.emhi.cn/ocr/')">
            <div class="content_aligned">
              <img src="./images/img_Identify.png" alt="">
              <p>图片识别（检验报告）</p>
            </div>
          </div>
          <div class="content-item" @click="jumpURL('http://172.16.0.10:8000/form_view/')">
            <div class="content_aligned">
              <img src="./images/Article_recommendation.png" alt="">
              <p>文章推荐</p>
            </div>
          </div>
          <div class="content-item">
            <div class="content_aligned">
              <img src="./images/Paragraph_generation.png" alt="">
              <p>文章段落生成</p>
            </div>
          </div>
          <div class="content-item" >
            <div class="content_aligned">
              <img src="./images/Quality_control.png" alt="">
              <p>数据质控</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "app",
      data() {
          return {
            title:"专科专病大数据平台组件工具包",
            logo:""
          }
      },
      created() {
        this.logo = JSON.parse(localStorage.getItem('Global')).logo;
      },
      methods:{
        jumpURL(url) {
          window.open(url)
        }
      }
    }
</script>

<style scoped>
.construct_tool .header {
  background-color: #090e40;
  height: 60px;
}
.construct_tool .header .header-box{
  width: 1300px;
  margin: 0 auto;
  height: 100%;
  overflow: auto;
}
  .header-box img{
    height: 36px;
    width: 136px;
  }
  .header-box a:hover{
    color: #ffffff;
  }
  .header-box .header-logo{
    color: #fff;
    font-size: 18px;
  }
  .header .header-title{
    border-left: 1px solid #fff;
    line-height: 24px;
    margin-left: 15px;
    white-space: nowrap;
    font-size: 20px;
    font-weight: bold;
    padding-left: 15px;
  }
  .content-body{
    height: calc(100vh - 60px);
    background-color: #f0f2f7;
    padding-top: 20px;
  }
  .content-body .content-box {
    width: 1300px;
    height: calc(100vh - 100px);
    margin:0 auto;
    background-color: #ffffff;
    border-radius: 2px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 19.3%);
    grid-template-rows: repeat(auto-fill,180px);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    padding: 25px;
  }
.content-box > div{
  background-color:#F9FAFC;
  border-radius: 4px;
  cursor: pointer;
}
.content-box > div:hover{
  background-color: #1BBAE1;
  opacity: 0.8;
}
  .content-box .content-item{
    display: grid;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 180px;
    box-shadow: 5px 9px 8px -2px rgba(0, 0, 0, 0.16);
  }
  .content-item .content_aligned{
    text-align: center;
    display: grid;
    justify-items: center;
    height: 100%;
    align-items: end;
  }
  .content_aligned p{
    padding-bottom: 20px;
    display: grid;
    align-items: end;
    font-size: 20px;
    color:#1BBAE1;
    font-weight: 400;
  }
  .content_aligned img{
    width: 78px;
  }
.content-box > div:hover p{
  color: #ffffff;
}
</style>
