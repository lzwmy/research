<template>
    <div class="cloud-component systemSetup">
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-5):(routerViewHeight*1)"
                    :data="dataList.content" v-loading="loading" ref="refTable" fit>
                    <el-table-column prop="name" label='名称'></el-table-column>
                    <el-table-column prop="key" label='Key'></el-table-column>
                    <el-table-column prop="value" label='值'></el-table-column>
                    <el-table-column prop="remark" label='备注' min-width="180"></el-table-column>
                    <el-table-column label='操作' width="120">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showDialog(scope.row)"><i class="iconfont iconbianji"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </echarts-contain>
        </div>

        <el-dialog 
            title="修改设置" 
            :append-to-body="true"
            @close="closeDialog"
            :visible.sync="dialogForm.visible" 
            width="45%">
            <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogFormRules" label-width="110px" @submit.native.prevent v-loading="dialogForm.loading" label-position="left">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model.trim="dialogForm.name" placeholder="请输入名称" :maxlength="20" disabled></el-input>
                </el-form-item>
                <el-form-item label="Key：" prop="key">
                    <el-input v-model.trim="dialogForm.key" placeholder="请输key" :maxlength="20" disabled></el-input>
                </el-form-item>
                <el-form-item label="值：" prop="value">
                    <el-input v-model.trim="dialogForm.value" placeholder="请输入值" :maxlength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model.trim="dialogForm.note" type="textarea" rows="3" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="saveDialog" :loading="dialogForm.loading">保 存</el-button>
                <el-button @click="closeDialog">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import mixins from 'components/mixins';
import utils from 'components/utils/index';


export default {
    name: 'systemSetup',
    mixins: [mixins],
    data () {
        return {
            dataList: {
                content: []
            },
            dialogForm: {
                loading: false,
                visible: false,
                name:'',
                id:'',
                key: '',
                value: '',
                note:''
            },
            loading: false,
            dialogFormRules: {
                name: [{required: true, message: '请输入name', trigger: 'change'}],
                key: [{required: true, message: '请输入Key', trigger: 'change'}],
                value: [{required: true, message: '请输入值', trigger: 'change'}],
            },
        };
    },
    created () {
        this.getDataList();
    },
    components: {
        echartsContain,
    },
    methods: {
        async getDataList () {
            let that = this;
            that.loading = true;
            try {
                let res = await that.$http.systemSetupGetDataList();
                if (res.code == '0') {
                    that.dataList.content = res.data;
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
        showDialog(row) {
            console.log(row)
            this.dialogForm = {
                loading: false,
                visible: true,
                name: row.name,
                id: row.id,
                key: row.key,
                value: row.value,
                note: row.remark
            }
        },
        saveDialog() { 
            this.$refs['dialogFormRef'].validate(async(valid) => {
                if (valid) {
                    this.dialogForm.loading = true;
                    try {
                        let res = await this.$http.systemSetupSave({
                            "id": this.dialogForm.id,
                            "remark": this.dialogForm.note,
                            "value": this.dialogForm.value
                        });
                        if (res.code == '0') {
                            this.$mes('success', '保存成功!');
                            this.orgCode = res.data
                            this.dialogForm.visible = false;
                            this.getDataList();
                        }
                        this.dialogForm.loading = false;
                    } catch (err) {
                        this.dialogForm.visible = false;
                        this.dialogForm.loading = false;
                        console.log(err)
                    }
                } else {
                    return false;
                }
            });
        },
        closeDialog() {
            this.$refs.dialogFormRef.resetFields();
            this.dialogForm = {
                loading: false,
                visible: false,
                name:'',
                id:'',
                key: '',
                value: '',
                note:''
            }
        }
    }
};
</script>

<style lang="less">
    
</style>


