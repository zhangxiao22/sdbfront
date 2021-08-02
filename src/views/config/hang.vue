<template>
  <div class="container">
    <shun-table ref="table"
                title="事件分发"
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
          <el-form-item label=" 渠道："
                        prop="channel">
            <el-select v-model="filterForm.channel"
                       style="width:200px;"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in channelOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
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
      <template v-slot:nameSlot="scope">
        <div class="name-group">
          <div class="top">
            <div class="status"
                 :style="{color:getColor(scope.row.status.value), border:`1px solid ${getColor(scope.row.status.value)}`}">
              {{ scope.row.status.label }}
            </div>
            <el-tooltip :content="scope.row.name"
                        placement="top-start">
              <div class="name elip bold"
                   @click="eventDetail(scope.row.id)">
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </div>
          <div class="bottom">
            {{ scope.row.startDate || '未知时间' }} 至 {{ scope.row.endDate || '未知时间' }}
          </div>
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <template v-for="(item,i) of btnList(scope).slice(0,3)">
            <div v-if="item.condition"
                 :key="i"
                 class="btn"
                 :style="item.style"
                 @click="item.clickFn">
              {{ item.name }}
            </div>
          </template>
          <el-dropdown v-if="btnList(scope).length>3"
                       trigger="click">
            <span class="el-dropdown-link center-center">
              ...
            </span>
            <el-dropdown-menu slot="dropdown"
                              class="operate-drop">
              <template v-for="(item,i) of btnList(scope).slice(3)">
                <el-dropdown-item v-if="item.condition"
                                  :key="i">
                  <div class="btn"
                       @click="item.clickFn">
                    {{ item.name }}
                  </div>
                </el-dropdown-item>
              </template>
              <el-dropdown-item />
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { lastAndSingle } from '@/utils'
import { getEventList, offlineEvent, syncProduct, allocate } from '@/api/api'

export default {
  name: 'Hang',

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
      channelOpt: [
        { label: 'CRM', value: '1' },
        { label: '短信', value: '2' }
      ],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        channel: '',
        dateRange: []
      },
      searchForm: {
      },
      tableColumnList: [
        {
          prop: 'name',
          label: '产品名称',
          minWidth: 200
        },
        {
          prop: 'modifyTime',
          label: '最后修改时间',
          minWidth: 180
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
    btnList() {
      return (scope) => {
        const _this = this
        const btns = [{
          condition: this.roleJudge.downloadCustomer && scope.row.loadType?.value === 1,
          style: {
            color: '#1890FF'
          },
          clickFn() {
            return _this.handleDownload(scope.row)
          },
          name: '下载名单'
        },
        {
          condition: scope.row.reviewer === this.user.userName && this.judgeStatus(scope.row.status.value) === 4,
          style: {
            color: '#f56c6c'
          },
          clickFn() {
            return _this.handleOfflineEvent(scope.row)
          },
          name: '下线'
        }, {
          condition: this.judgeStatus(scope.row.status.value) === 4 && (this.user.userName === scope.row.creater || this.user.userName === scope.row.reviewer),
          style: {
            color: '#1890FF'
          },
          clickFn() {
            return _this.handleSyncProduct(scope.row)
          },
          name: '同步'
        }, {
          condition: this.judgeStatus(scope.row.status.value) === 4 && (this.user.userName === scope.row.creater || this.user.userName === scope.row.reviewer),
          style: {
            color: '#1890FF'
          },
          clickFn() {
            return _this.handleAllocate(scope.row)
          },
          name: '分发'
        }]
        return btns.filter(n => n.condition)
      }
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
    // 下载客群名单
    handleDownload(row) {
      // console.log(row, '????')
      if (row.group.length) {
        window.open(process.env.VUE_APP_BASE_API + '/customer/customerDownload?baseId=' + row.id, '_self')
      } else {
        return this.$message({
          message: '客群名单不存在',
          type: 'warning',
          duration: '3000'
        })
      }
    },
    handleOfflineEvent(row) {
      this.$confirm(`是否确认下线事件（${row.name}）？`)
        .then(() => {
          this.loading = true
          offlineEvent({ baseId: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
              if (lastAndSingle(this.total, this.pageSize, this.currentPage)) {
                this.currentPage -= 1
              }
              this.getList()
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSyncProduct(row) {
      const confirmText = ['同步时间较长，请勿重复点击，', `是否确认事件【${row.name}】同步产品？`]
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      this.$confirm(
        '提示',
        {
          title: '提示',
          message: h('div', null, newDatas),
          type: 'warning'
        }
      )
        // this.$confirm(`同步时间较长，请勿重复点击，是否确认事件（${row.name} ）同步产品？`)
        .then(() => {
          this.loading = true
          syncProduct({ eventId: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAllocate(row) {
      this.$confirm(`是否确认事件（${row.name}）分发？`)
        .then(() => {
          this.loading = true
          allocate({ eventId: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      // console.log(this.statusValue)
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        status: this.statusValue
      }, this.searchForm)

      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getEventList(data).then(res => {
        this.tableData = res.data.resultList
          .map(n => {
            return Object.assign({}, n.eventBaseInfo, {
              group: n.customerInfoRespList,
              useCase: n.useCase
            })
          })
        this.total = res.pagination.totalItemCount
        this.tabList.forEach(n => {
          if (n.id === 'all') {
            n.count = res.data.totalCount
          }
          res.data.count.forEach(m => {
            if (n.id === m.id) {
              n.count = m.totalCount
            }
          })
        })
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .unit {
    margin-left: 10px;
  }
}
</style>
