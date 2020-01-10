<template>
  <div class="cloud-component dataDictionary">
    <div class="cloud-search-list" :loading="rightLoading" style="height: 100%;">
      <echarts-contain containType="left" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="0.2">
        <combination2 
          class="dataDictionaryTree" 
          @partNodeClick="handleNodeClick" 
          @endRender="ListenRender"
          @confirmSuccess="drawLeftInit"
          ref="dataDictionaryTree">
        </combination2>
      </echarts-contain>
      <echarts-contain containType="right" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="0.8">
        <div v-if="treeTableList.length == 0" class="noData zwarning">请选择左侧数据字典的分类</div>
        <div class="contain">
          <div v-for="(categories, index) in treeTableList" :key="index">
            <div class="lable categories flex-between-center" v-if="categories.name">
              <div class="cur_pointer" style="flex:1;">
                <span class="ico_open" v-if="categories.modules"></span>
                <span class="ico_close" v-else></span>
                <span class="title" @dblclick="$refs.dataDictionaryTree.showDialog('编辑类别', categories)">{{categories.name}}</span>
              </div>
              <div class="icon_group">
                <i class="cur_pointer icon iconfont icontianjia" @click="showModulesDialog(categories, '新增节点')"></i>
                <i class="cur_pointer icon iconfont iconjian" @click="showDeleteDialog(categories,1)"></i>
              </div>
            </div>
            <div class="content" v-for="module in categories.modules" :key="module.id" :id="module.id">
              <div class="lable modules flex-between-center" >
                <div @dblclick="showModulesDialog(module, '编辑节点')">
                  <span class="ico_open" v-if="module.modules"></span>
                  <span class="ico_close" v-else></span>
                  <span class="title">{{module.name}}</span>
                </div>
                <div @click="handleNodeClick(module,true)" style="flex: 1; height: 24px;"></div>
                <div class="icon_group">
                  <i class="cur_pointer icon iconfont icontianjia" @click="showElementDialog(module, '新增字段')"></i>
                  <i class="cur_pointer icon iconfont iconjian" @click="showDeleteDialog(module,2)"></i>
                </div>
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
                        <div v-for="(item, index) in allControlType" :key="index">
                          <span v-if="scope.row.ctrlType == item.value">{{item.name}}</span>
                        </div>
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
                    <el-table-column label="操作" width="120">
                      <template slot-scope="scope">
                        <el-button type="text" @click="showElementDialog(scope.row, '编辑字段', module)"><i class="iconfont iconbianji"></i></el-button>
                        <el-button type="text" @click="showDeleteDialog(scope.row,3)"><i class="iconfont iconshanchu del"></i></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </echarts-contain>

      <!--新增/编辑模块-->
      <el-dialog 
        :title="dialogFormModule.title" 
        :visible.sync="dialogFormModule.visible" 
        :append-to-body="true" 
        width="600px"
        @close="closeDialog"
        class="height_auto">
        <el-form ref="dialogFormModule" :model="dialogFormModule" :rules="rules" label-width="100px" label-position="left" class="el-dialog--center" @submit.native.prevent>
          <el-form-item label="节点名称：" align="left" prop="moduleName">
            <el-input v-model.trim="dialogFormModule.moduleName" placeholder="请输入" :maxlength="30" clearable @keyup.enter.native="confirmModule"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="confirmModule" size="mini" :disabled="dialogFormModule.loading">确 定</el-button>
          <el-button @click="closeDialog" size="mini">关 闭</el-button>
        </div>
      </el-dialog>

      <!--新增/编辑字段 -->
      <el-dialog 
        :title="dialogFormElement.title" 
        :visible.sync="dialogFormElement.visible" 
        :append-to-body="true" 
        width="600px"
        @close="closeDialog">
        <el-form ref="dialogFormElement" :model="dialogFormElement" :rules="rules" label-width="100px" label-position="left" class="el-dialog--center" @submit.native.prevent>
          <el-form-item label="字段名：" align="left" prop="elementName">
            <el-input v-model.trim="dialogFormElement.elementName" placeholder="请输入" :maxlength="30" clearable></el-input>
          </el-form-item>
          <el-form-item label="控件类型：" align="left" prop="controlType">
            <el-select v-model="dialogFormElement.controlType" placeholder="请选择" class="block">
              <el-option v-for="(item, index) in allControlType" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值域：" align="left" 
          :prop="['SINGLE_COMBOX','MULTI_COMBOX','RADIO_BUTTON','CHECKBOX'].includes(dialogFormElement.controlType)?'range':''">
            <el-input type="textarea" v-model.trim="dialogFormElement.range" :rows="4" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="描述：" align="left" prop="describe">
            <el-input type="textarea" v-model.trim="dialogFormElement.describe" :rows="3" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="editElement" size="mini" :disabled="dialogFormElement.loading">确 定</el-button>
          <el-button @click="closeDialog" size="mini">关 闭</el-button>
        </div>
      </el-dialog>

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
      isEndRender: false,
      dialogFormModule: {
        visible: false,
        loading: false,
        title: '',
        id: '',
        moduleName: '',
        categoryId: "",
      },
      dialogFormElement: {
        visible: false,
        loading: false,
        title: '',
        id: '',
        moduleId: '',
        elementName: '',
        controlType: '',
        range: '',
        describe: '',
      },
      treeNode: {},
      allControlType: [
        {
          name:"单行文本框",
          value:'SINGLE_INPUT'
        },
        {
          name:"多行文本框",
          value:"MULTI_INPUT"
        },
        {
          name:"标签",
          value:"LABEL"
        },
        {
          name:"日期",
          value:"DATE"
        },
        {
          name:"日期时间",
          value:"DATE_TIME"
        },
        {
          name:"数值",
          value:"NUMBER_INPUT"
        },
        {
          name:"单选下拉",
          value:"SINGLE_COMBOX"
        },
        {
          name:"多选下拉",
          value:"MULTI_COMBOX"
        },
        {
          name:"单选框",
          value:"RADIO_BUTTON"
        },
        {
          name:"多选框",
          value:"CHECKBOX"
        },
        {
          name:"集合",
          value:"GATHER"
        },
        {
          name:"表格",
          value:"TABLE"
        },
        {
          name:"文件上传",
          value:"FILE_UPLOAD"
        },
        {
          name:"评分",
          value:"SCORE"
        },
        {
          name:"级联控件",
          value:"CASCADE"
        },
        {
          name:"滑块控件",
          value:"SLIDER"
        }
      ],
      rules: {
        moduleName: [{required: true, message: '请输入节点名称', trigger: 'change'}],
        elementName: [{required: true, message: '请输入字段名称', trigger: 'change'}],
        controlType: [{required: true, message: '请选择控件类型', trigger: 'change'}],
        range: [{required: true, message: '请输入值域', trigger: 'change'}],
      }
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
  created() {
  },
  methods: {
    initPage () {
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
    },
    ListenRender (val) {
      this.isEndRender = val;
    },
    async drawLeftInit () {
      this.dialogFormModule.visible = false;
      this.dialogFormElement.visible = false;
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
    async handleNodeClick (treeNode, right = false, isUpdateView = true) {
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
        if (!treeNode.modules || !isUpdateView) {
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
              let treeNodeParentNode = treeNode.getParentNode();
              treeNodeParentNode.modules.forEach(module => {
                if (module.id === treeNode.id) {
                  module.modules = treeNode.modules;
                  that.$nextTick(() => {
                    if(isUpdateView) {
                      that.scrollToPosition(module.id);
                    }
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
                    if(isUpdateView) {
                      that.scrollToPosition(module.id);
                    }
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
          if(isUpdateView) {
            that.$nextTick(() => {
              that.scrollToPosition(treeNode.id, 2, treeNode.getParentNode().id);
            });
          }
        }, 100);
      }
    },
    scrollToPosition (id, level, parentId) {
      let moduleDiv;
      if (level == 2) {
        moduleDiv = document.getElementById(parentId);
      } else {
        moduleDiv = document.getElementById(id);
      }
      Array.prototype.forEach.call(document.getElementsByClassName('lable modules'), (item) => {
        item.classList.remove('active')
      });
      if(!moduleDiv) {
        return;
      }
      moduleDiv.getElementsByClassName('lable')[0].classList.add('active');
      let topLength = moduleDiv.offsetTop - document.documentElement.scrollTop;// div离屏幕上边距离（长度）
      // console.log(topLength);
      document.getElementsByClassName('rightContain')[0].scrollTop = topLength;
    },
    handleRowStyle ({row, column, rowIndex, columnIndex}) {
      if (row.id === this.currentId) {
        return {'background': '#1bbae1', color: '#fff'};
      }
    },
    //增加or编辑模块
    confirmModule () {
      this.$refs.dialogFormModule.validate(async (valid) => {
        let that = this;
        if (!valid) {
          return false;
        }
        let formData, res;
        try {
          if(this.dialogFormModule.title == '编辑节点') {
            formData = {
              "id": this.dialogFormModule.id,
              "categoryId": this.dialogFormModule.categoryId,
              "elNameCN": this.dialogFormModule.moduleName,
            }
            res = await this.$http.crfeditModule(formData);
          }else {
            formData = {
              "categoryId": this.dialogFormModule.categoryId,
              "elNameCN": this.dialogFormModule.moduleName,
            }
            res = await this.$http.crfaddModule(formData);
          }
          if (res.code == '0') {
            this.$message.success(this.dialogFormModule.title+'成功');
            this.$refs.dataDictionaryTree.initPage().then(()=>{
              this.drawLeftInit()
            })
          }
        } catch (err) {
          console.log(err)
        }
      });
    },
    //增加字段
    async addElement () {
      let formData = {
        "elNameCN": this.dialogFormElement.elementName,
        "descriptionCN": this.dialogFormElement.describe || '',
        "moduleId": this.dialogFormElement.moduleId,
        "ctrlType": this.dialogFormElement.controlType,
        "valueRange": this.dialogFormElement.range || ''
      }
      try {
        let res = await this.$http.crfaddElement(formData);
        if (res.code == '0') {
          this.$message.success('添加成功')
          // this.$refs.dataDictionaryTree.initPage().then(()=>{
            this.drawLeftInit()
          // })
        }
      } catch (err) {
        console.log(err)
      }
    },
    //编辑字段
    editElement () {
      this.$refs.dialogFormElement.validate(async (valid) => {
        let that = this;
        if (!valid) {
          return false;
        }
        if(this.dialogFormElement.title == '新增字段') {
          this.addElement();
          return;
        }
        let formData = {
          'id': this.dialogFormElement.id,
          "elNameCN": this.dialogFormElement.elementName,
          "descriptionCN": this.dialogFormElement.describe || '',
          "moduleId": this.dialogFormElement.moduleId,
          "ctrlType": this.dialogFormElement.controlType,
          "valueRange": this.dialogFormElement.range || ''
        }
        try {
          let res = await this.$http.crfeditElement(formData);
          if (res.code == '0') {
            this.$message.success('编辑成功')
            this.handleNodeClick(this.treeNode, true, false)
            this.dialogFormElement.visible = false;
          }
        } catch (err) {
          console.log(err)
        }
      });
    },
    async deleteCategory (row) {
      let formData = {
          categoryId: row.id
        }
        try {
          let res = await this.$http.crfdeleteCategory(formData);
          if (res.code == '0') {
            this.$message.success('删除成功')
            this.$refs.dataDictionaryTree.initPage().then(()=>{
              this.drawLeftInit()
            })
          }
        } catch (err) {
          console.log(err)
        }
    },
    async deleteModule (row) {
      let formData = {
          moduleId: row.id
        }
        try {
          let res = await this.$http.crfdeleteModule(formData);
          if (res.code == '0') {
            this.$message.success('删除成功')
            this.$refs.dataDictionaryTree.initPage().then(()=>{
              this.drawLeftInit()
            })
          }
        } catch (err) {
          console.log(err)
        }
    },
    async deleteElement (row) {
      console.log(row)
      let formData = {
          elementId: row.id
        }
        try {
          let res = await this.$http.crfdeleteElement(formData);
          if (res.code == '0') {
            this.$message.success('删除成功')
            this.$refs.dataDictionaryTree.initPage().then(()=>{
              this.drawLeftInit()
            })
          }
        } catch (err) {
          console.log(err)
        }
    },
    showElementDialog (row, title, module) {
      this.treeNode = module;
      console.log(row)
      if (title == '编辑字段') {
        this.dialogFormElement = {
          visible: true,
          loading: false,
          title: title,
          id: row.id,
          moduleId: row.moduleId,
          elementName: row.elNameCN,
          controlType: row.ctrlType,
          range: row.valueRange,
          describe: row.descriptionCN
        }
        return;
      }
      this.dialogFormElement.title = title;
      this.dialogFormElement.moduleId = row.id;
      this.dialogFormElement.visible = true;
    },
    showModulesDialog (row, title) {
      console.log(row)
      if(title == '编辑节点') {
        this.dialogFormModule.id = row.id;
        this.dialogFormModule.categoryId = row.categoryId;
        this.dialogFormModule.moduleName = row.name;
      }else {
        this.dialogFormModule.categoryId = row.id;
      }
      this.dialogFormModule.title = title;
      this.dialogFormModule.visible = true;
    },
    showDeleteDialog(row,type) {
      console.log(row)
      this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          switch (type) {
            case 1:
              this.deleteCategory(row);break;
            case 2:
              this.deleteModule(row);break;
            case 3:
              this.deleteElement(row); break;
            default:
              break;
          }
        })
    },
    closeDialog () {
      this.$refs.dialogFormModule && this.$refs.dialogFormModule.resetFields();
      this.$refs.dialogFormElement && this.$refs.dialogFormElement.resetFields();
      this.dialogFormModule = utils.initForm(this.dialogFormModule);
      this.dialogFormElement = utils.initForm(this.dialogFormElement);
    },
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
    .categories {
      .icon_group { 
        margin-right: 15px;
        .icon {
          color: #666;
          margin-right: 10px;
        }
      }
    }
    .modules {
      .icon_group {
        .icon {
          color: #666;
          margin-right: 8px;
        }
      }
    }
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


  body {
    .dataDictionary .contain .lable.active {
      color: #fff;
      background-color: #1bbae1;
    }
    .dataDictionary .contain .lable.modules:hover {
      color: #fff;
      background-color: #1bbae1;
    }

    .dataDictionary .leftContain {
      border-top: 2px solid #1bbae1 !important;
    }
  }
</style>
