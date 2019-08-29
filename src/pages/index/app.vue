<template>
  <div id="app" :class="insideView?'insideView':''">
    <app-header></app-header>
    <navbar></navbar>
    <app-view id="main" :class="isIndex?'isIndex':''"></app-view>
    <app-footer v-show="!insideView"></app-footer>
  </div>
</template>

<script>
import header from 'components/common/header/header';
import navbar from 'components/common/navbar/navbar'
import view from 'components/common/view/view';
import footer from 'components/common/footer/footer';

import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/normalize.less';
import 'assets/css/common.less';
import 'assets/css/crfStyle.less'
export default {
  name: 'app',
  components: {
    'app-header': header,
    'app-view': view,
    'app-footer': footer,
    navbar

  },
  data () {
    return {
      //是否为内页主页
      insideView: false,
      isIndex: true
    };
  },
  computed: {
  },
  watch: {
    $route () {
      if (this.$route.meta.openMode === 2) {
        this.insideView = true;
      }else {
        this.insideView = false;
      }
      if(this.$route.path === '/' || this.$route.path === '/index') {
        this.isIndex = true;
      }else {
        this.isIndex = false;
      }
    },
  },
  mounted () {
    window.onresize = this.initView();
    this.initView();
  },
  methods: {
    initView() {
      let h = $('body').height() - $('#main_header').outerHeight() -　$('#navbar').outerHeight() - $('#app > .footer').outerHeight() - parseInt($("#main").css('marginTop'))*2;
      $('#main').css({'min-height': h +'px'})
    }
  }
};
</script>
<style lang="less">
  html, body {
    height: 100%;
  }
  #app {
    background-color: #f0f2f7;
  }
  #app.insideView {
    #main_header,
    #navbar {
      position: absolute;
      top: -300px;
    }
    #main {
      margin:0 !important;
      .inside_cloud-container{ 
        padding: 0;
      }
    }
  }
  #main {
    margin: 30px 100px 20px;
    background: #fff;
    .cloud-component{
      height: 100%;
      padding: 15px;
    }
  }
  @media (max-width: 1023px){
    #navbar, #main_header { padding: 0 10px !important;}
  } 
  @media (min-width: 1024px){
    #navbar, #main_header { padding: 0 10px !important;}
  } 
  @media (min-width: 1280px) {
    #main { margin-left: 30px !important; margin-right: 30px !important;}
    #navbar, #main_header { padding: 0 30px !important;}
  }

  @media (min-width: 1366px) {
    #main { margin-left: 80px !important; margin-right: 80px !important;}
    #navbar, #main_header { padding: 0 80px !important;}
  }  

  @media (min-width: 1440px) {
    #main { margin-left: 100px !important; margin-right: 100px !important;}
    #navbar, #main_header { padding: 0 100px !important;}
  } 

  @media (min-width: 1680px) {
    #main { margin-left: 160px !important; margin-right: 160px !important;}
    #navbar, #main_header { padding: 0 160px !important;}
  } 
  @media (min-width: 1920px) {
    #main { margin-left: 180px !important; margin-right: 180px !important;}
    #navbar, #main_header { padding: 0 180px !important;}
  } 
</style>


