<template>
    <div class="inside_header flex-start-center" :class="openMenuView?'open':'close'">
        <el-button type="text" @click="handleMenuView">
            <span class="menuBtn" :class="openMenuView?'el-icon-s-fold':'el-icon-s-unfold'"></span>
        </el-button>
        <el-popover
            placement="top-start"
            title=""
            popper-class="popover_disease"
            class="popover_disease"
            width="100%"
            v-model="popoverVisible"
            trigger="hover">
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
    </div>
</template>
<script>


export default {
    name: 'insideHeader',
    props: {
        menuPath: {
            type: String,
            default: "",
        }
    },
    data () {
        return {
            openMenuView: true,
            disease: "",
            popoverVisible: false,
            dataList: []
        };
    },
    computed: {
    },
    created () {
        this.getDataList();
    },
    watch: {   
        // openMenuView: function(newVal) {
        //     this.initPopover()
        // },
        // popoverVisible: function(newVal) {
        //     if(newVal) {
        //         this.initPopover()
        //     }
        // },
    },
    methods: {
        initPopover() {
            if(!this.openMenuView) {
                $('body > .popover_disease').css({'left':'65px'})
            }else {
                $('body > .popover_disease').css({'left':'200px'})
            }
        },
        handleMenuView() {
            this.openMenuView = !this.openMenuView;
            this.$emit('menuViewChange', this.openMenuView)
        },
        handleSelect(item) {
            this.disease = item.name;
            this.popoverVisible = false;
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
    .dropdown_disease {
        right: 0;
        left: 200px;
        &.big {
            left: 65px;
        }
    }

</style>    
<style lang="less">
    body {
        .inside_header {
            .popover_disease {
                height: 100%;
                min-width: 90px;
                padding:0 15px;
                transition: all 300ms;
                cursor: pointer;
                &:hover {
                    background-color: #D3D5DE;
                }
                .el-popover__reference {
                    display: block;
                    height: 60px;
                    width: 100%;
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
            left: 200px;
            right: 0;
            animation: move 300ms;
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
                            background-color: #7ED320;
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
        0%{transform: translateY(-30px)}
        100%{transform: translateY(0)}
    }
</style>
