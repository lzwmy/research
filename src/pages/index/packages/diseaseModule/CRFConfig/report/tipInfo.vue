<template>
  <!--消息提示窗口-->
  <div class="tip_box">
    <div class="mes_box" v-if="curInfo && curInfo.visible" :class="
    ['mes_status_'+curInfo.status,curInfo.isExamine?'isExamine':'',curInfo.btnText=='通过'?'pass':'']">
      <div class="mes_info"><i :class="curInfo.icon"></i><span class="mes_text">{{curInfo.text}}</span></div>
      <div class="flex-between-center">
        <div class="mes_btn" @click="clickVerify(curInfo.status,curInfo)">{{curInfo.btnText}}</div>
        <div class="mes_btn" v-if="!isExamine && [3,5].includes(curInfo.status)" @click="submitReportData()">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
/***
 * status 0 (未填写) => 无弹窗  显示提交保存按钮 （填写模式）
  status 1 (已填写) => 无弹窗  显示提交保存按钮  （填写模式）

  非数据监察进入
  status 2 (已提交) => 弹窗:数据尚未审核 召回  （阅读模式）   召回=>填写模式
  status 3 (不通过) => 弹窗:数据审核不通过 召回  （阅读模式） 修改=>填写模式
  status 4 (通过) => 弹窗:数据审核通过 召回  （阅读模式）     召回=>填写模式

  数据监察进
  status 2 (已提交) => 弹窗:审核 通过/不通过  （阅读模式）
  status 3 (不通过) => 弹窗:数据审核不通过 重新审核  （阅读模式）
  status 4 (通过) => 弹窗:数据审核通过 重新审核  （阅读模式）
  * 
**/
  export default {
    name: "tipInfo",
    props:{
      tipStatus:{
        type:Number,
        default: -1
      },
      isExamine:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        curInfo:{},
        messageList: [
          { 
            isExamine:false,    //是否审核
            visible: false,     //是否显示弹框
            status: 0,          //报告状态
            text: null,         //提示文本消息
            showBtn: true,      //是否显示提交、保存按钮
            btnText:'',     //按钮文字
            mode:0,             //模式0-填写  1-阅读
            icon:null,          //iconfont  
          },
          { 
            isExamine:false,    
            status: -1,      
            visible: false,     
            text: null,        
            showBtn: false,      
            btnText:'无状态报告',     
            mode: 0,            
            icon:null, 
          },
          { 
            isExamine:false,    
            status: 1,      
            visible: false,     
            text: null,        
            showBtn: true,      
            btnText:'',     
            mode:0,            
            icon:null, 
          },
          //非审核 
          { 
            isExamine:false,
            visible: true,   
            status: 2,          
            text: '报告尚未审核',        
            showBtn: false,      
            btnText:'召回',     
            mode:1,            
            icon:'el-icon-info', 
          },
          { 
            isExamine:false, 
            visible: true,   
            status: 3,          
            text: '报告存在0处批注',        
            showBtn: false,      
            btnText:'修改',     
            mode: 1,            
            icon:'el-icon-warning', 
          },
          { 
            isExamine:false, 
            visible: true,   
            status: 4,          
            text: '报告审核通过',        
            showBtn: false,      
            btnText:'召回',     
            mode:1,            
            icon:'el-icon-success', 
          },
          //审核
          { 
            isExamine:true,  
            visible: true,  
            status: 2,          
            text: '尚无数据批注',        
            showBtn: false,      
            btnText:'通过',     
            mode:1,            
            icon:'el-icon-success', 
          },
          { 
            isExamine:true,
            visible: true,    
            status: 3,          
            text: '报告审核不通过',        
            showBtn: false,      
            btnText:'重新审核',     
            mode:1,            
            icon:'el-icon-warning', 
          },
          { 
            isExamine:true,    
            visible: true,
            status: 4,          
            text: '报告审核通过',        
            showBtn: false,      
            btnText:'重新审核',     
            mode:1,            
            icon:'el-icon-success', 
          },
        ]
      }
    },
    computed: {
      annotateNum: function() {
        return this.$store.state.annotateData.annotateNum;
      }
    },
    watch: {
      annotateNum: function(newVal) {
        this.checkAnnotateNum(newVal);
      },
      'tipStatus':function (value) {
        this.curInfo = this.messageList.find(li=>{
          return li.status== value && li.isExamine == this.isExamine;
        });
        // console.log(value,this.tipStatus,this.isExamine,this.curInfo);
        this.$store.dispatch('UTipBtnTextFun',this.curInfo.btnText);
        this.$emit('handleView',this.curInfo || {})
      }
    },
    created() {
      this.curInfo = this.messageList.find(li=>{
        return li.status== this.tipStatus && li.isExamine == this.isExamine;
      })
      // this.$store.dispatch('UTipBtnTextFun',this.curInfo.btnText);
      this.$emit('handleView',this.curInfo || {})
    },
    methods:{
      clickVerify(status, curInfo) {
        //在不通过状态下,点击返回
        if(!this.isExamine && status == 3 && curInfo.btnText == '返回') {
          this.changeUnpassStatus(1)
          return;
        }
        //如果为非审核情况下，显示保存、提交按钮 进入填写模式
        this.$confirm('是否执行 ('+curInfo.btnText+') 操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //非审核模式下  召回 or 修改 or 提交
          if(!this.isExamine) { 
            switch (status) {
              case 3:
                //点击修改
                if(status == 3) {
                  this.changeUnpassStatus(0)
                  return;
                }
              default:
                this.reportBakCallback().then(() =>{
                    this.$parent.showReadComponent = false;
                    this.$parent.crfForm = null;
                    this.$parent.report = null;
                    this.$parent.initPage();
                } );
                return;
            }
          }else { 
            //审核相关操作
            this.toExamine();
          }
        }).catch(() => {});
      },
      // 审核报告   3 不通过 4 通过
      async readReportBakAudit(status) {
        let that = this;
        let array =JSON.parse(JSON.stringify(this.$store.state.annotateData.annotateList));
        let resultData = [];
        if(array.length) {
          resultData = array.filter(item =>{
            return item.old == 0
          });
        }
        let formData = {
          'notationList':resultData || [],
          "reportId":that.$parent.report.id,
          "status":status,
        };
        try {
          let data = await that.$http.readReportBakAudit(formData);
          if(data.code === 0) {
            that.$message.success('审核成功')
          }
        }catch (error) {
          console.log(error);
        }
      },
      async reportBakCallback() {
        let that = this;
        let formData = {
          reportId:that.$parent.report.id
        };
        try{
          let data = await that.$http.reportBakCallback(formData);
          console.log(data)
          return  data
        }catch (error) {
          console.log(error)
        }
      },
      //检查批注
      checkAnnotateNum (n) {
        if(this.isExamine) {
          //审核批注后改变对象属性的值
          let obj = this.messageList.find(li=>{
            return li.status == 2 && li.isExamine == true;
          })
          //无批注
          if(n==0) {
            obj.text = '尚无数据批注';
            obj.btnText = '通过';
            obj.icon = 'el-icon-success';
          }else {
            obj.text = '已修改'+n+'处批注';
            obj.btnText = '不通过';
            obj.icon = 'el-icon-warning';
          }
        }else {
          if(this.tipStatus == 3) {
            this.changeUnpassStatus(1)
          }
        }
      },
      //提交
      submitReportData() {
        this.$confirm('是否执行 (提交) 操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$parent.submitReportData();
        }).catch(() => {});
      },
      //审核
      toExamine() {
        // 通过 or  不通过   //重新审核
        switch (this.curInfo.btnText) {
          case '重新审核':
            this.checkAnnotateNum(this.annotateNum);
            this.curInfo = this.messageList.find(li=>{
              return li.status== 2 && li.isExamine == true;
            });
            this.$store.dispatch('UTipBtnTextFun',this.curInfo.btnText);
            break;
          case '通过':
            this.readReportBakAudit(4).then(()=>{
              setTimeout(() => {
                this.curInfo = this.messageList.find(li=>{
                  return li.status== 4 && li.isExamine == true;
                });
                this.$emit('handleView',this.curInfo)
              }, 500);
            })
            break;
          case '不通过':
            this.readReportBakAudit(3).then(()=>{
              setTimeout(() => {
                this.curInfo = this.messageList.find(li=>{
                  return li.status== 3 && li.isExamine == true;
                });
                this.$emit('handleView',this.curInfo)
              }, 500);
            });
            break;
          default:break;
        }
      },
      //在不通过状态报告下,切换状态 1: 修改  0：返回
      changeUnpassStatus(type = 1) {
        if(type == 1 ) {
          this.curInfo.text = '报告存在'+this.annotateNum+'处批注';
          this.curInfo.btnText = '修改';
          this.curInfo.mode = 1;
          this.curInfo.icon = 'el-icon-warning';
        }else {
          this.curInfo.text = '报告存在'+this.annotateNum+'处批注';
          this.curInfo.btnText = '返回';
          this.curInfo.mode = 0;
          this.curInfo.icon = 'el-icon-warning';
        }
        this.$emit('handleView',this.curInfo)
      }
    }
  }
