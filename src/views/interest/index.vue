<template>
  <div class="container">
    <div class="title-container">
      <div class="title">权益库</div>
    </div>
    <div class="filter-container-box shun-card">
      <el-form :inline="true"
               :model="filterForm"
               class="filter-container">
        <el-form-item label="权益名称：">
          <el-input v-model="filterForm.value1"
                    style="width:300px"
                    placeholder="搜索事件名称"
                    clearable
                    prefix-icon="el-icon-search" />
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
    </div>
    <div class="table-container shun-card">
      <el-table ref="table"
                :data="tableData"
                class="table"
                size="medium"
                max-height="500"
                stripe
                style="width: 100%"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange">
        <el-table-column v-if="showSelection"
                         type="selection"
                         fixed="left"
                         width="55" />
        <el-table-column prop="name"
                         label="名称"
                         min-width="300px" />
        <el-table-column prop="type"
                         label="类型" />
        <!-- <el-table-column label="操作"
                         fixed="right"
                         width="100px">
          <template slot-scope="scope">
            <div class="action-group">
              <div class="btn"
                   style="color:#F56C6C;">删除</div>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- {{ selection }} -->
      <el-pagination :current-page="currentPage"
                     background
                     style="margin-top:10px;text-align:right;"
                     :page-sizes="[10, 20, 30]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Product',
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      filterForm: {
        value1: ''
      },
      activeName: '0',
      tableData: [
        {
          id: '1',
          name: '权益权益权益权益权益权益权益权益权益权益权益权益权益权益111',
          type: '类型1'
        },
        {
          id: '2',
          name: '权益权益权益权益权益权益权益权益权益权益权益权益权益权益222',
          type: '类型2'
        },
        {
          id: '3',
          name: '权益权益权益权益权益权益权益权益权益权益权益权益权益权益333',
          type: '类型2'
        },
        {
          id: '4',
          name: '权益权益权益权益权益权益权益权益权益权益权益权益权益权益444',
          type: '类型1'
        }
      ],
      currentPage: 1,
      selection: []
    }
  },
  watch: {
    // value(val) {
    //   console.log('????', val)
    // }
  },

  methods: {
    eventDetail(id) {
      this.$router.push({
        path: '/eventDetail', query: {
          id
        }
      })
    },
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

.container {
  flex: 1;
  display: flex;
  flex-direction: column;

  .title-container {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 20px;
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
