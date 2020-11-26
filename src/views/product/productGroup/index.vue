<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label-width="82px" label="产品组编号" prop="productNum">
            <el-input v-model="queryParams.productNum" placeholder="请输入产品编号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label-width="100px" label="产品组名称" prop="groupName">
            <el-input v-model="queryParams.groupName" placeholder="请输入产品组名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" placeholder="产品组状态" clearable size="small" style="width: 240px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['product:productGroup:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['product:productGroup:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['product:productGroup:remove']">删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getProductGroupList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="productGroupList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" prop="id" v-if="show" />
          <el-table-column label="产品组编号" align="center" prop="groupNum" />
          <el-table-column label="产品组名称" align="center" prop="groupName" :show-overflow-tooltip="true" />          
          <el-table-column label="产品组状态" align="center" >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.groupState" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-plus" @click="handleProductUpdate(scope.row)" v-hasPermi="['product:productGroup:edit']">产品配置</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:productGroup:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['product:productGroup:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getProductGroupList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="92px" v-if="form.id == undefined" label="产品组编码" prop="groupNum">
              <el-input style="width:200px;" v-model="form.groupNum" placeholder="请输入产品组编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="92px" label="产品组名称" prop="groupName">
              <el-input style="width:200px;" v-model="form.groupName" placeholder="请输入产品组名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.groupState">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  productGroupList,
  getProductGroup,
  delProductGroup,
  addProductGroup,
  updateProductGroup,
  changeGroupStatus,
} from "@/api/product/productGroup";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CodeTypeDialogVue from '../../tool/build/CodeTypeDialog.vue';


export default {
  name: "productGroup",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 产品组表格数据
      productGroupList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 表单参数
      form: {
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupNum: undefined,
        groupName: undefined,
        groupState: undefined
      },
      // 表单校验
      rules: {
        groupNum: [
          { required: true, message: "产品组编码不能为空", trigger: "blur" }
        ],
        groupName: [
          { required: true, message: "产品组名称不能为空", trigger: "blur" },
        ],
      },
      show:false
    };
  },

  created() {
    this.getProductGroupList();
    this.getDicts("product_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询产品列表 */
    getProductGroupList() {
      this.loading = true;
      productGroupList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.productGroupList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 产品组状态修改
    handleStatusChange(row) {
      let text = row.groupState === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.groupName + '"产品组吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeGroupStatus(row.id, row.groupState);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.groupState = row.groupState == 0 ? 0 : 1;
        });
    },
    // 产品状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.groupState);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        groupNum: undefined,
        groupName: undefined,
        groupState: '0',
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getProductGroupList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProductGroup(id).then((response) => {
        this.form = response.data;
        this.form.groupState = this.form.groupState+'';
        this.form.groupState = this.form.groupState == null ? "" : this.form.groupState+'';
        this.form.groupNum = this.form.groupNum == null ? "" : this.form.groupNum+'';
        this.form.groupName = this.form.groupName == null ? "" : this.form.groupName+'';
        this.open = true;
        this.title = "修改产品";
      });
    },

    handleProductUpdate(row){
       const id = row.id
    },
    
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProductGroup(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getProductGroupList();
              }
            });
          } else {
            addProductGroup(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getProductGroupList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const productIds = row.id || this.ids;
      this.$confirm(
        '是否确认删除产品编码为"' + productIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProductGroup(productIds);
        })
        .then(() => {
          this.getProductGroupList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>