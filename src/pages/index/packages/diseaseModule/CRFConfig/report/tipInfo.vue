<template>
  <!--消息提示窗口-->
  <div class="tip_box">
    <div class="mes_box" v-if="curInfo && curInfo.visible" :class="
    ['mes_status_'+curInfo.status,curInfo.isExamine?'isExamine':'',curInfo.btnText=='通过'?'pass':'']">
      <div class="mes_info"><i class="icon iconfont" :class="curInfo.icon"></i><span class="mes_text">{{curInfo.text}}</span></div>
      <div class="mes_btn" @click="clickVerify(curInfo.status,curInfo)">{{curInfo.btnText}}</div>
    </div>
  </div>
</template>

<script>
/***
 * status 0 (未填写) => 无弹窗  显示提交保存按钮 （填写模式）
  status 1 (已填写) => 无弹窗  显示提交保存按钮  （填写模式）

  非数据监察进入
  status 2 (已提交) => 弹窗:数据尚未审核 召回  （阅读模式）   召回=>填写模式
  status 3 (不通过) => 弹窗:数据审核不通过 召回  （阅读模式） 召回=>填写模式
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
            text: '数据尚未审核',        
            showBtn: false,      
            btnText:'召回',     
            mode:1,            
            icon:'iconjianqu1', 
          },
          { 
            isExamine:false, 
            visible: false,   
            status: 3,          
            text: '数据审核不通过',        
            showBtn: true,      
            btnText:'召回',     
            mode: 0,            
            icon:'iconjianqu3', 
          },
          { 
            isExamine:false, 
            visible: true,   
            status: 4,          
            text: '数据审核通过',        
            showBtn: false,      
            btnText:'召回',     
            mode:1,            
            icon:'iconjianqu2', 
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
            icon:'iconjianqu2', 
          },
          { 
            isExamine:true,
            visible: true,    
            status: 3,          
            text: '数据审核不通过',        
            showBtn: false,      
            btnText:'重新审核',     
            mode:1,            
            icon:'iconjianqu3', 
          },
          { 
            isExamine:true,    
            visible: true,
            status: 4,          
            text: '数据审核通过',        
            showBtn: false,      
            btnText:'重新审核',     
            mode:1,            
            icon:'iconjianqu2', 
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
        })
        this.$emit('handleView',this.curInfo || {})
      }
    },
    created() {
      this.curInfo = this.messageList.find(li=>{
        return li.status== this.tipStatus && li.isExamine == this.isExamine;
      })
      this.$emit('handleView',this.curInfo || {})
    },
    methods:{
      clickVerify(status, curInfo) {
        //如果为非审核情况下，显示保存、提交按钮 进入填写模式
        this.$confirm('是否执行 ('+curInfo.btnText+') 操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(!this.isExamine) { // 召回
            this.reportBakCallback().then(() => this.$parent.initPage())
          }else { // 通过 or  不通过   //重新审核
            switch (this.curInfo.btnText) {
              case '重新审核':
                this.checkAnnotateNum(this.annotateNum);
                this.curInfo = this.messageList.find(li=>{
                  return li.status== 2 && li.isExamine == true;
                });
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
          }
        }).catch(() => {});
      },
      // 审核报告   3 不通过 4 通过
      async readReportBakAudit(status) {
        let that = this;
        let formData = {
          'notationList':this.$store.state.annotateData.annotateList || [],
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
      //提交后改变状态
      changeStatus(status) {
        this.curInfo = this.messageList.find(li=>{
          return li.status== 2 && li.isExamine == false;
        });
        this.$emit('handleView',this.curInfo)
      },
      //检查批注
      checkAnnotateNum (n) {
        //批注后改变对象属性的值
        let obj = this.messageList.find(li=>{
          return li.status == 2 && li.isExamine == true;
        })
        //无批注
        if(n==0) {
          obj.text = '尚无数据批注';
          obj.btnText = '通过';
          obj.icon = 'iconjianqu2';
        }else {
          obj.text = '已修改'+n+'处批注';
          obj.btnText = '不通过';
          obj.icon = 'iconjianqu3';
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .success_status {
    background:rgba(0,192,142,0.08);
    /*border: 1px solid rgba(0,192,142,0.08);*/
    border: 1px solid #00C18D;
    .icon {
      color: #00BF8F;
    }
    .mes_text {
      color: #00BF8F;
    }
    .mes_btn {
      background:#00C08E;
      color: #ffffff;
      &:hover{
       text-decoration: none;
      }
    }
  }
  .fail_status {
    background:rgba(232,70,1,0.08);
    /*border:1px solid rgba(232,70,1,0.08);*/
    border:1px solid rgba(235,69,0,1);
    .icon {
      color: #E24828;
    }
    .mes_text {
      color: #E5471B;
    }
    .mes_btn {
      background:rgba(229,71,27,1);
      color: #ffffff;
      &:hover{
        text-decoration: none;
      }
    }
  }


  .normal_status {
    background:rgba(126,131,180,0.08);
    /*border:1px solid rgba(126,131,180,0.08);*/
    border:1px solid rgba(126,130,182,1);
    .icon {
      color: #7E84B2;
    }
    .mes_text {
      color: #7E84B2;
    }
    .mes_btn {
      /*background:#7E84B2;*/
    }
  }
  .isExamine_btn{
    /*color: #2b41de;*/
    color: #787878;
    text-decoration: none;
    background-color: transparent;
    &:hover{
      color: #2b41de;
      text-decoration: underline;
    }
  }


  .tip_box {
    position: fixed;
    /*top: 16px;*/
    top: 22px;
    left: 50%;
    z-index: 3;
    transform: translate(-50%,-16px);
    .mes_box {
      display: flex;
      width: 556px;
      height: 42px;
      opacity:1;
      border-radius:4px;
      padding: 5px 10px;
      align-items: center;
      justify-content: space-between;
    }
    .mes_info {
      display: flex;
      align-items: center;
      .mes_icon {
        font-size: 24px;
      }
      .mes_text {
        font-size: 16px;
        font-weight: bold;
        line-height: 21px;
        padding-left: 10px;
      }
      .iconfont{
        font-size: 22px;
      }
    }
    .mes_btn {
      width:70px;
      height:32px;
      opacity:1;
      border-radius:2px;
      /*color: #ffffff;*/
      color: #787878;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &:hover{
        opacity: 0.8;
        color: #2b41de;
        text-decoration: underline;
      }
    }
    .mes_status_2 {
      .normal_status();
      &.isExamine {
        .fail_status();
        &.pass {
          .success_status();
        }
      }
    }
    .mes_status_3 {
      .fail_status();
      .mes_btn {
        background:transparent;
        color: #787878;
        &:hover{
          color: #2b41de;
          text-decoration: underline;
        }
      }
      &.isExamine {
        .mes_btn {
          .isExamine_btn();
        }

      } 
      
    }
    .mes_status_4 {
      .success_status();
      .mes_btn {
        background:transparent;
        color: #787878;
        &:hover{
          color: #2b41de;
          text-decoration: underline;
        }
      }
      &.isExamine {
        .mes_btn {
          .isExamine_btn();
        }
      }
    }
    
  }
</style>
