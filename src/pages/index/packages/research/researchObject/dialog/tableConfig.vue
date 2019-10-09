<template>
    <div class="tableConfig">
        <el-dialog 
            :title="dataInfo.title" 
            :visible.sync="dataInfo.visible" 
            :append-to-body="true"
            class="configDialog"
            width="800px">
            <div class="content">
                <p class="label">默认系统字段</p>
                <el-checkbox-group v-model="dataInfo.defaultChecked">
                    <el-checkbox v-for="(item,index) in defaultCheckedList" :label="item" :key="index">{{item}}</el-checkbox>
                </el-checkbox-group>
                <ul class="row">
                    <li v-for="(item,index) in dataInfo.dataList" :key="index">
                        <p class="label">{{index+1}}、{{item.crfName}}</p>
                        <el-checkbox-group v-model="item.checkedList">
                            <el-checkbox v-for="(li,index) in item.formItemRspList" v-model="li.checked" :label="li.formItemName" :key="index">{{li.formItemName}}</el-checkbox>
                        </el-checkbox-group>
                    </li>
                </ul>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="$emit('saveConfig',dataInfo)" size="mini" :disabled="dataInfo.loading">保 存</el-button>
                <el-button @click="dataInfo.visible = false;" size="mini">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'tableConfig',
    props: ['dataInfo'],
    data () {
        return {
            defaultCheckedList: ['入组序号','首次入组时间','所在中心'],
        }
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
    .label {
        color: rgba(57, 66, 99, 1);
        margin-bottom: 12px;
    }
    .el-checkbox-group {
        margin-bottom: 30px;
        .el-checkbox {
            min-width: 150px;
        }
    }
    .row {
        border-top: 1px solid #eee;
        padding: 30px 0;
    }
</style>
<style lang="less">
    .tableConfig {
        .el-dialog__body {
            padding: 20px !important;
        }
        .content {
            height: 340px;
            border: 1px solid #eee;
        }
    } 
</style>




