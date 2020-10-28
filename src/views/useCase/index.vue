<template>
  <div class="container">
    <shun-table ref="table"
                title="用例管理"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :multiple="multiple"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <!-- <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="用例名称："
                        prop="name">
            <el-input v-model="filterForm.name"
                      style="width:300px"
                      placeholder="搜索事件名称"
                      clearable
                      prefix-icon="el-icon-search" />
          </el-form-item>
          <el-form-item label="事件类型："
                        prop="category">
            <el-select v-model="filterForm.category"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in categoryOpt"
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
      </template> -->
      <template v-slot:main-buttons>
        <el-button class="button"
                   type="primary"
                   @click="createUseCase">
          新建用例
        </el-button>
      </template>
      <template v-slot:nameSlot="scope">
        <div class="name-group">
          <div class="top">
            <div class="status"
                 :style="{color:getColor(Number(scope.row.effect)), border:`1px solid ${getColor(Number(scope.row.effect))}`}">
              {{ getName(Number(scope.row.effect)) }}
            </div>
            <el-tooltip :content="scope.row.name"
                        placement="top-start">
              <div class="name elip bold"
                   @click="eventDetail(scope.row.id)">
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </div>
          <!-- <div class="bottom">
            {{ scope.row.startDate }} 至 {{ scope.row.endDate }}
          </div> -->
        </div>
      </template>
      <template v-slot:targetSlot="scope">
        <!-- <span v-if="scope.row.name ===''"> -</span>
        <span v-else>
          {{ scope.row.name }}
        </span> -->
        <el-popover placement="right"
                    width="200"
                    trigger="click">
          <!-- <el-table :data="gridData">
            <el-table-column width="150"
                             property="label"
                             label="目标" />
            <el-table-column width="100"
                             property="value"
                             label="值" />
          </el-table> -->
          <div slot="reference"
               class="targetcss">
            <!-- <span>{{ scope.row.name }}</span> -->
            <el-tooltip v-if="(getTargetInfo(scope.row.achieveList)).length > 10"
                        placement="top"
                        :content="getTargetInfo(scope.row.achieveList)">
              <span>{{ (getTargetInfo(scope.row.achieveList)).slice(0, 10) + '...' }}</span>
            </el-tooltip>
            <span v-else>{{ getTargetInfo(scope.row.achieveList) }}</span>
          </div>
          <p>{{ scope.row.description }}<br>{{ scope.row.description }}</p>
        </el-popover>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;width:60px"
               @click="edit(scope.row)">事件详情</div>
          <div class="btn"
               style="color:#ff9900"
               @click="edit(scope.row)">下线</div>
          <div class="btn"
               style="color:#F56C6C;">删除</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { getUseCaseList, getEventOwner, getEventCategory, getEventStatus } from '@/api/api'

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
      gridData: [{
        value: '1',
        label: '低息存款销售金额'
      }, {
        value: '1',
        label: '低息存款销售金额'
      }, {
        value: '1',
        label: '低息存款销售金额'
      }, {
        value: '1',
        label: '低息存款销售金额'
      }],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: '',
        category: '',
        userId: '',
        dateRange: []
      },
      // 表格下拉filters值
      // filters: [],
      // tabFilters: [],
      statusValue: [],
      searchForm: {},
      categoryOpt: [],
      ownerOpt: [],
      // totalColor: '#224191',
      colors: ['#67c23a', '#aaaaaa'],
      tabList: [{
        name: '进行中',
        id: 1,
        color: '#67c23a'
      },
      {
        name: '已下架',
        id: 0,
        color: '#aaaaaa'
      }
      ],
      tabValue: '0',
      tableColumnList: [
        {
          prop: 'name',
          label: '状态/用例名称',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true,
          // filters: [],
          columnKey: 'status'
        },
        // {
        //   prop: 'userId',
        //   label: '用例负责人',
        //   minWidth: 100
        // },
        {
          prop: 'target',
          label: '目标',
          minWidth: 250,
          slot: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          minWidth: 150
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 300,
          slot: true
        }
      ],
      tableData: [],
      target: [{ 'label': '促活', 'value': 2 }],
      targetInfo: [],
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
    // this.eventCategoryList()
    // this.getOwner()
    // this.getStatus().then(res => {
    //   this.getList(1)
    //   this.tabClick(0)
    // })
    this.getList(1)
    // this.getTargetInfo(this.target)
    window.vue = this
    console.log()
  },
  methods: {
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.$refs.table.clearFilter()
      this.filters = []
      this.statusValue = []
      // this.tabClick(0)
      this.search()
    },
    // 获取类型
    // eventCategoryList() {
    //   getEventCategory().then(res => {
    //     this.categoryOpt = res.data.eventCategoryEnumList
    //   })
    // },
    // 获取创建人
    // getOwner() {
    //   getEventOwner().then(res => {
    //     this.ownerOpt = res.data.map(n => {
    //       return {
    //         value: n.id,
    //         label: n.userName
    //       }
    //     })
    //   })
    // },
    // 获取状态
    // getStatus() {
    //   return new Promise((resolve) => {
    //     getEventStatus().then(res => {
    //       // const total = {
    //       //   id: 'all',
    //       //   name: '全部',
    //       //   count: 0,
    //       //   color: this.totalColor,
    //       //   children: []
    //       // }
    //       this.tabList = []
    //       res.data.forEach((n, i) => {
    //         // total.children.push(...n.children)
    //         this.tabList.push(Object.assign({}, n, {
    //           color: this.colors[i],
    //           count: 0
    //         }))
    //       })
    //       // this.tabList.unshift(total)
    //       resolve()
    //     })
    //   })
    // },
    // tabClick(tabIndex) {
    //   this.tabValue = tabIndex + ''
    //   this.$refs.table.clearFilter()
    //   this.statusValue = []
    //   this.tableColumnList.find(n => {
    //     if (n.prop === 'name') {
    //       n.filters = this.tabList[+tabIndex].children.map(n => {
    //         this.statusValue.push(n.value)
    //         return {
    //           text: n.label,
    //           value: n.value
    //         }
    //       })
    //     }
    //   })
    //   this.search()
    // },
    // filterChange(filters) {
    //   this.statusValue = filters.status.length
    //     ? filters.status
    //     : this.tabList[+this.tabValue].children.map(n => n.value)
    //   this.search()
    // },
    createUseCase() {
      this.$router.push({
        path: '/createUseCase'
      })
    },
    getColor(subId) {
      return this.tabList.find(n => {
        return n.id === subId
      }).color
    },
    getName(keyId) {
      return this.tabList.find(n => {
        return n.id === keyId
      }).name
    },
    // getTargetInfo(target) {
    //   var output = []
    //   for (let i = 1; i < ; i++) {
    //     output.push(target.map((obj) => {
    //       return obj.name[i] + obj.operator[i] + obj.value[i] + obj.unit[i]
    //     }))
    //   }
    //   return String(output)
    // },
    search() {
      this.searchForm = {
        name: this.filterForm.name,
        userId: this.filterForm.userId || null,
        category: this.filterForm.category || null,
        startDate: this.filterForm.dateRange[0],
        endDate: this.filterForm.dateRange[1]
      }
      // this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      // console.log(this.statusValue)
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)

      this.filterForm = {
        name: this.searchForm.name,
        userId: this.searchForm.userId,
        category: this.searchForm.category,
        dateRange: this.searchForm.startDate && this.searchForm.endDate ? [this.searchForm.startDate, this.searchForm.endDate] : []
      }
      // this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getUseCaseList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        // this.tabList.forEach(n => {
        //   if (n.id === 'all') {
        //     n.count = res.data.totalCount
        //   }
        //   res.data.count.forEach(m => {
        //     if (n.id === m.id) {
        //       n.count = m.totalCount
        //     }
        //   })
        // })
        this.targetDesc = res.data.resultList.map(n => {
          return {
            name: n.achieveList.map(n => {
              return n.name
            }),
            operator: n.achieveList.map(n => {
              return n.operator.label
            }),
            value: n.achieveList.map(n => {
              return n.value
            }),
            unit: n.achieveList.map(n => {
              return n.unit.label
            })
          }
        })
        for (var n = 0; n < this.targetDesc.length; n++) {
          this.tableData[n].achieveList.splice(0, this.tableData[n].achieveList.length, this.targetDesc[n])
        }
        // this.target = res.data.resultList.map(n => {
        //   return {
        //     value: n.achieveList.map(n => {
        //       return n.value
        //     }),
        //     name: n.achieveList.map(n => {
        //       return n.name
        //     })
        //   }
        // })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    edit(row) {
      this.$router.push({
        path: '/eventDetail', query: {
          id: row.id
        }
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
      }
    }
  }
  .targetcss {
    flex: 1;
    color: $blue;
    cursor: pointer;
  }
}
</style>
