<template>
  <div class="contrast-contain">
    <h3 class="mod-title"><i class="el-icon-search"></i>{{title}}</h3>
    <div class="cloud-search  el-form-item-small centerContainer">
      <slot name="contrast-form"></slot>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <el-table
        :height="(data.content && data.content.length>0)?(parentHeight*1-constHeight):(parentHeight*1-constHeight+35)"
        :data="data.content" style="width: 100%"
        @row-click="handleClick"
        :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe v-loading="contrastLoading">
        <template v-for="(item,index) of columns">
          <el-table-column v-if="item.text!='对照'" :prop="item.dataIndex" :key="index"
                           :label="item.text" :min-width="item.width" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-else :key="index" label="对照" min-width="10%">
            <template slot-scope="scope">
              <slot name="contrastColumn" :row="scope.row"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <slot name="pagination"></slot>
    </div>


  </div>
</template>

<script type="text/javascript">
export default {
  name: 'contrast',
  mixins: [],
  data () {
    return {
      chkCode: '',
      firstLoad: false,
      checkList: []
    };
  },
  components: {},
  props: {
    title: {
      type: String,
      default: '中心科室'
    },
    contrastLoading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {data: []}
    },
    columns: {
      type: Array,
      default () {
        return [];
      }
    },
    chbLabel: {},
    parentHeight: {
      type: Number,
      required: true
    },
    constHeight: {
      type: Number,
      required: true
    },
    radio: {
      type: String,
      default: ''
    },
    checkboxdata: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    elementLoadingText: {
      type: String,
      default: '拼命加载'
    }
  },
  watch: {
    radio (newData) {
      this.renderList(newData);
      this.firstLoad = true;
    },
    checkboxdata (ndata) {
      // console.log(ndata)
      this.handleSelectionChange(ndata);
    }
  },
  computed: {},
  created () {

  },
  mounted () {

  },
  methods: {
    renderList (newData) {
      this.chkCode = this.radio;
      this.checkList = [];
      this.checkList.push(this.chkCode);
    },
    handleClick (row) {
      /*     this.checkList = [row[this.columns[0].dataIndex]];
           this.handleSelectionChange(row); */
    },
    handleSelectionChange (newdata) {
      this.checkList = [newdata];
      this.$emit('handleSelectionChange', newdata);
      /*        if (this.firstLoad) {
        this.firstLoad = false;
        //刚初始化列表点击自己
        if (this.chkCode === newdata) {
          this.checkList = [];
          this.$emit('handleSelectionChange', newdata);
          return false;
        }
      }
      this.chkCode = Object.assign(this.checkList)[this.checkList.length - 1];
      this.checkList = [this.chkCode];
      this.$emit('handleSelectionChange', newdata); */
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

<style scoped>

</style>
