<template>
  <div class="container">
    <div v-loading="loading.baseInfoLoading"
         class="base-info">
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
    <!-- 总数据 -->
    <div class="block shun-card">
      <div class="head">
        <el-date-picker v-model="totalFilter.totalTimeVal"
                        value-format="yyyy-MM-dd"
                        style="margin-left:auto;"
                        type="daterange"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="hangleChangeTotalDatePicker" />
      </div>
      <div class="content">
        <div v-loading="loading.increaseLoading"
             class="left">
          <div class="item">
            <div class="inner-box">
              <div class="title">AUM提升额</div>
              <div class="count">{{ increaseInfo.aumUp /10000 | formatMoney }}万元</div>
              <div class="mini-chart">
                <MiniLineChart id="chart-mini-1"
                               :data="increaseInfo.aumMiniData" />
              </div>
            </div>
          </div>
          <div class="item">
            <div class="inner-box">
              <div class="title">LUM提升</div>
              <div class="count">{{ increaseInfo.lumUp /10000 | formatMoney }}万元</div>
              <div class="mini-chart">
                <MiniLineChart id="chart-mini-2"
                               :data="increaseInfo.lumMiniData" />
              </div>
            </div>
          </div>
          <div class="item">
            <div class="inner-box">
              <div class="title">新开信用卡</div>
              <div class="count">{{ increaseInfo.newCardSum | formatMoney }}</div>
              <div class="mini-chart">
                <MiniColumnChart id="chart-mini-3"
                                 :data="increaseInfo.cardMiniData" />
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div v-loading="loading.funnelChartLoading"
               class="right-chart-item chart-item">
            <div class="chart-title">
              <svg-icon icon-class="chart-funnel" />销售漏斗
            </div>
            <div class="chart-box">
              <FunnelChart v-if="funnelData.length"
                           id="funnel"
                           :data="funnelData" />
            </div>

            <div class="chart-bottom">
              <div class="text-item">有效执行数：<b>{{ funnelResult.effective_count | formatMoney }}条</b></div>
              <div class="text-item">有效执行率：<b>{{ (funnelResult.effective_rate * 100).toFixed(2) }}%</b></div>
              <div class="text-item">实际达成率：<b>{{ (funnelResult.actual_achievement * 100).toFixed(2) }}%</b></div>
            </div>
          </div>

          <div v-loading="loading.chartPieLoading"
               class="right-chart-item chart-item">
            <div class="chart-title">
              <svg-icon icon-class="chart-pie" />渠道线索数
            </div>
            <div class="chart-box">
              <PieChart id="channel-pie"
                        unit="条"
                        :data="channelPieData" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---------------------------------- CRM 短信 执行率 rate ---------------------------------------------------------------------------->
    <!-- crm/短信 各种率 -->
    <div class="block shun-card">
      <div class="head">
        <el-tabs v-model="rateFilter.activeName"
                 class="head-tabs"
                 @tab-click="handleRateTabClick">
          <el-tab-pane v-for="item of rateTabs"
                       :key="item.value"
                       :label="item.label"
                       :name="item.value" />
        </el-tabs>
        <el-radio-group v-model="rateFilter.rateType"
                        style="margin-left:40px;"
                        @change="handleChangeRateType">
          <el-radio-button v-for="(item,i) of rateFilter.rateTypeOpt"
                           :key="i"
                           :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <el-date-picker v-model="rateFilter.timeVal"
                        style="margin-left:auto;"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="hangleChangeRateDatePicker" />
      </div>
      <div class="content2">
        <div class="left chart-item">
          <div class="chart-title">
            <svg-icon icon-class="chart-line" />渠道触达
          </div>
          <div v-loading="loading.rateLoading"
               class="chart-box">
            <DoubleLineChart v-if="lineChartData_crm.type==='double'"
                             id="crm-line"
                             :data="lineChartData_crm.data" />
            <SingleLineChart v-if="lineChartData_crm.type==='single'"
                             id="crm-line2"
                             :data="lineChartData_crm.data" />
          </div>
        </div>
        <div class="right chart-item">
          <div class="chart-title">
            <div style="width:100%;">
              <svg-icon icon-class="chart-bar" />排名
            </div>
            <el-radio-group v-model="rateFilter.rankType"
                            size="mini"
                            text-color="#224191"
                            fill="#DCDFE6"
                            style="margin-top:20px;"
                            @change="hangleChangeRateTypeRank">
              <el-radio-button v-for="(item,i) of rankTypeOpt"
                               :key="i"
                               :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </div>

          <div v-loading="loading.rateRankLoading"
               class="chart-box"
               style="height:340px;">
            <BarChart id="rank"
                      unit="%"
                      :data="rateRankData" />
          </div>
        </div>
      </div>
    </div>
    <!-- ------------------------------- CRM 短信 result------------------------------------------------------------------------------------------------- -->
    <!-- 用例成效 -->
    <div class="block shun-card">
      <div class="head">
        <el-tabs v-model="resultFilter.activeName"
                 class="head-tabs"
                 @tab-click="handleResultTabClick">
          <el-tab-pane v-for="item of resultTabs"
                       :key="item.value"
                       :label="item.label"
                       :name="item.value" />
        </el-tabs>
        <el-date-picker v-model="resultFilter.timeVal"
                        value-format="yyyy-MM-dd"
                        style="margin-left:auto;"
                        type="daterange"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="hangleChangeResultDatePicker()" />
      </div>
      <div class="content2">
        <div class="left chart-item">
          <div class="chart-title">
            <svg-icon icon-class="chart-bar" />用例成效
          </div>
          <div v-loading="loading.resultLoading"
               class="chart-box"
               style="height:450px;">
            <StackedBarChart id="stacked-bar"
                             :data="stackedBarData" />
          </div>
        </div>
        <div class="right chart-item">
          <div class="chart-title">
            <div style="width:100%;">
              <svg-icon icon-class="chart-bar" />排名
              <el-select v-model="resultUsecaseFilter"
                         style="margin-left:50px;width:250px;"
                         placeholder="请选择用例"
                         @change="changeResultUseCase">
                <el-option v-for="item in useCaseOpt"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>
            </div>
            <el-radio-group v-model="resultFilter.resultType"
                            text-color="#224191"
                            fill="#DCDFE6"
                            size="mini"
                            style="margin-top:20px;"
                            @change="handleChangeResultType">
              <el-radio-button v-for="(item,i) of resultFilter.resultTypeOpt"
                               :key="i"
                               :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <!-- <el-radio-group v-model="resultFilter.rankType"
                            size="mini"
                            text-color="#224191"
                            fill="#DCDFE6"
                            style="margin-top:20px;"
                            @change="hangleChangeResultTypeRank">
              <el-radio-button v-for="(item,i) of rankTypeOpt"
                               :key="i"
                               :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group> -->

          </div>

          <div v-loading="loading.resultRankLoading"
               class="chart-box"
               style="height:340px;">
            <BarChart id="rank2"
                      :data="resultRankData" />
          </div>
        </div>
      </div>
    </div>
    <!-- ------------------------------- CRM 短信 effect------------------------------------------------------------------------------------------------- -->

    <!-- 成效统计 -->
    <div class="block shun-card">
      <div class="head">
        <el-tabs v-model="effectFilter.activeName"
                 style="flex:1;"
                 class="head-tabs"
                 @tab-click="handleChangeEffectType">
          <el-tab-pane v-for="item of effectFilter.effectTypeOpt"
                       :key="item.value"
                       :label="item.label"
                       :name="item.value" />
        </el-tabs>
        <el-date-picker v-model="effectFilter.timeVal"
                        style="margin-left:auto;"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="hangleChangeEffectDatePicker()" />
      </div>
      <div class="content2">
        <div class="left chart-item">
          <div class="chart-title">
            <svg-icon icon-class="chart-line" />用例成效
          </div>
          <div v-loading="loading.effectLoading"
               class="chart-box">
            <AreaChart id="effect-area"
                       :data="effectLineChartData" />
          </div>
        </div>
        <div class="right chart-item">
          <div class="chart-title">
            <div style="width:100%;">
              <svg-icon icon-class="chart-bar" />排名
            </div>
            <el-radio-group v-model="effectFilter.rankType"
                            size="mini"
                            text-color="#224191"
                            fill="#DCDFE6"
                            style="margin-top:20px;"
                            @change="hangleChangeEffectTypeRank">
              <el-radio-button v-for="(item,i) of rankTypeOpt"
                               :key="i"
                               :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </div>

          <div v-loading="loading.effectRankLoading"
               class="chart-box"
               style="height:340px;">
            <BarChart id="rank3"
                      :data="effectRankData" />
          </div>
        </div>
      </div>
    </div>
    <!-- ------------------------------- CRM 短信 amount------------------------------------------------------------------------------------------------- -->

    <div class="block shun-card">
      <div class="head">
        <el-tabs v-model="amountFilter.activeName"
                 class="head-tabs">
          <el-tab-pane v-for="item of amountTabs"
                       :key="item.value"
                       :label="item.label"
                       :name="item.value" />
        </el-tabs>
        <el-radio-group v-model="amountFilter.crmSmsType"
                        style="margin-left:40px;"
                        @change="handleAmountTabClick">
          <el-radio-button v-for="(item,i) of amountFilter.crmSmsTypeOpt"
                           :key="i"
                           :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <el-date-picker v-model="amountFilter.timeVal"
                        value-format="yyyy-MM-dd"
                        style="margin-left:auto;"
                        type="daterange"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="hangleChangeAmountDatePicker()" />
      </div>
      <div class="content2">
        <div class="left chart-item">
          <div class="chart-title">
            <svg-icon icon-class="chart-bar" />用例成效
          </div>
          <div v-loading="loading.amountLoading"
               class="chart-box"
               style="height:450px;">
            <StackedBarChart id="stacked-bar2"
                             :data="stackedBarData_amount" />
          </div>
        </div>
        <div class="right chart-item">
          <div class="chart-title">
            <div style="width:100%;">
              <svg-icon icon-class="chart-bar" />排名
              <el-select v-model="amountUsecaseFilter"
                         style="margin-left:50px;width:250px;"
                         placeholder="请选择用例"
                         @change="changeAmountUseCase">
                <el-option v-for="item in useCaseOpt"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>
            </div>
            <el-radio-group v-model="amountFilter.amountType"
                            text-color="#224191"
                            fill="#DCDFE6"
                            size="mini"
                            style="margin-top:20px;"
                            @change="handleChangeAmountType">
              <el-radio-button v-for="(item,i) of amountFilter.amountTypeOpt"
                               :key="i"
                               :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <!-- <el-radio-group v-model="amountFilter.rankType"
                            size="mini"
                            text-color="#224191"
                            fill="#DCDFE6"
                            style="margin-top:20px;"
                            @change="hangleChangeAmountTypeRank">
              <el-radio-button v-for="(item,i) of rankTypeOpt"
                               :key="i"
                               :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group> -->
          </div>

          <div v-loading="loading.amountRankLoading"
               class="chart-box"
               style="height:340px;">
            <BarChart id="rank4"
                      :data="amountRankData" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import moment from 'moment'
