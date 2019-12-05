<template>
    <div style="display:inline-block;">
        <el-upload
            class="upload"
            :on-change="successFile"
            :auto-upload="false"
            :show-file-list='false'
            accept=".xls, .xlsx">
            <el-button :loading="loading" icon="icon iconfont icondaochu" class="upload" @click="selectCrf(row)">上传数据</el-button>
        </el-upload>
    </div>
</template>

<script>
export default {
    props: ['row','groupId'],
    data() {
        return {
            loading: false,
            currentCrfId: ''
        }
    },
    methods: {
        selectCrf(row) {
            this.currentCrfId = row.crfId
        },
        //文件选中
        successFile(file,fileList) {
            this.importData(file);
        },
        //导入数据
        async importData(file) {
            this.loading = true;
            try {
                let params = new FormData();
                params.append('file',file.raw);
                params.append('subjectInfoId', this.$store.state.user.researchInfo.subjectInfoId);
                params.append('subjectGroupId',this.groupId);
                params.append('crfId',this.currentCrfId);
                let res = await this.$http.researchObjectImportBatchData(params);
                if(res.code==0) {
                    this.$mes('success','导入成功');
                    this.$emit('updata');
                }else if(res.data) {
                    this.$emit('checkData',res.data);
                }
                this.loading = false;
            } catch (err) {
                this.loading = false;
                console.log(err)
            }
        },
    },
}
</script>