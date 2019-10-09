<template>
    <div class="crfForm">
        <el-dialog 
            :title="dialogForm.title" 
            :append-to-body="true"
            :fullscreen="true"
            class="crfForm_dialog"
            :visible.sync="dialogForm.visible">
            <createForm ref="createForm" :formOptions="options" @back-status="back" @callback-save="handleSave"></createForm>
        </el-dialog>
        
    </div>
</template>


<script>
import createForm from '../researchTarget/CRFConfig/report/createReport';
export default {
    name: 'refForm',
    props: ['dialogForm','options'],
    data () {
        return {
            
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
        },
        handleSave(){
            this.$refs.createForm.researchFormSave()
            .then(res=>{
                this.$emit('save',res);
            })
        }
    }
};
</script>

<style lang="less">
    .crfForm_dialog .el-dialog__header{
        display: none !important;
    }
</style>