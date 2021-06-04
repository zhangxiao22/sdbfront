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
                   @click="addRule">
          新增规则
        </el-button>
      </template>
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="名称："
                        prop="content">
            <el-input v-model.trim="filterForm.content"
                      style="width:300px"
                      placeholder="请输入短信内容"
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
        </div>
      </template>
    </shun-table>
    <!-- 右侧边 -->
    <ShunDrawer title="123"
                :show.sync="showDrawer"
                :loading="drawerButtonLoading"
                @submit="handleSureDrawer()">
      <template v-slot:container>
        <div>
          <Rule />
        </div>
      </template>
    </ShunDrawer>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList } from '@/api/api'
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
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDrawer: true,
      drawerButtonLoading: false,
      filterForm: {
        content: ''
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'content',
          label: '名称',
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
      getSmsList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleEdit() {

    },
    addRule() {
      this.showDrawer = true
    },
    handleSureDrawer() { }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
