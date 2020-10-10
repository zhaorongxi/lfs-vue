<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="商户编号" prop="agtPhone">
            <el-input v-model="queryParams.agtPhone" placeholder="请输入商户编号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="商户名称" prop="agtName">
            <el-input v-model="queryParams.agtName" placeholder="请输入商户名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getAccessList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="accessList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="id" align="center" prop="id" />
          <el-table-column label="商户编号" align="center" prop="agtPhone" />
          <el-table-column label="商户名称" align="center" prop="agtName" />
          <el-table-column label="密钥Id" align="center" prop="appId" :show-overflow-tooltip="true" />
          <el-table-column label="密钥key" align="center" prop="appKey" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleRefresh(scope.row)" v-hasPermi="['agent:cipher:refresh']">重置密钥</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getAccessList" />

  </div>
</template>

<script>
import {
  getAccessList,
  refreshAppKey,
} from "@/api/agent/cipher";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  name: "Cipher",
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
      accessList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
        agtPhone: undefined,
        agtName:undefined,
      },
    };
  },

  created() {
    this.getAccessList();
  },
  methods: {
    /** 查询密钥列表 */
    getAccessList() {
      this.loading = true;
      getAccessList(this.queryParams).then(
        (response) => {
          this.accessList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 重置密码按钮操作 */
    handleRefresh(row) {
      this.$confirm('是否确认重置商户编号为"' + row.agtPhone + '"的密钥?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          refreshAppKey(row.agtPhone).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("重置密钥成功!");
              this.getAccessList();
            }
          });
        })
        .catch(() => {});
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
        appId: undefined,
        appKey: undefined,
        agtPhone: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getAccessList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>