<template>
  <div class="researchTask">
    <!-- 搜索区域 -->
    <div class="cloud-search flex-end-center">
      <!--<a class="special_btn_a" target="_blank" href="https://research.yiducloud.com.cn/dpapservice/#/knowledge/home?customization=1&given_disease=%5B%22%E5%86%85%E7%A7%91ICU%22%5D&from=prdb&title=%E7%A7%91%E7%A0%94%E5%8D%8F%E4%BD%9C%E5%B9%B3%E5%8F%B0&callback=https%3A%2F%2Fresearch.yiducloud.com.cn%2F">
        <el-button type="text" class="special_btn">科研灵感</el-button>
      </a>-->
      <!--<el-button type="text" class="special_btn" @click="constructTool">构建工具</el-button>-->
      <el-button type="text" class="special_btn" @click="jumpInspiration">科研灵感</el-button>
      <el-button type="text" class="special_btn" @click="jumpSubject">课题验证</el-button>
      <el-button icon="icon iconfont iconzujian45" type="primary" @click="createTask">创建项目</el-button>
    </div>
    <ul v-loading="loading">
      <el-row :gutter="20">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-for="(item,index) in dataList" :key="index">
          <li @click="linkTask(item)" :class="item.imgBase64?'isExistBG':''">
            <div class="card_body flex-center-center" :style="item.imgBase64?'background-image:url(data:image/png;base64,'+item.imgBase64+')':''">
              <span class="box flex-center-center">
                  <i class="icon iconfont iconzujian7"></i>
              </span>
            </div>
            <div class="card_foot">
              <div class="t flex-between-center">
                <p class="title">{{item.subjectName}}</p>
                <p><i class="icon iconfont iconzujian8"></i>{{item.patientCount}}</p>
              </div>
              <div class="info flex-between-center">
                <p><i class="icon iconfont iconzujian6"></i>{{item.author}}</p>
                <p>{{item.createTime}}</p>
              </div>
            </div>
            <el-popover
              placement="bottom"
              popper-class="researchTask_popper"
              trigger="hover">
              <i slot="reference" class="icon el-icon-more"></i>
              <ul class="stepThree_ul">
                <li @click="showEdit(item,index)">编辑</li>
                <li @click="deleteGroup(item)">删除</li>
              </ul>
            </el-popover>
          </li>
        </el-col>
      </el-row>

      <div v-show="emptyData" class="empty flex-center-center flex-wrap" style="margin-top: 180px;">
          <svg class="icon" aria-hidden="true" style="font-size: 170px;width:100%; text-align:center;">
              <use xlink:href="#iconzu11"></use>
          </svg>
          <p class="text-center" style="font-size: 14px; color:#666;padding-top: 15px;">暂无内容</p>
      </div>
    </ul>

    <el-dialog
      title="编辑项目"
      :visible.sync="dialogFrom.visible"
      :append-to-body="true"
      @close="closeDialog"
      class="researchTaskDialog"
      width="1000px">
      <div class="flex-between-start">
        <el-form :model="dialogFrom" ref="refDialogFrom" :rules="formRules" label-width="110px" @submit.native.prevent>
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model.trim="dialogFrom.name" placeholder="请输入项目名称" :maxlength="20" clearable></el-input>
          </el-form-item>
          <el-form-item label="研究目的/方案:">
            <el-input type="textarea" :rows="6" v-model.trim="dialogFrom.scheme" placeholder="请输入研究目的"
                      :maxlength="300"></el-input>
            <p class="research_number">{{dialogFrom.scheme.length}}/300</p>
          </el-form-item>
          <el-form-item label="拟收集患者数:">
            <el-input v-model.trim="dialogFrom.patients" placeholder="请输入拟收集患者数" :maxlength="20" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目说明:">
            <el-input type="textarea" :rows="6" v-model.trim="dialogFrom.explain" placeholder="请输入项目说明"
                      :maxlength="300"></el-input>
            <p class="research_number">{{dialogFrom.explain.length}}/300</p>
          </el-form-item>
          <el-form-item label="项目附件:">
            <el-upload
              class="upload"
              :action="actionUrl"
              :multiple="false"
              :limit="1"
              :file-list="dialogFrom.files"
              :on-success="uploadSuccess"
              :on-remove="onRemove">
              <el-button :disabled="dialogFrom.files.length == 1">上传附件</el-button>
              <span slot="tip" class="el-upload__tip left_6">请上传伦理审批材料</span>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-upload
            v-loading="dialogFrom.imgLoading"
            class="bgImg-uploader"
            drag
            action=""
            :on-change="uploadImgFile"
            :auto-upload="false"
            :show-file-list="false"
            accept=".jpeg, .png"
            :before-upload="beforeUploadImg">
            <div slot="tip" class="el-upload__tip text-center">上传封面图片<br/>(255x154)</div>
            <div v-if="!dialogFrom.imageBase64">
              <img v-if="dialogFrom.imageUrl" :src="dialogFrom.imageUrl" class="bgImg"/>
              <i v-else class="iconfont iconshangchuantupian"></i>
            </div>
            <div v-else :style="'background-image:url(data:image/png;base64,'+dialogFrom.imageBase64+')'" class="bgImg"></div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit" size="mini" :disabled="dialogFrom.loading">保 存</el-button>
                <el-button @click="closeDialog" size="mini">关 闭</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'researchTask',
    data() {
      return {
        emptyData: false,
        roles: [], //用户角色
        dataList: [],
        actionUrl: '',
        loading: false,
        projectInfo: {},
        dialogFrom: {
          visible: false,
          loading: false,
          name: '',
          id: '',
          scheme: '',
          patients: '',
          explain: '',
          files: [],
          imageUrl: '',
          imageBase64: '',
          uploadImgFileId: '',
          imgLoading: false,
        },
        formRules: {
          name: [{required: true, message: '请输入项目名称', trigger: 'change'}]
        }
      };
    },
    created() {
      this.getDataList();
      // this.actionUrl = 'http://192.168.1.99:8080/research/subject/info/uploadFile.do';
      this.actionUrl =  JSON.parse(localStorage.getItem('Global')).baseURL + '/subject/info/uploadFile.do';
    },
    methods: {
      jumpInspiration() {
        window.open("./InspirationPage.html")
      },
      constructTool() {
        window.open('./constructTool.html')
      },
      //课题验证
      jumpSubject() {
        this.$router.push({
          path:"/subjectVerification",
        })
      },
      createTask() {
        this.$router.push({
          name: 'createProject',
          params: {
            roles: this.roles
          }
        })
      },
      onRemove(file) {
        this.deleteFile();
        this.dialogFrom.files = [];
      },
      async deleteFile() {
        let params = {
          fileId: this.dialogFrom.files[0].fileId,
          subjectInfoId: this.dialogFrom.id
        }
        try {
          let res = await this.$http.RTASKdeleteFile(params);
          if (res.code != '0') {
            this.$mes('error', '删除失败!');
          }
        } catch (err) {
          console.log(err)
        }
      },
      linkTask(item) {
        this.loading = true;
        this.getUserInfo(item.id)
        .then(()=>{
          if(!this.roles.length) {
            this.$mes('info','暂无访问权限');
            this.loading = false;
            return;
          }
          if (item.createStatus == 3) {
            let params = {
              title: '科研项目',
              researchId: item.id,
              fromRouter: {
                path: this.$route.path,
                meta: this.$route.meta
              },
              menuList: this.$store.state.user.taskMenuList
            }
            this.$store.commit('saveInsideData',params)
            this.loading = false;
            this.$router.push({
              name: "projectProgress",
              params: params
            })
            this.$store.commit('saveresearchInfo',{
              subjectInfoId: item.id,
              centerModel: item.centerPattern,
              roles: this.roles
            });
            this.btnLoading = false;
            return;
          } else {
            this.getProjectInfo(item.id)
              .then(() => {
                let params = {
                  createStatus: 2,
                  projectInfo: {
                    proType: 'edit',
                    centerPattern: item.centerPattern,
                    id: item.id,
                    description: this.projectInfo.description || '',
                    purpose: this.projectInfo.purpose || '',
                    subjectName: this.projectInfo.subjectName,
                    targetPatientNum: this.projectInfo.targetPatientNum || 0,
                    fileId: this.projectInfo.fileId || '',
                    imgFileId: item.imgFileId|| '',
                    fileName: this.projectInfo.fileName || '',
                  }
                }
                this.$router.push({
                  name: "createProject",
                  params: params
                })
              })
          }
        })
      },
      async getDataList() {
        this.loading = true;
        let params = {
          userId: this.$store.state.user.userLogin.userId
        }
        try {
          let res = await this.$http.RTASKgetDataList(params);
          if (res.code == '0') {
            this.dataList = res.data;
            this.dataList.forEach((li,index)=>{
              li.imgFileId && this.getUploadImgFile(li,index)
            })
            if(this.dataList.length==0) {
              this.emptyData = true;
            }else {
              this.emptyData = false;
            }
          } 
          this.loading = false;
        } catch (err) {
          this.loading = false;
          console.log(err)
        }
      },
      async getUploadImgFile(item,index) {
        this.dialogFrom.imgLoading = true;
        let params = {
          imgFileId: item.imgFileId
        }
        try {
          let res = await this.$http.RTASKGetUploadImgFile(params);
          let base64 = btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          this.dialogFrom.imageBase64 = base64
          this.$set(this.dataList, index, Object.assign(item,{imgBase64: base64}))
        } catch (err) {
          console.log(err)
        }
        this.dialogFrom.imgLoading = false;
      },
      deleteGroup(item) {
        this.$confirm('确认删除该项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            subjectInfoId: item.id
          }
          try {
            let res = await this.$http.RTASKdelete(params);
            if (res.code == '0') {
              this.$mes('success', '删除成功!');
              this.getDataList();
            } 
          } catch (err) {
            console.log(err)
          }
        }).catch((error) => {
        });
      },
      async showEdit(item, index) {
        this.getProjectInfo(item.id)
          .then(() => {
            let data = [];
            console.log(this.projectInfo)
            if (this.projectInfo.fileId) {
              data = [{
                fileId: this.projectInfo.fileId,
                name: this.projectInfo.fileName
              }]
            }
            this.dialogFrom = {
              visible: true,
              loading: false,
              id: item.id,
              name: this.projectInfo.subjectName || '',
              scheme: this.projectInfo.purpose || '',
              patients: this.projectInfo.targetPatientNum || '',
              explain: this.projectInfo.description || '',
              files: data,
              imageUrl: '',
              uploadImgFileId: '',
              imgLoading: false,
            }
            this.getUploadImgFile(item, index)
          })
      },
      async saveEdit() {
        this.$refs.refDialogFrom.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let fileId;
            if (this.dialogFrom.files.length == 0) {
              fileId = "";
            } else {
              fileId = this.dialogFrom.files[0].fileId;
            }
            let params = {
              id: this.dialogFrom.id,
              subjectName: this.dialogFrom.name,
              purpose: this.dialogFrom.scheme,
              targetPatientNum: parseInt(this.dialogFrom.patients) || 0,
              description: this.dialogFrom.explain,
              fileId: fileId,
              imgFileId: this.dialogFrom.uploadImgFileId
            }
            try {
              let res = await this.$http.RTASKedit(params);
              if (res.code == '0') {
                this.$mes('success', '编辑成功!');
                this.dialogFrom.visible = false;
              }
              this.getDataList();
            } catch (err) {
              console.log(err)
            }
          }
        });
      },
      closeDialog() {
        this.$refs.refDialogFrom.resetFields();
        this.dialogFrom = {
          visible: false,
          loading: false,
          name: '',
          id: '',
          scheme: '',
          patients: '',
          explain: '',
          files: [],
          imageUrl: '',
          uploadImgFileId: '',
          imgLoading: false,
        }
      },
      uploadSuccess(response) {
        if (response.data.fileId) {
          this.dialogFrom.files = [{
            fileId: response.data.fileId,
            name: response.data.fileName
          }];
        }
      },
      async getProjectInfo(id) {
        this.projectInfo = {};
        let params = {
          subjectInfoId: id
        }
        try {
          let res = await this.$http.RTASKpreviewInfo(params);
          if (res.code == '0') {
            this.projectInfo = res.data;
          }
          this.loading = false;
        } catch (err) {
          this.loading = false;
          console.log(err)
        }
      },
      //角色信息
      async getUserInfo(subjectId) {
        try {
          let res = await this.$http.researchGetRoles({subjectId: subjectId});
          if (res.code == '0') {
            this.roles = res.data;
          }else {
            this.roles = [];
          }
        } catch (err) {
          console.log(err)
        }
      },

      beforeUploadImg(file) {
          if (!['image/jpeg','image/png'].includes(file.type)) {
              this.$message.info('上传封面图片只支持 JPG/PNG 格式!');
              return false;
          }
          return true;
      },
      async uploadImgFile (file) {
          this.dialogFrom.imgLoading = true;
          try {
              let params = new FormData();
              params.append('file',file.raw);
              let res = await this.$http.RTASKuploadImgFile(params);
              if(res.code==0) {
                  this.dialogFrom.imageBase64 = '';
                  this.dialogFrom.imageUrl = URL.createObjectURL(file.raw);
                  this.dialogFrom.uploadImgFileId = res.data;
              }
          } catch (err) {
              console.log(err)
          }
          this.dialogFrom.imgLoading = false;
      }
    }
  }
