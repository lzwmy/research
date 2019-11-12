<template>
  <div class="report_container">
    <!--<div class="report_title">{{item.crfDisplayName}}</div>-->
    <display-page
      v-for="(child,index) in item.formPages"
      :key="child.pageDisplayName"
      :item="child"
      :index="index"
      :report="getData(child)"
    ></display-page>
  </div>
</template>

<script>
import displayPage from "./displayPage";
export default {
  name: "displayReport",
  props: {
    item: {},
    report: {},
    index: Number
  },
  components: {
    displayPage
  },
  created() {
    this.item.formPages.forEach(element => {
      let arr = this.report.pages.filter(
        o => o.pageName == element.pageDisplayName
      );
      if (arr.length == 0) {
        let newObj = { pageName: element.pageDisplayName, portions: [] };
        this.report.pages.push(newObj);
      }
    });
  },
  mounted() {
  },
  methods: {
    getData(page) {
      let arr = this.report.pages.filter(
        o => o.pageName == page.pageDisplayName
      );
      return arr[0];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
