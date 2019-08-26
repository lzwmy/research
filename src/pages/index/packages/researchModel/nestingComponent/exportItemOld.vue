<template>
    <div class="export_container">
        <div class="left" v-loading="loading">
            <el-tree
                :props="defaultProps" 
                :data="treesData"
                show-checkbox
                node-key="treeId"
                ref="tree"
                :default-expand-all = "true"
                @check="handleClick">
            </el-tree>
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
import utils from 'components/utils/index';
    export default {
        name: "exportItem",
        props:['dataTreeEdit','selectTreeData','type'],
        data() {
            return {
                colorArr: ['#FFB100','#5DBA58','#2F7BDD','#D89787','#767879','#CFB66D'],
                defaultProps: {
                    children: 'children',
                    label: 'labelName'
                },
                contentArr:[],  //右侧内容项
                selected:[], //选中项
                treesData:null,
                loading: false,
                dataTreeEditOld: null
            }
        },
        watch: {
            selectTreeData : function(newVal) {
                this.emptyContent();
                if(this.type == 'add') {
                    this.treesData = this.selectTreeData;
                }else {
                    this.selected = [];
                    this.dataTreeEditOld = utils.deepCopy((this.dataTreeEdit));
                    //查询项报告改变时
                    let newArr = [];
                    if(this.selectTreeData.length != 0) {
                        newArr = this.removeRepeat(this.dataTreeEditOld.concat(this.selectTreeData));
                    }
                    //重新添加tree的treeId
                    this.treeId = 0;
                    this.treesData = this.addTreeId(newArr);
                }
                this.findCheckedItem(this.treesData);
                this.$nextTick(()=>{
                        //设置默认选中项
                        this.$refs.tree.setCheckedKeys(this.selected);
                        let newAddArr = this.findLeafItem();
                        this.addItemToView(this.arrayDiff(newAddArr, this.contentArr));
                        //更新右侧内容现有项
                        this.contentArr = this.findLeafItem();
                    })
            },
            dataTreeEdit: function(newVal) {
                if(this.type == "modify"){
                    this.emptyContent();
                    this.treesData = newVal;
                    this.findCheckedItem(this.treesData);
                    this.$nextTick(()=>{
                        //设置默认选中项
                        this.$refs.tree.setCheckedKeys(this.selected);
                        let newAddArr = this.findLeafItem();
                        this.addItemToView(this.arrayDiff(newAddArr, this.contentArr));
                        //更新右侧内容现有项
                        this.contentArr = this.findLeafItem();
                    })
                }
            }
        },
        created() {
            if(this.type == 'add') {
                this.treesData = this.selectTreeData;
            }else {
                this.treesData =  this.dataTreeEdit;
            }
            this.findCheckedItem(this.treesData);
        },
        mounted() {
            this.$nextTick(()=>{
                //设置默认选中项
                this.$refs.tree.setCheckedKeys(this.selected);
                let newAddArr = this.findLeafItem();
                this.addItemToView(this.arrayDiff(newAddArr, this.contentArr));
                //更新右侧内容现有项
                this.contentArr = this.findLeafItem();
            })
        },
        destroyed() {
            this.selected = [];
        },
        methods:{
            //全选
            onSelectAll() {
                this.emptyContent();
                let arr = this.treesData.map(item => {
                    return item.treeId;
                });
                this.$refs.tree.setCheckedKeys(arr);
                this.updatedChecked(this.treesData, null, true)
                this.findLeafItem().forEach( item =>{
                    $('#content2').append('<span data-id='+ item.uniqueId +' style="background:'+ this.colorArr[Math.floor(Math.random()*6)] + ';">'+ item.labelName +'</span>')
                })
                this.contentArr = this.findLeafItem();
                this.$emit('treeData',this.treesData);
            },
            //清空
            onClear() {
                this.updatedChecked(this.treesData, null, false);
                this.emptyContent();
                this.selected = [];
                this.$emit('treeData',this.treesData);
            },
            //去重
            removeRepeat(arr) {
                var newArr = [];
                var obj = {};
                for(var i = 0; i < arr.length; i++){
                    if(!obj[arr[i].crfName]){
                       newArr.push(arr[i])
                       obj[arr[i].crfName] = true;
                    }
                }
                return newArr;
            },
            //当复选框被点击的时候触发
            handleClick(data,halfCheckedNodes) {
                if(data.children.length != 0 ) {
                    //全选勾选或全选取消操作
                    let checked = this.findLeafItem(data).every(item =>{
                        return item.checked == true;
                    })
                    let newAddArr = this.findLeafItem();
                    if(!checked) {
                        this.addItemToView(this.arrayDiff(newAddArr, this.contentArr))
                    }else {
                        let diffArr = this.arrayDiff(newAddArr, this.contentArr);
                        for(let i = 0; i < diffArr.length; i++) {
                            $('#content2 span[data-id = '+diffArr[i].uniqueId+']').remove();
                            this.updatedChecked(this.treesData, diffArr[i], false);
                        }
                    }
                }else {
                    this.updatedContentView(data);
                }
                //更新右侧内容现有项
                this.contentArr = this.findLeafItem();
                this.getCheckedToTrue(this.treesData);
                this.$emit('treeData',this.treesData);
                // console.log(this.treesData)
            },
            //获取 半选中和已选中节点的key 去改变tree匹配到节点的checked
            getCheckedToTrue(obj) {
                let halfCheckkeysArr = this.$refs.tree.getHalfCheckedKeys();
                let checkkeysArr = this.$refs.tree.getCheckedKeys();
                let func = function(obj,key) {
                    if (obj instanceof Object) {
                        if(obj.treeId === key) {
                            obj.checked = true;
                            return;    
                        }
                        for (let i in obj) {
                            func(obj[i], key); 
                        } 
                    }
                }
                halfCheckkeysArr.forEach( item =>{
                    func(obj, item);
                })
                checkkeysArr.forEach( item =>{
                    func(obj, item)
                })
            },
            //单个勾选时更新内容
            updatedContentView(data) {
                let newAddArr = this.findLeafItem();
                if(!data.checked) {
                    this.arrayDiff(newAddArr, this.contentArr).forEach( item =>{
                        $('#content2').append('<span data-id='+ item.uniqueId +' style="background:'+ this.colorArr[Math.floor(Math.random()*6)] + ';">'+ item.labelName +'</span>')
                    })
                }else {
                    let diffArr = this.arrayDiff(newAddArr, this.contentArr);
                    for(let i = 0; i < diffArr.length; i++) {
                        $('#content2 span[data-id = '+ diffArr[i].uniqueId+']').remove();
                        this.updatedChecked(this.treesData, diffArr[i], false)
                    }
                }
            },  
            //过滤非叶子节点
            findLeafItem() {
                return this.$refs.tree.getCheckedNodes().filter( item =>{
                    return !item.children || JSON.stringify(item.children) =='[]';
                })
            },
            //找出两个数组不同项
            arrayDiff(arr1, arr2) {
                return diff(arr1, arr2).concat( diff(arr2, arr1) );
                function diff(arr1, arr2) {
                    var c = {};
                    arr1.forEach(item=>{ 
                        c[ JSON.stringify(item) ] = 0;
                    });
                    arr2.forEach(item=>{ 
                        delete c[ JSON.stringify(item) ];
                    });
                    return Object.keys(c).map(JSON.parse);
                }
            },
            //更新tree的checked
            updatedChecked(obj, item, checked) {
                if (obj instanceof Object) {
                    if(item == null) {
                        obj.checked = checked;
                    }else if( item && item.treeId === obj.treeId) {
                        //单个勾选状态更新checked
                        obj.checked = checked;
                        return;
                    }
                    for (let i in obj) {
                        this.updatedChecked(obj[i], item, checked); 
                    } 
                }
            },
            //获取选中项treeId
            findCheckedItem(obj) {
                if (obj instanceof Object) {
                    //如果父节点checked为false,则该子无选择节点, 直接return
                    if(!obj.checked && obj.children && obj.children.length != 0) {
                        return;
                    }
                    if(obj.checked && obj.children && obj.children.length == 0) {
                        this.selected.push(obj.treeId);
                    }
                    for (let i in obj) {
                        this.findCheckedItem(obj[i]); 
                    } 
                }
            },
            //清空右侧内容
            emptyContent() {
                $('#content2').empty();
                this.contentArr = [];
                this.$refs.tree.setCheckedKeys([]);
            },
            //添加右侧内容项
            addItemToView(arr) {
                arr.forEach( item =>{
                    $('#content2').append('<span data-id='+ item.uniqueId +' style="background:'+ this.colorArr[Math.floor(Math.random()*6)] + ';">'+ item.labelName +'</span>')
                    this.updatedChecked(this.treesData, item, true)
                })
            },
            ////获取选中项treeId并渲染到右侧视图
            findItem(obj, uniqueId, checked) {
                if (obj instanceof Object) {
                    //如果父节点checked为false,则该子无选择节点, 直接return
                    if(!obj.checked && obj.children && obj.children.length != 0) {
                        return;
                    }
                    if(obj.uniqueId == uniqueId) {
                        obj.checked = checked;
                    }
                    for (let i in obj) {
                        this.findItem(obj[i], uniqueId, checked); 
                    } 
                }
            },
            ////节点动态添加id
            addTreeId(obj) {
                if(obj instanceof Array) {
                    let n = [];
                    for(let i = 0; i < obj.length; i++) {
                        n[i] = this.addTreeId(obj[i]);
                    }
                    return n;
                }else if  (obj instanceof Object) {
                    let n = {}; 
                    obj.treeId = this.treeId;
                    this.treeId++;
                    for (let i in obj) {
                        n[i] = this.addTreeId(obj[i]); 
                    } 
                    return n; 
                }else {
                    return obj;
                }
            },
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
            height: 100%;
            border: 1px solid #D8D8D8;
            overflow-y: auto;
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
