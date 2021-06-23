<template>
  <div class="container">
    <shun-table ref="table"
                title="规则库"
                :loading="loading"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:main-buttons>
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新增规则
        </el-button>
      </template>
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="规则名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请输入规则名称"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="创建人名称："
                        prop="creatorName">
            <el-input v-model.trim="filterForm.creatorName"
                      style="width:300px"
                      placeholder="请输入创建人名称"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEdit(scope.row)">编辑</div>
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEditButton(scope.row)">编辑</div>
          <div class="btn"
               style="color:#f56c6c;"
               @click="handleDeleteButton(scope.row)">删除</div>
        </div>
      </template>
    </shun-table>
    <!-- 右侧边 -->
    <ShunDrawer title="规则"
                :show.sync="showDrawer"
                :loading="drawerButtonLoading"
                @submit="handleSureDrawer">
      <template v-slot:container>
        <div>
          <Rule ref="ruleRef" />
        </div>
      </template>
    </ShunDrawer>
    <!-- dialog -->
    <el-dialog title="规则"
               :visible.sync="showTableDialog"
               @close="handleCloseTableDialog">
      <el-form ref="dialogTableFormRef"
               style="width:500px;margin:0 auto;"
               label-width="100px"
               :model="dialogTableForm">
        <el-form-item label="名称："
                      prop="name"
                      :rules="[{required: true, message: '请填写名称', trigger: 'blur'}]">
          <el-input v-model.trim="dialogTableForm.name"
                    placeholder="请填写名称"
                    clearable
                    style="width:90%;" />
        </el-form-item>
        <el-form-item label="描述："
                      prop="detail">
          <el-input v-model="dialogTableForm.detail"
                    type="textarea"
                    style="width:90%;"
                    :rows="2"
                    placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showTableDialog = false">取 消</el-button>
        <el-button type="primary"
                   :loading="dialogButtonTableLoading"
                   @click="ensureTableDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getEventRuleList, delEventRule, editEventRule, addEventRule, updateRuleData } from '@/api/api'
import ShunDrawer from '@/components/ShunDrawer'
import Rule from '@/components/Rule'

export default {
  name: 'Sms',
  components: {
    ShunTable,
    ShunDrawer,
    Rule
  },
  props: {

  },
  data() {
    return {
      dialogButtonTableLoading: false,
      showTableDialog: false,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDrawer: true,
      drawerButtonLoading: false,
      filterForm: {
        name: '',
        creatorName: ''
      },
      dialogTableForm: {
        id: '',
        name: '',
        detail: ''
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'name',
          label: '名称',
          minWidth: 200
        },
        {
          prop: 'creatorName',
          label: '创建人姓名',
          minWidth: 200
        },
        {
          prop: 'detail',
          label: '描述',
          minWidth: 300,
          notShowOverflowTooltip: true
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
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },

    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.loading = true
      getEventRuleList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    handleDeleteButton(row) {
      this.$confirm(`是否确认删除规则（${row.name || ''}）？`)
        .then(() => {
          this.loading = true
          delEventRule({ id: row.id })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: '3000'
                })
                this.getList(1)
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
    },
    handleAddList() {
      this.showTableDialog = true
    },
    // 编辑
    handleEditButton(row) {
      this.dialogTableForm.id = row.id
      this.dialogTableForm.name = row.name
      this.dialogTableForm.desc = row.detail
      // this
      this.showTableDialog = true
    },
    handleCloseTableDialog() {
      this.$refs['dialogTableFormRef'].resetFields()
      this.dialogTableForm.id = ''
    },
    ensureTableDialog() {
      // dialogTableFormRef
      this.$refs['dialogTableFormRef'].validate((valid) => {
        if (valid) {
          // console.log(this.dialogTableForm)
          const ajax = this.dialogTableForm.id ? editEventRule : addEventRule
          const data = {
            name: this.dialogTableForm.name,
            detail: this.dialogTableForm.detail,
            id: this.dialogTableForm.id
          }
          this.dialogButtonTableLoading = true
          ajax(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showTableDialog = false
              this.getList()
            }
          }).finally(() => {
            this.dialogButtonTableLoading = false
          })
        }
      })
    },
    handleEdit() {

    },
    addRule() {
      this.showDrawer = true
    },
    handleSureDrawer() {
      this.$refs.ruleRef.validate((valid) => {
        if (valid) {
          const condition = this.$refs.ruleRef.finalData
          if (!condition.list.length) {
            return this.$message({
              message: '请选择规则',
              type: 'error',
              duration: 5000
            })
          }
          const data = {
            id: 123,
            condition
          }
          updateRuleData(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
            }
          })
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
