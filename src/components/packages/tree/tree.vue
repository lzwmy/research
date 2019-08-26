<template>
  <div class="el-checkbox__label-hide">
    <table width="100%" cellpadding="0" cellspacing="0" class="table5">
      <thead>
      <tr>
        <td :style="{paddingLeft:left + 'px'}" class="left">{{sub.name}} </td>
        <td>
          <el-checkbox :indeterminate="isIndeterminate" :disabled="disabled" @change="subChange"
                       v-model="checkSubAll"></el-checkbox>
        </td>
      </tr>
      </thead>
    </table>
    <el-checkbox-group v-model="checkChildAll" @change="childrenChange">
      <table width="100%" cellpadding="0" cellspacing="0" class="table5">
        <tbody>
        <tr v-for="children in sub.subPermissions" :key="children.code">
          <td style="padding-left:90px" class="left">{{children.name}}</td>
          <td>
            <el-checkbox :disabled="disabled"
                         :label='children.code'></el-checkbox>
          </td>
        </tr>

        </tbody>
      </table>
    </el-checkbox-group>
  </div>
</template>

<script>

export default {
  name: 'tree',
  props: {
    sub: {},
    disabled: Boolean,
    left: {
      type: Number,
      default: 70
    },
    status: Number,
    index: Number,
    j: Number
  },
  data () {
    return {
      checkSubAll: false,
      checkChildAll: [],
      checkedIds: [],
      isIndeterminate: false
    };
  },
  created () {
    this.checkedIds = this.extract(this.sub);
  },
  methods: {
    extract (data) {
      var id = [];
      var children = data.subPermissions;
      for (var i = 0; i < children.length; i++) {
        if (children[i].code) {
          id.push(children[i].code);
        }
      }
      return id;
    },
    init (arr) {
      this.checkChildAll = arr;
      this.childrenChange(arr);
    },
    itemChange (event) {
      var boo = event.target.checked;
      this.checkChildAll = boo ? this.checkedIds : [];
      this.checkSubAll = !!boo;
      this.isIndeterminate = false;
    },
    subChange (event) {
      this.checkChildAll = event.target.checked ? this.checkedIds : [];
      this.isIndeterminate = false;
      this.$emit('itemChecked', this.index, this.status);
    },
    childrenChange (value) {
      let checkedCount = value.length;
      this.checkSubAll = checkedCount === this.checkedIds.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedIds.length;
      this.$emit('itemChecked', this.index, this.status);
    }
  }
};
</script>

