<template>
    <div class="">
        <!-- 搜索区域 -->
        <div class="cloud-search flex-end-center">
            <el-button icon="el-icon-plus" type="primary">创建课题</el-button>
        </div>
        <ul class="flex-start-center">
            <li v-for="(item, index) in 8" :key="index">
                <div class="card_body flex-center-center">
                    <span class="box flex-center-center">
                        <i class="icon iconfont iconzujian7"></i>
                    </span>
                </div>
                <div class="card_foot">
                    <div class="t flex-between-center">
                        <p class="title">银屑病因组合</p>
                        <p><i class="icon iconfont iconzujian8"></i>25</p>
                    </div>
                    <div class="info flex-between-center">
                        <p><i class="icon iconfont iconzujian6"></i>张病人</p>
                        <p>2019-03-23</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'researchTask',
    data () {
        return {
            
        };
    },
    watch: {
        
    },
    mounted () {
        
    },
    methods: {
        
    }
}
</script>
<style lang="less" scoped>
    ul {
        flex-wrap: wrap;
        li {
            box-shadow:0px 4px 10px rgba(0,0,0,0.16);
            width: 285px;
            background: #FBFBFB;
            margin: 20px 20px 0 0;
            transition: all 300ms;
            cursor: pointer;
            &:nth-child(4n) {
                margin-right: 0;
            }
            &:hover {
                background-color: rgba(0, 0, 0, .05);
                box-shadow:0px 4px 10px rgba(0,0,0,0.3);
                transform: translateY(-5px);
                .t .title {
                    color: #3A579D !important;
                    font-weight: bold;
                }
                .card_body {
                    .box {
                        background-color: rgba(0, 0, 0, .08);
                    }
                }
            }
            .card_body {
                height: 154px;
                background-image: url('./images/researchTask_bg.png');
                background-size: 100% 100%; 
                .box {
                    transition: all 300ms;
                    width: 58px;
                    height: 58px;
                    border-radius: 8px;
                    background: #fff;
                    box-shadow:0px 4px 10px rgba(0,0,0,0.16);
                    .icon {
                        font-size: 32px;
                        color: #9BABB8;
                    }
                }
            }
            .card_foot {
                height: 74px;
                padding: 0 20px 5px;
                color: 12px;
                color: #9BABB8;
                background-color: #fff;
                .icon {
                    padding-right: 6px;
                    color: rgba(155, 171, 184, 1);
                }
                .t {
                    line-height: 35px;
                    .title {
                        font-size: 14px;
                        color: #333;
                    }
                }
                .info {
                    line-height: 24px;
                }
            }
        }
    }
</style>