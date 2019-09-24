<template>
  <div class="displayPage_container">
    <div v-if="item.isDisplayName=='1'" class="display_title">
      {{conversionNimber(index+1)}}、{{item.pageDisplayName}}
    </div>
      <div class="displayPage_box">
        <display-portion
          v-for="child in item.formPortions"
          :item="child"
          :key="child.portionDisplayName"
          :report="getData(child)"
        />
      </div>
    </div>
</template>

<script>
import displayPortion from "./displayPortion";
export default {
  name: "displayPage",
  props: {
    item: {},
    report: {},
    index: Number
  },
  components: {
    displayPortion
  },
  created() {
    this.item.formPortions.forEach(element => {
      let arr = this.report.portions.filter(
        o => o.portionName == element.portionDisplayName
      );
      if (arr.length == 0) {
        let newObj = { portionName: element.portionDisplayName, items: [] };
        this.report.portions.push(newObj);
      }
    });
  },
  methods: {
    getData(portion) {
      let arr = this.report.portions.filter(
        o => o.portionName == portion.portionDisplayName
      );
      return arr[0];
    },
    conversionNimber(n) {
      const cnum = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十"
      ];
      let s = "";
      n = "" + n;
      for (var i = 0; i < n.length; i++) {
        s += cnum[parseInt(n.charAt(i))];
      }
      if (s.length == 2) {
        if (s.charAt(1) == cnum[0]) {
          s = s.charAt(0) + cnum[10];
          if (s == cnum[1] + cnum[10]) {
            s = cnum[10];
          }
        } else if (s.charAt(0) == cnum[1]) {
          s = cnum[10] + s.charAt(1);
        }
      }
      return s;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
