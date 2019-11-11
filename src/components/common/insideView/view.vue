<template>
    <div class="inside_cloud-container">
        <insideHeader @diseaseSelect="handleDiseaseSelect"></insideHeader>
        <insideMenu :title="title" @changeLoadding="handleLoadding" :menuList="menuList" :fromRouter="fromRouter" @changeMenuList="handleMenuList"></insideMenu>
        <div id="insideContainer" :class="$store.state.common.openMenuView?'open':'close'" v-loading="viewLoading"  
                        element-loading-background="#fff"
                        element-loading-text="拼命加载中">
            <p class="title">{{$route.meta.txt}}</p>
            <transition name="el-fade-in-linear" mode="out-in">
                <keep-alive>
                    <router-view 
                        v-if="$route.meta.isKeepAlive" 
                        @handlePageHeight="handlePageHeight" 
                        ref="routercomponent2" 
                        class="insideContainer"
                        @changeLoadding="handleLoadding">
                    </router-view>
                </keep-alive>
            </transition>
            <transition name="el-fade-in-linear" mode="out-in">
                <router-view 
                    v-if="!$route.meta.isKeepAlive"
                    @handlePageHeight="handlePageHeight" 
                    ref="routercomponent2" 
                    class="insideContainer"
                    @changeLoadding="handleLoadding">
                </router-view>
            </transition>
        </div>
    </div>
</template>
<script>
import insideHeader from 'components/common/insideHeader/header'
import insideMenu from 'components/common/insideMenu/menu'
import diseaseRouter from '../insideMenu/diseaseRouter'
export default {
    name: 'insideView',
    data () {
        return {
            loading: false,
            title: "",
            fromRouter: {
                path: '/',
                meta: {}
            },
            menuList: [],
            researchId: '',
            disease: "",
            viewLoading: false
        };
    },
    components: {
        insideHeader,
        insideMenu,
    },
    created () {
        this.getMenuList();
    },
    watch: {
    },
    mounted () {
        this.initView();
        window.onresize = this.initView;
        let headLeft = parseInt($('.component_head').css("left"));
        $(document).scroll(function() {
            if($(document).scrollLeft() != 0) {
                $('.component_head').css({'left': headLeft - $(document).scrollLeft() +'px','transition': 'none'});
            }else {
                $('.component_head').css({'left': headLeft + 'px','transition': 'left 300ms'});
            }
        });
    },
    methods: {
        //改变菜单
        handleMenuList(data) {
            this.menuList = data;
        },
        initView() {
            this.handlePageHeight();
            $('.inside_cloud-container').css({'min-height':$('body').height()+'px'})
        },
        getMenuList() {
            //如果从科研项目入口录入
            if(sessionStorage.getItem('CURR_LOGIN_TYPE') == "research") {
                this.fromRouter = {};
                this.title = '科研项目';
                this.menuList = this.$store.state.user.taskMenuList;
                this.researchId = JSON.parse(sessionStorage.getItem('CURR_RESEARCH_INFO')).subjectInfoId;
                return;
            }else if(sessionStorage.getItem('CURR_LOGIN_TYPE') == "disease") {
                //专病科研模块：分享登录
                this.title = '专病科研';
                this.menuList = diseaseRouter;
                return;
            }
            let insideData = JSON.parse(sessionStorage.getItem('insideMenuData'))
            this.fromRouter = insideData.fromRouter;
            this.title = insideData.title;
            this.menuList = insideData.menuList;
            if(insideData.researchId) {
                this.researchId = insideData.researchId;
            }
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
        //切换病种
        handleDiseaseSelect(diseaseId) {
            this.viewLoading = true;
            this.$store.commit('saveDiseaseInfo',{
                diseaseId: diseaseId,
                isAdmin: JSON.parse(sessionStorage.getItem('CURR_DISEASE_INFO')).isAdmin
            });
            this.$router.push({
                path: '/' + this.$route.meta.flag,
                query: {
                    id: diseaseId
                }
            });
            typeof(this.$refs.routercomponent2.hideReportFollowiUp)== 'function' && this.$refs.routercomponent2.hideReportFollowiUp();
            if( typeof(this.$refs.routercomponent2.initPage) == 'function') {
                this.$refs.routercomponent2.initPage();
            }else {
                this.handleLoadding(false);
            }
        },
        handleLoadding(state) {
            if(state) {
                this.viewLoading = state;
                return;
            }
            setTimeout(()=>{
                this.viewLoading = state;
            },300)
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
                background-color: #fff;
                color: #394263;
                font-weight: 600;
                font-size: 18px;
                border-top: 1px solid #f2f2f2;
                border-bottom: 1px solid #e8e8e8;
                position: absolute;
                top: 0px;
                padding: 0 20px 0 15px;
                left: 0;
                right: 0;
                z-index: 10;
            }
            & > .el-loading-mask {
                top: 60px;
            }
            .cloud-component,
            .insideContainer {
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

