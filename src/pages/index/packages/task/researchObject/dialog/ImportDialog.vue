<template>
    <div class="importDialog">
        <el-dialog 
            :title="dataInfo.title" 
            :visible.sync="dataInfo.visible" 
            :append-to-body="true"
            class="importDialog"
            width="800px">
            <div class="content flex-start-start">
                <div class="left">
                    <p class="label">选择队列</p>
                    <ul>
                        <li v-for="(item,index) in 10" :key="index" class="flex-between-center" :class="active==index+1?'active':''" @click="select(index+1)">
                            <p>CRF({{item}})</p>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <p class="label">共1个表单</p>
                    <ul>
                        <li v-for="(item,index) in 10" :key="index" class="flex-between-center" :class="active==index+1?'active':''">
                            <p>CRF({{item}})</p>
                            <div class="btn_group">
                                <el-button icon="icon iconfont iconxiazaimoban">下载excel模版</el-button>
                                <el-button icon="icon iconfont icondaochu" class="upload">上传数据</el-button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'importDialog',
    props: ['dataInfo'],
    data () {
        return {
            active: 1,
        }
    },
    watch: {
        
    },
    components: {
        
    },
    methods: {
        select(val) {
            this.active = val;
        }
    }
};
</script>

<style lang="less">
    .importDialog {
        .el-dialog__body {
            padding: 20px !important;
        }
        .content {
            height: 340px;
            border: 1px solid #eee;
            .label {
                color: #9CA0B1;
                line-height: 36px;
                padding: 0 10px;
            }
            .left {
                width: 180px;
                height: 100%;
                overflow: auto;
                border-right: 1px solid #eee;
                li {
                    font-size: 14px;
                    color: rgba(57, 66, 99, 1);
                    line-height: 40px;
                    padding: 0 18px;
                    cursor: pointer;
                    &.active {
                        background:rgba(229,235,236,0.5);
                    }
                }
            }
            .right {
                height: 100%;
                flex: 1;
                overflow: auto;
                li {
                    font-size: 14px;
                    color: rgba(57, 66, 99, 1);
                    line-height: 48px;
                    border-top: 1px solid #eee;
                    padding: 0 18px;
                    .upload {
                        color: #1bbae1;
                        border-color: #1bbae1;
                    }
                }
            }
        }
    } 
</style>




