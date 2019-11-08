<template>
    <div class="cloud-container">
        <!-- <transition class="no-animation" :name="transitionName.indexOf($route.meta.belongToGroup) != -1 ?'no-animation':'el-fade-in-linear'"> -->
            <!-- <div :class="transitionName.indexOf($route.meta.belongToGroup) != -1 ?'':'transition'"> -->
                <keep-alive exclude="insideView" v-if="$route.meta.isKeepAlive">
                    <router-view @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.isKeepAlive" @handlePageHeight="handlePageHeight" ref="routercomponent"></router-view>
            <!-- </div> -->
        <!-- </transition> -->
    </div>
</template>
<script>
import utils from 'components/utils/index';
export default {
    name: 'appView',
    data () {
        return {
            transitionName: ['insideView','systemManage','researchTask']  //去除动画组件
        };
    },
    computed: {
    },
    created () {
    },
    mounted () {
        this.$nextTick(() => {
            this.handlePageHeight();
            $(window).resize(()=>{
                this.initView();
                this.handlePageHeight();
            })
            setTimeout(()=>{
                let headerH = $("#main_header").height();
                let mainMarginTop = parseInt($('#main').css('marginTop'));
                $(document).scroll(function() {
                    if($(document).scrollTop() > headerH) {
                        $("#navbar").addClass('fixed');
                        $("#main").css({'margin-top': headerH + mainMarginTop +'px'})
                    }else {
                        $("#navbar").removeClass('fixed');
                        $("#main").css({'margin-top': '24px'})
                    }
                })
            },500)
        });
    },
    watch: {
        $route (to, from) {
            this.$nextTick(() => {
                this.initView();
                this.handlePageHeight();
            });
        }
    },
    methods: {
        // 高度自适应处理
        handlePageHeight () { 
            this.$nextTick(() => {
                let routerViewHeight = $("body").height();
                let otherViewHeight = $("#main_header").outerHeight(true) + $("#navbar").outerHeight(true)+ $(".cloud-component > .cloud-search").outerHeight(true) +
                                        parseInt($("#main").css("marginTop")) + parseInt($("#main").css("marginBottom")) + ($("#main").outerHeight()- $("#main").height());
                if (this.$refs.routercomponent && this.$refs.routercomponent.routerViewHeight) {
                    if (this.$route.name == 'index' || this.$route.name == '/') {
                        this.$refs.routercomponent.routerViewHeight = routerViewHeight - otherViewHeight ;
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
        },
        initView() {
            this.$nextTick(() => {
                let otherHeihgt = $('#main_header').outerHeight() +　$('#navbar').outerHeight() + parseInt($("#main").css('marginTop')) + parseInt($("#main").css('marginBottom')) + parseInt($("#main").css('paddingTop')) + parseInt($("#main").css('paddingBottom'));
                $('#main').css({'min-height': $('body').height() - otherHeihgt +'px'})
            });
        }
    },
    // beforeRouteEnter (to, from, next) {
    //     console.log('进入')
    // },
    // beforeRouteLeave (to, from, next) {
    //     console.log('离开')
    // }
};
</script>   

<style lang="less">
    // .transition > div{
    //     animation: fade 800ms;
    // }
    @keyframes fade {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0.7;
        }
        100% {
            opacity: 1;
        }
    }
</style>
