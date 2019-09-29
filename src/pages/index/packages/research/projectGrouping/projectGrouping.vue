<template>
    <div class="cloud-component projectGrouping">
        <div class="component_head flex-between-center">
            <p>{{$route.meta.txt}}</p>
            <div class="head_content cur_pointer">
                <el-button type="primary" @click="onSaveGroup" icon="icon iconfont iconzujian38">保存分组</el-button>
            </div>
        </div>
        <div class="box">
            <div class="aside">
                <p class="aside_title">项目分组</p>
                <ul v-loading="groupLoading" id="groupUl">
                    <li 
                        v-for="(item, index) in groupList" 
                        class="aside_li" 
                        :key="index" 
                        :class="index == activeGroup?'active':''" 
                        @click="selectGroup(item,index)">
                        <span>{{item.groupName}}</span>
                        <el-popover
                            placement="bottom"
                            popper-class="more_popper"
                            trigger="hover">
                            <i  slot="reference" class="icon el-icon-more"></i>
                            <ul class="stepThree_ul">
                                <li @click="showAddDialog('编辑分组',item)">编辑</li>
                                <li @click="deleteGroup(item,index)">删除</li>
                            </ul>
                        </el-popover>
                    </li>
                </ul>
                <el-button class="plus flex-center-center" type="primary" icon="el-icon-plus" @click="showAddDialog('添加分组')">添加分组</el-button>
            </div>
            <div class="content">
                <h2>纳排规则说明</h2>
                <el-input v-for="(item,index) in groupList" :key="index" v-show="index==activeGroup" type="textarea" :rows="20" v-model="item.description" placeholder="您可以输入纳排说明,如：1、分期为||、 |||期(AJCC 7th edition); 2、未行抗肿瘤治疗的初次治疗患者; 3、无其它恶性肿瘤病史; 4、男性或女性，年龄18-70岁" ></el-input>
            </div>
        </div>
        <el-dialog 
            :title="dialgoForm.title" 
            :append-to-body="true"
            @close="closeDialog"
            :visible.sync="dialgoForm.visible" 
            width="45%">
            <el-form :model="dialgoForm" ref="dialgoForm" :rules="dialgoFormRules" label-width="110px"
                    class="ruleFormDialog" @submit.native.prevent v-loading="dialgoForm.loading" label-position="left">
                <el-form-item label="分组名称：" prop="groupName">
                    <el-input 
                        v-model.trim="dialgoForm.groupName" 
                        placeholder="请输入组名称"
                        :maxlength="20"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="saveAddGroup">保 存</el-button>
                <el-button @click="closeDialog">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'projectGrouping',
    data () {
        return {
            dialgoForm: {
                id:'',
                visible: false,
                title: '',
                loading: false,
                groupName: '',
                description:''
            },
            groupList: [],
            activeGroup: 0,
            groupLoading: false,
            dialgoFormRules: {
                groupName: [
                    {required: true, message: '请输入组名称', trigger: 'change'}
                ]
            }
        }
    },
    created() {
        this.getGroupList()
        .then(()=>{
            if(this.groupList.length != 0) {
                this.selectGroup(this.groupList[0],0);
            }
        })
    },  
    methods: {
        selectGroup(item,index) {
            this.activeGroup = index;
            this.textarea = item.description;
            this.getGroupList();
        },
        showAddDialog(title, item) {
            if(title=='编辑分组') {
                this.dialgoForm = {
                    id: item.id,
                    visible: true,
                    title: title,
                    loading: false,
                    groupName: item.groupName,
                    description: item.description
                }
            }else {
                this.dialgoForm = {
                    id: '',
                    visible: true,
                    title: title,
                    loading: false,
                    groupName: '',
                    description: ''
                }
            }
        },
        saveAddGroup() {
            let that = this;
            that.$refs.dialgoForm.validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                this.dialgoForm.visible = true;
                this.dialgoForm.loading = true;
                let params,res;
                try {
                    if(that.dialgoForm.title == "编辑分组"){
                        params = {
                            id: this.dialgoForm.id,
                            groupName: this.dialgoForm.groupName,
                            description: '',
                            subjectInfoId: this.$store.state.user.researchID
                        }
                        res = await that.$http.projectGroupingEdit(params);
                    }else{
                        params = {
                            groupName: this.dialgoForm.groupName,
                            description: '',
                            subjectInfoId: this.$store.state.user.researchID
                        }
                        res = await that.$http.projectGroupingcreate(params);
                    }
                    if (res.code == '0') {
                        this.$mes('success',  res.msg || this.dialgoForm.title+'成功!');
                        this.dialgoForm.visible = false;
                    }else {
                        this.$mes('success',  res.msg || this.dialgoForm.title+'失败');
                    }
                    this.dialgoForm.loading = false;
                    that.getGroupList();
                } catch (error) {
                    this.$mes('error',  data.msg);
                    this.dialgoForm.visible = false;
                    this.dialgoForm.loading = false;
                }
            });
        },
        async getGroupList() {
            this.groupLoading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.projectGroupingGroup(params);
                if (res.code == '0') {
                    this.groupList = res.data;
                }else {
                    this.$mes('error', res.msg);
                }
                this.groupLoading = false;
            } catch (err) {
                this.groupLoading = false;
                console.log(err)
            }
        },
        async onSaveGroup() {
            this.groupLoading = true;
            this.groupList.forEach(item=>{
                item.subjectInfoId =  this.$store.state.user.researchID;
            })
            let params = { groupList: this.groupList }
            try {
                let res = await this.$http.projectGroupingsaveAll(params);
                if (res.code == '0') {
                    this.$mes('success', '保存成功!');
                }else {
                    this.$mes('error', res.msg);
                }
                this.getGroupList();
            } catch (err) {
                console.log(err)
            }
        },
        deleteGroup(item) {
            this.$confirm('确认删除'+item.groupName+'分组？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let params = { 
                    subjectGroupId: item.id
                }
                try {
                    let res = await this.$http.projectGroupingdelete(params);
                    if (res.code == '0') {
                        this.$mes('success', '删除成功!');
                        this.getGroupList();
                    }else {
                        this.$mes('error', res.msg);
                    }
                } catch (err) {
                    console.log(err)
                }
            }).catch((error) => {});
        },
        closeDialog() {
            this.dialgoForm = {
                id:'',
                visible: false,
                title: '',
                loading: false,
                groupName: '',
                description:''
            }
            this.$refs.dialgoForm.resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
    .projectGrouping {
        .box {
            position: relative;
            height: 100%;
            color: #394263;
            .aside {                
                width: 220px;
                .aside_title {
                    font-size: 14px;
                    background-color: #fff;
                    line-height: 36px;
                    text-indent: 20px;
                    border-bottom: 1px solid rgba(229, 235, 236, .7);
                }
                ul {
                    background-color: #fff;
                }
                li {
                    height: 40px;
                    line-height: 40px;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                    position: relative;
                    &.active {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    &:hover {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    span {
                        padding-left: 30px;
                    }
                    .icon {
                            position: absolute;
                            top: 6px;
                            right: 2px;
                            transform: rotate(90deg);
                            font-size: 16px;
                            color: #666;
                        }
                }
                .plus {
                    margin: 20px auto;
                    width: 100%;
                    line-height: 38px;
                }
            }
            .content {
                position: absolute;
                left: 235px;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: #fff;
                padding: 15px;
                h2 {
                    font-size: 16px;
                    margin-bottom: 15px;
                }
            }
        }
    }
</style>

<style lang='less'>
    @import url('../css/common.less');
</style>




