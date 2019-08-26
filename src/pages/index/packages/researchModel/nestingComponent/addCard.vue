<template>
    <div class="add_card_container">
      <!--<div class="card_title">麻醉数据库</div>-->
      <div class="card_content_box">
        <div class="card_basic_info" :class="{'active':this.$store.state.researchModel.researchData == item}" @click.stop="activeStyle(item)">
          <span class="help_inline">匹配一下</span>
          <el-select v-model="item.matchType">
            <el-option
              v-for="item in matchTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>规则</span>
          <el-button type="primary" @click.stop="addInsideComponent(item)">增加内组件</el-button>
          <el-button type="primary" @click.stop="addOuterComponent(item)">增加外组件</el-button>
          <i class="el-icon-remove-outline" title="删除"
             v-if="delShow"
             @click="delComponentData(pItem,Index)"></i>
          <add-line-info v-for="(it,index) in item.nodeList" :item="it" :Index="index" :PItem="item.nodeList"></add-line-info>
          <addCard v-for="(it,index) in item.children"  :pItem="item.children" :Index="index" :item="it" :delShow="true"></addCard>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex';
  import addLineInfo from "./addLIneInfo"
  export default {
      name: "addCard",
      props:{
        item:{
          type:Object,
          default:null
        },
        Index:{
          type:Number,
          default: null
        },
        delShow:{
          type:Boolean,
          default:null
        },
        pItem:{
          type:Array,
          default:null
        }
      },
      components:{
        addLineInfo
      },
      data() {
        return {
          matchType:"",
          matchTypeList:[
            {
              value: 0,
              label: '全部'
            }, {
              value: 1,
              label: '任一'
            }
          ],
          addData:{
            "children":[],
            "matchType":0,
            "nodeList":[
              /*{
                "name":"报告",
                "controlType":"RADIO_BUTTON",
                "operator":"",
                "value1":"",
                "value2":"",
                "item":{
                  "name":"单页",
                  "operator":"",
                  "value1":"",
                  "value2":"",
                  "item":{
                    "name":"小节",
                    "operator":"",
                    "value1":"",
                    "value2":"",
                    "item":{
                      "name":"就诊类型",
                      "operator":"",
                      "value1":"专家门诊",
                      "value2":"",
                      "item":{}
                    }
                  }
                }
              }*/
            ],
          },
          activeIndex:"",
          Item:this.item,
        }
      },
      computed:{
      },
      methods:{
        activeStyle(obj) {
          console.log(this.$store.state.researchModel.researchData);
          console.log(obj);
          this.$store.commit('STATE_GRAY',obj);
        },
        addInsideComponent(obj) {
          this.$store.commit('STATE_GRAY',null);
          let data = Object.assign({},JSON.parse(JSON.stringify(this.addData)));
          this.item.children.push(data)
          this.$store.commit('STATE_GRAY',data)
        },
        addOuterComponent(obj) {
          console.log(obj);
          this.$store.commit('STATE_GRAY',null);
          let data = Object.assign({},JSON.parse(JSON.stringify(obj)));
          //清空children
          for(let j=0;j<obj.children.length;j++) {
            obj.children.splice(j,1);
            j--
          }
          obj.children.push(data);
          //清空查询条件
          for(let i=0;i<obj.nodeList.length;i++) {
            obj.nodeList.splice(i,1);
            i--
          }
          // this.$store.commit('OUTER_PUSH',data)
          // this.Recursive(obj)
          this.$store.commit('STATE_GRAY',obj);
        },
        delComponentData(array,index) {
          this.$store.commit('STATE_GRAY',null);
          array.splice(index,1)
          // this.$store.commit('STATE_GRAY',null);
        },
        //递归循环 增加外组件嵌套
        Recursive(obj) {
          let data = Object.assign({},JSON.parse(JSON.stringify(this.addData)));
          let copyData = Object.assign({},JSON.parse(JSON.stringify(obj)))
          if(obj.children.length!==0){
            for(let i=0;i<obj.children.length;i++) {
              if(obj.children[i].children.length!==0) {
                this.Recursive(obj.children[i])
              }else{
                /*obj.children[i].children.push(data);*/
                console.log(data)
                /*this.$store.commit('STATE_GRAY',data)*/
              }
            }
          }else{
            console.log(copyData,data);
            // this.Item = data.children.push(copyData)
            obj.children.push(data);
            this.$store.commit('STATE_GRAY',data)
          }
        },
      //递归循环 清除所有选择选择项
        RecursiveBoolean(array) {
          if(array.length!==0){
            for(let i=0;i<array.length;i++) {
              array[i].isActive = false;
              if(array[i].children.length!==0) {
                this.RecursiveBoolean(array[i].children)
              }/*else{
                obj[i].isActive = false;
              }*/
            }
          }else{
            console.log('如果不等于0 自动添加');
            array.isActive =false
          }
        }
      },
      mounted() {

      }
    }
</script>

<style lang="less" scoped>
  .add_card_container{
    width: 100%;
    .card_title{
      display: inline-block;
      min-width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding: 0px 8px;
      background-color: #4D84FF;
      color: white;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 8px 8px 0 0;
    }
    .card_content_box{
      .card_basic_info{
        padding: 19px;
        margin-bottom: 10px;
        border-radius: 2px;
        border:1px solid rgba(216,216,216,1);
        /*vertical-align: text-bottom;*/
        cursor: pointer;
        background-color: #ffffff;
        span{
          padding: 0 5px;
        }
        i{
          color: #ffffff;
          background-color: #F0433C;
          border-radius: 50%;
          font-size: 16px;
          vertical-align: middle;
          margin-left: 1%;
        }
      }
      .active{
        background-color: #F7F8FC;
      }
    }
  }
</style>
