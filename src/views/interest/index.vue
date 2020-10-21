<template>
  <div class="container">
    <shun-table ref="table"
                title="权益库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                multiple
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="权益名称："
                        prop="name">
            <el-input v-model="filterForm.name"
                      style="width:300px"
                      placeholder="请输入权益名称"
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
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { getInterestList } from '@/api/api'
export default {
  name: 'Product',
  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: ''
      },
      searchForm: {},
      // typeOpt: [],
      tableColumnList: [
        {
          prop: 'name',
          label: '权益名称',
          minWidth: 200
        },
        {
          prop: 'content',
          label: '权益内容',
          minWidth: 300
        },
        {
          prop: 'description',
          label: '权益说明',
          minWidth: 300
        },
        {
          prop: 'category.label',
          label: '权益分类',
          minWidth: 100
        },
        {
          prop: 'validite_start_date',
          label: '开始时间',
          minWidth: 100
        },
        {
          prop: 'validite_end_date',
          label: '结束时间',
          minWidth: 100
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
    this.getList(1)
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
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getInterestList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    }
    // getVal() {
    //   return this.$refs.table.getVal()
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
