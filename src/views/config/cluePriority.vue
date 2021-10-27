<template>
  <!-- 线索优先级 -->
  <div class="container">
    <shun-table ref="table"
                :is-card="false"
                :loading="loading"
                :show-pagination="false"
                :table-data="tableData"
                :table-column-list="tableColumnList">
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF"
               @click="edit(scope.row)">修改优先级</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="修改优先级"
               :close-on-click-modal="false"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               :model="form">
        <el-form-item label="选择："
                      prop="priority"
                      label-width="110px">
          <el-select v-model="form.priority"
                     style="width:90%;"
                     placeholder="请选择">
            <el-option v-for="item in priorityOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAddList">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureAddList">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { checkCluePriorityList, getCluePriorityRuleEnums, setCluePriority } from '@/api/api'

export default {
  components: {
    ShunTable
  },
  props: {

  },
  data() {
    return {
      loading: false,
      buttonLoading: false,
      showDialog: false,
      form: {
        id: '',
        priority: ''
      },
      tableColumnList: [
        {
          prop: 'useCaseName',
          label: '用例'
        },
        {
          prop: 'priority.label',
          label: '优先级'
        },
        {
          prop: 'operate',
          label: '操作',
          slot: true
        }
      ],
      tableData: [],
      priorityOpt: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },

  watch: {},
  created() {
  },
  methods: {
    init() {
      this.getList()
      this.getPriorityOpt()
    },
    getList() {
      checkCluePriorityList().then(res => {
        this.tableData = res.data.map(n => {
          return Object.assign({}, {
            id: n.id,
            useCaseName: n.name,
            priority: n.cluePriorityRule
          })
        })
      })
    },
    getPriorityOpt() {
      getCluePriorityRuleEnums().then(res => {
        this.priorityOpt = res.data
      })
    },
    edit(row) {
      // this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
      this.showDialog = true
      this.form.id = row.id
      this.form.priority = row.priority.value
    },
    cancelAddList() {
      this.showDialog = false
    },
    ensureAddList() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const data = {}
          data.id = this.form.id
          data.cluePriorityRule = this.form.priority
          setCluePriority(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showDialog = false
              this.getList()
            }
          }).finally(() => {
            this.buttonLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
