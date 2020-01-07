<template>
    <!--上传-->
  <div :class="item.controlType+'_view_box'">
    <div :class="item.controlType" style="font-size: 14px;">
      <div v-if="item.displayIsVisible=='1'&&item.baseProperty.labelImage==''" :class="item.controlType+'_title'" >
        <span >{{item.controlDisplayName}}</span>
      </div>
      <div v-else-if="item.baseProperty.labelImage!=''" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]" style="text-align:center">
        <img :src="this.baseURL+'/file/downloadFile/'+item.baseProperty.labelImage" />
      </div>
      
      <div :class="item.controlType+'_file_box'" v-if="item.baseProperty.fileType=='FILE'">
        <!--<el-button size="small" style="float: right;" type="success" @click="uploadFileOrImg">确认上传</el-button>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadActionUrl"
          :auto-upload="false"
          :on-change="onChange"
          :on-remove="onRemove"
          :on-preview="onPreview"
          :file-list="fileList"
          :multiple="true">
          &lt;!&ndash;:before-upload="onBeforeUpload" :http-request="beforeUploadFile"&ndash;&gt;
          <el-button size="small">选择文件</el-button>
        </el-upload>-->
        <el-upload class="upload-demo"
                    ref="upload"
                   :file-list="fileList"
                   :data="fileData"
                   :on-change="onChange"
                   :on-remove="onRemove"
                   :action="uploadActionUrl">
          <el-button size="small">点击上传</el-button>
        </el-upload>
      </div>
      <div :class="item.controlType+'_Image_box'" v-if="item.baseProperty.fileType=='IMAGE'">
        
        <el-upload
          :action="uploadActionUrl"
          list-type="picture-card"
          :on-change="beforeAvatarUpload"
          :file-list="fileList"
          :on-remove="handleRemove"
          :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}" style="width: 100%;height: 100%;">
            <img
              class="el-upload-list__item-thumbnail"
              :src="newUrl+'/file/download/thumbnail/'+file.fileId" alt=""
            >
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file,fileList)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <image-view v-if="dialogVisible"
                    ref="imageView"
                    @on-close="closeViewer"
                    :state="dialogVisible"
                    :url="images"></image-view>
      </div>
    </div>
  </div>
</template>


