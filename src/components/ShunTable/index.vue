<template>
  <div class="shun-table-container">
    <!-- 表格名字 + 一个全局按钮（如新增） -->
    <div class="title-container">
      <div class="title">{{ title }}</div>
    </div>
    <!-- 筛选条件 -->
    <div class="filter-container-box shun-card">
      <slot name="filter" />
    </div>
    <!-- 表格 -->
    <div v-loading="loading"
         class="table-container shun-card">
      <el-alert v-show="selection.length"
                :title="`已选择 ${selection.length} 项`"
                style="margin:10px 0;"
                type="success"
                close-text="清空"
                show-icon
                @close="handleClearSelection" />
      <el-table ref="table"
                :data="tableData"
                class="table"
                size="medium"
                stripe
                style="width: 100%"
                :row-key="(row)=>{return row.id}"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange">
        <!-- index -->
        <el-table-column v-if="showIndex"
                         type="index"
                         :index="indexMethod" />
        <!-- 选择框 -->
        <el-table-column v-if="showSelection"
                         type="selection"
                         :reserve-selection="true"
                         fixed="left"
                         width="55" />
        <template v-for="(item,index) of tableColumnList">
          <el-table-column :key="index"
                           :show-overflow-tooltip="!item.notShowOverflowTooltip"
                           :sortable="item.sortable"
                           :prop="item.prop"
                           :label="item.label"
                           :min-width="item.minWidth">
            <template slot-scope="scope">
              <slot v-if="item.slot"
                    :name="`${item.prop}Slot`"
                    :row="scope.row" />
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- {{ selection }} -->
      <!-- {{ currentPage }}{{ pageSize }} -->
      <el-pagination :current-page="currentPage"
                     background
                     style="margin-top:10px;text-align:right;"
                     :page-sizes="[5, 10, 20, 30]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShunTable',
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    tableColumnList: {
      type: Array,
      default() {
        return []
      }
    }

  },
  data() {
    return {

      selection: []
    }
  },
  computed: {
    // displayData() {
    //   return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    // }
  },
  watch: {

  },
  created() {
  },
  methods: {
    renderList() {
      this.$emit('render')
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1
    },
    handleRowClick(row, col, event) {
      this.$refs.table.toggleRowSelection(row)
    },
    handleSelectionChange(selection) {
      if (this.multiple) {
        this.selection = selection
      } else {
        if (selection.length > 1) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(selection.pop())
        } else {
          this.selection = selection.pop()
        }
      }
    },
    handleSizeChange(val) {
      this.$emit('update:pageSize', val)
      this.$emit('render')
    },
    handleCurrentChange(val) {
      console.log(val)
      this.$emit('update:currentPage', val)
      this.$emit('render')
    },
    handleClearSelection() {
      this.$refs.table.clearSelection()
    },
    select(id) {
      this.tableData.forEach((n, i) => {
        this.$refs.table.toggleRowSelection(n, n.id === id)
      })
    },
    getVal() {
      return this.selection
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.shun-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;

  .title-container {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      color: #303133;
      font-weight: bold;
    }

    .button {
      margin-left: 12px;
    }
  }
  .filter-container-box {
    margin-bottom: 10px;
    padding: 0 16px;
    overflow: hidden;
    ::v-deep .filter-container {
      margin-top: 20px;
      margin-right: -20px;
      overflow-x: hidden;
      .filter-item-end {
        float: right;
      }
    }
  }
}
.table-container {
  flex: 1;
  padding: 6px 16px 16px;

  .table {
    ::v-deep .el-table__fixed-header-wrapper .el-checkbox {
      // display: none;
    }
    .action-group {
      display: flex;
      flex-wrap: wrap;
      .btn {
        width: 40px;
        height: 30px;
        cursor: pointer;
        @include center-center;
        margin-right: 10px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
