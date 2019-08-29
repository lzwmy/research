<template>
    <div class="insideMenu" :class="openMenuView?'open':'close'">
        <div class="top flex-start-center" @click="onBack">
            <el-button type="text">
                <span class="el-icon-s-home"></span>
            </el-button>
            <p v-show="openMenuView">{{title}}</p>
        </div>
        <div class="cont">
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
                <span class="el-icon-monitor"></span>
                <span class="el-icon-files"></span>
                <span class="el-icon-chat-line-square"></span>
                <span class="el-icon-message"></span>
            </div>
        </div>
        <div class="ment_list">
            <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" mode="vertical" :collapse="!openMenuView" :default-openeds="['1']">
                <span v-for="(item, index) in menuList" :key="index">
                    <el-menu-item :index="String(index+1)" @click="routerLink(item)" v-if="item.children.length == 0">
                        <i class="icon iconfont" :class="'icon'+item.ico"></i>
                        <span slot="title">{{item.menuName}}</span>
                    </el-menu-item>
                    <el-submenu :index="String(index+1)" v-if="item.children.length != 0">
                        <template slot="title">
                            <i class="icon iconfont" :class="'icon'+item.ico"></i>
                            <span slot="title">{{item.menuName}}</span>
                        </template>
                        <el-menu-item-group v-for="(li, indexli) in item.children" :key="indexli">
                            <el-menu-item :index="(index+1) + '-' + (indexli+1)"  @click="routerLink(li)">{{li.menuName}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </span>
            </el-menu>
        </div>
    </div>
</template>
<script>


export default {
    name: 'insideMenu',
    props: {
        openMenuView: {
            type: Boolean,
            default: true
        },
        activeMenuIndex: {
            type: String,
            default: "0"
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
            default: ""
        },
    },
    data () {
        return {
            defaultActive: '1'
        };
    },
    watch: {
    },
    created () {
        if(this.menuList[0] && this.menuList[0].children && this.menuList[0].children.length == 0) {
            this.defaultActive = '1';
        }else {
            this.defaultActive = '1-1';
        }
    },
    mounted () {
    },
    watch: {
        
    },
    methods: {
        routerLink(item) {
            this.$router.push(item.menuPath)
        },
        onBack() {
            this.$router.replace({
                name: this.menuPath.slice(1),
                params:{
                    activeMenuIndex: this.activeMenuIndex
                }
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
        background-color: #4D5474;
        &.close {
            .cont {
                padding-left: 10px;
                height: 60px;
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
            background-color: #313755;
            color: #F8F8F8;
            cursor: pointer;
            .el-button span {
                color: #F8F8F8;
                font-size: 22px;
            }
            p {
                font-size: 16px;
            }
        }
        .cont {
            padding: 10px 20px;
            transition: all 300ms;
            height: 110px;
            .userInfo {
                height: 50px;
                margin-bottom: 15px;
                img {
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                p {
                    font-size: 14px;
                    color: #f8f8f8;
                    &:first-child {
                        margin-bottom: 5px;
                    }
                }
            }
            .iconMenu {
                color: #f8f8f8;
                span {
                    font-size: 24px;
                }
            }
        }
        .ment_list {
            padding: 5px 0;
            .el-menu {
                border: none;
                transition: all 200ms;
                .el-menu-item {
                    height: 48px;
                    width: 100%;
                    line-height: 48px;
                    padding-left: 15px;
                    border-width: 0px;
                    color: #fff;
                    &:hover {
                        background-color: #090E40;
                    }
                    &.is-active {
                        background-color: #090E40;
                    }
                    span {
                        color: #f8f8f8;
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
                background-color: #4D5474;
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
            .el-submenu__title {
                color: #f8f8f8;
                &:hover {
                    background-color: transparent;
                }
                .el-submenu__icon-arrow {
                    color: #f8f8f8;
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
                height: 48x;
                line-height: 48px;
                padding-left: 15px;
                border-width: 0px;
            }
        }
    }
</style>
