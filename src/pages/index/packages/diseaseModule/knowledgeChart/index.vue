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
            <div class="chart-warp" v-if="showHighchart">
                <chartCom ref="chartsRef"  :option="chartOption" @sendColorArr="getColorArr"></chartCom>
                <!-- <chartCom ref="chartsRef" :option="chartOption"></chartCom> -->
            </div>

            <div class="item-group">
                <el-tabs v-model="activeItem">
                    <el-tab-pane v-for="(item, index) in displayTabsList" :key="index">
                        <p slot="label" @click="selectTab(item,index)" :class="item.isActive?'active':''">
                            <i :style="'background-color:'+item.color"></i>
                            {{item[0]}}
                        </p>
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
                <el-input
                    placeholder="请输入"
                    prefix-icon="el-icon-search"
                    v-model="keyword"
                    clearable>
                </el-input>
                <div class="content" v-loading="asideLoading">
                    <div class="li flex-between-center" v-for="(item,index) in filterAnalysisData" :key="index">
                        <p>{{index + 1}}、{{item.parentNodeName}} > {{item.nodeName}}</p>
                        <span>{{item.count}}例</span>
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
            asideLoading: false,
            keyword: '',
            displayTabsList: [],
            allTabsList: [],
            analysisData:[],
            allAnalysisData:[],
            activeBtn: 0,
            activeItem: '',
            currentPage: 1,
            showHighchart: false,
            totalPage: 1,
            tabTotalWidth: 0,  //tab总长度
            tabBoxWidth: 0,    //tab一页显示长度
            chartOption: {
                chart: {
                    type: 'networkgraph',
                    margin: [0],
                    spacingBottom: 0,
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
                        color: '#1bbae1',
                        layoutAlgorithm: {
                            enableSimulation: true
                        },
                        
                    }
                },
                series: [
                    {
                        dataLabels: {
                            enabled: true,
                            linkFormat: '',   
                            format: '{point.name}'
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
    computed: {
        diseaseId: function() {
            return this.$store.state.user.diseaseInfo.diseaseId;
        },
        filterAnalysisData() {
            return this.analysisData.filter(li=>{
                return (li.parentNodeName.toLowerCase().indexOf(this.keyword.toLowerCase()) != -1 || li.nodeName.toLowerCase().indexOf(this.keyword.toLowerCase()) != -1);
            })
        },
    },
    watch: {
        diseaseId: function(newVal) {
            this.getChartData();
            this.getAnalysisData();
        }
    },
    components: {
        chartCom
    },
    created() {
        this.getChartData();
        this.getAnalysisData();
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
            this.showHighchart = false;
            let formData = {
                diseaseId: this.$route.query.id
            }
            try {
                let res = await this.$http.KCgetChartOption(formData);
                if (res.code == 0) {
                    this.displayTabsList = utils.deepCopy(res.data.data);
                    this.displayTabsList.forEach((li)=>{
                        li.isActive = true;
                    })
                    this.chartOption.series[0].data = res.data.data;
                    this.$nextTick(()=>{
                        this.showHighchart = true;
                        // this.$refs.chartsRef.updated();
                    })
                    
                    this.displayTabsList = this.arrRemoveRepeat(this.displayTabsList);

                    this.allTabsList = utils.deepCopy(res.data.data)
                    this.computeTabs();
                }
            } catch (err) {
                console.log(err)
            }
            this.loading = false;
        },
        async getAnalysisData() {
            this.asideLoading = true;
            let formData = {
                diseaseId: this.$route.query.id
            }
            try {
                let res = await this.$http.KCgetrRelationship(formData);
                if (res.code == 0) {
                    this.analysisData = res.data;
                    this.allAnalysisData = utils.deepCopy(res.data)
                }
            } catch (err) {
                console.log(err)
            }
            this.asideLoading = false;
        },
        //选择类目
        selectTab(item,index) {
            this.showHighchart = false;
            this.$set(this.displayTabsList, index, Object.assign(
                this.displayTabsList[index],{isActive:!item.isActive}
            ))
            //置灰的类目
            let tabsListFallow = this.displayTabsList.filter((li)=>{
                return !li.isActive;
            })
            this.chartOption.series[0].data = this.handleTabsListActive(tabsListFallow, utils.deepCopy(this.allTabsList));
            this.$nextTick(()=>{
                this.showHighchart = true;
                // this.$refs.chartsRef.updated();
            })
            
             //置灰的类目
            let tabsListFilter = [];
            tabsListFallow.forEach((li)=>{
                this.allTabsList.forEach((n)=>{
                    if(n[0] == li[0]) {
                        tabsListFilter.push(n)
                    } 
                })
            })
            console.log(utils.deepCopy(this.allAnalysisData))
            console.log(tabsListFilter)

            //关联右边实体关系分析列表
            console.log(this.handleAnalysisDataActive(tabsListFilter, utils.deepCopy(this.allAnalysisData)))
            this.analysisData = this.handleAnalysisDataActive(tabsListFilter, utils.deepCopy(this.allAnalysisData))
        },
        /**
         * 去除置灰的类目
         * tabsListFallow： 置灰类目组
         * allTabsList 待遍历的数据
        */
        handleTabsListActive(tabsListFallow,allTabsList) {
            for(let i = 0; i < tabsListFallow.length; i++) {
                for(let j = 0; j < allTabsList.length; j++) {
                    if(tabsListFallow[i][0] == allTabsList[j][0] || tabsListFallow[i][1] == allTabsList[j][0]) {
                        let tempArr = utils.deepCopy(allTabsList[j]);
                        allTabsList.splice(j,1)
                        this.handleTabsListActive([tempArr],allTabsList);
                        j--;
                    }else if(tabsListFallow[i][0] == allTabsList[j][1] || tabsListFallow[i][1] == allTabsList[j][1]) {
                        allTabsList.splice(j,1)
                        j--;
                    }
                }
            }
            return allTabsList;
        },

        handleAnalysisDataActive(tabsListFallow,allTabsList) {
            for(let i = 0; i < tabsListFallow.length; i++) {
                for(let j = 0; j < allTabsList.length; j++) {
                    if(tabsListFallow[i][0] == allTabsList[j].parentNodeName || tabsListFallow[i][0] == allTabsList[j].parentNodeName ||
                        tabsListFallow[i][0] == allTabsList[j].nodeName || tabsListFallow[i][0] == allTabsList[j].nodeName ||
                        tabsListFallow[i][1] == allTabsList[j].nodeName || tabsListFallow[i][1] == allTabsList[j].nodeName ||
                        tabsListFallow[i][1] == allTabsList[j].parentNodeName || tabsListFallow[i][1] == allTabsList[j].parentNodeName) {
                        let tempArr = utils.deepCopy(allTabsList[j]);
                        allTabsList.splice(j,1)
                        this.handleAnalysisDataActive([tempArr],allTabsList);
                        j--;
                    }
                }
            }
            return allTabsList;
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
                return
            }else {
                this.currentPage --;
            }
        },
        //点击下一页
        nextArrowsClick() {
            if(this.currentPage == this.totalPage) {
                return
            }else {
                this.currentPage ++;
            }
        },
        //点击分析按钮
        selectBtn(val) {
            this.activeBtn = val;
        },
        //接收子组件传过来的颜色列表
        getColorArr(list = []) {
            this.displayTabsList.forEach((li,index)=>{
                let obj = list.find( n =>{
                    return n.id == li[0];
                } )
                this.$set(this.displayTabsList, index, Object.assign(
                    this.displayTabsList[index],{color:obj && obj.color}
                ))
            })
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
                // border: 1px dashed #555;
                position: absolute;
                top: 15px;
                left: 15px;
                right: 400px;
                bottom: 40px;
                padding: 15px;
            }
            .item-group {
                position: absolute;
                left: 15px;
                right: 400px;
                bottom: 1px;
                height: 39px;
                .is-disabled {
                    cursor:not-allowed;
                }
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
                            i {
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
                                i { 
                                    background-color: #333;
                                }
                            }
                            &:not(.active) {
                                i { 
                                    background-color: #999 !important;
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
            width: 400px;
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
            .el-input {
                margin: 10px 15px;
                display: block;
                width: auto;
            }
            .content {
                position: absolute;
                top: 118px;
                right: 0;
                bottom: 0;
                width: 100%;
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


