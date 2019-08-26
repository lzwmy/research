<template>
    <div >
      <!--集合上下排列-->
      <div class="view_container_um" v-if="pitem.controlType=='GATHER'&&pitem.gatherRank=='0'" :dataID="viewList.length">
        <div v-for="(item,index) in viewList">
          <!--单行文本框-->
          <div class="view_box"v-if="item.controlType=='SINGLE_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_input" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_input" :style="item.baseProperty.controlWidth=='1'?'width:50px':item.baseProperty.controlWidth=='2'?'width:100px':item.baseProperty.controlWidth=='3'?'width:150px':item.baseProperty.controlWidth=='4'?'width:170px':''">
                <el-input v-model="controlTypeValue" size="mini" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--多行文本框-->
          <div class="view_box" v-if="item.controlType=='MULTI_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_textarea" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" :style="item.baseProperty.controlWidth=='1'?'width:124px':item.baseProperty.controlWidth=='2'?'width:229px':item.baseProperty.controlWidth=='3'?'width:334px':item.baseProperty.controlWidth=='4'?'width:493px':''">
                <el-input type="textarea" :rows="item.baseProperty.controlHeight||4" v-model="controlTypeValue" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--标签-->
          <div class="view_box" v-if="item.controlType=='LABEL'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" style="font-size: 14px;color: #cccccc;">{{item.baseProperty.labelContent}}</div>
            </div>
          </div>
          <!--日期-->
          <div class="view_box" v-if="item.controlType=='DATE'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_date" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateNew"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime =='0'?true:false">
                <el-date-picker
                  v-model="controlDate"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--日期时间-->
          <div class="view_box" v-if="item.controlType=='DATE_TIME'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_time" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateTimeNew"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='0'?true:false">
                <el-date-picker
                  v-model="controlDateTime"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--数值框-->
          <div class="view_box" v-if="item.controlType=='NUMBER_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_number" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-input v-model="controlNumber" size="mini" placeholder="数字"></el-input>
              </div>
              <div class="view_unit" v-if="item.termUnit.numberIsSwitch=='1'?true:false">
                {{item.termUnit.unitName}}
              </div>
              <div class="view_select" v-if="item.termUnit.numberIsSwitch=='0'?true:false">
                <el-select v-model="item.termSet.termDefaultValue[0]" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选下拉-->
          <div class="view_box" v-if="item.controlType=='SINGLE_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_radioSelect" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='1'?true:false"  :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           allow-create
                           default-first-option
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           @keyup.enter.native="addTermItemRspList(item,index,item.termSet.termDefaultValue[0])"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="radioInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,radioInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--多选下拉-->
          <div class="view_box" v-if="item.controlType=='MULTI_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div class="view_label_checkBox" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue"
                           allow-create
                           filterable
                           default-first-option
                           multiple
                           size="mini"
                           @keyup.enter.native="addTermItemRspListCheckBox(item,index,item.termSet.termDefaultValue)"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="checkBoxInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,checkBoxInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue" size="mini" multiple placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选框-->
          <div class="view_box" v-if="item.controlType=='RADIO_BUTTON'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_radio_btn" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_radio_btn',{'radio_type':pitem.gatherRank=='0'}]">
                <el-radio-group v-model="item.termSet.termDefaultValue[0]" >
                  <el-radio size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName">{{item.termItemName}}</el-radio>
                </el-radio-group>
              </div>
              <div class="view_empty" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--多选框-->
          <div class="view_box" v-if="item.controlType=='CHECKBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_checkBox_btn" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_checkBox_btn',{'radio_type':pitem.gatherRank=='0'}]">
                <el-checkbox-group v-model="item.termSet.termDefaultValue">
                  <el-checkbox size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName"></el-checkbox>
                  <!--<el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>-->
                </el-checkbox-group>
              </div>
              <div class="view_empty" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--上传-->
          <div class="view_box" v-if="item.controlType=='FILE_UPLOAD'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div class="view_label_upload" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_upload">
                <el-upload
                  class="upload-demo"
                  drag
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
            </div>
          </div>
          <!--集合-->
          <div class="view_box" v-if="item.controlType=='GATHER'?true:false">
            <div class="view_title">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowTypeIsVisible=='1'?true:false">
              <el-radio-group v-model="item.gatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
              <span class="empty" @click="emptyKnowType(item,index)">清除</span>
            </div>
            <div :class="['view_content',{'tb_bgColors':item.gatherRank=='0'},{'white_bg':item.gatherRank=='0'}]" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
          <!--表格-->
          <div class="view_box" v-if="item.controlType=='TABLE'?true:false">
            <div class="view_title" v-if="item.gatherIsVisible=='1'?true:false">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowTypeIsVisible=='1'?true:false">
              <el-radio-group v-model="item.gatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :pitem="item" :list="item.children"></view-item>
              <div :class="[{'td_center':item.gatherRank=='0'},{'lr_content':item.gatherRank=='1'}]" v-if="item.gatherRank=='0'?true:false">

                <!--删除-->
                <i class="iconfont iconfuhao4 del"  v-if="viewList.length>1?true:false"  @click="delTableInfo(item,index,pitem)"></i>
                <!--添加-->
                <i class="iconfont iconfuhao1" v-if="viewList.length-1==index?true:false" @click="addTableInfo(item,index,pitem)"></i>
              </div>
              <div :class="[{'td_center':item.gatherRank=='0'},{'lr_content':item.gatherRank=='1'}]" v-if="item.gatherRank=='1'?true:false">

                <!--删除-->
                <i class="iconfont iconfuhao4 del" v-if="viewList.length>1?true:false" @click="delTableInfo(item,index,pitem)"></i>
                <!--添加-->
                <i class="iconfont iconfuhao1" v-if="viewList.length-1==index?true:false"  @click="addTableInfo(item,index,pitem)"></i>
              </div>
            </div>

          </div>
        </div>
      </div>
      <!--集合左右排列-->
      <div  class="view_container_lr" v-if="pitem.controlType=='GATHER'&&pitem.gatherRank=='1'" :dataID="viewList.length" :style="WidthAuto">
        <div class="view_layout"  v-for="(item,index) in viewList">
          <!--单行文本框-->
          <div class="view_boxlg"v-if="item.controlType=='SINGLE_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_input',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_input',{'width_type':pitem.gatherRank=='1'}]" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-input v-model="item.inputValue" size="mini" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--多行文本框-->
          <div class="view_boxlg" v-if="item.controlType=='MULTI_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_textarea',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_textarea" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-input type="textarea" size="mini" :rows="item.baseProperty.controlHeight||4" v-model="item.inputValue" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--标签-->
          <div class="view_boxlg minWidthMar" v-if="item.controlType=='LABEL'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_label',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_label',{'width_type':pitem.gatherRank=='1'}]" style="font-size: 14px;color: #cccccc">{{item.baseProperty.labelContent}}</div>
            </div>
          </div>
          <!--日期-->
          <div class="view_boxlg" v-if="item.controlType=='DATE'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content addMargin">
              <div :class="['view_label_date',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_date" v-if="item.baseProperty.controlIsDefaultDateTime==='1'?true:false">
                <el-date-picker
                  v-model="controlDateNew"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="view_type_date" v-if="item.baseProperty.controlIsDefaultDateTime =='0'?true:false">
                <el-date-picker
                  v-model="item.inputValue"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--日期时间-->
          <div class="view_boxlg" v-if="item.controlType=='DATE_TIME'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_time',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_time" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateTimeNew"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="view_type_time addMargin" v-if="item.baseProperty.controlIsDefaultDateTime=='0'?true:false">
                <el-date-picker
                  v-model="item.inputValue"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--数值框-->
          <div class="view_boxlg" v-if="item.controlType=='NUMBER_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_number',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_number number_margin">
                <el-input v-model="controlNumber" size="mini" placeholder="数字"></el-input>
              </div>
              <div class="view_unit" v-if="item.termUnit.numberIsSwitch=='1'?true:false">
                {{item.termUnit.unitName}}
              </div>
              <div class="view_select" v-if="item.termUnit.numberIsSwitch=='0'?true:false">
                <el-select v-model="item.termSet.termDefaultValue[0]" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选下拉-->
          <div class="view_boxlg" v-if="item.controlType=='SINGLE_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_radioSelect',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='1'?true:false"  :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           allow-create
                           default-first-option
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           @keyup.enter.native="addTermItemRspList(item,index,item.termSet.termDefaultValue[0])"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="radioInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,radioInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--多选下拉-->
          <div class="view_boxlg" v-if="item.controlType=='MULTI_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_checkBox',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue"
                           allow-create
                           filterable
                           default-first-option
                           size="mini"
                           multiple
                           @keyup.enter.native="addTermItemRspListCheckBox(item,index,item.termSet.termDefaultValue)"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="checkBoxInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,checkBoxInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue" size="mini" multiple placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选框-->
          <div class="view_boxlg" v-if="item.controlType=='RADIO_BUTTON'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_radio_btn',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_radio_btn">
                <el-radio-group v-model="item.termSet.termDefaultValue[0]" >
                  <el-radio size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName">{{item.termItemName}}</el-radio>
                </el-radio-group>
              </div>
              <div class="view_empty_radio_btn" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--多选框-->
          <div class="view_boxlg" v-if="item.controlType=='CHECKBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label_checkBox_btn',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_checkBox_btn">
                <el-checkbox-group v-model="item.termSet.termDefaultValue" size="mini">
                  <el-checkbox size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName"></el-checkbox>
                  <!--<el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>-->
                </el-checkbox-group>
              </div>
              <div class="view_empty_checkBox_btn" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--上传-->
          <div class="view_boxlg" v-if="item.controlType=='FILE_UPLOAD'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div :class="['view_label',{'width_label':pitem.gatherRank=='1'}] " >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-upload
                  class="upload-demo"
                  drag
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
            </div>
          </div>
          <!--集合-->
          <div class="view_boxlg" v-if="item.controlType=='GATHER'?true:false">
            <div class="view_title">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowType=='2'?true:false">
              <el-radio-group v-model="CgatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div :class="['view_content',{'bg_contentColor':item.gatherRank=='1'}]" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :gatherColumnNumber="item.gatherColumnNumber" :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
          <!--表格-->
          <div class="view_boxlg" v-if="item.controlType=='TABLE'?true:false">
            <div class="view_title" :dataId="item.termSet.foldFlag">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowType=='2'?true:false">
              <el-radio-group v-model="CgatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :gatherColumnNumber="item.gatherColumnNumber" :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
        </div>
      </div>
      <!--表格上下排列-->
      <div class="view_container_tud" v-if="pitem.controlType=='TABLE'&&pitem.gatherRank=='0'" :dataID="viewList.length">
        <!--<div v-for="(item,index) in viewList">
          &lt;!&ndash;单行文本框&ndash;&gt;
          <div class="view_box_um"v-if="item.controlType=='SINGLE_INPUT'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-input v-model="controlTypeValue"  size="mini" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          &lt;!&ndash;多行文本框&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='MULTI_INPUT'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-input type="textarea" :rows="item.baseProperty.controlHeight||4" v-model="controlTypeValue" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          &lt;!&ndash;标签&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='LABEL'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" style="font-size: 14px;color: #cccccc;background-color: #ffffff">{{item.baseProperty.labelContent}}</div>
            </div>
          </div>
          &lt;!&ndash;日期&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='DATE'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime==='1'?true:false">
                <el-date-picker
                  v-model="controlDateNew"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime =='0'?true:false">
                <el-date-picker
                  v-model="controlDate"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          &lt;!&ndash;日期时间&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='DATE_TIME'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateTimeNew"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='0'?true:false">
                <el-date-picker
                  v-model="controlDateTime"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
          </div>
          &lt;!&ndash;数值框&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='NUMBER_INPUT'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-input v-model="controlNumber" size="mini" placeholder="数字"></el-input>
              </div>
              <div class="view_unit" v-if="item.termUnit.numberIsSwitch=='1'?true:false">
                {{item.termUnit.unitName}}
              </div>
              <div class="view_select" v-if="item.termUnit.numberIsSwitch=='0'?true:false">
                <el-select size="mini" v-model="item.termSet.termDefaultValue[0]" placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          &lt;!&ndash;单选下拉&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='SINGLE_COMBOX'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsExtend=='1'?true:false"  :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           allow-create
                           size="mini"
                           default-first-option
                           v-model="item.termSet.termDefaultValue[0]"
                           @keyup.enter.native="addTermItemRspList(item,index,item.termSet.termDefaultValue[0])"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                &lt;!&ndash;<el-input style="width: 30%;" v-model="radioInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,radioInputValue)">添加</el-button>&ndash;&gt;
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          &lt;!&ndash;多选下拉&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='MULTI_COMBOX'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue"
                           size="mini"
                           allow-create
                           filterable
                           default-first-option
                           multiple
                           @keyup.enter.native="addTermItemRspListCheckBox(item,index,item.termSet.termDefaultValue)"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                &lt;!&ndash;<el-input style="width: 30%;" v-model="checkBoxInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,checkBoxInputValue)">添加</el-button>&ndash;&gt;
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue" size="mini" multiple placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          &lt;!&ndash;单选框&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='RADIO_BUTTON'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-radio-group v-model="item.termSet.termDefaultValue[0]" >
                  <el-radio size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName">{{item.termItemName}}</el-radio>
                </el-radio-group>
              </div>
              <div class="view_empty" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          &lt;!&ndash;多选框&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='CHECKBOX'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-checkbox-group v-model="item.termSet.termDefaultValue">
                  <el-checkbox size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName"></el-checkbox>
                  &lt;!&ndash;<el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>&ndash;&gt;
                </el-checkbox-group>
              </div>
              <div class="view_empty" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          &lt;!&ndash;上传&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='FILE_UPLOAD'?true:false">
            &lt;!&ndash;<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>&ndash;&gt;
            <div class="view_content">
              <div class="view_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-upload
                  class="upload-demo"
                  drag
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
            </div>
          </div>
          &lt;!&ndash;集合&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='GATHER'?true:false">
            <div class="view_title">
              <i v-if="item.termSet.foldFlag===1?true:false" class="el-icon-caret-bottom" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="el-icon-caret-right" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowType=='2'?true:false">
              <el-radio-group v-model="CgatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              &lt;!&ndash;<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>&ndash;&gt;
              <view-item :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
          &lt;!&ndash;表格&ndash;&gt;
          <div class="view_box_um" v-if="item.controlType=='TABLE'?true:false">
            <div class="view_title">
              <i v-if="item.termSet.foldFlag===1?true:false" class="el-icon-caret-bottom" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="el-icon-caret-right" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowType=='2'?true:false">
              <el-radio-group v-model="CgatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              &lt;!&ndash;<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>&ndash;&gt;
              <view-item  :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
        </div>-->
        <div v-for="(item,index) in viewList">
          <!--单行文本框-->
          <div class="view_box"v-if="item.controlType=='SINGLE_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_input" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_input" :style="item.baseProperty.controlWidth=='1'?'width:50px':item.baseProperty.controlWidth=='2'?'width:100px':item.baseProperty.controlWidth=='3'?'width:150px':item.baseProperty.controlWidth=='4'?'width:170px':''">
                <el-input v-model="item.inputValue" size="mini" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--多行文本框-->
          <div class="view_box" v-if="item.controlType=='MULTI_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_textarea" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" :style="item.baseProperty.controlWidth=='1'?'width:124px':item.baseProperty.controlWidth=='2'?'width:229px':item.baseProperty.controlWidth=='3'?'width:334px':item.baseProperty.controlWidth=='4'?'width:493px':''">
                <el-input type="textarea" :rows="item.baseProperty.controlHeight||4" v-model="item.inputValue" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--标签-->
          <div class="view_box" v-if="item.controlType=='LABEL'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_label" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" style="font-size: 14px;color: #cccccc;">{{item.baseProperty.labelContent}}</div>
            </div>
          </div>
          <!--日期-->
          <div class="view_box" v-if="item.controlType=='DATE'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_date" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateNew"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime =='0'?true:false">
                <el-date-picker
                  v-model="item.inputValue"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--日期时间-->
          <div class="view_box" v-if="item.controlType=='DATE_TIME'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_time" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateTimeNew"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="view_type" v-if="item.baseProperty.controlIsDefaultDateTime=='0'?true:false">
                <el-date-picker
                  v-model="item.inputValue"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--数值框-->
          <div class="view_box" v-if="item.controlType=='NUMBER_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_number" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-input v-model="item.inputValue" size="mini" ></el-input>
              </div>
              <div class="view_unit" v-if="item.termUnit.numberIsSwitch=='1'?true:false">
                {{item.termUnit.unitName}}
              </div>
              <div class="view_select" v-if="item.termUnit.numberIsSwitch=='0'?true:false">
                <el-select v-model="item.termSet.termDefaultValue[0]" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选下拉-->
          <div class="view_box" v-if="item.controlType=='SINGLE_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_radioSelect" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='1'?true:false"  :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           allow-create
                           default-first-option
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           @keyup.enter.native="addTermItemRspList(item,index,item.termSet.termDefaultValue[0])"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="radioInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,radioInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_radioSelect" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--多选下拉-->
          <div class="view_box" v-if="item.controlType=='MULTI_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div class="view_label_checkBox" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue"
                           allow-create
                           filterable
                           default-first-option
                           multiple
                           size="mini"
                           @keyup.enter.native="addTermItemRspListCheckBox(item,index,item.termSet.termDefaultValue)"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="checkBoxInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,checkBoxInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_checkBox" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue" size="mini" multiple placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选框-->
          <div class="view_box" v-if="item.controlType=='RADIO_BUTTON'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_radio_btn" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_radio_btn',{'radio_type':pitem.gatherRank=='0'}]">
                <el-radio-group v-model="item.termSet.termDefaultValue[0]" >
                  <el-radio size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName">{{item.termItemName}}</el-radio>
                </el-radio-group>
              </div>
              <div class="view_empty" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--多选框-->
          <div class="view_box" v-if="item.controlType=='CHECKBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div :class="['view_content',{'tb_bgColor':item.gatherRank=='0'}]">
              <div class="view_label_checkBox_btn" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_checkBox_btn',{'radio_type':pitem.gatherRank=='0'}]">
                <el-checkbox-group v-model="item.termSet.termDefaultValue">
                  <el-checkbox size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName"></el-checkbox>
                  <!--<el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>-->
                </el-checkbox-group>
              </div>
              <div class="view_empty" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--上传-->
          <div class="view_box" v-if="item.controlType=='FILE_UPLOAD'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div class="view_label_upload" >
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_upload">
                <el-upload
                  class="upload-demo"
                  drag
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
            </div>
          </div>
          <!--集合-->
          <div class="view_box" v-if="item.controlType=='GATHER'?true:false">
            <div class="view_title">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowType=='2'?true:false">
              <el-radio-group v-model="CgatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div :class="['view_content',{'tb_bgColors':item.gatherRank=='0'},{'white_bg':item.gatherRank=='0'}]" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
          <!--表格-->
          <div class="view_box" v-if="item.controlType=='TABLE'?true:false">
            <div class="view_title" v-if="item.gatherIsVisible=='1'?true:false">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowTypeIsVisible=='1'?true:false">
              <el-radio-group v-model="item.gatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :pitem="item" :list="item.children"></view-item>
              <div :class="[{'td_center':item.gatherRank=='0'},{'lr_content':item.gatherRank=='1'}]" v-if="item.gatherRank=='0'?true:false">
                <!--添加-->
                <i class="iconfont iconfuhao1" @click="addTableInfo(item,index,pitem)"></i>
                <!--删除-->
                <i class="iconfont iconfuhao4 del"  @click="delTableInfo(item,index,pitem)"></i>
              </div>
              <div :class="[{'td_center':item.gatherRank=='0'},{'lr_content':item.gatherRank=='1'}]" v-if="item.gatherRank=='1'?true:false">
                <!--添加-->
                <i class="iconfont iconfuhao1" @click="addTableInfo(item,index,pitem)"></i>
                <!--删除-->
                <i class="iconfont iconfuhao4 del"  @click="delTableInfo(item,index,pitem)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--表格左右排列-->
      <div class="view_container_tlr" v-if="pitem.controlType=='TABLE'&&pitem.gatherRank=='1'" :dataID="viewList.length" :style="WidthAutoTD">
        <div class="view_layout" v-for="(item,index) in viewList">
          <!--单行文本框-->
          <div class="view_box_td" v-if="item.controlType=='SINGLE_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_input_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_input_tlr" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-input v-model="item.inputValue" size="mini" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--多行文本框-->
          <div class="view_box_td" v-if="item.controlType=='MULTI_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_textarea_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_textarea_tlr" :style="item.baseProperty.controlWidth=='1'?'width:124px':item.baseProperty.controlWidth=='2'?'width:229px':item.baseProperty.controlWidth=='3'?'width:334px':item.baseProperty.controlWidth=='4'?'width:493px':''">
                <el-input type="textarea" :rows="item.baseProperty.controlHeight||4" v-model="item.inputValue" :placeholder="item.baseProperty.controlTip"></el-input>
              </div>
            </div>
          </div>
          <!--标签-->
          <div class="view_box_td" v-if="item.controlType=='LABEL'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_label_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_label_tlr" style="font-size: 14px;color: #cccccc">{{item.baseProperty.labelContent}}</div>
            </div>
          </div>
          <!--日期-->
          <div class="view_box_td" v-if="item.controlType=='DATE'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_date_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_date_tlr" v-if="item.baseProperty.controlIsDefaultDateTime==='1'?true:false">
                <el-date-picker
                  v-model="controlDateNew"
                  size="mini"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="view_type_tlr" v-if="item.baseProperty.controlIsDefaultDateTime =='0'?true:false">
                <el-date-picker
                  v-model="item.inputValue"
                  size="mini"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--日期时间-->
          <div class="view_box_td" v-if="item.controlType=='DATE_TIME'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_time_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_time_tlr" v-if="item.baseProperty.controlIsDefaultDateTime=='1'?true:false">
                <el-date-picker
                  v-model="controlDateTimeNew"
                  size="mini"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="view_type_tlr" v-if="item.baseProperty.controlIsDefaultDateTime=='0'?true:false">
                <el-date-picker
                  v-model="item.inputValue"
                  size="mini"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
          </div>
          <!--数值框-->
          <div class="view_box_td" v-if="item.controlType=='NUMBER_INPUT'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
              <div class="view_label_number_tlr">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div :class="['view_type_number_tlr',{'number_marginUnit':item.termUnit.numberIsSwitch=='1'?true:false},{'select_margin':item.termUnit.numberIsSwitch=='0'?true:false}] ">
                <el-input v-model="item.inputValue" size="mini" ></el-input>
              </div>
              <div class="view_unit_tlr" v-if="item.termUnit.numberIsSwitch=='1'?true:false">
                {{item.termUnit.unitName}}
              </div>
              <div class="view_select_tlr" v-if="item.termUnit.numberIsSwitch=='0'?true:false">
                <el-select v-model="item.termSet.termDefaultValue[0]" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选下拉-->
          <div class="view_box_td" v-if="item.controlType=='SINGLE_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_radioSelect_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_radioSelect_tlr" v-if="item.baseProperty.controlIsExtend=='1'?true:false"  :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           allow-create
                           default-first-option
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           @keyup.enter.native="addTermItemRspList(item,index,item.termSet.termDefaultValue[0])"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="radioInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,radioInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_radioSelect_tlr" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select filterable
                           size="mini"
                           v-model="item.termSet.termDefaultValue[0]"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--多选下拉-->
          <div class="view_box_td" v-if="item.controlType=='MULTI_COMBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_checkBox_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_checkBox_tlr" v-if="item.baseProperty.controlIsExtend=='1'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue"
                           size="mini"
                           allow-create
                           filterable
                           default-first-option
                           multiple
                           @keyup.enter.native="addTermItemRspListCheckBox(item,index,item.termSet.termDefaultValue)"
                           placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
                <!--<el-input style="width: 30%;" v-model="checkBoxInputValue"></el-input>
                <el-button @click="addTermItemRspList(item,index,checkBoxInputValue)">添加</el-button>-->
              </div>
              <div class="view_type_checkBox_tlr" v-if="item.baseProperty.controlIsExtend=='0'?true:false" :style="item.baseProperty.controlWidth=='1'?'width:21%':item.baseProperty.controlWidth=='2'?'width:42%':item.baseProperty.controlWidth=='3'?'width:63%':item.baseProperty.controlWidth=='4'?'width:84%':''">
                <el-select v-model="item.termSet.termDefaultValue" size="mini" multiple placeholder="请选择">
                  <el-option
                    v-for="item in item.termSet.termItemList"
                    :key="item.termItemName"
                    :label="item.termItemName"
                    :value="item.termItemName">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--单选框-->
          <div class="view_box_td" v-if="item.controlType=='RADIO_BUTTON'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_radio_btn_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_radio_btn_tlr">
                <el-radio-group v-model="item.termSet.termDefaultValue[0]" >
                  <el-radio size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName">{{item.termItemName}}</el-radio>
                </el-radio-group>
              </div>
              <div class="view_empty_radio_btn_tlr" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--多选框-->
          <div class="view_box_td" v-if="item.controlType=='CHECKBOX'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content_tlr">
              <div class="view_label_checkBox_btn_tlr" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type_checkBox_btn_tlr">
                <el-checkbox-group v-model="item.termSet.termDefaultValue">
                  <el-checkbox size="mini" v-for="item in item.termSet.termItemList" :label="item.termItemName"></el-checkbox>
                  <!--<el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>-->
                </el-checkbox-group>
              </div>
              <div class="view_empty_checkBox_btn_tlr" @click="emptyList(item,index)">清空</div>
            </div>
          </div>
          <!--上传-->
          <div class="view_box_td" v-if="item.controlType=='FILE_UPLOAD'?true:false">
            <!--<div class="view_title">&lt;!&ndash;预览条目- &ndash;&gt;{{item.controlDisplayName}}</div>-->
            <div class="view_content">
              <div class="view_label" v-if="pitem.gatherIsVisible=='1'?true:false">
                <span v-if="item.displayIsVisible=='1'?true:false">{{item.controlName}}</span>
              </div>
              <div class="view_type">
                <el-upload
                  class="upload-demo"
                  drag
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
            </div>
          </div>
          <!--集合-->
          <div class="view_box_td" v-if="item.controlType=='GATHER'?true:false">
            <div class="view_title" v-if="pitem.gatherKnowType=='4'?false:true">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowType=='2'?true:false">
              <el-radio-group v-model="CgatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
          <!--表格-->
          <div class="view_box_td" v-if="item.controlType=='TABLE'?true:false">
            <div class="view_title" v-if="item.gatherIsVisible=='1'?true:false">
              <i v-if="item.termSet.foldFlag===1?true:false" class="iconfont iconzu2" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              <i v-if="item.termSet.foldFlag===0?true:false" class="iconfont iconzu" @click="SwitchFolFlag(item,item.termSet.foldFlag)"></i>
              {{item.controlName}}
            </div>
            <div class="view_knowType" v-if="item.gatherKnowTypeIsVisible=='1'?true:false">
              <el-radio-group v-model="item.gatherKnowType" >
                <el-radio :label="0" @change="changeRadioKnowType(item,index,0,item.termSet.foldFlag)">是</el-radio>
                <el-radio :label="1" @change="changeRadioKnowType(item,index,1,item.termSet.foldFlag)">否</el-radio>
                <el-radio :label="2" @change="changeRadioKnowType(item,index,2,item.termSet.foldFlag)">不详</el-radio>
              </el-radio-group>
            </div>
            <div class="view_content" v-if="item.termSet.foldFlag===1?true:false">
              <!--<div class="view_label">条目显示名称</div>
              <div class="view_type">
                &lt;!&ndash;<el-select v-model="checkBoxSelect" multiple placeholder="请选择">
                  <el-option
                    v-for="item in numberList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>&ndash;&gt;

              </div>-->
              <view-item :pitem="item" :list="item.children"></view-item>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "viewItem",
      props:{
        list:{
          type:Array
        },
        pitem:{
          type:Object
        },
        gatherColumnNumber:{
          type:Number
        }
      },
      data() {
        return {
          controlTypeValue:"",//预览值
          radio:"",//单选框,
          controlDate:"",//日期
          controlDateNew:new Date(),// 当前时间
          controlDateTimeNew:new Date(),//当前日期时间
          controlDateTime:"",//日期时间
          radioInputValue:"",//获取单选输入的值
          controlNumber:"",//数值框
          numberValue:"",// 数值框 代码集选择
          radioSelect:"",//单选下拉
          checkBoxInputValue:"",//获取多选下拉的值
          checkBoxSelect:"",//多选下拉
          radioKnowType:"",//代码集的判断
          CgatherKnowType:"",// 集合
          // 集合左右预览 处理列---宽度处理
          WidthAuto:{
            width:(this.pitem.gatherColumnNumber*329)+2+"px !important",
            border:'1px solid #ddd',
            backgroundColor:"#F7F8FC",
            marginLeft:'60px'
          },
          //表格左右 宽度处理
          WidthAutoTD:{
            minWidth:(this.list.length*205)+"px",
            float:'left',
          },
          checkBox:[],//多选框
          // 数值框 选择内容
          numberList:[
            {
              value: '选项1',
              label: '黄金糕'
            },
            {
              value: '选项2',
              label: '黄金糕2'
            }
          ],
          viewList:this.list,
        }
      },
      methods:{
        //单选添加
        addTermItemRspList(obj,index,radioInput){
          console.log(obj,index,radioInput)
          if(radioInput==undefined||radioInput==""){
            obj.termSet.termDefaultValue[0]="";
            return ;
          }else if(radioInput!==""){
            obj.termSet.termItemList.forEach((item,indx,array)=>{
              if(item.termItemName==radioInput){
                array.splice(indx,1)
                obj.termSet.termDefaultValue[0]="";
              }
            })
          }
          obj.termSet.termItemList.push({
            termItemName:radioInput
          })
          this.radioInputValue = "";
          this.checkBoxInputValue="";
        },
        //多选框事件
        addTermItemRspListCheckBox(obj,index,checkInput){
          console.log(obj,index,checkInput)
          if(checkInput.length<=0){
            obj.termSet.termDefaultValue=[];
            return ;
          }else if(checkInput.length>0){
            obj.termSet.termItemList.forEach((item,indx,array)=>{
              if(item.termItemName==checkInput[checkInput.length-1]){
                array.splice(indx,1)
                obj.termSet.termDefaultValue=[];
              }
            })
          }
          obj.termSet.termItemList.push({
            termItemName:checkInput[checkInput.length-1]
          })
        },
        //清空
        emptyList(obj,index){
          console.log(obj,index)
          obj.termSet.termDefaultValue = [];
        },
        //是否不详 事件
        changeRadioKnowType(obj,index,value){
          console.log(obj,index,value)
          if(value=='0'){
            obj.termSet.foldFlag = 0;
          }else if(value=='1'||value=='2'){
            obj.termSet.foldFlag = 1;
          }
        },
        // 图标切换事件
        SwitchFolFlag(obj) {
          if(obj.termSet.foldFlag===1){
            obj.termSet.foldFlag = 0;
          }else{
            obj.termSet.foldFlag = 1;
          }
        },
        // 表格添加
        addTableInfo(obj,index,p_obj) {
          console.log(obj,index,p_obj)
          console.log(this.viewList)
          // 深度克隆，解除关系
          let copyData =Object.assign({},JSON.parse(JSON.stringify(obj)))
          //清空 title 和 thead  4 隐藏资深的title
          if(copyData.gatherRank=='0'&&copyData.controlType=='TABLE'){
            copyData.gatherKnowTypeIsVisible = 0;
            copyData.gatherIsVisible = 0;
          }else if(copyData.gatherRank=='1'&&copyData.controlType=='TABLE'){
            copyData.gatherKnowTypeIsVisible=0;
            copyData.gatherIsVisible = 0;
          }

          // this.viewList.splice(index+1,0,copyData)
          this.$set(this.viewList,index+1,copyData)
          /*this.viewList[index+1].children.forEach(item=>{
            item.controlName = ""
          })*/
        },
        //表格删除
        delTableInfo(obj,index,p_obj){
          console.log(obj,index,p_obj)
          console.log(this.viewList)
          //点击删除默认第一个表头显示

          // this.pitem.gatherKnowTypeIsVisible=1
          this.viewList.splice(index,1)
        },
        // 是否不详 清空
        emptyKnowType(obj,value) {
          obj.gatherKnowType = "";
        }
      },
      mounted() {
        console.log(this.pitem)
        console.log(this.list)
      }
    }
