<template>
  <div class="container">
    <shun-table ref="table"
                title="历史策略"
                :loading="loading"
                :show-pagination="false"
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
            <el-autocomplete v-model.trim="filterForm.useCaseName"
                             class="inline-input"
                             :fetch-suggestions="(queryString,cb) => {queryUnit(queryString,cb,'useCase')}"
                             placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="事件："
                        prop="eventName">
            <el-autocomplete v-model.trim="filterForm.eventName"
                             class="inline-input"
                             :fetch-suggestions="(queryString,cb) => {queryUnit(queryString,cb,'event')}"
                             placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="客群："
                        prop="customerGroupName">
            <el-autocomplete v-model.trim="filterForm.customerGroupName"
                             class="inline-input"
                             :fetch-suggestions="(queryString,cb) => {queryUnit(queryString,cb,'customerGroup')}"
                             placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="策略："
                        prop="strategyName">
            <el-autocomplete v-model.trim="filterForm.strategyName"
                             class="inline-input"
                             :fetch-suggestions="(queryString,cb) => {queryUnit(queryString,cb,'strategy')}"
                             placeholder="请输入内容" />
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
      <template v-slot:productInfoListSlot="scope">
        <template v-if="scope.row.productInfoList && scope.row.productInfoList.length">
          <el-tooltip placement="top-start"
                      class="hover-text">
            <div slot="content">
              <div v-for="(item,i) of scope.row.productInfoList"
                   :key="i"
                   style="margin:5px 0;">
                {{ item.name }}
              </div>
            </div>
            <span>
              {{ scope.row.productInfoList.length }}个产品
            </span>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
      <template v-slot:couponInfoListSlot="scope">
        <template v-if="scope.row.couponInfoList && scope.row.couponInfoList.length">
          <el-tooltip placement="top-start"
                      class="hover-text">
            <div slot="content">
              <div v-for="(item,i) of scope.row.couponInfoList"
                   :key="i"
                   style="margin:5px 0;">
                {{ item.name }}
              </div>
            </div>
            <span>
              {{ scope.row.couponInfoList.length }}个权益
            </span>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
      <template v-slot:strategyInfoListSlot="scope">
        <template v-if="scope.row.strategyInfoList && scope.row.strategyInfoList.length">
          <el-tooltip placement="top-start"
                      class="hover-text">
            <div slot="content">
              <div v-for="(item,i) of scope.row.strategyInfoList"
                   :key="i"
                   style="margin:5px 0;">
                {{ item.channel.label }}
              </div>
            </div>
            <span>
              {{ scope.row.strategyInfoList.length }}个渠道
            </span>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
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
          minWidth: 100
        }, {
          prop: 'useCaseName',
          label: '用例',
          minWidth: 100
        },
        {
          prop: 'eventName',
          label: '事件',
          minWidth: 100
        },
        {
          prop: 'customerGroupName',
          label: '客群',
          minWidth: 200
        },
        {
          prop: 'productInfoList',
          label: '产品',
          width: 100,
          slot: true
        },
        {
          prop: 'couponInfoList',
          label: '权益',
          width: 100,
          slot: true
        },
        {
          prop: 'strategyInfoList',
          label: '渠道',
          width: 100,
          slot: true
        }
      ],
      tableData: [],
      useCaseList: [],
      eventList: [],
      customerGroupList: [],
      strategyList: []
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
    this.fuzzyAll()
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
    fuzzySearchList(val) {
      fuzzySearch({ [val + 'Name']: '' }).then(res => {
        this[val + 'List'] = res.data.map(n => {
          return {
            value: n
          }
        })
      })
    },
    fuzzyAll() {
      this.fuzzySearchList('useCase')
      this.fuzzySearchList('event')
      this.fuzzySearchList('customerGroup')
      this.fuzzySearchList('strategy')
    },
    queryUnit(queryString, cb, val) {
      var list = this[val + 'List']
      var results = queryString ? list.filter(this.createFilter(queryString)) : list
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (n) => {
        return (n.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
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
