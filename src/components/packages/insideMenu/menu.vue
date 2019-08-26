<template>
    <div class="menu">
        <div class="top flex-start-center">
            <router-link to="/SDResearch">
                <el-button type="text">
                    <span class="el-icon-arrow-left"></span>
                </el-button>
            </router-link>
            <p>专病</p>
        </div>
        <div class="cont">
            <div class="userInfo flex-start-center">
                <div class="img">
                    <img src="http://via.placeholder.com/90x90" alt="头像">
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
            <el-menu default-active="0" class="el-menu-vertical-demo" mode="horizontal">
                <el-menu-item :index="String(index)" v-for="(item, index) in menuList" :key="index">
                    <i class="el-icon-location"></i>
                    <span>{{item.title}}</span>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>
<script>


export default {
    name: 'insideMenu',
    data () {
        return {
            openMenuView: true,
            menuList:[
                {
                    path: '/allCases',
                    title: '全部病例'
                },
                {
                    path: '/SDResearch',
                    title: '专病科研'
                },
                {
                    path: '/modelManage',
                    title: '科研建模'
                },
                {
                    path: '/researchReportManage',
                    title: '报告例表'
                },
                {
                    path: '/patientFollowUp',
                    title: '患者随访'
                },
                {
                    path: '/fullTextSearch',
                    title: '全文检索'
                },
                {
                    path: '/staticInfo',
                    title: '统计信息'
                },
                {
                    path: '/crfConfig',
                    title: 'CRF配置'
                },
                {
                    path: '/eventPlan',
                    title: '事件计划'
                }
            ]
        };
    },
    computed: {
    },
    created () {
    },
    mounted () 
    {
    },
    watch: {
        
    },
    methods: {
    
    }
};
</script>

<style lang="less" scoped>
    .menu {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-x: hidden;
        transition: all 290ms;
        width: 200px;
        .top {
            height: 70px;
            background-color: #5ccdde;
            color: #fff;
            padding: 0 10px;
            .el-button span {
                color: #fff;
                font-size: 24px;
            }
        }
        .cont {
            padding: 10px 20px;
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
                    font-size: 14px;
                    color: #888;
                    &:first-child {
                        margin-bottom: 5px;
                    }
                }
            }
            .iconMenu {
                color: #5ccdde;
                span {
                    font-size: 24px;
                }
            }
        }
        .ment_list {
            padding: 5px 0;
            .el-menu {
                border: none;
                .el-menu-item {
                    height: 40px;
                    width: 100%;
                    line-height: 40px;
                    padding-left: 15px;
                    border-width: 0px;
                    &.is-active {
                        border-right: 2px solid #409EFF;
                        background-color: #ddd;
                    }
                }
            }
        }
    }
</style>    
