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
                                <el-menu-item :index="li.title"><a :href="'#'+item.title">{{li.title}}</a></el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </span>
                </el-menu>
            </div>
            <div class="right">
                <p class="label">文章标题</p>
                <h1 class="text_center">北京地区两家医院儿科重症监护病房486例脓毒症分析</h1>
                <div v-for="(item,index) in menuList" :key="index" :id="item.title">
                    <p class="label">{{item.title}}</p>
                    <el-input type="textarea" v-if="!item.children" :rows="12" :placeholder="'请输入'+item.title" class="text" v-model="item.text"></el-input>
                    <div v-else>
                        <el-input v-for="(li,index) in item.children" :key="index" :id="li.title" type="textarea" v-show="index==0" :rows="12" :placeholder="'请输入'+li.title" class="text" v-model="li.text"></el-input>
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
                { title:'文章标题', text:'目的通过大样本的的瞻性临床研究。了解北京地区儿科重业监护病房(PCU)肤毒应的患病率.病死率.病因和疾病负担以及预后 相关危险因素等。方法2008年11月1曰至209年12月31曰,选取北京地区2家儿童医院的PICU进行调査。对PICU收治的年龄在29d至 18同岁的患儿进行评估，将小儿危重病例评分（PCS丨690分或符合美国PCU人院指南的患H作为PIcU危重病例;在危重病例中,按照脓 毒症诊断标准筛选出全部脓毒症.严重脓毒症和陆毒性休克患儿，收集资料，使用SPSS软件进行数据比较。结果2家医院PICU 14个月 共收治患儿1531例.其中危重病例1250例。陈毒症严重胶毒症，眩毒世休克思儿共486例.死亡55例,PICU内总患病车为魏9% (486/1250),病死奉为11. 3强(55/486);其中脓毒应.严重陈毒业。就毒性休克的患病事分别为25.5% (319/1250) ,10.3% (129/1250) •3.0%<38/1250),病死率分别为229%(7/319) .23.3强(30/129>,47.4%(18/38)〇小于3岁的幼儿占陈毒症患儿总数的陈5强 (367/486)。以弹夫为主(63. 6%。309/486)的呼吸系统疾病是脓毐症最常见感染性原发病(71.8强.349/486丨。细菌所致的感染占脓 毒症有明确病原学患儿的64.1强，其中(T菌和C”菌感染分别占顿1强和39%。PCS评分分值与脓毒症严重程度呈负相关关系(r= -0.583,P<0.01>.眩毒应死亡危险四索为评分Pals分值明显降低和需婴使用机械通气支持治疗。PICU中严重陆毒症和陆毒性休克患儿 人均住院费用分别是危重惠儿的2.3倍和1.3倍。结论然毒症是PICU患病事高的常见病:严重陆毒症/胜毒性休克患儿的病死率高，治疗 费用高:小于3岁的婴幼儿易患病;肺炎等急性呼吸置疾病为主要感染性原发病病原以细南感染为生，其次为病毒感染;PCIS分值明显降 氏及需要使用机械酒气支持治疗是发生死亡的独立危险因素。'},
                { title:'摘要',children:[
                    {title:'中文摘要', text:'儿科重症监护病房;脓毒症;病死率;儿童;临床研究'},
                    {title:'英文摘要', text:''}
                ] },
                { title:'关键字',children:[
                    {title:'中文关键字', text:''},
                    {title:'英文关键字', text:''}
                ] },
                { title:'概述' , text:'眩毒应死亡危险四索为评分Pals分值明显降低和需婴使用机械通气支持治疗。PICU中严重陆毒症和陆毒性休克患儿 人均住院费用分别是危重惠儿的2.3倍和1.3倍。结论然毒症是PICU患病事高的常见病:严重陆毒症/胜毒性休克患儿的病死率高，治疗 费用高:小于3岁的婴幼儿易患病;肺炎等急性呼吸置疾病为主要感染性原发病病原以细南感染为生，其次为病毒感染;PCIS分值明显降 <氏及需要使用机械酒气支持治疗是发生死亡的独立危险因素。;儿童;临床研究'},
                { title:'对象与方法',children:[
                    {title:'病例来源', text:''},
                    {title:'研究方法一', text:''},
                    {title:'研究方法二', text:''},
                    {title:'研究方法三', text:''},
                ] },
                { title:'结果',children:[
                    {title:'结果一', text:''},
                    {title:'结果二', text:''}
                ] },
                { title:'科讨论与问题',children:[
                    {title:'讨论一', text:''},
                    {title:'讨论二', text:''}
                ] },
                { title:'总结展望', text:''},
                { title:'参考文献', text:`[1]张亚卓.努力推动神经外科的创新发展[J].中华神经外科杂志,2019,35(1):1-2. DOI:10.3760/cma.j.issn.1001-2346.2019.01.001.
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




