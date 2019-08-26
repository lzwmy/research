<template>
    <div>
      {{item.controlDisplayName}}--{{item.controlType}}
    </div>
</template>

<script>
    export default {
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
