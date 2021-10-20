<template>
  <!-- 堆叠柱状图 -->
  <div :id="id"
       class="chart" />
</template>

<script>
import { Bar } from '@antv/g2plot'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    unit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
  },
  watch: {
    data: {
      handler() {
        this.chart.changeData(this.data)
      }
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.chart = new Bar(this.id, {
        data: this.data,
        theme: {
          colors10: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']
        },
        xField: 'value',
        yField: 'label',
        seriesField: 'type',
        isStack: true,
        xAxis: {
          grid: {
            line: {
              style: {
                lineDash: [2, 2]
              }
            }
          },
          label: {
            formatter: (v) => v + this.unit
          }
        }
        // tooltip: {
        //   showTitle: false,
        //   formatter: (datum) => {
        //     return {
        //       name: datum.label,
        //       value: datum.value + this.unit
        //     }
        //   }
        // }
        // label: {
        //   // 可手动配置 label 数据标签位置
        //   position: 'middle', // 'left', 'middle', 'right'
        //   // 可配置附加的布局方法
        //   layout: [
        //     // 柱形图数据标签位置自动调整
        //     { type: 'interval-adjust-position' },
        //     // 数据标签防遮挡
        //     { type: 'interval-hide-overlap' },
        //     // 数据标签文颜色自动调整
        //     { type: 'adjust-color' }
        //   ]
        // }
      })
      this.chart.render()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.chart {
  height: 100%;
  width: 100%;
}
</style>
