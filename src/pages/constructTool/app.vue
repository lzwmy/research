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
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
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
    border-radius: 2px;
    background-color: #ffffff;
    display: grid;
    grid-template-columns: ;
  }
</style>
