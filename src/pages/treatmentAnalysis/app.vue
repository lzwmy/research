<template>
    <div class="treatment_analysis_container">
      <div class="treatment_header">
        <span>治疗分析</span>
        <span style="float: right;cursor: pointer;font-weight: normal;">X</span>
      </div>
      <div class="treatment_nav">
        <span>显示治疗评语</span>
        <el-switch v-model="showTreatmentComment"></el-switch>
        <el-button type="primary">分析设置</el-button>
        <el-button>保存为模型</el-button>
      </div>
      <div class="treatment_body">
        <!--v-for="(item,index) in report" :index="index" :key="index"-->
        <!--<card-cloumn  :item="report[0]"  :displayName="name"></card-cloumn>-->
        <!--<card-cloumn v-for="(item,index) in report"  :item="item" :index="index" :key="index" :displayName="show"></card-cloumn>-->
        <!--患者报告-->
        <default-com :reportName="currentStructureInfo" :commentState="showTreatmentComment"></default-com>
        <!--患者报告对于信息-->
        <!--v-for="(patientInfoItem,patientInfoIndex) in report"-->
        <display-patient-info :item="report" :report="currentStructureInfo" :commentState="showTreatmentComment"></display-patient-info>
      </div>
      <!--分析设置页面-->
      <el-drawer title="分析设置" :visible.sync="showDrawer">

      </el-drawer>
    </div>
</template>

