<template>
    <div>
      <div class="entry_gather" v-if="item.controlType!=='GATHER'&&item.controlType!=='TABLE'">{{item.controlDisplayName}}</div>
      <!--&#45;&#45;{{item.controlType}}-->
      <!--如何等于集合 就处理集合 的方法-->
      <default-gather v-if="item.controlType=='GATHER'" v-for="(gatherItem,gatherIndex) in item.children" :item="gatherItem" :index="gatherIndex"></default-gather>
      <div v-if="item.controlType=='TABLE'" :style="`height: ${height* 25}px;line-height:${height*25}px`">
        <default-table v-if="item.controlType=='TABLE'" :item="item"></default-table>
      </div>
    </div>
</template>

<script>
  import defaultGather from './defaultGather';
  import defaultTable from './defaultTable';
    export default {
      components:{
        defaultGather,
        defaultTable
      },
      props:{
        item:{
          type:Object,
          default:null
        },
        index:{
          type:Number,
          default:null
        }
      },
      data() {
        return {
          height:1
        }
      },
      created(){
        this.setHeight();
      },
      methods:{
        setHeight() {
          if(this.item.controlType=='TABLE') {
            this.height = this.item.children.length
          }
        }
      }
    }
</script>

<style scoped>
.entry_gather{
  /*height: 52px;
  line-height: 52px;*/
  padding:15px 0;
  height: 52px;
  position:relative;
}
</style>
