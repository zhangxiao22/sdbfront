<template>
  <div class="container">
    <div class="shun-filter-container-box shun-card">
      <el-form :inline="true"
               :model="filterForm"
               class="shun-filter-container">
        <el-form-item label="范围：">
          <el-cascader v-model="filterForm.range"
                       style="width:500px"
                       :options="rangeOpt"
                       :props="{ expandTrigger: 'hover' }" />
        </el-form-item>
        <el-form-item class="filter-item-end">
          <el-button type="primary"
                     icon="el-icon-search">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main-container shun-card">
      <div class="base-info">
        <div class="item">
          <svg-icon class="main-icon"
                    icon-class="result-main-1" />
          <div class="text">
            <div class="label">
              营销事件汇总
            </div>
            <div class="value">200<div class="unit">个</div>
            </div>
          </div>
        </div>
        <div class="item">
          <svg-icon class="main-icon"
                    icon-class="result-main-2" />
          <div class="text">
            <div class="label">
              一般营销事件
            </div>
            <div class="value">200<div class="unit">个</div>
            </div>
          </div>
        </div>
        <div class="item">
          <svg-icon class="main-icon"
                    icon-class="result-main-3" />
          <div class="text">
            <div class="label">
              数据驱动事件
            </div>
            <div class="value">200<div class="unit">个</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-container">
        <!-- 111111 -->
        <div class="chart-item">
          <div class="text-box-container">
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="营销线索累计下发" />
                营销线索累计下发
              </div>
              <div class="value">
                123
                <div class="unit">万条</div>
              </div>
            </div>
          </div>
          <div class="charts">
            <div class="charts-title">渠道分布</div>
            <div class="chart-left">
              <PieChart id="1-pie-chart"
                        :data="data_1_pie" />
            </div>
            <div class="chart-right">
              <LineChart id="1-line-chart"
                         :data="data_1_line"
                         alias="下发数量（万条）" />
            </div>
          </div>
        </div>
        <!-- 222222 -->
        <div class="chart-item">
          <div class="text-box-container">
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="线下线索下发" />
                线下线索下发
              </div>
              <div class="value">
                123
                <div class="unit">万条</div>
              </div>
            </div>
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="线下线索执行" />
                线下线索执行
              </div>
              <div class="value">
                110
                <div class="unit">万条</div>
              </div>
            </div>
          </div>

          <div class="charts">
            <div class="charts-title">执行情况</div>
            <div class="chart-left">
              <ScatterChart id="2-scatter-chart"
                            :data="data_2_scatter"
                            alias-x="线索量（万条）"
                            alias-y="执行率" />
            </div>
            <div class="chart-right">
              <LineChart id="2-line-chart"
                         :data="data_2_line"
                         alias="执行率" />
            </div>
          </div>
        </div>
        <!-- 33333333 -->
        <div class="chart-item">
          <div class="text-box-container">
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="累计购买人数" />
                累计购买人数
              </div>
              <div class="value">
                123
                <div class="unit">万人</div>
              </div>
            </div>
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="累计购买金额" />
                累计购买金额
              </div>
              <div class="value">
                123
                <div class="unit">亿元</div>
              </div>
            </div>
          </div>
          <div class="charts">
            <div class="charts-title">购买情况</div>
            <div class="chart-left">
              <ScatterChart id="3-scatter-chart"
                            :data="data_3_scatter"
                            alias-x="购买金额(亿元)"
                            alias-y="购买率" />
            </div>
            <div class="chart-right">
              <LineChart id="3-line-chart"
                         :data="data_3_line"
                         alias="购买率" />
            </div>
          </div>
        </div>
        <!-- 4444444 -->
        <div class="chart-item">
          <div class="text-box-container">
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="累计AUM提升人数" />
                累计AUM提升人数
              </div>
              <div class="value">
                123
                <div class="unit">万人</div>
              </div>
            </div>
            <div class="text-box">
              <div class="label">
                <svg-icon class="sub-icon"
                          icon-class="累计AUM提升金额" />
                累计AUM提升金额
              </div>
              <div class="value">
                123
                <div class="unit">亿元</div>
              </div>
            </div>
          </div>
          <div class="charts">
            <div class="charts-title">提升情况</div>
            <div class="chart-left">
              <ScatterChart id="4-scatter-chart"
                            :data="data_4_scatter"
                            alias-x="购买金额(亿元)"
                            alias-y="购买率" />
            </div>
            <div class="chart-right">
              <LineChart id="4-line-chart"
                         :data="data_4_line"
                         alias="累计提升金额（亿元）" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import PieChart from './components/PieChart'
