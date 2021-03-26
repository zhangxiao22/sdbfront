<template>
  <div class="container">
    <shun-table ref="table"
                title="理顾指派"
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
          <el-form-item label="角色："
                        prop="roleCode">
            <el-select v-model="filterForm.roleCode"
                       style="width:200px;"
                       disabled
                       placeholder="请选择">
              <el-option v-for="item in roleOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="员工号/员工姓名："
                        prop="empCode">
            <el-input v-model.trim="filterForm.empCode"
                      style="width:200px"
                      placeholder="请输入员工号/员工姓名"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <!-- <el-form-item label="机构："
                        prop="orgCode">
            <el-cascader v-model="filterForm.orgCode"
                         style="width:300px"
                         :options="allBranchOpt"
                         :props="{ value: 'org_code',
                                   label: 'org_name',
                                   children: 'Children',checkStrictly: true,multiple: true }"
                         clearable />
          </el-form-item> -->
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
      <template v-slot:operateSlot="scope">
        <div class="btn"
             style="color:#1890FF;"
             @click="handleAppointButton(scope.row)">指派</div>
      </template>
      <template v-slot:paramsSlot="props">
        <pre>{{ props.row.params }}</pre>
      </template>
    </shun-table>
    <el-dialog title="网点指定"
               :before-close="cancelAppoint"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               label-width="110px"
               :model="form">
        <el-form-item label="请选择网点："
                      prop="orgCodes"
                      label-width="110px">
          <el-cascader v-model="form.orgCodes"
                       style="width:300px"
                       :options="allBranchOpt"
                       :props="{ multiple: true }"
                       clearable
                       filterable />
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
import { getAppointList, appointEmp, getAllBranches } from '@/api/api'

export default {
  name: 'Appoint',

  components: {
    ShunTable
  },
  props: {
  },
  data() {
    return {
      participantsOptions: [],
      loading: false,
      currentPage: 2,
      pageSize: 10,
      total: 0,
      showDialog: false,
      buttonLoading: false,
      filterForm: {
        roleCode: 'CRM_R_BRNC_FIN_ADVISOR',
        empCode: ''
      },
      form: {
        empCode: '',
        orgCodes: []
      },
      roleOpt: [
        {
          label: '理财顾问',
          value: 'CRM_R_BRNC_FIN_ADVISOR'
        }
      ],
      allBranchOpt: [],
      searchForm: {
      },
      tableColumnList: [
        {
          prop: 'emp_code',
          label: '员工号',
          minWidth: 150
        },
        {
          prop: 'emp_name',
          label: '员工姓名',
          width: 100
        },
        {
          prop: 'org_name',
          label: '原机构',
          minWidth: 200
        },
        {
          prop: 'org',
          label: '网点',
          minWidth: 200
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
      this.getBranches()
      this.search()
    },
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
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
    // 获取支行网点列表
    getBranches() {
      return new Promise((resolve) => {
        getAllBranches().then(res => {
          this.allBranchOpt = this.eachReplaceKey(res.data)
          resolve()
        })
      })
    },
    cancelAppoint() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    handleAppointButton(row) {
      this.showDialog = true
      this.$nextTick(() => {
        this.form.empCode = row.emp_code
        this.form.orgCodes = row.org_code
      })
    },
    ensureAppoint() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const arr = []
          if (this.form.orgCodes) {
            for (let i = 0; i < this.form.orgCodes.length; i++) {
              arr.push(this.form.orgCodes[i][1])
            }
          }
          const data = {
            empCode: this.form.empCode,
            orgCodes: arr.join(',')
          }
          console.log('data', this.form.orgCodes)
          appointEmp(data).then(res => {
            this.buttonLoading = false
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showDialog = false
              this.resetAll()
            }
          }).catch(() => {
            this.buttonLoading = false
          })
        }
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
      getAppointList(data).then(res => {
        this.tableData = res.data.resultList.map((n) => {
          return Object.assign({}, n, {
            org: n.assign_orgs?.map((k) => {
              return k.orgCode
            }).join(',')
          })
        })
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
