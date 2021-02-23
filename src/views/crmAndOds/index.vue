<template>
  <div class="container">
    <shun-table ref="table"
                title="crm与ods反馈数据的查询列表"
                :loading="loading"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList" />
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { getRecordPage } from '@/api/api'
export default {
  name: 'CrmAndOds',
  components: {
    ShunTable
  },
  props: {

  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      tableColumnList: [{ prop: 'id', label: 'crm执行反馈id' }, { prop: 'clueId', label: 'crm执行反馈线索ID' }, { prop: 'customerId', label: 'crm执行反馈客户号' }, { prop: 'customerName', label: 'crm执行反馈客户名称' }, { prop: 'idCardNo', label: 'crm执行反馈证件号码' }, { prop: 'creditCardNo', label: 'crm执行反馈信用卡卡号' }, { prop: 'orgId', label: 'crm执行反馈网点号' }, { prop: 'orgName', label: 'crm执行反馈网点名称' }, { prop: 'branchId', label: 'crm执行反馈支行号' }, { prop: 'branchName', label: 'crm执行反馈支行名称' }, { prop: 'useCaseId', label: 'crm执行反馈用例号' }, { prop: 'useCaseName', label: 'crm执行反馈用例名称' }, { prop: 'groupId', label: 'crm执行反馈用例客群号' }, { prop: 'groupName', label: 'crm执行反馈用例客群标签' }, { prop: 'isControl', label: 'crm执行反馈是否对照组' }, { prop: 'isDistributed', label: 'crm执行反馈是否下发' }, { prop: 'channelId', label: 'crm执行反馈渠道编号' }, { prop: 'channelName', label: 'crm执行反馈渠道名称' }, { prop: 'batchNo', label: 'crm执行反馈批次' }, { prop: 'uploadTime', label: 'crm执行反馈上传日期' }, { prop: 'activeTime', label: 'crm执行反馈生效日期' }, { prop: 'deActiveTime', label: 'crm执行反馈失效日期' }, { prop: 'isExecuted', label: 'crm执行反馈是否执行客户' }, { prop: 'effectiveExecution', label: 'crm执行反馈是否有效执行客户' }, { prop: 'effectiveExecutionThirtySeconds', label: 'crm执行反馈是否有效执行30秒' }, { prop: 'effectiveExecutionSixtySeconds', label: 'crm执行反馈是否有效执行60秒' }, { prop: 'effectiveExecutionNinetySeconds', label: 'crm执行反馈是否有效执行90秒' }, { prop: 'executionTime', label: 'crm执行反馈执行时间' }, { prop: 'executionCljg.label', label: 'crm执行反馈处理结果' }, { prop: 'subExecuteResultId', label: 'crm执行反馈执行反馈子状态id' }, { prop: 'executionResult', label: 'crm执行反馈处理结果详情' }, { prop: 'executionRemark', label: 'crm执行反馈处理备注' }, { prop: 'executionFollow', label: 'crm执行反馈持续跟进信息' }, { prop: 'successFlag', label: 'crm执行反馈成功销售指标' }, { prop: 'executorId', label: 'crm执行反馈执行人工号' }, { prop: 'executorName', label: 'crm执行反馈执行人姓名' }, { prop: 'executorOrgId', label: 'crm执行反馈执行人网点号' }, { prop: 'executorOrgName', label: 'crm执行反馈执行人网点名称' }, { prop: 'executorBranchId', label: 'crm执行反馈执行人支行号' }, { prop: 'executorBranchName', label: 'crm执行反馈执行人支行名称' }, { prop: 'executorRole', label: 'crm执行反馈执行人岗位' }, { prop: 'isCalled', label: 'crm执行反馈是否通话' }, { prop: 'callingLength', label: 'crm执行反馈通话总时长' }, { prop: 'callingTimes', label: 'crm执行反馈通话次数' }, { prop: 'sendSms', label: 'crm执行反馈短信是否成功发送' }, { prop: 'smsId', label: 'crm执行反馈短信模板id' }, { prop: 'dueAmount', label: 'crm执行反馈到期金额' }, { prop: 'createTime', label: 'crm执行反馈数据日期' }, { prop: 'effectiveChannelId', label: 'crm执行反馈成效渠道编号' }, { prop: 'effectiveChannelName', label: 'crm执行反馈成效渠道名称' }, { prop: 'odsDataDate', label: 'ods执行反馈数据日期' }, { prop: 'odsCustomerId', label: 'ods执行反馈客户号' }, { prop: 'odsCustomerName', label: 'ods执行反馈客户姓名' }, { prop: 'odsIdNum', label: 'ods执行反馈客户号' }, { prop: 'odsPhoneNum', label: 'ods执行反馈电话号码' }, { prop: 'odsCreditCardNum', label: 'ods执行反馈信用卡号' }, { prop: 'odsOutletsId', label: 'ods执行反馈网点号' }, { prop: 'odsOutletsName', label: 'ods执行反馈网点名称' }, { prop: 'odsSubBranchId', label: 'ods执行反馈支行号' }, { prop: 'odsSubBranchName', label: 'ods执行反馈支行名称' }, { prop: 'odsUseCaseId', label: 'ods执行反馈用例号' }, { prop: 'odsUseCaseName', label: 'ods执行反馈用例名称' }, { prop: 'odsUseCaseCustomerId', label: 'ods执行反馈用例客群号' }, { prop: 'odsUseCaseCustomerNum', label: 'ods执行反馈用例客群编号' }, { prop: 'odsGroup', label: 'ods执行反馈组别' }, { prop: 'odsIsDistributionToCustomer', label: 'ods执行反馈是否下发客户' }, { prop: 'odsDistributionChannelId', label: 'ods执行反馈下发渠道编号' }, { prop: 'odsDistributionChannelName', label: 'ods执行反馈ods执行反馈下发渠道名称' }, { prop: 'odsBatch', label: 'ods执行反馈批次' }, { prop: 'odsUploadDate', label: 'ods执行反馈上传日期' }, { prop: 'odsEffectDate', label: 'ods执行反馈生效日期' }, { prop: 'odsInvalidDate', label: 'ods执行反馈失效日期' }, { prop: 'odsIsExecuteCustomer', label: 'ods执行反馈是否执行客户' }, { prop: 'odsIsExecuteCustomerEffect', label: 'ods执行反馈是否有效执行客户' }, { prop: 'odsIsExecuteCustomerEffect30S', label: 'ods执行反馈是否有效执行客户30秒' }, { prop: 'odsIsExecuteCustomerEffect60S', label: 'ods执行反馈是否有效执行客户60秒' }, { prop: 'odsIsExecuteCustomerEffect90S', label: 'ods执行反馈是否有效执行客户90秒' }, { prop: 'odsClueExecuteDate', label: 'ods执行反馈线索执行日期' }, { prop: 'odsCrmProcessResult', label: 'ods执行反馈crm处理结果' }, { prop: 'odsCrmProcessResultDetail', label: 'ods执行反馈处理结果详情' }, { prop: 'odsRemarks', label: 'ods执行反馈备注' }, { prop: 'odsExecutorId', label: 'ods执行反馈执行人工号' }, { prop: 'odsExecutorName', label: 'ods执行反馈执行人姓名' }, { prop: 'odsExecutorOutlet', label: 'ods执行反馈执行人所属网点号' }, { prop: 'odsExecutorOutletName', label: 'ods执行反馈执行人所属网点名称' }, { prop: 'odsExecutorSubBranchId', label: 'ods执行反馈执行人所属支行号' }, { prop: 'odsExecutorSubBranchName', label: 'ods执行反馈执行人所属支行名称' }, { prop: 'odsExecutorJob', label: 'ods执行反馈ods执行反馈' }, { prop: 'odsIsCall', label: 'ods执行反馈执行人岗位' }, { prop: 'odsCallTime', label: 'ods执行反馈通话总时长' }, { prop: 'odsCallCount', label: 'ods执行反馈通话次数' }, { prop: 'odsSmsSendSuccess', label: 'ods执行反馈短信是否发送成功' }, { prop: 'odsAmountDue', label: 'ods执行反馈到期金额' }, { prop: 'odsThreadId', label: 'ods执行反馈线索id' }, { prop: 'odsEffectChannelNumber', label: 'ods执行反馈成效渠道编号' }, { prop: 'odsEffectChannelName', label: 'ods执行反馈成效渠道名称' }, { prop: 'odsUseCaseCustomerLabel', label: 'ods执行反馈用例客群标签' }]
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
      this.getList(1)
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      })
      this.loading = true
      getRecordPage(data).then(res => {
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
}
</style>
