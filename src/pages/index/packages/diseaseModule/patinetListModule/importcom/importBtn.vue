<template>
    <div style="display:inline-block;">
        <el-upload
            class="upload"
            action=""
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
    props: ['row'],
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
            // this.loading = true;
            // try{
            //     let param = new FormData();
            //     param.append('file',file.raw);
            //     param.append('diseaseId',this.$route.query.id);
            //     param.append('crfId',this.currentCrfId);
            //     let url = this.baseURL + "disease/excel/import/patientReports"
            //     axios.defaults.withCredentials = true;
            //     axios.post(url,param,{
            //         headers: {"content-type": "multipart/form-data"},
            //         withCredentials: true
            //     }).then((res)=>{
            //         if(res.data.code==0) {
            //             this.$mes('success','导入成功');
            //             this.$emit('updata');
            //         }else if(res.data.data) {
            //             this.$emit('checkData',res.data.data);
            //         }else {
            //             this.$mes('error', res.data.msg ||'导入失败')
            //         }
            //         this.loading = false;
            //     })
            // }catch (error) {
            //     console.log(error)
            //     this.loading = false;
            //     this.$mes('error','导入失败')
            // }
            

            this.loading = true;
            try {
                let params = new FormData();
                params.append('file',file.raw);
                params.append('diseaseId',this.$route.query.id);
                params.append('crfId',this.currentCrfId);
                let res = await this.$http.patientListImportReportData(params);
                if(res.code==0) {
                    if(res.msg.includes('成功')) {
                        this.$mes('success','导入成功');
                        this.$emit('updata');
                    }else if(res.msg.includes('失败')) {
                        this.$emit('checkData',res.data);
                    }
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