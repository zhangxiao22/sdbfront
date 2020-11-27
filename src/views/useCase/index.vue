<template>
  <div class="container">
    <shun-table ref="table"
                title="用例库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :stripe="false"
                :multiple="multiple"
                :table-data="tableData"
                :row-style="rowStyle"
                :table-column-list="tableColumnList"
                @render="getList">
      <!-- <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="用例名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请输入用例名称"
                      clearable
                      prefix-icon="el-icon-search"
                      @keyup.enter.native="search" />
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
      </template> -->
      <template v-slot:main-buttons>
        <el-button v-if="roleJudge.createUseCase"
                   class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="createUseCase">
          新建用例
        </el-button>
      </template>
      <template v-slot:nameSlot="scope">
        <div class="name-group">
          <div class="status"
               :class="{effect:scope.row.effect}">
            {{ scope.row.effect ? '已上线':'已下线' }}
          </div>
          <el-tooltip :content="scope.row.name"
                      placement="top-start">
            <div class="name elip bold">
              {{ scope.row.name }}
            </div>
          </el-tooltip>
        </div>
      </template>
      <template v-slot:caseTargetSlot="scope">
        <template v-if="scope.row.achieveList && scope.row.achieveList.length">
          <div v-for="(item,i) of scope.row.achieveList"
               :key="i">
            {{ item.name }} {{ item.relation.label }} {{ item.value }} {{ item.unit.label }}
          </div>
        </template>
        <div v-else>
          无
        </div>
        <!-- <el-tooltip placement="top-start">
          <div slot="content">
            <div v-for="(item,i) of scope.row.achieveList"
                 :key="i"
                 style="margin:5px 0;">
              {{ item.name }} {{ item.relation.label }} {{ item.value }} {{ item.unit.label }}
            </div>
          </div>
          <div class="hover-text">
            {{ scope.row.achieveList.length }}个目标
          </div>
        </el-tooltip> -->
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleView(scope.row)">查看已有事件</div>

          <el-dropdown trigger="click">
            <span class="el-dropdown-link center-center">
              ...
            </span>
            <el-dropdown-menu slot="dropdown"
                              class="operate-drop">
              <!-- <el-dropdown-item v-if="scope.row.effect">
                <div class="btn"
                     @click="handleCraeteEvent(scope.row)">
                  新建事件
                </div>
              </el-dropdown-item> -->
              <el-dropdown-item v-if="scope.row.canModify">
                <div class="btn"
                     @click="handleEditEvent(scope.row)">
                  编辑
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="false">
                <div class="btn"
                     @click="editOwner(scope.row)">
                  修改归属人
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="roleJudge.editClue">
                <div class="btn"
                     @click="editClue(scope.row)">
                  线索分配
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="btn"
                     :class="{effect:scope.row.effect}"
                     @click="handleChangeStatus(scope.row)">
                  {{ scope.row.effect ? '下线':'上线' }}
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.canDelete">
                <div class="btn"
                     style="color:#f56c6c;"
                     @click="handleDelete(scope.row)">删除</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </shun-table>
    <el-dialog title="修改归属人"
               :before-close="closeOwnerDialog"
               :visible.sync="ownerDialog">
      <el-form ref="regFormRef"
               :model="form">
        <el-form-item label="选择："
                      prop="ownerOpt"
                      label-width="110px">
          <el-select v-model="form.ownerOpt"
                     style="width:90%;"
                     placeholder="请选择">
            <el-option v-for="item in ownerOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeOwnerDialog">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureEditOwner()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="每周线索分配上限设置"
               :before-close="closeClueDialog"
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
        <el-button @click="closeClueDialog">取 消</el-button>
        <el-button type="primary"
                   @click="ensureEditClue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getUseCaseList, delUseCase, changeStatusUseCase, getEventOwner, modifyUseCaseUser, setDistributeLimit } from '@/api/api'
