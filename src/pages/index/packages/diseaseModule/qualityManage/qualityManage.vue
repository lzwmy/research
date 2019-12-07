<template>
    <div class="cloud-component qualityManage">
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small">
            <el-form :inline="true" :model="form" class="flex-start-center">
                <el-form-item label="CRF">
                    <el-select v-model="form.crfFromId" size="mini" @change="getDataList()">
                        <el-option v-for="(item,index) in crfList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width='' class="flex-right">
                    <el-button :disabled="crfList.length==0" type="primary" icon="el-icon-search" @click="getDataList()">生成报告</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)"
                    :data="dataList.content" v-loading="loading" ref="refTable" fit @cell-mouse-enter="tableHover">
                    <el-table-column label='创建时间' prop="createTime" width="180"></el-table-column>
                    <el-table-column label='创建人' prop="createName"></el-table-column>
                    <el-table-column label='分中心' prop="orgName" min-width="140"></el-table-column>
                    <el-table-column label='病人姓名' prop="patientName" ></el-table-column>
                    <el-table-column label='性别' prop="sex"></el-table-column>
                    <el-table-column label='年龄' prop="age"></el-table-column>
                    <el-table-column label='填充率' min-width="200">
                        <template slot-scope="scope">
                            <div style="width: 200px;">
                                <el-progress :percentage="scope.row.fillingRate" :color='scope.row.fillingRate>=50?"#1bbae1":"#D95555"'></el-progress>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="无效值" min-width="200">
                        <template slot-scope="scope">
                            <el-popover
                                placement="bottom-start"
                                popper-class="invalid_value"
                                width="280"
                                v-if="scope.row.invalidValue && scope.row.invalidValue[0]"
                                v-model="scope.row.visible"
                                :visible-arrow="false"
                                trigger="hover">
                                <div class="title flex-between-center">
                                    <p>无效值&nbsp;(<span style="color:#1bbae1;">{{scope.row.patientName}}</span>)</p>
                                    <i @click="scope.row.visible=false" class="icon icon-hover el-icon-circle-close"></i>
                                </div>
                                <div class="content" v-if="scope.row.invalidValue[1]">
                                    <p v-for="(t,index) in scope.row.invalidValue" :key="index">{{index+1}}、{{t}};</p>
                                </div>
                                <div slot="reference" class="inline">
                                    <p class="inline">1、{{scope.row.invalidValue[0]}}<span v-if="scope.row.invalidValue[1]">...</span></p>
                                </div>
                            </el-popover> 
                            <!-- <p v-else>暂无</p>
                            <!-- <p class="inline" v-if="scope.row.invalidValue && scope.row.invalidValue[0]">1、{{scope.row.invalidValue[0]}}<span v-if="scope.row.invalidValue[1]">...</span></p> -->
                            <!-- <p v-else>暂无</p> -->
                        </template>
                    </el-table-column>
                </el-table>

                <!-- <el-popover
                    placement="bottom-start"
                    popper-class="invalid_value"
                    width="280"
                    v-if="popoverData.invalidValue && popoverData.invalidValue[0]"
                    :visible-arrow="false"
                    v-model="visible"
                    trigger="click">
                    <div class="title flex-between-center">
                        <p>无效值&nbsp;(<span style="color:#1bbae1;">{{popoverData.patientName}}</span>)</p>
                        <i @click="visible = false" class="icon icon-hover el-icon-circle-close"></i>
                    </div>
                    <div class="content">
                        <p v-for="(t,index) in popoverData.invalidValue" :key="index">{{index+1}}、{{t}};</p>
                    </div>
                    <div slot="reference" class="inline">
                        
                    </div>
                </el-popover> -->
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
                crfFromId:"",
            },
            crfList: [],
            dataList: {
                content:[]
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
            this.form.crfFromId = '';
            this.dataList.content = [];
            this.getCrfList().then(()=>{
                if(!this.crfList.length) {
                    this.$emit('changeLoadding',false);
                    this.loading = false;
                    return;
                }
                this.getDataList().then(()=>{
                    this.$emit('changeLoadding',false);
                })
            })
        },
        tableHover(row,column,cell) {
            this.dataList.content.forEach(item=>{
                item.visible = false;
            })
            row.visible = true;
        },
        async getCrfList() {
            
            this.loading = true;
            let formData = {
                diseaseId: this.$route.query.id
            }
            try {
                let res = await this.$http.qualityManageGetCrfList(formData);
                if (res.code == 0) {
                    this.crfList = res.data;
                    if(this.crfList.length){
                        this.form.crfFromId = this.crfList[0].id;
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
        async getDataList (pageNo = this.paging.pageNo, pageSize = this.paging.pageSize) {
            let that = this;
            that.loading = true;
            that.paging.currentPageNo = pageNo;
            that.paging.currentPageSize = pageSize;
            that.dataList.content = [];
            let formData = {
                offset: pageNo,
                limit: pageSize,
                diseaseId: this.$route.query.id,
                crfId: parseInt(this.form.crfFromId)
            };
            try {
                let res = await that.$http.qualityManageGetDataList(formData);
                if (res.code == '0') {
                    let obj = {};
                    obj.content = res.data.list;
                    obj.content.forEach( item => {
                        item.visible = false;
                        item.createTime = utils.formateDate(item.createTime)
                    });
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
    .el-popper.invalid_value {
        position: fixed !important;
        right: 10px !important;
        left: auto !important;
        top: 177px !important;
        padding: 0;
        .title {
            line-height: 36px;
            border-bottom: 1px solid #ccc;
            padding: 0 10px;
            font-size: 15px;
            .icon {
                font-size: 18px;
            }
        }
        .content {
            padding: 10px;
            min-height: 350px;
            max-height: 500px;
            overflow: auto;
            font-size: 13px;
            color: #666;
        }
    } 
    .qualityManage {
        .el-progress-bar {
            width: 80%;
        }

    }
</style>


