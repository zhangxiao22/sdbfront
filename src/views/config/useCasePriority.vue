<template>
  <!-- 用例优先级 -->
  <div class="container">
    {{ disabled }}
    <el-table id="use-case-table"
              :class="{move:!disabled}"
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
    <div class="button-group">
      <el-button type="success"
                 style="width:100px;"
                 icon="el-icon-rank"
                 @click="handleEdit">修改排序</el-button>
      <el-button type="primary"
                 style="width:100px;"
                 icon="el-icon-document"
                 @click="onSubmit">保存</el-button>
      <el-button icon="el-icon-refresh"
                 style="width:100px;"
                 @click="reset">重置</el-button>
    </div>

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
      disabled: true,
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
    handleEdit() {
      this.sortable.options.disabled = false
      this.disabled = false
    },
    onSubmit() {
      this.saveData()
    },
    reset() {
      this.getList()
    },
    sortable() {
      const _this = this
      const el = document.querySelector('#use-case-table tbody')
      this.sortable = Sortable.create(el, {
        disabled: true,
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.tableData.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.tableData.splice(newIndex, 0, currRow) // 添加至指定位置
          // if (newIndex !== oldIndex) {
          // _this.saveData()
          // _this.onSubmit()
          // }
        }
      })
    },
    rowKey(row) {
      return row.id
    },
    getList() {
      getUseCaseList({ pageNo: 1, pageSize: 1000, effect: true }).then(res => {
        this.tableData = res.data.resultList.map((n, i) => {
          return Object.assign({}, n, {
            oldIndex: i + 1
          })
        })
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
        this.sortable.options.disabled = true
        this.disabled = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  #use-case-table {
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
}
</style>
