<template>
  <div class="container">
    <shun-table ref="table"
                title="crm与ods反馈数据的查询列表"
                :loading="loading"
                :page-size.sync="pageSize"
                :is-card="false"
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
          <el-form-item label="日期范围："
                        prop="dateRange">
            <el-date-picker v-model="filterForm.dateRange"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            :picker-options="pickerOptions"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" />
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
      <template v-slot:main-buttons>
        <el-tooltip class="item"
                    effect="dark"
                    content="下载当前搜索结果"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click="downloadAll">
            全部下载
          </el-button>
        </el-tooltip>
      </template>
    </shun-table>
  </div>
</template>

<script>
import { downloadFile } from '@/utils'
import ShunTable from '@/components/ShunTable/index'
import { getRecordPage } from '@/api/api'
import moment from 'moment'
export default {
  name: 'CrmAndOds',
  components: {
    ShunTable
  },
  props: {

  },
  data() {
    return {
      filterForm: {
        dateRange: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchForm: {},
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      // tableColumnList: [{ prop: 'id', label: 'crm执行反馈id' }, { prop: 'clueId', label: 'crm执行反馈线索ID' }, { prop: 'customerId', label: 'crm执行反馈客户号' }, { prop: 'customerName', label: 'crm执行反馈客户名称' }, { prop: 'idCardNo', label: 'crm执行反馈证件号码' }, { prop: 'creditCardNo', label: 'crm执行反馈信用卡卡号' }, { prop: 'orgId', label: 'crm执行反馈网点号' }, { prop: 'orgName', label: 'crm执行反馈网点名称' }, { prop: 'branchId', label: 'crm执行反馈支行号' }, { prop: 'branchName', label: 'crm执行反馈支行名称' }, { prop: 'useCaseId', label: 'crm执行反馈用例号' }, { prop: 'useCaseName', label: 'crm执行反馈用例名称' }, { prop: 'groupId', label: 'crm执行反馈用例客群号' }, { prop: 'groupName', label: 'crm执行反馈用例客群标签' }, { prop: 'isControl', label: 'crm执行反馈是否对照组' }, { prop: 'isDistributed', label: 'crm执行反馈是否下发' }, { prop: 'channelId', label: 'crm执行反馈渠道编号' }, { prop: 'channelName', label: 'crm执行反馈渠道名称' }, { prop: 'batchNo', label: 'crm执行反馈批次' }, { prop: 'uploadTime', label: 'crm执行反馈上传日期' }, { prop: 'activeTime', label: 'crm执行反馈生效日期' }, { prop: 'deActiveTime', label: 'crm执行反馈失效日期' }, { prop: 'isExecuted', label: 'crm执行反馈是否执行客户' }, { prop: 'effectiveExecution', label: 'crm执行反馈是否有效执行客户' }, { prop: 'effectiveExecutionThirtySeconds', label: 'crm执行反馈是否有效执行30秒' }, { prop: 'effectiveExecutionSixtySeconds', label: 'crm执行反馈是否有效执行60秒' }, { prop: 'effectiveExecutionNinetySeconds', label: 'crm执行反馈是否有效执行90秒' }, { prop: 'executionTime', label: 'crm执行反馈执行时间' }, { prop: 'executionCljg.label', label: 'crm执行反馈处理结果' }, { prop: 'subExecuteResultId', label: 'crm执行反馈执行反馈子状态id' }, { prop: 'executionResult', label: 'crm执行反馈处理结果详情' }, { prop: 'executionRemark', label: 'crm执行反馈处理备注' }, { prop: 'executionFollow', label: 'crm执行反馈持续跟进信息' }, { prop: 'successFlag', label: 'crm执行反馈成功销售指标' }, { prop: 'executorId', label: 'crm执行反馈执行人工号' }, { prop: 'executorName', label: 'crm执行反馈执行人姓名' }, { prop: 'executorOrgId', label: 'crm执行反馈执行人网点号' }, { prop: 'executorOrgName', label: 'crm执行反馈执行人网点名称' }, { prop: 'executorBranchId', label: 'crm执行反馈执行人支行号' }, { prop: 'executorBranchName', label: 'crm执行反馈执行人支行名称' }, { prop: 'executorRole', label: 'crm执行反馈执行人岗位' }, { prop: 'isCalled', label: 'crm执行反馈是否通话' }, { prop: 'callingLength', label: 'crm执行反馈通话总时长' }, { prop: 'callingTimes', label: 'crm执行反馈通话次数' }, { prop: 'sendSms', label: 'crm执行反馈短信是否成功发送' }, { prop: 'smsId', label: 'crm执行反馈短信模板id' }, { prop: 'dueAmount', label: 'crm执行反馈到期金额' }, { prop: 'createTime', label: 'crm执行反馈数据日期' }, { prop: 'effectiveChannelId', label: 'crm执行反馈成效渠道编号' }, { prop: 'effectiveChannelName', label: 'crm执行反馈成效渠道名称' }, { prop: 'odsDataDate', label: 'ods执行反馈数据日期' }, { prop: 'odsCustomerId', label: 'ods执行反馈客户号' }, { prop: 'odsCustomerName', label: 'ods执行反馈客户姓名' }, { prop: 'odsIdNum', label: 'ods执行反馈客户号' }, { prop: 'odsPhoneNum', label: 'ods执行反馈电话号码' }, { prop: 'odsCreditCardNum', label: 'ods执行反馈信用卡号' }, { prop: 'odsOutletsId', label: 'ods执行反馈网点号' }, { prop: 'odsOutletsName', label: 'ods执行反馈网点名称' }, { prop: 'odsSubBranchId', label: 'ods执行反馈支行号' }, { prop: 'odsSubBranchName', label: 'ods执行反馈支行名称' }, { prop: 'odsUseCaseId', label: 'ods执行反馈用例号' }, { prop: 'odsUseCaseName', label: 'ods执行反馈用例名称' }, { prop: 'odsUseCaseCustomerId', label: 'ods执行反馈用例客群号' }, { prop: 'odsUseCaseCustomerNum', label: 'ods执行反馈用例客群编号' }, { prop: 'odsGroup', label: 'ods执行反馈组别' }, { prop: 'odsIsDistributionToCustomer', label: 'ods执行反馈是否下发客户' }, { prop: 'odsDistributionChannelId', label: 'ods执行反馈下发渠道编号' }, { prop: 'odsDistributionChannelName', label: 'ods执行反馈ods执行反馈下发渠道名称' }, { prop: 'odsBatch', label: 'ods执行反馈批次' }, { prop: 'odsUploadDate', label: 'ods执行反馈上传日期' }, { prop: 'odsEffectDate', label: 'ods执行反馈生效日期' }, { prop: 'odsInvalidDate', label: 'ods执行反馈失效日期' }, { prop: 'odsIsExecuteCustomer', label: 'ods执行反馈是否执行客户' }, { prop: 'odsIsExecuteCustomerEffect', label: 'ods执行反馈是否有效执行客户' }, { prop: 'odsIsExecuteCustomerEffect30S', label: 'ods执行反馈是否有效执行客户30秒' }, { prop: 'odsIsExecuteCustomerEffect60S', label: 'ods执行反馈是否有效执行客户60秒' }, { prop: 'odsIsExecuteCustomerEffect90S', label: 'ods执行反馈是否有效执行客户90秒' }, { prop: 'odsClueExecuteDate', label: 'ods执行反馈线索执行日期' }, { prop: 'odsCrmProcessResult', label: 'ods执行反馈crm处理结果' }, { prop: 'odsCrmProcessResultDetail', label: 'ods执行反馈处理结果详情' }, { prop: 'odsRemarks', label: 'ods执行反馈备注' }, { prop: 'odsExecutorId', label: 'ods执行反馈执行人工号' }, { prop: 'odsExecutorName', label: 'ods执行反馈执行人姓名' }, { prop: 'odsExecutorOutlet', label: 'ods执行反馈执行人所属网点号' }, { prop: 'odsExecutorOutletName', label: 'ods执行反馈执行人所属网点名称' }, { prop: 'odsExecutorSubBranchId', label: 'ods执行反馈执行人所属支行号' }, { prop: 'odsExecutorSubBranchName', label: 'ods执行反馈执行人所属支行名称' }, { prop: 'odsExecutorJob', label: 'ods执行反馈ods执行反馈' }, { prop: 'odsIsCall', label: 'ods执行反馈执行人岗位' }, { prop: 'odsCallTime', label: 'ods执行反馈通话总时长' }, { prop: 'odsCallCount', label: 'ods执行反馈通话次数' }, { prop: 'odsSmsSendSuccess', label: 'ods执行反馈短信是否发送成功' }, { prop: 'odsAmountDue', label: 'ods执行反馈到期金额' }, { prop: 'odsThreadId', label: 'ods执行反馈线索id' }, { prop: 'odsEffectChannelNumber', label: 'ods执行反馈成效渠道编号' }, { prop: 'odsEffectChannelName', label: 'ods执行反馈成效渠道名称' }, { prop: 'odsUseCaseCustomerLabel', label: 'ods执行反馈用例客群标签' }]
      tableColumnList: [
        { prop: 'odsCustomerId', label: '客户号', width: 120, fixed: 'left' },
        { prop: 'odsCustomerName', label: '客户姓名', width: 100, fixed: 'left' },
        { prop: 'odsPhoneNum', label: '电话号码', width: 120, fixed: 'left' },
        { prop: 'odsEffectDate', label: '生效日期', width: 100, fixed: 'left' },
        { prop: 'odsInvalidDate', label: '失效日期', width: 100, fixed: 'left' },
        { prop: 'odsUseCaseCustomerLabel', label: '客群标签' },
        { prop: 'odsIsExecuteCustomer', label: '是否执行' },
        { prop: 'odsExecutorId', label: '执行人工号', width: 120 },
        { prop: 'odsExecutorName', label: '执行人姓名', width: 100 },
        { prop: 'odsExecutorOutlet', label: '执行人所属网点号', width: 140 },
        { prop: 'odsExecutorOutletName', label: '执行人所属网点名称', width: 150 },
        { prop: 'odsExecutorSubBranchId', label: '执行人所属支行号', width: 140 },
        { prop: 'odsExecutorSubBranchName', label: '执行人所属支行名称', width: 150 },
        { prop: 'odsBmpExecutorId', label: '平台分配执行人工号', width: 150 },
        { prop: 'odsBmpExecutorName', label: '平台分配执行人姓名', width: 150 },
        { prop: 'odsBmpExecutorOutlet', label: '平台分配执行人所属网点号', width: 110 },
        { prop: 'odsBmpExecutorOutletName', label: '平台分配执行人所属网点名称', width: 120 },
        { prop: 'odsBmpExecutorSubBranchId', label: '平台分配执行人所属支行号', width: 110 },
        { prop: 'odsBmpExecutorSubBranchName', label: '平台分配执行人所属支行名称', width: 120 },
        { prop: 'odsUseCaseName', label: '用例名称', minWidth: 180, fixed: 'left' },
        { prop: 'clueExecuteDate', label: '执行时间', width: 100 },
        { prop: 'crmProcessResult', label: '处理状态' },
        { prop: 'odsCrmProcessResultDetail', label: '处理结果详情', width: 110 },
        { prop: 'remarks', label: '处理备注' }]
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },
  watch: {},
  created() {
    this.search()
  },
  methods: {
    search() {
      this.searchForm = {
        dateRange: this.filterForm.dateRange
      }
      this.getList(1)
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.filterForm)
      this.loading = true
      // this.tableData = [{ odsCustomerId: '12345678901', odsUseCaseName: '用例网点分配比例测试2' }]
      getRecordPage(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
      }).finally(() => {
        this.loading = false
      })
    },
    downloadAll() {
      const data = {
        startDate: this.searchForm.dateRange ? this.searchForm.dateRange[0] : null,
        endDate: this.searchForm.dateRange ? this.searchForm.dateRange[1] : null
      }
      downloadFile('/clue/downloadRecord', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
