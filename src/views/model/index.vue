<template>
  <div class="container">
    <shun-table ref="table"
                title="模型库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList">
      <template v-slot:bsnStkhdNmSlot="scope">
        <div class="date-group">
          <div :content="scope.row.bsnStkhdNm">
            {{ scope.row.bsnStkhdNm }}
          </div>
          <div v-show="scope.row.techStkhdNm"
               class="bottom">
            {{ scope.row.techStkhdNm }}
          </div>
        </div>
      </template>
      <template v-slot:progressSlot="scope">
        <el-progress :percentage="scope.row.modelId === '000002' ? 99.99 : +percentage.toFixed(2)"
                     :color="customColors" />
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn play"
               :class="{disable:scope.row.modelId !== '000001'}"
               @click="increase">{{ scope.row.modelId === '000001'?'启动':'已启动' }}</div>
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
import { queryModelList } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'UseCase',
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
      percentage: 0,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      // 权限判断
      roleJudge: {},
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
          label: '模型标识',
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
          prop: 'progress',
          label: '模型进度',
          slot: true,
          minWidth: 200
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 150,
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
    },
    ...mapGetters([
      'roles',
      'user'
    ])
  },

  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    increase() {
      this.percentage += +(Math.random() * (1 - 0)).toFixed(2)
      if (this.percentage > 99.99) {
        this.percentage = 99.99
        return
      }
      setTimeout(() => {
        this.increase()
      }, Math.floor(Math.random() * 10000))
    },
    getList() {
      this.loading = true
      queryModelList().then(res => {
        this.tableData = res.data.modelList
      })
        .finally(() => {
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
