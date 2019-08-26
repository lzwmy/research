<template>
  <div class="excel-upload">
    <el-upload class="upload-demo" ref="upload" action="./CloudPlatform/api/admin/organization/importOrganization"
               :auto-upload="false" :on-success="handleExcelSuccess" :on-change="onChange"
               :before-upload="beforeAvatarUpload" :file-list="fileList">
      <el-button slot="trigger" size="small">选择文件</el-button>
      <el-button size="small" type="primary" @click="submitUpload">批量导入</el-button>
      <slot></slot>
    </el-upload>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span v-html="msg"></span>
      <span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="close">确定</el-button>
				<el-button @click="close">取消</el-button>
			</span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'excel-upload',
  data () {
    return {
      dialogVisible: false,
      msg: '正在上传校验数据中，请稍后...',
      fileList: [{name: '请选择上传文件.xls'}]
    };
  },
  methods: {
    beforeAvatarUpload (file) {
      const isEXCEL = file.type === 'application/vnd.ms-excel';
      if (!isEXCEL) {
        this.$notice('上传文件的格式为.xls');
        return false;
      }
      this.dialogVisible = true;
    },
    onChange (file, fileList) {
      this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.slice(-1);
    },
    submitUpload () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$notice('请选择上传的.xls文件');
        return false;
      }
      this.$refs.upload.submit();
    },

    handleExcelSuccess (response, file, fileList) {
      if (!response.success) {
        let link = '';
        if (response.data.errorFilePath) {
          link = '<a href="./CloudPlatform/api/admin/file/downTempFile?originalName=%E9%94%99%E8%AF%AF%E6%95%B0%E6%8D%AE%E6%96%87%E4%BB%B6.xlsx&amp;filePath=' + response.data.errorFilePath + ' target="_blank">点击下载错误数据文件</a>';
        }
        this.msg = '导入失败：' + response.data.errorMesg + link;
      } else {
        this.msg = '导入机构数据成功!';
        this.$emit('success', response);
      }
    },
    close () {
      this.dialogVisible = false;
      this.$refs.upload.clearFiles();
      var that = this;
      setTimeout(function () {
        that.msg = '正在上传校验数据中，请稍后...';
      }, 500);
    }
  }
};
</script>
<style>
  .excel-upload {
    position: relative;
  }

  .excel-upload .el-upload {
    padding-right: 100px;
    cursor: default;
  }

  .excel-upload .el-upload-list {
    position: absolute;
    left: 73px;
    top: 0;
  }

  .excel-upload .el-upload-list .el-upload-list__item-name {
    max-width: 99px;
    margin: 0
  }

  .excel-upload .el-upload-list .el-icon-document, .excel-uploa .el-icon-close, .excel-upload .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: none !important
  }

  .excel-upload .el-icon-close:before {
    content: ''
  }

  .excel-upload .el-upload-list__item.is-success .el-upload-list__item-name:hover {
    color: #48576a;
    cursor: default;
  }

  .excel-upload .el-button--default {
    cursor: pointer;
  }
</style>
