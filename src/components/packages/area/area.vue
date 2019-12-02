<template>
  <el-form :inline="true" :model="ruleForm" ref="ruleForm" :label-width='width' :rules="rules" class="areaComponent">
    <el-form-item :label="provinceName" prop="province">
      <el-select v-model="ruleForm.province" placeholder="请选择省" clearable size="mini"
                 @clear="clearInit(0)" @visible-change="clearInit(0)" :disabled="disabled || provinceDisabled">
        <el-option
          v-for="item in provinceArr"
          :key="item.REGION_CODE"
          :label="item.AREA_NAME"
          :value="item.REGION_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="city">
      <el-select v-model="ruleForm.city" placeholder="请选择市" clearable size="mini"
                 @clear="clearInit(1)" @visible-change="clearInit(1)" :disabled="disabled || cityDisabled">
        <el-option
          v-for="item in ruleForm.cityArr"
          :key="item.REGION_CODE"
          :label="item.AREA_NAME"
          :value="item.REGION_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="displaySigned">
      <el-select v-model="ruleForm.village" placeholder="请选择县" clearable size="mini"
                 @clear="clearInit(2)" @visible-change="clearInit(2)" :disabled="disabled || villageDisabled">
        <el-option
          v-for="item in ruleForm.villageArr"
          :key="item.REGION_CODE"
          :label="item.AREA_NAME"
          :value="item.REGION_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="displaySigned">
      <el-select v-model="ruleForm.town" placeholder="请选择镇" clearable size="mini"
                 @clear="clearInit(3)" @visible-change="clearInit(3)" :disabled="disabled || townDisabled">
        <el-option
          v-for="item in ruleForm.townArr"
          :key="item.REGION_CODE"
          :label="item.AREA_NAME"
          :value="item.REGION_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="displaySigned">
      <el-select v-model="ruleForm.community" placeholder="请选择村" clearable size="mini"
                 @clear="clearInit(4)" @visible-change="clearInit(4)" :disabled="disabled || communityDisabled">
        <el-option
          v-for="item in ruleForm.communityArr"
          :key="item.REGION_CODE"
          :label="item.AREA_NAME"
          :value="item.REGION_CODE">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="orgName" v-if="orgFlag" prop="org" style="margin-right:30px">
      <el-select v-model="ruleForm.org" :placeholder='"请选择" + orgName' clearable size="mini"
                 @clear="clearInit" @visible-change="clearInit" :disabled="disabled || orgDisabled">
        <el-option
          v-for="item in ruleForm.orgArr"
          :key="item.orgCode"
          :label="item.orgName"
          :value="item.orgCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="teamName" v-if="teamFlag">
      <el-select v-model="ruleForm.team" :placeholder='"请选择" + teamName' clearable size="mini"
                 @clear="clearInit" @visible-change="clearInit" :disabled="disabled || teamDisabled">
        <el-option
          v-for="item in ruleForm.teamArr"
          :key="item.doctorEmpi"
          :label="item.teamName"
          :value="item.doctorEmpi">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="displayReset">
      <el-button @click="reset" type="text">重置</el-button>
    </el-form-item>
    <slot name="moreFormItem"></slot>
  </el-form>
