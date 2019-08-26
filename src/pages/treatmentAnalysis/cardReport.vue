<template>
    <div class="card_report">
      <card-portion v-for="(portionItem,portionIndex) in item.portions" :item="portionItem" :index="portionIndex" :displayName="displayName"></card-portion>
    </div>
</template>

<script>
  import cardPortion from './cardPortion';
    export default {
      components:{
        cardPortion
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
