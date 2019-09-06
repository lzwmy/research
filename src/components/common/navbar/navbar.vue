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
            activeMenuIndex: '/index'
        };
    },
    computed: {
        
    },
    watch: {
        $route(to,from) {
            this.$nextTick(()=>{
                this.activeMenuIndex = this.$route.path;
            })
        }
    },
    created () {
        this.menuList = this.$store.state.user.menuList;
    },
    mounted () {
        console.log("完成")
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
    }
</style>
<style lang="less">
    #navbar {
        height: 60px;
        background: #fff;
        position: relative;
        z-index: 10;
        box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.08);
        .el-tabs {
            height: 100%;
            margin: 0 auto;
            width: 1200px;
            .el-tabs__nav {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            .el-tabs__nav-wrap {
                padding: 0px;
                &::after {
                    background-color: transparent;
                }
                .el-tabs__nav-prev {
                    display: none;
                }
            }
            .el-tabs__nav-scroll {
                width: 100%;
            }
            .el-tabs__item {
                height: 100%;
                flex: 1;
                padding: 0;
                line-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                &.is-active{
                    .icon, span {
                        color: #439AFF;
                    }
                }
                &:nth-child(2){
                    width: 120px;
                    flex-grow: 0;
                    padding-right: 30px;
                    justify-content: flex-start;
                }
                &:last-child{
                    justify-content: flex-end;
                    width: 120px;
                    flex-grow: 0;
                    padding-left: 30px;
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
            .el-tabs__nav-next, .el-tabs__nav-prev {
                line-height: 60px;
                font-size: 16px;
            }
        }
    }
</style>
