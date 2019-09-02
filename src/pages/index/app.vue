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
    this.initView();
    window.onresize = this.initView;
  },
  methods: {
    initView() {
      let otherHeihgt = $('#main_header').outerHeight() +　$('#navbar').outerHeight() + $('#app > .footer').outerHeight() + parseInt($("#main").css('marginTop')) + parseInt($("#main").css('marginBottom'))
      $('#main').css({'min-height': $('body').height() - otherHeihgt +'px'})
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
    min-height: 100%;
  }
  #app.insideView {
    #main_header,
    #navbar {
      display: none;
    }
    #main {
      width: 100% !important;
      margin: 0 !important;
      .inside_cloud-container{ 
        padding: 0;
      }
    }
  }
  #main {
    margin: 24px auto 20px;
    width: 1200px;
    background: #fff;
    .cloud-component{
      padding: 15px;
    }
  }
  @media screen and (min-width: 350px) and (max-width: 1200px) {
    #app {
      width: 1200px !important;
      overflow: scroll;
    }
    #navbar .el-tabs, 
    #main_header .header_box {
      padding: 0 20px;
      width: 1200px !important;
      margin: 0;
    }
  }


</style>


