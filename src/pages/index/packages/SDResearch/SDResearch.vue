<template>
  <div class="cloud-component SDResearch">
    <div class="sd-main-wrapper flex-start-center" v-loading="loading">
      <div class="nodata zwarning" v-if="dataList.length === 0">
        您暂未授权任何病种的权限
        <!-- <router-link tag="a" style="color: #2d8cf0;" :to="{ path: '/userManage'}" v-if="isHasUserManageAuth"> 去授权&gt;</router-link> -->
        <span class="cur_pointer" style="color: #2d8cf0;" @click="toAuthorize" v-if="isHasUserManageAuth"> 去授权&gt;</span>
      </div>
      <div v-else  style="width:100%;">
        <!-- <div class="search_content flex-between-center">
          <el-input
            placeholder="专病报告"
            suffix-icon="el-input__icon el-icon-search"
            v-model="report"
            clearable>
          </el-input>
          <el-button icon="el-icon-plus" type="primary">新建病种</el-button>
        </div> -->
        <div class="cart" style="width:100%;">
          <el-row :gutter="14" type="flex" class="flex-wrap">
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" v-for="(item,index) in dataList" :key="index">
              <div class="sd-title-wrapper" @click="toLink(item)">
                <div class="sd-thumbnail">
                  <div class="sd-thumbnail-content">
                    <div v-if='item.fileId' v-loading='item.imgLoading' :style="'background-image:url(data:image/png;base64,'+imageBase64+')'" class="bgImg"></div>
                    <img v-else :class="'sd-thumbnail-img ' + item.logo + '_bgColor'"
                        :src="'./static/img/disease-logo/' + item.logo+ '.svg'">
                  </div>
                  <div class="sd-thumbnail-title">
                    <span class="sd-name-span" :title="item.name">{{item.name }}</span>
                  </div>
                </div>
                <div class="sd-title-tools">
                  <div>
                    <!-- <router-link tag="a" :to="{ name: 'diseaseSet',query:{id:item.id}}" title="病种设置" class="sd-cog-btn"> -->
                      <a class="sd-cog-btn" @click.stop="$router.push({name: 'diseaseSet',query:{id:item.id}})">
                        <span class="name">病种管理</span>
                      </a>
                    <!-- </router-link> -->
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import './SDResearch.less';
import './card_bgColor.less'
import mixins from 'components/mixins';

