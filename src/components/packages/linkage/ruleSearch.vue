<template>
  <el-form :inline="true" :model="ruleForm" ref="ruleForm" :label-width='width' :rules="rules" class="searchComponent">
    <el-form-item label="规则类型：" prop="ruleType">
      <el-select v-model="ruleForm.ruleType" placeholder="请选择规则类型" clearable size="mini"
                 @clear="clearInit(0)" @visible-change="clearInit(0)" :disabled="disabled || ruleTypeDisabled">
        <el-option
          v-for="item in ruleTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="规则维度：" prop="ruleDimension">
      <el-select v-model="ruleForm.ruleDimension" placeholder="请选择规则维度" clearable size="mini"
                 @clear="clearInit(1)" @visible-change="clearInit(1)" :disabled="disabled || ruleDimensionDisabled">
        <el-option
          v-for="item in ruleForm.ruleDimensionList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="原子可测量度：" prop="atomy" v-if="atomyIsShow">
      <el-select v-model="ruleForm.atomy" placeholder="请选择原子可测量度" clearable size="mini"
                 @clear="clearInit(2)" @visible-change="clearInit(2)" :disabled="disabled || atomyDisabled">
        <el-option
          v-for="item in ruleForm.atomyList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'ruleSearch',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    ruleTypeDisabled: {
      type: Boolean,
      default: false
    },
    ruleDimensionDisabled: {
      type: Boolean,
      default: false
    },
    atomyDisabled: {
      type: Boolean,
      default: false
    },
    atomyIsShow: {
      type: Boolean,
      default: true
    },
    width: {
      type: String
    },
    clearOthers: {
      type: Boolean,
      default: true
    },
    checkForm: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var ruleTypeCheck = [];
    var ruleDimensionCheck = [];

    if (this.checkForm) {
      ruleTypeCheck = [{required: true, message: '请选择服务类型', trigger: 'change'}];
      ruleDimensionCheck = [{required: true, message: '请选择业务类型', trigger: 'change'}];
    }
    return {
      ruleForm: {
        ruleType: '',
        ruleTypeName: '',
        ruleDimension: '',
        ruleDimensionName: '',
        atomy: '',
        atomyName: '',
        ruleDimensionList: [],
        atomyList: []
      },
      ruleTypeList: [],
      clear: true, // 为真的情况，会将子项赋值为空，
      rules: {
        ruleType: ruleTypeCheck,
        ruleDimension: ruleDimensionCheck
      }
    };
  },
  watch: {
    'ruleForm.ruleType' (val, oldval) {
      this.getName(val, this.ruleTypeList, 'ruleType');
      this.findruleDimensionByruleType();
      this.ruleTypeChange(val);
    },
    'ruleForm.ruleDimension' (val, oldval) {
      this.getName(val, this.ruleForm.ruleDimensionList, 'ruleDimension');
      this.findatomyByruleDimension();
      this.ruleDimensionChange(val);
    },
    'ruleForm.atomy' (val, oldval) {
      this.getName(val, this.ruleForm.atomyList, 'atomy');
      this.atomyChange(val);
    }
  },
  created () {
    this.initPage();
  },
  activated () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.findruleType();
      this.clear = this.clearOthers;
    },
    getName (id, arr, type) {
      let that = this;
      arr.forEach(item => {
        if (item.id === id) {
          if (type == 'ruleType') {
            that.ruleForm.ruleTypeName = item.name;
          } else if (type == 'ruleDimension') {
            that.ruleForm.ruleDimensionName = item.name;
          } else if (type == 'atomy') {
            that.ruleForm.atomyName = item.name;
          }
        }
      });
    },
    // 查所有类型
    findruleType () {
      let that = this;
      return new Promise((resolve, reject) => {
        let formData = {};
        that.$axios({
          method: 'post',
          url: '/ruleinfo/find_rule_type.do?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.ruleTypeList = data.data;
            resolve(data.data);
          } else {
            that.ruleTypeList = [];
            that.$notice('规则类型查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.ruleTypeList = [];
          that.$notice('规则类型查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.ruleTypeList = [];
        that.$notice('规则类型查询失败');
        console.log(error);
      });
    },
    // 根据规则类型查规则维度
    findruleDimensionByruleType () {
      let that = this;
      if (!that.ruleForm.ruleType) {
        return false;
      }
      return new Promise((resolve, reject) => {
        let formData = {
          'ruleTypeId': that.ruleForm.ruleType
        };
        that.$axios({
          method: 'post',
          url: '/ruleinfo/find_rule_dimension.do?t=' + (+new Date()),
          data: that.removeNullKey(formData)
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.ruleForm.ruleDimensionList = data.data;
            resolve(data.data);
          } else {
            that.ruleForm.ruleDimensionList = [];
            that.$notice('规则维度查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.ruleForm.ruleDimensionList = [];
          that.$notice('规则维度查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.ruleForm.ruleDimensionList = [];
        that.$notice('规则维度查询失败');
        console.log(error);
      });
    },
    // 根据规则维度查原子可测量度
    findatomyByruleDimension () {
      let that = this;
      if (!that.atomyIsShow) {
        return false;
      }
      if (!that.ruleForm.ruleDimension) {
        return false;
      }
      return new Promise((resolve, reject) => {
        let formData = {
          'ruleDimensionId': that.ruleForm.ruleDimension
        };
        that.$axios({
          method: 'post',
          url: '/ruleinfo/find_atomy.do?t=' + (+new Date()),
          data: that.removeNullKey(formData)
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.ruleForm.atomyList = data.data;
            resolve(data.data);
          } else {
            that.ruleForm.atomyList = [];
            that.$notice('原子可测量度查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.ruleForm.atomyList = [];
          that.$notice('原子可测量度查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.ruleForm.atomyList = [];
        that.$notice('原子可测量度查询失败');
        console.log(error);
      });
    },
    ruleTypeChange (value) {
      if (this.clear) {
        this.ruleForm.ruleDimensionList = [];
        this.ruleForm.atomyList = [];
        this.ruleForm.ruleDimension = '';
        this.ruleForm.atomy = '';
      }
      if (value) {
        this.findruleDimensionByruleType();
      }
      this.$emit('select', this.ruleForm);
    },
    ruleDimensionChange (value) {
      if (this.clear) {
        this.ruleForm.atomyList = [];
        this.ruleForm.atomy = '';
      }
      if (value) {
        this.findatomyByruleDimension();
      }
      this.$emit('select', this.ruleForm);
    },
    atomyChange (value) {
      this.$emit('select', this.ruleForm);
    },
    clearInit (type) {
      this.clear = true;
      if (type === undefined) {
        return false;
      }
      // 为了配合左侧树的编辑更新，所以下拉的时候重新拉取一次数据
      if (type == 0) {
        this.findruleType();
      } else if (type == 1) {
        this.findruleDimensionByruleType();
      } else if (type == 2) {
        this.findatomyByruleDimension();
      }
    },
    reset () {
      // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>
<style>
  .el-form.searchComponent .el-form-item .el-input {
    width: 150px !important;
  }
</style>
