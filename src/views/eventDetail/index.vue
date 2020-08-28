<template>
  <div class="container">
    <div class="main-container shun-card">
      <div class="header">
        <el-page-header content="事件详情"
                        @back="goBack" />
        <el-divider class="header-divider" />
        <div class="main-info">
          <div class="status">进行中进行中</div>
          <div class="name-group">
            <div class="name">少儿医疗保险精准营销计划</div>
            <div class="time">
              <i class="el-icon-time"
                 style="margin-right:5px" />
              2020-01-01 ~ 2020-02-02
            </div>
          </div>
          <div class="button-group">
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批驳回</el-button>
          </div>
        </div>
      </div>

      <div class="base-info">
        <el-form ref="form"
                 class="base-form"
                 label-width="100px">
          <div class="title">事件信息</div>
          <el-form-item label="事件类别：">
            一般营销事件
          </el-form-item>
          <el-form-item label="事件类型：">
            拉新
          </el-form-item>
          <el-form-item label="发起部门：">
            零售部
          </el-form-item>
          <el-form-item label="事件描述：">
            <div class="event-desc">
              撒发大水发阿斯顿发顺丰撒的，撒发大水发阿斯顿发顺丰撒的撒发大水发阿斯顿发顺丰撒的，撒发大水发阿斯顿发顺丰撒的撒发大水发阿斯顿发顺丰撒的。
            </div>
          </el-form-item>
        </el-form>
        <el-form ref="form"
                 class="base-form"
                 label-width="100px">
          <div class="title">试点信息</div>
          <el-form-item label="试点时间：">
            2020-01-01 ～ 2020-03-03
          </el-form-item>
          <el-form-item label="试点范围：">
            <ul>
              <li>深圳支行营业部：50%</li>
              <li>大良支行营业部：50%</li>
            </ul>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-info">
        <el-table :data="newTableData"
                  :span-method="objectSpanMethod"
                  border
                  style="width: 100%;">
          <el-table-column prop="name"
                           label="客群名称"
                           width="180" />
          <el-table-column prop="ploy"
                           label="策略名称" />
          <el-table-column prop="amount1"
                           label="属性1" />
          <el-table-column prop="amount2"
                           label="属性2" />
          <el-table-column prop="amount3"
                           label="属性3" />
        </el-table>
      </div>
    </div>
    <div class="chart-container shun-card">
      <div class="funnel-chart-container">
        <div class="title">总目标XXXXX</div>
        <el-row class="funnel-chart"
                :gutter="20">
          <el-col :span="12">
            <FunnelChart id="chart-main"
                         :height="280" />
          </el-col>
          <el-col :span="12">
            <el-table :data="tableData2"
                      :row-class-name="tableRowClassName"
                      max-height="300"
                      border>
              <el-table-column prop="name"
                               label="目标" />
              <el-table-column prop="execute"
                               label="执行组" />
              <el-table-column prop="contrast"
                               label="对照组" />
            </el-table>
          </el-col>
        </el-row>
      </div>
      <el-divider />
      <div class="funnel-chart-container">
        <el-select v-model="funnelTitleValue"
                   class="title"
                   placeholder="请选择">
          <el-option v-for="item in funnelTitleOpt"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <el-row :gutter="20"
                class="funnel-chart">
          <el-col :span="12">
            <FunnelChart id="chart-sub"
                         :height="280" />
          </el-col>
          <el-col :span="12">
            <el-table :data="tableData2.slice(0,4)"
                      :row-class-name="tableRowClassName"
                      max-height="300"
                      border>
              <el-table-column prop="name"
                               label="目标" />
              <el-table-column prop="execute"
                               label="执行组" />
              <el-table-column prop="contrast"
                               label="对照组" />
            </el-table>
          </el-col>
        </el-row>
      </div>
      <el-divider />

      <div class="column-chart-container">
        <div class="title">对照组与策略</div>
        <el-form :inline="true"
                 :model="columnForm"
                 class="column-filter-form">
          <el-form-item label="范围:">
            <el-cascader v-model="columnForm.rangeValue"
                         style="width:300px;"
                         :options="rangeOpt"
                         :props="{ expandTrigger: 'hover' }" />
          </el-form-item>
          <el-form-item label="客群:">
            <el-select v-model="columnForm.region"
                       placeholder="请选择客群">
              <el-option label="客群一"
                         value="1" />
              <el-option label="客群二"
                         value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道:">
            <el-select v-model="columnForm.channel"
                       placeholder="请选择渠道">
              <el-option label="渠道一"
                         value="1" />
              <el-option label="渠道二"
                         value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="策略:">
            <el-select v-model="columnForm.ploy"
                       placeholder="请选择策略">
              <el-option label="策略一"
                         value="1" />
              <el-option label="策略二"
                         value="2" />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="padding:20px 20px 0;">
          <ColumnChart />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import FunnelChart from './components/FunnelChart'
