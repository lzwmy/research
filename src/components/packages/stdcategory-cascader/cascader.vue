<template>
  <el-cascader class="category-cascader" placeholder="请选择分组"
               :options="options" v-model="selectOption" @change="changeHandle"
               @active-item-change="handleItemChange"
               :props="props"
  ></el-cascader>
</template>

<script type="text/javascript">
export default {
  name: '',
  mixins: [],
  props: {
    defaultOption: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      stdCategoryList: [],
      selectOption: [],
      options: [],
      props: {
        label: 'categoryName',
        value: 'categoryId',
        children: 'categoryChildren'
      }
    };
  },
  components: {},
  computed: {},
  created () {
  },
  mounted () {
    this.initPage();
  },
  watch: {
    defaultOption (val) {
      // console.log(val)
      this.selectOption = val;
      this.initPage();
    }
  },
  methods: {
    initPage () {
      let that = this;
      that.getOneLevelCategory().then(() => {
        if (that.selectOption[0]) {
          that.handleItemChange(this.selectOption[0]);
        }
      });
    },
    getOneLevelCategory () {
      let that = this;
      return new Promise((resolve, reject) => {
        that.getStdCategory().then((res) => {
          that.stdCategoryList = res;
          that.stdCategoryList.forEach(item => {
            that.$set(item, 'categoryChildren', []);
          });
          that.options = that.stdCategoryList;
          resolve();
        }).catch(() => {
          reject(new Error());
        });
      });
    },
    getStdCategory (parentId = '') {
      let that = this;
      let params = {
        parentId: parentId
      };
      return new Promise((resolve, reject) => {
        that.$axios({
          method: 'get',
          url: '/std/std/getStdCategory?t=' + (+new Date()),
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.SYS_HEAD.RET_STATUS == 'S' && data.BODY && data.BODY.data) {
            resolve(data.BODY.data);
          } else {
            that.$notice('标准分组查询失败');
            reject(new Error());
          }
        }).catch((error) => {
          that.$notice('标准分组查询失败');
          reject(error);
          console.log(error);
        });
      });
    },
    handleItemChange (val) {
      let that = this;
      that.getStdCategory(val[0]).then((res) => {
        that.options.forEach(item => {
          if (item.categoryId == val[0]) {
            that.$set(item, 'categoryChildren', res);
          }
        });
      });
    },
    changeHandle (val) {
      this.$emit('select', val);
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

<style>
  .category-cascader .el-input {
    width: 220px !important;
  }
</style>
