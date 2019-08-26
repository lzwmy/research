<template>
  <el-table class="treeGrid" :data="data" :row-style="showTr" stripe :height="height" v-loading="loading"
            :empty-text="emptyText"
            :element-loading-text="elementLoadingText" stripe :highlight-current-row="true" @row-click="handleRowClick">
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
                     :label="column.text" :min-width="index==0?'23%':'10%'" show-overflow-tooltip
                     :align="index==0?'left':'center'">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span class="button-expanded" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right small" size="small" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType === 'normal'" :width="handleColumnWidth" align="center">
      <template slot-scope="scope">
        <slot name="handleColumn" :row="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import Utils from '../utils/index.js';
import { emptyText, elementLoadingText } from 'components/utils/constant';

export default {
  name: 'tree-grid',
  props: {
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default () {
        return [];
      }
    },
    // 这是数据源
    dataSource: {
      type: Array,
      default () {
        return [];
      }
    },
    // 这个是是否展示操作列
    treeType: {
      type: String,
      default () {
        return 'normal';
      }
    },
    // 表格高度，可以定表头，限高的表格，不传的话，就是普通表格
    height: {
      type: Number
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 操作列的宽度
    handleColumnWidth: {
      type: String,
      default () {
        return '100';
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  data () {
    return {
      emptyText: '',
      elementLoadingText: ''
    };
  },
  computed: {
    // 格式化数据源
    data: function () {
      let that = this;
      if (that.treeStructure) {
        let data = Utils.MSDataTransfer.treeToArray(that.dataSource, null, null, that.defaultExpandAll);
        //          console.log('data',data)
        return data;
      }
      return that.dataSource;
    }
  },
  created () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
    },
    // 显示行
    showTr ({row, rowIndex}) {
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true);
      row._show = show;
      return show ? '' : 'display:none;';
    },
    // 展开下级
    toggle (trIndex) {
      let that = this;
      let record = that.data[trIndex];
      record._expanded = !record._expanded;
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      let that = this;
      if (that.treeStructure && index === 0) {
        return true;
      }
      return false;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      let that = this;
      if (that.treeStructure && index === 0 && record.children && record.children.length > 0) {
        return true;
      }
      return false;
    },
    handleRowClick (row, event, column) {
      this.$emit('row-click', {row, event, column});
    }
  }
};
</script>
<style scoped>
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: ""
  }

  table td {
    line-height: 26px;
  }

  .button-expanded {
    cursor: pointer;
    display: inline-block;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
  }

  .button-expanded > i {
    font-size: 15px;
    vertical-align: middle;
  }

</style>
<style>
  .treeGrid {
    width: 100%;
  }

  .treeGrid.el-table tbody tr {
    cursor: pointer;
  }
</style>
