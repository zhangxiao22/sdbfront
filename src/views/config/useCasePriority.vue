<template>
  <!-- 用例优先级 -->
  <div class="container">
    <el-table id="use-case-table"
              :data="tableData"
              :loading="loading"
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
                       label="用例名称" />
      <el-table-column prop="createTime"
                       show-overflow-tooltip
                       label="创建时间" />
      <el-table-column prop="modifyTime"
                       show-overflow-tooltip
                       label="修改时间" />
      <el-table-column prop="description"
                       show-overflow-tooltip
                       label="描述" />
    </el-table>
  </div>
</template>

<script>
import { getUseCaseList, setUseCasePriority } from '@/api/api'
import Sortable from 'sortablejs'

export default {
  components: {
  },

  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  computed: {

  },

  watch: {},
  created() {
    this.getList()
  },
  mounted() {
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
  methods: {
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
      this.loading = true
      setUseCasePriority(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: '3000'
          })
          this.loading = false
        }
      }).catch(() => {
        this.getList()
        this.loading = false
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
