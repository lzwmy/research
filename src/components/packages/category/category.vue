<template>
  <el-form :inline="true" :model="ruleForm" ref="ruleForm" :label-width='width' class="categoryComponent"
           :category="category" :rules="rules">
    <el-form-item :label="materialCategory" prop="ITEM_CODE1">
      <el-select v-model="ruleForm.ITEM_CODE1" placeholder="请选择" clearable
                 @clear="clearInit" @visible-change="clearInit" :disabled="disabled || typeDisabled1">
        <el-option
          v-for="item in ruleForm.fixedAssetsArr1"
          :key="item.ITEM_CODE"
          :label="item.ITEM_NAME"
          :value="item.ITEM_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="ruleForm.ITEM_CODE2" placeholder="请选择" clearable
                 @clear="clearInit" @visible-change="clearInit" :disabled="disabled || typeDisabled2">
        <el-option
          v-for="item in ruleForm.fixedAssetsArr2"
          :key="item.ITEM_CODE"
          :label="item.ITEM_NAME"
          :value="item.ITEM_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="ruleForm.ITEM_CODE3" placeholder="请选择" clearable
                 @clear="clearInit" @visible-change="clearInit" :disabled="disabled || typeDisabled3">
        <el-option
          v-for="item in ruleForm.fixedAssetsArr3"
          :key="item.ITEM_CODE"
          :label="item.ITEM_NAME"
          :value="item.ITEM_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="ruleForm.ITEM_CODE4" placeholder="请选择" clearable
                 @clear="clearInit" @visible-change="clearInit" :disabled="disabled || typeDisabled4">
        <el-option
          v-for="item in ruleForm.fixedAssetsArr4"
          :key="item.ITEM_CODE"
          :label="item.ITEM_NAME"
          :value="item.ITEM_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <slot name="moreFormItem"></slot>
  </el-form>
</template>
<script>
import { MATERIAL_CATEGORY } from 'components/utils/constant';

