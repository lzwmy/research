<template>
  <el-tree ref="provinceTree" :data="dataList" :props="defaultProps" lazy :load="loadNode" @node-click="handleNodeClick"
           :render-content="renderContent" class="province" :default-expanded-keys="expandArr"
           :highlight-current="true">
  </el-tree>
</template>
<script>
export default {
  name: 'province',
  data () {
    return {
      dataList: [],
      defaultProps: {
        label: 'AREA_NAME',
        children: 'children'
      },
      loading: false,
      expandArr: []
    };
  },
  props: {
    regionVersion: {
      type: String,
      required: true
    }
  },
  watch: {
    regionVersion (val, oldVal) {
      this.initPage();
    }
  },
  created () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.getArea();
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
      this.expandArr.push(data.REGION_CODE);
      this.$emit('closeMenu');
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.dataList);
      }
      this.expandArr.push(node.data.REGION_CODE);
      this.getArea(node.data.AREA_LEVEL, node.data.REGION_CODE, resolve);
    },
    getArea (areaLevel = 0, parentCode = '', callback = null, areaLevelZeroRefresh = false) {
      //        debugger
      let that = this;
      if (!that.regionVersion) {
        return false;
      }
      if (areaLevel === 5) {
        return false;
      }
      if (areaLevel === 0 && !areaLevelZeroRefresh) {
        let AREALEVEL_ZERO = JSON.parse(sessionStorage.getItem(that.regionVersion + '_AREALEVEL_ZERO'));
        // console.log(AREALEVEL_ZERO);
        if (AREALEVEL_ZERO && AREALEVEL_ZERO.length > 0) {
          this.dataList = AREALEVEL_ZERO;
          return false;
        }
      }
      let Global = JSON.parse(sessionStorage.getItem('Global'));
      let CONSUMER_ID = sessionStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
      let SERVICE_CODES = 'bull.BasePlatInterface.Get_tb_admindivision_cascade';
      that.$axios({
        method: 'get',
        url: '/std/region/getRegionByRegionLevel?t=' + (+new Date()),
        params: that.$format({
          'VERSION_CODE': that.regionVersion,
          'AREA_LEVEL': areaLevel,
          'REGION_CODE': parentCode,
          'SERVICE_CODE': SERVICE_CODES,
          'CONSUMER_ID': CONSUMER_ID,
          'esblover': false
        })
      }).then(function (response) {
        let data = response.data;
        if (data.SYS_HEAD.RET_STATUS == 'S') {
          let list = data.BODY.data;
          for (let i = 0; i < list.length; i++) {
            list[i].AREA_LEVEL = areaLevel + 1;
          }
          if (areaLevel === 0) {
            that.dataList = list;
            sessionStorage.setItem(that.regionVersion + '_AREALEVEL_ZERO', JSON.stringify(list));
          } else {
            callback(list);
          }
        } else {
          this.$warning();
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
};
</script>
<style>
  .el-tree.province {
    font-size: 12px;
    border: none;
  }

  .el-tree.province .el-tree-node {
    margin-bottom: 0px !important;
  }

  .el-tree.province .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    position: relative;
    background: #eeeeee;
    border-bottom: 1px solid #d8dde3;
    padding-left: 12px;
    display: block;
  }

  .el-tree.province .el-tree-node.is-current > .el-tree-node__content ul {
    display: block;
  }

  .province.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: #edfff6
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

  .el-tree.province .el-tree-node__content > .el-tree-node__label-ul {
    padding-left: 10px;
    display: block;
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

  .province .el-tree-node__expand-icon {
    margin: 0;
    width: 18px;
    height: 18px;
    border: none;
    display: none;
  }

  .province .el-tree-node__expand-icon.none {
    background: none;
    cursor: default;
    -ms-transition: transform .0s ease-in-out;
    transition: transform .0s ease-in-out;
  }

  .province .el-tree-node__expand-icon.expanded {
    background-position: -92px 0;
    -ms-transform: rotate(0);
    transform: rotate(0);
  }

  .province .el-tree-node__expand-icon.ico_area {
    margin-right: 2px;
    background-position: -109px 1px;
    vertical-align: top;
    *vertical-align: middle
  }

  .is-expanded > .el-tree-node__content .ico_area {
    background-position: -109px -14px;
  }

  .province .el-tree-node__expand-icon.ico_org {
    background: url(./doctor.png);
    margin-right: 2px;
  }

  .province .el-tree-node__expand-icon.ico_docu {
    margin-right: 2px;
    background-position: -110px -31px;
    vertical-align: top;
    *vertical-align: middle
  }

  .province .el-tree-node__loading-icon {
    display: none
  }


</style>
