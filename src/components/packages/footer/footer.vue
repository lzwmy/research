<template>
  <p class="footer">{{footerTxt}}</p>
</template>

<script>
export default {
  name: 'appFooter',
  data () {
    return {};
  },
  props: {
    footerTxt: {
      type: String,
      default: '© 2018 卫健智能（深圳）有限公司 版权所有'
    }
  }
};
</script>
<style scoped>
  .footer {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
  }
</style>
