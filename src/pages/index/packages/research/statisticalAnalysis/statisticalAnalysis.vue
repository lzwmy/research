<template>
    <div class="cloud-component statisticalAnalysis flex-between-start">
        <!-- <img src="../images/statisticalAnalysis.png" alt="" width="100%"> -->
        <aside>
            <div class="top">
                <el-select v-model="selectGroup" placeholder="请选择">
                    <el-option
                        v-for="(item,index) in selectGroupList"
                        :key="index"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
                <p class="color_1">290585个研究对象</p>
            </div>
            <div class="content">
                <div class="select flex-between-center">
                    <p class="label font_14 color_1" style="width: 90px;">指标列表</p>
                    <el-select v-model="selectTarget" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in selectTargetList"
                            :key="index"
                            :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </div>
                <ul>
                    <!-- :move="draggableRemoveCallBack" -->
                    <draggable 
                    v-model="targetList" 
                    :group='{name: "menu", put: false, pull: "clone"}' 
                    :sort='false'
                    @end="onEndCallBack" 
                    :move="draggableRemoveCallBack">
                            <li class="flex-between-center" v-for="(item, index) in targetList" :key="index">
                                <p class="color_1">{{item.label}}</p>
                                <span>{{item.type == 1?'分类':'连续'}}</span>
                            </li>
                    </draggable>
                </ul>
            </div>
        </aside>
        <div class="main">
            <div class="tags color_1 font_14">
                <span @click="selectTag(0)" :class="activeTag == 0?'active':''">描述性统计</span>
                <span @click="selectTag(1)" :class="activeTag == 1?'active':''">单因素分析</span>
            </div>
            <div class="wrap flex-between-start">
                <div class="left">
                    <div class="content">
                        <div class="top flex-between-center">
                            <div class="domain flex-start-center">
                                    <div v-for="(item, index) in domainList" v-show="item.type == activeTag" :key="index" class="box flex-center-center flex-wrap" :class="item.draggableList.length!=0?'active':''">
                                        <svg class="icon" aria-hidden="true"><use :xlink:href="item.draggableList.length==0?'#iconzujian40':'#iconzujian39'"></use></svg>
                                        <p>{{item.label}}</p>
                                        <draggable 
                                            @end="onEndCallBack" 
                                            :move="draggableRemoveCallBack"
                                            class="draggable flex-center-center" 
                                            :data-id="index" v-model="item.draggableList" 
                                            :group='{name: "menu",put: true, pull: "clone"}' 
                                            :sort="false">
                                            <div class="li" v-for="(li, index) in item.draggableList" :key="index">{{li.label}}</div>
                                        </draggable>
                                    </div>
                            </div>
                            <el-button type="primary" icon="icon iconfont iconzujian38" @click="">保存到项目</el-button>
                        </div>
                        <contentAnalysis></contentAnalysis>
                    </div>
                </div>
                <div class="right">
                    <p class="page_title">已保存的统计结果</p>
                    <ul>
                        <li v-for="(item, index) in statisticalResultsList" :key="index">
                            <p>{{item.text}}<i class="icon el-icon-close" @click="onDeleteResult(item)"></i></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import contentAnalysis from './contentAnalysis'
export default {
    name: 'statisticalAnalysis',
    data () {
        return {
            activeTag: 0,
            selectGroupList:[
                {label:'分组1'},
                {label:'分组2'},
                {label:'分组3'},
                {label:'分组4'}
            ],
            selectGroup: '',
            selectTarget: '',
            selectTargetList: [
                {label:'分部'},
                {label:'分类'},
                {label:'连续'}
            ],
            targetList: [
                { label: '性别1', type: 1},
                { label: '民族2', type: 2},
                { label: '性别3', type: 1},
                { label: '民族4', type: 2},
                { label: '性别5', type: 1},
                { label: '民族6', type: 2},
                { label: '性别7', type: 1},
                { label: '民族8', type: 2},
                { label: '性别9', type: 1},
                { label: '民族10', type: 2},
                { label: '性别11', type: 1}
            ],
            domainList: [
                {type: 0, label: '将变量拖入此区可进行新的分析', draggableList: []},
                {type: 1, label: '分组变量拖拽区域', draggableList: []},
                {type: 1, label: '结果变量拖拽区域', draggableList: []}
            ],
            //被拖拽的目标对象
            targetElemnt: {},
            statisticalResultsList: [
                {text:'Xxx关于xxx的单因素分析 样本：队列1-实验组'},
                {text:'Xxx关于xxx的单因素分析 样本：队列1-实验组'}
            ]
        }
    },
    components: {
        draggable,
        contentAnalysis
    },
    methods: {
        selectTag(val) {
            this.activeTag = val;
        },
        //拖拽后的回调
        onEndCallBack(data) {
            if(data.to.dataset.id == undefined) {
                return;
            }
            this.domainList.forEach((item)=>{
                item.draggableList = [];
            })

            this.domainList[data.to.dataset.id].draggableList = [this.targetElemnt];
        },
        //获取拖拽的对象
        draggableRemoveCallBack(data) {
            this.targetElemnt = data.draggedContext.element;
        },
        //删除已保存的统计结果
        onDeleteResult(item) {
            this.$confirm('确认删除该条结果？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // let formData = {
                //     id: row.id
                // };
                // try {
                //     let data = await this.$http.ORGdeleteUserList(formData);
                //     if (data.code == '0') {
                //         this.$mes('success',data.message || '删除成功');
                //         this.getDataList(this.paging.currentPageNo, this.paging.currentPageSize);
                //     }
                // } catch (error) {
                //     this.$mes('error', '删除出错');
                // }
            }).catch((error) => {});
        }
    }
};
</script>

