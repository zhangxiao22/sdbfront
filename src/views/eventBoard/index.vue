<template>
  <div class="container">
    <shun-table ref="table"
                title="事件列表"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :tab-list="tabList"
                :tab-value.sync="tabValue"
                :multiple="multiple"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList"
                @filter-change="filterChange"
                @tab-click="tabClick">
      <template v-slot:main-buttons>
        <el-button v-if="roleJudge.createEvent"
                   class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="createEvent">
          新建营销事件
        </el-button>
      </template>
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="事件名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请填写事件名称"
                      clearable />
          </el-form-item>
          <el-form-item label="所属用例："
                        prop="useCaseId">
            <el-select v-model="filterForm.useCaseId"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in useCaseOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建人："
                        prop="userId">
            <el-select v-model="filterForm.userId"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in ownerOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核人："
                        prop="reviewerId">
            <el-select v-model="filterForm.reviewerId"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in reviewerOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="审批人："
                        prop="approverId">
            <el-select v-model="filterForm.approverId"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in approverOpt"
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
                       @click="reset">
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
      <template v-slot:peopleSlot="scope">
        {{ scope.row.creater }}
        <i class="el-icon-d-arrow-right" />
        {{ scope.row.reviewer }}
        <i class="el-icon-d-arrow-right" />
        {{ scope.row.approver }}
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

          <!-- <div v-if="roleJudge.downloadCustomer && scope.row.loadType && scope.row.loadType.value === 1"
               class="btn"
               style="color:#1890FF;"
               @click="handleDownload(scope.row)">下载名单</div>
          <div v-if="judgeStatus(scope.row.status.value) === 2"
               class="btn"
               style="color:#1890FF"
               @click="handleEdit(scope.row)">
            编辑
          </div>
          <div v-if="roleJudge.createEvent && (judgeStatus(scope.row.status.value) === 4 || judgeStatus(scope.row.status.value) === 5)"
               class="btn"
               style="color:#1890FF;"
               @click="handleCopy(scope.row)">复制</div>
          <div v-if="scope.row.reviewer === user.userName && judgeStatus(scope.row.status.value) === 4"
               class="btn"
               style="color:#f56c6c;"
               @click="handleOfflineEvent(scope.row)">下线</div>
          <div v-if="scope.row.reviewer === user.userName && judgeStatus(scope.row.status.value) === 4"
               class="btn"
               style="color:#1890FF;"
               @click="handleSyncProduct(scope.row)">同步产品</div>
          <div v-if="judgeStatus(scope.row.status.value) === 2"
               class="btn"
               style="color:#f56c6c;"
               @click="handleDelete(scope.row)">删除</div> -->
        </div>
      </template>
    </shun-table>
    <Dialog ref="dialog"
            :visible.sync="showDialog"
            @afterEnsure="getList(1)" />
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { lastAndSingle } from '@/utils'
import {
  allocate,
  getEventList,
  getEventOwner,
  getEventReviewer,
  getEventApprover,
  getEventCategory,
  getEventStatus,
  getAllUseCase,
  copyEvent,
  syncProduct,
  offlineEvent,
  deleteEvent
} from '@/api/api'
import { mapGetters } from 'vuex'
import Dialog from './dialog.vue'

