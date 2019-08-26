<template>
  <div class="roleTainer">
    <div class="roleInner" :style="{ height: parentHeight*heightRatio + 'px'}">
      <!--<div class="roleTitle" v-text="title"></div>-->
      <el-table :data="propsData" style="width: 100%" v-loading="roleLoading" :empty-text="roleEmptyText"
                :style="{ height: parentHeight*heightRatio-37 + 'px'}"
                stripe>
        <el-table-column :label="title" min-width="8%">
          <template slot-scope="scope">
            <el-checkbox v-model="checkList" :label="scope.row.ROLE_CODE">{{scope.row.ROLE_NAME}}</el-checkbox>
          </template>
        </el-table-column>

      </el-table>
      <!--      <div class="role-content" :style="{ height: parentHeight*heightRatio-37 + 'px'}" v-loading="roleLoading" :empty-text="emptytext">
              <el-checkbox-group v-model="checkList">
              <div v-for="item in propsData" class="role-item" >
                  <el-checkbox  :label="item.ROLE_CODE">{{item.ROLE_NAME}}</el-checkbox>
              </div>
              </el-checkbox-group>
            </div>-->

      <div class="roleControl" v-if="btnShow">
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
      checkList: []
    };
  },
  props: {
    currentNodeId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '角色配置'
    },
    btnText: {
      type: String,
      default: '保存角色和配置'
    },
    btnShow: {
      type: Boolean,
      default: false
    },
    propsData: {
      type: Array,
      default: []
    },
    parentHeight: {
      type: Number,
      required: true
    },
    heightRatio: {
      type: Number,
      default: 1
    },
    roleLoading: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    roleEmptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  watch: {},
  created () {
  },
  methods: {
    btnClick () {
      let arrObj = [];
      let checkList = this.checkList;

      if (checkList.length > 0) {
        for (let item of checkList) {
          arrObj.push({'ROLE_CODE': item});
        }
      }
      this.$emit('roleBtnClick', arrObj);
    }
  }
};
</script>
<style>
  .role-item {
    border-bottom: 1px solid #eeeeee;
    padding: 10px;
  }

  .role-content {
    border: 1px solid #eee;
    border-bottom: none;
    position: relative;
  }

  .roleTainer {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .roleTainer .roleInner {
    width: 100%;
  }

  .roleTainer .roleTitle {
    background: #eeeeee;
    color: #333333;
    border: 1px solid #e6ebf5;
    border-top: 2px solid #839098;
    border-bottom: none;
    height: 37px;
    line-height: 37px;
    text-align: center;
  }

  .roleInner .el-tree {
    border: 1px solid #e6ebf5;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding-bottom: 5px;
  }

  .roleInner .el-tree.el-tree-paddingBottom {
    padding-bottom: 60px;
  }

  .roleTainer .roleControl {
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

  .roleTainer .el-table th > .cell {
    text-align: center;
  }
</style>
