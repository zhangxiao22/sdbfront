<template>
  <!-- 事件优先级 -->
  <div class="container">
    <!-- 筛选条件 -->
    <div class="filter-container-box">
      <el-form ref="filterRef"
               :inline="true"
               :model="filterForm"
               class="filter-container">
        <el-form-item label="所属用例："
                      prop="category">
          <el-select v-model="filterForm.useCaseId"
                     placeholder="请选择"
                     @change="getList(filterForm.useCaseId)">
            <el-option v-for="item in useCaseOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table id="event-table"
              v-loading="tableLoading"
              :class="{move:canMove}"
              :data="tableData"
              size="medium"
              stripe
              :row-key="rowKey"
              style="width: 100%">
      <el-table-column type="index"
                       width="100"
                       label="现优先级" />
      <el-table-column prop="oldIndex"
                       width="100"
                       label="原优先级" />
      <el-table-column prop="name"
                       show-overflow-tooltip
                       label="事件名称" />
      <el-table-column prop="status.label"
                       show-overflow-tooltip
                       label="事件状态" />
      <el-table-column prop="startDate"
                       show-overflow-tooltip
                       label="开始日期" />
      <el-table-column prop="endDate"
                       show-overflow-tooltip
                       label="结束日期" />
      <el-table-column prop="useCase.name"
                       show-overflow-tooltip
                       label="所属用例" />
    </el-table>
    <div class="button-group">
      拖拽排序：
      <el-tooltip :content="canMove?'允许排序':'禁止排序'"
                  placement="top">
        <el-switch v-model="canMove"
                   @change="handleEdit" />
      </el-tooltip>
      <el-button type="primary"
                 style="width:100px;margin-left:20px;"
                 icon="el-icon-document"
                 @click="onSubmit">保存</el-button>
      <el-button icon="el-icon-refresh"
                 style="width:100px;"
                 @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
import { getEventList, getUseCaseForEvent, setEventPriority } from '@/api/api'
import Sortable from 'sortablejs'

export default {
  components: {
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      canMove: false,
      filterForm: {
        category: ''
      },
      tableLoading: false,
      useCaseOpt: [],

      tableData: []
    }
  },
  computed: {

  },

  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    handleEdit(val) {
      this.sortable.options.disabled = !val
    },
    onSubmit() {
      this.saveData()
    },
    reset() {
      this.getList()
    },
    init() {
      this.tableLoading = true
      this.useCase().then(res => {
        this.getList()
      })
      this.renderSortable()
    },
    renderSortable() {
      const _this = this
      const el = document.querySelector('#event-table tbody')
      this.sortable = Sortable.create(el, {
        disabled: true,
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.tableData.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.tableData.splice(newIndex, 0, currRow) // 添加至指定位置
          // if (newIndex !== oldIndex) {
          // _this.saveData()
          // }
        }
      })
    },
    rowKey(row) {
      return row.id
    },
    // 获取用例
    useCase() {
      return new Promise((resolve) => {
        getUseCaseForEvent().then(res => {
          this.useCaseOpt = res.data.map(n => {
            return {
              label: n.name,
              value: n.id
            }
          })
          this.filterForm.useCaseId = res.data[0].id
          resolve()
        })
      })
    },
    getList(usecase) {
      getEventList({ pageNo: 1, pageSize: 1000, useCaseId: this.filterForm.useCaseId }).then(res => {
        this.tableData = res.data.resultList.map((n, i) => {
          return Object.assign({}, n.eventBaseInfo, {
            group: n.customerInfoRespList,
            useCase: n.useCase,
            oldIndex: i + 1
          })
        })
      }).finally(() => {
        this.tableLoading = false
      })
    },
    saveData() {
      const data = {}
      data.priorityData = this.tableData.map(n => n.id)
      this.$emit('update:loading', true)
      setEventPriority(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: '3000'
          })
        }
      }).finally(() => {
        this.getList()
        this.$emit('update:loading', false)
        this.sortable.options.disabled = true
        this.canMove = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  #event-table {
    &.move.el-table {
      ::v-deep tr {
        cursor: move;
      }

      ::v-deep tr.sortable-chosen.sortable-ghost td {
        background: #ccffff;
      }
    }
  }
  .button-group {
    margin-top: 20px;
  }
  // ::v-deep .el-table tr {
  //   cursor: move;
  // }
  // ::v-deep .el-table tr.sortable-chosen.sortable-ghost td {
  //   background: #ccffff;
  // }
}
</style>
