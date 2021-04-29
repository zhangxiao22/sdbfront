<template>
  <div class="container">
    <shun-table ref="employeesTable"
                title="岗位员工"
                :loading="loading"
                :is-card="false"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="员工姓名："
                        prop="empName">
            <el-input v-model.trim="filterForm.empName"
                      style="width:200px"
                      placeholder="请输入员工姓名"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="员工工号："
                        prop="empCode">
            <el-input v-model.trim="filterForm.empCode"
                      style="width:200px"
                      placeholder="请输入员工工号"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="机构名称："
                        prop="orgId">
            <el-cascader v-model="filterForm.orgId"
                         style="width:300px"
                         filterable
                         :options="orgOpt"
                         :props="{ value: 'value',
                                   label: 'label',
                                   children: 'children'
                         }"
                         placeholder="请选择机构名称"
                         clearable />
          </el-form-item>
          <el-form-item label="岗位："
                        prop="jobId">
            <el-select v-model="filterForm.jobId"
                       style="width:200px"
                       filterable
                       placeholder="请选择岗位"
                       clearable>
              <el-option v-for="(item, i) of changeOpt"
                         :key="i"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleAssign(scope.row)">分配岗位</div>
        </div>
      </template>
    </shun-table>
    <el-dialog title="分配岗位"
               :visible.sync="showDialog"
               @open="dialogOpen">
      <el-form ref="formRef"
               class="shun-label"
               :model="form">
        <el-form-item prop="jobId"
                      label-width="110px">
          <div slot="label">
            <Info content="未选择时表示未分配" />
            选择岗位：
          </div>
          <el-select v-model="form.jobId"
                     placeholder="请选择岗位"
                     clearable
                     filterable
                     style="width:90%;">
            <el-option v-for="(item,i) in jobAssignOpt"
                       :key="i"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAssign">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureAssign">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ShunTable from '@/components/ShunTable'
import { getAllJob, getEmployees, getAllBranchList, occupyJob } from '@/api/api'
import Info from '@/components/Info'

export default {
  name: 'Employees',
  components: {
    Info,
    ShunTable
  },
  props: {
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        // 员工姓名 员工工号 机构名称 岗位名称
        empName: '',
        empCode: '',
        orgId: '',
        jobId: null
      },
      showDialog: false,
      buttonLoading: false,
      form: {
        empCode: '',
        jobId: null
      },
      searchForm: {},
      orgOpt: [],
      jobAssignOpt: [],
      tableColumnList: [
        {
          prop: 'empName',
          label: '员工姓名'
        },
        {
          prop: 'empCode',
          label: '员工工号'
        },
        {
          prop: 'orgName',
          label: '机构名称'
        },
        {
          prop: 'name',
          label: '岗位'
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
    changeOpt() {
      const opt = [{
        label: '未分配',
        value: -1
      }]
      opt.push(...this.jobAssignOpt)
      return opt
    }
  },
  watch: {},
  created() {
  },
  methods: {
    init() {
      this.getJobOpt()
      // this.getBranchOpt()
      this.search()
      this.getBranchListOpt()
      console.log(this.changeOpt)
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    getJobOpt() {
      getAllJob().then(res => {
        this.jobAssignOpt = res.data.map(n => {
          return {
            value: n.id,
            label: n.name
          }
        })
      })
    },
    // getBranchOpt() {
    //   getAllBranches().then(res => {
    //     this.orgOpt = res.data
    //   })
    // },
    getBranchListOpt() {
      getAllBranchList().then(res => {
        this.orgOpt = this.eachReplaceKey(res.data)
      })
    },
    eachReplaceKey(array) {
      const item = []
      array.map(arr => {
        const newData = {}
        newData.label = arr.orgName
        newData.value = arr.orgId
        if (arr.subOrgList && arr.subOrgList.length) {
          newData.children = this.eachReplaceKey(arr.subOrgList)
        }
        item.push(newData)
      })
      return item
    },
    handleAssign(row) {
      this.showDialog = true
      this.$nextTick(() => {
        this.form.empCode = row.empCode
        this.form.jobId = row.jobId
      })
    },
    dialogOpen() {
      this.$refs['formRef'] && this.$refs['formRef'].resetFields()
    },
    cancelAssign() {
      this.showDialog = false
    },
    ensureAssign() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const data = {}
          data.userIdList = [this.form.empCode]
          data.jobId = this.form.jobId === '' ? null : this.form.jobId
          occupyJob(data).then(res => {
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
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign(
        {
          pageNo: this.currentPage,
          pageSize: this.pageSize
        },
        this.searchForm,
        { orgId: this.filterForm.orgId?.length ? this.filterForm.orgId[this.filterForm.orgId.length - 1] : null }
      )
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getEmployees(data).then(res => {
        this.tableData = res.data
        this.total = res.pagination.totalItemCount
        // this.loading = false
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
