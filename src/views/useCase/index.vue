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
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="用例名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请输入用例名称"
                      clearable
                      prefix-icon="el-icon-search"
                      @keyup.enter.native="search" />
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
        <el-button class="button"
                   type="primary"
                   @click="createUseCase">
          新建用例
        </el-button>
      </template>
      <template v-slot:nameSlot="scope">
        <div class="name-group">
          <div class="status"
               :class="{effect:scope.row.effect}">
            {{ scope.row.effect ? '进行中':'已下线' }}
          </div>
          <el-tooltip :content="scope.row.name"
                      placement="top-start">
            <div class="name elip bold">
              {{ scope.row.name }}
            </div>
          </el-tooltip>
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="edit(scope.row)">查看事件</div>
          <div class="btn status"
               :class="{effect:scope.row.effect}"
               @click="changeStatus(scope.row)">{{ scope.row.effect ? '下线':'上线' }}</div>
          <!-- <div class="btn"
               style="color:#F56C6C;">删除</div> -->
          <el-popover v-model="visible"
                      placement="top"
                      width="160">
            <p>是否确认删除用例</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini"
                         type="text"
                         @click="visible = false">取消</el-button>
              <el-button type="primary"
                         size="mini"
                         @click="delUseCase(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference">删除</el-button>
          </el-popover>
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { getUseCaseList } from '@/api/api'

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
      loading: false,
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
          label: '状态/用例名称',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'caseTarget',
          label: '目标',
          minWidth: 300
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 180
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 180,
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
  },

  watch: {},
  created() {
    this.getList(1)
  },
  methods: {
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getUseCaseList(data).then(res => {
        this.tableData = res.data.resultList.map(n => {
          return Object.assign({}, n, {
            caseTarget: n.achieveList.map(m => `${m.name} ${m.operator.label} ${m.value} ${m.unit.label}`).join(',')
          })
        })
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    changeStatus(row) {

    },
    createUseCase() {
      this.$router.push({
        path: '/createUseCase'
      })
    },
    delUseCase(id) {

    },

    edit(row) {
      this.$router.push({
        path: '/createUseCase', query: {
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
    display: flex;
    .status {
      background: #fff;
      border: 1px solid #aaa;
      border-radius: 2px;
      border-radius: 2px;
      height: 22px;
      @include center-center;
      padding: 0 4px;
      color: #aaa;
      margin-right: 5px;
      font-size: 12px;
      &.effect {
        color: #52c41a;
        border: 1px solid #52c41a;
      }
    }
    .name {
      flex: 1;
    }
  }
  .operate-btns .status {
    color: #52c41a;
    &.effect {
      color: #f56c6c;
    }
  }
}
</style>
