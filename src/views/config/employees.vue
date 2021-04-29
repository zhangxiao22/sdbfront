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
                        prop="orgCode">
            <el-cascader v-model="filterForm.orgCode"
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
                       placeholder="请选择岗位"
                       clearable>
              <el-option v-for="(item, i) of jobOpt"
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
    </shun-table>
  </div>
</template>
<script>
import ShunTable from '@/components/ShunTable'
import { getAllJob, getAllBranches, getEmployees, getAllBranchList } from '@/api/api'

export default {
  name: 'Employees',
  components: {
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
        orgCode: '',
        jobId: ''
      },
      searchForm: {},
      orgOpt: [],
      jobOpt: [],
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
        }
      ],
      tableData: []
    }
  },
  computed: {
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
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = {
        empName: this.filterForm.empName,
        empCode: this.filterForm.empCode,
        orgCode: this.filterForm.orgCode?.length ? this.filterForm.orgCode[this.filterForm.orgCode.length - 1] : null,
        jobId: this.filterForm.jobId
      }
      // this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    getJobOpt() {
      getAllJob().then(res => {
        this.jobOpt = [{
          label: '未分配',
          value: -1
        }]
        res.data.forEach(n => {
          this.jobOpt.push({
            value: n.id,
            label: n.name
          })
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
        this.orgOpt = this.eachReplaceKey(res.data.orgGraphVOList)
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
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
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
