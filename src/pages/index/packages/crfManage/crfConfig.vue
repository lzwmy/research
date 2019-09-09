<template>
  <!--数据连接管理-->
  <div class="cloud-component crfConfig clearfix">
    <div class=" clearfix">
      <div class="crf-left-menu">
        <div class="menu-panel">
          <h2 class="menu-panel-head active">
            <span>我的表单 </span>
            <!-- <span class="toggle-slide">展开</span> -->
          </h2>
          <div class="menu-panel-content">
            <div class="menu-panel-item" v-if="myForms.length > 0" v-for="item in myForms" :key="item.id">
              <h3 class="parent-node" :class="{'active':item.crfForms.length > 0}" :title="item.name"><label><i
                class="el-collapse-item__arrow el-icon-arrow-down"></i>{{item.name}}</label><i class="el-icon-plus"
                                                                                               @click="addMyForm(item)"></i>
              </h3>
              <ul v-if="item.crfForms.length > 0">
                <li class="child-node" :id="form.id" v-for="form in item.crfForms" :key="form.id"
                    :class="{'active':selectFormId === form.id}" :title="form.name"><span class="readonly-icon"
                                                                                          v-if="form.used">只读</span><span
                  class="menu-node-name"
                  @click="getFormDetailCall(form)">{{form.name}}</span><i class="el-icon-edit" title="重命名"
                                                                          @click="formRename(form)"
                                                                          v-if="!form.used"></i><i
                  class="el-icon-delete" title="删除" @click="formDel(form)" v-if="!form.used"></i></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="menu-panel ">
          <h2 class="menu-panel-head">
            <span>全部表单</span>
            <!-- <span class="toggle-slide">展开</span> -->
          </h2>

          <div class="menu-panel-content" style="display:none">
            <el-input v-model.trim="allSearchName" placeholder="请输入名称" @keyup.enter.native="allFormsSearch"
                      prefix-icon="el-icon-search"
                      type="text" clearable class="input-search" :maxlength="100"></el-input>

            <div class="menu-panel-item" v-if="allForms.length > 0" v-for="item in allForms" :key="item.id">
              <h3 class="parent-node" :class="{'active':item.crfForms.length > 0}"><label><i
                class="el-collapse-item__arrow el-icon-arrow-down"></i>{{item.name}}</label></h3>
              <ul v-if="item.crfForms.length > 0">
                <li class="child-node" v-for="form in item.crfForms" :key="form.id"
                    :class="{'active':selectFormId === form.id}" :title="form.name"><span class="menu-node-name"
                                                                                          @click="getFormDetailCall(form,'allForms')"
                >{{form.name}}</span>
                </li>
              </ul>
            </div>
            <div class="search-void" v-if="allForms.length === 0">暂无数据</div>
          </div>
        </div>
      </div>
      <div class="crf-main" v-loading="mainLoading" element-loading-text="拼命加载中">
        <div class="crf-main-content" v-if=" crfForm.therapyStages && crfForm.therapyStages.length > 0">
          <div class="crf-step-header" :crfid="crfForm.id">
            <div title="收起表单" @click="crfLeftToggle" :class="{'crf-left-btn': true,'onclick': crfLeftBtnStatus}"></div>
            <div class="new-name" :title="dynamicMyForm.newName">{{dynamicMyForm.newName}}</div>
            <el-select v-model="step" placeholder="请选择">
              <el-option
                v-for="item in stepOptions"
                :key="item.code"
                :title="item.name"
                :label="item.name.length>15?item.name.substring(0,15)+'...':item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-button @click="editStep" type="primary">治疗阶段</el-button>
          </div>
          <div class="crf-step-content">
            <el-form :model="crfForm" ref="crfForm" label-width="100px" :label-position="lablePosition"
                     @submit.native.prevent>
              <div class="crf-step" v-for="(item,index) in crfForm.therapyStages" :key="index"
                   v-if="item.code == step || step == stepOptions[0].code" :index="index">
                <h3 class="crf-step-h3" :title="item.name">{{item.name}}</h3>
                <div class="crf-section-box">
                  <div class="crf-section" v-if="item.formModules.length > 0"
                       v-for="(module,moduleIndex) in item.formModules" :key="module.id"
                       :id="module.id + '_main0_' + index" :index="index"
                       :moduleindex="moduleIndex">
                    <div class="crf-section-title">
                      <i class="el-collapse-item__arrow el-icon-arrow-right active"></i>
                      <span class="crf-section-name">{{module.elNameCN }} </span>
                      <a href="javascript:void(0);" class="module-close"
                         @click="moduleClose(module.elNameCN,index,moduleIndex)" v-if="!crfForm.used"><i
                        class="el-icon-close"></i></a>
                    </div>
                    <div class="crf-section-content" v-if="module.formElements.length > 0">
                      <el-form-item
                        v-for="(element,elementIndex) in module.formElements"
                        :index="index +'_' + moduleIndex + '_' + elementIndex"
                        :label="element.elNameCN || element.elNameEN" :id="element.id + '_main0_' + index"
                        :key="element.id" :parentlist="element.parentList" :ctrltype="element.ctrlType"
                        :class="{'colwidth-1':element.colWidth == 1,'colwidth-2':element.colWidth == 2}"
                      >
                        <!-- 输入框 -->
                        <el-input v-model.trim="element.crfEditInput"
                                  type="text" placeholder="请输入"
                                  :disabled="crfForm.used"
                                  v-if="element.ctrlType == '1-1'" :maxlength="element.dataLength" clearable>
                        </el-input>
                        <!-- 文本域 -->
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 8}"
                          placeholder="请输入"
                          v-model.trim="element.crfEditInput" :disabled="crfForm.used" :maxlength="element.dataLength"
                          v-if="element.ctrlType == '1-2'">
                        </el-input>

                        <!-- 下拉框 -->
                        <el-select v-model="element.crfEditInput" placeholder="请选择"
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
                        <el-radio-group v-model="element.crfEditInput"
                                        v-if="element.ctrlType == '2-3' && element.valueRange.length > 0">
                          <el-radio :label="range.value" v-for="range in element.valueRange" :key="range.key"
                                    :disabled="crfForm.used">range.key
                          </el-radio>
                        </el-radio-group>
                        <!-- 复选框 -->
                        <el-checkbox-group v-model="element.setbox"
                                           v-if="element.ctrlType == '2-4' && element.valueRange.length > 0">
                          <el-checkbox :label="range.key" v-for="range in element.valueRange" :key="range.value"
                                       :disabled="crfForm.used"></el-checkbox>
                        </el-checkbox-group>

                        <!-- 时间 -->
                        <el-time-picker
                          v-model="element.crfEditInput" v-if="element.ctrlType == '3-2'" :disabled="crfForm.used"
                          placeholder="选择时间">
                        </el-time-picker>
                        <!-- 日期 -->
                        <el-date-picker
                          v-model="element.crfEditInput" v-if="element.ctrlType == '3-1'" type="date"
                          :disabled="crfForm.used"
                          placeholder="选择日期">
                        </el-date-picker>
                        <!-- 日期和时间 -->
                        <el-date-picker
                          v-model="element.crfEditInput" v-if="element.ctrlType == '3-3'" type="datetime"
                          :disabled="crfForm.used"
                          placeholder="选择日期时间">
                        </el-date-picker>

                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div class="zwarning nodata" v-else>请在左侧"我的表单"中创建表单或者"全部表单"中快速生成表单</div>
      </div>
      <div class="crf-right-menu">
        <combination2 @dragStop="dragStop"></combination2>
      </div>
      <div class="crf-config-button" v-if=" crfForm.therapyStages && crfForm.therapyStages.length > 0">
        <el-button @click="crfPreView">预览</el-button>
        <el-button @click="crfSave" type="primary" v-if="!crfForm.used" :disabled="mainLoading">保存</el-button>
        <el-button @click="crfPublish" type="primary" v-if="!crfForm.used" :disabled="mainLoading">发布</el-button>
      </div>
    </div>


    <el-dialog
      title="编辑阶段"
      :visible.sync="stepVisible" width="40%" @close="cancelEidtStep" :close-on-click-modal="false"
      class="dynamicStepDialog">
      <el-form :model="dynamicStepForm" ref="dynamicStepForm" label-width="100px" class="demo-dynamic"
               v-if="dynamicStepForm.options.length >0" @submit.native.prevent>
        <el-form-item v-for="(item, index) in dynamicStepForm.options"
                      :label="'阶段' + (index+1)"
                      :key="item.code"
                      :prop="'options.' + index + '.name'">
          <el-input v-model.trim="item.name" type="text" placeholder="请输入阶段名称" :maxlength="100" clearable></el-input>
          <i class="el-icon-delete" @click="removeStep(item)" v-if="index > 0"
             style="margin-left:5px;font-size:14px;cursor:pointer"></i>
        </el-form-item>
        <el-button @click="addEidtStep" size="mini" style="margin-left:100px;padding:5px 10px"><i class="el-icon-plus"
                                                                                                  style="font-size:14px"></i>
        </el-button>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEidtStep">确 定</el-button>
        <el-button @click="cancelEidtStep">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'新建表单 (分类：' + temMyForm.name + ')'"
      :visible.sync="myFormVisible" width="40%" @close="cancelMyForm" :close-on-click-modal="false">
      <el-form :model="temMyForm" ref="temMyForm" label-width="100px" class="demo-dynamic" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="temMyForm.newName" type="text" placeholder="请输入表单名称" :maxlength="100"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveMyForm" type="primary">确 定</el-button>
        <el-button @click="cancelMyForm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="重命名"
      :visible.sync="renameVisible" width="40%" @close="cancelRename" :close-on-click-modal="false">
      <el-form :model="rename" ref="rename" label-width="100px" class="demo-dynamic" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="rename.name" type="text" placeholder="请输入表单名称" :maxlength="100" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveRename" type="primary">确 定</el-button>
        <el-button @click="cancelRename">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="预览CRF配置"
      :visible.sync="preiviewVisible" @close="cancelPreView" :close-on-click-modal="false" fullscreen
      class="clearfix crfConfigPreiview">
      <div class="crf-main" v-loading="mainLoading" element-loading-text="拼命加载中">
        <div class="crf-main-content" v-if=" crfForm.therapyStages && crfForm.therapyStages.length > 0">
          <div class="crf-step-header" :crfid="crfForm.id">
            <div class="new-name" :title="dynamicMyForm.newName">{{dynamicMyForm.newName}}</div>
            <el-select v-model="step" placeholder="请选择">
              <el-option
                v-for="item in stepOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="crf-step-content">
            <el-form :model="crfForm" ref="crfForm" label-width="100px" :label-position="lablePosition"
                     @submit.native.prevent>
              <div class="crf-step" v-for="(item,index) in crfForm.therapyStages" :key="index"
                   v-if="item.code == step || step == stepOptions[0].code" :index="index">
                <h3 class="crf-step-h3" :title="item.name">{{item.name}}</h3>
                <div class="crf-section-box">
                  <div class="crf-section" v-if="item.formModules.length > 0"
                       v-for="(module,moduleIndex) in item.formModules" :key="module.id"
                       :id="module.id + '_main1_' + index" :index="index"
                       :moduleindex="moduleIndex">
                    <div class="crf-section-title">
                      <i class="el-collapse-item__arrow el-icon-arrow-right active"></i>
                      <span class="crf-section-name">{{module.elNameCN }} </span>
                    </div>
                    <div class="crf-section-content" v-if="module.formElements.length > 0">
                      <el-form-item
                        v-for="(element,i) in module.formElements"
                        :label="element.elNameCN || element.elNameEN"
                        :key="element.id" :parentlist="element.parentList " preview="preview"
                        :class="{'colwidth-1':element.colWidth == 1,'colwidth-2':element.colWidth == 2}"
                      >
                        <!-- 输入框 -->
                        <el-input v-model.trim="element.crfEditInput"
                                  type="text" placeholder="请输入"
                                  :disabled="crfForm.used"
                                  v-if="element.ctrlType == '1-1'" :maxlength="element.dataLength" clearable>
                        </el-input>
                        <!-- 文本域 -->
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 8}"
                          placeholder="请输入"
                          v-model.trim="element.crfEditInput" :disabled="crfForm.used" :maxlength="element.dataLength"
                          v-if="element.ctrlType == '1-2'">
                        </el-input>

                        <!-- 下拉框 -->
                        <el-select v-model="element.crfEditInput" placeholder="请选择"
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
                        <el-radio-group v-model="element.crfEditInput"
                                        v-if="element.ctrlType == '2-3' && element.valueRange.length > 0">
                          <el-radio :label="range.value" v-for="range in element.valueRange" :key="range.key"
                                    :disabled="crfForm.used">range.key
                          </el-radio>
                        </el-radio-group>
                        <!-- 复选框 -->
                        <el-checkbox-group v-model="element.setbox"
                                           v-if="element.ctrlType == '2-4' && element.valueRange.length > 0">
                          <el-checkbox :label="range.key" v-for="range in element.valueRange" :key="range.value"
                                       :disabled="crfForm.used"></el-checkbox>
                        </el-checkbox-group>

                        <!-- 日期 -->
                        <el-time-picker
                          v-model="element.crfEditInput" v-if="element.ctrlType == '3-1'" :disabled="crfForm.used"
                          placeholder="选择时间">
                        </el-time-picker>
                        <!-- 时间 -->
                        <el-time-picker
                          v-model="element.crfEditInput" v-if="element.ctrlType == '3-2'" type="date"
                          :disabled="crfForm.used"
                          placeholder="选择日期">
                        </el-time-picker>
                        <!-- 日期和时间 -->
                        <el-time-picker
                          v-model="element.crfEditInput" v-if="element.ctrlType == '3-3'" type="datetime"
                          :disabled="crfForm.used"
                          placeholder="选择日期时间">
                        </el-time-picker>

                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div class="crf-main-nav">
        <div class="menu-panel ">
          <h2 class="menu-panel-head active">
            <div class="new-name" :title="dynamicMyForm.newName">{{dynamicMyForm.newName}}</div>
          </h2>
          <div class="menu-panel-content" v-if="crfForm.therapyStages && crfForm.therapyStages.length > 0">
            <div class="menu-panel-item" v-for="(item,index)  in crfForm.therapyStages" :key="item.index">
              <h3 class="parent-node" :title="item.name"><label>
                <i class="el-collapse-item__arrow el-icon-arrow-right" v-if="item.formModules.length"></i>{{item.name}}</label>
              </h3>
              <ul v-if="item.formModules.length > 0" style="display:none">
                <li class="child-node"
                    v-for="(module,moduleIndex) in item.formModules" :key="module.id" :id="module.id + '_nav1_' + index"
                    :index="index"
                    :moduleindex="moduleIndex"> <span
                  class="menu-node-name">{{module.elNameCN}}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="crfSave" type="primary" v-if="!crfForm.used">保存</el-button>
        <el-button @click="crfPublish" type="primary" v-if="!crfForm.used">发布</el-button>
        <el-button @click="cancelPreView">取 消</el-button>
      </div> -->
    </el-dialog>

    <div class="contextMenu" id="myMenu1">
      <ul>
        <li id="swicthLeft">左对齐</li>
        <li id="swicthRight">右对齐</li>
        <li id="width50">占比1列</li>
        <li id="width100">占比2列</li>

        <li id="switchText">切换单行输入框</li>
        <li id="switchTextarea">切换多行输入框</li>

        <li id="switchSelect">切换下拉单选框</li>
        <li id="switchSelectMore">切换下拉复选框</li>
        <li id="switchRadio">切换单选框</li>
        <li id="switchCheckbox">切换复选框</li>

        <li id="switchTime">切换时间选择框</li>
        <li id="switchDate">切换日期选择框</li>
        <li id="switchTimeDate">切换日期时间选择框</li>

        <li id="switchDel">删除</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/javascript">
