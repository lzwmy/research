<template>
    <div class="addObjectDialog flex-start-center" v-loading="groupLoading">
        <div v-for="(item, index) in groupList" 
            :key="index" 
            class="group_item" 
            :class="currentGrounpId==item.subjectGroupId?'active':''" 
            @click="selectGroup(item.subjectGroupId)">
            {{item.subjectGroupName}}
            <span class="badge">{{item.patientNum}}</span> 
        </div>
    </div>
</template>

<script>
export default {
    name: 'searchCom',
    data () {
        return {
            groupLoading: false,
            groupList: [],
            currentGrounpId: '',
            crfList: [],
            activeCrf:''
        }
    },
    created() {
        this.getGroupList()
        .then(()=>{
            this.selectGroup(this.currentGrounpId)
        })
        this.getCrfList();
    },
    methods: {
        //获取分组列表
        async getGroupList() {
            this.groupLoading = true;
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.researchObjectGroupList(params);
                if (res.code == '0') {
                    this.groupList = res.data;
                    if(this.groupList.length) {
                        this.currentGrounpId = this.groupList[0].subjectGroupId;
                        this.$emit('sendGroupList',{
                            groupList: this.groupList,
                            currentGrounpId: this.currentGrounpId
                        })
                    }
                }
                this.groupLoading = false;
            } catch (err) {
                this.groupLoading = false;
                console.log(err)
            }
        },
        selectGroup(id) {
            this.currentGrounpId = id;
            this.$emit('selectGroup',id)
        },
        //获取crf表单列表
        async getCrfList() {
            let params = {
                subjectInfoId: this.$store.state.user.researchID
            }
            try {
                let res = await this.$http.researchObjectCrfList(params);
                if (res.code == '0') {
                    this.crfList = res.data;
                    if(this.crfList.length) {
                        this.activeCrf = this.crfList[0].crfId;
                        this.$emit('sendCrfList',{
                            crfList: this.crfList,
                            activeCrf:this.activeCrf
                        })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
    }
};
</script>

<style lang="less">
    @import url('../../researchObject/popover.less');
</style>




