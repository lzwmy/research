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
                    <el-table-column label='分中心' prop="orgName" min-width="160"></el-table-column>
                    <el-table-column label='病人姓名' prop="patientName" ></el-table-column>
                    <el-table-column label='性别' prop="sex"></el-table-column>
                    <el-table-column label='年龄' prop="age"></el-table-column>
                    <el-table-column label='填充率' min-width="200">
                        <template slot-scope="scope">
                            <div style="width: 200px;">
                                <el-progress :percentage="parseInt(scope.row.fillingRate)" :color='scope.row.fillingRate>=50?"#1bbae1":"#D95555"'></el-progress>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="无效值" min-width="160">
                        <template slot-scope="scope">
                            <p v-if="scope.row.invalidValue[0]" class="inline">1、{{scope.row.invalidValue[0]}}<span v-if="scope.row.invalidValue[1]">...</span></p>
                            <p v-else>暂无</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" style="color:#1bbae1;" icon="icon iconfont iconfuhao2" @click="showDialog(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-popover
                    placement="bottom-start"
                    popper-class="invalid_value"
                    width="250"
                    v-if="popperData.invalidValue && popperData.invalidValue[0]"
                    v-model="popperData.visible"
                    :visible-arrow="false"
                    trigger="hover">
                    <div class="title flex-between-center">
                        <p>无效值&nbsp;(<span style="color:#1bbae1;">{{popperData.patientName}}</span>)</p>
                        <i @click="popperData.visible=false" class="icon icon-hover el-icon-circle-close"></i>
                        
                    </div>
                    <div class="content" v-if="popperData.invalidValue[1]">
                        <p v-for="(t,index) in popperData.invalidValue" :key="index">{{index+1}}、{{t}};</p>
                    </div>
                </el-popover>  -->

                <!-- 分页 -->
                <pagination :data="dataList" @change="getDataList"></pagination>
            </echarts-contain>
        </div>
        
        <el-dialog 
            :title="'无效值 ('+(dialgoForm.popperData.patientName || '')+')'" 
            :append-to-body="true"
            class="invalid_dialog"
            @closed="dialgoForm.visible=false;dialgoForm.popperData = {}"
            :visible.sync="dialgoForm.visible" 
            width="550px">
            <p v-for="(t,index) in dialgoForm.popperData.invalidValue" :key="index">{{index+1}}、{{t}};</p>
            <em v-if="!isExist">(空)</em>
        </el-dialog>

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
            // popperData: {},
            loading: false,
            identify:"",
            paging: {
                pageNo: 1,
                pageSize: 20,
                currentPageNo: '',
                currentPageSize: '',
            },
            emptyText: '',
            isExist: true,
            elementLoadingText: ''  ,
            dialgoForm: {
                visible: false,
                popperData: {}
            }
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
        showDialog(row) {
            if(row.invalidValue && row.invalidValue.length != 0) {
                this.isExist = true;
            }else {
                this.isExist = false;
            }
            this.dialgoForm = {
                visible: true,
                popperData: row
            }
        },
        tableHover(row,column,cell) {
            // if(column.label == '无效值') {
            //     this.popperData = row;
            //     this.popperData.visible = true;
            // }else {
            //     this.popperData.visible = false;
            // }
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
        top: 186px !important;
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
        &:hover {
            p {
                color: #666;
                cursor:default;
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
    .invalid_dialog {
        .el-dialog__body {
            padding: 10px 20px !important;
            min-height: 300px;
            max-height: 600px;
            overflow: auto;
            line-height: 1.5em;
        }
    }
    @media screen and (max-width: 1800px) {
        .invalid_dialog {
            .el-dialog__body {
                min-height: 300px;
                max-height: 400px;
            }
        }
    }
</style>


