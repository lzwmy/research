import utils from '../utils';

const mixins = {
  data () {
    return {
      routerViewHeight: 1
    };
  },
  activated () { 
  
    let that = this;
    setTimeout(() => {
      // 清除上个页面的tooltips，以免当切换路由的时候，在下个页面的dom没完全加载的时候，鼠标在上个页面列表中显示出tooltips；
      let tooltips = document.querySelectorAll('.el-tooltip__popper');
      if (tooltips.length > 0) {
        Array.prototype.forEach.call(tooltips, function (tooltip) {
          tooltip.style.display = 'none';
        });
      }
    }, 200);

    that.$nextTick(() => {
      // 多个图表的自适应 添加监听器
      if (window.addEventListener && that.resize) { // 所有主流浏览器，除了 IE 8 及更早版本
        window.addEventListener('resize', utils.throttle(that.resize));
      } else if (window.attachEvent && that.resize) { // IE 8 及更早版本
        window.attachEvent('onresize', utils.throttle(that.resize));
      }
      // 切换路由的时候执行一次resize
      if (that.resize) {
        utils.throttle(that.resize)();
      }
      if (that.doLayout) {
        that.doLayout();
      }
      this.$emit('handlePageHeight'); // 初始化的时候首先调用调整窗口
    });
  },
  created() {
    this.$emit('handlePageHeight'); // 初始化的时候首先调用调整窗口
  },
  mounted() {
    this.$nextTick(()=>{
      if(!$('#app').hasClass('insideView')) {
        utils.handleTableScorll();
        $(window).resize(()=>{
          utils.handleTableScorll();
        })
        $(document).scroll(()=>{
          utils.handleTableScorll();
        })
      }
    })
  },
  methods: {
    
  },
  computed: {
    getRouteArr () {
      if (this.$store && this.$store.state) {
        return this.$store.state.user.routeArr.slice(0);
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // flag为true 则再次进入不会清除之前数据，为false则会清楚之前数据，并拉取新数据
    next(vm => {
      let flag = false;
      // 2、为了解决列表页进入详情页重新获取数据
      if (to.name === from.name + 'Detail' || (to.name === 'diseaseSet' && from.name === 'SDResearch') || (to.name === 'caseManage' && from.name === 'SDResearch' && to.query.cacheData === false) || (to.name === 'crfFill' && from.name === 'caseManage' && to.query.cacheData === false) || (to.name === 'enterGroupManager' && from.name === 'caseManage' && to.query.cacheData === false) || (to.name === 'enterGroupManager' && from.name === 'allCases' && to.query.cacheData === false)) {
        flag = false;
      }
      // 3、为了解决详情页保存或者返回列表页，列表页数据刷新并维持当前页，并表单数据仍在；---通用处理
      if (to.name + 'Detail' === from.name) {
        if (vm.getDataList) {
          if (vm.currentPageNo && vm.currentPageSize) { // 避免详情页刷新后，丢失currentPageNo、currentPageSize
            vm.getDataList(vm.currentPageNo, vm.currentPageSize);
          } else {
            vm.getDataList();
          }
          return false;
        }
      }
      // 3、为了解决详情页保存或者返回列表页，列表页数据刷新并维持当前页，并表单数据仍在；---特殊处理
      if (to.name === 'caseManage' && from.name === 'crfFill' && to.query.cacheData === false) {
        if (vm.getDataList) {
          vm.getDataList(vm.view.pagination.page, vm.view.pagination.size);
          return false;
        }
      }
      // 3、为了解决详情页保存或者返回列表页，列表页数据刷新并维持当前页，并表单数据仍在；---特殊处理
      if (to.name === 'enterGroupManager' && from.name === 'crfFill' && to.query.cacheData === false) {
        if (vm.getDataList) {
          vm.getDataList(vm.currentPageNo, vm.currentPageSize);
          return false;
        }
      }

      // console.warn(flag);
      if (!flag && vm.initPage) {
        // 让打开的新的详情页滚动轴到最顶部
        // console.log(document.getElementsByClassName('el-router-view')[0])
        if (document.getElementsByClassName('el-router-view')[0]) {
          document.getElementsByClassName('el-router-view')[0].scrollTop = 0;
        }
        // 常规表单重置
        if (vm.ruleForm) {
          Object.keys(vm.ruleForm).forEach((key) => {
            vm.ruleForm[key] = '';
            if (vm.params_ruleForm) {
              vm.params_ruleForm[key] = '';
            }
          });
        }
        for (let i = 2; i < 5; i++) {
          if (vm['ruleForm' + i]) {
            Object.keys(vm['ruleForm' + i]).forEach((key) => {
              vm['ruleForm' + i][key] = '';
              if (vm['params_ruleForm' + i]) {
                vm['params_ruleForm' + i][key] = '';
              }
            });
          }
        }
        // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果,列表页进入详情页的areaForm不用清空
        if (vm.$refs.areaForm) {
          vm.$refs.areaForm.$refs.ruleForm.resetFields();
          Object.keys(vm.$refs.areaForm.ruleForm).forEach((key) => {
            vm.$refs.areaForm.ruleForm[key] = '';
          });
        }
        // 省份区域tree组件重置
        if (vm.provinceIsShow) {
          vm.provinceIsShow = false;
          vm.$nextTick(() => {
            vm.provinceIsShow = true;
          });
        }
        // 初始化注册data,因为有时间startTimeOption，有个作用域that，用下面这句会把那个var that=this弄丢，所以出现报错
        Object.assign(vm.$data, vm.$options.data());
        // 初始化data默认值及页面
        vm.initPage();
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    let that = this;
    that.$nextTick(() => { // 切换到别的路由的时候移除监听器
      if (window.removeEventListener && that.resize) { // 所有主流浏览器，除了 IE 8 及更早版本
        window.removeEventListener('resize', utils.throttle(that.resize));
      } else if (window.detachEvent && that.resize) { // IE 8 及更早版本
        window.detachEvent('onresize', utils.throttle(that.resize));
      }
    });
    next();
  }
};

export default mixins;
