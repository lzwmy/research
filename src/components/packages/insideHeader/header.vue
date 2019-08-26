<template>
    <div class="header flex-start-center" :class="openMenuView?'open':'close'">
        <el-button type="text" @click="handleMenuView">
            <span class="menuBtn" :class="openMenuView?'el-icon-s-fold':'el-icon-s-unfold'"></span>
        </el-button>
        <el-select v-model="value" placeholder="请选择">
            <el-option v-for="(item, index) in 5" :key="index" label="银屑病" value="银屑病"></el-option>
        </el-select>
    </div>
</template>
<script>


export default {
    name: 'insideHeader',
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
    .header {
        height: 70px;
        background-color: #5ccdde;
        color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        transition: left 300ms;
        z-index: 10;
        .el-button {
            color: #fff;
            .menuBtn {
                font-size: 28px;
                margin-right: 20px;
            }
        }
        .el-select {
            .el-input {
                border:none;
            }
        }
        &.open {
            left: 200px;
        }
        &.close {
            left: 0;
        }
    }
</style>    
