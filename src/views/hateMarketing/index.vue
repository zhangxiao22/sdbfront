<template>
  <div class="container">
    <shun-table ref="table"
                title="厌恶营销名单"
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
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="事件名称："
                        prop="name">
            <el-input v-model="filterForm.name"
                      style="width:300px"
                      placeholder="搜索事件名称"
                      clearable
                      prefix-icon="el-icon-search" />
          </el-form-item>
          <el-form-item label="所属用例："
                        prop="category">
            <el-select v-model="filterForm.useCaseId"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in useCaseOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
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
      </template>
      <template v-slot:main-buttons>
        <el-upload ref="uploadRef"
                   class="upload"
                   :http-request="uploadFile"
                   :accept="accept.map(n => `.${n}`)"
                   action="">
          <el-button class="button"
                     type="primary">
            全量更新
          </el-button>
        </el-upload>
        <el-upload ref="uploadRef"
                   :http-request="uploadFile"
                   :accept="accept.map(n => `.${n}`).join(',')"
                   action="">
          <el-button class="button"
                     type="primary">
            批量更新
          </el-button>
        </el-upload>
        <el-button class="button"
                   type="primary"
                   @click="createEvent">
          批量下载
        </el-button>
        <el-button class="button"
                   type="primary"
                   @click="createEvent">
          全部下载
        </el-button>
        <el-link type="primary"
                 @click="download">模版下载</el-link>
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
            {{ scope.row.startDate }} 至 {{ scope.row.endDate }}
          </div>
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF"
               @click="edit(scope.row)">编辑</div>
          <div class="btn"
               style="color:#F56C6C;">删除</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getEventList, getEventOwner, getEventCategory, getEventStatus, getUseCaseForEvent, uploadFile } from '@/api/api'

export default {
  name: 'HateMarketing',
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
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: '',
        category: '',
        userId: '',
        useCaseId: +this.$route.query.id || '',
        dateRange: []
      },
      accept: ['xls', 'xlsx', 'csv'],
      // 表格下拉filters值
      // filters: [],
      // tabFilters: [],
      statusValue: [],
      searchForm: {},
      useCaseOpt: [],
      categoryOpt: [],
      ownerOpt: [],
      totalColor: '#224191',
      colors: ['#ff9900', '#1890FF', '#67c23a', '#aaaaaa'],
      tabList: [],
      tabValue: '0',
      tableColumnList: [
        {
          prop: 'name',
          label: '状态/名称/起止日期',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true,
          filters: [],
          columnKey: 'status'
        },
        {
          prop: 'category.label',
          label: '事件类型'
        },
        {
          prop: 'useCase.name',
          label: '所属用例'
        },
        {
          prop: 'modifyTime',
          label: '更新时间',
          minWidth: 150
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 150,
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
    // useCaseId() {
    //   return +this.$route.query.id
    // }
  },

  watch: {},
  created() {
    this.eventCategoryList()
    this.getOwner()
    this.useCase()
    this.getStatus().then(res => {
      this.tabClick(0)
    })
  },
  methods: {
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
      getUseCaseForEvent().then(res => {
        this.useCaseOpt = res.data.map(n => {
          return {
            label: n.name,
            value: n.id
          }
        })
      })
    },
    // 获取类型
    eventCategoryList() {
      getEventCategory().then(res => {
        this.categoryOpt = res.data.eventCategoryEnumList
      })
    },
    // 获取创建人
    getOwner() {
      getEventOwner().then(res => {
        this.ownerOpt = res.data.map(n => {
          return {
            value: n.id,
            label: n.userName
          }
        })
      })
    },
    // 获取状态
    getStatus() {
      return new Promise((resolve) => {
        getEventStatus().then(res => {
          // const total = {
          //   id: 'all',
          //   name: '全部',
          //   count: 0,
          //   color: this.totalColor,
          //   children: []
          // }
          this.tabList = []
          res.data.forEach((n, i) => {
            // total.children.push(...n.children)
            this.tabList.push(Object.assign({}, n, {
              color: this.colors[i],
              count: 0
            }))
          })
          // this.tabList.unshift(total)
          resolve()
        })
      })
    },
    resetFile() {
      this.file = ''
      this.$refs.uploadRef.clearFiles()
    },
    uploadFile() {
      const index = this.file.name.lastIndexOf('.')
      const suffix = this.file.name.substr(index + 1)
      // console.log(suffix)
      if (!this.accept.includes(suffix)) {
        this.$message({
          message: '请上传正确的文件格式',
          type: 'error',
          duration: '5000'
        })
        this.resetFile()
        return
      } else {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('baseId', this.id)
        this.$parent.mainLoading = true
        uploadFile(formData).then(res => {
          // console.log(res)
          this.fileId = res.data.fileId
          this.fileName = res.data.fileName
          this.customerCount = res.data.recordNum
          this.updateTime = res.data.uploadTime
          this.tableData = res.data.groupInfoWithCount.map((n) => {
            return Object.assign({}, n, {
              desc: '',
              _desc: '',
              isEdit: false,
              isHover: false
            })
          })
          this.$parent.mainLoading = false
        }).catch(() => {
          this.resetFile()
          this.$parent.mainLoading = false
        })
      }
    },
    // 下载模版
    download() {
      window.open('/static/template.xlsx', '_blank')
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
        return n.children.find(m => {
          //  return n.id !== 'all' && n.children.find(m => {
          return m.value === subId
        })
      }).color
    },
    search() {
      this.searchForm = {
        name: this.filterForm.name,
        useCaseId: this.filterForm.useCaseId || null,
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
        pageSize: this.pageSize,
        status: this.statusValue
      }, this.searchForm)

      this.filterForm = {
        name: this.searchForm.name,
        useCaseId: this.filterForm.useCaseId,
        userId: this.searchForm.userId,
        category: this.searchForm.category,
        dateRange: this.searchForm.startDate && this.searchForm.endDate ? [this.searchForm.startDate, this.searchForm.endDate] : []
      }
      // this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getEventList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.tabList.forEach(n => {
          // if (n.id === 'all') {
          //   n.count = res.data.totalCount
          // }
          res.data.count.forEach(m => {
            if (n.id === m.id) {
              n.count = m.totalCount
            }
          })
        })
        this.loading = false
      }).catch(() => {
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
    edit(row) {
      this.$router.push({
        path: '/createEvent', query: {
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
  .upload {
    width: 50px;
    margin: 0 auto;
  }
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
}
</style>
