<template>
  <div id="app" :class="insideView?'insideView':''">
    <app-header v-show="!insideView"></app-header>
    <app-navbar v-show="!insideView"></app-navbar>
    <app-view id="main"></app-view>
  </div>
</template>

<script>
import header from 'components/common/header/header';
import navbar from 'components/common/navbar/navbar'
import view from 'components/common/view/view';
export default {
  name: 'app',
  components: {
    'app-header': header,
    'app-view': view,
    'app-navbar': navbar,
    
  },
  data () {
    return {
      //是否为内页主页
      insideView: true,
    };
  },
  watch: {
    $route () {
      if (this.$route.meta.openMode === 2) {
        this.insideView = true;
      }else {
        this.insideView = false;
      }
    },
  },
  created() {
      
  },
  methods: {
    
  }
};
</script>
<style lang="less">
  html, body {
    height: 100%;
  }
  #app {
    background-color: #f0f2f7;
    min-height: 100%;
    
  }
  #main {
    margin: 24px auto 0;
    padding-bottom: 20px;
    .cloud-component{
      padding: 0;
    }
  }
  #main, #navbar .el-tabs, #main_header .header_box {
    width: 1300px;
  }
  #app.insideView {
    #main {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      .inside_cloud-container{ 
        padding: 0 !important;
      }
    }
  }


  @media screen and (min-width: 350px) and (max-width: 1200px) {
    #app {
      width: 1300px !important;
    }
    #navbar .el-tabs, 
    #main_header .header_box {
      width: 100% !important;
      margin: 0;
    }
    #main, #navbar, #main_header {
      width: 1300px;
      padding: 0 10px;
    }
  }


</style>


