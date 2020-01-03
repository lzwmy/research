<template>
    <div class="cloud-component treeCustom">
        <div class="component_head flex-between-center">
            <p>
                <span class="back" @click="$router.push({path:'/knowledgeChart',query: {id:$route.query.id}})"><i class="icon iconfont iconfanhui"></i>返回</span>
                {{$route.meta.txt}}
                </p>
            <div class="head_content cur_pointer">
            </div>
        </div>
        <!-- 搜索区域 -->
        <div class="cloud-search el-form-item-small flex-end-center"></div>
        <!--搜索结果-->
        <div class="cloud-search-list" v-loading='loading'>
            <el-tree
                :data="treeData"
                node-key="treeId"
                default-expand-all
                :props="defaultProps"
                :expand-on-click-node="false">
                <div class="custom-tree-node flex-between-center" slot-scope="{ node, data }">
                    <span class="label" @dblclick="editNodePrompt(node,data)">{{ node.label }}</span>
                    <div class="right-btn-group flex-center-center">
                        <el-switch
                            v-if="node.level != 1"
                            v-model="data.status"
                            active-color="#13ce66">
                        </el-switch>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => append(data)">
                            <i class="el-icon el-icon-plus"></i>
                        </el-button>
                        <el-button
                            v-if="node.level != 1"
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            <i class="el-icon el-icon-minus"></i>
                        </el-button>
                    </div>
                </div>
            </el-tree>
        </div>
    </div>
</template>

<script>
import utils from 'components/utils/index';


