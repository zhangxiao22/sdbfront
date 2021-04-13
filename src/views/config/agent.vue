<template>
  <div class="container">
    <shun-table ref="table"
                title="请假代办"
                :loading="loading"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :is-card="false"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="员工号："
                        prop="empCode">
            <el-input v-model.trim="filterForm.empCode"
                      style="width:200px"
                      placeholder="请输入员工号"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="员工姓名："
                        prop="empName">
            <el-input v-model.trim="filterForm.empName"
                      style="width:200px"
                      placeholder="请输入员工姓名"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="resetAll">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:main-buttons>
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新增
        </el-button>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="btn"
             style="color:#f56c6c;"
             @click="handleDeleteButton(scope.row)">删除</div>
      </template>
      <template v-slot:paramsSlot="props">
        <pre>{{ props.row.params }}</pre>
      </template>
    </shun-table>
    <el-dialog title="请假代办"
               :before-close="cancelAppoint"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               label-width="110px"
               :model="form">
        <el-form-item label="员工名称："
                      :rules="[{
                        required: true, message: '请选择员工姓名', trigger: 'blur'
                      }]"
                      prop="empCode"
                      label-width="110px">
          <el-cascader v-model="form.empCode"
                       style="width:90%"
                       :options="empListOpt"
                       :props="{ multiple: true }"
                       clearable
                       collapse-tags
                       filterable />
        </el-form-item>
        <el-form-item label="请假日期："
                      :rules="[{required: true, message: '请选择员工姓名', trigger: 'blur'
                      }]"
                      prop="dateRange"
                      label-width="110px">
          <el-date-picker v-model="form.dateRange"
                          style="width:300px;"
                          value-format="yyyy-MM-dd"
                          class="item-date"
                          type="daterange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="代办人："
                      :rules="[{
                        required: true, message: '请选择员工姓名', trigger: 'blur'
                      }]"
                      prop="agentCode"
                      label-width="110px">
          <el-cascader v-model="form.agentCode"
                       style="width:90%"
                       :options="empListOpt"
                       :props="{ multiple: true }"
                       clearable
                       collapse-tags
                       filterable />
        </el-form-item>
        <el-form-item label="备注："
                      prop="remarks">
          <el-input v-model.trim="form.remarks"
                    style="width:90%;"
                    type="textarea"
                    :rows="10"
                    resize="none"
                    placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAppoint">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureAppoint">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getEmpLeave, addEmpLeave, delEmpLeave } from '@/api/api'
import { parseTime } from '@/utils'

export default {
  name: 'Appoint',
  components: {
    ShunTable
  },
  props: {
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const testStartTime = parseTime(new Date(), '{y}-{m}-{d}')
          const dateTime = parseTime(time, '{y}-{m}-{d}')
          return dateTime < testStartTime
        }
      },
      participantsOptions: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDialog: false,
      buttonLoading: false,
      filterForm: {
        empName: '',
        empCode: ''
      },
      form: {
        dateRange: [],
        agentCode: '',
        empCode: '',
        remarks: ''
      },
      empListOpt: [
        {
          empName: '张三',
          empCode: 100
        }
      ],
      searchForm: {
      },
      tableColumnList: [
        {
          prop: 'empName',
          label: '员工姓名',
          width: 100
        },
        {
          prop: 'empCode',
          label: '员工号',
          minWidth: 150
        },
        {
          prop: 'org_name',
          label: '原机构',
          minWidth: 200
        },
        {
          prop: 'startTime',
          label: '开始时间',
          width: 150
        },
        {
          prop: 'endTime',
          label: '结束时间',
          width: 150
        },
        {
          prop: 'agentName',
          label: '代办人',
          width: 100
        },
        {
          prop: 'operate',
          label: '操作',
          slot: true
        }
      ],
      tableData: []
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
      this.search()
    },
    resetAll() {
      this.reset()
      // this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    eachReplaceKey(array) {
      const item = []
      array.map(arr => {
        const newData = {}
        newData.label = arr.org_name
        newData.value = arr.org_code
        if (arr.Children) {
          newData.children = this.eachReplaceKey(arr.Children)
        }
        item.push(newData)
      })
      return item
    },
    handleAddList() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
      this.showDialog = true
    },
    cancelAppoint() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureAppoint() {
      this.buttonLoading = true
      const data = {
        empCode: this.form.empCode,
        orgCodes: this.form.orgCodes.map(n => n[1]).join(',')
      }
      addEmpLeave(data).then(res => {
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
    },
    handleDeleteButton(row) {
      this.$confirm(`是否确认删除请假员工（${row.empName}）？`)
        .then(() => {
          this.loading = true
          delEmpLeave({ empCode: row.empCode }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: '3000'
              })
              this.getList()
            }
          }).finally(() => {
            this.loading = false
          })
        })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.loading = true
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      getEmpLeave(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .btn {
    cursor: pointer;
  }
}
</style>
