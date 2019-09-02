<template>
    <div class="">
        <!-- 搜索区域 -->
        <div class="cloud-search flex-end-center">
            <el-button icon="el-icon-plus" type="primary">创建课题</el-button>
        </div>
        <ul class="flex-start-center">
            <li v-for="(item, index) in 8" :key="index">
                <div class="card_body"></div>
                <div class="card_foot"></div>
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
            margin: 20px 20px 0 0;
            &:nth-child(4n) {
                margin-right: 0;
            }
            .card_body {
                height: 154px;
            }
            .card_foot {
                height: 74px;
                background-color: #fff;
            }
        }
    }
</style>