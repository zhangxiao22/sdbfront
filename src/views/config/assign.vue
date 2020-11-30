<template>
  <!-- 岗位管理 -->
  <div class="container">
    <shun-table ref="table"
                :is-card="false"
                :loading="loading"
                :show-selection="showSelection"
                :show-pagination="false"
                :multiple="multiple"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:main-buttons>
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAdd">
          新增岗位
        </el-button>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEdit(scope.row)">编辑</div>
          <div v-if="scope.row.people === 0"
               class="btn"
               style="color:#f56c6c;"
               @click="handleDel(scope.row)">删除</div>
        </div>
      </template>
    </shun-table>
    <el-dialog :title="isEdit?'编辑岗位':'新增岗位'"
               :visible.sync="showDialog">
      <el-form ref="formRef"
               :model="form">
        <el-form-item label="岗位名称："
                      prop="name"
                      :rules="[{
                        required: true, message: '请输入岗位', trigger: 'blur'
                      }]"
                      label-width="110px">
          <el-input v-model="form.name"
                    :disabled="isEdit"
                    style="width:90%;"
                    placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="选择角色："
                      prop="role"
                      :rules="[{
                        required: true, message: '请选择角色', trigger: 'blur'
                      }]"
                      label-width="110px">
          <el-select v-model="form.role"
                     style="width:90%;"
                     placeholder="请选择">
            <el-option v-for="item in roleOpt"
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
import { getAllJob, insertJob, getPermissionPackEnum, deleteJob, updateJob } from '@/api/api'

export default {
  name: 'Assign',
  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 表格已选中项
    selectedItems: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      buttonLoading: false,
      isEdit: false,
      form: {
        id: '',
        name: '',
        role: ''
      },
      tableColumnList: [
        {
          prop: 'post',
          label: '岗位名称'
        },
        {
          prop: 'role.label',
          label: '角色'
        },
        {
          prop: 'people',
          label: '岗位人数'
        },
        {
          prop: 'operate',
          label: '操作',
          slot: true
        }
      ],
      tableData: [],
      roleOpt: []
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
      this.getRoleOpt()
    },
    getList() {
      this.loading = true
      getAllJob().then(res => {
        this.loading = false
        this.tableData = res.data.map(n => {
          return Object.assign({}, {
            id: n.id,
            post: n.name,
            role: n.permissionPack,
            people: n.userJobCount
          })
        })
      })
    },
    getRoleOpt() {
      getPermissionPackEnum().then(res => {
        this.roleOpt = res.data
      })
    },
    handleAdd() {
      this.isEdit = false
      this.$refs['formRef'] && this.$refs['formRef'].resetFields()
      this.form.id = ''
      this.showDialog = true
    },
    handleEdit(row) {
      this.showDialog = true
      this.$nextTick(() => {
        this.isEdit = true
        this.form.id = row.id
        this.form.name = row.post
        this.form.role = row.role.value
      })
    },
    handleDel(row) {
      this.$confirm(`是否确认删除岗位（${row.post}）？`)
        .then(_ => {
          this.loading = true
          deleteJob({ jobId: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: '3000'
              })
              this.getList()
            }
          })
        }).finally(() => {
          this.loading = false
        })
    },
    ensureAddList() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          let ajxj
          const data = {}
          if (this.form.id) {
            data.id = this.form.id
            ajxj = updateJob
          } else {
            ajxj = insertJob
          }
          data.name = this.form.name
          data.permissionPack = this.form.role
          ajxj(data).then(res => {
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
    },
    cancelAddList() {
      // console.log(this.$refs['formRef'])
      // this.$refs['formRef'].resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
