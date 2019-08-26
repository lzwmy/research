<template>
  <el-form :inline="true" :model="ruleForm" ref="ruleForm" :label-width='width' :rules="rules" class="searchComponent">
    <el-form-item label="单病种：" prop="disease">
      <el-select v-model="ruleForm.disease" placeholder="请选择单病种" clearable filterable size="mini"
                 @clear="clearInit(0)" @visible-change="clearInit(0)" :disabled="disabled || diseaseDisabled">
        <el-option
          v-for="item in diseaseList"
          :key="item.id"
          :title="item.name"
          :label="item.name.length>10?item.name.substring(0,10)+'...':item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="课题：" prop="subject">
      <el-select v-model="ruleForm.subject" placeholder="请选择课题" clearable filterable size="mini"
                 @clear="clearInit(1)" @visible-change="clearInit(1)" :disabled="disabled || subjectDisabled">
        <el-option
          v-for="item in ruleForm.subjectList"
          :key="item.id"
          :title="item.name"
          :label="item.name.length>10?item.name.substring(0,10)+'...':item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="实验组：" prop="group" v-if="groupIsShow">
      <el-select v-model="ruleForm.group" placeholder="请选择实验组" clearable filterable size="mini"
                 @clear="clearInit(2)" @visible-change="clearInit(2)" :disabled="disabled || groupDisabled">
        <el-option
          v-for="item in ruleForm.groupList"
          :key="item.id"
          :title="item.name"
          :label="item.name.length>10?item.name.substring(0,10)+'...':item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'diseaseSubjectgroup',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    diseaseDisabled: {
      type: Boolean,
      default: false
    },
    subjectDisabled: {
      type: Boolean,
      default: false
    },
    groupDisabled: {
      type: Boolean,
      default: false
    },
    groupIsShow: {
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
    var diseaseCheck = [];
    var subjectCheck = [];

    if (this.checkForm) {
      diseaseCheck = [{required: true, message: '请选择单病种', trigger: 'change'}];
      subjectCheck = [{required: true, message: '请选择课题', trigger: 'change'}];
    }
    return {
      ruleForm: {
        disease: '',
        diseaseName: '',
        subject: '',
        subjectName: '',
        group: '',
        groupName: '',
        subjectList: [],
        groupList: []
      },
      diseaseList: [],
      clear: true, // 为真的情况，会将子项赋值为空，
      rules: {
        disease: diseaseCheck,
        subject: subjectCheck
      }
    };
  },
  watch: {
    'ruleForm.disease' (val, oldval) {
      this.getName(val, this.diseaseList, 'disease');
      this.findSubjectByDisease();
      this.diseaseChange(val);
    },
    'ruleForm.subject' (val, oldval) {
      this.getName(val, this.ruleForm.subjectList, 'subject');
      this.findGroupBySubject();
      this.subjectChange(val);
    },
    'ruleForm.group' (val, oldval) {
      this.getName(val, this.ruleForm.groupList, 'group');
      this.groupChange(val);
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
      this.findDisease();
      this.clear = this.clearOthers;
    },
    getName (id, arr, type) {
      let that = this;
      arr.forEach(item => {
        if (item.id === id) {
          if (type == 'disease') {
            that.ruleForm.diseaseName = item.name;
          } else if (type == 'subject') {
            that.ruleForm.subjectName = item.name;
          } else if (type == 'group') {
            that.ruleForm.groupName = item.name;
          }
        }
      });
    },
    // 查所有单病种
    async findDisease () {
      let that = this;
      try {
        let data = await that.$http.statisticsFindDiseaseList();
        if (data.code == '0') {
          that.diseaseList = data.data.list;
        }
      } catch (error) {
        that.diseaseList = [];
        that.$notice('单病种查询失败');
        console.log(error);
      }
    },
    // 根据单病种查课题
    async findSubjectByDisease () {
      let that = this;
      if (!that.ruleForm.disease) {
        return false;
      }
      try {
        let data = await that.$http.statisticsFindSubjectList({id: that.ruleForm.disease});
        if (data.code == '0') {
          that.ruleForm.subjectList = data.data.list;
        }
      } catch (error) {
        that.ruleForm.subjectList = [];
        that.$notice('课题查询失败');
        console.log(error);
      }
    },
    // 根据课题查原实验组
    async findGroupBySubject () {
      let that = this;
      if (!that.groupIsShow) {
        return false;
      }
      if (!that.ruleForm.subject) {
        return false;
      }
      try {
        let data = await that.$http.statisticsFindExperimentList({id: that.ruleForm.subject});
        if (data.code == '0') {
          that.ruleForm.groupList = data.data.list;
        }
      } catch (error) {
        that.ruleForm.groupList = [];
        that.$notice('实验组查询失败');
        console.log(error);
      }
    },
    diseaseChange (value) {
      if (this.clear) {
        this.ruleForm.subjectList = [];
        this.ruleForm.groupList = [];
        this.ruleForm.subject = '';
        this.ruleForm.group = '';
      }
      if (value) {
        this.findSubjectByDisease();
      }
      this.$emit('select', this.ruleForm);
    },
    subjectChange (value) {
      if (this.clear) {
        this.ruleForm.groupList = [];
        this.ruleForm.group = '';
      }
      if (value) {
        this.findGroupBySubject();
      }
      this.$emit('select', this.ruleForm);
    },
    groupChange (value) {
      this.$emit('select', this.ruleForm);
    },
    clearInit (type) {
      this.clear = true;
      if (type === undefined) {
        return false;
      }
      // 为了配合左侧树的编辑更新，所以下拉的时候重新拉取一次数据
      if (type == 0) {
        this.findDisease();
      } else if (type == 1) {
        this.findSubjectByDisease();
      } else if (type == 2) {
        this.findGroupBySubject();
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
