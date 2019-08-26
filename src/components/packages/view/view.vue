<template>
  <div class="cloud-container">
    <div class="hideScrollCon" :class="{'onclick':isDislpayArrow}">
      <img @click="routeTo('/index')" class="menu-logo" :src="'./static/img/logo/'+logo" title="首页" />
      <div class="el-menu-box">
        <el-menu router :default-active="defaultActive" :unique-opened="true">
          <span v-for="(menuItem1, index1) in menuList" :key="menuItem1.menuCode">
            <el-menu-item v-if="!menuItem1.children || menuItem1.children.length == 0" :index="menuItem1.menuPath" class="index-menu-item">
              <template slot="title">
                <img class="el-menu-icon" :src="'./static/img/'+menuItem1.ico+'_blue.png'"
                     v-if="('/'+$route.name) == menuItem1.menuPath || (menuItem1.menuPath == '/SDResearch' && $route.name == 'diseaseSet')  && $parent.ccstyle=='theme-blue'" />
                <img class="el-menu-icon" :src="'./static/img/'+menuItem1.ico+'.png'" v-else />
                {{menuItem1.menuName}}
              </template>
            </el-menu-item>
            <el-submenu v-else :index="menuItem1.menuCode">
              <template v-if="menuItem1.menuLevel=='2'" slot="title">
                <img class="el-menu-icon" :src="'./static/img/'+menuItem1.ico+'.png'" />
                {{menuItem1.menuName}}
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(menuItem2, index2) in menuItem1.children" :index="menuItem2.menuPath"
                              :key="menuItem2.menuCode">{{menuItem2.menuName}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </span>

        </el-menu>
      </div>
    </div>
    <div class="dislpayArrow" :class="{'onclick':isDislpayArrow}" @click="dislpayArrow"
         :title="isDislpayArrow?'展开菜单':'收起菜单'"></div>
    <transition-group name="list-complete" tag="div" class="route-menu clearfix" :class="{'onclick':isDislpayArrow}">
      <div class="route-menu-box" key="box">
        <!--<div class="el-tag" key="/" :class="{on:indexFlag}" style="min-width:70px;padding:0 10px">-->
        <!--<label @click="routeTo('/')">首页</label>-->
        <!--</div>-->
        <div @click="routeTo(item.historyPath[0].fullPath)" v-for="(item,i) in getRouteArr" :key="item.route.fullPath"
             class="el-tag"
             :class="{on:getRoute.meta.flag == item.route.meta.flag}">
          <label>{{item.route.meta.txt}}</label>
          <i class="el-tag__close el-icon-close" @click.stop="routeClose(i)" title="关闭"
             v-if="!(item.route.name=='index' || item.route.name=='/')"></i>
        </div>
        <div class="el-tag" key="more" :class="{on:moreMenuFlag}" v-if="showMoreMenu.length >0"
             style="padding:0;width:107px">
          <el-dropdown>
            <label class="el-dropdown-link">更多菜单</label>
            <el-dropdown-menu slot="dropdown" class="el-tag-more menumore">
              <el-dropdown-item v-for="(item,i) in showMoreMenu" :key="item.route.fullPath"
                                :class="{on:getRoute.meta.flag == item.route.meta.flag}"
                                v-if="item.route.meta.txt !== '首页'">
                <label @click="routeTo(item.historyPath[0].fullPath)">{{item.route.meta.txt}}</label>
                <i class="el-tag__close el-icon-close" @click.stop="routeClose(getRouteArr.length+i)" title="关闭"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div key="button" style="float:right;margin-right:11px;">
          <el-button-group>

            <el-button type="primary" class="route-menu-button-left"
                       :class="{'disabled':(getRouteArr.length+showMoreMenu.length)==1 || getRouteArrFirst}"
                       @click.native="nextRouteEvent('left')"><i class="el-icon-arrow-left el-icon--left"
                                                                 title="向左移动标签"></i></el-button>
            <el-button type="primary" class="route-menu-button-close"
                       :class="{'disabled':(getRouteArr.length+showMoreMenu.length)==1}" @click.native="routeCloseAll">
              <i
                class="el-icon-close" title="关闭所有标签"></i></el-button>
            <el-button type="primary" class="route-menu-button-right"
                       :class="{'disabled':(getRouteArr.length+showMoreMenu.length==1) || (getRouteArr==undefined || getRouteArr=='' || getRouteArr==null) ? true : (showMoreMenu.length==0?($route.name == getRouteArr[getRouteArr.length-1].route.name):($route.name == showMoreMenu[showMoreMenu.length-1].route.name))}"
                       @click.native="nextRouteEvent('right')"><i class="el-icon-arrow-right el-icon--right"
                                                                  title="向右移动标签"></i>
            </el-button>
          </el-button-group>
        </div>

      </div>
    </transition-group>
    <div class="el-router-view" :class="{'onclick':isDislpayArrow}">
      <div class="el-router-container">
        <transition name="el-fade-in-linear" mode="out-in">
          <keep-alive>
            <router-view v-if="$route.meta.isKeepAlive" ref="routercomponent"
                         @handlePageHeight="handlePageHeight"></router-view>
          </keep-alive>
        </transition>
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view v-if="!$route.meta.isKeepAlive" ref="routercomponent"
                       @handlePageHeight="handlePageHeight"></router-view>
        </transition>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>
<script>
import './theme/green/view.less';
import './theme/blue/view.less';
import appFooter from 'components/packages/footer/footer';

export default {
  name: 'appView',
  data () {
    return {
      data: [],
      logo: '',
      title: '',
      isDislpayArrow: false,
      defaultActive: ''
    };
  },
  components: {appFooter},
  computed: {
    menuList () {
      return this.$store.state.user.menuList;
    },
    defaultOpeneds () {
      let defaultOpeneds = [];
      this.$store.state.user.menuList.forEach((item) => {
        if (item.MENU_LEVEL == 2) {
          defaultOpeneds.push(item.MENU_CODE);
        }
      });
      return defaultOpeneds;
    },
    getRoute () {
      return this.$route;
    },
    getRouteArr () {
      let position = this.getRect(document.querySelector('.route-menu'));
      let num = parseInt((position.right - position.left - 218) / 218);// 最长的顶部tag的width为218px
      // console.log(this.$store.state.user.routeArr.slice(0, num))
      return this.$store.state.user.routeArr.slice(0, num);
    },
    defaultActive2 () {
      console.log('/' + this.$route.meta.flag);
      return '/' + this.$route.meta.flag;
    },
    getRouteArrFirst () {
      return (this.getRouteArr.length + this.showMoreMenu.length) == 0 ? true : (this.getRouteArr.length == 0 ? this.showMoreMenu[0].route.path == this.$route.path : this.getRouteArr[0].route.path == this.$route.path);
    },
    moreMenuFlag () {
      for (var i = 0; i < this.showMoreMenu.length; i++) {
        if (this.$route.path == this.showMoreMenu[i].route.path || this.$route.path == (this.showMoreMenu[i].route.path + 'Detail')) {
          break;
        }
      }
      if (i == this.showMoreMenu.length) {
        return false;
      } else {
        return true;
      }
    },
    showMoreMenu () {
      let position = this.getRect(document.querySelector('.route-menu'));
      let num = parseInt((position.right - position.left - 218) / 218);// 最长的顶部tag的width为218px
      return this.$store.state.user.routeArr.slice(num);
    }
  },
  created () {
    this.logo = JSON.parse(sessionStorage.getItem('Global')).logo;
    this.title = JSON.parse(sessionStorage.getItem('Global')).title;
  },
  mounted () {
    this.initPage();
  },
  watch: {
    $route (to, from) {
      this.$nextTick(() => {
        this.handlePageHeight();
        if (from.meta.flag == undefined) { // 刷新的时候
          setTimeout(() => {
            this.defaultActive = '/' + to.meta.flag;
          }, 600);
        } else { // 跳转的时候
          this.defaultActive = '/' + to.meta.flag;
        }
      });
    }
  },
  methods: {
    initPage () {
      window.onresize = this.handlePageHeight; // 高度自适应处理
      let sessionIsDislpayArrow = sessionStorage.getItem('RESEARCH_ISDISPLAYARROW');
      this.$nextTick(() => {
        if (sessionIsDislpayArrow == 'false') {
          this.isDislpayArrow = false;
        } else if (sessionIsDislpayArrow == 'true') {
          this.isDislpayArrow = true;
        } else {
          this.isDislpayArrow = false;
        }
        this.$store.commit({
          type: 'saveSession_isDislpayArrow',
          isDislpayArrow: this.isDislpayArrow
        });
      });
    },
    handlePageHeight () { // 高度自适应处理
      setTimeout(() => {
        this.$nextTick(() => {
          let routerViewHeight = document.querySelector('.el-router-view').clientHeight;
          let searchHeight = document.querySelector('.el-router-container').clientHeight;
          // console.log(routerViewHeight)
          // console.log(searchHeight)
          // console.log(this.$refs.routercomponent)
          if (this.$refs.routercomponent && this.$refs.routercomponent.routerViewHeight) {
            if (this.$route.name == 'index' || this.$route.name == '/') {
              this.$refs.routercomponent.routerViewHeight = Number(routerViewHeight - 20 - 38 * 2 - 40) > 435 ? Number(routerViewHeight - 20 - 38 * 2 - 40) : 435;
              this.$nextTick(() => {
                if (this.$refs.routercomponent.resize) {
                  this.$refs.routercomponent.resize();
                }
              });
            } else {
              this.$refs.routercomponent.routerViewHeight = Number(routerViewHeight - searchHeight) > 435 ? Number(routerViewHeight - searchHeight) : 435;
              // console.warn(this.$refs.routercomponent.routerViewHeight)
              this.$nextTick(() => {
                if (this.$refs.routercomponent.resize) {
                  this.$refs.routercomponent.resize();
                }
              });
            }
          }
        });
      }, 400);
    },
    getRect (element) {
      if (!element) {
        return false;
      }
      var rect = element.getBoundingClientRect();
      var top = document.documentElement.clientTop;
      var left = document.documentElement.clientLeft;
      return {
        top: rect.top - top,
        bottom: rect.bottom - top,
        left: rect.left - left,
        right: rect.right - left
      };
    },
    dislpayArrow () {
      let that = this;
      that.isDislpayArrow = !that.isDislpayArrow;
      this.$store.commit({
        type: 'saveSession_isDislpayArrow',
        isDislpayArrow: that.isDislpayArrow
      });
      sessionStorage.setItem('RESEARCH_ISDISPLAYARROW', that.isDislpayArrow);
      setTimeout(() => { // 隐藏左侧菜单后执行路由组件的resize方法，使图表自适应
        if (that.$refs.routercomponent.resize) {
          that.$refs.routercomponent.resize();
        }
      }, 200);
    },
    routeTo (path) {
      this.$router.push({path: path});
    },
    routeClose (index) {
      var that = this;
      that.$store.commit({
        type: 'reduceRoute',
        paras: {index: index, vueParent: that}
      });
    },
    routeCloseAll () {
      let that = this;
      //        console.log(that.getRouteArr);
      //        console.log(that.$route.fullPath);
      //        console.log(that.$route.name);
      if ((that.getRouteArr.length + that.showMoreMenu.length) == 1) {
        return false;
      }
      that.$confirm('您确定要关闭所有标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$store.commit({
          type: 'closeAllRoute',
          paras: {vueParent: that}
        });
      }).catch((errors) => {
        console.log(errors);
      });
    },
    nextRouteEvent (option) {
      let that = this;
      //        console.log(that.getRouteArr);
      //        console.log(that.showMoreMenu);
      //        console.log(that.$route.fullPath);
      //        console.log(that.$route.name);
      if (option == 'left') {
        if (that.getRouteArr.length + that.showMoreMenu.length == 1) {
          return false;
        } else {
          //            console.warn(that.getRouteArr);
          //            console.warn(that.showMoreMenu);
          //            console.warn(that.$route.fullPath);
          //            console.warn(that.$route.name);
          let runFlag = false;
          for (let i = 0; i < that.getRouteArr.length; i++) {
            if (that.$route.name == that.getRouteArr[i].route.name) {
              runFlag = true;
              if (i == 0) { // 向左在正常菜单第一个
                return false;
              } else { // 向左在正常菜单不是第一个
                //                  if (that.$route.name == 'residentInfoDetail') {
                //                    that.$store.commit({
                //                      type: 'addRoute',
                //                      route: that.$route
                //                    })
                //                  }
                that.routeTo(that.getRouteArr[i - 1].route.fullPath);
              }
            }
          }
          if (runFlag) {
            return false;
          }
          for (let i = 0; i < that.showMoreMenu.length; i++) {
            if (that.$route.name == that.showMoreMenu[i].route.name) {
              if (i == 0) { // 向左从更多菜单进入正常菜单
                //                  if (that.$route.name == 'residentInfoDetail') {
                //                    that.$store.commit({
                //                      type: 'addRoute',
                //                      route: that.$route
                //                    })
                //                  }
                that.routeTo(that.getRouteArr[that.getRouteArr.length - 1].route.fullPath);
              } else { // 向左在更多菜单不是更多菜单的第一个
                //                  if (that.$route.name == 'residentInfoDetail') {
                //                    that.$store.commit({
                //                      type: 'addRoute',
                //                      route: that.$route
                //                    })
                //                  }
                that.routeTo(that.showMoreMenu[i - 1].route.fullPath);
              }
            }
          }
        }
      } else if (option == 'right') {
        //          console.warn(that.getRouteArr);
        //          console.warn(that.showMoreMenu);
        //          console.warn(that.$route.fullPath);
        //          console.warn(that.$route.name);
        if (that.getRouteArr.length + that.showMoreMenu.length == 1) {
          return false;
        } else {
          // 此标记的作用是：当执行了第一个for循环，有成立的if的时候，会跳转路由，
          // 如果从getRouteArr进入了更多菜单showMoreMenu，此时继续往下会执行第二个for循环，从而产生bug；所以用标记只执行一个for循环
          let runFlag = false;
          for (let i = that.getRouteArr.length - 1; i >= 0; i--) {
            if (that.$route.name == that.getRouteArr[i].route.name) {
              runFlag = true;
              if (that.getRouteArr.length - 1 == i && that.showMoreMenu.length > 0) { // 向右进入更多菜单
                //                  if (that.$route.name == 'residentInfoDetail') {
                //                    that.$store.commit({
                //                      type: 'addRoute',
                //                      route: that.$route
                //                    })
                //                  }
                // console.log(that.showMoreMenu[0].route.fullPath);
                that.routeTo(that.showMoreMenu[0].route.fullPath);
              } else if (that.getRouteArr.length - 1 == i && that.showMoreMenu.length == 0) {
                return false;
              } else { // 向右还在正常菜单
                if (that.$route.name == 'residentInfoDetail') {
                  that.$store.commit({
                    type: 'addRoute',
                    route: that.$route
                  });
                }
                that.routeTo(that.getRouteArr[i + 1].route.fullPath);
              }
            }
          }
          if (runFlag) {
            return false;
          }
          for (let i = that.showMoreMenu.length - 1; i >= 0; i--) {
            if (that.$route.name == that.showMoreMenu[i].route.name) {
              if (that.showMoreMenu.length - 1 == i) {
                return false;
              } else {
                //                  if (that.$route.name == 'residentInfoDetail') {
                //                    that.$store.commit({
                //                      type: 'addRoute',
                //                      route: that.$route
                //                    })
                //                  }
                that.routeTo(that.showMoreMenu[i + 1].route.fullPath);
              }
            }
          }
        }
      }
    }
  }
};
</script>
