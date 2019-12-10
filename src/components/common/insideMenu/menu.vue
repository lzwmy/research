<template>
    <div class="insideMenu" :class="$store.state.common.openMenuView?'open':'close'">
        <div class="top flex-start-center" @click="onBack" title="返回">
            <span class="icon iconfont iconfanhuishouye"></span>
            <p v-show="$store.state.common.openMenuView">{{title}}</p>
        </div>
        <div class="cont" v-if="$route.meta.belongToGroup == 'insideView'">
            <div class="userInfo flex-center-center">
                <div class="img">
                    <!-- <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="头像"> -->
                    <img src="../../../../static/img/logo/head.png" alt="头像">
                </div>
                <div>
                    <p>{{$store.state.user.account}}</p>
                    <p>主治医生</p>
                </div>
            </div>
            <div class="iconMenu flex-between-center">
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="iconfont iconxitongguanli cur_pointer"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="iconfont iconxitongguanlibeifen2 cur_pointer"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="iconfont iconxitongguanlibeifen3 cur_pointer"></span>
                </el-tooltip>
                <span @click="logout" class="iconfont iconxitongguanlibeifen1 cur_pointer"></span>
            </div>
        </div>
        <div class="ment_list">
            <el-menu 
            :default-active="defaultActive" 
            class="el-menu-vertical-demo" 
            mode="vertical" 
            ref="menu" 
            :collapse="!$store.state.common.openMenuView" 
            :unique-opened="true">
                <span v-for="(item, index) in menuList" :key="index">
                    <p class="line" v-if="authRoles(item.meta) && item.menuPath=='/organizationManagement'" style="background: rgba(151, 155, 170, 0.5); height: 1px; margin: 20px 25px 20px 25px;"></p>
                    <el-menu-item :index="item.menuPath" @click="routerLink(item)" v-if="authRoles(item.meta) && item.children && item.children.length == 0">
                        <i class="icon iconfont" :class="'icon'+item.ico"></i>
                        <span slot="title">{{item.menuName}}</span>
                    </el-menu-item>
                    <el-submenu :index="'2-'+item.menuPath" v-if="item.children && item.children.length != 0">
                        <template slot="title">
                            <!--@click="routerLink(item)"-->
                            <i  class="icon iconfont" :class="'icon'+item.ico"></i>
                            <span  slot="title">{{item.menuName}}</span>
                        </template>
                        <el-menu-item-group v-for="(li, indexli) in item.children" :key="indexli">
                            <el-menu-item :index="li.menuPath"  @click="routerLink(li)">{{li.menuName}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </span>
            </el-menu>
        </div>
    </div>
</template>
<script>
import utils from 'components/utils/index'
import otherMenu from './otherMenu'
export default {
    name: 'insideMenu',
    props: {
        title: {
            type: String,
            default: ""
        },
        menuList: {
            type: Array,
            default: ()=> []
        },
        fromRouter: {
            type: Object,
            default: () =>({})
        },
    },
    data () {
        return {
            defaultActive: '',
            diseaseId: ''
        };
    },
    watch: {
        $route(to, from) {
            this.$nextTick(()=>{
                this.defaultActive = '/' + to.meta.flag;
            })
        }
    },
    created () {
        this.diseaseId =  this.$route.query.id;
        this.defaultActive = this.$route.path;
        //专病科研模块显示组织管理页面：
        if( this.$route.meta.belongToGroup == 'insideView') {
            //管理员
            if(this.$store.state.user.diseaseInfo.roles.indexOf('1') != -1 || this.$store.state.user.diseaseInfo.isAdmin) {
                this.$emit('changeMenuList',this.menuList.concat(otherMenu.adminMenu))
            }else if (this.$store.state.user.diseaseInfo.roles.indexOf('2') != -1 && !this.$store.state.user.diseaseInfo.isAdmin) {
                //多中心管理员
                this.$emit('changeMenuList',this.menuList.concat(otherMenu.centerAdminMenu))
            }else if(localStorage.getItem('CURR_LOGIN_TYPE') == 'disease' && this.$store.state.user.diseaseInfo.roles.indexOf('1') == -1){
                //分享登录，非管理员,删除crf配置页面
                let menuList = this.menuList.filter(li=>{
                    return li.menuPath != '/crfConfig';
                })
                this.$emit('changeMenuList',menuList)
            }
            //非录入员，添加数据监察页
            // let isExist = this.$store.state.user.diseaseInfo.roles.find(li=>{return li==1 || li==2 || li==4})
            // if(isExist || this.$store.state.user.diseaseInfo.isAdmin) {
            //     this.$emit('changeMenuList',this.menuList.concat([{
            //         ico: '',
            //         menuName: '数据监察',
            //         menuCode: "0129012",
            //         menuPath: 'dataMonitoring',
            //         name: 'dataMonitoring',
            //         children: []
            //     }]))
            // }
        }     

    },
    methods: {
        //判断是否有权限 
        authRoles(meta) {
            //非科研项目模块直接为ture
            if(this.$route.meta.belongToGroup != 'researchTask') {
                return true;
            }
            let isExist = false;
            meta.roles.forEach(item=>{
                this.$store.state.user.researchInfo.roles.forEach(li=>{
                    if(item === li) {
                        isExist = true;
                    }
                })
            })
            if(isExist) {
                return true;
            }
            return false;
        },
        routerLink(item) {
            this.$router.push({
                path: item.menuPath,
                query: {id: this.$route.query.id}
            })
            //关闭菜单其它展开项
            if(item.menuLevel == 3) {
                this.menuList.forEach(item => {
                    if(item.children && item.children.length != 0) {
                        this.$refs.menu.close(item.menuCode);
                    }
                });
            }
        },
        logout () {
            var that = this;
            that.$confirm('您确定退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                utils.ssoLogout();
            }).catch((errors) => {
                console.log(errors);
            });
        },
        onBack() {
            if(localStorage.getItem('CURR_LOGIN_TYPE') == "research") {
                return;
            }
            if(!this.fromRouter.path) {
                this.$router.push({
                    path: '/'
                })
                return;
            }else if(this.fromRouter.meta.flag !== this.fromRouter.path) {
                //如果返回的是详情页，则路由到该详情页的父页面
                this.$router.push({
                    path: '/' + this.fromRouter.meta.flag
                })
                return;
            }else {
                this.$router.push({
                    path: this.fromRouter.path
                })
            }
            localStorage.removeItem('insideData');
        }
    }
};
</script>

