<template>
    <div class="parameter_config_container">
      <div class="config_select-content">
        <el-tabs v-model="activeName" type="card" @tab-click="handClick">
          <el-tab-pane label="基础设置" name="first">
            <el-form class="alignment" label-width="90px">
              <el-form-item class="layout_container" v-if="controlType!=='GATHER'&&controlType!=='TABLE'">
                <div class="layout_nav-box">
                  <div class="layout_title">
                    <div class="layout_name">布局</div>
                    <div class="layout_item-box">
                      <!--<span class="name_item">上一行</span>-->
                      <span class="name_item" :class="{'active':layoutColumn===1}" @click="changeColumn(1)">单列</span>
                      <span class="name_item" :class="{'active':layoutColumn===2}" @click="changeColumn(2)">双列</span>
                      <span class="name_item" :class="{'active':layoutColumn===3}" @click="changeColumn(3)">三列</span>
                      <span class="name_item" :class="{'active':layoutColumn===4}" @click="changeColumn(4)">四列</span>
                    </div>
                  </div>
                  <!--单列-->
                  <div class="column_1" v-if="layoutColumn===1">默认独占一行</div>
                  <!--双列-->
                  <div class="column_2" v-if="layoutColumn===2" >
                    <div class="column_item-12" v-for="(item,index) in column2" :class="{active:selectList.includes(item)}" @click="selectLayout(item)"></div>
                    <!--<div class="column_item-12"></div>-->
                  </div>
                  <!--三列-->
                  <div class="column_3" v-if="layoutColumn===3">
                    <div class="column_item-8" v-for="(item,index) in column3" :class="{active:selectList.includes(item)}" @click="selectLayout(item)"></div>
                  </div>
                  <!--四列-->
                  <div class="column_4" v-if="layoutColumn===4">
                    <div class="column_item-6" v-for="(item,index) in column4" :class="{active:selectList.includes(item)}" @click="selectLayout(item)"></div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                v-if="controlType=='SINGLE_COMBOX'||controlType=='MULTI_COMBOX'"
                label="可手动录入"
                class="line_blockCheck"
              >
                <el-radio-group v-model="basicDataInfo.obj.baseProperty.controlIsExtend">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="controlType=='DATE'||controlType=='DATE_TIME'"
                label="默认当前时间"
                class="line_blockDate"
              >
                <el-radio-group  v-model="basicDataInfo.obj.baseProperty.controlIsDefaultDateTime">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="controlType=='SINGLE_INPUT'||controlType=='MULTI_INPUT'"
                label="宽度设置"
                class="line_block"
              >
