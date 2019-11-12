// 递归 返回所有 父节点信息
export function familyTree (arr1, id,configName) {
  var temp = [];
  var sliceIndex = "";
  var forFn = function (arr, id) {
    for (var i = 0; i < arr.length; i++) {
      if(arr[i][configName] == id){
        temp.push(arr[i][configName]);
        break;
      }else{
        if(arr[i].children){
          temp.push(arr[i][configName]);
          forFn(arr[i].children, id);
        }
      }
    }
  };
  forFn(arr1, id);
  return temp;
}

//返回点击当前所有的父节点
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
export function getNamesId(array,childs,age) {
  for(var i=0;i<array.length;i++)
  {
    var item=array[i];
    if(item.treeId==age){
      childs.push(item);
      return childs;
    }
    if(item.children&&item.children.length>0){
      childs.push(item);
      var rs=getNamesId(item.children,childs,age);
      if(rs){
        return rs;
      }
      else{
        childs.remove(item);
      }
    }
  }
  return false;
}

export function objectJoin(array) {
  var obj = {
    "controlType":"",
    "displayName":"",
    "operator":"",
    "value1":"",
    "value2":"",
    "itemTree":[
      // {
      //     "name":"首页"
      // },
      // {
      //     "name":"首页"
      // }
    ]
  }
  for(var i=0;i<array.length;i++) {
    obj.itemTree.push({
      name:array[i].labelName
    })
  }
  var opName = array.slice(-2).map(item=>{
    return item.labelName
  }).join('-');
  obj.controlType = array[array.length-1].controlType;
  obj.displayName = opName;
  obj.itemTree.splice(0,1);
  return obj;
}


//找出两个数组不同项
export function arrayDiff(arr1, arr2) {
  return diff(arr1, arr2).concat( diff(arr2, arr1) );
  function diff(arr1, arr2) {
      var c = {};
      arr1.forEach(item=>{ 
          c[ JSON.stringify(item.crfDisplayName) ] = 0;
      });
      arr2.forEach(item=>{ 
          delete c[ JSON.stringify(item.crfDisplayName) ];
      });
      return Object.keys(c).map(JSON.parse);
  }
}


//更新tree的checked
export function updatedTreeChecked(obj, checked) {
  if (obj instanceof Object) {
      obj.checked = checked;
      for (let i in obj) {
          updatedTreeChecked(obj[i], checked); 
      } 
  }
}


//json数组遍历查找叶子节点更新到content
export function arrayErgodic(obj, fn , boolean) {
  if (obj.children instanceof Array) {
      obj.children.forEach( item =>{
        if(boolean == undefined) {
          if(typeof(item) == 'object' && JSON.stringify(item.children) == '[]' && item.checked) {
            fn(item, true)
          }
        }else if( typeof(item) == 'object' && JSON.stringify(item.children) == '[]' ) {
          fn(item, boolean)
        }
      })
      if(obj.children) {
          let n = [];
          for(let i = 0; i < obj.children.length; i++) {
              n[i] = arrayErgodic(obj.children[i], fn , boolean);
          }
      }
  }
}