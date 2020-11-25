<template>
  <!-- 事件优先级 -->
  <div class="container">
    <el-table id="use-case-table"
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
      <el-table-column prop="name"
                       show-overflow-tooltip
                       label="事件状态" />
      <el-table-column prop="name"
                       show-overflow-tooltip
                       label="起止日期" />
      <el-table-column prop="name"
                       show-overflow-tooltip
                       label="事件类型" />
      <el-table-column prop="name"
                       show-overflow-tooltip
                       label="所属用例" />
    </el-table>
  </div>
</template>

<script>
import { getUseCaseList, setUseCasePriority } from '@/api/api'
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
      this.getList()
      this.sortable()
    },
    sortable() {
      const _this = this
      const el = document.querySelector('#use-case-table tbody')
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
    getList() {
      getUseCaseList({ pageNo: 1, pageSize: 1000, effect: true }).then(res => {
        this.tableData = res.data.resultList
      })
    },
    saveData() {
      const data = {}
      data.priorityData = this.tableData
      this.$emit('update:loading', true)
      setUseCasePriority(data).then(res => {
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
