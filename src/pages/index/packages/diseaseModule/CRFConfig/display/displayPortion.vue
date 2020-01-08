<template>
  <div class="displayPortion_container">
    <div class="displayPortion_title">
      <i class="left-line"></i>
      {{item.portionName}}
    </div>
    <div class="displayPortion_box">
      <el-row class="length_set" >
        <display-item
          :class="'set_'+child.baseProperty.layout.columns"
          v-for="(child,index) in item.formItemList"
          :item="child"
          :report="getData(child)"
          :layoutData="layoutInfo(child,index,item.formItemList)"
          :key="index"
        />
        <!--:key="child.controlDisplayName"-->
      </el-row>
    </div>
  </div>
</template>

<script>
import displayItem from "./displayItem";
export default {
  name: "displayPortion",
  props: {
    item: {},
    report: {},
    index: Number
  },
  components: {
    displayItem
  },
  data() {
    return {
      preLayoutData:"",
    }
  },
  created() {
    // console.log(this.report,this.item)
    this.item.formItemList.forEach(element => {
      let arr = this.report.items.filter(
        o => o.name == element.controlDisplayName
      );
      if (arr.length == 0) {
        let newObj = {
          name: element.controlDisplayName,
          value: "",
          value2:"",
          children: []
        };
        this.report.items.push(newObj);
      }
    });
    if(this.$store.state.CRFConfig.layouts==""){
      this.preLayoutData = this.item.formItemList[0].baseProperty.layout
      // this.$store.commit('LAYOUT_SET_OBJECT',this.item.formItemList[0].baseProperty.layout)
    }
  },
  methods: {
    getData(item) {
      let arr = this.report.items.filter(
        o => o.name == item.controlDisplayName
      );
      return arr[0];
    },
    /*layoutInfo(item,index,array) {
      // 给每个 item  添加默认偏移量为0
      item.baseProperty.layout.offset = 0;
      let currentColumns = item.baseProperty.layout.columns;
      let currentSelection = item.baseProperty.layout.selection;
      if(index !== 0) {
        let preData = array[index-1].baseProperty.layout;
        let currentItemList = currentSelection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return a-b;
        });
        let prevItemList = preData.selection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return b-a;
        });
        switch (currentColumns) {
          case 2 : //2列
            //如果 上一列columns 与 当前行相等，判断当前一行是否引用上一行。 如果引用，就把上一行的 wrap=0,
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {

              let sum = currentItemList[0]-prevItemList[0];
              /!*if(currentSelection.length==1) {
                preData.wrap = 0
              }*!/
              if(sum == 0) { // 如果sum ==0, 证明上一行于当前行选择的是同一列，则上一行wrap = 1
                preData.wrap = 1
              }else {
                preData.wrap = 0
              }
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentSelection.length == 1 && currentSelection[0].position == 2) {
                item.baseProperty.layout.offset = 12
              }
              //如果 上一列columns 与 当前行不相等，设置offset
            }
            else if(currentColumns !== preData.columns && currentSelection.length == 1) {
              if(currentSelection[0].position == 2) {
                item.baseProperty.layout.offset = 12
              }
            }
            break;
          case 3 : //3列
            // 如果 当前行 columns 与 上一列 columns 相等，判断当前行是否引用上一行，如果引用，就把上一行 wrap = 0，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              let sum = currentItemList[0]-prevItemList[0];
              if(sum ==1) {
                preData.wrap = 0
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                preData.wrap = 0
                item.baseProperty.layout.offset = 8;
              }else if(sum == 0) {// 如果sum ==0, 证明上一行于当前行选择的是同一列，则上一行wrap = 1
                preData.wrap = 1
              }else {
                preData.wrap = 0
              }
            //如果 当前行 columns 与 上一列 columns 相等 && 当前行 wrap ==1 ，设置offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              preData.wrap =1
              if(currentItemList[0] == 2) {
                item.baseProperty.layout.offset = 8;
              }else if(currentItemList[0] == 3) {
                item.baseProperty.layout.offset = 16;
              }
              //如果 当前行 columns 与 上一列 columns 不相等
            }
            else if(currentColumns !== preData.columns) {
              if(currentItemList[0] == 2) {
                item.baseProperty.layout.offset = 8;
              }else if(currentItemList[0] == 3) {
                item.baseProperty.layout.offset = 16;
              }
            }
            break;
          case 4 : //4列
            //如果 当前行 columns 与 上一行 columns 相等 && 当前行wrap=0, 需把上一行 wrap = 0 ，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              preData.wrap = 0;
              let sum = Math.abs(currentItemList[0] - prevItemList[0]);
              if(sum == 1) {
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                item.baseProperty.layout.offset = 6;
              }else if(sum == 3) {
                if(currentItemList[0] - prevItemList[0]>0){
                  item.baseProperty.layout.offset = 12;
                }
              }else if(sum == 0) {
                preData.wrap = 1;
              }
              //如果 当前行 columns 与 上一行 columns 相等 && 当前行 wrap !==1 ,设置当前行 offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }
              }else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
              //如果 当前行 columns 与 上一行 columns 不相等，设置当前行 的offset
            }
            else if(currentColumns !== preData.columns){
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
            }
            break;
          default:
            break
        }
      }else {
        let preData = array[index].baseProperty.layout;
        let currentItemList = currentSelection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return a-b;
        });
        let prevItemList = preData.selection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return b-a;
        });
        switch (currentColumns) {
          case 2 : //2列
            //如果 上一列columns 与 当前行相等，判断当前一行是否引用上一行。 如果引用，就把上一行的 wrap=0,
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              let sum = currentItemList[0]-prevItemList[0];
              if(currentSelection.length==1) {
                preData.wrap = 0
              }
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentSelection.length == 1 && currentSelection[0].position == 2) {
                item.baseProperty.layout.offset = 12
              }
              //如果 上一列columns 与 当前行不相等，设置offset
            }
            else if(currentColumns !== preData.columns && currentSelection.length == 1) {
              if(currentSelection[0].position == 2) {
                item.baseProperty.layout.offset = 12
              }
            }
            break;
          case 3 : //3列
            // 如果 当前行 columns 与 上一列 columns 相等，判断当前行是否引用上一行，如果引用，就把上一行 wrap = 0，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              preData.wrap = 0
              let sum = currentItemList[0]-prevItemList[0];
              if(sum ==1) {
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                item.baseProperty.layout.offset = 8;
              }
              //如果 当前行 columns 与 上一列 columns 相等 && 当前行 wrap ==1 ，设置offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentItemList[0] == 2) {
                item.baseProperty.layout.offset = 8;
              }else if(currentItemList[0] == 3) {
                item.baseProperty.layout.offset = 16;
              }
              //如果 当前行 columns 与 上一列 columns 不相等
            }
            else if(currentColumns !== preData.columns) {
              if(currentItemList[0] == 2) {
                item.baseProperty.layout.offset = 8;
              }else if(currentItemList[0] == 3) {
                item.baseProperty.layout.offset = 16;
              }
            }
            break;
          case 4 : //4列
            //如果 当前行 columns 与 上一行 columns 相等 && 当前行wrap=0, 需把上一行 wrap = 0 ，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              preData.wrap = 0;
              let sum = Math.abs(currentItemList[0] - prevItemList[0]);
              if(sum == 1) {
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                item.baseProperty.layout.offset = 6;
              }else if(sum == 3) {
                item.baseProperty.layout.offset = 12;
              }
              //如果 当前行 columns 与 上一行 columns 相等 && 当前行 wrap !==1 ,设置当前行 offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }
              else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }
              }
              else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
              //如果 当前行 columns 与 上一行 columns 不相等，设置当前行 的offset
            }
            else if(currentColumns !== preData.columns){
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 0;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 12;
                }
              }else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
            }
            break;
          default:
            break
        }
      }
      return item;
    }*/
    layoutInfo(item,index,array) {
      // 给每个 item  添加默认偏移量为0
      item.baseProperty.layout.offset = 0;
      // 给每个item 默认填充为0
      item.baseProperty.layout.supplement = 0; // 0 不补充 1 补充
      let currentColumns = item.baseProperty.layout.columns;
      let currentSelection = item.baseProperty.layout.selection;
      if(index !== 0) {
        let preData = array[index-1].baseProperty.layout;
        let currentItemList = currentSelection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return a-b;
        });
        let prevItemList = preData.selection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return b-a;
        });
        switch (currentColumns) {
          case 1 :
            if(currentColumns !== preData.columns) {
              preData.supplement = 1;
            }
            break;
          case 2 : //2列
            //如果 上一列columns 与 当前行相等，判断当前一行是否引用上一行。 如果引用，就把上一行的 wrap=0,
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {

              let sum = currentItemList[0]-prevItemList[0];
              /*if(currentSelection.length==1) {
                preData.wrap = 0
              }*/
              if(sum == 0) { // 如果sum ==0, 证明上一行于当前行选择的是同一列，则上一行wrap = 1
                preData.wrap = 1;
              }else {
                preData.wrap = 0;
                if(currentSelection.length == 1 && currentSelection[0].position == 2) {
                  item.baseProperty.layout.supplement = 1;
                }
              }
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentSelection.length == 1 && currentSelection[0].position == 2) {
                // item.baseProperty.layout.offset = 12;
                item.baseProperty.layout.offset = 6;
              }
              //如果 上一列columns 与 当前行不相等，设置offset
            }
            else if(currentColumns !== preData.columns) {
              preData.supplement = 1;
              if(currentSelection.length == 1) {
                if(currentSelection[0].position == 2) {
                  // item.baseProperty.layout.offset = 12;
                  item.baseProperty.layout.offset = 6;
                }
              }
            }
            break;
          case 3 : //3列
            // 如果 当前行 columns 与 上一列 columns 相等，判断当前行是否引用上一行，如果引用，就把上一行 wrap = 0，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              let sum = currentItemList[0]-prevItemList[0];
              if(sum ==1) {
                preData.wrap = 0;
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                preData.wrap = 0;
                // item.baseProperty.layout.offset = 8;
                item.baseProperty.layout.offset = 6;
              }else if(sum == 0) {// 如果sum ==0, 证明上一行于当前行选择的是同一列，则上一行wrap = 1
                preData.wrap = 1;
                preData.supplement = 1;
              }else {
                preData.wrap = 0;
                preData.supplement = 1;
              }
              //如果 当前行 columns 与 上一列 columns 相等 && 当前行 wrap ==1 ，设置offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              preData.supplement = 1;
              // preData.wrap =1;
              if(currentItemList[0] == 2) {
                // item.baseProperty.layout.offset = 8;
                item.baseProperty.layout.offset = 6;
              }else if(currentItemList[0] == 3) {
                // item.baseProperty.layout.offset = 16;
                item.baseProperty.layout.offset = 12;
              }
              //如果 当前行 columns 与 上一列 columns 不相等
            }
            else if(currentColumns !== preData.columns) {
              preData.supplement = 1;
              if(currentItemList[0] == 2) {
                // item.baseProperty.layout.offset = 8;
                item.baseProperty.layout.offset = 6;
              }else if(currentItemList[0] == 3) {
                // item.baseProperty.layout.offset = 16;
                item.baseProperty.layout.offset = 12;
              }
            }
            break;
          case 4 : //4列
            //如果 当前行 columns 与 上一行 columns 相等 && 当前行wrap=0, 需把上一行 wrap = 0 ，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              preData.wrap = 0;
              let sum = Math.abs(currentItemList[0] - prevItemList[0]);
              if(sum == 1) {
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                item.baseProperty.layout.offset = 6;
              }else if(sum == 3) {
                if(currentItemList[0] - prevItemList[0]>0){
                  item.baseProperty.layout.offset = 12;
                }
              }else if(sum == 0) {
                preData.wrap = 1;
                preData.supplement = 1;
              }
              //如果 当前行 columns 与 上一行 columns 相等 && 当前行 wrap !==1 ,设置当前行 offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              preData.supplement = 1;
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }
              }else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
              //如果 当前行 columns 与 上一行 columns 不相等，设置当前行 的offset
            }
            else if(currentColumns !== preData.columns){
              preData.supplement = 1;
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
            }
            break;
          default:
            break
        }
      }else {
        let preData = array[index].baseProperty.layout;
        let currentItemList = currentSelection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return a-b;
        });
        let prevItemList = preData.selection.map(item=>{
          return item.position;
        }).sort((a,b)=>{
          return b-a;
        });
        switch (currentColumns) {
          case 2 : //2列
            //如果 上一列columns 与 当前行相等，判断当前一行是否引用上一行。 如果引用，就把上一行的 wrap=0,
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              let sum = currentItemList[0]-prevItemList[0];
              if(currentSelection.length==1) {
                preData.wrap = 0
              }
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentSelection.length == 1 && currentSelection[0].position == 2) {
                item.baseProperty.layout.offset = 12
              }
              //如果 上一列columns 与 当前行不相等，设置offset
            }
            else if(currentColumns !== preData.columns && currentSelection.length == 1) {
              if(currentSelection[0].position == 2) {
                item.baseProperty.layout.offset = 12
              }
            }
            break;
          case 3 : //3列
            // 如果 当前行 columns 与 上一列 columns 相等，判断当前行是否引用上一行，如果引用，就把上一行 wrap = 0，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              preData.wrap = 0
              let sum = currentItemList[0]-prevItemList[0];
              if(sum ==1) {
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                item.baseProperty.layout.offset = 8;
              }
              //如果 当前行 columns 与 上一列 columns 相等 && 当前行 wrap ==1 ，设置offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentItemList[0] == 2) {
                item.baseProperty.layout.offset = 8;
              }else if(currentItemList[0] == 3) {
                item.baseProperty.layout.offset = 16;
              }
              //如果 当前行 columns 与 上一列 columns 不相等
            }
            else if(currentColumns !== preData.columns) {
              if(currentItemList[0] == 2) {
                item.baseProperty.layout.offset = 8;
              }else if(currentItemList[0] == 3) {
                item.baseProperty.layout.offset = 16;
              }
            }
            break;
          case 4 : //4列
            //如果 当前行 columns 与 上一行 columns 相等 && 当前行wrap=0, 需把上一行 wrap = 0 ，设置当前行 offset
            if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 0) {
              preData.wrap = 0;
              let sum = Math.abs(currentItemList[0] - prevItemList[0]);
              if(sum == 1) {
                item.baseProperty.layout.offset = 0;
              }else if(sum == 2) {
                item.baseProperty.layout.offset = 6;
              }else if(sum == 3) {
                item.baseProperty.layout.offset = 12;
              }
              //如果 当前行 columns 与 上一行 columns 相等 && 当前行 wrap !==1 ,设置当前行 offset
            }
            else if(currentColumns == preData.columns && item.baseProperty.layout.wrap == 1) {
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }
              else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }
              }
              else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
              //如果 当前行 columns 与 上一行 columns 不相等，设置当前行 的offset
            }
            else if(currentColumns !== preData.columns){
              if(currentItemList.length == 1) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 12;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 18;
                }
              }else if(currentItemList.length == 2) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 0;
                }else if(currentItemList[0] == 3) {
                  item.baseProperty.layout.offset = 6;
                }else if(currentItemList[0] == 4) {
                  item.baseProperty.layout.offset = 12;
                }
              }else if(currentItemList.length == 3) {
                if(currentItemList[0] == 2) {
                  item.baseProperty.layout.offset = 6;
                }
              }
            }
            break;
          default:
            break
        }
      }
      return item;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .displayPortion_title{
    /*width: 100%;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    !*background-color: #ddd;*!
    background-color: #E9E9E9;
    padding-left: 15px;*/

  }
  .displayPortion_box{
    .length_set{
      /*min-width: 1200px;*/
      /*width: 1200px;*/
      padding: 5px 0;
    }
    .el-col{
      margin-top: 5px;
      margin-bottom: 5px;
      /*min-height: 32px;*/
    }
  }
  .displayPortion_container{
    /*min-width: 1200px;
    width: 1200px;*/
  }
</style>
