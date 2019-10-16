<template>
    <div class="stageList">
        <h2 class="page_title">随访阶段</h2>
        <el-menu
            ref="refMenu"
            :default-openeds="defaultOpeneds"
            v-loading="loading"
            class="el-menu-vertical-demo">
            <el-submenu v-for="(item, index) in stageList" :key="index" :index="item.stageId">
                <template slot="title">
                    <span class="title">{{item.stageName}}</span>
                </template>
                <el-menu-item-group v-for="(li, liIndex) in item.pointList" :key="liIndex"> 
                    <el-menu-item :disabled="li.status == 5" :index="index+'-'+liIndex" class="flex-between-center menu_li" :class="li.pointPatientId == pointPatientId?'active':''" @click="selectItem(li,item.crfId,item)">
                        <span>{{li.name}}</span>
                        <span v-if="li.status == 0" class="icon iconfont iconiconfontgengduo" style="color: #e0e0e0;"></span>
                        <span v-if="li.status == 1" class="icon iconfont icondaifang" style="color: #00B8DF;"></span>
                        <span v-if="li.status == 2" class="icon iconfont iconshifang" style="color: #F79E00;"></span>
                        <span v-if="li.status == 3" class="icon iconfont iconzhongzhi" style="color: #DB5452;"></span>
                        <span v-if="li.status == 4" class="icon iconfont iconwancheng1" style="color: #00BE90;"></span>
                        <span v-if="li.status == 5" class="icon el-icon-minus" style="color: #333;"></span> 
                    </el-menu-item> 
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: 'stageList',
    props:['groupId','patientId','pointPatientId'],
    data () {
        return {
            loading: false,
            stageList: [],
            defaultOpeneds: [],
        }
    },
    created() {
        this.getStagePointList()
        .then(()=>{
            this.stageList.forEach(item => {
                this.defaultOpeneds.push(item.stageId)
            });
            let stage = [],isManual;
            this.stageList.forEach(item=>{
                item.pointList.forEach(li=>{
                    if(this.pointPatientId == li.pointPatientId) {
                        stage = item;
                    }
                })
            })
            if(this.pointPatientId == stage.pointList[0].pointPatientId) {
                isManual = false;
                this.$emit('changeIsManual',isManual)
            }
        })
    },
    methods: {
        selectItem(row,crfId,item) {
            if(row.status == 5) {
                return;
            }
            //如果为手动触发的阶段   isManual为true则不能操作表单（非第一个随访点）
            let isManual = item.pointList.every(li=>{return !li.planDate;})
            if(row.pointPatientId == item.pointList[0].pointPatientId) {
                isManual = false;
            }
            this.$emit('changeIsManual',isManual)
            let data = Object.assign(row,{crfId})
            this.$emit('sendPoint', data)
        },
        //获取阶段列表
        async getStagePointList() {
            let params = {
                groupId: this.groupId,
                patientId: this.patientId
            }
            try {
                let res = await this.$http.followUpManagementPointList(params);
                if (res.code == '0') {
                    this.stageList = res.data
                }else {
                    this.stageList = [];
                }
            } catch (err) {
                console.log(err)
            }
        },
    },
};
</script>

<style lang="less">
.stageList {
    width: 240px;
    background-color: #fff;
    margin-right: 15px;
    border:1px solid rgba(229,235,236,1);
    height: 100%;
    h2 {
        line-height: 40px;
        text-indent: 15px;
        border-bottom: 1px solid rgba(229,235,236,1);
    }
    .el-menu {
        border: none;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #fff;
        .el-submenu.is-active .el-submenu__title {
            border-color: transparent;
        }
        .el-menu--inline {
            overflow: hidden;
        }
        .el-menu-item.is-active {
            color: #333;
        }
        
        .el-submenu__title {
            line-height: 40px;
            height:  40px;
            padding: 0 15px;
            border-bottom: 1px solid #eee;
            .title {
                color: #384163;
                font-weight: bold;
            }
        }
        .el-menu-item-group {
            .menu_li {
                line-height: 36x;
                height: 36px;
                padding: 0 15px 0 30px !important;
                border-left: 3px solid transparent;
                &.active {
                    background-color: rgba(245, 247, 250, .7);
                    border-color: #1bbae1;
                    color: #1bbae1;
                }
                &:hover {
                    background-color: rgba(245, 247, 250, .7);
                    border-color: #1bbae1;
                    color: #1bbae1;
                }
                .icon {
                    color: #999;
                    margin-left: 6px;
                    &:hover {
                        color: #1bbae1;
                    }
                }
            }
            .addPlus {
                color: #1bbae1;
                line-height: 36px;
                height: 36px;
                padding: 0 15px 0 30px !important;
                &:hover {
                    background-color: #fff;
                }
                .icon {
                    color: #1bbae1;
                }
                .el-button {
                    padding-left: 5px;
                }
            }
        }
        .el-menu-item-group__title {
            display: none;
        }
        .el-submenu__icon-arrow::before{
            content: '\e790'
        }
    }

}
</style>




