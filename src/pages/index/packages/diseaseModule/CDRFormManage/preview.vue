<template>
  <div class="preview_container">
    <div class="preview_box">
      <display-item  :item="item" :report="report" :key="0"/>
    </div>
  </div>
</template>

<script>
import 'assets/css/crfStyle.less'
import viewpage from "./component/preview/view";
import displayItem from "./component/display/displayItem";
import mixins from 'components/mixins';

export default {
  name: "preview",
  mixins: [mixins],
  components: {
    preView: viewpage,
    displayItem
  },
  data() {
    return {
      item: {},
      report:{
        children:[],
        value:null
      }
    };
  },
  computed: {},
  methods: {
     //获取预览参数
        async getPreviewData() {
          let that= this;
          let paramData = {
            id:that.$route.query.id
          }
          try{
            let data = await that.$http.crfPreviewForm(that.$format(paramData))
            console.log("预览参数",data.data);
            if(data.code ===0){
              that.item=data.data;
            }
          }catch (error) {
            that.$notice("预览数据获取失败");
            console.log(error)
          }
        }
  },
  mounted() {
    this.getPreviewData();
  }
};
</script>

<style scoped>
</style>
