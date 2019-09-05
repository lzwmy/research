<template>
    <div class="patientInfoDetail" v-loading='loading'>
        <el-timeline>
            <el-timeline-item 
                v-for="(item, index) in reportDataList" 
                :key="index" 
                :timestamp="item.visitDate" 
                placement="top" 
                :icon="item.reportType==1?'icon iconfont iconshijianzhoubeifen diagnosis':'icon iconfont iconzujian20 followUp'"
                size="18">
                <el-card>
                    <div class="flex-between-center">
                        <p>{{item.author}}  {{item.createTime}}</p>
                        <el-button>已审核</el-button>
                    </div>
                    <h4>{{item.reportType==1?'初诊':'随访'}}</h4>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>

export default {
    name: 'patientInfoDetail',
    props:['dataInfo'],
    data () {
        return {
            reportDataList:[],
            loading: false
        };
    },
    watch: {
        
    },
    computed: {},
    created () {
        this.getDataList();
    },
    mounted () {

    },
    components: {
    },
    methods: {
        async getDataList () {
            let that = this;
            that.loading = true;
            let formData = {
                offset: 1,
                limit: 99,
                args: this.dataInfo
            };
            try {
                let res = await that.$http.PFUGetReportDataList(formData);
                if (res.code == '0') {
                    this.reportDataList = res.data.args;
                }else {
                    this.$mes('error', res.msg);
                }
                that.loading = false;
            } catch (err) {
                that.loading = false;
                console.log(err)
            }
        },
    },
};
</script>

