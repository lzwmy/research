<template>
    <div class="dynamicForm_numberInput flex-start-center">
        <el-input type="number" v-model="inputValue" :placeholder="'请输入'+dataInfo.controlName" clearable style="width: 70%;"></el-input>
        <p v-if="dataInfo.jsonData.termUnit.numberIsSwitch=='1' ">{{dataInfo.jsonData.termUnit.unitName}}</p>
        <el-select v-else-if="dataInfo.jsonData.termUnit.numberIsSwitch=='0'" @change="selectChange" v-model="inputUnit" :placeholder="'请选择'" style="width: 30%;margin-left:8px;">
            <el-option
                v-for="(li,index) in dataInfo.jsonData.termSet.rangeText.split('\n')"
                :key="index"
                :label="li"
                :value="li">
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'numberInput',
    props: ['dataInfo'],
    data () {
        return {
            inputValue: null,
            inputUnit:''
        }
    },
    created() {
        this.inputValue = null;
        this.inputUnit = '';
        this.inputValue = this.dataInfo.value.split('\n')[0];
        this.inputUnit = this.dataInfo.jsonData.termSet.rangeText.split('\n')[0];
    },
    watch: {
        'inputValue': function(newVal) {
            this.dataInfo.value = this.inputValue + '|' + this.inputUnit;
        }
    },
    components: {
        
    },
    methods: {
        selectChange(val) {
            this.dataInfo.value = this.inputValue + '|' + this.inputUnit;
        }
    }
};
</script>

<style lang="less">

</style>




