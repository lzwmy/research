<template>
    <div class="inside_cloud-container">
        <insideHeader @menuViewChange="handleMenuView"></insideHeader>
        <insideMenu></insideMenu>
        <div id="insideContainer" :class="openMenuView?'open':'close'"></div>
        <!-- <transition name="el-fade-in-linear" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
            </keep-alive>
        </transition>
        <transition name="el-fade-in-linear" mode="out-in">
            <router-view v-if="!$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
        </transition> -->
    </div>
</template>
<script>
import insideHeader from 'components/packages/insideHeader/header'
import insideMenu from 'components/packages/insideMenu/menu'

export default {
    name: 'insideView',
    data () {
        return {
            openMenuView: true
        };
    },
    components: {
        insideHeader,
        insideMenu
    },
    created () {
    },
    mounted () {
        window.onresize = this.handlePageHeight; // 高度自适应处理
    },
    watch: {
        $route (to, from) {
            this.$nextTick(() => {
                this.handlePageHeight();
                // console.log(document.querySelector('#main').clientHeight)
            });
        }
    },
    methods: {
        handlePageHeight () { // 高度自适应处理
            setTimeout(() => {
                this.$nextTick(() => {
                    let routerViewHeight = document.querySelector('#main').clientHeight;
                    let otherViewHeight = $("#main_header").height() + $("#navbar").height() + 50 + $(".cloud-search").height() + ($("#main").innerHeight() - $("#main").height())/2;
                    let searchHeight = document.querySelector('#main').clientHeight;
                    if (this.$refs.routercomponent && this.$refs.routercomponent.routerViewHeight) {
                        if (this.$route.name == 'index' || this.$route.name == '/') {
                            this.$refs.routercomponent.routerViewHeight = routerViewHeight - otherViewHeight;
                            this.$nextTick(() => {
                                if (this.$refs.routercomponent.resize) {
                                this.$refs.routercomponent.resize();
                                }
                            });
                        } else {
                            this.$refs.routercomponent.routerViewHeight = routerViewHeight -170;
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
            top: 70px;
            right: 0;
            bottom: 0;
            overflow: auto;
            background: #ccc;
            transition: left 300ms;
            z-index: 10;
            &.open {
                left: 200px;
            }
            &.close {
                left: 0;
            }
        }
    }
</style>    
