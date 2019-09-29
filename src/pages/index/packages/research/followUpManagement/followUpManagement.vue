<template>
    <div class="cloud-component followUpManagement cloud_common_search">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button type="primary" icon="icon iconfont icondaochu" @click="">批量导入随访数据</el-button>
                <el-button type="primary" icon="icon iconfont iconxiazaimoban" @click="">导出随访阶段数据</el-button>
                <el-button type="primary" icon="icon iconfont icondaochujilu" @click="">导出记录</el-button>
            </div>
        </div>
        <!-- 搜索区域 -->
        <div class="cloud-search flex-between-center">
            <div class="search_group flex-start-center">
                <div v-for="(item, index) in 3" :key="index" class="group_item" :class="activeGroup==index+1?'active':''" @click="selectGroup(index+1)">分组{{item+1}} <span class="badge">12</span> </div>
                <el-popover trigger="click" :popper-class="'popover_search ' + $store.state.common.openMenuView">
                    <div slot="reference"><i class="icon iconfont iconsousuo_fuzhi"></i> 搜索</div>
                    <el-form :inline="true" :model="form" label-width="110px" class="flex-start-center flex-wrap researchObject_search">
                        <el-form-item label="首次录入时间：" class="bold">
                            <el-date-picker
                                v-model="form.time"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="随访点状态:" class="bold">
                            <el-select v-model="form.formName" clearable>
                                <el-option label="全部阶段" value="0"></el-option>
                                <el-option label="已完成" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-select v-model="form.formState" clearable>
                                <el-option label="全部随访点" value="0"></el-option>
                                <el-option label="已完成" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-select v-model="form.formState" clearable>
                                <el-option label="全部状态" value="0"></el-option>
                                <el-option label="已完成" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="最近随访时间：" class="bold">
                            <el-date-picker
                                v-model="form.time"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="随访状态:">
                            <el-select v-model="form.patientState" clearable>
                                <el-option label="全部状态" value="0"></el-option>
                                <el-option label="已完成" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="btnGroup_search">
                        <el-button type="primary" icon="el-icon-search" @click="getDataList()">查 询</el-button>
                        <el-button icon="el-icon-refresh" @click="">重 置</el-button>
                    </div>
                </el-popover>
            </div>
            <div class="search_condition flex-start-center">
                <p v-show="multipleSelection.length != 0" style="min-width: 136px; color: #666;" class="font_14">已选中 {{multipleSelection.length}} 位研究对象</p>
                <el-button v-show="multipleSelection.length != 0" type="primary" icon="icon iconfont iconqueren" @click="">触发开始随访</el-button>
                <el-button v-show="multipleSelection.length != 0" type="danger" class="right_6" icon="icon iconfont iconzujian12" @click="">提交随访点</el-button>
                <el-popover trigger="click" popper-class="popover_condition" v-model="popoverVisible">
                    <el-button slot="reference">已选3项 <span class="el-icon-caret-bottom"></span></el-button>
                    <div class="box">
                        <div class="head flex-between-center">
                            <p>选择搜索</p><span class="el-icon-close cur_pointer" @click="popoverVisible = false"></span>
                        </div>
                        <div class="radio_group">
                            <el-radio v-model="form.radio" label="1">精准搜索</el-radio>
                            <el-radio v-model="form.radio" label="2">模糊搜索</el-radio>
                        </div>
                        <div class="content flex-start-start">
                            <div class="left">
                                <p class="label">请选择</p>
                                <ul>
                                    <li v-for="(item,index) in 10" :key="index" class="flex-between-center" :class="activeCrf==index+1?'active':''" @click="selectCrf(index+1)">
                                        <p>CRF({{item}})</p>
                                        <div class="icon">
                                            <span>3</span>
                                            <i class="el-icon-arrow-right"></i>   
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="right">
                                <p class="label">选择搜索字段，至少选择1项，最多5项</p>
                                <el-checkbox-group 
                                    v-model="form.checked"
                                    :min="0"
                                    :max="5">
                                    <el-checkbox v-for="(item,index) in checkedList" :label="item" :key="index">{{item}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div class="footer flex-end-center">
                            <p>最多展示500个指标</p>
                            <el-button type="primary"  @click="">保 存</el-button>
                            <el-button @click="popoverVisible = false">取 消</el-button>
                        </div>
                    </div>
                </el-popover>
                <el-input v-model="form.keyword" class="search_input" placeholder="先选条件,再搜索" @keyup.enter.native="getDataList()" clearable></el-input>
            </div>
        </div>


        <!--搜索结果-->
        <div class="cloud-search-list">
            <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
                <el-table 
                    ref="refTable"
                    :data="dataList.content"
                    v-loading="loading"
                    :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-55):(routerViewHeight*1)">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column label="入组序号" width="100">
                        <template slot-scope="scope">
                            1
                        </template>
                    </el-table-column>
                    <!-- <el-table-column 
                        :prop="column.name" 
                        :label="column.label" 
                        sortable 
                        v-for="column in conditionViewList"
                        :key="column.name" 
                        :width="column.name == 'GENDER_NAME'?'80px':'' || column.name == 'AGE'?'80px':'' "
                        show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column type="index" label="序号" width="90px"></el-table-column>
                    <el-table-column prop="a" label="用户名"></el-table-column>
                    <el-table-column prop="b" label="手机号"></el-table-column>
                    <el-table-column prop="c" label="机构"></el-table-column>
                    <el-table-column prop="d" label="科室"></el-table-column>
                    <el-table-column prop="e" label="职称"></el-table-column>
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
export default {
    name: 'followUpManagement',
    mixins: [mixins],
    data () {
        return {
            dataList: {
                content: []
            },
            popoverVisible: false,
            checkedList:['出生日期1','出生日期2','出生日期3','出生日期4','出生日期5','出生日期6'],
            form: {
                keyword: '',
                time:[],
                formName: '',
                formState: '',
                patientState: '',
                radio: 1,
                checked: []
            },
            multipleSelection: [],
            activeGroup: 1,
            activeCrf: 1,
            loading: false,
            paging: {
                pageNo: 1,
                pageSize: 10,
                currentPageNo: '',
                currentPageSize: '',
            }
        }
    },
    watch: {
        
    },
    components: {
        echartsContain,
        pagination
    },
    methods: {
        initPage () {
            this.getDataList();
        },
        selectGroup(index) {
            this.activeGroup = index;
        },
        selectCrf(index) {
            this.activeCrf = index;
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
                args: {
                    
                }
            };
            try {
                // let res = await that.$http.RRMgetDataList(formData);
                // if (res.code == '0') {
                //     let obj = {};
                //     obj.content = res.data.args;
                //     obj.pageNo = pageNo;
                //     obj.pageSize = pageSize;
                //     obj.totalCount = parseInt(res.data.totalElements);
                //     obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
                //     that.dataList = obj;
                // }else {
                //     this.$mes('error', res.msg);
                // }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
    }
};
</script>

<style lang="less" scoped>
    .followUpManagement {
        .el-table {
                padding: 0;
        }
        
    }
</style>

<style lang="less">
    @import url('../researchObject/popover.less');
</style>