</template>
<script>
export default {
  name: 'area',
  props: {
    regionVersion: {
      type: String,
      required: true
    },
    provinceName: {
      type: String,
      default: '归属区域：'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    provinceDisabled: {
      type: Boolean,
      default: false
    },
    cityDisabled: {
      type: Boolean,
      default: false
    },
    villageDisabled: {
      type: Boolean,
      default: false
    },
    townDisabled: {
      type: Boolean,
      default: false
    },
    communityDisabled: {
      type: Boolean,
      default: false
    },
    orgDisabled: {
      type: Boolean,
      default: false
    },
    teamDisabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String
    },
    orgName: {
      type: String,
      default: '所属机构：'
    },
    teamName: {
      type: String,
      default: '签约团队：'
    },
    orgFlag: {
      type: Boolean,
      default: false
    },
    orgStatus: {
      type: String,
      default: ''
    },
    orgLeft: {
      type: Number,
      default: 20
    },
    teamFlag: {
      type: Boolean,
      default: false
    },
    clearOthers: {
      type: Boolean,
      default: true
    },
    checkForm: {
      type: Boolean,
      default: false
    },
    displaySigned: {
      type: Boolean,
      default: true
    },
    displayReset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var provinceCheck = [];
    var cityCheck = [];
    var orgCheck = [];
    if (this.checkForm) {
      provinceCheck = [{required: true, message: '请选择省', trigger: 'change'}];
      cityCheck = [{required: true, message: '请选择市', trigger: 'change'}];
      orgCheck = [{required: true, message: '请选择所属机构', trigger: 'change'}];
    }
    return {
      ruleForm: {
        province: '',
        provinceName: '',
        city: '',
        cityName: '',
        village: '',
        villageName: '',
        town: '',
        townName: '',
        community: '',
        communityName: '',
        org: '',
        orgName: '',
        team: '',
        cityArr: [],
        villageArr: [],
        townArr: [],
        communityArr: [],
        orgArr: [],
        teamArr: []
      },
      provinceArr: [],
      clear: true, // 为真的情况，会将子项赋值为空，
      rules: {
        province: provinceCheck,
        city: cityCheck,
        org: orgCheck
      }
    };
  },
  watch: {
    regionVersion (val, oldVal) {
      this.initPage();
    },
    'ruleForm.province' (val, oldval) {
      this.getAreaNameByAreaCode(val, 'province');
      this.provinceChange(val);
    },
    'ruleForm.city' (val, oldval) {
      this.getAreaNameByAreaCode(val, 'city');
      this.cityChange(val);
    },
    'ruleForm.village' (val, oldval) {
      this.getAreaNameByAreaCode(val, 'village');
      this.villageChange(val);
    },
    'ruleForm.town' (val, oldval) {
      this.getAreaNameByAreaCode(val, 'town');
      this.townChange(val);
    },
    'ruleForm.community' (val, oldval) {
      this.getAreaNameByAreaCode(val, 'community');
      this.communityChange(val);
    },
    'ruleForm.org' (val, oldval) {
      this.getOrgNameByOrgCode(val);
      this.orgChange(val);
    },
    'ruleForm.team' (val, oldval) {
      this.teamChange(val);
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
    //        let provinceArr = JSON.parse(localStorage.getItem(this.regionVersion+'_AREALEVEL_ZERO'));
    //        if (provinceArr && provinceArr.length > 0) {
    //          this.provinceArr = provinceArr
    //        } else {
    //          this.getArea(0, "province");
    //        }

      this.getArea(0, 'province');
      this.clear = this.clearOthers;
    },
    getOrgNameByOrgCode (OrgCode) {
      if (!OrgCode) {
        this.ruleForm.orgName = '';
      }
      if (this.ruleForm.orgArr && this.ruleForm.orgArr.length > 0) {
        this.ruleForm.orgArr.forEach(item => {
          if (item.orgCode === OrgCode) {
            this.ruleForm.orgName = item.orgName;
          }
        });
      } else {
        this.ruleForm.orgName = '';
      }
    },
    getAreaNameByAreaCode (areaCode, option) {
      if (!areaCode) {
        this.ruleForm[option + 'Name'] = '';
      }
      if (option == 'province') {
        if (this[option + 'Arr'] && this[option + 'Arr'].length > 0) {
          this[option + 'Arr'].forEach(item => {
            if (item.REGION_CODE === areaCode) {
              this.ruleForm[option + 'Name'] = item.AREA_NAME;
            }
          });
        }
      } else {
        if (this.ruleForm[option + 'Arr'] && this.ruleForm[option + 'Arr'].length > 0) {
          this.ruleForm[option + 'Arr'].forEach(item => {
            if (item.REGION_CODE === areaCode) {
              this.ruleForm[option + 'Name'] = item.AREA_NAME;
            }
          });
        }
      }
    },
    getArea (level, region, code = '') {
      let that = this;
      if (!that.regionVersion) {
        return false;
      }
      let Global = JSON.parse(localStorage.getItem('Global'));
      let CONSUMER_ID = localStorage.getItem(Global.iam_clientid + '_CONSUMER_ID');
      let SERVICE_CODE = 'bull.MedCoreInterface.Code_Regional_Info';
      let data = {
        'VERSION_CODE': that.regionVersion,
        'AREA_LEVEL': level,
        'REGION_CODE': code,
        'SERVICE_CODE': SERVICE_CODE,
        'CONSUMER_ID': CONSUMER_ID,
        'esblover': false
      };
      // ajax请求
      that.$axios({
        method: 'get',
        url: '/std/region/getRegionByRegionLevel?t=' + (+new Date()),
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},//以表单格式传递表单对象
        params: that.$format(data)
      }).then(function (response) {
        let data = response.data;
        if (data.SYS_HEAD.RET_STATUS == 'S') {
          // console.log(data.BODY.data)
          if (region === 'province') {
            that[region + 'Arr'] = data.BODY.data;
          // localStorage.setItem(that.regionVersion+'_AREALEVEL_ZERO', JSON.stringify(data.BODY.data))
          }
          that.ruleForm[region + 'Arr'] = data.BODY.data;
          that.$emit('select', that.ruleForm);
        } else {
          // that.$warning();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    getOrg () {
      let that = this;
      if (!that.orgFlag) {
        return false;
      }
      // 防止所有区域code都为空的时候，发送请求而后台报错
      if (that.ruleForm.province || that.ruleForm.city || that.ruleForm.village || that.ruleForm.town || that.ruleForm.community) {
        that.$axios({
          method: 'post',
          url: '/CloudPlatform/api/admin/admindivision/query_org_area?v=' + (+new Date()),
          data: that.$qs.stringify(that.$format({
            provinceCode: that.ruleForm.province,
            cityCode: that.ruleForm.city,
            countyCode: that.ruleForm.village,
            townCode: that.ruleForm.town,
            villageCode: that.ruleForm.community,
            orgstatus: that.orgStatus
          }))
        }).then(function (response) {
          let data = response.data;
          if (data.success) {
            that.ruleForm.orgArr = data.data;
            // console.log(that.ruleForm.orgArr)
            that.$emit('select', that.ruleForm);
          } else {
            that.$warning();
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    getTeam (code) {
      var that = this;
      if (!that.teamFlag) {
        return false;
      }
      that.$axios({
        method: 'post',
        url: '/CloudPlatform/api/admin/OrgCodeSelectTeam/queryOrgCodeSelectTeamList.json?v=' + (+new Date()),
        data: that.$qs.stringify({
          'orgCode': code
        })
      }).then(function (response) {
        let data = response.data;
        let success = data.success;
        if (success) {
          that.ruleForm.teamArr = data.data.content;
          that.$emit('select', that.ruleForm);
        } else {
          that.$warning();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    provinceChange (value) {
      // alert(this.clear)
      if (this.clear) {
        this.ruleForm.cityArr = [];
        this.ruleForm.villageArr = [];
        this.ruleForm.townArr = [];
        this.ruleForm.communityArr = [];
        this.ruleForm.orgArr = [];
        this.ruleForm.teamArr = [];
        this.ruleForm.city = '';
        this.ruleForm.village = '';
        this.ruleForm.town = '';
        this.ruleForm.community = '';
        this.ruleForm.org = '';
        this.ruleForm.team = '';
      }
      if (value) {
        this.getArea(1, 'city', value);
      } else {
        this.$emit('select', this.ruleForm);
      }
      if (this.orgFlag) {
        this.getOrg();
      }
    },
    cityChange (value) {
      if (this.clear) {
        this.ruleForm.villageArr = [];
        this.ruleForm.townArr = [];
        this.ruleForm.communityArr = [];
        this.ruleForm.orgArr = [];
        this.ruleForm.teamArr = [];
        this.ruleForm.village = '';
        this.ruleForm.town = '';
        this.ruleForm.community = '';
        this.ruleForm.org = '';
        this.ruleForm.team = '';
      }
      if (value) {
        this.getArea(2, 'village', value);
      } else {
        this.$emit('select', this.ruleForm);
      }
      if (this.orgFlag) {
        this.getOrg();
      }
    },
    villageChange (value) {
      if (this.clear) {
        this.ruleForm.townArr = [];
        this.ruleForm.communityArr = [];
        this.ruleForm.orgArr = [];
        this.ruleForm.teamArr = [];
        this.ruleForm.town = '';
        this.ruleForm.community = '';
        this.ruleForm.org = '';
        this.ruleForm.team = '';
      }
      if (value) {
        this.getArea(3, 'town', value);
      } else {
        this.$emit('select', this.ruleForm);
      }
      if (this.orgFlag) {
        this.getOrg();
      }
    },
    townChange (value) {
      if (this.clear) {
        this.ruleForm.communityArr = [];
        this.ruleForm.orgArr = [];
        this.ruleForm.teamArr = [];
        this.ruleForm.community = '';
        this.ruleForm.org = '';
        this.ruleForm.team = '';
      }
      if (value) {
        this.getArea(4, 'community', value);
      } else {
        this.$emit('select', this.ruleForm);
      }
      if (this.orgFlag) {
        this.getOrg();
      }
    },
    communityChange (value) {
      if (this.clear) {
        this.ruleForm.orgArr = [];
        this.ruleForm.teamArr = [];
        this.ruleForm.org = '';
        this.ruleForm.team = '';
      }
      this.$emit('select', this.ruleForm);
      if (this.orgFlag) {
        this.getOrg();
      }
    },
    orgChange (value) {
      if (this.clear) {
        this.ruleForm.teamArr = [];
        this.ruleForm.team = '';
      }
      if (value) {
        this.getTeam(value);
      } else {
        this.$emit('select', this.ruleForm);
      }
    },
    teamChange (value) {
      this.$emit('select', this.ruleForm);
    },
    clearInit (areaLevel) {
      this.clear = true;
      if (areaLevel === undefined) {
        return false;
      }
      // 为了配合左侧树的编辑更新，所以下拉的时候重新拉取一次数据
      if (areaLevel == 0) {
        this.getArea(0, 'province');
      } else if (areaLevel == 1) {
        this.getArea(1, 'city', this.ruleForm.province);
      } else if (areaLevel == 2) {
        this.getArea(2, 'village', this.ruleForm.city);
      } else if (areaLevel == 3) {
        this.getArea(3, 'town', this.ruleForm.village);
      } else if (areaLevel == 4) {
        this.getArea(4, 'community', this.ruleForm.town);
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
  .el-form.areaComponent .el-form-item .el-input {
    width: 95px !important;
  }
</style>
