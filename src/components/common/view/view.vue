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
        this.$nextTick(() => {
            this.handlePageHeight();
            $(window).resize(()=>{
                this.handlePageHeight();
                this.initView();
            })
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
            });
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
                let otherViewHeight = $("#main_header").outerHeight(true) + $("#navbar").outerHeight(true)+ $(".cloud-component").outerHeight(true) +
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
    }
};
</script>   
