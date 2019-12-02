<template>
  <el-tree ref="modelTree" :data="dataList" :props="defaultProps" lazy :load="loadNode" @node-click="handleNodeClick"
           :render-content="renderContent" class="model" :default-expanded-keys="expandArr"
           :highlight-current="true">
  </el-tree>
</template>
<script>
export default {
  name: 'modelAttributeTree',
  data () {
    return {
      dataList: [],
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      loading: false,
      expandArr: []
    };
  },
  created () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.getTreeData();
    },
    renderContent (createElement, {node, data, store}) {
      let that = this;
      return createElement('span', {
        'class': {
          'el-tree-node__label-ul': true
        },
        on: {// 鼠标右键事件
          '!contextmenu': function (event) {
            that.$emit('open', event, data);
            event.preventDefault();
          }
        }
      }, [
        createElement('label'), node.label
      ]);
    },
    handleNodeClick (data) {
      this.expandArr.push(data.id);
      this.$emit('closeMenu');
      this.$emit('getTreeNode', data);
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.dataList);
      }
      this.expandArr.push(node.data.id);
      this.getTreeData(node.data.TYPE_LEVEL, node.data.id, resolve);
    },
    getTreeData (typeLevel = 0, parentId = '', callback = null, typeLevelZeroRefresh = false) {
      //        debugger
      let that = this;
      let formData = {};
      let actionUrl = '';
      console.log(typeLevel);
      if (typeLevel > 2) {
        let cb = [];
        callback(cb);
        return false;
      }
      if ((typeLevel == 1 || typeLevel == 2) && !parentId) {
        let cb = [];
        callback(cb);
        return false;
      }
      if (typeLevel == 0) {
        formData = {
          'name': ''
        };
        actionUrl = '/svcmgt/find_list_by_name.do?t=' + (+new Date());
      } else if (typeLevel == 1) {
        formData = {
          'serviceId': parentId
        };
        actionUrl = '/business/find_list_by_serviceid.do?t=' + (+new Date());
      } else if (typeLevel == 2) {
        formData = {
          'businessId': parentId
        };
        actionUrl = '/event/find_list_by_businessid.do?t=' + (+new Date());
      }

      if (typeLevel === 0 && !typeLevelZeroRefresh) {
        let TREE_ZERO = JSON.parse(localStorage.getItem('TREE_ZERO'));
        if (TREE_ZERO && TREE_ZERO.length > 0) {
          this.dataList = TREE_ZERO;
          return false;
        }
      }

      that.$axios({
        method: 'post',
        url: actionUrl,
        data: formData
      }).then(function (response) {
        let data = response.data;
        if (data.code == '0' && data.msg == 'Success') {
          let list = data.data;
          for (let i = 0; i < list.length; i++) {
            list[i].TYPE_LEVEL = typeLevel + 1;
          }
          if (typeLevel === 0) {
            that.dataList = list;
            localStorage.setItem('TREE_ZERO', JSON.stringify(list));
          } else if (typeLevel === 2) {
            list.forEach(item => {
              item.leaf = true;
            });
            callback(list);
          } else {
            callback(list);
          }
        } else {
          that.dataList = [];
          that.$notice('树数据查询失败！');
        }
      }).catch(function (error) {
        that.dataList = [];
        that.$notice('树数据查询失败！');
        console.log(error);
      });
    }
  }
};
</script>
<style>
  body.theme-blue .model.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: #81bbff;
    color: #fff;
  }

  body.theme-green .model.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: #1bd0a1;
    color: #fff;
  }

  .el-tree.model {
    font-size: 12px;
    border: none;
  }

  .el-tree.model .el-tree-node {
    margin-bottom: 0px !important;
  }

  .el-tree.model .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    position: relative;
    background: #eeeeee;
    border-bottom: 1px solid #d8dde3;
    padding-left: 12px;
    display: block;
  }

  .el-tree.model .el-tree-node.is-current > .el-tree-node__content ul {
    display: block;
  }

  .model.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__expand-icon {
    color: #fff;
  }

  .model.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }

  .lil-context-menu ul {
    width: 50px;
    list-style: none;
    outline: none;
    margin: 0;
    padding: 0;
    background: #c1c1c1;
    z-index: 100;
    text-align: center;
  }

  .lil-context-menu {
    position: fixed;
    z-index: 999;
  }

  .lil-context-menu:focus {
    outline: none;
  }

  .el-tree.model .el-tree-node__content > .el-tree-node__label-ul {
    width: calc(100% - 24px);
    display: inline-block;
  }

  .lil-context-menu ul li {
    line-height: 23px;
    height: 23px;
    cursor: pointer;
  }

  .lil-context-menu ul li:hover {
    background: #555;
    color: #fff
  }

  .model .el-tree-node__expand-icon.none {
    background: none;
    cursor: default;
    -ms-transition: transform .0s ease-in-out;
    transition: transform .0s ease-in-out;
  }

  .model.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__loading-icon {
    color: #fff;
  }


</style>
