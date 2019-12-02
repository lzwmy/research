<template>
    <div class="card_portion">
      <card-setion v-for="(sectionItem,sectionIndex) in item.items" :key="sectionIndex" :item="sectionItem" :index="sectionIndex" :displayName="displayName"></card-setion>
    </div>
</template>

<script>
  import cardSetion from './cardSection';
    export default {
      components:{
        cardSetion
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
      }
    }
</script>

<style scoped>

</style>
