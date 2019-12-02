<template>
    <div>
      {{item.controlDisplayName}}
      <div v-for="(tableItem,tableIndex) in dataJoin()" :key="tableIndex">{{tableIndex+1}}、{{tableItem}}</div>
    </div>
</template>

<script>
    export default {
      props:{
        item:{},
        report:{}
      },
      data() {
        return {}
      },
      methods:{
        dataJoin() {
          let arr = []
          for(let i=0;i<this.report.children.length;i++) {
            let joinData = "";
            for(let j=0;j<this.report.children[i].children.length;j++) {
              joinData+= this.report.children[i].children[j].name+':'+this.report.children[i].children[j].value+' '
            }
            arr.push(joinData)
          }
          return  arr
        }
      },
      created() {
        this.dataJoin()
      }
    }
</script>

<style scoped>

</style>
