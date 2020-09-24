<template>
  <div class="container">
    <shun-table title="话术库"
                :show-selection="showSelection"
                multiple
                :show-index="true"
                :table-data="tableData"
                :table-column-list="tableColumnList">
      <template v-slot:filter>
        <el-form :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="话术内容：">
            <el-input v-model="filterForm.content"
                      style="width:300px"
                      placeholder="请输入话术内容"
                      clearable />
          </el-form-item>
          <el-form-item label="话术分类：">
            <el-select v-model="filterForm.type"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in typeOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh">
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
import { getWordList } from '@/api/api'
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
      filterForm: {
        content: '',
        type: ''
      },
      typeOpt: [],
      tableData: [],
      tableColumnList: [
        {
          prop: 'content',
          label: '话术内容',
          minWidth: 300,
          notShowOverflowTooltip: true
        },
        {
          prop: 'category',
          label: '话术分类'
          // sortable: true
        },
        {
          prop: 'desc',
          label: '话术说明'
        },
        {
          prop: 'params',
          label: '参数说明',
          minWidth: 150,
          slot: true
        }
      ],
      currentPage: 1,
      selection: []
    }
  },
  watch: {},
  created() {
    this.typeOpt = [
      { value: '1', label: '开场白' },
      { value: '2', label: '跟进处理场景' },
      { value: '3', label: '推荐产品话术' },
      { value: '4', label: '活动/权益介绍' },
      { value: '5', label: '操作指引' }
    ]
    this.getList()
  },
  methods: {
    handleRowClick(row, col, event) {
      this.$refs.table.toggleRowSelection(row)
    },
    getList() {
      getWordList().then(data => {
        console.log(data)
        this.tableData = data.data
      })
    },
    eventDetail(id) {
      this.$router.push({
        path: '/eventDetail', query: {
          id
        }
      })
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.selection = val
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    getVal() {
      return this.selection
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
