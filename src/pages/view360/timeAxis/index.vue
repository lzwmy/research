<template>
    <div class="timeAxis">
        <!-- <div class="list">
            <table class="table">
                <thead>
                    <tr>
                        <th>肿瘤位置</th>
                        <th>病理组织学分弄</th>
                        <th>OS</th>
                        <th>PFS</th>
                        <th>LRFS</th>
                        <th>DMFS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td>{{item.a}}</td>
                        <td>{{item.b}}</td>
                        <td>{{item.c}}</td>
                        <td>{{item.d}}</td>
                        <td>{{item.e}}</td>
                        <td>{{item.f}}</td>
                    </tr>
                </tbody>
            </table>
        </div> -->
        <div class="box">
            <div class="time timeLine flex-start-start" >
                <p class="title">重点诊疗事件</p>
                <el-steps :space="180" v-loading="loadingEvent">
                    <el-step 
                        :title="item.admitDate" 
                        :description="item.descName" 
                        v-for="(item, index) in eventList" 
                        :key="index">
                    </el-step>
                </el-steps>
            </div>
            <div class="time timespan flex-start-start">
                <p class="title" style="line-height: 40px;">时间跨度</p>
                <timeSpan 
                    v-if="timeSpanStartTime" 
                    @changeTimeSpan="handleChangeTimeSpan" 
                    :startTime="timeSpanStartTime" 
                    :endTime="timeSpanEndTime">
                </timeSpan>
            </div>
            
            <div class="li" v-for="(item, index) in examList" :key="'exam'+index">
                <chartsLine 
                    :title="item.examClass" 
                    ref="charts" 
                    :domId="'echartExam'+index" 
                    :option="item.option" 
                    :list="item.serverData" 
                    :startTime="timeSpanStartTime" 
                    :endTime="timeSpanEndTime">
                </chartsLine>
            </div> 

            <div class="row flex-around-center">
                <span class="text">检验</span>
                <i class="line"></i>
                <el-button type="text" class="setting" @click="showDialog('检验')"><span class="el-icon-setting"></span></el-button>
            </div>  
            <div v-loading="loadingLab">
                <div class="li" v-for="(item, index) in labList" :key="'lab'+index" :id="'lab'+index">
                    <chartsLine 
                        :title="item.itemEnName" 
                        ref="charts" 
                        :domId="'echartLab'+index" 
                        :id="item.id" 
                        :list="item.serverData" 
                        :option="item.option"
                        @getIndicatorData='handldUpdate' 
                        :startTime="timeSpanStartTime" 
                        :endTime="timeSpanEndTime">
                    </chartsLine>
                </div>  
            </div>

            <div class="row flex-around-center">
                <span class="text">分子病理</span>
                <i class="line"></i>
                <el-button type="text" class="setting" @click="showDialog('分子病理')"><span class="el-icon-setting"></span></el-button>
            </div>
        </div>

        <!--添加设置弹框-->
        <el-dialog 
            :title="dialog.title+'指标设置'" 
            :visible.sync="dialog.visible" 
            :append-to-body="true" 
            width="800px"
            class="dialogVisible">
            <el-form :model="dialog" label-width="60" label-position="left" @submit.native.prevent>
                <el-form-item label="已选指标:">
                    <br/>
                    <el-tag 
                        size="small" 
                        v-for="(item, index) in dialog.targetList" 
                        :key="index" 
                        style="margin-right: 8px;"
                        @close="handleCloseTag(index)"
                        closable>{{item.labSubjectName}} - {{item.itemChName}} - {{item.itemEnName}}
                    </el-tag>
                </el-form-item>
                <br/>
                <el-form-item label="指标名称:">
                    <el-input 
                        v-model.trim="dialog.name" 
                        placeholder="请输入指标名称查询"
                        :maxlength="20"
                        clearable
                        size="mini"
                        style="width:300px;"
                        @keyup.enter.native="onSearch">
                    </el-input>
                    <el-button size="mini" type="primary" @click="onSearch">查 询</el-button>
                </el-form-item>
                <el-form-item label-width="0">
                    <el-table
                        :data="dialog.dataList" style="width: 100%" v-loading="dialog.loading"  max-height="450" fit size="mini">
                        <el-table-column prop="itemEnName" label="英文名称" show-overflow-tooltip align="left"></el-table-column>
                        <el-table-column prop="itemChName" label="中文名称" show-overflow-tooltip align="left"></el-table-column>
                        <el-table-column prop="labSubjectName" label="检查项目" show-overflow-tooltip align="left"></el-table-column>
                        <el-table-column label="操作" align="center" width="60px">
                        <template slot-scope="scope">
                            <el-button type="text" @click="onAdd(scope.row)" size="mini" style="color:#2d8cf0;">添 加</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave" size="mini">保 存</el-button>
                <el-button @click="dialog.visible = false" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from 'components/utils/index';
