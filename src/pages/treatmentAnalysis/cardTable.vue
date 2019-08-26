<template>
    <div class="card_table">
     {{index+1}}{{dataJionContent(item)}}
    </div>
</template>

<script>
    export default {
      name: "cardTable",
      props:{
        item:{
          type:Array,
          default:null
        },
        index:{
          type:Number,
          default:null
        }
      },
      methods:{
        dataJionContent(array) {
          let content= '';
          for(let i=0;i<array.length;i++) {
            content +=array[i].name+': '+ ' '+ array[i].value+' '
          }
          return content
        }
      },
      created() {
        console.log(this.item)
      }
    }
</script>

<style scoped>

</style>