import { MAX_NUMBER } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'UseCase',
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
      // 权限判断
      roleJudge: {},
      buttonLoading: false,
      ownerDialog: false,
      clueDialog: false,
      loading: false,
      MAX_NUMBER,
      // 线索的数据(id,subBranchId)
      clueData: {},
      // 线索分配值
      clueInfo: {
        assignUpper_crm: 0,
        assignUpper_sms: 0
      },
      // 归属人选项
      ownerOpt: [],
      // 归属人的数据(id,subBranchId)
      ownerData: {},
      // 归属人所选值
      form: {
        ownerOpt: []
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: ''
      },
      searchForm: {},
      tableColumnList: [
        {
          prop: 'name',
          label: '状态/用例名称',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'caseTarget',
          label: '目标',
          minWidth: 300,
          notShowOverflowTooltip: true,
          slot: true
        },
        {
          prop: 'modifyTime',
          label: '修改时间',
          width: 180
        },
        {
          prop: 'ownerId',
          label: '归属人',
          width: 100
        },
        {
          prop: 'crmWeekClueLimit',
          label: 'CRM每周线索分发数',
          width: 100
        },
        {
          prop: 'smsWeekClueLimit',
          label: '短信每周线索分发数',
          width: 100
        },
        {
          prop: 'description',
          label: '描述',
          minWidth: 200
        },
        {
          prop: 'operate',
          label: '操作',
          minWidth: 150,
          slot: true,
          fixed: 'right'
        }
      ],
      tableData: [],
      selection: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    },
    getOwnerData() {
      const data = {}
      data.userId = this.form.ownerOpt
      data.id = this.ownerData.id
      data.subBranchId = this.ownerData.subBranchId
      return data
    },
    getClueData() {
      const data = {}
      data.crmWeekClueLimit = this.clueInfo.assignUpper_crm
      data.smsWeekClueLimit = this.clueInfo.assignUpper_sms
      data.id = this.clueData.id
      return data
    },
    ...mapGetters([
      'roles'
    ])
  },

  watch: {
  },
  created() {
    this.search()
    this.getOwner()
    this.roleJudge.createUseCase = this.roles === '用例管理' || this.roles === 'admin'
    this.roleJudge.editClue = this.roles === '线索统筹' || this.roles === 'admin'
  },
  methods: {
    rowStyle({ row, index }) {
      return !row.effect && {
        background: '#f4f4f4'
      }
    },
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
    },
    reset() {
      // this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
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
    // 关闭对话框
    closeOwnerDialog() {
      this.ownerDialog = false
    },
    closeClueDialog() {
      this.clueDialog = false
    },

    // 打开编辑用例归属人窗口
    editOwner(row) {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
      this.ownerDialog = true
      this.ownerData = row
    },
    // 编辑用例归属人
    ensureEditOwner() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          modifyUseCaseUser(this.getOwnerData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
            }
          }).finally(() => {
            this.buttonLoading = false
            this.ownerDialog = false
            this.resetAll()
          })
        }
      })
    },
    // 打开编辑线索分发窗口
    editClue(row) {
      this.$refs['formRef'] && this.$refs['formRef'].resetFields()
      this.clueDialog = true
      this.clueData = row
    },
    // 编辑线索分发
    ensureEditClue() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          setDistributeLimit(this.getClueData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
            }
          }).finally(() => {
            this.buttonLoading = false
            this.clueDialog = false
            this.resetAll()
          })
        }
      })
    },
    // 获取创建人
    getOwner() {
      getEventOwner().then(res => {
        this.ownerOpt = res.data.map(n => {
          return {
            value: n.userId,
            label: n.userName
          }
        })
      })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getUseCaseList(data).then(res => {
        this.tableData = res.data.resultList.map(n => {
          return Object.assign({}, n, {
            showDelet: false,
            ownerId: '张芸琳'
          })
        })
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    createUseCase() {
      this.$router.push({
        path: '/createUseCase'
      })
    },
    handleEditEvent(row) {
      this.$router.push({
        path: '/createUseCase',
        query: { id: row.id }
      })
    },
    handleCraeteEvent(row) {
      this.$router.push({
        path: '/createEvent', query: {
          useid: row.id
        }
      })
    },
    handleChangeStatus(row) {
      this.$confirm(`是否确认【${row.effect ? '下线' : '上线'}】用例（${row.name}）？`)
        .then(_ => {
          const data = {
            id: row.id,
            effect: !row.effect
          }
          changeStatusUseCase(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
              this.resetAll()
            }
          })
        })
        .catch(() => { })
    },

    handleDelete(row) {
      this.$confirm(`是否确认删除用例（${row.name}）？`)
        .then(_ => {
          delUseCase({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
              this.resetAll()
            }
          })
        })
        .catch(() => { })
    },

    handleView(row) {
      this.$router.push({
        path: '/eventBoard', query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .name-group {
    display: flex;
    .status {
      background: #fff;
      border: 1px solid #aaa;
      border-radius: 2px;
      border-radius: 2px;
      height: 22px;
      @include center-center;
      padding: 0 4px;
      color: #aaa;
      margin-right: 5px;
      font-size: 12px;
      &.effect {
        color: #52c41a;
        border: 1px solid #52c41a;
      }
    }
    .name {
      flex: 1;
    }
  }
  .operate-btns {
    .el-dropdown-link {
      font-size: 20px;
      color: $blue;
      cursor: pointer;
    }
  }
}
</style>
