<template>
  <div class="container">
    <shun-table ref="table"
                title="事件分发"
                :show-pagination="false"
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
      <template v-slot:main-buttons>
        <el-button class="button"
                   icon="el-icon-receiving"
                   type="success"
                   plain
                   @click="allocateSome">
          批量分发
        </el-button>
      </template>
      <template v-slot:nameSlot="scope">
        <div class="name-group">
          <div class="top">
            <div class="status"
                 style="color:rgb(103, 194, 58);border:1px solid rgb(103, 194, 58)">
              运行中
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
          <div class="btn"
               style="color:#1890FF;"
               @click="handleAllocate(scope.row)">分发</div>
          <div class="btn"
               style="color:#1890FF;"
               @click="handleDownload(scope.row)">下载预分发名单</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { queryStatistics, allocate } from '@/api/api'

export default {
  name: 'Hang',

  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: true
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
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
      tableColumnList: [
        {
          prop: 'eventName',
          label: '事件名称',
          fixed: 'left',
          minWidth: 200
        },
        {
          prop: 'allocated',
          label: '已下发',
          minWidth: 100
        },
        {
          prop: 'toAllocate',
          label: '待下发',
          minWidth: 100
        },
        {
          prop: 'preAllocate',
          label: '预分发',
          minWidth: 100
        },
        {
          prop: 'unAllocate',
          label: '未分发',
          minWidth: 100
        },
        {
          prop: 'failedSupply',
          label: '补数失败',
          minWidth: 100
        },
        {
          prop: 'unSupply',
          label: '未补数',
          minWidth: 100
        },
        {
          prop: 'total',
          label: '总线索',
          fixed: 'left',
          minWidth: 100
        },
        {
          prop: 'useCaseName',
          label: '所属用例',
          minWidth: 150
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 190,
          slot: true
        }
      ],
      tableData: [
      ],
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
  },
  methods: {
    init() {
      this.getList()
    },
    allocateSome() {
      const selection = this.$refs.table.getVal()
      const data = {
        eventId: selection.map(n => n.id).join(',')
      }
      if (selection.length) {
        this.loading = true
        allocate(data)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        return this.$message({
          message: '请选择产品',
          type: 'warning',
          duration: '3000'
        })
      }
    },
    handleAllocate(row) {
      this.$confirm(`是否确认事件（${row.eventName}）分发？`)
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
    getList() {
      this.loading = true
      queryStatistics().then(res => {
        this.tableData = res.data
      }
      ).finally(() => {
        this.loading = false
      })
    },
    // 下载未补数人员名单
    handleDownload(row) {
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
