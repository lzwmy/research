<template>
  <div class="entry_container" v-if="comShow">
    <div class="entry_search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="名称:">
          <el-input v-model="formInline.entryName" size="mini" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="医学分类:">
          <el-select v-model="formInline.entryDisplayType" size="mini" clearable placeholder="医学分类">
            <el-option
              v-for="item in categoryNameList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全部医生:">
          <el-select v-model="formInline.entryAllDoctor" clearable size="mini" placeholder="全部医生">
            <el-option
              v-for="item in AllDoctor"
              :key="item.id"
              :label="item.author"
              :value="item.author"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sreachFromListCLick">查询</el-button>
          <el-button @click="emptCcondition">清空</el-button>
          <el-button @click="delEntry">删除</el-button>
          <el-button @click="newEntry">定义新报告</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="entry_content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="crfName" label="报告名称"></el-table-column>
        <el-table-column prop="crfDesc" label="报告描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="报告类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.crfType=='1'?'普通':scope.row.crfType=='2'?"随访":""}}
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" show-overflow-tooltip></el-table-column>
        <!--<el-table-column prop="crfNumber" label="报告数" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont iconfuhao2" @click="previewPage(scope.row)" title="预览"></i>
            <i class="iconfont iconbianji" @click="modifyData(scope.row)" title="编辑"></i>
            <i class="iconfont iconshanchu del" @click="singleDelData(scope.row.id)" title="删除"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer_btn">
        <!--<el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="pageSize"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>-->
        <pagination :data="paginationData" @change="getFormItemList"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from "components/mixins";
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';
  export default {
    mixins: [mixins],
    props: {
      comShow: {
        type: Boolean,
        default: true
      },
      objType: {}
    },
    components: {
      pagination
    },
    data() {
      return {
        formInline: {
          entryName: "", //名称
          entryAllDoctor: "", //全部医生
          entryDisplayType: "" //医学分类
        },
        AllDoctor: [],
        //全部类型
        selectShowList: [
          {
            name: "单行文本框",
            value: "SINGLE_INPUT"
          },
          {
            name: "多行文本框",
            value: "MULTI_INPUT"
          },
          {
            name: "标签",
            value: "LABEL"
          },
          {
            name: "日期",
            value: "DATE"
          },
          {
            name: "日期时间",
            value: "DATE_TIME"
          },
          {
            name: "数值",
            value: "NUMBER_INPUT"
          },
          {
            name: "单选下拉",
            value: "SINGLE_COMBOX"
          },
          {
            name: "多选下拉",
            value: "MULTI_COMBOX"
          },
          {
            name: "单选框",
            value: "RADIO_BUTTON"
          },
          {
            name: "多选框",
            value: "CHECKBOX"
          },
          {
            name: "集合",
            value: "GATHER"
          },
          {
            name: "表格",
            value: "TABLE"
          },
          {
            name: "文件上传",
            value: "FILE_UPLOAD"
          }
          /*{
                name:"超链接",
                value:"linkURL"
              }*/
        ],
        //医学分类
        categoryNameList:[],
        // 表格参数
        tableData: [],
        multipleSelection: [],
        loading: false, // 加载
        //分页参数
        /*currentPage: 1,
        pageSize: 10,
        total: 20,*/
        delList: [], //批量删除数组
        paginationData:{},
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        elementLoadingText: ''
      };
    },
    created() {
      /*console.log("创建完成1")
          this.getFormItemList()
          console.log("创建完成2")*/
      this.getAuthorList();
      this.getCategory();
    },
    methods: {
      //表格多选
      handleSelectionChange(val) {
        console.log("多选", val);
        this.multipleSelection = val;
      },
      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPage = val;
        this.getFormItemList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getFormItemList();
      },
      //查询
      sreachFromListCLick() {
        console.log("查询");
        this.loading = true;
        // this.sreachFromList();
        this.getFormItemList();
      },
      //编辑
      modifyData(value) {
        console.log("编辑", value);
        this.$emit("add-change", {
          type: "modifyReport",
          clickType: "modifyReport",
          obj: value
        });
      },
      previewPage(value) {
        console.log("预览", value);
        this.$router.push({
          path: "/reportPreview",
          query: {
            id: value.id,
            show: false
          }
        });
      },
      //清空
      emptCcondition() {
        this.formInline = {
          entryName: "", //查询名称
          entryAllDoctor: "" //查询全部医生
        };
      },
      //删除
      delEntry() {
        this.loading = true;
        this.delList = [];
        if (this.multipleSelection.length > 0) {
          this.$confirm('是否确定删除','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.batchDeletion();
          }).catch(()=>{
            this.$notice("已取消删除");
          })
        } else {
          this.$message({
            type: "error",
            message: "请选择要删除的数据"
          });
        }
        this.loading = false;
      },
      //表格内删除
      singleDelData(value) {
        console.log("表格内删除", value);
        this.$confirm('是否确定删除','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.singleDel(value);
        }).catch(()=>{
          this.$notice("已取消删除");
        })
      },
      //新增条目
      newEntry() {
        this.$emit("add-change", { type: "addReport", clickType: "addReport", obj: {} });
      },
      //获取报告列表
      async getFormItemList(pageNo = this.pageNo, pageSize = this.pageSize) {
        this.loading = true;
        let that = this;
        let formData = {
            args: {
              author:that.formInline.entryAllDoctor || "",
              categoryName: that.formInline.entryDisplayType || "",
              crfName:that.formInline.entryName || ""
            },
            limit: pageSize,
            offset: pageNo - 1
        };
        try {
          let data = await that.$http.crfReportList(that.$format(formData));
          console.log("报告 数据",data);
          if (data.code === 0) {
            let obj = {};
            that.tableData = data.data.args;
            that.total = data.data.totalElements;
            obj.content = data.data.args;
            obj.content.forEach((item, index) => {
              item.index = (pageNo - 1) * pageSize + index + 1;
            });
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.totalElements);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.paginationData = obj;
          }
        } catch (error) {
          that.$notice("获取报告列表失败");
          console.log(error);
          this.loading = false;
        }
        this.loading = false;
      },
      //搜索
      async sreachFromList() {
        this.loading = true;
        let that = this;
        let formData = {
          args: {
            author:that.formInline.entryAllDoctor || "",
            categoryName: that.formInline.entryDisplayType || "",
            crfName:that.formInline.entryName || ""
          },
          limit: that.pageSize,
          offset: that.currentPage - 1
        };
        try {
          let data = await that.$http.crfReportList(that.$format(formData));
          if (data.code === 0) {
            that.tableData = data.data.args;
            that.total = data.data.totalElements;
          }
        } catch (error) {
          that.$notice("查询报告失败");
          console.log(error);
        }
        this.loading = false;
      },
      //删除
      async batchDeletion() {
        this.loading = true;
        let that = this;
        that.multipleSelection.forEach((item, index, array) => {
          that.delList.push(item.id);
        });
        let formData = {
          list: that.delList
        };
        try {
          let data = await that.$http.crfReportDelete(that.$format(formData));
          console.log(data);
          if (data.code === 0) {
            that.$message({
              type: "success",
              message: data.msg
            });
          } else {
            that.$notice(data.msg)
          }
        } catch (error) {
          that.$notice("删除列表失败");
          that.delList = [];
          that.getFormItemList();
        }
        that.getFormItemList();
        this.loading = false;
      },
      //单行删除
      async singleDel(value) {
        this.loading = true;
        console.log(value);
        let that = this;
        let formData = {
          list: [value]
        };
        try {
          let data = await that.$http.crfReportDelete(that.$format(formData));
          console.log(data);
          if (data.data.code === 0) {
            that.$message({
              type: "success",
              message: data.data.msg
            });
          } else {
            that.$notice(data.msg)
          }
        } catch (error) {
          console.log("删除条目失败");
          console.log(error);
        }
        that.getFormItemList();
        this.loading = false;
      },
      //获取全部作者
      async getAuthorList() {
        let that = this;
        try {
          let data = await that.$http.crfGetAuthor();
          console.log(data);
          if (data.code === 0) {
            that.AllDoctor = data.data;
          } else {
            that.$notice(data.msg)
          }
        } catch (error) {
          that.$notice("获取所有作者失败");
          console.log(error);
        }
      },
      //获取 医学分类
      async getCategory() {
        let that = this;
        try {
          let data = await that.$http.crfCategoryList()
          console.log("医学代码分类",data)
          if(data.code == 0){
            let array = [];
            for(var item in data.data){
              array.push({
                name:item,
                value:data.data[item]
              })
            }
            that.categoryNameList = array;
          }
        }catch (error) {
          that.$notice("医学分类获取失败")
          console.log(error)
        }
      }
    },
    mounted() {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.getFormItemList();
    },
    activated() {
      // console.log('objType.clickType')
      // console.log(objType.clickType)
      if (this.objType.clickType != "return") {
        this.loading = true;
        setTimeout(() => {
          this.getFormItemList();
        }, 1000);
      }
    }
  };
</script>

<style lang="less" >
  .entry_container {
    width: 100%;
    min-height: 687px;
    .entry_search {
      .el-select {
        margin-right: 12px;
      }
    }
    .entry_content {
      .iconfont {
        color: #1bbae1;
        font-size: 18px;
        margin: 0 5px;
      }
      .footer_btn {
        text-align: right;
        margin-top: 20px;
      }
      i {
        cursor: pointer;
      }
      .del {
        color: #f0433c;
      }
    }
  }
</style>