import LineChart from './components/LineChart'
import ScatterChart from './components/ScatterChart'
import { getPie, getLine, getScatter } from '@/api/api'
export default {
  components: {
    PieChart,
    LineChart,
    ScatterChart
  },
  data() {
    return {
      data_1_pie: [],
      data_1_line: [],
      data_2_scatter: [],
      data_2_line: [],
      data_3_scatter: [],
      data_3_line: [],
      data_4_scatter: [],
      data_4_line: [],
      filterForm: {
        range: []
      },
      rangeOpt: [{
        value: 'zhinan',
        label: '支行',
        children: [{
          value: 'shejiyuanze',
          label: '网点1',
          children: [{
            value: 'yizhi',
            label: '岗位1',
            children: [{
              value: '1',
              label: '执行人1'
            }, {
              value: '2',
              label: '执行人2'
            }]
          }]
        }, {
          value: 'daohang',
          label: '网点2',
          children: [{
            value: 'cexiangdaohang',
            label: '岗位3',
            children: [{
              value: '1',
              label: '执行人3'
            }, {
              value: '2',
              label: '执行人4'
            }]
          }]
        }]
      }]
    }
  },
  computed: {

  },
  watch: {},
  created() {
    this.get_1_pie()
    this.get_1_line()
    this.get_2_scatter()
    this.get_2_line()
    this.get_3_scatter()
    this.get_3_line()
    this.get_4_scatter()
    this.get_4_line()
  },
  mounted() {
  },
  methods: {
    get_1_pie() {
      getPie().then(res => {
        this.data_1_pie = res.data
      })
    },
    get_1_line() {
      getLine().then(res => {
        this.data_1_line = res.data
      })
    },
    get_2_scatter() {
      getScatter().then(res => {
        this.data_2_scatter = res.data
      })
    },
    get_2_line() {
      getLine().then(res => {
        this.data_2_line = res.data
      })
    },
    get_3_scatter() {
      getScatter().then(res => {
        this.data_3_scatter = res.data
      })
    },
    get_3_line() {
      getLine().then(res => {
        this.data_3_line = res.data
      })
    },
    get_4_scatter() {
      getScatter().then(res => {
        this.data_4_scatter = res.data
      })
    },
    get_4_line() {
      getLine().then(res => {
        this.data_4_line = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.filter-container {
}
.main-container {
  padding: 30px 30px 0;
  .base-info {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    background: #fffaf5;
    border-radius: 2px;
    font-size: 14px;
    // box-sizing: 0 2px 10px rgba(0, 0, 0, 0.1);

    .item {
      display: flex;
      align-items: center;
      .main-icon {
        font-size: 44px;
        margin-right: 15px;
      }
      .text {
        display: flex;
        flex-direction: column;
        .label {
          color: #ff8646;
          font-size: 16px;
        }
        .value {
          margin-top: 5px;
          display: flex;
          align-items: center;
          font-size: 22px;
          font-weight: bold;
          color: #ff6600;
          .unit {
            margin-left: 5px;
            font-weight: lighter;
            font-size: 14px;
          }
        }
      }
    }
  }
  .chart-container {
    .chart-item {
      display: flex;
      border-bottom: 1px solid #f0f2f5;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      &:last-of-type {
        border-bottom: none;
      }
      .text-box-container {
        display: flex;
        .text-box {
          display: inline-flex;
          background: #f4f9ff;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 10px 20px;
          margin: 20px;
          .label {
            display: flex;
            align-items: center;
            .sub-icon {
              font-size: 24px;
              margin-right: 5px;
            }
            .text {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 150px;
            }
          }
          .value {
            margin-left: 15px;
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 18px;
            .unit {
              margin-left: 5px;
              font-size: 12px;
            }
          }
        }
      }

      .charts {
        height: 400px;
        width: 100%;
        padding: 40px 0 40px 40px;
        position: relative;
        flex: 1;
        min-width: 0;
        display: flex;
        .charts-title {
          position: absolute;
          width: 1rem;
          border-left: 4px solid $blue;
          padding-left: 4px;
          color: $blue;
          left: 0;
        }
        .chart-left {
          width: 40%;
          margin-right: 5%;
        }
        .chart-right {
          flex: 1;
          min-width: 0;
        }
      }
    }
  }
}
</style>
