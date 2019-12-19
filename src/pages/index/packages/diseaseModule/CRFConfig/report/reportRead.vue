<template>
    <div class="report_read_view_container">

      <el-row type="flex" justify="end">
        <el-button type="primary" @click="onDownloadPDF" :loading="pdfLoading">下载PDF</el-button>
        <el-button @click="printReport">打印文档</el-button>
        <!-- <el-button @click="wordExport">下载Word</el-button> -->
        <el-button @click="treatmentAnalysisPage">治疗分析</el-button>
        <el-button v-if="urlParameter.isModify == 'displayShow' " @click="onBack">编 辑</el-button>
        <!--<el-button @click="onBackCaseManage">返回</el-button>-->
        <el-button type="danger" @click="closePage">关闭</el-button>
      </el-row> 

      <el-dialog
        title="下载"
        :visible.sync="dialogVisibleCLodop"
        width="400px">
        <p>Web打印服务CLodop下载执行安装,安装完成后刷新页面点击打印</p><br/>
        <p style="text-align:center;"><a href='../../../../../../../static/Lodop_Clodop/CLodop_Setup_for_Win32NT.exe' target='_blank' style="color:#de470d;">点击下载执行安装</a></p>
      </el-dialog>
      <div id="pdfDom" style="height: 100%;">
        <div class="container">
          <div class="head_fixed" id="headFixed">
            <h2 class="com_text_align report_title">{{report.reportName}}</h2>
            <!-- <ul>
              <li>
                <span>医疗机构：</span>
                <p></p>
              </li>
              <li>
                <span>姓名：</span>
                <p></p>
              </li>
              <li>
                <span>病案号：</span>
                <p></p>
              </li>
              <li>
                <span>报告流水号：</span>
                <p></p>
              </li>
            </ul> -->
          </div>

          <div class="content" id="content" ref="content">
            <!--v-for="(obj, objIndex) in reportOjb" :key="objIndex"-->
            <div >
              <div class="box" v-for="(item, index) in reportOjb" :key="index">
                <div class="box_title">
                  <el-checkbox v-model="checkedAll">{{item.portionName}}</el-checkbox>
                </div>
                <div v-for="(itemTitle, indexTitle) in item.items" :key="indexTitle" class="box_body">
                  <h3 v-if="JSON.stringify(itemTitle.children) != '[]'"><span v-show="itemTitle.name != item.portionName || item.items.length > 1">{{itemTitle.name}}:</span></h3>
                  <p v-else-if="itemTitle.name != '参考图'" class="indent">
                    <span style="display:inline-block; min-width:120px;">{{itemTitle.name}}：</span>
                    <!-- <img :src="itemTitle.value" style="width: 400px; height: auto;"/> -->
                    <span class="box_underline">{{itemTitle.value}}</span>
                  </p>
                  <ul class="box_cont">
                    <!--单张表格项-->
                    <li v-if="JSON.stringify(itemTitle.children) != '[]' && itemTitle.children[0].name =='row'">
                      <table class="box_table">
                        <thead>
                          <tr>
                            <th v-for="(th,indexTh) in itemTitle.children[0].children" :key="indexTh">{{th.name}}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(tr,indexTr) in itemTitle.children" :key="indexTr">
                            <td v-for="(td,indexTd) in tr.children" :key="indexTd">{{td.value}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    
                    <li class="flex">
                      <div v-for="(itemli, n) in itemTitle.children" :key="n" :style="JSON.stringify(itemli.children) != '[]' && itemli.children[0].name == 'row'?'width:100%;':''">
                        <span class="label" v-if="JSON.stringify(itemli.children) == '[]' && itemli.name != 'row'">{{itemli.name}}：</span>
                        <p class="label-text" v-if="JSON.stringify(itemli.children) == '[]' && itemli.name != 'row'">{{itemli.value?itemli.value.replace(/\|/g,''):''}}</p>
                        <div v-else>
                          <div v-if="JSON.stringify(itemli.children) != '[]' && itemli.children[0].name == 'row'" >
                            <span class="label" style="text-align: left; margin-bottom: 5px;">{{itemli.name}}：</span>
                            <table class="box_table">
                              <thead>
                                <tr>
                                  <th v-for="(th,indexTh) in itemli.children[0].children" :key="indexTh">{{th.name}}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(tr,indexTr) in itemli.children" :key="indexTr">
                                  <td v-for="(td,indexTd) in tr.children" :key="indexTd">{{td.value}}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p v-else-if="itemli.name != 'row'">
                            {{itemli.name}}: 
                            <span v-if="itemli.value">{{itemli.value}} / </span>
                            <span class="text2">
                              <span v-for="(itemliv, nv) in itemli.children" :key="nv"  style="text-align:left;">{{itemliv.name}}:{{itemliv.value}}</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>



<script>
import utils from 'components/utils/domToPDF';
import savaAs from 'file-saver';
import './js/jquery.wordexport'
import { getLodop } from "components/utils/LodopFuncs";
import {printStyle} from "./js/printStyle";
export default {
  name: "report-read",
  props: {
    report: {
      type: Object,
      default:{}
    }
  },
  data() {
    return {    
      reportOjb:{},
      checkedAll:[],
      pdfLoading: false,
      dialogVisibleCLodop: false,
      urlParameter:{}
    }
  },
  created() {
    console.log(this.report)
    if(!this.report){
      this.report = {}
    }else {
      // this.reportOjb = JSON.stringify(this.report) != '{}' && this.report.pages;
      this.reportOjb = JSON.stringify(this.report) != '{}' && this.report.portions;
    }
    this.urlParameter = JSON.parse(localStorage.getItem('reportFill')).urlParameter;
  },
  mounted() {
    this.backTop = document.querySelector('#content');
    this.backTop.addEventListener('scroll', this.handleScroll, true) 
  },
  destroyed() {
    this.backTop.removeEventListener('scroll',this.scrollFunction);
  },
  methods:{
    handleScroll() {
      this.$emit("onBackTop",this.backTop.scrollTop)
    },
    onBack() {
      this.$emit('hideReportRead');
    },
    closePage() {
      let userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Presto") != -1) {
        window.location.replace("about:blank");
      } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
    },
    //跳转到 治疗分析页
    treatmentAnalysisPage() {
      console.log('跳转到治疗 窗口',this.report);
      let url = '?crfId='+this.report.crfId+"&diseaseId="+this.report.diseaseId+"&groupId="+this.report.groupId+"&patientId="+this.report.patientId;
      window.open('./treatmentAnalysis.html'+url);
    },
    //滚动到顶部
    toTop () {
      console.log(this.$refs.content)
      this.$refs.content.scrollTop = 0;
    },
    //下载pdf
    onDownloadPDF() {
      $(".crfConfig").addClass("heightAuto");
      $("#pdfDom").addClass("pdf")
      this.pdfLoading = true;
      let that = this;
      setTimeout(function(){
        utils.domToPDF("#pdfDom", that.report.reportName);
        that.pdfLoading = false;
        $(".crfConfig").removeClass("heightAuto");
        $("#pdfDom").removeClass("pdf")
      },600)
    },
    onBackCaseManage() {
      let backInfo = JSON.parse(localStorage.getItem('caseManage'))
      this.$router.push({
        name:'caseManage',
        query:{
          id:backInfo.id,
          cacheData:backInfo.cacheData
        }
      })
    },
    printReport(){
      const LODOP = getLodop();
      if (!LODOP) {
        //未安装lodop插件则提示用户安装
        this.dialogVisibleCLodop = true;
        return;
      }
      console.log(document.getElementById("pdfDom").innerHTML)

      let strFormHtml =
        printStyle +
        "<body>" +
          document.getElementById("pdfDom").innerHTML +
        "</body>";

      LODOP.PRINT_INIT(""); //初始化
      LODOP.SET_PRINT_PAGESIZE(0, 2100, 2970, "A4");
      // LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4"); //设置横向
      LODOP.ADD_PRINT_HTM("0%", "0%", "100%", "100%", strFormHtml); //设置打印内容
      // LODOP.SET_PREVIEW_WINDOW(2, 0, 0, 800, 600, ""); //设置预览窗口模式和大小
      LODOP.PREVIEW();
    },
    wordExport() {
      // $('#pdfDom').wordExport('test文档')
      var oWD = new ActiveXObject("Word.Application");
      var oDC = oWD.Documents.Add("",0,1);
      var orange =oDC.Range(0,1);
      var sel = document.body.createTextRange();
      sel.moveToElementText(PrintA);
      sel.select();
      sel.execCommand("Copy");
      orange.Paste();
      oWD.Application.Visible = true;
    }
  }  
}
</script>

