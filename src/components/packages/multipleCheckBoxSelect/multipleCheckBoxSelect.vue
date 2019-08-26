<template>
  <el-select class="multiple-checkBox-select" v-model="checkList" multiple
             :collapse-tags="collapseTags" :placeholder="placeholderText"
             @change="changeselect" size="mini"
             @remove-tag="removeTag" @visible-change="visibleChange" :filterable="isFilterable"
             :no-match-text="noMatchText" :multiple-limit="multipleLimit" :disabled="isDisabled" :editable="false">
    <el-option v-for="item in dataList" :key="item.name" :label="item.label" :value="item.name"
               :disabled="item.disabled">
      <el-checkbox v-model="checkList" @click.native.prevent :label="item.name" :disabled ="item.name === 'BASIC_INFO'">{{ item.label }}</el-checkbox>
    </el-option>
  </el-select>
</template>
<!--使用范例-->
<!--<multipleCheckBoxSelect placeholderText="请选择机构" :dataList="multipledataList" :isFilterable="true" ></multipleCheckBoxSelect>-->
<!--multipledataList: [{-->
<!--value: '选项1',-->
<!--label: '黄金糕'-->
<!--}, {-->
<!--value: '选项2',-->
<!--label: '双皮奶'-->
<!--}, {-->
<!--value: '选项3',-->
<!--label: '蚵仔煎'-->
<!--}, {-->
<!--value: '选项4',-->
<!--label: '龙须面'-->
<!--}, {-->
<!--value: '选项5',-->
<!--label: '北京烤鸭'-->
<!--}],-->
<script type="text/javascript">
export default {
  name: 'multipleCheckBoxSelect',
  mixins: [],
  data () {
    return {
      checkList: ['BASIC_INFO']
    };
  },
  props: {
    defaultchecklist: {// 默认选中项
      type: Array,
      default () {
        return [];
      }
    },
    dataList: {// 传入option
      type: Array,
      required: true
    },
    multipleLimit: {// 最多选多少个，默认无限制
      type: Number,
      default: 0
    },
    placeholderText: {
      type: String,
      default: '请选择'
    },
    isFilterable: {// 是否可以搜索
      type: Boolean,
      default: false
    },
    isDisabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    noMatchText: {
      type: String,
      default: '无匹配数据'
    },
    collapseTags: {// input显示为tags还是显示合并文字
      type: Boolean,
      default: true
    }
  },
  components: {},
  watch: {
    defaultchecklist () {
      this.checkList = this.defaultchecklist;
    },
    checkList () {
      if (this.checkList.indexOf('BASIC_INFO') === -1) {
        this.checkList.unshift('BASIC_INFO');
      }
    }
  },
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    changeselect (value) { // 勾选或者取消勾选事件change
      if (value.indexOf('BASIC_INFO') === -1) {
        value.unshift('BASIC_INFO');
      }
      this.$emit('change', value);
    },
    removeTag (revalue) { // 多选模式下移除tag时触发,移除的tag值remove-tag
      this.$emit('remove-tag', revalue);
    },
    visibleChange (bool) { // 下拉框出现/隐藏时触发,出现则为 true，隐藏则为 false
      this.$emit('visible-change', bool);
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
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    display: none;
  }
</style>
<style>
  .multiple-checkBox-select .el-select__input {
    display: none !important;
  }

  .multiple-checkBox-select .el-select__tags {
    max-width: 180px !important;
  }

  .multiple-checkBox-select .el-select__tags-text {
    display: inline-block;
    max-width: 85px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .multiple-checkBox-select .el-tag .el-icon-close {
    top: -8px !important;
  }
</style>
