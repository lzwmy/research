<template>
  <div class="cloud-component dataDictionary">
    <div class="cloud-search-list">
      <echarts-contain containType="left" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="0.2">
        <combination2 class="dataDictionaryTree" @partNodeClick="handleNodeClick" @endRender="ListenRender"
                      ref="dataDictionaryTree"></combination2>
      </echarts-contain>
      <echarts-contain containType="right" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="0.8"
                       :loading="rightLoading">
        <div v-if="treeTableList.length == 0" class="noData zwarning">请选择左侧数据字典的分类</div>
        <div class="contain">
          <div v-for="categories in treeTableList">
            <div class="lable categories" v-if="categories.name">
              <span class="ico_open" v-if="categories.modules"></span>
              <span class="ico_close" v-else></span>
              <span class="title">{{categories.name}}</span>
            </div>
            <div class="content" v-for="module in categories.modules" :key="module.id" :id="module.id">
              <div class="lable modules" @click="handleNodeClick(module,true)">
                <span class="ico_open" v-if="module.modules"></span>
                <span class="ico_close" v-else></span>
                <span class="title">{{module.name}}</span>
              </div>
              <div class="content">
                <div class="global-nest-item-child" v-if="module.modules">
                  <el-table :data="module.modules" style="width: 100%" border
                            :empty-text="emptyText" :element-loading-text="elementLoadingText"
                            highlight-current-row :cell-style="handleRowStyle" v-if="tableRenderAgain">
                    <el-table-column prop="name" label="字段名" min-width="10%">
                      <template slot-scope="scope">
                        <div :id="scope.row.id">{{scope.row.name}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ctrlType" label="表单类型" min-width="5%" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="scope.row.ctrlType == '1-1'">单行输入框</span>
                        <span v-if="scope.row.ctrlType == '1-2'">多行输入框</span>
                        <span v-if="scope.row.ctrlType == '2-1'">下拉单选</span>
                        <span v-if="scope.row.ctrlType == '2-2'">下拉复选</span>
                        <span v-if="scope.row.ctrlType == '2-3'">单选框</span>
                        <span v-if="scope.row.ctrlType == '2-4'">复选框</span>
                        <span v-if="scope.row.ctrlType == '3-1'">日期</span>
                        <span v-if="scope.row.ctrlType == '3-2'">时间</span>
                        <span v-if="scope.row.ctrlType == '3-3'">日期时间</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="dataType" label="字段类型" min-width="5%" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="scope.row.dataType == '1'">数字</span>
                        <span v-if="scope.row.dataType == '2'">文本</span>
                        <span v-if="scope.row.dataType == '3'">时间</span>
                        <span v-if="scope.row.dataType == '4'">日期</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="valueRange" label="值域" min-width="5%" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="validationType" label="验证方式" min-width="5%" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="scope.row.validationType == '0'">无</span>
                        <span v-if="scope.row.validationType == '1'">必填</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="validationRegex" label="验证正则" min-width="8%" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="descriptionCN" label="描述" min-width="10%" show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </echarts-contain>
    </div>
  </div>
</template>

<script type="text/javascript">
import mixins from 'components/mixins';
import combination2 from 'components/packages/tree/combination2';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { emptyText, elementLoadingText } from 'components/utils/constant';
import utils from 'components/utils';

export default {
  name: 'dataDictionary',
  mixins: [mixins],
  data () {
    return {
      treeTableList: {},
      rightLoading: false,
      emptyText: '',
      elementLoadingText: '',
      tableRenderAgain: true,
      isEndRender: false
    };
  },
  components: {
    combination2,
    echartsContain
  },
  watch: {
    isEndRender () {
      this.drawLeftInit();
    }
  },
  computed: {
    // 分别代表两种风格:green,blue
    ccstyle () {
      let ccstyle = this.$store.state.user.ccstyle || localStorage.getItem('research_ccstyle') || 'theme-blue';
      if (ccstyle == 'theme-green') {
        ccstyle = '#1bd0a1';
      } else if (ccstyle == 'theme-blue') {
        ccstyle = '#2d8cf0';
      } else {
        ccstyle = '#2d8cf0';
      }
      return ccstyle;
    }
  },
  created () {

  },
  mounted () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
    },
    ListenRender (val) {
      this.isEndRender = val;
    },
    async drawLeftInit () {
      let that = this;
      let treeObj = $.fn.zTree.getZTreeObj(that.$refs.dataDictionaryTree.$refs.treeDemo.id);// 获取到树
      /* 获取所有树节点 */
      // let nodes = treeObj.transformToArray(treeObj.getNodes());
      let nodesSys = treeObj.getNodes(); // 可以获取所有的父节点
      // 展开第一级树
      nodesSys.forEach(node => {
        treeObj.expandNode(node, true);
      });
      that.treeTableList = utils.deepClone(nodesSys);
    },
    async handleNodeClick (treeNode, right = false) {
      let that = this;
      that.rightLoading = true;
      if (treeNode.level == 0) {
        setTimeout(() => {
          that.rightLoading = false;
          that.treeTableList = [treeNode];
        }, 100);
        return false;
      }
      if (treeNode.level == 1 && right) {
        if (!treeNode.modules) {
          let formate = {
            id: treeNode.id
          };
          try {
            let data = await that.$http.crfFindElements(formate);
            if (data.code == '0' && data.data) {
              let elements = data.data.elements;
              elements.forEach(el => {
                el.name = el.elNameCN || el.elNameEN;
              });
              treeNode.modules = elements;
              // console.warn(treeNode);
              let treeNodeParentNode = treeNode.getParentNode();
              treeNodeParentNode.modules.forEach(module => {
                if (module.id === treeNode.id) {
                  module.modules = treeNode.modules;
                  that.$nextTick(() => {
                    that.scrollToPosition(module.id);
                    that.rightLoading = false;
                    return false;
                  });
                }
              });
              that.treeTableList = [treeNode.getParentNode()];
            }
          } catch (error) {
            that.$notice('获取模块下的元素失败');
            console.log(error);
          }
        } else if (treeNode.modules) {
          treeNode.modules = null;
          that.treeTableList = [treeNode.getParentNode()];
          that.rightLoading = false;
          return false;
        }
      } else if (treeNode.level == 1 && !right) {
        if (!treeNode.modules) {
          let formate = {
            id: treeNode.id
          };
          try {
            let data = await that.$http.crfFindElements(formate);
            if (data.code == '0' && data.data) {
              let elements = data.data.elements;
              elements.forEach(el => {
                el.name = el.elNameCN || el.elNameEN;
              });
              let treeNodeTemp = utils.deepClone(treeNode);
              treeNodeTemp.modules = elements;
              let treeNodeTempParentNode = treeNodeTemp.getParentNode();
              treeNodeTempParentNode.modules.forEach(module => {
                if (module.id === treeNode.id) {
                  module.modules = treeNode.modules;
                  that.$nextTick(() => {
                    that.scrollToPosition(module.id);
                    that.rightLoading = false;
                    return false;
                  });
                }
              });
              that.treeTableList = [treeNodeTemp.getParentNode()];
            }
          } catch (error) {
            that.$notice('获取模块下的元素失败');
            console.log(error);
          }
        } else if (treeNode.modules) {
          let treeNodeTempParentNode = treeNode.getParentNode();
          treeNodeTempParentNode.modules.forEach(module => {
            if (module.id === treeNode.id) {
              setTimeout(() => {
                module.modules = treeNode.modules;
                that.$nextTick(() => {
                  that.scrollToPosition(module.id);
                  that.rightLoading = false;
                  return false;
                });
              }, 100);
            }
          });
          that.treeTableList = [treeNode.getParentNode()];
        }
      }
      if (treeNode.level == 2) {
        // debugger
        that.tableRenderAgain = false;
        that.currentId = treeNode.id;
        let parentNodeCategories = treeNode.getParentNode().getParentNode();
        that.treeTableList = [parentNodeCategories];
        setTimeout(() => {
          that.rightLoading = false;
          that.tableRenderAgain = true;
          that.$nextTick(() => {
            that.scrollToPosition(treeNode.id, 2, treeNode.getParentNode().id);
          });
        }, 100);
      }
    },
    scrollToPosition (id, level, parentId) {
      // debugger;
      let moduleDiv;
      if (level == 2) {
        moduleDiv = document.getElementById(parentId);
      } else {
        moduleDiv = document.getElementById(id);
      }
      Array.prototype.forEach.call(document.getElementsByClassName('lable modules'), (item) => {
        item.className = 'lable modules';
      });
      moduleDiv.getElementsByClassName('lable')[0].className = 'lable modules active';
      // console.log(moduleDiv);
      let topLength = moduleDiv.offsetTop - document.documentElement.scrollTop;// div离屏幕上边距离（长度）
      // console.log(topLength);
      document.getElementsByClassName('rightContain')[0].scrollTop = topLength;
    },
    handleRowStyle ({row, column, rowIndex, columnIndex}) {
      if (row.id === this.currentId) {
        return {'background': this.ccstyle, color: '#fff'};
      }
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

<style lang="less">
  .dataDictionary .leftContain {
    border: 1px solid #d2d1cc;
  }

  .dataDictionary .rightContain {
    border: 1px solid #d2d1cc;
    padding: 5px;
    overflow: auto !important;
  }

  .dataDictionary .noData {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  .dataDictionary .contain .lable {
    color: #888;
    font-size: 16px;
    padding: 3px 5px;
    background-color: #edf1f2;
    border-radius: 2px;
  }

  .dataDictionary .contain .lable.modules {
    cursor: pointer;
  }

  .dataDictionary .contain .ico_open:before {
    content: '';
    display: inline-block;
    line-height: 0;
    margin: 0;
    width: 18px;
    height: 18px;
    border: 0 none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-image: url('./images/zTreeStandard.png');
    margin-right: 2px;
    background-position: -108px -14px;
    vertical-align: top;
  }

  .dataDictionary .contain .ico_close:before {
    content: '';
    display: inline-block;
    line-height: 0;
    margin: 0;
    width: 18px;
    height: 18px;
    border: 0 none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-image: url('./images/zTreeStandard.png');
    margin-right: 2px;
    background-position: -110px 2px;
    vertical-align: top;
  }

  .dataDictionary .contain .content {
    margin-top: 5px;
    padding-left: 15px;
    border-top: none;
  }

  .dataDictionary .global-nest-item-child {
    padding: 3px 0;
    background: #fff;
  }

  .dataDictionary .ztree li span.button.chk {
    display: none;
  }

  .dataDictionary .dataDictionaryTree .el-input {
    padding: 5px 5px 0 5px;
  }

  body.theme-green {
    .dataDictionary .contain .lable.active {
      color: #fff;
      background-color: #1ab497;
    }
    .dataDictionary .contain .lable.modules:hover {
      color: #fff;
      background-color: #1ab497;
    }

    .dataDictionary .leftContain {
      border-top: 2px solid #00d1a0 !important;
    }
  }

  body.theme-blue {
    .dataDictionary .contain .lable.active {
      color: #fff;
      background-color: #2d8cf0;
    }
    .dataDictionary .contain .lable.modules:hover {
      color: #fff;
      background-color: #2d8cf0;
    }

    .dataDictionary .leftContain {
      border-top: 2px solid #2d8cf0 !important;
    }
  }
</style>
