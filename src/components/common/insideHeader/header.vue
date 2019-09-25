<template>
    <div class="inside_header flex-start-center" :class="$store.state.common.openMenuView?'open':'close'">
        <el-button type="text" @click="handleMenuView">
            <span class="menuBtn" :class="$store.state.common.openMenuView?'el-icon-s-fold':'el-icon-s-unfold'"></span>
        </el-button>
        <el-popover
            v-show="$route.meta.belongToGroup == 'insideView'"
            placement="top-start"
            title=""
            :popper-class="'popover_disease ' + $store.state.common.openMenuView"
            class="popover_disease"
            width="100%"
            v-model="popoverVisible"
            :visible-arrow="false"
            trigger="click">
            <ul class="disease_content flex-start-center">
                <li v-for="(item,index) in dataList" :key="index" @click="handleSelect(item)"> 
                    <div class="disease_img" :class="'thumbnail-img ' + item.logo + '_bgColor'">
                        <img :src="'./static/img/disease-logo/' + item.logo+ '.svg'">
                    </div>
                    <p class="text-center">{{item.name}}</p>
                </li>
            </ul>
            <div slot="reference" class="flex-between-center">{{disease}}<span v-if="!disease">请选择</span><i class="el-icon-arrow-down el-icon--right"></i></div>
        </el-popover>
        <p v-show="$route.meta.belongToGroup == 'researchTask'" @click="researchlLogin" class="researchLogin flex-center-center">项目分享<span class="icon iconfont iconfenxiang left_6"></span></p>
    </div>
</template>
<script>
import '../../../pages/index/packages/SDResearch/card_bgColor.less';
export default {
    props: ['researchId'],
    name: 'insideHeader',
    data () {
        return {
            disease: "",
            popoverVisible: false,
            dataList: []
        };
    },
    created () {
        this.getDataList()
        .then(()=>{
            this.dataList.forEach(item => { 
                if(this.$route.query.id == item.id) {
                    this.disease = item.name;
                }
            });
        })

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
    },
    methods: {
        handleMenuView() {
            this.$store.commit("changeMenuView", !this.$store.state.common.openMenuView);
        },
        handleSelect(item) {
            this.disease = item.name;
            this.popoverVisible = false;
            this.$emit('diseaseSelect', item.id)
        },
        async getDataList () {
            this.loading = true;
            try {
                let res = await this.$http.findDiseaseSpecies();
                this.loading = false;
                if(res.code == '0') {
                    this.dataList = res.data.diseaseSpecieses;
                }else {
                    this.$mes('error', "获取病种列表失败");
                }
            } catch (error) {
                console.log(error);
            }
        },
        researchlLogin() {
            sessionStorage.setItem('CURR_RESEARCH_ID', this.researchId);
            window.open('./loginResearch.html');
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
    }

    @keyframes move {
        0%{transform: scaleY(0)}
        100%{transform: scaleY(1)}
    }
</style>