<style lang="less"> 
    .statisticalAnalysis {
        height: 100%;
        aside {
            height: 100%;
            position: relative;
            width: 240px;
            background-color: #fff;
            margin-right: 30px;
            .top {
                padding: 15px 15px 10px;
                border-bottom: 1px solid #E5E8EB;
                .el-select {
                    display: inline;
                    text-align: center;
                }
                & > p {
                    margin-top: 10px;
                }
            }
            .content {
                padding: 0 15px;
                position: absolute;
                top: 90px;
                bottom: 0;
                left: 0;
                right: 0;
                ul{
                    position: absolute;
                    top: 40px;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    overflow-y: auto;
                    padding: 0 15px;
                    li {
                        cursor: move;
                        border: 1px solid #EBEDF2;
                        height: 36px;
                        font-size: 14px;
                        padding-left: 10px;
                        margin-bottom: 10px;
                        color: #394263;
                        span {
                            width: 48px;
                            height: 100%;
                            text-align: center;
                            line-height: 36px;
                            color: #1BB7DD;
                            background:rgba(27,186,225,0.1);
                        }
                    }
                } 
            }
        }
        .main {
            height: 100%;
            flex: 1;
            position: relative;
            .tags {
                height: 36px;
                span {
                    border: 1px solid #eee;
                    line-height: 36px;
                    width: 100px;
                    display: inline-block;
                    text-align: center;
                    cursor: pointer;
                    &.active {
                        background-color: #fff;
                    }
                }
            }
            .wrap {
                background-color: #fff;
                position: absolute;
                top: 36px;
                bottom: 0;
                left: 0;
                right: 0;
                .left {
                    flex: 1;
                    height: 100%;
                    overflow-y: auto;
                    border: 1px solid #eee;
                    padding: 15px;
                    .content {
                        .top {
                            height: 90px;
                            .domain {
                                .box {
                                    width: 274px;
                                    height: 86px;
                                    border: 1px dashed #C5C8CB;
                                    margin-right: 15px;
                                    padding: 10px;
                                    position: relative;
                                    &.active {
                                        border: 1px solid #1BBAE1;
                                        p {
                                            color: #1BBAE1;
                                        }
                                    }
                                    .icon {
                                        width: 60px;
                                        height: 30px;
                                    }
                                    p {
                                        width: 100%;
                                        color: #C5C8CB;
                                        text-align: center;
                                    }
                                    .draggable {
                                        position: absolute;
                                        top: 0 ;
                                        right: 0;
                                        left: 0;
                                        bottom: 0;
                                        cursor: move;
                                        .li {
                                            position: absolute;
                                            top: 0 ;
                                            right: 0;
                                            left: 0;
                                            bottom: 0;
                                            font-size: 20px;
                                            width: 100%;
                                            text-align: center;
                                            line-height: 86px;
                                            height: 100%;
                                            background-color: #fff;
                                            color: #1BBAE1;
                                            opacity: 0.9;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .right {
                    width: 200px;
                    height: 100%;
                    border: 1px solid #eee;
                    border-left: none;
                    padding: 15px;
                    position: relative;
                    ul {
                        position: absolute;
                        top: 50px;
                        left: 15px;
                        right: 15px;
                        bottom: 10px;
                        li {
                            position: relative;
                            margin-bottom: 10px;
                            border: 1px solid #eee;
                            padding: 10px;
                            color: #495057;
                            overflow: hidden;
                            line-height: 1.3em;
                            &:hover {
                                .icon {
                                    background-color: #FF4C4C;
                                }
                            }
                            .icon {
                                cursor: pointer;
                                position: absolute;
                                display: inline-block;
                                top: -17px;
                                right: -17px;
                                width: 32px;
                                height: 32px;
                                line-height: 46px;
                                text-indent: 3px;
                                font-size: 12px;
                                background-color: #ACACAC;
                                color: #fff;
                                border-radius: 50%;
                            }
                        }
                    } 
                }
            }
        }
    }
</style>