import 'assets/css/common.less';
import timeSpan from './timeSpan'
import chartsLine from './chartsLine'

export default {
    name: 'timeAxis',
    props: {
        comData: {
            type: Object,
            default: ()=>({})
        },
    },
    data () {       
        return {
            x: 0,
            loadingEvent: false,
            loadingLab: false,
            timeSpanStartTime: 0,
            timeSpanEndTime: 0,
            eventList: [],  //诊疗事件集合
            examList: [],  
            labList: [],  //检验指标
            dialog: {
                visible: false,
                dataList: [],
                targetList: [],
                loading: false,
                name: ""
            }
        };
    },
    created () {
        this.getIndicatorInList()
        .then(()=>{
            if(this.comData.diseaseId) {
                this.getIndicatorTemplate()
                .then(()=>{
                    this.getIndicatorData();
                })
            }
        })
    },
    components: {
        timeSpan,
        chartsLine
    },
    methods: {
        //获取诊疗事件数据
        async getIndicatorInList() {
            this.loadingEvent = true;
            let formData = {
                patientId: this.comData.patientId,
            };
            try {
            let res = await this.$http.getIndicatorInList(formData);
                if (res.code == '0') {
                    this.eventList = res.data?res.data:[];
                    if(this.eventList.length != 0) {
                        this.timeSpanStartTime = this.eventList[0].admitDate;
                        this.timeSpanEndTime = this.eventList[this.eventList.length-1].admitDate;
                    }
                }
            } catch (error) {
            }
            this.loadingEvent = false;
        },
        //获取全部指标数据
        async getIndicatorData() {
            this.loadingLab = true;
            let formData = {
                patientId: this.comData.patientId,
                diseaseId: this.comData.diseaseId,
            };
            try {
                let res = await this.$http.getIndicatorData(formData);
                if (res.code == '0') {
                    this.examList = res.data.examList?res.data.examList:[];
                    this.labList = [];
                    this.dialog.targetList.forEach((item)=>{
                        this.labList.push({
                            id: item.id,
                            itemChName: item.itemChName,
                            itemEnName: item.itemEnName,
                            labSubjectCode: item.labSubjectCode,
                            labSubjectName: item.labSubjectName
                        })
                    })
                    this.labList.forEach((item)=>{
                        item.list = this.matchingData(res.data.labList, item)?this.matchingData(res.data.labList, item): [];
                    })
                    this.handleExamList(this.examList);
                    this.handleExamLab(this.labList);
                }
            } catch (error) {
                console.log(error)
            }
            this.loadingLab = false;
        },
        handleExamList(list) {
            list.forEach(item => {
                item.option = {
                    chart: {
                        type: 'line',
                        marginBottom: 50,
                        plotBackgroundColor: '#f6f6f6',
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        formatter: function () {
                            let content =  `<b>${this.point.name}</b><br/>
                                            日期:${utils.formateDate(this.point.x)}<br/>
                                            值:${this.point.y}`;
                            return content;
                        }
                    },
                    xAxis: {
                        min: new Date(this.timeSpanStartTime).getTime(),
                        max: new Date(this.timeSpanEndTime).getTime(),
                        visible: false
                    },
                    yAxis: {
                        visible: false,
                        labels: {
                            enabled: false,
                            reserveSpace: false
                        }                        
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            color: '#5ed9cb',
                            lineWidth: 0.5
                        }
                    },
                    series: [{}],
                    credits: {
                        enabled:false
                    }
                };
            })
            this.filterOption(list, '检查');
        },
        handleExamLab(list) {
            list.forEach(item => {
                item.option = {
                    chart: {
                        type: 'line',
                        plotBackgroundColor: '#f6f6f6',
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        borderColor: null,
                        formatter: function () {
                            let desc = this.point.desCode=='H'?'偏高':(this.point.desCode=='L'?'偏低':'正常');
                            let content =  `<b>${this.point.name}</b><br/>
                                            日期:${utils.formateDate(this.point.x)}<br/>
                                            值:${this.point.y} ${this.point.unit} (${desc})`;
                            return content;
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        min: new Date(this.timeSpanStartTime).getTime(),
                        max: new Date(this.timeSpanEndTime).getTime(),
                        visible: false
                    },
                    plotOptions: {
                        line: {
                            series: {
                                color: '#9ed464',
                                lineWidth: 1,
                            },
                        }
                    },
                    yAxis: {
                        visible: false,
                        title: {
                            text: ''
                        },
                        gridLineWidth: 0,
                        labels: {
                            reserveSpace: false
                        } 
                    },
                    series: [{}],
                    credits: {
                        enabled:false
                    }
                }
            })
            this.filterOption(list, '检验');
        },
        matchingData(arr,item) {
            if(!arr instanceof Array) { return}
            for(let n in arr){
                if(arr[n].itemEnName == item.itemEnName && arr[n].itemChName == item.itemChName) {
                    return arr[n].list;
                }
            }
        },
        //根据时间跨度过滤数据点
        filterOption(data, type) {
            data.forEach(item=>{
                item.serverData = [];
                item.list.forEach((li)=>{
                    if(type == '检查'){
                        let time = new Date(li.examDate).getTime();
                        if(time >= new Date(this.timeSpanStartTime).getTime() && time <= new Date(this.timeSpanEndTime).getTime()) {
                            let obj;
                            obj = {
                                name: li.examItemName,
                                marker: {
                                    fillColor: '#5ed9cb',
                                    radius: 6
                                },  
                                y: 10,
                                x: time
                            }
                            item.serverData.push(obj)
                        }
                    }else if(type == '检验'){
                        let time = new Date(li.resultDateTime).getTime();
                        if(time >= new Date(this.timeSpanStartTime).getTime() && time <= new Date(this.timeSpanEndTime).getTime()) {
                            let obj,color;
                            switch(li.itemResultDesCode) {
                                case 'H': color = '#f18889';break;
                                case 'L': color = '#555';break;
                                default: color = '#9ed464'; break;
                            }
                            obj = {
                                name: item.itemChName,
                                marker: {
                                    fillColor: color,
                                    radius: 5
                                }, 
                                y: li.itemResultNum,
                                x: time,
                                unit: li.itemResultUnit,
                                desCode: li.itemResultDesCode,
                            }
                            item.serverData.push(obj)
                        }
                    }
                })
            }) 
        },
        //时间跨度改变勾子
        handleChangeTimeSpan(data) {
            this.timeSpanStartTime = utils.formateDate(data.startTime);
            this.timeSpanEndTime = utils.formateDate(data.endTime);
            this.handleExamLab(this.labList);

            this.filterOption(this.examList,'检查');
            this.filterOption(this.labList,'检验');
        },
        showDialog(title) {
            this.dialog.title = title;
            this.dialog.visible = true;
            this.dialog.name = '';
            this.onSearch();
        },
        handleCloseTag(index) {
            this.dialog.targetList.splice(index, 1)
        },
        handldUpdate() {
            this.loadingLab = true;
            this.getIndicatorTemplate()
            .then(()=>{
                this.getIndicatorData();
                this.loadingLab = false;
            })
        },
        async onSave() {
            let formData = {
                diseaseId: this.comData.diseaseId,
                list: this.dialog.targetList
            };
            try {
                let res = await this.$http.getIndicatorTemplateEdit(formData);
                if (res.code == '0') {
                    this.$mes('success', '保存成功!');
                    this.dialog.visible = false;
                    this.getIndicatorTemplate()
                    .then(()=>{
                        this.getIndicatorData();
                        this.loadingLab = false;
                    })
                }
            } catch (error) {
            }
        },
        async onSearch() {
            let formData = {
                content: this.dialog.name
            };
            try {
            let res = await this.$http.getIndicatorLabList(formData);
                if (res.code == '0') {
                    this.dialog.dataList = res.data?res.data:[];
                }
            } catch (error) {
            }
        },
        async getIndicatorTemplate() {
            let formData = {
                diseaseId: this.comData.diseaseId
            };
            try {
                let res = await this.$http.getIndicatorTemplate(formData);
                if (res.code == '0') {
                    this.dialog.targetList = res.data?res.data:[];
                }
            } catch (error) {
            }
        },
        onAdd(row) {
            if(utils.isInArrayObject(this.dialog.targetList, 'itemEnName', row.itemEnName)) {
                this.$mes('info', '已存在该指标!');
                return;
            }
            this.dialog.targetList.push(row)
        }
    } 
};
</script>


