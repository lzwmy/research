<template>
  <!--消息提示窗口-->
  <div class="tip_box">
    <div class="mes_box" v-if="[2,3,4].includes(curInfo.status)" :class="
    ['mes_status_'+curInfo.status,curInfo.isExamine?'isExamine':'',curInfo.btnText=='通过'?'pass':'']">
      <div class="mes_info"><i class="icon iconfont" :class="curInfo.icon"></i><span class="mes_text">{{curInfo.text}}</span></div>
      <div class="mes_btn" @click="clickVerify(curInfo.status)">{{curInfo.btnText}}</div>
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
        default:0
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
            status: 0,          //报告状态
            text: null,         //提示文本消息
            showBtn: true,      //是否显示提交、保存按钮
            btnText:'召回',     //按钮文字
            mode:0,             //模式0-填写  1-阅读
            icon:null,          //iconfont  
          },
          { 
            isExamine:false,    
            status: 1,          
            text: null,        
            showBtn: true,      
            btnText:'召回',     
            mode:0,            
            icon:null, 
          },
          //非审核 
          { 
            isExamine:false,    
            status: 2,          
            text: '数据尚未审核',        
            showBtn: false,      
            btnText:'召回',     
            mode:1,            
            icon:'iconjianqu1', 
          },
          { 
            isExamine:false,    
            status: 3,          
            text: '数据审核不通过',        
            showBtn: false,      
            btnText:'召回',     
            mode:1,            
            icon:'iconjianqu3', 
          },
          { 
            isExamine:false,    
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
            status: 2,          
            text: '已修改处批注',        
            showBtn: false,      
            btnText:'不通过',     
            mode:1,            
            icon:'iconjianqu1', 
          },
          { 
            isExamine:true,    
            status: 3,          
            text: '数据审核不通过',        
            showBtn: false,      
            btnText:'重新审核',     
            mode:1,            
            icon:'iconjianqu3', 
          },
          { 
            isExamine:true,    
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
    created() {
      this.curInfo = this.messageList.find(li=>{
        return li.status== this.tipStatus && li.isExamine == this.isExamine;
      })
      this.$emit('handleView',this.curInfo || {})
    },
    methods:{
      clickVerify(status) {
        //如果为非审核情况下，显示保存、提交按钮 进入填写模式
        if(!this.isExamine) { // 召回
          this.curInfo.status = 1;
          this.curInfo.mode = 0;
          this.curInfo.showBtn = true;
          this.reportBakCallback();
          this.$emit('handleView',this.curInfo)
        }else { // 通过 or  不通过
          this.curInfo = this.messageList.find(li=>{
            return li.status== 2 && li.isExamine == this.isExamine;
          });
          this.readReportBakAudit(3);
          this.$emit('handleView',this.curInfo)
        }
        // this.readReportBakAudit(status).then(data => this.$emit('handleView',data));
      },
      // 审核报告  4 通过  3 不通过
      async readReportBakAudit(status) {
        let that = this;
        let formData = {
          'notationList':this.$store.state.annotateData.annotateList || [],
          "reportId":that.$parent.report.id,
          "status":status,
        };
        try {
          let data = await that.$http.readReportBakAudit(formData);
          return data;
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
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .success_status {
    background:rgba(0,192,142,0.08);
    border: 1px solid #00BF8F;
    .icon {
      color: #00BF8F;
    }
    .mes_text {
      color: #00BF8F;
    }
    .mes_btn {
      background:#00C08E;
    }
  }
  .fail_status {
    background:rgba(232,70,1,0.08);
    border:1px solid rgba(235,69,0,1);
    .icon {
      color: #E24828;
    }
    .mes_text {
      color: #E5471B;
    }
    .mes_btn {
      background:rgba(229,71,27,1);
    }
  }
  .normal_status {
    background:rgba(126,131,180,0.08);
    border:1px solid rgba(126,130,182,1);
    .icon {
      color: #7E84B2;
    }
    .mes_text {
      color: #7E84B2;
    }
    .mes_btn {
      background:#7E84B2;
    }
  }
  .isExamine_btn{
    color: #2b41de;
    text-decoration: underline;
    background-color: transparent;
  }


  .tip_box {
    position: fixed;
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
    }
    .mes_btn {
      width:70px;
      height:32px;
      opacity:1;
      border-radius:2px;
      color: #ffffff;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &:hover{
        opacity: 0.8;
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
      &.isExamine {
        .mes_btn {
          .isExamine_btn();
        }
      } 
      
    }
    .mes_status_4 {
      .success_status();
      &.isExamine {
        .mes_btn {
          .isExamine_btn();
        }
      }
    }
    
  }
</style>