export default {
  name: 'EventBoard',
  components: {
    Dialog,
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
      showDialog: false,
      // 权限判断
      roleJudge: {},
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: '',
        // category: '',
        userId: '',
        reviewerId: '',
        approverId: '',
        useCaseId: +this.$route.query.id || '',
        dateRange: []
      },
      // 表格下拉filters值
      // filters: [],
      // tabFilters: [],
      statusValue: [],
      searchForm: {},
      useCaseOpt: [],
      // categoryOpt: [],
      ownerOpt: [],
      reviewerOpt: [],
      approverOpt: [],
      totalColor: '#224191',
      colors: ['#ff9900', '#1890FF', '#67c23a', '#aaaaaa'],
      tabList: [],
      tabValue: '0',
      tableColumnList: [
        {
          prop: 'name',
          label: '状态/名称/起止日期',
          minWidth: 320,
          notShowOverflowTooltip: true,
          slot: true,
          filters: [],
          columnKey: 'status'
        },
        {
          prop: 'people',
          label: '事件创建人/审核人/审批人',
          minWidth: 200,
          slot: true
        },
        {
          prop: 'modifyTime',
          label: '更新时间',
          minWidth: 160
        },
        {
          prop: 'desc',
          label: '事件描述',
          minWidth: 150
        },
        {
          prop: 'useCase.name',
          label: '所属用例'
        },
        {
          prop: 'operate',
          label: '操作',
          width: 220,
          fixed: 'right',
          slot: true
        }
      ],
      tableData: [],
      selection: []
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'user'
    ]),
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
        }, {
          condition: this.judgeStatus(scope.row.status.value) === 2,
          style: {
            color: '#1890FF'
          },
          clickFn() {
            return _this.handleEdit(scope.row)
          },
          name: '编辑'
        }, {
          condition: scope.row.reviewer === this.user.userName && this.judgeStatus(scope.row.status.value) === 4,
          style: {
            color: '#1890FF'
          },
          clickFn() {
            return _this.handleUpdate(scope.row)
          },
          name: '更新'
        },
        {
          condition: this.roleJudge.createEvent && (this.judgeStatus(scope.row.status.value) === 4 || this.judgeStatus(scope.row.status.value) === 5),
          style: {
            color: '#1890FF'
          },
          clickFn() {
            return _this.handleCopy(scope.row)
          },
          name: '复制'
        }, {
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
            return _this.handleDownloadAssign(scope.row)
          },
          name: '下载未补数人员名单'
        }, {
          //   condition: this.judgeStatus(scope.row.status.value) === 4 && (this.user.userName === scope.row.creater || this.user.userName === scope.row.reviewer),
          //   style: {
          //     color: '#1890FF'
          //   },
          //   clickFn() {
          //     return _this.handleAllocate(scope.row)
          //   },
          //   name: '分发'
          // }, {
          condition: this.judgeStatus(scope.row.status.value) === 2,
          style: {
            color: '#f56c6c'
          },
          clickFn() {
            return _this.handleDelete(scope.row)
          },
          name: '删除'
        }]
        return btns.filter(n => n.condition)
      }
    }
    // useCaseId() {
    //   return +this.$route.query.id
    // }
  },

  watch: {},
  created() {
    // 是否能新建事件
    this.roleJudge.createEvent = this.roles === '事件注册' || this.roles === '用例管理'
    this.roleJudge.downloadCustomer = this.roles === '事件注册' || this.roles === '用例管理' || this.roles === '领导审批'
    // this.eventCategoryList()
    this.getOwner()
    this.getReviewer()
    this.getApprover()
    this.useCase()
    this.getStatus().then(res => {
      this.tabClick(0)
      // console.log('this.tabList', this.tabList)
    })
  },
  methods: {
    // 判断事件大状态
    judgeStatus(subId) {
      return this.tabList.find(n => {
        return n.id !== 'all' && n.children.find(m => {
          return m.value === subId
        })
      }).id
    },
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.$refs.table.clearFilter()
      // this.filters = []
      this.statusValue = []
      this.tabClick(0)
      // this.search()
    },
    // 获取用例
    useCase() {
      getAllUseCase().then(res => {
        this.useCaseOpt = res.data.map(n => {
          return {
            label: n.name,
            value: n.id
          }
        })
      })
    },
    // 获取类型
    // eventCategoryList() {
    //   getEventCategory().then(res => {
    //     this.categoryOpt = res.data.eventCategoryEnumList
    //   })
    // },
    // 获取创建人
    getOwner() {
      getEventOwner().then(res => {
        this.ownerOpt = res.data.map(n => {
          return {
            value: n.userId,
            label: n.userName
          }
        })
      })
    },
    // 获取审核人
    getReviewer() {
      getEventReviewer().then(res => {
        this.reviewerOpt = res.data.map(n => {
          return {
            value: n.userId,
            label: n.userName
          }
        })
      })
    },
    // 获取审批人
    getApprover() {
      getEventApprover().then(res => {
        this.approverOpt = res.data.map(n => {
          return {
            value: n.userId,
            label: n.userName
          }
        })
      })
    },
    // 获取状态
    getStatus() {
      return new Promise((resolve) => {
        getEventStatus().then(res => {
          const total = {
            id: 'all',
            name: '全部',
            count: 0,
            color: this.totalColor,
            children: []
          }
          this.tabList = []
          res.data.forEach((n, i) => {
            total.children.push(...n.children)
            this.tabList.push(Object.assign({}, n, {
              color: this.colors[i],
              count: 0
            }))
          })
          this.tabList.unshift(total)
          resolve()
        })
      })
    },
    tabClick(tabIndex) {
      this.tabValue = tabIndex + ''
      this.$refs.table.clearFilter()
      this.statusValue = []
      this.tableColumnList.find(n => {
        if (n.prop === 'name') {
          n.filters = this.tabList[+tabIndex].children.map(n => {
            this.statusValue.push(n.value)
            return {
              text: n.label,
              value: n.value
            }
          })
        }
      })
      this.search()
    },
    filterChange(filters) {
      this.statusValue = filters.status.length
        ? filters.status
        : this.tabList[+this.tabValue].children.map(n => n.value)
      this.search()
    },
    createEvent() {
      this.$router.push({
        path: '/createEvent'
      })
    },
    getColor(subId) {
      return this.tabList.find(n => {
        return n.id !== 'all' && n.children.find(m => {
          return m.value === subId
        })
      }).color
    },
    search() {
      this.searchForm = {
        name: this.filterForm.name,
        useCaseId: this.filterForm.useCaseId || null,
        userId: this.filterForm.userId || null,
        reviewerId: this.filterForm.reviewerId || null,
        approverId: this.filterForm.approverId || null,
        // category: this.filterForm.category || null,
        dateRange: this.filterForm.dateRange
      }
      this.getList(1)
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
    },
    eventDetail(id) {
      this.$router.push({
        path: '/eventDetail', query: {
          id
        }
      })
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
    // 下载未补数人员名单
    handleDownloadAssign(row) {
      // console.log(row, '????')
      if (row.id) {
        window.open(process.env.VUE_APP_BASE_API + '/event/download_assign_result?eventId=' + row.id, '_self')
      } else {
        return this.$message({
          message: '客群名单不存在',
          type: 'warning',
          duration: '3000'
        })
      }
    },
    handleEdit(row) {
      this.$router.push({
        path: '/createEvent', query: {
          id: row.id
        }
      })
    },
    handleUpdate(row) {
      this.showDialog = true
      this.$refs['dialog'].update(row)
    },
    handleCopy(row) {
      this.$confirm(`确定复制事件（${row.name}）？`)
        .then(() => {
          this.loading = true
          copyEvent({ baseId: row.id }).then(res => {
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
        .finally(() => {
          this.loading = false
        })
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
    handleDelete(row) {
      this.$confirm(`是否确认删除事件（${row.name} ）？`)
        .then(() => {
          this.loading = true
          deleteEvent({ baseId: row.id }).then(res => {
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
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .name-group {
    // padding-top: 5px;
    .top {
      display: flex;
      .status {
        background: #fff;
        border: 1px solid #b7eb8f;
        border-radius: 2px;
        border-radius: 2px;
        // width: 52px;
        height: 22px;
        @include center-center;
        padding: 0 4px;
        // color: #52c41a;
        margin-right: 5px;
        font-size: 12px;
      }
      .name {
        flex: 1;
        color: $blue;
        cursor: pointer;
        // &.link {
        //   color: $blue;
        //   cursor: pointer;
        // }
      }
    }
  }
  .operate-btns {
    .el-dropdown-link {
      font-size: 20px;
      color: $blue;
      cursor: pointer;
    }
  }
}
</style>
