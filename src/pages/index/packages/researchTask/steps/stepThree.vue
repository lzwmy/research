<template>
    <div class="stepThree" v-loading="loading" element-loading-background="rgba(255, 255, 255, .5)">
        <div class="cloud-search flex-between-center">
            <p class="title">创建项目</p>
            <div>
                <el-button @click="preStep">上一步</el-button>
                <el-button type="primary" @click="finish">完 成</el-button>
            </div>
        </div>
        <div class="main">
            <slot></slot>
            <div class="box flex-start-start">
                <div class="aside">
                    <p class="label text_center">项目分组</p>
                    <ul id="groupUl">
                        <li 
                            v-for="(item, index) in groupList" 
                            :key="index" 
                            class="aside_li text_center" 
                            :class="index == activeGroup?'active':''" 
                            @click="selectGroup(index,item)"
                            @dblclick="editGroup(index)">
                            <span v-show="!item.edit">{{item.name}}</span>
                            <el-input @keyup.enter.native="addGroup(index)" @blur="addGroup(index)" class="groupUl" v-show="item.edit" v-model="item.name"></el-input>
                            <el-popover
                                placement="bottom"
                                v-show="!item.edit"
                                popper-class="more_popper"
                                trigger="hover">
                                <i  slot="reference" class="icon el-icon-more"></i>
                                <ul class="stepThree_ul">
                                    <li @click="editGroup(index)">编辑</li>
                                    <li v-show="groupList.length != 1" @click="deleteGroup(index)">删除</li>
                                </ul>
                            </el-popover>
                        </li>
                    </ul>
                    <el-button class="plus flex-center-center" icon="el-icon-plus" @click="addGroupInput">添加分组</el-button>
                </div>
                <div class="content">
                    <p class="label">纳排规则说明</p>
                    <el-input v-for="(item, index) in groupList" :key="index" v-show="activeGroup == index"  type="textarea" :rows="17" v-model.trim="item.ruleDesc" placeholder="您可以输入纳排说明，如：1.分期为II、III期(AJCC 7th edition)；2.未行抗肿瘤治疗的初次治疗患者；3.无其他恶性肿瘤病史； 4.男性或女性，年龄18-70岁；"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['formData'],
    data () {
        return {
            loading: false,
            groupList: [{
                id: 1,
                name: '分组1',
                ruleDesc:''
            }],
            activeGroup: 0
        }
    },
    created() {
        this.formData.proType = 'edit';
    },
    methods: {
        preStep() {
            this.$emit('changeStep', 1, this.formData);
        },
        selectGroup(index,item) {
            this.activeGroup = index;
        },
        addGroupInput() {
            let n = parseInt(this.groupList[this.groupList.length - 1].id) + 1;
            this.groupList.push({
                id: n,
                name: '分组'+ n,
                ruleDesc:''
            })
        },
        addGroup(index) {
            this.$set(this.groupList[index],'edit',false);
        },
        editGroup(index) {
            this.$set(this.groupList[index],'edit',true);
            this.$nextTick(()=>{
                $("#groupUl li input").focus();
            })
        },
        finish() {
            this.loading = true;
            let groupList = [];
            this.groupList.forEach(item=>{
                groupList.push({
                    groupName: item.name, 
                    description: item.ruleDesc, 
                });
            })
            let formData = {
                id: this.formData.id,
                centerPattern:  this.formData.centerPattern,
                subjectName: this.formData.subjectName, 
                purpose: this.formData.purpose,
                targetPatientNum:  this.formData.targetPatientNum, 
                description: this.formData.description, 
                fileId: this.formData.fileId,
                groupList: groupList
            }
            try {
                if(this.formData.proType == 'edit') {
                    this.deleteProject(formData.id)
                    .then( ()=>{
                        this.createProject(formData);
                    })
                }else {
                    this.createProject(formData);
                }
            } catch (err) {
                console.log(err)
            }
        },
        deleteGroup(index) {
            this.$confirm('确认删除该分组？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.groupList.splice(index,1)
            }).catch((error) => {});
        },
        async deleteProject(id) {
            let params = {
                subjectInfoId: id
            }
            try {
                let res = await this.$http.RTASKdelete(params);
                if (res.code != '0') {
                    this.$mes('error', res.msg);
                }
            } catch (err) {
                console.log(err)
            }
        },
        async createProject(formData) {
            try {
                let res = await this.$http.RTASKcreate(formData);
                if (res.code == '0') {
                    this.$mes('success','创建成功!');
                    this.$store.commit('saveresearchInfo',{
                        subjectInfoId: res.data,
                        centerModel: this.formData.centerPattern
                    });
                    setTimeout(()=>{
                        let data = this.$store.state.user.taskMenuList;
                        let params = {
                            title: '科研课题',
                            fromRouter: {
                                path: this.$route.path,
                                meta: this.$route.meta
                            },
                            menuList: data.params
                        }
                        sessionStorage.setItem('insideMenuData',JSON.stringify(params))
                        this.loading = false;
                        this.$router.push({
                            name: "projectProgress",
                            params: params
                        })
                    },300)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
};
</script>

<style lang="less"> 
    @import url('../../research/css/common.less');
    .stepThree {
        .box {
            height: 430px;
            border: 1px solid #eee;
            .label {
                color: rgba(57, 66, 99, 1);
                font-size: 16px;
                font-weight: bold;
                line-height: 56px;
                padding: 0 10px;
                border-bottom: 1px solid rgba(235, 237, 242, 1);
            }
            .aside {
                width: 220px;
                height: 100%;
                border-right: 1px solid rgba(235, 237, 242, 1);
                overflow-y: auto;
                ul {
                    li {
                    }
                }
                .plus {
                    margin: 20px auto;
                    border: 1px solid rgba(67, 154, 255, 1);
                    color: rgba(67, 154, 255, 1);
                }
            }
            .content {
                flex: 1;
                padding: 0;
                .el-textarea__inner {
                    border: none;
                }
            }
        }
    }
    
</style>




