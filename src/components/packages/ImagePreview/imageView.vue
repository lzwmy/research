<template>
    <div  class="image_view-container" :data-status="state">
      <viewer :images="photo" :options="Options"  class="viewer" ref="viewer">
        <img
          v-for="(src,index) in photo"
          :src="src"
          :key="index"
        >
      </viewer>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Viewer from 'v-viewer'
  import 'viewerjs/dist/viewer.css'
  Vue.use(Viewer)
    export default {
      props:{
        url:{
          type:Array,
          default:null
        },
        state:{
          type:Boolean,
          default:null
        }
      },
      data() {
        return {
          photo:this.url,
          Options: {
            'inline': false,
            'button': false,
            'navbar': false,
            'title': false,
            'toolbar': true,
            'tooltip': false,
            'movable': true,
            'zoomable': true,
            'rotatable': true,
            'scalable': false,
            'transition': true,
            'fullscreen': true,
            'keyboard': true,
            'url': 'data-source'
          }
        }
      },
      methods:{
        show() {
          const viewer = this.$refs.viewer.$viewer;
          viewer.show();
        },
        onCloseImg() {
          this.$emit('on-close',false);
        }
      },
      mounted() {
        //监听图片查看器 关闭
        this.$nextTick(()=>{
          if(this.state) {
            let that = this;
            window.addEventListener('click',function (e) {
              setTimeout(()=>{
                var el = $('.viewer-container')[0];
                if($(el).hasClass('viewer-in')) {
                  console.log('打开')
                }
                if($(el).hasClass('viewer-hide')) {
                  that.onCloseImg();
                }
              },700)
            })
          }
        })
      }
    }
</script>

<style scoped>
.viewer img{
  display: none;
}
</style>
