<template>
  <div class="container">
    <shun-table ref="table"
                title="产品库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :multiple="multiple"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="产品名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="搜索事件名称"
                      clearable
                      prefix-icon="el-icon-search"
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
import { getProductList } from '@/api/api'

export default {
  name: 'Product',
  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
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
      tableColumnList: [

        {
          prop: 'name',
          label: '产品名称',
          minWidth: 300
        },
        {
          prop: 'classify',
          label: '产品类型',
          minWidth: 100
        },
        {
          prop: 'riskLevel',
          label: '风险等级',
          minWidth: 100
        },
        {
          prop: 'returnBenchmark',
          label: '收益率/行业比较基准',
          minWidth: 160
        },
        {
          prop: 'purchaseAmount',
          label: '起购金额',
          minWidth: 100
        },
        {
          prop: 'startDate',
          label: '起息日',
          minWidth: 100
        },
        {
          prop: 'endDate',
          label: '到期日',
          minWidth: 100
        }
      ],
      tableData: [],
      selection: []
      // selectedId: [1, 20]
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
      getProductList(data).then(res => {
        this.tableData = res.data.resultList.map((n) => {
          return Object.assign(n, {
            classify: n.classify.label,
            riskLevel: n.riskLevel.label
            // startDate: n.startDate.split(' ')[0],
            // endDate: n.endDate.split(' ')[0]
          })
        })
        this.total = res.pagination.totalItemCount
        this.loading = false
        // this.filterForm =
      }).catch(() => {
        this.loading = false
      })
    },
    getVal() {
      return this.$refs.table.getVal()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
