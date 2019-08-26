<template>
    <div class="card_section">
      <div v-if="processTableData(item)&&displayName!=='value'">{{item[displayName]}}</div>
<!--      <div v-if="processTableData(item)">{{item.children}}</div>-->
      <card-entry v-else v-for="(entryItem,entryIndex) in item.children" :item="entryItem" :index="entryIndex" :displayName="displayName"></card-entry>
      <!--<cardTable v-for="(tableItem,tableIndex) in item.children" v-if="processTableData(item)&&displayName=='value'" :item="tableItem.children" :index="tableIndex" :key="tableIndex"></cardTable>-->
    </div>
</template>

<script>
  import cardEntry from './cardEntry';
  import cardTable from './cardTable';
    export default {
      components:{
        cardEntry,
        cardTable
      },
      props:{
        item:{
          type:Object,
          default:null
        },
        index:{
          type:Number,
          default:null
        },
        displayName:{
          type:String,
          default:null
        }
      },
      methods:{
        processTableData(value) {
          let show = false;
          if(value.children.length!==0) {
            //判断数组第一个是不是表格 - 如果是，进去表格处理控件 --如果不是 正常渲染
            if(value.children[0].name=='row'){
              show = true
            }
          }
          return show
        }
      }
    }
</script>

<style scoped>

</style>
