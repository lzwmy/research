<template>
    <div class="inside_header flex-start-center" :class="$store.state.common.openMenuView?'open':'close'">
        <el-button type="text" @click="handleMenuView">
            <span class="menuBtn" :class="$store.state.common.openMenuView?'el-icon-s-fold':'el-icon-s-unfold'"></span>
        </el-button>
        <el-popover
            v-if="$route.meta.belongToGroup == 'insideView' && loginType != 'disease'"
            placement="top-start"
            title=""
            :popper-class="'popover_disease ' + $store.state.common.openMenuView"
            class="popover_disease"
            width="100%"
            v-model="popoverVisible"
            :visible-arrow="false"
            trigger="click">
            <ul class="disease_content flex-start-center flex-wrap">
                <li v-for="(item,index) in dataList" :key="index" @click="handleSelect(item)"> 
                    <div class="disease_img" :class="'thumbnail-img ' + item.logo + '_bgColor'">
                        <img :src="'./static/img/disease-logo/' + item.logo+ '.svg'">
                    </div>
                    <p class="text-center">{{item.name}}</p>
                </li>
            </ul>
            <div slot="reference" class="flex-between-center">{{disease}}<span v-if="!disease">请选择病种</span><i class="el-icon-arrow-down el-icon--right"></i></div>
        </el-popover>

        <!-- 组织机构和医生 -->

        <el-popover
            class="orgDoctorSelect"
            popper-class="orgDoctorSelect"
            placement="bottom"
            width="230"
            :visible-arrow="true"
            v-if="$route.meta.belongToGroup == 'insideView'"
            :disabled='!this.$store.state.user.diseaseInfo.isAdmin && (!selectNoDisable || !selectOrgNoDisable)'
            v-model="orgPopoverVisible"
            trigger="click">

            <div slot="reference" class="flex-between-center" :class="(!this.$store.state.user.diseaseInfo.isAdmin && (!selectNoDisable || !selectOrgNoDisable))?'disabled':''">{{orgInfo.orgName}}<span v-if="!orgInfo.orgName">全部机构</span><i class="el-icon-arrow-down el-icon--right"></i></div>
            <div>
                <el-input placeholder="请搜索机构"  prefix-icon="el-icon-search" v-model="orgInfoInput" clearable></el-input>
                <div class="content">
                    <div v-for="(item,index) in filterOrgList" :key="index">
                        <p @click="selectOrg(item)" :class="orgInfo.orgCode==item.orgCode?'active':''">{{item.orgName}}</p>
                    </div>
                    <span v-if="filterOrgList.length==0" class="empty" style="padding:0 20px;">暂无数据</span>
                </div>
            </div>
        </el-popover>
        <el-popover
            class="orgDoctorSelect"
            popper-class="orgDoctorSelect"
            placement="bottom"
            width="230"
            :visible-arrow="true"
            v-if="$route.meta.belongToGroup == 'insideView'"
            :disabled='!this.$store.state.user.diseaseInfo.isAdmin && !selectNoDisable'
            v-model="doctorPopoverVisible"
            trigger="click">
            <div slot="reference" class="flex-between-center" :class="(!this.$store.state.user.diseaseInfo.isAdmin && !selectNoDisable)?'disabled':''">{{doctorInfo.userName}}<span v-if="!doctorInfo.userName">所有医生</span><i class="el-icon-arrow-down el-icon--right"></i></div>
            <div>
                <el-input placeholder="请搜索医生"  prefix-icon="el-icon-search" v-model="doctorInput" clearable></el-input>
                <div class="content">
                    <p v-for="(item,index) in filterDoctorList" :key="index" @click="doctorInfo = item;doctorPopoverVisible = false;"
                    :class="doctorInfo.id==item.id?'active':''">{{item.userName}}</p>
                    <span v-if="filterDoctorList.length==0" class="empty" style="padding:0 20px;">暂无数据</span>
                </div>
            </div>
        </el-popover>

        <p v-if="$route.meta.belongToGroup == 'researchTask' && $store.state.user.researchInfo.centerModel == 2" @click="shareLogin" class="researchLogin flex-center-center">项目分享<span class="icon iconfont iconfenxiang left_6"></span></p>
        <p v-if="$route.meta.belongToGroup == 'insideView'" @click="shareLogin" class="researchLogin flex-center-center">专病分享<span class="icon iconfont iconfenxiang left_6"></span></p>

        <el-dialog 
            title="" 
            :append-to-body="true"
            :visible.sync="dialgoForm.visible" 
            class="projectShare"
            width="950px">
            <el-form :model="dialgoForm" label-width="110px"
                    class="ruleFormDialog" @submit.native.prevent v-loading="dialgoForm.loading" label-position="left">
                <el-form-item label="分享地址:">
                    <el-input v-model.trim="dialgoForm.url" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" v-clipboard:copy="dialgoForm.url"  v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError">复 制</el-button>
                <el-button @click="dialgoForm.visible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import '../../../pages/index/packages/SDResearch/card_bgColor.less';
