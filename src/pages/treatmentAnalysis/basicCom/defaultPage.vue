<template>
    <div>
      <!--{{item.pageName}}-->
      <default-portion v-for="(portionItem,portionIndex) in item.formPortions" :key="portionIndex" :item="portionItem" :index="portionIndex"></default-portion>
    </div>
</template>

<script>
  import defaultPortion from './defaultPortion';
    export default {
      components:{
        defaultPortion
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
