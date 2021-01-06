<template>
  <div class="container">
    <shun-table ref="table"
                title="模型库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :show-pagination="false"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList">
      <template v-slot:bsnStkhdNmSlot="scope">
        <div>
          {{ scope.row.techStkhdNm }} / {{ scope.row.bsnStkhdNm }}
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <!-- status true:未启动 false:已启动 -->
          <div class="btn play"
               :class="{disable:!scope.row.status}"
               @click="runModel(scope.row)">{{ scope.row.status?'启动':'已启动' }}</div>
          <div v-if="scope.row.download"
               class="btn"
               style="color:#1890FF;"
               @click="download(scope.row.modelId)">下载名单</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { queryModelList, noticeModel } from '@/api/api'
import { downloadFile } from '@/utils'

export default {
  name: 'Model',
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
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'modelName',
          label: '模型名称',
          minWidth: 150
        },
        {
          prop: 'modelId',
          label: '模型ID',
          minWidth: 120
        },
        {
          prop: 'rqdTagCnt',
          label: '所需标签个数',
          minWidth: 120
        },
        {
          prop: 'useDate',
          label: '使用日期',
          minWidth: 120
        },
        {
          prop: 'departmentName',
          label: '归属部门',
          minWidth: 120
        },
        {
          prop: 'bsnStkhdNm',
          label: '业务干系人/技术干系人',
          minWidth: 180,
          notShowOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'modelDsc',
          label: '模型描述',
          minWidth: 200
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 160,
          slot: true,
          fixed: 'right'
        }
      ],
      tableData: [

      ]
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },

  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    reset() {
      this.getList()
    },

    getList() {
      this.loading = true
      queryModelList().then(res => {
        this.tableData = res.data.modelList.map((n) => {
          return Object.assign(n, {
            canSelected: false
          })
        })
      }).finally(() => {
        this.loading = false
      })
    },
    runModel(row) {
      if (!row.status) return
      this.loading = true
      noticeModel({ modelId: row.modelId }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '启动成功',
            type: 'success',
            duration: '3000'
          })
          this.reset()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    download(id) {
      const data = {
        modelId: id
      }
      downloadFile('/customer/modelDownload', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .operate-btns {
    .play {
      color: #1890ff;
      &.disable {
        color: #888;
        cursor: not-allowed;
      }
    }
  }
}
</style>
