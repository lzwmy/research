<template>
    <div class="cloud-component inputStatistics">
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small">
            <el-form :inline="true" :model="form" class="flex-start-center">
                <el-form-item label="时间范围：">
                    <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" label-width='' class="flex-right">
                    <el-button type="primary" icon="el-icon-search" @click="getDataList()">查 询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)"
                    :data="dataList.content" v-loading="loading" ref="refTable" fit>
                    <el-table-column type="index" label='序号' width="80"></el-table-column>
                    <el-table-column 
                        v-for="(column,index) in dataList.header"
                        :key="index"
                        :prop="column.prop" 
                        :label="column.label" 
                        :width="handleWidth(column.label)" 
                        :min-width="column.label.length * 15 + 20" 
                        show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination :data="dataList" @change="getDataList"></pagination>
            </echarts-contain>
        </div>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import pagination from 'components/packages/pagination/pagination';
import mixins from 'components/mixins';
import utils from 'components/utils/index';


export default {
    name: 'inputStatistics',
    mixins: [mixins],
    data () {
        return {
            form: {
                diseaseSubjectGroup: {},
                time:[],
                state:"",
                report: ""
            },
            dataList: {
                content: [],
                header: []
            },
            loading: false,
            identify:"",
            paging: {
                pageNo: 1,
                pageSize: 20,
                currentPageNo: '',
                currentPageSize: '',
            },
            emptyText: '',
            elementLoadingText: ''  
        };
    },
    created () {
        this.getDataList();
    },
    components: {
        pagination,
        echartsContain,
    },
    methods: {
        handleWidth(label) {
            let width = '';
            if(label.indexOf('时间') != -1 || label.indexOf('日期') != -1) {
                width = 180
            }else if(label.indexOf('数') == -1) {
                width = 180
            }
            return width
        },
        initPage() {
            this.getDataList()
            .then(()=>{
                this.$emit('changeLoadding',false);
            })
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
            that.loading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let startTime, endTime;
            if(!this.form.time || this.form.time && this.form.time.length == 0) {
                startTime = null
                endTime = null
            }else {
                startTime = this.form.time[0];
                endTime = this.form.time[1];
            }
            let formData = {
                offset: pageNo,
                limit: pageSize,
                diseaseId: this.$route.query.id || '',
                start: startTime,
                end: endTime
            };
            try {
                let res = await that.$http.ORGDisGetStatisticsData(formData);
                if (res.code == '0') {
                    let obj = {};
                    obj.content = res.data.body;
                    obj.header = res.data.header;
                    obj.pageNo = pageNo;
                    obj.pageSize = pageSize;
                    obj.totalCount = parseInt(res.data.sum);
                    obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
                    that.dataList = obj;
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        }
    }
};
</script>

<style lang="less">
    
</style>


