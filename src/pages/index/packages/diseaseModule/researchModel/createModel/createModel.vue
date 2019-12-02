<template>
    <div class="create_model_container">
      <div class="component_head flex-between-center">
        <p>{{$route.meta.txt}}</p>
        <div class=" cur_pointer head_content flex-start-center">
          <div class="create_model_btn" @click="createModel">
            <i class="iconfont icontianjia"></i>
            <span>新建建模</span>
          </div>
        </div>
      </div>
      <!--主体内容-->
      <div class="create_model_content" v-loading="loading">
        <!--个人-->
        <div class="personal_model ml_30">
          <div class="personal_title">
            <i class="tab_left"></i>
            个人
          </div>
          <div class="personal_content">
            <!--@click.stop="jumpDetailPage(item)"-->
            <div class="personal_card"  v-for="(item,index) in personalList" :key="index">
              <div class="text_model" @click.stop="jumpDetailPage(item)">
                <p>
                  <span title="患者数量">
                    {{item.patientCount }}
                  </span>
                  /
                  <span title="报告个数">
                    {{item.crfSum}}
                  </span>
                </p>
                <p class="desc">{{item.modelName}}</p>
              </div>
              <div class="img_model" @click.stop="jumpDetailPage(item)">
                <i class="iconfont iconshuju"></i>
              </div>
              <div class="modify_model">
                <!--<i class="iconfont iconbianjibeifen"></i>
                <div class="modify_mask">
                  <i class="arrow_bottom"></i>
                  <div class="modify_text">编辑</div>
                  <div class="delete_tet">删除</div>
                </div>-->
                  <el-popover
                    placement="bottom"
                    trigger="click">
                    <p v-show="item.editable" @click="modifyModel(item)">编辑</p>
                    <p @click="delModel(item)">删除</p>
                    <i slot="reference" class="iconfont iconbianjibeifen"></i>
                  </el-popover>
              </div>
            </div>
            <img v-if="personalList.length==''"  src="./images/research_module.png" alt="">
          </div>
        </div>
        <!--公共-->
        <div class="personal_model mt_30">
          <div class="personal_title">
            <i class="tab_left common_color"></i>
            公共
          </div>
          <div class="personal_content">
            <div class="personal_card" v-for="(item,index) in commonList" :key="index">
              <div class="text_model" @click.stop="jumpDetailPage(item)">
                <p>
                  <span title="患者数量">{{item.patientCount }}</span>
                  /
                  <span title="报告个数">{{item.crfSum}}</span>
                </p>
                <p class="desc">{{item.modelName}}</p>
              </div>
              <div class="img_model" @click.stop="jumpDetailPage(item)">
                <i class="iconfont iconshuju"></i>
              </div>
              <div class="modify_model">
                <!--<i class="iconfont iconbianjibeifen"></i>
                <div class="modify_mask">
                  <i class="arrow_bottom"></i>
                  <div class="modify_text">编辑</div>
                  <div class="delete_tet">删除</div>
                </div>-->
                <el-popover
                  placement="bottom"
                  trigger="click">
                  <p v-show="item.editable" @click="modifyModel(item)">编辑</p>
                  <p @click="delModel(item)">删除</p>
                  <i slot="reference" class="iconfont iconbianjibeifen"></i>
                </el-popover>
              </div>
            </div>
            <img v-if="commonList.length==''" src="./images/research_module.png" alt="">
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "createModel",
      data() {
        return {
          commonList:[],
          personalList:[],
          loading:false,
          diseaseName:""
        }
      },
      methods:{
        //病种切换 刷新页面
        initPage() {
          this.modelManageGetDataList().then(()=>{
            this.$emit('changeLoadding',false);
          })
        },
        resize() {
          let height = $('#insideContainer').height()-60;
          $('.research_box').eq(0).css({
            "height":height+'px !important'
          })
        },
        //新建模型
        createModel() {
          let diseaseId = this.$route.query.id;
          this.$router.push({
            path:"/modelManage/configModel",
            query:{
              id:diseaseId,
              type:"add",
              modelId:"none",
              modelName:this.diseaseName,
            }
          })
        },
        //跳转到详细页面
        jumpDetailPage(data) {
          // console.log(data);
          let diseaseId = this.$route.query.id;
          this.$router.push({
            path:'/modelManage/detailPage',
            query:{
              id:diseaseId,
              name:data.modelName,
              modelId:data.modelId
            }
          })
        },
        //跳转到编辑页面
        modifyModel(data) {
          let diseaseId = this.$route.query.id;
          let dataList = this.$store.state.user.diseaseList.filter(item =>{
            return item.id == diseaseId;
          });
          // console.log(dataList[0]);
          this.$router.push({
            path:"/modelManage/configModel",
            query:{
              id:diseaseId,
              type:"modify",
              modelId:data.modelId,
              modelName:data.modelName,
            }
          })
        },
        //删除
        delModel(data) {
          this.$confirm('是否确定删除','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            // console.log('确定删除');
            this.modelManageDelete(data.modelId)
          }).catch(()=>{
            this.$notice("已取消删除");
          })
        },
        async modelManageGetDataList() {
          let that = this;
          let formData = {
            diseaseId:this.$route.query.id
          };
          try {
            // let data = await that.$http.modelManageGetDataList(formData);
            let data = await that.$http.modelListNew(formData);
            if(data.code ==0) {
              that.commonList = data.data.common.modelList;
              that.personalList = data.data.personal.modelList;
            }
          }catch (error) {
            console.log(error)
          }
          that.loading = false;
        },
        //删除模板
        async modelManageDelete(value) {
          let that = this;
          let formData = {
            modelId:value
          };
          try {
            // let data = await that.$http.modelManageDelete(that.$format(formData));
            let data = await that.$http.modelDeleteRequest(that.$format(formData));
            if(data.code==0) {
              this.$mes('success', data.msg);
            }
          }catch (error) {
            this.$notice("删除失败")
            console.log(error)
          }
          that.modelManageGetDataList();
        },
        //解决项目分享 获取不到病种名称问题 （临时问题）
        async getDiseaseInfo() {
          let that = this;
          let formData = {
            diseaseId:that.$route.query.id
          };
          try{
            let data = await that.$http.getDiseaseInfo(formData);
            console.log(data)
            if(data.code === 0) {
              that.diseaseName = data.data.name;
            }
          }catch (error) {
            console.log(error)
          }
        }
      },
      deactivated() {
        this.$destroy()
      },
      mounted() {
        this.loading = true;
        this.getDiseaseInfo()
        this.modelManageGetDataList()
      },
    }