<script>
  import cardColumn from './cardColumn';
  import defaultCom from './basicCom/defaultCom';
  import displayPatientInfo from './displayPatientInfo/displayPatientInfo';
  import currentPatientInfo from './currentPatinetInfo/currentPatinetInfo';
  import {GetRequest} from './util';
  export default {
    components:{
      cardColumn,
      defaultCom,
      displayPatientInfo,
      currentPatientInfo
    },
    data() {
      return {
        showTreatmentComment:"",//显示治疗评语
        name:'name',
        show:'value',
        urlParameter:GetRequest(), // url 链接参数
        showDrawer:true,
        crfSearchList:[],//关联表单查询
        //当前患者数据
        currentStructureInfo:{},
        currentPatientData:[
          {"id":"2c9780826c42d0e2016c42fed1490011","groupId":"2c9780826be104f9016be3c4cb59003c","reportName":"银屑病报告","crfId":"4028813c6bde802e016bdf2467680068","patientId":"4403110070000653840","pages":[{"pageName":"首页","portions":[{"portionName":"首页","items":[{"name":"首页","value":"","children":[{"name":"就诊类型","value":"普通门诊","children":[]},{"name":"门诊号","value":"5376365","children":[]},{"name":"病人号","value":"64656456","children":[]},{"name":"就诊年龄","value":"34|岁","children":[]},{"name":"就诊日期","value":"2019-07-01 00:00:00","children":[]},{"name":"就诊科室","value":"皮肤科","children":[]},{"name":"医生姓名","value":"张医生","children":[]},{"name":"临床诊断","value":"病因诊断","children":[]},{"name":"诊断描述","value":"","children":[]},{"name":"初次就诊时间","value":"2019-07-02","children":[]},{"name":"末次就诊时间","value":"2019-07-22","children":[]}]}]},{"portionName":"基本信息","items":[{"name":"基本信息","value":"","children":[{"name":"姓名","value":"王华见","children":[]},{"name":"性别","value":"男","children":[]},{"name":"出生日期","value":"1985-02-04 08:00:00","children":[]},{"name":"身份证号","value":"4403110070000653840","children":[]},{"name":"联系电话","value":"15312344321","children":[]},{"name":"籍贯","value":"广西省","children":[]},{"name":"现住址","value":"深圳市南山区","children":[]},{"name":"职业","value":"员工","children":[]}]}]},{"portionName":"病史信息","items":[{"name":"病史信息","value":"","children":[{"name":"发病年龄","value":"30岁","children":[]},{"name":"病程","value":"4|岁","children":[]},{"name":"皮疹首发部位","value":"头皮|面部","children":[]},{"name":"皮炎特点","value":"鳞屑性斑块|丘疹","children":[]},{"name":"关节症状","value":"晨僵|关节痛","children":[]},{"name":"诱发因素","value":"药物|感染","children":[]}]},{"name":"既往史","value":"","children":[{"name":"既往史","value":"","children":[{"name":"描述","value":"","children":[]}]},{"name":"现病史","value":"","children":[{"name":"描述","value":"","children":[]}]},{"name":"家族史","value":"","children":[{"name":"描述","value":"","children":[]}]},{"name":"过敏史","value":"","children":[{"name":"描述","value":"","children":[]}]},{"name":"外院用药史","value":"","children":[{"name":"用药史","value":"","children":[]},{"name":"外用药","value":"","children":[]},{"name":"生物制剂","value":"","children":[]}]},{"name":"外院其他治疗","value":"","children":[{"name":"描述","value":"","children":[]}]}]},{"name":"生理习惯及心理状态","value":"","children":[{"name":"饮酒","value":"有","children":[{"name":"饮酒频率","value":"2|次/月    ","children":[]},{"name":"饮酒频率2","value":"2|次/周","children":[]}]},{"name":"吸烟","value":"有","children":[{"name":"吸烟频率","value":"4|支/天","children":[]},{"name":"吸烟史","value":"12|年    ","children":[]}]},{"name":"压力悲伤","value":"","children":[]}]}]},{"portionName":"实验室检查","items":[{"name":"血常规","value":"","children":[{"name":"检查时间","value":"2019-07-03 00:00:00","children":[]},{"name":"白细胞总数WBC","value":"3|×10^9个/L    ","children":[]},{"name":"淋巴细胞总数","value":"3|×10^9个/L    ","children":[]},{"name":"中性粒细胞数","value":"3|×10^9个/L    ","children":[]},{"name":"血小板总数PLT","value":"3|×10^9个/L    ","children":[]},{"name":"血小板平均体积MPV","value":"3|fL    ","children":[]},{"name":"红细胞分布宽度RDW","value":"3|%    ","children":[]},{"name":"中性粒细胞淋巴细胞比值","value":"3|%    ","children":[]},{"name":"血小板淋巴细胞比值","value":"3|%    ","children":[]}]},{"name":"血生化","value":"","children":[{"name":"三酰甘油TG","value":"43","children":[]},{"name":"胆固醇CHOL","value":"54","children":[]},{"name":"高密度脂蛋白HDL-c","value":"4","children":[]},{"name":"低密度脂蛋白HDL-c","value":"53","children":[]},{"name":"空腹血糖","value":"44","children":[]},{"name":"糖化血红蛋白","value":"43","children":[]},{"name":"血尿酸","value":"4","children":[]},{"name":"血肌酐CRP","value":"32","children":[]},{"name":"红细胞沉降率（ESR）","value":"4","children":[]},{"name":"类风湿因子（RF）","value":"42","children":[]},{"name":"ASO","value":"43","children":[]},{"name":"ANA","value":"43","children":[]},{"name":"抗-CCP","value":"43","children":[]},{"name":"HLA-B*27","value":"4","children":[]}]},{"name":"尿常规","value":"","children":[{"name":"尿蛋白","value":"23","children":[]}]}]},{"portionName":"药物治疗","items":[{"name":"药物治疗","value":"","children":[{"name":"row","value":"","children":[{"name":"药物名称","value":"阿维A","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]},{"name":"row","value":"","children":[{"name":"药物名称","value":"甲氨蝶呤","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]},{"name":"row","value":"","children":[{"name":"药物名称","value":"环孢素","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]},{"name":"row","value":"","children":[{"name":"药物名称","value":"秋水仙碱","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]},{"name":"row","value":"","children":[{"name":"药物名称","value":"来氟米特","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]},{"name":"row","value":"","children":[{"name":"药物名称","value":"布洛芬","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]},{"name":"row","value":"","children":[{"name":"药物名称","value":"塞来昔布","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"剂量","value":"6","children":[]},{"name":"单位","value":"盒","children":[]},{"name":"结束时间","value":"2019-07-16","children":[]},{"name":"累计时间","value":"10","children":[]}]}]},{"name":"药品治疗","value":"","children":[{"name":"row","value":"","children":[{"name":"药名","value":"英夫利昔单抗","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"用量","value":"4","children":[]},{"name":"次数","value":"5","children":[]},{"name":"频率","value":"一日三次","children":[]}]},{"name":"row","value":"","children":[{"name":"药名","value":"阿达木单抗","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"用量","value":"4","children":[]},{"name":"次数","value":"5","children":[]},{"name":"频率","value":"一日三次","children":[]}]},{"name":"row","value":"","children":[{"name":"药名","value":"注射用重组人II型瘤坏，死因子受体抗体融合蛋白","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"用量","value":"4","children":[]},{"name":"次数","value":"5","children":[]},{"name":"频率","value":"一日三次","children":[]}]},{"name":"row","value":"","children":[{"name":"药名","value":"司库奇尤单抗","children":[]},{"name":"起用时间","value":"2019-07-06","children":[]},{"name":"用量","value":"4","children":[]},{"name":"次数","value":"5","children":[]},{"name":"频率","value":"一日三次","children":[]}]}]}]},{"portionName":"皮损面积和严重程度指数（PASI）","items":[{"name":"参考图","value":"","children":[]},{"name":"受损面积","value":"","children":[{"name":"头/颈","value":"10-29%","children":[]},{"name":"躯干","value":"10-29%","children":[]},{"name":"上肢","value":"10-29%","children":[]},{"name":"下肢","value":"10-29%","children":[]}]},{"name":"严重程度指数","value":"","children":[{"name":"红斑","value":"重度","children":[]},{"name":"浸润","value":"中度","children":[]},{"name":"脱屑","value":"中度","children":[]}]},{"name":"各部位PASI得分计算公式","value":"","children":[{"name":"PASI（头部）=0.1（红斑+浸润+脱屑）x  皮损面积","value":"2","children":[]},{"name":"PASI（上肢）=0.1（红斑+浸润+脱屑）x  皮损面积","value":"32","children":[]},{"name":"PASI（躯干）=0.1（红斑+浸润+脱屑）x  皮损面积","value":"22","children":[]},{"name":"PASI（下肢）=0.1（红斑+浸润+脱屑）x  皮损面积","value":"2","children":[]}]}]},{"portionName":"随访","items":[{"name":"随访时间","value":"2019-07-31","children":[]},{"name":"是否按时用药","value":"是","children":[]},{"name":"有无不良反应","value":"无","children":[{"name":"描述","value":"","children":[]}]},{"name":"病情是否好转","value":"是","children":[]},{"name":"皮肤目前情况","value":"良好","children":[]}]}]}],"diseaseId":"7D366F4C2FAC558DE0535F27CC0A9B84","diseaseName":"银屑病","subjectId":"2c9780826be104f9016be3c492f1003a","subjectName":"银屑病关键病历管理","groupName":"银屑病实验组","patientName":"王华见","genderName":"男","age":"34岁","phoneNumber":null,"createTime":"2019-07-30 21:08:11"}],
        //动态卡片对比
        report:[

          {
            "patientName": "陈双梅",
            "treatmentStatus": "TODO",
            "treatmentTxtComment": "治疗评语",
            "report": {
              "id": "2c9780826c42d0e2016c42e0a5630006",
              "groupId": "2c9780826be104f9016be3c4cb59003c",
              "reportName": "银屑病报告",
              "crfId": "4028813c6bde802e016bdf2467680068",
              "patientId": "4403110040335938",
              "pages": [
                {
                  "pageName": "首页",
                  "portions": [
                    {
                      "portionName": "首页",
                      "items": [
                        {
                          "name": "首页",
                          "value": "",
                          "children": [
                            {
                              "name": "就诊类型",
                              "value": "专家门诊",
                              "children": []
                            },
                            {
                              "name": "门诊号",
                              "value": "435353453",
                              "children": []
                            },
                            {
                              "name": "病人号",
                              "value": "3543535",
                              "children": []
                            },
                            {
                              "name": "就诊年龄",
                              "value": "52|岁",
                              "children": []
                            },
                            {
                              "name": "就诊日期",
                              "value": "2019-07-16 00:00:00",
                              "children": []
                            },
                            {
                              "name": "就诊科室",
                              "value": "皮肤科",
                              "children": []
                            },
                            {
                              "name": "医生姓名",
                              "value": "张医生",
                              "children": []
                            },
                            {
                              "name": "临床诊断",
                              "value": "病因诊断",
                              "children": []
                            },
                            {
                              "name": "诊断描述",
                              "value": "皮肤病",
                              "children": []
                            },
                            {
                              "name": "初次就诊时间",
                              "value": "2019-07-15",
                              "children": []
                            },
                            {
                              "name": "末次就诊时间",
                              "value": "2019-07-29",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "基本信息",
                      "items": [
                        {
                          "name": "基本信息",
                          "value": "",
                          "children": [
                            {
                              "name": "姓名",
                              "value": "陈双梅",
                              "children": []
                            },
                            {
                              "name": "性别",
                              "value": "女",
                              "children": []
                            },
                            {
                              "name": "出生日期",
                              "value": "1967-03-05 08:00:00",
                              "children": []
                            },
                            {
                              "name": "身份证号",
                              "value": "432927196703058128",
                              "children": []
                            },
                            {
                              "name": "联系电话",
                              "value": "13245543454",
                              "children": []
                            },
                            {
                              "name": "籍贯",
                              "value": "湖北省",
                              "children": []
                            },
                            {
                              "name": "现住址",
                              "value": "深圳市罗湖区",
                              "children": []
                            },
                            {
                              "name": "职业",
                              "value": "员工",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "病史信息",
                      "items": [
                        {
                          "name": "病史信息",
                          "value": "",
                          "children": [
                            {
                              "name": "发病年龄",
                              "value": "45岁",
                              "children": []
                            },
                            {
                              "name": "病程",
                              "value": "7|岁",
                              "children": []
                            },
                            {
                              "name": "皮疹首发部位",
                              "value": "头皮|面部",
                              "children": []
                            },
                            {
                              "name": "皮炎特点",
                              "value": "鳞屑性斑块",
                              "children": []
                            },
                            {
                              "name": "关节症状",
                              "value": "畸形",
                              "children": []
                            },
                            {
                              "name": "诱发因素",
                              "value": "药物|感染",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "既往史",
                          "value": "",
                          "children": [
                            {
                              "name": "既往史",
                              "value": "",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "现病史",
                              "value": "有",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "银屑病",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "家族史",
                              "value": "",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "过敏史",
                              "value": "",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "外院用药史",
                              "value": "无",
                              "children": [
                                {
                                  "name": "用药史",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "外用药",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "生物制剂",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "外院其他治疗",
                              "value": "有",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "name": "生理习惯及心理状态",
                          "value": "",
                          "children": [
                            {
                              "name": "饮酒",
                              "value": "有",
                              "children": [
                                {
                                  "name": "饮酒频率",
                                  "value": "1|次/月    ",
                                  "children": []
                                },
                                {
                                  "name": "饮酒频率2",
                                  "value": "3|次/周",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "吸烟",
                              "value": "",
                              "children": [
                                {
                                  "name": "吸烟频率",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "吸烟史",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "压力悲伤",
                              "value": "",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "实验室检查",
                      "items": [
                        {
                          "name": "血常规",
                          "value": "",
                          "children": [
                            {
                              "name": "检查时间",
                              "value": "2019-07-01 00:00:00",
                              "children": []
                            },
                            {
                              "name": "白细胞总数WBC",
                              "value": "2|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "淋巴细胞总数",
                              "value": "23|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "中性粒细胞数",
                              "value": "3|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "血小板总数PLT",
                              "value": "23|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "血小板平均体积MPV",
                              "value": "23|fL    ",
                              "children": []
                            },
                            {
                              "name": "红细胞分布宽度RDW",
                              "value": "3|%    ",
                              "children": []
                            },
                            {
                              "name": "中性粒细胞淋巴细胞比值",
                              "value": "3|%    ",
                              "children": []
                            },
                            {
                              "name": "血小板淋巴细胞比值",
                              "value": "2|%    ",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "血生化",
                          "value": "",
                          "children": [
                            {
                              "name": "三酰甘油TG",
                              "value": "67",
                              "children": []
                            },
                            {
                              "name": "胆固醇CHOL",
                              "value": "7",
                              "children": []
                            },
                            {
                              "name": "高密度脂蛋白HDL-c",
                              "value": "5",
                              "children": []
                            },
                            {
                              "name": "低密度脂蛋白HDL-c",
                              "value": "75",
                              "children": []
                            },
                            {
                              "name": "空腹血糖",
                              "value": "65",
                              "children": []
                            },
                            {
                              "name": "糖化血红蛋白",
                              "value": "6",
                              "children": []
                            },
                            {
                              "name": "血尿酸",
                              "value": "7",
                              "children": []
                            },
                            {
                              "name": "血肌酐CRP",
                              "value": "46",
                              "children": []
                            },
                            {
                              "name": "红细胞沉降率（ESR）",
                              "value": "6",
                              "children": []
                            },
                            {
                              "name": "类风湿因子（RF）",
                              "value": "75",
                              "children": []
                            },
                            {
                              "name": "ASO",
                              "value": "65",
                              "children": []
                            },
                            {
                              "name": "ANA",
                              "value": "46",
                              "children": []
                            },
                            {
                              "name": "抗-CCP",
                              "value": "64",
                              "children": []
                            },
                            {
                              "name": "HLA-B*27",
                              "value": "6",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "尿常规",
                          "value": "",
                          "children": [
                            {
                              "name": "尿蛋白",
                              "value": "46",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "药物治疗",
                      "items": [
                        {
                          "name": "药物治疗",
                          "value": "",
                          "children": [
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "阿维A",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "甲氨蝶呤",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "环孢素",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "秋水仙碱",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "来氟米特",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "布洛芬",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "塞来昔布",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-29",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "name": "药品治疗",
                          "value": "",
                          "children": [
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药名",
                                  "value": "英夫利昔单抗",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "用量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "次数",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "频率",
                                  "value": "一次三日",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药名",
                                  "value": "阿达木单抗",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "用量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "次数",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "频率",
                                  "value": "一次三日",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药名",
                                  "value": "注射用重组人II型瘤坏，死因子受体抗体融合蛋白",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "用量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "次数",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "频率",
                                  "value": "一次三日",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药名",
                                  "value": "司库奇尤单抗",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019-07-19",
                                  "children": []
                                },
                                {
                                  "name": "用量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "次数",
                                  "value": "4",
                                  "children": []
                                },
                                {
                                  "name": "频率",
                                  "value": "一次三日",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "皮损面积和严重程度指数（PASI）",
                      "items": [
                        {
                          "name": "参考图",
                          "value": "",
                          "children": []
                        },
                        {
                          "name": "受损面积",
                          "value": "",
                          "children": [
                            {
                              "name": "头/颈",
                              "value": "30-49%",
                              "children": []
                            },
                            {
                              "name": "躯干",
                              "value": "10-29%",
                              "children": []
                            },
                            {
                              "name": "上肢",
                              "value": "30-49%",
                              "children": []
                            },
                            {
                              "name": "下肢",
                              "value": "70-89%",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "严重程度指数",
                          "value": "",
                          "children": [
                            {
                              "name": "红斑",
                              "value": "中度",
                              "children": []
                            },
                            {
                              "name": "浸润",
                              "value": "无症状",
                              "children": []
                            },
                            {
                              "name": "脱屑",
                              "value": "轻度",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "各部位PASI得分计算公式",
                          "value": "",
                          "children": [
                            {
                              "name": "PASI（头部）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "3",
                              "children": []
                            },
                            {
                              "name": "PASI（上肢）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "4",
                              "children": []
                            },
                            {
                              "name": "PASI（躯干）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "4",
                              "children": []
                            },
                            {
                              "name": "PASI（下肢）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "4",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "随访",
                      "items": [
                        {
                          "name": "随访时间",
                          "value": "2019-07-31",
                          "children": []
                        },
                        {
                          "name": "是否按时用药",
                          "value": "是",
                          "children": []
                        },
                        {
                          "name": "有无不良反应",
                          "value": "无",
                          "children": [
                            {
                              "name": "描述",
                              "value": "",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "病情是否好转",
                          "value": "是",
                          "children": []
                        },
                        {
                          "name": "皮肤目前情况",
                          "value": "有所好转",
                          "children": []
                        }
                      ]
                    }
                  ]
                }
              ],
              "diseaseId": "7D366F4C2FAC558DE0535F27CC0A9B84",
              "diseaseName": "银屑病",
              "subjectId": "2c9780826be104f9016be3c492f1003a",
              "subjectName": "银屑病关键病历管理",
              "groupName": "银屑病实验组",
              "patientName": "陈双梅",
              "genderName": "女",
              "age": "52岁",
              "phoneNumber": null,
              "createTime": "2019-07-30 20:35:14"
            },
            "relationReport": []
          },
          {
            "patientName": "俞子欣",
            "treatmentStatus": "HEAL",
            "treatmentTxtComment": "治疗评语1",
            "report": {
              "id": "402881416c43239f016c433de6540003",
              "groupId": "2c9780826be104f9016be3c4cb59003c",
              "reportName": "银屑病报告",
              "crfId": "4028813c6bde802e016bdf2467680068",
              "patientId": "4403110070000725300",
              "pages": [
                {
                  "pageName": "首页",
                  "portions": [
                    {
                      "portionName": "首页",
                      "items": [
                        {
                          "name": "首页",
                          "value": "",
                          "children": [
                            {
                              "name": "就诊类型",
                              "value": "专家门诊",
                              "children": []
                            },
                            {
                              "name": "门诊号",
                              "value": "90012",
                              "children": []
                            },
                            {
                              "name": "病人号",
                              "value": "90013",
                              "children": []
                            },
                            {
                              "name": "就诊年龄",
                              "value": "17|岁",
                              "children": []
                            },
                            {
                              "name": "就诊日期",
                              "value": "2019-07-01 00:00:00",
                              "children": []
                            },
                            {
                              "name": "就诊科室",
                              "value": "皮肤科",
                              "children": []
                            },
                            {
                              "name": "医生姓名",
                              "value": "卫健智能",
                              "children": []
                            },
                            {
                              "name": "临床诊断",
                              "value": "病因诊断",
                              "children": []
                            },
                            {
                              "name": "诊断描述",
                              "value": "病因诊断",
                              "children": []
                            },
                            {
                              "name": "初次就诊时间",
                              "value": "2019-07-01",
                              "children": []
                            },
                            {
                              "name": "末次就诊时间",
                              "value": "2019-07-03",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "基本信息",
                      "items": [
                        {
                          "name": "基本信息",
                          "value": "",
                          "children": [
                            {
                              "name": "姓名",
                              "value": "俞子欣",
                              "children": []
                            },
                            {
                              "name": "性别",
                              "value": "女",
                              "children": []
                            },
                            {
                              "name": "出生日期",
                              "value": "2002-05-11 08:00:00",
                              "children": []
                            },
                            {
                              "name": "身份证号",
                              "value": "4403110070000725300",
                              "children": []
                            },
                            {
                              "name": "联系电话",
                              "value": "15733102516",
                              "children": []
                            },
                            {
                              "name": "籍贯",
                              "value": "湖北",
                              "children": []
                            },
                            {
                              "name": "现住址",
                              "value": "深圳市南山区",
                              "children": []
                            },
                            {
                              "name": "职业",
                              "value": "学生",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "病史信息",
                      "items": [
                        {
                          "name": "病史信息",
                          "value": "",
                          "children": [
                            {
                              "name": "发病年龄",
                              "value": "17",
                              "children": []
                            },
                            {
                              "name": "病程",
                              "value": "10|天",
                              "children": []
                            },
                            {
                              "name": "皮疹首发部位",
                              "value": "头皮",
                              "children": []
                            },
                            {
                              "name": "皮炎特点",
                              "value": "红斑",
                              "children": []
                            },
                            {
                              "name": "关节症状",
                              "value": "",
                              "children": []
                            },
                            {
                              "name": "诱发因素",
                              "value": "饮食",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "既往史",
                          "value": "",
                          "children": [
                            {
                              "name": "既往史",
                              "value": "无",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "现病史",
                              "value": "无",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "家族史",
                              "value": "无",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "过敏史",
                              "value": "无",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "外院用药史",
                              "value": "无",
                              "children": [
                                {
                                  "name": "用药史",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "外用药",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "生物制剂",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "外院其他治疗",
                              "value": "无",
                              "children": [
                                {
                                  "name": "描述",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "name": "生理习惯及心理状态",
                          "value": "",
                          "children": [
                            {
                              "name": "饮酒",
                              "value": "无",
                              "children": [
                                {
                                  "name": "饮酒频率",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "饮酒频率2",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "吸烟",
                              "value": "无",
                              "children": [
                                {
                                  "name": "吸烟频率",
                                  "value": "",
                                  "children": []
                                },
                                {
                                  "name": "吸烟史",
                                  "value": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "压力悲伤",
                              "value": "无压力",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "实验室检查",
                      "items": [
                        {
                          "name": "血常规",
                          "value": "",
                          "children": [
                            {
                              "name": "检查时间",
                              "value": "2019-07-01 00:00:00",
                              "children": []
                            },
                            {
                              "name": "白细胞总数WBC",
                              "value": "2.1|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "淋巴细胞总数",
                              "value": "2.4|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "中性粒细胞数",
                              "value": "34|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "血小板总数PLT",
                              "value": "12|×10^9个/L    ",
                              "children": []
                            },
                            {
                              "name": "血小板平均体积MPV",
                              "value": "2.5|fL    ",
                              "children": []
                            },
                            {
                              "name": "红细胞分布宽度RDW",
                              "value": "16|%    ",
                              "children": []
                            },
                            {
                              "name": "中性粒细胞淋巴细胞比值",
                              "value": "2|%    ",
                              "children": []
                            },
                            {
                              "name": "血小板淋巴细胞比值",
                              "value": "12|%    ",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "血生化",
                          "value": "",
                          "children": [
                            {
                              "name": "三酰甘油TG",
                              "value": "2.5",
                              "children": []
                            },
                            {
                              "name": "胆固醇CHOL",
                              "value": "2.3",
                              "children": []
                            },
                            {
                              "name": "高密度脂蛋白HDL-c",
                              "value": "6.2",
                              "children": []
                            },
                            {
                              "name": "低密度脂蛋白HDL-c",
                              "value": "3.1",
                              "children": []
                            },
                            {
                              "name": "空腹血糖",
                              "value": "3.4",
                              "children": []
                            },
                            {
                              "name": "糖化血红蛋白",
                              "value": "7",
                              "children": []
                            },
                            {
                              "name": "血尿酸",
                              "value": "3",
                              "children": []
                            },
                            {
                              "name": "血肌酐CRP",
                              "value": "5.3",
                              "children": []
                            },
                            {
                              "name": "红细胞沉降率（ESR）",
                              "value": "2.1",
                              "children": []
                            },
                            {
                              "name": "类风湿因子（RF）",
                              "value": "1.12",
                              "children": []
                            },
                            {
                              "name": "ASO",
                              "value": "2.5",
                              "children": []
                            },
                            {
                              "name": "ANA",
                              "value": "5.4",
                              "children": []
                            },
                            {
                              "name": "抗-CCP",
                              "value": "3.1",
                              "children": []
                            },
                            {
                              "name": "HLA-B*27",
                              "value": "9.7",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "尿常规",
                          "value": "",
                          "children": [
                            {
                              "name": "尿蛋白",
                              "value": "无",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "药物治疗",
                      "items": [
                        {
                          "name": "药物治疗",
                          "value": "",
                          "children": [
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "秋水仙碱",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019年7月1日",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "支",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-10",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10天",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "甲氨蝶呤",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019年7月1日",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-10",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10天",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药物名称",
                                  "value": "布洛芬",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019年7月1日",
                                  "children": []
                                },
                                {
                                  "name": "剂量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "单位",
                                  "value": "盒",
                                  "children": []
                                },
                                {
                                  "name": "结束时间",
                                  "value": "2019-07-10",
                                  "children": []
                                },
                                {
                                  "name": "累计时间",
                                  "value": "10天",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "name": "药品治疗",
                          "value": "",
                          "children": [
                            {
                              "name": "row",
                              "value": "",
                              "children": [
                                {
                                  "name": "药名",
                                  "value": "阿达木单抗",
                                  "children": []
                                },
                                {
                                  "name": "起用时间",
                                  "value": "2019年7月1日",
                                  "children": []
                                },
                                {
                                  "name": "用量",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "次数",
                                  "value": "3",
                                  "children": []
                                },
                                {
                                  "name": "频率",
                                  "value": "一天一次",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "皮损面积和严重程度指数（PASI）",
                      "items": [
                        {
                          "name": "参考图",
                          "value": "",
                          "children": []
                        },
                        {
                          "name": "受损面积",
                          "value": "",
                          "children": [
                            {
                              "name": "头/颈",
                              "value": "0%",
                              "children": []
                            },
                            {
                              "name": "躯干",
                              "value": "<10%",
                              "children": []
                            },
                            {
                              "name": "上肢",
                              "value": "0%",
                              "children": []
                            },
                            {
                              "name": "下肢",
                              "value": "0%",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "严重程度指数",
                          "value": "",
                          "children": [
                            {
                              "name": "红斑",
                              "value": "无症状",
                              "children": []
                            },
                            {
                              "name": "浸润",
                              "value": "无症状",
                              "children": []
                            },
                            {
                              "name": "脱屑",
                              "value": "轻度",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "各部位PASI得分计算公式",
                          "value": "",
                          "children": [
                            {
                              "name": "PASI（头部）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "13",
                              "children": []
                            },
                            {
                              "name": "PASI（上肢）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "14",
                              "children": []
                            },
                            {
                              "name": "PASI（躯干）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "21",
                              "children": []
                            },
                            {
                              "name": "PASI（下肢）=0.1（红斑+浸润+脱屑）x  皮损面积",
                              "value": "12",
                              "children": []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "portionName": "随访",
                      "items": [
                        {
                          "name": "随访时间",
                          "value": "2019-07-16",
                          "children": []
                        },
                        {
                          "name": "是否按时用药",
                          "value": "是",
                          "children": []
                        },
                        {
                          "name": "有无不良反应",
                          "value": "无",
                          "children": [
                            {
                              "name": "描述",
                              "value": "",
                              "children": []
                            }
                          ]
                        },
                        {
                          "name": "病情是否好转",
                          "value": "是",
                          "children": []
                        },
                        {
                          "name": "皮肤目前情况",
                          "value": "痊愈",
                          "children": []
                        }
                      ]
                    }
                  ]
                }
              ],
              "diseaseId": "7D366F4C2FAC558DE0535F27CC0A9B84",
              "diseaseName": "银屑病",
              "subjectId": "2c9780826be104f9016be3c492f1003a",
              "subjectName": "银屑病关键病历管理",
              "groupName": "银屑病实验组",
              "patientName": "俞子欣",
              "genderName": "女",
              "age": "17岁",
              "phoneNumber": null,
              "createTime": "2019-07-30 22:17:05"
            },
            "relationReport": null
          }
        ]
      }
    },
    methods:{


      resize() {
        $(".crffill").height($(window).height()-10);
        $(".crf-main").height($(window).height()-10);
        // $(".binding-box").max-height($(window).height()-160);
      },
      // 获取当前患者报告
      async crfReportDetailPreview() {
        let that = this;
        let formData = {
          formCrfId:"4028813c6bde802e016bdf2467680068"
        };
        try {
          let data = await that.$http.crfReportDetailPreview(formData);
          if(data.code==0) {
            this.currentStructureInfo = data.data;
          }
        }catch (error) {
          console.log(error)
        }
      },
      //获取当前患者 报告数据
      async reportFindReport() {
        let that = this;
        let formData = {
          reportId:"2c9780826c42d0e2016c42fed1490011"
        };
        try {
          let data = await that.$http.reportFindReport(formData);
          if(data.code == 0) {
            this.currentPatientData = [data.data];
          }
        }catch (error) {
          console.log(error)
        }
      },
      //获取表单查询条件
      async modelQuerySearchCrf() {
        let that = this;
        let formData={
          "crfIsAvailable": 1,
          "diseaseId": this.urlParameter.diseaseId
        };
        try {
          let data = await that.$http.modelQuerySearchCrf(formData);
          console.log(data);
          if(data.code == 0) {
            this.crfSearchList = data.data;
          }
        }catch (error) {
          console.log(error)
        }
      },
      async queryReportList() {
        let that = this;
        let formData = {
          "patientId": "string",
          "diseaseId": "string",
          "crfList": [],
          'queryItem':[],
        };
        try {
          let data = await that.$http.queryReportList(formData);
          console.log(data)
        }catch (error) {
          console.log(error)
        }
      }
    },
    mounted() {
      this.crfReportDetailPreview();
      this.reportFindReport();
      console.log(this.urlParameter);
      this.modelQuerySearchCrf();
    }
  }
</script>

<style lang="less" scoped>
  .treatment_analysis_container{
    .treatment_header{
      height: 68px;
      line-height: 68px;
      font-size: 20px;
      padding: 0 20px;
      background:rgba(73,139,244,1);
      box-shadow:0 3px 6px rgba(0,0,0,0.16);
      color: #ffffff;
      font-weight:bold;
      overflow: hidden;
    }
    .treatment_nav{
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      overflow: hidden;
      border-bottom:1px solid #8D8D8D;
      span{
        vertical-align: middle;
      }
      .el-button{
        float: right;
        margin: 0 5px;
        transform: translate(0,50%);

      }
    }
    .treatment_body{
      padding: 40px 20px 0 20px ;
      height: 780px;
      overflow: auto;

    }
  }

</style>
