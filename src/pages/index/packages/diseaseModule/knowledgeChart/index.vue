<template>
    <div class="cloud-component knowledgeChart">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer" >
                <span class="icon-hover el-icon el-icon-s-tools" @click="$router.push({path:'/treeCustom',query: {id:$route.query.id}})"></span>
            </div>
        </div>
        <!--搜索结果-->
        <div class="cloud-search-list" v-loading='loading'>
            <div class="chart-warp">
                <chartCom ref="chartsRef" :option="chartOption"></chartCom>
            </div>
            <div class="item-group">
                <el-tabs v-model="activeItem" @tab-click="handleClick">
                    <el-tab-pane v-for="(item, index) in 30" :key="index" :label="item+'治疗方案'" :name="String(item)"></el-tab-pane>
                </el-tabs>
                <div class="pagination">{{currentPage}}&nbsp;/&nbsp;{{totalPage}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import chartCom from './chart'
export default {
    name: 'knowledgeChart',
    data () {
        return {
            loading: false,
            chartOption: {
                chart: {
                    type: 'networkgraph',
                    margin: [0],
                    spacingBottom: 0
                },
                title: {
                    text: ''
                },
                tooltip: {
                    borderColor: null,
                },
                plotOptions: {
                    networkgraph: {
                        keys: ['from', 'to'],
                        layoutAlgorithm: {
                            enableSimulation: true
                        }
                    }
                },
                series: [
                    {
                        dataLabels: {
                            enabled: true
                        },
                        data:[
                            ['Proto Indo-European', 'Balto-Slavic'],
                            ['Proto Indo-European', 'Germanic'],
                            ['Proto Indo-European', 'Celtic'],
                            ['Proto Indo-European', 'Italic'],
                            ['Proto Indo-European', 'Hellenic'],
                            ['Proto Indo-European', 'Anatolian'],
                            ['Proto Indo-European', 'Indo-Iranian'],
                            ['Proto Indo-European', 'Tocharian'],
                            // ['Indo-Iranian', 'Dardic'],
                            // ['Indo-Iranian', 'Indic'],
                            // ['Indo-Iranian', 'Iranian'],
                            // ['Iranian', 'Old Persian'],
                            // ['Old Persian', 'Middle Persian'],
                            // ['Indic', 'Sanskrit'],
                            // ['Italic', 'Osco-Umbrian'],
                            // ['Italic', 'Latino-Faliscan'],
                            // ['Latino-Faliscan', 'Latin'],
                            // ['Celtic', 'Brythonic'],
                            // ['Celtic', 'Goidelic'],
                            // ['Germanic', 'North Germanic'],
                            // ['Germanic', 'West Germanic'],
                            // ['Germanic', 'East Germanic'],
                            // ['North Germanic', 'Old Norse'],
                            // ['North Germanic', 'Old Swedish'],
                            // ['North Germanic', 'Old Danish'],
                            // ['West Germanic', 'Old English'],
                            // ['West Germanic', 'Old Frisian'],
                            // ['West Germanic', 'Old Dutch'],
                            // ['West Germanic', 'Old Low German'],
                            // ['West Germanic', 'Old High German'],
                            // ['Old Norse', 'Old Icelandic'],
                            // ['Old Norse', 'Old Norwegian'],
                            // ['Old Norwegian', 'Middle Norwegian'],
                            // ['Old Swedish', 'Middle Swedish'],
                            // ['Old Danish', 'Middle Danish'],
                            // ['Old English', 'Middle English'],
                            // ['Old Dutch', 'Middle Dutch'],
                            // ['Old Low German', 'Middle Low German'],
                            // ['Old High German', 'Middle High German'],
                            // ['Balto-Slavic', 'Baltic'],
                            // ['Balto-Slavic', 'Slavic'],
                            // ['Slavic', 'East Slavic'],
                            // ['Slavic', 'West Slavic'],
                            // ['Slavic', 'South Slavic'],
                            // // Leaves:
                            // ['Proto Indo-European', 'Phrygian'],
                            // ['Proto Indo-European', 'Armenian'],
                            // ['Proto Indo-European', 'Albanian'],
                            // ['Proto Indo-European', 'Thracian'],
                            // ['Tocharian', 'Tocharian A'],
                            // ['Tocharian', 'Tocharian B'],
                            // ['Anatolian', 'Hittite'],
                            // ['Anatolian', 'Palaic'],
                            // ['Anatolian', 'Luwic'],
                            // ['Anatolian', 'Lydian'],
                            // ['Iranian', 'Balochi'],
                            // ['Iranian', 'Kurdish'],
                            // ['Iranian', 'Pashto'],
                            // ['Iranian', 'Sogdian'],
                            // ['Old Persian', 'Pahlavi'],
                            // ['Middle Persian', 'Persian'],
                            // ['Hellenic', 'Greek'],
                            // ['Dardic', 'Dard'],
                            // ['Sanskrit', 'Sindhi'],
                            // ['Sanskrit', 'Romani'],
                            // ['Sanskrit', 'Urdu'],
                            // ['Sanskrit', 'Hindi'],
                            // ['Sanskrit', 'Bihari'],
                            // ['Sanskrit', 'Assamese'],
                            // ['Sanskrit', 'Bengali'],
                            // ['Sanskrit', 'Marathi'],
                            // ['Sanskrit', 'Gujarati'],
                            // ['Sanskrit', 'Punjabi'],
                            // ['Sanskrit', 'Sinhalese'],
                            // ['Osco-Umbrian', 'Umbrian'],
                            // ['Osco-Umbrian', 'Oscan'],
                            // ['Latino-Faliscan', 'Faliscan'],
                            // ['Latin', 'Portugese'],
                            // ['Latin', 'Spanish'],
                            // ['Latin', 'French'],
                            // ['Latin', 'Romanian'],
                            // ['Latin', 'Italian'],
                            // ['Latin', 'Catalan'],
                            // ['Latin', 'Franco-Provençal'],
                            // ['Latin', 'Rhaeto-Romance'],
                            // ['Brythonic', 'Welsh'],
                            // ['Brythonic', 'Breton'],
                            // ['Brythonic', 'Cornish'],
                            // ['Brythonic', 'Cuymbric'],
                            // ['Goidelic', 'Modern Irish'],
                            // ['Goidelic', 'Scottish Gaelic'],
                            // ['Goidelic', 'Manx'],
                            // ['East Germanic', 'Gothic'],
                            // ['Middle Low German', 'Low German'],
                            // ['Middle High German', '(High) German'],
                            // ['Middle High German', 'Yiddish'],
                            // ['Middle English', 'English'],
                            // ['Middle Dutch', 'Hollandic'],
                            // ['Middle Dutch', 'Flemish'],
                            // ['Middle Dutch', 'Dutch'],
                            // ['Middle Dutch', 'Limburgish'],
                            // ['Middle Dutch', 'Brabantian'],
                            // ['Middle Dutch', 'Rhinelandic'],
                            // ['Old Frisian', 'Frisian'],
                            // ['Middle Danish', 'Danish'],
                            // ['Middle Swedish', 'Swedish'],
                            // ['Middle Norwegian', 'Norwegian'],
                            // ['Old Norse', 'Faroese'],
                            // ['Old Icelandic', 'Icelandic'],
                            // ['Baltic', 'Old Prussian'],
                            // ['Baltic', 'Lithuanian'],
                            // ['Baltic', 'Latvian'],
                            // ['West Slavic', 'Polish'],
                            // ['West Slavic', 'Slovak'],
                            // ['West Slavic', 'Czech'],
                            // ['West Slavic', 'Wendish'],
                            // ['East Slavic', 'Bulgarian'],
                            // ['East Slavic', 'Old Church Slavonic'],
                            // ['East Slavic', 'Macedonian'],
                            // ['East Slavic', 'Serbo-Croatian'],
                            // ['East Slavic', 'Slovene'],
                            // ['South Slavic', 'Russian'],
                            // ['South Slavic', 'Ukrainian'],
                            // ['South Slavic', 'Belarusian'],
                            // ['South Slavic', 'Rusyn']
                        ]
                    }
                ],
                credits: {
                    enabled:false
                }
            },
            activeItem: '',
            currentPage: 1,
            totalPage: 3,
            tabTotalWidth: null,
        }
    },
    components: {
        chartCom
    },
    created() {
        this.getChartData();
    },
    mounted() {
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.computeTabsWidth();
                this.tabWidth = document.querySelector('.el-tabs__nav')
                let prev_arrows = document.querySelector('.el-tabs__nav-prev')
                let next_arrows = document.querySelector('.el-tabs__nav-next')
                console.log(prev_arrows)
                prev_arrows.addEventListener('click',this.prevArrowsClick)
                next_arrows.addEventListener('click',this.nextArrowsClick)
            },2000)
        })
    },
    methods: {
        computeTabsWidth() {
            let width = 0;
            Array.from($('.el-tabs__item')).forEach(ele=>{
                width += $(ele).outerWidth(true);
            })
            this.tabTotalWidth = width;
        },
        async getChartData() {
            this.loading = true;
            let formData = {
                diseaseId: this.$route.query.id
            }
            try {
                let res = await this.$http.KCgetChartOption(formData);
                if (res.code == 0) {
                    this.chartOption.series[0].data = res.data.data;
                    this.$refs.chartsRef.updated();
                    console.log(this.chartOption)
                }
            } catch (err) {
                console.log(err)
            }
            this.loading = false;
        },
        handleClick(tab) {
            console.log(tab)
        },
        //点击上一页
        prevArrowsClick() {
            if(this.currentPage == 1) {
                document.querySelector('.el-tabs__nav-prev').classList.add('disabled');
                return
            }else {
                document.querySelector('.el-tabs__nav-prev').classList.remove('disabled');
                this.currentPage --;
            }
        },
        //点击下一页
        nextArrowsClick() {
            if(this.currentPage == this.totalPage) {
                document.querySelector('.el-tabs__nav-next').classList.add('disabled');
                return
            }else {
                document.querySelector('.el-tabs__nav-next').classList.remove('disabled');
                this.currentPage ++;
            }
        }
    },
};
</script>

