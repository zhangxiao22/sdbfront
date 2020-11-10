<template>
  <!-- 线索优先级 -->
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
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF"
               @click="edit(scope.row)">修改优先级</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="修改优先级"
               :visible.sync="showDialog">
      <el-form :model="form">
        <el-form-item label="选择："
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
        rule: ''
      },
      tableColumnList: [
        {
          prop: 'post',
          label: '用例'
        },
        {
          prop: 'role',
          label: '优先级'
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
        role: '普通员工'
      }, {
        post: '岗位2',
        role: '管理员'
      }, {
        post: '业务主管',
        role: '审批员'
      }, {
        post: '行长',
        role: '超级管理员'
      }]
    },
    edit(id) {
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