import utils from 'components/utils/index'
export default {
    name: 'insideHeader',
    data () {
        let shareUrl = this.$route.meta.belongToGroup == 'researchTask'?'/loginResearch.html?id='+ this.$store.state.user.researchInfo.subjectInfoId:'/loginDisease.html?id='+ this.$store.state.user.diseaseInfo.diseaseId
        let path = window.location.pathname.split('/index.html')[0]
        return {
            loginType: '',      //登录类型
            disease: "",
            popoverVisible: false,
            dataList: [],   //专病列表
            //项目分享弹框
            dialgoForm: {
                url: window.location.origin+path+shareUrl,
                visible: false
            },
            orgList: [],
            doctorList: [],
            orgInfoInput: '',
            doctorInput: '',    
            orgInfo: {},  //机构 
            orgPopoverVisible:false,
            doctorPopoverVisible: false,
            doctor: '',     //医生
            doctorInfo: '',
            selectNoDisable: utils.arrayExistAttr([1,2,4],this.$store.state.user.diseaseInfo.roles,null,false),
            selectOrgNoDisable: utils.arrayExistAttr([1],this.$store.state.user.diseaseInfo.roles,null,false)
        };
    },
    watch: {   
        $route: function(newVal) {
            this.disease = "";
            this.dataList.forEach(item => { 
                if(this.$route.query.id == item.id) {
                    this.disease = item.name;
                }
            });
        },
        doctorInfo: function(newVal) {
            this.$store.commit('saveDiseaseInfo',
                Object.assign(utils.deepCopy(this.$store.state.user.diseaseInfo),{
                    doctor: this.doctorInfo.id,
                    doctorName: this.doctorInfo.userName
                })
            );
        }
    },
    computed: {
        filterOrgList() {
            return this.orgList.filter(li=>{
                return li.orgName.toLowerCase().indexOf(this.orgInfoInput.toLowerCase()) != -1;
            })
        },
        filterDoctorList() {
            return this.doctorList.filter(li=>{
                return li.userName.toLowerCase().indexOf(this.doctorInput.toLowerCase()) != -1;
            })
        },
    },
    created () {
        this.orgInfo = {
            orgCode: this.$store.state.user.diseaseInfo.orgCode,
            orgName: this.$store.state.user.diseaseInfo.orgName
        }
        this.doctorInfo = {
            id: this.$store.state.user.diseaseInfo.doctor,
            userName: this.$store.state.user.diseaseInfo.doctorName,
        }
        this.loginType = localStorage.getItem('CURR_LOGIN_TYPE')
        //专病模块下
        if(this.$route.meta.belongToGroup == 'insideView') {
            this.getOrgList(this.$store.state.user.diseaseInfo.diseaseId)
            this.getDoctorList();
            this.getDataList().then(()=>{
                this.dataList.forEach(item => { 
                    if(this.$route.query.id == item.id) {
                        this.disease = item.name;
                    }
                });
                this.$store.commit('saveDiseaseInfo',
                    Object.assign(utils.deepCopy(this.$store.state.user.diseaseInfo),{
                        diseaseName:this.disease
                    })
                );
            })
        }
    },
    methods: {
        handleMenuView() {
            this.$store.commit("changeMenuView", !this.$store.state.common.openMenuView);
        },
        handleSelect(item) {
            this.disease = item.name;
            this.popoverVisible = false;
            this.getOrgList(item.id);
            this.$emit('diseaseSelect', item)
        },
        //选择机构
        selectOrg(row) {
            this.orgInfo = row;
            this.orgPopoverVisible = false;
            this.doctorInfo = {
                userName: '所有医生',
                id: ''
            };
            this.getDoctorList();
            this.$store.commit('saveDiseaseInfo',
                Object.assign(utils.deepCopy(this.$store.state.user.diseaseInfo),{
                    orgCode: this.orgInfo.orgCode,
                    orgName: this.orgInfo.orgName
                })
            );
        },
        async getDataList () {
            this.loading = true;
            try {
                let res = await this.$http.findDiseaseSpecies();
                this.loading = false;
                if(res.code == '0') {
                    this.dataList = res.data.diseaseSpecieses;
                }
            } catch (error) {
                console.log(error);
            }
        },
        shareLogin() {
            this.dialgoForm.visible = true;
        },
        onCopySuccess(e) {
            this.$mes('success', '复制成功！');
            setTimeout(()=>{
                this.dialgoForm.visible = false;
            },500)
        },
        onCopyError(e) {
            this.$mes('error', '复制失败,请手动复制！');
        },
        //获取机构列表
        async getOrgList(id) {
            this.orgLoading = true;
            try {
                let res = await this.$http.ORGDisGetOrgList({
                    diseaseId: id,
                    source: localStorage.getItem('CURR_LOGIN_TYPE') == 'disease'?'share':'local'
                });
                if (res.code == '0') {
                    this.orgList = res.data;
                    this.orgList.unshift({
                        orgName: '全部机构',
                        orgCode: ''
                    })
                    if(this.orgList.length && !this.$store.state.user.diseaseInfo.orgCode) {
                        this.orgInfo = this.orgList[0];
                    }
                }
                this.orgLoading = false;
            } catch (err) {
                this.orgLoading = false;
                console.log(err)
            }
        },
        //获取医生列表
        async getDoctorList () {
            let that = this;
            let formData = {
                orgCode: this.orgInfo.orgCode,
                diseaseId: this.$route.query.id
            };
            try {
                let res = await that.$http.ORGDisGetUserListAll(formData);
                if (res.code == '0') {
                    this.doctorList = res.data;
                    this.doctorList.unshift({
                        userName: '所有医生',
                        id: ''
                    })
                }
            } catch (err) {
                console.log(err)
            }
        },
        //计算长度
        countStrSize(str) {
            if (str == null) return true;
            if (typeof str != "string"){
                str += "";
            }
            return str.replace(/[\u0391-\uFFE5]/g,"aa").length>20?false:true;
        }
    }
};
</script>

