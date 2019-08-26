<template>
    <div class="card_entry">
      <div v-if="item.name!=='row'&&displayName=='name'&&item.children.length==0"> {{item[displayName]}}</div>
      <div v-if="item.name!=='row'&&displayName=='value'&&item.children.length==0"> {{item[displayName]}}</div>
      <!--<cardEntry  v-for="(cardEntryItem,cardEntryIndex) in item.children" :item="cardEntryItem" :index="cardEntryIndex" :displayName="displayName"></cardEntry>-->
    </div>
</template>

<script>
    export default {
      name: "cardEntry",
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
