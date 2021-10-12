<template>
  <div class="container">
    <!-- 顶栏 -->
    <div v-loading="baseInfoLoading"
         class="base-info">
      <template v-for="(item,i) of baseInfo">
        <div v-if="item.name !== '全体客户户均AUM增量' && item.name !== '成功客户户均AUM增量'"
             :key="i"
             class="item-box">
          <div class="item-inner shun-card">
            <div class="label">
              <!-- <svg-icon class="main-icon"
                      :icon-class="item.icon" /> -->
              <i class="el-icon-s-data main-icon" />{{ item.name }}
              <template v-if="item.name === '全体客户AUM增量' || item.name === '成功客户AUM增量'">
                <pre> / </pre><i class="el-icon-s-data main-icon" />{{ baseInfo[i+1].name }}
              </template>
            </div>
            <div class="value">
              <template v-if="item.unit === '%'">
                {{ percentFormatter(null, null, item.value).slice(0, -1) }}
              </template>
              <template v-else-if="item.unit === '万元'">
                {{ formatTenThousand(item.value) }}
              </template>
              <template v-else>
                {{ item.value | formatMoney }}
              </template>
              <template v-if="item.name === '全体客户AUM增量' || item.name === '成功客户AUM增量'">
                / {{ formatTenThousand(baseInfo[i+1].value) }}
              </template>
              <div class="unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 督导总览 -->
    <ShunTable ref="overviewRef"
               title="督导总览"
               :loading="overview.loading"
               :current-page.sync="overview.currentPage"
               :page-size.sync="overview.pageSize"
               :total="overview.total"
               :table-data="overview.tableData"
               :table-column-list="overview.tableColumnList"
               class="block"
               @render="overviewGetList"
               @sort-change="handleOverviewSortChange">
      <template v-slot:filter>
        <el-form ref="overviewFilterRef"
                 :inline="true"
                 :model="overview.filterForm"
                 class="filter-container">
          <el-form-item label="渠道："
                        prop="channel">
            <el-select v-model.trim="overview.filterForm.channel"
                       placeholder="请选择渠道"
                       clearable
                       style="width: 200px">
              <el-option v-for="item of channelList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="用例类型："
                        prop="category">
            <el-select v-model.trim="overview.filterForm.category"
                       placeholder="请选择用例类型"
                       clearable
                       style="width: 200px">
              <el-option v-for="item of categoryList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="营销用例："
                        prop="useCase">
            <el-select v-model.trim="overview.filterForm.useCase"
                       placeholder="请选择营销用例"
                       clearable
                       multiple
                       collapse-tags
                       :loading="overview.useCaseLoading"
                       style="width: 200px"
                       @clear="handleOverviewUseCaseClear"
                       @visible-change="handleOverviewUseCaseVisibleChange">
              <el-option v-for="item of useCaseList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="营销事件："
                        prop="event">
            <el-select v-model.trim="overview.filterForm.event"
                       placeholder="请选择营销事件"
                       clearable
                       multiple
                       collapse-tags
                       style="width: 200px">
              <el-option v-for="item of eventList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="周数："
                        prop="week">
            <el-select v-model.trim="overview.filterForm.week"
                       placeholder="请选择周数"
                       clearable
                       style="width: 200px">
              <el-option v-for="item of weekList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="批次："
                        prop="batch">
            <el-select v-model.trim="overview.filterForm.batch"
                       placeholder="请选择批次"
                       clearable
                       multiple
                       :multiple-limit="4"
                       collapse-tags
                       :loading="overview.batchLoading"
                       style="width: 200px"
                       @clear="handleOverviewBatchClear"
                       @visible-change="handleOverviewBatchVisibleChange">
              <el-option v-for="item of batchList"
                         :key="item"
                         :label="item"
                         :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围："
                        prop="dateRange">
            <el-date-picker v-model="overview.filterForm.dateRange"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            style="width: 300px" />
          </el-form-item>
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="overviewSearch">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="overviewReset">
              重置
            </el-button>
            <el-tooltip content="下载为Excel"
                        placement="top">
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-download"
                         circle
                         plain
                         :loading="overview.downloadLoading"
                         @click="handleOverviewDownload" />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:aumIncreaseAllSlot="{row}">
        {{ formatTenThousand(row.aumIncreaseAll) }} / {{ formatTenThousand(row.aumAverageAll) }}
      </template>
      <template v-slot:aumIncreaseSlot="{row}">
        {{ formatTenThousand(row.aumIncrease) }} / {{ formatTenThousand(row.aumAverage) }}
      </template>
    </ShunTable>
    <div class="block"
         style="display:flex; justify-content: center;">
      <el-button type="primary"
                 icon="el-icon-document-checked"
                 style="width: 400px;"
                 @click="generate">
        生成详细督导数据
      </el-button>
    </div>
    <div v-if="showExtra"
         id="scroll-content">
      <!-- 执行情况 -->
      <div class="block shun-card">
        <div class="head">
          <div class="title">
            各支行的执行情况
            <el-tooltip content="下载为Excel"
                        placement="top">
              <el-button size="mini"
                         type="primary"
                         circle
                         plain
                         icon="el-icon-download"
                         class="download"
                         :loading="executeStatus.downloadLoading"
                         @click="handleExecuteStatusDownload" />
            </el-tooltip>
          </div>
          <el-select v-model.trim="executeStatus.batch"
                     placeholder="请选择批次"
                     @change="handleExecuteStatusBatchChange">
            <el-option v-for="item of executeStatus.singleBatchList"
                       :key="item"
                       :label="item"
                       :value="item" />
          </el-select>
        </div>
        <div class="content">
          <el-table ref="executeStatusRef"
                    v-loading="executeStatus.loading"
                    :data="executeStatus.tableData">
            <template v-for="(item, i) of executeStatus.tableColumnList">
              <el-table-column v-if="item.slot"
                               :key="i"
                               :prop="item.prop"
                               :label="item.label"
                               :sortable="item.sortable"
                               :formatter="item.formatter"
                               :width="item.width">
                <template slot-scope="scope">
                  {{ item.keys.map(n => formatTenThousand(scope.row[n])).join(' / ') }}
                </template>
              </el-table-column>
              <el-table-column v-else
                               :key="i"
                               :prop="item.prop"
                               :label="item.label"
                               :sortable="item.sortable"
                               :formatter="item.formatter"
                               :width="item.width" />
            </template>
            <!-- <el-table-column prop="aumIncreaseAll"
                             label="全体客户AUM增量/全体客户户均AUM增量(元)"
                             :sortable="true" />
            <el-table-column prop="aumIncrease"
                             label="成功客户AUM增量/成功客户户均AUM增量(元)"
                             :sortable="true" /> -->
          </el-table>
        </div>
      </div>
      <!-- 综合排名 -->
      <div class="block1">
        <div class="left shun-card">
          <div class="head">
            <div class="title">
              网点综合排名
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button size="mini"
                           type="primary"
                           circle
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="ranking.org.downloadLoading"
                           @click="handleOutletRankingDownload" />
              </el-tooltip>
            </div>
            <el-radio-group v-model="ranking.org.scope"
                            size="mini"
                            @change="handleOutletRankingChange">
              <el-radio-button label="前20名" />
              <el-radio-button label="查看全部" />
              <el-radio-button label="后20名" />
            </el-radio-group>
          </div>
          <div class="content">
            <el-table ref="orgRankingRef"
                      v-loading="ranking.org.loading"
                      :data="ranking.org.tableData">
              <el-table-column v-for="({prop, label, formatter}, i) of ranking.org.tableColumnList"
                               :key="i"
                               :prop="prop"
                               :label="label"
                               :formatter="formatter" />
            </el-table>
            <el-pagination v-if="ranking.org.showPagination"
                           :current-page="ranking.org.currentPage"
                           :page-size="ranking.org.pageSize"
                           :total="ranking.org.total"
                           :pager-count="5"
                           small
                           hide-on-single-page
                           background
                           style="padding:15px 15px 0;text-align:right;"
                           layout="total, prev, pager, next"
                           @current-change="handleOutletRankingCurrentChange" />
          </div>
        </div>
        <div class="right shun-card">
          <div class="head">
            <div class="title">
              营销人员综合排名
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button size="mini"
                           type="primary"
                           circle
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="ranking.people.downloadLoading"
                           @click="handlePeopleRankingDownload" />
              </el-tooltip>
            </div>
            <el-radio-group v-model="ranking.people.scope"
                            size="mini"
                            @change="handlePeopleRankingChange">
              <el-radio-button label="前20名" />
              <el-radio-button label="查看全部" />
              <el-radio-button label="后20名" />
            </el-radio-group>
          </div>
          <div class="content">
            <el-table ref="peopleRankingRef"
                      v-loading="ranking.people.loading"
                      :data="ranking.people.tableData">
              <el-table-column v-for="({prop, label, formatter}, i) of ranking.people.tableColumnList"
                               :key="i"
                               :prop="prop"
                               :label="label"
                               :formatter="formatter" />
            </el-table>
            <el-pagination v-if="ranking.people.showPagination"
                           :current-page="ranking.people.currentPage"
                           :page-size="ranking.people.pageSize"
                           :total="ranking.people.total"
                           :pager-count="5"
                           small
                           hide-on-single-page
                           background
                           style="padding:15px 15px 0;text-align:right;"
                           layout="total, prev, pager, next"
                           @current-change="handlePeopleRankingCurrentChange" />
          </div>
        </div>
      </div>
      <!-- 督导数据趋势对比 -->
      <div class="block block-title">督导数据趋势对比</div>
      <div class="block shun-card">
        <div class="head">
          <el-form ref="keyIndicatorFilterRef"
                   :inline="true"
                   :model="keyIndicator.filterForm"
                   class="filter">
            <el-form-item label="营销用例："
                          prop="useCase">
              <el-select v-model="keyIndicator.filterForm.useCase"
                         multiple
                         collapse-tags
                         clearable>
                <el-option v-for="item of childUseCaseOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="批次："
                          prop="batch">
              <el-select v-model="keyIndicator.filterForm.batch"
                         multiple
                         :multiple-limit="4"
                         clearable
                         collapse-tags>
                <el-option v-for="item of childBatchOpt"
                           :key="item"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期范围："
                          prop="useCase">
              <el-date-picker v-model="keyIndicator.filterForm.dateRange"
                              clearable
                              value-format="yyyy-MM-dd"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions" />
            </el-form-item>
            <el-form-item class="filter-end">
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="keyIndicatorSearch">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh"
                         @click="keyIndicatorReset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="content">
          <div class="item">
            <div class="item-head">
              <div class="chart-title">
                各支行用例关键指标趋势表现
                <el-tooltip content="下载为Excel"
                            placement="top">
                  <el-button size="mini"
                             type="primary"
                             circle
                             plain
                             icon="el-icon-download"
                             class="download"
                             :loading="keyIndicator.chart1DownloadLoading"
                             @click="handleChart1Download" />
                </el-tooltip>
              </div>
              <el-radio-group v-model="keyIndicator.rate"
                              size="mini">
                <el-radio-button label="实际购买率" />
                <el-radio-button label="执行率" />
                <el-radio-button label="联络成功率" />
              </el-radio-group>
            </div>
            <LineChart id="chart-1"
                       :data="realChart1Data" />
          </div>
          <div class="item">
            <div class="chart-title">
              各支行成功执行率
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button size="mini"
                           type="primary"
                           circle
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="keyIndicator.chart2DownloadLoading"
                           @click="handleChart2Download" />
              </el-tooltip>
            </div>
            <BarChart id="chart-2"
                      :data="realChart2Data" />
          </div>
          <div class="item">
            <div class="item-head">
              <div class="chart-title">
                意向购买产品/预约网点见面 - 成功占比与比上批情况
                <el-tooltip content="下载为Excel"
                            placement="top">
                  <el-button size="mini"
                             type="primary"
                             circle
                             plain
                             icon="el-icon-download"
                             class="download"
                             :loading="keyIndicator.chart3DownloadLoading"
                             @click="handleChart3Download" />
                </el-tooltip>
              </div>
              <div class="chart-filter">
                <el-radio-group v-model="keyIndicator.compareToLastBatchType"
                                size="mini"
                                style="margin-right: 20px;">
                  <el-radio-button label="意向购买产品" />
                  <el-radio-button label="预约网点见面" />
                </el-radio-group>
                <el-select v-model="keyIndicator.batch"
                           placeholder="请选择批次"
                           @change="handleKeyIndicatorBatchChange">
                  <el-option v-for="item of keyIndicator.singleBatchList"
                             :key="item"
                             :label="item"
                             :value="item" />
                </el-select>
              </div>
            </div>
            <StackDodgeBarChart id="chart-3"
                                :data="realChart3Data" />
          </div>
        </div>
      </div>
      <!-- 用例各支行督导看板 -->
      <div class="block block-title">用例各支行督导看板</div>
      <div class="block shun-card">
        <div class="head">
          <el-form ref="orgFilterRef"
                   :inline="true"
                   :model="org.filterForm"
                   class="filter">
            <el-form-item label="用例："
                          prop="useCase">
              <el-select v-model="org.filterForm.useCase"
                         multiple
                         collapse-tags
                         clearable>
                <el-option v-for="item of childUseCaseOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="批次："
                          prop="batch">
              <el-select v-model="org.filterForm.batch"
                         clearable>
                <el-option v-for="item of childBatchOpt"
                           :key="item"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期范围："
                          prop="useCase">
              <el-date-picker v-model="org.filterForm.dateRange"
                              clearable
                              value-format="yyyy-MM-dd"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions" />
            </el-form-item>
            <el-form-item label="客群类型："
                          prop="customerGroup">
              <el-select v-model="org.filterForm.customerGroup"
                         clearable>
                <el-option v-for="(item, i) of customerGroupList"
                           :key="i"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item class="filter-end">
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="orgSearch">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh"
                         @click="orgReset">
                重置
              </el-button>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button size="mini"
                           type="primary"
                           icon="el-icon-download"
                           circle
                           plain
                           :loading="org.downloadLoading"
                           @click="handleOrgDownload" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div class="content">
          <el-table ref="orgTableRef1"
                    v-loading="org.tableLoading1"
                    :data="org.tableData1"
                    :span-method="orgTableSpanMethod1"
                    class="item">
            <el-table-column prop="useCaseName"
                             label="用例名称"
                             align="center" />
            <el-table-column prop="type"
                             label="类别"
                             align="center" />
            <el-table-column label="销售金额(元)"
                             align="center">
              <el-table-column prop="purchasedAmount"
                               label="总销售金额"
                               align="center" />
              <el-table-column prop="fixedTimeDeposit"
                               label="定期"
                               align="center" />
              <el-table-column prop="selfSupportManagement"
                               label="自营理财"
                               align="center" />
              <el-table-column prop="AgencyManagement"
                               label="代理理财(基金+保险)"
                               align="center" />
              <el-table-column prop="else"
                               label="其他"
                               align="center" />
            </el-table-column>
          </el-table>
          <el-table ref="orgTableRef2"
                    v-loading="org.tableLoading2"
                    :data="org.tableData2"
                    class="item">
            <el-table-column prop="useCaseName"
                             label="用例名称"
                             align="center" />
            <el-table-column prop="type"
                             label="类别"
                             align="center" />
            <el-table-column label="资金流向(元)"
                             align="center">
              <el-table-column prop="netInflow"
                               label="净流入"
                               align="center" />
              <el-table-column prop="totalOutflow"
                               label="总流出"
                               align="center" />
              <el-table-column prop="sameTradeSameNameOutflow"
                               label="同业同名流出"
                               align="center" />
              <el-table-column prop="sameTradeDifferentNameOutflow"
                               label="同业异名流出"
                               align="center" />
              <el-table-column prop="intraBankTransferOut"
                               label="行内转账流出"
                               align="center" />
              <el-table-column prop="thirdPartyConsumption"
                               label="第三方消费"
                               align="center" />
              <el-table-column prop="POSConsumption"
                               label="POS消费"
                               align="center" />
              <el-table-column prop="mobileBankPurchase"
                               label="手银购买"
                               align="center" />
              <el-table-column prop="repayment"
                               label="还款"
                               align="center" />
              <el-table-column prop="else"
                               label="其他"
                               align="center" />
            </el-table-column>
          </el-table>
          <el-table ref="orgTableRef3"
                    v-loading="org.tableLoading3"
                    :data="org.tableData3"
                    class="item"
                    border>
            <el-table-column v-for="({prop, label, formatter}, i) of org.tableColumnList3"
                             :key="i"
                             :prop="prop"
                             :label="label"
                             :formatter="formatter"
                             align="center" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { mapGetters } from 'vuex'