<style lang="less" scoped>
    .inside_header {
        height: 60px;
        background-color: #f9f9f9;
        color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        transition: left 300ms;
        z-index: 10;
        .el-button {
            color: #999;
            .menuBtn {
                font-size: 28px;
                margin-right: 20px;
            }
        }
        &.open {
            left: 200px;
        }
        &.close {
            left: 64px;
        }
        .researchLogin {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 14px;
            color: #666;
            &:hover {
                color: #1bbae1;
            }
        }
    }
</style>    
<style lang="less">
    body {
        .inside_header {
            .popover_disease {
                height: 100%;
                min-width: 90px;
                transition: all 300ms;
                cursor: pointer;
                &:hover {
                    background-color: #D3D5DE;
                }
                .el-popover__reference {
                    display: block;
                    height: 60px;
                    width: 100%;
                    padding:0 15px;
                    font-size: 15px;
                    text-align: center;
                    line-height: 60px;
                    color: #777;
                }
                i {
                    color: #777;
                }
            }
        }
        .popover_disease {
            left: 200px !important;
            right: 0;
            margin-top: 0 !important;
            animation: move 200ms;
            &.false {
                left:64px !important;
            }
            .disease_content {
                padding: 15px 20px;
                li {
                    margin-right: 15px;
                    margin-bottom: 10px;
                    box-shadow:2px 2px 6px 0px rgba(211,214,217,0.53);
                    border-radius: 3px;
                    border: 1px solid rgba(229,235,236,1);
                    cursor: pointer;
                    transition: all 300ms;
                    &:hover {
                        box-shadow:2px 2px 6px 0px #ccc;
                    }
                    .disease_img {
                        width: 100px;
                        height: 100px;   
                        overflow: hidden;
                        &.thumbnail-img {
                            background-color: #439AFF;
                        }
                        img {
                            border: 5px solid #fff;
                            width: 100%;
                            box-sizing: border-box;
                        }               
                    }
                    p {
                        line-height: 18px;
                        margin-bottom: 5px;
                    }
                }
            }
        }
        .projectShare .el-dialog{
            min-height: 200px;
        }
        .inside_header > .orgDoctorSelect {
            height: 100%;
            min-width: 90px;
            transition: all 300ms;
            cursor: pointer;
            &:hover {
                background-color: #D3D5DE;
            }
            .el-popover__reference {
                display: block;
                height: 60px;
                width: 100%;
                padding:0 15px;
                font-size: 15px;
                text-align: center;
                line-height: 60px;
                color: #777;
            }
            i {
                color: #777;
            }
        }
        & > .orgDoctorSelect {
            min-height: 180px;
            max-height: 500px;
            overflow: auto;
            overflow-x: hidden;
            padding: 0;
            .el-input {
                margin: 10px;
                width: auto;
            }
            .content {
                p {
                    line-height: 34px;
                    padding: 0 20px;
                    color: #666;
                    cursor: pointer;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &:hover {
                        background-color: #f5f7fa;
                    }
                }
            }
        }
    }

    @keyframes move {
        0%{transform: scaleY(0)}
        100%{transform: scaleY(1)}
    }
</style>
