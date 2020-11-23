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
                   plain>
          新增岗位
        </el-button>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="edit(scope.row)">编辑</div>
          <div class="btn"
               style="color:#f56c6c;">删除</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="分配角色"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               :model="form">
        <el-form-item label="角色名称："
                      prop="name"
                      label-width="110px">
          <el-input v-model="form.name"
                    style="width:90%;"
                    placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="选择角色："
                      prop="rule"
                      label-width="110px">
          <el-select v-model="form.rule"
                     style="width:90%;"
                     placeholder="请选择">
            <el-option v-for="item in ruleOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="showDialog = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { } from '@/api/api'

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
      form: {
        name: '',
        rule: ''
      },
      tableColumnList: [
        {
          prop: 'post',
          label: '岗位名称'
        },
        {
          prop: 'role',
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
      ruleOpt: [{
        value: '1',
        label: '普通员工'
      }, {
        value: '2',
        label: '管理员'
      }, {
        value: '3',
        label: '审批员'
      }, {
        value: '4',
        label: '超级管理员'
      }]
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },

  watch: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData = [{
        post: '岗位1',
        role: '普通员工',
        people: 6
      }, {
        post: '岗位2',
        role: '管理员',
        people: 6
      }, {
        post: '业务主管',
        role: '审批员',
        people: 6
      }, {
        post: '行长',
        role: '超级管理员',
        people: 6
      }]
    },
    edit(id) {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
