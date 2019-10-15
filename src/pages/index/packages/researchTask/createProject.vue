<template>
    <div class="cloud-component createProject">
        <!-- 动态组件 -->
        <section>
            <keep-alive>
                <component ref="componets" :is="currentComponent" @changeStep="handleStep" @changeLoading="handleLoading" :formData="formData" :roles='roles'>
                    <el-steps :active="activeStep" finish-status="process"  align-center>
                        <el-step title="选择项目类型" icon="icon iconfont iconzujian30" :class="activeStep==0?'active':''"></el-step>
                        <el-step title="填写项目信息" icon="icon iconfont iconzujian32" :class="activeStep==1?'active':''"></el-step>
                        <el-step title="研究分组设置" icon="icon iconfont iconzujian31" :class="activeStep==2?'active':''"></el-step>
                    </el-steps>
                </component>
            </keep-alive>
        </section>
    </div>
</template>

<script>
import stepOne from './steps/stepOne'
import stepTwo from './steps/stepTwo'
import stepThree from './steps/stepThree'
export default {
    name: 'createProject',
    data () {
        return {
            activeStep: 0,
            currentComponent: stepOne,
            formData: {},
            roles: []
        }
    },
    watch: {
        activeStep: function(newVal) {
            switch(newVal) {
                case 0: this.currentComponent = stepOne; break;
                case 1: this.currentComponent = stepTwo; break;
                case 2: this.currentComponent = stepThree; break;
                case 3: this.currentComponent = stepThree; break;
                default: this.currentComponent = stepOne;
            }
        }
    },
    components: {
        stepOne,
        stepTwo,
        stepThree
    },
    created() {
        //项目回显
        this.roles = this.$route.params.roles;
        if(this.$route.params.createStatus) {
            this.formData = this.$route.params.projectInfo;
            this.activeStep = 2;
        }
    },
    methods: {
        handleStep(val,data) {
            this.activeStep = val;
            if(data) {
                this.formData = data;
            }
        },
        handleLoading(val) {
            this.loading = val;
        }
    }
};
</script>

<style lang="less">
    .createProject {
        .cloud-search {
            margin-bottom: 26px;
            .title {
                font-size:18px;
                font-weight:bold;
                color:rgba(57,66,99,1);
            }
        }
        .main {
            background: #fff;
            min-height: 750px;
            padding: 56px; 
        }
        .el-steps {
            justify-content: center;
            height: 140px;
            margin-bottom: 50px;
            border-bottom: 1px solid rgba(241,241,241,1);
            .el-step {
                height: 55px;
                flex-basis: 220px !important;
                &.active::after {
                    content: '';
                    width: 110px;
                    height: 80px;
                    background:rgba(0,189,145,0.1);
                    border:1px solid rgba(0,189,145,1);
                    border-radius:4px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
            .el-step__head {
                .el-step__line {
                    left: 85%;
                    right: -15%;
                    top: 22px;
                }
                .el-step__icon {
                    background-color: transparent;
                    .el-step__icon-inner {
                        font-size: 25px;
                    }
                }
                &.is-process {
                    .el-step__icon-inner {
                        color: rgba(0,189,145,1);
                    }
                }
            }
            .el-step__title {
                font-size: 14px;
                &.is-process {
                    color:rgba(142,142,142,1);
                }
            }
        }
    }
</style>




