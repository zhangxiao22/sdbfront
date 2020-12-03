<template>
  <div class="container">
    <shun-table ref="table"
                title="模型库"
                :loading="loading"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList">
      <template v-slot:dateSlot="scope">
        <div class="date-group">
          <div :content="scope.row.date">
            {{ scope.row.date }}
          </div>
          <div v-show="scope.row.waitDate"
               class="bottom">
            {{ scope.row.waitDate }} 天
          </div>
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn play"
               :class="{disable:scope.row.status!==1}">{{ scope.row.status===1?'启动':'已启动' }}</div>
          <div v-show="scope.row.file"
               class="btn"
               style="color:#1890FF;">下载名单</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'UseCase',
  components: {
    ShunTable
  },
  props: {
  },
  data() {
    return {
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
          prop: 'name',
          label: '名称',
          minWidth: 300
        },
        {
          prop: 'date',
          label: '最近启动时间/等待天数',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true
        },

        {
          prop: 'desc',
          label: '描述',
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
      tableData: [{
        date: '',
        name: '模型1',
        desc: '上海市普陀区金沙江路 1518 弄',
        waitDate: '',
        status: 1,
        file: ''
      },
      {
        date: '2016-05-01',
        name: '模型2',
        status: 2,
        desc: '上海市普陀区金沙江路 1519 弄',
        waitDate: '1',
        file: ''
      }, {
        date: '2016-05-04',
        name: '模型3',
        desc: '上海市普陀区金沙江路 1517 弄',
        status: 1,
        waitDate: '5',
        file: '11'
      }, {
        date: '2016-05-03',
        name: '模型4',
        status: 2,
        desc: '上海市普陀区金沙江路 1516 弄',
        waitDate: '3',
        file: '11'
      }]
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

  },
  methods: {

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
