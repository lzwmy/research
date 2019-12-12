<template>
    <div class="tableConfig">
        <el-dialog 
            :title="dataInfo.title" 
            :visible.sync="dataInfo.visible" 
            :append-to-body="true"
            class="configDialog"
            width="1000px">
            <div class="content">
                <p class="label">默认系统字段</p>
                <el-checkbox-group v-model="defaultChecked">
                    <el-checkbox v-for="(item,index) in defaultCheckedList" :label="item" :key="index">{{item}}</el-checkbox>
                </el-checkbox-group>
                <br/>
                <br/>
                <ul class="row">
                    <li v-for="(item,index) in dataInfo.dataList" :key="index">
                        <p class="label">{{index+1}}、{{item.crfName}}</p>
                        <el-checkbox 
                            v-for="(li,index) in item.formItemRspList" 
                            @change="checkboxChange(li)"  
                            v-model="li.checked" 
                            :label="li.formItemName"
                            :key="index">{{li.formItemName}}
                        </el-checkbox>
                        <br/>
                        <br/>
                    </li>
                </ul>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="save" size="mini" :disabled="dataInfo.loading">保 存</el-button>
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
            defaultCheckedList: ['入组序号','首次录入时间','所在中心'],
            defaultChecked: ['入组序号','首次录入时间','所在中心'],
            previewFormItem:[]
        }
    },
    watch: {
        'dataInfo.visible': function(newVal) {
            if(newVal) {
                this.initFomeItem();
            }
        }
    },
    created() {
    },
    methods: {
        //回显crf表单列表下的已选指标
        async handlePreviewFormItem() {
            let params = {
                subjectInfoId: this.$store.state.user.researchInfo.subjectInfoId,
            }
            try {
                let res = await this.$http.researchObjectTablePreviewFormItem(params);
                if (res.code == '0') {
                    let tempArr = [];
                    this.previewFormItem = res.data;
                    res.data.forEach(item =>{
                        if(item.crfId){
                            this.dataInfo.dataList.forEach(li => {
                                li.formItemRspList.forEach(n => {
                                    if(n.controlName == item.path && item.crfId == li.crfId){
                                        n.checked = true;
                                    }
                                });
                            });
                        }else {
                            this.defaultChecked.forEach(li=>{
                                if(li == item.path) {
                                    tempArr.push(li)
                                }
                            })
                        }
                    })
                    this.defaultChecked = tempArr;
                    this.loading = false;
                }
            } catch (err) {
                console.log(err)
                this.loading = false;
            }
        },
        initFomeItem() {
            this.dataInfo.dataList.forEach(li => {
                li.formItemRspList.forEach(n => {
                    n.checked = false;
                });
            });
            this.handlePreviewFormItem();
        },
        //多选框改变
        checkboxChange(n) {
            let selectArr = [];
            //获取已选指标
            this.dataInfo.dataList.forEach(item=>{
                item.formItemRspList.forEach(li=>{
                    if(li.checked) {
                        selectArr.push(li)
                    }
                })
            })
            if(selectArr.length > 10) {
                n.checked = false;
                this.$mes('info','最多选择10项')
                return;
            }
        },

        async save() {
            let list = [];
            this.defaultChecked.forEach(li=>{
                let obj = {
                    formItemName: this.$store.state.user.researchInfo.subjectInfoId,
                    path: li,
                    crfName: 'default'
                } 
                list.push(obj)
            })
            this.dataInfo.dataList.forEach(item=>{
                item.formItemRspList.forEach(li=>{
                    if(li.checked) {
                        let obj = {
                            formItemName: li.formItemName,
                            jsonData: li.jsonData,
                            path: li.controlName,
                            crfName: item.crfName,
                            crfId: item.crfId
                        }
                        list.push(obj)
                    }
                })
            })
            let params = {
                subjectInfoId: this.$store.state.user.researchInfo.subjectInfoId,
                list: list
            }
            try {
                let res = await this.$http.researchObjectPreviewTableEditFormItem(params);
                if (res.code == '0') {
                    this.$emit('saveConfig');
                    this.dataInfo.visible = false;
                }
            } catch (err) {
                console.log(err)
                this.loading = false;
            }
        },
    }
};
</script>

<style lang="less" scoped>
    .label {
        color: rgba(57, 66, 99, 1);
        margin-bottom: 12px;
    }
    .el-checkbox {
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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




