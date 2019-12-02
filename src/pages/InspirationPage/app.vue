<template>
    <div class="research_inspiration-container">
      <div class="header-container">
        <i class="iconfont iconkeyanlinggan"></i>
        <span>科研灵感</span>
      </div>
      <div class="content_body-container">
        <el-tabs v-model="activeName" class="header-body">
          <el-tab-pane label="首页" name="home"></el-tab-pane>
          <el-tab-pane label="文献" name="literature">
            <literature></literature>
          </el-tab-pane>
          <el-tab-pane label="指南共识" name="GuidelineConsensus"></el-tab-pane>
          <el-tab-pane label="临床路径" name="ClinicalPathway"></el-tab-pane>
          <el-tab-pane label="药品说明书" name="drugInstructions"></el-tab-pane>
          <el-tab-pane label="临床试验" name="clinicalTrials"></el-tab-pane>
          <el-tab-pane label="误诊误治" name="misdiagnosis"></el-tab-pane>
        </el-tabs>
        <div class="blank_page" v-if="activeName!=='literature'">
          <div class="blank-center">
            <svg class="icon" aria-hidden="true" style="font-size: 170px;width:100%; text-align:center;">
              <use xlink:href="#iconzu11"></use>
            </svg>
            <p style="text-align: center">暂无内容</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import literature from './morePage/literature';
    export default {
      components:{
        literature
      },
      data() {
        return {
          activeName:"literature"
        }
      },
      methods:{

      },
      mounted() {
        document.title = '科研灵感'
      }
    }
</script>

<style lang="less" >
  body{
    background-color: #F0F2F7;
  }
.research_inspiration-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header-container{
    display: flex;
    width: 100%;
    height: 60px;
    background:rgba(9,14,64,1);
    box-shadow:0px 3px 6px rgba(0,0,0,0.16);
    opacity:1;
    color: #ffffff;
    align-items: center;
    padding: 0 30px;
    i{
      font-size:22px ;
    }
    span{
      font-size:18px;
      padding-left: 14px;
      font-weight: bold;
    }
  }
  .content_body-container{
    padding: 0 30px;
     .header-body{
        .el-tabs__header{
        .el-tabs__nav-wrap{
          .el-tabs__nav-scroll{
            .el-tabs__nav{
              .el-tabs__active-bar{
                height: 3px;
                background-color:#3D98FF;
              }
              .el-tabs__item{
                font-size: 16px;
                font-weight: bold;
                height: 60px;
                line-height: 60px;
              }
              .el-tabs__item.is-active{
                color: #3D98FF;
              }
            }
          }
        }
      }
    }
    .blank_page{
      min-height: 700px;
      position: relative;
      .blank-center {
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        p{
          color: #666666;
          font-size: 18px;
          padding-top:10px
        }
      }
    }
  }
}
</style>
