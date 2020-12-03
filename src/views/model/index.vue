<template>
  <div class="container">
    <shun-table ref="table"
                title="模型库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :stripe="false"
                :multiple="multiple"
                :table-data="tableData"
                :row-style="rowStyle"
                :table-column-list="tableColumnList">
      <template v-slot:nameSlot="scope">
        <div class="name-group">
          <div class="top"
               :content="scope.row.date">
            {{ scope.row.date }}
          </div>
          <div class="bottom">
            <el-tooltip :content="scope.row.name"
                        placement="top-start">
              <div class="name elip bold">
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </div>
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;">启动</div>
          <div class="btn"
               style="color:#1890FF;">下载名单</div>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getUseCaseList, delUseCase, changeStatusUseCase, getEventOwner, modifyUseCaseUser, setDistributeLimit, getUseCaseBelongerCandidateList } from '@/api/api'
import { MAX_NUMBER } from '@/utils'
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
      // 权限判断
      roleJudge: {},
      buttonLoading: false,
      ownerDialog: false,
      clueDialog: false,
      loading: false,
      MAX_NUMBER,
      // 线索的数据(id,subBranchId)
      clueData: {},
      // 线索分配值
      clueInfo: {
        assignUpper_crm: 0,
        assignUpper_sms: 0
      },
      // 归属人选项
      candidateList: [],
      // 归属人的数据(id)
      ownerData: '',
      // 归属人所选值
      form: {
        ownerOpt: []
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: ''
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'name',
          label: '最近启动时间/等待天数',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'province',
          label: '目标',
          minWidth: 300
        },
        {
          prop: 'city',
          label: '修改时间',
          width: 180
        },
        {
          prop: 'zip',
          label: '归属人',
          width: 100
        },
        {
          prop: 'address',
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
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        tag: '家'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333,
        tag: '公司'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333,
        tag: '家'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333,
        tag: '公司'
      }],
      selection: []
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
    this.roleJudge.createUseCase = this.roles === '用例管理' || this.roles === 'admin'
    this.roleJudge.editClue = this.roles === '线索统筹' || this.roles === 'admin'
    this.roleJudge.editPeople = this.roles === '业务管理' || this.roles === 'admin'
  },
  methods: {
    rowStyle({ row, index }) {
      return !row.effect && {
        background: '#f4f4f4'
      }
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .name-group {
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
        &.link {
          color: $blue;
          cursor: pointer;
        }
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
