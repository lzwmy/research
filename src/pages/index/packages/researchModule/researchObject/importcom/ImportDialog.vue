<template>
    <div class="importDialog">
        <el-dialog 
            title="导入研究数据" 
            :visible.sync="dataInfo" 
            :append-to-body="true"
            @close="$emit('changeDialog',false)"
            class="importDialog"
            width="800px">
            <div class="content flex-start-start" v-loading="crfListLoading">
                <div class="left">
                    <p class="label">选择分组</p>
                    <ul>
                        <li class="flex-between-center" v-for="(li,index) in groupList" :key="index" :class="activeGroup==li.groupId?'active':''" @click="select(li.groupId)">{{li.groupName}}</li>
                    </ul>
                </div>
                <div class="right">
                    <p class="label">共{{crfList.length}}个表单</p>
                    <ul>
                        <li v-for="(item,index) in crfList" :key="index" class="flex-between-center">
                            <p>{{item.crfName}}</p>
                            <div class="btn_group">
                                <exportBtn :row="item" :groupId="activeGroup"></exportBtn>
                                <importBtn :row="item" :groupId="activeGroup" @updata="$emit('updata',activeGroup)" @checkData="checkDataDownLoad"></importBtn>
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
            activeGroup: null,
            crfListLoading: false,
            crfList: [],
            groupList: []
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
            let currentGroup = this.groupList.find(li=>{return li.groupId == val});
            this.crfList = currentGroup.selectCrfDtoList;
        },
        //获取表单列表
        async getCrfList() {
            this.crfListLoading = true;
            let params = {
                subjectId: this.$store.state.user.researchInfo.subjectInfoId
            }
            try {
                let res = await this.$http.researchObjectListCrf(params);
                if (res.code == '0') {
                    this.groupList = res.data;
                    if(this.groupList.length>0) {
                        this.select(this.groupList[0].groupId);
                    }
                    this.groupList.forEach(ele => {
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




