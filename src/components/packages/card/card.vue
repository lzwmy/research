<template>
  <div class="card">
    <ul class="lista">
      <li>
        <div class="bc1"><i class="icon-hospital"></i><span>医院机构</span>
          <p><em>{{dataStatistics.hospitalNum}}</em>家</p></div>
      </li>
      <li>
        <div class="bc2"><i class="icon-doctor"></i><span>医生数量</span>
          <p><em>{{dataStatistics.doctorNum}}</em>人</p></div>
      </li>
      <li>
        <div class="bc3"><i class="icon-huanzhe"></i><span>处方患者</span>
          <p><em>{{dataStatistics.patientNum}}</em>人</p></div>
      </li>
      <li>
        <div class="bc4"><i class="icon-report"></i><span>处方张数</span>
          <p><em>{{dataStatistics.prescriptionNum}}</em>张</p></div>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'card',
  mixins: [],
  data () {
    return {};
  },
  props: {
    dataStatistics: {
      type: Object,
      default () {
        return {
          hospitalNum: '0',
          doctorNum: '0',
          patientNum: '0',
          prescriptionNum: '0'
        };
      }
    }
  },
  components: {},
  watch: {},
  computed: {},
  created () {

  },
  mounted () {

  },
  methods: {},
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>

<style scoped>

  .lista {
    margin-right: -22px;
    width: 100%;
  }

  .lista li {
    width: 24%;
    display: inline-block;
    padding-right: 22px;
  }

  .lista li > div {
    height: 136px;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    padding: 30px 25px;
  }

  .bc1 {
    background: #1bd0a1;
  }

  .bc2 {
    background: #52bbf9;
  }

  .bc3 {
    background: #feb76e;
  }

  .bc4 {
    background: #ff8883;
  }

  .lista div span {
    font-weight: bold;
  }

  .lista div p {
    margin-top: 8px;
  }

  .lista div p em {
    font-weight: bold;
    font-size: 30px;
  }

  .icon-hospital, .icon-huanzhe, .icon-doctor, .icon-report {
    width: 33px;
    height: 33px;
    display: inline-block;
    background: url("./images/hospital.png") no-repeat center;
    background-size: cover;
    vertical-align: text-bottom;
    margin-right: 5px;
  }

  .icon-huanzhe {
    background: url("./images/huanzhe.png") no-repeat center;
    background-size: cover;
  }

  .icon-doctor {
    background: url("./images/doctor.png") no-repeat center;
    background-size: cover;
  }

  .icon-report {
    background: url("./images/report.png") no-repeat center;
    background-size: cover;
  }
</style>
