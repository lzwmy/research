<template>
    <div class="crfForm">
        <el-dialog 
            :title="dialogForm.title" 
            :append-to-body="true"
            :fullscreen="true"
            class="crfForm_dialog"
            :visible.sync="dialogForm.visible">
            <createForm :formOptions="options" @back-status="back"></createForm>
        </el-dialog>
        
    </div>
</template>


<script>
import createForm from '../researchTarget/CRFConfig/report/createReport';
export default {
    name: 'crfForm',
    props: ['dialogForm'],
    data () {
        return {
            options:{
            researchType:"followUpPlan",
            backStatus:"2",// 1 window.history.go(-1)  2 this.$emit() 3 隐藏返回按钮
            title:"新增CRF表单"
        }
        }
    },
    components: {
        createForm
    },
    created() {
        
    },
    methods: {
        back() {
            this.dialogForm.visible = false;
        }
    }
};
</script>

<style lang="less">
    .crfForm_dialog .el-dialog__header{
        display: none !important;
    }
</style>