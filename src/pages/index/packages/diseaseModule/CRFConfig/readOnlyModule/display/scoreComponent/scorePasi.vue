<template>
    <div class="pasi_container read-mode">
      <div class="score_title">头/颈 </div>
      <div class="score_content">
        <div class="content_item">
          <div class="item_name">受损面积</div>
          <div class="item_radio_box">
            <el-radio v-model="head.area" :label="0" disabled>0%</el-radio>
            <el-radio v-model="head.area" :label="1" disabled><10%</el-radio>
            <el-radio v-model="head.area" :label="2" disabled>10-29%</el-radio>
            <el-radio v-model="head.area" :label="3" disabled>30-49%</el-radio>
            <el-radio v-model="head.area" :label="4" disabled>50-69%</el-radio>
            <el-radio v-model="head.area" :label="5" disabled>70-89%</el-radio>
            <el-radio v-model="head.area" :label="6" disabled>90-100%</el-radio>
          </div>

        </div>
        <div class="content_item">
          <div class="item_name">脱屑</div>
          <div class="item_radio_box">
            <el-radio v-model="head.desquamation" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="head.desquamation" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="head.desquamation" :label="2" disabled>中度</el-radio>
            <el-radio v-model="head.desquamation" :label="3" disabled>重度</el-radio>
            <el-radio v-model="head.desquamation" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">红斑</div>
          <div class="item_radio_box">
            <el-radio v-model="head.erythema" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="head.erythema" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="head.erythema" :label="2" disabled>中度</el-radio>
            <el-radio v-model="head.erythema" :label="3" disabled>重度</el-radio>
            <el-radio v-model="head.erythema" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">浸润</div>
          <div class="item_radio_box">
            <el-radio v-model="head.infiltration" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="head.infiltration" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="head.infiltration" :label="2" disabled>中度</el-radio>
            <el-radio v-model="head.infiltration" :label="3" disabled>重度</el-radio>
            <el-radio v-model="head.infiltration" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
      </div>
      <div class="score_title">躯干 </div>
      <div class="score_content">
        <div class="content_item">
          <div class="item_name">受损面积</div>
          <div class="item_radio_box">
            <el-radio v-model="torso.area" :label="0" disabled>0%</el-radio>
            <el-radio v-model="torso.area" :label="1" disabled><10%</el-radio>
            <el-radio v-model="torso.area" :label="2" disabled>10-29%</el-radio>
            <el-radio v-model="torso.area" :label="3" disabled>30-49%</el-radio>
            <el-radio v-model="torso.area" :label="4" disabled>50-69%</el-radio>
            <el-radio v-model="torso.area" :label="5" disabled>70-89%</el-radio>
            <el-radio v-model="torso.area" :label="6" disabled>90-100%</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">脱屑</div>
          <div class="item_radio_box">
            <el-radio v-model="torso.desquamation" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="torso.desquamation" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="torso.desquamation" :label="2" disabled>中度</el-radio>
            <el-radio v-model="torso.desquamation" :label="3" disabled>重度</el-radio>
            <el-radio v-model="torso.desquamation" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">红斑</div>
          <div class="item_radio_box">
            <el-radio v-model="torso.erythema" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="torso.erythema" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="torso.erythema" :label="2" disabled>中度</el-radio>
            <el-radio v-model="torso.erythema" :label="3" disabled>重度</el-radio>
            <el-radio v-model="torso.erythema" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">浸润</div>
          <div class="item_radio_box">
            <el-radio v-model="torso.infiltration" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="torso.infiltration" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="torso.infiltration" :label="2" disabled>中度</el-radio>
            <el-radio v-model="torso.infiltration" :label="3" disabled>重度</el-radio>
            <el-radio v-model="torso.infiltration" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
      </div>
      <div class="score_title">上肢</div>
      <div class="score_content">
        <div class="content_item">
          <div class="item_name"> 受损面积</div>
          <div class="item_radio_box">
            <el-radio v-model="upperLimb.area" :label="0" disabled>0%</el-radio>
            <el-radio v-model="upperLimb.area" :label="1" disabled><10%</el-radio>
            <el-radio v-model="upperLimb.area" :label="2" disabled>10-29%</el-radio>
            <el-radio v-model="upperLimb.area" :label="3" disabled>30-49%</el-radio>
            <el-radio v-model="upperLimb.area" :label="4" disabled>50-69%</el-radio>
            <el-radio v-model="upperLimb.area" :label="5" disabled>70-89%</el-radio>
            <el-radio v-model="upperLimb.area" :label="6" disabled>90-100%</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">脱屑</div>
          <div class="item_radio_box">
            <el-radio v-model="upperLimb.desquamation" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="upperLimb.desquamation" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="upperLimb.desquamation" :label="2" disabled>中度</el-radio>
            <el-radio v-model="upperLimb.desquamation" :label="3" disabled>重度</el-radio>
            <el-radio v-model="upperLimb.desquamation" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">红斑</div>
          <div class="item_radio_box">
            <el-radio v-model="upperLimb.erythema" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="upperLimb.erythema" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="upperLimb.erythema" :label="2" disabled>中度</el-radio>
            <el-radio v-model="upperLimb.erythema" :label="3" disabled>重度</el-radio>
            <el-radio v-model="upperLimb.erythema" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">浸润</div>
          <div class="item_radio_box">
            <el-radio v-model="upperLimb.infiltration" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="upperLimb.infiltration" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="upperLimb.infiltration" :label="2" disabled>中度</el-radio>
            <el-radio v-model="upperLimb.infiltration" :label="3" disabled>重度</el-radio>
            <el-radio v-model="upperLimb.infiltration" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
      </div>
      <div class="score_title">下肢 </div>
      <div class="score_content">
        <div class="content_item">
          <div class="item_name">受损面积</div>
          <div class="item_radio_box">
            <el-radio v-model="lowerLimb.area" :label="0" disabled>0%</el-radio>
            <el-radio v-model="lowerLimb.area" :label="1" disabled><10%</el-radio>
            <el-radio v-model="lowerLimb.area" :label="2" disabled>10-29%</el-radio>
            <el-radio v-model="lowerLimb.area" :label="3" disabled>30-49%</el-radio>
            <el-radio v-model="lowerLimb.area" :label="4" disabled>50-69%</el-radio>
            <el-radio v-model="lowerLimb.area" :label="5" disabled>70-89%</el-radio>
            <el-radio v-model="lowerLimb.area" :label="6" disabled>90-100%</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">脱屑</div>
          <div class="item_radio_box">
            <el-radio v-model="lowerLimb.desquamation" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="lowerLimb.desquamation" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="lowerLimb.desquamation" :label="2" disabled>中度</el-radio>
            <el-radio v-model="lowerLimb.desquamation" :label="3" disabled>重度</el-radio>
            <el-radio v-model="lowerLimb.desquamation" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">红斑</div>
          <div class="item_radio_box">
            <el-radio v-model="lowerLimb.erythema" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="lowerLimb.erythema" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="lowerLimb.erythema" :label="2" disabled>中度</el-radio>
            <el-radio v-model="lowerLimb.erythema" :label="3" disabled>重度</el-radio>
            <el-radio v-model="lowerLimb.erythema" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name">浸润</div>
          <div class="item_radio_box">
            <el-radio v-model="lowerLimb.infiltration" :label="0" disabled>无症状</el-radio>
            <el-radio v-model="lowerLimb.infiltration" :label="1" disabled>轻度</el-radio>
            <el-radio v-model="lowerLimb.infiltration" :label="2" disabled>中度</el-radio>
            <el-radio v-model="lowerLimb.infiltration" :label="3" disabled>重度</el-radio>
            <el-radio v-model="lowerLimb.infiltration" :label="4" disabled>极其严重</el-radio>
          </div>
        </div>
      </div>
      <div class="score_title">各部位PASI得分计算</div>
      <div class="score_content">
        <div class="content_item">
          <div class="item_name sing-input">PASI（头部）=</div>
          <div class="item_single-input">
            <el-input v-model="headPASI" disabled></el-input>
          </div>
          <div class="item_name sing-input mr_20">PASI（上肢）=</div>
          <div class="item_single-input">
            <el-input v-model="upperLimbPASI" disabled></el-input>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name sing-input">PASI（躯干）=</div>
          <div class="item_single-input">
            <el-input v-model="torsoPASI" disabled></el-input>
          </div>
          <div class="item_name sing-input mr_20">PASI（下肢）=</div>
          <div class="item_single-input">
            <el-input v-model="lowerLimbPASI" disabled></el-input>
          </div>
        </div>
        <div class="content_item">
          <div class="item_name sing-input">PASI (总分) =</div>
          <div class="item_single-input">
            <el-input v-model="pasiTotal" disabled></el-input>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "scorePasi",
      props:{
        item: {},
        report: {},
        index: Number
      },
      computed:{
        headPASI:function () {
          let total = (this.head.erythema+this.head.infiltration+this.head.desquamation)*100;
          let sum = ((0.1* total) * this.head.area)/100;
          return sum
        },
        upperLimbPASI:function () {
          let total = (this.upperLimb.erythema+this.upperLimb.infiltration+this.upperLimb.desquamation)*100;
          let sum = ((0.2* total) * this.upperLimb.area)/100;
          return sum
        },
        torsoPASI:function () {
          let total = (this.torso.erythema+this.torso.infiltration+this.torso.desquamation)*100;
          let sum = ((0.3* total) * this.torso.area)/100;
          return sum
        },
        lowerLimbPASI:function () {
          let total = (this.lowerLimb.erythema+this.lowerLimb.infiltration+this.lowerLimb.desquamation)*100;
          let sum = ((0.4* total) * this.lowerLimb.area)/100;
          return sum
        },
        total:function () {
          let sum = (this.headPASI+this.upperLimbPASI+this.torsoPASI+this.lowerLimbPASI);
          let PASI = sum.toFixed(2)
          return PASI
        }
      },
      data(){
        return {
          head:{
            area:0,// 受损面积
            desquamation:0,//脱屑
            erythema:0,//红斑
            infiltration:0,//浸润
          },
          torso:{
            area:0,// 受损面积
            desquamation:0,//脱屑
            erythema:0,//红斑
            infiltration:0,//浸润
          },
          upperLimb:{
            area:0,// 受损面积
            desquamation:0,//脱屑
            erythema:0,//红斑
            infiltration:0,//浸润
          },
          lowerLimb:{
            area:0,// 受损面积
            desquamation:0,//脱屑
            erythema:0,//红斑
            infiltration:0,//浸润
          },
          pasiTotal:'0.00',
        }
      },
      watch:{
        'total':function (data) {
          this.pasiTotal = data ;
        }
      },
      methods:{
      //PASI 数据回填
      async getScoreReportPreview() {
        let that = this;
        let formData = {
          scoreId:this.report.value2 || ""
        };
        try {
          let data = await that.$http.getScoreReportPreview(formData);
          if(data.code === 0) {
            console.log(JSON.parse(data.data.jsonData));
            let jsonData = JSON.parse(data.data.jsonData);
            // that.head = jsonData.head;
            that.head.area=parseInt(jsonData.head.area);
            that.head.desquamation=parseInt(jsonData.head.desquamation);
            that.head.erythema=parseInt(jsonData.head.erythema);
            that.head.infiltration=parseInt(jsonData.head.infiltration);

            that.torso.area = parseInt(jsonData.torso.area);
            that.torso.desquamation = parseInt(jsonData.torso.desquamation);
            that.torso.erythema = parseInt(jsonData.torso.erythema);
            that.torso.infiltration = parseInt(jsonData.torso.infiltration);

            that.upperLimb.area = parseInt(jsonData.upperLimb.area);
            that.upperLimb.desquamation = parseInt(jsonData.upperLimb.desquamation);
            that.upperLimb.erythema = parseInt(jsonData.upperLimb.erythema);
            that.upperLimb.infiltration = parseInt(jsonData.upperLimb.infiltration);

            that.lowerLimb.area = parseInt(jsonData.lowerLimb.area);
            that.lowerLimb.desquamation = parseInt(jsonData.lowerLimb.desquamation);
            that.lowerLimb.erythema = parseInt(jsonData.lowerLimb.erythema);
            that.lowerLimb.infiltration = parseInt(jsonData.lowerLimb.infiltration);
          }
        }catch (error) {
          console.log(error)
        }
      }
      },
      mounted() {
        if(this.report.value2 !== "") {
          this.getScoreReportPreview().then(()=>{
            this.pasiTotal = this.report.value;
          });
        }
      }
    }
</script>

<style lang="less" scoped>
  .score_title {
    font-size: 14px;
    font-weight: bold;
    color: #394263;
  }

  .score_content {
    display: flex;
    flex-direction: column;
    margin-top: 5px;

    .content_item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-left: 15px;
      margin-top: 5px;
      margin-bottom: 5px;

      .item_name {
        width: 120px;
        color: #394263;
      }

      .mr_20 {
        margin-left: 20px;
      }

      .sing-input {
        width: 100px;
      }

      .item_radio_box {
        flex: 1;
      }
      .item_single-input{
        margin-left: 5px;
      }
    }
  }

</style>