<style lang="less">
.report_read_view_container {
  padding: 5px 0;
  height: 100%;
  position: relative;
  & > .el-row {
    position: absolute;
    top: 5px;
    right: 5px;
    left: 0;
  }
  .container {
    border: 1px solid #ccc;
    margin: 35px 0 0;
    padding: 0 15px;
    position: relative;
    height: 100%;
    color: #777;
    font-size: 12px;
    position: relative;
    top: 5px;
    .head_fixed {
      height: 85px;
      position: absolute;
      top: 10px;
      right: 10px;
      left: 10px;
      padding: 20px 0;
      border-bottom: 1px solid #ccc;
      background-color: #ffffff;
      &.shadow {
        box-shadow: 0px 0px 3px #333;
      }
      .report_title {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color:#63666E;
        margin-bottom: 10px;
      }
      ul {
        display: flex;
        justify-content: center;
        li {
          padding: 0 15px;
          p {
            display: inline-block;
            position: relative;
            min-width: 140px;
            color: #666;
            &:after {
              content:"";
              position: absolute;
              bottom:0px;
              left:0;
              right:0;
              width:100%;
              background: #ddd;
              height:1px;
            }
          }
        }
      }
    }

    .content {
      overflow:auto;
      position: absolute;
      top: 95px;
      // top: 70px;
      left: 10px;
      right: 10px;
      bottom: 40px;
      .box {
        border: 1px solid #ccc;
        margin-bottom: 15px;
        &:first-child {
          border-top: none;
        }
        .box_title {
          height: 40px;
          line-height: 40px;
          padding: 0 15px;
          background: #F7F8FC;
          & /deep/ .el-checkbox {
            font-weight: bold;
          }
        }
        .box_body {
          padding: 10px 15px;
          /*width: 25%;*/
          display: inline-block;
          h3 {
            font-size: 14px;
            font-weight: normal;
            color: #111;
            margin-bottom: 5px;
          }
          .box_cont {
            padding: 5px 25px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            li {
              display: inline-block;
              padding: 0 25px 15px 0;
              span.label {
                display: inline-block;
                min-width: 140px;
                text-align: right;
              }
              span.label ~ div {
                min-width: 100px;
              }
              p.label-text{
                display: inline-block;
                position: relative;
                min-width: 145px;
                padding-bottom: 3px;
                text-align: center;
                color: #777;
                vertical-align: bottom;
                &:after {
                  content:"";
                  position: absolute;
                  bottom:0px;
                  left:0;
                  right:0;
                  width:100%;
                  background: #ddd;
                  height:1px;
                }
              }
              .text2{
                span {
                  position: relative;
                  min-width: 80px;
                  text-align: center;
                  display: inline-block;
                  margin-right: 25px;
                  padding-bottom: 3px;
                  margin-bottom: 8px;
                  &:after {
                    content:"";
                    position: absolute;
                    bottom:0px;
                    left:0;
                    right:0;
                    width:100%;
                    background: #ddd;
                    height:1px;
                  }
                }
              }
            }
            li.flex {
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              & > div {
                padding: 10px 25px;
              }
            }
          }
        }
      }
    }
    .box_underline {
      display: inline-block;
      position: relative;
      min-width: 200px;
      vertical-align: bottom;
      text-align: center;
      &:after {
        content:"";
        position: absolute;
        bottom:0px;
        left:0;
        right:0;
        width:100%;
        background: #ddd;
        height:1px;
      }
    }
    .indent {
      font-size: 14px;
      color: #444;
    }
  }
  .box_table {
    border: 1px solid #D8DCE4;
    th,td {
      height: 30px;
      min-width: 90px;
      padding: 0 15px;
      text-align: center;
    }
    th {
      position: relative;
      &:last-child:after {
        display: none;
      }
      &:after {
        content:"";
          content:"";
          position: absolute;
          bottom:0px;
          top:0;
          right:0;
          width:1px;
          background: #ddd;
          height:100%;
      }
    }
    td {
      position: relative;
      &:after {
        content:"";
        position: absolute;
        bottom:0px;
        left:0;
        right:0;
        width:100%;
        background: #ddd;
        height:1px;
      }
      &::before {
        content:"";
        position: absolute;
        bottom:0px;
        top:0;
        right:0;
        width:1px;
        background: #ddd;
        height:100%;
      }
      &:last-child:before {
        display: none;
      }
    }
    tr {
      &:last-child {
        td:after {
          display: none;
        }
      }
    }
    th {
      background: #F7F8FC;
    }
    td {
      color: #777;
    }
  }
}
  .crfConfig.heightAuto {
  height: auto !important;
  #pdfDom.pdf {
    height: auto;
    .head_fixed,
    .content {
      position: sticky;
      overflow: visible;
      left:0;
    }
    .content {
      top: 11px;
    }
  }
}
</style>