export default {
  name: 'category',
  props: {
    category: {
      type: String,
      default: ''
    },
    materialCategory: {
      type: String,
      default: '材料分类：'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    typeDisabled1: {
      type: Boolean,
      default: false
    },
    typeDisabled2: {
      type: Boolean,
      default: false
    },
    typeDisabled3: {
      type: Boolean,
      default: false
    },
    typeDisabled4: {
      type: Boolean,
      default: false
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
    var itemCodeCheck1 = [];
    if (this.checkForm) {
      itemCodeCheck1 = [{required: true, message: '请选择材料分类', trigger: 'blur'}];
    }

    return {
      ruleForm: {
        ITEM_CODE1: '',
        ITEM_CODE2: '',
        ITEM_CODE3: '',
        ITEM_CODE4: '',
        fixedAssetsArr1: [],
        fixedAssetsArr2: [],
        fixedAssetsArr3: [],
        fixedAssetsArr4: []

        //          provinceName:'',
        //          city: '',
        //          cityName:'',
        //          village: '',
        //          villageName: '',
        //          town: '',
        //          townName: '',
        //          community: '',
        //          communityName: '',
        //          org: '',
        //          orgName: '',
        //          team: '',
        //          cityArr: [],
        //          villageArr: [],
        //          townArr: [],
        //          communityArr: [],
        //          orgArr: [],
        //          teamArr: [],
      },
      //        fixedAssetsArr1:[],
      //        provinceArr: [],
      clear: true, // 为真的情况，会将子项赋值为空，
      rules: {
        ITEM_CODE1: itemCodeCheck1
      }
    };
  },
  watch: {
    'ruleForm.ITEM_CODE1' (val, oldval) {
      this.firstItemCodeChange(val);
    },
    'ruleForm.ITEM_CODE2' (val, oldval) {
      this.secondItemCodeChange(val);
    },
    'ruleForm.ITEM_CODE3' (val, oldval) {
      this.thirdItemCodeChange(val);
    },
    'ruleForm.ITEM_CODE4' (val, oldval) {
      this.forthItemCodeChange(val);
    },
    'category' (val) {
      this.readData(val);
    }
  },
  created () {
    this.initPage();
  },
  activated () {
    this.getFixedAssets1();
    this.initPage();
    this.readData(this.category);
  },
  methods: {
    initPage () {
      this.BASEDATACLASS_CODE = MATERIAL_CATEGORY;
      this.getFixedAssets1();
      this.clear = this.clearOthers;
    },

    getFixedAssets1 () {
      let that = this;
      let Global = JSON.parse(localStorage.getItem('Global'));
      let CONSUMER_ID = localStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
      let data = {
        'BASEDATACLASS_CODE': that.BASEDATACLASS_CODE,
        //          "ITEM_CODE": that.ruleForm.ITEM_CODE1,
        //          "SIZE":2,
        'size': 2,
        'SERVICE_CODE': 'bull.MedBaseInterface.Base_Catelog_FixedAssets_Category',
        'CONSUMER_ID': CONSUMER_ID,
        'esblover': false
      };
      // ajax请求
      that.$axios({
        method: 'post',
        url: '/std/dict/getFixedAssets?t=' + (+new Date()),
        //          url: '/serviceProxy/servlet/?t=' + (+new Date()),
        //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},//以表单格式传递表单对象
        data: that.$format(data)
      }).then(function (response) {
        let data = response.data;
        if (data.SYS_HEAD.RET_STATUS == 'S') {
          that.ruleForm.fixedAssetsArr1 = data.BODY.data;
          that.$emit('select', that.ruleForm);
        } else {
          //            that.$warning();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    getFixedAssetsN (size, value) {
      let that = this;
      let Global = JSON.parse(localStorage.getItem('Global'));
      let CONSUMER_ID = localStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
      let data = {
        'BASEDATACLASS_CODE': that.BASEDATACLASS_CODE,
        'ITEM_CODE': value,
        //          "SIZE":size,
        'size': size,
        'SERVICE_CODE': 'bull.MedBaseInterface.Base_Catelog_FixedAssets_Category',
        'CONSUMER_ID': CONSUMER_ID,
        'esblover': false
      };
      // ajax请求
      that.$axios({
        method: 'post',
        url: '/std/dict/getFixedAssets?t=' + (+new Date()),
        //          url: '/serviceProxy/servlet/?t=' + (+new Date()),
        //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},//以表单格式传递表单对象
        data: that.$format(data)
      }).then(function (response) {
        let data = response.data;
        if (data.SYS_HEAD.RET_STATUS == 'S') {
          if (size === 3) {
            that.ruleForm.fixedAssetsArr2 = data.BODY.data;// 第二级
          } else if (size === 4) {
            that.ruleForm.fixedAssetsArr3 = data.BODY.data;// 第三级
          } else if (size === 6) {
            that.ruleForm.fixedAssetsArr4 = data.BODY.data;// 第四级
          }

          that.$emit('select', that.ruleForm);
        } else {
          //            that.$warning();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    firstItemCodeChange (value) {
      if (this.clear) {
        this.ruleForm.ITEM_CODE2 = '';
        this.ruleForm.ITEM_CODE3 = '';
        this.ruleForm.ITEM_CODE4 = '';
        this.ruleForm.fixedAssetsArr2 = [];
        this.ruleForm.fixedAssetsArr3 = [];
        this.ruleForm.fixedAssetsArr4 = [];
      }
      if (value) {
        this.getFixedAssetsN(3, value);// 第二级
      } else {
        this.$emit('select', this.ruleForm);
      }
    },
    secondItemCodeChange (value) {
      if (this.clear) {
        this.ruleForm.ITEM_CODE3 = '';
        this.ruleForm.ITEM_CODE4 = '';
        this.ruleForm.fixedAssetsArr3 = [];
        this.ruleForm.fixedAssetsArr4 = [];
      }
      if (value) {
        this.getFixedAssetsN(4, value);// 第三级
      } else {
        this.$emit('select', this.ruleForm);
      }
    },
    thirdItemCodeChange (value) {
      if (this.clear) {
        this.ruleForm.ITEM_CODE4 = '';
        this.ruleForm.fixedAssetsArr4 = [];
      }
      if (value) {
        this.getFixedAssetsN(6, value);// 第四级
      } else {
        this.$emit('select', this.ruleForm);
      }
    },
    forthItemCodeChange (value) {
      this.$emit('select', this.ruleForm);
    },

    readData (val) {
      let categoryCode1 = '';
      let categoryCode2 = '';
      let categoryCode3 = '';
      let categoryCode4 = '';
      if (val) {
        if (val.length === 0) {
          this.ruleForm.ITEM_CODE1 = val;
        } else if (val.length === 2) {
          this.clear = false;
          categoryCode1 = val;
          this.ruleForm.ITEM_CODE1 = categoryCode1;
          this.firstItemCodeChange(categoryCode1);
        } else if (val.length === 3) {
          this.clear = false;
          categoryCode1 = val.substr(0, 2);
          this.firstItemCodeChange(categoryCode1);
          categoryCode2 = val;
          this.secondItemCodeChange(categoryCode2);
          this.ruleForm.ITEM_CODE1 = categoryCode1;
          this.ruleForm.ITEM_CODE2 = categoryCode2;
        } else if (val.length === 4) {
          this.clear = false;
          categoryCode1 = val.substr(0, 2);
          this.firstItemCodeChange(categoryCode1);
          categoryCode2 = val.substr(0, 3);
          this.secondItemCodeChange(categoryCode2);
          categoryCode3 = val;
          this.thirdItemCodeChange(categoryCode3);
          this.ruleForm.ITEM_CODE1 = categoryCode1;
          this.ruleForm.ITEM_CODE2 = categoryCode2;
          this.ruleForm.ITEM_CODE3 = categoryCode3;
        } else if (val.length === 6) {
          this.clear = false;
          categoryCode1 = val.substr(0, 2);
          this.firstItemCodeChange(categoryCode1);
          categoryCode2 = val.substr(0, 3);
          this.secondItemCodeChange(categoryCode2);
          categoryCode3 = val.substr(0, 4);
          this.thirdItemCodeChange(categoryCode3);
          categoryCode4 = val;
          this.forthItemCodeChange(categoryCode4);
          this.ruleForm.ITEM_CODE1 = categoryCode1;
          this.ruleForm.ITEM_CODE2 = categoryCode2;
          this.ruleForm.ITEM_CODE3 = categoryCode3;
          this.ruleForm.ITEM_CODE4 = categoryCode4;
        }
      }
    },
    clearInit () {
      this.clear = true;
    },
    reset () {
      // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.ruleForm.resetFields();
      this.ruleForm.ITEM_CODE1 = '';
      this.ruleForm.ITEM_CODE2 = '';
      this.ruleForm.ITEM_CODE3 = '';
      this.ruleForm.ITEM_CODE4 = '';
    }
  }
};
</script>
<style>
  .el-form .categoryComponent .el-form-item .el-input {
    width: 90px !important;
  }

  .categoryComponent {
    display: inline-block;
  }
</style>