<style lang="less" scoped>
    .insideMenu {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-x: hidden;
        transition: all 290ms;
        width: 200px;
        background-color: #394263;
        &.close {
            .cont {
                padding-left: 10px;
                height: 66px;
                overflow: hidden;
                .userInfo {
                    justify-content: flex-start;
                    img {
                        margin-right: 20px;
                    }
                }
            }
        }
        .top {
            height: 60px;
            background-color: #313854;
            color: #F8F8F8;
            cursor: pointer;
            transition: background-color 300ms;
            &:hover {
                background-color: #1bbae1;
            }
            span {
                color: #F8F8F8;
                font-size: 22px;
                margin: 20px;
            }
            p {
                font-size: 16px;
            }
        }
        .cont {
            padding: 10px 24px;
            transition: all 300ms;
            height: 110px;
            background-color: #4d5573;
            .userInfo {
                height: 50px;
                margin-bottom: 15px;
                img {
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    margin-right: 15px;
                }
                p {
                    font-size: 12px;
                    color: #f8f8f8;
                    &:first-child {
                        margin-bottom: 5px;
                        font-size: 16px;
                    }
                }
            }
            .iconMenu {
                color: #f8f8f8;
                span {
                    font-size: 20px;
                    color: #82889d;
                    &:hover {
                        color: #fff;
                    }
                }
            }
        }
        .ment_list {
            padding: 0;
            .el-menu {
                border: none;
                width: 200px;
                transition: all 250ms;
                &.el-menu--collapse {
                    width: 64px;
                    overflow: hidden;
                }
                .el-menu-item {
                    height: 48px;
                    width: 100%;
                    line-height: 48px;
                    padding-left: 15px;
                    border-width: 0px;
                    color: #fff;
                    border-left: 4px solid transparent;
                    &:hover {
                        background: rgba(0, 0, 0, 0.15);
                        i {
                            color:#fff;
                        }
                        span {
                            color: #fff;
                        }
                    }
                    &:focus {
                        background-color: transparent;
                    }
                    &.is-active {
                        background-color: #282e45;
                        border-color: #1bbae1;
                    } 
                    span {
                        padding-left: 8px;
                        color: #dedede;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>    

<style lang="less">
    body {
        .insideMenu {
            .el-menu {
                background-color: #394263;
            }
            .el-menu-item-group__title {
                display: none;
            }
            .el-menu-item {
                height: 48px;
                line-height: 48px;
                padding-left: 15px;
                border-width: 0px;
            }
            .el-submenu {
                &:hover {
                    background: rgba(0, 0, 0, 0.15);
                    i {
                        color:#fff;
                    }
                    span {
                        color: #fff;
                    }
                }
                &.is-active {
                    background: rgba(0, 0, 0, 0.15);
                }
                .el-submenu__title {
                    color: #f8f8f8;
                    text-indent: 4px;
                    line-height: 48px;
                    height:  48px;
                    transition: background-color .3s;
                    &:hover {
                        background-color: transparent;
                    }
                    & > span {
                        padding-left: 3px;
                    }
                    .el-submenu__icon-arrow {
                        color: #f8f8f8;
                    }
                    
                }
                .el-menu-item{
                    padding-left: 48px !important;
                }
                .el-menu-item.is-active{
                    background-color: #1c2030 !important;
                }
                .el-menu--inline {
                    background-color: #282e45;
                }
            }
            &.close .el-submenu.is-active  .el-submenu__title {
                border-left: 4px solid #1bbae1;
                text-indent: -1px;
            }
            &.close .el-submenu__title > span,
            &.close .el-submenu__title > .el-submenu__icon-arrow {
                opacity: 0;
                transform: scale(0);
            }
            &.open .el-submenu__title > span,
            &.open .el-submenu__title > .el-submenu__icon-arrow  {
                display: inline-block;
                transition-delay: 300ms;
            }
        }
        .el-menu--popup {
            .el-menu-item-group__title {
                display: none;
            }
            .el-menu-item {
                height: 48px;
                line-height: 48px;
                color: #666;
                padding-left: 15px;
                border-width: 0px;
                &.is-active {
                    color: #1bbae1;
                }
            }
        }
    }
</style>
