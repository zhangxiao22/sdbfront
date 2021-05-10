<template>
  <div class="container">
    <shun-table ref="table"
                title="分配规则"
                :loading="loading"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :is-card="false"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:main-buttons>
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新建规则
        </el-button>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEditButton(scope.row)">修改</div>
          <div class="btn"
               style="color:#f56c6c;"
               @click="handleDeleteButton(scope.row)">删除</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="分配规则"
               :before-close="cancelAdd"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               label-width="130px"
               :model="form" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary"
                   @click="ensureAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getEmpLeave, delEmpLeave } from '@/api/api'
export default {
  name: 'Appoint',
  components: {
    ShunTable
  },
  props: {
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDialog: false,
      filterForm: {
      },
      form: {
      },
      searchForm: {
      },
      tableColumnList: [
        {
          prop: 'id',
          label: 'ID',
          width: 100
        },
        {
          prop: 'name',
          label: '名称',
          width: 100
        },
        {
          prop: 'description',
          label: '描述',
          width: 200
        },
        {
          prop: 'status',
          label: '状态',
          width: 100
        },
        {
          prop: 'modifyTime',
          label: '更新时间',
          width: 150
        },
        {
          prop: 'operate',
          label: '操作',
          fixed: 'right',
          slot: true
        }
      ],
      tableData: [
        {
          id: 1,
          name: '123',
          description: '11111',
          status: '运行中',
          modifyTime: '1'
        }
      ]
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },
  watch: {},
  created() {
  },
  methods: {
    init() {
      this.search()
    },
    resetAll() {
      this.reset()
      // this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    resetDialog() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
    },
    handleAddList() {
      this.resetDialog()
      this.showDialog = true
    },
    cancelAdd() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureAdd() {
      this.showDialog = false
      this.getList()
    },
    handleEditButton(row) {
      console.log(row)
    },
    handleDeleteButton(row) {
      this.$confirm(`是否确认删除规则（${row.name || ''}）？`)
        .then(() => {
          // this.loading = true
          // delEmpLeave({ empCode: row.id })
          //   .then(res => {
          //     if (res.code === 200) {
          //       this.$message({
          //         message: '删除成功',
          //         type: 'success',
          //         duration: '3000'
          //       })
          //       this.getList()
          //     }
          //   })
          //   .finally(() => {
          //     this.loading = false
          //   })
        })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      // this.loading = true
      // getEmpLeave(data)
      //   .then(res => {
      //     this.tableData = res.data.resultList
      //     this.total = res.pagination.totalItemCount
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  // .btn {
  //   cursor: pointer;
  // }
}
</style>
