<template>
    <div class="cloud-component operationRecord">
        <div class="wrap">
            <el-date-picker
                v-model="time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <div class="content">
                <ul>
                    <li v-for="(item,index) in record" :key="index" class="flex-start-center">
                        <span>{{item.date}}</span>
                        <p>{{item.describe}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'operationRecord',
    data () {
        return {
            time: [],
            record: [
                {date:'2019-09-24 11:12:32', describe: '张爱国 登陆系统'},
                {date:'2019-09-25 18:50:54', describe: '张爱国 执行了 随访任务 张** 阶段2 状态 完成'},
                {date:'2019-09-26 19:23:33', describe: '张爱国 执行了 随访任务 张** 阶段2 状态 完成'},
                {date:'2019-09-27 11:12:32', describe: '张爱国 录入了 研究对象 张**'},
                {date:'2019-09-28 12:12:32', describe: '张爱国 添加用户 香港大学深圳医院 王爱民'},
                {date:'2019-09-29 10:12:32', describe: '张爱国 导入数据 分组1 CFR1'},
                {date:'2019-09-30 11:12:32', describe: '张爱国 导入数据 分组1 CFR1 CFR2 CFR3'},
                {date:'2019-10-02 09:12:32', describe: '张爱国 执行了 随访任务 张** 阶段2 状态 完成'}
            ]
        }
    },
    watch: {
        
    },
    components: {
        
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
    .operationRecord .wrap {
        background: #fff;
        height: 100%;
        padding: 15px;
        position: relative;
        .content {
            position: absolute;
            top: 60px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            overflow-y: auto;
            li {
                margin-bottom: 26px;  
                font-size: 14px;
                color: #394263;
                p {
                    margin-left: 20px;
                }
            }
        }
    }
</style>