</script>

<style lang="less" scoped>
.create_model_container{
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .create_model_btn{
    width: 120px;
    height: 32px;
    font-size:14px;
    color: #ffffff;
    background-color: #1BBAE1;
    line-height: 32px;
    text-align: center;
    border-radius:2px;
    i{
      font-size: 13px;
      position: relative;
      left: -10px;
    }
    span{
      position: relative;
      left: -5px;
    }
    &:hover{
      background-color: #14aed4;
    }
  }
  .create_model_content{
    width: 100%;
    box-sizing: border-box;
    padding: 30px 30px 0 30px;
    .personal_model{
      display: flex;
      flex-direction: column;
      .personal_title{
        display: flex;
        width: 100%;
        flex-direction: row;
        height: 25px;
        font-size: 18px;
        font-weight: bold;
        color: #666666;
        font-family:PingFang-SC;
        line-height: 25px;
        .tab_left{
          width: 2px;
          height: 100%;
          background-color:#8CC561;
          margin-right: 8px;
        }
        .common_color{
          background-color: #D95555;
        }
      }
      .personal_content{
        display: flex;
        justify-content: flex-start;
        width: 100%;
        margin-top: 15px;
        flex-wrap: wrap;
        min-height: 250px;
        box-sizing: border-box;
        position: relative;
        .personal_card{
          width: 235px;
          height: 100px;
          background-color: #ffffff;
          border: 1px solid #E5EBEC;
          border-radius:2px;
          display: flex;
          flex-direction: row;
          padding: 0 15px 0 20px;
          box-sizing: border-box;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 0;
          cursor: pointer;
          margin-bottom: 30px;
          margin-right:30px;
          box-shadow: 0 2px 16px -11px rgba(0, 0, 0, 0.5);
          transition: all 300ms;
          .text_model{
            p{
              :first-child{
                font-size: 22px;
                color: #1bbae1;
                font-family:Roboto;
                font-weight: bold;
                padding-bottom: 8px;
              }
              :last-child{
                font-size: 22px;
                color: #1bbae1;
                font-family:Roboto;
                font-weight: bold;
                padding-bottom: 8px;
              }
            }
            :first-child{
              font-size: 22px;
              color: #1bbae1;
              font-family:Roboto;
              font-weight: bold;
              padding-bottom: 8px;
            }
            .desc{
              display: inline-block;
              width: 140px;
              font-size: 12px;
              font-weight: 400;
              color: #666666;
              display: -webkit-box;
              /* autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
          .img_model{
            i{
              font-size: 40px;
              color: #1bbae1;
            }
          }
          .modify_model{
            position: absolute;
            top: 4px;
            right: 8px;
            cursor: pointer;
            transform: rotateZ(90deg);
            /*display: none;*/
            i{
              font-size: 16px;
              color: #666666;
              transform: rotateZ(90deg);
            }
            &:hover .modify_mask{
              display: inline-block;
            }
          }
          .mask_layer{
            display: none;
            position: absolute;
            left: 0;
            bottom: -40px;
            height: 40px;
            width: 100%;
            /*display: flex;*/
            align-items: center;
            justify-content: center;
            z-index: 5;
            .mask_top{
              position: absolute;
              top:0;
              left: 0;
              bottom: 0;
              right: 0;
              background-color: #000000;
              opacity: 0.5;
            }
            .modify_text{
              position: absolute;
              top: 50%;
              left: 25%;
              opacity: 1;
              font-size: 14px;
              color: #fff;
              padding: 5px;
              margin-right: 5px;
              border: 1px solid #fff;
              border-radius: 2px;
              z-index: 1;
              transform: translate(0,-50%);
              &:hover{
                color: #1bbae1;
                border-color: #1bbae1;
              }
            }
            .delete_text{
              position: absolute;
              top: 50%;
              left: 55%;
              opacity: 1;
              font-size: 14px;
              color: #fff;
              padding: 5px;
              border: 1px solid #fff;
              border-radius: 2px;
              transform: translate(0,-50%);
              &:hover{
                color: #1bbae1;
                border-color: #1bbae1;
              }
            }
          }
          .modify_mask{
            position: absolute;
            top: 6px;
            right: -66px;
            width: 75px;
            height: 50px;
            background-color: #ffffff;
            color: #666666;
            text-align: center;
            box-sizing: border-box;
            transform: rotateZ(-90deg);
            /*opacity: 0.8;*/
            border: 1px solid #E5EBEC;
            /*display: none;*/
            div{
              height: 25px;
              line-height: 25px;
            }
            .arrow_bottom{
              position: absolute;
              bottom: 49px;
              right: 8px;
              display: inline-block;
              content: "";
              width: 0;
              height: 0;
              border: 8px solid ;
              z-index: 2;
              border-color: transparent transparent #E5EBEC transparent;
              transform: rotateZ(0deg);
            }
          }
          &:hover {
            transform: translate(0,-2px);
          }
          &:hover .modify_model{
            display: inline;
          }
          /*&:hover .mask_layer{
            animation-name: moveTop;
            animation-duration: 200ms;
            animation-timing-function: linear;
            animation-delay: 0s;
            animation-iteration-count: 1;
            animation-direction: normal;
            animation-fill-mode:forwards;
            @keyframes moveTop{
              0%{
                bottom: -100px;
              }
              50%{
                bottom:-50px;
              }
              100%{
                bottom: 0;
              }
            }
          }*/
        }
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
      }
    }
    .ml_30{
      padding-bottom: 10px;
      border-bottom: 1px solid #E5EBEC;
    }
    .mt_30{
      margin-top: 30px;
    }
  }
}
</style>
<style lang="less">
  /*popover 提示框*/
  .el-popover{
    min-width: 96px;
    p{
      font-size: 14px;
      color: #666666;
      &:hover{
        color: #1bbae1;
        cursor: pointer;
      }
    }
  }
</style>
