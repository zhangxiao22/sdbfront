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
      <template v-slot:empNameSlot="props">
        {{ props.row.empCode }}-{{ props.row.empName }}
      </template>
      <template v-slot:agentNameSlot="props">
        {{ props.row.agentCode ? props.row.agentCode + '-' + props.row.agentName : '' }}
      </template>
      <template v-slot:typeSlot="props">
        {{ props.row.type === 1 ? "代办" : "请假" }}
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#f56c6c;"
               @click="handleDeleteButton(scope.row)">删除</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="请假代办"
               :before-close="cancelAdd"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               label-width="130px"
               :model="form">
        <!-- {{ form.empCode }} -->
        <el-form-item label="员工："
                      required
                      prop="empCode"
                      :rules="[{
                        validator: validateMethod
                      }]">
          <el-select v-model="form.empCode"
                     filterable
                     remote
                     clearable
                     placeholder="请输入员工名/员工号"
                     :remote-method="(query)=>remoteMethod(query,'empListOptEmp')"
                     @clear="empListOptEmp=[]"
                     @change="handleChange">
            <el-option v-for="item in empListOptEmp"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="shun-label"
                      :rules="[{required: true, message: '请选择请假时间', trigger: 'blur'
                      }]"
                      prop="dateRange">
          <div slot="label">
            <Info content="请假日期从下周一开始" />
            请假日期：
          </div>
          <el-date-picker v-model="form.dateRange"
                          style="width:300px;"
                          value-format="yyyy-MM-dd"
                          class="item-date"
                          type="daterange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          clearable
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="代办人："
                      prop="agentCode"
                      :rules="[{
                        validator: validateMethod
                      }]">
          <el-select v-model="form.agentCode"
                     filterable
                     remote
                     clearable
                     placeholder="请输入员工名/员工号"
                     :remote-method="(query)=>remoteMethod(query,'empListOptAgent')"
                     @clear="empListOptAgent=[]"
                     @change="handleChange">
            <el-option v-for="item in empListOptAgent"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注："
                      prop="remark">
          <el-input v-model.trim="form.remark"
                    style="width:90%;"
                    type="textarea"
                    :rows="10"
                    resize="none"
                    placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getEmpLeave, addEmpLeave, delEmpLeave, getEmpInCurrentOrg } from '@/api/api'
import { parseTime } from '@/utils'
import moment from 'moment'
import Info from '@/components/Info'

export default {
  name: 'Appoint',
  components: {
    Info,
    ShunTable
  },
  props: {
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const today = moment().format('d')
          const testStartTime = moment().add(7 - today + 1, 'days').format('YYYY-MM-DD')
          const dateTime = parseTime(time, '{y}-{m}-{d}')
          return dateTime < testStartTime
        }
      },
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
        remark: ''
      },
      empListOptOrigin: [],
      empListOptEmp: [],
      empListOptAgent: [],
      searchForm: {
      },
      tableColumnList: [
        {
          prop: 'empName',
          label: '员工',
          slot: true,
          width: 150
        },
        // {
        //   prop: 'orgName',
        //   label: '所属岗位',
        //   minWidth: 200
        // },
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
          slot: true,
          width: 150
        },
        {
          prop: 'type',
          label: '类型',
          slot: true,
          width: 100
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'operate',
          label: '操作',
          fixed: 'right',
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
      this.getEmpListOpt()
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
    getEmpListOpt() {
      getEmpInCurrentOrg().then(res => {
        this.empListOptOrigin = res.data.map(n => {
          return {
            label: n.empCode + '-' + n.empName,
            value: n.empCode
          }
        })
      })
    },
    remoteMethod(query, key) {
      if (query !== '') {
        this[key] = this.empListOptOrigin.filter(n => {
          return n.label.toLowerCase().indexOf(query.toLowerCase()) > -1
        })
      } else {
        this[key] = []
      }
    },
    handleChange() {
      this.$refs.regFormRef.validateField('empCode')
      this.$refs.regFormRef.validateField('agentCode')
    },
    validateMethod(rule, value, callback, source) {
      if (value) {
        if (this.form.agentCode === this.form.empCode) {
          return callback(new Error('员工和代办人不能相同'))
        }
        callback()
      } else {
        if (Object.keys(source)[0] === 'empCode') {
          return callback(new Error('请选择员工'))
        }
        callback()
      }
    },
    resetDialog() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
    },
    handleAddList() {
      this.resetDialog()
      this.showDialog = true
    },
    cancelAdd() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureAdd() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const data = {
            empCode: this.form.empCode,
            agentCode: this.form.agentCode,
            remark: this.form.remark,
            startTime: this.form.dateRange[0],
            endTime: this.form.dateRange[1]
          }
          // console.log(data)
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
        }
      })
    },
    handleDeleteButton(row) {
      this.$confirm(`是否确认删除请假员工（${row.empName || ''}）？`)
        .then(() => {
          this.loading = true
          delEmpLeave({ empCode: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: '3000'
              })
              this.getList(1)
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
</style>
