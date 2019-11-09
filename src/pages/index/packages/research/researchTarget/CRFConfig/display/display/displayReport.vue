<template>
  <div class="report_container">
    <!--<div class="report_title">{{item.crfDisplayName}}</div>-->
    <!--<display-page
      v-for="(child,index) in item.formPortions"
      :key="child.pageDisplayName"
      :item="child"
      :index="index"
      :report="getData(child)"
    ></display-page>-->
    <display-page :item="item" :report="report"></display-page>
  </div>
</template>

<script>
import displayPage from "./displayPage";
import displayPortion from "./displayPortion";
export default {
  name: "displayReport",
  props: {
    item: {},
    report: {},
    index: Number
  },
  components: {
    displayPage,
    displayPortion
  },
  created() {
    /*this.item.formPortions.forEach(element => {
      let arr = this.report.portions.filter(o => {
          o.portionName == element.portionName
      });
      if (arr.length == 0) {
        // let newObj = { pageName: element.pageDisplayName, portions: [] };
        let newObj = { pageName: element.portionName, items: [] };
        this.report.portions.push(newObj);
      }
    });*/
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
