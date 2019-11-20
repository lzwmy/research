<template>
    <div class="cloud-component articlesEmbellish">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button icon="icon iconfont iconzujian35" @click="">生成</el-button>
                <el-button type="primary" icon="icon iconfont iconzujian34" @click="">Word下载</el-button>
            </div>
        </div>
        <div class="articlesEmbellish_content flex-start-start">
            <div class="left">
                <el-menu
                    default-active="1"
                    ref="refMenu"
                    :default-openeds="defaultOpeneds"
                    class="el-menu-vertical-demo">
                    <span v-for="(item, index) in menuList" :key="index">
                        <el-menu-item :index="item.title" v-if="!item.children">
                            <i class="icon iconfont iconzujian33"></i>
                            <span slot="title"><a :href="'#'+item.title" class="title">{{item.title}}</a></span>
                        </el-menu-item>
                        <el-submenu :index="item.title" v-else>
                            <template slot="title">
                                <i class="icon iconfont iconzujian33"></i>
                                <span class="title">{{item.title}}</span>
                            </template>
                            <el-menu-item-group v-for="(li, liIndex) in item.children" :key="liIndex">
                                <el-menu-item :index="li.title"><a style="display:inline-block;width:100%;" :href="'#'+item.title">{{li.title}}</a></el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </span>
                </el-menu>
            </div>
            <div class="right">
                <div v-for="(item,index) in menuList" :key="index" :id="item.title">
                    <p class="label">{{item.title}}</p>
                    <h1 v-if="item.title=='文章标题'" class="text_center">{{item.text}}</h1>
                    <el-input type="textarea" v-else-if="!item.children" :rows="item.rows" :placeholder="'请输入'+item.title" class="text" v-model="item.text"></el-input>
                    <div v-if="item.children">
                        <span v-for="(li,index) in item.children" :key="index">
                            <p class="label2">{{li.title}}</p>
                            <el-input  :id="li.title" type="textarea"  :rows="li.rows" :placeholder="'请输入'+li.title" class="text" v-model="li.text"></el-input>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'articlesEmbellish',
    data () {
        return {
            defaultOpeneds: [],
            menuList: [
                { title:'文章标题', text:`北京地区两家医院儿科重症监护病房486例脓毒症分析`},
                { title:'摘要',children:[
                    {title:'中文摘要',rows: 12, text:'目的通过大样本的的瞻性临床研究。了解北京地区儿科重业监护病房(PCU)肤毒应的患病率.病死率.病因和疾病负担以及预后相关危险因素等。方法2008年11月1 日至209年12月31日,选取北京地区2家儿童医院的PICU进行调查。对PICU收治的年龄在29d至18同岁的患儿进行评估,将小儿危重病例评分( PCS) 690分或符合美国PCU人院指南的患儿作为PIcU危重病例;在危重病例中,按照脓毒症诊断标准筛选出全部脓毒症.严重脓毒症和陆毒性休克患儿,收集资料,使用SPSS软件进行数据比较。结果2 家医院PICU 14个月共收治患儿1531例.其中危重病例1250例。陈毒症严重胶毒症,眩毒世休克思儿共486例.死亡55例,PICU内总患病车为魏9%(486/1250) ,病死奉为11. 3强(55/486);其中脓毒应.严重陈毒业。就毒性休克的患病事分别为25. 5% (319/1250) ,10. 3% (129/1250) .3.0% (38/1250) ,病死率分别为2 29% (7/319) .23. 3强(30/129),47.4%(18/38)。小于3岁的幼儿占陈毒症患儿总数的陈5强(367/486)。 以弹夫为主(63. 6%。309/486)的呼吸系统疾病是脓毒症最常见感染性原发病(71.8强.349/486)。细菌所致的感染占脓毒症有明确病原学患儿的64.1强,其中C*菌和C"菌感染分别占顿1强和39%。PCS评分分值与脓毒症严重程度呈负相关关系(r= -0.583,P <0.01).眩毒应死亡危险四索为评分PaIs分值明显降低和需婴使用机械通气支持治疗。PICU中严重陆毒症和陆毒性休克患儿人均住院费用分别是危重惠儿的2.3倍和1.3倍。结论然毒症是 PICU患病事高的常见病:严重陆毒症/胜毒性休克患儿的病死率高,治疗费用高:小于3岁的婴幼儿易患病;肺炎等急性呼吸置疾病为主要感染性原发病病原以细南感染为生,其次为病毒感染;PCIS分值明显降低及需要使用机械酒气支持治疗是发生死亡的独立危险因素。'},
                    {title:'英文摘要',rows: 12, text:`Objective To investigate the incidence，mortality，causes and risk factors of sepsis in children in pediatric intensive care units(PICU)in Beijing through large sample prospective clinical research.Methods From 1 st November 2008 to 3 1 st December 2009.all patients aged from 29 days to 1 8 years admitted to PICU of the two children’S hospitals in Beiiing were surveyed.Patients who met the conditions of Chinese pediatric critical illness score(PCIS)<90 or American guidelines for PICU admission were defined as critically ill cases.According to the definitions of sepsis of 2005 international pediatric sepsis consensus conference and 2006 Chinese Medical Association meeting，sepsis，sever sepsis，and septic shock cases were selected from these critically ill patients.The qualified SHbiects were surveyed by questionnaire until discharge or death the data were analyzed by SPSS.Results A total of 1531 of PICU admissions were enrolled within a 14.month period，of whom 1250 met the criteria of critically i11 case:486 developed sepsis.of whom 55 died.The morbidity of sepsis for all in critically i11 patients in PICU was 38.9%(486/1250)and the mortality was 11.3%(55/486).The norbidity of sepsis.severe sepsis and septic shock ifl these PICU was 25.5%(319/1250)，10.3%(129/1250)。3.O%(38/1250)and the mortality was 2.2%(7/319)，23.3%(30/129)，and47.4%(18/38)，respectively.The proportion of less than 3 years old was 75.5%(367/486).Respiratory system diseases(71.8%)，such as pneumonia (63.6%)，were the underlying primary infectious diseases of sepsis.Bacterial etiology accounted for 64.1%of the cases with sepsis with definite etiological test results.The proportion of gram—positive bacteria and gram—negative bacteria were 46.1%and 53.9%.respectively.PCIS and disease severity were negatively correlated(r=一0.583，P<0.01).Multiple stepwise logistic regression analysis showed that depressedPCISanduseofmechanicalventilationweretheriskfactorsfordeath.Averagemedicalcostsper patient in PICU with severe sepsis and septic shock were 2.3 times and 1.3 t`}
                ] },
                { title:'关键字',children:[
                    {title:'中文关键字',rows: 4, text:`儿科重症监护病房; 脓毒症; 病死率; 儿童; 临床研究`},
                    {title:'英文关键字',rows: 4, text:'diatricintensivecare unit; Sepsis; Mortality; Children; Clinicalresearch'}
                ] },
                { title:'概述',rows: 12, text:'眩毒应死亡危险四索为评分Pals分值明显降低和需婴使用机械通气支持治疗。PICU中严重陆毒症和陆毒性休克患儿 人均住院费用分别是危重惠儿的2.3倍和1.3倍。结论然毒症是PICU患病事高的常见病:严重陆毒症/胜毒性休克患儿的病死率高，治疗 费用高:小于3岁的婴幼儿易患病;肺炎等急性呼吸置疾病为主要感染性原发病病原以细南感染为生，其次为病毒感染;PCIS分值明显降 <氏及需要使用机械酒气支持治疗是发生死亡的独立危险因素。;儿童;临床研究'},
                { title:'对象与方法',children:[
                    {title:'病例来源',rows: 6, text:'2008年11月1日至2009年12月31日，选取 检验。对经单因素分析有意义的死亡危险因素采用北京地区具有完备儿科重症监护病房(PICU)建制 Binary—Logistic回归分析，同时采用Hosmer— 的2家市级三级甲等儿童医院进行调查。'},
                    {title:'研究方法一',rows: 12, text:'病例纳人标准:应用小儿危重评分(PCS)用对PICU收治的年龄在29 d-18周岁患儿进行评分。凡评分≤90分者,视为危重病例;同时参照美国PICU人出院指南门.将评分>90分但符合美国PICU人出院指南者亦纳人危重病例,两者合计作为同期脓毒症在PICU患病率及病死率的计算基数。'},
                    {title:'研究方法二',rows: 12, text:'收集临床资料:采用描述性流行病学调查方法,对全部病例进行个案前腾性资料收集。每天为PICU新收治患儿做出评估.按照标准筛选出危重患儿及脓毒症患儿,24 h内填写统- -的脓赤症调查表。'},
                    {title:'研究方法三',rows: 12, text:`脓毒症诊断:按照2005年国际儿科脓毒症联席会议制订并发表的小儿脓毒症及严重脓毒症标准进行诊断'”.脓毒性休克标准采用中华医学会儿科分会急救学组和急诊分会儿科学组2006年颁布的“儿科感染性休克(脓毒性休克)诊疗推荐方案” 进行诊断。`},
                    {title:'研究方法四',rows: 12, text:`病剔除标准:1年龄<29 d和>18岁;@PCIS 评分>90分或不符合美国PICU入出院指南的患 儿;3因外科手术后机体内环境不稳定或全麻后延 迟拔管等原因转入PICU，停留时间小于24 h的患 儿;4患有遗传代谢性疾病患儿。例纳人标准:应用小儿危重评分(PCS)用对PICU收治的年龄在29 d-18周岁患儿进行评分。凡评分≤90分者,视为危重病例;同时参照美国PICU人出院指南门.将评分>90分但符合美国PICU人出院指南者亦纳人危重病例,两者合计作为同期脓毒症在PICU患病率及病死率的计算基数。`},
                    {title:'研究方法五',rows: 12, text:`统计学分析:使用SPSS 17.0软件进行统计学分析。计量数据均先进行正态分布检验,其中正态分布数据以均数土标准差(工出s)表示,采用Suden's t检验比较组间差异;偏态分布数据以中位数( median).百分位数( percentile)表示，使用Mann-Whiney检验比较组间差异。计数资料以率和构成比表示，组间比较采用独立样本Chi-square检验。对经单因素分析有意义的死亡危险因素采用Binary-Logistic回归分析,同时采用Hosmer-Lemeshow法来检验模型预测的不良预后频数与观察值问差异.P>0.05为两者差异无统计学意义,模型报合度佳;采用受试者曲线( ROC)评价模型的预测效能”。P<0.05 为差异有统计学意义.P <0.01为差异有足著统计学意义。`},
                ] },
                { title:'结果',children:[
                    {title:'结果一',rows: 12, text:`北京地区2家儿童医院的PICU 14个月共收治 患儿1531例，符合PCIS≤90分者823例，评分>90 分，符合美国PICU人院标准病例427例，两者合计 危重患儿1250例，占PICU总收治患儿的81.7%、 (1250/1531)，其中内科疾病1150例(92.0%)，外 科疾病100例(8.0%)。危重患儿院内死亡88例， 放弃治疗后72 h内死亡46例，总病死率为10.7% (134/1250)。`},
                    {title:'结果二',rows: 12, text:`PICU患病事和病死率情况:1250例危重症病例中，共发生脓毒症.严重脓毒症，脓毒性休克486例,总患病率为38. 9% (486/1250)，其中脓毒症319例,占65. 6% (319/486) ,严重脓毒症129例,占26. 5% ( 129/486) ,脓毒性休克38例,占7.8%(38/486),患病率分别为25. 5% (319/1250). 10. 39%(129/1250)和3. 0% (38/1250)。严重脓毒症和脓毒性休克患儿总计167例，两者合计患病率为13. 4% (167/1250)。486 例中男性293例占60.3%，女性193例占39. 7% ,各组病例均男多于女。全部脓毒症患儿共死亡s5例(放弃治疗后72 h内死亡者计人死亡病例总数),总病死率为11.3% (55/486).男性为9.9% ,女性为13.5% ,差异无统计学意义(x2 =1.479,P>0.05 );随着病情的加重,病死率逐渐上升,分别为2.2% .23.3% 和47.4%,差异有显著统计学意义(x =94.005,P<0.01)。严重脓毒症和脓毒性休克患儿共死亡48例，合计病死率为28. 7% (48/167).均显著高于脓毒症组(x2 =53.776和106.400,P均<0.01)(表1,2)。
167例严重脓毒症和脓毒性休克忠儿中,放弃治疗、自动出院54例,自动出院率32.3%,主要原因包括原发病难以控制(占44.4%) .经济因素(占40.7%) .其他(占14.%)。486例脓毒症患儿的平均PCIS为(87.6+9.5)分,三组比较差异有统计学意义(F=112.431,P<0.001) ;随着病情加重，PCIS運渐下降，分值水平与疾病严重程度星显著负相关关系(Spearman相关系数r= -0.583,P<0.01) (表1)。`}
                ] },
                { title:'讨论与问题',children:[
                    {title:'讨论一',rows: 16, text:`PICU内脓毒症患病率和病死率情况
两家儿童医院PICU内的脓毒症、严重脓毒症 和脓毒症休克的患病率分别为25.5%，10.3%， 3.0%。严重脓毒症的患病率与国内单中心调查结果较为一致 ̈o，高于Leclerc(3.0%)和Wolfler 较高且不能得到很好控制的重要原因。 (1.6%)的报道‘1引，脓毒症休克患病率与Leclerc 四、脓毒症病原学感染特征 (3.0%)和Wolfler(2.1%)接近。考虑可能与研究纳入的人群范围不同、两家PICU较多收治由外院 转来的病情偏重的危重患儿有关。本研究中，PICU内严重脓毒症、脓毒性休克的 PICU病死率分别为23.3%，47.4%，与国内的调查 结果较为一致 ̈o(30.8%)。与国际比较，低于1997 年法国/加拿大调查(35%和67%)，和2005年意大 利调查结果接近(17.7%和50.8%)I 21考虑除与纳 入研究人群、病情程度有关外，还可能与患儿的家庭 经济状况相关。本研究中，32.3%的严重脓毒症和 脓毒性休克患儿自动出院，其中40.7%是因家庭经 济困难的原因而放弃治疗。
`},
                    {title:'讨论二',rows: 12, text:`脓毒症年龄特点
本研究显示，PICU中75.5%的脓毒症患儿为 小于3岁的幼儿，随着年龄的增长，患病比例逐渐下 Hosmer—Lemeshow拟合优度检验结果显示，模 降，6岁以上儿童发病只占0~18岁儿童的13.8%，显 型预测的脓毒症死亡与观察组差异无统计学意义 示PICU中年龄小的患儿易患脓毒症。在按年龄死亡
95篷高信
分组上，29~364 d脓毒症患儿236例，死亡28例，病死 率为11.9%，与美国同年龄组患儿死亡率(13.5%)基 本一致。9。。各年龄组患儿的死亡率无显著差异。`},
                    {title:'讨论三',rows: 12, text:`脓毒症感染性原发病构成
本研究中，脓毒症感染性疾病的来源主要有呼 吸、神经、消化、泌尿系统等。呼吸系统感染所占的 比例最大(71.8%)，神经系统感染次之(9.5%)，然 后依次为消化、血液、泌尿等。其中，脓毒症最常见 的感染性原发病为肺炎(63.6%)，该比例高于国内 均日住院费用分别是危重患儿的1.5倍和1.4倍; 外成人报道(18.6%~22.6%)及美国儿童报道
8.疾病经济负担:严重脓毒症患儿住院时间、 住PICU时间均明显长于危重患儿、脓毒症和脓毒 性休克患儿(P值均<0.01)，(表10)。
住院费用，严重脓毒症和脓毒性休克患儿的人 均住院费用分别是危重患儿的2.3倍和1.3倍，人
严重脓毒症的人均住院费用是脓毒性休克患儿 1.7倍(表10)。`}
                ] },
                { title:'总结展望',rows: 12, text:`本研究显示，脓毒症在PICU中患病率高，严重 脓毒症、脓毒性休克患儿病死率高和治疗费用高;小 于3岁的婴幼儿易发生;肺炎等急性呼吸道感染疾 病为脓毒症最主要的感染性原发病;病原以细菌感 染为主;PCIS分值明显降低及需要使用机械通气支 持治疗是发生脓毒症死亡的独立危险因素。`},
                { title:'参考文献',rows: 12, text:`[1]张亚卓.努力推动神经外科的创新发展[J].中华神经外科杂志,2019,35(1):1-2. DOI:10.3760/cma.j.issn.1001-2346.2019.01.001.
[2]信息动态[J].中华神经外科杂志,2019,35(1):2,33,50,55,62,66,69,72,102,107-108.
[3]于炎冰.痉挛状态的外科治疗[J].中华神经外科杂志,2019,35(1):3-5. DOI:10.3760/cma.j.issn.1001-2346.2019.01.002.
[4]刘红举,于炎冰,任鸿翔, 等.改良Foerster-Dandy手术治疗痉挛性斜颈的长期随访结果(附550例报告)[J].中华神经外科杂志,2019,35(1):6-9. DOI:10.3760/cma.j.issn.1001-2346.2019.01.003.
[5]范世莹,孟凡刚,张凯, 等.脑深部电刺激术治疗痉挛性斜颈[J].中华神经外科杂志,2019,35(1):10-15. DOI:10.3760/cma.j.issn.1001-2346.2019.01.004.
[6]桑林,郑重,解飞, 等.痉挛型脑性瘫痪患者腰骶段选择性脊神经后根部分切断术的并发症分析[J].中华神经外科杂志,2019,35(1):16-19. DOI:10.3760/cma.j.issn.1001-2346.2019.01.005.
[7]张传鹏,张黎,许骏, 等.痉挛型脑性瘫痪患儿改良腰骶段选择性脊神经后根切断术后脊柱稳定性的随访观察[J].中华神经外科杂志,2019,35(1):20-24. DOI:10.3760/cma.j.issn.1001-2346.2019.01.006.
[8]王世杰,陈业涛,苗素华, 等.周围神经选择性部分切断术治疗脑性瘫痪肢体痉挛[J].中华神经外科杂志,2019,35(1):25-29. DOI:10.3760/cma.j.issn.1001-2346.2019.01.007.
[9]许骏,张黎,徐晓利, 等.改良颈动脉外膜交感神经切除术治疗以发作性痉挛为主要表现的抽动障碍[J].中华神经外科杂志,2019,35(1):30-33. DOI:10.3760/cma.j.issn.1001-2346.2019.01.008.
[10]郭壮丽,汤乃苏,伊传建, 等.超声引导下肉毒毒素注射治疗下肢痉挛状态的表面肌电分析[J].中华神经外科杂志,2019,35(1):34-38. DOI:10.3760/cma.j.issn.1001-2346.2019.01.009.`},
            ]
        }
    },
    created() {
        this.menuList.forEach(item => {
            this.defaultOpeneds.push(item.title)
        });
    },
    components: {
        
    },
    methods: {
        
    }
}
</script>

