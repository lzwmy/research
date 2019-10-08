<template>
    <div class="section_preview_container">
<!--      {{portion.portionName}}-->
      <display-portion v-if="portion.portionName" :item="portion" :report="report" />
    </div>
</template>

<script>
  // import mixins from './../../../../components/mixins';
  import displayPortion from "./../display/displayPortion";
    export default {
      // mixins: [mixins],
      // name:"sectionPreview",
      props:{
        item:{
          type:Object,
          default:null
        }
      },
      components:{
        displayPortion
      },
      /*watch:{
        "item":{
          deep:true,
          handler:(value)=>{
            // console.log('监听 小节 预览',value)
            // this.portion.portionName = "";
            this.portion = value;
          }
        }
      },*/
      data() {
        return {
          portion:{},
          report:{
            items:[]
          }
        }
      },
      methods:{
        async crfSectionPreview(value) {
          let that = this;
          let formData  = {
            formPortionId:value
          };
          try{
            let data = await that.$http.crfSectionPreview(that.$format(formData));
            if(data.code == 0) {
              this.portion = data.data
            }
          }catch (error) {
            that.$notice('小节数据获取失败')
            console.log(error)
          }
        }
      },
      mounted() {
        // console.log(this.$route.query.id);
        this.portion = JSON.parse(JSON.stringify(this.item));
        // console.log(this.item)
        // this.crfSectionPreview(this.$route.query.id)
      }
    }
</script>

<style scoped>
.section_preview_container{
  /*background-color: rgb(247, 248, 252);*/
  padding: 15px;
  box-sizing:border-box;
}
</style>
