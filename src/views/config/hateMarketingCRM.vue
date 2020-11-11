<template>
  <div class="container">
    <shun-table ref="table"
                title="厌恶营销名单"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :is-card="false"
                multiple
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="客户号："
                        prop="customerAccount">
            <el-input v-model.trim="filterForm.customerAccount"
                      style="width:200px"
                      placeholder="请输入客户号"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="客户姓名："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请输入客户姓名"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="日期范围："
                        prop="dateRange">
            <el-date-picker v-model="filterForm.dateRange"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="resetAll">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:main-buttons>
        <UploadButton :upload-method="uploadMethod"
                      :category="category"
                      name="全量更新"
                      :is-all-upload="0" />
        <UploadButton :upload-method="uploadMethod"
                      :category="category"
                      name="批量更新"
                      :is-all-upload="1" />
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新增名单
        </el-button>
        <el-tooltip class="item"
                    effect="dark"
                    content="全部下载所有名单"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click.native="downloadAll">
            全部下载
          </el-button>
        </el-tooltip>
        <el-link type="primary"
                 @click="download">模版下载</el-link>

      </template>
      <template v-slot:operateSlot="scope">
        <div class="btn"
             style="color:#f56c6c;"
             @click="handleDelete(scope.row)">删除</div>
      </template>
      <template v-slot:paramsSlot="props">
        <pre>{{ props.row.params }}</pre>
      </template>
    </shun-table>
    <el-dialog title="新增名单"
               :before-close="cancelAddList"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               :model="addInfo">
        <el-form-item label="客户号："
                      :rules="[{
                        required: true, message: '请输入客户号', trigger: 'blur'
                      }]"
                      prop="customerAccount">
          <el-input v-model="addInfo.customerAccount"
                    show-word-limit
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="客户名称："
                      :rules="[{
                        required: true, message: '请输入客户名称', trigger: 'blur'
                      }]"
                      prop="name">
          <el-input v-model="addInfo.name"
                    show-word-limit
                    maxlength="50" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAddList">取 消</el-button>
        <el-button type="primary"
                   @click="ensureAddList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getHateMarketingList, addCustomerToBlackList, batchUploadFile, deleteHateMarketingListById } from '@/api/api'
import UploadButton from '@/components/UploadButton'

import qs from 'qs'
export default {
  name: 'HateMarketingCRM',
  components: {
    ShunTable,
    UploadButton

  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 表格已选中项
    selectedItems: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      currentPage: 2,
      pageSize: 10,
      category: 1,
      showDialog: false,
      total: 0,
      filterForm: {
        customerAccount: '',
        name: '',
        dateRange: []
      },
      addInfo: {
        customerAccount: '',
        name: ''
      },
      accept: ['xls', 'xlsx', 'csv'],
      searchForm: {
      },
      tableColumnList: [
        {
          prop: 'customerAccount',
          label: '客户号',
          minWidth: 150
        },
        {
          prop: 'name',
          label: '客户姓名'
          // sortable: true
        },
        {
          prop: 'createTime',
          label: '加入日期'
        },
        {
          prop: 'operate',
          label: '操作',
          slot: true
        }
      ],
      tableData: [],
      selection: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    },
    getData() {
      const data = {}
      data.name = this.addInfo.name
      data.customerAccount = this.addInfo.customerAccount
      data.category = this.category
      return data
    }
  },
  watch: {},
  created() {
    this.search()
  },
  methods: {
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = {
        name: this.filterForm.name,
        customerAccount: this.filterForm.customerAccount,
        startDate: this.filterForm.dateRange ? this.filterForm.dateRange[0] : null,
        endDate: this.filterForm.dateRange ? this.filterForm.dateRange[1] : null
      }
      this.getList(1)
    },
    handleAddList() {
      this.showDialog = true
    },
    cancelAddList() {
      this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureAddList() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          addCustomerToBlackList([this.getData]).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showDialog = false
              this.$refs['regFormRef'].resetFields()
              this.resetAll()
            }
          })
        }
      })
    },
    uploadMethod(formData) {
      batchUploadFile(formData).then(res => {
        if (res.data.length) {
          this.$notify({
            title: '数据错误',
            message: (res.data).join('<br/>'),
            dangerouslyUseHTMLString: true,
            type: 'warning',
            duration: 0
          })
        } else {
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: '3000'
          })
        }
        this.resetAll()
      }).catch(() => {
        this.resetFile()
      })
    },
    // 下载模版
    download() {
      window.open('/static/template.xlsx', '_blank')
    },
    downloadAll() {
      const data = {
        category: this.category
      }
      const url = process.env.VUE_APP_BASE_API + '/hateSale/downloadAll?' + qs.stringify(data)
      window.open(url, '_self')
    },
    handleDelete(row) {
      this.$confirm(`是否确认删除客户（${row.name}）？`)
        .then(() => {
          deleteHateMarketingListById({ hateSaleId: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
              this.resetAll()
            }
          })
        })
        .catch(() => { })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        category: this.category
      }, this.searchForm)
      this.filterForm = {
        name: this.searchForm.name,
        customerAccount: this.searchForm.customerAccount,
        dateRange: this.searchForm.startDate && this.searchForm.endDate ? [this.searchForm.startDate, this.searchForm.endDate] : []
      }
      // this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getHateMarketingList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .btn {
    cursor: pointer;
  }
}
</style>
