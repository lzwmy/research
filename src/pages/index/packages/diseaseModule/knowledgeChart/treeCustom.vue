<template>
    <div class="cloud-component treeCustom">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <!-- <el-button  type="primary" icon="icon iconfont iconzujian44" @click="">保 存</el-button> -->
            </div>
        </div>
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small flex-end-center"></div>
        <!--搜索结果-->
        <div class="cloud-search-list">
            <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
                <div class="custom-tree-node flex-between-center" slot-scope="{ node, data }">
                    <span class="label">{{ node.label }}</span>
                    <div class="right-btn-group">
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => append(data)">
                            Append
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            Delete
                        </el-button>
                    </div>
                </div>
            </el-tree>
        </div>
    </div>
</template>

<script>
import utils from 'components/utils/index';
let id = 1000;

export default {
    name: 'treeCustom',
    data () {
        const data = [{
            id: 1,
            label: '一级 1',
            children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                    id: 9,
                    label: '三级 1-1-1'
                }, {
                    id: 10,
                    label: '三级 1-1-2'
                }]
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                id: 5,
                label: '二级 2-1'
                }, {
                id: 6,
                label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                id: 7,
                label: '二级 3-1'
                }, {
                id: 8,
                label: '二级 3-2'
                }]
        }];
        return {
            treeData: {
                nodeId: null,
                nodeName: '',
                status: '',
                parentNodeId: '',
                parentNodeName: "",
                diseaseId: "",
                diseaseName: "",
                children: [
                    {}
                ]
            },
            data: JSON.parse(JSON.stringify(data)),
            data: JSON.parse(JSON.stringify(data))
        }
    },
    methods: {
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },

        remove(node, data) {
            console.log(node)
            console.log(data)
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },
    },
};
</script>

<style lang="less">
    .treeCustom {
        .cloud-search-list {
            position: absolute;
            top: 75px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            background-color: #fff;
            padding: 15px;
            overflow: auto;
        }
        .custom-tree-node {
            flex: 1;
            font-size: 14px;
            padding-right: 8px;
            .label {
                margin-left: 8px;
            }
        }
    }
</style>


