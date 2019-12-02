<template>
  <div class="treeTainer">
    <div class="treeInner" :style="{ height: parentHeight*heightRatio + 'px'}">
      <div class="treeTitle" v-text="title"></div>
      <el-tree
        class="filter-tree" :class="{'el-tree-paddingBottom':btnShow}"
        :data="treeData"
        :props="defaultProps"
        :default-expand-all="defaultExpandAll"
        :filter-node-method="filterNode"
        @check-change="handleCheckChange"
        node-key="id"
        :show-checkbox="true"
        :accordion="true"
        highlight-current
        ref="treeMenu" :style="{ height: parentHeight*heightRatio-37 + 'px'}" v-loading="treeLoading"
        element-loading-text="拼命加载中"
        :empty-text="emptytext"
      >
      </el-tree>
      <div class="treeControl" v-if="btnShow">
        <el-button type="primary" v-text="btnText" @click="btnClick"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tree',
  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectTree: {},
      treedata2: {}
    };
  },
  props: {
    currentNodeId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '菜单配置'
    },
    btnText: {
      type: String,
      default: '保存权限和配置'
    },
    btnShow: {
      type: Boolean,
      default: false
    },
    propsData: {
      type: Object,
      default: {data: [], haved: []}
    },
    parentHeight: {
      type: Number,
      required: true
    },
    heightRatio: {
      type: Number,
      default: 1
    },
    treeLoading: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    leafOnly: { // true，返回叶子节点
      type: Boolean,
      default: false
    },
    emptytext: {
      type: String,
      default: '暂无数据'
    }
  },
  watch: {
    propsData (newVal) {
      this.renderTree(newVal);
    }
  },
  created () {
  },
  methods: {
    renderTree (data) {
      let USER_TYPE = JSON.parse(localStorage.getItem('BasePlatform_USERINFO')).USER_TYPE;
      let treeNode = [];// 存放根节点
      let treeArr = [];// 存放根节点
      let selectNodesArr = [];
      data.data.forEach(function (item, index) {
        if (item.MENU_LEVEL === '1') {
          treeNode.push({
            id: `s${item.MENU_CODE}`,
            isLeaf: false,
            disabled: USER_TYPE !== '9',
            label: item.MENU_NAME,
            MENU_CODE: item.MENU_CODE,
            children: []
          });
        }
        if (item.MENU_LEVEL === '2') {
          treeArr.push({
            id: `s${item.MENU_CODE}`,
            isLeaf: false,
            disabled: USER_TYPE !== '9',
            label: item.MENU_NAME,
            SUPERIOR_MENU: item.SUPERIOR_MENU,
            MENU_CODE: item.MENU_CODE,
            children: []
          });
        }
      });
      // 将三级节点插入二级节点
      if (treeArr.length > 0) {
        for (let i = 0; i < treeArr.length; i++) {
          let mcode = treeArr[i].MENU_CODE;
          for (let j = 0; j < data.data.length; j++) {
            let supcode = data.data[j].SUPERIOR_MENU;
            if (mcode == supcode) {
              treeArr[i].children.push({
                id: `s${data.data[j].MENU_CODE}`,
                label: data.data[j].MENU_NAME,
                disabled: USER_TYPE !== '9',
                supLabel: treeArr[i].label,
                MENU_LEVEL: data.data[j].MENU_LEVEL,
                MENU_CODE: data.data[j].MENU_CODE,
                OPEN_MODE: data.data[j].OPEN_MODE,
                SUPERIOR_MENU: data.data[j].SUPERIOR_MENU,
                isLeaf: true
              });
            }
          }
        }
      }
      // 插入根节点
      if (treeNode.length > 0) {
        for (let n = 0; n < treeNode.length; n++) {
          let mcode2 = treeNode[n].MENU_CODE;
          for (let m = 0; m < treeArr.length; m++) {
            let supcode3 = treeArr[m].SUPERIOR_MENU;
            if (mcode2 == supcode3) {
              treeNode[n].children.push(treeArr[m]);
            }
          }
        }
        this.treeData = treeNode;
      } else {
        this.treeData = treeArr;
      }
      if (data.haved.length > 0) {
        for (let k = 0; k < data.haved.length; k++) {
          let havedMenuCode = data.haved[k].MENU_CODE;
          if (havedMenuCode.length > 4) {
            selectNodesArr.push({
              id: `s${havedMenuCode}`
            });
          }
          for (let l = 0; l < treeArr.length; l++) {
            if (havedMenuCode.length < 5) {
              if (havedMenuCode === treeArr[l].MENU_CODE && treeArr[l].children.length === 0) {
                selectNodesArr.push({
                  id: `s${havedMenuCode}`
                });
              }
            }
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.treeMenu.setCheckedNodes(selectNodesArr);// 初始化选中的节点
      });
    },
    btnClick () {
      let selectTreeArry = this.$refs.treeMenu.getCheckedNodes(this.leafOnly);
      this.$emit('treeBtnClick', selectTreeArry);
    },
    handleCheckChange (data, checked, indeterminate) {
      this.$emit('checkChange', this.$refs.tree, data, checked, indeterminate);
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>
<style>
  .treeTainer {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .treeTainer .treeInner {
    width: 100%;
  }

  .treeTainer .treeTitle {
    background: #eeeeee;
    color: #333333;
    border: 1px solid #e6ebf5;
    border-top: 2px solid #839098;
    border-bottom: none;
    height: 37px;
    line-height: 37px;
    text-align: center;
  }

  .treeInner .el-tree {
    border: 1px solid #e6ebf5;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding-bottom: 5px;
  }

  .treeInner .el-tree.el-tree-paddingBottom {
    padding-bottom: 60px;
  }

  .treeTainer .treeControl {
    position: absolute;
    bottom: 0px;
    background: #ffffff;
    z-index: 2;
    width: 100%;
    height: 52px;
    line-height: 52px;
    text-align: center;
    border: 1px solid #e6ebf5;
  }
</style>
