<template>
    <div class="inside_cloud-container" v-loading="loading"  element-loading-background="#eee">
        <insideHeader @menuViewChange="handleMenuView" :menuPath="menuPath"></insideHeader>
        <insideMenu :title="title" :openMenuView="openMenuView" :menuList="menuList" :menuPath="menuPath"></insideMenu>
        <div id="insideContainer" :class="openMenuView?'open':'close'">
            <p class="title">{{$route.meta.txt}}</p>
            <transition name="el-fade-in-linear" mode="out-in">
                <keep-alive>
                    <router-view v-if="$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent2"></router-view>
                </keep-alive>
            </transition>
            <transition name="el-fade-in-linear" mode="out-in">
                <router-view v-if="!$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent2"></router-view>
            </transition>
        </div>
    </div>
</template>
<script>
import insideHeader from 'components/common/insideHeader/header'
import insideMenu from 'components/common/insideMenu/menu'
import footer from 'components/common/footer/footer';
export default {
    name: 'insideView',
    data () {
        return {
            openMenuView: true,
            loading: false,
            title: "",
            menuPath: '/',
            menuList: []
        };
    },
    components: {
        insideHeader,
        insideMenu,
        'app-footer': footer,
    },
    created () {
        // this.loading = true;
        this.getMenuList();
    },
    mounted () {
        this.initView();
        window.onresize = this.initView;
        // setTimeout(()=>{
        //     this.loading = false;
        // },800)
    },
    methods: {
        initView() {
            this.handlePageHeight();
            $('.inside_cloud-container').css({'min-height':$('body').height()+'px'})
        },
        getMenuList() {
            let insideData = JSON.parse(sessionStorage.getItem('insideMenuData'))
            this.menuPath = insideData.menuPath;
            this.title = insideData.title;
            this.menuList = insideData.menuList;
        },
        handlePageHeight () { // 高度自适应处理
            setTimeout(() => {
                this.$nextTick(() => {
                    let routerViewHeight = $("body").height();
                    let otherViewHeight = $(".inside_header").outerHeight() + $(".cloud-search").outerHeight()+ 
                                            parseInt($('.cloud-component').css('paddingTop')) + parseInt($('.cloud-component').css('paddingBottom'));
                    if (this.$refs.routercomponent2 && this.$refs.routercomponent2.routerViewHeight) {
                        if (this.$route.name == 'index' || this.$route.name == '/') {
                            this.$refs.routercomponent2.routerViewHeight = routerViewHeight - otherViewHeight;
                            this.$nextTick(() => {
                                if (this.$refs.routercomponent2.resize) {
                                this.$refs.routercomponent2.resize();
                                }
                            });
                        } else {
                            this.$refs.routercomponent2.routerViewHeight = routerViewHeight - otherViewHeight;
                            this.$nextTick(() => {
                                if (this.$refs.routercomponent2.resize) {
                                    this.$refs.routercomponent2.resize();
                                }
                            });
                        }
                    }
                });
            }, 400);
        },
        //展开折叠切换
        handleMenuView(val) {
            this.openMenuView = val
        }
    }
};
</script>

<style lang="less">
    .inside_cloud-container {
        height: 100%;
        position: relative;
        #insideContainer{
            position: absolute;
            left: 200px;
            top: 60px;
            right: 0;
            bottom: 0;
            background: #F6F9FC;
            transition: left 300ms;
            z-index: 10;
            overflow: auto;
            &.open {
                left: 200px;
            }
            &.close {
                left: 64px;
            }
            &  > .title {
                height: 60px;
                line-height: 60px;
                text-indent: 15px;
                background-color: #fff;
                color: #333;
                font-size: 20px;
                border-top: 1px solid #f2f2f2;
                border-bottom: 1px solid #e8e8e8;
                position: absolute;
                top: 0px;
                padding: 0 15px;
                left: -15px;
                right: 0;
            }
            .cloud-component {
                position: absolute;
                top: 0px;
                left: 0;
                right: 0;
                bottom: 0px;
                padding: 15px;
                padding-top: 75px !important;
                padding-bottom: 10px;
                overflow: auto;
            }
        }
        .insideFooter {
            position: absolute;
            bottom: 0;
            left: 200px;
            right: 0;
        }
    }
</style> 

