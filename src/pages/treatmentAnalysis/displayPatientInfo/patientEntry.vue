<template>
    <div>
      <div class="entry_gather" v-if="item.controlType!=='GATHER'&&item.controlType!=='TABLE'">{{report.name}} -- {{report.value}}</div>
      <patient-gather v-if="item.controlType=='GATHER'" v-for="(gatherItem,gatherIndex) in item.children" :key="gatherIndex" :item="gatherItem" :index="gatherIndex" :report="getData(gatherItem)"></patient-gather>
      <div v-if="item.controlType=='TABLE'" :style="`height: ${height* 25}px;overflow:auto`">
        <!--{{item.controlDisplayName}}&#45;&#45;{{report.name}}-->
        <!--v-for="(gatherItem,gatherIndex) in item.children"-->
        <patient-table  :item="item"  :report="report" ></patient-table>
      </div>
    </div>
</template>

<script>
    import patientGather from './patientGather';
    import patientTable from './patientTable';
    export default {
      components:{
        patientGather,
        patientTable
      },
      props:{
        item:{},
        report:{},
        index:Number
      },
      data () {
        return {
          height:1
        }
      },
      methods:{
        getData(data) {
          // console.log(data)
          let arr = this.report.children.filter(
            o => o.name == data.controlDisplayName
          )
          return arr[0]
        },
        setHeight() {
          if(this.item.controlType=='TABLE') {
            this.height = this.item.children.length
          }
        }
      },
      mounted() {
        this.setHeight()
        // console.log(this.item)
      }
    }
</script>

<style scoped>
.entry_gather{
  padding: 15px 0;
  height:52px ;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  /*background-color: #ddd;*/
}


/*滑块*/
::-webkit-scrollbar-thumb {
  background-color: #E5E5E5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
/*滑道*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #E5E5E5;
  border-radius: 10px;
}
</style>