</script>

<style lang="less">
/*  .view_container {
    !*padding: 10px 0px 10px 13px;*!
    !*min-height: 840px;*!
    width: 100%;
    float: left;
    !*overflow: hidden;*!
    !*集合上下排列*!
    .view_box {
      font-size: 20px;
      float: left;
      width: 100%;
      !*margin-bottom: 5px;*!
      background-color: #ffffff;
      .view_title {
        !*margin-bottom: 1%;*!
        font-size: 14px;
        background-color: #ffffff !important;
        i{
          cursor:pointer;
        }
      }
      .tb_bgColor{
        background: #F7F8FC !important;
        float: left !important;
        margin-left: 0!important;
        width: 52% !important;
        line-height: 45px !important;
        .view_label {
          margin-right: 1% !important;
          font-size: 12px !important;
          float: left !important;
          min-width: 20% !important;
          height: 40px !important;
          line-height: 50px !important;
          overflow: hidden !important;
          padding-left: 2% !important;
        }
        .view_type {
          margin-right: 1% !important;
          float: left !important;
          width: 168px !important;
        }
        .radio_type{
          width:auto !important;
          .el-radio-group{
            .el-radio{
              margin-left: 0 !important;
            }
          }
          .el-checkbox-group{
            .el-checkbox{
              margin-right: 0 !important;
            }
          }
        }
        .view_unit {
          font-size: 16px !important;
          margin-right: 1% !important;
          float: left !important;
          !*line-height: 35px;*!
        }
        .view_empty {
          font-size: 14px !important;
          cursor: pointer !important;
          color: #2d8cf0 !important;
          float: left !important;
          !*line-height: 30px;*!
        }
      }
      .view_content {
        float: left;
        margin-left: 0!important;
        width: 100%;
        line-height: 45px;
        background-color: #ffffff;
        position:relative;
        .view_label {
          margin-right: 1%;
          font-size: 12px;
          float: left;
          min-width: 15%;
          height: 40px;
          line-height: 35px;
          overflow: hidden;
          padding-left: 2%;
        }
        .view_type {
          margin-right: 1%;
          float: left;
          width: 168px;
        }
        .radio_type{
          width:auto !important;
          .el-radio-group{
            .el-radio{
              margin-left: 0 !important;
            }
          }
          .el-checkbox-group{
            .el-checkbox{
              margin-right: 0 !important;
            }
          }
        }
        .view_unit {
          font-size: 16px;
          margin-right: 1%;
          float: left;
          !*line-height: 35px;*!
        }
        .view_empty {
          font-size: 14px;
          cursor: pointer;
          color: #2d8cf0;
          float: left;
          !*line-height: 30px;*!
        }
      }
    }
    !*集合左右排列*!
    .view_boxlg {
      font-size: 20px;
      float: left;
      !*width: 100%;*!
      !*margin: 5px 0;*!
      !*padding:0 5px;*!
      white-space: nowrap;
      width: 328px;
      .view_title {
        margin-bottom: 1%;
      }
      .view_content {
        float: left;
        !*margin-left: 2%;*!
        width: 100%;
        line-height: 35px;
        !*padding: 5px 0;*!
        !*border-top: 1px solid #DEE2E5;*!
        border-bottom: 1px solid #DEE2E5;
        line-height: 40px;
        .view_label {
          !*margin-right: 1%;*!
          font-size: 12px;
          float: left;
          !*line-height: 35px;*!
          width: 10%;
          overflow: hidden;
          padding-left: 5%;
        }
        .width_label{
          width:30% !important;
          background-color: #F7F8FC;
          height: 50px;
          line-height: 50px;
        }
        .view_type {
          !*margin-right: 1%;*!
          !*width: 75%;*!
          float: left;

        }
        .width_type{
          width:65% !important;
          height: 50px;
          line-height: 44px;
          .el-input{
            width: 168px;
          }
        }
        .number_margin{
          width:37%;
        }
        .view_unit {
          font-size: 16px;
          margin-right: 1%;
          float: left;
          !*line-height: 35px;*!
        }
        .view_select{
          width: 30%;
          float: left;
        }
        .view_empty {
          font-size: 14px;
          cursor: pointer;
          color: #2d8cf0;
          float: right;
          !*line-height: 30px;*!
          margin-right: 2%;
        }
        .el-radio-group{
          !*padding-right: 15%;*!
          float: left;
          width: 180px;
          .el-radio{
            margin-left: 0 !important;
            margin-right: 5px !important;
            display: inline-block;
            float: left;
            margin: 4px 0;
          }
        }
        .el-checkbox-group{
          !*padding-right: 15%;*!
          float: left;
          width: 180px;
          .el-checkbox{
            margin-left: 0 !important;
            margin-right: 5px !important;
            display: inline-block;
            float: left;
            height: 20px !important;
          }
        }
        .el-checkbox-group{
          padding-right: 15%;
        }
      }
      .addMargin{
        !*padding-right: 30px;*!
      }
    }
    !*表格左右排列*!
    .view_box_td {
      font-size: 20px;
      float: left;
      !*width: 100%;*!
      padding: 5px 0;
      text-align: center;
      width: 220px;
      .view_title {
        margin-bottom: 1%;
      }
      .view_content {
        float: left;
        margin-left: 0;
        width: 100%;
        line-height: 35px;
        !*border: 1px solid #c0ccda;*!
        .view_label {
          margin-right: 0;
          font-size: 16px;
          float: left;
          !*line-height: 35px;*!
          width: 100%;
          overflow: hidden;
          !*border-bottom: 1px solid #c0ccda;*!
          min-height: 36px;
          background-color:#F7F8FC ;
          border: 1px solid #DEE2E5;
        }
        .view_type {
          margin-right: 0;
          float: left;
          width: 100%;
          padding: 5px;
          .el-input{
            width: 168px;
          }
        }
        .view_select{
          !*float: left;*!
          .el-select{
            float:left;
            width:40%;
            padding: 5px 0;
            padding-right: 5px;
          }
        }
        .number_marginUnit{
          width:85% !important;
          float: left;
          .el-input{
            width: 100% !important;
          }
        }
        .select_margin{
          width: 60% !important;
          float: left;
          .el-input{
            width: 100% !important;
          }
        }
        .view_unit {
          font-size: 16px;
          margin-right: 1%;
          float: right;
          padding: 5px 0;
          !*line-height: 35px;*!
        }
        .el-radio-group{
          !*padding-right: 15%;*!
          float: left;
          width: 180px;
          .el-radio{
            margin-left: 0 !important;
            margin-right: 5px !important;
            display: inline-block;
            float: left;
            margin: 4px 0;
          }
        }
        .el-checkbox-group{
          !*padding-right: 15%;*!
          float: left;
          width: 180px;
          .el-checkbox{
            margin-left: 0 !important;
            margin-right: 5px !important;
            display: inline-block;
            float: left;
            height: 20px !important;
          }
          .is-checked{

          }
        }
        .view_empty {
          font-size: 14px;
          cursor: pointer;
          color: #2d8cf0;
          float: left;
          !*line-height: 30px;*!
        }
      }
    }
    !*表格左右排列*!
    .minWidthMar{
      min-width: 20%;
    }
    //表格上下排列
    .view_box_um {
      font-size: 20px;
      float: left;
      width: 100%;
      !*margin-bottom: 5px;*!

      .view_title {
        !*margin-bottom: 1%;*!
        font-size: 14px;
        background-color: #ffffff;
        i{
          cursor:pointer;
        }
      }
      .tb_bgColor{
        background: #F7F8FC !important;
        float: left !important;
        margin-left: 0!important;
        width: 100% !important;
        line-height: 45px !important;
      }
      .view_content {
        float: left;
        margin-left: 0!important;
        width: 52%;
        line-height: 45px;
        background-color: #F7F8FC;
        .view_label {
          margin-right: 1%;
          font-size: 12px;
          float: left;
          min-width: 20%;
          height: 40px;
          line-height: 50px;
          overflow: hidden;
          padding-left: 2%;
        }
        .view_type {
          margin-right: 1%;
          float: left;
          width: 168px;
          .el-radio-group{
            .el-radio{
              margin-left:0;
            }
          }
          .el-checkbox-group{
            .el-checkbox{
              margin-right: 0;
            }
          }
        }
        .radio_type{
          width:auto !important;
          .el-radio-group{
            .el-radio{
              margin-left: 0 !important;
            }
          }
          .el-checkbox-group{
            .el-checkbox{
              margin-right: 0 !important;
            }
          }
        }
        .view_unit {
          font-size: 16px;
          margin-right: 1%;
          float: left;
          !*line-height: 35px;*!
        }
        .view_empty {
          font-size: 14px;
          cursor: pointer;
          color: #2d8cf0;
          float: left;
          !*line-height: 30px;*!
        }
      }
    }
  }
  .bg_container{
    background-color: #ffffff !important;
  }
  .iconfont{
    color:#3C81F0;
    cursor: pointer;
  }
  .del{
    color: #F0433C;
  }
  .td_center{
    position:absolute;
    top:1%;
    left:53%;
    z-index: 10000;
  }
  .lr_content{
    position:absolute;
    right: 15%;
    top: 45%;
  }*/