<!--                <el-select v-model="basic.widthVal" size="mini">-->
                <el-select v-model="basicDataInfo.obj.baseProperty.controlWidth" size="mini">
                  <el-option label="全长" :value="4"></el-option>
                  <el-option label="2倍全长" :value="8"></el-option>
                  <el-option label="1/4全长" :value="1"></el-option>
                  <el-option label="1/2全长" :value="2"></el-option>
                  <el-option label="3/4全长" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="controlType=='MULTI_INPUT'" label="高度设置" class="line_block">
                <el-input v-model.number="basicDataInfo.obj.baseProperty.controlHeight" size="mini" placeholder="请输入高度设置"></el-input>
                <span>&nbsp;&nbsp;行</span>
              </el-form-item>

              <el-form-item v-if="controlType!='DATE'&&controlType!='DATE_TIME'&&controlType!=='FILE_UPLOAD'&&controlType!='GATHER'&&controlType!='TABLE'&&controlType!=='LABEL'" label="输入提示" class="line_block">
                <el-input v-model="basicDataInfo.obj.baseProperty.controlTip" size="mini" placeholder="请输入重要的提示"></el-input>
              </el-form-item>
              <el-form-item v-if="controlType=='FILE_UPLOAD'" label="上传类型" class="line_block">
                <el-select v-model="basicDataInfo.obj.baseProperty.fileType">
                  <el-option label="文件" value="FILE"></el-option>
                  <el-option label="图片" value="IMAGE"></el-option>
                </el-select>
                <!--<el-button type="primary" @click="uploadFileOrImg">上传</el-button>-->
                <!--<el-button>取消</el-button>-->
                <!--<el-upload
                  class="upload-demo"
                  ref="upload"
                  drag
                  :action="uploadActionUrl"
                  :auto-upload="false"
                  :on-change="onChange"
                  :on-remove="onRemove"
                  :multiple="true">
                  &lt;!&ndash;:before-upload="onBeforeUpload" :http-request="beforeUploadFile"&ndash;&gt;
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text" v-if="UploadType=='FILE'">将<em>文件</em>拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__text" v-if="UploadType=='IMAGE'">将<em>图片</em>拖到此处，或<em>点击上传</em></div>
                </el-upload>-->
              </el-form-item>
              <el-form-item v-if="controlType=='LABEL'" label="标签类型">
                <el-select v-model="basicDataInfo.obj.baseProperty.labelType" size="mini" @change="changeLabelType(basicDataInfo)">
                  <el-option label="文本" value="TEXT"></el-option>
                  <el-option label="图片" value="IMAGE"></el-option>
                </el-select>
                <div style="display:inline-block">
                  <el-upload v-if="basicDataInfo.obj.baseProperty.labelType=='IMAGE'" style="display:inline-block"
                             ref="upload"
                             action="http://39.108.238.209:8805/research/file/uploadFile.do"
                             :on-success="handleUploadSuccess"
                             :show-file-list="false"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="basicDataInfo.obj.baseProperty.labelType=='IMAGE'" size="small" type="primary" @click="onCubeImg">截图</el-button>
                </div>
                <div class="Img_width_set" v-if="basicDataInfo.obj.baseProperty.labelType=='IMAGE'&&controlType=='LABEL'">
                  <span class="demonstration" style="float: left;display: inline-block">缩放比例</span>
                  <el-slider class="slider_box" style="width: 80%;padding-left: 9%;display: inline-block;" v-model="sliderValue" :marks="sliderMarks" @change="changeZoom"></el-slider>
                </div>
              </el-form-item>
              <el-form-item v-if="basicDataInfo.obj.baseProperty.labelType=='TEXT'&&controlType=='LABEL'" label="标签内容" class="line_blockLabel">
                <el-input class="widthSet" v-model="basicDataInfo.obj.baseProperty.labelContent" type="textarea" :rows="5" placeholder="请输入标签内容"></el-input>
              </el-form-item>
              <div v-if="basicDataInfo.obj.baseProperty.labelType=='IMAGE'&&controlType=='LABEL'" style="height:340px">
                <vue-cropper
                  ref="cropper"
                  :img="option.img"
                  :autoCrop="true"
                  :full="true"
                  :infoTrue="true"
                  :canScale="true"
                  @realTime="realTime"
                  @imgLoad="imgLoad"
                  mode="auto"
                ></vue-cropper>
                <!--              mode="100%"-->
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="数据设置" name="second">
            <el-form class="alignment data_set_container" label-width="80px">
              <el-checkbox v-model="dataSetting.dataBind" v-if="controlType=='FILE_UPLOAD'||controlType=='LABEL'" disabled>启动数据绑定</el-checkbox>
              <el-checkbox v-model="dataSetting.dataBind"  v-else>启动数据绑定</el-checkbox>
              <div v-if="dataSetting.dataBind" class="data_set-box">
                <el-form-item class="mt_10" label="绑定域" placeholder="请选择数据域">
                  <el-select
                    v-model="dataSetting.bindingDomain"
                    size="mini"
                    @change="changeDataDomain"
                  >
                    <el-option
                      v-for="(it,index) in viewList"
                      :key="index"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item class="mg_10" label="显示列">
                  <el-select
                    collapse-tags
                    v-model="dataSetting.bindingColumns"
                    size="mini"
                    placeholder="请选择显示列"
                    value-key="name"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="it in viewColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it"
                    />
                  </el-select>
                  <!--<span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分组列&nbsp;&nbsp;
                  <el-select
                    collapse-tags
                    class="show_column"
                    v-model="dataSetting.groupColumns"
                    size="mini"
                    placeholder="请选择分组列"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>
                  <span>
                  &nbsp;&nbsp;Key列 &nbsp;&nbsp;
                  <el-select
                    collapse-tags
                    v-model="dataSetting.keyColumn"
                    size="mini"
                    placeholder="请选择Key列"
                    allow-create
                    filterable
                    default-first-option
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>-->
                </el-form-item>
                <el-form-item class="mg_10" label="分组列">
                  <!--<el-select
                    collapse-tags
                    v-model="dataSetting.bindingColumns"
                    size="mini"
                    placeholder="请选择显示列"
                    value-key="name"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="it in viewColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it"
                    />
                  </el-select>-->
                  <span>
                  <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分组列&nbsp;&nbsp;-->
                  <el-select
                    collapse-tags
                    class="show_column"
                    v-model="dataSetting.groupColumns"
                    size="mini"
                    placeholder="请选择分组列"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>
                  <!--<span>
                  &nbsp;&nbsp;Key列 &nbsp;&nbsp;
                  <el-select
                    collapse-tags
                    v-model="dataSetting.keyColumn"
                    size="mini"
                    placeholder="请选择Key列"
                    allow-create
                    filterable
                    default-first-option
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>-->
                </el-form-item>
                <el-form-item label="key列">
                  <!--<el-select
                    collapse-tags
                    v-model="dataSetting.bindingColumns"
                    size="mini"
                    placeholder="请选择显示列"
                    value-key="name"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="it in viewColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it"
                    />
                  </el-select>
                  <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分组列&nbsp;&nbsp;
                  <el-select
                    collapse-tags
                    class="show_column"
                    v-model="dataSetting.groupColumns"
                    size="mini"
                    placeholder="请选择分组列"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>-->
                  <span>
                  <!--&nbsp;&nbsp;Key列 &nbsp;&nbsp;-->
                  <el-select
                    collapse-tags
                    v-model="dataSetting.keyColumn"
                    size="mini"
                    placeholder="请选择Key列"
                    allow-create
                    filterable
                    default-first-option
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>
                </el-form-item>
                <el-form-item class="binding_type-box mg_10" label="绑定类型">
                  <el-select
                    v-model="dataSetting.bindingType"
                    size="mini"
                    placeholder="请选择绑定类型"
                    clearable
                  >
                    <el-option
                      v-for="(it,index) in typeList"
                      :key="index"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                  <!--<span>
                  &nbsp;&nbsp;绑定属性&nbsp;&nbsp;
                  <el-select
                    v-if="dataSetting.bindingDomain!='INHERIT'"
                    v-model="dataSetting.bindingAttr"
                    size="mini"
                    placeholder="属性名称"
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                  <el-select
                    v-if="dataSetting.bindingDomain=='INHERIT'"
                    v-model="dataSetting.bindingAttr"
                    size="mini"
                    placeholder="父属性名称"
                  >
                    <el-option
                      v-for="it in dataSetting.parentBindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>-->
                </el-form-item>
                <el-form-item class="binding_type-box" label="绑定属性">
                  <!--<el-select
                    v-model="dataSetting.bindingType"
                    size="mini"
                    placeholder="请选择绑定类型"
                    clearable
                  >
                    <el-option
                      v-for="(it,index) in typeList"
                      :key="index"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>-->
                  <span>
                  <!--&nbsp;&nbsp;绑定属性&nbsp;&nbsp;-->
                  <el-select
                    v-if="dataSetting.bindingDomain!='INHERIT'"
                    v-model="dataSetting.bindingAttr"
                    size="mini"
                    placeholder="属性名称"
                    clearable
                  >
                    <el-option
                      v-for="it in dataSetting.bindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                  <el-select
                    v-if="dataSetting.bindingDomain=='INHERIT'"
                    v-model="dataSetting.bindingAttr"
                    size="mini"
                    placeholder="父属性名称"
                  >
                    <el-option
                      v-for="it in dataSetting.parentBindingColumns"
                      :key="it.name"
                      :label="it.label"
                      :value="it.name"
                    />
                  </el-select>
                </span>
                </el-form-item>
                <el-form-item class="filter-box" label="过滤条件">
                  <div class="add_btn">
                    <i class="iconfont iconfuhao1" @click="addFilter"></i>
                  </div>
                  <div class="inline " v-for="(item,index) in dataSetting.filter" :key="index">
                    <el-select
                      v-if="dataSetting.bindingDomain!='INHERIT'"
                      v-model="item.columnEn"
                      size="mini"
                      placeholder="列名"
                    >
                      <el-option
                        v-for="it in dataSetting.bindingColumns"
                        :key="it.name"
                        :label="it.label"
                        :value="it.name"
                      />
                    </el-select>
                    <el-select
                      v-if="dataSetting.bindingDomain=='INHERIT'"
                      v-model="item.columnEn"
                      size="mini"
                      placeholder="列名"
                    >
                      <el-option
                        v-for="it in dataSetting.parentBindingColumns"
                        :key="it.name"
                        :label="it.label"
                        :value="it.name"
                      />
                    </el-select>
                    <el-select v-model="item.operator" size="mini" placeholder="运算符">
                      <el-option
                        v-for="item in conditionOperatorList"
                        :key="item.name"
                        :label="item.label"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                    <el-date-picker
                      v-if="getColumnType(item)== 'DATE'|| getColumnType(item).indexOf('TIMESTAMP')!=-1"
                      type="datetime"
                      size="mini"
                      v-model="item.param"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      clearable
                      placeholder="选择日期时间"
                    ></el-date-picker>
                    <el-date-picker
                      v-if="item.operator =='Between' &&(getColumnType(item)== 'DATE'|| getColumnType(item).indexOf('TIMESTAMP')!=-1)"
                      type="datetime"
                      size="mini"
                      v-model="item.param2"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      clearable
                      placeholder="选择日期时间"
                    ></el-date-picker>
                    <el-input
                      v-if="getColumnType(item)!= 'DATE'&& getColumnType(item).indexOf('TIMESTAMP')==-1"
                      placeholder="填写参数"
                      v-model="item.param"
                      size="mini"
                      :maxlength="40"
                      :clearable="true"
                    ></el-input>
                    <el-input
                      v-if="item.operator =='Between' &&(getColumnType(item)!= 'DATE'&& getColumnType(item).indexOf('TIMESTAMP')==-1)"
                      placeholder="填写参数"
                      v-model="item.param"
                      size="mini"
                      :maxlength="40"
                      :clearable="true"
                    ></el-input>
                    <i class="iconfont iconfuhao4 del" @click="delFilter(index)"></i>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="range_container" label="值域" name="range"
                       v-if="controlType=='NUMBER_INPUT'||controlType=='SINGLE_COMBOX'||controlType=='MULTI_COMBOX'||controlType=='RADIO_BUTTON'||controlType=='CHECKBOX'||controlType=='GATHER'">
            <el-form class="alignment">
              <el-form-item label="值域选项">
                <el-input type="textarea" :rows="5" v-model="basicDataInfo.obj.termSet.rangeText" ></el-input>
                <div class="range_notes">每行代表一个选项，可以添加多个选项，名称和代表分值用“^”隔开，分值不是必填项。例：胸痛^10</div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
  import { VueCropper } from "vue-cropper";
    export default {
      name: "parameterConfig",
      components:{
        VueCropper
      },
      props:{
        basicDataInfo: {
          type: Object,
          default: null
        }
      },
      watch:{
        "basicDataInfo":function (data) {
          this.init();
        },
        //监听是否启用 数据绑定并转换成 Number 类型
        'dataSetting.dataBind':function (data) {
          if(data){
            this.basicDataInfo.obj.binding  = 1;
          }else{
            this.basicDataInfo.obj.binding  = 0;
          }
        },
        'labelImage':function (data) {
          this.basicDataInfo.obj.baseProperty.labelImage = data;
        }
      },
      data() {
        return {
          dialogFormVisible: true,
          isDefaultDate: "0", //日期是否默认
          isExtend: "0", //是否可扩展
          controlType: "",

          basic: {
            //基础信息
            widthVal: "4", //宽度设置
            placeholderInfo: "", // 输入重要提示
            heightValue: "2" //高度设置
          },
          //数据设置
          dataSetting: {
            dataBind: false, //启动数据绑定
            bindingDomain: "", //绑定域
            bindingType: "", //绑定类型
            bindingAttr: "", //绑定属性
            bindingColumns: [],
            parentBindingColumns: [],
            groupColumns: [], //分组列，用于设置检验指标的纵向存储的数据
            keyColumn: "", //分组列下的key列，用于设置哪列转换为key列
            //过滤条件
            filter: []
          },
          typeList: [], //数据绑定类型
          viewList: [], //数据域及字段
          viewColumns: [], //数据域的字段集合
          parentViewColumns: [], //父数据域的字段集合
          conditionOperatorList: [],
          activeName: "first",
          UploadType:'FILE',
          uploadActionUrl:'http://39.108.238.209:8805/research/file/uploadFiles.do',
          fileList:[],
          itemFileRsp:[],
          //布局 设置
          layoutColumn:1,//1 单列 2 双列 3 三列 4 四列
          selectList:[],//选中数据
          column2:[
            {
              column:12,
              position:1
            },
            {
              column:12,
              position:2
            }
          ],
          column3:[
            {
              column:8,
              position:1
            },
            {
              column:8,
              position:2
            },
            {
              column:8,
              position:3
            }
          ],
          column4:[
            {
              column:6,
              position:1
            },
            {
              column:6,
              position:2
            },
            {
              column:6,
              position:3
            },
            {
              column:6,
              position:4
            }
          ],
          //标签参数
          labelContent: "", //标签内容
          labelType: "TEXT",
          labelImage:"",
          option: {
            img:""
          },
          /*marks: {
            0: "0",
            25: "25",
            50: "50",
            75: "75",
            100: "100"
          },*/
          previews:{},
          sliderValue:100,
          sliderMarks:{
            0:'0%',
            25:'25%',
            50:'50%',
            75:'75%',
            100:'100%'
          }
        }
      },
      methods:{
        clickSaveBtn() {
          this.dialogFormVisible = false;
          let newData = this.basicDataInfo;
          newData.obj.baseProperty.controlIsDefaultDateTime = this.isDefaultDate;
          newData.obj.baseProperty.controlIsExtend = this.isExtend;
          newData.obj.baseProperty.controlHeight = this.basic.heightValue || "";
          newData.obj.baseProperty.controlWidth = this.basic.widthVal || "";
          newData.obj.baseProperty.controlTip = this.basic.placeholderInfo || "";
          newData.obj.baseProperty.bindingInfo.bindingColumn = this.dataSetting.bindingAttr;
          newData.obj.baseProperty.bindingInfo.bindingType = this.dataSetting.bindingType;
          if (this.dataSetting.bindingColumns) {
            newData.obj.baseProperty.bindingInfo.viewColumn = this.dataSetting.bindingColumns
              .map(o => o.name)
              .join(",");
          }

          newData.obj.baseProperty.bindingInfo.viewId = this.dataSetting.bindingDomain;
          newData.obj.baseProperty.bindingInfo.list = this.dataSetting.filter;
          newData.obj.binding = this.dataSetting.dataBind ? 1 : 0;
          //保存分组列和Key列
          if (this.dataSetting.groupColumns) {
            newData.obj.baseProperty.bindingInfo.groupColumn = this.dataSetting.groupColumns.join(
              ","
            );
          }
          newData.obj.baseProperty.bindingInfo.keyColumn = this.dataSetting.keyColumn;
          newData.obj.baseProperty.itemFileRsp = this.itemFileRsp;
          newData.obj.baseProperty.fileType = this.UploadType;
          console.log(JSON.stringify(newData.obj));
          this.$emit("basic-click", newData);
        },
        //tab 标签页
        handClick(tab, event) {
          console.log(tab, event);
        },
        //选择布局
        changeColumn(data) {
          this.layoutColumn = data;
          this.selectList = [];
        },
        //布局 位置选择
        selectLayout(item) {
          const index = this.selectList.indexOf(item);
          if(index > -1) {
            this.selectList.splice(index,1)
          }else{
            this.selectList.push(item)
          }
          console.log(this.selectList);
          //选择列 只能连着选

        },
        //添加过滤条件
        addFilter() {
          console.log("点击添加成功");
          let list = {
            id: "",
            bindingId: "",
            columnEn: "", //列
            operator: "", //运算符
            param: "", //填写参数
            param2: "" //填写参数
          };
          this.dataSetting.filter.push(list);
        },
        //删除过滤条件
        delFilter(index) {
          this.dataSetting.filter.splice(index, 1);
        },
        //自定义上传
        beforeUploadFile() {
          let that = this;
          let param = new FormData();
          if(that.fileList.length!==0){
            that.fileList.forEach(item => {
              param.append('files', item.raw);
            });
            // param.append('fileType', this.UploadType);
          }else {
            return false;
          }
          that.fileUploadHttp(param).then(res=>{
            if(res.data.code==0) {
              that.$notice(res.data.msg);
              that.itemFileRsp = res.data.data;
            }
          }).catch(error=>{
            console.log(error)
          })
        },
        onChange(file,fileList) { //注意：就算一次选取多个文件，这里依旧会执行多次
          /*console.log(file,fileList);
          let extension = file.name.substring(file.name.lastIndexOf('.')+1);
          if(this.UploadType=='FILE'){
            if(extension=='doc'||extension == 'xlsx'||extension=='pdf') {
              this.fileList = fileList;
            }else{
              this.$message.info('上传文件格式不正确！');
              return false;
            }
          }else if(this.UploadType=='IMAGE') {
            if(extension=='png'|| extension=='gif'||extension=='jpg'|| extension=='jpeg'){
              this.fileList = fileList;
            }else{
              this.$message.info('只能上传图片格式');
              return false;
            }
          }*/
          this.fileList = fileList
        },
        onRemove(file,fileList) {
          this.fileList = fileList
        },
        //上传
        uploadFileOrImg() {
          this.beforeUploadFile();
        },
        //上传类型
        changeUploadType(value) {
        },
        //自定义文件上传接口
        fileUploadHttp(param) {
          let url = this.uploadActionUrl;
          return axios.post(url,param,{
            headers: {"content-type": "multipart/form-data"}
          })
        },
        //获取数据绑定类型列表
        async searchBindingTypeList() {
          try {
            let result = await this.$http.searchBindingTypeList();
            if (result && result.code == "0") {
              this.typeList = result.data;
            }
          } catch (error) {
            this.$notice("获取数据绑定类型列表失败");
            console.log(error);
          }
        },
        //获取数据绑定域及字段
        async searchBindingViewList() {
          try {
            let result = await this.$http.searchBindingViewList();
            if (result && result.code == "0") {
              this.viewList = result.data;
              this.init();
            }
          } catch (error) {
            this.$notice("获取数据绑定域列表事变");
            console.log(error);
          }
        },
        async getOperators() {
          let that = this;
          try {
            let data = await that.$http.casesFindOperators();
            if (data && data.code == "0") {
              that.conditionOperatorList = data.data;
            }
          } catch (error) {
            that.$notice("获取运算符失败");
            console.log(error);
          }
        },
        //根据选择的数据域切换显示列集合
        changeDataDomain(value) {
          console.log(value);
          this.dataSetting.bindingColumns=[];
          this.dataSetting.groupColumns=[];
          this.dataSetting.keyColumn=null;
          this.dataSetting.bindingType=null;
          this.dataSetting.bindingAttr=null;
          this.viewColumns = this.viewList.find(e => e.name == value).subOptions;
        },
        //获取数据类型
        getColumnType(item) {
          if (item.column) {
            return this.dataSetting.bindingColumns.find(e => item.column == e.name)
              .dataType;
          }
          return "";
        },
        /**
         *  controlType = LABEL
         *  控件为标签时，触发事件方法
         * **/
        //标签类型
        changeLabelType(data) {
          if(data.obj.baseProperty.labelType=='TEXT'){
            //清空labelImg
            data.obj.baseProperty.labelImage = ""
          }else{
            //清空 labelContent
            data.obj.baseProperty.labelContent = ""
          }
        },
        // 实时预览函数
        realTime(data) {
          console.log(data);
          this.previews = data;
        },
        imgLoad(msg) {
          console.log(msg);
        },
        // 确定裁剪图片
        onCubeImg() {
          // 获取cropper的截图的base64 数据
          this.$refs.cropper.getCropData(data => {

            let that=this;
            //将剪裁后base64的图片转化为file格式
            let file = this.convertBase64UrlToBlob(data);

            let param = new FormData(); //创建form对象
            param.append("file", file); //通过append向form对象添加数据

            //将剪裁后的图片执行上传
            this.$axios({
              method: "post",
              url: "/file/uploadFile.do",
              headers: { "Content-Type": "multipart/form-data" },
              data: param
            }).then(function(response) {
              // console.log('将剪裁后的图片执行上传',response.data.data);
              that.option.img = "http://39.108.238.209:8805/research/file/downloadFile/" + response.data.data;
              that.labelImage=response.data.data;
            });
          });
        },
        //上传按钮上传成功执行事件
        handleUploadSuccess(response, file, fileList) {
          let that=this;
          //上传成功后将图片地址赋值给裁剪框显示图片
          this.$nextTick(() => {
            that.option.img = "http://39.108.238.209:8805/research/file/downloadFile/" + response.data;
            that.labelImage=response.data;
          });
        },
        // 将base64的图片转换为file文件
        convertBase64UrlToBlob(urlData) {
          let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
          //处理异常,将ascii码小于0的转换为大于0
          let ab = new ArrayBuffer(bytes.length);
          let ia = new Uint8Array(ab);
          for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
          }
          return new Blob([ab], { type: "image/jpeg" });
        },
        //缩放比列
        changeZoom(value) {
          console.log('缩放比列',value,this.$refs.cropper);
          // value = value || 1
          // this.$refs.cropper.scaleImg(value)
        },
        //初始化参数
        init() {
          let newData = this.basicDataInfo;
          this.controlType = newData.obj.controlType;
          this.isDefaultDate = newData.obj.baseProperty.controlIsDefaultDateTime;
          this.isExtend = newData.obj.baseProperty.controlIsExtend;
          this.basic.heightValue = newData.obj.baseProperty.controlHeight;
          this.dataSetting.dataBind = newData.obj.binding == 1 ? true : false;
          this.basic.widthVal = newData.obj.baseProperty.controlWidth;
          this.basic.placeholderInfo = newData.obj.baseProperty.controlTip;
          this.dataSetting.bindingAttr =
            newData.obj.baseProperty.bindingInfo.bindingColumn;
          this.dataSetting.bindingType =
            newData.obj.baseProperty.bindingInfo.bindingType;
          this.dataSetting.bindingDomain =
            newData.obj.baseProperty.bindingInfo.viewId;
          this.dataSetting.filter = newData.obj.baseProperty.bindingInfo.list;
          if (!this.dataSetting.filter) {
            this.dataSetting.filter = [];
          }
          //分组设置
          if (newData.obj.baseProperty.bindingInfo.groupColumn) {
            this.dataSetting.groupColumns = newData.obj.baseProperty.bindingInfo.groupColumn.split(
              ","
            );
          }
          this.dataSetting.keyColumn =
            newData.obj.baseProperty.bindingInfo.keyColumn;

          if (newData.obj.baseProperty.bindingInfo.viewColumn) {
            this.dataSetting.bindingColumns = [];
            let cols = newData.obj.baseProperty.bindingInfo.viewColumn.split(",");
            if (cols.length) {
              let it = this.viewList.find(
                e => e.name == this.dataSetting.bindingDomain
              );
              cols.forEach(element => {
                this.viewColumns = it.subOptions;
                let colobj = this.viewColumns.find(e => e.name == element);
                if (colobj) {
                  this.dataSetting.bindingColumns.push(colobj);
                }
              });
            }
          }

          if (newData.rootBinding) {
            this.dataSetting.parentBindingColumns = [];
            let cols = newData.rootBinding.baseProperty.bindingInfo.viewColumn.split(
              ","
            );
            if (cols.length) {
              let it = this.viewList.find(
                e => e.name == newData.rootBinding.baseProperty.bindingInfo.viewId
              );
              cols.forEach(element => {
                this.parentViewColumns = it.subOptions;
                let colobj = this.parentViewColumns.find(e => e.name == element);
                if (colobj) {
                  this.dataSetting.parentBindingColumns.push(colobj);
                }
              });
            }
          }
        }
      },
      mounted(){},
      created() {
        console.log(this.basicDataInfo);
        //初始化集合
        this.searchBindingTypeList();
        this.searchBindingViewList();
        this.getOperators();
      }
    }
