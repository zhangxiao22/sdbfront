<template>
  <div class="shun-table-container">
    <!-- 表格名字 + 一个全局按钮（如新增） -->
    <div v-if="title || $slots['main-buttons']"
         class="title-container">
      <div v-if="title"
           class="title">{{ title }}</div>
      <slot name="main-buttons" />
    </div>
    <!-- 筛选条件 -->
    <div v-if="$slots.filter"
         class="filter-container-box"
         :class="{'shun-card card': isCard}">
      <slot name="filter" />
    </div>
    <!-- 表格 -->
    <div v-loading="loading"
         class="table-container"
         :class="{'shun-card card': isCard}">
      <!-- <el-alert v-show="showSelection"
                :title="`已选择 ${selection.length} 项`"
                style="margin:10px 0;"
                :type="selection.length > 0 ? `success` : `warning`"
                close-text="清空"
                show-icon
                @close="handleClearSelection" /> -->
      <Alert v-show="showSelection"
             :title="`已选择 ${selection.length} 项`"
             :type="selection.length > 0 ? `success` : `warning`"
             close-text="清空"
             :closable="selection.length > 0"
             show-icon
             @close="handleClearSelection" />
      <!-- {{ tabValue }} -->
      <el-tabs v-if="tabList.length"
               :value="tabValue"
               style="margin-left:20px;"
               @tab-click="handleTabClick">
        <el-tab-pane v-for="item of tabList"
                     :key="item.value">
          <div slot="label"
               class="tab-label">
            {{ item.name }}
            <div class="count"
                 :style="{background:item.color}">{{ item.count }}</div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-table ref="table"
                :data="tableData"
                v-bind="$attrs"
                class="table"
                size="medium"
                :border="!isCard"
                style="width: 100%"
                v-on="$listeners"
                @row-click="handleRowClick"
                @select="handleSelect"
                @select-all="handleSelectAll"
                @selection-change="selectionChange"
                @filter-change="handleFilterChange">
        <!-- <el-table ref="table"
                class="table"
                size="medium"
                :border="!isCard"
                :stripe="stripe"
                style="width: 100%"
                :row-style="rowStyle"
                @row-click="handleRowClick"
                @select="handleSelect"
                @select-all="handleSelectAll"
                @selection-change="selectionChange"
                @filter-change="handleFilterChange"> -->
        <!-- index -->
        <el-table-column v-if="showIndex"
                         type="index"
                         :index="indexMethod" />
        <!-- 选择框 -->
        <el-table-column v-if="showSelection"
                         type="selection"
                         :selectable="selectable"
                         fixed="left"
                         width="55" />
        <template v-for="(item,index) of tableColumnList">
          <el-table-column :key="index"
                           :show-overflow-tooltip="!item.notShowOverflowTooltip"
                           :sortable="item.sortable"
                           :formatter="item.formatter"
                           :prop="item.prop"
                           :column-key="item.columnKey"
                           :filters="item.filters"
                           :label="item.label"
                           :width="item.width"
                           :fixed="item.fixed"
                           :min-width="item.minWidth">
            <template slot-scope="scope">
              <slot v-if="item.slot"
                    :name="`${item.prop}Slot`"
                    :row="scope.row" />
              <!-- <template v-if="item.slot">{{ item.filteredValue }}</template> -->
              <template v-else>{{ translate(scope.row,item) }}</template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- {{ selection.map(n => n.id) }} -->
      <!-- {{ currentPage }}{{ pageSize }} -->
      <el-pagination v-if="showPagination"
                     v-bind="$attrs"
                     :current-page="currentPage"
                     background
                     style="padding:15px;text-align:right;"
                     :page-sizes="[5, 10, 20, 30]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import Alert from '@/components/Alert'