import ColumnChart from './components/ColumnChart'

export default {
  components: {
    FunnelChart,
    ColumnChart
  },
  data() {
    return {
      funnelTitleOpt: [
        {
          value: '1',
          label: '小目标一个亿'
        }, {
          value: '2',
          label: '小目标2个亿'
        }, {
          value: '3',
          label: '小目标3个亿'
        }, {
          value: '4',
          label: '小目标4个亿'
        }, {
          value: '5',
          label: '小目标5个亿'
        }],
      funnelTitleValue: '1',
      tableData: [
        {
          id: '12987122',
          name: '客群1',
          ploy: '策略1',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '客群1',
          ploy: '策略2',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '客群1',
          ploy: '策略3',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '客群2',
          ploy: '策略4',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '客群2',
          ploy: '策略5',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          id: '12987126',
          name: '客群3',
          ploy: '策略6',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }
      ],
      tableData2: [
        {
          name: '目标1',
          execute: '123',
          contrast: '222'
        },
        {
          name: '目标1',
          execute: '123',
          contrast: '222'
        },
        {
          name: '目标1',
          execute: '123',
          contrast: '222'
        },
        {
          name: '目标1',
          execute: '123',
          contrast: '222'
        },
        {
          name: '目标1',
          execute: '123',
          contrast: '222'
        }, {
          name: '目标2',
          execute: '333',
          contrast: '333'
        }, {
          name: '目标3',
          execute: '443',
          contrast: '444'
        }, {
          name: '目标4',
          execute: '654',
          contrast: 'xxx'
        },
        {
          name: '目标4',
          execute: '654',
          contrast: 'xxx'
        },
        {
          name: '目标4',
          execute: '654',
          contrast: 'xxx'
        },
        {
          name: '目标4',
          execute: '654',
          contrast: 'xxx'
        }
      ],
      rangeOpt: [{
        value: '1',
        label: '全行推广下发',
        children: [{
          value: '1',
          label: '网点',
          children: [{
            value: '1',
            label: '大良街道'
          }]
        }]
      }],
      columnForm: {
        region: '',
        channel: '',
        ploy: '',
        rangeOpt: []
      }
    }
  },
  computed: {
    newTableData() {
      let name, index
      this.tableData.forEach((n, i) => {
        if (n.name === name) {
          this.tableData[index].mergeCount++
        } else {
          name = n.name
          index = i
          n.mergeCount = 1
        }
      })
      return this.tableData
    }
  },
  watch: {},
  methods: {
    goBack() {
      this.$router.push('/eventBoard')
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'name') {
        if (row.mergeCount) {
          return {
            rowspan: row.mergeCount,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'color-row'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.main-container {
  .header {
    padding: 16px;
    .header-divider {
      margin: 15px 0;
    }
    .main-info {
      display: flex;
      align-items: center;
      margin-left: -16px;
      height: 40px;
      .status {
        border-radius: 0 20px 20px 0;
        background-color: #e1f3d8;
        color: #67c23a;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 100%;
        font-weight: bold;
      }
      .name-group {
        margin-left: 10px;
        .name {
          font-weight: bold;
        }
        .time {
          color: #888;
          margin-top: 5px;
        }
      }
      .button-group {
        margin-left: auto;
      }
    }
  }
  .base-info {
    margin-top: 16px;
    padding: 16px 0;
    display: flex;
    justify-content: space-around;
    .base-form {
      width: 50%;
      max-width: 500px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 5px;
    }
    .title {
      font-weight: bold;
      position: relative;
      border-left: 4px solid $blue;
      margin: 0 0 10px 10px;
      padding-left: 5px;
      color: $blue;
    }
    .event-desc {
      line-height: 1.5;
      padding-top: 8px;
    }
  }
  .table-info {
    padding: 16px;
  }
  .chart-container {
    margin-top: 16px;
    padding: 20px;
    .funnel-chart-container {
      .title {
        font-weight: bold;
        margin-bottom: 20px;
      }
      .funnel-chart {
        display: flex;
        align-items: center;
        ::v-deep .el-table__header th {
          background: #f5f7fa;
        }
        ::v-deep .el-table__row {
          background: #fffaf2;
        }
        ::v-deep .el-table .color-row {
          background: #f8fcf5;
        }
      }
    }
    .column-chart-container {
      .title {
        font-weight: bold;
      }
      .column-filter-form {
        margin-top: 20px;
      }
    }
  }
}
</style>
