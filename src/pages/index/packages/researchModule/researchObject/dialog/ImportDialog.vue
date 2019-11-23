<template>
    <div class="importDialog">
        <el-dialog 
            :title="dataInfo.title" 
            :visible.sync="dataInfo.visible" 
            :append-to-body="true"
            class="importDialog"
            width="800px">
            <div class="content flex-start-start">
                <div class="left" v-loading="groupLoading">
                    <p class="label">选择队列</p>
                    <ul>
                        <li v-for="(item,index) in groupList" :key="index" class="flex-between-center" :class="activeGroup==item.subjectGroupId?'active':''" @click="select(item)">
                            <p>{{item.subjectGroupName}}</p>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <p class="label">共1个表单</p>
                    <ul>
                        <li v-for="(item,index) in 10" :key="index" class="flex-between-center" :class="activeGroup==index+1?'active':''">
                            <p>CRF({{item}})</p>
                            <div class="btn_group">
                                <el-button icon="icon iconfont iconxiazaimoban" @click="downloadExcelTemp" :loading="downloadLoading">下载excel模版</el-button>
                                <el-button icon="icon iconfont icondaochu" class="upload" @click="" :loading="importLoading">上传数据
                                </el-button>
                                <!-- <el-upload
                                    class="upload"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :file-list="fileList">
                                    <el-button icon="icon iconfont icondaochu" class="upload">上传数据</el-button>
                                </el-upload> -->
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
            activeGroup: '',
            downloadLoading: false,
            importLoading: false,
            groupLoading: false,
            groupList: []
        }
    },
    created() {
        this.getGroupList();
    },
    methods: {
        select(item) {
            this.activeGroup = item.subjectGroupId;
        },
        async downloadExcelTemp() {
            this.downloadLoading = true;
            try{
                let res = await this.$http.researchObjectExportData({
                    subjectId: this.$store.state.user.researchInfo.subjectInfoId,
                    crfId: '',
                    groupId: ''
                });
                let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});
                // let dateTitle = utils.formateDate(new Date().getTime());
                // console.log(dateTitle)
                // let fileNmae = data.headers['content-disposition'].split('filename=')[1];
                // this.$download(fileNmae, blob);
                this.$download('研究对象导入模版.xlsx', blob);
                this.downloadLoading = false;
            }catch (error) {
                this.downloadLoading = false;
                console.log(error)
                this.$notice('导出失败')
            }
        },
        //导入数据
        async importData() {
            this.importLoading = true;
            // try{
            //     let res = await this.$http.researchObjectImportData({
            //         subjectId: this.$store.state.user.researchInfo.subjectInfoId,
            //         crfId: '',
            //         subjectGroupId: '',
            //         file: ''
            //     });
            //     this.importLoading = false;
            // }catch (error) {
            //     this.importLoading = false;
            //     console.log(error)
            //     this.$notice('导入失败')
            // }
        },
        //获取分组列表
        async getGroupList() {
            this.groupLoading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchInfo.subjectInfoId,
            }
            try {
                let res = await this.$http.researchObjectGroupList(params);
                if (res.code == '0') {
                    this.groupList = res.data;
                    if(res.data.length) {
                        this.activeGroup = res.data[0].subjectGroupId;
                    }
                }
                this.groupLoading = false;
            } catch (err) {
                this.groupLoading = false;
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




