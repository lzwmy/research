<template>
    <div style="display:inline-block;">
        <el-button icon="icon iconfont iconxiazaimoban" @click="downloadExcelTemp(row)" :loading="loading">下载excel模版</el-button>
    </div>
</template>

<script>
export default {
    props: ['row'],
    data() {
        return {
            loading: false
        }
    },
    methods: {
        //下载模版
        async downloadExcelTemp(row) {
            this.loading = true;
            try{
                let res = await this.$http.patientListExportTemplate({
                    diseaseId: this.$route.query.id,
                    crfId: row.crfId
                });
                let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                // let filename = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
                this.$download(row.crfDisplayName+'模版.xlsx', blob);
                this.loading = false;
            }catch (error) {
                this.loading = false;
                console.log(error)
                this.$notice('导出失败')
            }
        },
    },
}
</script>