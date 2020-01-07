<template>
  <div class="ztree-box">
    <!-- <div class="el-input el-inputmini el-input prefix">
      <input autocomplete="off" placeholder="请输入内容" size="mini" type="text" rows="2" class="el-input__inner">
      <span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>
    </div> -->
    <div class="flex-between-center">
      <el-input v-model.trim="searchName" placeholder="请输入名称" @keyup.enter.native="treeSearch"
        prefix-icon="el-icon-search"
        type="text" clearable class="input-search">
      </el-input>
      <i class="cur_pointer icon iconfont icontianjia" style="padding: 0 8px 0 3px;"></i>
    </div>
    <ul :id="'treeDemo' + random" class="ztree" v-loading="loading" ref="treeDemo"></ul>
  </div>
</template>
<script>
export default {
  name: 'combination',
  data () {
    return {
      random: '',
      key: '',
      children: [],
      searchName: '',
      searching: false,
      loading: false
    };
  },
  created () {
    this.random = this.$route.name;
  },
  mounted () {
    this.initPage();
  },
  methods: {
    async initPage () {
      let result = await this.$http.crfFindAllModules();
      this.drawTree(result);
    },
    async drawTree (result) {
      let that = this;
      if (!(result && result.data && result.data.categories.length > 0)) {
        $('#treeDemo' + that.random).html('<li class="tree-no-data zwarning">暂无数据</li>');
        return false;
      }
      let categories = result.data.categories;
      categories.forEach((item) => {
        item.modules.forEach((modules) => {
          modules.name = modules.elNameCN || modules.elNameEN;
          modules.isParent = true;
        });
      });

      let setting = {
        async: {
          enable: true,
          contentType: 'application/json',
          url: '/research/crf/findElements.do?t=' + (+new Date()),
          autoParam: ['id'],
          dataFilter (treeId, parentNode, responseData) {
            if (responseData && responseData.code == 0) {
              let elements = responseData.data.elements;
              elements.forEach((element, i) => {
                element.name = element.elNameCN || element.elNameEN;
              });
              return elements;
            }
          }
        },
        check: {
          enable: true,
          autoCheckTrigger: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 'ps'}
        },
        data: {
          key: {
            checked: 'defaultCheck',
            children: 'modules'
          }
        },
        view: {
          showIcon: false,
          selectedMulti: false
        },
        callback: {
          onCheck: function (event, treeId, treeNode) {
            console.log(treeNode);
          },
          onClick: that.zTreeOnClick,
          onAsyncSuccess: that.onDraggable, // 用于捕获异步加载正常结束的事件回调函数
          onExpand: that.onDraggable // 用于捕获节点被展开的事件回调函数
        }
      };
      $(function () {
        $.fn.zTree.init($('#treeDemo' + that.random), setting, categories);
        that.onDraggable();
        that.$nextTick(() => {
          that.$emit('endRender', true);
        });
        // $(".ztree-box .el-input__inner").off();
        // $(".ztree-box .el-input__inner").on("input propertychange",function(event){
        //   let inner = $(this);
        //   if(that.searching){
        //     return false;
        //   }

        //   if($.trim(inner.val())){
        //      that.search(inner.val());
        //   }else{
        //      that.init();
        //   }
        // }).on("compositionstart",function(event){
        //   let inner = $(this);
        //   that.searching = true;
        // }).on("compositionend",function(event){
        //   let inner = $(this);
        //   if($.trim(inner.val())){
        //      that.search(inner.val());
        //   }else{
        //      that.init();
        //   }
        // });
      });
    },
    onDraggable (event, treeId, treeNode) {
        let that = this;
        let treeDemo = $.fn.zTree.getZTreeObj('treeDemo' + that.random);
        // 高亮搜索的关键字
        // let nameKey = this.searchName.toLowerCase();
        let nameKey = this.searchName;
        if (nameKey) {
          $('#treeDemo' + that.random).find('.node_name').each(function () {
            // var nodeName = $(this).html().toLowerCase().replace('<i>', '').replace('</i>', '');
            let nodeName = $(this).html().replace('<i>', '').replace('</i>', '');
            $(this).html(nodeName.replace(new RegExp(nameKey, 'g'), '<i>' + nameKey + '</i>'));
          });
        }
        return;
        $('#treeDemo' + that.random).find('.node_name').draggable({
          revert: 'true', // cursor参数可以指定鼠标指针的形状，cursorAt指定鼠标指针在source的相对位置，revert可以指定当drop失败时source“飘”回原来的位置
          helper: 'clone', // 指定为“original”, "clone"，其中"original"是默认值，即拖动自身，而clone表示创建自身的一个克隆用于拖拽
          opacity: 0.7,
          start: function () { // 当鼠标开始拖拽时，触发此事件。
            // 类目级别的，已经表单被使用的，不能拖拽；
            if ($(this).parent().hasClass('level0') || (that.$parent.crfForm && that.$parent.crfForm.used)) {
              return false;
            }
          },
          drag: function () { // 当鼠标拖拽移动时，触发此事件。
            $('.crf-step').each(function () {
              let item = $(this);
              // offset() 方法返回或设置匹配元素相对于文档的偏移（位置）
              let top = item.offset().top;
              // 由于有一个左侧表单收缩展开的按钮，左侧表单狂赌为310
              let left = 310;
              if (that.$parent.crfLeftBtnStatus) {
                left = 0;
              } else {
                left = 310;
              }
              // 计算可拖拽范围，并显示黄色边框样式；
              // 此处获取到的top1和left1是拖拽元素相对于文档的偏移（位置），
              // 因为.css('top')获取的是拖拽元素相对于最近的定位的.cloud-component的相对定位的位置，
              // 所以top1的位置需要加115改成相对于文档的位置，left1就不需要；
              let top1 = parseFloat($('.ui-draggable-dragging').css('top').replace('px', '')) + 115;
              let left1 = parseFloat($('.ui-draggable-dragging').css('left').replace('px', ''));
              if (top1 >= top && top1 < top + item.height() && left1 >= left && left1 < left + item.width()) {
                item.addClass('draggable-dragging');
              } else {
                item.removeClass('draggable-dragging');
              }
            });
          },
          stop: function () { // 当鼠标松开时，触发此事件。
            let dragTarget = $(this);
            $('.crf-step').each(function () {
              let item = $(this);
              let top = item.offset().top;
              let left = 310;
              if (that.$parent.crfLeftBtnStatus) {
                left = 0;
              } else {
                left = 310;
              }
  
              let top1 = parseFloat($('.ui-draggable-dragging').css('top').replace('px', '')) + 115;
              let left1 = parseFloat($('.ui-draggable-dragging').css('left').replace('px', ''));
              if (top1 >= top && top1 < top + item.height() && left1 >= left && left1 < left + item.width()) {
                let secondItem = {};
                if (dragTarget.parent().attr('class').indexOf('level1') > -1) {
                  // 拖动2级
                  secondItem = treeDemo.getNodeByTId(dragTarget.attr('id').replace('_span', ''));
                  secondItem.formElements = [];
                  dragTarget.parent().siblings('ul').find('.checkbox_true_full').each(function () {
                    secondItem.formElements.push(treeDemo.getNodeByTId($(this).attr('id').replace('_check', '')));
                  });
                } else {
                  // 拖动3级
                  secondItem = treeDemo.getNodeByTId(dragTarget.closest('ul').attr('id').replace('_ul', ''));
                  secondItem.formElements = [];
                  secondItem.formElements.push(treeDemo.getNodeByTId(dragTarget.attr('id').replace('_span', '')));
                }
                let module = {
                  'descriptionCN': secondItem.descriptionCN,
                  'descriptionEN': secondItem.descriptionEN,
                  'displayNameCN': secondItem.displayNameCN,
                  'displayNameEN': secondItem.displayNameEN,
                  'elNameCN': secondItem.elNameCN,
                  'elNameEN': secondItem.elNameEN,
                  'formElements': [],
                  'id': secondItem.id,
                  'priority': secondItem.priority,
                  'refOpenEhrId': secondItem.refOpenEhrId,
                  'stageId': ''
                };
                if (secondItem.formElements && secondItem.formElements.length > 0) {
                  secondItem.formElements.forEach(function (element) {
                    module.formElements.push({
                      'alignType': element.alignType,
                      'colWidth': element.colWidth,
                      'ctrlType': element.ctrlType,
                      'dataLength': element.dataLength,
                      'dataType': element.dataType,
                      'dataValue': element.dataValue,
                      'defaultValue': element.defaultValue,
                      'descriptionCN': element.descriptionCN,
                      'descriptionEN': element.descriptionEN,
                      'displayNameCN': element.displayNameCN,
                      'displayNameEN': element.displayNameEN,
                      'elNameCN': element.elNameCN,
                      'elNameEN': element.elNameEN,
                      'id': element.id,
                      'moduleId': element.moduleId,
                      'parentList': element.parentList,
                      'parentOpenEhrId': element.parentOpenEhrId,
                      'priority': element.priority,
                      'refOpenEhrId': element.refOpenEhrId,
                      'rowHeight': element.rowHeight,
                      'stageId': '',
                      'validRegex': element.validRegex,
                      'validType': element.validType,
                      'valueRange': element.valueRange,
                      'crfEditInput': '', // 前端新增
                      'setbox': [] // 前端新增
                    });
                  });
                }
                // console.log(module);
                that.$emit('dragStop', Object.assign({}, module), item.attr('index'));
              }
            });
            $('.crf-step').removeClass('draggable-dragging');
          }
        });
    },
    async treeSearch () {
      this.loading = true;
      let result = await this.$http.crfFindModules({search: this.searchName});
      this.drawTree(result);
      this.loading = false;
      this.searching = false;
      this.$nextTick(() => {
        if (this.searchName.trim() === '') return false;
        this.openFirstTreenode();
      });
    },
    zTreeOnClick (event, treeId, treeNode) {
      this.$emit('partNodeClick', treeNode);
    },
    /**
     * 展开树节点的第一层
     */
    openFirstTreenode () {
      // 获取树对象
      let treeObj = $.fn.zTree.getZTreeObj('treeDemo' + this.random);
      let nodesSys = treeObj.getNodes(); // 可以获取所有的父节点(第一层)
      // 展开第一级树
      nodesSys.forEach(node => {
        treeObj.expandNode(node, true);
      });
      this.onDraggable();
    }
  }
};
</script>
<style lang="less">
  .ztree-box {
    .el-input__prefix{
      top: 4px;
    }
  }

  .draggable-dragging {
    outline: 3px solid #f7b444
  }

  .ztree-box {
    height: 100%
  }

  .ztree * {
    padding: 0;
    margin: 0;
    font-size: 12px;
    font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif;
  }

  .ztree {
    margin: 0;
    padding: 5px;
    color: #333;
    overflow-x: hidden;
    height: calc(100% - 50px);
    overflow-y: auto;
  }

  .ztree li {
    padding: 0;
    margin: 0;
    list-style: none;
    line-height: 14px;
    text-align: left;
    white-space: nowrap;
    outline: 0
  }

  .ztree li ul {
    margin: 0;
    padding: 0 0 0 18px
  }

  .ztree li ul.line {
    background: url(./line_conn.gif) 0 0 repeat-y;
  }

  .ztree li a {
    padding: 1px 3px 0 0;
    margin: 0;
    cursor: pointer;
    height: 27px;
    color: #333;
    background-color: transparent;
    text-decoration: none;
    vertical-align: top;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 50px);
  }

  .ztree li a:hover {
    text-decoration: underline
  }

  .ztree > li > span:nth-child(2) {
    display: none !important
  }

  .ztree li a.curSelectedNode {
    padding-top: 0px;
    background-color: #FFE6B0;
    color: black;
    height: 26px;
    border: 1px #FFB951 solid;
    opacity: 0.8;
  }

  .ztree li a.curSelectedNode_Edit {
    padding-top: 0px;
    background-color: #FFE6B0;
    color: black;
    height: 16px;
    border: 1px #FFB951 solid;
    opacity: 0.8;
  }

  .ztree li a.tmpTargetNode_inner {
    padding-top: 0px;
    background-color: #316AC5;
    color: white;
    height: 16px;
    border: 1px #316AC5 solid;
    opacity: 0.8;
    filter: alpha(opacity=80)
  }

  .ztree li a.tmpTargetNode_prev {
  }

  .ztree li a.tmpTargetNode_next {
  }

  .ztree li a input.rename {
    height: 14px;
    width: 80px;
    padding: 0;
    margin: 0;
    font-size: 12px;
    border: 1px #7EC4CC solid;
    *border: 0px
  }

  .ztree li span {
    line-height: 28px;
    margin-right: 2px;
    color: #666666;
  }

  .ztree li span.button {
    line-height: 0;
    margin: 0;
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    border: 0 none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-image: url(./zTreeStandard.png);
  }

  .ztree li .node_name i {
    color: #ff0000;
  }

  .ztree li span.button.chk {
    width: 13px;
    height: 13px;
    margin: 0 3px 0 0;
    cursor: auto
  }

  .ztree li span.button.chk.checkbox_false_full {
    background-position: 0 0
  }

  .ztree li span.button.chk.checkbox_false_full_focus {
    background-position: 0 -14px
  }

  .ztree li span.button.chk.checkbox_false_part {
    background-position: 0 -28px
  }

  .ztree li span.button.chk.checkbox_false_part_focus {
    background-position: 0 -42px
  }

  .ztree li span.button.chk.checkbox_false_disable {
    background-position: 0 -56px
  }

  .ztree li span.button.chk.checkbox_true_full {
    background-position: -14px 0
  }

  .ztree li span.button.chk.checkbox_true_full_focus {
    background-position: -14px -14px
  }

  .ztree li span.button.chk.checkbox_true_part {
    background-position: -14px -28px
  }

  .ztree li span.button.chk.checkbox_true_part_focus {
    background-position: -14px -42px
  }

  .ztree li span.button.chk.checkbox_true_disable {
    background-position: -14px -56px
  }

  .ztree li span.button.chk.radio_false_full {
    background-position: -28px 0
  }

  .ztree li span.button.chk.radio_false_full_focus {
    background-position: -28px -14px
  }

  .ztree li span.button.chk.radio_false_part {
    background-position: -28px -28px
  }

  .ztree li span.button.chk.radio_false_part_focus {
    background-position: -28px -42px
  }

  .ztree li span.button.chk.radio_false_disable {
    background-position: -28px -56px
  }

  .ztree li span.button.chk.radio_true_full {
    background-position: -42px 0
  }

  .ztree li span.button.chk.radio_true_full_focus {
    background-position: -42px -14px
  }

  .ztree li span.button.chk.radio_true_part {
    background-position: -42px -28px
  }

  .ztree li span.button.chk.radio_true_part_focus {
    background-position: -42px -42px
  }

  .ztree li span.button.chk.radio_true_disable {
    background-position: -42px -56px
  }

  .ztree li span.button.switch {
    width: 18px;
    height: 28px
  }

  .ztree li span.button.root_open {
    background-position: -92px -97px
  }

  .ztree li span.button.root_close {
    background-position: -74px -97px
  }

  .ztree li span.button.roots_open {
    background-position: -92px 0
  }

  .ztree li span.button.roots_close {
    background-position: -74px 0
  }

  .ztree li span.button.center_open {
    background-position: -92px -30px
  }

  .ztree li span.button.center_close {
    background-position: -74px -30px
  }

  .ztree li span.button.bottom_open {
    background-position: -92px -64px
  }

  .ztree li span.button.bottom_close {
    background-position: -74px -64px
  }

  .ztree li span.button.noline_open {
    background-position: -92px -72px
  }

  .ztree li span.button.noline_close {
    background-position: -74px -72px
  }

  .ztree li span.button.root_docu {
    background: none;
  }

  .ztree li span.button.roots_docu {
    background-position: -56px 0
  }

  .ztree li span.button.center_docu {
    background-position: -56px -30px
  }

  .ztree li span.button.bottom_docu {
    background-position: -56px -63px
  }

  .ztree li span.button.noline_docu {
    background: none;
  }

  .ztree li span.button.ico_open {
    margin-right: 2px;
    background-position: -110px -16px;
    vertical-align: top;
    *vertical-align: middle
  }

  .ztree li span.button.ico_close {
    margin-right: 2px;
    background-position: -110px 0;
    vertical-align: top;
    *vertical-align: middle
  }

  .ztree li span.button.ico_docu {
    margin-right: 2px;
    background-position: -110px -32px;
    vertical-align: top;
    *vertical-align: middle;
    display: none
  }

  .ztree li span.button.edit {
    margin-right: 2px;
    background-position: -110px -48px;
    vertical-align: top;
    *vertical-align: middle
  }

  .ztree li span.button.remove {
    margin-right: 2px;
    background-position: -110px -64px;
    vertical-align: top;
    *vertical-align: middle
  }

  .ztree li span.button.ico_loading {
    margin-right: 2px;
    background: url(./loading.gif) no-repeat scroll 0 0 transparent;
    vertical-align: top;
    *vertical-align: middle
  }

  ul.tmpTargetzTree {
    background-color: #FFE6B0;
    opacity: 0.8;
    filter: alpha(opacity=80)
  }

  span.tmpzTreeMove_arrow {
    width: 16px;
    height: 16px;
    display: inline-block;
    padding: 0;
    margin: 2px 0 0 1px;
    border: 0 none;
    position: absolute;
    background-color: white;
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-position: -110px -80px;
    background-image: url(./zTreeStandard.png);
  }

  ul.ztree.zTreeDragUL {
    margin: 0;
    padding: 0;
    position: absolute;
    width: auto;
    height: auto;
    overflow: hidden;
    background-color: #cfcfcf;
    border: 1px #00B83F dotted;
    opacity: 0.8;
    filter: alpha(opacity=80)
  }

  .zTreeMask {
    z-index: 10000;
    background-color: #cfcfcf;
    opacity: 0.0;
    filter: alpha(opacity=0);
    position: absolute
  }


</style>
