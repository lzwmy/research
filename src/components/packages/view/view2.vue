<template>
    <div class="cloud-container">
        <transition name="el-fade-in-linear" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
            </keep-alive>
        </transition>
        <transition name="el-fade-in-linear" mode="out-in">
            <router-view v-if="!$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
        </transition>
    </div>
</template>
<script>
// import './theme/green/view.less';
// import './theme/blue/view.less';


export default {
    name: 'appView',
    data () {
        return {
        };
    },
    computed: {
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
                            this.$refs.routercomponent.routerViewHeight = routerViewHeight - otherViewHeight;
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
    }
};
</script>

<style lang="less">
    .cloud-container {
        height: 100%;
    }
</style>    
