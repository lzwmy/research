<template>
  <div class="cloud-component SDResearch">
    <div class="sd-main-wrapper flex-start-center" v-loading="loading">
      <div class="nodata zwarning" v-if="dataList.length === 0">
        您暂未授权任何病种的权限
        <router-link tag="a" style="color: #2d8cf0;" :to="{ name: 'userManage'}" v-if="isHasUserManageAuth"> 去授权&gt;</router-link>
      </div>
      <div v-else>
        <div class="search_content flex-between-center">
          <el-input
            placeholder="专病报告"
            suffix-icon="el-input__icon el-icon-search"
            v-model="report"
            clearable>
          </el-input>
          <el-button icon="el-icon-plus" type="primary">新建病种</el-button>
        </div>
        <div class="cart">
          <router-link tag="a" class="sd-title-wrapper" v-for="item in dataList" :key="item.id"
                      :to="getMenu(item)">
            <div class="sd-thumbnail">
              <div class="sd-thumbnail-content">
                <img :class="'sd-thumbnail-img ' + item.logo + '_bgColor'"
                    :src="'./static/img/disease-logo/' + item.logo+ '.svg'">
              </div>
              <div class="sd-thumbnail-title">
                <span class="sd-name-span" :title="item.name">{{item.name}}</span>
              </div>
            </div>
            <div class="sd-title-tools">
              <div>
                <router-link tag="a" :to="{ name: 'diseaseSet',query:{id:item.id}}" title="病种设置" class="sd-cog-btn">
                  <span class="name">病种管理</span>
                </router-link>
              </div>
            </div>
          </router-link>
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
      report: ""
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
        }
      } catch (error) {
        console.log(error);
      }
    },
    getMenu(item) {
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
      let params = {
        path: list[0].menuPath,
        id: item.id,
        title: title,
        menuPath: menuPath,
        menuList: list
      }
      sessionStorage.setItem('insideMenuData',JSON.stringify(params))
      return {
          path: list[0].menuPath,
          query: {
            id: item.id
          }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
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
      width: 187.5px;
      margin: 15px 15px 0   0;
      cursor: pointer;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, .1);
      &:nth-child(6n){
        margin-right: 0;
      }
    }
  }

  .sd-thumbnail {
    width: 100%;
    padding: 10px;
    background-color: #fff;
    position: relative;
  }

  .sd-title-wrapper .sd-thumbnail {
    padding: 8px;
  }

  .sd-thumbnail .sd-thumbnail-content {
    position: relative;
  }

  .sd-thumbnail .sd-thumbnail-content .sd-thumbnail-img {
    width: 100%;
  }

  .sd-thumbnail .sd-thumbnail-title {
    font-size: 18px;
    text-align: center;
    padding: 5px 0;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  body.theme-blue {
    .sd-title-wrapper .sd-title-tools a:hover {
      color: #2d8cf0;
      background: #ffffff;
    }
  }

  body.theme-green {
    .sd-title-wrapper .sd-title-tools a:hover {
      color: #1dcaaa;
      background: #ffffff;
    }
  }

</style>