export default {
  name: 'ShunTable',
  components: {
    Alert
  },
  props: {
    // 是否以卡片形式展示（默认是）
    isCard: {
      type: Boolean,
      default: true
    },
    // 是否使用翻页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 每页显示条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // // 总条数
    // total: {
    //   type: Number,
    //   default: 0
    // },
    // 表格是否加载
    loading: {
      type: Boolean,
      default: false
    },
    // 总标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示编号
    showIndex: {
      type: Boolean,
      default: false
    },
    // 是否显示选择框
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 表格切换tab
    tabList: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格切换tab选中值
    tabValue: {
      type: String,
      default() {
        return '0'
      }
    },
    // 表格展示数据
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格展示字段
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
    tableData() {
      this.$nextTick(() => {
        this.autoSelect(this.selection.map(n => n.id))
      })
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    clearFilter() {
      this.$refs.table.clearFilter()
    },
    translate(obj, { prop, formatter }) {
      let val = obj
      const arr = prop.split('.')
      for (let i = 0; i < arr.length; i++) {
        if (val) {
          val = val[arr[i]]
        } else {
          val = ''
          break
        }
      }
      // paramPropStr.split('.').forEach(n => {
      // })
      // formatter({row, column, cellValue, index})
      return formatter && formatter(null, null, val, null) || val
    },
    // 能否选择
    selectable(row, index) {
      return !row.canSelected
    },
    // tab点击
    handleTabClick(tab) {
      this.$emit('update:tabValue', tab.index + '')
      this.$emit('tab-click', tab.index)
    },
    // 改变filter
    handleFilterChange(filters) {
      this.$emit('filter-change', filters)
    },
    setSelection(arr) {
      this.selection = [...arr]
    },
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1
    },
    handleRowClick(row, col, event) {
      // if (!this.showSelection) return
      // this.$refs.table.toggleRowSelection(row)
    },

    handleSelect(selection, row) {
      const isSel = selection.some(n => {
        return n.id === row.id
      })
      if (this.multiple) {
        // 多选
        if (isSel) {
          this.selection.push(row)
        } else {
          this.selection.find((n, i) => {
            if (n.id === row.id) {
              this.selection.splice(i, 1)
              return true
            }
          })
        }
      } else {
        // 单选
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row, isSel)
        this.selection = isSel ? [row] : []
      }
    },
    handleSelectAll(selection) {
      if (this.multiple) {
        if (selection.length) {
          this.selection.push(
            ...selection.filter(n => {
              return !this.selection.some(m => m.id === n.id)
            })
          )
        } else {
          const ids = this.tableData.map(n => n.id)
          for (let i = this.selection.length - 1; i >= 0; i--) {
            if (ids.includes(this.selection[i].id)) {
              this.selection.splice(i, 1)
            }
          }
        }
      } else {
        this.$refs.table.clearSelection()
        this.selection = []
      }
    },

    selectionChange(selection) {
      // this.selection = selection
      // if (this.multiple) {
      //   this.selection = selection
      // } else {
      //   if (selection.length > 1) {
      //     this.$refs.table.clearSelection()
      //     this.$refs.table.toggleRowSelection(selection.pop())
      //   } else {
      //     this.selection = selection
      //   }
      // }
    },
    handleSizeChange(val) {
      this.$emit('update:pageSize', val)
      this.$emit('render')
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.$emit('update:currentPage', val)
      this.$emit('render')
    },
    handleClearSelection() {
      this.resetSelection()
    },
    autoSelect(ids) {
      this.tableData.forEach((n, i) => {
        this.$refs.table.toggleRowSelection(n, ids.includes(n.id))
      })
    },
    resetSelection() {
      this.$refs.table.clearSelection()
      this.selection = []
    },
    getVal() {
      return this.selection
    },
    // 清除排序
    clearSort() {
      this.$refs.table.clearSort()
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
      margin-right: 12px;
    }

    .button {
      margin-left: 0;
      margin-right: 12px;
    }
  }
  .filter-container-box {
    margin-bottom: 10px;
    overflow: hidden;
    &.card {
      padding: 20px 16px 0;
    }
    ::v-deep .filter-container {
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
  &.card {
    // padding: 6px 16px 16px;
    padding-top: 6px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    content: none;
  }
  .tab-label {
    display: flex;
    align-items: center;

    .count {
      height: 20px;
      padding: 0 8px;
      font-size: 10px;
      color: #fff;
      display: flex;
      align-items: center;
      border-radius: 2px;
      margin-left: 5px;
    }
  }

  ::v-deep .el-alert.is-light .el-alert__closebtn {
    color: #f56c6c;
    line-height: 20px;
  }
  .table {
    ::v-deep .el-table__fixed-header-wrapper .el-checkbox {
      // display: none;
    }
    ::v-deep .operate-btns {
      display: flex;
      flex-wrap: wrap;
      .btn {
        // width: 40px;
        padding: 0 4px;
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
