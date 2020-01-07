<template>
    <div class="stopOne">
        <div class="cloud-search flex-between-center">
            <p class="title">创建项目</p>
            <div>
                <el-button type="primary" :disabled="!centerPattern" @click="create">下一步</el-button>
            </div>
        </div>
        <div class="main">
            <slot></slot>
            <div class="flex-center-center">
                <div class="card flex-center-center flex-wrap" type="primary" @click="select(1)">
                    <div class="wrap flex-center-center" :class="centerPattern==1?'active':''">
                        <svg class="svg_icon" aria-hidden="true" style="width: 52px;height: 70px;"><use xlink:href="#iconzu8"></use></svg>
                        <i class="icon el-icon-check"></i>
                    </div>
                    <p>单中心</p>
                </div>
                <div class="card flex-center-center flex-wrap" type="primary" @click="select(2)">
                    <div class="wrap flex-center-center" :class="centerPattern==2?'active':''">
                        <svg class="svg_icon" aria-hidden="true" style="width: 70px;height: 78px;"><use xlink:href="#iconzu9"></use></svg>
                        <i class="icon el-icon-check"></i>
                    </div>
                    <p>多中心</p>
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
            centerPattern: null
        }
    },
    created() {
        if(this.formData.proType == 'edit') {
            this.centerPattern = this.formData.centerPattern
        }
    },
    methods: {
        select(val) {
            this.centerPattern = val;
        },
        async create() {
            if(this.formData.proType == 'edit') {
                this.centerPattern = this.formData.centerPattern
                this.$emit('changeStep',1, this.formData);
                return;
            }
            let data = {
                centerPattern:  this.centerPattern,
            }
            this.$emit('changeStep',1,data);
        }
    }
};
</script>

<style lang="less">
    .stopOne .card {
        width: 294px;
        .wrap {
            width: 100%;
            margin: 0 30px;
            height: 160px;
            background: rgba(240,247,255,1);
            border: 1px solid rgba(221, 223, 229, 1);
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            &.active {
                border-color: #439aff;
                i {
                    background-color: #439aff;
                }
                & + p {
                    color: rgba(57, 66, 99, 1);
                }
            }
            i {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 48px;
                height: 48px;
                line-height: 28px;
                text-indent: 5px;
                border-radius: 50%;
                font-size: 16px;
                color: #fff;
                transform: translate(52%,52%);
                background-color: #ccc;
            }
        }
        p {
            color: #ccc;
            line-height: 50px;
            font-size: 18px;
        }
    }
</style>




