<template>
  <div class="container">
    <!-- 顶栏 -->
    <div v-loading="baseInfoLoading"
         class="base-info">
      <div v-for="(item,i) of baseInfo"
           :key="i"
           class="item-box">
        <div class="item-inner shun-card">
          <div class="label">
            <!-- <svg-icon class="main-icon"
                      :icon-class="item.icon" /> -->
            <i class="el-icon-s-data main-icon" />
            {{ item.name }}
          </div>
          <div class="value">
            {{ item.value | formatMoney }}
            <div class="unit">{{ item.unit }}</div>
          </div>
        </div>
      </div>
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
               @render="overviewGetList">
      <template v-slot:main-buttons>
        <!-- <el-button type="success"
                   icon="el-icon-document-checked"
                   @click="generate">
          生成详细督导数据
        </el-button> -->
        <!-- <el-button type="primary"
                   @click="download">
          导出
        </el-button> -->
      </template>
      <template v-slot:filter>
        <el-form ref="overviewFilterRef"
                 :inline="true"
                 :model="overview.filterForm"
                 class="filter-container">
          <el-form-item label="营销用例："
                        prop="useCase">
            <el-select v-model.trim="overview.filterForm.useCase"
                       placeholder="请选择营销用例"
                       clearable
                       multiple
                       collapse-tags
                       style="width: 200px">
              <el-option v-for="item of useCaseList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="营销事件："
                        prop="event">
            <el-select v-model.trim="overview.filterForm.event"
                       placeholder="请选择营销事件"
                       clearable
                       style="width: 200px">
              <el-option v-for="item of eventList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
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
          <el-form-item label="批次："
                        prop="batch">
            <el-select v-model.trim="overview.filterForm.batch"
                       placeholder="请选择批次"
                       clearable
                       multiple
                       collapse-tags
                       style="width: 200px">
              <el-option v-for="item of batchList"
                         :key="item"
                         :label="item"
                         :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="用例类型："
                        prop="type">
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
          <el-form-item label="日期范围："
                        prop="dateRange">
            <el-date-picker v-model="overview.filterForm.dateRange"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
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
          </el-form-item>
        </el-form>
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
          <div class="title">CRM渠道各支行的执行情况</div>
          <el-select v-model.trim="executeStatus.batch"
                     placeholder="请选择批次"
                     @change="handleExecuteStatusBatchChange">
            <el-option v-for="item of overview.searchForm.batch && overview.searchForm.batch.length ? overview.searchForm.batch : batchList"
                       :key="item"
                       :label="item"
                       :value="item" />
          </el-select>
        </div>
        <div class="content">
          <el-table ref="executeStatusRef"
                    v-loading="executeStatus.loading"
                    :data="executeStatus.tableData">
            <el-table-column v-for="({prop, label}, i) of executeStatus.tableColumnList"
                             :key="i"
                             :prop="prop"
                             :label="label" />
          </el-table>
        </div>
      </div>
      <!-- 综合排名 -->
      <div class="block1">
        <div class="left shun-card">
          <div class="head">
            <div class="title">网点综合排名</div>
            <el-radio-group v-model="ranking.org.scope"
                            size="mini"
                            @change="handleOutletRankingChange">
              <el-radio-button label="前20名" />
              <el-radio-button label="后20名" />
            </el-radio-group>
          </div>
          <div class="content">
            <el-table ref="orgRankingRef"
                      v-loading="ranking.org.loading"
                      :data="ranking.org.tableData">
              <el-table-column type="index"
                               label="排名" />
              <el-table-column v-for="({prop, label}, i) of ranking.org.tableColumnList"
                               :key="i"
                               :prop="prop"
                               :label="label" />
            </el-table>
          </div>
        </div>
        <div class="right shun-card">
          <div class="head">
            <div class="title">营销人员综合排名</div>
            <el-radio-group v-model="ranking.people.scope"
                            size="mini"
                            @change="handlePeopleRankingChange">
              <el-radio-button label="前20名" />
              <el-radio-button label="后20名" />
            </el-radio-group>
          </div>
          <div class="content">
            <el-table ref="peopleRankingRef"
                      v-loading="ranking.people.loading"
                      :data="ranking.people.tableData">
              <el-table-column type="index"
                               label="排名" />
              <el-table-column v-for="({prop, label}, i) of ranking.people.tableColumnList"
                               :key="i"
                               :prop="prop"
                               :label="label" />
            </el-table>
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
            <el-form-item label="用例："
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
                         clearable
                         collapse-tags>
                <el-option v-for="item of childBatchOpt"
                           :key="
                             item"
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
                              end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item>
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
            <div class="chart-title">各支行负债类小计用例关键指标趋势表现</div>
            <BarChart id="chart-1"
                      :data="keyIndicator.chart1Data" />
          </div>
          <div class="item">
            <div class="chart-title">各支行成功购买率</div>
            <DoubleAreaChart id="chart-2"
                             :data="keyIndicator.chart2Data"
                             :data-title-list="['线索数量', '购买率']" />
          </div>
          <div class="item">
            <div class="chart-title">各支行意向购买客户成功占比</div>
            <DoubleAreaChart id="chart-3"
                             :data="keyIndicator.chart3Data"
                             :data-title-list="[null, null]" />
          </div>
          <div class="item">
            <div class="chart-title">各支行预约网点见面成功占比</div>
            <DoubleAreaChart id="chart-4"
                             :data="keyIndicator.chart4Data"
                             :data-title-list="[null, null]" />
          </div>
          <div class="item">
            <div class="chart-title">意向购买产品成功占比与比上批情况</div>
            <BarChart id="chart-5"
                      :data="keyIndicator.chart5Data"
                      :data-title-list="[null, null]" />
          </div>
          <div class="item">
            <div class="chart-title">预约网点见面成功占比与比上批情况</div>
            <BarChart id="chart-6"
                      :data="keyIndicator.chart6Data"
                      :data-title-list="[null, null]" />
          </div>
        </div>
      </div>
      <!-- 用例各支行督导看板 -->
      <ShunTable ref="orgRef"
                 title="用例各支行督导看板"
                 :loading="org.loading"
                 :show-pagination="false"
                 :table-data="org.tableData"
                 :table-column-list="org.tableColumnList"
                 class="block">
        <template v-slot:filter>
          <el-form ref="orgFilterRef"
                   :inline="true"
                   :model="org.filterForm"
                   class="filter-container">
            <el-form-item label="营销用例："
                          prop="useCase">
              <el-select v-model.trim="org.filterForm.useCase"
                         placeholder="请选择营销用例"
                         clearable
                         collapse-tags
                         multiple>
                <el-option v-for="item of childUseCaseOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="批次："
                          prop="batch">
              <el-select v-model.trim="org.filterForm.batch"
                         placeholder="请选择批次"
                         clearable
                         collapse-tags
                         multiple>
                <el-option v-for="item of childBatchOpt"
                           :key="item"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期范围："
                          prop="dateRange">
              <el-date-picker v-model="org.filterForm.dateRange"
                              value-format="yyyy-MM-dd"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item class="filter-item-end">
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="orgSearch">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh"
                         @click="orgReset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </template>
      </ShunTable>
    </div>

  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { BarChart, DoubleAreaChart } from './components'
