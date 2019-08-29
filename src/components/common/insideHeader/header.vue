<template>
    <div class="inside_header flex-start-center" :class="openMenuView?'open':'close'">
        <el-button type="text" @click="handleMenuView">
            <span class="menuBtn" :class="openMenuView?'el-icon-s-fold':'el-icon-s-unfold'"></span>
        </el-button>
        <el-select v-model="value" placeholder="请选择" v-if="menuPath == '/SDResearch'">
            <el-option v-for="(item, index) in 5" :key="index" label="银屑病" value="银屑病"></el-option>
        </el-select>
    </div>
</template>
<script>


export default {
    name: 'insideHeader',
    props: {
        menuPath: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            openMenuView: true,
            value:""
        };
    },
    computed: {
    },
    created () {
    },
    mounted () 
    {
    },
    watch: {
        
    },
    methods: {
        handleMenuView() {
            this.openMenuView = !this.openMenuView;
            this.$emit('menuViewChange', this.openMenuView)
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
    }
</style>    
<style lang="less">
    .inside_header {
        .el-select {
            .el-input {
                background-color: #D3D5DE;
                height: 100%;
                line-height: 60px;
                .el-input__inner {
                    border:none;
                    background-color: transparent;
                    width: 120px;
                }
                input::-webkit-input-placeholder {
                    color: #999;
                }
                input::-ms-input-placeholder {
                    color: #999;
                }
                input::-moz-input-placeholder {
                    color: #999;
                }
            }
        }
    }
</style>
