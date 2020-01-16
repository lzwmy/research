<template>
    <div class="TreeBox">
        <p class="noContent" v-if="JSON.stringify(dataTree) == '[]'">暂无数据</p>
        <ul class="dataBaseTree" v-else> 
            <li v-for="(item,index) in dataTree" :key="index">
                <div class="tree_lable" :class="defaultExpandAll?'open':'close'" v-if="filter.val.every( val =>{ return item[filter.key] != val })">
                    <i  @click="onTelescopic" class="el-icon-caret-bottom" v-if="JSON.stringify(item[props.children]) != '[]'"></i>
                    <span v-if="showCheckbox" class="checkbox" :class="(item.checked?'active':'')"><input type="checkbox" @click.stop="onSelectCheckBox(item)" v-model="item.checked"></span>
                    <p @click="onTelescopic" @dblclick="onDblclickNode({data:item})">{{item[props.label]}}</p>
                </div>
                <dataBaseTree 
                    v-if="item[props.children] && JSON.stringify(item[props.children]) != '[]'" 
                    :dataTree="item[props.children]" 
                    :props="props"
                    :filter="filter"
                    :showCheckbox="showCheckbox"
                    @selectTreeUpdate="onselectTreeUpdate"
                    @selectCheckBoxItem="onSelectCheckBoxItem"
                    @dblclickNode="onDblclickNode">
                </dataBaseTree>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "dataBaseTree",
        props: {
            dataTree: {
                type: Array,
                default: () => []
            },
            //标签显示属性值和指定子树为节点
            props: {
                type: Object,
                default: () => ({label:'labelName', children: 'children'})
                
            },
            //是否显示多选框
            showCheckbox: {
                type: Boolean,
                default: false
            },
            //需要过滤的节点（可过江多个值）
            filter: {
                type: Object,
                default: () => ({key:"", val: []})
            },
            //是否默认打开全部节点
            defaultExpandAll: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                oulH: 0,
                currentLeafNode: {}
            }
        },
        mounted() {
        },
        methods:{
            //操作多选框
            onSelectCheckBox(item){
                if(item[this.props.children] && item[this.props.children].length != 0) {
                    if(!item.checked) {
                        this.updatedChecked(item, true);
                    }else if(item.checked) {
                        this.updatedChecked(item, false);
                    }
                }
                this.onSelectCheckBoxItem(item);
                this.onselectTreeUpdate();
                
            },
            //更新tree
            onselectTreeUpdate(){
                setTimeout(()=>{
                    this.changeParent(this.dataTree);
                    this.$emit("selectTreeUpdate",this.dataTree);
                },50)
            },
            //子节点改变时联动父节点状态
            changeParent(dataTree) {
                for(let i = 0; i < dataTree.length; i++) {
                    //当子节点选中时，父级节点也变为选中状态
                    for(let li of dataTree[i][this.props.children]) {
                        if(li.checked == true){
                            dataTree[i].checked = true;
                        }
                    }
                    //取消勾选时，当全部取消时需改变父节点状态
                    let isEmpty = this.findisEmpty(dataTree[i][this.props.children]);
                    if(isEmpty){
                        dataTree[i].checked = false;
                    }
                }
            },
            //判断节点children节点是否全部取消勾选
            findisEmpty(item) {
                if(!item || JSON.stringify(item) == '[]') {
                    return;
                }
                return item.every( li =>{
                    return li.checked == false;
                })
            },
            //点击checked的获取的当前节点
            onSelectCheckBoxItem(data) {
                if(data[this.props.children] && data[this.props.children].length == 0) {
                    this.currentLeafNode = data;
                }
                this.$emit("selectCheckBoxItem", data);
            },
            //当前双击的tree节点
            onDblclickNode({data, leafNode}) {
                if(data[this.props.children] && data[this.props.children].length == []) {
                    leafNode = data;
                }
                this.$emit("dblclickNode", {data, leafNode});
            },
            //tree展示和收缩切换
            onTelescopic(e) {
                let timer;
                clearTimeout(timer);
                timer = setTimeout( ()=>{
                    let oul = $(e.target).parent().next();
                    let oLabel = $(e.target).parent();
                    if(oLabel.hasClass('open')){
                        oul.hide();
                        oLabel.removeClass('open');
                        oLabel.addClass('close');
                    }else{
                        oul.show();
                        oLabel.removeClass('close');
                        oLabel.addClass('open');
                    }
                }, 50)
            },
            //更新tree状态
            updatedChecked(obj, checked) {
                if (obj instanceof Object) {
                    obj.checked = checked;
                    for (let i in obj) {
                        this.updatedChecked(obj[i], checked); 
                    } 
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .left > .TreeBox{
        margin-left: 0px;
        min-width: 100%;
        & > .dataBaseTree {
            margin-left: 0;
        }
    } 
    .TreeBox {
        height: 100%;
    }
    .noContent {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #ff711b;
    }
    ul.dataBaseTree {
        color: #5a5e66;
        font-size: 12px;
        margin-left: 25px;
        // max-width: 100%;
        min-width: 150px;
        .tree_lable {
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            padding: 0 5px;
            margin: 2px 0;
            &:hover {
                background: #f5f7fa;
            }
            &.open .el-icon-caret-bottom{
                transform: rotateZ(-90deg);
            }
            &.close .el-icon-caret-bottom{
                transform: rotateZ(0deg);
            }
            cursor: pointer;
            .el-icon-caret-bottom {
                font-size: 12px;
                width: 14px;
                height: 14px;
                color: #b4bccc;
                margin-right: 1px;
                transition: all 300ms;
            }
            .checkbox {
                margin-right: 4px;
                position: relative;
                border: 1px solid #d8dce5;
                border-radius: 2px;
                box-sizing: border-box;
                flex-shrink: 0;
                width: 14px;
                height: 14px;
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &.active {
                    border-color: transparent;
                    background: #1bbae1;
                    &::after {
                        content: "";
                        animation: animationCheckBoc  150ms forwards;
                        width: 3px;
                        height: 7px;
                        position: absolute;
                        top: -1px;
                        left: 20%;
                        margin-left: auto;
                        margin-right: auto;
                        border: none;
                        border-right: 1px solid #fff;
                        border-bottom: 1px solid #fff;
                        transform-origin: 0 100%;
                    }
                }
                input{
                    display: inline-block;
                    position: absolute;
                    z-index: 10;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    opacity: 0;
                }
            }
            p {
                flex: 1;
                line-height: 26px;
                white-space: nowrap;
                user-select: none;
            }
        }
    }

    @keyframes animationCheckBoc {
        0% { transform: scale(0) rotate(45deg); };
        60% { transform: scale(1.2)  rotate(45deg); };
        80% { transform: scale(0.8)  rotate(45deg); };
        100% { transform: scale(1) rotate(45deg); };
    }
</style>
