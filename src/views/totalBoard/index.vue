<template>
  <div class="container">
    <div class="title-container">
      <div class="title">线索发布总览</div>
    </div>
    <div class="shun-filter-container-box shun-card">
      <el-form :inline="true"
               :model="filterForm"
               class="shun-filter-container">
        <el-form-item label="营销用例：">
          <el-select v-model="value"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="营销事件：">
          <el-select v-model="value"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="机构：">
          <el-select v-model="value"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道：">
          <el-select v-model="value"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="批次：">
          <el-select v-model="value"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位：">
          <el-select v-model="value"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="filter-item-end">
          <el-button type="primary"
                     icon="el-icon-search">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh">
            重置
          </el-button>
          <el-button type="primary"
                     icon="el-icon-download">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-container shun-card">
      <div class="base-info">
        <div v-for="(item,i) of baseInfo"
             :key="i"
             class="item">
          <svg-icon class="main-icon"
                    icon-class="result-main-1" />
          <div class="text">
            <div class="label">
              {{ item.name }}
            </div>
            <div class="value">
              {{ item.value }}
              <div class="unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-container">
        <!-- 执行情况 -->
        <div class="chart-block">
          <div class="block-title">执行情况</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chart-item funnel-chart">
                <div class="chart-title">
                  <svg-icon icon-class="chart-funnel" />销售漏斗
                </div>
                <FunnelChart id="funnel"
                             :data="funnelData" />
                <div class="chart-bottom">
                  <div style="margin-right:20px;">有效执行率：<b>67%</b></div>
                  <div>实际达成率：<b>67%</b></div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="chart-item">
                <div class="chart-title">
                  <svg-icon icon-class="chart-pie" />渠道线索数
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
              <div class="chart-item"
                   style="height:600px;">
                <div class="chart-title">
                  <svg-icon icon-class="chart-pie" />用例线索数
                </div>
                <PieChart id="usecase-pie"
                          unit="条"
                          :data="usecaseBarData" />
                <!-- <BarChart id="usecase-bar"
                          unit="条"
                          :data="usecaseBarData" /> -->
                <!-- <ColumnChart id="usecase-bar"
                             meta-value="线索数量"
                             tooltip-title="线索数"
                             :data="usecaseBarData" /> -->
              </div>
            </el-col>
          </el-row>
          <el-row class="crm-line-container">
            <div class="sub-title">CRM</div>
            <el-col :span="24"
                    class="chart-item line-chart">
              <div class="chart-title">
                <svg-icon icon-class="chart-line" />CRM执行率
              </div>
              <LineChart id="crm-line-1"
                         :data="lineChartData" />
            </el-col>
            <el-col :span="24"
                    class="chart-item line-chart">
              <div class="chart-title">
                <svg-icon icon-class="chart-line" />CRM联系成功率
              </div>
              <LineChart id="crm-line-2"
                         :data="lineChartData" />
            </el-col>
            <el-col :span="24"
                    class="chart-item line-chart">
              <div class="chart-title">
                <svg-icon icon-class="chart-line" />CRM有效执行率
              </div>
              <LineChart id="crm-line-3"
                         :data="lineChartData" />
            </el-col>
            <el-col :span="24"
                    class="chart-item line-chart">
              <div class="chart-title">
                <svg-icon icon-class="chart-line" />CRM成功购买率
              </div>
              <LineChart id="crm-line-4"
                         :data="lineChartData" />
            </el-col>
            <el-col :span="24"
                    class="chart-item line-chart">
              <div class="chart-title">
                <svg-icon icon-class="chart-line" />CRM成功购买率
              </div>
              <LineChart2 id="crm-line-5"
                          :data="lineChartData5" />
            </el-col>
          </el-row>
          <el-row class="crm-line-container"
                  style="border-left-color:rgb(103, 194, 58);">
            <div class="sub-title">短信</div>
            <el-col :span="24"
                    class="chart-item line-chart">
              <div class="chart-title">
                <svg-icon icon-class="chart-line" />短信实际达成率
              </div>
              <LineChart2 id="crm-line-6"
                          :data="lineChartData5" />
            </el-col>
          </el-row>
        </div>
        <!-- 成效统计 -->
        <div class="chart-block">
          <div class="block-title">成效统计</div>
          <el-row>
            <el-col v-for="(item,i) of statistics"
                    :key="i"
                    :span="24"
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
              <template v-if="item.chart_type===1">
                <BarChart :id="'statistics'+i"
                          :unit="item.chart_unit"
                          :data="item.chart_data.find(n => n.key===item.checkVal).data" />
              </template>
              <template v-else>
                <AreaChart :id="'statistics'+i"
                           :unit="item.chart_unit"
                           :data="item.chart_data.find(n => n.key===item.checkVal).data" />
              </template>
            </el-col>
          </el-row>
        </div>
        <!-- 排名情况 -->
        <div class="chart-block">
          <div class="block-title">排名情况</div>
          <el-row>
            <el-col :span="24">
              <div class="chart-item rank">
                <div class="chart-title">
                  <svg-icon icon-class="chart-bar" />支行排名
                  <el-select v-model="rankSelVal1"
                             style="margin-left:20px;"
                             placeholder="请选择">
                    <el-option v-for="item in rankOpt"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </div>
                <BarChart id="rank1"
                          unit="万元"
                          :data="rankChartData" />
              </div>
            </el-col>
            <el-col :span="24"
                    style="margin-top:20px;">
              <div class="chart-item rank">
                <div class="chart-title">
                  <svg-icon icon-class="chart-bar" />
                  网点排名（前10名）
                  <el-select v-model="rankSelVal2"
                             style="margin-left:20px;"
                             placeholder="请选择">
                    <el-option v-for="item in rankOpt"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </div>
                <BarChart id="rank2"
                          unit="万元"
                          :data="rankChartData" />
              </div>
            </el-col>
            <el-col :span="24"
                    style="margin-top:20px;">
              <div class="chart-item rank">
                <div class="chart-title">
                  <svg-icon icon-class="chart-bar" />
                  员工排名（前10名）
                  <el-select v-model="rankSelPostVal3"
                             style="margin-left:20px;"
                             placeholder="请选择">
                    <el-option v-for="item in postOpt"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                  <el-select v-model="rankSelVal3"
                             style="margin-left:20px;"
                             placeholder="请选择">
                    <el-option v-for="item in rankOpt"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </div>
                <BarChart id="rank3"
                          unit="万元"
                          :data="rankChartData" />
              </div>
            </el-col>
          </el-row>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { FunnelChart, PieChart, ColumnChart, LineChart, LineChart2, BarChart, AreaChart } from './components'
