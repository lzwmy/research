<template>
    <div class="insideMenu" :class="openMenuView?'open':'close'">
        <div class="top flex-start-center" @click="onBack">
            <span class="icon iconfont iconfanhuishouye"></span>
            <p v-show="openMenuView">{{title}}</p>
        </div>
        <div class="cont" v-if="$route.meta.belongToGroup == 'insideView'">
            <div class="userInfo flex-center-center">
                <div class="img">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="头像">
                </div>
                <div>
                    <p>张医生</p>
                    <p>主治医生</p>
                </div>
            </div>
            <div class="iconMenu flex-between-center">
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="el-icon-user-solid cur_pointer"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="el-icon-message cur_pointer"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="el-icon-s-tools cur_pointer"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="该功能暂末开通" placement="top-start">
                    <span class="el-icon-switch-button cur_pointer"></span>
                </el-tooltip>
            </div>
        </div>
        <div class="ment_list">
            <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" mode="vertical" ref="menu" :collapse="!openMenuView" :unique-opened="true">
                <span v-for="(item, index) in menuList" :key="index">
                    <el-menu-item :index="item.menuPath" @click="routerLink(item)" v-if="item.children.length == 0">
                        <i class="icon iconfont" :class="'icon'+item.ico"></i>
                        <span slot="title">{{item.menuName}}</span>
                    </el-menu-item>
                    <el-submenu :index="item.menuCode" v-if="item.children.length != 0">
                        <template slot="title">
                            <i class="icon iconfont" :class="'icon'+item.ico"></i>
                            <span slot="title">{{item.menuName}}</span>
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
export default {
    name: 'insideMenu',
    props: {
        openMenuView: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ""
        },
        menuList: {
            type: Array,
            default: ()=> []
        },
        menuPath: {
            type: String,
            default: "/index"
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
    },
    methods: {
        routerLink(item) {
            this.$router.push({
                path: item.menuPath,
                query: {id: this.diseaseId}
            })
            //关闭菜单其它展开项
            if(item.menuLevel == 3) {
                this.menuList.forEach(item => {
                    if(item.children.length != 0) {
                        this.$refs.menu.close(item.menuCode);
                    }
                });
            }
        },
        onBack() {
            this.$router.push({
                path: this.menuPath
            })
            sessionStorage.removeItem('insideData');
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
            .el-submenu__title span{
                display: none;
            }
        }
        .top {
            height: 60px;
            background-color: #313854;
            color: #F8F8F8;
            cursor: pointer;
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
                    margin-right: 20px;
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
                transition: all 200ms;
                .el-submenu {
                    border-left: 4px solid transparent;
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
                    line-height: 48px;
                    height:  48px;
                    &:hover {
                        background-color: transparent;
                    }
                    .el-submenu__icon-arrow {
                        color: #f8f8f8;
                    }
                }
                .el-menu-item.is-active{
                    background-color: #1c2030 !important;
                }
                .el-menu--inline {
                    background-color: #282e45;
                }
            }
            &.close .el-submenu__icon-arrow {
                display: none;
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
                    color: #409EFF;
                }
            }
        }
    }
</style>
