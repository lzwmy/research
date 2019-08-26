<template>
  <!--数据连接管理-->
  <div class="cloud-component clearfix">
    <div class="crfConfig clearfix crffill">
      <div class="crf-main" v-loading="mainLoading">
        <div class="crf-main-content"
             v-if="crfData && crfData.crfForm && crfData.crfForm.therapyStages && crfData.crfForm.therapyStages.length > 0">
          <div class="crf-step-header">
            <h4>病人姓名:{{$route.query.patientName}}</h4>
            <!--分组id:{{$route.query.groupId}}-->
            <!--专病id:{{$route.query.diseaseId}}-->
          </div>
          <div class="crf-step-content">
            <el-form :model="crfData.crfForm" ref="crfForm" label-width="150px" :label-position="lablePosition">
              <div class="crf-step" v-for="(item,index) in crfData.crfForm.therapyStages" :key="index" :index="index">
                <h3 class="crf-step-h3">{{item.name}}</h3>
                <div class="crf-section-box">
                  <div class="crf-section" v-if="item.formModules.length > 0"
                       v-for="(module,moduleIndex) in item.formModules" :key="module.id" :index="index"
                       :moduleindex="moduleIndex">
                    <div class="crf-section-title"
                         :class="{'active': selectOpenEhrId === module.refOpenEhrId + '_step' + index}"
                         :ehrid="module.refOpenEhrId">
                      <i class="el-collapse-item__arrow el-icon-arrow-right active"></i>
                      <span class="crf-section-name"
                            @click="matchModule(module,index,moduleIndex)">{{module.elNameCN}}</span>
                    </div>
                    <div class="crf-section-content" v-if="module.formElements.length > 0">
                      <el-form-item
                        v-for="(element,i) in module.formElements" v-if="element.validType == 0" :key="i"
                        :label="element.elNameCN || element.elNameEN" :parentlist="element.parentList"
                        :class="{'colwidth-1':element.colWidth == 1,'colwidth-2':element.colWidth == 2}"
                      >
                        <!-- 输入框 -->
                        <el-input v-model.trim="element.dataValue"
                                  type="text" placeholder="请输入"
                                  v-if="element.ctrlType == '1-1'" :maxlength="element.dataLength" clearable>
                        </el-input>
                        <!-- 文本域 -->
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 8}"
                          placeholder="请输入"
                          v-model.trim="element.dataValue" :maxlength="element.dataLength"
                          v-if="element.ctrlType == '1-2'">
                        </el-input>
                        <!-- 下拉框 -->
                        <el-select v-model="element.dataValue" placeholder="请选择"
                                   v-if="element.ctrlType == '2-1' && element.valueRange.length > 0">
                          <el-option
                            v-for="range in element.valueRange"
                            :key="range.value"
                            :label="range.label"
                            :value="range.value">
                          </el-option>
                        </el-select>
                        <!-- 下拉框多选 -->
                        <el-select v-model="element.setbox" placeholder="请选择" multiple
                                   v-if="element.ctrlType == '2-2' && element.valueRange.length > 0">
                          <el-option
                            v-for="range in element.valueRange"
                            :key="range.value"
                            :label="range.label"
                            :value="range.value">
                          </el-option>
                        </el-select>
                        <!-- 单选框 -->
                        <el-radio-group v-model="element.dataValue"
                                        v-if="element.ctrlType == '2-3' && element.valueRange.length > 0">
                          <el-radio :label="range.value" v-for="range in element.valueRange" :key="range.key">
                            range.key
                          </el-radio>
                        </el-radio-group>
                        <!-- 复选框 -->
                        <el-checkbox-group v-model="element.setbox"
                                           v-if="element.ctrlType == '2-4' && element.valueRange.length > 0">
                          <el-checkbox :label="range.key" v-for="range in element.valueRange"
                                       :key="range.value"></el-checkbox>
                        </el-checkbox-group>
                        <!-- 时间 -->
                        <el-time-picker
                          v-model="element.dataValue" v-if="element.ctrlType == '3-2'" clearable
                          placeholder="选择时间">
                        </el-time-picker>
                        <!-- 日期 -->
                        <el-date-picker
                          v-model="element.dataValue" v-if="element.ctrlType == '3-1'" type="date" clearable
                          placeholder="选择日期">
                        </el-date-picker>
                        <!-- 日期和时间 -->
                        <el-date-picker
                          v-model="element.dataValue" v-if="element.ctrlType == '3-3'" type="datetime" clearable
                          placeholder="选择日期时间">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item
                        v-for="(element,i) in module.formElements" v-if="element.validType == 1" :key="i"
                        :label="element.elNameCN || element.elNameEN" :parentlist="element.parentList"
                        :prop="(element.ctrlType == '2-2' || element.ctrlType =='2-4') ? 'therapyStages.' + index + '.formModules.' + moduleIndex + '.formElements.' + i + '.setbox' : 'therapyStages.' + index + '.formModules.' + moduleIndex + '.formElements.' + i + '.dataValue'"
                        :class="{'colwidth-1':element.colWidth == 1,'colwidth-2':element.colWidth == 2}"
                        :rules="[
                          { required: true, message: element.elNameCN || element.elNameEN, trigger: 'blur' }]"
                      >
                        <!-- 输入框 -->
                        <el-input v-model.trim="element.dataValue"
                                  type="text" placeholder="请输入"
                                  v-if="element.ctrlType == '1-1'" :maxlength="element.dataLength" clearable>
                        </el-input>
                        <!-- 文本域 -->
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 8}"
                          placeholder="请输入"
                          v-model.trim="element.dataValue" :maxlength="element.dataLength"
                          v-if="element.ctrlType == '1-2'">
                        </el-input>
                        <!-- 下拉框 -->
                        <el-select v-model="element.dataValue" placeholder="请选择"
                                   v-if="element.ctrlType == '2-1' && element.valueRange.length > 0">
                          <el-option
                            v-for="range in element.valueRange"
                            :key="range.value"
                            :label="range.label"
                            :value="range.value">
                          </el-option>
                        </el-select>
                        <!-- 下拉框多选 -->
                        <el-select v-model="element.setbox" placeholder="请选择" multiple
                                   v-if="element.ctrlType == '2-2' && element.valueRange.length > 0">
                          <el-option
                            v-for="range in element.valueRange"
                            :key="range.value"
                            :label="range.label"
                            :value="range.value">
                          </el-option>
                        </el-select>
                        <!-- 单选框 -->
                        <el-radio-group v-model="element.dataValue"
                                        v-if="element.ctrlType == '2-3' && element.valueRange.length > 0">
                          <el-radio :label="range.value" v-for="range in element.valueRange" :key="range.key">
                            range.key
                          </el-radio>
                        </el-radio-group>
                        <!-- 复选框 -->
                        <el-checkbox-group v-model="element.setbox"
                                           v-if="element.ctrlType == '2-4' && element.valueRange.length > 0">
                          <el-checkbox :label="range.key" v-for="range in element.valueRange"
                                       :key="range.value"></el-checkbox>
                        </el-checkbox-group>
                        <!-- 时间 -->
                        <el-time-picker
                          v-model="element.dataValue" v-if="element.ctrlType == '3-2'" clearable
                          placeholder="选择时间">
                        </el-time-picker>
                        <!-- 日期 -->
                        <el-date-picker
                          v-model="element.dataValue" v-if="element.ctrlType == '3-1'" type="date" clearable
                          placeholder="选择日期">
                        </el-date-picker>
                        <!-- 日期和时间 -->
                        <el-date-picker
                          v-model="element.dataValue" v-if="element.ctrlType == '3-3'" type="datetime" clearable
                          placeholder="选择日期时间">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <div class="saveButton">
            <el-button @click="crfSave" type="primary"
                       v-if=" crfData.crfForm && crfData.crfForm.therapyStages && crfData.crfForm.therapyStages.length > 0" :disabled="mainLoading">
              保存
            </el-button>
          </div>
        </div>
      </div>
      <div class="crf-left-menu crf-right-menu ">
        <div class="menu-panel ">
          <h2 class="menu-panel-head active">关联模块</h2>
          <div class="menu-panel-content">
            <div class="menu-panel-item" v-if="refModules.length > 0" v-for="(item,index) in refModules" :key="item.id">
              <div class="menu-panel-module" v-if="item.modules.length > 0" v-for="(module,moduleIndex) in item.modules"
                   :key="module.id">
                <h3 class="parent-node"
                    :class="{'active': selectOpenEhrId.substr(0,selectOpenEhrId.length-6) === module.refOpenEhrId}"
                    :ehrId="module.refOpenEhrId" :index="index" :moduleIndex="moduleIndex"
                    @click="crfdataFindPatientData(module.refOpenEhrId,index,moduleIndex)">
                  <span class="ii">
                    <i class="el-collapse-item__arrow el-icon-arrow-right"></i>
                  </span>
                  <span class="refmodule-name">{{module.elNameCN}}</span>
                </h3>
                <el-table
                  :data="module.tableItems.value" v-if="module.tableItems && module.tableItems.value.length > 0"
                  style="width: 100%" @row-click="rowClick">
                  <el-table-column v-for="(name,nameIndex) in module.tableItems.name" :key="nameIndex"
                                   :prop="name.key"
                                   :label="name.name"
                                   width="180">
                  </el-table-column>
                </el-table>
                <div v-if="module.dataItems && module.dataItems.length == 0" class="nodata zwarning">暂无数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import mixins from 'components/mixins';
