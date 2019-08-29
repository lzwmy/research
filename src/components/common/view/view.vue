<template>
    <div class="cloud-container">
        <transition name="el-fade-in-linear" mode="out-in">
            <keep-alive exclude="insideView">
                <router-view v-if="$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
            </keep-alive>
        </transition>
        <transition name="el-fade-in-linear" mode="out-in">
            <router-view v-if="!$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
        </transition>
    </div>
</template>
<script>
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
            }, 300);
        },
    }
};
</script>

<style lang="less">
    
</style>    
