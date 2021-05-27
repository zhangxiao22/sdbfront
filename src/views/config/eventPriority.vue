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
                      prop="useCaseId">
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
                       width="80"
                       label="现优先级" />
      <el-table-column prop="oldIndex"
                       width="80"
                       label="原优先级" />
      <el-table-column prop="name"
                       show-overflow-tooltip
                       min-width="200"
                       label="事件名称" />
      <el-table-column prop="status.label"
                       show-overflow-tooltip
                       label="事件状态" />
      <el-table-column prop="crmWeekClueLimit"
                       show-overflow-tooltip
                       label="每周线索分配上限（CRM）" />
      <el-table-column prop="smsWeekClueLimit"
                       show-overflow-tooltip
                       label="每周线索分配上限（短信）" />
      <el-table-column label="操作"
                       width="100">
        <template slot-scope="scope">
          <div class="operate-btns">
            <div class="btn"
                 style="color:#1890FF;"
                 @click="handleEditClue(scope.row)">线索分配</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="button-group">
      <Info content="开启后，可拖拽列表排列优先级" />
      拖拽排序：
      <el-tooltip :content="canMove?'已开启':'已关闭'"
                  placement="top">
        <el-switch v-model="canMove"
                   @change="handleEdit" />
      </el-tooltip>
      <el-button type="primary"
                 plain
                 size="mini"
                 style="margin-left:20px;"
                 icon="el-icon-document"
                 @click="onSubmit">保存排序</el-button>
      <el-button icon="el-icon-refresh"
                 size="mini"
                 @click="reset">重置排序</el-button>
    </div>
    <el-dialog title="每周线索分配上限设置"
               :visible.sync="clueDialog">
      <el-form ref="formRef"
               style="width:500px;margin:0 auto;"
               label-width="220px"
               :model="clueInfo">
        <el-form-item required
                      label="每周线索分配上限（CRM）："
                      prop="assignUpper_crm">
          <el-input-number v-model="clueInfo.assignUpper_crm"
                           style="width:200px;"
                           controls-position="right"
                           :min="0"
                           :max="MAX_NUMBER"
                           :step="1000"
                           :precision="0"
                           @blur="handleBlurCRM" />
        </el-form-item>
        <el-form-item required
                      label="每周线索分配上限（短信）："
                      prop="assignUpper_sms">
          <el-input-number v-model="clueInfo.assignUpper_sms"
                           style="width:200px;"
                           controls-position="right"
                           :min="0"
                           :max="MAX_NUMBER"
                           :step="1000"
                           :precision="0"
                           @blur="handleBlurSMS" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="clueDialog = false">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureEditClue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Info from '@/components/Info'
import { getEventPriorityList, getUseCaseForEvent, setEventPriority, setEventDistributeLimit } from '@/api/api'
import Sortable from 'sortablejs'
import { MAX_NUMBER } from '@/utils'

export default {
  components: {
    Info
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
        useCaseId: ''
      },
      tableLoading: false,
      useCaseOpt: [],

      tableData: [],
      MAX_NUMBER,
      // 事件线索的数据(id,subBranchId)
      clueData: {},
      // 事件线索分配值
      clueInfo: {
        assignUpper_crm: 0,
        assignUpper_sms: 0
      },
      clueDialog: false,
      buttonLoading: false
    }
  },
  computed: {
    getClueData() {
      const data = {}
      data.crmWeekClueLimit = this.clueInfo.assignUpper_crm
      data.smsWeekClueLimit = this.clueInfo.assignUpper_sms
      data.id = this.clueData.id
      return data
    }
  },

  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    // 打开事件线索分发编辑框
    handleEditClue(row) {
      this.$refs['formRef'] && this.$refs['formRef'].resetFields()
      this.clueDialog = true
      this.clueData = row
      this.clueInfo.assignUpper_crm = row.crmWeekClueLimit
      this.clueInfo.assignUpper_sms = row.smsWeekClueLimit
    },
    // 编辑事件线索分发
    ensureEditClue() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          setEventDistributeLimit(this.getClueData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.getList()
            }
          }).finally(() => {
            this.buttonLoading = false
            this.clueDialog = false
          })
        }
      })
    },
    handleBlurCRM() {
      if (!this.clueInfo.assignUpper_crm) {
        this.clueInfo.assignUpper_crm = 0
      }
    },
    handleBlurSMS() {
      if (!this.clueInfo.assignUpper_sms) {
        this.clueInfo.assignUpper_sms = 0
      }
    },
    // 开启拖拽排序
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
        animation: 150,
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
          this.filterForm.useCaseId = res.data[0]?.id
          resolve()
        })
      })
    },
    getList(usecase) {
      this.tableLoading = true
      getEventPriorityList({ pageNo: 1, pageSize: 1000, useCaseId: this.filterForm.useCaseId }).then(res => {
        this.tableData = res.data.map((n, i) => {
          return Object.assign({}, n, {
            // group: n.customerInfoRespList,
            // useCase: n.useCase,
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
        cursor: grab;
      }

      ::v-deep tr.sortable-chosen.sortable-ghost td {
        background: #ccffff;
      }
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