import './crf.css';

export default {
  name: 'crfConfig',
  mixins: [mixins],
  data () {
    return {
      selectOpenEhrId: '',
      crfData: {},
      refModules: [],
      patientId: '',
      formId: '',
      groupId: '',
      mainLoading: false
    };
  },
  computed: {
    lablePosition () {
      if (this.crfData.crfForm) {
        let match = JSON.stringify(this.crfData.crfForm).match(/alignType\"\:([^:]*)\,/);
        let position = 'right';
        if (match && match[1] == '0') {
          position = 'left';
        }
        return position;
      }
    },
    allRoute () {
      return this.$store.state.user.routeArr;
    }
  },
  created () {
    this.initPage();
  },
  mounted () {
    let that = this;
    $(function () {
      that.resize();
      $(window).resize(function () {
        that.resize();
      });
    });
  },
  activated () {},
  methods: {
    resize () {
      $('.crffill').height($(window).height() - 160);
      $('.crf-main').height($(window).height() - 160);
    },
    relateInit () {
      this.$nextTick(function () {
        $('.crf-section-title .el-icon-arrow-right').off().on('click', function () {
          var right = $(this);
          right.toggleClass('active');
          right.parent().siblings().slideToggle(200);
        });
        $('.crffill .parent-node .ii').off().on('click', function () {
          $(this).toggleClass('active');
          $(this).parent().siblings().slideToggle(200);
        });
        $('.crffill .parent-node .refmodule-name').off().on('click', function () {
          $(this).siblings().toggleClass('active');
          $(this).parent().siblings().slideToggle(200);
        });
        $('.crf-section-box .el-form-item__label').each(function () {
          let label = $(this);
          if (label.parent().attr('preview')) {
            return false;
          }
          label.find('i').remove();
          label.append('<i class="el-icon-info"></i>').attr('title', '来源：' + (label.parent().attr('parentlist') || '无'));
        });
      });
    },
    initPage () {
      this.selectOpenEhrId = '';
      this.crfData = {};
      this.refModules = [];
      this.patientId = '';
      this.formId = '';
      this.groupId = '';
      this.formId = this.$route.query.formId;
      if (!this.formId) {
        this.$notice('页面缺少表单id');
        return false;
      }
      this.patientId = this.$route.query.patientId;
      this.groupId = this.$route.query.groupId;
      this.getMyForms();
      this.getRefModules();
    },
    async getMyForms (item) {
      let that = this;
      that.mainLoading = true;
      try {
        let result = await this.$http.crfdataFindCrfDataByPGId({
          groupId: this.groupId,
          patientId: this.patientId
        });
        if (result && result.code == '0') {
          this.crfData = result.data.crfData;
          this.crfData.crfForm.therapyStages.forEach(function (item, stageIndex) {
            item.formModules.forEach(function (formModules, moduleIndex) {
              formModules.formElements.forEach(function (formElements) {
                that.$set(formElements, 'setbox', []);
                if (formElements.ctrlType == '2-1' || formElements.ctrlType == '2-4') {
                  formElements.setbox = formElements.dataValue.split(';');
                }
                if (formElements.ctrlType == '3-1' || formElements.ctrlType == '3-2' || formElements.ctrlType == '3-3') {
                  formElements.dataValue = formElements.dataValue ? new Date(formElements.dataValue) : '';
                }
              });
            });
          });
        }
        this.relateInit();
        that.mainLoading = false;
      } catch (error) {
        that.mainLoading = false;
        that.$notice('获取表单失败');
        console.log(error);
      }
    },
    async getRefModules () {
      try {
        let refModules = await this.$http.crfdataFindFormRefModules({formId: this.formId});
        if (refModules && refModules.code == '0') {
          this.refModules = refModules.data.categories;
        }
        this.relateInit();
      } catch (error) {
        this.$notice('获取查找表单关联的模块失败');
        console.log(error);
      }
    },
    async crfdataFindPatientData (refOpenEhrId, index, moduleIndex) {
      // 手动加上阶段code、表单元素dataValue
      try {
        let result = await this.$http.crfdataFindPatientData({
          patientId: this.patientId,
          refOpenEhrId: refOpenEhrId
        });
        // console.log(this.refModules[index].modules[moduleIndex], 89898);
        if (!(result.data && result.data.dataItems && result.data.dataItems.length > 0)) {
          this.$set(this.refModules[index].modules[moduleIndex], 'dataItems', []);
          return false;
        }
        let dataItems = result.data.dataItems;
        this.$set(this.refModules[index].modules[moduleIndex], 'dataItems', dataItems);
        let tableValue = [];
        let name = [];
        dataItems.forEach(function (item, index) {
          let value = {};
          item.forEach(function (itemSon) {
            if (index == 0) {
              name.push({key: itemSon.refOpenEhrId, name: itemSon.elNameCN || itemSon.elNameEN});
            }
            value[itemSon.refOpenEhrId] = itemSon.dataValue;
            value['mouduleRefOpenEhrId'] = refOpenEhrId;
          });
          tableValue.push(value);
        });
        this.$set(this.refModules[index].modules[moduleIndex], 'tableItems', {name: name, value: tableValue});
        // console.log(tableValue, 789);
      } catch (error) {
        this.$notice('获取关联模块详情失败');
        console.log(error);
      }
    },
    async matchModule (module, index, moduleIndex) {
      this.selectOpenEhrId = module.refOpenEhrId + '_step' + index;
      let parentNode = $('.crffill .parent-node[ehrid="' + module.refOpenEhrId + '"]');
      await this.crfdataFindPatientData(module.refOpenEhrId, parentNode.attr('index'), parentNode.attr('moduleindex'));
      this.$nextTick(() => {
        // 右侧列表滚动到对应模块位置
        let nowScrollPositon = parentNode.parents('.menu-panel-content').scrollTop();
        parentNode.parents('.menu-panel-content').animate({scrollTop: nowScrollPositon + parentNode.position().top}, 300);
      });
    },
    rowClick (row, event, column) {
      let that = this;
      if (this.selectOpenEhrId.indexOf(row.mouduleRefOpenEhrId) == -1) {
        this.$notice('请先选择对应的模块');
        return false;
      }
      let stepIndex = this.selectOpenEhrId.replace(row.mouduleRefOpenEhrId + '_step', '');
      let crfSection = $('.crffill .crf-step').eq(stepIndex).find('.crf-section-title[ehrid="' + row.mouduleRefOpenEhrId + '"]');
      let index = crfSection.parent().attr('index');
      let moduleindex = crfSection.parent().attr('moduleindex');
      let formElements = this.crfData.crfForm.therapyStages[index].formModules[moduleindex].formElements;
      this.$confirm('是否要覆盖 (' + crfSection.closest('.crf-step').find('.crf-step-h3').html() + ' — ' + crfSection.find('.crf-section-name').html() + ') 填写的内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        for (let p in row) {
          for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].refOpenEhrId == p) {
              formElements[i].dataValue = row[p];
              if (formElements[i].ctrlType == '2-1' || formElements[i].ctrlType == '2-4') {
                formElements[i].setbox = formElements[i].dataValue.split(';');
              }
              if (formElements[i].ctrlType == '3-1' || formElements[i].ctrlType == '3-2' || formElements[i].ctrlType == '3-3') {
                formElements[i].dataValue = new Date(formElements[i].dataValue);
              }
              break;
            }
          }
        }
      }).catch(() => {
      });
    },
    crfSave () {
      let that = this;
      // 删除阶段唯一标识code,删除表单元素dataValue
      this.$refs['crfForm'].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        // console.log(this.crfData.crfForm);
        this.crfData.crfForm.therapyStages.forEach(function (item, stageIndex) {
          item.formModules.forEach(function (formModules, moduleIndex) {
            formModules.formElements.forEach(function (formElements) {
              if (formElements.ctrlType == '2-1' || formElements.ctrlType == '2-4') {
                formElements.dataValue = formElements.setbox.join(';');
              }
              if (formElements.ctrlType == '3-1') {
                formElements.dataValue = that.toCustomString(formElements.dataValue ? new Date(formElements.dataValue) : '', 'date');
              } else if (formElements.ctrlType == '3-2') {
                formElements.dataValue = that.toCustomString(formElements.dataValue ? new Date(formElements.dataValue) : '', 'time');
              } else if (formElements.ctrlType == '3-3') {
                formElements.dataValue = that.toCustomString(formElements.dataValue ? new Date(formElements.dataValue) : '');
              }
              delete formElements.setbox;
              // 日期、时间、日期时间需要转换格式
              // 复选、下拉多选需要把setbox的值转成对于valueRange的value,然后逗号拼接给dataValue
            });
          });
        });
        let txt = '保存';
        if (this.crfData.id) {
          txt = '修改';
        }
        that.mainLoading = true;
        try {
          let result = await this.$http.crfdataSaveOrUpdateCrfData({crfData: this.crfData});
          if (result && result.code == 0) {
            this.$notice(txt + '成功');
            this.selectOpenEhrId = '';
            // 保存成功后，强制删除当前的crf填写页面的路由
            this.allRoute.forEach((item, index) => {
              if (item.route.name === this.$route.name) {
                this.$store.commit({
                  type: 'forceReduceRoute',
                  paras: {index: index, vueParent: this}
                });
              }
            });
            this.$nextTick(() => {
              if (this.$route.query.from === 'caseManage') {
                this.$router.push({
                  path: this.$route.query.from,
                  query: {
                    id: this.$route.query.diseaseId,
                    cacheData: false
                  }
                });
              } else if (this.$route.query.from === 'enterGroupManager') {
                this.$router.push({
                  path: this.$route.query.from,
                  query: {
                    cacheData: false,
                    patientName: this.$route.query.patientName || '',
                    patientId: this.$route.query.patientId || '',
                    identify: this.$route.query.identify || ''
                  }
                });
              }
            });
          }
          that.mainLoading = false;
        } catch (error) {
          that.mainLoading = false;
          that.$notice(txt + '失败');
          console.log(error);
        }
      });
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
<style lang="less">
  body.theme-blue {
    .crffill .crf-step .crf-section-title.active, .crffill .menu-panel .parent-node.active {
      background: #c6e2ff;
    }
  }

  body.theme-green {
    .crffill .crf-step .crf-section-title.active, .crffill .menu-panel .parent-node.active {
      background: #b2efe0;
    }
  }
</style>