<style lang="less">
    .arrows {
        font-size: 24px;
        color: #333;
    }
    .knowledgeChart {
        .cloud-search-list {
            position: absolute;
            top: 75px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            background-color: #fff;
            padding: 15px;
            overflow: auto;
            .chart-warp {
                border: 1px solid #555;
                position: absolute;
                top: 15px;
                left: 15px;
                right: 300px;
                bottom: 40px;
                padding: 15px;
            }
            .item-group {
                border: 1px solid #555;
                position: absolute;
                left: 15px;
                right: 300px;
                bottom: 0;
                height: 40px;
                .el-tabs {
                    height: 40px;
                    overflow: hidden;
                    .el-tabs__nav-wrap {
                        padding: 0 70px 0 0;
                    }
                    .el-tabs__nav-prev {
                        left: auto;
                        right: 50px;
                        .el-icon-arrow-left {
                            .arrows();
                            &::before {
                                content: "\e792";
                            }
                        }
                    }
                    .el-icon-arrow-right {
                        .arrows();
                        &::before {
                            content: "\e791";
                        }
                    }
                    .el-tabs__nav-prev {
                        
                    }
                    .el-tabs__nav-next {

                    }
                }
                .pagination {
                    position: absolute;
                    right: 23px;
                    bottom: 14px;
                }
            }
        }
        
    }
</style>


