<template>
  <div id="areaTree">
    <div class="box-title">
      <a href="#">列表<i class="fa  fa-refresh" @click="freshArea"></i></a>
    </div>
    <div class="tree-box">
      <div class="zTreeDemoBackground left">
        <ul id="treeDemo" class="ztree"></ul>
      </div>
    </div>
  </div>
</template>

<script>
  import './js/jquery.ztree.core.js';
  import './js/jquery.ztree.excheck.js';
  import './css/zTreeStyle/zTreeStyle.css';
    export default {
      data:function () {
        return {
          setting:{

          },
          zNodes:[
            {
              "id": "",
              "crfName": "",
              "crfDisplayName": "1",
              "checked": false,
              "children": [
                {
                  "id": "",
                  "pageName": "",
                  "pageDisplayName": "2",
                  "checked": false,
                  "children": [
                    {
                      "id": "",
                      "portionName": "",
                      "portionDisplayName": "",
                      "checked": false,
                      "children": [
                        {
                          "id": "",
                          "controlName": "",
                          "controlDisplayName": "",
                          "controlType": "SINGLE_INPUT",
                          "checked": false,
                          "termSet": {
                            "termGroupOid": null,
                            "termGroupName": null,
                            "termDefaultValue": [ ],
                            "termItemList": [ ]
                          },
                          "termUnit": {
                            "numberIsSwitch": 1,
                            "unitName": null
                          },
                          "children": [ ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "id": "",
              "crfName": "",
              "crfDisplayName": "",
              "checked": false,
              "children": [
                {
                  "id": "",
                  "pageName": "",
                  "pageDisplayName": "",
                  "checked": false,
                  "children": [
                    {
                      "id": "",
                      "portionName": "",
                      "portionDisplayName": "",
                      "checked": false,
                      "children": [
                        {
                          "id": "",
                          "controlName": "",
                          "controlDisplayName": "",
                          "controlType": "SINGLE_INPUT",
                          "checked": false,
                          "termSet": {
                            "termGroupOid": null,
                            "termGroupName": null,
                            "termDefaultValue": [ ],
                            "termItemList": [ ]
                          },
                          "termUnit": {
                            "numberIsSwitch": 1,
                            "unitName": null
                          },
                          "children": [ ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
          ]
        }
      },
      methods:{
        freshArea:function(){
          $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
        }
      },
      mounted() {
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      }
    }
</script>

<style scoped>

  #areaTree{
    border:1px solid #e5e5e5;    margin-bottom: 2px;border-radius: 4px;overflow: hidden;
  }
  .box-title{
    border-radius: 3px 3px 0 0;background-color: #f5f5f5;
  }
  .box-title a{
    color: #2fa4e7;
    text-decoration: none;font-size:14px;    display: block;
    padding: 8px 15px;cursor: pointer;
  }
  .box-title .fa{
    float:right;line-height: 20px;
  }
</style>
