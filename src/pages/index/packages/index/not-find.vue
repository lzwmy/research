<template>
  <div class="notFind">
    <img src="./images/404_blue.png" alt="404" class="notFindImg" v-if="$parent.$parent.ccstyle=='theme-blue'">
    <img src="./images/404.png" alt="404" class="notFindImg" v-else>
  </div>
</template>


<script>
export default {
  name: 'not-find',
  data () {
    return {};
  },
  mounted () {
    // console.log(this.$parent.$parent.ccstyle)
  }
};
</script>
<style scoped>
  .notFindImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    width: 300px;
  }
</style>