</script>
<style lang="less">
  .researchTask {
    .special_btn_a {
      margin-right: 10px;
    }

    .special_btn {
      transition: all 300ms;
      color: #333;
      &:hover {
        background: #ccc;
        color: #fff;
      }
    }

    ul {
      flex-wrap: wrap;

      li {
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.16);
        background: #FBFBFB;
        margin-top: 20px;
        transition: all 300ms;
        cursor: pointer;
        position: relative;
        &.isExistBG {
          .box{
            display: none;
          }
          .el-popover__reference {
            color: #000;
          }
        }
        &:hover {
          background-color: rgba(0, 0, 0, .05);
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

          .t .title {
            color: #3A579D !important;
            font-weight: bold;
          }

          .card_body {
            .box {
              background-color: rgba(0, 0, 0, .08);
            }
          }
        }

        .card_body {
          height: 154px;
          background-image: url('./images/researchTask_bg.png');
          background-size: cover;
          .box {
            transition: all 300ms;
            width: 58px;
            height: 58px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.16);

            .icon {
              font-size: 32px;
              color: #9BABB8;
            }
          }
        }

        .card_foot {
          height: 74px;
          padding: 0 20px 5px;
          color: 12px;
          color: #9BABB8;
          background-color: #fff;

          .icon {
            padding-right: 6px;
            color: rgba(155, 171, 184, 1);
          }

          .t {
            line-height: 35px;

            .title {
              font-size: 14px;
              color: #333;
              width: 210px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;

            }
          }

          .info {
            line-height: 24px;
          }
        }

        .el-popover__reference {
          position: absolute;
          top: 6px;
          right: 8px;
          font-size: 16px;
          color: #666;
        }
      }
    }
  }

  .research_number {
    position: absolute;
    bottom: -5px;
    right: 8px;
    color: #999;
  }
</style>
<style lang="less">
  .researchTask_popper {
    padding: 0;
    min-width: 80px;

    ul li {
      line-height: 36px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: #e9f6ff;
        color: #4db3fe;
      }
    }
  }
  .researchTaskDialog {
    .el-form {
      flex: 1;
    }
    .bgImg-uploader {
      .el-upload {
          width: 255px;
          height: 154px;
          margin-left: 20px;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          &:hover {
              border-color: #409EFF;
          }
          .el-upload-dragger {
              width: 100%;
              height: 100%;
              border: none;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .bgImg {
              height: 100%;
              display: block;
          }
          .iconfont {
              font-size: 36px;
              color: #BDC3C7;
              text-align: center;
          }
      }
      .bgImg {
        width: 100%;
        background-size: cover;
      }
      .el-upload__tip {
          margin-left: 20px;
      }
    } 
  }
</style>
