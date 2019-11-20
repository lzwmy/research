<template>
    <div class="importDialog">
        <el-dialog 
            title="上传患者信息" 
            :visible.sync="dataInfo" 
            :append-to-body="true"
            @close="$emit('changeDialog',false)"
            class="importDialog"
            width="800px">
            <div class="content flex-start-start">
                <div class="left">
                    <p class="label">选择类型</p>
                    <ul>
                        <li class="flex-between-center" :class="activeGroup==1?'active':''" @click="select(1)">普 通</li>
                        <li class="flex-between-center" :class="activeGroup==2?'active':''" @click="select(2)">随 访</li>
                    </ul>
                </div>
                <div class="right" v-loading="crfListLoading">
                    <p class="label">共{{crfList.length}}个表单</p>
                    <ul>
                        <li v-for="(item,index) in crfList" :key="index" class="flex-between-center">
                            <p>{{item.crfDisplayName}}</p>
                            <div class="btn_group">
                                <exportBtn :row="item"></exportBtn>
                                <importBtn :row="item" @updata="$emit('updata')" @checkData="checkDataDownLoad"></importBtn>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>

        
    </div>
</template>

<script>
import exportBtn from './exportBtn'
import importBtn from './importBtn'
export default {
    name: 'importDialog',
    props: ['dataInfo'],
    data () {
        return {
            activeGroup: 1,
            crfListLoading: false,
            crfList: [],
        }
    },
    components: {
        exportBtn,
        importBtn
    },
    watch: {
        dataInfo: function(newVal) {
            if(newVal) {
                this.getCrfList();
            }
        }  
    },
    methods: {
        select(val) {
            this.activeGroup = val;
            this.getCrfList();
        },
        //获取表单列表
        async getCrfList() {
            this.crfListLoading = true;
            let params = {
                crfType: this.activeGroup,
                diseaseId: this.$route.query.id  
            }
            try {
                let res = await this.$http.patientListCrf(params);
                if (res.code == '0') {
                    this.crfList = res.data;
                    this.crfList.forEach(ele => {
                        ele.loading = false;
                    });
                }
                this.crfListLoading = false;
            } catch (err) {
                this.crfListLoading = false;
                console.log(err)
            }
        },
        checkDataDownLoad(id) {
            this.$emit('checkData',id)
        }
    }
};
</script>

<style lang="less">
    .importDialog {
        .el-dialog__body {
            padding: 20px !important;
        }
        .content {
            height: 340px;
            border: 1px solid #eee;
            .label {
                color: #9CA0B1;
                line-height: 36px;
                padding: 0 10px;
            }
            .left {
                width: 180px;
                height: 100%;
                overflow: auto;
                border-right: 1px solid #eee;
                li {
                    font-size: 14px;
                    color: rgba(57, 66, 99, 1);
                    line-height: 40px;
                    padding: 0 18px;
                    cursor: pointer;
                    &.active {
                        background:rgba(229,235,236,0.5);
                    }
                }
            }
            .right {
                height: 100%;
                flex: 1;
                overflow: auto;
                li {
                    font-size: 14px;
                    color: rgba(57, 66, 99, 1);
                    line-height: 48px;
                    border-top: 1px solid #eee;
                    padding: 0 18px;
                    .upload {
                        color: #1bbae1;
                        border-color: #1bbae1;
                    }
                    .upload {
                        display: inline-block;
                        margin-left: 5px;
                    }
                }
            }
        }
    } 
</style>




