<template>
  <div class="container">
    <div class="shun-filter-container-box shun-card"
         style="margin-bottom:16px;">
      <el-form ref="filterRef"
               :inline="true"
               :model="filterForm"
               class="shun-filter-container">
        <el-form-item label="营销用例："
                      prop="useCase">
          <el-select v-model="filterForm.useCase"
                     class="long-text"
                     clearable
                     multiple
                     placeholder="请选择"
                     @change="getEvent(filterForm.useCase)">
            <el-option v-for="(item,i) in useCaseOpt"
                       :key="i"
                       :title="item.label"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="营销事件："
                      prop="event">
          <el-select v-model="filterForm.event"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item,i) in eventOpt"
                       :key="i"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="机构："
                      prop="agency">
          <el-select v-model="filterForm.agency"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item,i) in agencyOpt"
                       :key="i"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道："
                      prop="channel">
          <el-select v-model="filterForm.channel"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item,i) in channelOpt"
                       :key="i"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="批次："
                      prop="batch">
          <el-select v-model="filterForm.batch"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item,i) in batchOpt"
                       :key="i"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位："
                      prop="post">
          <el-select v-model="filterForm.post"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item,i) in postOpt"
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
          <el-button type="primary"
                     icon="el-icon-download">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-info">
      <div v-for="(item,i) of baseInfo"
           :key="i"
           class="item-box">
        <div class="item-inner shun-card">
          <div class="label">
            <svg-icon class="main-icon"
                      :icon-class="item.icon" />
            {{ item.name }}
          </div>
          <div class="value">
            {{ item.value | formatMoney }}
            <div class="unit">{{ item.unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <!-- 执行情况 -->
          <div class="chart-block shun-card">
            <div class="block-title">执行情况</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <div v-loading="loading.funnelChartLoading"
                     class="chart-item funnel-chart">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-funnel" />销售漏斗
                  </div>
                  <FunnelChart id="funnel"
                               :data="funnelData" />
                  <div class="chart-bottom">
                    <div style="margin-right:20px;">有效执行数：<b>{{ funnelResult.effective_count | formatMoney }}条</b></div>
                    <div style="margin-right:20px;">有效执行率：<b>{{ (funnelResult.effective_rate * 100).toFixed(2) }}%</b></div>
                    <div>实际达成率：<b>{{ funnelResult.actual_achievement * 100 }}%</b></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div v-loading="loading.chartPieLoading"
                     class="chart-item">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-pie" />渠道线索数
                    <el-select v-model="channelCluePieChart"
                               style="margin-left:20px;width:140px;"
                               placeholder="请选择"
                               @change="getPie">
                      <el-option v-for="item in channelClueOpt"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value" />
                    </el-select>
                  </div>
                  <PieChart id="channel-pie"
                            unit="条"
                            :data="channelPieData" />
                </div>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24"
                      style="margin-top:20px;">
                <div v-loading="loading.usecaseBarLoading"
                     class="chart-item"
                     style="height:600px;">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-bar" />用例线索数
                    <el-select v-model="channelOptVal"
                               style="margin-left:20px;"
                               placeholder="请选择"
                               @change="handleChangeChannel(channelOptVal)">
                      <el-option v-for="item in channelOpt"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value" />
                    </el-select>
                    <el-select v-model="funnelSel"
                               style="margin-left:20px;"
                               placeholder="请选择"
                               @change="getCluesUseCase">
                      <el-option v-for="item in funnelOpt"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value" />
                    </el-select>
                  </div>
                  <!-- <PieChart id="usecase-pie"
                          unit="条"
                          :data="usecaseBarData" /> -->
                  <BarChart id="usecase-bar"
                            unit="条"
                            :data="usecaseBarData" />
                  <!-- <ColumnChart id="usecase-bar"
                             meta-value="线索数量"
                             tooltip-title="线索数"
                             :data="usecaseBarData" /> -->
                </div>
              </el-col>
            </el-row>
            <div class="crm-line-container">
              <div class="sub-title">
                CRM
                <el-button style="margin-left:20px;"
                           size="mini"
                           @click="expandOpen">{{ expand?'折叠':'展开' }}
                  <i :class="expand?'el-icon-arrow-up':'el-icon-arrow-down'"
                     class="el-icon--right" />
                </el-button>
                <!-- <el-select v-show="!expand"
                         v-model="crmSel"
                         style="margin-left:20px;"
                         placeholder="请选择">
                <el-option v-for="item in crmOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select> -->
              </div>
              <div v-loading="lineChartLoading5"
                   class="chart-item line-chart">
                <div class="chart-title">
                  <svg-icon icon-class="chart-line" />CRM实际达成率
                </div>
                <LineChart2 id="crm-line-5"
                            :data="lineChartData5" />
              </div>

              <el-collapse-transition>
                <div v-show="expand">
                  <div v-loading="lineChartLoading1"
                       class="chart-item line-chart">
                    <div class="chart-title">
                      <svg-icon icon-class="chart-line" />CRM执行率
                    </div>
                    <LineChart id="crm-line-1"
                               ref="crmLineRef1"
                               :data="lineChartData1" />
                  </div>
                  <div v-loading="lineChartLoading2"
                       class="chart-item line-chart">
                    <div class="chart-title">
                      <svg-icon icon-class="chart-line" />CRM联系成功率
                    </div>
                    <LineChart id="crm-line-2"
                               ref="crmLineRef2"
                               :data="lineChartData2" />
                  </div>
                  <div v-loading="lineChartLoading3"
                       class="chart-item line-chart">
                    <div class="chart-title">
                      <svg-icon icon-class="chart-line" />CRM有效执行率
                    </div>
                    <LineChart id="crm-line-3"
                               ref="crmLineRef3"
                               :data="lineChartData3" />
                  </div>
                  <div v-loading="lineChartLoading4"
                       class="chart-item line-chart">
                    <div class="chart-title">
                      <svg-icon icon-class="chart-line" />CRM成功购买率
                    </div>
                    <LineChart id="crm-line-4"
                               ref="crmLineRef4"
                               :data="lineChartData4" />
                  </div>
                </div>

              </el-collapse-transition>

            </div>
            <el-row v-loading="lineChartLoading6"
                    class="crm-line-container"
                    style="border-left-color:rgb(103, 194, 58);">
              <div class="sub-title">短信</div>
              <el-col :span="24"
                      class="chart-item line-chart">
                <div class="chart-title">
                  <svg-icon icon-class="chart-line" />短信实际达成率
                </div>
                <LineChart2 id="crm-line-6"
                            :data="lineChartData6" />
              </el-col>
            </el-row>
          </div>
          <!-- 成效统计 -->
          <div class="chart-block shun-card">
            <div class="block-title">成效统计</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <div v-loading="loading.chartLineLoading"
                     class="chart-item mini rank">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-line" />走势
                  </div>
                  <AreaChart id="rank11"
                             unit="万元"
                             :data="statistics" />
                </div>
              </el-col>
              <el-col :span="12">
                <div v-loading="loading.chartBarLoading"
                     class="chart-item mini rank">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-bar" />排名
                  </div>
                  <ColumnChart id="rank12"
                               unit="万元"
                               :data="statistics2" />
                </div>
              </el-col>
              <!-- <el-col :span="24"
                        class="chart-item statistics">
                  <div class="chart-title">
                    <svg-icon :icon-class="Math.round(Math.random())===1?'chart-bar':'chart-line'" />{{ item.chart_title }}
                    <el-radio-group v-if="item.chart_tabs.length > 1"
                                    v-model="item.checkVal"
                                    class="radio-box">
                      <el-radio-button v-for="(radio,ri) of item.chart_tabs"
                                       :key="ri"
                                       :label="radio.value">
                        {{ radio.label }}
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                  <template v-if="Math.round(Math.random())===1">
                    <BarChart :id="'statistics'+i"
                              :unit="item.chart_unit"
                              :data="item.chart_data.find(n => n.key===item.checkVal).data" />
                  </template>
                  <template v-else>
                    <AreaChart :id="'statistics'+i"
                               :unit="item.chart_unit"
                               :data="item.chart_data.find(n => n.key===item.checkVal).data" />
                  </template>
                </el-col> -->
              <!-- <el-col :span="12"
                        class="chart-item statistics">
                  <div class="chart-title">
                    <svg-icon :icon-class="item.chart_type===1?'chart-bar':'chart-line'" />{{ item.chart_title }}
                    <el-radio-group v-if="item.chart_tabs.length > 1"
                                    v-model="item.checkVal"
                                    class="radio-box">
                      <el-radio-button v-for="(radio,ri) of item.chart_tabs"
                                       :key="ri"
                                       :label="radio.value">
                        {{ radio.label }}
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                  <template>
                    <BarChart :id="'statisticsRight'+i"
                              :unit="条"
                              :data="statistics" />
                  </template>
                </el-col> -->
            </el-row>
          </div>
        </el-col>
        <el-col :span="24">
          <!-- 排名情况 -->
          <div class="chart-block shun-card">
            <div class="block-title">排名情况</div>
            <el-row>
              <el-col :span="24">
                <div v-loading="loading.orgRankLoading"
                     class="chart-item rank">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-column" />支行排名
                    <el-select v-model="rankSelVal1"
                               style="margin-left:20px;"
                               placeholder="请选择"
                               @change="getRankOrg">
                      <el-option v-for="item in rankOpt"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value" />
                    </el-select>
                  </div>
                  <ColumnChart id="rank1"
                               unit="万元"
                               :data="rankChartData1" />
                </div>
              </el-col>
              <el-col :span="24"
                      style="margin-top:20px;">
                <div v-loading="loading.branchRankLoading"
                     class="chart-item rank">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-column" />
                    网点排名（前10名）
                    <el-select v-model="rankSelVal2"
                               style="margin-left:20px;"
                               placeholder="请选择"
                               @change="getRankBranch">
                      <el-option v-for="item in rankOpt"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value" />
                    </el-select>
                  </div>
                  <ColumnChart id="rank2"
                               unit="万元"
                               :data="rankChartData2" />
                </div>
              </el-col>
              <el-col :span="24"
                      style="margin-top:20px;">
                <div v-loading="loading.empRankLoading"
                     class="chart-item rank">
                  <div class="chart-title">
                    <svg-icon icon-class="chart-column" />
                    员工排名（前10名）
                    <el-select v-model="rankSelVal3"
                               style="margin-left:20px;"
                               placeholder="请选择"
                               @change="getRankEmp">
                      <el-option v-for="item in rankOpt"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value" />
                    </el-select>
                  </div>
                  <ColumnChart id="rank3"
                               unit="万元"
                               :data="rankChartData3" />
                </div>
              </el-col>
            </el-row>

          </div>
        </el-col>
      </el-row>

    </div>
  </div>

</template>

<script>
import { FunnelChart, PieChart, ColumnChart, LineChart, LineChart2, BarChart, AreaChart } from './components'
import {
  totalOverview,
  totalFunnel,
  totalPie,
  totalCluesUseCase,
  totalAchieveRate,
  totalStatisticsOne,
  totalStatisticsMul,
  getActualRate,
  // totalPurchaseAmount,
  // totalRankOrg,
  // totalRankBrancg,
  totalRank,
  // getAllJob,
  getAllUseCase,
  getEventList
} from '@/api/api'
// import { DATA } from './json'
// console.log(DATA)
export default {
  components: {
    FunnelChart,
    PieChart,
    ColumnChart,
    LineChart,
    LineChart2,
    BarChart,
    AreaChart
  },
  data() {
    return {
      loading: {
        baseInfoLoading: false,
        funnelChartLoading: false,
        chartPieLoading: false,
        usecaseBarLoading: false,
        // 成效统计loading
        chartLineLoading: false,
        chartBarLoading: false,
        // 支行网点员工排名loading
        orgRankLoading: false,
        branchRankLoading: false,
        empRankLoading: false
      },
      lineChartLoading1: false,
      lineChartLoading2: false,
      lineChartLoading3: false,
      lineChartLoading4: false,
      lineChartLoading5: false,
      lineChartLoading6: false,
      filterForm: {
        // 2241884
        useCase: [],
        event: '',
        agency: '',
        channel: '',
        batch: '',
        post: ''
      },
      searchForm: {
      },
      useCaseOpt: [],
      eventOpt: [],
      agencyOpt: [{
        value: 1,
        label: '机构1'
      }, {
        value: 2,
        label: '机构2'
      }, {
        value: 3,
        label: '机构3'
      }, {
        value: 4,
        label: '机构4'
      }, {
        value: 5,
        label: '机构5'
      }],
      channelOptVal: 1,
      channelOpt: [{
        value: 1,
        label: 'CRM'
      }, {
        value: 2,
        label: '短信'
      }],
      batchOpt: [
        {
          value: 1,
          label: '第一批次'
        }, {
          value: 2,
          label: '第二批次'
        }
      ],
      postOpt: [],
      options: [{
        value: '选项1',
        label: '选项1'
      }, {
        value: '选项2',
        label: '选项2'
      }, {
        value: '选项3',
        label: '选项3'
      }, {
        value: '选项4',
        label: '选项4'
      }, {
        value: '选项5',
        label: '选项5'
      }],
      value: '',
      baseInfo: [{
        name: '累计营销用例',
        icon: 'total_usecase',
        value: '',
        unit: '个'
      }, {
        name: '累计营销事件',
        icon: 'total_event',
        value: '',
        unit: '条'
      }, {
        name: '生效中事件',
        value: '',
        icon: 'total_event_ok',
        unit: '个'
      }, {
        name: 'AUM提升',
        value: '',
        icon: 'total_hoist',
        unit: '万元'
      }, {
        name: 'LUM提升',
        value: '',
        icon: 'total_hoist',
        unit: '万元'
      }, {
        name: '新开信用卡',
        value: '',
        icon: 'total_card',
        unit: '张'
      }],
      // 漏斗图数据
      funnelData: [
        { label: '线索数量', value: 10000 },
        { label: '线索执行', value: 9000 },
        { label: '联系成功', value: 7000 },
        { label: '成功购买', value: 5500 }
      ],
      funnelResult: {
        effective_count: '',
        effective_rate: '',
        actual_achievement: ''
      },
      // 渠道线索数据
      funnelSel: '0',
      funnelOpt: [
        { label: '线索数量', value: '0' },
        { label: '线索执行数量', value: '1' },
        { label: '联络成功数', value: '2' },
        { label: '有效执行数', value: '3' },
        { label: '成功购买数', value: '4' },
        { label: '成功购买金额', value: '5' },
        { label: 'AUM提升', value: '6' }
      ],
      channelPieData: [
        // { label: '分类一', value: 10 },
        // { label: '分类二', value: 20 },
        // { label: '分类三', value: 30 },
        // { label: '分类四', value: 40 },
        // { label: '分类五', value: 50 }
      ],
      // 用例线索数据
      usecaseBarData: [],
      // crm
      expand: false,
      crmSel: '1',
      crmOpt: [
        { label: 'CRM执行率', value: '1' },
        { label: 'CRM联系成功率', value: '2' },
        { label: 'CRM有效执行率', value: '3' },
        { label: 'CRM成功购买率', value: '4' },
        { label: 'CRM实际达成率', value: '5' }
      ],
      lineChartData1: [],
      lineChartData2: [],
      lineChartData3: [],
      lineChartData4: [],
      // crm5
      lineChartData5: [],
      // 短信
      lineChartData6: [],
      statistics: [],
      statistics2: [],
      // 渠道线索饼图传的值
      channelCluePieChart: 0,
      channelClueOpt: [
        {
          label: '线索数量',
          value: 0
        },
        {
          label: '成功购买数',
          value: 1
        },
        {
          label: '成功购买金额',
          value: 2
        },
        {
          label: 'AUM提升',
          value: 3
        }
      ],
      rankOpt: [
        {
          label: 'AUM提升',
          value: 0
        },
        {
          label: 'LUM提升',
          value: 1
        },
        {
          label: '有效信用卡增量',
          value: 2
        },
        {
          label: '执行率',
          value: 3
        },
        {
          label: '联络成功率',
          value: 4
        },
        {
          label: '成功购买率',
          value: 5
        },
        {
          label: '实际达成率',
          value: 6
        },
        {
          label: '有效执行率',
          value: 7
        }
      ],
      rankChartData1: [],
      rankChartData2: [],
      rankChartData3: [],
      rankChartData: [{
        label: 'xx1',
        value: 100
      }, {
        label: 'xx2',
        value: 90
      }, {
        label: 'xx3',
        value: 80
      }, {
        label: 'xx4',
        value: 70
      }, {
        label: 'xx5',
        value: 60
      }, {
        label: 'xx6',
        value: 50
      }, {
        label: 'xx7',
        value: 40
      }, {
        label: 'xx8',
        value: 30
      }, {
        label: 'xx9',
        value: 20
      }, {
        label: 'xx10',
        value: 10
      }],
      rankSelVal1: 0,
      rankSelVal2: 0,
      rankSelVal3: 0,
      rankSelPostVal3: 1

    }
  },
  computed: {

  },
  watch: {},
  created() {
    this.render()

    // this.getStatistics()
  },
  mounted() {

  },
  methods: {
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    render() {
      // 获取岗位
      // this.getPostOpt()
      //
      this.getOverview()
      this.getFunnel()
      this.getPie()
      // 实际达成率
      this.getLineChartData(0, 1)
      this.getLineChartData(1, 2)
      this.getLineChartData(2, 3)
      this.getLineChartData(3, 4)
      this.getLineChartData(4, 5)
      this.getLineChartData(5, 6)

      this.getUseCase()
      this.getCluesUseCase()
      // 旧接口
      // this.getAchieveRate()
      // this.getAchieveRate(1, 1)
      // this.getAchieveRate(2, 2)
      // this.getAchieveRate(3, 3)
      // this.getAchieveRate(4, 4)
      // this.getAchieveRate(5, 5)
      // this.getAchieveRate(6, 6)
      // this.getPurchaseAmount()

      // 成效统计

      this.getStatistics()

      // 支行网点员工排名
      this.getRankOrg()
      this.getRankBranch()
      this.getRankEmp()
    },
    getOverview() {
      this.loading.baseInfoLoading = true
      totalOverview().then(res => {
        const data = res.data
        this.baseInfo[0].value = data.total_use_case
        this.baseInfo[1].value = data.total_event
        this.baseInfo[2].value = data.active_event
        this.baseInfo[3].value = data.total_aum / 1000
        this.baseInfo[4].value = data.total_lum / 1000
        this.baseInfo[5].value = data.total_credit_card
      }).finally(() => {
        this.loading.baseInfoLoading = false
      })
    },
    getFunnel() {
      this.loading.funnelChartLoading = true
      totalFunnel().then(res => {
        const data = res.data
        // this.funnelData = [
        //   { label: '线索数量', value: data.total_clues },
        //   { label: '线索执行', value: data.executed_clues },
        //   { label: '联系成功', value: data.success_clues },
        //   { label: '成功购买', value: data.purchased_clues }
        // ]
        this.funnelResult.effective_count = res.data.effective_count
        this.funnelResult.effective_rate = res.data.effective_rate
        this.funnelResult.actual_achievement = res.data.actual_achievement
      }).finally(() => {
        this.loading.funnelChartLoading = false
      })
    },
    getPie() {
      this.loading.chartPieLoading = true
      totalPie({ type: this.channelCluePieChart }).then(res => {
        const data = res.data
        this.channelPieData = res.data.map(n => {
          return Object.assign({}, n, {
            value: +n.value
          })
        })
      }).finally(() => {
        this.loading.chartPieLoading = false
      })
    },
    handleChangeChannel(index) {
      if (index === 2) {
        this.funnelOpt =
          [
            { label: '线索数量', value: '0' },
            { label: '成功购买数', value: '4' },
            { label: '成功购买金额', value: '5' },
            { label: 'AUM提升', value: '6' }
          ]
      } else {
        this.funnelOpt = [
          { label: '线索数量', value: '0' },
          { label: '线索执行数量', value: '1' },
          { label: '联络成功数', value: '2' },
          { label: '有效执行数', value: '3' },
          { label: '成功购买数', value: '4' },
          { label: '成功购买金额', value: '5' },
          { label: 'AUM提升', value: '6' }
        ]
      }
    },
    // 获取岗位列表
    // getPostOpt() {
    //   getAllJob().then(res => {
    //     res.data.forEach(n => {
    //       this.postOpt.push({
    //         value: n.id,
    //         label: n.name
    //       })
    //     })
    //   })
    // },
    getCluesUseCase() {
      this.loading.usecaseBarLoading = true
      totalCluesUseCase({ type: this.funnelSel, channel: this.channelOptVal }).then(res => {
        this.usecaseBarData = res.data.map(n => {
          return Object.assign({}, n, {
            value: +n.value
          })
        })
      }).finally(() => {
        this.loading.usecaseBarLoading = false
      })
    },
    getAchieveRate(channel_id, unm) {
      totalAchieveRate({ channel_id }).then(res => {
        this['lineChartData' + unm] = [
          ...(res.data.control || [])
            .map(n => {
              return {
                label: n.label,
                value: +n.value,
                category: '执行组'
              }
            }),
          ...(res.data.exec || [])
            .map(n => {
              return {
                label: n.label,
                value: +n.value,
                category: '对照组'
              }
            })
        ]
      })
    },
    getLineChartData(typeKey, i) {
      this['lineChartLoading' + i] = true
      getActualRate({ type: typeKey }).then(res => {
        this['lineChartData' + i] = res.data?.map(n => {
          return Object.assign({}, n, {
            value: +n.value * 100
          })
        })
      }).finally(() => {
        this['lineChartLoading' + i] = false
      })
    },
    // getPurchaseAmount() {
    //   totalPurchaseAmount().then(res => {

    //   })
    // },
    // 获取用例列表
    getUseCase() {
      return new Promise((resolve) => {
        getAllUseCase().then(res => {
          this.useCaseOpt = res.data.map(n => {
            return {
              label: n.name,
              value: n.id
            }
          })
          resolve()
        })
      })
    },
    // 获取事件
    getEvent(useCase) {
      if (this.filterForm.useCase?.length === 1) {
        getEventList({ pageNo: 1, pageSize: 1000, useCaseId: useCase[0], status: [4, 6, 11, 13] }).then(res => {
          this.eventOpt = res.data.resultList.map(n => {
            return {
              label: n.eventBaseInfo.name,
              value: n.eventBaseInfo.id
            }
          })
        })
      } else {
        this.eventOpt = []
        this.filterForm.event = ''
      }
    },
    expandOpen() {
      this.expand = !this.expand
      if (this.expand && !this.renderOnce) {
        this.renderOnce = true
        this.$nextTick(() => {
          this.$refs.crmLineRef1.updete()
          this.$refs.crmLineRef2.updete()
          this.$refs.crmLineRef3.updete()
          this.$refs.crmLineRef4.updete()
        })
      }
    },

    getStatistics() {
      this.loading.chartBarLoading = true
      this.loading.chartLineLoading = true
      if (this.filterForm.useCase.length === 1) {
        totalStatisticsOne({ case: this.filterForm.useCase.join(',') }).then(res => {
          this.statistics = res.data.map(n => {
            return Object.assign({}, n, {
              value: +n.value / 1000
            })
          })
          this.statistics2 = this.statistics.slice(0).sort((a, b) => {
            return b.value - a.value
          })
        }).finally(() => {
          this.loading.chartBarLoading = false
          this.loading.chartLineLoading = false
        })
      } else {
        totalStatisticsOne({ case: 2241884 }).then(res => {
          this.statistics = res.data.map(n => {
            return Object.assign({}, n, {
              value: +n.value / 1000
            })
          })
          this.statistics2 = this.statistics.slice(0).sort((a, b) => {
            return b.value - a.value
          })
        }).finally(() => {
          this.loading.chartBarLoading = false
          this.loading.chartLineLoading = false
        })
      }
    },
    getRankOrg() {
      this.loading.orgRankLoading = true
      totalRank({ content: 0, type: this.rankSelVal1 }).then(res => {
        this.rankChartData1 = res.data.map(n => {
          return Object.assign({}, n, {
            value: +(n.value / 10000).toFixed(2)
          })
        }).slice(0, 10)
        console.log(this.rankChartData1)
      })
        .finally(() => {
          this.loading.orgRankLoading = false
        })
    },
    getRankBranch() {
      this.loading.branchRankLoading = true
      totalRank({ content: 1, type: this.rankSelVal2 }).then(res => {
        this.rankChartData2 = res.data.map(n => {
          return Object.assign({}, n, {
            value: +(n.value / 10000).toFixed(2)
          })
        }).slice(0, 10)
      })
        .finally(() => {
          this.loading.branchRankLoading = false
        })
    },
    getRankEmp() {
      this.loading.empRankLoading = true
      totalRank({ content: 2, type: this.rankSelVal3 }).then(res => {
        this.rankChartData3 = res.data.map(n => {
          return Object.assign({}, n, {
            value: +n.value
          })
        }).slice(0, 10)
      })
        .finally(() => {
          this.loading.empRankLoading = false
        })
    }
  }
}
</script>

<style>
/* @media screen and (max-width: 1000px) {
  body {
    color: red;
  }
} */
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
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
        position: relative;
        background: #fff;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 20px;
        .label {
          font-size: 18px;
          font-weight: 300;
          display: flex;
          align-items: center;
          color: $blue;
          .main-icon {
            color: $blue;
            margin-right: 15px;
            font-size: 30px;
            opacity: 0.6;
            // left: -10px;
          }
        }
        .value {
          margin-top: 15px;
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          .unit {
            font-size: 16px;
            margin-left: 15px;
          }
        }
      }
    }
  }
  .chart-container {
    // 执行情况
    .chart-block {
      text-align: center;
      margin-bottom: 16px;
      .block-title {
        font-size: 20px;
        font-weight: bold;
        color: #409eff;
        padding-left: 10px;
        margin: 20px 0;
        display: inline-block;
        position: relative;
        z-index: 0;
        letter-spacing: 10px;
        &::before {
          position: absolute;
          content: "";
          width: 100%;
          height: 70%;
          bottom: 0;
          background: #409eff;
          opacity: 0.1;
          left: 0;
          bottom: -2px;
          z-index: -1;
        }
      }
      .crm-line-container {
        margin-top: 20px;
        // border-radius: 4px;
        // border: 1px solid #f0f0f0;
        border-left: 4px solid rgb(64, 158, 255);
        //
        .sub-title {
          font-size: 18px;
          padding: 20px;
          font-weight: bold;
          text-align: left;
          display: flex;
          align-items: center;
        }
      }

      .chart-item {
        // border: 1px solid #f0f0f0;
        // border-radius: 4px;
        padding: 20px;
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &.mini {
          height: 300px;
        }
        &.line-chart {
          height: 300px;
          border: none;
          padding-top: 0;
        }
        &.statistics {
          margin-bottom: 20px;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
        &.rank {
          height: 400px;
        }
        .chart-title {
          margin-bottom: 20px;
          width: 100%;
          font-size: 16px;
          color: $blue;
          opacity: 0.8;
          display: flex;
          align-items: center;
          position: relative;
          flex-wrap: wrap;
          .svg-icon {
            margin-right: 5px;
          }
          .radio-box {
            // position: absolute;
            // left: 50%;
            // transform: translateX(-50%);
            // top: 0;
            margin-left: 20px;
          }
        }
        #funnel {
          max-width: 600px;
          width: 100%;
          flex: 1;
        }
        .chart-bottom {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          font-size: 14px;
        }
      }
    }
  }
}
.long-text {
  width: 300px;
  ::v-deep .el-select__tags-text {
    max-width: 200px;
  }
}
</style>