import { LineChart, BarChart, StackDodgeBarChart } from './components'
import {
  getBatchList,
  getUseCaseListByBatchList,
  getUseCaseType,
  inspectorOverview,
  getInspectorOverviewList,
  getExecuteStatusList,
  getOutletRankingList,
  getPeopleRankingList,
  getCustomerGroupList,
  getUseCaseKeyIndicatorList,
  getOutletExecuteRateList,
  getIntentToBuySuccessRate,
  getUseCaseSalesAmount,
  getInspectorSummary
} from '@/api/api'
import { formatPercent, formatTenThousand, downloadFilePost } from '@/utils'

export default {
  name: 'InspectorBoard',
  components: {
    ShunTable,
    LineChart,
    BarChart,
    StackDodgeBarChart
  },
  data() {
    const tenThousandFormatter = (row, column, cellValue, index) => {
      return formatTenThousand(cellValue)
    }
    return {
      formatPercent,
      formatTenThousand,
      // 更多图表显示
      showExtra: false,
      // 顶栏
      baseInfoLoading: false,
      baseInfo: [{
        name: '线索数量',
        icon: '',
        value: 0,
        unit: '条'
      }, {
        name: '销售成功数量',
        icon: '',
        value: 0
        // unit: '元'
      }, {
        name: '成功购买率',
        icon: '',
        value: 0,
        unit: '%'
      }, {
        name: '全体客户AUM增量',
        icon: '',
        value: 0,
        unit: '万元'
      }, {
        name: '全体客户户均AUM增量',
        icon: '',
        value: 0,
        unit: '万元'
      }, {
        name: '成功客户AUM增量',
        icon: '',
        value: 0,
        unit: '万元'
      }, {
        name: '成功客户户均AUM增量',
        icon: '',
        value: 0,
        unit: '万元'
      }],
      // 总览
      overview: {
        loading: false,
        useCaseLoading: false,
        batchLoading: false,
        downloadLoading: false,
        filterForm: {
          useCase: [],
          event: [],
          week: '',
          batch: [],
          dateRange: [],
          channel: '',
          category: ''
        },
        searchForm: {},
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableSort: {},
        tableData: [],
        tableColumnList: [{
          prop: 'useCaseName',
          label: '用例名称'
        }, {
          prop: 'channel',
          label: '渠道'
        }, {
          prop: 'category',
          label: '类型'
        }, {
          prop: 'clueAmount',
          label: '线索数量'
        }, {
          prop: 'successfulSalesCount',
          label: '销售成功数量'
        }, {
          prop: 'purchaseRate',
          label: '购买成功率(%)',
          formatter: this.percentFormatter,
          sortable: 'custom'
        }, {
          prop: 'salesAmount',
          label: '销售金额(万元)',
          sortable: 'custom',
          formatter: tenThousandFormatter
        }, {
          prop: 'aumIncreaseAll',
          label: '全体客户AUM增量/全体客户户均AUM增量(万元)',
          slot: true,
          sortable: 'custom'
        }, {
          prop: 'aumIncrease',
          label: '成功客户AUM增量/成功客户户均AUM增量(万元)',
          slot: true,
          sortable: 'custom'
        }]
      },
      // 执行情况
      executeStatus: {
        loading: false,
        downloadLoading: false,
        batch: '',
        // 单选批次选项
        singleBatchList: [],
        tableData: [],
        tableColumnList: [{
          prop: 'purchaseRateRanking',
          label: '实际购买率排名'
        }, {
          prop: 'org',
          label: '支行'
        }, {
          prop: 'clueAmount',
          label: '线索数量'
        }, {
          prop: 'execRate',
          label: '执行率(%)',
          formatter: this.percentFormatter
        }, {
          prop: 'successfulContactRate',
          label: '联络成功率(%)',
          formatter: this.percentFormatter
        }, {
          prop: 'purchaseRate',
          label: '实际购买率(%)',
          formatter: this.percentFormatter
        }, {
          prop: 'compareToLastBatch',
          label: '比上批(%)',
          formatter: this.percentFormatter
        }, {
          prop: 'aumIncreaseAll',
          label: '全体客户AUM增量/全体客户户均AUM增量(万元)',
          sortable: true,
          slot: true,
          keys: ['aumIncreaseAll', 'aumAverageAll']
        }, {
          prop: 'aumIncrease',
          label: '成功客户AUM增量/成功客户户均AUM增量(万元)',
          sortable: true,
          slot: true,
          keys: ['aumIncrease', 'aumAverage']
        }]
      },
      // 综合排名
      ranking: {
        // 网点
        org: {
          loading: false,
          downloadLoading: false,
          showPagination: false,
          scope: '前20名',
          total: 0,
          currentPage: 1,
          pageSize: 20,
          tableData: [],
          tableColumnList: [{
            prop: 'ranking',
            label: '综合得分排名'
          }, {
            prop: 'org',
            label: '支行'
          }, {
            prop: 'outlet',
            label: '执行网点'
          }, {
            prop: 'purchaseRate',
            label: '实际购买率(%)',
            formatter: this.percentFormatter
          }, {
            prop: 'salesAmount',
            label: '销售成功数量'
          }, {
            prop: 'compareToLastBatch',
            label: '比上批'
          }]
        },
        // 人员
        people: {
          loading: false,
          downloadLoading: false,
          showPagination: false,
          scope: '前20名',
          total: 0,
          currentPage: 1,
          pageSize: 20,
          tableData: [],
          tableColumnList: [{
            prop: 'ranking',
            label: '综合得分排名'
          }, {
            prop: 'org',
            label: '支行'
          }, {
            prop: 'executor',
            label: '执行人'
          }, {
            prop: 'executorJob',
            label: '执行人岗位'
          }, {
            prop: 'purchaseRate',
            label: '实际购买率(%)',
            formatter: this.percentFormatter
          }, {
            prop: 'salesAmount',
            label: '销售成功数量'
          }, {
            prop: 'compareToLastBatch',
            label: '比上批'
          }]
        }
      },
      // 用例关键指标趋势表现
      keyIndicator: {
        filterForm: {
          useCase: [],
          batch: [],
          dateRange: []
        },
        rate: '实际购买率',
        compareToLastBatchType: '意向购买产品',
        batch: '',
        // 单选批次选项
        singleBatchList: [],
        chart1DownloadLoading: false,
        chart2DownloadLoading: false,
        chart3DownloadLoading: false,
        chart1Loading: false,
        chart2Loading: false,
        chart3Loading: false,
        chart1Data: [],
        chart2Data: [],
        chart3Data: []
      },
      // 用例各支行
      org: {
        loading: false,
        downloadLoading: false,
        filterForm: {
          useCase: [],
          batch: '',
          customerGroup: '',
          dateRange: []
        },
        tableLoading1: false,
        tableLoading2: false,
        tableLoading3: false,
        tableData1: [],
        tableData2: [],
        tableData3: [],
        tableColumnList3: [{
          label: '支行',
          prop: 'org'
        }, {
          label: '线索数',
          prop: 'clueAmount'
        }, {
          label: '实际购买率',
          prop: 'purchaseRate',
          formatter: this.percentFormatter
        }, {
          label: '比上批',
          prop: 'compareToLastBatch',
          formatter: this.percentFormatter
        }, {
          label: '比对照组',
          prop: 'compareToControlGroup',
          formatter: this.percentFormatter
        }, {
          label: '留存率',
          prop: 'retentionRate'
          // formatter: this.percentFormatter
        }, {
          label: '总流出金额',
          prop: 'totalOutflowAmount'
        }, {
          label: '总净流入金额',
          prop: 'totalNetInflowAmount'
        }]
      },
      // 用例选项
      useCaseList: [],
      // 事件选项
      eventList: [],
      // 渠道选项
      channelList: [{
        label: 'CRM',
        value: 1
      }, {
        label: '短信',
        value: 2
      }],
      // 批次选项
      batchList: [],
      // 用例类型选项
      categoryList: [],
      // 周数选项
      weekList: [],
      // 客群选项
      customerGroupList: [],
      // 日期选择器选项
      pickerOptions: {
        firstDayOfWeek: 1
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    // 图1、2数据key
    chartDataKey() {
      const mappings = {
        实际购买率: 'purchaseRate',
        执行率: 'executeRate',
        联络成功率: 'contactedRate'
      }
      return mappings[this.keyIndicator.rate]
    },
    // 图1数据
    realChart1Data() {
      return this.keyIndicator.chart1Data[this.chartDataKey]
    },
    // 图2数据
    realChart2Data() {
      return this.keyIndicator.chart2Data[this.chartDataKey]
    },
    // 图3数据key
    chart3DataKey() {
      const mappings = {
        意向购买产品: 'purchaseIntention',
        预约网点见面: 'networkToMeet'
      }
      return mappings[this.keyIndicator.compareToLastBatchType]
    },
    // 图3数据
    realChart3Data() {
      return this.keyIndicator.chart3Data[this.chart3DataKey]
    },
    // 执行情况、综合排名 公共请求字段
    executeStatusRankingGetData() {
      return {
        channel: this.overview.searchForm.channel,
        category: this.overview.searchForm.category,
        useCaseIds: this.overview.searchForm.useCase,
        PC: this.executeStatus.batch,
        dateRange: this.overview.searchForm.dateRange
      }
    },
    // 督导数据趋势对比 公共请求字段
    keyIndicatorGetData() {
      return {
        channel: this.overview.searchForm.channel,
        category: this.overview.searchForm.category,
        useCaseIds: this.keyIndicator.filterForm.useCase,
        pcList: this.keyIndicator.filterForm.batch,
        dateRange: this.keyIndicator.filterForm.dateRange
      }
    },
    // 总览选择用例时 下面的用例筛选选项
    childUseCaseOpt() {
      return this.overview.searchForm.useCase && this.overview.searchForm.useCase.length
        ? this.useCaseList.filter(n => this.overview.searchForm.useCase.includes(n.value))
        : this.useCaseList
    },
    // 总览选择批次时 督导数据趋势对比的批次筛选选项
    childBatchOpt() {
      return this.overview.searchForm.batch && this.overview.searchForm.batch.length
        ? this.overview.searchForm.batch
        : this.batchList
    }
  },
  created() {
    this.getBaseInfoData() // 顶栏
    this.overviewSearch()
    this.getUseCaseTypeOpt() // 用例类型
    this.getUseCaseOpt() // 营销用例
    this.getBatchOpt() // 批次
    this.getCustomerGroupOpt() // 客群
    this.generate()
  },
  mounted() {
  },
  methods: {
    // 顶栏数据
    getBaseInfoData() {
      this.baseInfoLoading = true
      const data = {
        useCaseIds: [],
        event: [],
        channel: '',
        category: '',
        dateRange: [],
        pcList: [],
        week: ''
      }
      inspectorOverview(data).then(res => {
        const { data } = res
        this.baseInfo[0].value = data.count
        this.baseInfo[1].value = data.purchasedNum
        this.baseInfo[2].value = data.purchaseRate
        this.baseInfo[3].value = data.aumUp
        this.baseInfo[4].value = data.aumAverage
        this.baseInfo[5].value = data.purchaseAumUp
        this.baseInfo[6].value = data.purchaseAumAverage
      }).finally(() => {
        this.baseInfoLoading = false
      })
    },
    percentFormatter(row, column, cellValue, index) {
      return `${Number(cellValue * 100).toFixed(2)}%`
    },
    // 生成详细督导数据
    generate() {
      this.showExtra = true
      this.setExecuteStatusRankingFilters()
      this.setKeyIndicatorFilter()
      this.setOrgFilter()
      this.executeStatusRankingGetList()
      this.keyIndicatorSearch()
      this.orgSearch()
      // 滚动
      this.$nextTick(() => {
        const top = document.querySelector('#scroll-content').offsetTop - 16
        document.querySelector('.app-main').scroll({
          top,
          behavior: 'smooth'
        })
      })
    },
    // 总览列表 搜索
    overviewSearch() {
      this.overview.searchForm = JSON.parse(JSON.stringify(this.overview.filterForm))
      this.overviewClearSort()
      this.overviewGetList(1)
    },
    // 总览列表 重置
    overviewReset() {
      this.$refs.overviewFilterRef.resetFields()
      this.$refs.overviewRef.resetSelection()
      this.ranking.org.scope = '前20名'
      this.ranking.people.scope = '前20名'
      this.executeStatus.batch = ''
      this.overviewSearch()
      this.showExtra = false
    },
    // 总览列表 获取数据
    overviewGetList(pageNo) {
      this.overview.currentPage = pageNo || this.overview.currentPage
      const data = {
        pageNo: this.overview.currentPage,
        pageSize: this.overview.pageSize,
        channel: this.overview.searchForm.channel,
        category: this.overview.searchForm.category,
        useCaseIds: this.overview.searchForm.useCase,
        dateRange: this.overview.searchForm.dateRange,
        pcList: this.overview.searchForm.batch,
        week: this.overview.searchForm.week,
        sort: this.overview.tableSort
      }
      this.overview.filterForm = JSON.parse(JSON.stringify(this.overview.searchForm))
      // 督导总览列表数据
      this.overview.loading = true
      getInspectorOverviewList(data).then(res => {
        // console.log(res.data.resultList.map(n => n.useCaseId))
        this.overview.tableData = res.data.resultList.map(n => ({
          useCaseId: n.useCaseId,
          useCaseName: n.useCaseName,
          channel: n.channelName,
          category: n.type,
          clueAmount: n.count,
          successfulSalesCount: n.purchasedNum,
          purchaseRate: n.purchaseRate,
          salesAmount: n.purchasedAmount,
          aumIncreaseAll: n.aumUp,
          aumAverageAll: n.aumAverage,
          aumIncrease: n.purchaseAumUp,
          aumAverage: n.purchaseAumAverage
        }))
        this.overview.total = res.pagination.totalItemCount
      }).finally(() => {
        this.overview.loading = false
      })
    },
    // 总览列表 表头 列排序
    handleOverviewSortChange({ column, prop, order }) {
      const mappings = {
        purchaseRate: 'purchaseRate',
        salesAmount: 'purchasedAmount',
        aumIncreaseAll: 'aumUp',
        aumAverageAll: 'aumAverage',
        aumIncrease: 'purchaseAumUp',
        aumAverage: 'purchaseAumAverage'
      }
      this.overview.tableSort = order ? { [mappings[prop]]: order } : {}
      this.overviewGetList()
    },
    // 总览列表 清除排序
    overviewClearSort() {
      this.$refs.overviewRef && this.$refs.overviewRef.clearSort()
      this.overview.tableSort = {}
    },
    // 总览列表 用例下拉选择框 清空 刷新渠道下拉选项
    handleOverviewUseCaseClear() {
      this.getBatchOpt()
    },
    // 总览列表 用例下拉选择框 隐藏 刷新渠道下拉选项
    handleOverviewUseCaseVisibleChange(isShow) {
      !isShow && this.getBatchOpt()
    },
    // 总览列表 渠道下拉选择框 清空 刷新用例下拉选项
    handleOverviewBatchClear() {
      this.getUseCaseOpt()
    },
    // 总览列表 渠道下拉选择框 隐藏 刷新用例下拉选项
    handleOverviewBatchVisibleChange(isShow) {
      !isShow && this.getUseCaseOpt()
    },
    // 执行情况、2个排名获取数据
    executeStatusRankingGetList() {
      this.executeStatusGetList()
      this.outletRankingGetList()
      this.peopleRankingGetList()
    },
    // 执行情况获取数据
    executeStatusGetList() {
      this.executeStatus.loading = true
      getExecuteStatusList(this.executeStatusRankingGetData).then(res => {
        // aumAverage: 9794
        // aumUp: 9794
        // comparison: 1
        // contactedRate: 0
        // count: 1
        // executeRate: 1
        // purchaseAumAverage: 9794
        // purchaseAumUp: 9794
        // purchaseRate: 1
        // purchasedAmount: 49589
        // purchasedRateRanking: 1
        // subBranchName: "乐从支行"
        this.executeStatus.tableData = res.data.map(n => ({
          purchaseRateRanking: n.purchasedRateRanking, // 实际购买率排名
          org: n.subBranchName, // 支行
          clueAmount: n.count, // 线索数量
          execRate: n.executeRate, // 执行率
          successfulContactRate: n.contactedRate, // 联络成功率
          purchaseRate: n.purchaseRate, // 实际购买率
          compareToLastBatch: n.comparison, // 比上批
          aumIncreaseAll: n.aumUp, // 全体客户AUM增量
          aumAverageAll: n.aumAverage, // 全体客户户均AUM增量
          aumIncrease: n.purchaseAumUp, // 成功客户AUM增量
          aumAverage: n.purchaseAumAverage // 成功客户户均AUM增量,
        }))
      }).finally(() => {
        this.executeStatus.loading = false
      })
    },
    // 执行情况批次更改
    handleExecuteStatusBatchChange() {
      this.executeStatusRankingGetList()
    },
    // 网点综合排名搜索
    outletRankingGetList() {
      // data = {
      //   channel: this.overview.searchForm.channel,
      //   category: this.overview.searchForm.category,
      //   useCaseIds: this.overview.searchForm.useCase,
      //   PC: this.executeStatus.batch,
      //   dateRange: this.overview.searchForm.dateRange
      // }
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.org.scope === '前20名'
          ? 'front'
          : this.ranking.org.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.org.currentPage,
        pageSize: this.ranking.org.pageSize
      }
      this.ranking.org.loading = true
      getOutletRankingList(data).then(res => {
        if (this.ranking.org.scope === '查看全部') {
          this.ranking.org.tableData = res.data.resultList.map(n => ({
            org: n.subBranchName, // 支行
            outlet: n.networkName, // 网点
            purchaseRate: n.purchaseRate, // 购买率
            salesAmount: n.purchasedNum, // 销售成功数量
            compareToLastBatch: n.comparison, // 比上批
            ranking: n.ranking // 排名
          }))
          this.ranking.org.total = res.pagination.totalItemCount
        } else {
          this.ranking.org.tableData = res.data.map(n => ({
            org: n.subBranchName, // 支行
            outlet: n.networkName, // 网点
            purchaseRate: n.purchaseRate, // 购买率
            salesAmount: n.purchasedNum, // 销售成功数量
            compareToLastBatch: n.comparison, // 比上批
            ranking: n.ranking // 排名
          }))
        }
      }).finally(() => {
        this.ranking.org.loading = false
      })
    },
    // 网点综合排名筛选
    handleOutletRankingChange() {
      this.ranking.org.showPagination = this.ranking.org.scope === '查看全部'
      this.outletRankingGetList()
    },
    // 网点综合排名翻页换页
    handleOutletRankingCurrentChange(val) {
      this.ranking.org.currentPage = val
      this.outletRankingGetList()
    },
    // 人员综合排名搜索
    peopleRankingGetList() {
      // data = {
      //   channel: this.overview.searchForm.channel,
      //   category: this.overview.searchForm.category,
      //   useCaseIds: this.overview.searchForm.useCase,
      //   PC: this.executeStatus.batch,
      //   dateRange: this.overview.searchForm.dateRange
      // }
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.people.scope === '前20名'
          ? 'front'
          : this.ranking.people.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.people.currentPage,
        pageSize: this.ranking.people.pageSize
      }
      this.ranking.people.loading = true
      getPeopleRankingList(data).then(res => {
        if (this.ranking.people.scope === '查看全部') {
          this.ranking.people.tableData = res.data.resultList.map(n => ({
            org: n.subBranchName, // 支行
            executor: n.executor, // 执行人
            executorJob: n.executorJob, // 执行人岗位
            purchaseRate: n.purchaseRate, // 实际购买率
            salesAmount: n.purchasedNum, // 销售成功数量
            compareToLastBatch: n.comparison, // 比上批
            ranking: n.ranking // 综合排名
          }))
          this.ranking.people.total = res.pagination.totalItemCount
        } else {
          this.ranking.people.tableData = res.data.map(n => ({
            org: n.subBranchName, // 支行
            executor: n.executor, // 执行人
            executorJob: n.executorJob, // 执行人岗位
            purchaseRate: n.purchaseRate, // 实际购买率
            salesAmount: n.purchasedNum, // 销售成功数量
            compareToLastBatch: n.comparison, // 比上批
            ranking: n.ranking // 综合排名
          }))
        }
      }).finally(() => {
        this.ranking.people.loading = false
      })
    },
    // 人员综合排名筛选
    handlePeopleRankingChange() {
      this.ranking.people.showPagination = this.ranking.people.scope === '查看全部'
      this.peopleRankingGetList()
    },
    // 人员综合排名翻页换页
    handlePeopleRankingCurrentChange(val) {
      this.ranking.people.currentPage = val
      this.peopleRankingGetList()
    },
    // 设置执行情况和综合排行筛选条件
    setExecuteStatusRankingFilters() {
      this.executeStatus.batch = ''
      this.ranking.org.scope = '前20名'
      this.ranking.people.scope = '前20名'
      const data = {
        dateRange: this.overview.searchForm.dateRange,
        pcList: this.overview.searchForm.batch
      }
      getBatchList(data).then(res => {
        this.executeStatus.singleBatchList = res.data
      })
    },
    // 设置关键指标趋势筛选条件
    setKeyIndicatorFilter() {
      this.keyIndicator.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: this.overview.searchForm.batch,
        dateRange: this.overview.searchForm.dateRange
      }
      this.keyIndicator.rate = '实际购买率'
      this.keyIndicator.compareToLastBatchType = '意向购买产品'
      this.keyIndicator.batch = ''
      // this.setKeyIndicatorBatch()
    },
    // 设置关键趋势单选批次选项
    setKeyIndicatorBatch() {
      const data = {
        dateRange: this.keyIndicator.filterForm.dateRange,
        pcList: this.keyIndicator.filterForm.batch
      }
      getBatchList(data).then(res => {
        this.keyIndicator.singleBatchList = res.data
      })
    },
    // 设置用例各支行督导看板筛选条件
    setOrgFilter() {
      this.org.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: '',
        dateRange: this.overview.searchForm.dateRange,
        customerGroup: ''
      }
    },
    // 关键指标趋势搜索
    keyIndicatorSearch() {
      this.setKeyIndicatorBatch()
      this.getChart1Data()
      this.getChart2Data()
      this.getChart3Data()
    },
    // 关键指标趋势重置
    keyIndicatorReset() {
      this.setKeyIndicatorFilter()
      this.keyIndicatorSearch()
    },
    // 图1数据 各支行用例关键指标趋势表现
    getChart1Data() {
      this.keyIndicator.chart1Loading = true
      getUseCaseKeyIndicatorList(this.keyIndicatorGetData).then(res => {
        this.keyIndicator.chart1Data = res.data
      }).finally(() => {
        this.keyIndicator.chart1Loading = false
      })
    },
    // 图2数据 各支行3个率(实际购买率 执行率 联络成功率)
    getChart2Data() {
      this.keyIndicator.chart2Loading = true
      getOutletExecuteRateList(this.keyIndicatorGetData).then(res => {
        this.keyIndicator.chart2Data = res.data
      }).finally(() => {
        this.keyIndicator.chart2Loading = false
      })
    },
    // 图3数据 意向购买产品成功占比与比上批情况
    getChart3Data() {
      this.keyIndicator.chart3Loading = true
      const data = {
        ...this.keyIndicatorGetData,
        PC: this.keyIndicator.batch
      }
      getIntentToBuySuccessRate(data).then(res => {
        this.keyIndicator.chart3Data = res.data
      }).finally(() => {
        this.keyIndicator.chart3Loading = false
      })
    },
    // 意向购买产品成功占比与比上批情况 - 单选渠道更改
    handleKeyIndicatorBatchChange() {
      this.getChart3Data()
    },
    // 用例各支行督导看板搜索
    orgSearch() {
      const data = {
        useCaseIds: this.org.filterForm.useCase,
        dateRange: this.org.filterForm.dateRange,
        PC: this.org.filterForm.batch,
        customerGroup: this.org.filterForm.customerGroup
      }
      // 表1
      this.org.tableLoading1 = true
      getUseCaseSalesAmount(data).then(res => {
        this.org.tableData1 = res.data
      }).finally(() => {
        this.org.tableLoading1 = false
      })
      // 表2
      // this.org.tableLoading2 = true
      // (data).then(res => {
      //   this.org.tableData2 = res.data
      // }).finally(() => {
      //   this.org.tableLoading2 = false
      // })
      // 表3
      this.org.tableLoading3 = true
      getInspectorSummary(data).then(res => {
        this.org.tableData3 = res.data.map(n => ({
          org: n.subBranchName,
          clueAmount: n.count,
          purchaseRate: n.purchaseRate,
          compareToLastBatch: n.purchaseRateCompareUp,
          compareToControlGroup: n.purchaseRateCompareContrast,
          retentionRate: n.retentionRate,
          totalOutflowAmount: n.totalOutflowAmount,
          totalNetInflowAmount: n.totalNetInflowAmount
        }))
      }).finally(() => {
        this.org.tableLoading3 = false
      })
    },
    // 用例各支行督导看板重置
    orgReset() {
      this.org.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: '',
        dateRange: this.overview.searchForm.dateRange,
        customerGroup: ''
      }
      this.orgSearch()
    },
    // 用例各支行表1合并行
    orgTableSpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'useCaseName') {
        return rowIndex % 2 === 0
          ? [2, 1]
          : [0, 0]
      }
    },
    // 获取用例下拉选项
    getUseCaseOpt() {
      const data = {
        pcList: this.overview.filterForm.batch
      }
      this.overview.useCaseLoading = true
      getUseCaseListByBatchList(data).then(res => {
        this.useCaseList = res.data
      }).finally(() => {
        this.overview.useCaseLoading = false
      })
    },
    // 获取批次下拉选项
    getBatchOpt() {
      const data = {
        useCaseIds: this.overview.filterForm.useCase
      }
      this.overview.filterForm.batchLoading = true
      getBatchList(data).then(res => {
        this.batchList = res.data
      }).finally(() => {
        this.overview.filterForm.batchLoading = false
      })
    },
    // 获取用例类型下拉选项
    getUseCaseTypeOpt() {
      getUseCaseType().then(res => {
        this.categoryList = res.data
      })
    },
    // 获取客群类型下拉选项
    getCustomerGroupOpt() {
      getCustomerGroupList().then(res => {
        this.customerGroupList = res.data
      })
    },
    // 总览列表 下载excel
    handleOverviewDownload() {
      const data = {
        pageNo: this.overview.currentPage,
        pageSize: this.overview.pageSize,
        channel: this.overview.searchForm.channel,
        category: this.overview.searchForm.category,
        useCaseIds: this.overview.searchForm.useCase,
        dateRange: this.overview.searchForm.dateRange,
        pcList: this.overview.searchForm.batch,
        week: this.overview.searchForm.week,
        sort: this.overview.tableSort
      }
      this.overview.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadChannelAndUseCasePage', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '督导总览.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.overview.downloadLoading = false
      })
    },
    // 执行情况 - 下载为excel
    handleExecuteStatusDownload() {
      this.executeStatus.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadSubBranchExecutiveCondition', this.executeStatusRankingGetData, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '各支行执行情况.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.executeStatus.downloadLoading = false
      })
    },
    // 网点综合排名 - 下载为excel
    handleOutletRankingDownload() {
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.org.scope === '前20名'
          ? 'front'
          : this.ranking.org.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.org.currentPage,
        pageSize: this.ranking.org.pageSize
      }
      this.ranking.org.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadNetworkRanking', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '网点综合排名.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.ranking.org.downloadLoading = false
      })
    },
    // 人员综合排名 - 下载为excel
    handlePeopleRankingDownload() {
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.people.scope === '前20名'
          ? 'front'
          : this.ranking.people.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.people.currentPage,
        pageSize: this.ranking.people.pageSize
      }
      this.ranking.people.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadMarketingPersonnelRanking', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '人员综合排名.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.ranking.people.downloadLoading = false
      })
    },
    // 关键指标趋势表现(图1) - 下载为excel
    handleChart1Download() {
      this.keyIndicator.chart1DownloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadDebtsTendency', this.keyIndicatorGetData, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '各支行用例关键指标趋势表现.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.keyIndicator.chart1DownloadLoading = false
      })
    },
    // 各支行成功执行率(图2) - 下载为excel
    handleChart2Download() {
      this.keyIndicator.chart2DownloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadBranchExecuteRate', this.keyIndicatorGetData, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '各支行成功执行率.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.keyIndicator.chart2DownloadLoading = false
      })
    },
    // 意向购买产品/预约网点见面 - 成功占比与比上批情况(图3) - 下载为excel
    handleChart3Download() {
      const data = {
        ...this.keyIndicatorGetData,
        PC: this.keyIndicator.batch
      }
      this.keyIndicator.chart3DownloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadBranchPurchaseIntention', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '意向购买产品/预约网点见面-成功占比与比上批情况.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.keyIndicator.chart3DownloadLoading = false
      })
    },
    // 用例各支行督导看板 - 下载为excel
    handleOrgDownload() {
      const data = {
        useCaseIds: this.org.filterForm.useCase,
        dateRange: this.org.filterForm.dateRange,
        PC: this.org.filterForm.batch,
        customerGroup: this.org.filterForm.customerGroup
      }
      this.org.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadUseCaseSituation', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '用例各支行督导看板.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.org.downloadLoading = false
      })
    },
    // post请求下载文件 打开下载弹框
    downloadHandler(blob, filename) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = e => {
        const a = document.createElement('a')
        a.download = filename
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .base-info {
    display: flex;
    flex-wrap: wrap;
    font-size: 20px;
    margin: -8px;
    margin-bottom: 8px;

    .item-box {
      display: flex;
      width: 33.3333%;
      // height: 120px;
      padding: 8px;

      .item-inner {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 20px;
        .label {
          font-size: 16px;
          font-weight: 300;
          display: flex;
          align-items: center;
          .main-icon {
            margin-right: 5px;
            font-size: 18px;
            color: #aaa;
            // left: -10px;
          }
        }
        .value {
          margin-top: 15px;
          display: flex;
          align-items: center;
          font-size: 30px;
          .unit {
            font-size: 16px;
            margin-left: 15px;
          }
        }
      }
    }
  }

  .block {
    margin-bottom: 16px;

    .head {
      border-bottom: 1px solid #f4f4f4;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;

      .title {
        color: #303133;
        font-weight: bold;

        .download {
          margin-left: 5px;
          transform: scale(0.8);
        }
      }

      .filter {
        padding-top: 18px;
        overflow: hidden;
        width: 100%;

        .filter-end {
          float: right;
          margin-right: 0;
        }
      }
    }

    .content {
      padding: 20px;

      .item {
        margin-bottom: 20px;

        .chart-title {
          color: #303133;
          font-weight: bold;
          height: 60px;

          .download {
            margin-left: 5px;
            transform: scale(0.8);
          }
        }

        .item-head {
          display: flex;
          justify-content: space-between;

          // .item-head-title {
          //   .download {
          //     margin-left: 5px;
          //     transform: scale(0.8);
          //   }
          // }
        }
      }
    }
  }

  .block1 {
    display: flex;
    margin-bottom: 16px;

    .left {
      margin-right: 10px;
    }

    .left,
    .right {
      flex: 1;

      .head {
        border-bottom: 1px solid #f4f4f4;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;

        .title {
          color: #303133;
          font-weight: bold;

          .download {
            margin-left: 5px;
            transform: scale(0.8);
          }
        }
      }

      .content {
        padding: 20px;
      }
    }
  }

  .block-title {
    font-size: 18px;
    color: #303133;
    font-weight: bold;
  }
}
</style>
