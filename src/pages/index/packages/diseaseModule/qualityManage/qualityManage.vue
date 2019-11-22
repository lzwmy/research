<template>
    <div class="cloud-component qualityManage">
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small">
            <el-form :inline="true" :model="form" class="flex-start-center">
                <el-form-item label="CRF">
                    <el-select v-model="form.crfFrom" size="mini" clearable>
                        <el-option label="crf1" value="0"></el-option>
                        <el-option label="crf2" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小节">
                    <el-select v-model="form.minutia" size="mini" clearable>
                        <el-option label="病人信息" value="1"></el-option>
                        <el-option label="就诊信息" value="2"></el-option>
                        <el-option label="手术信息" value="3"></el-option>
                        <el-option label="检查信息" value="4"></el-option>
                    </el-select>
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
                    <el-table-column label='字段名称' prop=""></el-table-column>
                    <el-table-column label='有效值名称' prop=""></el-table-column>
                    <el-table-column label='总人数' prop=""></el-table-column>
                    <el-table-column label='填充率'>
                        <template slot-scope="scope">
                            <div style="width: 300px;">
                                <el-progress :percentage="50" color='rgba(0, 188, 146, 1)'></el-progress>
                            </div>
                        </template>
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
    name: 'qualityManage',
    mixins: [mixins],
    data () {
        return {
            form: {
                crfFrom:"",
                minutia: ""
            },
            dataList: {
                content:[]
            },
            loading: false,
            identify:"",
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            },
            emptyText: '',
            elementLoadingText: ''  
        };
    },
    created () {
        // this.getDataList();
    },
    components: {
        pagination,
        echartsContain,
    },
    methods: {
        handleWidth(label) {
            let width = '';
            if(label.indexOf('时间') != -1 || label.indexOf('日期') != -1) {
                width = 160
            }
            return width
        },
        initPage() {
            // this.getDataList()
            // .then(()=>{
            //     this.$emit('changeLoadding',false);
            // })
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
                }else {
                    this.$mes('error', res.msg);
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


