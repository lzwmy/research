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
                <el-tabs v-model="activeItem">
                    <el-tab-pane v-for="(item, index) in tabsList" :key="index">
                        <p slot="label" @click="selectTab(item,index)" :class="item.isActive?'active':''">{{item[0]}}</p>
                    </el-tab-pane>
                </el-tabs>
                <div class="pagination">{{currentPage}}&nbsp;/&nbsp;{{totalPage}}</div>
            </div>
            
            <div class="aside">
                <div class="top flex-between-center">
                    <p class="label">实体关系分析</p>
                    <div class="btn-group">
                        <span :class="activeBtn==0?'active':''" @click ="selectBtn(0)">本地分析</span>
                        <span :class="activeBtn==1?'active':''" @click ="selectBtn(1)">热点分析</span>
                    </div>
                </div>
                <div class="content">
                    <div class="li flex-between-center" v-for="(item,index) in 30" :key="index">
                        <p>1、发病年龄-生存时间>5年</p>
                        <span>50例</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import chartCom from './chart'
import utils from 'components/utils/index';

export default {
    name: 'knowledgeChart',
    data () {
        return {
            loading: false,
            tabsList: [],
            selectTabsList: [],
            activeBtn: 0,
            activeItem: '',
            currentPage: 1,
            totalPage: 1,
            tabTotalWidth: 0,  //tab总长度
            tabBoxWidth: 0,    //tab一页显示长度
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
                            enabled: true,
                        },
                        data:[]
                    }
                ],
                credits: {
                    enabled:false
                }
            },
        }
    },
    components: {
        chartCom
    },
    computed: {
        handldTabsList: function() {
            return this.arrRemoveRepeat(this.tabsList);
        }
    },
    created() {
        this.getChartData();
    },
    mounted() {
        this.$nextTick(()=>{
            $('.item-group').on('click','.el-tabs__nav-prev', this.prevArrowsClick)
            $('.item-group').on('click','.el-tabs__nav-next', this.nextArrowsClick)
        })
        window.onresize = this.computeTabs;
    },
    destroyed() {
        window.onresize = null;
    },
    methods: {
        computeTabs() {
            this.$nextTick(()=>{
                setTimeout(()=>{
                    this.tabBoxWidth = $('.item-group').width();
                    let width = 0;
                    Array.from($('.el-tabs__item')).forEach(ele=>{
                        width += $(ele).outerWidth(true);
                    })
                    this.tabTotalWidth = width;
                    this.tabBoxWidth = $('.el-tabs__nav-wrap.is-scrollable').width() || this.tabTotalWidth;
                    this.totalPage = Math.ceil(this.tabTotalWidth/this.tabBoxWidth)
                },1000)
            })
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
                    
                    this.tabsList = utils.deepCopy(res.data.data);
                    this.tabsList.forEach((li)=>{
                        li.isActive = true;
                    })
                    this.tabsList = this.arrRemoveRepeat(this.tabsList);

                    this.selectTabsList = utils.deepCopy(res.data.data)
                    this.computeTabs();
                }
            } catch (err) {
                console.log(err)
            }
            this.loading = false;
        },
        //选择类目
        selectTab(item,index) {
            this.$set(this.tabsList, index, Object.assign(
                this.tabsList[index],{isActive:!item.isActive}
            ))
            //置灰的类目
            let tabsListFallow = this.tabsList.filter((li)=>{
                return !li.isActive;
            })
            
            
            this.chartOption.series[0].data = this.handleTabsListActive(tabsListFallow, utils.deepCopy(this.selectTabsList));;
            this.$refs.chartsRef.updated();
        },
        handleTabsListActive(tabsListFallow,selectTabsList) {
            console.log(tabsListFallow)
            console.log(selectTabsList)
            for(let i = 0; i < tabsListFallow.length; i++) {
                for(let j = 0; j < selectTabsList.length; j++) {
                    if(tabsListFallow[i][0] == selectTabsList[j][0]) {
                        selectTabsList.splice(j,1)
                        j--;
                    }else if(tabsListFallow[i][1] == selectTabsList[j][0]) {
                        selectTabsList.splice(j,1)
                        j--;
                    }
                }
            }
            console.log(selectTabsList)
            return selectTabsList;
        },
        arrRemoveRepeat(arr) {
            let result = []
            let obj = {}
            for (let i of arr) {
                if (!obj[i[0]]) {
                    result.push(i)
                    obj[i[0]] = 1
                }
            }
            return result
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
        },
        //点击分析按钮
        selectBtn(val) {
            this.activeBtn = val;
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
                border: 1px dashed #555;
                position: absolute;
                top: 15px;
                left: 15px;
                right: 435px;
                bottom: 40px;
                padding: 15px;
            }
            .item-group {
                position: absolute;
                left: 15px;
                right: 435px;
                bottom: 1px;
                height: 39px;
                .el-tabs {
                    height: 40px;
                    overflow: hidden;
                    .el-tabs__nav-wrap {
                        padding: 0 70px 0 0;
                        &::after {
                            display: none;
                        }
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
                    .el-tabs__item {
                        padding: 0;
                        p {
                            padding: 0 15px 0 27px;
                            user-select: none;
                            cursor: pointer;
                            position: relative;
                            color:#999;
                            &::before {
                                content: '';
                                position: absolute;
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                background-color: #999;
                                left: 10px;
                                top: 50%;
                                transform: translateY(-50%);
                            }
                            &.active {
                                color: #333;
                                &::before { 
                                    background-color: #333;
                                }
                            }
                        } 
                        
                    }
                    .el-tabs__active-bar {
                        display: none;
                    }
                }
                .pagination {
                    position: absolute;
                    right: 23px;
                    bottom: 14px;
                }
            }
        }
        .aside {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 420px;
            overflow: auto;
            border-left:1px solid rgba(229,235,236,1);
            .top {
                height: 66px;
                padding: 0 20px;
                border-bottom:1px solid rgba(216,216,216,1);
                .label {
                    font-size: 16px;
                    font-weight: bold;
                    color: #394263;
                }
                .btn-group {
                    font-size: 0;
                    span {
                        cursor: pointer;
                        font-size: 14px;
                        display: inline-block;
                        width: 84px;
                        height: 36px;
                        line-height: 36px;
                        text-align: center;
                        color: #1BBAE1;
                        border:1px solid rgba(27,186,225,1);
                        &.active {
                            background:rgba(27,186,225,1);
                            color: #fff;
                        }
                    }

                }
            }
            .content {
                position: absolute;
                top: 66px;
                right: 0;
                bottom: 0;
                width: 420px;
                overflow: auto;
                .li {
                    padding: 0 23px;
                    height: 48px;
                    font-size:14px;
                    color:rgba(57,66,99,1);
                    background-color: #fff;
                    &:nth-child(2n-1) {
                        background:#F5F7FA;
                    }
                    p {
                        flex:1;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    span {
                        min-width: 56px;
                        height: 26px;
                        color: #394263;
                        text-align: center;
                        line-height: 26px;
                        background:rgba(243,243,250,1);
                        border:1px solid rgba(229,235,236,1);
                        border-radius:2px;
                    }
                }
            }
        }
        
    }
</style>


