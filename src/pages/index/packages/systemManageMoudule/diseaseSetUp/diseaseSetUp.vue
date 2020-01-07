<template>
    <div class="cloud-component diseaseSetUp">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class=" cur_pointer head_content flex-start-center">
                <el-button type="primary" @click="showDialog('新建')" icon="el-icon-plus">新建</el-button>
            </div>
        </div>
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-5):(routerViewHeight*1)"
                    :data="dataList.content" v-loading="loading" ref="refTable" fit>
                    <el-table-column type="index" label='序号' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label='病种名称' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="remark" label='备注' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label='创建时间' min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column label='操作' width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showDialog('编辑',scope.row)"><i class="iconfont iconbianji"></i></el-button>
                            <el-button type="text" @click="onDelete(scope.row)"><i class="iconfont iconshanchu del"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </echarts-contain>
        </div>

        <el-dialog 
            :title="dialogForm.title" 
            :append-to-body="true"
            @close="closeDialog"
            :visible.sync="dialogForm.visible" 
            width="700px">
            <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogFormRules" label-width="100px" @submit.native.prevent v-loading="dialogForm.loading" label-position="left">
                <el-form-item label="病种名称：" prop="name">
                    <el-input v-model.trim="dialogForm.name" placeholder="请输入病种名称" :maxlength="20" :disabled="dialogForm.title=='编辑'"></el-input>
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
    name: 'diseaseSetUp',
    mixins: [mixins],
    data () {
        return {
            dataList: {
                content: []
            },
            dialogForm: {
                loading: false,
                visible: false,
                title: '',
                name:'',
                id:'',
                note:''
            },
            loading: false,
            dialogFormRules: {
                name: [{required: true, message: '请输入病种名称', trigger: 'change'}],
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
                let res = await that.$http.diseaseSetGetDataList();
                if (res.code == '0') {
                    that.dataList.content = res.data;
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
        showDialog(title,row) {
            if(title == '新建') {
                this.dialogForm = {
                    loading: false,
                    visible: true,
                    title: '新建',
                    name:'',
                    id:'',
                    note:''
                }
            }else {
            console.log(row)

                this.dialogForm = {
                    loading: false,
                    visible: true,
                    title: '编辑',
                    name: row.name,
                    id: row.id,
                    note: row.remark
                }
            }
        },
        onDelete(row) {
            let that = this;
            that.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let formData = {
                    diseaseId: row.id,
                };
                try {
                    let data = await that.$http.diseaseSetDelete(formData);
                    if (data.code == '0') {
                        this.$mes('success',  data.message || '删除成功');
                        that.getDataList();
                    }
                }catch (error) {}
            }).catch((error) => {});
        },
        saveDialog() { 
            this.$refs['dialogFormRef'].validate(async(valid) => {
                if (valid) {
                    this.dialogForm.loading = true;
                    try {
                        let res;
                        if(this.dialogForm.title == '新建') {
                            res = await this.$http.diseaseSetCreate({
                                "name": this.dialogForm.name,
                                "remark": this.dialogForm.note,
                                "logo": '',
                                "status": 0
                            });
                        }else {
                            res = await this.$http.diseaseSetEdit({
                                "id": this.dialogForm.id,
                                "name": this.dialogForm.name,
                                "remark": this.dialogForm.note,
                                "logo": '',  
                            });
                        }
                        if (res.code == '0') {
                            this.$mes('success', this.dialogForm.title +'成功!');
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
                title: '',
                name:'',
                id:'',
                note:''
            }
        }
    }
};
</script>

<style lang="less">
    
</style>


