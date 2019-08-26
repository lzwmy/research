<template>
  <div class="page_preview_container">
    <div class="single_box">
      <!--<div class="single_title">预览单页-{{singleObj.pageName}}</div>-->
      <display-page v-if="singleObj.pageName" :item="singleObj" :report="report" :index="0"/>
    </div>
  </div>
</template>

<script>
import mixins from "./../../../../components/mixins";
import displayPage from "./component/display/displayPage";
export default {
  name: "singlePagePreview",
  mixins: [mixins],
  components: {
    displayPage
  },
  data() {
    return {
      singleObj: {},
      report: {
        portions: []
      }
    };
  },
  methods: {
    async crfDetailPagePreview(value) {
      let that = this;
      let formData = {
        formPageId: value
      };
      try {
        let data = await that.$http.crfDetailPagePreview(
          that.$format(formData)
        );
        if (data.code == 0) {
          this.singleObj = data.data;
        }
      } catch (error) {
        that.$notice('单页数据获取失败');
        console.log(error);
      }
    }
  },
  mounted() {
    console.log(this.$route.query.id);
    this.crfDetailPagePreview(this.$route.query.id);
  }
};
</script>

<style lang="less" scoped>
.page_preview_container {
  padding: 15px;
  background-color: rgb(247, 248, 252);
  .single_title {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
