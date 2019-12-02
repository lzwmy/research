<template>
  <el-tree :data="dataList" :props="defaultProps" lazy :load="loadNode" @node-click="handleNodeClick"
           :render-content="renderContent" class="ztree combination" node-key="tCode"
           :default-expanded-keys="expandArr">
  </el-tree>
</template>
<script>
import { addClass, hasClass } from 'components/utils/dom';

export default {
  name: 'combination',
  data () {
    return {
      allDataList: [],
      dataList: [],
      areaArr: [],
      tCode: 'area_',
      defaultProps: {
        label: 'tName',
        children: 'children'
      },
      modify: true,
      loading: false,
      expandArr: []
    };
  },
  created () {
    // let list = localStorage.getItem("combinationList")
    // if (list && JSON.parse(list).length > 0) {
    //    this.allDataList = JSON.parse(list)
    //    this.dataList = this.getChildren(this.allDataList, 'area_')
    //    return false
    // }
    this.getDataList();
  },
  updated () {
    this.domUpdate();
  },
  watch: {
    tCode () {
      this.domUpdate();
    }
  },
  methods: {
    renderContent (createElement, {node, data, store}) {
      return createElement('span', [
        createElement('label', {
          'class': {
            'el-tree-node__expand-icon': true,
            ico_area: data.tFlag === 'area' && data.hasChild,
            ico_org: data.tFlag !== 'area',
            org_hasChild: data.tFlag !== 'area' && data.hasChild,
            ico_docu: data.tFlag === 'area' && !data.hasChild
          }
        }), node.label
      ]);
    },
    handleNodeClick (data) {
      this.expandArr.push(data.tCode);
      this.$emit('handleNodeClick', data);
    },
    loadNode (node, resolve) {
      this.tCode = node.data.tCode;
      if (node.level === 0) {
        return resolve(this.dataList);
      }
      this.expandArr.push(this.tCode);
      resolve(this.getChildren(this.allDataList, node.data.tCode));
    },
    domUpdate () {
      this.$nextTick(function () {
        let dom = document.querySelectorAll('.ico_docu');
        for (let i = 0; i < dom.length; i++) {
          addClass(dom[i].parentNode.parentNode.childNodes[0], 'none');
        }
        let dom2 = document.querySelectorAll('.ico_org');
        for (let i = 0; i < dom2.length; i++) {
          if (!hasClass(dom2[i], 'org_hasChild')) {
            addClass(dom2[i].parentNode.parentNode.childNodes[0], 'none');
          }
        }
      });
    },
    getDataList (flag = false, msgFlag = false) {
      var that = this;
      that.$axios({
        method: 'post',
        url: '/CloudPlatform/api/admin/organization/queryCombinationTreeList.json?v=' + (+new Date())
      }).then(function (response) {
        let data = response.data;
        let success = data.success;
        if (success) {
          let list = data.data;
          for (let i = 0; i < list.length; i++) {
            list[i].hasChild = false;
            list[i].invalid = false;
            if (list[i].tParentCode === '_area') {
              list[i].hasChild = true;
            }
          }

          that.allDataList = list;
          if (flag) {
            that.modify = true;
            if (msgFlag) {
              that.$notice('刷新成功');
            }
          }

          that.dataList = that.getChildren(that.allDataList, 'area_');
        } else {
          that.$warning();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    getChildren (list, name = 'area_', ParentCode = 'tParentCode') {
      let array = [];
      let org = [];
      let invalidOrg = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i][ParentCode] === name) {
          array.push(list[i]);
        }
      }

      // 第一次加载的时候，拆分不规则的组织org
      if (this.modify) {
        this.modify = false;
        for (let i = 0; i < list.length; i++) {
          if (list[i].tFlag === 'org' && list[i].tParentCode !== 'area_') {
            org.push(list[i]);
          }
        }
        for (let i = 0; i < org.length; i++) {
          for (let j = 0; j < org.length; j++) {
            if (org[j].tParentCode === org[i].tCode) {
              org[i].hasChild = true;
              break;
            }
          }
        }
        for (let i = 0; i < org.length; i++) {
          for (var j = 0; j < list.length; j++) {
            if (list[j].tCode === org[i].tParentCode) {
              break;
            }
          }
          if (j === list.length) {
            org[i].invalid = true;
            invalidOrg.push(org[i]);
          }
        }
      }

      // 提取没有孩子的区域地址
      for (let i = 0; i < array.length; i++) {
        if (array[i].tFlag === 'area') {
          for (let j = 0; j < this.allDataList.length; j++) {
            if (this.allDataList[j].tParentCode === array[i].tCode) {
              array[i].hasChild = true;
              break;
            }
          }
        }
      }

      this.$emit('hasLoad');
      return array.concat(invalidOrg);
    }
  }
};
</script>
<style>
  .el-tree.ztree {
    font-size: 12px;
    padding: 2px 5px;
    border: none;
  }

  .ztree .el-tree-node__content {
    line-height: 20px;
    height: 20px;
  }

  .ztree .el-tree-node__expand-icon {
    margin: 0;
    width: 18px;
    height: 18px;
    border: none;
    background: url("./zTreeStandard.png") -74px -54px no-repeat;
  }

  .ztree .el-tree-node__expand-icon.none {
    background: none;
    cursor: default;
    -ms-transition: transform .0s ease-in-out;
    transition: transform .0s ease-in-out;
  }

  .ztree .el-tree-node__expand-icon.expanded {
    background-position: -92px 0;
    -ms-transform: rotate(0);
    transform: rotate(0);
  }

  .ztree .el-tree-node__expand-icon.ico_area {
    margin-right: 2px;
    background-position: -109px 1px;
    vertical-align: top;
    *vertical-align: middle
  }

  .is-expanded > .el-tree-node__content .ico_area {
    background-position: -109px -14px;
  }

  .combination.is-current > .el-tree-node__content span:nth-child(2) {
    background: #FFE6B0;
    border: 1px #FFB951 solid;
    width: 160px;
    display: inline-block;
  }

  .ztree .el-tree-node__expand-icon.ico_org {
    background: url(./doctor.png);
    margin-right: 2px;
  }

  .ztree .el-tree-node__expand-icon.ico_docu {
    margin-right: 2px;
    background-position: -110px -31px;
    vertical-align: top;
    *vertical-align: middle
  }

  .ztree .el-tree-node__loading-icon {
    display: none
  }

</style>
