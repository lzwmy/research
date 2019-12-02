

<template>
    <div class="stepTwo">
        <div class="cloud-search flex-between-center">
            <p class="title">创建项目</p>
            <div>
                <el-button @click="$emit('changeStep',0)">上一步</el-button>
                <el-button type="primary" @click="create">下一步</el-button>
            </div>
        </div>
        <div class="main">
            <slot></slot>
            <el-form :model="form" ref="refForm" :rules="formRules" label-width="110px" @submit.native.prevent>
                <el-form-item label="项目名称:" prop="name">
                    <el-input v-model.trim="form.name" placeholder="请输入项目名称" :maxlength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="研究目的/方案:">
                    <el-input type="textarea" :rows="6" v-model.trim="form.scheme" placeholder="请输入研究目的" :maxlength="300"></el-input>
                    <p class="number">{{form.scheme.length}}/300</p>
                </el-form-item>
                <el-form-item label="拟收集患者数:">
                    <el-input v-model.trim="form.patients" placeholder="请输入拟收集患者数" :maxlength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="项目说明:">
                    <el-input type="textarea" :rows="6" v-model.trim="form.explain" placeholder="请输入项目说明" :maxlength="300"></el-input>
                    <p class="number">{{form.explain.length}}/300</p>
                </el-form-item>
                <el-form-item label="项目附件:">
                    <el-upload
                        class="upload"
                        :action="actionUrl"
                        :multiple="false"
                        :limit="1"
                        :file-list="form.files"
                        :on-success="uploadSuccess"
                        :on-remove="onRemove">
                        <el-button :disabled="files.length == 1">上传附件</el-button>
                        <span slot="tip" class="el-upload__tip left_6">请上传伦理审批材料</span>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import utils from 'components/utils/index';
export default {
    props: ['formData'],
    data () {
        return {
            actionUrl: '',
            form: {
                name: '',
                scheme: '',
                patients: 1,
                explain: '',
                files: []
            },
            files: [],
            formRules: {
                name: [{ required: true, message: '请输入项目名称', trigger: 'change' }]
            }
        }
    },
    created() {
        this.actionUrl =  JSON.parse(localStorage.getItem('Global')).baseURL + '/subject/info/uploadFile.do';

        //项目回显数据 
        if(this.formData.proType == 'edit') {
            //如果有存在文件id
            if(this.formData.fileId) {
                this.files = [{
                    fileId: this.formData.fileId,
                    name: this.formData.fileName,
                    fileName: this.formData.fileName
                }];
            }
            this.form = {
                name: this.formData.subjectName,
                scheme: this.formData.purpose,
                patients: this.formData.targetPatientNum,
                explain: this.formData.description,
                files: this.files
            }
        }
    },
    mounted() {
        this.$refs.refForm.resetFields();
    },
    methods: {
        uploadSuccess(response) {
            if(response.data.fileId) {
                this.files = [{
                    fileId: response.data.fileId,
                    fileName: response.data.fileName
                }];
            }
        },
        onRemove(file) {
            this.deleteFile();
            this.files = [];
        },
        async create() {
            this.$refs.refForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }else {
                    let fileId;
                    if(this.files.length == 0) {
                        fileId = "";
                    }else {
                        fileId = this.files[0].fileId;
                    }
                    let formData = {
                        centerPattern:  this.formData.centerPattern,
                        subjectName: this.form.name, 
                        purpose: this.form.scheme,
                        targetPatientNum:  parseInt(this.form.patients) || 0, 
                        description: this.form.explain, 
                        fileId:  fileId,
                        groupList:  []
                    }
                    if(this.formData.proType == 'edit') {
                        this.$emit('changeStep', 2, Object.assign(formData,{
                            id: this.formData.id, 
                            proType: 'edit'
                            })
                        );
                        return;
                    }
                    try {
                        let res = await this.$http.RTASKcreate(formData);
                        if (res.code == '0') {
                            this.$emit('changeStep', 2, Object.assign(formData,{id:res.data}));
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            });
        },
        async deleteFile() {
            let params = {
                fileId: this.files[0].fileId,
                subjectInfoId: this.formData.id
            }
            try {
                let res = await this.$http.RTASKdeleteFile(params);
                if (res.code != '0') {
                    this.$mes('error','删除失败!');
                }
            } catch (err) {
                console.log(err)
            }
        },
    }
};
</script>

<style lang="less" scoped>
    .el-form {
        width: 600px;
        margin: 0 auto 50px;
    }
    .number {
        position: absolute;
        bottom: -5px;
        right: 8px;
        color: #999;
    }
</style>




