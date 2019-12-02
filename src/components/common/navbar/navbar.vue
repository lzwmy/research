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
            activeMenuIndex: '/'
        };
    },
    computed: {
        
    },
    watch: {
        $route(to,from) {
            this.$nextTick(()=>{
                this.activeMenuIndex = '/' + to.meta.flag;
            })
        }
    },
    created () {
        this.menuList = this.$store.state.user.menuList;
        console.log(this.menuList)
    },
    methods: {
        toRouter(data) {
            let item = this.menuList[data.index];
            //点击远程教学
            if(item.menuPath == '/education') {
                window.open('http://39.108.27.203:28081/teach-web/#/');
                this.$router.push('/')
                return;
            }
            if(item.children.length != 0 && item.menuPath != '/SDResearch' && item.menuPath != '/researchTask' ) {
                let params = {
                    title: item.menuName,
                    fromRouter: {
                        path: this.$route.path,
                        meta: this.$route.meta
                    },
                    menuList: item.children
                }
<<<<<<< HEAD
                this.$store.commit('saveInsideData',params)
                console.log(this.findFirstChildren(item.children).menuPath.slice(1))
=======
                sessionStorage.setItem('insideMenuData',JSON.stringify(params))
                console.log(this.findFirstChildren(item.children).menuPath.slice(1))
                console.log(params)
>>>>>>> b6e00540b0f315626e30a0772e7adceaff5483cc
                this.$router.push({
                    name: this.findFirstChildren(item.children).menuPath.slice(1),
                    params: params
                })
                return;
            }
            this.$router.push(item.menuPath)
        },
        findFirstChildren(arr) {
            if(!arr instanceof Array) {
                return;
            }
            let first;
            for (let i = 0; i < arr.length; i++) {
                if(arr[i].menuOrder == 1 && arr[i].children && arr[i].children.length != 0) {
                    first = this.findFirstChildren(arr[i].children);
                }else if(arr[i].menuOrder == 1 ) {
                    first = arr[i];
                }
            }
            return first;
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
            .el-tabs__nav {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .el-tabs__active-bar {
                    background-color: #439AFF;
                }
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
                padding: 0 32px;
                line-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 300ms;
                &.is-active, &:hover{
                    .icon, span {
                        color: #439AFF;
                    }
                }
                &:nth-child(2){
                    width: 120px;
                    flex-grow: 0;
                    padding-left: 0;
                    padding-right: 30px;
                    justify-content: flex-start;
                }
                &:last-child{
                    justify-content: flex-end;
                    width: 120px;
                    flex-grow: 0;
                    padding-right: 0;
                }
                .icon {
                    vertical-align: middle;
                    line-height: 60px;
                    font-size: 26px;
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
