<template>
    <div class="crfForm">
        <el-dialog 
            :title="dialogForm.title" 
            :append-to-body="true"
            :fullscreen="true"
            class="crfForm_dialog"
            :visible.sync="dialogForm.visible">
            <createForm ></createForm>
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
            
        }
    },
    components: {
        createForm
    },
    created() {
        
    },
    methods: {
        
    }
};
</script>

<style lang="less">
    .crfForm_dialog .el-dialog__header{
        display: none !important;
    }
</style>