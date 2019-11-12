<template>
  <div v-if="dialogShow">
    <el-dialog title="标签" :visible.sync="dialogFormVisible"  :close-on-click-modal="false">
      <el-tabs v-model="activeName" @tab-click="handClick">
        <el-tab-pane label="基础设置" name="first">
          <el-form class="alignment">
            <el-form-item label="标签类型">
              <el-select v-model="labelType" size="mini">
                <el-option label="文本" value="TEXT"></el-option>
                <el-option label="图片" value="IMAGE"></el-option>
              </el-select>
              <div style="display:inline-block">
                <el-upload v-if="labelType=='IMAGE'" style="display:inline-block"
                ref="upload"
                action="http://39.108.238.209:8805/research/file/uploadFile.do"
                :on-success="handleUploadSuccess"
                :show-file-list="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <el-button v-if="labelType=='IMAGE'" size="small" type="primary" @click="onCubeImg">截图</el-button>
              </div>
              <div class="Img_width_set" v-if="labelType=='IMAGE'">
                <span class="demonstration" style="float: left;display: inline-block">缩放比例</span>
                <el-slider class="slider_box" style="width: 50%;padding-left: 2%;display: inline-block;" v-model="sliderValue" :marks="sliderMarks" @change="changeZoom"></el-slider>
              </div>
            </el-form-item>
            <el-form-item v-if="labelType=='TEXT'" label="标签内容" class="line_blockLabel">
              <el-input class="widthSet" v-model="labelContent" type="textarea" :rows="5" placeholder="请输入标签内容"></el-input>
            </el-form-item>
            <div v-if="labelType=='IMAGE'" style="height:340px">
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
          <el-form class="alignment" label-width="80px">
            <el-checkbox v-model="dataSetting.dataBind" disabled>启动数据绑定</el-checkbox>
            <div v-if="dataSetting.dataBind">
              <el-form-item label="绑定域" placeholder="医嘱域">
                <el-select v-model="dataSetting.bindingDomain" size="mini">
                  <el-option value="0" label="无"></el-option>
                </el-select>
                <!--<span>绑定类型</span>
                <el-select v-model="dataSetting.bindingType" size="mini" placeholder="属性值">
                  <el-option label="无" value="0"></el-option>
                </el-select>-->
              </el-form-item>
              <el-form-item label="绑定类型" class="item-left">
                <el-select v-model="dataSetting.bindingType" size="mini" placeholder="属性值">
                  <el-option label="无" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="绑定属性">
                <el-select v-model="dataSetting.bindingAttr" size="mini" placeholder="药品名臣">
                  <el-option label="无" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="过滤条件">
                <div class="inline" v-for="(item,index) in dataSetting.filter">
                  <el-select v-model="item.column" size="mini" placeholder="列名">
                    <el-option label="无" value="0"></el-option>
                  </el-select>
                  <el-select v-model="item.operator" size="mini" placeholder="运算符">
                    <el-option label="无" value="0"></el-option>
                  </el-select>
                  <el-select v-model="item.config" size="mini" placeholder="填写参数">
                    <el-option label="无" value="0"></el-option>
                  </el-select>
                  <i
                    class="iconfont iconfuhao1"
                    @click="addFilter"
                    v-show="index == dataSetting.filter.length-1 ? true : false"
                  ></i>
                  <i class="iconfont iconfuhao4 del" @click="delFilter(index)"></i>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickSaveBtn" type="primary">确定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "dialoglabel",
  props: {
    dialogShow: {
      type: Boolean,
      default: null
    },
    basicDataInfo: {
      type: Object,
      default: null
    }
  },
  components: {
    VueCropper
  },
  data() {
    return {
      dialogFormVisible: true,
      labelContent: "", //标签内容
      labelType: "TEXT",
      labelImage:"",
      //数据设置
      dataSetting: {
        dataBind: false, //启动数据绑定
        bindingDomain: "", //绑定域
        bindingType: "", //绑定类型
        bindingAttr: "", //绑定属性
        //过滤条件
        filter: [
          {
            column: "", //列
            operator: "", //运算符
            config: "" //填写参数
          }
        ]
      },
      activeName: "first",
      option: {
        img:""
      },
      marks: {
        0: "0",
        25: "25",
        50: "50",
        75: "75",
        100: "100"
      },
      previews:{},
      sliderValue:100,
      sliderMarks:{
        0:'0%',
        25:'25%',
        50:'50%',
        75:'75%',
        100:'100%'
      }
    };
  },
  watch: {
    dialogShow: function(val) {
      console.log(this.dialogShow);
      this.dialogFormVisible = true;
    },
    dialogFormVisible: function(value) {
      console.log("触发dialogFormVisible", value);
      if (value == false) {
        this.$emit("dialog-close", false);
      }
    }
  },
  methods: {
    clickSaveBtn() {
      this.dialogFormVisible = false;
      let newData = this.basicDataInfo;
      newData.obj.baseProperty.labelContent = this.contentLabel || "";
      newData.obj.baseProperty.labelType = this.labelType || "";
      newData.obj.baseProperty.labelImage = this.labelImage || "";
      if(this.labelType == 'IMAGE') { //处理缩放比列
        let w =(this.$refs.cropper.cropInfo.width*this.sliderValue)/100;
        let h =(this.$refs.cropper.cropInfo.height*this.sliderValue)/100;
        newData.obj.baseProperty.controlWidth = w;
        newData.obj.baseProperty.controlHeight = h;
      }else{
        //等于 文本时 还原默认参数
        newData.obj.baseProperty.controlWidth = 4;
        newData.obj.baseProperty.controlHeight = 0;
      }
      this.$emit("basis-click", newData);
    },
    //tab 标签页
    handClick(tab, event) {
      console.log(tab, event);
    },
    //添加过滤条件
    addFilter() {
      console.log("点击添加成功");
      let list = {
        column: "", //列
        operator: "", //运算符
        config: "" //填写参数
      };
      this.dataSetting.filter.push(list);
    },
    //删除过滤条件
    delFilter(index) {
      this.dataSetting.filter.splice(index, 1);
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
          console.log(response)
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
    }
  },
  mounted() {
    console.log('this.basicDataInfo')
      console.log(this.basicDataInfo)
     let newData = this.basicDataInfo;
      this.labelType=newData.obj.baseProperty.labelType;
      this.labelImage=newData.obj.baseProperty.labelImage;
      this.labelContent=newData.obj.baseProperty.labelContent;
  }
};
</script>

<style lang="less">
.alignment {
  text-align: left;
}
.el-input {
  width: 200px;
}
.iconfont {
  color: #3b81f0;
  font-size: 21px;
}
.item-left {
  float: left;
  margin-right: 13%;
}
.del {
  color: #f0433c;
}
.line_blockLabel {
  width: 100%;
  .el-form-item__content {
    width: 80% !important;
  }
  .widthSet {
    width: 90% !important;
    .el-form-item__content {
      width: 90% !important;
    }
  }
  /*.el-form-item__content{
     width: 100%!important;
    }*/
}
.Img_width_set{
  height: 30px;
  .demonstration{
    transform: translate(0,4px);
  }
}
/* .el-textarea{
    width: 90%!important;
  }
  .el-form-item__content{
    width: 35% !important;
  }*/
</style>
