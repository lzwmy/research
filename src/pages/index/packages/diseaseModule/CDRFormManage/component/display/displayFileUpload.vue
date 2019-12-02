<template>
    <!--上传-->
  <div :class="item.controlType+'_view_box'">
    <div :class="item.controlType" style="font-size: 14px;">
      <div :class="item.controlType+'_title'">
        <span v-if="item.displayIsVisible=='1'">{{item.controlDisplayName}}</span>
      </div>
      <div :class="item.controlType+'_file_box'" v-if="item.baseProperty.fileType=='FILE'">
        <el-button size="small" style="float: right;" type="primary" @click="uploadFileOrImg">确认上传</el-button>
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
          <!--:before-upload="onBeforeUpload" :http-request="beforeUploadFile"-->
          <el-button size="small">选择文件</el-button>
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
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt=""
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
        <el-dialog class="upload_style" title="图片预览" :visible.sync="dialogVisible">
          <img width="50%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
  </div>
</template>


<script>
  import axios from 'axios';
    export default {
      name: "displayFileUpload",
      props:{
        item: {},
        report: {},
        index: Number
      },
      data() {
        return {
          uploadActionUrl:"http://39.108.238.209:8805/research/file/uploadFiles.do",
          // uploadActionUrl:"http://192.168.1.108:8080/research/file/uploadFiles.do",
          fileList:[],
          dialogImageUrl: '',
          dialogVisible: false,
          disabled: false
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
          this.fileList = fileList;
        },
        onRemove(file,fileList) {
          this.fileList = fileList;
        },
        onPreview(file) {
          console.log('列表已上传钩子',file)
        },
        uploadFileOrImg() {
          this.beforeUploadFile();
        },
        //自定义上传
        beforeUploadFile() {
          let that = this;
          let param = new FormData();
          if(that.fileList.length!==0){
            that.fileList.forEach(item => {
              param.append('files', item.raw);
            });
            // param.append('fileType', this.UploadType);
          }else {
            return false;
          }
          that.fileUploadHttp(param).then(res=>{
            if(res.data.code==0) {
              that.$notice(res.data.msg);
              // that.itemFileRsp = res.data.data;
            }
          }).catch(error=>{
            console.log(error)
          })
        },
        //自定义多文件文件上传接口
        fileUploadHttp(param) {
          let url = this.uploadActionUrl;
          return axios.post(url,param,{
            headers: {"content-type": "multipart/form-data"}
          })
        },
        //图片上传 事件 ---以下
        beforeAvatarUpload(file) {
          let that = this;
          let param = new FormData();
          param.append('files',file.raw);
          that.fileUploadHttp(param).then(res=>{
            if(res.data.code == 0) {
              that.$notice(res.data.msg);
              that.fileList.push({...res.data.data[0],...file})
            }
          }).catch(error => {
            console.log(error)
          })
        },
        handleRemove(file,fileList) {
          console.log(file,fileList);
          this.deleteFileId(file.fileId);
          let copyFileList  = this.fileList;
          copyFileList.forEach((item,index,array)=>{
            if(item.fileId == file.fileId) {
              array.splice(index,1)
            }
          });
          this.fileList = copyFileList;
        },
        handlePictureCardPreview(file) {
          let dialogPreview =JSON.parse(localStorage.getItem('dialogPreview'));
          if(dialogPreview.preview!=='dialogPreview'){
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
          }else{
            this.$message.info('此窗口不能预览')
          }
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
      }
    }
</script>

<style scoped>
  .FILE_UPLOAD{

  }
  .FILE_UPLOAD .FILE_UPLOAD_title{
    width: 200px;
    display: table-cell;
    vertical-align: middle;
    font-size: 14px;
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
  }
</style>