</script>

<style lang="less" scoped>
.parameter_config_container{
  .config_select-content{
    .layout_nav-box{
      display: flex;
      flex-direction: column;
      width: 100%;
      .layout_title{
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        font-size: 14px;
        color: #394263;
        align-items: center;
        .layout_name{
          margin-right: 40px;
        }
        .layout_item-box{
          display: flex;
          flex-direction: row;
          .name_item{
            padding: 2px 10px;
            cursor: pointer;
            background-color: #F5F7FA;
            &:first-child{
              border-radius:2px 0 0 2px;
            }
            &:last-child{
              border-radius:0 2px 2px 0;
            }
          }
          .active{
            color: #ffffff;
            background-color: #9CA0B1;
          }
          :hover{
            background-color: #9CA0B1;
            color: #ffffff;
          }
        }
      }
      .column_1{
        height: 36px;
        font-size: 14px;
        color: #394263;
        margin-top: 20px;
      }
      .column_2{
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        .column_item-12{
          width: 50%;
          height: 36px;
          border: 1px solid #E5EBEC;
          cursor: pointer;
        }
        .active{
          background-color: #9CA0B1;
          border-color: #9CA0B1;
          &:last-child{
            border-left-color: #ffffff;
          }
        }
      }
      .column_3{
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        .column_item-8{
          width: 33.33%;
          height: 36px;
          border: 1px solid #E5EBEC;
          cursor: pointer;
        }
        .active{
          background-color: #9CA0B1;
          border-color: #9CA0B1;
          border-right-color: #ffffff;
          &:last-child{
            border-left-color: #9CA0B1;
          }
        }
      }
      .column_4{
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        .column_item-6{
          width: 25%;
          height: 36px;
          border: 1px solid #E5EBEC;
          cursor: pointer;
        }
        .active{
          background-color: #9CA0B1;
          border-color: #9CA0B1;
          border-right-color: #ffffff;
          &:last-child{
            border-left-color: #9CA0B1;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
  .config_select-content .el-form-item__content{
    margin-left: 0 !important;
  }
  .config_select-content {
    .line_block{
      display: flex;
      flex-direction: row;
      .el-form-item__content{
        display: flex;
        .el-input{
          width: 160px;
        }
      }
    }
  }
  .data_set_container{
    .filter-box{
      .inline{
        display: flex;
        margin-bottom: 10px;
        .iconfont{
          font-size:16px;
          color: #D95555;
          cursor: pointer;
        }
        .el-select,.el-input{
          width: 117px;
          margin-right: 10px;
        }
      }
      .add_btn{
        i{
          font-size: 18px;
          color: #1BBAE1;
          cursor: pointer;
        }
      }
    }
  }
  .el-form-item{
    .el-form-item__label{
      text-align: left;
    }
  }
  .Img_width_set{
    .demonstration{
      font-size: 14px;
      color: #394263;
    }
  }
  .data_set-box{
    .mg_10{
      margin-bottom: 10px;
    }
    .mt_10{
      margin-top: 10px;
    }
  }
  .range_container{
    .el-form-item__content{
      .range_notes{
        font-size: 12px;
        color: #394263;
      }
    }
  }
</style>
