<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="通道编码" prop="channelNum">
            <el-input v-model="queryParams.channelNum" placeholder="请输入通道编码" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="通道名称" prop="channelName">
            <el-input v-model="queryParams.channelName" placeholder="请输入通道名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="channelSt">
            <el-select v-model="queryParams.channelSt" placeholder="通道状态" clearable size="small" style="width: 240px">
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
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['channel:channelInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['channel:channelInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['channel:channelInfo:remove']">删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getChannelInfoList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="channelList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" prop="id" v-if="show" />
          <el-table-column label="通道编码" align="center" prop="channelNum" />
          <el-table-column label="通道名称" align="center" prop="channelName" />
          <el-table-column label="适配器名称" align="center" prop="adapterName" />
          <el-table-column label="下单地址" align="center" prop="makeOrderUrl" :show-overflow-tooltip="true" />
          <el-table-column label="回调地址" align="center" prop="notifyUrl" />
          <el-table-column label="通道秘钥" align="center" prop="channelKey" />
          <el-table-column label="通道状态" align="center">
             <template slot-scope="scope">
              <el-switch v-model="scope.row.channelSt" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['channel:channelInfo:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['channel:channelInfo:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getChannelInfoList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id == undefined" label="通道编码" prop="channelNum">
              <el-input v-model="form.channelNum" placeholder="请输入通道编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通道名称" prop="channelName">
              <el-input v-model="form.channelName" placeholder="请输入通道名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="20">
            <el-form-item label-width="92px" label="适配器名称" prop="adapterName">
              <el-input  v-model="form.adapterName" placeholder="请输入适配器名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="20">
            <el-form-item  label="下单地址" prop="makeOrderUrl">
              <el-input v-model="form.makeOrderUrl" placeholder="请输入下单地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="20">
            <el-form-item  label="回调地址" prop="notifyUrl">
              <el-input v-model="form.notifyUrl" placeholder="请输入回调地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="通道秘钥" prop="channelKey">
              <el-input v-model="form.channelKey" placeholder="请输入通道秘钥" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="通道状态">
              <el-radio-group v-model="form.channelSt">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="通道描述">
              <el-input v-model="form.channelDetail" type="textarea" placeholder="请输入内容"></el-input>
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
  queryChannelInfoList,
  changeChannelStatus,
  getChannelInfo,
  delChannelInfo,
  addChannelInfo,
  updateChannelInfo,
} from "@/api/channel/channelInfo";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CodeTypeDialogVue from '../tool/build/CodeTypeDialog.vue';


export default {
  name: "channel",
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
      // 通道表格数据
      channelList: null,
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
        channelNum: undefined,
        channelName: undefined,
        channelSt: undefined
      },
      show: false,
      // 表单校验
      rules: {
        channelNum: [
          { required: true, message: "通道编码不能为空", trigger: "blur" },
        ],
        channelName: [
          { required: true, message: "通道名称不能为空", trigger: "blur" },
        ],
        makeOrderUrl: [
          { required: true, message: "下单地址不能为空", trigger: "blur" },
        ],
        notifyUrl: [
          { required: true, message: "回调地址不能为空", trigger: "blur" },
        ],
        adapterName: [
          { required: true, message: "适配器名称不能为空", trigger: "blur" },
        ],
        channelSt: [
          { required: true, message: "通道状态不能为空", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getChannelInfoList();
    this.getDicts("product_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询通道列表 */
    getChannelInfoList() {
      this.loading = true;
      queryChannelInfoList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.channelList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 通道状态修改
    handleStatusChange(row) {
      let text = row.channelSt === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.channelNum + '"通道吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeChannelStatus(row.id, row.channelSt);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.channelSt = row.channelSt == 0 ? 1 : 0;
        });
    },
    // 通道状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.channelSt);
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
        channelNum: undefined,
        channelName: undefined,
        channelSt: '0'
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getChannelInfoList();
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
      this.title = "添加通道";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getChannelInfo(id).then((response) => {
        this.form = response.data;
        this.form.channelSt = this.form.channelSt+'';
        this.form.channelSt = this.form.channelSt == null ? "" : this.form.channelSt+'';
        this.open = true;
        this.title = "修改通道信息";
      });
    },
    
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateChannelInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getChannelInfoList();
              }
            });
          } else {
            addChannelInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getChannelInfoList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const channelIds = row.id || this.ids;
      this.$confirm(
        '是否确认删除通道编码为"' + row.channelNum + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delChannelInfo(channelIds);
        })
        .then(() => {
          this.getChannelInfoList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>