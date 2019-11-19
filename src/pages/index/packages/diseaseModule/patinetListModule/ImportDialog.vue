<template>
    <div class="importDialog">
        <el-dialog 
            title="上传患者信息" 
            :visible.sync="dataInfo" 
            :append-to-body="true"
            @close="$emit('changeDialog',false)"
            class="importDialog"
            width="800px">
            <div class="content flex-start-start">
                <div class="left">
                    <p class="label">选择类型</p>
                    <ul>
                        <li class="flex-between-center" :class="activeGroup==1?'active':''" @click="select(1)">普 通</li>
                        <li class="flex-between-center" :class="activeGroup==2?'active':''" @click="select(2)">随 访</li>
                    </ul>
                </div>
                <div class="right" v-loading="crfListLoading">
                    <p class="label">共{{crfList.length}}个表单</p>
                    <ul>
                        <li v-for="(item,index) in crfList" :key="index" class="flex-between-center">
                            <p>{{item.crfDisplayName}}</p>
                            <div class="btn_group">
                                <el-button icon="icon iconfont iconxiazaimoban" @click="downloadExcelTemp(item)" :loading="item.loading">下载excel模版</el-button>
                                <el-upload
                                    class="upload"
                                    :on-change="successFile"
                                    :auto-upload="false"
                                    :show-file-list='false'
                                    :file-list="fileList">
                                    <el-button icon="icon iconfont icondaochu" class="upload" @click="selectCrf(item)">上传数据</el-button>
                                </el-upload>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>

        
    </div>
</template>

<script>
export default {
    name: 'importDialog',
    props: ['dataInfo'],
    data () {
        return {
            activeGroup: 1,
            currentCrfId: '',
            importLoading: false,
            crfListLoading: false,
            crfList: [],
        }
    },
    watch: {
        dataInfo: function(newVal) {
            if(newVal) {
                this.getCrfList();
            }
        }  
    },
    methods: {
        select(val) {
            this.activeGroup = val;
            this.getCrfList();
        },
        selectCrf(row) {
            this.currentCrfId = row.crfId
        },
        //下载模版
        async downloadExcelTemp(row) {
            row.loading = true;
            try{
                let res = await this.$http.patientListExportTemplate({
                    diseaseId: this.$route.query.id,
                    crfId: row.crfId
                });
                let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                // let filename = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
                this.$download(row.crfDisplayName+'模版.xlsx', blob);
                row.loading = false;
            }catch (error) {
                row.loading = false;
                console.log(error)
                this.$notice('导出失败')
            }
        },
        //文件选中
        successFile(file,fileList) {
            this.importData(file);
        },
        //导入数据
        async importData(file) {
            try{
                let param = new FormData();
                param.append('file',file.raw);
                param.append('diseaseId',this.$route.query.id);
                param.append('crfId',this.currentCrfId);
                let url = this.baseURL + "disease/excel/import/patientReports"
                axios.defaults.withCredentials = true;
                axios.post(url,param,{
                    headers: {"content-type": "multipart/form-data"},
                    withCredentials: true
                }).then((res)=>{
                    if(res.data.code==0) {
                        this.$mes('success','导入成功')
                    }else if(res.data.data) {
                        this.$emit('checkData',res.data.data)
                    }else {
                        this.$mes('error', res.data.msg ||'导入失败')
                    }
                })
            }catch (error) {
                console.log(error)
                this.$mes('error','导入失败')
            }
        },
        //获取表单列表
        async getCrfList() {
            this.crfListLoading = true;
            let params = {
                crfType: this.activeGroup,
                diseaseId: this.$route.query.id  
            }
            try {
                let res = await this.$http.patientListCrf(params);
                if (res.code == '0') {
                    this.crfList = res.data;
                    this.crfList.forEach(ele => {
                        ele.loading = false;
                    });
                }
                this.crfListLoading = false;
            } catch (err) {
                this.crfListLoading = false;
                console.log(err)
            }
        },
    }
};
</script>

<style lang="less">
    .importDialog {
        .el-dialog__body {
            padding: 20px !important;
        }
        .content {
            height: 340px;
            border: 1px solid #eee;
            .label {
                color: #9CA0B1;
                line-height: 36px;
                padding: 0 10px;
            }
            .left {
                width: 180px;
                height: 100%;
                overflow: auto;
                border-right: 1px solid #eee;
                li {
                    font-size: 14px;
                    color: rgba(57, 66, 99, 1);
                    line-height: 40px;
                    padding: 0 18px;
                    cursor: pointer;
                    &.active {
                        background:rgba(229,235,236,0.5);
                    }
                }
            }
            .right {
                height: 100%;
                flex: 1;
                overflow: auto;
                li {
                    font-size: 14px;
                    color: rgba(57, 66, 99, 1);
                    line-height: 48px;
                    border-top: 1px solid #eee;
                    padding: 0 18px;
                    .upload {
                        color: #1bbae1;
                        border-color: #1bbae1;
                    }
                    .upload {
                        display: inline-block;
                        margin-left: 5px;
                    }
                }
            }
        }
    } 
</style>