<script>
  import imageView from 'components/packages/ImagePreview/imageView';
    export default {
      name: "displayFileUpload",
      components:{
        imageView
      },
      props:{
        item: {},
        report: {},
        index: Number
      },
      data() {
        return {
          newUrl:this.baseURL,
          // newUrl:'http://192.168.1.155:8080/research/',
          // uploadActionUrl:this.baseURL+"/file/uploadFiles.do", // old httpRequest url
          uploadActionUrl:this.baseURL+"report/save/singleFile.do",
          fileList:[],
          dialogImageUrl: '',
          dialogVisible: false,
          disabled: false,
          fileData:{},
          images:[]
        }
      },
      methods:{
        async downFile(value,name) {
          let that = this;
          let fromData = {
            fileId:value
          };
          try {
            let data = await that.$http.fileDownLoadFile(fromData)
            let blob = new Blob([data.data], {type: 'application/octet-stream'});
            /*let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=UTF-8'});*/
            // let fileNmae = data.headers['content-disposition'].split('filename=')[1];
            that.$download(name, blob);
          }catch (error) {
            console.log(error)
          }
        },
        onChange(file,fileList) {
          console.log(file,fileList)
          this.fileList = fileList;
          this.report.value2 = JSON.stringify(fileList);
        },
        onRemove(file,fileList) {
          this.fileList = fileList;
          this.report.value2 = JSON.stringify(fileList);
          this.deleteFileId(file.response.data[0].fileId)
        },
        onPreview(file) {
          console.log('列表已上传钩子',file)
        },
        uploadFileOrImg() {
          this.beforeUploadFile();
        },
        //自定义上传`
        beforeUploadFile() {
          let that = this;
          let param = new FormData();
          if(that.fileList.length!==0){
            that.fileList.forEach(item => {
              param.append('file', item.raw);
            });
            // param.append('fileType', this.UploadType);
          }else {
            return false;
          }
          that.fileUploadHttp(param).then(res=>{
            if(res.data.code==0) {
              that.$message.success(res.data.msg);
              // that.itemFileRsp = res.data.data;
            }
          }).catch(error=>{
            console.log(error)
          })
        },
        //自定义多文件文件上传接口
        fileUploadHttp(param) {
          let url = this.uploadActionUrl;
          // return axios.post(url,param,{
          //   headers: {"content-type": "multipart/form-data"}
          // })
          return this.$fileUpload(url,param)
        },
        //图片上传 事件 ---以下
        beforeAvatarUpload(file) {
          let that = this;
          let param = new FormData();
          let urlparameter = JSON.parse(localStorage.getItem('reportFill')).urlParameter;
          param.append('file',file.raw);
          param.append('crfId',urlparameter.formId);
          param.append('patientId',urlparameter.patientId);
          param.append('reportId',urlparameter.reportId);
          param.append('desc',that.item.controlDisplayName);
          param.append('sourceType',1);
          that.fileUploadHttp(param).then(res=>{
            if(res.code == 0) {
              that.$message.success(res.msg);
              that.fileList.push({...res.data[0],...file});
              console.log(that.fileList);
              that.report.value2 = JSON.stringify(that.fileList);
            }
          }).catch(error => {
            console.log(error)
          })
        },
        handleRemove(file,fileList) {
          this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteFileId(file.fileId);
            let copyFileList  = this.fileList;
            copyFileList.forEach((item,index,array)=>{
              if(item.fileId == file.fileId) {
                array.splice(index,1)
              }
            });
            this.fileList = copyFileList;
            this.report.value2 = JSON.stringify(this.fileList);
          }).catch(() => {
          });
        },
        closeViewer() {
          this.dialogVisible = false;
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = this.newUrl+"/file/downloadFile/"+file.fileId;
          this.dialogVisible = true;
          this.images[0] = this.dialogImageUrl;
          this.$nextTick(()=>{
              this.$refs.imageView.show();
            });
        },
        handleDownload(file) {
          console.log(file);
          this.downFile(file.fileId,file.fileName)
        },
        //单个文件删除
        async deleteFileId(value) {
          let that = this;
          let fromData = {
            file_id:value
          };
          try {
            let data = await that.$http.deleteFileId(fromData)
            console.log(data)
            if(data.code ==0) {
              that.$notice(data.msg);

            }
          }catch (error) {
            console.log(error)
          }
        }
      },
      mounted() {
        let urlparameter = JSON.parse(localStorage.getItem('reportFill')).urlParameter;
        this.fileData = {
          crfId:urlparameter.formId,
          patientId:urlparameter.patientId,
          reportId:urlparameter.reportId,
          desc:this.item.controlDisplayName,
          sourceType:1
        };
        if(this.report.value2 !==""){
          this.fileList = JSON.parse(this.report.value2);
        };

      }
    }
</script>

<style scoped>
  .FILE_UPLOAD{
    display: table;
  }
  .FILE_UPLOAD .FILE_UPLOAD_title{
    width: 188px;
    display: table-cell;
    vertical-align: middle;
    font-size: 14px;
  }
  .FILE_UPLOAD .singleColumn {
    width: auto;
    min-width: 188px;
    max-width: 500px;
    padding-right: 5px;
  }
  .FILE_UPLOAD .FILE_UPLOAD_file_box {
    display: table-cell;
    width: 165px;
  }
  .FILE_UPLOAD .FILE_UPLOAD_file_text{
    color: #2d8cf0;
    cursor: pointer;
  }
  .FILE_UPLOAD .FILE_UPLOAD_file_text:hover{
    text-decoration: underline;
  }
  .FILE_UPLOAD .FILE_UPLOAD_Image_box{
    display: table-cell;
    vertical-align: top;
  }
</style>
<style>
  /*弹框样式修改*/
  .upload_style{
    z-index: 2200 !important;
    text-align: left;
  }
  .upload_style .el-dialog__body{
    text-align: center;
    overflow: auto;
    height: 750px;
  }
  .FILE_UPLOAD .el-upload {
    /*display: flex;*/
  }
</style>
