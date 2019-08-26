<template>
  <div class="displayPortion_container">
    <div class="displayPortion_title">
      {{item.portionDisplayName}}
    </div>
    <div class="displayPortion_box">
      <display-item
        v-for="child in item.formItems"
        :item="child"
        :report="getData(child)"
        :key="child.controlDisplayName"
      />
    </div>
  </div>
</template>

<script>
import displayItem from "./displayItem";
export default {
  name: "displayPortion",
  props: {
    item: {},
    report: {},
    index: Number
  },
  components: {
    displayItem
  },
  created() {
    this.item.formItems.forEach(element => {
      let arr = this.report.items.filter(
        o => o.name == element.controlDisplayName
      );
      if (arr.length == 0) {
        let newObj = {
          name: element.controlDisplayName,
          value: "",
          children: []
        };
        this.report.items.push(newObj);
      }
    });
  },
  methods: {
    getData(item) {
      let arr = this.report.items.filter(
        o => o.name == item.controlDisplayName
      );
      return arr[0];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
