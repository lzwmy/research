<template>
    <div class="pga_container">
        <table border="1" cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <th></th>
            <th>评分</th>
            <th>得分</th>
            <th>具体描述</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in tableData" :key="index" @click="handerPGA(item)">
            <td class="single_checkBox">
              <el-radio v-model="pgaValue" :label="item.scoreNum"></el-radio>
            </td>
            <td>{{item.scoreTitle}}</td>
            <td>{{item.scoreNum}}</td>
            <td>{{item.description}}</td>
          </tr>
          </tbody>
        </table>
    </div>
</template>

<script>
    export default {
      name: "scorePga",
      props:{
        item: {},
        report: {},
        index: Number
      },
      data() {
        return {
          tableData:[
            {
              scoreTitle:'皮损消失',
              scoreNum:0,
              description:"没有皮损，或皮损极其轻微而无需治疗"
            },
            {
              scoreTitle:'明显改善',
              scoreNum:1,
              description:"有非常肯定的疗效（约为75%），仍有皮损的"
            },
            {
              scoreTitle:'中等程度改善',
              scoreNum:2,
              description:"有肯定的疗效（约为50%）"
            },
            {
              scoreTitle:'轻度改善',
              scoreNum:3,
              description:"有肯定的疗效（约为25%），但是皮损的重要"
            },
            {
              scoreTitle:'无变化',
              scoreNum:4,
              description:"皮损没有变化"
            },
            {
              scoreTitle:'加重',
              scoreNum:5,
              description:"与基线相比，皮损的严重程度和范围都加重"
            }
          ],
          pgaValue:""
        }
      },
      methods:{
        handerPGA(val) {
          this.pgaValue = val.scoreNum;
        },
        async getPreviewPGA() {
          let that = this;
          let formData = {
            scoreId:this.report.value2 || ""
          };
          try {
            let data = await that.$http.getScoreReportPreview(formData);
            if(data.code === 0) {
              let jsonData = JSON.parse(data.data.jsonData);
              that.pgaValue = parseInt(jsonData)
            }
          }catch (error) {
            console.log(error)
          }
        }
      },
      mounted() {
        if(this.report.value2 !== "") {
          this.getPreviewPGA();
        }
      }
    }
</script>

<!--<style >
.pga_container table{
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5ebf1;
}
.pga_container table thead tr th{
  text-align: left;
  padding: 0 10px;
  height: 39px;
}
.pga_container table td{
  height: 39px;
  color: #6a707e;
  padding: 0 10px;
}
.pga_container table tbody tr td.single_checkBox .el-radio .el-radio__label{
  display: none;
}
.pga_container table tbody tr td.single_checkBox{
  text-align: center;
}
.pga_container table tbody tr:hover{
  background-color: #f7f9fa;
  cursor: pointer;
}
</style>-->