import { totalStatistics } from '@/api/api'
import { DATA } from './json'
console.log(DATA)
export default {
  components: {
    FunnelChart,
    PieChart,
    // ColumnChart,
    LineChart,
    LineChart2,
    BarChart,
    AreaChart
  },
  data() {
    return {
      filterForm: {},
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
        value: '200',
        unit: '个'
      }, {
        name: '累计营销事件',
        value: '200',
        unit: '条'
      }, {
        name: '生效中事件',
        value: '200',
        unit: '个'
      }, {
        name: 'AUM提升',
        value: '200',
        unit: '万元'
      }, {
        name: 'LUM提升',
        value: '200',
        unit: '万元'
      }, {
        name: '新开信用卡',
        value: '200',
        unit: '张'
      }],
      // 漏斗图数据
      funnelData: [
        { label: '线索数量', value: 10000 },
        { label: '线索执行', value: 9000 },
        { label: '联系成功', value: 7000 },
        { label: '成功购买', value: 5500 }
      ],
      // 渠道线索数据
      channelPieData: [
        { label: '分类一', value: 10 },
        { label: '分类二', value: 20 },
        { label: '分类三', value: 30 },
        { label: '分类四', value: 40 },
        { label: '分类五', value: 50 }
      ],
      // 用例线索数据
      usecaseBarData: [
        { label: '用例一撒发阿迪舒服的撒发是', value: 10000 },
        { label: '用例发阿迪舒服的撒发是', value: 90000 },
        { label: '用例休息阿迪舒服的撒发是', value: 80000 },
        { label: '用例学习啊撒发阿迪舒服的撒发是', value: 31410 },
        { label: '用例在撒发阿迪舒服的撒发是', value: 34210 },
        { label: '用例在撒发阿迪舒服的撒发是1', value: 10324 },
        { label: '用例在撒发阿迪舒服的撒发是2', value: 20324 },
        { label: '用例在撒发阿迪舒服的撒发是3', value: 52324 },
        { label: '用例在撒发阿迪舒服的撒发是4', value: 22103 },
        { label: '用例在撒发阿迪舒服的撒发是5', value: 61032 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90324 },
        { label: '用例在撒发阿迪舒服的撒发是7', value: 90124 },
        { label: '用例在撒发阿迪舒服的撒发是8', value: 90224 },
        { label: '用例在撒发阿迪舒服的撒发是9', value: 90424 },
        { label: '用例在撒发阿迪舒服的撒发是10', value: 90524 },
        { label: '用例在撒发阿迪舒服的撒发11', value: 90364 },
        { label: '用例在撒发阿迪舒服的撒发是12', value: 90366 },
        { label: '用例在撒发阿迪舒服的撒发是13', value: 90328 }
      ].sort((a, b) => {
        return b.value - a.value
      }),
      // crm
      lineChartData: [
        {
          label: '9月第一批',
          value: 90
        },
        {
          label: '9月第二批',
          value: 80
        },
        {
          label: '9月第三批',
          value: 75
        },
        {
          label: '10月第一批',
          value: 40
        },
        {
          label: '10月第二批',
          value: 55
        },
        {
          label: '10月第三批',
          value: 20
        },
        {
          label: '11月第一批',
          value: 77
        },
        {
          label: '11月第二批',
          value: 99
        },
        {
          label: '11月第三批',
          value: 88
        },
        {
          label: '12月第一批',
          value: 20
        },
        {
          label: '12月第二批',
          value: 33
        },
        {
          label: '12月第三批',
          value: 40
        }
      ],
      // crm5
      lineChartData5: [
        {
          label: '9月第一批',
          value: 90,
          category: '执行组'
        },
        {
          label: '9月第一批',
          value: 80,
          category: '对照组'
        },
        {
          label: '9月第二批',
          value: 80,
          category: '执行组'
        },
        {
          label: '9月第二批',
          value: 60,
          category: '对照组'
        },
        {
          label: '9月第三批',
          value: 75,
          category: '执行组'
        },
        {
          label: '9月第三批',
          value: 55,
          category: '对照组'
        },
        {
          label: '10月第一批',
          value: 40,
          category: '执行组'
        },
        {
          label: '10月第一批',
          value: 55,
          category: '对照组'
        },
        {
          label: '10月第二批',
          value: 55,
          category: '执行组'
        },
        {
          label: '10月第二批',
          value: 55,
          category: '对照组'
        },
        {
          label: '10月第三批',
          value: 20,
          category: '执行组'
        },
        {
          label: '10月第三批',
          value: 35,
          category: '对照组'
        },
        {
          label: '11月第一批',
          value: 77,
          category: '执行组'
        },
        {
          label: '11月第一批',
          value: 45,
          category: '对照组'
        },
        {
          label: '11月第二批',
          value: 99,
          category: '执行组'
        },
        {
          label: '11月第二批',
          value: 65,
          category: '对照组'
        },
        {
          label: '11月第三批',
          value: 88,
          category: '执行组'
        },
        {
          label: '11月第三批',
          value: 55,
          category: '对照组'
        },
        {
          label: '12月第一批',
          value: 20,
          category: '执行组'
        },
        {
          label: '12月第一批',
          value: 55,
          category: '对照组'
        },
        {
          label: '12月第二批',
          value: 33,
          category: '执行组'
        },
        {
          label: '12月第二批',
          value: 55,
          category: '对照组'
        },
        {
          label: '12月第三批',
          value: 40,
          category: '执行组'
        },
        {
          label: '12月第三批',
          value: 85,
          category: '对照组'
        }
      ],
      statistics: DATA.map(n => {
        return Object.assign({}, n, {
          checkVal: n.chart_tabs[0].value
        })
      }),
      rankOpt: [
        {
          label: 'AUM提升',
          value: 1
        },
        {
          label: 'LUM提升',
          value: 2
        },
        {
          label: '新开信用卡',
          value: 3
        },
        {
          label: '执行率',
          value: 4
        },
        {
          label: '执行率22',
          value: 5
        }
      ],
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
      postOpt: [{
        label: '岗位1',
        value: 1
      }, {
        label: '岗位2',
        value: 2
      }, {
        label: '岗位3',
        value: 3
      }, {
        label: '岗位4',
        value: 4
      }, {
        label: '岗位5',
        value: 5
      }, {
        label: '岗位6',
        value: 6
      }, {
        label: '岗位7',
        value: 7
      }, {
        label: '岗位8',
        value: 8
      }],
      rankSelVal1: 1,
      rankSelVal2: 1,
      rankSelVal3: 1,
      rankSelPostVal3: 1

    }
  },
  computed: {

  },
  watch: {},
  created() {
    // this.getStatistics()
  },
  mounted() {

  },
  methods: {
    getStatistics() {
      totalStatistics().then(res => {
        this.statistics = res.data.map(n => {
          return Object.assign({}, n, {
            checkVal: n.chart_tabs[0].value
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.title-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .title {
    font-size: 18px;
    color: #303133;
    font-weight: bold;
    margin-right: 12px;
  }
}

.main-container {
  padding: 30px;
  .base-info {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 0;
    background: #f4f9ff;
    border-radius: 10px;
    font-size: 20px;
    max-width: 1200px;
    margin: 0 auto;
    // box-sizing: 0 2px 10px rgba(0, 0, 0, 0.1);

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30%;
      margin: 1% 1.5%;
      .main-icon {
        font-size: 34px;
        margin-right: 15px;
      }
      .text {
        display: flex;
        align-items: center;
        .label {
          font-size: 16px;
        }
        .value {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          margin-left: 15px;
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
      .block-title {
        font-size: 22px;
        font-weight: bold;
        color: $blue;
        padding-left: 10px;
        margin: 25px 0 35px;
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
          background: $blue;
          opacity: 0.1;
          left: 0;
          bottom: -2px;
          z-index: -1;
        }
      }
      .crm-line-container {
        margin-top: 20px;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
        border-left: 4px solid rgb(64, 158, 255);
        //
        .sub-title {
          font-size: 18px;
          padding: 20px;
          font-weight: bold;
          text-align: left;
        }
      }

      .chart-item {
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        padding: 20px;
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
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
          height: 600px;
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
</style>
