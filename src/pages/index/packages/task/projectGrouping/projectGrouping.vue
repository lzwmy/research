<template>
    <div class="cloud-component projectGrouping">
        <!-- <img src="../images/projectGrouping.png" alt="" width="100%"> -->
        <div class="box">
            <div class="aside">
                <p class="aside_title">项目分组</p>
                <ul v-loading="groupLoading" id="group">
                    <li v-for="(item, index) in groupList" :key="index" :class="index == activeGroup?'active':''" @click="selectGroup(item,index)">
                        <span v-if="!item.edit">{{item.name}}</span>
                        <el-input class="addOrg" v-else v-model="item.name"></el-input>
                    </li>
                </ul>
                <el-button class="plus flex-center-center" type="primary" icon="el-icon-plus" @click="">添加分组</el-button>
            </div>
            <div class="content">
                <h2>纳排规则说明</h2>
                <el-input type="textarea" :rows="20" placeholder="您可以输入纳排说明,如：1、分期为||、 |||期(AJCC 7th edition); 2、未行抗肿瘤治疗的初次治疗患者; 3、无其它恶性肿瘤病史; 4、男性或女性，年龄18-70岁" ></el-input>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'projectGrouping',
    data () {
        return {
            groupList: [
                {name: '分组1'},
                {name: '分组2'},
                {name: '分组3'},
                {name: '分组4'}
            ],
            activeGroup: 0,
            groupLoading: false
        }
    },
    methods: {
        selectGroup(item,index) {
            this.activeGroup = index;
        },
        addOrgInput() {
            this.groupList.push({
                edit: true,
                name: ''
            })
            this.$nextTick(()=>{
                $("#group li:last-child input").focus();
            })
        }
    }
};
</script>

<style lang="less" scoped>
    .projectGrouping {
        .box {
            position: relative;
            height: 100%;
            color: #394263;
            .aside {                
                width: 220px;
                .aside_title {
                    font-size: 14px;
                    background-color: #fff;
                    line-height: 36px;
                    text-indent: 20px;
                    border-bottom: 1px solid rgba(229, 235, 236, .7);
                }
                ul {
                    background-color: #fff;
                }
                li {
                    height: 40px;
                    line-height: 40px;
                    padding-left: 30px;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                    &.active {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                    &:hover {
                        background-color: rgba(245, 247, 250, .7);
                        border-left: 3px solid #1bbae1;
                        color: #1bbae1;
                    }
                }
                .plus {
                    margin: 20px auto;
                    width: 100%;
                    line-height: 38px;
                }
            }
            .content {
                position: absolute;
                left: 235px;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: #fff;
                padding: 15px;
                h2 {
                    font-size: 16px;
                    margin-bottom: 15px;
                }
            }
        }
    }
</style>




