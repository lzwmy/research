<template>
  <el-checkbox :indeterminate="isIndeterminate" :disabled="disabled" v-model="checkItem" @change="itemChange"
               :label="label"></el-checkbox>
</template>

<script>

export default {
  name: 'parent',
  props: {
    disabled: Boolean,
    status: Number,
    index: Number,
    label: String
  },
  data () {
    return {
      isIndeterminate: false,
      checkItem: false
    };
  },
  created () {

  },
  methods: {
    itemChange (event) {
      this.$emit('itemChange', event);
    }
  }
};
</script>

