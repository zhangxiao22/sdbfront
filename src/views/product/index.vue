<template>
  <div class="container">
    <shun-table title="产品库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                multiple
                :selected-id="selectedId"
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
                      prefix-icon="el-icon-search" />
          </el-form-item>

          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="currentPage=1;getList()">
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
      tableColumnList: [
        {
          prop: 'name',
          label: '产品名称',
          minWidth: 300
        },
        {
          prop: 'classify',
          label: '产品类型'
        },
        {
          prop: 'riskLevel',
          label: '风险等级'
        },
        {
          prop: 'returnBenchmark',
          label: '收益率/行业比较基准',
          minWidth: 100
        },
        {
          prop: 'purchaseAmount',
          label: '起购金额'
        },
        {
          prop: 'startDate',
          label: '起息日'
        },
        {
          prop: 'endDate',
          label: '到期日'
        }
      ],
      tableData: [],
      selection: [],
      selectedId: []
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    reset() {
      this.$refs.filterRef.resetFields()
    },
    getList() {
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.filterForm)
      this.loading = true
      getProductList(data).then(res => {
        this.tableData = res.data.resultList.map((n) => {
          return Object.assign(n, {
            classify: n.classify.label,
            riskLevel: n.riskLevel.label,
            startDate: n.startDate.split(' ')[0],
            endDate: n.endDate.split(' ')[0]
          })
        })
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getVal() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
