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
          <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:productGroup:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleProduct(scope.row)" v-hasPermi="['product:productGroup:edit']">产品配置</el-button>
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
           <el-col :span="12">
            <el-form-item label-width="92px" label="产品组名称" prop="groupName">
              <el-input style="width:200px;" v-model="form.groupName" placeholder="请输入产品组名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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

    <el-dialog :title="groupTitle" :visible.sync="dialogProductGroup" width="800px" append-to-body>
      <template>
      <div class="app-container">
      <el-form :model="queryGroupParams" ref="queryGroupForm" :inline="true" v-show="showProductSearch" label-width="68px">
          <el-form-item label-width="70px" label="产品编号" prop="productNum">
            <el-input v-model="queryGroupParams.productNum" placeholder="请输入产品编号" clearable size="small" style="width: 260px" @keyup.enter.native="handleGroupQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleGroupQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetGroupQuery">重置</el-button>
          </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="selectElement" v-hasPermi="['product:productToGroup:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleGroupDelete" v-hasPermi="['product:productToGroup:remove']">删除</el-button>
          </el-col>
          <right-toolbar :showProductSearch.sync="showProductSearch" @queryTable="getProductToGroupList"></right-toolbar>
      </el-row>
      
      <el-table v-loading="loadingGroup" :data="productToGroupList" @selection-change="handleGroupSelectionChange" @cell-dblclick="doubleClick">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" prop="id" v-if="show" />
          <el-table-column label="产品组编号" align="center" prop="groupNum" />
          <el-table-column label="产品编码" align="center" prop="productNum" :show-overflow-tooltip="true" />          
          <el-table-column label="产品折扣" align="center" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.discount" v-if="scope.row.isEdit" @blur="loseFcous(scope.$index, scope.row)" > </el-input>
              <span style="margin-left: 10px" v-else>{{ scope.row.discount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品状态" align="center" >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.productState" active-value="1" inactive-value="0" @change="handleProductToGroupStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleGroupDelete(scope.row)" v-hasPermi="['product:productToGroup:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="totalProduct>0" :total="totalProduct" :page.sync="queryGroupParams.pageNum" :limit.sync="queryGroupParams.pageSize" @pagination="getProductToGroupList" />
    </div>
    </template>      
    </el-dialog>

    <el-dialog :title="groupTitle" :visible.sync="dialogFormtransfer" width="700px" append-to-body>
       <template class="transfer_dialog">
         <el-transfer :titles="['可选产品', '已选产品']"  filterable filter-placeholder="请输入要素名称" v-model="dataSelected" :props="{ key: 'productNum', label: 'productName'}" :data="requestData" :left-default-checked="leftDefaultChecked" ></el-transfer>
       </template>
       <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveToGroup">确 定</el-button>
        <el-button @click="cancelTransfer">取 消</el-button>
      </div>
     </el-dialog>

  </div>
</template>


<script>
import {
  getProductList,
  getProductToGroup,
  productGroupList,
  getProductGroup,
  addProductGroup,
  addProductToGroup,
  updateProductGroup,
  changeGroupStatus,
  changeProductToGroupStatus,
  updateDiscount,
  delProductGroup,
  delProductToGroup,
  getSelectProduct,
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
      state: 0,
      //是否可编辑
      groupNum: null,
      // 遮罩层
      loading: true,
      // 产品组下茶品遮罩层
      loadingGroup: true,
      // 选中数组
      ids: [],
      // 选中的产品组下产品
      productIds:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 显示产品组下搜索条件
      showProductSearch: true,
      // 总条数
      total: 0,
      // 产品组下产品总条数
      totalProduct:0,
      // 产品组表格数据
      productGroupList: null,
      // 产品组下产品表格数据
      productToGroupList: null,
      // 弹出层标题
      title: "",
      // 产品组弹出标题层
      groupTitle: "",
      // 是否显示弹出层
      open: false,
      //产品组弹出层
      dialogProductGroup :false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 表单参数
      form: {
      },
      // 表单参数
      queryGroupForm: {
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
      // 产品组下查询参数
      queryGroupParams: {
        pageNum: 1,
        pageSize: 10,
        groupNum: undefined,
        productNum: undefined,
        discount: undefined
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
      show:false,
       // 是否显示trannsfer弹出层
      dialogFormtransfer: false,
      //
      dialogProduct :false,
      //渲染DIV
      dataElemendata: [], 
      //已选中数据
      dataSelected: [],
      //全部产品数据 
      requestData: [], 
      // trannsfer左侧默认选中
      leftDefaultChecked: [],
      // trannsfer右侧默认选中
      rightDefaultChecked: []
    };
  },

  created() {
    this.getProductGroupList();
    this.getDicts("product_status").then((response) => {
      this.statusOptions = response.data;
    });

  },
  methods: {
     // 向后台请求产品数据放到requestData里面
    getElementAlldata() {
      getProductList().then(res => {
        this.requestData = res.data;
      });
       getSelectProduct(this.groupNum).then(res => {
        this.dataElemendata = res.data;
      });
    },
   
   //这步是要遍历 后台传来的产品数据 我要取到其中的productNum值
    getDataBySelected(id) {
    let requestData = this.requestData;
      for ( let i = 0; i < requestData.length;i++) {
        if (id === requestData[i].productNum) {
          return requestData[i];
        }
      }
    },
    
     handlTransfer() {
      const newData = [];
      let  productNums =[];
      for ( let i = 0, dataSelected = this.dataSelected; i < dataSelected.length; i++) {
        newData.push(this.getDataBySelected(dataSelected[i]));
      }
      this.dataElemendata = newData;
      // let dataElemendata = this.dataElemendata;
       // 处理成vars，以便给后端传数据用
      let varCode = [];
      for (let j = 0; j < dataElemendata.length; j++) {
        this.form.productNum = dataElemendata[j].productNum;
        varCode.push(this.form.productNum);
      }
      addProductToGroup(varCode,this.groupNum).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("新增成功");
        }
      });
    },

    //处理编辑 穿梭框已选中回显
    selectElement() { 
      this.getElementAlldata();//后台请求产品数据
      const selectedData = this.dataElemendata;
      this.leftDefaultChecked = this.dataElemendata;
      let dataArr = [];
      for (let i = 0; i < selectedData.length; i++) {
        dataArr.push(selectedData[i].productNum);
      }
      this.dataSelected = dataArr;
      this.dialogFormtransfer = true;
      this.groupTitle = '配置产品组下产品'
    },

    handleProduct(row){
      this.groupNum = row.groupNum;
      this.dialogProductGroup = true;
      this.groupTitle = '产品组下产品列表';
      this.getProductToGroupList();
    },
    //点击确定  产品要素  保存到dialog
    saveToGroup() {
      this.handlTransfer();
      this.dialogFormtransfer = false;
      this.getProductToGroupList();
    },
    
    loseFcous(index, row) {
      row.isEdit=false;
      updateDiscount(row.groupNum,row.productNum,row.discount).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("修改折扣成功");
          this.productGroupreset();
        }
      });
    },

    // 表格双击事件,允许编辑
    doubleClick(row, column) {
      row.isEdit=true;
    },

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
    /** 查询产品组下产品 */
    getProductToGroupList() {
      this.loadingGroup = true;
      this.queryGroupParams.groupNum = this.groupNum;
      getProductToGroup(this.queryGroupParams).then(
        (response)=>{
          this.productToGroupList = response.rows.map(row=>{
            this.$set(row,'isEdit',false);
            return row;
          });
          this.total = response.total;
          this.loadingGroup = false;
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
          row.groupState = row.groupState == 0 ? 1 : 0;
        });
    },

    // 产品组下产品状态修改
    handleProductToGroupStatusChange(row) {
      let text = row.productState === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.productNum + '"产品吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeProductToGroupStatus(row.id, row.productState);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.productState = row.productState == 0 ? 1 : 0;
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
    cancelTransfer(){
      this.dialogFormtransfer = false;
      this.reset;
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
    // 表单重置
    productGroupreset() {
      this.queryGroupForm = {
        id: undefined,
        productNum: undefined
      };
      this.resetForm("queryGroupForm");
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
    /** 产品组下产品搜索按钮操作 */
    handleGroupQuery() {
      this.queryGroupParams.page = 1;
      this.getProductToGroupList();
    },
    /** 产品组下产品重置按钮操作 */
    resetGroupQuery() {
      this.resetForm("queryGroupForm");
      this.handleGroupQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 产品组下产品多选框选中数据
    handleGroupSelectionChange(selection) {
      this.productIds = selection.map((item) => item.id);
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除id为"' + ids + '"的数据项?',
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
    /** 删除按钮操作 */
    handleGroupDelete(row) {
      const productIds = row.id || this.productIds;
      this.$confirm(
        '是否确认删除id为"' + productIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProductToGroup(productIds);
        })
        .then(() => {
          this.getProductToGroupList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>