<template>
  <div class="container">
    <div class="title-container">
      <div class="title">产品库</div>
    </div>
    <div class="filter-container-box shun-card">
      <el-form :inline="true"
               :model="filterForm"
               class="filter-container">
        <el-form-item label="产品名称：">
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
      <el-table :data="tableData"
                class="table"
                size="medium"
                max-height="500"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column v-if="showSelection"
                         type="selection"
                         fixed="left"
                         width="55" />
        <el-table-column prop="name"
                         label="产品名称"
                         min-width="200px" />
        <el-table-column prop="type"
                         label="产品类型"
                         min-width="100px" />
        <el-table-column prop="risklLevel"
                         label="风险等级"
                         min-width="100px" />
        <el-table-column prop="rateOfReturn"
                         label="收益率/行业比较基准"
                         min-width="180px" />
        <el-table-column prop="minimumPurchaseAmount"
                         label="起购金额"
                         min-width="100px" />
        <el-table-column prop="begin_time"
                         label="起息日"
                         min-width="100px" />
        <el-table-column prop="end_time"
                         label="到期日"
                         min-width="100px" />
        <el-table-column label="操作"
                         fixed="right"
                         width="100px">
          <template slot-scope="scope">
            <div class="action-group">
              <div class="btn"
                   style="color:#F56C6C;">删除</div>
            </div>
          </template>
        </el-table-column>
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
        value1: ''
      },
      activeName: '0',
      tableData: [
        {
          id: '1',
          name: '顺盈1号',
          type: '开放式理财',
          risklLevel: 'R2',
          rateOfReturn: '2.8-3.2%',
          minimumPurchaseAmount: '10000',
          begin_time: 'XXXX',
          end_time: 'XXXX'
        },
        {
          id: '2',
          name: '顺盈2号',
          type: '开放式理财',
          risklLevel: 'R2',
          rateOfReturn: '2.8-3.2%',
          minimumPurchaseAmount: '10000',
          begin_time: 'XXXX',
          end_time: 'XXXX'
        },
        {
          id: '3',
          name: '顺盈3号',
          type: '开放式理财',
          risklLevel: 'R2',
          rateOfReturn: '2.8-3.2%',
          minimumPurchaseAmount: '10000',
          begin_time: 'XXXX',
          end_time: 'XXXX'
        },
        {
          id: '4',
          name: '顺盈4号',
          type: '开放式理财',
          risklLevel: 'R2',
          rateOfReturn: '2.8-3.2%',
          minimumPurchaseAmount: '10000',
          begin_time: 'XXXX',
          end_time: 'XXXX'
        }
      ],
      currentPage: 1,
      selection: []
    }
  },
  watch: {},
  methods: {
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
