<template>
    <div class="addObjectDialog">
        <el-dialog 
            title="" 
            :append-to-body="true"
            :fullscreen="true"
            :show-close="false"
            class="addObject_dialog"
            :visible.sync="dialog.visible">
            <div class="top flex-between-center">
                <div>
                    <i class="el-icon-close close_icon" @click="dialog.visible = false"></i>
                    <span class="page_title">{{dialog.title}} -- {{groupInfo.subjectGroupName}}</span>
                </div>
                <el-button v-if="dialog.from=='researchObject'" type="primary" @click="addObject('确认添加')">确认添加</el-button>
            </div>
            <div class="content">
                <div class="wrap">
                    <h1>{{dataInfo.formTitle}}</h1>
                    <el-form label-position="top" label-width="180px" class="flex-start-center flex-wrap">
                        <el-form-item :label="index+1+'、'+item.controlName" v-for="(item, index) in dataInfo.content" :key="index">
                            <el-input v-if="item.jsonData.controlType=='SINGLE_INPUT'" type="text" v-model="item.value" :placeholder="'请输入'+item.controlName" clearable></el-input>
                            <el-input v-if="item.jsonData.controlType=='MULTI_INPUT'" type="textarea" v-model="item.value" :placeholder="'请输入'+item.controlName" clearable></el-input>
                            <!-- 数值控件 -->
                            <numberInput v-if="item.jsonData.controlType=='NUMBER_INPUT'" :dataInfo="item"></numberInput>
                            <el-date-picker v-if="item.jsonData.controlType=='DATE_TIME'" v-model="item.value" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="'请选择'+item.controlName" clearable></el-date-picker>
                            <el-date-picker v-if="item.jsonData.controlType=='DATE'" v-model="item.value" value-format="yyyy-MM-dd" type="date" :placeholder="'请选择'+item.controlName" clearable></el-date-picker>
                            <el-checkbox-group v-if="item.jsonData.controlType=='CHECKBOX'" v-model="item.value">
                                <el-checkbox v-for="(li,index) in item.jsonData.termSet.rangeText.split('\n')" :key="index" :label="precessData(li)">{{precessData(li)}}</el-checkbox>
                            </el-checkbox-group>
                            <div v-if="item.jsonData.controlType=='RADIO_BUTTON'">
                                <el-radio-group v-model="item.value">
                                    <el-radio v-for="(li, index) in item.jsonData.termSet.rangeText.split('\n')" :key="index" :label="precessData(li)">{{precessData(li)}}</el-radio>
                                </el-radio-group>
                            </div>
                            <el-select v-if="item.jsonData.controlType=='SINGLE_COMBOX' || item.jsonData.controlType=='MULTI_COMBOX' " clearable :multiple="item.jsonData.controlType=='MULTI_COMBOX'?true:false" v-model="item.value" :placeholder="'请选择'+item.controlName">
                                <el-option
                                    v-for="(li,index) in item.jsonData.termSet.rangeText.split('\n')"
                                    :key="index"
                                    :label="precessData(li)"
                                    :value="precessData(li)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <el-dialog 
            title="请选择患者所在分组" 
            :append-to-body="true"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="450px"
            class="select_dialog height_auto"
            :visible.sync="visible">
            <div class="flex-center-center flex-wrap">
                <el-radio-group v-model="radio">
                    <el-radio v-for="(item,index) in groupList" :key="index" :label="item.subjectGroupId">{{item.subjectGroupName}}</el-radio>
                </el-radio-group>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="selectGroup">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import numberInput from './numberInput'
import utils from 'components/utils/index';
export default {
    name: 'dynamicForm',
    props: ['dataInfo','dialog','groupList'],
    data () {
        return {
            visible: false,
            radio: '',
            groupInfo: {}
        }
    },
    components: {
        numberInput
    },
    methods: {
        addObject(title) {
            this.$confirm('是否'+title+'?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then( async() => {
                    let subjectItemDataDtoList = [];
                    this.dataInfo.content.forEach(li=>{
                        let obj = {
                            itemName: li.controlName,
                            value: typeof(li.value) == 'string'?li.value:li.value.join('|'),
                            path: li.path,
                            crfId: String(li.crfId)
                        }
                        subjectItemDataDtoList.push(obj);
                    })
                    console.log(subjectItemDataDtoList)
                    this.dialog.loading = true;
                    let params = {
                        subjectGroupId: this.groupInfo.subjectGroupId,
                        subjectInfoId: this.$store.state.user.researchInfo.subjectInfoId,
                        subjectGroupName: this.groupInfo.subjectGroupName,
                        subjectItemDataDtoList: subjectItemDataDtoList
                    }
                    try {
                        let res = await this.$http.researchObjectPreviewAddresearch(params);
                        if (res.code == '0') {
                            this.$emit('successAdd',this.radio)
                            this.dialog.visible = false;
                        }
                        this.dialog.loading = false;
                    } catch (err) {
                        this.dialog.loading = false;
                        console.log(err)
                    }
                }).catch(() => {});
        },
        selectGroup() {
            if(this.radio){
                this.visible = false;
                this.groupInfo = this.groupList.find(item => {
                    return item.subjectGroupId == this.radio;
                })
            }else {
                this.$mes('info','请先选择分组')
            }
        },
        //处理 ^
        precessData(data) {
            if(data.indexOf('^') != -1) {
                return utils.deepClone(data.split('^')[0]) 
            }else {
                return data
            }
        }
    }
};
</script>

<style lang="less">
    .addObject_dialog {
        .el-dialog__header {
            display: none !important;
        }
        .el-dialog__body {
            background-color: #eff3f5;
            padding: 0 !important;
            position: relative;
            height: 100%;
        }
        .top {
            height: 56px;
            padding: 0 15px;
            background-color: #fff;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 99;
            box-shadow: 0 0 5px #ccc;
        }
        .content {
            margin: 25px 30px 0;
            position: absolute;
            top: 65px;
            bottom: 0;
            left: 0;
            right: 0;
            .wrap {
                padding: 0 70px;
                background-color: #fff;
                overflow: auto;
                h1 {
                    text-align: center;
                    font-size: 20px;
                    line-height: 120px;
                    border-bottom: 1px solid #ccc;
                    margin-bottom: 50px;
                }
                .el-form-item {
                    width: 33%;
                    height: 120px;
                    .el-form-item__content {
                        width: 360px;
                        .el-date-editor.el-input,
                        .el-select,
                        .el-checkbox-group,
                        .el-radio-group {
                            width: 100%;
                        }
                    }
                }
            }
        }
    } 
</style>




