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
                    <el-table-column type="index" label='序号'></el-table-column>
                    <el-table-column prop="visitDate" label="机构名称"></el-table-column>
                    <el-table-column prop="reportName" label="病人总数"></el-table-column>
                    <el-table-column prop="patientName" label="初诊次数"></el-table-column>
                    <el-table-column prop="genderName" label="最新录入时间"></el-table-column>
                    <el-table-column prop="author" label="机构负责人"></el-table-column>
                    <el-table-column prop="groupName" label="负责人电话"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination :data="dataList" @change="getDataList"></pagination>
            </echarts-contain>
        </div>
    </div>
</template>

<script>
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
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
                content: []
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
    },
    components: {
        pagination,
        echartsContain,
    },
    methods: {
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
                startTime = this.form.time[0].split("-").join('');
                endTime = this.form.time[1].split("-").join('');
            }
            let formData = {
                offset: pageNo,
                limit: pageSize,
                args: {
                    // diseaseId: this.form.diseaseSubjectGroup.disease || '',
                    diseaseId: this.$route.query.id || '',
                    subjectId: this.form.diseaseSubjectGroup.subject || '',
                    groupId: this.form.diseaseSubjectGroup.group || '',
                    crfId: "",
                    patientName: "",
                    startTime: startTime,
                    endTime: endTime,
                    status: this.form.state
                }
            };
            try {
                let res = await that.$http.RRMgetDataList(formData);
                if (res.code == '0') {
                    let obj = {};
                    obj.content = res.data.args;
                    obj.pageNo = pageNo;
                    obj.pageSize = pageSize;
                    obj.totalCount = parseInt(res.data.totalElements);
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


