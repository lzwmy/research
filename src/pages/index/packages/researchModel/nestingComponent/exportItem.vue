<template>
    <div class="export_container">
        <div class="left" v-loading="loading">
            <Tree 
                :dataTree="treesData"
                :showCheckbox="true"
                :defaultExpandAll="true"
                :props="props"
                :filter="{key:'controlType', val:['LABLE']}"
                @selectTreeUpdate="receiveTreeData" 
                @selectCheckBoxItem="receiveTreeDataItem">
            </Tree>
        </div>
        <div class="right">
            <div class="top">
                <el-button type="text" @click="onSelectAll">全 选</el-button>
                <el-button type="text" @click="onClear">清 除</el-button>
            </div>
            <div class="content" id="content2"></div>
        </div>
    </div>
</template>

<script>
import Tree from './tree'
import {arrayDiff, arrayErgodic, updatedTreeChecked} from '../util';
export default {
    name: "exportItemTest",
    props:{
        dataTreeAdd: {
            type: Array,
            default: () => []
        },
        dataTreeEdit: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: "add"
        }
    },
    data() {
        return {
            colorArr: ['#FFB100','#5DBA58','#2F7BDD','#D89787','#767879','#CFB66D'],
            loading: false,
            props: {
                label:'labelName',
                children: 'children'
            },
            treesData: []
        }
    },
    watch: {
        'dataTreeAdd': function(newVal) {
            this.emptyContent();
            if(newVal.length == 0) {
                this.treesData = [];
            }else if(this.type == 'add') {
                this.treesData = this.dataTreeAdd;
            }else {
                //改变查询条件时
                let handleReportcrfDisplayName = arrayDiff(this.treesData,this.dataTreeAdd)[0];
                if(this.treesData.length < this.dataTreeAdd.length) {
                    let addReportArr = this.dataTreeAdd.filter( item =>{
                        return item.crfDisplayName == handleReportcrfDisplayName
                    })
                    this.treesData = this.treesData.concat(addReportArr[0]);
                }else if(this.treesData.length > this.dataTreeAdd.length) {
                    for(let i = 0; i < this.treesData.length; i++) {
                        if(this.treesData[i].crfDisplayName == handleReportcrfDisplayName) {
                            this.treesData.splice(i,1);
                            i--;
                        }
                    }
                }
                this.treesData.forEach( item=>{
                    if(item.checked) {
                        arrayErgodic(item, this.changeContent)
                    }
                })
                this.$emit('treeData',this.treesData);
            }
        },
        'dataTreeEdit': function(newVal) {
            if(newVal.length == 0) {
                this.emptyContent();
            }
        }
    },
    created() {
        if(this.type == 'add') {
            this.treesData = this.dataTreeAdd;
        }else {
            this.treesData =  this.dataTreeEdit;
        }
    },
    mounted() {
        this.emptyContent();
        this.treesData.forEach( item=>{
            if(item.checked) {
                arrayErgodic(item, this.changeContent)
            }
        })
    },
    components: {
        Tree
    },
    methods:{
        //全选
        onSelectAll() {
            this.emptyContent();
            updatedTreeChecked(this.treesData, true);
            this.treesData.forEach( item=>{
                arrayErgodic(item, this.changeContent, true)
            })
            this.$emit('treeData',this.treesData);
        },
        //清空
        onClear() {
            this.emptyContent();
            updatedTreeChecked(this.treesData, false);
            this.$emit('treeData',this.treesData);
        },
        //tree状态改变时触发事件
        receiveTreeData(data) {
            this.$emit('treeData',this.treesData);
        },
        //tree复选框被点击时触发事件
        receiveTreeDataItem(data) {
            //单个选中or取消
            if(data.children && data.children.length == 0) {
                if(!data.checked) {
                    this.changeContent(data, true);
                }else {
                    this.changeContent(data, false);
                }
            }else if(data.children && data.children.length != 0) {
                //多个选中or取消
                if(!data.checked) {
                    arrayErgodic(data , this.changeContent, true)
                }else {
                    arrayErgodic(data , this.changeContent, false)
                }
            }
        },
        //清空右侧内容
        emptyContent() {
            $('#content2').empty();
        },
        //改变内容 item: 数据， check：true为增加，false为删除
        changeContent(item ,check) {
            if(check) {
                let exist = Array.from($('#content2').children('span')).some((ele) =>{
                    return $(ele).attr('data-id') === item.treeId;
                })
                if(!exist) {
                    $('#content2').append('<span data-id='+ item.treeId +' style="background:'+ this.colorArr[Math.floor(Math.random()*6)] + ';">'+ item.labelName +'</span>')
                }
            }else {
                $('#content2 span[data-id = '+ item.treeId+']').remove();
            }
        }
    },
}
</script>

<style lang="less">
    .export_container {
        display: flex;
        justify-content: flex-start;
        padding-right: 10px;
        height: 100%;
        .left {
            min-width: 180px;
            max-width: 300px;
            height: 100%;
            flex-grow: 0;
            border: 1px solid #D8D8D8;
            overflow: auto;
            .el-tree-node__label {
                width: 90px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        .right {
            flex:1;
            padding: 0 0 20px 20px;
            overflow-y: auto;
            .top {
                margin-bottom: 10px; 
            }
            .content {
                span{
                    display: inline-block;
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                    min-width: 64px;
                    height: 30px;
                    font-size: 12px;
                    padding: 0 10px;
                    margin: 0 7px 7px 0;
                    border-radius:2px;
                &:first-child {
                        background: #2F7BDD !important;
                    }
                }
            }
        }
    }
</style>