import {
  getBatchList,
  getAllUseCase,
  getUseCaseType,
  inspectorOverview,
  getInspectorOverviewList,
  getExecuteStatusList,
  getOutletRankingList,
  getPeopleRankingList,
  getUseCaseKeyIndicatorList,
  getOutletPurchaseRateList
} from '@/api/api'

export default {
  name: 'InspectorBoard',
  components: {
    ShunTable,
    BarChart,
    DoubleAreaChart
  },
  data() {
    return {
      // 更多图表显示
      showExtra: false,
      // 顶栏
      baseInfoLoading: false,
      baseInfo: [{
        name: '线索数量',
        icon: 'lock',
        value: 0
        // unit: '条'
      }, {
        name: '成功购买率',
        icon: 'lock',
        value: 0
        // unit: '%'
      }, {
        name: '销售金额',
        icon: 'lock',
        value: 0
        // unit: '万元'
      }, {
        name: '成功客户AUM增量',
        icon: 'lock',
        value: 0
        // unit: '万元'
      }, {
        name: '户均AUM增量',
        icon: 'lock',
        value: 0
        // unit: '万元'
      }],
      // 总览
      overview: {
        loading: false,
        filterForm: {
          useCase: [],
          category: '',
          event: '',
          channel: '',
          batch: [],
          dateRange: []
        },
        searchForm: {},
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumnList: [{
          prop: 'useCaseName',
          label: '用例名称'
        }, {
          prop: 'channel',
          label: '渠道'
        }, {
          prop: 'category',
          label: '用例类型'
        }, {
          prop: 'clueAmount',
          label: '线索数量'
        }, {
          prop: 'purchaseRate',
          label: '购买成功率(%)'
        }, {
          prop: 'salesAmount',
          label: '销售金额(万元)'
        }, {
          prop: 'aumIncrease',
          label: '成功客户AUM增量(万元)'
        }, {
          prop: 'aumAverage',
          label: '户均AUM增量(万元)'
        }]
      },
      // 执行情况
      executeStatus: {
        loading: false,
        batch: '',
        tableData: [],
        tableColumnList: [{
          prop: 'org',
          label: '支行'
        }, {
          prop: 'clueAmount',
          label: '线索数量'
        }, {
          prop: 'execRate',
          label: '执行率(%)'
        }, {
          prop: 'contactSuccessRate',
          label: '联络成功率(%)'
        }, {
          prop: 'purchaseRate',
          label: '实际购买率(%)'
        }, {
          prop: 'purchaseRateRank',
          label: '实际购买率排名'
        }, {
          prop: 'lastBatchComparison',
          label: '比上批(%)'
        }, {
          prop: 'salesAmount',
          label: '销售金额(万元)'
        }, {
          prop: 'aumIncrease',
          label: '成功客户AUM增量(万元)'
        }, {
          prop: 'aumAverage',
          label: '户均AUM增量(万元)'
        }]
      },
      // 综合排名
      ranking: {
        // 网点
        org: {
          loading: false,
          scope: '前20名',
          tableData: [],
          tableColumnList: [{
            prop: 'org',
            label: '支行'
          }, {
            prop: 'outlet',
            label: '执行网点'
          }, {
            prop: 'purchaseRate',
            label: '实际购买率(%)'
          }, {
            prop: 'salesAmount',
            label: '销售成功数量'
          }]
        },
        // 人员
        people: {
          loading: false,
          scope: '前20名',
          tableData: [],
          tableColumnList: [{
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
            label: '实际购买率(%)'
          }, {
            prop: 'salesAmount',
            label: '销售成功数量'
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
        chart1Loading: false,
        chart2Loading: false,
        chart3Loading: false,
        chart4Loading: false,
        chart5Loading: false,
        chart6Loading: false,
        chart1Data: [],
        chart2Data: [],
        chart3Data: [],
        chart4Data: [],
        chart5Data: [],
        chart6Data: []
      },
      // 用例各支行(最后一张表)
      org: {
        loading: false,
        filterForm: {
          useCase: [],
          batch: [],
          dateRange: []
        },
        tableData: [],
        tableColumnList: [{
          prop: 'org',
          label: '支行'
        }, {
          prop: 'clueAmount',
          label: '线索数量'
        }, {
          prop: 'purchaseRate',
          label: '实际购买率(%)'
        }, {
          prop: 'executeRate',
          label: '执行率(%)'
        }, {
          prop: 'aumRetention',
          label: 'AUM留存单'
        }, {
          prop: 'maturityAcceptanceRate',
          label: '到期承接率(%)'
        }, {
          prop: 'interestDropRate',
          label: '整体利率压降(BP)'
        }, {
          prop: 'highInterestDropRate',
          label: '高息利率压降(BP)'
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
      categoryList: []
    }
  },
  computed: {
    // 网点 / 人员 综合排名 数据请求的共同字段
    rankingData() {
      return {
        category: this.overview.searchForm.category,
        useCaseIds: this.overview.searchForm.useCase,
        pcList: this.overview.searchForm.batch,
        dateRange: this.overview.searchForm.dateRange
      }
    },
    // 总览选择用例时 下面的用例筛选选项
    childUseCaseOpt() {
      return this.overview.searchForm.useCase && this.overview.searchForm.useCase.length
        ? this.useCaseList.filter(n => this.overview.searchForm.useCase.includes(n.value))
        : this.useCaseList
    },
    // 总览选择批次时 下面的批次筛选选项
    childBatchOpt() {
      return this.overview.searchForm.batch && this.overview.searchForm.batch.length
        ? this.overview.searchForm.batch
        : this.batchList
    }
  },
  created() {
    this.overviewSearch()
    this.getBatchOpt()
    this.getUseCaseOpt()
    this.getUseCaseTypeOpt()
  },
  mounted() {
  },
  methods: {
    // 生成详细督导数据
    generate() {
      // const selection = this.$refs.overviewRef.getVal()
      // if (!selection.length) {
      //   return this.$message({
      //     message: '请选择用例',
      //     type: 'warning',
      //     duration: '3000'
      //   })
      // }
      this.showExtra = true
      this.executeStatus.batch = ''
      this.ranking.org.scope = '前20名'
      this.ranking.people.scope = '前20名'
      this.setKeyIndicatorFilter()
      this.setOrgFilter()
      this.executeStatusGetList()
      this.outletRankingGetList()
      this.peopleRankingGetList()
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
    // 导出
    download() {

    },
    // 总览的搜索
    overviewSearch() {
      this.overview.searchForm = JSON.parse(JSON.stringify(this.overview.filterForm))
      this.overviewGetList(1)
    },
    // 总览的重置
    overviewReset() {
      this.$refs.overviewFilterRef.resetFields()
      this.$refs.overviewRef.resetSelection()
      this.ranking.org.scope = '前20名'
      this.ranking.people.scope = '前20名'
      this.executeStatus.batch = ''
      this.overviewSearch()
      this.showExtra = false
    },
    // 总览的搜索逻辑
    overviewGetList(pageNo) {
      this.overview.currentPage = pageNo || this.overview.currentPage
      const data = {
        pageNo: this.overview.currentPage,
        pageSize: this.overview.pageSize,
        channel: this.overview.searchForm.channel,
        category: this.overview.searchForm.category,
        useCaseIds: this.overview.searchForm.useCase,
        dateRange: this.overview.searchForm.dateRange,
        pcList: this.overview.searchForm.batch
      }
      this.overview.filterForm = JSON.parse(JSON.stringify(this.overview.searchForm))
      // 顶栏数据
      this.baseInfoLoading = true
      inspectorOverview(data).then(res => {
        const { data } = res
        this.baseInfo[0].value = data.count
        this.baseInfo[1].value = data.purchaseRate
        this.baseInfo[2].value = data.purchasedAmount
        this.baseInfo[3].value = data.aumUp
        this.baseInfo[4].value = data.aumAverage
      }).finally(() => {
        this.baseInfoLoading = false
      })
      // 督导总览列表数据
      this.overview.loading = true
      getInspectorOverviewList(data).then(res => {
        // console.log(res.data.resultList.map(n => n.useCaseId))
        this.overview.tableData = res.data.resultList.map(n => ({
          useCaseId: n.useCaseId,
          useCaseName: n.useCaseName,
          clueAmount: n.count,
          channel: n.channelName,
          category: n.type,
          purchaseRate: n.purchaseRate,
          salesAmount: n.purchasedAmount,
          aumIncrease: n.aumUp,
          aumAverage: n.aumAverage
        }))
        this.overview.total = res.pagination.totalItemCount
      }).finally(() => {
        this.overview.loading = false
      })
    },
    // 执行情况的搜索
    executeStatusGetList() {
      const data = {
        useCaseIds: this.overview.searchForm.useCase,
        category: this.overview.searchForm.category,
        dateRange: this.overview.searchForm.dateRange,
        PC: this.executeStatus.batch
      }
      this.executeStatus.loading = true
      getExecuteStatusList(data).then(res => {
        this.executeStatus.tableData = res.data.map(n => ({
          org: n.subBranchName,
          clueAmount: n.count,
          execRate: n.executeRate,
          contactSuccessRate: n.contactedRate,
          purchaseRate: n.purchasedRate,
          purchaseRateRank: n.purchasedRateOrderly,
          lastBatchComparison: n.comparison,
          salesAmount: n.purchasedAmount,
          aumIncrease: n.aumUp,
          aumAverage: n.aumAverage
        }))
      }).finally(() => {
        this.executeStatus.loading = false
      })
    },
    // 执行情况批次更改
    handleExecuteStatusBatchChange() {
      this.executeStatusGetList()
    },
    // 网点综合排名筛选
    handleOutletRankingChange() {
      this.outletRankingGetList()
    },
    // 人员综合排名筛选
    handlePeopleRankingChange() {
      this.peopleRankingGetList()
    },
    // 设置关键指标趋势筛选条件
    setKeyIndicatorFilter() {
      this.keyIndicator.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: this.overview.searchForm.batch,
        dateRange: this.overview.searchForm.dateRange
      }
    },
    // 设置用例各支行督导看板筛选条件
    setOrgFilter() {
      this.org.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: this.overview.searchForm.batch,
        dateRange: this.overview.searchForm.dateRange
      }
    },
    // 网点综合排名搜索
    outletRankingGetList() {
      this.ranking.org.loading = true
      const data = {
        ...this.rankingData,
        scope: this.ranking.org.scope === '前20名' ? 'front' : 'rear'
      }
      getOutletRankingList(data).then(res => {
        this.ranking.org.tableData = res.data.map(n => ({
          org: n.subBranchName,
          outlet: n.networkName,
          purchaseRate: n.purchaseRate,
          salesAmount: n.purchasedNum
        }))
      }).finally(() => {
        this.ranking.org.loading = false
      })
    },
    // 人员综合排名搜索
    peopleRankingGetList() {
      this.ranking.people.loading = true
      const data = {
        ...this.rankingData,
        scope: this.ranking.people.scope === '前20名' ? 'front' : 'rear'
      }
      getPeopleRankingList(data).then(res => {
        this.ranking.people.tableData = res.data.map(n => ({
          org: n.subBranchName,
          executor: n.executor,
          executorJob: n.executorJob,
          purchaseRate: n.purchaseRate,
          salesAmount: n.purchasedNum
        }))
      }).finally(() => {
        this.ranking.people.loading = false
      })
    },
    // 关键指标趋势搜索
    keyIndicatorSearch() {
      const data = {
        useCaseIds: this.keyIndicator.filterForm.useCase,
        dateRange: this.keyIndicator.filterForm.dateRange,
        category: this.overview.searchForm.category,
        pcList: this.keyIndicator.filterForm.batch
      }
      for (let i = 1; i <= 6; i++) {
        this[`getChart${i}Data`](data)
      }
    },
    // 关键指标趋势重置
    keyIndicatorReset() {
      this.setKeyIndicatorFilter()
      this.keyIndicatorSearch()
    },
    // 图1数据 分组柱状图
    getChart1Data(data) {
      this.keyIndicator.chart1Loading = true
      getUseCaseKeyIndicatorList(data).then(res => {
        this.keyIndicator.chart1Data = res.data
      }).finally(() => {
        this.keyIndicator.chart1Loading = false
      })
    },
    // 图2数据 双轴面积图
    getChart2Data(data) {
      this.keyIndicator.chart2Loading = true
      getOutletPurchaseRateList(data).then(res => {
        this.keyIndicator.chart2Data = res.data.map(n => ({
          label: n.subBranchName,
          value1: n.count,
          value2: n.purchaseRate
        }))
      }).finally(() => {
        this.keyIndicator.chart2Loading = false
      })
    },
    // 图3数据 双轴面积图
    getChart3Data(data) { },
    // 图4数据 双轴面积图
    getChart4Data(data) { },
    // 图5数据 双轴面积图
    getChart5Data(data) { },
    // 图6数据 分组柱状图
    getChart6Data(data) { },
    // 用例各支行督导看板搜索
    orgSearch() {
      const data = {
        useCaseIds: this.org.filterForm.useCase,
        dateRange: this.org.filterForm.dateRange,
        category: this.overview.searchForm.category,
        pcList: this.org.filterForm.batch
      }
      // this.org.loading = true
      // ajax
    },
    // 用例各支行督导看板重置
    orgReset() {
      this.org.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: this.overview.searchForm.batch,
        dateRange: this.overview.searchForm.dateRange
      }
      this.orgSearch()
    },
    // 获取用例下拉选项
    getUseCaseOpt() {
      getAllUseCase().then(res => {
        this.useCaseList = res.data.map(n => ({
          label: n.name,
          value: n.id
        }))
      })
    },
    // 获取批次下拉选项
    getBatchOpt() {
      getBatchList().then(res => {
        this.batchList = res.data
      })
    },
    // 获取类型下拉选项
    getUseCaseTypeOpt() {
      getUseCaseType().then(res => {
        this.categoryList = res.data
      })
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
      }

      .filter {
        padding-top: 18px;
        overflow: hidden;
      }
    }

    .content {
      padding: 20px;

      .item {
        .chart-title {
          color: #303133;
          font-weight: bold;
          height: 60px;
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
