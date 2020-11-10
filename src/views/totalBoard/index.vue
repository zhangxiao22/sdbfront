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
        <div class="implement">
          <div class="block-title">执行情况</div>
          <el-row :gutter="15">
            <el-col :span="12">
              <div class="chart-item funnel-chart">
                <div class="chart-title">
                  <svg-icon icon-class="chart-funnel" />销售漏斗
                </div>
                <FunnelChart id="funnel"
                             :data="funnelData"
                             :height="300" />
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
                          style="width:500px;height:500px;"
                          :data="channelPieData" />
              </div>

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24"
                    style="margin-top:15px;">
              <div class="chart-title">
                <div class="chart-item">
                  <svg-icon icon-class="chart-funnel" />用例线索数
                  <ColumnChart id="usecase-bar"
                               meta-value="线索数量"
                               tooltip-title="线索数"
                               :data="usecaseBarData" />
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { FunnelChart, PieChart, ColumnChart } from '@/components/chart'

export default {
  components: {
    FunnelChart,
    PieChart,
    ColumnChart
  },
  data() {
    return {
      filterForm: {},
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
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
        { label: '简历筛选', value: 253 },
        { label: '初试人数', value: 151 },
        { label: '复试人数', value: 113 },
        { label: '录取人数', value: 87 },
        { label: '入职人数', value: 59 }
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
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90124 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90224 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90424 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90524 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90364 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90366 },
        { label: '用例在撒发阿迪舒服的撒发是6', value: 90328 }
      ].sort((a, b) => {
        return b.value - a.value
      })
    }
  },
  computed: {

  },
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {

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
  padding: 20px 20px 0;
  .base-info {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 0;
    background: #f4f9ff;
    border-radius: 10px;
    font-size: 14px;
    // box-sizing: 0 2px 10px rgba(0, 0, 0, 0.1);

    .item {
      display: flex;
      align-items: center;
      width: 33.3333%;
      justify-content: center;
      margin: 8px 0;
      .main-icon {
        font-size: 30px;
        margin-right: 15px;
      }
      .text {
        display: flex;
        align-items: center;
        .label {
          font-size: 14px;
        }
        .value {
          display: flex;
          align-items: center;
          font-size: 22px;
          font-weight: bold;
          margin-left: 15px;
          .unit {
            font-size: 14px;
            margin-left: 15px;
          }
        }
      }
    }
  }
  .chart-container {
    // 执行情况
    .implement {
      .block-title {
        font-weight: bold;
        color: $blue;
        padding-left: 5px;
        margin: 20px 0;
        display: inline-block;
        position: relative;
        z-index: 0;
        letter-spacing: 5px;
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

      .chart-item {
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        padding: 20px;
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .chart-title {
          margin-bottom: 20px;
          width: 100%;
          font-size: 14px;
          color: #888;
          .svg-icon {
            margin-right: 5px;
            color: #aaa;
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