/*集合上下*/
.view_container_um{
  padding:5px 20px 5px 5px;
  margin-left: 15px;
  background-color: #F7F8FC;
  .view_box{
    display: table;
    /*width: 100%;*/
    height: 100%;
    margin-bottom: 2px;
    .view_title{
      display: table-cell;
      float: left;
      padding-left: 40px;
      position: relative;
      z-index: 10;
      cursor: pointer;
      .iconfont{
        font-size: 16px;
        color: #356CBC;
      }
    }
    .view_knowType{
      display: table-cell;
      float: left;
      position: relative;
      z-index: 10;
      .el-radio-group{
        transform: translateY(3px);
        .el-radio{
          margin-left: 15px;
          margin-right: 0px;
        }
      }
      .empty{
        position: relative;
        top: 2px;
        left: 5px;
        color: #3C81F0;
        cursor: pointer;
      }
    }
    .view_content{
      display: table-row;
      //单行
      .view_label_input{
        display: table-cell;
        width: 255px;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left: 40px;
        }
      }
      .td_center{
        display: table-cell;
        i{
          font-size: 14px;
          color: #3C81F0;
          cursor: pointer;
          display: table-cell;
        }
        .del{
          color: #F0433C;
        }
      }
      .lr_content{
        display: table-cell;
        line-height: 0;
        i{
          font-size: 14px;
          color: #3C81F0;
          cursor: pointer;
          display: table-cell;
        }
        .del{
          color: #F0433C;
        }
      }
      .view_type_input{
        display: table-cell;
        padding-left: 10px;
        .el-input{
          width: 168px;
        }
      }
      //多行
      .view_label_textarea{
        display: table-cell;
        width: 255px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left: 40px;
        }
      }
      //标签
      .view_label_label{
        display: table-cell;
        span{
          display: inline-block;
          /*padding-right: 80px;*/
          padding-left:40px;
        }
      }
      //日期
      .view_label_date{
        display: table-cell;
        width: 255px;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      //日期时间
      .view_label_time{
        display: table-cell;
        width: 255px;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      //数值框
      .view_label_number{
        display:table-cell;
        width: 255px;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      .view_unit{
        display: table-cell;
        padding-left: 2px;
      }
      .view_select{
        display: table-cell;
        width: 90px;
      }
      .view_type_number{
        display: table-cell;
        width: 90px;
      }
      //单选下拉
      .view_label_radioSelect{
        display:table-cell;
        width: 255px;
        white-space: nowrap;
        overflow: hidden;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 255px;
        }
      }
      .view_type_radioSelect{
        display: table-cell;
        padding-left: 10px;
        padding-right: 20px;
        .el-select{
          width: 168px;
        }
        .el-radio-group{
          .el-radio{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //多选下拉
      .view_label_checkBox{
        display:table-cell;
        width: 255px;
        white-space: nowrap;
        overflow: hidden;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 255px;
        }
      }
      .view_type_checkBox{
        display:table-cell;
        width: 170px;
        padding-left: 10px;
        .el-select{
          width: 168px;
          .el-input__inner{
            min-height: 30px !important;
          }
        }
      }
      //单选按钮
      .view_label_radio_btn{
        display: table-cell;
        width: 255px;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_radio_btn{
        display: table-cell;
        max-width: 484px;
        padding-left: 10px;
        padding-right: 20px;
        .el-radio-group{
          .el-radio{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //多选按钮
      .view_label_checkBox_btn{
        display: table-cell;
        width: 255px;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_checkBox_btn{
        display:table-cell;
        max-width: 484px;
        padding-left: 10px;
        padding-right: 20px;
        .el-checkbox-group{
          .el-checkbox{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //上传
      .view_label_upload{
        display: table-cell;
        width: 255px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_upload{
        padding-left: 10px;
        padding-right: 20px
      }
      //全局样式
      .view_type{
        display: table-cell;
        padding-left: 10px;
        padding-right: 20px
      }
      //全局样式 清空
      .view_empty{
        display: table-cell;
        color:#3C81F0;
        font-size: 12px;
        padding-left: 10px;
        cursor: pointer;
      }
    }
  }
}
  /*集合左右排列*/
.view_container_lr{
    /*padding:5px 20px 5px 5px;*/
    margin-left: 15px;
    float: left;
    .view_layout{
      display: inline-block; //在一行内显示，自动撑开
      /*float: left;*/  //去掉浮动。
      .view_boxlg{
        display: table;
        height: 100%;
        /*border-bottom: 1px solid #DEE2E5;*/
        .view_content{
          display: table-row;
          //输入框
          .view_label_input{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
              width: 119px;
            }
          }
          .view_type_input{
            display: table-cell;
            padding: 1px 15px 1px 15px;
            width: 210px;
            .el-input{
              width: 180px;
            }
          }
          //多行
          .view_label_textarea{
            display: table-cell;
            width: 119px;
            span{
              /*display: inline-block;*/
              display: table-row-group;
              /*padding-right: 43px;*/
              padding-left: 5px;
              overflow: hidden;
              /*position: relative;
              top: 50%;
              transform: translateY(-50%);*/
            }
          }
          .view_type_textarea{
            display: table-cell;
            padding: 1px 15px 1px 15px;
            .el-textarea{
              width: 180px;
              min-height: 45px;
              .el-textarea__inner{
                height: 45px ;
              }
            }
          }
          //标签
          .view_label_label{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            height: 32px;
            line-height: 32px;
            span{
              display: inline-block;
              padding-right: 0;
              padding-left:5px;
            }
          }
          .view_type_label{
            display: table-cell;
            padding: 1px 15px 1px 15px;
            width: 210px;
            /*padding-left: 15px;*/
          }
          //日期
          .view_label_date{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              /*display: inline-block;*/
              display: table-row-group;
              padding-left: 5px;
              width: 119px;
            }
          }
          .view_type_date{
            display: table-cell;
            padding: 1px 0px 1px 15px;
            width: 210px;
            .el-input__inner{
              width: 180px;
            }
          }
          //日期时间
          .view_label_time{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
            }
          }
          .view_type_time{
            display: table-cell;
            padding: 1px 0px 1px 15px;
            width: 210px;
            .el-input__inner{
              width: 180px;
            }
          }

          //数值框
          .view_label_number{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
            }
          }
          .view_type_number{
            display: table-cell;
            padding: 1px 0px 1px 15px;
            .el-input{
              width: 90px;
            }
          }
          .view_unit{
            display: table-cell;
            width: 105px;
            padding-left: 5px;
            padding-right: 10px;
          }
          .view_select{
            display: table-cell;
            padding-right: 15px;
            .el-input{
              width: 90px;
            }
          }
          //单选下拉
          .view_label_radioSelect{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
              width: 119px;
            }
          }
          .view_type_radioSelect{
            display: table-cell;
            padding: 1px 15px 1px 15px;
            .el-select{
              width: 180px;
            }
          }
          //下拉多选
          .view_label_checkBox{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
              width: 119px;
            }
          }
          .view_type_checkBox{
            display: table-cell;
            padding: 1px 15px 1px 15px;
            width: 210px;
            .el-input{
              width: 180px;
            }
          }
          //单选
          .view_label_radio_btn{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
            }
          }
          .view_type_radio_btn{
            display: table-cell;
            width: 182px;
            padding: 1px 10px 1px 15px;
            .el-radio-group{
              .el-radio{
                margin-right: 4px;
                margin-left: 0;
              }
            }
          }
          .view_empty_radio_btn{
            display: table-cell;
            color:#3C81F0;
            cursor: pointer;
            padding-right: 4px;
          }
          //多选按钮
          .view_label_checkBox_btn{
            display: table-cell;
            width: 119px;
            background-color: #F7F8FC;
            span{
              display: inline-block;
              padding-left: 5px;
              position: relative;
              top: 50%;
              transform: translateY(50%);
            }
          }
          .view_type_checkBox_btn{
            display: table-cell;
            width: 182px;
            padding: 1px 0 1px 15px;
            .el-checkbox-group{
              .el-checkbox{
                margin-left: 0;
                margin-right: 5px;
              }
            }
          }
          .view_empty_checkBox_btn{
            display: table-cell;
            color:#3C81F0;
            cursor: pointer;
            padding-right: 4px;
          }
          //全局样式
          .view_type{
            display: table-cell;
            padding-left: 15px;
          }

          //全局样式 清空
          .view_empty{
            display: table-cell;
            color:#3C81F0;
            font-size: 12px;
            padding-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
  /*表格上下排列*/
.view_container_tud{
  padding:5px 20px 5px 5px;
  margin-left: 15px;
  background-color: #F7F8FC;
  margin-top: 10px;
  .view_box{
    display: table;
    /*width: 100%;*/
    height: 100%;
    margin-bottom: 2px;
    .view_content{
      display: table-row;
      .icon{
        font-size: 14px;
        color: #3C81F0;
        .del{
          color: #F0433C;
        }
        .blue{
          color: #3C81F0;
        }
      }
      .td_center{
        display: table-cell;
      }
      //单行
      .view_label_input{
        display: table-cell;
        width: 255px;
        white-space: nowrap;
        overflow: hidden;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left: 40px;
        }
      }
      .view_type_input{
        display: table-cell;
        padding-left: 10px;
        .el-input{
          width: 168px;
        }
      }
      //多行
      .view_label_textarea{
        display: table-cell;
        width: 255px;

        span{
          display: inline-block;
          padding-right: 80px;
          padding-left: 40px;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      //标签
      .view_label_label{
        display: table-cell;
        width: 255px;
        span{
          display: inline-block;
          /*padding-right: 80px;*/
          padding-left:40px;
        }
      }
      //日期
      .view_label_date{
        display: table-cell;
        width: 255px;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      //日期时间
      .view_label_time{
        display: table-cell;
        width: 255px;
        span{
          display: inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      //数值框
      .view_label_number{
        display:table-cell;
        width: 255px;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
        }
      }
      .view_unit{
        display: table-cell;
        padding-left: 2px;
      }
      .view_select{
        display: table-cell;
        width: 90px;
      }
      .view_type_number{
        display: table-cell;
        width: 90px;
      }
      //单选下拉
      .view_label_radioSelect{
        display:table-cell;
        width: 255px;
        white-space: nowrap;
        overflow: hidden;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 255px;
        }
      }
      .view_type_radioSelect{
        display: table-cell;
        padding-left: 10px;
        padding-right: 20px;
        .el-select{
          width: 168px;
        }
        .el-radio-group{
          .el-radio{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //多选下拉
      .view_label_checkBox{
        display:table-cell;
        width: 255px;
        white-space: nowrap;
        overflow: hidden;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 255px;
        }
      }
      .view_type_checkBox{
        display:table-cell;
        width: 170px;
        padding-left: 10px;
        .el-select{
          width: 168px;
          .el-input__inner{
            min-height: 30px !important;
          }
        }
      }
      //单选按钮
      .view_label_radio_btn{
        display: table-cell;
        width: 255px;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_radio_btn{
        display: table-cell;
        max-width: 484px;
        padding-left: 10px;
        padding-right: 20px;
        .el-radio-group{
          .el-radio{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //多选按钮
      .view_label_checkBox_btn{
        display: table-cell;
        width: 255px;
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_checkBox_btn{
        display:table-cell;
        max-width: 484px;
        padding-left: 10px;
        padding-right: 20px;
        .el-checkbox-group{
          .el-checkbox{
            margin-left: 0;
            margin-right: 15px;
          }
        }
      }
      //上传
      .view_label_upload{
        display: table-cell;
        width: 255px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        span{
          display:inline-block;
          padding-right: 80px;
          padding-left:40px;
          width: 200%;
        }
      }
      .view_type_upload{
        padding-left: 10px;
        padding-right: 20px
      }
      //全局样式
      .view_type{
        display: table-cell;
        padding-left: 10px;
        padding-right: 20px
      }
      //全局样式 清空
      .view_empty{
        display: table-cell;
        color:#3C81F0;
        font-size: 12px;
        padding-left: 10px;
        cursor: pointer;
      }

    }
  }
}
  /*表格左右排列*/
.view_container_tlr{
  margin-left: 15px;
  padding-left: 40px;
  .view_layout{
    .view_box_td{
      display: table;
      height: 100%;
      float: left;
      .view_content_tlr{
        display: table-cell;
        //输入框
        .view_label_input_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_input_tlr{
          display: table-cell;
          padding: 0 5px;
          .el-input{
            width: 170px;
          }
        }
        //多行
        .view_label_textarea_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_textarea_tlr{
          display: table-cell;
          padding: 0 5px;
        }
        //标签
        .view_label_label_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_label_tlr{
          display: table-cell;
          padding: 0 5px;
        }
        //日期
        .view_label_date_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_date_tlr{
          display: table-cell;
          padding: 0 5px;
          .el-date-editor{
            width: 170px;
          }
        }
        //日期时间
        .view_label_time_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_time_tlr{
          display: table-cell;
          padding: 0 5px;
          .el-date-editor{
            width: 170px;
          }
        }
        //数值
        .view_label_number_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_number_tlr{
          display: table-cell;
          padding: 0 5px;
          .el-input{
            width: 90px;
          }
        }
        .view_unit_tlr{
          display:table-cell;
          padding-right: 5px;
        }
        .view_select_tlr{
          display: table-cell;
          padding-right: 5px;
          .el-select{
            width: 90px;
          }
        }
        //单选下拉
        .view_label_radioSelect_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_radioSelect_tlr{
          display: table-cell;
          padding-right: 5px;
          .el-select{
            width: 170px;
          }
        }
        //多选下拉
        .view_label_checkBox_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_checkBox_tlr{
          display: table-cell;
          padding-right: 5px;
          .el-select{

          }
        }
        //单选框
        .view_label_radio_btn_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_radio_btn_tlr{
          display: table-cell;
          padding-right: 5px;
          width:365px;
          .el-radio-group{
            .el-radio{
              margin-right: 4px;
              margin-left: 0;
            }
          }
        }
        .view_empty_radio_btn_tlr{
          display: table-cell;
          color:#3C81F0;
          cursor: pointer;
          padding-right: 4px;
        }
        //多选框
        .view_label_checkBox_btn_tlr{
          background-color: #F7F8FC;
          margin-bottom: 2px;
          min-height: 38px;
          border:1px solid rgba(222,226,229,1);
          span{
            display: inline-block;
            text-align: center;
            width: 100%;
            padding: 10px 0;
          }
        }
        .view_type_checkBox_btn_tlr{
          display: table-cell;
          padding-right: 5px;
          width:335px;
          .el-checkbox-group{
            .el-checkbox{
              margin-left: 0;
              margin-right: 4px;
            }
          }
        }
        .view_empty_checkBox_btn_tlr{
          display: table-cell;
          color:#3C81F0;
          cursor: pointer;
          padding-right: 4px;
        }
      }
    }
  }
}
</style>
