<template>
    <div>
<!--        {{item.portionDisplayName}}-->
      <default-entry v-for="(entryItem,entryIndex) in item.formItems" :key="entryIndex" :item="entryItem" :index="entryIndex"></default-entry>
    </div>
</template>

<script>
    import defaultEntry from './defaultEntry';
    export default {
      components:{
        defaultEntry
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
      }
    }
</script>

<style scoped>

</style>