<style lang='less' scoped>
    .timeAxis {
        height: 100%;
        overflow: auto;
        .list {
            padding: 20px;
            background-color: #f4f4f4;
            .table {
                thead{
                    th{
                        color: #777;
                        text-align: left;
                        font-size: 14px;
                        padding: 0 20px;
                        border-right: 1px solid #ccc;
                    }
                }
                tbody{
                    tr {
                        td{
                            color: #333;
                            text-align: left;
                            font-size: 18px;
                            padding: 10px 20px 0;
                            border-right: 1px solid #ccc;
                        }
                    }
                }
            }
        }
        .box {
            margin: 30px;
            margin-bottom: 100px;
            .time {
                margin-bottom: 50px;
                .title {
                    color: #666;
                    min-width: 95px;
                    font-size: 16px;
                    align-self: flex-start;
                }
                .costRange,
                .el-steps{
                    margin-left: 20px;
                    flex: 1;
                }
                .costRange {
                    // margin: 0 40px;
                }
            }
            .row {
                margin: 60px 0 20px;
                .text {
                    color: #666;
                    font-size: 16px;
                }
                .line {
                    flex: 1;
                    height: 0;
                    margin: 0 20px;
                    position: relative;
                    &:after {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 50%;
                        width: 100%;
                        border-bottom: 1px dashed #ddd;
                    }
                }
                .setting {
                    font-size: 24px;
                    color: #666;
                }
            }
            .li {
                margin-bottom: 20px;
            }
            
        }
    }
</style>

<style lang='less'>
    body .timeAxis {
        .timeLine {
            .el-step {
                .el-step__head {
                    .el-step__icon {
                        width: 17px;
                        height: 17px;
                        border: 4px solid #498bf4;
                        .el-step__icon-inner {
                            display: none;
                        }
                    }
                    .el-step__line {
                        height: 3px;
                        top: 7px;
                        background-color: #ddd;
                    }
                }
                .el-step__main {
                    .is-wait {
                        color: #555;
                        font-size: 16px;
                    }
                    .el-step__title {
                        font-size: 14px;
                        color: #999;
                    }
                }
            }
        }
    }
</style>
