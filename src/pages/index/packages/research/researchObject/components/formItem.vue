<template>
    <div class="">
        <el-popover trigger="click" popper-class="popover_condition" v-model="popoverFomeItemVisible">
            <el-button slot="reference">已选 {{selectFormItem.length}} 项<span class="el-icon-caret-bottom"></span></el-button>
            <div class="box">
                <div class="head flex-between-center">
                    <p>选择搜索</p><span class="el-icon-close cur_pointer" @click="popoverFomeItemVisible = false"></span>
                </div>
                <div class="radio_group">
                    <el-radio v-model="form.radio" label="0">精准搜索</el-radio>
                    <el-radio v-model="form.radio" label="1">模糊搜索</el-radio>
                </div>
                <div class="content flex-start-start" v-loading="loading">
                    <div class="left">
                        <p class="label">请选择</p>
                        <ul>
                            <li v-for="(item,index) in allCrfForm" :key="index" class="flex-between-center" :class="activeCrf == item.crfId?'active':''" @click="selectCrf(item.crfId)">
                                <div class="crfName flex-between-center">
                                    {{item.crfName}}
                                    <div class="icon">
                                        <span class="count">{{item.checkedList.length}}</span>
                                        <i class="el-icon-arrow-right"></i>   
                                    </div>
                                </div>
                                <div class="cont" v-show="activeCrf == item.crfId">
                                    <p class="label">选择搜索字段，至少选择1项，最多{{maxItem}}项</p>
                                    <el-checkbox 
                                        v-for="(li,index) in item.formItemRspList" 
                                        @change="checkboxChange(li)"  
                                        v-model="li.checked" 
                                        :label="li.path"
                                        class="flex-start-center" 
                                        :key="index">{{li.formItemName}}
                                    </el-checkbox>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="footer flex-end-center">
                    <p>最多展示500个指标</p>
                    <el-button type="primary"  @click="handleFormItem">保 存</el-button>
                    <el-button @click="popoverFomeItemVisible = false">取 消</el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'searchCom',
    props:['allCrfForm','confingData','form'],
    data () {
        return {
            loading: false,
            popoverFomeItemVisible: false,
            //已选指标数组
            selectFormItem: [],
            //回显指标
            previewFormItem:[],
            activeCrf: ''
        }
    },
    created() {
        this.getAllFormItem()
        .then(()=>{
            this.handlePreviewFormItem()
        })
    },
    methods: {
        //crf表单列表和列表下的所有指标
        async getAllFormItem() {
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.researchObjectAllFormItem(params);
                if (res.code == '0') {
                    res.data.forEach(item=>{
                        item.checkedList = [];
                        item.formItemRspList.forEach(li=>{
                            li.checked = false;
                        })
                    })
                    // this.allCrfForm = res.data;
                    this.$emit('sendAllCrfForm',res.data)
                }
            } catch (err) {
                console.log(err)
            }
        },
        //回显crf表单列表下的已选指标
        async handlePreviewFormItem() {
            this.loading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.researchObjectPreviewFormItem(params);
                if (res.code == '0') {
                    this.previewFormItem = res.data;
                    this.previewFormItem.forEach(item =>{
                        if(item.crfId){
                            this.allCrfForm.forEach(li => {
                                li.formItemRspList.forEach(n => {
                                    if(n.controlName == item.path && item.crfId == li.crfId){
                                        n.checked = true;
                                    }
                                });
                            });
                        }
                    })
                    this.checkboxChange();
                    this.loading = false;
                }
            } catch (err) {
                console.log(err)
                this.loading = false;
            }
        },
        //搜索表格配置选中表单
        selectCrf(id) {
            this.activeCrf = id;
        },
        //多选框改变
        checkboxChange(li) {
            this.selectFormItem = [];
            //获取已选指标
            this.allCrfForm.forEach(item=>{
                item.formItemRspList.forEach(n=>{
                    if(n.checked) {
                        this.selectFormItem.push(n)
                    }
                })
            })
            if(this.selectFormItem.length > this.maxItem && li) {
                li.checked = false;
                this.$mes('info','最多选择'+this.maxItem+'项')
                return;
            }
            //计算表单选中指标
            this.allCrfForm.forEach(item=>{
                item.checkedList = [];
                item.formItemRspList.forEach(n=>{
                    if(n.checked) {
                        item.checkedList.push(n)
                    }
                })
            })
        },
        //新建/编辑crf表单列表下的已选指标
        async handleFormItem() {
            let list = [];
            this.confingData.defaultChecked.forEach(li=>{
                let obj = {
                    subjectInfoId: this.$store.state.user.researchID,
                    path: li,
                    crfName: 'default'
                }
                list.push(obj)
            })
            this.allCrfForm.forEach(item=>{
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
                subjectInfoId: this.$store.state.user.researchID,
                list: list
            }
            this.loading = true;
            let res;
            try {
                if(list.length) {
                    res = await this.$http.researchObjectEditFormItem(params);
                    if (res.code == '0') {
                        this.popoverFomeItemVisible = false;
                        this.$emit('getDataList')
                    }
                    this.loading = false;
                }else {
                    res = await this.$http.researchObjectAddFormItem(params);
                    if (res.code == '0') {
                        this.popoverFomeItemVisible = false
                        this.$emit('getDataList')
                    }
                    this.loading = false;
                }
            } catch (err) {
                console.log(err)
                this.loading = false;
            }
        },
    }
};
</script>

<style lang="less">
    @import url('../popover.less');
</style>

