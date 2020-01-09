<template>
  <div class="echartsContain">
    <div class="leftContain" v-if="containType==='left'" v-loading="loading" element-loading-text="拼命加载中"  element-loading-background="rgba(0, 0, 0, 0.1)"
        :style="{ height: parentHeight*heightRatio + 'px',width:widthRatio*100+'%' }">
      <slot></slot>
    </div>
    <div class="rightContain" v-if="containType==='right'" v-loading="loading" element-loading-text="拼命加载中"  element-loading-background="rgba(0, 0, 0, 0.1)"
        :style="{ height: parentHeight*heightRatio + 'px',width:'calc('+widthRatio*100+'% - '+15+'px)' }">
      <slot></slot>
    </div>
    <div class="bigContain" v-if="containType==='big'" v-loading="loading" element-loading-text="拼命加载中"  element-loading-background="rgba(0, 0, 0, 0.1)" :style="{ height: parentHeight*heightRatio +'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'echartsContain',
  mixins: [],
  data () {
    return {};
  },
  props: {
    containType: {// left,right,big
      type: String,
      default: 'left'
    },
    parentHeight: {
      type: Number,
      required: true
    },
    heightRatio: {
      type: Number,
      default: 0.45
    },
    widthRatio: {
      type: Number,
      default: 0.7
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  watch: {
    
  },
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
  .echartsContain {
    position: relative;
  }

  .leftContain {
    position: relative;
    float: left;
    margin-right: 15px;
    overflow: hidden;
  }

  .rightContain {
    position: relative;
    float: right;
    overflow: hidden;
  }

  .bigContain {
    width: 100%;
    float: left;
    overflow: hidden;
    /* box-shadow:0px 5px 10px rgba(78,91,105,0.2); */
    border-radius: 4px;
  }

  .clear:after {
    clear: both;
  }
</style>
