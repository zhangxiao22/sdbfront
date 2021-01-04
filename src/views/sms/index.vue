<template>
  <div class="container">
    <shun-table ref="table"
                title="短信库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="短信内容："
                        prop="content">
            <el-input v-model.trim="filterForm.content"
                      style="width:300px"
                      placeholder="请输入短信内容"
                      clearable
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
      <template v-slot:parameterDescriptionSlot="props">
        <pre>{{ props.row.parameterDescription }}</pre>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList } from '@/api/api'

export default {
  name: 'Sms',
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
        content: ''
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'content',
          label: '短信内容',
          minWidth: 300,
          notShowOverflowTooltip: true
        },
        {
          prop: 'businessScenario',
          label: '业务场景',
          minWidth: 200
        },
        {
          prop: 'parameterDescription',
          label: '参数说明',
          minWidth: 200,
          slot: true,
          notShowOverflowTooltip: true
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
    this.search()
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
      this.loading = true
      getSmsList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