export default {
  name: 'SDResearch',
  mixins: [mixins],
  data () {
    return {
      dataList: [],
      loading: false,
      report: "",
      imageBase64: '',
    };
  },
  components: {},
  watch: {},
  computed: {
    isHasUserManageAuth () {
      let isHasSystemManage;
      let isHasUserManageAuth;
      isHasSystemManage = this.$store.state.user.menuList.findIndex(ele => {
        return (
          ele.menuPath === '/systemManage'
        );
      });
      if (isHasSystemManage != -1) {
        isHasUserManageAuth = this.$store.state.user.menuList[isHasSystemManage].children.findIndex(ele => {
          return (
            ele.menuPath === '/userManage'
          );
        });
        if (isHasUserManageAuth != -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  created () {

  },
  mounted () {
    this.getDataList();
  },
  methods: {
    async getDataList () {
      let that = this;
      that.loading = true;
      try {
        let data = await that.$http.findDiseaseSpecies();
        that.loading = false;
        if (data.code == '0') {
          that.dataList = data.data.diseaseSpecieses;
          that.dataList.forEach(li=>{
            li.imgLoading = false;
            li.fileId && that.getUploadImgFile(li);
          })
          // localStorage.setItem('researchList',JSON.stringify(that.dataList));
          that.$store.commit('saveDiseaseList',that.dataList)
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getIsAdmin() {
      try {
        let data = await this.$http.ORGDisGetUserRoles();
        if (data.code == '0') {
          return Promise.resolve(data.data)
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUploadImgFile(li) {
      li.imgLoading = true;
      let params = {
          imgFileId: li.fileId
      }
      try {
          let res = await this.$http.RTASKGetUploadImgFile(params);
          let base64 = btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          this.imageBase64 = base64
      } catch (err) {
          console.log(err)
      }
      li.imgLoading = false;
    },
    //去授权
    toAuthorize() {
      let menuList = this.$store.state.user.menuList.find(li=>{return li.menuName == '系统管理'})
      let data = {
        fromRouter: {
            path: this.$route.path,
            meta: this.$route.meta
        },
        menuList: menuList.children,
        title: '系统管理',
      }
      this.$store.commit('saveInsideData',params)
      this.$router.push('/userManage')
    },
    async getUserRoles(item, list) {
        try {
            let res = await this.$http.ORGDisShareUserRole({
              diseaseId: item.id
            });
            if (res.code == '0' && res.data.length) {
                this.$store.commit('saveDiseaseInfo',{
                  diseaseId: item.id,
                  diseaseName: item.name,
                  isAdmin: false,
                  roles: res.data || [3],
                  orgCode: '',      //组织机构
                  doctor: ''      //医生
                });
                this.$router.push({
                  path: list[0].menuPath,
                  query: {
                    id: item.id
                  }
                })
            }else {
              this.$mes('info','暂无权限访问')
            }
        } catch (err) {
            console.log(err)
        }
    },
    toLink(item) {
      let list = [];
      let menuPath = '/index';
      let title = "";
      this.$store.state.user.menuList.forEach((item)=>{
        if(item.menuName == '专病科研') {
          title = item.menuName;
          menuPath = item.menuPath;
          list = item.children;
        }
      })
      if(list.length == 0) {
        return;
      }
      let params = {
        path: list[0].menuPath,
        id: item.id,
        title: title,
        fromRouter: {
            path: menuPath,
            meta: this.$route.meta
        },
        menuList: list
      }
      this.$store.commit('saveInsideData',params)
      this.getIsAdmin().then((res)=>{
        //非管理员
        if(!res) {
          this.getUserRoles(item, list);
          return;
        }
        //管理员
        this.$store.commit('saveDiseaseInfo',{
          diseaseId: item.id,
          diseaseName: item.name,
          isAdmin: res,
          roles: [1],
          orgCode: '',      //组织机构
          doctor: ''      //医生
        });
        this.$router.push({
          path: list[0].menuPath,
          query: {
            id: item.id
          }
        })
      })
    }
  }
};
</script>

<style scoped lang="less">
  .search_content {
    .el-input {
      width: 280px;
    }
  }
  .SDResearch .sd-main-wrapper {
    width: 100%;
    flex-wrap: wrap;
    position: relative;
  }

  
  .cart {
    .sd-title-wrapper {
      display: inline-block;
      position: relative;
      width: 100%;
      margin-bottom: 14px;
      cursor: pointer;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, .1);
    }
  }

  .sd-thumbnail {
    width: 100%;
    height: 234px;
    padding: 10px;
    background-color: #fff;
    position: relative;
  }

  .sd-title-wrapper .sd-thumbnail {
    padding: 8px 8px 0;
  }

  .sd-thumbnail .sd-thumbnail-content {
    width: 100%;
    height: 189px;
    position: relative;
    .bgImg {
      width: 100%;
      height: 189px;
      background-size: cover;
      display: block;
    }
  }

  .sd-thumbnail .sd-thumbnail-content .sd-thumbnail-img {
    width: 100%;
  }

  .sd-thumbnail .sd-thumbnail-title {
    font-size: 18px;
    text-align: center;
    padding: 8px 0;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #8c8c8c;
  }

  .sd-title-wrapper .sd-title-tools {
    position: absolute;
    display: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 10px;
  }

  .sd-title-wrapper:hover .sd-title-tools {
    display: block;
  }

  .sd-title-wrapper .sd-title-tools a {
    display: inline-block;
    background: rgba(0, 0, 0, .3);
    padding: 5px 14px;
    margin: 3px;
    border-radius: 2px;
    font-size: 12px;
    color: #fff;
  }

  .SDResearch .nodata {
    padding: 15px 0;
    height: 350px;
    width: 100%;
    line-height: 350px;
    text-align: center;
    font-size: 15px;
  }

</style>