import {
  MiniLineChart,
  MiniColumnChart,
  FunnelChart,
  PieChart,
  ColumnChart,
  SingleLineChart,
  DoubleLineChart,
  BarChart,
  StackedBarChart,
  AreaChart
} from './components'
import {
  totalOverviewCopy,
  totalIncreaseCopy,
  totalFunnelCopy,
  totalPieCopy,
  rateOptCopy,
  totalRateCopy,
  totalRateRankCopy,
  getAllUseCase,
  resultOptCopy,
  totalResultCopy,
  totalResultRankCopy,
  effectOptCopy,
  totalEffectCopy,
  totalEffectRankCopy
} from '@/api/api'
import { COMPONENT_MAX_VIEW_PERCENTAGE } from '@antv/g2/lib/constant'
// import { DATA } from './json'
// console.log(DATA)
export default {
  components: {
    MiniLineChart,
    MiniColumnChart,
    FunnelChart,
    PieChart,
    // ColumnChart,
    SingleLineChart,
    DoubleLineChart,
    // LineChart2,
    BarChart,
    StackedBarChart,
    AreaChart
  },
  data() {
    return {
      loading: {
        // total
        baseInfoLoading: false,
        // 1
        increaseLoading: false,
        funnelChartLoading: false,
        chartPieLoading: false,
        // 2
        rateLoading: false,
        rateRankLoading: false,
        // 3
        resultLoading: false,
        resultRankLoading: false,
        // 4
        effectLoading: false,
        effectRankLoading: false,
        // 5
        amountLoading: false,
        amountRankLoading: false

      },
      // *********** 筛选条件 *************
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
      // total
      totalFilter: {
        totalTimeVal: [moment().subtract(1, 'weeks').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      },
      // rate 的tab
      rateTabs: [{
        label: 'CRM',
        value: 'crm'
      }, {
        label: '短信',
        value: 'sms'
      }],
      rateTypeOpt_origin: {},
      // crm/短信 率的统计
      rateFilter: {
        activeName: '',
        rateTypeOpt: [],
        rateType: '',
        timeVal: [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        // type: '执行率',
        rankType: 1
      },
      // 排名的分类
      rankTypeOpt: [
        {
          label: '支行',
          value: 1
        }, {
          label: '网点',
          value: 2
        },
        // {
        //   label: '理财顾问',
        //   value: 3
        // }, {
        //   label: '网经',
        //   value: 4
        // }, {
        //   label: '个经',
        //   value: 5
        // }, {
        //   label: '柜员',
        //   value: 6
        // },
        {
          label: '员工',
          value: 7
        }
      ],
      // 成效的筛选条件
      resultFilter: {
        activeName: '',
        resultTypeOpt: [],
        resultType: '',
        timeVal: [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        rankType: 1
      },
      resultRankData_origin: [],
      resultUsecaseFilter: '',
      resultRankData: [],
      amountRankData_origin: [],
      amountUsecaseFilter: '',
      amountRankData: [],
      useCaseOpt: [],
      // 选项
      resultTabs: [{
        label: 'CRM',
        value: 'crm',
        children: [
          {
            label: '线索数量',
            value: 'total'
          },
          {
            label: '联络成功数',
            value: 'contactedNum'
          },
          {
            label: '有效执行数',
            value: 'activeEffectNum'
          },
          {
            label: '成功购买数',
            value: 'purchasedNum'
          }
        ]
      }, {
        label: '短信',
        value: 'sms',
        children: [
          {
            label: '线索数量',
            value: 'total'
          },
          {
            label: '成功购买数',
            value: 'purchasedNum'
          }
        ]
      }
      ],
      // 柱状图Opt
      resultFilterOpt: [
        {
          label: '线索数量',
          value: 'total'
        },
        {
          label: '联络成功数',
          value: 'contactedNum'
        },
        {
          label: '有效执行数',
          value: 'activeEffectNum'
        },
        {
          label: '成功购买数',
          value: 'purchasedNum'
        }

      ],
      amountFilterOpt: [
        {
          label: '成功购买金额',
          value: 'purchasedAmount'
        },
        {
          label: 'AUM提升',
          value: 'aumUp'
        }
      ],
      stackedBarData_origin: [],
      resultTypeOpt_origin: {},
      effectFilter: {
        activeName: '',
        effectTypeOpt: [],
        effectType: '',
        timeVal: [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        rankType: 1
      },
      effectTabs: [
        { label: 'AUM余额提升', value: 'AUM余额提升' },
        { label: '成功购买', value: '成功购买' },
        { label: '新开信用卡', value: '新开信用卡' },
        { label: '有效信用卡增量', value: '有效信用卡增量' },
        { label: 'LUM余额提升', value: 'LUM余额提升' },
        { label: '存款新增', value: '存款新增' }
      ],
      // 金额的筛选条件
      amountFilter: {
        activeName: 'amount',
        crmSmsTypeOpt: [
          {
            label: 'CRM',
            value: 'crm'
          },
          {
            label: '短信',
            value: 'sms'
          }
        ],
        crmSmsType: '',
        amountTypeOpt: [],
        amountType: '',
        timeVal: [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        rankType: 1
        // rankT
      },
      // 选项
      amountTabs: [{
        label: '金额',
        value: 'amount',
        children: [{
          label: '成功购买金额',
          value: 'purchasedAmount'
        }, {
          label: 'AUM提升',
          value: 'aumUp'
        }]

      }],
      // crm 各种率
      lineChartData_crm: {
        data: [],
        type: ''
      },
      effectLineChartData: [
        { label: '9月第1批', value: 30 }
      ],
      effectRankData: [],

      effectLineChartData_origin: [],
      // lineChartData_crm: [
      //   // { label: '9月第1批', value: 30 },
      // ],
      // lineChartData_crm2: [
      //   // { label: '9月第1批', value: 30, category: '执行组' },
      //   // { label: '9月第1批', value: 22, category: '对照组' },
      // ],
      rateRankData: [],
      rateRankData_origin: [],
      rankChartData: [
        // {
        //   label: 'xx1',
        //   value: 100
        // }
      ],
      // 用例成效
      stackedBarData: [
        // {
        //   label: '用例1991',
        //   value: 3,
        //   type: '线索数量'
        // },
        // {
        //   label: '用例1992',
        //   value: 4,
        //   type: '线索数量'
        // },
        // {
        //   label: '用例1991',
        //   value: 3,
        //   type: '联络成功数'
        // },
        // {
        //   label: '用例1992',
        //   value: 4,
        //   type: '联络成功数'
        // },
        // {
        //   label: '用例1991',
        //   value: 3,
        //   type: '有效执行数'
        // },
        // {
        //   label: '用例1992',
        //   value: 4,
        //   type: '有效执行数'
        // }
      ],
      stackedBarData_amount: [],
      stackedBarData_amount_origin: [],
      // 顶栏数据
      baseInfo: [{
        name: '营销用例',
        icon: 'total_usecase',
        value: ''
        // unit: '个'
      }, {
        name: '营销事件',
        icon: 'total_event',
        value: ''
        // unit: '条'
      }, {
        name: '生效中事件',
        value: '',
        icon: 'total_event_ok'
        // unit: '个'
      }],
      // mini图数据
      increaseInfo: {
        aumUp: 0,
        lumUp: 0,
        newCardSum: 0,
        aumMiniData: [],
        lumMiniData: [],
        cardMiniData: []
      },
      // 漏斗图数据
      funnelData: [
        // { label: '线索数量', value: 10000 },
        // { label: '线索执行', value: 9000 },
        // { label: '联系成功', value: 7000 },
        // { label: '成功购买', value: 5500 }
      ],
      funnelResult: {
        effective_count: '',
        effective_rate: '',
        actual_achievement: ''
      },
      // 渠道线索数据（饼图）
      channelPieData: [
        // { label: '分类一', value: 10 },
      ],
      // crm
      expand: false,
      // 排名的Opt
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
      ]

    }
  },
  computed: {

  },
  watch: {},
  created() {
    this.render()
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
    changeUseCase() {
      console.log(123)
    },
    render() {
      // total
      this.getOverview()
      // 获取aum lum card 3张小图+漏斗图+饼图
      this.hangleChangeTotalDatePicker()
      // rate
      this.getRateOpt().then(() => {
        this.rateFilter.activeName = 'crm'
        this.handleRateTabClick()
      })

      // effect
      this.getEffectOpt().then(() => {
        this.effectFilter.activeName = 'aum'
        this.renderEffect()
      })

      // result
      this.resultFilter.activeName = 'crm'
      // amount
      this.amountFilter.crmSmsType = 'crm'

      this.getUseCaseOpt().then(() => {
        this.resultUsecaseFilter = this.useCaseOpt?.[0]?.id
        this.amountUsecaseFilter = this.useCaseOpt?.[0]?.id
        this.handleResultTabClick()
        this.handleAmountTabClick()
      })
    },
    /** ******************************** 0 *************************************** */
    hangleChangeTotalDatePicker() {
      const timeParam = {
        start: this.totalFilter.totalTimeVal[0],
        end: this.totalFilter.totalTimeVal[1]
      }
      this.getIncrease(timeParam)
      this.getFunnel(timeParam)
      this.getPie(timeParam)
    },

    getOverview() {
      this.loading.baseInfoLoading = true
      totalOverviewCopy().then(res => {
        const data = res.data
        this.baseInfo[0].value = data.useCase
        this.baseInfo[1].value = data.totalEvent
        this.baseInfo[2].value = data.activeEvent
      }).finally(() => {
        this.loading.baseInfoLoading = false
      })
    },

    getIncrease(val) {
      this.loading.increaseLoading = true
      totalIncreaseCopy(val).then(res => {
        const data = res.data
        this.increaseInfo.aumUp = data.aum_up
        this.increaseInfo.lumUp = data.lum_up
        this.increaseInfo.newCardSum = data.new_card_sum
        this.increaseInfo.aumMiniData = data.detail.map(n => {
          return {
            label: n.label,
            value: n.aumUp
          }
        })
        this.increaseInfo.lumMiniData = data.detail.map(n => {
          return {
            label: n.label,
            value: n.lumUp
          }
        })
        this.increaseInfo.cardMiniData = data.detail.map(n => {
          return {
            label: n.label,
            value: n.cardSum
          }
        })
      }).finally(() => {
        this.loading.increaseLoading = false
      })
    },
    getFunnel(val) {
      this.loading.funnelChartLoading = true
      totalFunnelCopy(val).then(res => {
        const data = res.data
        this.funnelData = [
          { label: '线索数量', value: data.total },
          { label: '线索执行', value: data.executed || 0 },
          { label: '联系成功', value: data.success },
          { label: '成功购买', value: data.purchase }
        ]
        this.funnelResult.effective_count = data.count
        this.funnelResult.effective_rate = data.rate
        this.funnelResult.actual_achievement = data.achievement
      }).finally(() => {
        this.loading.funnelChartLoading = false
      })
    },
    getPie(val) {
      this.loading.chartPieLoading = true
      totalPieCopy(val).then(res => {
        const data = res.data
        this.channelPieData = data.map(n => {
          return {
            value: n.total,
            label: n.label
          }
        })
      }).finally(() => {
        this.loading.chartPieLoading = false
      })
    },

    /** ******************************** rate *************************************** */
    // 获取rate的折线图
    getRate(val) {
      this.loading.rateLoading = true
      totalRateCopy(val).then(res => {
        this.lineChartData_crm_origin = res.data
        this.changeRateData()
      }).finally(() => {
        this.loading.rateLoading = false
      })
    },
    // 获取rate的排名
    getRateRank(val) {
      this.loading.rateRankLoading = true
      totalRateRankCopy(val).then(res => {
        this.rankChartData_origin = res.data
        this.changeRateRankData()
      }).finally(() => {
        this.loading.rateRankLoading = false
      })
    },
    // 获取rate折线图数据
    changeRateData() {
      // 折线图
      this.lineChartData_crm = {}
      if ((this.rateFilter.activeName === 'crm' && this.rateFilter.rateType === 'finishedRate') || this.rateFilter.activeName === 'sms') {
        const data = []
        const _data = this.lineChartData_crm_origin.find(n => {
          return this.rateFilter.rateType === n.key
        }).data
        _data.forEach(n => {
          data.push({
            label: n.label,
            value: +(n.value * 100),
            category: '执行组'
          }, {
            label: n.label,
            value: +(n.compare * 100),
            category: '对照组'
          })
        })
        this.lineChartData_crm = {
          data,
          type: 'double'
        }
      } else {
        const data = []
        const _data = this.lineChartData_crm_origin.find(n => {
          return this.rateFilter.rateType === n.key
        }).data
        _data.forEach(n => {
          data.push({
            label: n.label,
            value: +(n.value * 100)
          })
        })
        this.lineChartData_crm = {
          data,
          type: 'single'
        }
      }
    },
    // 获取rate排名数据
    changeRateRankData() {
      // 排名
      this.rateRankData = this.rankChartData_origin[this.rateFilter.rateType]
    },
    // 获取二级选项
    getRateOpt() {
      return new Promise((resolve, reject) => {
        rateOptCopy().then(res => {
          this.rateTypeOpt_origin = res.data
          resolve()
        })
      })
    },
    // 调rate接口需要的参数
    getRateParams() {
      return {
        start: this.rateFilter.timeVal[0],
        end: this.rateFilter.timeVal[1],
        channel: this.rateFilter.activeName.toUpperCase(),
        type: this.rateFilter.rankType
      }
    },
    // 调接口获取rate的数据
    renderRate() {
      const data = this.getRateParams()
      this.getRate(data)
      this.getRateRank(data)
    },
    // 点击一级选项
    handleRateTabClick() {
      this.rateFilter.rateTypeOpt = this.rateTypeOpt_origin[this.rateFilter.activeName]
      this.rateFilter.rateType = this.rateFilter.rateTypeOpt?.[0].value
      this.renderRate()
    },
    // 点击二级选项
    handleChangeRateType() {
      // 改变折线图数据
      this.changeRateData()
      // 改变排名数据
      this.changeRateRankData()
    },
    // 选择rate时间
    hangleChangeRateDatePicker() {
      this.renderRate()
    },
    // 切换rate排名
    hangleChangeRateTypeRank() {
      const data = this.getRateParams()
      if (data.type === 7) {
        this.getRateRank7(data)
      } else {
        this.getRateRank(data)
      }
    },
    // 获取rate的排名
    getRateRank7(val) {
      this.loading.rateRankLoading = true
      totalRateRankCopy(val).then(res => {
        const ObjectData = {
          'effectRate': [],
          'finishedRate': [],
          'activeEffectRate': [],
          'contactedRate': [],
          'purchasedRate': []
        }
        const paramArray = ['effectRate', 'finishedRate', 'activeEffectRate', 'contactedRate', 'purchasedRate']
        // res.data.forEach(n => {
        res.data.forEach(n => {
          this.pushMethod(ObjectData, paramArray, n)
        })
        this.rankChartData_origin = ObjectData
        this.changeRateRankData()
      })
        .finally(() => {
          this.loading.rateRankLoading = false
        })
    },
    pushMethod(data, paramArray, item) {
      paramArray.forEach(n => {
        data[n].push(...item[n])
      })
    },
    /** ******************************** result *************************************** */
    // 用例成效

    // 获取用例
    getUseCaseOpt() {
      return new Promise((resolve, reject) => {
        getAllUseCase().then(res => {
          this.useCaseOpt = res.data
          resolve()
        })
      })
    },

    changeResultUseCase() {
      const data = this.getResultParams()
      this.getResultRank(data)
    },

    // 获取二级选项
    // getResultOpt() {
    //   return new Promise((resolve, reject) => {
    //     resultOptCopy().then(res => {
    //       this.resultTypeOpt_origin = res.data
    //       resolve()
    //     })
    //   })
    // },
    // 点击一级选项
    handleResultTabClick() {
      this.resultFilter.resultTypeOpt = this.resultTabs.find(n => {
        return this.resultFilter.activeName === n.value
      }).children
      this.resultFilter.resultType = this.resultFilter.resultTypeOpt?.[0].value
      // 改变原始数据
      this.renderResult()
    },
    // 调result接口需要的参数
    getResultParams() {
      return {
        start: this.resultFilter.timeVal[0],
        end: this.resultFilter.timeVal[1],
        channel: this.resultFilter.activeName.toUpperCase(),
        // type: this.resultFilter.rankType,
        type: 1,
        useCaseId: this.resultUsecaseFilter
      }
    },
    // 调接口获取result的数据
    renderResult() {
      const data = this.getResultParams()
      this.getResult(data)
      if (data.type === 7) {
        this.getResultRank7(data)
      } else {
        this.getResultRank(data)
      }
    },
    // 获取result的柱状图
    getResult(val) {
      this.loading.resultLoading = true
      totalResultCopy(val).then(res => {
        this.stackedBarData_origin = res.data
        this.changeResultData()
      }).finally(() => {
        this.loading.resultLoading = false
      })
    },
    // 获取result的排名
    getResultRank(val) {
      this.loading.resultRankLoading = true
      totalResultRankCopy(val).then(res => {
        this.resultRankData_origin = res.data
        this.changeResultRankData()
      }).finally(() => {
        this.loading.resultRankLoading = false
      })
    },
    getResultRank7(val) {
      this.loading.resultRankLoading = true
      totalResultRankCopy(val).then(res => {
        const ObjectData = {
          'activeEffectNum': [],
          'purchasedNum': [],
          'aumUp': [],
          'purchasedAmount': [],
          'contactedNum': []
        }
        const paramArray = ['activeEffectNum', 'purchasedNum', 'aumUp', 'purchasedAmount', 'contactedNum']
        res.data.forEach(n => {
          this.pushMethod(ObjectData, paramArray, n)
        })
        this.resultRankData_origin = ObjectData
        this.changeResultRankData()
      }).finally(() => {
        this.loading.resultRankLoading = false
      })
    },
    // 获取result柱状图数据
    changeResultData() {
      // 柱状图
      const t = []
      const _t = this.stackedBarData_origin.filter(o => this.resultFilterOpt.find((n) => {
        if (n.value === o.key) {
          return true
        }
      }))
      _t.forEach(n => {
        t.push(n.data.map(k => {
          return Object.assign(k, {
            type: this.resultFilterOpt.find(t => {
              return n.key === t.value
            }).label
          })
        }))
      })
      let rd = []
      t.map(n => {
        rd = rd.concat(n)
      })
      this.stackedBarData = rd
    },
    // 获取result排名数据
    changeResultRankData() {
      // 排名
      this.resultRankData = this.resultRankData_origin[this.resultFilter.resultType]
    },

    // 修改时间
    hangleChangeResultDatePicker() {
      this.renderResult()
    },

    // 点击二级选项
    handleChangeResultType() {
      this.changeResultRankData()
    },
    // 切换result排名
    hangleChangeResultTypeRank() {
      const data = this.getResultParams()
      this.getResultRank(data)
    },

    /** ******************************** effect *************************************** */
    // 获取选项
    getEffectOpt() {
      return new Promise((resolve, reject) => {
        effectOptCopy().then(res => {
          this.effectFilter.effectTypeOpt = res.data
          resolve()
        })
      })
    },

    // 调effect接口需要的参数
    getEffectParams() {
      return {
        start: this.effectFilter.timeVal[0],
        end: this.effectFilter.timeVal[1],
        channel: this.effectFilter.activeName.toUpperCase(),
        type: this.effectFilter.rankType
      }
    },
    // 调接口获取effect的数据
    renderEffect() {
      const data = this.getEffectParams()
      this.getEffect(data)
      this.getEffectRank(data)
    },

    // 获取effect的折线图
    getEffect(val) {
      this.loading.effectLoading = true
      totalEffectCopy(val).then(res => {
        this.effectLineChartData_origin = res.data
        this.changeEffectData()
      }).finally(() => {
        this.loading.effectLoading = false
      })
    },
    // 获取effect的排名
    getEffectRank(val) {
      this.loading.effectRankLoading = true
      totalEffectRankCopy(val).then(res => {
        this.effectRankData_origin = res.data
        this.changeEffectRankData()
      }).finally(() => {
        this.loading.effectRankLoading = false
      })
    },
    getEffectRank7(val) {
      this.loading.effectRankLoading = true
      totalEffectRankCopy(val).then(res => {
        const ObjectData = {
          'effectCredit': [],
          'lum': [],
          'newCredit': [],
          'aum': [],
          'purchaseNum': [],
          'depositUpAmount': []
        }
        const paramArray = ['effectCredit', 'lum', 'newCredit', 'aum', 'purchaseNum', 'depositUpAmount']
        res.data.forEach(n => {
          this.pushMethod(ObjectData, paramArray, n)
        })
        this.effectRankData_origin = ObjectData
        this.changeEffectRankData()
      }).finally(() => {
        this.loading.effectRankLoading = false
      })
    },

    // 获取effect折线图数据
    changeEffectData() {
      // 折线图
      this.effectLineChartData = this.effectLineChartData_origin.find(n => {
        return this.effectFilter.activeName === n.key
      })?.data
    },
    // 获取effect排名数据
    changeEffectRankData() {
      // 排名
      this.effectRankData = this.effectRankData_origin?.[this.effectFilter.activeName]
    },

    hangleChangeEffectDatePicker() {
      this.renderEffect()
    },
    // 点击选项
    handleChangeEffectType() {
      this.changeEffectData()
      this.changeEffectRankData()
    },

    // 切换effect排名
    hangleChangeEffectTypeRank() {
      const data = this.getEffectParams()
      if (data.type === 7) {
        this.getEffectRank7(data)
      } else {
        this.getEffectRank(data)
      }
    },

    // ------------------- amount ---------------------------------------------------------------------------------------------------------

    changeAmountUseCase() {
      const data = this.getAmountParams()
      this.getAmountRank(data)
    },

    // 点击一级选项
    handleAmountTabClick() {
      this.amountFilter.amountTypeOpt = this.amountTabs.find(n => {
        return this.amountFilter.activeName === n.value
      }).children
      this.amountFilter.amountType = this.amountFilter.amountTypeOpt?.[0].value
      // 改变原始数据
      this.renderAmount()
    },

    // 调amount接口需要的参数
    getAmountParams() {
      return {
        start: this.amountFilter.timeVal[0],
        end: this.amountFilter.timeVal[1],
        channel: this.amountFilter.crmSmsType.toUpperCase(),
        // type: this.amountFilter.rankType,
        type: 7,
        useCaseId: this.amountUsecaseFilter
      }
    },
    // 调接口获取amount的数据
    renderAmount() {
      const data = this.getAmountParams()
      this.getAmount(data)
      this.getAmountRank(data)
    },
    // 获取amount的柱状图 stackedBarData_amount_origin 已经在result获取到
    getAmount(val) {
      this.loading.amountLoading = true
      totalResultCopy(val).then(res => {
        this.stackedBarData_amount_origin = res.data
        this.changeAmountData()
      }).finally(() => {
        this.loading.amountLoading = false
      })
    },
    // 获取amount的排名 amountRankData_origin 已经在result获取到
    getAmountRank(val) {
      this.loading.amountRankLoading = true
      totalResultRankCopy(val).then(res => {
        this.amountRankData_origin = res.data
        this.changeAmountRankData()
      }).finally(() => {
        this.loading.amountRankLoading = false
      })
    },
    getAmountRank7(val) {
      this.loading.amountRankLoading = true
      totalResultRankCopy(val).then(res => {
        const ObjectData = {
          'activeEffectNum': [],
          'total': [],
          'purchasedNum': [],
          'aumUp': [],
          'purchasedAmount': [],
          'contactedNum': []
        }
        const paramArray = ['activeEffectNum', 'total', 'purchasedNum', 'aumUp', 'purchasedAmount', 'contactedNum']
        res.data.forEach(n => {
          this.pushMethod(ObjectData, paramArray, n)
        })
        this.amountRankData_origin = ObjectData
        this.changeAmountRankData()
      }).finally(() => {
        this.loading.amountRankLoading = false
      })
    },
    // 获取amount柱状图数据
    changeAmountData() {
      // 柱状图
      const t = []
      const _t = this.stackedBarData_amount_origin.filter(o => this.amountFilterOpt.find((n) => {
        if (n.value === o.key) {
          return true
        }
      }))
      _t.forEach(n => {
        t.push(n.data.map(k => {
          return Object.assign(k, {
            type: this.amountFilterOpt.find(t => {
              return n.key === t.value
            }).label
          })
        }))
      })
      let rd = []
      t.map(n => {
        rd = rd.concat(n)
      })
      this.stackedBarData_amount = rd
    },
    // 获取amount排名数据
    changeAmountRankData() {
      // 排名
      this.amountRankData = this.amountRankData_origin[this.amountFilter.amountType]
    },

    // 修改时间
    hangleChangeAmountDatePicker() {
      this.renderAmount()
    },

    // 点击二级选项
    handleChangeAmountType() {
      this.changeAmountRankData()
    },
    // 切换amount排名
    hangleChangeAmountTypeRank() {
      const data = this.getAmountParams()
      if (data.type === 7) {
        this.getAmountRank7(data)
      } else {
        this.getAmountRank(data)
      }
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
    &:last-of-type {
      margin-bottom: 0;
    }
    .head {
      border-bottom: 1px solid #f4f4f4;
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      ::v-deep .head-tabs {
        height: 100%;
        .el-tabs__header {
          margin-bottom: 0;
        }
        .el-tabs__item {
          height: 60px;
          line-height: 60px;
        }
        .el-tabs__nav-wrap::after {
          content: none;
        }
      }
    }
    .content {
      display: flex;
      .left {
        width: 20%;
        min-width: 300px;
        padding: 10px 0;
        .item {
          height: 33.3333%;
          padding: 40px 20px;

          .inner-box {
            height: 100%;
            // border: 1px solid;
            display: flex;
            flex-direction: column;
            .title {
              padding-left: 8px;
              font-size: 14px;
              color: #888;
              border-left: 2px solid #5b8ff9;
            }
            .count {
              padding-left: 8px;
              font-size: 26px;
              margin-top: 10px;
            }
            .mini-chart {
              flex: 1;
            }
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        min-width: 0;
        justify-content: space-around;
        .right-chart-item {
          height: 100%;
          width: 50%;
          max-width: 600px;
        }
      }
    }
    .content2 {
      display: flex;
      // height: 500px;
      .left {
        width: 65%;
        padding: 20px;
      }
      .right {
        width: 35%;
      }
    }
  }
  .chart-item {
    display: flex;
    flex-direction: column;
    padding: 20px;
    .chart-title {
      margin-bottom: 30px;
      width: 100%;
      font-size: 16px;
      color: #888;
      // opacategory: 0.8;
      display: flex;
      align-items: center;
      position: relative;
      flex-wrap: wrap;
      .svg-icon {
        color: #aaa;
        margin-right: 8px;
      }
    }
    .chart-box {
      // flex: 1;
      height: 400px;
    }
    .chart-bottom {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 20px;
      .text-item {
        margin: 5px 10px;
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
