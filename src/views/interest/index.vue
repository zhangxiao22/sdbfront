<template>
  <div class="container">
    <shun-table title="权益库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                multiple
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="权益名称："
                        prop="name">
            <el-input v-model="filterForm.name"
                      style="width:300px"
                      placeholder="请输入权益内容"
                      clearable />
          </el-form-item>
          <!-- <el-form-item label="话术分类："
                        prop="category">
            <el-select v-model="filterForm.category"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in typeOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item> -->

          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="currentPage=1;getList()">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:paramsSlot="props">
        <pre>{{ props.row.params }}</pre>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { getInterestList } from '@/api/api'
export default {
  name: 'Product',
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
        name: ''
      },
      // typeOpt: [],
      tableColumnList: [
        {
          prop: 'name',
          label: '权益名称'
        },
        {
          prop: 'name',
          label: '权益内容',
          notShowOverflowTooltip: true
        },
        {
          prop: 'description',
          label: '权益说明',
          minWidth: 100,
          notShowOverflowTooltip: true
        },
        {
          prop: 'category',
          label: '话术分类'
        },
        {
          prop: 'validite_start_date',
          label: '开始时间'
        },
        {
          prop: 'validite_end_date',
          label: '结束时间'
        }
      ],
      tableData: [],
      selection: []
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    reset() {
      this.$refs.filterRef.resetFields()
    },
    getList() {
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.filterForm)
      this.loading = true
      getInterestList(data).then(res => {
        this.tableData = res.data.resultList.map((n) => {
          return Object.assign(n, {
            category: n.category.label,
            validite_start_date: n.validite_start_date ? n.validite_start_date.split(' ')[0] : '',
            validite_end_date: n.validite_end_date ? n.validite_start_date.split(' ')[0] : ''
          })
        })
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    getVal() {
      // return this.selection
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
