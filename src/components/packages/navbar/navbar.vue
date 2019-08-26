<template>
    <div id="navbar">
        <el-menu default-active="0" class="el-menu-demo flex-start-center" mode="horizontal">
            <el-menu-item :index="String(index)" v-for="(item, index) in $store.state.user.menuList" :key="index" @click="toRouter(item)">
                <i class="el-icon-location"></i>
                <span>{{item.menuName}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: 'navbar',
    components: {
    },
    data () {
        return {
            loading: true,
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
    watch: {
        
    },
    created () {
        
    },
    mounted () {
        this.$nextTick(()=>{
            let headerH = $("#main_header").height();
            $(document).scroll(function() {
                if($(document).scrollTop() > headerH) {
                    $("#navbar").addClass('fixed');
                    $("#main").css({'margin-top':headerH+'px'})
                }else {
                    $("#navbar").removeClass('fixed');
                    $("#main").css({'margin-top': '0px'})
                }
            });
        })
        console.log(this.$store.state.user.menuList)
    },
    activated () {
    },
    methods: {
        toRouter(item) {
            this.$router.push(item.menuPath)
        }
    }
};
</script>
<style scoped lang="less">
    #navbar {
        height: 60px;
        background: #fff;
        padding: 0 100px;
        position: relative;
        z-index: 10;
        box-shadow: 0px 0px 5px #ccc;
        &.fixed {
            position: fixed;
            top:0;
            left:0;
            right: 0;
            z-index: 99;
        }
        .el-menu-item{
            padding: 0;
            &:nth-child(n+2) {
                margin-left: 50px;
            }
        }
    }
</style>
