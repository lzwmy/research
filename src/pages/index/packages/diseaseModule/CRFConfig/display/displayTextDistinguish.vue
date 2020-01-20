<template>
    <div :class="item.controlType">
        <div v-if="item.displayIsVisible=='1'" :class="[item.controlType+'_title']">
            <span>{{item.controlDisplayName}}</span>
        </div>
        <div :class="[item.controlType+'_box']">
            <el-button type="primary" @click="Distinguish">文字识别</el-button>
            <div class="display_textarea" v-if="report.value2">{{report.value2}}</div>
        </div>
        <el-dialog
                :title="item.controlDisplayName"
                :visible.sync="dialogVisible"
                :class="item.controlType+'_dialog-container'"
                :append-to-body="true"
                width="80%">
            <div :class="item.controlType+'_dialog_box'">
                <div :class="item.controlType+'_fileLoad'">
                    <span>上传图片</span>
                    <el-upload
                            class="upload-demo"
                            :action="uploadActionUrl"
                            :show-file-list="false"
                            :file-list="fileList"
                            :on-change="handleChange"
                            accept="image/jpeg,image/jpg,image/png"
                            :auto-upload="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </div>
                <div :class="item.controlType+'_display_content'"  v-loading="loading">
                    <div class="img_box">
                        <img v-if="fileId" :src="fileId" alt="" @click="previewImg">
                        <i v-else class="iconfont iconshangchuantupian"></i>
                    </div>
                    <div class="display_content" >
                        <el-input type="textarea" :rows="20" v-model="content"></el-input>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="DistinguishCancel">确 定</el-button>
                <span class="clear_data" @click="clearData">清空</span>
            </span>
        </el-dialog>
        <image-view v-if="dialogVisibleImg"
                    class="TEXT_DISTINGUISH_preview_img"
                    ref="imageView"
                    @on-close="closeViewer"
                    :state="dialogVisibleImg"
                    :url="images"></image-view>
    </div>
</template>

<script>
    import imageView from 'components/packages/ImagePreview/imageView';
    export default {
        props: {
            item: {},
            report: {},
            index: Number
        },
        components:{
            imageView
        },
        data() {
            return {
                newUrl:this.baseURL,
                loading:false,
                dialogVisible: false,
                dialogVisibleImg:false,
                // uploadActionUrl:this.baseURL+"report/save/singleFile.do",
                uploadActionUrl:this.baseURL+"/file/compress/uploadFile.do",
                fileList:[],
                images:[],
                distinguishUrl:"http://121.36.38.26:8080/ai/ocr/general",
                fileId:"",
                content:"",
            }
        },
        methods: {
            initPage() {
              this.fileList = [];
              this.fileId = "";
              this.content = "";
              this.report.value = "";
              this.report.value2 = "";
            },
            Distinguish() {
                this.dialogVisible = true;
                if(this.report.value2 ) {
                    // this.fileId = this.report.value;
                    this.content = this.report.value2;
                }
            },
            DistinguishCancel() {
                this.dialogVisible = false;
                // this.report.value = this.fileId;
                this.report.value2 = this.content;
                this.fileId = "";
                this.content = "";
            },
            clearData() {
                this.initPage();
            },
            previewImg() {
                let dialogImageUrl = this.newUrl+"/file/downloadFile/"+this.fileId;
                this.dialogVisibleImg = true;
                this.images[0] = dialogImageUrl;
                this.$nextTick(()=>{
                    this.$refs.imageView.show();
                });
            },
            closeViewer() {
                this.dialogVisibleImg = false;
            },
            handleChange(file) {
                let that = this;
                let param = new FormData();
                let urlparameter = JSON.parse(localStorage.getItem('reportFill')).urlParameter;
                param.append('file',file.raw);
                param.append('crfId',urlparameter.formId);
                param.append('patientId',urlparameter.patientId);
                param.append('reportId',urlparameter.reportId);
                param.append('desc',that.item.controlDisplayName);
                param.append('sourceType',1);
                let imgURL = that.getObjectURL(file.raw);
                that.loading = true;
                that.fileUploadHttp(that.uploadActionUrl,param).then(res=>{
                    if(res.code == 0 && res.data) {
                        that.$message.success(res.msg);
                        this.fileId = imgURL;
                        this.content = res.data.RESULT.join("\n");
                        /*that.fileList = [];
                        let params = new FormData();
                        params.append('file',file.raw);*/
                        /*that.fileUploadHttp(that.distinguishUrl,params)
                            .then( (result) => {
                                console.log(result);
                                if(result.code == 0) {
                                    this.content = result.data.join("");
                                    // that.fileList.push({...res.data[0],...file,content:result.data});
                                    // that.report.value2 = JSON.stringify(that.fileList);
                                    // that.report.value2 = result.data;
                                }
                            })
                            .catch((error) => console.log(error))*/
                    }
                    that.loading = false;
                }).catch(error => {
                    console.log(error)
                    that.loading = false;
                })
            },
            //自定义多文件文件上传接口
            fileUploadHttp(url,param) {
                return this.$fileUpload(url,param)
            },
            //建立一個可存取到该file的url
            getObjectURL(file) {
                let url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>