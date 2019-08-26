<template>
  <div id="app" :class="insideView?'insideView':''">
    <app-header></app-header>
    <navbar></navbar>
    <app-view id="main"></app-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import header from 'components/packages/header/header';
import navbar from 'components/packages/navbar/navbar'
import view from 'components/packages/view/view2';
import footer from 'components/packages/footer/footer';

import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/normalize.less';
import 'assets/css/common.less';
// import 'assets/css/green/base.less';
// import 'assets/css/green/reset.less';
// import 'assets/css/blue/base.less';
// import 'assets/css/blue/reset.less';
// import './packages/theme/green/index.less';
// import './packages/theme/blue/index.less';
// import 'assets/css/crfStyle.less'
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
      insideView: false
    };
  },
  computed: {
    // 分别代表两种风格:green,blue
    // ccstyle () {
    //   let ccstyle = this.$store.state.user.ccstyle || localStorage.getItem('research_ccstyle') || 'theme-blue';
    //   return ccstyle;
    // }
  },
  watch: {
    // ccstyle () {
    //   // console.log(this.ccstyle);
    //   if (this.ccstyle == 'theme-green' || this.ccstyle == 'theme-blue') {
    //     document.querySelector('body').className = this.ccstyle;
    //     this.$store.commit({
    //       type: 'changeTheme',
    //       ccstyle: this.ccstyle
    //     });
    //   } else {
    //     document.querySelector('body').className = 'theme-blue';
    //     this.$store.commit({
    //       type: 'changeTheme',
    //       ccstyle: 'theme-blue'
    //     });
    //   }
    // },
    $route () {
      if (this.$route.path === '/insideView') {
        this.insideView = true;
      }else {
        this.insideView = false;
      }
    },
  },
  mounted () {
    // if (this.ccstyle == 'theme-green' || this.ccstyle == 'theme-blue') {
    //   document.querySelector('body').className = this.ccstyle;
    //   this.$store.commit({
    //     type: 'changeTheme',
    //     ccstyle: this.ccstyle
    //   });
    // } else {
    //   document.querySelector('body').className = 'theme-blue';
    //   this.$store.commit({
    //     type: 'changeTheme',
    //     ccstyle: 'theme-blue'
    //   });
    // }
  },
  methods: {}
};
</script>
<style lang="less">
  html, body, #app {
    height: 100%;
  }
  #app.insideView {
    #main_header,
    #navbar {
      display: none;
    }
    #main {
      padding:0;
    }
  }
  #main {
    padding: 50px 100px;
    background-color: #fff;
    .cloud-component{
      height: 100%;
    }
  }
</style>
