<template>
    <div class="inside_cloud-container">
        <insideHeader @diseaseSelect="handleDiseaseSelect"></insideHeader>
        <insideMenu :title="title" @changeLoadding="handleLoadding" :menuList="menuList" :fromRouter="fromRouter" ></insideMenu>
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
import utils from 'components/utils/index'
import otherMenu from '../insideMenu/otherMenu'
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
    watch: {
        
    },
    created () {
        this.getMenuList();
        //进入专病科研模块
        if( this.$route.meta.belongToGroup == 'insideView') {
            //如果为管理员,拥有所有页面权限 
            if(this.$store.state.user.diseaseInfo.isAdmin) {
                if(localStorage.getItem('CURR_LOGIN_TYPE') != 'null') {
                    this.menuList = this.menuList.concat(otherMenu)
                }else {
                    //主平台进入，删除本地配置的crfConfig页
                    let arr = otherMenu.filter(li=>{
                        return li.menuPath !=  '/crfConfig';
                    })
                    this.menuList = this.menuList.concat(arr)
                }
            }else {
                //根据角色匹配菜单项
                let tempMenu = utils.arrRermoveEmpty(this.deepCopy(otherMenu))
                tempMenu.forEach(li=>{
                    li.children = utils.arrRermoveEmpty(li.children)
                })
                this.menuList = this.menuList.concat(tempMenu);
            }
            //菜单排序
            this.handleMenuSort();
        }    
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
        //菜单排序
        handleMenuSort() {
            this.menuList.forEach(ele => {
                if(ele.children && ele.children.length != 0) {
                    ele.children.sort((a,b) => {return a.menuOrder - b.menuOrder })
                }
            });
            this.menuList.sort((a,b) => {return a.menuOrder - b.menuOrder})
        },
        deepCopy(o) {
            if (o instanceof Array) {
                var n = [];
                for (var i = 0; i < o.length; ++i) {
                    n[i] = this.deepCopy(o[i]); 
                } 
                return n; 
            }else if  (o instanceof Object) {
                if(!utils.arrayExistAttr(o.roles,this.$store.state.user.diseaseInfo.roles,null,false)) {  
                // if(!utils.arrayExistAttr(o.roles,[2],null,false)) {  
                    return null;
                }
                var n = {}; 
                for (var i in o) {
                    n[i] = this.deepCopy(o[i]); 
                } 
                return n; 
            } else { 
                return o; 
            } 
        },
        initView() {
            this.handlePageHeight();
            $('.inside_cloud-container').css({'min-height':$('body').height()+'px'})
        },
        getMenuList() {
            //如果从科研项目入口录入
            if(localStorage.getItem('CURR_LOGIN_TYPE') == "research") {
                this.fromRouter = {};
                this.title = '科研项目';
                this.menuList = this.$store.state.user.taskMenuList;
                this.researchId = this.$store.state.user.researchInfo.subjectInfoId
                return;
            }else if(localStorage.getItem('CURR_LOGIN_TYPE') == "disease") {
                //专病科研模块：分享登录
                this.title = '专病科研';
                this.menuList = diseaseRouter;
                return;
            }

            let insideData = this.$store.state.insideData.insideData;
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
        handleDiseaseSelect(data) {
            this.viewLoading = true;
            this.$store.commit('saveDiseaseInfo',
                Object.assign(utils.deepCopy(this.$store.state.user.diseaseInfo),{
                    diseaseId: data.id,
                    diseaseName: data.name
                })
            );
            
            this.$router.push({
                path: '/' + this.$route.meta.flag,
                query: {
                    id: data.id
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