export default {
    name: 'treeCustom',
    data () {
        return {
            loading: false,
            treeId: 1,
            defaultProps: {
                children: 'children',
                label: 'nodeName'
            },
            treeData: [
                {
                    treeId: 1,
                    nodeId: this.$store.state.user.diseaseInfo.diseaseId,
                    nodeName: this.$store.state.user.diseaseInfo.diseaseName,
                    status: null,
                    parentNodeId: '',
                    parentNodeName: "",
                    diseaseId: this.$store.state.user.diseaseInfo.diseaseId,
                    diseaseName: this.$store.state.user.diseaseInfo.diseaseName,
                    children: []
                }
            ],
        }
    },
    computed: {
        diseaseId: function() {
            return this.$store.state.user.diseaseInfo.diseaseId;
        },
    },
    watch: {
        diseaseId: function(newVal) {
            this.treeId = 1;
            this.treeData = [
                {
                    treeId: 1,
                    nodeId: this.$store.state.user.diseaseInfo.diseaseId,
                    nodeName: this.$store.state.user.diseaseInfo.diseaseName,
                    status: null,
                    parentNodeId: '',
                    parentNodeName: "",
                    diseaseId: this.$store.state.user.diseaseInfo.diseaseId,
                    diseaseName: this.$store.state.user.diseaseInfo.diseaseName,
                    children: []
                }
            ];
            this.getTreeData();
        }
    },
    created() {
        this.getTreeData()
    },
    methods: {
        append(data) {
            let that = this;
            this.$prompt('节点名称:', '添加', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                customClass: 'customTreeClass',
                inputErrorMessage: '请输入正确名称',
                inputPattern: /\S/,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        let newChild = { 
                            "nodeId": '',
                            "nodeName": instance.inputValue,
                            "status": null,
                            "parentNodeId": data.nodeId,
                            "parentNodeName": data.nodeName,
                            "diseaseId": data.diseaseId,
                            "diseaseName": data.diseaseName,
                            children: []
                        };
                        console.log(Object.assign(newChild,{treeId: ++this.treeId}))
                        that.editNode(newChild, instance.inputValue).then(()=>{
                            if(!data.children) {
                                that.$set(data, 'children', []);
                            }
                            data.children.push(Object.assign(newChild,{treeId: ++this.treeId}));
                            instance.confirmButtonLoading = false;
                            done();
                        }).catch((err)=>{
                            instance.confirmButtonLoading = false;
                            console.log(err)
                        });
                    } else {
                        done();
                    }
                }
            })
        },

        remove(node, data) {
            this.$confirm('确认删除 ('+data.nodeName+') 节点?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.deleteNode(data).then(()=>{
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.nodeId === data.nodeId);
                    children.splice(index, 1);
                })
            }).catch(() => {});
        },

        editNodePrompt(node,data) {
            if(node.level == 1) {
                return;
            }
            let that = this;
            this.$prompt('节点名称:', '编辑', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                customClass: 'customTreeClass',
                inputErrorMessage: '请输入正确名称',
                inputPattern: /\S/,
                inputValue: data.nodeName,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        let newChild = { 
                            "nodeId": data.nodeId,
                            "nodeName": instance.inputValue,
                            "status": null,
                            "parentNodeId": data.parentNodeId,
                            "parentNodeName": data.parentNodeName,
                            "diseaseId": data.diseaseId,
                            "diseaseName": data.diseaseName,
                            children: []
                        };
                        that.editNode(newChild, instance.inputValue).then(()=>{
                            done();
                            data.nodeName = instance.inputValue;
                            instance.confirmButtonLoading = false;
                        }).catch(()=>{
                            instance.confirmButtonLoading = false;
                        });
                    } else {
                        done();
                    }
                }
            })
        },

        async editNode(data, value) {
            let formData = {
                "id": data.nodeId || '',
                "nodeName": value,
                "status": data.status,
                "parentNodeId": data.parentNodeId,
                "parentNodeName": data.parentNodeName,
                "diseaseId": data.diseaseId,
                "diseaseName": data.diseaseName,
            }
            try {
                let res = await this.$http.KCeditTreeNode(formData);
                if (res.code == 0) {
                    this.$mes('success',data.nodeId?'编辑成功!':'添加成功!')
                    return Promise.resolve()
                }else {
                    return Promise.reject()
                }
            } catch (err) {
                console.log(err)
            }
        },

        async deleteNode(data) {
            let formData = {
                "nodeId": data.nodeId,
            }
            try {
                let res = await this.$http.KCdeleteTreeNode(formData);
                if (res.code == 0) {
                    this.$mes('success','删除成功!')
                    return Promise.resolve()
                }else {
                    return Promise.reject()
                }
            } catch (err) {
                console.log(err)
            }
        },

        async getTreeData() {
            this.loading = true;
            let formData = {
                diseaseId: this.$route.query.id
            }
            try {
                let res = await this.$http.KCgetTreeData(formData);
                if (res.code == 0) {
                    this.treeData[0].children = this.addTreeId(res.data);
                }
            } catch (err) {
                console.log(err)
            }
            this.loading = false;
        },

        //添加treeid
        addTreeId(obj) {
            if(obj instanceof Array) {
                let n = [];
                for(let i = 0; i < obj.length; i++) {
                    n[i] = this.addTreeId(obj[i]);
                }
                return n;
            }else if  (obj instanceof Object) {
                let n = {}; 
                obj.treeId = ++this.treeId;
                for (let i in obj) {
                    n[i] = this.addTreeId(obj[i]); 
                } 
                return n; 
            }else {
                return obj;
            }
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
        .el-tree-node__expand-icon {
            font-size: 14px;
        }
        .custom-tree-node {
            flex: 1;
            font-size: 14px;
            .label {
                flex: 1;
            }
            .right-btn-group {
                .el-switch {
                    margin-right: 10px; 
                }
                .el-button {
                    padding: 0 5px;
                    .el-icon {
                        font-size: 18px;
                        color: #555;
                    }
                    &:hover {
                        .el-icon {
                            color: #1bbae1;
                        }
                    }
                } 
            }
        }
    }
    .customTreeClass.el-message-box {
        .el-message-box__content {
            padding: 35px 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .el-message-box__message {
                margin-right: 15px;
                p {
                    line-height: 32px;
                }
            }
            .el-message-box__input {
                flex: 1;
            }
        }
        .el-message-box__btns {
            display: flex;
            flex-direction: row-reverse;
            justify-content: center;
            align-items: center;
            .el-button {
                margin: 0 10px;
            }
        }
    }
</style>


