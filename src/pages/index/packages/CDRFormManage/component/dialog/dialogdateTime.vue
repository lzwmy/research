<template>
  <div v-if="dialogShow">
    <el-dialog title="日期时间" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-tabs v-model="activeName" @tab-click="handClick">
        <el-tab-pane label="基础设置" name="first">
          <el-form class="alignment" label-width="100px">
            <el-form-item label="默认当前时间" class="line_blockDateTime">
              <el-radio-group v-model="isDefaultDate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="数据设置" name="second">
          <el-form  class="alignment" label-width="80px">
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
              <el-form-item label="绑定属性"  >
                <el-select v-model="dataSetting.bindingAttr" size="mini" placeholder="药品名臣">
                  <el-option label="无" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="过滤条件" >
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
                  <i class="iconfont iconfuhao1" @click="addFilter" v-show="index == dataSetting.filter.length-1 ? true : false"></i>
                  <i class="iconfont iconfuhao4 del" @click="delFilter(index)"></i>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickSaveBtn" type="primary">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "dialogdate",
      props:{
        dialogShow:{
          type:Boolean,
          default:null
        },
        basicDataInfo:{
          type:Object,
          default: null
        }
      },
      data() {
        return {
          dialogFormVisible:true,
          isDefaultDate:"",//日期是否默认
          //数据设置
          dataSetting:{
            dataBind:false,//启动数据绑定
            bindingDomain:"", //绑定域
            bindingType:"",//绑定类型
            bindingAttr:"",//绑定属性
            //过滤条件
            filter:[
              {
                column:"",//列
                operator:"", //运算符
                config:"" //填写参数
              }
            ]
          },
          activeName:"first"
        }
      },
      watch:{
        dialogShow:function(val){
          console.log(this.dialogShow);
          this.dialogFormVisible = true;
        },
        dialogFormVisible:function (value){
          console.log("触发dialogFormVisible",value)
          if(value==false) {
            this.$emit("dialog-close",false);
          }
        }
      },
      methods:{
        clickSaveBtn() {
          console.log("保存",this.isDefaultDate)
          this.dialogFormVisible = false;
          let newData = this.basicDataInfo;
          newData.obj.baseProperty.controlIsDefaultDateTime = this.isDefaultDate;
          this.$emit('basis-click',newData)
        },
        //tab 标签页
        handClick(tab,event) {
          console.log(tab,event)
        },
        //添加过滤条件
        addFilter(){
          console.log("点击添加成功")
          let list = {
            column:"",//列
            operator:"", //运算符
            config:"" //填写参数
          }
          this.dataSetting.filter.push(list)
        },
        //删除过滤条件
        delFilter(index){
          this.dataSetting.filter.splice(index,1)
        }
      },
      mounted() {
        console.log("日期 获取基础数据",this.basicDataInfo)
      }
    }
</script>

<style lang="less">
  .line_blockDateTime{
    width:100% !important;
  .el-form-item__content{
    margin-left:0 !important;
  }
  }
</style>