</script>

<style lang="less">
  .success_status {
    background:rgba(0, 192, 141, 0.8);
    .icon {
      color: #fafafa;
    }
    .mes_text {
      color: #fafafa;
    }
  }
  .fail_status {
    background:rgba(249, 158, 0, 0.8);
    .icon {
      color: #fafafa;
    }
    .mes_text {
      color: #fafafa;
    }

  }


  .normal_status {
    background:rgba(126,131,180,0.8);
    .icon {
      color: #fafafa;
    }
    .mes_text {
      color: #fafafa;
    }
  }

  .mes_btn {
    background: #fafafa;
    color: #999;
    &:hover {
      background: #e5e5e5;
    }
  }
  .mes_btn_text {
    background: transparent;
    color: #fafafa;
  }


  .tip_box {
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 3;
    transform: translate(-50%, 0);
    .mes_box {
      display: flex;
      width: 456px;
      height: 42px;
      opacity:1;
      border-radius: 0 0 8px 8px;
      padding: 0 10px;
      align-items: center;
      justify-content: space-between;
    }
    .mes_info {
      display: flex;
      align-items: center;
      i {
        margin-top: 2px;
        font-size: 20px;
        color: #fafafa;
      }
      .mes_text {
        font-size: 14px;
        font-weight: 500;
        line-height: 21px;
        padding-left: 10px;
      }
      .iconfont{
        font-size: 22px;
      }
    }
    .mes_btn {
      width:64px;
      height: 26px;
      opacity:1;
      border-radius:2px;
      color: #999;
      margin-left: 10px;
      text-align: center;
      line-height: 26px;
      cursor: pointer;
    }
    .mes_status_2 {
      .normal_status();
      .mes_btn {
        .mes_btn_text();
      }
      &.isExamine {
        .mes_btn {
          background: #fafafa;
          color: #999;
          &:hover {
            background: #e5e5e5;
          }
        }
        .fail_status();
        &.pass {
          .success_status();
        }
      }
    }
    .mes_status_3 {
      .fail_status();
      .mes_btn {
        .mes_btn();
      }
      &.isExamine {
        .mes_btn {
          .mes_btn_text();
        }
      } 
      
    }
    .mes_status_4 {
      .success_status();
      .mes_btn {
        .mes_btn_text();
      }
      &.isExamine {
        .mes_btn {
          .mes_btn();
        }
      }
    }
    
  }
</style>
