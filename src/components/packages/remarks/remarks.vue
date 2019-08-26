<template>
  <div class="remarks-contain">
    <div class="iconCon">
      <slot name="icon"></slot>
    </div>
    <span class="logo">备注：</span>
    <div class="content">
      <slot class="2222"></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'remarks',
  mixins: [],
  data () {
    return {};
  },
  components: {},
  watch: {},
  computed: {},
  created () {

  },
  mounted () {

  },
  methods: {},
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>

<style scoped>
  .remarks-contain {
    background: #fff3e6;
    width: 100%;
    height: 100%;
    padding: 22px 12px;
    margin-top: 20px;
    color: #ed7d32;
    overflow: hidden
  }

  .remarks-contain .iconCon {
    display: inline-block;
    float: left;
  }

  .remarks-contain .iconCon img {
    display: inline-block;
    width: 21px;
    height: 21px;
    /*background: url("../../../pages/index/packages/residentInfo/images/edit.png") no-repeat center;*/
    vertical-align: middle;
  }

  .remarks-contain .logo, .remarks-contain .content {
    float: left;
    margin-left: 14px;
    line-height: 25px;
  }

</style>
