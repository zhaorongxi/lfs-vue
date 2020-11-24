<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="产品编号" prop="productNum">
            <el-input v-model="queryParams.productNum" placeholder="请输入产品编号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="产品面额" prop="tradeFace">
            <el-input v-model="queryParams.tradeFace" placeholder="请输入产品面额" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="产品类型" prop="productType">
            <el-select v-model="queryParams.productType" placeholder="产品类型" clearable size="small" style="width: 240px">
              <el-option v-for="dict in productTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" placeholder="产品状态" clearable size="small" style="width: 240px">
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
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['product:productInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['product:productInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['product:productInfo:remove']">删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getProductList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" prop="id" v-if="show" />
          <el-table-column label="产品编号" align="center" prop="productNum" />
          <el-table-column label="产品面额" align="center" prop="tradeFace" :show-overflow-tooltip="true" />
          <el-table-column label="产品类型" align="center" prop="productType" :formatter="productTypeFormat" />
          <el-table-column label="产品状态" align="center" prop="state" :formatter="statusFormat" />
          <el-table-column label="金额单位" align="center" prop="unit" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:productInfo:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['product:productInfo:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getProductList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id == undefined" label="产品编码" prop="productNum">
              <el-input v-model="form.productNum" placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="产品金额" prop="tradeFace">
              <el-input v-model="form.tradeFace" placeholder="请输入产品金额" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item  label="金额单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择">
                <el-option v-for="dict in unitTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品类型" prop="productType">
              <el-select v-model="form.productType" placeholder="请选择">
                <el-option v-for="dict in productTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="产品状态">
              <el-radio-group v-model="form.state">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品描述">
              <el-input v-model="form.productDetail" type="textarea" placeholder="请输入内容"></el-input>
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
  productList,
  getProductInfo,
  delProductInfo,
  addProductInfo,
  updateProductInfo,
} from "@/api/product/productInfo";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CodeTypeDialogVue from '../../tool/build/CodeTypeDialog.vue';


export default {
  name: "product",
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
      // 用户表格数据
      productList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 产品类型数据字典
      productTypeOptions: [],
      // 金额类型数据字典
      unitTypeOptions: [],
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
        productNum: undefined,
        productType: undefined,
        state: undefined,
        tradeFace: undefined
      },
      // 表单校验
      rules: {
        productType: [
          { required: true, message: "产品类型不能为空", trigger: "blur" },
        ],
        tradeFace: [
          {
            required: true,
            message: "请输入产品金额",
            trigger: "change"
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "请输入合法的金额数字，最多两位小数",
            trigger: "change"
          }
        ],
        unit: [
          { required: true, message: "金额单位不能为空", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getProductList();
    this.getDicts("product_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("product_type").then((response) => {
      this.productTypeOptions = response.data;
    });
    this.getDicts("unit_type").then((response) => {
      this.unitTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询产品列表 */
    getProductList() {
      this.loading = true;
      productList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.productList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 产品状态修改
    handleStatusChange(row) {
      let text = row.state === 0 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.agtName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeAgentStatus(row.id, row.state);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.state = row.state == 0 ? 1 : 0;
        });
    },
    // 产品状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.state);
    },
    // 产品类型字典翻译
    productTypeFormat(row, column) {
      return this.selectDictLabel(this.productTypeOptions, row.productType);
    },
    // 金额类型字典防疫
    unitTypeFormat(row, column) {
      return this.selectDictLabel(this.unitTypeOptions, row.unit);
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
        productNum: undefined,
        productType: undefined,
        tradeFace: undefined,
        state: '0',
        unit: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getProductList();
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
      getProductInfo(id).then((response) => {
        this.form = response.data;
        this.form.state = this.form.state+'';
        this.form.state = this.form.state == null ? "" : this.form.state+'';
        this.form.productType = this.form.productType == null ? "" : this.form.productType+'';
        this.form.unit = this.form.unit == null ? "" : this.form.unit+'';
        this.form.tradeFace = this.form.tradeFace == null ? "" : this.form.tradeFace+'';
        this.open = true;
        this.title = "修改产品";
      });
    },
    
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProductInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getProductList();
              }
            });
          } else {
            addProductInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getProductList();
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
          return delProductInfo(productIds);
        })
        .then(() => {
          this.getProductList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>