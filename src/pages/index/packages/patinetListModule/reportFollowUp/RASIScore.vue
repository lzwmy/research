<template>
    <div class="cloud-component RASIScore">
        
    </div>
</template>

<script>
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import 'assets/css/common.less';

export default {
    name: 'RASIScore',
    data () {
        return {
            
            
        };
    },
    watch: {
        
    },
    computed: {},
    created () {
    },
    mounted () {

    },
    components: {
        pagination
    },
    methods: {

    },
    beforeRouteEnter (to, from, next) {
        next();
    },
    beforeRouteLeave (to, from, next) {
        next();
    }
};
</script>

