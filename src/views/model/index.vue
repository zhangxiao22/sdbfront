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
          <div class="btn play"
               :class="{disable:scope.row.modelId !== '000001'}"
               @click="runModel(scope.row.modelId)">{{ scope.row.modelId === '000001'?'启动':'已启动' }}</div>
          <div v-show="scope.row.modelId === '000002'"
               class="btn"
               style="color:#1890FF;">下载名单</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { queryModelList, noticeModel } from '@/api/api'

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
        // {
        //   date: '',
        //   name: '模型1',
        //   desc: '上海市普陀区金沙江路 1518 弄',
        //   waitDate: '',
        //   status: 1,
        //   file: ''
        // },
        // {
        //   date: '2016-05-01',
        //   name: '模型2',
        //   status: 2,
        //   desc: '上海市普陀区金沙江路 1519 弄',
        //   waitDate: '1',
        //   file: ''
        // }, {
        //   date: '2016-05-04',
        //   name: '模型3',
        //   desc: '上海市普陀区金沙江路 1517 弄',
        //   status: 1,
        //   waitDate: '5',
        //   file: '11'
        // }, {
        //   date: '2016-05-03',
        //   name: '模型4',
        //   status: 2,
        //   desc: '上海市普陀区金沙江路 1516 弄',
        //   waitDate: '3',
        //   file: '11'
        // }
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
    runModel(modelId) {
      this.loading = true
      noticeModel({ modelId: modelId }).then(res => {
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
