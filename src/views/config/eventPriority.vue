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
              :data="tableData"
              size="medium"
              stripe
              :row-key="rowKey"
              style="width: 100%">
      <el-table-column type="index" />
      <el-table-column prop="id"
                       width="100"
                       label="ID" />
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
    init() {
      this.tableLoading = true
      this.useCase().then(res => {
        this.getList()
      })
      this.sortable()
    },
    sortable() {
      const _this = this
      const el = document.querySelector('#event-table tbody')
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.tableData.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.tableData.splice(newIndex, 0, currRow) // 添加至指定位置
          if (newIndex !== oldIndex) {
            _this.saveData()
          }
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
        this.tableData = res.data.resultList.map(n => {
          return Object.assign({}, n.eventBaseInfo, {
            group: n.customerInfoRespList,
            useCase: n.useCase
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
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  ::v-deep .el-table tr {
    cursor: move;
  }
  ::v-deep .el-table tr.sortable-chosen.sortable-ghost td {
    background: #ccffff;
  }
}
</style>
