<template>
  <div class="container">
    <div class="title-container">
      <div class="title">话术库</div>
    </div>
    <div class="filter-container-box shun-card">
      <el-form :inline="true"
               :model="filterForm"
               class="filter-container">
        <el-form-item label="话术分类：">
          <el-select v-model="filterForm.type"
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
    </div>
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
        <el-table-column prop="content"
                         label="话术内容"
                         min-width="300px" />
        <el-table-column prop="category"
                         label="话术分类"
                         min-width="100px" />
        <el-table-column prop="desc"
                         label="话术说明"
                         min-width="200px" />
        <el-table-column prop="params"
                         label="参数说明"
                         min-width="180px">
          <template slot-scope="scope">
            <pre>{{ scope.row.params }}</pre>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作"
                         width="100px">
          <template slot-scope="scope">
            <div class="action-group">
              <div class="btn"
                   style="color:#F56C6C;">删除</div>
            </div>
          </template>
        </el-table-column> -->
      </el-table>

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
import { getWordList } from '@/api/api'
export default {
  name: 'Product',
  props: {
    showSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterForm: {
        type: ''
      },
      typeOpt: [],
      tableData: [],
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
  padding: 6px 10px 10px;

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

  .table {
    .name-group {
      // padding-top: 5px;
      .top {
        display: flex;
        .status {
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          border-radius: 2px;
          border-radius: 2px;
          width: 52px;
          height: 22px;
          @include center-center;
          color: #52c41a;
          margin-right: 5px;
          font-size: 12px;
        }
        .name {
          flex: 1;
          color: $blue;
          cursor: pointer;
        }
      }
    }
    .main-group {
      display: flex;
      .left {
        font-size: 20px;
        .unit {
          font-size: 12px;
        }
      }
      .right {
        margin-left: 40px;
        font-size: 18px;
        display: flex;
        align-items: center;
      }
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
