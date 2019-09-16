<template>
  <div ref="cloudPagination" id="pagination" class="cloud-pagination" v-show="data[listName] && data[listName].length > 0">
    <div class="flex-end-center">
      <el-pagination 
        ref="pagination" 
        @size-change="sizeChange"
        background
        @current-change="currentChange"
        :current-page.sync="currentPage"
        :page-sizes="pageSizesConfig"
        :page-size.sync="currentSize"
        :layout="config"
        :total="data[totalNumName]">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { on } from 'components/utils/dom';
import utils from 'components/utils/index';

export default {
  name: 'pagination',
  props: {
    data: {// data对象下面有content、totalCount、totalPage、pageSize、pageNo这些属性，如果不是这些属性，可以传入对应的属性名
      type: Object,
      required: true
    },
    listName: {// data对象下列表list的key名字
      type: String,
      default: 'content'
    },
    totalNumName: {// 默认 总条数 的名字
      type: String,
      default: 'totalCount'
    },
    totalPageName: {// 默认 总页数 的名字
      type: String,
      default: 'totalPage'
    },
    pageNoName: {// 默认 当前为第几页 的名字
      type: String,
      default: 'pageNo'
    },
    pageSizeName: {// 默认 每页多少条 的名字
      type: String,
      default: 'pageSize'
    },
    totalPage: {
      type: Boolean,
      default: true
    },
    config: {
      type: String,
      default: 'total, sizes , prev, pager, next, jumper'
    },
    pageSizesConfig: {// Props with type Object/Array must use a factory function to return the default value.
      type: Array,
      default () {
        return [10, 15, 20, 30];
      }
    }
  },
  data () {
    return {
      currentPage: 1, // 当前第几页
      currentSize: 10// 当前每页多少条
    };
  },
  computed: {
    pageNo () {
      if (this.data[this.pageNoName] === undefined) return false;
      return this.data[this.pageNoName];
    },
    pageSizeInit () {
      utils.handlePagination();
      return this.data[this.pageSizeName];
    }
  },
  watch: {
    pageSizeInit () {
      this.currentSize = this.pageSizeInit;
    },
    pageSizesConfig (newValue, oldValue) {
      this.currentSize = newValue[0];
    },
    pageNo (newValue, oldValue) {
      this.currentPage = Number(newValue);
    }
  },
  created () {},
  mounted () {
    let mainEle = $('#main').offset();
    $('#app:not(.insideView) #pagination').css({'left': mainEle.left +'px'})
  },  
  updated () {
    let that = this;
    let el;
    that.$nextTick(() => { // 修改页码输入框输入不符合规则的数字
      el = this.$refs.cloudPagination.querySelector('.el-pagination__editor .el-input__inner');
      on(el, 'blur', () => { // 绑定失焦事件
        that.$nextTick(() => {
          if (el && !(/(^[1-9]\d*$)/.test(el.value))) {
            el.value = 1;
          }
        });
      });
      if (el && !(/(^[1-9]\d*$)/.test(el.value))) { // 更新数据时候触发
        el.value = 1;
      }
    });
  },
  methods: {
    sizeChange (size) {
      this.currentSize = size;
      if (this.currentPage === 1) {
        this.$emit('change', 1, size);
      } else {
        this.currentPage = 1;// 赋值后页面变化触发currentChange事件，所以不用写事件，elementui已经封装了事件
      }
      let el = this.$refs.cloudPagination.querySelector('.el-pagination__editor .el-input__inner');
      el.focus();// 解决显示页数的输入框显示上一次 的bug
      this.$nextTick(() => {
        if (el) {
          el.value = this.currentPage;
        }
        el.blur();
      });
    },
    currentChange (page) {
      if (!(/(^[1-9]\d*$)/.test(page))) { // 检测正整数
        page = 1;
      }
      if (!this.currentSize) {
        this.currentSize = 10;
      }
      this.$emit('change', page, this.currentSize);
    },
  }
};
</script>


<style lang="less">
  #pagination {
    background: #fff;
    padding: 11px 10px 12px;
    border-top: none;
    font-size: 13px;
    color:  #48576a;
    .el-pagination {
      .padding-button {
        right: 40px;
      }
      .btn-prev, .btn-next{
        border: 1px solid #f2f2f2;
        margin: 0;
        color: #409EFF;
        background-color: #fff;
      }
      .btn-prev {
        border-right: none;
        &:hover {
            border: none;
            color: #fff;
            background-color: #409EFF;
        }
      }
      .btn-next {
        border-left: none;
        &:hover {
            border: none;
            color: #fff;
            background-color: #409EFF;
        }
      }
      .el-pager {
        li {
          margin: 0;
          border-radius: 0;
          padding: 0;
          color: #409EFF;
          font-weight: normal;
          border: 1px solid #f2f2f2;
          background-color: #fff;
          border-left: 1px solid transparent;
          &:first-child {
            border-left: 1px solid #f2f2f2;
          }
          &.active, &:hover{
            border: none;
            color: #fff;
            background-color: #409EFF;
          }
        }
      }
      .el-input .el-input__inner, .el-input, .el-pagination__editor {
        height: 28px;
        line-height: 28px;
      }
    }
  }

  .insideView #pagination {
    .btn-prev, 
    .btn-next{
      color: #1bbae1;
    }
    .el-pagination__sizes .el-input .el-input__inner:hover,
    .el-select .el-input.is-focus .el-input__inner{
      border-color: #1bbae1;
    }
    .btn-prev:hover, .btn-next:hover {
      background-color: #1bbae1;
    }
    .el-pager li {
      color: #1bbae1;
      &:hover, &.active {
        background-color: #1bbae1;
      }
    }
  }
  #pagination.fixed{
    position: fixed;
    bottom: 0;
    left: 0px;
    width: 1300px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    bottom: 0px;
    z-index: 99;
    padding: 1px 15px;
    background: rgba(75,75,75,.85);
    .el-pagination__total,
    .el-pagination__jump {
      color: #eee;
    }
    .el-pager li {
      background-color: transparent;
      border:none;
      color: #fff;
      &.active {
        color: #439aff;
        background-color: transparent;
      }
      &:hover {
        background: rgba(255,255,255,.3);
      }
      &:first-child  {
        border: none;
      }
    }
    .el-pagination .btn-prev,
    .el-pagination .btn-next {
      background-color: transparent;
      color: #fff;
      border:none;
      &:hover {
        background: rgba(255,255,255,.3);
      }
    }
    .el-pagination .el-input .el-input__inner {
      background-color: transparent;
      border: none;
      color: #fff;
      &:hover {
        background: rgba(255,255,255,.3);
      }
    }
  }


  .insideView + .el-popper {
    color: red;
    .el-select-dropdown__item.selected {
      color: #1bbae1;
    }
  }
</style>