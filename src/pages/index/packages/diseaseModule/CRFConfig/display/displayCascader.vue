<template>
    <div :class="item.controlType">
        <div v-if="item.displayIsVisible=='1'" :class="[item.controlType+'_title',{'singleColumn':item.baseProperty.layout.columns == '1'}]">
          <span v-show="item.baseProperty.isRequired"
                style="color: red;">*</span>
          <span >{{item.controlDisplayName}}</span>
        </div>
      <div :class="[item.controlType+'_box',{isRequired:item.baseProperty.isRequired}]"
           :data-type="item.controlType"
           :data-value="report.value">
        <el-select v-model="optionValue" @change="oneSelect(optionValue)">
          <el-option
            v-for="(item,index) in options"
            :key="item.id"
            :label="item.value"
            :value="item.value"></el-option>
        </el-select>
        <el-select v-model="groupValue" v-if="group.length!==0" @change="groupSelect(groupValue)">
          <el-option
            v-for="(item,index) in group"
            :key="item.id"
            :label="item.value"
            :value="item.value"></el-option>
        </el-select>
        <el-select v-model="columnsValue" v-if="columns.length!==0" @change="columnsSelect(columnsValue)">
          <el-option
            v-for="(item,index) in columns"
            :key="item.id"
            :label="item.value"
            :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
</template>

<script>
    export default {
      props:{
        item: {},
        report: {},
        index: Number
      },
      data () {
        return {
          optionValue:"",
          options:[],
          groupValue:"",//
          group:[],//二级 联动
          columnsValue:"",//
          columns:[], // 三级联动
          fillValue:''
        }
      },
      watch:{
        'fillValue':function (data) {
          this.report.value = JSON.parse(data).join('|');
        }
      },
      methods:{
        oneSelect() {
          let array = [this.optionValue];
          // this.report.value = JSON.stringify(array);
          this.fillValue = JSON.stringify(array);
          let data = this.options.map(item=>{
            if(item.value == this.optionValue) {
              //判断item 是否包含 children 字段
              if(item.hasOwnProperty("children")){
                this.groupValue = "";
                this.group = item.children;
                this.columnsValue = "";
                this.columns = [];
              }else {
                this.group = [];
                this.groupValue = "";
                this.columnsValue = "";
                this.columns = [];
              }
            }
          })
        },
        groupSelect() {
          let array = JSON.parse(this.fillValue);
          array[1] = this.groupValue;
          // this.report.value = JSON.stringify(array);
          this.fillValue = JSON.stringify(array);
          let data = this.group.map(item => {
            if(item.value == this.groupValue) {
              if(item.hasOwnProperty('children')) {
                this.columnsValue = "";
                this.columns = item.children;
              }else {
                this.columnsValue = "";
                this.columns = [];
              }
            }
          })
        },
        columnsSelect() {
          let array = JSON.parse(this.fillValue);
          array[2] = this.columnsValue;
          // this.report.value = JSON.stringify(array);
          this.fillValue = JSON.stringify(array);
        },
        singleLayerData(array) {
          this.optionValue = array[0];
        },
        doubleLayerData(array) {
          //设置 单程初始值
          this.singleLayerData(array);
          let data = this.options.filter(item => {
            if(item.value == array[0]) {
              return item.children;
            }
          })[0];
          this.group = data.children;
          this.groupValue = array[1];
        },
        threeLayerData(array) {
          this.doubleLayerData(array);
          let data = this.group.filter(item => {
            if(item.value == array[1]) {
              return item.children;
            }
          })[0];
          this.columns = data.children;
          this.columnsValue = array[2];
        }
      },
      mounted() {
        this.options = JSON.parse(this.item.termSet.rangeText || '[]') ;
        if(this.report.value !== "") {
          // let array = JSON.parse(this.report.value);
          let array = [];
          if(this.report.value.indexOf("|") != '-1') {
            array = this.report.value.split("|");
          }else {
            array = JSON.parse(this.report.value);
          }
          switch (array.length) {
            case 1 :
              this.singleLayerData(array);
              break;
            case 2 :
              this.doubleLayerData(array);
              break;
            case 3 :
              this.threeLayerData(array);
              break;
            default:
              break;
          }
        }
      }
    }
</script>

<style scoped>
  .CASCADE{

  }
  .CASCADE .CASCADE_title{
    width: 188px;
    display: table-cell;
    font-size: 14px;
  }
  .CASCADE .CASCADE_box{
    display: table-cell;
  }
  .CASCADE .singleColumn{
    width: auto;
    min-width: 188px;
    max-width: 500px;
    padding-right: 5px;
  }
  .CASCADE .CASCADE_box .el-select{
    width: 188px;
  }
</style>
