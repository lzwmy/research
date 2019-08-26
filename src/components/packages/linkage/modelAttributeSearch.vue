<template>
  <el-form :inline="true" :model="ruleForm" ref="ruleForm" :label-width='width' :rules="rules" class="searchComponent">
    <el-form-item label="服务类型：" prop="service">
      <el-select v-model="ruleForm.service" placeholder="请选择服务类型" clearable size="mini"
                 @clear="clearInit(0)" @visible-change="clearInit(0)" :disabled="disabled || serviceDisabled">
        <el-option
          v-for="item in serviceList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务类型：" prop="business">
      <el-select v-model="ruleForm.business" placeholder="请选择业务类型" clearable size="mini"
                 @clear="clearInit(1)" @visible-change="clearInit(1)" :disabled="disabled || businessDisabled">
        <el-option
          v-for="item in ruleForm.businessList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="事件类型：" prop="event" v-if="eventIsShow">
      <el-select v-model="ruleForm.event" placeholder="请选择事件类型" clearable size="mini"
                 @clear="clearInit(2)" @visible-change="clearInit(2)" :disabled="disabled || eventDisabled">
        <el-option
          v-for="item in ruleForm.eventList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="模型名称：" prop="model" v-if="modelIsShow">
      <el-select v-model="ruleForm.model" placeholder="请选择模型名称" clearable size="mini"
                 @clear="clearInit(3)" @visible-change="clearInit(3)" :disabled="disabled || modelDisabled">
        <el-option
          v-for="item in ruleForm.modelList"
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
  name: 'linkage',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    serviceDisabled: {
      type: Boolean,
      default: false
    },
    businessDisabled: {
      type: Boolean,
      default: false
    },
    eventDisabled: {
      type: Boolean,
      default: false
    },
    eventIsShow: {
      type: Boolean,
      default: true
    },
    modelDisabled: {
      type: Boolean,
      default: false
    },
    modelIsShow: {
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
    var serviceCheck = [];
    var businessCheck = [];
    var eventCheck = [];
    var modelCheck = [];
    if (this.checkForm) {
      serviceCheck = [{required: true, message: '请选择服务类型', trigger: 'change'}];
      businessCheck = [{required: true, message: '请选择业务类型', trigger: 'change'}];
      eventCheck = [{required: true, message: '请选择事件类型', trigger: 'change'}];
      modelCheck = [{required: true, message: '请选择模型名称', trigger: 'change'}];
    }
    return {
      ruleForm: {
        service: '',
        serviceName: '',
        business: '',
        businessName: '',
        event: '',
        eventName: '',
        model: '',
        modelName: '',
        businessList: [],
        eventList: [],
        modelList: []
      },
      serviceList: [],
      clear: true, // 为真的情况，会将子项赋值为空，
      rules: {
        service: serviceCheck,
        business: businessCheck,
        event: eventCheck,
        model: modelCheck
      }
    };
  },
  watch: {
    'ruleForm.service' (val, oldval) {
      this.getName(val, this.serviceList, 'service');
      this.findBusinessByService();
      this.serviceChange(val);
    },
    'ruleForm.business' (val, oldval) {
      this.getName(val, this.ruleForm.businessList, 'business');
      this.findEventByBusiness();
      this.businessChange(val);
    },
    'ruleForm.event' (val, oldval) {
      this.getName(val, this.ruleForm.eventList, 'event');
      this.findModelByEvent();
      this.eventChange(val);
    },
    'ruleForm.model' (val, oldval) {
      this.getName(val, this.ruleForm.modelList, 'model');
      this.modelChange(val);
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
      this.findService();
      this.clear = this.clearOthers;
    },
    getName (id, arr, type) {
      let that = this;
      arr.forEach(item => {
        if (item.id === id) {
          if (type == 'service') {
            that.ruleForm.serviceName = item.name;
          } else if (type == 'business') {
            that.ruleForm.businessName = item.name;
          } else if (type == 'event') {
            that.ruleForm.eventName = item.name;
          } else if (type == 'model') {
            that.ruleForm.modelName = item.name;
          }
        }
      });
    },
    // 查所有服务
    findService () {
      let that = this;
      return new Promise((resolve, reject) => {
        let formData = {
          'name': ''
        };
        that.$axios({
          method: 'post',
          url: '/svcmgt/find_list_by_name.do?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.serviceList = data.data;
            resolve(data.data);
          } else {
            that.serviceList = [];
            that.$notice('服务查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.serviceList = [];
          that.$notice('服务查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.serviceList = [];
        that.$notice('服务查询失败');
        console.log(error);
      });
    },
    // 根据服务查业务
    findBusinessByService () {
      let that = this;
      if (!that.ruleForm.service) {
        return false;
      }
      return new Promise((resolve, reject) => {
        let formData = {
          'serviceId': that.ruleForm.service
        };
        that.$axios({
          method: 'post',
          url: '/business/find_list_by_serviceid.do?t=' + (+new Date()),
          data: that.removeNullKey(formData)
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.ruleForm.businessList = data.data;
            resolve(data.data);
          } else {
            that.ruleForm.businessList = [];
            that.$notice('业务查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.ruleForm.businessList = [];
          that.$notice('业务查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.ruleForm.businessList = [];
        that.$notice('业务查询失败');
        console.log(error);
      });
    },
    // 根据业务查事件
    findEventByBusiness () {
      let that = this;
      if (!that.eventIsShow) {
        return false;
      }
      if (!that.ruleForm.business) {
        return false;
      }
      return new Promise((resolve, reject) => {
        let formData = {
          'businessId': that.ruleForm.business
        };
        that.$axios({
          method: 'post',
          url: '/event/find_list_by_businessid.do?t=' + (+new Date()),
          data: that.removeNullKey(formData)
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.ruleForm.eventList = data.data;
            resolve(data.data);
          } else {
            that.ruleForm.eventList = [];
            that.$notice('事件查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.ruleForm.eventList = [];
          that.$notice('事件查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.ruleForm.eventList = [];
        that.$notice('业务查询失败');
        console.log(error);
      });
    },
    findModelByEvent () {
      let that = this;
      if (!that.modelIsShow) {
        return false;
      }
      if (!that.ruleForm.event) {
        return false;
      }
      return new Promise((resolve, reject) => {
        let formData = {
          'eventId': that.ruleForm.event
        };
        that.$axios({
          method: 'post',
          url: '/model/find_by_event_id.do?t=' + (+new Date()),
          data: that.removeNullKey(formData)
        }).then((response) => {
          let data = response.data;
          if (data.code == '0' && data.msg == 'Success') {
            that.ruleForm.modelList = data.data;
            resolve(data.data);
          } else {
            that.ruleForm.modelList = [];
            that.$notice('模型名称查询失败');
            reject(new Error([]));
          }
        }).catch((error) => {
          that.ruleForm.modelList = [];
          that.$notice('模型名称查询失败');
          reject(new Error([]));
          console.log(error);
        });
      }).catch((error) => {
        that.ruleForm.modelList = [];
        that.$notice('模型名称查询失败');
        console.log(error);
      });
    },
    serviceChange (value) {
      if (this.clear) {
        this.ruleForm.businessList = [];
        this.ruleForm.eventList = [];
        this.ruleForm.modelList = [];
        this.ruleForm.business = '';
        this.ruleForm.event = '';
        this.ruleForm.model = '';
      }
      if (value) {
        this.findBusinessByService();
      }
      this.$emit('select', this.ruleForm);
    },
    businessChange (value) {
      if (this.clear) {
        this.ruleForm.eventList = [];
        this.ruleForm.modelList = [];
        this.ruleForm.event = '';
        this.ruleForm.model = '';
      }
      if (value) {
        this.findEventByBusiness();
      }
      this.$emit('select', this.ruleForm);
    },
    eventChange (value) {
      if (this.clear) {
        this.ruleForm.modelList = [];
        this.ruleForm.model = '';
      }
      if (value) {
        this.findModelByEvent();
      }
      this.$emit('select', this.ruleForm);
    },
    modelChange () {
      this.$emit('select', this.ruleForm);
    },
    clearInit (type) {
      this.clear = true;
      if (type === undefined) {
        return false;
      }
      // 为了配合左侧树的编辑更新，所以下拉的时候重新拉取一次数据
      if (type == 0) {
        this.findService();
      } else if (type == 1) {
        this.findBusinessByService();
      } else if (type == 2) {
        this.findEventByBusiness();
      } else if (type == 3) {
        this.findModelByEvent();
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