import combination2 from 'components/packages/tree/combination2';
import mixins from 'components/mixins';
import './crf.css';

export default {
  name: 'crfConfig',
  mixins: [mixins],
  components: {
    combination2
  },
  data () {
    return {
      formKey: '',
      step: '',
      stepVisible: false,
      myFormVisible: false,
      formEditing: false,
      renameVisible: false,
      mainLoading: false,
      preiviewVisible: false,

      dynamicMyForm: {},
      temMyForm: {
        newName: ''
      },
      dynamicStepForm: {
        options: []
      },
      stepOptions: [{
        code: 'allStep',
        name: '全部阶段'
      }],
      selectFormId: '',
      allSearchName: '',
      crfForm: {},
      previewForm: {},
      crfFormOrgin: {
        creatorId: '',
        diseaseId: '',
        groupId: '',
        id: '',
        name: '',
        priority: '',
        subjectId: '',
        used: false
      },
      myForms: [],
      allForms: [],
      diseaseSpecieses: [],
      rename: {
        id: '',
        name: ''
      },
      crfLeftBtnStatus: false,
      indexForContextMenu: 0,
      moduleIndexForContextMenu: 0,
      elementIndexForContextMenu: 0,
      isAllForms: false
    };
  },
  watch: {
    'crfForm.therapyStages' () {
      this.formEditing = true;
    },
    step (value) {
      this.$nextTick(function () {
        if ($('.crf-main .crf-step').length > 1) {
          $('.crf-main .crf-step,.crf-section-box').css('minHeight', 140);
        } else {
          $('.crf-main .crf-step,.crf-section-box').css('minHeight', $('.crf-main').height() * 0.7);
        }
        this.sortable();
      });
    }
  },
  computed: {
    lablePosition () {
      if (this.crfForm.therapyStages) {
        let match = JSON.stringify(this.crfForm).match(/alignType\"\:([^:]*)\,/);
        let position = 'right';
        if (match && match[0].split(':')[1] == '0,') {
          position = 'left';
        }
        return position;
      }
    }
  },
  created () {
    this.getMyForms('all');
  },
  mounted () {
    let that = this;
    $(function () {
      that.resize();
      that.setDefaultWidth();
      $(window).resize(function () {
        that.resize();
        that.setDefaultWidth();
      });
      $('.CRFConfig').on('click', '.parent-node label', function () {
        let parentNode = $(this).parent();
        if (!parentNode.hasClass('active')) {
          parentNode.addClass('active').siblings('ul').show();
        } else {
          parentNode.removeClass('active').siblings('ul').hide();
        }
      }).on('click', '.menu-panel-head', function () {
        let head = $(this);
        if (head.hasClass('active')) {
          return false;
        }
        head.parent().siblings().find('.menu-panel-head').removeClass('active').siblings().slideUp(200);
        if (!head.hasClass('active')) {
          head.addClass('active').siblings().slideToggle(200);
        }
      });
    });
  },
  activated () {
    //      if(document.querySelectorAll('.route-menu .el-tag.on label')[0]) {
    //        document.querySelectorAll('.route-menu .el-tag.on label')[0].innerHTML = '数据对象管理';
    //      }
  },
  methods: {
    resize () {
      let height = $('.el-router-view').height();
      let width = $('.cloud-component').width();
      $('.crf-left-menu .menu-panel-content').height(height - 149);
      $('.crf-right-menu').height(height - 55);
      $('.crf-main').eq(0).height(height - 115);
      this.$nextTick(() => {
        $('.crf-main').eq(0).find('.colwidth-1').width(($('.crf-main').width() - 150) / 2);
      });
    },
    sortable () {
      let that = this;
      this.mainLoading = false;
      let preSectionOrder = [];
      this.$nextTick(function () {
        $('.crf-section-title .el-icon-arrow-right').off().on('click', function () {
          var right = $(this);
          right.toggleClass('active');
          right.parent().siblings().slideToggle(200);
        });
        $('.crf-main').eq(0).find('.colwidth-1').width(($('.crf-main').width() - 124) / 2);

        // 模块拖动
        $('.crf-section-box .el-form-item__label').each(function () {
          let label = $(this);
          if (label.parent().attr('preview')) {
            return false;
          }
          label.find('i').remove();
          label.append('<i class="el-icon-info"></i>').attr('title', '来源：' + (label.parent().attr('parentlist') || '无'));
        });

        let box = $('.crf-main').eq(0).find('.crf-step-content .crf-section-box').sortable({
          axis: 'y',
          handle: '.crf-section-title',
          placeholder: 'ui-state-highlight',
          delay: 100,
          start: function (event, ui) {
            $(this).find('.crf-section').each(function () {
              preSectionOrder.push($(this).attr('id'));
            });
          },
          update: function (event, ui) {
            that.formEditing = true;
            let formModules = that.crfForm.therapyStages[$(this).closest('.crf-step').attr('index')].formModules;
            let currentOrder = $(this).sortable('toArray');
            let drag = preSectionOrder.indexOf(nav);
            let placeholder = currentOrder.indexOf(ui.item[0].id);
            let dragObj = that.cloneObj(formModules[drag], 'formModules');
            let placeholderObj = that.cloneObj(formModules[placeholder], 'formModules');
            formModules.splice(placeholder, 1, dragObj);
            formModules.splice(drag, 1, placeholderObj);
          },
          stop: function () {
            preSectionOrder = [];
          }
        }).disableSelection();

        // 元素拖动
        let content = $('.crf-main').eq(0).find('.crf-section-content').sortable({
          containment: 'parent',
          placeholder: 'ui-state-highlight',
          delay: 300,
          start: function (event, ui) {
            $(this).find('.el-form-item').each(function () {
              preSectionOrder.push($(this).attr('id'));
            });
            $(this).parent().find('.ui-sortable-placeholder').addClass($(ui.item[0]).attr('class').split(' ')[1]);
          },
          update: function (event, ui) {
            that.formEditing = true;
            let formElements = that.crfForm.therapyStages[$(this).closest('.crf-section').attr('index')].formModules[$(this).closest('.crf-section').attr('moduleindex')].formElements;
            let currentOrder = $(this).sortable('toArray');
            let drag = preSectionOrder.indexOf(ui.item[0].id);
            let placeholder = currentOrder.indexOf(ui.item[0].id);
            let dragObj = that.cloneObj(formElements[drag], 'formElements');
            let placeholderObj = that.cloneObj(formElements[placeholder], 'formElements');
            formElements.splice(placeholder, 1, dragObj);
            formElements.splice(drag, 1, placeholderObj);
          },
          stop: function () {
            preSectionOrder = [];
          }
        }).disableSelection();

        // 表单元素右键菜单
        $('.crf-section-content .el-form-item').contextMenu('myMenu1', {
          onShowMenu: function (e, menu) {
            let ctrltype = $(e.target).parent().attr('ctrltype');
            let indexString = $(e.target).parent().attr('index');
            $('li', menu).show();
            if (ctrltype == '1-1' || ctrltype == '1-2') {
              if (ctrltype == '1-1') {
                $('#switchText', menu).hide();
              } else {
                $('#switchTextarea', menu).hide();
              }
              $('#switchSelect, #switchSelectMore,#switchRadio,#switchCheckbox', menu).hide();
              $('#switchTime, #switchDate,#switchTimeDate', menu).hide();
            } else if (ctrltype == '2-1' || ctrltype == '2-2' || ctrltype == '2-3' || ctrltype == '2-4') {
              if (ctrltype == '2-1') {
                $('#switchSelect', menu).hide();
              } else if (ctrltype == '2-2') {
                $('#switchSelectMore', menu).hide();
              } else if (ctrltype == '2-3') {
                $('#switchRadio', menu).hide();
              } else if (ctrltype == '2-4') {
                $('#switchCheckbox', menu).hide();
              }
              $('#switchText, #switchTextarea', menu).hide();
              $('#switchTime, #switchDate,#switchTimeDate', menu).hide();
            } else {
              if (ctrltype == '3-1') {
                $('#switchDate', menu).hide();
              } else if (ctrltype == '3-2') {
                $('#switchTime', menu).hide();
              } else if (ctrltype == '3-3') {
                $('#switchTimeDate', menu).hide();
              }
              $('#switchText, #switchTextarea', menu).hide();
              $('#switchSelect, #switchSelectMore,#switchRadio,#switchCheckbox', menu).hide();
            }

            if (indexString != undefined) {
              that.indexForContextMenu = parseInt(indexString.slice(0, indexString.indexOf('_')));
              indexString = indexString.slice(indexString.indexOf('_') + 1);

              that.moduleIndexForContextMenu = parseInt(indexString.slice(0, indexString.indexOf('_')));
              that.elementIndexForContextMenu = parseInt(indexString.slice(indexString.indexOf('_') + 1));
            }
            return menu;
          },
          bindings: {
            swicthLeft (t) {
              that.crfForm.therapyStages.forEach(function (item, stageIndex) {
                item.formModules.forEach(function (formModules, moduleIndex) {
                  formModules.formElements.forEach(function (formElements) {
                    formElements.alignType = 0;
                  });
                });
              });
            },
            swicthRight (t) {
              that.crfForm.therapyStages.forEach(function (item, stageIndex) {
                item.formModules.forEach(function (formModules, moduleIndex) {
                  formModules.formElements.forEach(function (formElements) {
                    formElements.alignType = 1;
                  });
                });
              });
            },
            width50 (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].colWidth = 1;
            },
            width100 (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].colWidth = 2;
            },
            switchDel (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements.splice(that.elementIndexForContextMenu, 1);
            },
            switchText (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '1-1';
            },
            switchTextarea (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '1-2';
            },
            switchSelect (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '2-1';
            },
            switchSelectMore (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '2-2';
            },
            switchRadio (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '2-3';
            },
            switchCheckbox (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '2-4';
            },
            switchTime (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '3-2';
            },
            switchDate (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '3-1';
            },
            switchTimeDate (t) {
              that.crfForm.therapyStages[that.indexForContextMenu].formModules[that.moduleIndexForContextMenu].formElements[that.elementIndexForContextMenu].ctrlType = '3-3';
            }
          }
        });

        if (that.crfForm.used) {
          $('.crf-section-content .el-form-item').off();
          box.sortable('destroy');
          content.sortable('destroy');
        }
      });
    },
    cloneObj (obj, item) {
      let cloneObj = {};
      for (let p in obj) {
        if (p != item) {
          cloneObj[p] = obj[p];
        } else {
          cloneObj[p] = obj[p].slice(0);
        }
      }
      return cloneObj;
    },
    async getMyForms (item) {
      try {
        let forms = await this.$http.crfFindMyForms();
        if (forms && forms.code == '0') {
          this.myForms = forms.data.diseaseCategories;
          if (item == 'all') {
            try {
              let allForms = await this.$http.crfFindAllForms();
              if (forms && forms.code == '0') {
                this.allForms = allForms.data.diseaseCategories;
              }
            } catch (error) {
              this.$notice('获取表单列表失败');
              console.log(error);
            }
          }
        }
      } catch (error) {
        this.$notice('获取表单列表失败');
        console.log(error);
      }
    },
    getFormDetailCall (item, module) {
      if ($('.crf-step').length > 0 && this.formEditing) {
        this.$confirm('当前表单未保存，是否离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getFormDetail(item.id, module);
        }).catch(() => {

        });
        return false;
      }
      this.getFormDetail(item.id, module);
    },
    async getFormDetail (id, formType) {
      // 手动加上阶段code、表单元素crfEditInput
      let that = this;
      this.isAllForms = formType ? true : false;
      this.mainLoading = true;
      this.selectFormId = id;
      try {
        let result = await this.$http.crfFindCrfFormById({id: id});
        if (result && result.code == '0') {
          if (formType) {
            let allFormsCrf = result.data.crfForm;
            console.log(allFormsCrf);
            this.crfForm = Object.assign({}, this.crfFormOrgin);
            if (!this.crfForm.therapyStages) {
              this.$set(this.crfForm, 'therapyStages', []);
            }
            allFormsCrf.therapyStages.forEach(function (item, stageIndex) {
              that.crfForm.therapyStages.push({
                crfFormId: '',
                formModules: item.formModules.slice(0),
                id: '',
                name: item.name,
                priority: ''
              });
            });

            this.crfForm.name = allFormsCrf.name || allFormsCrf.name;
            this.crfForm.diseaseId = allFormsCrf.diseaseId;
            this.crfForm.therapyStages.forEach(function (item, stageIndex) {
              that.$set(item, 'code', Math.random().toString());
              item.formModules.forEach(function (formModules, moduleIndex) {
                formModules.stageId = '';
                formModules.formElements.forEach(function (formElements) {
                  that.$set(formElements, 'crfEditInput', '');
                  that.$set(formElements, 'setbox', []);
                  formElements.stageId = '';
                });
              });
            });
          } else {
            this.crfForm = result.data.crfForm;
            this.crfForm.therapyStages.forEach(function (item, stageIndex) {
              that.$set(item, 'code', Math.random().toString());
              item.formModules.forEach(function (formModules, moduleIndex) {
                formModules.formElements.forEach(function (formElements) {
                  that.$set(formElements, 'crfEditInput', '');
                  that.$set(formElements, 'setbox', []);
                });
              });
            });
          }
          this.$nextTick(function () {
            this.formEditing = false;
          });
          this.dynamicMyForm.newName = this.crfForm.name;
          this.cogradient();
          // console.log(this.crfForm, 9);
        }
      } catch (error) {
        that.$notice('表单详情获取失败');
        console.log(error);
      }
    },
    allformRename (initName) {
      return new Promise((resolve, reject) => {
        this.$prompt('请输入新CRF表单名称：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入表单名称',
          closeOnClickModal: false,
          inputValidator: (value) => {
            if (value === '' || value === null) {
              return '新CRF表单名称不能为空';
            }
            if (value.trim().length > 100) {
              return '新CRF表单名称长度不能超过100个字';
            }
            if (value.trim() === initName) {
              return '请输入新表单名称';
            }
          },
          inputValue: initName
        }).then(({value}) => {
          resolve(value.trim());
        }).catch(() => {
          resolve(initName);
        });
      });
    },
    formRename (item) {
      this.rename.name = item.name;
      this.rename.id = item.id;
      this.rename.diseaseId = item.diseaseId;
      this.renameVisible = true;
    },
    async saveRename () {
      if (!this.rename.name) {
        this.$notice('表单名称不能为空');
        return false;
      }
      try {
        let data = await this.$http.crfRenameCrfForm({
          name: this.rename.name,
          id: this.rename.id,
          diseaseId: this.rename.diseaseId
        });
        if (data && data.code == '0') {
          this.$notice(data.msg);
          if (this.rename.id == $('.crf-step-header').attr('crfid')) {
            this.dynamicMyForm.newName = this.rename.name;
            this.crfForm.name = this.dynamicMyForm.newName;
          }
          this.cancelRename();
          this.getMyForms();
          this.getMyForms('all');
        }
      } catch (error) {
        this.$notice(`重命名失败`);
        console.log(error);
      }
    },
    cancelRename () {
      this.rename.name = '';
      this.rename.id = '';
      this.renameVisible = false;
    },
    async allFormsSearch () {
      let allForms;
      if (this.allSearchName === '') {
        try {
          let data = await this.$http.crfFindAllForms();
          if (data && data.code == '0') {
            allForms = data;
          }
        } catch (error) {
          this.$notice('获取crf表单列表失败');
          console.log(error);
        }
      } else {
        try {
          let data = await this.$http.crfFindFormByName({name: this.allSearchName});
          if (data && data.code == '0') {
            allForms = data;
          }
        } catch (error) {
          this.$notice('获取crf表单列表失败');
          console.log(error);
        }
      }
      if (allForms.data && allForms.data.diseaseCategories) {
        this.allForms = allForms.data.diseaseCategories;
      }
    },
    formDel (item) {
      this.$confirm('是否要删除' + item.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          let data = await this.$http.crfDeleteCrfForm({formId: item.id});
          if (data && data.code == '0') {
            this.$notice('删除成功');
            if (item.id == $('.crf-step-header').attr('crfid')) {
              this.crfForm = {};
            }
            this.getMyForms();
          }
        } catch (error) {
          this.$notice('删除失败');
          console.log(error);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    addMyForm (item) {
      if ($('.crf-step').length > 0 && this.formEditing) {
        this.$confirm('当前表单未保存，是否新建表单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.crfForm = {};
          this.myFormVisible = true;
          this.temMyForm = Object.assign({}, item);
        }).catch(() => {

        });
        return false;
      }
      this.myFormVisible = true;
      this.temMyForm = Object.assign({}, item);
    },
    saveMyForm () {
      if (!this.temMyForm.newName) {
        this.$notice('表单名称不能未空');
        return false;
      }

      this.dynamicMyForm = Object.assign({}, this.temMyForm);
      this.crfForm = Object.assign({}, this.crfFormOrgin);
      if (!this.crfForm.therapyStages) {
        this.$set(this.crfForm, 'therapyStages', []);
      }
      this.crfForm.therapyStages = [{
        crfFormId: '',
        formModules: [],
        id: '',
        name: '默认阶段',
        priority: '',
        code: Math.random().toString()
      }];

      this.crfForm.name = this.dynamicMyForm.newName;
      this.crfForm.diseaseId = this.dynamicMyForm.id;
      console.log(this.crfForm);
      this.cogradient();
      this.$nextTick(function () {
        this.formEditing = false;
      });
      this.cancelMyForm();
    },
    cogradient () {
      let stepArr = [{
        code: this.stepOptions[0].code,
        name: this.stepOptions[0].name
      }];
      this.crfForm.therapyStages.length > 0 && this.crfForm.therapyStages.forEach(function (item) {
        stepArr.push({
          code: item.code,
          name: item.name
        });
      });
      this.stepOptions = stepArr.slice(0);
      this.step = this.stepOptions[1].code;
      this.sortable();
    },
    cancelMyForm () {
      this.temMyForm.newName = '';
      this.myFormVisible = false;
    },
    dragStop (dragItem, index) {
      let that = this;
      let modules = this.crfForm.therapyStages[index].formModules;
      let modulesFlag = this.getIndex(modules, dragItem.refOpenEhrId, 'refOpenEhrId');
      this.formEditing = true;
      // 不存在模块
      if (!modulesFlag.flag) {
        modules.push(dragItem);
        this.sortable();
        console.log(this.crfForm, '不存在模块');
        return false;
      }

      // 存在 ,对象引用的时候不能赋值
      let formElements = modules[modulesFlag.index].formElements;
      let temArr = [];
      dragItem.formElements.forEach(function (item) {
        let elementsFlag = that.getIndex(formElements, item.refOpenEhrId, 'refOpenEhrId');
        if (!elementsFlag.flag) {
          temArr.push(item);
        }
      });
      modules[modulesFlag.index].formElements = formElements.concat(temArr);
      console.log(this.crfForm, '存在');
      this.sortable();
    },
    getIndex (arr, id, item = 'id') {
      let flag = false;
      let index = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][item] == id) {
          flag = true;
          index = i;
          break;
        }
      }
      return !flag ? {flag: flag} : {flag: flag, index: index};
    },
    saveEidtStep () {
      let nameFlag = false;
      this.dynamicStepForm.options.forEach(function (item) {
        if (!item.name) {
          nameFlag = true;
        }
      });
      if (nameFlag) {
        this.$notice('阶段名称不能为空');
        return false;
      }
      let that = this;
      let result = [];
      let addFlag = false;
      // 编辑后查看是否删除、修改了阶段
      this.dynamicStepForm.options.forEach(function (item) {
        let flag = that.getIndex(that.crfForm.therapyStages, item.code, 'code');
        if (!flag.flag) {
          let option = {
            crfFormId: '',
            formModules: [],
            id: '',
            name: item.name,
            priority: '',
            code: item.code
          };
          addFlag = true;
          result.push(option);
        } else {
          let therapyItem = that.crfForm.therapyStages[flag.index];
          let option = {
            crfFormId: therapyItem.crfFormId,
            formModules: therapyItem.formModules.slice(0),
            id: therapyItem.id,
            name: item.name,
            priority: therapyItem.priority,
            code: item.code
          };
          result.push(option);
        }
      });
      this.crfForm.therapyStages = result.slice(0);
      this.cogradient();
      if (addFlag) {
        this.step = this.crfForm.therapyStages[this.crfForm.therapyStages.length - 1].code;
      } else {
        this.step = this.crfForm.therapyStages[0].code;
      }
      console.log(this.crfForm);
      this.cancelEidtStep();
    },
    removeStep (item) {
      let that = this;
      let flag = this.getIndex(this.dynamicStepForm.options, item.code, 'code');
      if (!flag.flag) {
        return false;
      }
      let stepFlag = this.getIndex(this.stepOptions, item.code, 'code');
      if (!stepFlag.flag) {
        this.dynamicStepForm.options.splice(flag.index, 1);
        return false;
      }
      this.$confirm('是否要删除' + item.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.dynamicStepForm.options.splice(flag.index, 1);
      }).catch(() => {

      });
    },
    editStep () {
      this.stepVisible = true;
      this.dynamicStepForm.options = this.stepOptions.slice(1);
    },
    addEidtStep () {
      this.dynamicStepForm.options.push({
        code: Math.random().toString(),
        name: ''
      });
    },
    cancelEidtStep () {
      this.stepVisible = false;
    },
    moduleClose (name, index, moduleIndex) {
      if (this.crfForm.used) {
        return false;
      }
      console.log(index, moduleIndex, this.crfForm);
      this.$confirm('是否要删除模块' + name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crfForm.therapyStages[index].formModules.splice(moduleIndex, 1);
        this.formEditing = true;
      }).catch(() => {

      });
    },
    crfPreView () {
      this.step = 'allStep';
      this.preiviewVisible = true;
      this.$nextTick(function () {
        $('.crf-section-title .el-icon-arrow-right').off().on('click', function () {
          var right = $(this);
          right.toggleClass('active');
          right.parent().siblings().slideToggle(200);
        });
        $('.crf-main-nav .menu-node-name').off().on('click', function () {
          let parent = $(this).parent();
          $('.crf-main').eq(1).find('.crf-step-content').animate({
            scrollTop: $('#' + parent.attr('id').replace('_nav1_', '_main1_')).offset().top - 200
          }, 600);
        });
      });
    },
    cancelPreView () {
      this.preiviewVisible = false;
    },
    async crfPublish () {
      let that = this;
      // 全部表单在展示之前可输入新表单名称
      if (that.isAllForms) {
        let result = await that.allformRename(this.dynamicMyForm.newName);
        if (result === this.crfForm.name) {
          return false;
        }
        this.dynamicMyForm.newName = this.crfForm.name = result;
      }
      this.$confirm('表单发布后，将不可编辑和删除' + name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.crfForm.therapyStages.forEach(function (item, stageIndex) {
          item.crfFormId = that.crfForm.id;
          item.priority = stageIndex;
          delete item.code;
          item.formModules.forEach(function (formModules, moduleIndex) {
            formModules.priority = moduleIndex;
            formModules.formElements.forEach(function (formElements) {
              delete formElements.crfEditInput;
              delete formElements.setbox;
            });
          });
        });
        that.mainLoading = true;
        try {
          let data = await this.$http.crfSaveAndPublishCrfForm({crfForm: this.crfForm});
          if (data && data.code == '0') {
            this.$notice('发布成功');
            if (data.data.formId) {
              this.getFormDetail(data.data.formId);
            } else {
              this.crfForm = {};
            }
            await this.getMyForms();
            this.locationForm(data.data.formId);
            this.getMyForms('all');
          }
          that.mainLoading = false;
        } catch (error) {
          that.mainLoading = false;
          this.$notice('发布失败');
          console.log(error);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    async crfSave () {
      // 删除阶段唯一标识code,删除表单元素crfEditInput
      let that = this;
      // 全部表单在展示之前可输入新表单名称
      if (that.isAllForms) {
        let result = await that.allformRename(this.dynamicMyForm.newName);
        if (result === this.crfForm.name) {
          return false;
        }
        this.dynamicMyForm.newName = this.crfForm.name = result;
      }
      // let errorTherapyStages = this.crfForm.therapyStages.concat([]);
      this.crfForm.therapyStages.forEach(function (item, stageIndex) {
        item.crfFormId = that.crfForm.id;
        item.priority = stageIndex;
        // delete item.code;
        item.formModules.forEach(function (formModules, moduleIndex) {
          formModules.priority = moduleIndex;
          formModules.formElements.forEach(function (formElements) {
            // delete formElements.crfEditInput;
            // delete formElements.setbox;
            // 日期、时间、日期时间需要转换格式
            // 复选、下拉多选需要把setbox的值转成对于valueRange的value,然后逗号拼接给dataValue
          });
        });
      });
      let quest = 'crfSaveCrfForm';
      let txt = '保存';
      if (this.crfForm.id) {
        quest = 'crfUpdateCrfForm';
        txt = '修改';
      }
      that.mainLoading = true;
      try {
        let data = await this.$http[quest]({crfForm: this.crfForm});
        if (data && data.code == '0') {
          this.$notice(txt + '成功');
          await this.getMyForms();
          this.locationForm(this.crfForm.id || data.data.formId);
          this.selectFormId = '';
          this.getFormDetail(this.crfForm.id || data.data.formId);
        }
        that.mainLoading = false;
      } catch (error) {
        that.mainLoading = false;
        this.$notice(txt + '失败');
        console.log(error);
      }
    },
    locationForm (id) {
      let form = $('#' + id);
      let head = form.parents('.menu-panel-content').siblings('.menu-panel-head');
      // if (head.hasClass('active')) {
      //  return false;
      // }
      head.parent().siblings().find('.menu-panel-head').removeClass('active').siblings().slideUp(200);
      if (!head.hasClass('active')) {
        head.addClass('active').siblings().slideToggle(200);
      }
      // 滚动到表单位置
      let nowScrollPositon = form.parents('.menu-panel-content').scrollTop();
      form.parents('.menu-panel-content').animate({scrollTop: nowScrollPositon + form.position().top}, 300);
    },
    crfLeftToggle () {
      let $left = $('.crf-left-menu');
      let $main = $('.crf-main').eq(0);
      let $config = $('.crf-config-button');

      if (!this.crfLeftBtnStatus) {
        $left.animate({
          width: 0
        });

        $main.animate({
          left: 15
        });

        $config.animate({
          left: parseFloat($config.css('left')) - $left.prop('data-width')
        });
      } else {
        $left.animate({
          width: 279
        });

        $main.animate({
          left: 298
        });

        $config.animate({
          left: parseFloat($config.css('left')) + $left.prop('data-width')
        });
      }
      this.crfLeftBtnStatus = !this.crfLeftBtnStatus;
    },
    setDefaultWidth () {
      let $left = $('.crf-left-menu');
      $left.prop('data-width', $left.width());
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
<style scoped lang="less">
  body.theme-blue {
    .crfConfig .crf-main {
      width: auto !important;
    }
    .crfConfig .crf-right-menu {
      width: 279px;
      border: 1px solid #e9eaec;
      float: right;
      border-top: 2px solid #2d8cf0 !important;
    }

    .menu-panel .menu-panel-head.active {
      border-top: 2px solid #2d8cf0 !important;
    }

    .crf-left-menu .menu-panel .el-collapse-item__arrow:before {
      content: "\e604";
      color: #2d8cf0;
    }

    .menu-panel ul .child-node:hover {
      border-left: 5px solid #2d8cf0;
      background-color: #c6e2ff;
    }

    #crfVisual-segment-list .global-category-title {
      padding-top: 5px;
      color: #2d8cf0;
      border-bottom: 1px solid #edf1f2;
    }

    .colwidth-2.ui-sortable-placeholder {
      width: 100%;
    }

    .colwidth-1.ui-sortable-placeholder {
      width: calc(35%);
      margin-left: 30px;
      display: inline-block;
      margin-bottom: 20px;
      height: 28px;
      vertical-align: top;
    }

    .menu-panel ul .child-node.active {
      background: #c6e2ff;
    }
  }

  body.theme-green {
    .crfConfig .crf-main {
      width: auto !important;
    }
    .crfConfig .crf-right-menu {
      width: 279px;
      border: 1px solid #e9eaec;
      float: right;
      border-top: 2px solid #00d1a0 !important;
    }

    .menu-panel .menu-panel-head.active {
      border-top: 2px solid #00d1a0 !important;
    }

    .crf-left-menu .menu-panel .el-collapse-item__arrow:before {
      content: "\e604";
      color: #03d2a2;
    }

    .menu-panel ul .child-node:hover {
      border-left: 5px solid #00d19a;
      background-color: #d0f6e7;
    }

    #crfVisual-segment-list .global-category-title {
      padding-top: 5px;
      color: #1ab497;
      border-bottom: 1px solid #edf1f2;
    }

    .colwidth-2.ui-sortable-placeholder {
      width: 100%;
    }

    .colwidth-1.ui-sortable-placeholder {
      width: calc(35%);
      margin-left: 30px;
      display: inline-block;
      margin-bottom: 20px;
      height: 28px;
      vertical-align: top;
    }

    .menu-panel ul .child-node.active {
      background: #d0f6e7;
    }
  }
</style>
<style lang="less">

</style>
