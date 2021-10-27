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
      <template v-slot:eventNameSlot="scope">
        <div class="name-group">
          <div class="top">
            <div class="status"
                 style="color:rgb(103, 194, 58);border:1px solid rgb(103, 194, 58)">
              运行中
            </div>
            <!-- <el-tooltip :content="scope.row.eventName"
                        placement="top-start"> -->
            <div class="name elip bold"
                 @click="eventDetail(scope.row.id)">
              {{ scope.row.eventName }}
            </div>
            <!-- </el-tooltip> -->
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
          <div class="btn"
               style="color:#1890FF;"
               @click="handleAllocateResult(scope.row)">结果统计</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="分发结果"
               :close-on-click-modal="false"
               :visible.sync="showDialog"
               custom-class="dialog"
               @open="handleDialogOpen"
               @closed="handleDialogClosed">
      <div class="dialog-content">
        <el-table :data="allocateResultList"
                  border>
          <el-table-column prop="remark"
                           label="分发结果" />
          <el-table-column prop="count"
                           label="数量"
                           width="200" />
        </el-table>
      </div>
      <template slot="footer">
        <el-button type="primary"
                   @click="handleDialogClose">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { queryStatistics, allocate, allocateResult } from '@/api/api'

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
      showDialog: false,
      rowId: '',
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
          minWidth: 300,
          slot: true
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
          prop: 'unAllocate',
          label: '未分发',
          minWidth: 100
        },
        {
          prop: 'preAllocate',
          label: '预分发',
          minWidth: 100
        },
        {
          prop: 'toAllocate',
          label: '待下发',
          minWidth: 100
        },
        {
          prop: 'allocated',
          label: '已下发',
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
        // {
        //   id: 1,
        //   eventName: '123123',
        //   failedSupply: 1,
        //   unSupply: 2,
        //   unAllocate: 3,
        //   preAllocate: 4,
        //   toAllocate: 5,
        //   allocated: 6,
        //   total: 1000,
        //   useCaseName: '用例111'
        // }, {
        //   id: 2,
        //   eventName: 'asdf',
        //   failedSupply: 10,
        //   unSupply: 20,
        //   unAllocate: 30,
        //   preAllocate: 40,
        //   toAllocate: 50,
        //   allocated: 60,
        //   total: 1000,
        //   useCaseName: '用例111'
        // }
      ],
      selection: [],
      // 分发结果
      allocateResultList: [
        // {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // },
        // {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // }, {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // }, {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // }, {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // }, {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // }, {
        //   count: 9
        // },
        // {
        //   count: 222,
        //   remark: '分发失败，网点线索数量达到上限'
        // },
        // {
        //   count: 16,
        //   remark: '分发成功，按照生效中线索执行人分发'
        // }
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
    },
    // 查看分发结果
    handleAllocateResult(row) {
      this.rowId = row.id
      this.showDialog = true
    },
    // 打开弹框
    handleDialogOpen() {
      allocateResult({ eventId: this.rowId }).then(res => {
        this.allocateResultList = res.data
      })
    },
    // 关闭弹框
    handleDialogClose() {
      this.showDialog = false
    },
    // 关闭弹框回调
    handleDialogClosed() {
      this.rowId = ''
      this.allocateResultList = []
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
  .unit {
    margin-left: 10px;
  }

  .dialog {
    .dialog-content {
      max-height: 500px;
      padding: 0 20px;
      overflow: auto;
    }
  }
}
</style>
