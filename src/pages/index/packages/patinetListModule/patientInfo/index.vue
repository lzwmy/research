<template>
    <div class="patientInfo">
        <div class="component_head flex-between-center">
            <div class="left flex-start-center">
                <el-button icon='el-icon-back' type="text">返回</el-button>
                <span>张爱国</span>
                <span>性别: 男</span>
                <span>就诊年龄：80</span>
                <span>手机号：18880809090</span>
            </div>
            <div class="right flex-end-center">
                <el-button type="primary" class="weChat">微信相关</el-button>
                <el-button type="primary" class="view">全景视图</el-button>
                <el-button type="primary" class="report">添加报告</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'


export default {
    name: 'patientInfo',
    props:['dataInfo','personalInfo','reportFillData'],
    data () {
        return {

        };
    },
    watch: {
        
    },
    computed: {
    },
    created () {
    },
    mounted () {
        
    }
};
</script>
<style lang="less">
    
</style>
<style lang="less" scoped>
    .patientInfo {
        .right {
            .weChat {
                background-color: rgba(6, 206, 100, 1);
            }
            .view {
                background-color: rgba(245, 157, 0, 1);
            }
            .report {
                background-color: rgba(27, 186, 225, 1);
            }
        }
    }
</style>
