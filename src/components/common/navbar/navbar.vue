<template>
    <div id="navbar">
        <el-tabs v-model="activeMenuIndex" @tab-click="toRouter">
            <el-tab-pane v-for="(item, index) in menuList" :key="index" :name="item.menuPath">
                <span slot="label"><i class="icon iconfont" :class="'icon'+item.ico"></i>{{item.menuName}}</span>
            </el-tab-pane>
        </el-tabs>
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
            menuList: [],
            activeMenuIndex: '0'
        };
    },
    computed: {
        
    },
    watch: {
        $route(to,from) {
            // console.log(this.activeMenuIndex)
            this.$nextTick(()=>{
                this.activeMenuIndex = this.$store.state.menu.activeMenuIndex;
            })
        }
    },
    created () {
        this.menuList = this.$store.state.user.menuList;
    },
    mounted () {
        this.$nextTick(()=>{
            let headerH = $("#main_header").height();
            let mainMarginTop = parseInt($('#main').css('marginTop'));
            $(document).scroll(function() {
                if($(document).scrollTop() > headerH) {
                    $("#navbar").addClass('fixed');
                    $("#main").css({'margin-top': headerH + mainMarginTop +'px'})
                }else {
                    $("#navbar").removeClass('fixed');
                    $("#main").css({'margin-top': mainMarginTop + 'px'})
                }
            });
        })
    },
    methods: {
        toRouter(data) {
            let item = this.menuList[data.index]
            if(item.children.length != 0 && item.menuPath != '/SDResearch') {
                let params = {
                    title: item.menuName,
                    menuPath: this.$route.path,
                    menuList: item.children
                }
                sessionStorage.setItem('insideMenuData',JSON.stringify(params))
                this.$router.push({
                    name: 'dataDictionary',
                    params: params
                })
                return;
            }
            this.$store.commit('setActiveMenuIndex', item.menuPath);
            this.$router.push(item.menuPath)
        }
    }
};
</script>
<style scoped lang="less">
    #navbar {
        
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
            &.is-active {
                .icon, span {
                    color: #439AFF;
                }
            }
            .icon {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-right: 5px;
            }
            span {
                color: #333;
            }
        }
    }
</style>
<style lang="less">
    #navbar {
        height: 60px;
        background: #fff;
        padding: 0 100px;
        position: relative;
        z-index: 10;
        box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08);
        .el-tabs {
            height: 100%;
            .el-tabs__nav-wrap::after {
                background-color: transparent;
            }
            .el-tabs__item {
                height: 100%;
                line-height: 60px;
                &.is-active{
                    .icon, span {
                        color: #439AFF;
                    }
                }
                .icon {
                    vertical-align: middle;
                    line-height: 60px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    margin-right: 5px;
                }
                span {
                    color: #333;
                }
            }
        }
    }
</style>
