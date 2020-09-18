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
    <div class="table-container shun-card">
      <el-table ref="table"
                :data="tableData"
                class="table"
                size="medium"
                stripe
                style="width: 100%"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange">
        <el-table-column v-if="showSelection"
                         type="selection"
                         fixed="left"
                         width="55" />
        <template v-for="(item,index) of tableColumnList">
          <el-table-column :key="index"
                           :show-overflow-tooltip="!item.notShowOverflowTooltip"
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
      <el-pagination :current-page="currentPage"
                     background
                     style="margin-top:10px;text-align:right;"
                     :page-sizes="[5, 10, 20, 30]"
                     :page-size="tableData.lang"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShunTable',
  props: {
    title: {
      type: String,
      default: ''
    },
    showSelection: {
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

      currentPage: 1,
      selection: []
    }
  },
  watch: {

  },

  methods: {
    handleRowClick(row, col, event) {
      this.$refs.table.toggleRowSelection(row)
    },
    handleSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(selection.pop())
      } else {
        this.selection = selection.pop()
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    select(id) {
      this.tableData.forEach((n, i) => {
        this.$refs.table.toggleRowSelection(n, n.id === id)
      })
      console.log(id)
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
    .filter-container {
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
      display: none;
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
