<template>
  <div class="container">
    <shun-table ref="table"
                title="策略库"
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
          <el-form-item label="用例："
                        prop="useCaseName">
            <el-autocomplete v-model="filterForm.useCaseName"
                             class="inline-input"
                             :fetch-suggestions="useCaseQuerySearch"
                             placeholder="请输入内容"
                             @select="handleSelect" />
          </el-form-item>
          <el-form-item label="事件："
                        prop="eventName">
            <el-autocomplete v-model="filterForm.eventName"
                             class="inline-input"
                             :fetch-suggestions="eventQuerySearch"
                             placeholder="请输入内容"
                             @select="handleSelect" />
          </el-form-item>
          <el-form-item label="客群："
                        prop="customerGroupName">
            <el-autocomplete v-model="filterForm.customerGroupName"
                             class="inline-input"
                             :fetch-suggestions="customerQuerySearch"
                             placeholder="请输入内容"
                             @select="handleSelect" />
          </el-form-item>
          <el-form-item label="策略："
                        prop="strategyName">
            <el-autocomplete v-model="filterForm.strategyName"
                             class="inline-input"
                             :fetch-suggestions="strategyQuerySearch"
                             placeholder="请输入内容"
                             @select="handleSelect" />
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
import ShunTable from '@/components/ShunTable'
import { getStragetyList, fuzzySearch } from '@/api/api'

export default {
  name: 'Strategy',
  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        useCaseName: '',
        eventName: '',
        customerGroupName: '',
        strategyName: ''
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'name',
          label: '策略名',
          minWidth: 200
        }, {
          prop: 'useCaseName',
          label: '用例名',
          minWidth: 200
        }, {
          prop: 'customerGroupName',
          label: '客群名',
          minWidth: 200
        }
      ],
      tableData: [],
      useCaseList: [
        // { 'value': '用例一', 'id': 1 }
      ],
      eventList: [
        // { 'value': '事件一', 'id': 1 }
      ],
      customerList: [
        // { 'value': '产品一', 'id': 1 }
      ],
      strategyList: [
        // { 'value': '策略一', 'id': 1 }
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
    this.search()
    this.querySearchList()
  },
  mounted() {
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
    querySearchList() {
      fuzzySearch({ useCaseName: '' }).then(res => {
        for (const i in res.data) {
          var j = {}
          j.value = res.data[i]
          this.useCaseList.push(j)
        }
      })
      fuzzySearch({ eventName: '' }).then(res => {
        for (const i in res.data) {
          var j = {}
          j.value = res.data[i]
          this.eventList.push(j)
        }
      })
      fuzzySearch({ customerGroupName: '' }).then(res => {
        for (const i in res.data) {
          var j = {}
          j.value = res.data[i]
          this.customerList.push(j)
        }
      })
      fuzzySearch({ strategyName: '' }).then(res => {
        for (const i in res.data) {
          var j = {}
          j.value = res.data[i]
          this.strategyList.push(j)
        }
      })
    },
    useCaseQuerySearch(queryString, cb) {
      var useCaseList = this.useCaseList
      var results = queryString ? useCaseList.filter(this.createFilter(queryString)) : useCaseList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    eventQuerySearch(queryString, cb) {
      var eventList = this.eventList
      var results = queryString ? eventList.filter(this.createFilter(queryString)) : eventList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    customerQuerySearch(queryString, cb) {
      var customerList = this.customerList
      var results = queryString ? customerList.filter(this.createFilter(queryString)) : customerList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    strategyQuerySearch(queryString, cb) {
      var strategyList = this.strategyList
      var results = queryString ? strategyList.filter(this.createFilter(queryString)) : strategyList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (n) => {
        return (n.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      // console.log(item)
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      // console.log(this.searchForm)
      this.getList(1)
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.loading = true
      getStragetyList(data).then(res => {
        // console.log(res.data)
        this.tableData = res.data.map(n => {
          return Object.assign(n, {
            id: n.abstractId
          })
        })
        // this.total = res.pagination.totalItemCount
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
}
</style>
