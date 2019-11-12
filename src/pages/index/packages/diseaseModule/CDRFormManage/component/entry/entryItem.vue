<template>
  <div style="margin-left: 20px">
    <!--v-for="(item,index) in addEntryList"-->
    <el-form ref="entryItem" :dataId="index" :parentList="list" :inline="true" v-for="(item,index) in list">
      <el-form-item>
        <el-input  placeholder="条目名称" :dataId="index" v-model="item.controlName" size="mini" ></el-input>
      </el-form-item>
      <span class="extent del">*</span>
      <el-form-item>
        <el-input  placeholder="条目显示名称" v-model="item.controlDisplayName" size="mini" ></el-input>
      </el-form-item>
      <span class="extent del">*</span>
      <el-form-item>
        <el-select v-model="item.controlType"
                   size="mini"
                   placeholder="选择显示类型"
                   @change="changeType(item,item.controlType,index)">
          <el-option v-for="item in selectShowList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item >
        &lt;!&ndash;<el-select
                   size="mini"
                   placeholder="选择排列方式">
          <el-option v-for="item in layoutList"
                     :key="item.index"
                     :label="item.name"
                     :value="item.index"></el-option>
        </el-select>&ndash;&gt;
      </el-form-item>
      <el-form-item >
        <el-select
                   size="mini"
                   placeholder="是否不详">
          <el-option label="无" value="0"></el-option>
          <el-option label="是否不详" value="1"></el-option>
          <el-option label="有无" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        &lt;!&ndash;<el-select
                   size="mini"
                   placeholder="选择单位">
          <el-option v-for="item in unitList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>&ndash;&gt;
      </el-form-item>
      <el-form-item >
        <el-input  size="mini" placeholder="代码集"></el-input>
      </el-form-item>
      &lt;!&ndash;是否显示&ndash;&gt;
      <i class="iconfont iconfuhao2 gray"></i>
      <i class="iconfont iconfuhao2"></i>
      &lt;!&ndash;设置代码集&ndash;&gt;
      <i class="iconfont iconfuhao"></i>
      &lt;!&ndash;设置&ndash;&gt;
      <i class="iconfont iconfuhao7"></i>
      &lt;!&ndash;添加&ndash;&gt;
      <i class="iconfont iconfuhao1" @click="addEntryData(item,index)"></i>
      &lt;!&ndash;删除&ndash;&gt;
      <i class="iconfont iconfuhao4 del"></i>
      &lt;!&ndash;上移&ndash;&gt;
      <i class="iconfont iconfuhao5"></i>
      &lt;!&ndash;下移&ndash;&gt;
      <i class="iconfont iconfuhao6"></i>
      &lt;!&ndash;切换按钮&ndash;&gt;
      <i class="iconfont iconzujian"></i>-->
      <div class="display_control_box">
        <!--标签-->
        <div class="display_control_box" v-if="item.controlType==='LABEL'? true :false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--单行文本框-->
        <div class="display_control_box" v-if="item.controlType==='SINGLE_INPUT'? true :false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--多行文本域-->
        <div class="display_control_box" v-if="item.controlType === 'MULTI_INPUT'? true : false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--日期-->
        <div class="display_control_box" v-if="item.controlType === 'DATE'? true : false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--日期时间-->
        <div class="display_control_box" v-if="item.controlType === 'DATE_TIME'? true : false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--数值-->
        <div class="display_control_box" v-if="item.controlType === 'NUMBER_INPUT'? true :false">
          <el-select v-if="item.termUnit.numberIsSwitch===1?true:false"
                     filterable
                     v-model="item.termUnit.unitName"
                     size="mini"
                     placeholder="选择单位">
            <el-option v-for="item in unitList"
                       :key="item.id"
                       :label="item.unitName"
                       :value="item.unitName"></el-option>
          </el-select>
          <el-input v-if="item.termUnit.numberIsSwitch===0?true:false" v-model="item.termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置代码集-->
          <i class="iconfont iconzidian" v-if="item.termUnit.numberIsSwitch===0?true:false"  @click="clickCodeSet(item,index)"></i>
          <!--切换-->
          <i class="iconfont iconzujian"  @click="clickSwitch(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--单选下拉-->
        <div class="display_control_box" v-if="item.controlType==='SINGLE_COMBOX'?true:false">
          <el-input v-model="item.termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置代码集-->
          <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--多选下拉-->
        <div class="display_control_box" v-if="item.controlType ==='MULTI_COMBOX'?true:false">
            <el-input v-model="item.termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
            <!--是否显示-->
            <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
            <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
            <!--设置代码集-->
            <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
            <!--设置-->
            <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
            <!--删除-->
            <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
            <!--上移-->
            <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
            <!--下移-->
            <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
          </div>
        <!--单选框-->
        <div class="display_control_box" v-if="item.controlType==='RADIO_BUTTON'?true:false">
          <el-input v-model="item.termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置代码集-->
          <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--多选框-->
        <div class="display_control_box" v-if="item.controlType==='CHECKBOX'?true:false">
          <el-input v-model="item.termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置代码集-->
          <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--集合-->
        <div class="display_control_box" v-if="item.controlType==='GATHER'? true : false">
          <el-select v-model="item.gatherRank"
                     size="mini"
                     placeholder="选择排列方式">
            <el-option v-for="item in layoutList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value"></el-option>
          </el-select>
          <el-input-number v-if="item.gatherRank=='1'?true:false"
                           v-model="item.gatherColumnNumber"
                           size="mini"
                           controls-position="right"
                           :min="2"
                           :max="5">
          </el-input-number>
          <el-select v-model="item.gatherKnowType"
                     size="mini"
                     placeholder="是否不详"
                     @change="changeGatherKnowType(item,item.gatherKnowType)">
            <el-option label="无" :value="0"></el-option>
            <el-option label="有无" :value="1"></el-option>
            <el-option label="是否不详" :value="2"></el-option>
          </el-select>
          <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
          <i class="iconfont iconfuhao1"  @click="addEntryData(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--表格-->
        <div class="display_control_box" v-if="item.controlType==='TABLE'? true : false">
          <el-select v-model="item.gatherRank"
                     size="mini"
                     placeholder="选择排列方式">
            <el-option v-for="item in layoutList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value"></el-option>
          </el-select>
          <el-select v-model="item.gatherKnowType"
                     size="mini"
                     placeholder="是否不详"
                     @change="changeGatherKnowType(item,item.gatherKnowType)">
            <el-option label="无" :value="0"></el-option>
            
            <el-option label="有无" :value="1"></el-option>
            <el-option label="是否不详" :value="2"></el-option>
          </el-select>
          <i class="iconfont iconzidian"  @click="clickCodeSet(item,index)"></i>
          <i class="iconfont iconfuhao1"  @click="addEntryData(item,index)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--文件上传-->
        <div class="display_control_box" v-if="item.controlType ==='FILE_UPLOAD'?true:false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--超链接-->
        <div class="display_control_box" v-if="item.controlType==='linkURL'?true:false">
          <!--是否显示-->
          <i class="iconfont iconfuhao2 gray" v-if="item.displayIsVisible === 0 ? true : false"  @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <i class="iconfont iconfuhao2" v-if="item.displayIsVisible === 1 ? true : false" @click="clickIsRequired(item,item.displayIsVisible)"></i>
          <!--设置-->
          <i class="iconfont iconfuhao7"   @click="clickSet(item,index)"></i>
          <!--删除-->
          <i class="iconfont iconfuhao4 del" v-if="index >= 0 ? true:false"  @click="delEntryData(item,index)"></i>
          <!--上移-->
          <i class="iconfont iconfuhao5" v-if="index >= 0 ? true:false" @click="clickMoveUp(item,index)"></i>
          <!--下移-->
          <i class="iconfont iconfuhao6" v-if="index >= 0 ? true:false" @click="clickMoveDown(item,index)"></i>
        </div>
        <!--<el-select v-model="gatherRank"
                   size="mini"
                   placeholder="选择排列方式">
          <el-option v-for="item in layoutList"
                     :key="item.index"
                     :label="item.name"
                     :value="item.index"></el-option>
        </el-select>
        <el-select v-model="gatherKnowType"
                   size="mini"
                   placeholder="是否不详">
          <el-option label="无" value="0"></el-option>
          <el-option label="是否不详" value="1"></el-option>
          <el-option label="有无" value="2"></el-option>
        </el-select>
        <el-select v-model="termUnit.unitName"
                   size="mini"
                   placeholder="选择单位">
          <el-option v-for="item in unitList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
        <el-input v-model="termSet.termGroupName" class="modify_width" size="mini" placeholder="代码集"></el-input>
        &lt;!&ndash;是否显示&ndash;&gt;
        <i class="iconfont iconfuhao2 gray"  @click="clickIsRequired(item)"></i>
        <i class="iconfont iconfuhao2"  @click="clickIsRequired(item)"></i>
        &lt;!&ndash;设置代码集&ndash;&gt;
        <i class="iconfont iconfuhao"  @click="clickCodeSet"></i>
        &lt;!&ndash;设置&ndash;&gt;
        <i class="iconfont iconfuhao7"  @click="clickSet()"></i>
        &lt;!&ndash;添加&ndash;&gt;
        <i class="iconfont iconfuhao1"  @click="addEntryData()"></i>
        &lt;!&ndash;删除&ndash;&gt;
        <i class="iconfont iconfuhao4 del"  @click="delEntryData"></i>
        &lt;!&ndash;上移&ndash;&gt;
        <i class="iconfont iconfuhao5"  @click="clickMoveUp"></i>
        &lt;!&ndash;下移&ndash;&gt;
        <i class="iconfont iconfuhao6"  @click="clickMoveDown"></i>
        &lt;!&ndash;切换按钮&ndash;&gt;
        <i class="iconfont iconzujian"  @click="clickSwitch()"></i>-->
      </div>
      <!--<icon :controlType="item.controlType"
            :gatherKnowType="item.gatherKnowType"
            :termUnit="item.termUnit"
            :termSet="item.termSet"
            :displayIsVisible="item.displayIsVisible"
            :countData="countData"
            :index="index"
            :item="item"
            :children="item.children"
            @status-IsVisible="statusIsVisible"
            @status-addList="statusAddList"></icon>-->
      <entryItem :countData="list[index]" :list="item.children" :dataCid="dataCid" :dataPid="index"></entryItem>
    </el-form>
    <div class="dialog-box">
      <!--//配置化弹框位置-->
      <keep-alive>
        <component  :is="currentTabComponent"
                    :dialogShow="dialogShow"
                    :basicDataInfo="basicDataInfo"
                    @add-data-callback="addDataCallback"
                    @basic-click="basicClick"
                    @dialog-close="dialogClose"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import icon from './controlDisplayIcon'
    export default {
      name: "entryItem",
      props:{
        list:{
          type:Array
        },
        countData:{ //父级数据
          type:Object
        },
        dataCid:{ //根部id
          type:Number
        },
        dataPid:{ //循环且套 子ID
          type:Number
        }
      },
      components:{
        icon:icon,
        dialogaddchildEntry:function(resolve) {//添加弹框
          require((['../dialog/addChildEntry']),resolve)
        },
        dialoginput:function(resolve) { //单行为本域
          require((['../dialog/dialoginput']),resolve)
        },
        dialogtextarea:function (resolve) { //多行文本弹框
          require((['../dialog/dialogtextarea']),resolve)
        },
        dialogdate:function(resolve) { //日期
          require((['../dialog/dialogdate']),resolve)
        },
        dialogdateTime:function(resolve) { //日期时间
          require((['../dialog/dialogdateTime']),resolve)
        },
        dialogradioSelect:function(resolve) { //下拉单选
          require((['../dialog/dialogradioSelect']),resolve)
        },
        dialogcheckBoxSelect:function(resolve) { //下拉多选
          require((['../dialog/dialogcheckBoxSelect']),resolve)
        },
        dialoglabel:function (resolve) { //标签
          require((['../dialog/dialoglabel']),resolve)
        },
        dialogCodeSet:function(resolve) { //设置值集
          require((['../dialog/dialogCodeSet']),resolve)
        },
        dialogdataBind:function (resolve) {
          require((['../dialog/dialogdataBind']),resolve)
        }
      },
      data() {
        return {
          //下拉 数据
          selectShowList:[
            {
              name:"单行文本框",
              value:'SINGLE_INPUT'
            },
            {
              name:"多行文本框",
              value:"MULTI_INPUT"
            },
            {
              name:"标签",
              value:"LABEL"
            },
            {
              name:"日期",
              value:"DATE"
            },
            {
              name:"日期时间",
              value:"DATE_TIME"
            },
            {
              name:"数值",
              value:"NUMBER_INPUT"
            },
            {
              name:"单选下拉",
              value:"SINGLE_COMBOX"
            },
            {
              name:"多选下拉",
              value:"MULTI_COMBOX"
            },
            {
              name:"单选框",
              value:"RADIO_BUTTON"
            },
            {
              name:"多选框",
              value:"CHECKBOX"
            },
            {
              name:"集合",
              value:"GATHER"
            },
            {
              name:"表格",
              value:"TABLE"
            },
            {
              name:"文件上传",
              value:"FILE_UPLOAD"
            },
            /*{
              name:"超链接",
              value:"linkURL"
            }*/
          ],
          //排列方式
          layoutList:[
            {
              name:"上下排列",
              value:0
            },
            {
              name:"左右排列",
              value:1
            }
          ],
          //选择单位
          unitList:[
            {
              name:"hour",
              value:"hour"
            },
            {
              name:"ml",
              value:"ml"
            },
            {
              name:"L",
              value:"L"
            },
            {
              name:"mg",
              value:"mg"
            },
            {
              name:"ug",
              value:"ug"
            },
            {
              name:"g",
              value:"g"
            },
            {
              name:"min",
              value:"min"
            }
          ],
          typeName:"", //下拉值
          layout:"",// 排列方式值 0 上下 1 左右
          linkage:"",// 是否不详 （联动）
          codeSet:"", //类型代码集
          completeState:"",//完成状态
          isAvailable:"",// 是否可用
          unitListValue:"",//选择单位
          currentTabComponent:"",//弹框组件区分
          dialogShow:false,//弹框显示隐藏
          basicDataInfo:{},//弹框 基础信息
        }
      },
      methods:{
        //显示类型
        changeType(obj,value,index) {
          console.log(this.countData)
          if((this.countData.controlType==='TABLE'&&value ==='TABLE')||(this.countData.controlType==='TABLE'&&value ==='GATHER')){
            this.$message({
              type:"error",
              message:"表格不能嵌套表格和集合"
            })
            obj.controlType = "";
            return ;
          }
          console.log(obj,value,index);
          if(obj.children.length>0){
            this.$confirm("是否确定重新选择类型","提示",{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type:"error"
            }).then(()=>{
              this.$message({
                type:"success",
                message:"选择成功"
              })
              obj.children=[];
            })
          }
          //选择类型是 清除termUnit设置
          obj.baseProperty={
            "controlWidth": 0, //(控件宽度)1 / 2 / 3 / 4 0(代表未设置)
            "controlHeight": 0, //(控件高度)1 / 2 / 3 / 4 0(代表未设置)
            "controlTip": "", //(控件输入提示)
            "controlIsDefaultDateTime": 0, //(是否使用默认时间或日期)
            "controlIsExtend":0, //(下拉框是否可扩展)
             "labelType":null,
                  "labelContent":null,
                  "labelImage":null,
                  "bindingInfo":{
                  "itemId":"",
                  "viewId":"",
                  "viewColumn":"",
                  "bindingType":"",
                  "bindingColumn":"",
                  "bindingColumnName":"",
                  "list":[]
                  }
          };
          obj.termSet={
            "termGroupOid": "", //(代码集OID)
            "termGroupName":'', //(代码集名称)
            "termDefaultValue":[],// 是否有默认值
            "termItemList": [],
            "foldFlag":1,
          };
          obj.termUnit={
            "numberIsSwitch":1, //单位是否显示
            "unitName":"",//单位值
          };
          obj.gatherKnowType="";
          obj.inputValue="";
          obj.gatherRank= 0;
          obj.gatherColumnNumber= 2;
          // this.typeSwitch(obj,value)
        },
        // icon控制事件
        //显示隐藏
        clickIsRequired(obj,value) {
          console.log(obj,value)
          if(value===0){
            obj.displayIsVisible = 1;
          }else{
            obj.displayIsVisible = 0;
          }
        },
        //代码集
        clickCodeSet(obj,index) {
          console.log("代码集")
          this.dialogShow = true;
          this.basicDataInfo = {
            obj:obj,
            selectType:obj.controlType,
            index:index
          }
          this.currentTabComponent = 'dialogCodeSet'
        },
        //设置
        clickSet(item,index){       
          this.dialogShow = true;   
          this.typeSwitch(item,index)
          
        },
        //添加
        addEntryData(obj,index){
          /*this.addEntryList.push(parameter[this.typeName])*/
          this.dialogShow = true;
          this.basicDataInfo = {
            obj:obj,
            selectType:obj.controlType,
            index:index
          }
          this.currentTabComponent = "dialogaddchildEntry";
        },
        //删除
        delEntryData(obj,index) {
          this.list.splice(index,1)
        },
        //上移
        clickMoveUp(obj,index) {
          if(index===0){
            return ;
          }
          let copyData = this.list[index];

          this.list.splice(index-1,0,copyData)
          // this.list.unshift(copyData);
          this.list.splice(index+1,1);
        },
        //下移
        clickMoveDown(obj,index) {
          console.log("下移",obj,index)
          if(this.list.length == index+1){
            return ;
          }
          let copyData = this.list[index]
          this.list.splice(index+2,0,copyData)
          this.list.splice(index,1)
        },
        //切换
        clickSwitch(obj,index) {
          console.log("切换");
          console.log(obj,index)
          if(obj.termUnit.numberIsSwitch === 0){
            obj.termUnit.numberIsSwitch = 1;
          }else{
            obj.termUnit.numberIsSwitch = 0;
          }
          //选择 数值时,代码集和单位选择进行切换
          /*if(!obj.unitShow){
            obj.unitShow = true;
            obj.codeSet.show = false;
          }else{
            obj.unitShow = false;
            obj.codeSet.show = true;
          }*/
        },
        //点击图标切换
        SwitchFolFlag(obj,value){
          console.log(obj,value)
          /*if(value===1){
            obj.foldFlag = 0;
          }else{
            obj.foldFlag = 1;
          }*/
        },
        changeGatherKnowType(obj,value){
          console.log(obj,value)
          if(value=='0'){
            obj.gatherFoldFlag = 0;
          }else if(value=='1'||value=='2'){
            obj.gatherFoldFlag = 1;
          }
        },
        //弹框关闭事件
        dialogClose(value){
          console.log("关闭弹框回调数据",value);
          this.dialogShow = value;
        },
        //组件 基础数据事件 回调
        basicClick(value) {
          console.log("设置 基础数据 回调",value);
        },
        //组件 添加弹框数据 回调
        addDataCallback(value) {
          console.log("设置 添加数据 回调2",value);
          // if(value.selectType!=='congregation'||value.selectType!=='table'){
          // }
        },
        // 图标 组件 参数回调
        //是否禁用
        statusIsVisible(value) {
          console.log("显示 隐藏 数据回调",value);
          //this.addEntryList[value.index].displayIsVisible = value.obj.displayIsVisible;
        },
        //添加
        statusAddList(value) {
          console.log("点击添加状态回调",value);
          this.dialogShow = true;
          this.basicDataInfo = {
            obj:value.obj,
            selectType:value.obj.controlType,
            index:value.index
          }
          this.currentTabComponent = "dialogaddchildEntry";
        },
        //选择显示类型处理
        typeSwitch(obj,value) {
          this.currentTabComponent = "";
         
          switch (obj.controlType) {
            case "LABEL" :
              this.basicDataInfo = {obj:obj,index:value,rootBinding:null};
              this.currentTabComponent = 'dialoglabel';
              break;
            default:
              let rootBinding=null;
              if(this.$parent.$parent.list){
                  rootBinding=this.$parent.$parent.list[this.dataPid];
              }
              if(this.$parent.$parent.entryData){
                 rootBinding=this.$parent.$parent.entryData;
              }
              this.basicDataInfo = {obj:obj,index:value,rootBinding:rootBinding};
              this.currentTabComponent = 'dialoginput';
              break;
          }
        },
        //获取单位列表
        async UnitListOrg() {
          let that = this;
          try{
            let data = await that.$http.crfUnitList()
            console.log(data)
            if(data.code ===0){
              that.unitList = data.data
            }
          }catch (error) {
            that.$notice("获取单位列表数据失败");
            console.log(error);
          }
        },
      },
      created() {
        this.UnitListOrg();
      },
      mounted() {

      }
    }
</script>

<style lang="less" scoped>
  .display_control_box{
    display:inline-block;
    vertical-align: middle;
    position: relative;
    top:-3px;
    left: 10px;
    .modify_width{
      width:168px;
    }
    .iconfont{
      color:#3B81F0;
      font-size:21px;
      padding-right: 10px;
    }
    .gray{
      color: #DEE2E5;
    }
    .del{
      color: #F0433C;
    }
    i{
      cursor:pointer;
    }
  }
  .extent{
    font-size: 20px;
    padding-right: 10px;
  }
  .del{
    color: #F0433C;
  }
</style>