<style lang="less">
    .articlesEmbellish_content {
        height: 100%;
        .left {
            width: 200px;
            height: 100%;
            margin-right: 20px;
            padding: 6px 0;
            background-color: #fff;
            .el-menu {
                height: 100%;
                border: none;
                overflow-y: auto;
                overflow-x: hidden;
                .el-menu--inline {
                    overflow: hidden;
                    // display: block !important;
                }
                .el-menu-item.is-active {
                    color: #333;
                }
                .el-menu-item,
                .el-submenu__title {
                    line-height: 36px;
                    height: 36px;
                    .icon,
                    .title {
                        color: #1bbae1;
                    }
                }
                .el-menu-item-group__title {
                    display: none;
                }
                .el-submenu__icon-arrow::before{
                    content: '\e790'
                }
            }
        }
        .right {
            flex: 1;
            overflow-y: auto;
            height: 100%;
            padding: 0 18px 18px 18px;
            background-color: #fff;
            .label {
                font-size: 14px;
                font-weight: bold;
                padding-top: 18px;
                margin-bottom: 14px;
                color:#394263;
            }
            .label2 {
                font-size: 13px;
                margin-bottom: 12px;
                color:#394263;
            }
            h1 {
                font-size: 22px;
                font-weight:400;
                line-height:50px;
                color:rgba(57,66,99,1);
            }
            .text {
                font-size:14px;
                line-height:22px;
                color:rgba(57,66,99,1);
                margin-bottom: 40px;
            }
        }
    }
</style>




