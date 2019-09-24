<template>
  <div class="displayPortion_container">
    <div class="displayPortion_title">
      {{item.portionName}}
    </div>
    <div class="displayPortion_box">
      <el-row>
        <display-item
          v-for="(child,index) in item.formItemList"
          :item="child"
          :report="getData(child)"
          :layoutData="layoutInfo(child,index,item.formItemList)"
          :key="child.controlDisplayName"
        />
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
    this.item.formItemList.forEach(element => {
      let arr = this.report.items.filter(
        o => o.name == element.controlDisplayName
      );
      if (arr.length == 0) {
        let newObj = {
          name: element.controlDisplayName,
          value: "",
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
      // console.log(item,index);
      // 给每个 item  添加默认偏移量为0
      item.baseProperty.layout.offset = 0;
      let currentColumns = item.baseProperty.layout.columns;
      let currentSelection = item.baseProperty.layout.selection;
      if(index!==0){
        let preData = array[index-1].baseProperty.layout;
        //单列
        if(currentColumns==1){
          //默认换行
        }
        // 双列
        if(currentColumns==2) {
          //判断上一个 与 当前 columns  是否 相同， 如果不相同就换行 相同就判断是否存在交集
          if(currentColumns==preData.columns && item.baseProperty.layout.wrap=='0'){
            //判断选中的个数等于1 并且position 不等于2 偏移量 offset 0
            if(currentSelection.length==1){
              // console.log(JSON.stringify(currentSelection)+'\n'+JSON.stringify(preData.selection))
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    /!*item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0'*!/
                    return ;
                  }
                }
              }
              /!*let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b;
              });
              if(positionList.length==1) {
                if(positionList[0]==2) {
                  item.baseProperty.layout.offset = '12';
                }
              }*!/
            }else if(currentSelection.length==2) {
              //默认换行
              // item.baseProperty.layout.wrap = '1';
            }
            //判断selection position 位置是否 相等， 如果不相等，不换行， 如果相等就换行
          }else{
            // 不相同 默认换行
            // item.baseProperty.layout.wrap = 1
            // console.log(item.baseProperty.layout.selection);
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b;
            });
            if(positionList.length==1) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '12';
              }
            }
          }
        }
        //三列
        if(currentColumns==3) {
          //判断上一个 与 当前 columns  是否 相同， 如果不相同就换行 相同就判断是否存在交集
          if(currentColumns==preData.columns && item.baseProperty.layout.wrap=='0'){
            //如果当前选中数量等于1
            if(currentSelection.length==1 && item.baseProperty.layout.wrap=='0'){
              let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b
              });
              //判断当前与上一个是否存在交集，如果不存在交集 就 不换行
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if((preData.selection[i].position!==currentSelection[j].position)&&(item.baseProperty.layout.wrap==preData.wrap)){
                    // let sum = Math.abs(currentSelection[j].position-preData.selection[i].position)
                    // let sum = currentSelection[j].position-preData.selection[i].position;
                    // console.log(positionList.length,preData.selection.length,sum);
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
                    console.log(currentItemList,prevItemList);
                    let sum = currentItemList[0]-prevItemList[0];
                    if(sum ==1) {
                      item.baseProperty.layout.offset = 0;
                    }else if(sum == 2) {
                      item.baseProperty.layout.offset = 8;
                    }
                    /!*item.baseProperty.layout.wrap = '0'
                    preData.wrap = '0';*!/
                    /!*if(positionList.length==1&&preData.selection.length==2){
                      if(sum>0&&sum=='2'){
                        item.baseProperty.layout.offset =sum*8
                      }
                    }else if(preData.selection.length==2) {

                    }else if(positionList.length==1&&preData.selection.length==1){
                      console.log('触发')
                      if(sum>0&&sum=='2'){
                        item.baseProperty.layout.offset =8
                      }
                    }*!/
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position || item.baseProperty.layout.wrap!==preData.wrap){
                    // item.baseProperty.layout.wrap = '0';
                    if(positionList[0]==2){
                      item.baseProperty.layout.offset = '8'
                    }else if(positionList[0]==3) {
                      item.baseProperty.layout.offset = '16'
                    }
                  }
                }
              }
            }
            if(currentSelection.length==2 && item.baseProperty.layout.wrap=='0') {
              let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b
              });
              //如果当前 与 上一个不存在 position 相同，不换行，如果存在交集，换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    // item.baseProperty.layout.wrap = '0';
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    // item.baseProperty.layout.wrap = '1';
                    if(positionList[0]==2){
                      item.baseProperty.layout.offset = '8'
                    }
                  }
                }
              }
            }
            if(currentSelection.length == 3) {
              // item.baseProperty.layout.wrap = '1'
            }
          }else {
            // 不相同 默认换行
            // item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1){
              if(positionList[0]==2){
                item.baseProperty.layout.offset = '8';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '16';
              }
            }else if(positionList.length==2) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '8';
              }
            }
          }
        }
        //四列
        if(currentColumns == 4) {
          //判断上一列 与 当前列 是否相同， 如果不相同 就换行， 相同就判断是否存在交集
          if(currentColumns==preData.columns) {
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            let prePositionList = preData.selection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return b-a;
            });
            if(currentSelection.length == 1 && item.baseProperty.layout.wrap=='0') {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  let sum = positionList[0]-prePositionList[0];
                  if(preData.selection[i].position!==currentSelection[j].position) {
                    /!*item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';*!/
                    if(sum>0&&sum == 1) {
                      item.baseProperty.layout.offset = '0';
                    }else if(sum>0&&sum == 2) {
                      item.baseProperty.layout.offset = '6';
                    }else if(sum>0&&sum == 3) {
                      item.baseProperty.layout.offset = '12';
                    }else if(sum<0){
                      item.baseProperty.layout.offset = (currentSelection[j].position-1)*6
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    // item.baseProperty.layout.wrap = '1';
                    if(currentSelection[j].position == 1) {
                      item.baseProperty.layout.offset = '0';
                    }else if(currentSelection[j].position == 2) {
                      item.baseProperty.layout.offset = '6';
                    }else if(currentSelection[j].position == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }
                }
              }
            }
            if(currentSelection.length == 2 && item.baseProperty.layout.wrap=='0') {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position) {
                    let sum = Math.abs(positionList[0]-prePositionList[0]);
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum==1){
                      item.baseProperty.layout.offset = '0';
                    }else if(sum == 2){
                      item.baseProperty.layout.offset = '6';
                    }else if(sum == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    if(currentSelection[j].position==1){
                      item.baseProperty.layout.offset = '0';
                    }else if(currentSelection[j].position == 2){
                      item.baseProperty.layout.offset = '6';
                    }else if(currentSelection[j].position == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }
                }
              }
            }
            if(currentSelection.length == 3 && item.baseProperty.layout.wrap=='0') {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              /!*for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    let sum = Math.abs(positionList[0]-prePositionList[0]);
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum == 0) {
                      item.baseProperty.layout.offset = '0';
                    }else if(sum == 1) {
                      item.baseProperty.layout.offset = '0';
                    }
                  }else if(preData.selection[i].position==currentSelection[j].position) {
                    console.log('触发')
                    item.baseProperty.layout.wrap = '1';
                  }
                }
              }*!/
              if(prePositionList[0]==1&&positionList[0]==1){
                // item.baseProperty.layout.wrap = '1';
                item.baseProperty.layout.offset = '0';
              }else if(positionList[0]==2) {
                // item.baseProperty.layout.wrap = '1';
                item.baseProperty.layout.offset = '6';
              }
            }
            if(currentSelection.length == 4) {
              // item.baseProperty.layout.wrap = 1
            }
          }else {
            // 不相同 默认换行
            // item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '12';
              }else if(positionList[0]==4) {
                item.baseProperty.layout.offset = '18';
              }
            }else if(positionList.length==2) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '12';
              }
            }else if(positionList.length==3) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }
            }
          }
        }
      }else if(index == 0&&currentColumns>1) {
        // 双列
        if(currentColumns==2){
          if(currentSelection.length==1&&currentSelection[0].position==2){
            item.baseProperty.layout.offset = '12'
          }else if(currentSelection.length==2) {
            // item.baseProperty.layout.wrap = '1';
          }
        }
        if(currentColumns == 3) {
          let positionList = currentSelection.map(item=>{
            return item.position;
          }).sort((a,b)=>{
            return a-b
          });
          if(positionList[0] == 2) {
            item.baseProperty.layout.offset = '8'
          }else if(positionList[0] == 3) {
            item.baseProperty.layout.offset = '16'
          }
        }
        if(currentColumns == 4) {
          let positionList = currentSelection.map(item=>{
            return item.position;
          }).sort((a,b)=>{
            return a-b
          });
          if(positionList[0]==2) {
            item.baseProperty.layout.offset = '6'
          }else if(positionList[0] == 3) {
            item.baseProperty.layout.offset = '12'
          }else if(positionList[0] == 4) {
            item.baseProperty.layout.offset = '18'
          }
        }
      }
      // item.baseProperty.layout.wrap = 0
      return item
    }*/
    layoutInfo(item,index,array) {
      // console.log(item,index);
      // 给每个 item  添加默认偏移量为0
      item.baseProperty.layout.offset = 0;
      let currentColumns = item.baseProperty.layout.columns;
      let currentSelection = item.baseProperty.layout.selection;
      if(index!==0){
        let preData = array[index-1].baseProperty.layout;
        //单列
        if(currentColumns==1){
          //默认换行
        }
        // 双列
        if(currentColumns==2) {
          //判断上一个 与 当前 columns  是否 相同， 如果不相同就换行 相同就判断是否存在交集
          if(currentColumns==preData.columns){
            //判断选中的个数等于1 并且position 不等于2 偏移量 offset 0
            if(currentSelection.length==1){
              // console.log(JSON.stringify(currentSelection)+'\n'+JSON.stringify(preData.selection))
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0'
                    return ;
                  }
                }
              }
            }else if(currentSelection.length==2) {
              //默认换行
              item.baseProperty.layout.wrap = '1';
            }
            //判断selection position 位置是否 相等， 如果不相等，不换行， 如果相等就换行
          }else{
            // 不相同 默认换行
            item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1) {
              if(positionList[0]==2) {
                item.item.baseProperty.layout.offset = '12';
              }
            }
          }
        }
        //三列
        if(currentColumns==3) {
          //判断上一个 与 当前 columns  是否 相同， 如果不相同就换行 相同就判断是否存在交集
          if(currentColumns==preData.columns){
            //如果当前选中数量等于1
            if(currentSelection.length==1){
              let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b
              });
              //判断当前与上一个是否存在交集，如果不存在交集 就 不换行
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    // let sum = Math.abs(currentSelection[j].position-preData.selection[i].position)
                    let sum = currentSelection[j].position-preData.selection[i].position;
                    item.baseProperty.layout.wrap = '0'
                    preData.wrap = '0';
                    if(sum>0&&sum=='2'){
                      item.baseProperty.layout.offset =sum*8
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    item.baseProperty.layout.wrap = '0';
                    if(positionList[0]==2){
                      item.baseProperty.layout.offset = '8'
                    }else if(positionList[0]==3) {
                      item.baseProperty.layout.offset = '16'
                    }
                  }
                }
              }
            }
            if(currentSelection.length==2) {
              let positionList = currentSelection.map(item=>{
                return item.position;
              }).sort((a,b)=>{
                return a-b
              });
              //如果当前 与 上一个不存在 position 相同，不换行，如果存在交集，换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    item.baseProperty.layout.wrap = '0';
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    item.baseProperty.layout.wrap = '1';
                    if(positionList[0]==2){
                      item.baseProperty.layout.offset = '8'
                    }
                  }
                }
              }
            }
            if(currentSelection.length == 3) {
              item.baseProperty.layout.wrap = '1'
            }
          }else {
            // 不相同 默认换行
            item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1){
              if(positionList[0]==2){
                item.baseProperty.layout.offset = '8';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '16';
              }
            }else if(positionList.length==2) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '8';
              }
            }
          }
        }
        //四列
        if(currentColumns == 4) {
          //判断上一列 与 当前列 是否相同， 如果不相同 就换行， 相同就判断是否存在交集
          if(currentColumns==preData.columns) {
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            let prePositionList = preData.selection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return b-a;
            });
            if(currentSelection.length == 1) {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  let sum = positionList[0]-prePositionList[0];
                  if(preData.selection[i].position!==currentSelection[j].position) {
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum>0&&sum == 1) {
                      item.baseProperty.layout.offset = '0';
                    }else if(sum>0&&sum == 2) {
                      item.baseProperty.layout.offset = '6';
                    }else if(sum>0&&sum == 3) {
                      item.baseProperty.layout.offset = '12';
                    }else if(sum<0){
                      item.baseProperty.layout.offset = (currentSelection[j].position-1)*6
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    item.baseProperty.layout.wrap = '1';
                    if(currentSelection[j].position == 1) {
                      item.baseProperty.layout.offset = '0';
                    }else if(currentSelection[j].position == 2) {
                      item.baseProperty.layout.offset = '6';
                    }else if(currentSelection[j].position == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }
                }
              }
            }
            if(currentSelection.length == 2) {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position) {
                    let sum = Math.abs(positionList[0]-prePositionList[0]);
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum==1){
                      item.baseProperty.layout.offset = '0';
                    }else if(sum == 2){
                      item.baseProperty.layout.offset = '6';
                    }else if(sum == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }else if(preData.selection[i].position==currentSelection[j].position){
                    if(currentSelection[j].position==1){
                      item.baseProperty.layout.offset = '0';
                    }else if(currentSelection[j].position == 2){
                      item.baseProperty.layout.offset = '6';
                    }else if(currentSelection[j].position == 3) {
                      item.baseProperty.layout.offset = '12';
                    }
                    return ;
                  }
                }
              }
            }
            if(currentSelection.length == 3) {
              //判断当前 与上一个是否存在交集， 如果存在交集， 默认换行， 不存在 交集，不换行，并设置偏移量
              /*for(let i=0;i<preData.selection.length;i++) {
                for(let j=0;j<currentSelection.length;j++) {
                  if(preData.selection[i].position!==currentSelection[j].position){
                    let sum = Math.abs(positionList[0]-prePositionList[0]);
                    item.baseProperty.layout.wrap = '0';
                    preData.wrap = '0';
                    if(sum == 0) {
                      item.baseProperty.layout.offset = '0';
                    }else if(sum == 1) {
                      item.baseProperty.layout.offset = '0';
                    }
                  }else if(preData.selection[i].position==currentSelection[j].position) {
                    console.log('触发')
                    item.baseProperty.layout.wrap = '1';
                  }
                }
              }*/
              if(prePositionList[0]==1&&positionList[0]==1){
                item.baseProperty.layout.wrap = '1';
                item.baseProperty.layout.offset = '0';
              }else if(positionList[0]==2) {
                item.baseProperty.layout.wrap = '1';
                item.baseProperty.layout.offset = '6';
              }
            }
            if(currentSelection.length == 4) {
              item.baseProperty.layout.wrap = 1
            }
          }else {
            // 不相同 默认换行
            item.baseProperty.layout.wrap = 1
            let positionList = currentSelection.map(item=>{
              return item.position;
            }).sort((a,b)=>{
              return a-b
            });
            if(positionList.length==1) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '12';
              }else if(positionList[0]==4) {
                item.baseProperty.layout.offset = '18';
              }
            }else if(positionList.length==2) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }else if(positionList[0]==3) {
                item.baseProperty.layout.offset = '12';
              }
            }else if(positionList.length==3) {
              if(positionList[0]==2) {
                item.baseProperty.layout.offset = '6';
              }
            }
          }
        }
      }else if(index == 0&&currentColumns>1) {
        // 双列
        if(currentColumns==2){
          if(currentSelection.length==1&&currentSelection[0].position==2){
            item.baseProperty.layout.offset = '12'
          }else if(currentSelection.length==2) {
            item.baseProperty.layout.wrap = '1';
          }
        }
        if(currentColumns == 3) {
          let positionList = currentSelection.map(item=>{
            return item.position;
          }).sort((a,b)=>{
            return a-b
          });
          if(positionList[0] == 2) {
            item.baseProperty.layout.offset = '8'
          }else if(positionList[0] == 3) {
            item.baseProperty.layout.offset = '16'
          }
        }
        if(currentColumns == 4) {
          let positionList = currentSelection.map(item=>{
            return item.position;
          }).sort((a,b)=>{
            return a-b
          });
          if(positionList[0]==2) {
            item.baseProperty.layout.offset = '6'
          }else if(positionList[0] == 3) {
            item.baseProperty.layout.offset = '12'
          }else if(positionList[0] == 4) {
            item.baseProperty.layout.offset = '18'
          }
        }
      }
      // item.baseProperty.layout.wrap = 0
      return item
    },
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .displayPortion_box{
    .el-col{
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

</style>
